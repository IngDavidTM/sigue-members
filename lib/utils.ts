export const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Variables configuradas explícitamente en producción o local
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Host asignado automáticamente si usas Vercel
        "http://localhost:3000/";

    // Asegurarse de tener `http://` o `https://`
    url = url.startsWith("http") ? url : `https://${url}`;

    // Asegurar que NO termine con una barra inclinada para poder concatenar sanamente
    url = url.endsWith("/") ? url.slice(0, -1) : url;

    return url;
};
