"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {qaCandidates} from "../../qa-candidates";
type Offer={candidateId:string;jobId:string;jobTitle:string;status?:string};
type Application={candidateId:string;jobId:string;status:string};
export default function CandidateDashboard(){
 const [id,setId]=useState("noa");
 const [offers,setOffers]=useState<Offer[]>([]);
 const [applications,setApplications]=useState<Application[]>([]);
 const [ready,setReady]=useState(false);
 useEffect(()=>{const selected=new URLSearchParams(window.location.search).get("id")||"noa";setId(selected);try{const raw=JSON.parse(localStorage.getItem("how-qa-job-offers")||"[]");setOffers(Array.isArray(raw)?raw:[]);const apps=JSON.parse(localStorage.getItem("how-qa-applications")||"[]");setApplications(Array.isArray(apps)?apps:[])}catch{}setReady(true)},[]);
 const candidate=qaCandidates.find(c=>c.id===id);
 const mine=offers.filter(o=>o.candidateId===id);
 const active=applications.filter(a=>a.candidateId===id&&a.status!=="rejected");
 const pending=mine.filter(o=>!o.status||o.status==="pending");
 const metrics=[{name:"הזמנות חדשות",value:pending.length},{name:"מועמדויות פעילות",value:active.length},{name:"משרות מומלצות",value:3}];
 return <main className="shell" dir="rtl"><nav className="nav"><Link className="brand" href="/">HOW?</Link><div className="navlinks"><Link href="/candidate/jobs">חיפוש משרות</Link><Link href="/candidate/profile">הפרופיל שלי</Link></div></nav><section style={{maxWidth:1040,margin:"36px auto 70px",display:"grid",gap:22}}>
 <div><span className="eyebrow">סביבת QA · מועמד/ת לדוגמה</span><h1 style={{marginBottom:6}}>שלום, {candidate?.name?.split(" ")[0]||"ברוכה הבאה"}</h1><p style={{color:"#64748b",margin:0}}>כל מה שחשוב בתהליך חיפוש העבודה שלך, במקום אחד.</p></div>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12}}>{metrics.map(m=><div className="choice" key={m.name} style={{margin:0,padding:20,display:"grid",gap:10}}><span style={{fontSize:14,color:"#625b79"}}>{m.name}</span><strong style={{fontSize:36,lineHeight:1.1,color:"#3624a1"}}>{ready?m.value:"—"}</strong></div>)}</div>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
 <section className="choice" style={{margin:0,padding:24}}><h2 style={{marginTop:0}}>מה מחכה לך?</h2>{pending.length?<><p>יש לך {pending.length} הזמנות ממגייסים שממתינות לתשובה.</p><Link className="button" href={"/candidate/invitations?id="+encodeURIComponent(id)}>צפייה בהזמנות</Link></>:<><p>אין כרגע הזמנות שממתינות לתגובה.</p><Link href="/candidate/jobs">למשרות המומלצות ←</Link></>}</section>
 <section className="choice" style={{margin:0,padding:24}}><h2 style={{marginTop:0}}>המועמדויות שלי</h2>{active.length?<div style={{display:"grid",gap:8}}>{active.map(a=><p key={a.jobId} style={{margin:0,padding:"9px 0",borderBottom:"1px solid #eee9ff"}}>{mine.find(o=>o.jobId===a.jobId)?.jobTitle||({"qa-demo-service":"נציגי שירות","qa-demo-team":"מנהל/ת צוות","qa-demo-backoffice":"בק אופיס"} as Record<string,string>)[a.jobId]||"משרה"} · <strong>{a.status==="process"?"בתהליך":a.status==="hired"?"התקבלתי":"ממתינה לבדיקה"}</strong></p>)}</div>:<p>עדיין אין מועמדויות פעילות שנרשמו בסביבת QA.</p>}<Link href={"/candidate/process?id="+encodeURIComponent(id)}>הודעות ומעקב תהליך ←</Link></section>
 </div>
 <section className="choice" style={{margin:0,padding:24}}><h2 style={{marginTop:0}}>משרות שכדאי לבדוק</h2><p style={{color:"#64748b"}}>שלוש משרות דוגמה. התאמה אישית עדיין אינה מחושבת באמצעות AI.</p><Link className="button" href="/candidate/jobs">צפייה במשרות</Link></section>
 <small style={{color:"#64748b"}}>הנתונים לצורכי QA בלבד ונשמרים בדפדפן הזה. מדד המשרות המומלצות מייצג שלוש משרות דוגמה, לא התאמות AI מאומתות.</small>
 </section></main>
}