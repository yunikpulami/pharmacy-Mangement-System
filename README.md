# Pharmacy Management System

A complete pharmacy management system with separate admin and customer interfaces.

## Features

### Admin Features
- CRUD operations on medicines
- Manage customers
- View sales history
- Monitor stock levels
- Generate reports (total sales, customers, medicines, low stock alerts)

### Customer Features
- Browse available medicines with stock status
- Search medicines by name or category
- Fully functional shopping cart with:
  - Add/remove items
  - Increase/decrease quantity
  - Real-time stock validation
  - Cart persistence (saved in browser)
- Complete payment gateway with multiple options:
  - Cash on Delivery
  - Credit/Debit Card (with validation)
  - UPI Payment
  - Digital Wallet (Paytm, PhonePe, Google Pay, Amazon Pay)
- Order summary before payment
- Delivery address management
- View order history
- Success notifications and confirmations

## Technology Stack
- Frontend: HTML, CSS, JavaScript
- Backend: PHP
- Database: MySQL

## Setup Instructions

### 1. Database Setup
1. Open phpMyAdmin or MySQL command line
2. Import the database file: `database/setup.sql`
3. This will create the database `pharmacy_db` with all required tables and sample data

**If you already have the database:**
- Run `database/update.sql` to add the delivery_address column

### 2. Configure Database Connection
Edit `php/config.php` if needed:
```php
$host = 'localhost';
$dbname = 'pharmacy_db';
$username = 'root';
$password = '';
```

### 3. Run the Application
1. Place all files in your web server directory (e.g., `htdocs` for XAMPP)
2. Start Apache and MySQL servers
3. Open browser and navigate to: `http://localhost/pharmacy-system/`

## Default Login Credentials

### Admin
- Username: `admin`
- Password: `admin123`

### Customer (Sample)
- Username: `john`
- Password: `password123`

Or register a new customer account.

## Project Structure
```
pharmacy-system/
├── index.html          # Login page
├── register.html       # Customer registration
├── admin.html          # Admin dashboard
├── customer.html       # Customer dashboard
├── css/
│   └── style.css       # All styles
├── js/
│   ├── login.js        # Login functionality
│   ├── register.js     # Registration functionality
│   ├── admin.js        # Admin operations
│   └── customer.js     # Customer operations
├── php/
│   ├── config.php      # Database configuration
│   ├── login.php       # Login handler
│   ├── register.php    # Registration handler
│   ├── get_medicines.php
│   ├── save_medicine.php
│   ├── delete_medicine.php
│   ├── get_customers.php
│   ├── delete_customer.php
│   ├── get_orders.php
│   ├── get_all_orders.php
│   ├── process_order.php
│   └── get_reports.php
└── database/
    └── setup.sql       # Database schema and sample data
```

## Usage

### For Customers
1. Register a new account or login with existing credentials
2. Browse medicines and add to cart
3. Proceed to checkout and make payment
4. View order history

### For Admin
1. Login with admin credentials
2. Manage medicines (Add, Edit, Delete)
3. View and manage customers
4. Monitor sales and stock levels
5. Generate reports

## Notes
- No external APIs are used
- All data is stored locally in MySQL database
- Passwords are stored as plain text (for demo purposes - use hashing in production)
- Stock is automatically updated when orders are placed
