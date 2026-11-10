const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Prefix an internal path ("/work/") with the configured base. */
export const href = (path: string) => `${base}${path.startsWith('/') ? path : `/${path}`}`;
