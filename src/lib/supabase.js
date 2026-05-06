import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://dtsjfwvipejnvjhcpegq.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0c2pmd3ZpcGVqbnZqaGNwZWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjAxNTMsImV4cCI6MjA5MzEzNjE1M30.jR9wJxn40owpNDxs1oKpTGoBE9t0eBuFxxB3-4asP0I"

export const supabase = createClient(supabaseUrl, supabaseKey)