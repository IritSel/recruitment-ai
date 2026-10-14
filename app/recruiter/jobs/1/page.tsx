"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useSiteLanguage} from "../../../components/useSiteLanguage";

type Job={title:string;description:string;requirements:string;location:string;employment:string;salary:string;status:string};
const defaults:Job={title:"נציגי שירות",description:"מתן שירות ללקוחות במגוון ערוצים, טיפול בפניות ומתן מענה מקצועי. זהו תיאור הדגמה בלבד.",requirements:"תקשורת בין־אישית טובה, עברית ברמה גבוהה, יכולת עבודה בצוות. דרישות הדגמה בלבד.",location:"באר שבע",employment:"משרה מלאה",salary:"",status:"פעילה"};
const storageKey="how-qa-job-1";
const field:React.CSSProperties={width:"100%",padding:12,border:"1px solid #ddd6fe",borderRadius:10,font:"inherit",boxSizing:"border-box"};
export default function JobWorkspace(){
 const en=useSiteLanguage()==="en";
 const [job,setJob]=useState<Job>(defaults);
 const [edit,setEdit]=useState(false);
 const [saved,setSaved]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem(storageKey);if(raw)setJob({...defaults,...JSON.parse(raw)})}catch{}},[]);
 const update=(key:keyof Job,value:string)=>{setJob(prev=>({...prev,[key]:value}));setSaved(false)};
 const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(job));setEdit(false);setSaved(true)}catch{setSaved(false)}};
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">HOW?</Link><Link href="/recruiter/jobs">← {en?"Jobs":"משרות"}</Link></nav>
 <section style={{padding:"35px 0",maxWidth:940,margin:"auto"}}>
 <span className="eyebrow">{en?"QA demo job workspace":"סביבת משרה · נתוני QA לדוגמה"}</span>
 <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",flexWrap:"wrap"}}>
 <div><h1>{job.title}</h1><p>{job.status} · {job.location} · {job.employment}</p></div>
 <button className="button" type="button" onClick={()=>{setEdit(v=>!v);setSaved(false)}}>{edit?(en?"Cancel editing":"ביטול עריכה"):(en?"Edit job":"עריכת משרה")}</button></div>
 {saved&&<p role="status" style={{color:"#166534"}}>{en?"Saved locally for QA. Not published to database.":"השינויים נשמרו בדפדפן לצורכי QA בלבד; הם לא פורסמו למסד הנתונים."}</p>}
 <div className="choice" style={{marginTop:20}}>
 <h2>{en?"Job details":"פרטי המשרה"}</h2>
 {edit?<form onSubmit={e=>{e.preventDefault();save()}} style={{display:"grid",gap:14}}>
 <label>{en?"Job title":"שם המשרה"}<input required style={field} value={job.title} onChange={e=>update("title",e.target.value)}/></label>
 <label>{en?"Description":"תיאור התפקיד"}<textarea required style={{...field,minHeight:130}} value={job.description} onChange={e=>update("description",e.target.value)}/></label>
 <label>{en?"Requirements":"דרישות התפקיד"}<textarea style={{...field,minHeight:110}} value={job.requirements} onChange={e=>update("requirements",e.target.value)}/></label>
 <label>{en?"Location":"מיקום"}<input style={field} value={job.location} onChange={e=>update("location",e.target.value)}/></label>
 <label>{en?"Employment":"היקף משרה"}<select style={field} value={job.employment} onChange={e=>update("employment",e.target.value)}><option>משרה מלאה</option><option>משרה חלקית</option><option>משמרות</option><option>Full time</option><option>Part time</option></select></label>
 <label>{en?"Internal salary range":"טווח שכר פנימי (לא מוצג למועמדים)"}<input style={field} value={job.salary} onChange={e=>update("salary",e.target.value)}/></label>
 <label>{en?"Status":"סטטוס"}<select style={field} value={job.status} onChange={e=>update("status",e.target.value)}><option>פעילה</option><option>מוקפאת</option><option>סגורה</option></select></label>
 <button className="button" type="submit">{en?"Save QA changes":"שמירת שינויים ב־QA"}</button>
 </form>:<><h3>{en?"Description":"תיאור התפקיד"}</h3><p style={{whiteSpace:"pre-wrap"}}>{job.description}</p><h3>{en?"Requirements":"דרישות התפקיד"}</h3><p style={{whiteSpace:"pre-wrap"}}>{job.requirements}</p><p><b>{en?"Location":"מיקום"}:</b> {job.location}</p><p><b>{en?"Employment":"היקף"}:</b> {job.employment}</p><p><b>{en?"Status":"סטטוס"}:</b> {job.status}</p><p><b>{en?"Internal salary":"שכר פנימי"}:</b> {job.salary||"לא הוגדר"}</p></>}
 </div>
 <h2 style={{marginTop:28}}>{en?"Candidates":"מועמדים"}</h2>
 <div className="choice"><h3>{en?"Waiting for review":"ממתינים לבדיקה"}</h3><p><b>נועה כהן</b> · 4/4 קריטריוני חובה · באר שבע (נתוני הדגמה)</p><Link className="button" href="/recruiter/candidates/1">{en?"Open candidate":"פתיחת מועמד/ת"}</Link></div>
 <div className="choice"><h3>{en?"In process":"בתהליך"}</h3><p>{en?"3 demo candidates":"3 מועמדים לדוגמה"}</p></div>
 </section></main>
}