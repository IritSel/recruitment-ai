"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {getSupabase} from "../../lib/supabase";
import {useSiteLanguage} from "../../components/useSiteLanguage";

export default function SchedulePage(){
 const en=useSiteLanguage()==="en";
 const [connecting,setConnecting]=useState(false);
 const [error,setError]=useState("");
 const [status,setStatus]=useState<string|null>(null);
 const [kind,setKind]=useState("phone");
 const [duration,setDuration]=useState("20");
 const [buffer,setBuffer]=useState("10");
 const [start,setStart]=useState("09:00");
 const [end,setEnd]=useState("17:00");
 useEffect(()=>{setStatus(new URLSearchParams(window.location.search).get("calendar"))},[]);
 async function connectCalendar(){
  setConnecting(true);
  setError("");
  try{
   const {data}=await getSupabase().auth.getSession();
   if(!data.session)throw new Error(en?"Sign in to your QA account first.":"יש להתחבר לחשבון QA תחילה.");
   const res=await fetch("/api/calendar/google/start",{method:"POST",headers:{Authorization:"Bearer "+data.session.access_token}});
   if(!res.ok)throw new Error(en?"Could not start Google authorization.":"לא ניתן להתחיל את החיבור ל־Google.");
   const payload=await res.json() as {url?:string};
   if(!payload.url)throw new Error("Google authorization URL is missing");
   window.location.assign(payload.url);
  }catch(e){
   setError(e instanceof Error?e.message:"Connection failed");
   setConnecting(false);
  }
 }
 const field:React.CSSProperties={display:"block",width:"100%",padding:12,border:"1px solid #ddd6fe",borderRadius:10};
 return (
  <main className="shell">
   <section style={{maxWidth:900,margin:"45px auto"}}>
    <Link href="/recruiter">← {en?"Dashboard":"דשבורד"}</Link>
    <h1>{en?"Interview scheduling":"תיאום ראיונות"}</h1>
    <p>{en?"Candidates will select available slots on a connected calendar.":"מועמדות יבחרו שעות פנויות ביומן המגייסת לאחר השלמת החיבור."}</p>
    <div className="choice">
     <h2>{en?"1. Connect calendar":"1. חיבור היומן"}</h2>
     <p><strong>{en?"Google Calendar — not connected":"Google Calendar — עדיין לא מחובר"}</strong></p>
     {status==="verified"&&<p role="status">{en?"Authorization verified for QA. Secure token storage is still pending.":"ההרשאה אומתה ב־QA, אך שמירת החיבור עדיין לא הושלמה."}</p>}
     {status&&status!=="verified"&&<p role="alert">{en?"Google authorization did not complete.":"אישור Google לא הושלם."}</p>}
     <button type="button" className="button" onClick={connectCalendar} disabled={connecting}>{connecting?(en?"Connecting…":"מתחבר…"):(en?"Authorize Google Calendar (QA)":"אישור גישה ל־Google Calendar (QA)")}</button>
     {error&&<p role="alert" style={{color:"#b42318"}}>{error}</p>}
    </div>
    <div className="choice">
     <h2>{en?"2. Interview rules (QA preview)":"2. הגדרות ראיונות (תצוגת QA)"}</h2>
     <div style={{display:"grid",gap:14,maxWidth:430}}>
      <label>{en?"Interview type":"סוג ראיון"}<select style={field} value={kind} onChange={e=>setKind(e.target.value)}><option value="phone">{en?"Phone":"טלפוני"}</option><option value="video">{en?"Video":"וידאו"}</option></select></label>
      <label>{en?"Duration (minutes)":"משך ראיון (דקות)"}<select style={field} value={duration} onChange={e=>setDuration(e.target.value)}>{["15","20","30","45","60"].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
      <label>{en?"Break between meetings (minutes)":"הפסקה בין ראיונות (דקות)"}<select style={field} value={buffer} onChange={e=>setBuffer(e.target.value)}>{["0","5","10","15"].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
      <label>{en?"From":"משעה"}<input style={field} type="time" value={start} onChange={e=>setStart(e.target.value)}/></label>
      <label>{en?"Until":"עד שעה"}<input style={field} type="time" value={end} onChange={e=>setEnd(e.target.value)}/></label>
     </div>
     <p>{en?"Preview only — these rules are not saved yet.":"תצוגת QA בלבד — ההגדרות עדיין אינן נשמרות."}</p>
    </div>
    <div className="choice">
     <h2>{en?"3. Candidate booking":"3. בחירת מועד על ידי המועמדת"}</h2>
     <p>{en?"Booking will be enabled after secure calendar connection and availability checks are implemented.":"קביעת ראיונות תופעל רק לאחר השלמת שמירת החיבור ובדיקות הזמינות."}</p>
    </div>
   </section>
  </main>
 );
}
