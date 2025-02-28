"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

async function getCookieServer(name: string): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value ?? null;
}

async function setCookieServer(
  name: string,
  value: string,
  options: Partial<ResponseCookie>
) {
  const cookieStore = await cookies();
  cookieStore.set(name, value, options);
}

async function deleteCookieServer(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

export { getCookieServer, setCookieServer, deleteCookieServer };
