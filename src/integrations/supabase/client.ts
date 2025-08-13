import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gtojzpwpvnccezngwhml.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0b2p6cHdwdm5jY2V6bmd3aG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzODA4MzksImV4cCI6MjA1NDk1NjgzOX0.2wBi4F5XHZHmMJUUU4TW0-gS4Mmc5AHqB-FxJdhGhHA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)