"use client";
import Link from "next/link";
import {useSiteLanguage} from "../../../components/useSiteLanguage";
import {useEffect,useState} from "react";
export default function CandidateSearchProfile(){
 const en=useSiteLanguage()==="en";
 const [note,setNote]=useState("");
 const [saved,setSaved]=useState(false);
 const [jobs,setJobs]=useState<{id:string;title:string}[]>([]);
 const [selectedJob,setSelectedJob]=useState("qa-demo-team");
 const [offers,setOffers]=useState<{jobId:string;jobTitle:string;candidateId:string;status?:string}[]>([]);
 useEffect(()=>{try{const raw=JSON.parse(localStorage.getItem("how-qa-published-jobs")||"[]");setJobs([{id:"qa-demo-service",title:"נציגי שירות"},{id:"qa-demo-team",title:"מנהל/ת צוות"},{id:"qa-demo-backoffice",title:"בק אופיס"},...(Array.isArray(raw)?raw.filter((j:any)=>j?.qa===true&&typeof j.id==="string"&&typeof j.title==="string").map((j:any)=>({id:j.id,title:j.title})):[])]);setSaved((JSON.parse(localStorage.getItem("how-qa-saved-candidates")||"[]") as string[]).includes("noa"));const existing=JSON.parse(localStorage.getItem("how-qa-job-offers")||"[]");setOffers(Array.isArray(existing)?existing.filter((o:any)=>o.candidateId==="noa"):[])}catch{}},[]);
 function invite(){try{const title=jobs.find(j=>j.id===selectedJob)?.title;if(!title){setNote("יש לבחור משרה.");return}const raw=JSON.parse(localStorage.getItem("how-qa-job-offers")||"[]");const list=Array.isArray(raw)?raw:[];const next=[...list.filter((o:any)=>!(o.candidateId==="noa"&&o.jobId===selectedJob)),{candidateId:"noa",jobId:selectedJob,jobTitle:title,status:"pending",sentAt:new Date().toISOString(),recruiterName:"מגייסת QA",companyName:"חברת הדגמה HOW?"}];localStorage.setItem("how-qa-job-offers",JSON.stringify(next));setOffers(next.filter((o:any)=>o.candidateId==="noa"));setNote("ההזמנה נשלחה לתיבת ההזמנות של נועה כהן בסביבת QA. סטטוס ההזמנה זמין למגייסת.")}catch{setNote("לא ניתן לשמור את ההזמנה.")}}
 function toggleSaved(){try{const raw=JSON.parse(localStorage.getItem("how-qa-saved-candidates")||"[]");const ids:string[]=Array.isArray(raw)?raw.filter((v):v is string=>typeof v==="string"):[];const next=saved?ids.filter(id=>id!=="noa"):Array.from(new Set([...ids,"noa"]));localStorage.setItem("how-qa-saved-candidates",JSON.stringify(next));setSaved(!saved);setNote(saved?"המועמדת הוסרה מהרשימה השמורה ב־QA.":"המועמדת נשמרה ב־QA. אפשר להציע לה משרה מתוך דף המשרות.")}catch{setNote("לא ניתן לשמור בדפדפן.")}}
 return <main className="shell"><section className="choice" style={{maxWidth:800,margin:"50px auto"}}>
 <Link href="/recruiter/candidates">→ {en?"Back to search":"חזרה לחיפוש"}</Link>
 <h1>נועה כהן</h1><p>{en?"Team management · 4 years experience · Beer Sheva":"מנהלת צוות · 4 שנות ניסיון · באר שבע"}</p>
 <p style={{fontSize:13,color:"#6b5d91"}}>{en?"QA DEMO: Sample candidate, not an uploaded real CV.":"הדגמת QA: מועמדת לדוגמה, לא קורות חיים שהועלו בפועל."}</p>
 <h2>{en?"Experience & skills":"ניסיון וכישורים"}</h2><p>{en?"Team management · Customer service · Training · Process implementation":"ניהול צוות · שירות · הדרכה · הטמעת תהליכים"}</p>
 <div style={{border:"1px solid #ddd6fe",borderRadius:14,padding:20,margin:"22px 0"}}>
 <h2>{en?"CV and job fit":"קורות חיים וניתוח התאמה"}</h2>
 <p>{en?"Open the sample CV and a short explanation based on its contents.":"צפי בפרופיל קורות החיים לדוגמה ובהסבר קצר המבוסס על המידע שמופיע בו."}</p>
 <Link className="button" href="/recruiter/candidate/1">{en?"View full CV and analysis":"צפייה בקורות חיים מלאים ובניתוח התאמה"}</Link>
 </div>
 <section style={{marginTop:26,padding:22,border:"1px solid #e4ddff",borderRadius:16,display:"grid",gap:16}}>
 <div><h2 style={{margin:"0 0 8px"}}>הזמנה למשרה</h2><p style={{margin:0,fontSize:14,color:"#64748b"}}>אפשר להזמין מועמדת להגיש מועמדות. ההחלטה אם להגיש נשארת בידיה.</p></div>
 <label style={{display:"grid",gap:7,fontWeight:600,maxWidth:420}}>בחירת משרה<select aria-label="בחירת משרה להזמנה" value={selectedJob} onChange={e=>setSelectedJob(e.target.value)} style={{padding:"12px 14px",borderRadius:10,border:"1px solid #c9bfff",background:"#fff",font:"inherit"}}>{jobs.map(j=><option key={j.id} value={j.id}>{j.title}</option>)}</select></label>
 <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}><button type="button" className="button" onClick={invite}>שליחת הזמנה למשרה</button><button type="button" onClick={toggleSaved} style={{padding:"11px 16px",border:"1px solid #c9bfff",borderRadius:10,background:"#fff",color:"#382d86",fontWeight:600,cursor:"pointer"}}>{saved?"הסרה מהמועמדים השמורים":"שמירת מועמדת לעתיד"}</button></div>
 {note&&<p role="status" style={{margin:0,color:"#2f6f6a"}}>{note}</p>}
 {offers.length>0&&<div style={{borderTop:"1px solid #eee9ff",paddingTop:14}}><h3 style={{margin:"0 0 10px"}}>סטטוס הזמנות</h3>{offers.map(o=><p key={o.jobId} style={{margin:"6px 0"}}>{o.jobTitle} — <strong>{o.status==="applied"?"המועמדת אישרה הגשה":o.status==="declined"?"המועמדת דחתה": "הזמנה נשלחה, ממתינה לתגובה"}</strong></p>)}</div>}
 </section>
 <div style={{marginTop:18}}><Link href="/recruiter/schedule?candidate=noa" style={{color:"#4335aa",fontWeight:600}}>קביעת ראיון ביומן QA ←</Link></div>
 <p style={{color:"#64748b",marginTop:20}}>{en?"Other applications, employers and activity history are private.":"מועמדויות, חברות אחרות והיסטוריית פעילות אינן חשופות."}</p>
 </section></main>;
}