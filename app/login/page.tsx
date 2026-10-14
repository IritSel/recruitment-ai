"use client";
import Link from "next/link";
import {useState} from "react";
import {useSiteLanguage} from "../components/useSiteLanguage";
import {getSupabase} from "../lib/supabase";
export default function Login(){
 const en=useSiteLanguage()==="en";
 const [type,setType]=useState<"candidate"|"recruiter"|null>(null);
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 async function signIn(ev:React.FormEvent<HTMLFormElement>){
  ev.preventDefault();
  const data=new FormData(ev.currentTarget);setBusy(true);setError("");
  try{
   const supabase=getSupabase();
   const {data:result,error:authError}=await supabase.auth.signInWithPassword({email:String(data.get("email")),password:String(data.get("password"))});
   if(authError)throw authError;
   const user=result.user;
   if(!user)throw new Error("No authenticated user");
   const meta=user.user_metadata||{};
   if(type==="recruiter"){const response=await fetch("/api/qa/access",{headers:{Authorization:"Bearer "+result.session.access_token},cache:"no-store"});if(!response.ok)throw new Error(en?"Recruiter login is available only to approved QA accounts.":"כניסת מגייסים זמינה כרגע רק לחשבון QA מאושר.");window.location.href="/qa";return;}
   const {error:profileError}=await supabase.from("candidate_profiles").upsert({id:user.id,email:user.email||"",first_name:meta.first_name||null,last_name:meta.last_name||null,phone:meta.phone||null},{onConflict:"id",ignoreDuplicates:true});
   if(profileError)throw profileError;
   window.location.href="/candidate/jobs";
  }catch(err){setError(err instanceof Error?err.message:"Sign in failed")}finally{setBusy(false)}
 }
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">HOW?</Link></nav><section style={{maxWidth:520,margin:"70px auto"}}><Link href="/" className="backLink">← {en?"Back":"חזרה"}</Link><div className="choice"><h1>{en?"Sign in":"כניסה"}</h1>{!type?<><p>{en?"Choose your account type.":"בחרו לאיזה אזור להיכנס."}</p><div style={{display:"grid",gap:12}}><button className="button" onClick={()=>setType("candidate")}>{en?"Candidate sign in":"כניסת מועמד/ת"}</button><button className="button" onClick={()=>setType("recruiter")}>{en?"Recruiter sign in":"כניסת מגייס/ת"}</button></div></>:<><button onClick={()=>{setType(null);setError("")}} style={plain}>← {en?"Change account type":"שינוי סוג החשבון"}</button><h2>{type==="recruiter"?(en?"Recruiter sign in":"כניסת מגייס/ת"):(en?"Candidate sign in":"כניסת מועמד/ת")}</h2><form onSubmit={signIn} style={{display:"grid",gap:12}}><input required name="email" type="email" autoComplete="email" placeholder={en?"Email":"אימייל"} style={field}/><input required name="password" type="password" autoComplete="current-password" placeholder={en?"Password":"סיסמה"} style={field}/><button disabled={busy} className="button">{busy?(en?"Signing in...":"מתחבר..."):(en?"Sign in":"כניסה")}</button></form>{type==="recruiter"&&<p style={{fontSize:13}}>{en?"Recruiter sign-in is currently limited to approved QA accounts.":"כניסת מגייסים מוגבלת כרגע לחשבונות QA מאושרים."}</p>}{error&&<p role="alert" style={{color:"#b42318"}}>{error}</p>}<p>{en?"No account yet?":"אין לך חשבון?"} <Link href={type==="recruiter"?"/recruiter/register":"/candidate/register"}><u>{en?"Create one":"הרשמה"}</u></Link></p></>}</div></section></main>
}
const field={padding:14,border:"1px solid #ddd",borderRadius:12,font:"inherit"};
const plain={border:0,background:"transparent",cursor:"pointer"};
