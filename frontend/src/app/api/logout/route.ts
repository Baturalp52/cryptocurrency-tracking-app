import { cookies } from "next/headers";
import { TOKEN_COOKIE_NAME } from "@/utils/constants";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
  return new Response("Logged out", { status: 200 });
}
