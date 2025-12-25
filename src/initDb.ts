import pool from './db';

export async function initializeDatabase() {
    try {
        // Create users table if it doesn't exist
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Database table initialized successfully');
    } catch (error: any) {
        console.error('Error initializing database:', error.message);
        throw error;
    }
}

