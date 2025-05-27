
const { pool } = require('../config/database');

const addreport =async (req, res) => {
    try {
      
      const { message,id_user } = req.body;

      if (!message || !id_user) {
      return res.status(400).json({ 
        success : false,
        error: 'Message and id_user are required.'
       });
    }

      // Check if id-user is banned

     // const bannedCheck = await pool.query(
       // 'SELECT * FROM reports WHERE id_user = $1 AND is_banned = TRUE LIMIT 1',
       // [id_user]
      //);
      
      //if (bannedCheck.rows.length > 0) {
       // return res.status(403).json({ error: 'This users has been banned from submitting reports' });
      //}
      
      // Insert the report into the database
       const result = await pool.query(
      'INSERT INTO reports (message, id_user) VALUES ($1, $2)',
      [message, id_user]
    );
      res.status(201).json({ 
        success: true, 
        message: 'Report submitted successfully'
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      res.status(500).json({ error: 'Server error while submitting report' });
    }
  }
 
  //// GET endpoint for admin to view reports 
  const getreports=async (req, res) => {
    try {
      // Fetch all reports, ordered by newest first
      const { rows } = await pool.query(
        'SELECT * FROM reports ORDER BY created_at DESC'
      );
       res.status(200).json({
        success: true,
      reports: rows
      });
    }
  
     catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ error: 'Server error while fetching reports' });
    }
  }

  
// PUT endpoint for admin to ban a user by report I
 const ban = async (req, res) => {
  try {
    const { id } = req.params;
  
    // Update the banned status for the given report ID
    const result = await pool.query(
      'UPDATE users SET is_banned = TRUE WHERE id = $1  ',
      [id]
    );
    
    //if (result.rows.length === 0) {
    //  return res.status(404).json({ error: 'user with that id not found' });
    //}
    
    
    res.json({ 
      success: true, 
      message: `user has been banned from submitting reports`
    });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({
      success : false,
      error: 'Server error while banning user' });
  }
 }
const deban = async (req,res)=>{
  try {
    const { id } = req.params;
  
    // Unban all reports from this IP address
    await pool.query(
      'UPDATE users SET is_banned = FALSE WHERE id = $1',
      [id]
    );
    
    res.json({ 
      success: true, 
      message: `user has been unbanned and can now submit reports again`
    });
  } catch (error) {
    console.error('Error unbanning user:', error);
    res.status(500).json({ 
      success : false,
      error: 'Server error while unbanning user' });
  }
}
const delet = async (req,res)=>{
  try {
    const { id } = req.params;
    
    // Delete the specific report
    const result = await pool.query(
      'DELETE FROM reports WHERE id = $1',
      [id]
    );
    

    
    res.json({ 
      success: true, 
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Server error while deleting report' });
  }
}
const deletall  = async (req,res)=>{
try {
    // Delete all reports from the database
    const result = await pool.query('DELETE FROM reports');
    
    res.json({ 
      success: true, 
      message: `All reports cleared successfully.`
    });
  } catch (error) {
    console.error('Error clearing all reports:', error);
    res.status(500).json({ error: 'Server error while clearing reports' });
  }
}
const blacklsit = async (req,res)=>{
 try {
    // Get unique banned IP addresses with their report count and latest report date
    const { rows } = await pool.query(`
      SELECT * FROM users WHERE is_banned = TRUE
    `);
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ 
        success : false,
      error: 'Server error while fetching blacklist' 
    });
  }
}


module.exports ={addreport,getreports,ban,deban,delet,deletall,blacklsit}