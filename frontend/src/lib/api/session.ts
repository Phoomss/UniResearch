import { cookies } from "next/headers";

const COOKIE_NAME="uniresearch_access_token";
export async function getSessionToken(){ return (await cookies()).get(COOKIE_NAME)?.value ?? null; }
export async function hasSession(){ return Boolean(await getSessionToken()); }
export async function setSessionToken(token:string){ (await cookies()).set(COOKIE_NAME,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:30*60}); }
export async function clearSession(){ (await cookies()).delete(COOKIE_NAME); }
export const sessionCookieName=COOKIE_NAME;
