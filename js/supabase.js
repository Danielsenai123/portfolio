```javascript
// ==============================
// CONFIGURAÇÃO DO SUPABASE
// ==============================

window.supabaseClient = window.supabase.createClient(
    "https://zyiicgssicuewertykco.supabase.co",
    "sb_publishable_dtGD7KVyJ0UNOkrSxiKT5Q_bqexrLIN",
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);
```
