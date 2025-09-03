-- Fix RLS issue by enabling proper access policies for public documents
-- Allow anonymous users to read public documents 
CREATE POLICY "Allow anonymous access to public documents" 
ON public.documents 
FOR SELECT 
USING (is_public = true);

-- Allow anonymous users to create documents
CREATE POLICY "Allow anonymous document creation" 
ON public.documents 
FOR INSERT 
WITH CHECK (true);