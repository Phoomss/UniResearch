"use client";
import { Button, ButtonLink, StatePanel } from "@/src/components/ui";
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){return <main className="container route-error"><StatePanel kind="error" title="Research page unavailable" detail="The page could not be rendered. No research information has been fabricated."/><div className="error-actions"><Button type="button" onClick={reset}>Try again</Button><ButtonLink href="/research" variant="secondary">Return to research</ButtonLink></div></main>}
