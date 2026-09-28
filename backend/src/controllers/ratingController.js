import pool from '../config/db.js';

export const submitRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
      [userId, storeId, rating]
    );

    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStoreOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [stores] = await pool.query('SELECT id, name FROM stores WHERE owner_id = ?', [ownerId]);
    if (stores.length === 0) {
      return res.status(404).json({ message: 'No stores found for this owner' });
    }

    const storeId = stores[0].id;

    const [[avgResult]] = await pool.query(
      'SELECT COALESCE(AVG(rating), 0) as averageRating, COUNT(id) as totalRatings FROM ratings WHERE store_id = ?',
      [storeId]
    );

    const [distribution] = await pool.query(
      `SELECT rating, COUNT(*) as count 
       FROM ratings 
       WHERE store_id = ? 
       GROUP BY rating 
       ORDER BY rating DESC`,
      [storeId]
    );

    const [raters] = await pool.query(
      `SELECT u.name, u.email, r.rating, r.owner_reply, r.created_at, r.updated_at, r.id as rating_id
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [storeId]
    );

    res.json({
      store: stores[0],
      averageRating: avgResult.averageRating,
      totalRatings: avgResult.totalRatings,
      ratingDistribution: distribution,
      raters: raters
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const replyToRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { reply } = req.body;
    const ownerId = req.user.id;

    const [ratings] = await pool.query(
      `SELECT r.id FROM ratings r 
       JOIN stores s ON r.store_id = s.id 
       WHERE r.id = ? AND s.owner_id = ?`,
      [ratingId, ownerId]
    );

    if (ratings.length === 0) {
      return res.status(403).json({ message: 'Unauthorized to reply to this rating' });
    }

    await pool.query(
      'UPDATE ratings SET owner_reply = ?, replied_at = CURRENT_TIMESTAMP WHERE id = ?',
      [reply, ratingId]
    );

    res.json({ message: 'Reply posted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};