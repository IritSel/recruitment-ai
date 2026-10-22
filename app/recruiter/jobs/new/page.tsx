"use client";
import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useSiteLanguage} from "../../../components/useSiteLanguage";
type Priority="must"|"preferred"|"flexible";
type Criterion={id:number;text:string;priority:Priority};
const choices=[{value:"must",label:"חובה",english:"Required"},{value:"preferred",label:"יתרון",english:"Preferred"},{value:"flexible",label:"גמיש",english:"Flexible"}] as const;
const field:React.CSSProperties={padding:14,border:"1px solid #ddd6fe",borderRadius:12,font:"inherit",width:"100%",boxSizing:"border-box"};
export default function NewJob(){
 const router=useRouter();
 const en=useSiteLanguage()==="en";
 const [step,setStep]=useState(0);
 const [title,setTitle]=useState(""),[desc,setDesc]=useState(""),[salary,setSalary]=useState(""),[employment,setEmployment]=useState("משרה מלאה");
 const [criteria,setCriteria]=useState<Criterion[]>([]);
 const [newText,setNewText]=useState("");
 const [nextId,setNextId]=useState(1);
 const [saved,setSaved]=useState(false);
 const [publishError,setPublishError]=useState<"company"|"storage"|null>(null);
 function add(){const text=newText.trim();if(!text)return;setCriteria(old=>[...old,{id:nextId,text,priority:"flexible"}]);setNextId(n=>n+1);setNewText("")}
 function change(id:number,patch:Partial<Criterion>){setCriteria(old=>old.map(c=>c.id===id?{...c,...patch}:c))}
 function publishQa(){try{const ctx=JSON.parse(sessionStorage.getItem("qa-demo-context")||"{}");if(ctx.kind!=="demo"||ctx.role!=="recruiter"||!ctx.companyId){setPublishError("company");return;}const job={id:"qa-"+Date.now(),companyId:ctx.companyId,title,description:desc,salary,employment,criteria:criteria.map(c=>({...c})),createdAt:new Date().toISOString(),qa:true};const raw=localStorage.getItem("how-qa-published-jobs");let existing:unknown=[];try{existing=raw?JSON.parse(raw):[]}catch{}const jobs=Array.isArray(existing)?existing:[];localStorage.setItem("how-qa-published-jobs",JSON.stringify([job,...jobs]));setPublishError(null);router.push("/recruiter/jobs?qaPublished=1")}catch{setPublishError("storage")}}
 return <main className="shell" dir={en?"ltr":"rtl"}><section className="choice" style={{maxWidth:760,margin:"55px auto",display:"grid",gap:16}}>
 <button type="button" onClick={()=>step===1?setStep(0):window.location.assign("/recruiter/jobs")} style={{border:0,background:"transparent",cursor:"pointer",justifySelf:"start"}}>→ {step===1?(en?"Back to editing":"חזרה לעריכה"):(en?"Back to jobs":"חזרה למשרות")}</button>
 <span className="eyebrow">{step===1?(en?"Review job posting · QA":"בדיקת פרופיל המשרה · QA"):(en?"Create job · QA":"יצירת משרה · QA")}</span>
 <h1 style={{margin:0}}>{step===1?title:(en?"Create job":"יצירת משרה")}</h1>
 {step===0?<form onSubmit={e=>{e.preventDefault();if(criteria.length===0||criteria.some(c=>!c.text.trim())||newText.trim())return;setStep(1);setSaved(false);setPublishError(null)}} style={{display:"grid",gap:14}}>
 <p>{en?"Start with a free-text job description. You decide which requirements are essential, preferred, or flexible.":"אפשר להתחיל מתיאור חופשי. כאן המגייסת מגדירה בעצמה מה חובה, מה יתרון ומה גמיש."}</p>
 <label>{en?"Job title":"שם המשרה"}<input required style={field} value={title} onChange={e=>setTitle(e.target.value)}/></label>
 <label>{en?"Job description and requirements":"תיאור התפקיד והדרישות"}<textarea required style={{...field,minHeight:160}} value={desc} onChange={e=>setDesc(e.target.value)}/></label>
 <label>{en?"Internal salary range":"טווח שכר פנימי"}<input style={field} value={salary} onChange={e=>setSalary(e.target.value)}/></label>
 <label>{en?"Employment type":"היקף משרה"}<select style={field} value={employment} onChange={e=>setEmployment(e.target.value)}><option value="משרה מלאה">{en?"Full-time":"משרה מלאה"}</option><option value="משרה חלקית">{en?"Part-time":"משרה חלקית"}</option><option value="משמרות">{en?"Shift-based":"משמרות"}</option></select></label>
 <section style={{display:"grid",gap:12}}>
 <h2>{en?"Job requirements — essential, preferred, or flexible":"דרישות המשרה — חובה, יתרון או גמיש"}</h2>
 <p>{en?"Add each requirement and set its priority before reviewing the posting. You control the classification.":"הגדירי את הדרישות וסווגי כל אחת לפני המעבר למסך האישור. הסיווג נקבע על ידך בלבד."}</p>
 {criteria.length===0&&<p style={{color:"#64748b"}}>{en?"No requirements have been classified yet.":"טרם הוגדרו דרישות מסווגות."}</p>}
 {criteria.map((c,i)=><div key={c.id} style={{padding:14,border:"1px solid #ddd6fe",borderRadius:12,display:"grid",gap:10}}>
 <label>{en?"Requirement":"דרישה"} {i+1}<input style={field} value={c.text} onChange={e=>change(c.id,{text:e.target.value})}/></label>
 <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"end"}}>
 <label style={{flex:"1 1 200px"}}>{en?"Priority":"סיווג"}<select style={field} value={c.priority} onChange={e=>change(c.id,{priority:e.target.value as Priority})}>{choices.map(x=><option key={x.value} value={x.value}>{en?x.english:x.label}</option>)}</select></label>
 <button type="button" onClick={()=>setCriteria(old=>old.filter(x=>x.id!==c.id))} style={{padding:12,borderRadius:10,border:"1px solid #ddd6fe",background:"white",cursor:"pointer"}}>{en?"Remove requirement":"מחיקת דרישה"}</button></div></div>)}
 <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><input style={{...field,flex:"1 1 230px"}} value={newText} onChange={e=>setNewText(e.target.value)} placeholder={en?"Add another requirement":"הקלידי דרישה נוספת"}/><button type="button" onClick={add} disabled={!newText.trim()} style={{borderRadius:10,padding:12,border:"1px solid #ddd6fe",cursor:"pointer"}}>{en?"Add requirement":"הוספת דרישה"}</button></div>
 </section>
 {criteria.length===0&&<p role="alert" style={{color:"#92400e"}}>{en?"Add at least one requirement to continue.":"הוסיפי לפחות דרישה אחת כדי להמשיך לבדיקה."}</p>}
 <button className="button" disabled={criteria.length===0||criteria.some(c=>!c.text.trim())||!!newText.trim()}>{en?"Review and confirm":"המשך לבדיקה ואישור"}</button></form>:<>
 <section style={{padding:16,border:"1px solid #e9e4ff",borderRadius:14,background:"#faf9ff"}}>
 <h2>{en?"Job description":"תיאור המשרה"}</h2><p style={{whiteSpace:"pre-wrap"}}>{desc}</p><p><b>{en?"Employment type:":"היקף:"}</b> {employment}</p><p><b>{en?"Internal salary:":"שכר פנימי:"}</b> {salary||(en?"Not specified":"לא הוגדר")}</p></section>
 <section style={{display:"grid",gap:12}}>
 <h2>{en?"Requirements summary":"סיכום דרישות המשרה"}</h2>
 {criteria.map((criterion,i)=><div key={criterion.id} style={{padding:12,border:"1px solid #ddd6fe",borderRadius:10,display:"flex",justifyContent:"space-between",gap:12}}>
 <span>{i+1}. {criterion.text}</span><strong>{choices.find(x=>x.value===criterion.priority)?.[en?"english":"label"]}</strong>
 </div>)}
 <button type="button" onClick={()=>setStep(0)} style={{border:"1px solid #ddd6fe",background:"white",padding:12,borderRadius:10,cursor:"pointer"}}>{en?"Edit requirements":"עריכת הדרישות"}</button>
 </section>
 <div style={{padding:12,borderRadius:10,background:"#f8fafc",fontSize:13}}>{en?"QA posting: This job is saved in this browser only. It will not reach real candidates or trigger screening.":"פרסום QA: המשרה תופיע ברשימת המשרות בדפדפן זה בלבד. לא תפורסם למועמדות אמיתיות ולא תפעיל סינון."}</div>
 {publishError==="company"&&<div role="alert" style={{color:"#92400e",background:"#fffbeb",padding:12,borderRadius:10}}><strong>{en?"Company selection required":"נדרשת בחירת חברה"}</strong><p>{en?"This QA job cannot be published because your session is not linked to a demo company as a recruiter. Return to the QA workspace, select Recruiter and a company, then create the job again.":"לא ניתן לפרסם משרת QA ללא שיוך לחשבון מגייסת בחברת דמו. יש לחזור לסביבת QA, לבחור מגייסת וחברה וליצור מחדש את המשרה."}</p><Link href="/qa">{en?"Select QA company":"בחירת חברת QA"}</Link></div>}
 {publishError==="storage"&&<p role="alert" style={{color:"#b42318"}}>{en?"Could not save the QA job in this browser. Check that browser storage is enabled and try again.":"לא ניתן לשמור את משרת ה־QA בדפדפן. בדקי שהשמירה המקומית מופעלת ונסי שוב."}</p>}
 <button className="button" type="button" onClick={publishQa} disabled={criteria.some(c=>!c.text.trim())}>{en?"Publish QA job and view listings":"פרסום משרת QA וצפייה ברשימה"}</button>
 <Link href="/recruiter/jobs">{en?"Back to job listings":"חזרה לרשימת המשרות"}</Link>
 </>}
 </section></main>
}