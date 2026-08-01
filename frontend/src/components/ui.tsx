import Link from "next/link";
import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Brand() { return <Link className="brand" href="/"><span className="brand-mark">UR</span><span>UniResearch</span></Link>; }
export function LanguageSwitch() { return <span className="lang-switch" aria-label="ภาษา"><span className="active">TH</span><span>EN</span></span>; }
export function Button({ variant="primary", className="", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {variant?:"primary"|"secondary"|"ghost"}) { return <button className={`btn btn-${variant} ${className}`} {...props} />; }
export function ButtonLink({ href, variant="primary", children, className="" }: {href:string;variant?:"primary"|"secondary"|"ghost";children:React.ReactNode;className?:string}) { return <Link href={href} className={`btn btn-${variant} ${className}`}>{children}</Link>; }
export function Field({ label, required, hint, children }: {label:string;required?:boolean;hint?:string;children:React.ReactNode}) { return <div className="field"><label>{label}{required && <span style={{color:"var(--error)"}}> *</span>}</label>{children}{hint && <small className="muted">{hint}</small>}</div>; }
export function Input({className="",...props}:InputHTMLAttributes<HTMLInputElement>) { return <input className={`input ${className}`} {...props} />; }
export function Select({className="",...props}:SelectHTMLAttributes<HTMLSelectElement>) { return <select className={`select ${className}`} {...props} />; }
export function Textarea({className="",...props}:TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={`textarea ${className}`} {...props} />; }
export function Checkbox({ children, ...props }: InputHTMLAttributes<HTMLInputElement> & {children:React.ReactNode}) { return <label className="check"><input type="checkbox" {...props}/><span>{children}</span></label>; }
export function ArchiveTab({ children, tone="lavender" }:{children:React.ReactNode;tone?:"lavender"|"blue"|"apricot"}) { return <span className={`archive-tab ${tone === "lavender" ? "" : tone}`}>{children}</span>; }
export function Status({ children, tone="review" }:{children:React.ReactNode;tone?:"approved"|"review"|"revision"|"error"}) { return <span className={`status ${tone}`}>{children}</span>; }
export function StatePanel({ kind, title, detail }:{kind:"loading"|"empty"|"success"|"error";title:string;detail:string}) { return <div className="state" role={kind === "error" ? "alert" : "status"}>{kind === "loading" ? <><div className="skeleton"/><div className="skeleton" style={{width:"60%",margin:"12px auto"}}/></> : <><strong className="section-title">{kind === "success" ? "✓ " : kind === "error" ? "! " : "[ ] "}{title}</strong><p className="muted">{detail}</p></>}</div>; }
