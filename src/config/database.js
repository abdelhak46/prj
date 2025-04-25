
require("dotenv").config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});
const testConnection = async () => {
    try {
         await pool.connect();
        console.log(" Database connected successfully"); 
    } catch (err) {
        console.error(" Database connection failed");
    }
  };

module.exports = {pool,testConnection};