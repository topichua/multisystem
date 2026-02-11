export const DIRECTUS_BASE_URL = import.meta.env
  .VITE_API_DIRECTUS_URL as string;

export const DIRECTUS_ASSETS_URL = `${DIRECTUS_BASE_URL}/assets/`;

export const getDirectusAssetUrl = (id: string | undefined) =>
  id && `${DIRECTUS_ASSETS_URL}${id}`;
