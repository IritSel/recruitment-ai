"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
export default function QaDemoBanner(){
 const [context,setContext]=useState<{role:string;companyName:string}|null>(null);
 useEffect(()=>{try{const data=JSON.parse(sessionStorage.getItem("qa-demo-context")||"null");if(data?.kind==="demo"&&["candidate","recruiter","admin"].includes(data.role))setContext(data)}catch{}},[]);
 if(!context)return null;
 return <div role="status" style={{padding:"10px 16px",background:"#fff6df",border:"1px solid #e9d29d",borderRadius:12,margin:"12px auto",maxWidth:960,fontSize:14}}>מצב QA — נתוני דמו בלבד · {context.role==="candidate"?"מועמדת":context.role==="admin"?"מנהלת חברה":"מגייסת"} {context.role!=="candidate"?"· "+context.companyName:""} · <Link href="/qa" style={{textDecoration:"underline"}}>החלפת תפקיד / חברה</Link></div>
}
