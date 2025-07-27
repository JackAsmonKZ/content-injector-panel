import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wdmmlzdmaotawfbtovcs.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbW1semRtYW90YXdmYnRvdmNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NTQ1NDUsImV4cCI6MjA2ODEzMDU0NX0.jI8Ilj0gyXKvyqixx3bi2dxn3v5UrpXz-9Xz4o8qA6k";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
