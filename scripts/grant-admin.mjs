import { createClient } from "@supabase/supabase-js";

const email = process.argv[2]?.trim().toLowerCase();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!email) {
  console.error("Uso: npm run admin:grant -- correo@ejemplo.com");
  process.exit(1);
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let page = 1;
let user = null;

while (!user) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
  if (error) throw error;

  user = data.users.find((candidate) => candidate.email?.toLowerCase() === email) ?? null;
  if (user || data.users.length < 1000) break;
  page += 1;
}

if (!user) {
  console.error(`No existe un usuario de Supabase Auth con el correo ${email}.`);
  process.exit(1);
}

const { error } = await supabase.from("profiles").upsert({
  id: user.id,
  email: user.email ?? email,
  full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
  role: "admin",
});

if (error) throw error;

console.log(`${email} ahora tiene el rol admin.`);
