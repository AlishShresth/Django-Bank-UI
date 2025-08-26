// Helper function for cookie operations
export function getCookie(name:string): string | null {
  const value = `; ${document.cookie}`
    .split(`; ${name}=`)
    .pop()
    .split(';')
    .shift()
  return value ? decodeURIComponent(value) : null; 
}

export function setCookie(name: string, value: string, options: object = {}): void {
  let cookieString = `${name}=${encodeURIComponent(value)};`;
  
  Object.entries(options).forEach(([key, value]) => {
    cookieString += `${key}=${value};`;
  });
  
  document.cookie = cookieString;
}

export function clearAuthCookies(): void {
  document.cookie = 'access=; expires=Thu, 01 Jan 2025 00:00:00 GMT; path=/;';
  document.cookie = 'refresh=; expires=Thu, 01 Jan 2025 00:00:00 GMT; path=/;';
  document.cookie = 'logged_in=; expires=Thu, 01 Jan 2025 00:00:00 GMT; path=/;';
}
