"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useSiteLanguage} from "../../components/useSiteLanguage";
type Job={id:string;title:string;description:string;employment:string;criteria:{id:number;text:string;priority:"must"|"preferred"|"flexible"}[];qa:true};
const demoJobs:Job[]=[
{id:"qa-demo-service",title:"נציגי שירות",description:"מתן שירות ללקוחות בטלפון ובערוצים דיגיטליים, טיפול בפניות, תיעוד במערכת ומתן פתרונות מקצועיים.",employment:"משרה מלאה",criteria:[{id:1,text:"תקשורת בין־אישית טובה",priority:"must"},{id:2,text:"ניסיון קודם בשירות לקוחות",priority:"preferred"}],qa:true},
{id:"qa-demo-team",title:"מנהל/ת צוות",description:"ניהול צוות נציגים, חניכה ומשוב, בקרה על מדדי שירות והובלת שיפור תהליכים.",employment:"משרה מלאה",criteria:[{id:1,text:"ניסיון בניהול צוות",priority:"must"},{id:2,text:"ניסיון במוקד שירות",priority:"preferred"}],qa:true},
{id:"qa-demo-backoffice",title:"בק אופיס",description:"טיפול במסמכים ובבקשות, עבודה עם מערכות מידע, בקרת נתונים וממשקים מול צוותים פנימיים.",employment:"משרה מלאה",criteria:[{id:1,text:"סדר ודיוק בעבודה",priority:"must"},{id:2,text:"שליטה ביישומי Office",priority:"preferred"}],qa:true}
];
export default function JobsPage(){
 const en=useSiteLanguage()==="en";
 const [jobs,setJobs]=useState<Job[]>([]);
 const [savedCandidates,setSavedCandidates]=useState<string[]>([]);
 const [offers,setOffers]=useState<{candidateId:string;jobId:string;jobTitle:string}[]>([]);
 const [openOffer,setOpenOffer]=useState<string|null>(null);
 const [notice,setNotice]=useState("");
 function propose(jobId:string,jobTitle:string){if(!savedCandidates.includes("noa"))return;const next=[...offers.filter(o=>!(o.jobId===jobId&&o.candidateId==="noa")),{candidateId:"noa",jobId,jobTitle}];try{localStorage.setItem("how-qa-job-offers",JSON.stringify(next));setOffers(next);setNotice("הצעת QA לנועה כהן נרשמה בדפדפן בלבד. לא נשלחה הודעה למועמדת ולא הוגשה מועמדות.")}catch{setNotice("לא ניתן לשמור את הצעת ה־QA.")}}
 const offerPanel=(id:string,title:string)=><div style={{marginTop:12,display:"grid",gap:8}}><button type="button" onClick={()=>{setOpenOffer(openOffer===id?null:id);setNotice("")}} style={{padding:"9px 13px",border:"1px solid #b9aff7",background:"#f7f5ff",borderRadius:9,color:"#32219d",fontWeight:700,cursor:"pointer",justifySelf:"start"}}>{en?"Suggest to saved candidates":"הצעת משרה למועמדים שמורים"}</button>{openOffer===id&&<div style={{border:"1px solid #e5defa",borderRadius:10,padding:12,display:"grid",gap:9}}><strong>{en?"Saved candidates (QA)":"מועמדים שמורים (QA)"}</strong>{savedCandidates.includes("noa")?<div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}><span>נועה כהן · ניהול צוות ושירות</span><Link href="/recruiter/candidates/1">צפייה בפרופיל</Link><button type="button" disabled={offers.some(o=>o.jobId===id&&o.candidateId==="noa")} onClick={()=>propose(id,title)} style={{padding:"8px 12px",border:0,borderRadius:8,background:"#5b45f5",color:"white",cursor:"pointer"}}>{offers.some(o=>o.jobId===id&&o.candidateId==="noa")?"הצעת QA נרשמה":"הצעת המשרה (QA)"}</button></div>:<p>עדיין לא שמרת מועמדים. <Link href="/recruiter/candidates/1" style={{color:"#4d37d9",textDecoration:"underline"}}>שמירת נועה כהן מתוך הפרופיל</Link></p>}<small>הדגמה בדפדפן בלבד. אין שליחת הודעות או הגשת מועמדות אוטומטית.</small></div>}{notice&&openOffer===id&&<p role="status" style={{color:"#166534"}}>{notice}</p>}</div>;
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("how-qa-saved-candidates")||"[]");if(Array.isArray(saved))setSavedCandidates(saved);const existing=JSON.parse(localStorage.getItem("how-qa-job-offers")||"[]");if(Array.isArray(existing))setOffers(existing);const raw=localStorage.getItem("how-qa-published-jobs");const parsed=raw?JSON.parse(raw):[];if(Array.isArray(parsed)){const valid=parsed.filter((j):j is Job=>Boolean(j&&typeof j.id==="string"&&typeof j.title==="string"&&j.qa===true));setJobs([...valid,...demoJobs.filter(d=>!valid.some(j=>j.id===d.id))])}else setJobs(demoJobs)}catch{}},[]);
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">HOW?</Link><Link href="/recruiter">← {en?"Dashboard":"דשבורד"}</Link></nav>
 <section style={{padding:"45px 0"}}>
 <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,flexWrap:"wrap"}}><h1>{en?"Jobs":"משרות"}</h1><Link className="button" href="/recruiter/jobs/new">+ {en?"Create job":"יצירת משרה"}</Link></div>
 <section aria-label={en?"QA jobs":"משרות QA"}>
 <h2>{en?"QA jobs":"משרות בסביבת QA"}</h2>
 <p style={{color:"#64748b",fontSize:13}}>{en?"All jobs below use the same QA card and candidate preview. They are not public.":"כל המשרות מוצגות באותו מבנה לצורכי בדיקה בלבד. הן אינן מפורסמות לציבור."}</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:12}}>
 {jobs.map(job=><article className="choice" key={job.id} style={{margin:0,padding:16,display:"grid",gap:8,alignContent:"start"}}>
 <span className="eyebrow" style={{justifySelf:"start"}}>QA · {en?"Test job":"משרת בדיקה"}</span>
 <h3 style={{margin:0}}>{job.title}</h3>
 <p style={{margin:0,fontSize:13}}>{job.employment}</p>
 <p style={{margin:0,fontSize:13,lineHeight:1.5}}>{job.description.length>150?job.description.slice(0,150)+"…":job.description}</p>
 <small>{en?"Defined requirements":"דרישות מוגדרות"}: {job.criteria?.length||0}</small>
 <Link className="button" style={{justifySelf:"start"}} href={"/recruiter/jobs/qa-preview?id="+encodeURIComponent(job.id)}>{en?"Candidate preview":"צפייה כמועמד/ת"}</Link>
 {offerPanel(job.id,job.title)}
 </article>)}
 </div></section>
 </section></main>;
}