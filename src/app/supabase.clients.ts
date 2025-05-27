import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://eabrubdlaywkxjsormzd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYnJ1YmRsYXl3a3hqc29ybXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTc2MjAsImV4cCI6MjA2Mzg3MzYyMH0.uCp5AozdjUqgnBs9r2IgfXYrqe-BiXex5tr36Qfn55U';

export const supabase = createClient(supabaseUrl, supabaseKey)