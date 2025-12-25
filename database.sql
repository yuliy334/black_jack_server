-- Create database
CREATE DATABASE IF NOT EXISTS blackjack_db;

-- Create user (change 'blackjack_user' and 'your_password' to your preferred username and password)
CREATE USER IF NOT EXISTS 'blackjack_user'@'localhost' IDENTIFIED BY 'your_password';

-- Grant privileges to the user for the database
GRANT ALL PRIVILEGES ON blackjack_db.* TO 'blackjack_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Use the database
USE blackjack_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
