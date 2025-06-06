
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pjrwdjuzkjnvisaxdkmr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqcndkanV6a2pudmlzYXhka21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjgzNDYsImV4cCI6MjA2NDcwNDM0Nn0.AE4zlXI2myXucdpIqraGtgGjtzR2PAdmC29WmZk7jVE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
