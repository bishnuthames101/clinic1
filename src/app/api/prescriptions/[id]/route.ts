import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, requireAdmin } from "@/lib/auth"
import { z } from "zod"

// GET /api/prescriptions/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const { id } = await params
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            name: true,
            phone: true,
            email: true,
          }
        }
      }
    })

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      )
    }

    // Check ownership
    if (prescription.patientId !== user!.id && user!.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    return NextResponse.json(prescription)
  } catch (error) {
    console.error("Error fetching prescription:", error)
    return NextResponse.json(
      { error: "Failed to fetch prescription" },
      { status: 500 }
    )
  }
}

// PATCH /api/prescriptions/[id] - Update status (admin only)
const updatePrescriptionSchema = z.object({
  status: z.enum(["pending", "verified", "rejected"]).optional(),
  notes: z.string().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAdmin()
    if (error) return error

    const { id } = await params
    const body = await req.json()
    const validated = updatePrescriptionSchema.parse(body)

    const prescription = await prisma.prescription.update({
      where: { id },
      data: validated,
    })

    return NextResponse.json(prescription)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      )
    }

    console.error("Error updating prescription:", error)
    return NextResponse.json(
      { error: "Failed to update prescription" },
      { status: 500 }
    )
  }
}

// DELETE /api/prescriptions/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const { id } = await params
    // Get prescription to check ownership
    const existing = await prisma.prescription.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      )
    }

    // Check ownership
    if (existing.patientId !== user!.id && user!.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    // TODO: Delete file from Supabase Storage

    await prisma.prescription.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Prescription deleted successfully" })
  } catch (error) {
    console.error("Error deleting prescription:", error)
    return NextResponse.json(
      { error: "Failed to delete prescription" },
      { status: 500 }
    )
  }
}
