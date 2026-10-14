"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {getSupabase} from "../lib/supabase";
import {useSiteLanguage} from "../components/useSiteLanguage";
export default function ForgotPassword(){
 const en=useSiteLanguage()==="en";
 const [role,setRole]=useState("candidate");
 useEffect(()=>{setRole(new URLSearchParams(window.location.search).get("role")==="recruiter"?"recruiter":"candidate")},[]);
 const [email,setEmail]=useState(""),[busy,setBusy]=useState(false),[sent,setSent]=useState(false),[error,setError]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");
  try{const {error:err}=await getSupabase().auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin+"/reset-password"});if(err)throw err;setSent(true)}
  catch(err){const message=err instanceof Error?err.message:"";setError(/rate limit|too many|429/i.test(message)?(en?"Email sending limit reached. Please wait before trying again.":"הגעת למגבלת שליחת אימיילים. יש להמתין לפני ניסיון נוסף."):(en?"Could not send the reset email. Please try again later.":"לא ניתן לשלוח כרגע אימייל לאיפוס סיסמה. נסי שוב מאוחר יותר."))}
  finally{setBusy(false)}
 }
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">HOW?</Link></nav><section className="choice" style={{maxWidth:540,margin:"70px auto"}}><Link href="/login" className="backLink">← {en?"Back to sign in":"חזרה לכניסה"}</Link><h1>{en?"Reset your password":"איפוס סיסמה"}</h1><p>{en?(role==="recruiter"?"Recruiter account":"Candidate account"):(role==="recruiter"?"חשבון מגייס/ת":"חשבון מועמד/ת")}</p>{sent?<p role="status">{en?"If this address has an account, you will receive an email with a reset link. Check spam as well.":"אם קיים חשבון לכתובת הזו, יישלח אליה קישור לאיפוס סיסמה. כדאי לבדוק גם בספאם."}</p>:<form onSubmit={submit} style={{display:"grid",gap:12}}><label htmlFor="reset-email">{en?"Account email":"כתובת האימייל של החשבון"}</label><input id="reset-email" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} style={field}/><button className="button" disabled={busy}>{busy?(en?"Sending...":"שולח..."):(en?"Send reset link":"שליחת קישור לאיפוס")}</button></form>}{error&&<p role="alert" style={{color:"#b42318"}}>{error}</p>}</section></main>
}
const field={padding:14,border:"1px solid #ddd",borderRadius:12,font:"inherit"};
