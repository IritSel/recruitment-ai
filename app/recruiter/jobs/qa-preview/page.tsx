"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
type Criterion={id:number;text:string;priority:"must"|"preferred"|"flexible"};
type Job={id:string;title:string;description:string;employment:string;criteria:Criterion[];qa:true};
export default function QaJobPreview(){
 const [job,setJob]=useState<Job|null>(null);
 const [loaded,setLoaded]=useState(false);
 useEffect(()=>{try{const id=new URLSearchParams(window.location.search).get("id");const raw=localStorage.getItem("how-qa-published-jobs");const data=raw?JSON.parse(raw):[];if(Array.isArray(data)){const found=data.find((j:Job)=>j?.id===id&&j.qa===true);if(found)setJob(found)}}catch{}setLoaded(true)},[]);
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">HOW?</Link><Link href="/recruiter/jobs">← חזרה למשרות</Link></nav>
 <section className="choice" style={{maxWidth:760,margin:"48px auto",display:"grid",gap:14}}>
 <span className="eyebrow">QA · תצוגת מועמדת · לא פורסם לציבור</span>
 {!loaded?<p>טוען תצוגה…</p>:!job?<><h1>המשרה לא נמצאה</h1><p>משרות QA נשמרות בדפדפן שבו נוצרו.</p></>:<>
 <h1>{job.title}</h1><p>{job.employment}</p>
 <h2>על התפקיד</h2><p style={{whiteSpace:"pre-wrap"}}>{job.description}</p>
 <h2>דרישות התפקיד</h2>
 {job.criteria?.length?job.criteria.map(c=><div key={c.id} style={{padding:12,border:"1px solid #e9e4ff",borderRadius:12,display:"flex",justifyContent:"space-between",gap:12}}><span>{c.text}</span><strong>{c.priority==="must"?"חובה":c.priority==="preferred"?"יתרון":"גמיש"}</strong></div>):<p>לא הוגדרו דרישות.</p>}
 <p style={{fontSize:13,color:"#64748b"}}>תצוגת QA בלבד. טווח השכר הפנימי אינו מוצג. הגשת מועמדות אינה פעילה בתצוגה זו.</p>
 <button type="button" className="button" disabled>הגשת מועמדות — תצוגת QA בלבד</button>
 </>}
 </section></main>;
}