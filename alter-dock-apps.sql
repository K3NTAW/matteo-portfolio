-- Alter dock_apps table to add multiple image support
-- Run this after the initial schema is created

-- Add new columns to dock_apps table
ALTER TABLE dock_apps 
ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS content_type VARCHAR(20) DEFAULT 'text';

-- Update existing records to have 'text' as content_type
UPDATE dock_apps 
SET content_type = 'text' 
WHERE content_type IS NULL;

-- Migrate existing image_url to image_urls if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dock_apps' AND column_name = 'image_url') THEN
        UPDATE dock_apps 
        SET image_urls = jsonb_build_array(image_url)
        WHERE image_url IS NOT NULL AND image_url != '';
        
        -- Drop the old image_url column
        ALTER TABLE dock_apps DROP COLUMN IF EXISTS image_url;
    END IF;
END $$;

-- Add comment to explain content_type values
COMMENT ON COLUMN dock_apps.content_type IS 'Content type: text, image, mixed, or gallery';

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'dock_apps' 
ORDER BY ordinal_position; 