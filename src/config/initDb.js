const { pool, testConnection } = require("./database");
const bcrypt = require('bcryptjs');
require("dotenv").config();
testConnection();

const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                is_banned BOOLEAN DEFAULT FALSE,
                username VARCHAR(25) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role VARCHAR(20)  CHECK (role IN('superuser','etudiant','prof') )
                 )`
                )
       await pool.query(`
            CREATE TABLE IF NOT EXISTS modules (
                id SERIAL PRIMARY KEY,
                systeme VARCHAR(10) CHECK (systeme IN ('LMD', 'ING')) NOT NULL,
                anne VARCHAR (10) NOT NULL ,
                name VARCHAR(100) NOT NULL,
                specialité VARCHAR(100),
                semester INT CHECK (semester BETWEEN 1 AND 2),
                google_drive_link TEXT NOT NULL )`
            );
            await pool.query(`
            CREATE TABLE  IF NOT EXISTS reports (
              id SERIAL PRIMARY KEY,
              message TEXT NOT NULL,
             created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,        
              id_user INT,
              FOREIGN KEY (id_user) REFERENCES users(id)
            ) `);
        console.log(" les tables créées avec succès !");
    } catch (error) {
        console.error(" Erreur lors de la création des tables :");
    } 
};
const createSuperUser = async () => {
    const username = process.env.ADMIN_USERNAME;
    const plainPassword = process.env.ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
  
    try {
      // verifier si superuser existe déja
      const result = await pool.query("SELECT * FROM users WHERE role = 'superuser'");
      if (result.rows.length > 0) {
        console.log('Superuser déjà existant');
        return;
      }
  
      // insérer superuser
      await pool.query(
        "INSERT INTO users (username,password, role) VALUES ($1, $2, $3)",
        [username, hashedPassword, 'superuser']
      );
  
      console.log('superuser cree avec succès ');
    } catch (err) {
      console.error('Erreur lors de la création du superuser :');
    }
  };
 
  const InitDb = async () => {
    try {
        await createTables();
        await createSuperUser();
    } catch (err) {
        console.error(" Erreur lors de l'initialisation :");
    } finally {
        pool.end(); 
    }
};

InitDb()