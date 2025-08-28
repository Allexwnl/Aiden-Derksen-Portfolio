import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://reverggwhilxgijmxidc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldmVyZ2d3aGlseGdpam14aWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNzcyODEsImV4cCI6MjA3MTk1MzI4MX0.t5Xj7bBo6dx6zOjnP_dagfIqGlb290H7fkRjQSWTKws'
export const supabase = createClient(supabaseUrl, supabaseKey)
