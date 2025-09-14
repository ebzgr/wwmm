-- A/B Testing System Database Schema for Supabase
-- Run these commands in your Supabase SQL editor

-- Create ab_assignments table
CREATE TABLE ab_assignments (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    experiment_name VARCHAR(100) NOT NULL,
    variant VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_ab_assignments_user_id ON ab_assignments(user_id);
CREATE INDEX idx_ab_assignments_experiment ON ab_assignments(experiment_name);
CREATE INDEX idx_ab_assignments_expires ON ab_assignments(expires_at);

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_session_id ON events(session_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_device_type ON events(device_type);

-- Enable Row Level Security (RLS)
ALTER TABLE ab_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public insert on ab_assignments" ON ab_assignments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on events" ON events
    FOR INSERT WITH CHECK (true);


-- Optional: Create a function to clean up expired assignments
CREATE OR REPLACE FUNCTION cleanup_expired_assignments()
RETURNS void AS $$
BEGIN
    DELETE FROM ab_assignments WHERE expires_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to run cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-expired-assignments', '0 2 * * *', 'SELECT cleanup_expired_assignments();');
