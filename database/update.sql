-- Run this if you already have the database created
-- This will add the delivery_address column to existing orders table

USE pharmacy_db;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address TEXT AFTER payment_method;
