import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mxolamdsiblxzgeptrkm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14b2xhbWRzaWJseHpnZXB0cmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0OTA1NTAsImV4cCI6MjA2MDA2NjU1MH0.Oaci59ZhYsCqti1VfzZzLBxqxRhcSIVMqIc-xAQniJU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export {};
