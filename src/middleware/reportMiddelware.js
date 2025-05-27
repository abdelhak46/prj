const validateReport = (req, res, next) => {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required' 
    });
    }
    
    // Check message length (between 50 and 500 characters)
    if (message.length < 50 || message.length > 500) {
      return res.status(400).json({ 
        error: 'Message must be between 50 and 500 characters' 
      });
      
    }
    
    next();
  };
  module.exports = validateReport;