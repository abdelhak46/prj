const { pool } = require('../config/database');
const validateReport = async (req, res, next) => {
  const { message, id_user } = req.body;

  // verifie que le message est present
  if (!message) {
    return res.status(400).json({
       error: 'Message is required'
      });
  }

  // vrrifie la longueur du message
  if (message.length < 50 || message.length > 500) {
    return res.status(400).json({ 
      error: 'Message must be between 50 and 500 characters' 
    });
  }

  // verifie que l'id utilisateur 
  if (!id_user) {
    return res.status(400).json({
       error: 'User ID is required' 
      });
  }

  try {
    // verifie si l'utilisateur est banni
    const result = await pool.query(
      'SELECT is_banned FROM users WHERE id = $1',
      [id_user]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    const { is_banned } = result.rows[0];

    if (is_banned) {
      return res.status(403).json({ 
        error: 'This user has been banned from submitting reports' 
      });
    }

    // aucun problem
    next();

  } catch (error) {
    console.error('Error validating report:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = validateReport;
