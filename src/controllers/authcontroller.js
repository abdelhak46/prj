const bcrypt= require('bcryptjs');
const { pool } = require("../config/database");
const jwt = require('jsonwebtoken');
require("dotenv").config(); 
// registe newuser and login auto 
   const  registerUser = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        //  Vérifier si aslan rah msajal( name est déjà utilisé)
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (result.rows.length > 0) {
            return res.status(400).json({
                success :false,
                 message: "Cet username est déjà utilisé."
                 });
        }
        //  chifrage le mot de passe

        const hashedPassword = await bcrypt.hash(password, 10);

        //  Ajouter l'utilisateur avec le rôle "visiteur" par défaut
        const newUserResult = await pool.query(
            "INSERT INTO users (username, password,role) VALUES ($1, $2, $3) RETURNING *",
            [username, hashedPassword,role]
        );
        const newUser = newUserResult.rows[0];
        const token = jwt.sign(
            { id: newUser.id,
                username: newUser.username,
                 role: newUser.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        res.status(201).json({
            success :true,
            message: "Compte créé avec succès !",
            user: newUser,
            token
        });
    } catch (error) {
        res.status(500).json({ 
            success :false,
            message: "Failed to register user"
        });
    }
}
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM user WHERE id = $1', [id]);

        return res.status(200).json({
            success: true,
            message: "Utilisateur supprimé avec succès"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression de l'utilisateur"
        });
    }
};
    //login controller
    const loginUser = async (req, res) => {
        const { username, password } = req.body;
    
        try {
            //  Vérifier si l'utilisateur existe (rah msajal )
            const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
            const user = result.rows[0];
    
            if (!user) {
                return res.status(404).json({
                    success :false,
                    message: "utilisateur non trouvé ,il faut  insecreption"
                 });
            }
    
            //  Vérifier le mot de passe
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success :false,
                     message: "Mot de passe incorrect"
                     });
            }
            //  Générer un token JWT avec le role
            const token = jwt.sign(
                { id: user.id,
                    username: user.username,
                     role: user.role }, 
                process.env.JWT_SECRET, 
                { expiresIn: "1h" }
            );
            res.json({
                success :true,
                message: "Connexion réussie ",
                token,
            });
        } catch (error) {
            console.log(error);
            
            res.status(500).json({
                success :false,
                message: "Erreur" 
                
            });
        }
    };


    module.exports = { registerUser, loginUser,deleteUser };

