const { pool } = require('../config/database');
const getProfs = async (req, res) => {
  try {
    
  
    const result = await pool.query(
      `SELECT * FROM users WHERE role= 'prof'`
    );
    
    res.json({ 
      success: true, 
      profs: result.rows
    });
  } catch (error) {
   
     
    res.status(500).json({
      success : false,
      error: 'Server error' });
  }
 }
module.exports ={getProfs}