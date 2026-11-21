import type { AuthError } from "@supabase/supabase-js";

// Supabase Auth messages are in English and some of them reveal whether an
// account exists ("User already registered", "Email not confirmed"). Show the
// visitor a generic Spanish message instead and keep the detail in the logs.
export function authErrorMessage(error: AuthError, context: "login" | "register" | "reset" | "update" | "oauth") {
  console.error(`Auth ${context} error:`, error.code ?? error.status, error.message);
  if (error.status === 429 || error.code === "over_request_rate_limit" || error.code === "over_email_send_rate_limit") {
    return "Demasiados intentos. Espera unos minutos e intenta de nuevo.";
  }
  switch (context) {
    case "login":
      return "Correo o contraseña incorrectos, o la cuenta aún no está confirmada.";
    case "register":
      if (error.code === "weak_password") return "La contraseña es demasiado débil. Usa una más larga y difícil de adivinar.";
      return "No se pudo crear la cuenta. Si ya tienes una, inicia sesión o recupera tu contraseña.";
    case "update":
      if (error.code === "weak_password") return "La contraseña es demasiado débil. Usa una más larga y difícil de adivinar.";
      if (error.code === "same_password") return "La nueva contraseña debe ser distinta de la anterior.";
      return "No se pudo cambiar la contraseña. Solicita un nuevo enlace e intenta de nuevo.";
    default:
      return "No se pudo completar la solicitud. Intenta de nuevo.";
  }
}
