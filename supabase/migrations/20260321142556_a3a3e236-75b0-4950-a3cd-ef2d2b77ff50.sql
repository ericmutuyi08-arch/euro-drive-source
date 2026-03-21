
-- The quotes insert policy is intentionally permissive to allow guest quote submissions.
-- Add a validation trigger instead to ensure data quality.
DROP POLICY "Anyone can insert quotes" ON public.quotes;
CREATE POLICY "Anyone can insert quotes" ON public.quotes FOR INSERT TO anon, authenticated WITH CHECK (
  email IS NOT NULL AND email != ''
);
