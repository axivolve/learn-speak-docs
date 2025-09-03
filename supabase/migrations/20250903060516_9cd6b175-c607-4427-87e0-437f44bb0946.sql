-- Enable RLS on existing files table
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Create policies for files table to allow public access
CREATE POLICY "Allow public access to files" 
ON public.files 
FOR SELECT 
USING (true);

CREATE POLICY "Allow file uploads" 
ON public.files 
FOR INSERT 
WITH CHECK (true);