import Link from "next/link";
import { Children, cloneElement, isValidElement, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactElement, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

export function Brand(){return <Link className="brand" href="/"><span className="brand-mark">UR</span><span>UniResearch</span></Link>}
export function LanguageSwitch(){return <span className="lang-switch" aria-label="ภาษา"><span className="active">TH</span><span>EN</span></span>}
export function Button({variant="primary",className="",...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:"primary"|"secondary"|"ghost"}){return <button className={`btn btn-${variant} ${className}`} {...props}/>}
export function ButtonLink({href,variant="primary",children,className=""}:{href:string;variant?:"primary"|"secondary"|"ghost";children:React.ReactNode;className?:string}){return <Link href={href} className={`btn btn-${variant} ${className}`}>{children}</Link>}
export function Field({label,required,hint,children}:{label:string;required?:boolean;hint?:string;children:React.ReactNode}){
  const child=Children.only(children);
  const control=isValidElement(child)?child as ReactElement<{id?:string;name?:string;"aria-describedby"?:string}>:null;
  const controlId=control?.props.id??control?.props.name;
  const hintId=hint&&controlId?`${controlId}-hint`:undefined;
  const describedBy=[control?.props["aria-describedby"],hintId].filter(Boolean).join(" ")||undefined;
  const describedControl=control&&controlId?cloneElement(control,{id:controlId,...(describedBy?{"aria-describedby":describedBy}:{})}):children;
  if(!controlId)return <div className="field"><label>{label}{required&&<span className="required-mark" aria-hidden="true"> *</span>}{children}</label>{hint&&<small className="field-hint">{hint}</small>}</div>;
  return <div className="field"><label htmlFor={controlId}>{label}{required&&<span className="required-mark" aria-hidden="true"> *</span>}</label>{describedControl}{hint&&<small id={hintId} className="field-hint">{hint}</small>}</div>;
}
export function Input({className="",...props}:InputHTMLAttributes<HTMLInputElement>){return <input className={`input ${className}`} {...props}/>}
export function Select({className="",...props}:SelectHTMLAttributes<HTMLSelectElement>){return <select className={`select ${className}`} {...props}/>}
export function Textarea({className="",...props}:TextareaHTMLAttributes<HTMLTextAreaElement>){return <textarea className={`textarea ${className}`} {...props}/>}
export function Checkbox({children,...props}:InputHTMLAttributes<HTMLInputElement>&{children:React.ReactNode}){return <label className="check"><input type="checkbox" {...props}/><span>{children}</span></label>}
export function ArchiveTab({children,tone="lavender"}:{children:React.ReactNode;tone?:"lavender"|"blue"|"apricot"}){return <span className={`archive-tab ${tone==="lavender"?"":tone}`}>{children}</span>}
export function Status({children,tone="review"}:{children:React.ReactNode;tone?:"approved"|"review"|"revision"|"error"}){return <span className={`status ${tone}`}>{children}</span>}
export function StatePanel({kind,title,detail}:{kind:"loading"|"empty"|"success"|"error";title:string;detail:string}){return <div className={`state state-${kind}`} role={kind==="error"?"alert":"status"}>{kind==="loading"?<><span className="sr-only">{title}. {detail}</span><div className="skeleton"/><div className="skeleton" style={{width:"60%",margin:"12px auto"}}/></>:<><strong className="state-title">{kind==="success"?"✓ ":kind==="error"?"! ":"[ ] "}{title}</strong><p className="muted">{detail}</p></>}</div>}
