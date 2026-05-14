export function normalizeWebBasePath(value?: string) {
  if (!value || value === '/') {
    return '';
  }

  return `/${value.replace(/^\/+|\/+$/g, '')}`;
}

export const WEB_BASE_PATH = normalizeWebBasePath(process.env.EXPO_PUBLIC_WEB_BASE_PATH);
