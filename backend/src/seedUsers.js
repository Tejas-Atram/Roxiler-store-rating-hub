import bcrypt from 'bcryptjs';
import pool from './config/db.js';

const seedUsersAndOwners = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    // Hashing a default password that meets all your validation rules
    const defaultPassword = await bcrypt.hash('Password@123', salt);

    console.log('Starting to seed accounts...');

    // 1. Seed 10 Store Owners
    for (let i = 1; i <= 10; i++) {
      // Name is padded to ensure it exceeds the 20-character minimum
      const name = `Store Owner Number ${i.toString().padStart(2, '0')} Account`; 
      const email = `owner${i}@example.com`;
      const address = `Commercial District, Block ${i}`;
      
      // Using INSERT IGNORE to prevent crashing if you run the script twice
      await pool.query(
        "INSERT IGNORE INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, 'STORE_OWNER')",
        [name, email, defaultPassword, address]
      );
    }
    console.log('10 Store Owners added successfully.');

    // 2. Seed 10 Normal Users
    for (let i = 1; i <= 10; i++) {
      const name = `Normal User Number ${i.toString().padStart(2, '0')} Account`; 
      const email = `user${i}@example.com`;
      const address = `Residential Area, Street ${i}`;
      
      await pool.query(
        "INSERT IGNORE INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, 'USER')",
        [name, email, defaultPassword, address]
      );
    }
    console.log('10 Normal Users added successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedUsersAndOwners();