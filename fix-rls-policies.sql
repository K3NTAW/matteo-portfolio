-- Simplify RLS policies to allow all operations
-- Run this in your Supabase SQL Editor

-- Drop all existing policies
DROP POLICY IF EXISTS "Contact messages are insertable by everyone" ON contact_messages;
DROP POLICY IF EXISTS "Contact messages are viewable by admins" ON contact_messages;
DROP POLICY IF EXISTS "Contact messages are updatable by admins" ON contact_messages;
DROP POLICY IF EXISTS "Contact messages are viewable by everyone" ON contact_messages;
DROP POLICY IF EXISTS "Contact messages are updatable by everyone" ON contact_messages;

DROP POLICY IF EXISTS "Experiences are viewable by everyone" ON experiences;
DROP POLICY IF EXISTS "Experiences are insertable by admins" ON experiences;
DROP POLICY IF EXISTS "Experiences are updatable by admins" ON experiences;
DROP POLICY IF EXISTS "Experiences are deletable by admins" ON experiences;

DROP POLICY IF EXISTS "Media are viewable by everyone" ON media;
DROP POLICY IF EXISTS "Media are insertable by admins" ON media;
DROP POLICY IF EXISTS "Media are updatable by admins" ON media;
DROP POLICY IF EXISTS "Media are deletable by admins" ON media;

DROP POLICY IF EXISTS "Admins are viewable by admins" ON admins;
DROP POLICY IF EXISTS "Admins are viewable by everyone" ON admins;

-- Create simple policies that allow all operations
CREATE POLICY "Allow all operations on experiences" ON experiences
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on media" ON media
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on admins" ON admins
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on contact_messages" ON contact_messages
  FOR ALL USING (true) WITH CHECK (true); 