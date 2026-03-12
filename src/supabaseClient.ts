import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lcvazleicyhgctcgimaf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdmF6bGVpY3loZ2N0Y2dpbWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzE1MDAsImV4cCI6MjA4ODgwNzUwMH0.xidWGhzNcZ8amMyl5WcjKK02GedQG1_Bj71Hd0fxAWw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)