import pool from '../config/db.js';

export const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    const [existingStore] = await pool.query('SELECT id FROM stores WHERE email = ?', [email]);
    if (existingStore.length > 0) {
      return res.status(400).json({ message: 'Store email already exists' });
    }

    const [result] = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id || null]
    );

    res.status(201).json({ message: 'Store created successfully', storeId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStores = async (req, res) => {
  try {
    const { name, address, sortField = 'name', sortOrder = 'ASC' } = req.query;
    
    let query = `
      SELECT 
        s.id, s.name, s.email, s.address, s.owner_id,
        COALESCE(AVG(r.rating), 0) as average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const queryParams = [];

    if (name) {
      query += ' AND s.name LIKE ?';
      queryParams.push(`%${name}%`);
    }
    if (address) {
      query += ' AND s.address LIKE ?';
      queryParams.push(`%${address}%`);
    }

    query += ' GROUP BY s.id, s.name, s.email, s.address, s.owner_id';

    const allowedSortFields = ['name', 'email', 'address', 'average_rating'];
    const safeSortField = allowedSortFields.includes(sortField) ? sortField : 'name';
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${safeSortField} ${safeSortOrder}`;

    const [stores] = await pool.query(query, queryParams);

    if (req.user && req.user.role === 'USER') {
      const [userRatings] = await pool.query(
        'SELECT store_id, rating FROM ratings WHERE user_id = ?',
        [req.user.id]
      );
      
      const ratingMap = userRatings.reduce((acc, curr) => {
        acc[curr.store_id] = curr.rating;
        return acc;
      }, {});

      const storesWithUserRating = stores.map(store => ({
        ...store,
        user_submitted_rating: ratingMap[store.id] || null
      }));
      return res.json(storesWithUserRating);
    }

    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};