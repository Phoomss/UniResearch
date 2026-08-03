"use client";
import { Button, StatePanel } from "@/src/components/ui";
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){return <main className="container route-error"><StatePanel kind="error" title="Submission page unavailable" detail="The form could not be rendered. No upload was attempted."/><Button type="button" onClick={reset}>Try again</Button></main>}
