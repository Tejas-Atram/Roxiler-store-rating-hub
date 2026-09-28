import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [[userCount]] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [[storeCount]] = await pool.query('SELECT COUNT(*) as total FROM stores');
    const [[ratingCount]] = await pool.query('SELECT COUNT(*) as total FROM ratings');

    res.json({
      totalUsers: userCount.total,
      totalStores: storeCount.total,
      totalRatings: ratingCount.total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortField = 'name', sortOrder = 'ASC' } = req.query;
    let query = `
      SELECT 
        u.id, u.name, u.email, u.address, u.role,
        IF(u.role = 'STORE_OWNER', AVG(r.rating), NULL) as store_rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const queryParams = [];

    if (name) {
      query += ' AND u.name LIKE ?';
      queryParams.push(`%${name}%`);
    }
    if (email) {
      query += ' AND u.email LIKE ?';
      queryParams.push(`%${email}%`);
    }
    if (address) {
      query += ' AND u.address LIKE ?';
      queryParams.push(`%${address}%`);
    }
    if (role) {
      query += ' AND u.role = ?';
      queryParams.push(role);
    }

    query += ' GROUP BY u.id, u.name, u.email, u.address, u.role';

    const allowedSortFields = ['name', 'email', 'address', 'role', 'store_rating'];
    const safeSortField = allowedSortFields.includes(sortField) ? sortField : 'name';
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${safeSortField} ${safeSortOrder}`;

    const [users] = await pool.query(query, queryParams);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};