"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useSiteLanguage} from "../../../components/useSiteLanguage";
import {qaCandidates} from "../../../qa-candidates";

type Priority="must"|"preferred"|"flexible";
type Criterion={id:string;text:string;priority:Priority};
type Job={title:string;description:string;requirements:string;location:string;employment:string;salary:string;status:string;criteria:Criterion[];remote:string;workHours:string;confidential:boolean;screeningQuestions:string[]};
const defaults:Job={title:"נציגי שירות",description:"מתן שירות ללקוחות במגוון ערוצים, טיפול בפניות ומתן מענה מקצועי. זהו תיאור הדגמה בלבד.",requirements:"תקשורת בין־אישית טובה, עברית ברמה גבוהה, יכולת עבודה בצוות. דרישות הדגמה בלבד.",location:"באר שבע",employment:"משרה מלאה",salary:"",status:"פעילה",criteria:[],remote:"onsite",workHours:"",confidential:false,screeningQuestions:[]};
const storageKey="how-qa-job-1";
const field:React.CSSProperties={width:"100%",padding:12,border:"1px solid #ddd6fe",borderRadius:10,font:"inherit",boxSizing:"border-box"};
const priorities:{value:Priority;he:string;en:string}[]=[{value:"must",he:"חובה",en:"Must have"},{value:"preferred",he:"יתרון",en:"Preferred"},{value:"flexible",he:"גמיש",en:"Flexible"}];
export default function JobWorkspace(){
 const en=useSiteLanguage()==="en";
 const [job,setJob]=useState<Job>(defaults);
 const [edit,setEdit]=useState(false);
 const [saved,setSaved]=useState(false);
 const [error,setError]=useState("");
 const [newCriterion,setNewCriterion]=useState("");
 const [newQuestion,setNewQuestion]=useState("");
 const [applications,setApplications]=useState<{candidateId:string;jobId:string;status:string}[]>([]);
 const [seeded,setSeeded]=useState(false);
 useEffect(()=>{try{const rawApplications=JSON.parse(localStorage.getItem("how-qa-applications")||"[]");if(Array.isArray(rawApplications))setApplications(rawApplications);const raw=localStorage.getItem(storageKey);if(raw){const parsed=JSON.parse(raw) as Partial<Job>;setJob({...defaults,...parsed,criteria:Array.isArray(parsed.criteria)?parsed.criteria:[],screeningQuestions:Array.isArray(parsed.screeningQuestions)?parsed.screeningQuestions:[]})}}catch{}},[]);
 const seedApplications=()=>{try{const demo=[{candidateId:"noa",jobId:"qa-demo-service",status:"review"},{candidateId:"daniel",jobId:"qa-demo-service",status:"review"},{candidateId:"shira",jobId:"qa-demo-service",status:"review"},{candidateId:"maya",jobId:"qa-demo-service",status:"process"},{candidateId:"amir",jobId:"qa-demo-backoffice",status:"review"}];const raw=JSON.parse(localStorage.getItem("how-qa-applications")||"[]");const existing:Array<{candidateId:string;jobId:string;status:string}>=Array.isArray(raw)?raw:[];const merged=[...existing,...demo.filter(d=>!existing.some(x=>x.candidateId===d.candidateId&&x.jobId===d.jobId))];localStorage.setItem("how-qa-applications",JSON.stringify(merged));setApplications(merged);setSeeded(true)}catch{setError("לא ניתן ליצור מועמדויות QA.")}};
 const update=<K extends keyof Job>(key:K,value:Job[K])=>{setJob(prev=>({...prev,[key]:value}));setSaved(false)};
 const changeCriterion=(id:string,patch:Partial<Criterion>)=>update("criteria",job.criteria.map(c=>c.id===id?{...c,...patch}:c));
 const addCriterion=()=>{const text=newCriterion.trim();if(!text)return;update("criteria",[...job.criteria,{id:"qa-"+Date.now()+"-"+job.criteria.length,text,priority:"flexible"}]);setNewCriterion("")};
 const addQuestion=()=>{const text=newQuestion.trim();if(!text||job.screeningQuestions.length>=3)return;update("screeningQuestions",[...job.screeningQuestions,text]);setNewQuestion("")};
 const save=()=>{if(!job.title.trim()||!job.description.trim()){setError(en?"Title and description are required.":"יש למלא שם משרה ותיאור.");return}if(job.criteria.some(c=>!c.text.trim())){setError(en?"Every criterion needs text.":"יש למלא טקסט בכל דרישה או למחוק אותה.");return}try{localStorage.setItem(storageKey,JSON.stringify(job));setEdit(false);setSaved(true);setError("")}catch{setError(en?"Could not save locally.":"לא ניתן לשמור בדפדפן.")}};
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">HOW?</Link><Link href="/recruiter/jobs">← {en?"Jobs":"משרות"}</Link></nav>
 <section style={{padding:"35px 0",maxWidth:940,margin:"auto"}}>
 <span className="eyebrow">{en?"QA demo job workspace":"סביבת משרה · נתוני QA לדוגמה"}</span>
 <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",flexWrap:"wrap"}}>
 <div><h1>{job.title}</h1><p>{job.status} · {job.location} · {job.employment}</p></div>
 <button className="button" type="button" onClick={()=>{setEdit(v=>!v);setSaved(false);setError("")}}>{edit?(en?"Cancel editing":"ביטול עריכה"):(en?"Edit job":"עריכת משרה")}</button></div>
 {saved&&<p role="status" style={{color:"#166534"}}>{en?"Saved in this browser for QA only, not in the database.":"השינויים נשמרו בדפדפן לצורכי QA בלבד, ולא במסד הנתונים."}</p>}
 <div className="choice" style={{marginTop:20}}>
 <h2>{en?"Job details":"פרטי המשרה"}</h2>
 {edit?<form onSubmit={e=>{e.preventDefault();save()}} style={{display:"grid",gap:16}}>
 <label>{en?"Job title":"שם המשרה"}<input required style={field} value={job.title} onChange={e=>update("title",e.target.value)}/></label>
 <label>{en?"Description":"תיאור התפקיד"}<textarea required style={{...field,minHeight:130}} value={job.description} onChange={e=>update("description",e.target.value)}/></label>
 <section style={{padding:16,border:"1px solid #ddd6fe",borderRadius:14,display:"grid",gap:12}}>
 <h3 style={{margin:0}}>{en?"Screening criteria — recruiter decides":"קריטריונים לסינון — המגייסת קובעת"}</h3>
 <p style={{margin:0,color:"#64748b"}}>{en?"Set each requirement as must-have, preferred or flexible. No AI classification is applied here.":"לכל דרישה בחרי חובה, יתרון או גמיש. אין כאן סיווג אוטומטי של AI."}</p>
 {job.criteria.map((c,i)=><div key={c.id} style={{display:"grid",gap:8,padding:12,border:"1px solid #e2e8f0",borderRadius:12}}>
 <label>{en?"Requirement":"דרישה"} {i+1}<input aria-label={(en?"Requirement ":"דרישה ")+(i+1)} style={field} value={c.text} onChange={e=>changeCriterion(c.id,{text:e.target.value})}/></label>
 <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
 <label style={{flex:"1 1 180px"}}>{en?"Priority":"סיווג"}<select style={field} value={c.priority} onChange={e=>changeCriterion(c.id,{priority:e.target.value as Priority})}>{priorities.map(p=><option key={p.value} value={p.value}>{en?p.en:p.he}</option>)}</select></label>
 <button type="button" style={{padding:10,border:"1px solid #ddd6fe",borderRadius:10,background:"white",cursor:"pointer"}} onClick={()=>update("criteria",job.criteria.filter(x=>x.id!==c.id))}>{en?"Remove requirement":"מחיקת דרישה"}</button>
 </div></div>)}
 <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><input style={{...field,flex:"1 1 230px"}} placeholder={en?"New requirement":"הוספת דרישה חדשה"} value={newCriterion} onChange={e=>setNewCriterion(e.target.value)}/><button type="button" onClick={addCriterion} disabled={!newCriterion.trim()} style={{padding:"10px 16px",border:"1px solid #ddd6fe",borderRadius:10,cursor:"pointer"}}>{en?"Add requirement":"הוספת דרישה"}</button></div>
 <small>{en?"Existing free-text requirements are retained below until explicitly converted.":"הדרישות מהשדה הישן נשמרות בנפרד עד שהמגייסת תסווג אותן במפורש."}</small>
 <label>{en?"Legacy requirements text":"טקסט דרישות קודם (לבדיקה)"}<textarea style={{...field,minHeight:85}} value={job.requirements} onChange={e=>update("requirements",e.target.value)}/></label>
 </section>
 <label>{en?"Location":"מיקום"}<input style={field} value={job.location} onChange={e=>update("location",e.target.value)}/></label>
 <label>{en?"Work arrangement":"מתכונת עבודה"}<select style={field} value={job.remote} onChange={e=>update("remote",e.target.value)}><option value="onsite">{en?"On site":"מהמשרד"}</option><option value="hybrid">{en?"Hybrid":"היברידית"}</option><option value="remote">{en?"Remote":"מרחוק"}</option></select></label>
 <label>{en?"Employment":"היקף משרה"}<select style={field} value={job.employment} onChange={e=>update("employment",e.target.value)}><option>משרה מלאה</option><option>משרה חלקית</option><option>משמרות</option><option>Full time</option><option>Part time</option></select></label>
 <label>{en?"Workdays and hours":"ימים ושעות עבודה"}<input style={field} value={job.workHours} onChange={e=>update("workHours",e.target.value)} placeholder={en?"e.g. Sun–Thu 09:00–17:00":"למשל א׳–ה׳ 09:00–17:00"}/></label>
 <label>{en?"Internal salary range":"טווח שכר פנימי"}<input style={field} value={job.salary} onChange={e=>update("salary",e.target.value)}/></label>
 <label style={{display:"flex",gap:8,alignItems:"center"}}><input type="checkbox" checked={job.confidential} onChange={e=>update("confidential",e.target.checked)}/>{en?"Confidential posting — hide company name":"פרסום דיסקרטי — הסתרת שם החברה"}</label>
 <section style={{padding:16,border:"1px solid #ddd6fe",borderRadius:14,display:"grid",gap:12}}>
 <h3 style={{margin:0}}>{en?"Candidate screening questions (up to 3)":"שאלות הבהרה למועמדת (עד 3)"}</h3>
 {job.screeningQuestions.map((q,i)=><div key={i} style={{display:"flex",gap:8}}><input style={field} value={q} aria-label={(en?"Question ":"שאלה ")+(i+1)} onChange={e=>update("screeningQuestions",job.screeningQuestions.map((x,j)=>j===i?e.target.value:x))}/><button type="button" onClick={()=>update("screeningQuestions",job.screeningQuestions.filter((_,j)=>j!==i))}>{en?"Remove":"מחקי"}</button></div>)}
 {job.screeningQuestions.length<3&&<div style={{display:"flex",gap:8}}><input style={field} placeholder={en?"New question":"שאלה חדשה"} value={newQuestion} onChange={e=>setNewQuestion(e.target.value)}/><button type="button" disabled={!newQuestion.trim()} onClick={addQuestion}>{en?"Add":"הוספה"}</button></div>}
 </section>
 <label>{en?"Status":"סטטוס"}<select style={field} value={job.status} onChange={e=>update("status",e.target.value)}><option>פעילה</option><option>מוקפאת</option><option>סגורה</option></select></label>
 {error&&<p role="alert" style={{color:"#b42318"}}>{error}</p>}
 <button className="button" type="submit">{en?"Save QA changes":"שמירת שינויים ב־QA"}</button>
 </form>:<><h3>{en?"Description":"תיאור התפקיד"}</h3><p style={{whiteSpace:"pre-wrap"}}>{job.description}</p><h3>{en?"Screening criteria":"קריטריונים לסינון"}</h3>
 {job.criteria.length?job.criteria.map(c=><p key={c.id}>• {c.text} — <b>{en?priorities.find(p=>p.value===c.priority)?.en:priorities.find(p=>p.value===c.priority)?.he}</b></p>):<p style={{color:"#64748b"}}>{en?"No criteria classified yet.":"טרם סווגו דרישות."}</p>}
 <h3>{en?"Legacy requirements":"דרישות בטקסט חופשי"}</h3><p style={{whiteSpace:"pre-wrap"}}>{job.requirements}</p>
 <p><b>{en?"Location":"מיקום"}:</b> {job.location}</p><p><b>{en?"Work arrangement":"מתכונת"}:</b> {job.remote==="hybrid"?"היברידית":job.remote==="remote"?"מרחוק":"מהמשרד"}</p>
 <p><b>{en?"Employment":"היקף"}:</b> {job.employment}</p><p><b>{en?"Work hours":"שעות"}:</b> {job.workHours||"לא הוגדר"}</p>
 <p><b>{en?"Confidential":"דיסקרטי"}:</b> {job.confidential?"כן":"לא"}</p>
 <p><b>{en?"Screening questions":"שאלות סינון"}:</b> {job.screeningQuestions.length}</p>
 <p><b>{en?"Status":"סטטוס"}:</b> {job.status}</p><p><b>{en?"Internal salary":"שכר פנימי"}:</b> {job.salary||"לא הוגדר"}</p></>}
 </div>
 <section style={{marginTop:30,display:"grid",gap:16}}>
 <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><div><h2 style={{margin:0}}>מועמדים למשרה</h2><p style={{color:"#64748b",margin:"6px 0 0"}}>מוצגות רק מועמדויות QA שנוצרו למשרה זו, ולא כל המועמדים במאגר.</p></div><button type="button" onClick={seedApplications} style={{padding:"11px 16px",border:"1px solid #c9bfff",borderRadius:10,background:"#f7f5ff",color:"#3926a6",fontWeight:700,cursor:"pointer"}}>יצירת מועמדויות בדיקה</button></div>
 {seeded&&<p role="status">מועמדויות QA נוצרו ונשמרו בדפדפן.</p>}
 {[{key:"review",label:"ממתינים לבדיקה"},{key:"process",label:"בתהליך"},{key:"rejected",label:"לא ממשיכים"},{key:"hired",label:"התקבלו"}].map(group=>{const matches=applications.filter(a=>a.jobId==="qa-demo-service"&&a.status===group.key);return <div className="choice" key={group.key} style={{margin:0,padding:20}}><h3 style={{margin:"0 0 12px"}}>{group.label} · {matches.length}</h3>{matches.length===0?<p style={{color:"#64748b",margin:0}}>אין מועמדים בשלב זה.</p>:<div style={{display:"grid",gap:10}}>{matches.map(a=>{const c=qaCandidates.find(x=>x.id===a.candidateId);return c?<div key={a.candidateId} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",padding:12,border:"1px solid #eee9ff",borderRadius:10}}><div><strong>{c.name}</strong><p style={{margin:"4px 0",fontSize:13}}>{c.role} · {c.experience} · {c.city}</p></div><Link href={"/recruiter/candidates/qa-profile?id="+c.id} style={{color:"#4935c2",fontWeight:700}}>צפייה בפרופיל ←</Link></div>:null})}</div>}</div>})}
 <small>הגשות QA בלבד. אין שליחת מועמדות אמיתית או חישוב התאמה אוטומטי.</small>
 </section>
 </section></main>
}