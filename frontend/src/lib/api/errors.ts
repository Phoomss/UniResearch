import type { BackendErrorBody, NormalizedApiError, ValidationIssue } from "./types";

const thaiByStatus:Record<number,string> = {
  400:"ข้อมูลไม่ถูกต้องหรือไม่สามารถดำเนินการได้",
  401:"เซสชันหมดอายุหรือยังไม่ได้เข้าสู่ระบบ",
  403:"บัญชีนี้ไม่มีสิทธิ์ดำเนินการ",
  404:"ไม่พบข้อมูลที่ต้องการ",
  409:"ข้อมูลนี้มีอยู่แล้วหรือเกิดความขัดแย้ง",
  422:"กรุณาตรวจสอบข้อมูลที่กรอก",
  500:"ระบบหลังบ้านเกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง",
};

const codeByStatus:Record<number,NormalizedApiError["code"]> = {400:"bad_request",401:"unauthorized",403:"forbidden",404:"not_found",409:"conflict",422:"validation",500:"server"};

export function normalizeApiError(status:number, body:unknown):NormalizedApiError {
  const value = body && typeof body === "object" ? body as BackendErrorBody : {};
  const issues = Array.isArray(value.detail) ? value.detail as ValidationIssue[] : undefined;
  const backendMessage = typeof value.detail === "string" ? value.detail : undefined;
  const knownMessage=backendMessage==="Incorrect email or password"?"อีเมลหรือรหัสผ่านไม่ถูกต้อง":backendMessage==="Email already registered"?"อีเมลนี้ลงทะเบียนแล้ว":undefined;
  return {
    status,
    code: codeByStatus[status] ?? (status >= 500 ? "server" : "unknown"),
    message: knownMessage ?? thaiByStatus[status] ?? backendMessage ?? `เกิดข้อผิดพลาดจากระบบ (${status})`,
    ...(issues ? {issues} : {}),
  };
}

export function networkError():NormalizedApiError { return {status:0,code:"network",message:"ไม่สามารถเชื่อมต่อระบบหลังบ้านได้ กรุณาลองใหม่ภายหลัง"}; }
