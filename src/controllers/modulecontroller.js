const { pool } = require("../config/database");
const isSuperUser = require("../middleware/SuperUserMiddleware"); // Importer le middleware

//  Ajouter un module (superuser )
const createModule = async (req, res) => {
    const {name,systeme,anne,specialité,semester,google_drive_link} = req.body;


   try {
        const newModule = await pool.query(
            `INSERT INTO modules (name,systeme,anne,specialité,semester,google_drive_link)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [name,systeme,anne,specialité,semester,google_drive_link]
        );

        res.status(201).json({
            success: true,
            message: "Module ajouté avec succès !",
            module: newModule.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'ajout du module.",
        });
    }
};

//  Supprimer un module (superuser uniquement)
const deleteModuleByID = async (req, res) => {
    const { id } = req.params;

    try {
        // Supprimer le module
        const result = await pool.query("DELETE FROM modules WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Module non trouvé.",
            });
        }

        res.json({
            success: true,
            message: "Module supprimé avec succès.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression du module.",
        });
    }
};
//  Récupérer tous les modules
const getModules = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM modules ORDER BY systeme,anne,semester");
        console.log(result)
        res.json({
            success: true,
            modules: result.rows,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des modules.",
        });
    }
};
    const searchModules = async (req, res) => {
        const { query } = req.query;  // le mot rechercher
    
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Aucun terme de recherche fourni",
            });
        }
    try {
        // Recherche des modules par nom 
        const result = await pool.query(
            "SELECT name ,google_drive_link  FROM modules WHERE name ILIKE $1 LIMIT 10",  //ya3tik 10 7adah
            [`%${query}%`]  
        );

        res.json({
            success: true,
            modules: result.rows,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la recherche des modules.",
        });
    }
}
const getDistinctSpecialites = async (req, res) => {
    try {
      const result = await pool.query('SELECT DISTINCT specialité FROM modules');
      res.json({ success: true, 
        specialites: result.rows});
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des spécialités.",
      });
    }
  };
module.exports = { createModule, getModules, deleteModuleByID,getDistinctSpecialites,searchModules};