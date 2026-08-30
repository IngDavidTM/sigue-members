# Activación del administrador y contenido dinámico

La aplicación ya contiene el panel y las páginas públicas, pero Supabase necesita recibir la migración antes de usarlo.

## 1. Aplicar la migración

Con el proyecto enlazado mediante Supabase CLI:

```bash
supabase link --project-ref TU_PROJECT_REF
supabase db push
```

También se puede ejecutar una sola vez el archivo
`supabase/migrations/202608290001_admin_content.sql` en el SQL Editor de Supabase.

La migración crea perfiles, roles, RLS, blogs, traducciones, series, etiquetas,
comentarios, eventos, sedes, enlaces virtuales privados y el bucket `content-media`.

## 2. Configurar variables del servidor

Además de las variables públicas actuales, la operación para promover administradores usa:

```text
SUPABASE_SERVICE_ROLE_KEY=...
```

Esta llave nunca debe llevar el prefijo `NEXT_PUBLIC_` ni incluirse en el navegador.
Puede existir en el entorno local seguro desde el cual se ejecute el comando de promoción;
no es necesaria para el funcionamiento diario del panel.

## 3. Promover una cuenta existente

La persona primero debe registrarse o iniciar sesión para existir en Supabase Auth. Después:

```bash
npm run admin:grant -- correo@siguenetwork.org
```

Los usuarios nuevos reciben siempre el rol `user`. Solo el comando anterior o una operación
equivalente desde el SQL Editor puede asignar `admin`.

## 4. Verificación mínima

1. Un usuario normal entra a `/dashboard` y no puede abrir `/admin`.
2. El administrador entra a `/admin`.
3. Crear un blog y un evento como borradores: no deben aparecer públicamente.
4. Publicarlos con traducciones ES/EN: deben aparecer sin volver a desplegar Vercel.
5. Un comentario público debe quedar `pending` hasta su aprobación.
6. Un enlace virtual no marcado como público no debe aparecer en la API pública.
