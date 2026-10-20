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
 useEffect(()=>{try{const raw=JSON.parse(localStorage.getItem("how-qa-published-jobs")||"[]");setJobs([{id:"qa-demo-service",title:"נציגי שירות"},{id:"qa-demo-team",title:"מנהל/ת צוות"},{id:"qa-demo-backoffice",title:"בק אופיס"},...(Array.isArray(raw)?raw.filter((j:any)=>j?.qa===true&&typeof j.id==="string"&&typeof j.title==="string").map((j:any)=>({id:j.id,title:j.title})):[])]);setSaved((JSON.parse(localStorage.getItem("how-qa-saved-candidates")||"[]") as string[]).includes("noa"))}catch{}},[]);
 function invite(){try{const title=jobs.find(j=>j.id===selectedJob)?.title;if(!title){setNote("יש לבחור משרה.");return}const raw=JSON.parse(localStorage.getItem("how-qa-job-offers")||"[]");const list=Array.isArray(raw)?raw:[];const next=[...list.filter((o:any)=>!(o.candidateId==="noa"&&o.jobId===selectedJob)),{candidateId:"noa",jobId:selectedJob,jobTitle:title,status:"pending",sentAt:new Date().toISOString(),recruiterName:"מגייסת QA",companyName:"חברת הדגמה HOW?"}];localStorage.setItem("how-qa-job-offers",JSON.stringify(next));setNote("ההזמנה נשלחה לתיבת ההזמנות של נועה כהן בסביבת QA. אפשר לפתוח את תיבת המועמדת בדפדפן זה כדי לאמת קבלה.")}catch{setNote("לא ניתן לשמור את ההזמנה.")}}
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
 <h2>{en?"Next action":"המשך טיפול"}</h2>
 <p>{en?"An invitation is appropriate only for someone who has not applied to the job. It does not submit an application on their behalf.":"הזמנה רלוונטית רק למועמדת שעדיין לא הגישה מועמדות. הזמנה אינה הגשת מועמדות בשמה."}</p>
 <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><Link className="button" href="/recruiter/schedule?candidate=noa">קביעת ראיון ביומן QA</Link>
 <label style={{display:"grid",gap:4}}>משרה להזמנה<select aria-label="בחירת משרה להזמנה" value={selectedJob} onChange={e=>setSelectedJob(e.target.value)} style={{padding:10,borderRadius:8,border:"1px solid #ddd6fe"}}>{jobs.map(j=><option key={j.id} value={j.id}>{j.title}</option>)}</select></label><button className="button" onClick={invite}>{en?"Send QA invitation":"שליחת הזמנה לנועה (QA)"}</button><Link className="button" href="/candidate/invitations">פתיחת תיבת ההזמנות של נועה</Link>
 <button onClick={toggleSaved} style={{padding:12}}>{saved?(en?"Remove saved candidate":"הסרה מהמועמדים השמורים"):(en?"Save candidate (QA)":"שמירת מועמדת לעתיד (QA)") }</button>
 </div>{note&&<p role="status" style={{color:"#2f6f6a"}}>{note}</p>}
 <p style={{color:"#64748b",marginTop:20}}>{en?"Other applications, employers and activity history are private.":"מועמדויות, חברות אחרות והיסטוריית פעילות אינן חשופות."}</p>
 </section></main>;
}