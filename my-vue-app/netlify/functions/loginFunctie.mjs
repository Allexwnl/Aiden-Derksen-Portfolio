import { createClient } from '@supabase/supabase-js';

export const handler = async (event, context) => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const SUPABASE_EMAIL = process.env.SUPABASE_EMAIL;
    const SUPABASE_PASSWORD = process.env.SUPABASE_PASSWORD;

    if (!SUPABASE_URL || !SUPABASE_KEY || !SUPABASE_EMAIL || !SUPABASE_PASSWORD) {
      console.error("❌ Ontbrekende environment variabelen");
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: "Ontbrekende environment variabelen" }),
      };
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: SUPABASE_EMAIL,
      password: SUPABASE_PASSWORD,
    });

    if (error) {
      console.error("❌ Login mislukt:", error.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: error.message }),
      };
    }

    console.log(`[${new Date().toISOString()}] ✅ Ingelogd als ${data.user.email}`);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: `Ingelogd als ${data.user.email}`,
        token: data.session.access_token.slice(0, 20) + "...",
      }),
    };

  } catch (err) {
    console.error("❌ Interne fout:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
