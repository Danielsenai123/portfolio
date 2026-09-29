// ==============================
// CONFIGURAÇÃO DO SUPABASE
// ==============================

const SUPABASE_URL = "https://zyiicgssicuewertykco.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_dtGD7KVyJ0UNOkrSxiKT5Q_bqexrLIN";

function inicializarSupabase() {
    if (typeof window.supabase !== "undefined") {
        window.supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            }
        );
    } else {
        setTimeout(inicializarSupabase, 50);
    }
}

inicializarSupabase();