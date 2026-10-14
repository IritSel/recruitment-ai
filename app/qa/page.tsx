"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {getSupabase} from "../lib/supabase";
import {useSiteLanguage} from "../components/useSiteLanguage";
type Role="candidate"|"recruiter"|"admin";
const companies=[{id:"demo-a",he:"חברת דמו א׳",en:"Demo Company A"},{id:"demo-b",he:"חברת דמו ב׳",en:"Demo Company B"},{id:"demo-c",he:"חברת דמו ג׳",en:"Demo Company C"}];
export default function Qa(){
 const en=useSiteLanguage()==="en";
 const [access,setAccess]=useState<"checking"|"allowed"|"denied"|"login"|"setup">("checking");
 const [role,setRole]=useState<Role>("candidate");
 const [company,setCompany]=useState("demo-a");
 useEffect(()=>{let active=true;(async()=>{try{
 const client=getSupabase();const {data}=await client.auth.getSession();const token=data.session?.access_token;
 if(!token){if(active)setAccess("login");return}
 const res=await fetch("/api/qa/access",{headers:{Authorization:"Bearer "+token},cache:"no-store"});
 const payload=await res.json();if(active)setAccess(res.ok&&payload.allowed?"allowed":payload.reason==="not_configured"?"setup":"denied");
 }catch{if(active)setAccess("denied")}})();return()=>{active=false}},[]);
 const start=()=>{const selected=companies.find(x=>x.id===company)||companies[0];sessionStorage.setItem("qa-demo-context",JSON.stringify({role,companyId:selected.id,companyName:en?selected.en:selected.he,kind:"demo",createdAt:Date.now()}));window.location.href=role==="candidate"?"/candidate/jobs":"/recruiter"};
 return <main className="shell"><nav className="nav"><Link href="/" className="brand">HOW?</Link></nav><section className="choice" style={{maxWidth:640,margin:"60px auto",display:"grid",gap:16}}><span className="eyebrow">QA / Sandbox</span><h1>{en?"Test workspace":"סביבת בדיקות"}</h1>
 {access==="checking"?<p>{en?"Checking access...":"בודקים הרשאת גישה..."}</p>:access==="login"?<p>{en?"Sign in with your approved QA account first.":"יש להתחבר תחילה באמצעות חשבון הבדיקות המאושר."} <Link href="/login">{en?"Sign in":"כניסה"}</Link></p>:access==="setup"?<p>{en?"QA access has not been configured by the site administrator.":"יש להגדיר תחילה QA_TESTER_EMAILS ב־Vercel עם כתובת חשבון הבדיקות המאושרת."}</p>:access==="denied"?<p role="alert">{en?"This account is not authorized for QA.":"לחשבון הזה אין הרשאה למצב QA."}</p>:<><p>{en?"Switch between demo perspectives using the same account. No real company permissions are granted.":"אפשר לעבור בין תצוגות בדיקה עם אותו חשבון. אין כאן הענקת הרשאות לחברות אמיתיות."}</p><label htmlFor="qa-role">{en?"Test role":"תפקיד לבדיקה"}</label><select id="qa-role" value={role} onChange={e=>setRole(e.target.value as Role)} style={field}><option value="candidate">{en?"Candidate":"מועמדת"}</option><option value="recruiter">{en?"Recruiter":"מגייסת"}</option><option value="admin">{en?"Company admin":"מנהלת חברה"}</option></select>{role!=="candidate"&&<><label htmlFor="qa-company">{en?"Demo company":"חברת בדיקה"}</label><select id="qa-company" value={company} onChange={e=>setCompany(e.target.value)} style={field}>{companies.map(x=><option key={x.id} value={x.id}>{en?x.en:x.he}</option>)}</select></>}<button className="button" onClick={start}>{en?"Open demo view":"פתיחת תצוגת הבדיקה"}</button><small>{en?"Demo views currently use sample data. This does not test real recruiter authorization or persistence.":"התצוגות עדיין משתמשות בנתוני דוגמה. זה אינו מבחן להרשאות מגייסים אמיתיות או לשמירה במסד הנתונים."}</small></>}
 </section></main>
}
const field={padding:14,border:"1px solid #ddd",borderRadius:12,font:"inherit",background:"#fff"};
