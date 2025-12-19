// Use our pre-configured Prisma client from lib/prisma.ts
// We need to import it as a module, so we'll use a workaround for the path
import { createRequire } from 'module'
const require = createRequire(import.meta.url || 'file://' + __filename)
const { prisma } = require('../src/lib/prisma.ts')
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { phone: '9800000000' },
    update: {},
    create: {
      phone: '9800000000',
      email: 'admin@kistclinic.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
      isActive: true,
      isStaff: true,
    },
  })

  console.log('✅ Admin user created:')
  console.log('   Phone: 9800000000')
  console.log('   Password: admin123')
  console.log('   Email:', admin.email)

  // Create a test patient user
  const patientPassword = await bcrypt.hash('patient123', 10)

  const patient = await prisma.user.upsert({
    where: { phone: '9811111111' },
    update: {},
    create: {
      phone: '9811111111',
      email: 'patient@example.com',
      name: 'Test Patient',
      address: 'Kathmandu, Nepal',
      password: patientPassword,
      role: 'patient',
      isActive: true,
      isStaff: false,
    },
  })

  console.log('✅ Test patient user created:')
  console.log('   Phone: 9811111111')
  console.log('   Password: patient123')
  console.log('   Email:', patient.email)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
