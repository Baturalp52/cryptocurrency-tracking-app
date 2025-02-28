"use server";

import { cookies } from "next/headers";
import { TOKEN_COOKIE_NAME } from "@/utils/constants";
import { CurrentUserResponse } from "@/services/auth/types";

async function getServerUser(): Promise<CurrentUserResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}

export { getServerUser };
