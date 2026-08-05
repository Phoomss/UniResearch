"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { Button, Field, Input } from "@/src/components/ui";

interface ClientError { code?:string;message:string; }
async function postJson(path:string,value:unknown){const response=await fetch(path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(value)});const body=await response.json().catch(()=>({}));if(!response.ok)throw body.error as ClientError;return body;}
function errorMessage(value:unknown,fallback:string){const error=value as ClientError|undefined;return `${error?.message??fallback} [${error?.code??"network"}]`;}
const subscribeHydration=()=>()=>{};const clientHydrated=()=>true;const serverHydrated=()=>false;

export function LoginForm({nextPath="/account/saved"}:{nextPath?:string}){
  const errorRef=useRef<HTMLParagraphElement>(null);const [error,setError]=useState("");const [pending,setPending]=useState(false);const hydrated=useSyncExternalStore(subscribeHydration,clientHydrated,serverHydrated);
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setPending(true);setError("");const data=new FormData(event.currentTarget);try{await postJson("/api/auth/login",{email:data.get("email"),password:data.get("password")});window.location.assign(nextPath);}catch(value){setError(errorMessage(value,"ไม่สามารถเข้าสู่ระบบได้"));setPending(false);queueMicrotask(()=>errorRef.current?.focus());}}
  return <form method="post" className="form-card" style={{display:"grid",gap:22,marginTop:30}} onSubmit={submit} aria-busy={pending} data-hydrated={hydrated}>
    <div className="eyebrow" style={{textAlign:"center"}}>เข้าสู่ระบบด้วยอีเมล</div>
    <Field label="อีเมลสถาบัน" required><Input type="email" name="email" placeholder="name@university.ac.th" autoComplete="email" required disabled={pending}/></Field>
    <Field label="รหัสผ่าน" required><Input type="password" name="password" placeholder="กรอกรหัสผ่านของคุณ" autoComplete="current-password" required disabled={pending}/></Field>
    {error&&<p ref={errorRef} className="status-message error" role="alert" tabIndex={-1}>{error}</p>}
    <Button type="submit" disabled={pending||!hydrated}>{pending?"กำลังเข้าสู่ระบบ…":"เข้าสู่ระบบ →"}</Button>
    <p style={{textAlign:"center",margin:0}}>ยังไม่มีบัญชี? <Link href="/register" style={{color:"var(--mulberry)",fontWeight:600}}>สร้างบัญชีใหม่</Link></p>
  </form>;
}

export function RegisterForm(){
  const errorRef=useRef<HTMLParagraphElement>(null);const [error,setError]=useState("");const [pending,setPending]=useState(false);const hydrated=useSyncExternalStore(subscribeHydration,clientHydrated,serverHydrated);
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setPending(true);setError("");const data=new FormData(event.currentTarget);if(data.get("password")!==data.get("confirmPassword")){setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน [validation]");setPending(false);queueMicrotask(()=>errorRef.current?.focus());return;}try{await postJson("/api/auth/register",{email:data.get("email"),password:data.get("password")});window.location.assign("/login?registered=1");}catch(value){setError(errorMessage(value,"ไม่สามารถสร้างบัญชีได้"));setPending(false);queueMicrotask(()=>errorRef.current?.focus());}}
  return <form method="post" className="form-card" style={{display:"grid",gap:18,marginTop:26}} onSubmit={submit} aria-busy={pending} data-hydrated={hydrated}>
    <Field label="อีเมลสถาบัน" required><Input type="email" name="email" placeholder="student@university.ac.th" autoComplete="email" required disabled={pending}/></Field>
    <Field label="รหัสผ่าน" required hint="อย่างน้อย 8 ตัวอักษร"><Input type="password" name="password" minLength={8} autoComplete="new-password" required disabled={pending}/></Field>
    <Field label="ยืนยันรหัสผ่าน" required><Input type="password" name="confirmPassword" minLength={8} autoComplete="new-password" required disabled={pending}/></Field>
    <p className="muted">หน้านี้สร้างบัญชีนักศึกษาเท่านั้น ระบบหลังบ้านยังไม่มีขั้นตอนยืนยันอีเมลหรือบันทึกข้อมูลโปรไฟล์ชื่อ-นามสกุล</p>
    {error&&<p ref={errorRef} className="status-message error" role="alert" tabIndex={-1}>{error}</p>}
    <Button type="submit" disabled={pending||!hydrated}>{pending?"กำลังสร้างบัญชี…":"สร้างบัญชี →"}</Button>
    <p style={{textAlign:"center",margin:0}}>มีบัญชีอยู่แล้ว? <Link href="/login" style={{color:"var(--mulberry)",fontWeight:600}}>เข้าสู่ระบบ</Link></p>
  </form>;
}
