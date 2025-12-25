import mysql from 'mysql2/promise';

// Database configuration - change these values to match your MySQL user and database
const dbConfig: any = {
    host: process.env.MYSQL_HOST_IP,
    user: process.env.MTSQL_USER, // CHANGE THIS to your MySQL username
    password: process.env.MYSQL_PASS || '', // Get from .env file or use empty string
    database: process.env.MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Remove password if empty
if (!dbConfig.password) {
    delete dbConfig.password;
}

const pool = mysql.createPool(dbConfig);

export default pool;

