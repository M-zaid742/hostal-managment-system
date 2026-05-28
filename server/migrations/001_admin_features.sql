-- Migration: Add Admin Features
-- This file contains SQL updates for the new admin dashboard, approval system, and messaging features

-- 1. Add approval_status to hostels table
ALTER TABLE hostels ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- 2. Add subscription_status to hostels table
ALTER TABLE hostels ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active', 'expired'));

-- 3. Add subscription_end_date to hostels table
ALTER TABLE hostels ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP;

-- 4. Create messages table for chat functionality
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hostel_id INT REFERENCES hostels(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create index for efficient message queries
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_hostel ON messages(hostel_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- 6. Update existing hostels to approved status (for data migration)
UPDATE hostels SET approval_status = 'approved' WHERE approval_status = 'pending';

-- 7. Set subscription status for approved hostels
UPDATE hostels SET subscription_status = 'active', subscription_end_date = CURRENT_TIMESTAMP + INTERVAL '30 days' WHERE approval_status = 'approved';
