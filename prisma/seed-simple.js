const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://bishnu:bishnu12@127.0.0.1:5432/clinic?sslmode=disable'
});

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Generate password hashes
    const adminPassword = await bcrypt.hash('admin123', 10);
    const patientPassword = await bcrypt.hash('patient123', 10);

    // Insert admin user
    await pool.query(`
      INSERT INTO users (id, phone, email, name, password, role, is_active, is_staff, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      ON CONFLICT (phone) DO UPDATE SET
        password = EXCLUDED.password,
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active,
        is_staff = EXCLUDED.is_staff
    `, [
      'admin-' + Date.now(),
      '9800000000',
      'admin@kistclinic.com',
      'Admin User',
      adminPassword,
      'admin',
      true,
      true
    ]);

    console.log('✅ Admin user created/updated:');
    console.log('   Phone: 9800000000');
    console.log('   Password: admin123');
    console.log('   Email: admin@kistclinic.com');

    // Insert test patient
    await pool.query(`
      INSERT INTO users (id, phone, email, name, address, password, role, is_active, is_staff, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      ON CONFLICT (phone) DO UPDATE SET
        password = EXCLUDED.password,
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        address = EXCLUDED.address,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active,
        is_staff = EXCLUDED.is_staff
    `, [
      'patient-' + Date.now(),
      '9811111111',
      'patient@example.com',
      'Test Patient',
      'Kathmandu, Nepal',
      patientPassword,
      'patient',
      true,
      false
    ]);

    console.log('✅ Test patient created/updated:');
    console.log('   Phone: 9811111111');
    console.log('   Password: patient123');
    console.log('   Email: patient@example.com');

    console.log('\n🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
