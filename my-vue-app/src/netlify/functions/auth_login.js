import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_EMAIL = process.env.SUPABASE_EMAIL;
const SUPABASE_PASSWORD = process.env.SUPABASE_PASSWORD;

export default async function handler(event, context) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: SUPABASE_EMAIL,
    password: SUPABASE_PASSWORD,
  });

  if (error) {
    console.error('❌ Login mislukt:', error.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }

  console.log(`[${new Date().toISOString()}] ✅ Ingelogd als ${data.user.email}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message: `Ingelogd als ${data.user.email}`,
      token: data.session.access_token.slice(0, 16) + '...',
    }),
  };
}
