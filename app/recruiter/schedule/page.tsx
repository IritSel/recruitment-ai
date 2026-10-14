"use client";
import Link from "next/link";
import {useState} from "react";
import {getSupabase} from "../../lib/supabase";
import {useSiteLanguage} from "../../components/useSiteLanguage";
export default function SchedulePage(){
 const en=useSiteLanguage()==="en";
 const [connecting,setConnecting]=useState(false);
 const [error,setError]=useState("");
 const calendarStatus=typeof window!=="undefined"?new URLSearchParams(window.location.search).get("calendar"):null;
 async function connectCalendar(){setConnecting(true);setError("");try{const {data}=await getSupabase().auth.getSession();if(!data.session)throw new Error(en?"Sign in as an approved QA recruiter first.":"יש להתחבר תחילה כחשבון מגייסת QA מאושר.");const res=await fetch("/api/calendar/google/start",{method:"POST",headers:{Authorization:"Bearer "+data.session.access_token}});const body=await res.json();if(!res.ok||!body.url)throw new Error(en?"Could not start Google authorization.":"לא ניתן להתחיל את תהליך ההרשאה של Google.");window.location.assign(body.url)}catch(e){setError(e instanceof Error?e.message:"Connection failed");setConnecting(false)}}
 const [kind,setKind]=useState("phone");
 const [duration,setDuration]=useState("20");
 const [buffer,setBuffer]=useState("10");
 const [start,setStart]=useState("09:00");
 const [end,setEnd]=useState("17:00");
 return <main className="shell"><section style={{maxWidth:900,margin:"45px auto"}}>
 <Link href="/recruiter">← {en?"Dashboard":"דשבורד"}</Link>
 <h1>{en?"Interview scheduling":"תיאום ראיונות"}</h1>
 <p>{en?"Candidates choose from available slots on your connected calendar.":"המועמדת תבחר שעה מתוך הזמנים הפנויים ביומן של המגייסת."}</p>
 <div className="choice"><h2>{en?"1. Connect your calendar":"1. חיבור היומן"}</h2>
 <p>{en?"Google Calendar is the first planned integration. The connection is not active yet.":"Google Calendar הוא החיבור הראשון שאנחנו בונים. החיבור עדיין אינו פעיל."}</p>
 <div style={{border:"1px solid #ddd6fe",borderRadius:12,padding:16,background:"#faf9ff"}}>
 <b>{en?"Google Calendar — not yet connected":"Google Calendar — עדיין לא מחובר"}</b>
 {calendarStatus&&<p role="status" style={{color:calendarStatus==="verified"?"#166534":"#b42318"}}>{calendarStatus==="verified"?(en?"Google authorization and availability check succeeded. Secure connection storage is still pending.":"אישור Google ובדיקת הזמינות הצליחו. עדיין נדרשת שמירה מאובטחת של החיבור."):en?"Google authorization was not completed. Please check your Google OAuth settings.":"תהליך האישור לא הושלם. יש לבדוק את הגדרות OAuth ב־Google."}</p>}
 <button type="button" className="button" disabled={connecting} onClick={connectCalendar}>{connecting?(en?"Connecting...":"מתחבר..."):(en?"Authorize Google Calendar (QA)":"אישור גישה ל־Google Calendar (QA)")}</button>
 {error&&<p role="alert" style={{color:"#b42318"}}>{error}</p>
 <p>{en?"Secure Google authorization requires OAuth configuration in Google Cloud.":"כדי להפעיל חיבור מאובטח נדרשת הגדרת OAuth ב־Google Cloud."}</p>
 <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer">{en?"Open Google Cloud credentials":"פתיחת הגדרות Google Cloud"} ↗</a>
 </div></div>
 <div className="choice"><h2>{en?"2. Interview rules (QA preview)":"2. הגדרות ראיונות (תצוגת QA)"}</h2>
 <div style={{display:"grid",gap:15,maxWidth:430}}>
 <label>{en?"Interview type":"סוג ראיון"}<select value={kind} onChange={e=>setKind(e.target.value)} style={{display:"block",width:"100%",padding:12,borderRadius:10,border:"1px solid #ddd6fe"}}><option value="phone">{en?"Phone":"טלפוני"}</option><option value="video">{en?"Video":"וידאו"}</option></select></label>
 <label>{en?"Duration (minutes)":"משך ראיון (דקות)"}<select value={duration} onChange={e=>setDuration(e.target.value)} style={{display:"block",width:"100%",padding:12,borderRadius:10,border:"1px solid #ddd6fe"}}><option value="15">15</option><option value="20">20</option><option value="30">30</option><option value="45">45</option><option value="60">60</option></select></label>
 <label>{en?"Buffer between meetings (minutes)":"הפסקה בין ראיונות (דקות)"}<select value={buffer} onChange={e=>setBuffer(e.target.value)} style={{display:"block",width:"100%",padding:12,borderRadius:10,border:"1px solid #ddd6fe"}}><option value="0">0</option><option value="5">5</option><option value="10">10</option><option value="15">15</option></select></label>
 <div style={{display:"flex",gap:12}}><label>{en?"From":"משעה"}<input type="time" value={start} onChange={e=>setStart(e.target.value)} style={{display:"block",padding:10,border:"1px solid #ddd6fe",borderRadius:9}}/></label><label>{en?"Until":"עד שעה"}<input type="time" value={end} onChange={e=>setEnd(e.target.value)} style={{display:"block",padding:10,border:"1px solid #ddd6fe",borderRadius:9}}/></label></div>
 </div>
 <p style={{fontSize:13,color:"#64748b"}}>{en?"These controls are a preview. Settings are not yet saved or synced to a calendar.":"הגדרות אלו הן תצוגה מקדימה; הן עדיין לא נשמרות ולא מסונכרנות ליומן."}</p></div>
 <div className="choice"><h2>{en?"3. Candidate booking":"3. בחירת מועד על ידי המועמדת"}</h2><p>{en?"Once connected, HOW? will display only free time slots and recheck availability before booking.":"לאחר חיבור היומן, HOW? תציג רק שעות פנויות ותבדוק זמינות מחדש לפני קביעת ראיון."}</p><p>{en?"No real interview can be booked until the integration is configured.":"לא ניתן לקבוע ראיון אמיתי לפני השלמת האינטגרציה."}</p></div>
 </section></main>
}