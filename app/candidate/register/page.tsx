"use client";
import Link from "next/link";
import {useState} from "react";
import {useSiteLanguage} from "../../components/useSiteLanguage";
import {getSupabase} from "../../lib/supabase";
export default function P(){
 const en=useSiteLanguage()==="en";
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [notice,setNotice]=useState("");
 async function submit(ev:React.FormEvent<HTMLFormElement>){
  ev.preventDefault();setBusy(true);setError("");setNotice("");
  const data=new FormData(ev.currentTarget);
  const first=String(data.get("first")||"").trim(),last=String(data.get("last")||"").trim(),phone=String(data.get("phone")||"").trim(),email=String(data.get("email")||"").trim(),password=String(data.get("password")||"");
  try{
   const supabase=getSupabase();
   const {data:result,error:authError}=await supabase.auth.signUp({email,password,options:{data:{first_name:first,last_name:last,phone}}});
   if(authError)throw authError;
   if(result.session&&result.user){
    const {error:saveError}=await supabase.from("candidate_profiles").upsert({id:result.user.id,first_name:first,last_name:last,phone,email},{onConflict:"id"});
    if(saveError)throw saveError;
    window.location.href="/candidate";
   }else setNotice(en?"Check your email to confirm your account, then sign in.":"נשלח אליך אימייל לאישור החשבון. לאחר האישור אפשר להתחבר.");
  }catch(err){setError(err instanceof Error?err.message:"Registration failed");}finally{setBusy(false)}
 }
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">Recruitment AI</Link></nav><section style={{maxWidth:620,margin:"55px auto"}}><Link href="/" className="backLink">← {en?"Back":"חזרה"}</Link><div className="choice"><span className="eyebrow">{en?"Candidate registration":"הרשמת מועמד/ת"}</span><h1>{en?"Create your account":"יצירת חשבון"}</h1><form onSubmit={submit} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><input required name="first" autoComplete="given-name" placeholder={en?"First name":"שם פרטי"} style={field}/><input required name="last" autoComplete="family-name" placeholder={en?"Last name":"שם משפחה"} style={field}/><input required name="email" type="email" autoComplete="email" placeholder={en?"Email":"אימייל"} style={{...field,gridColumn:"1/-1"}}/><input required name="phone" type="tel" autoComplete="tel" placeholder={en?"Phone":"טלפון"} style={field}/><input required name="password" minLength={8} type="password" autoComplete="new-password" placeholder={en?"Password (8+ characters)":"סיסמה (8+ תווים)"} style={field}/><button disabled={busy} className="button" style={{gridColumn:"1/-1",border:0}}>{busy?(en?"Creating account...":"יוצר חשבון..."):(en?"Create account":"יצירת חשבון")}</button></form>{error&&<p role="alert" style={{color:"#b42318"}}>{error}</p>}{notice&&<p role="status">{notice}</p>}<p>{en?"Already have an account?":"כבר יש לך חשבון?"} <Link href="/login"><u>{en?"Sign in":"כניסה"}</u></Link></p></div></section></main>
}
const field={padding:14,border:"1px solid #ddd",borderRadius:12,font:"inherit"};
