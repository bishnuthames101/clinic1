import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
import { z } from "zod"

// GET /api/pharmacy-orders - Get user's orders
export async function GET(req: NextRequest) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const where = user!.role === "admin" ? {} : { patientId: user!.id }

    const orders = await prisma.pharmacyOrder.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          }
        },
        medicine: true,
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching pharmacy orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch pharmacy orders" },
      { status: 500 }
    )
  }
}

// POST /api/pharmacy-orders - Create order
const createOrderSchema = z.object({
  medicineId: z.string().optional(),
  medicineName: z.string().optional(),
  quantity: z.number().int().positive().default(1),
  pricePerUnit: z.number().positive().optional(),
  deliveryAddress: z.string().optional(),
  paymentMethod: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const body = await req.json()
    const validated = createOrderSchema.parse(body)

    let medicineId = validated.medicineId
    let pricePerUnit = validated.pricePerUnit

    // If medicine name provided, lookup medicine
    if (!medicineId && validated.medicineName) {
      const medicine = await prisma.medicine.findFirst({
        where: {
          name: { equals: validated.medicineName, mode: "insensitive" }
        }
      })

      if (!medicine) {
        return NextResponse.json(
          { error: "Medicine not found" },
          { status: 404 }
        )
      }

      medicineId = medicine.id
      pricePerUnit = parseFloat(medicine.price.toString())
    }

    if (!medicineId) {
      return NextResponse.json(
        { error: "Medicine ID or name is required" },
        { status: 400 }
      )
    }

    // Get medicine price if not provided
    if (!pricePerUnit) {
      const medicine = await prisma.medicine.findUnique({
        where: { id: medicineId }
      })

      if (!medicine) {
        return NextResponse.json(
          { error: "Medicine not found" },
          { status: 404 }
        )
      }

      pricePerUnit = parseFloat(medicine.price.toString())
    }

    // Calculate total
    const totalAmount = pricePerUnit * validated.quantity

    const order = await prisma.pharmacyOrder.create({
      data: {
        patientId: user!.id,
        medicineId,
        quantity: validated.quantity,
        pricePerUnit,
        totalAmount,
        deliveryAddress: validated.deliveryAddress || user!.address,
        paymentMethod: validated.paymentMethod,
        status: "pending",
        paymentStatus: "pending",
      },
      include: {
        medicine: true,
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      )
    }

    console.error("Error creating pharmacy order:", error)
    return NextResponse.json(
      { error: "Failed to create pharmacy order" },
      { status: 500 }
    )
  }
}
