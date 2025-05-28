const { pool } = require('../config/database');
const { uploadToDrive } = require('../services/googleDriveService');

const importToDrive = async (req, res) => {
  try {
    const { anne, name,category } = req.body;
    const specialité = req.body.specialité || req.body['specialitÃ©'] ;

   
    //   nchof asque b3atalna ga3 li nas7a9oh 
    if (!anne || !name || !category || !req.file) {
      return res.status(400).json({ message: "Champs manquants ou fichier " });
    }

    // récupiré le lien Google drive depuis la base de données
    const result = await pool.query(`
      SELECT google_drive_link FROM modules 
      WHERE anne = $1 AND name = $2 AND specialité = $3
    `, [ anne, name, specialité]);

    const link = result.rows[0]?.google_drive_link;

    if (!link) {
      return res.status(404).json({ 
        success: false,
        message: "lien google drive non trouvé "
      });
    }

    // Upload du fichier dans google-drive
    const uploadResult = await uploadToDrive(req.file, link,category);


    res.status(200).json({
      success:true,
      message: 'fichier uploadé avec succès ',
    });

  } catch (error) {
    console.log('erreur lors importToDrive', error);
    res.status(500).json({
      success: false,
      message: "erreur lors de l'import du fichier",
    });
  }
};

module.exports = { importToDrive };