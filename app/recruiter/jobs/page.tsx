"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useSiteLanguage} from "../../components/useSiteLanguage";
type Job={id:string;title:string;description:string;employment:string;criteria:{id:number;text:string;priority:"must"|"preferred"|"flexible"}[];qa:true};
export default function JobsPage(){
 const en=useSiteLanguage()==="en";
 const [jobs,setJobs]=useState<Job[]>([]);
 useEffect(()=>{try{const raw=localStorage.getItem("how-qa-published-jobs");const parsed=raw?JSON.parse(raw):[];if(Array.isArray(parsed))setJobs(parsed.filter((j):j is Job=>Boolean(j&&typeof j.id==="string"&&typeof j.title==="string"&&j.qa===true)))}catch{}},[]);
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">HOW?</Link><Link href="/recruiter">← {en?"Dashboard":"דשבורד"}</Link></nav>
 <section style={{padding:"45px 0"}}>
 <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,flexWrap:"wrap"}}><h1>{en?"Jobs":"משרות"}</h1><Link className="button" href="/recruiter/jobs/new">+ {en?"Create job":"יצירת משרה"}</Link></div>
 {jobs.length>0&&<section aria-label={en?"QA jobs":"משרות QA"}><h2>{en?"Published QA jobs":"משרות שפורסמו ב־QA"}</h2><p style={{color:"#64748b"}}>{en?"Saved only in this browser; not visible to real candidates.":"המשרות נשמרות בדפדפן הזה בלבד ואינן גלויות למועמדות אמיתיות."}</p>
 {jobs.map(job=><div className="choice" key={job.id}><span className="eyebrow">QA · {en?"Preview":"תצוגת בדיקה"}</span><h3>{job.title}</h3><p>{job.employment}</p><p style={{whiteSpace:"pre-wrap"}}>{job.description.length>160?job.description.slice(0,160)+"…":job.description}</p><Link className="button" href={"/recruiter/jobs/qa-preview?id="+encodeURIComponent(job.id)}>{en?"View as candidate":"צפייה במשרה כפי שמועמדת רואה"}</Link></div>)}</section>}
 <h2>{en?"Demo jobs":"משרות לדוגמה"}</h2>
 {["Customer Service","Team Manager","Back Office"].map((x,i)=><div className="choice" key={x}><h3>{en?x:["נציגי שירות","מנהל/ת צוות","בק אופיס"][i]}</h3><p>{en?"Active · demo candidates":"פעילה · מועמדים לדוגמה"}</p><Link className="button" href="/recruiter/jobs/1">{en?"Open job workspace":"פתיחת סביבת המשרה"}</Link></div>)}
 </section></main>;
}