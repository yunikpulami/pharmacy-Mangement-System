-- Run this if you already have the database created
-- This will update the customers table structure

USE pharmacy_db;

-- Add username column if it doesn't exist
ALTER TABLE customers ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE NOT NULL DEFAULT 'user' AFTER id;

-- Remove fullname column if it exists
ALTER TABLE customers DROP COLUMN IF EXISTS fullname;

-- Add address column if it doesn't exist
ALTER TABLE customers ADD COLUMN IF NOT EXISTS address VARCHAR(100) NOT NULL DEFAULT 'Kathmandu' AFTER phone;

-- Add delivery_address column to orders table if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address VARCHAR(100) NOT NULL DEFAULT 'Kathmandu' AFTER payment_method;
