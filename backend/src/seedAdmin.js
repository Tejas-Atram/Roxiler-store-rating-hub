import bcrypt from 'bcryptjs';
import pool from './config/db.js';

const seedAdmin = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);
    
    await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES ('System Admin', 'admin@example.com', ?, 'Admin HQ', 'ADMIN')",
      [hashedPassword]
    );
    
    console.log('Admin user seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed', error);
    process.exit(1);
  }
};

seedAdmin();