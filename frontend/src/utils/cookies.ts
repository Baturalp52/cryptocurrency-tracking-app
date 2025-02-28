// Cookie utility functions

/**
 * Set a cookie with the given name, value, and expiration days
 */
export const setCookie = (
  name: string,
  value: string,
  days: number = 7,
  path: string = "/"
): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=${path};SameSite=Strict;${
    window.location.protocol === "https:" ? "Secure;" : ""
  }`;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
};

/**
 * Remove a cookie by name
 */
export const removeCookie = (name: string, path: string = "/"): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};SameSite=Strict;`;
};

/**
 * Check if cookies are available in the browser
 */
export const areCookiesEnabled = (): boolean => {
  if (typeof document === "undefined") return false;

  try {
    // Try to set a test cookie
    setCookie("test_cookie", "test", 1);
    const cookieEnabled = getCookie("test_cookie") === "test";
    removeCookie("test_cookie");
    return cookieEnabled;
  } catch {
    return false;
  }
};
