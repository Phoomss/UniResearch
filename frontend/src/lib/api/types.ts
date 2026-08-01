export type UserRole = "guest" | "student" | "advisor" | "admin";

export interface UserCreate {
  email: string;
  password: string;
  role?: string;
  student_id?: string | null;
  department?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}
export interface UserResponse extends Omit<UserCreate, "password"> { id:number; is_active:boolean; role:string; }
export interface TokenResponse { access_token:string; token_type:string; }
export interface CategoryCreate { category_name:string; description?:string|null; }
export interface CategoryResponse extends CategoryCreate { id:number; }
export interface ResearchWorkResponse {
  title_th:string; title_en:string; abstract:string|null; category_id:number; department:string|null;
  work_type:string|null; academic_year:number|null; keywords:string|null; id:number;
  cover_image_path:string|null; file_path:string|null; status:string; view_count:number;
  download_count:number; published_at:string|null; created_at:string; updated_at:string; submitted_by_id:number;
}
export interface ReviewCommentCreate { comment_text:string; status_result:string; }
export interface ReviewCommentResponse extends ReviewCommentCreate { id:number; research_id:number; reviewer_id:number; created_at:string; }
export interface FavoriteResponse { id:number; user_id:number; research_id:number; saved_at:string; }
export interface FavoriteRemovedResponse { detail:string; }
export interface DashboardStats { total_users:number; total_research_works:number; total_views:number; total_downloads:number; }
export interface DownloadHandshake { file_url:string; }
export interface ValidationIssue { loc:Array<string|number>; msg:string; type:string; input?:unknown; }
export interface BackendErrorBody { detail?:string|ValidationIssue[]; }

export type ApiResult<T> = { ok:true; data:T } | { ok:false; error:NormalizedApiError };
export interface NormalizedApiError { status:number; code:"bad_request"|"unauthorized"|"forbidden"|"not_found"|"conflict"|"validation"|"server"|"network"|"unknown"; message:string; issues?:ValidationIssue[]; }
