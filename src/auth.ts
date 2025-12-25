import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './db';

const JWT_SECRET = 'your-secret-key-change-in-production';

export async function registerUser(username: string, password: string) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        return { success: true, message: 'Registration successful' };
    } catch (error: any) {
        console.error('Database error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'User already exists' };
        }
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return { success: false, message: 'Database table not found. Please create the database first.' };
        }
        return { success: false, message: 'Registration error: ' + error.message };
    }
}

export async function loginUser(username: string, password: string) {
    try {
        const [rows]: any = await pool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        
        if (rows.length === 0) {
            return { success: false, message: 'Invalid username or password' };
        }
        
        const user = rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return { success: false, message: 'Invalid username or password' };
        }
        
        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: '7d'
        });
        
        return { success: true, token, username: user.username };
    } catch (error: any) {
        console.error('Login error:', error);
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return { success: false, message: 'Database table not found. Please create the database first.' };
        }
        return { success: false, message: 'Login error: ' + error.message };
    }
}

