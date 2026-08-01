export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getThaiApiErrorMessage(error: ApiError): string {
  switch (error.status) {
    case 400:
      return "ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง";
    case 401:
      return "เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง";
    case 403:
      return "บัญชีนี้ไม่มีสิทธิ์ดำเนินการดังกล่าว";
    case 404:
      return "ไม่พบข้อมูลที่ร้องขอ";
    case 409:
      return "ข้อมูลนี้มีอยู่ในระบบแล้ว";
    case 422:
      return "ข้อมูลบางส่วนไม่ผ่านเงื่อนไขของระบบ";
    default:
      return error.message || "ระบบไม่สามารถดำเนินการได้ กรุณาลองอีกครั้ง";
  }
}
