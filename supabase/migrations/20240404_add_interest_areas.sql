-- Add interest_areas column to guide_submissions table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'guide_submissions'
        AND column_name = 'interest_areas'
    ) THEN
        ALTER TABLE public.guide_submissions 
        ADD COLUMN interest_areas jsonb DEFAULT '[]'::jsonb NOT NULL;
    END IF;
END $$;
