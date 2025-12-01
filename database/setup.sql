-- Create Database
CREATE DATABASE IF NOT EXISTS pharmacy_db;
USE pharmacy_db;

-- Drop existing tables if they exist (to ensure clean setup)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS medicines;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS admins;

-- Admins Table
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medicines Table
CREATE TABLE medicines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    delivery_address VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    medicine_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);

-- Insert Default Admin
INSERT INTO admins (username, password) VALUES ('admin', 'admin123');

-- Insert Sample Medicines
INSERT INTO medicines (name, category, price, stock, description) VALUES
('Paracetamol', 'Pain Relief', 5.99, 100, 'Effective pain and fever relief'),
('Ibuprofen', 'Pain Relief', 7.99, 80, 'Anti-inflammatory pain reliever'),
('Amoxicillin', 'Antibiotic', 12.99, 50, 'Broad-spectrum antibiotic'),
('Cetirizine', 'Allergy', 8.99, 60, 'Antihistamine for allergies'),
('Omeprazole', 'Digestive', 15.99, 40, 'Reduces stomach acid'),
('Aspirin', 'Pain Relief', 4.99, 120, 'Pain relief and blood thinner'),
('Metformin', 'Diabetes', 18.99, 30, 'Type 2 diabetes medication'),
('Lisinopril', 'Blood Pressure', 22.99, 25, 'ACE inhibitor for hypertension'),
('Vitamin C', 'Supplement', 9.99, 150, 'Immune system support'),
('Cough Syrup', 'Cold & Flu', 11.99, 70, 'Relieves cough symptoms');

-- Insert Sample Customer
INSERT INTO customers (username, email, phone, address, password) VALUES
('john', 'john@example.com', '1234567890', 'Kathmandu', 'password123');
