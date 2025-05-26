
const { pool } = require('../config/database');

const addreport =async (req, res) => {
    try {
      const { message } = req.body;
      
      // Get the user's IP address
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      
      // Check if IP is banned
      const bannedCheck = await pool.query(
        'SELECT * FROM reports WHERE ip_address = $1 AND is_banned = TRUE LIMIT 1',
        [ip]
      );
      
      if (bannedCheck.rows.length > 0) {
        return res.status(403).json({ error: 'This IP address has been banned from submitting reports' });
      }
      
      // Insert the report into the database
      const result = await pool.query(
        'INSERT INTO reports (message, ip_address) VALUES ($1, $2) RETURNING id',
        [message, ip]
      );
      
      res.status(201).json({ 
        success: true, 
        message: 'Report submitted successfully',
        id: result.rows[0].id
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
        'SELECT id, message, ip_address, created_at, is_banned FROM reports ORDER BY created_at DESC'
      );
      
      res.json(rows);
    } catch (error) {
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
      'UPDATE reports SET is_banned = TRUE WHERE id = $1 RETURNING ip_address',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    // Update all reports from the same IP address
    const ip = result.rows[0].ip_address;
    await pool.query(
      'UPDATE reports SET is_banned = TRUE WHERE ip_address = $1',
      [ip]
    );
    
    res.json({ 
      success: true, 
      message: `IP address ${ip} has been banned from submitting reports`
    });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ error: 'Server error while banning user' });
  }
 }
const deban = async (req,res)=>{
  try {
    const { id } = req.params;
    
    // Get the IP address from the report ID
    const reportResult = await pool.query(
      'SELECT ip_address FROM reports WHERE id = $1',
      [id]
    );
    
    if (reportResult.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    const ip = reportResult.rows[0].ip_address;
    
    // Unban all reports from this IP address
    await pool.query(
      'UPDATE reports SET is_banned = FALSE WHERE ip_address = $1',
      [ip]
    );
    
    res.json({ 
      success: true, 
      message: `IP address ${ip} has been unbanned and can now submit reports again`
    });
  } catch (error) {
    console.error('Error unbanning user:', error);
    res.status(500).json({ error: 'Server error while unbanning user' });
  }
}
const delet = async (req,res)=>{
  try {
    const { id } = req.params;
    
    // Delete the specific report
    const result = await pool.query(
      'DELETE FROM reports WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
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
    const result = await pool.query('DELETE FROM reports RETURNING COUNT(*)');
    
    res.json({ 
      success: true, 
      message: `All reports cleared successfully. ${result.rowCount} reports were deleted.`
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
      SELECT 
        ip_address,
        COUNT(*) as report_count,
        MAX(created_at) as last_report_date,
        MIN(created_at) as first_report_date
      FROM reports 
      WHERE is_banned = TRUE 
      GROUP BY ip_address 
      ORDER BY last_report_date DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching blacklist:', error);
    res.status(500).json({ 
      error: 'Server error while fetching blacklist' 
    });
  }
}


module.exports ={addreport,getreports,ban,deban,delet,deletall,blacklsit}