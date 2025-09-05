-- Add ownership tracking to files table
ALTER TABLE public.files 
ADD COLUMN created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add is_public column to allow selective public sharing
ALTER TABLE public.files 
ADD COLUMN is_public boolean DEFAULT false;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow public access to files" ON public.files;
DROP POLICY IF EXISTS "Allow file uploads" ON public.files;

-- Create secure RLS policies

-- Users can view their own files or files marked as public
CREATE POLICY "Users can view their own files or public files" 
ON public.files 
FOR SELECT 
USING (
  created_by = auth.uid() OR 
  is_public = true OR 
  created_by IS NULL  -- Allow access to legacy files without ownership
);

-- Users can upload files (they become the owner)
CREATE POLICY "Users can upload files" 
ON public.files 
FOR INSERT 
WITH CHECK (
  created_by = auth.uid() OR 
  created_by IS NULL  -- Allow anonymous uploads for backward compatibility
);

-- Users can update their own files
CREATE POLICY "Users can update their own files" 
ON public.files 
FOR UPDATE 
USING (
  created_by = auth.uid() OR 
  created_by IS NULL  -- Allow updates to legacy files
);

-- Users can delete their own files
CREATE POLICY "Users can delete their own files" 
ON public.files 
FOR DELETE 
USING (
  created_by = auth.uid() OR 
  created_by IS NULL  -- Allow deletion of legacy files
);