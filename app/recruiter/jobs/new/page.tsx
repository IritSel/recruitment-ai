"use client";
import Link from "next/link";
import {useState} from "react";
type Priority="must"|"preferred"|"flexible";
type Criterion={id:number;text:string;priority:Priority};
const choices=[{value:"must",label:"חובה"},{value:"preferred",label:"יתרון"},{value:"flexible",label:"גמיש"}] as const;
const field:React.CSSProperties={padding:14,border:"1px solid #ddd6fe",borderRadius:12,font:"inherit",width:"100%",boxSizing:"border-box"};
export default function NewJob(){
 const [step,setStep]=useState(0);
 const [title,setTitle]=useState(""),[desc,setDesc]=useState(""),[salary,setSalary]=useState(""),[employment,setEmployment]=useState("משרה מלאה");
 const [criteria,setCriteria]=useState<Criterion[]>([]);
 const [newText,setNewText]=useState("");
 const [nextId,setNextId]=useState(1);
 const [saved,setSaved]=useState(false);
 function add(){const text=newText.trim();if(!text)return;setCriteria(old=>[...old,{id:nextId,text,priority:"flexible"}]);setNextId(n=>n+1);setNewText("")}
 function change(id:number,patch:Partial<Criterion>){setCriteria(old=>old.map(c=>c.id===id?{...c,...patch}:c))}
 function saveQa(){try{localStorage.setItem("how-qa-job-draft",JSON.stringify({title,description:desc,salary,employment,criteria}));setSaved(true)}catch{setSaved(false)}}
 return <main className="shell"><section className="choice" style={{maxWidth:760,margin:"55px auto",display:"grid",gap:16}}>
 <button type="button" onClick={()=>step===1?setStep(0):window.location.assign("/recruiter/jobs")} style={{border:0,background:"transparent",cursor:"pointer",justifySelf:"start"}}>→ {step===1?"חזרה לעריכה":"חזרה למשרות"}</button>
 <span className="eyebrow">{step===1?"בדיקת פרופיל המשרה · QA":"יצירת משרה · QA"}</span>
 <h1 style={{margin:0}}>{step===1?title:"יצירת משרה"}</h1>
 {step===0?<form onSubmit={e=>{e.preventDefault();if(criteria.length===0||criteria.some(c=>!c.text.trim())||newText.trim())return;setStep(1);setSaved(false)}} style={{display:"grid",gap:14}}>
 <p>אפשר להתחיל מתיאור חופשי. כאן המגייסת מגדירה בעצמה מה חובה, מה יתרון ומה גמיש.</p>
 <label>שם המשרה<input required style={field} value={title} onChange={e=>setTitle(e.target.value)}/></label>
 <label>תיאור התפקיד והדרישות<textarea required style={{...field,minHeight:160}} value={desc} onChange={e=>setDesc(e.target.value)}/></label>
 <label>טווח שכר פנימי<input style={field} value={salary} onChange={e=>setSalary(e.target.value)}/></label>
 <label>היקף משרה<select style={field} value={employment} onChange={e=>setEmployment(e.target.value)}><option>משרה מלאה</option><option>משרה חלקית</option><option>משמרות</option></select></label>
 <section style={{display:"grid",gap:12}}>
 <h2>דרישות המשרה — חובה, יתרון או גמיש</h2>
 <p>הגדירי את הדרישות וסווגי כל אחת לפני המעבר למסך האישור. הסיווג נקבע על ידך בלבד.</p>
 {criteria.length===0&&<p style={{color:"#64748b"}}>טרם הוגדרו דרישות מסווגות.</p>}
 {criteria.map((c,i)=><div key={c.id} style={{padding:14,border:"1px solid #ddd6fe",borderRadius:12,display:"grid",gap:10}}>
 <label>דרישה {i+1}<input style={field} value={c.text} onChange={e=>change(c.id,{text:e.target.value})}/></label>
 <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"end"}}>
 <label style={{flex:"1 1 200px"}}>סיווג<select style={field} value={c.priority} onChange={e=>change(c.id,{priority:e.target.value as Priority})}>{choices.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}</select></label>
 <button type="button" onClick={()=>setCriteria(old=>old.filter(x=>x.id!==c.id))} style={{padding:12,borderRadius:10,border:"1px solid #ddd6fe",background:"white",cursor:"pointer"}}>מחיקת דרישה</button></div></div>)}
 <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><input style={{...field,flex:"1 1 230px"}} value={newText} onChange={e=>setNewText(e.target.value)} placeholder="הקלידי דרישה נוספת"/><button type="button" onClick={add} disabled={!newText.trim()} style={{borderRadius:10,padding:12,border:"1px solid #ddd6fe",cursor:"pointer"}}>הוספת דרישה</button></div>
 </section>
 {criteria.length===0&&<p role="alert" style={{color:"#92400e"}}>הוסיפי לפחות דרישה אחת כדי להמשיך לבדיקה.</p>}
 <button className="button" disabled={criteria.length===0||criteria.some(c=>!c.text.trim())||!!newText.trim()}>המשך לבדיקה ואישור</button></form>:<>
 <section style={{padding:16,border:"1px solid #e9e4ff",borderRadius:14,background:"#faf9ff"}}>
 <h2>תיאור המשרה</h2><p style={{whiteSpace:"pre-wrap"}}>{desc}</p><p><b>היקף:</b> {employment}</p><p><b>שכר פנימי:</b> {salary||"לא הוגדר"}</p></section>
 <section style={{display:"grid",gap:12}}>
 <h2>סיכום דרישות המשרה</h2>
 {criteria.map((criterion,i)=><div key={criterion.id} style={{padding:12,border:"1px solid #ddd6fe",borderRadius:10,display:"flex",justifyContent:"space-between",gap:12}}>
 <span>{i+1}. {criterion.text}</span><strong>{choices.find(x=>x.value===criterion.priority)?.label}</strong>
 </div>)}
 <button type="button" onClick={()=>setStep(0)} style={{border:"1px solid #ddd6fe",background:"white",padding:12,borderRadius:10,cursor:"pointer"}}>עריכת הדרישות</button>
 </section>
 <div style={{padding:12,borderRadius:10,background:"#f8fafc",fontSize:13}}>בדיקת QA בלבד: שמירת טיוטה בדפדפן, ללא פרסום משרה או הפעלת סינון מועמדות.</div>
 {saved&&<p role="status" style={{color:"#166534"}}>טיוטת QA נשמרה בדפדפן. הסיווגים: {criteria.map(c=>c.text+" — "+choices.find(x=>x.value===c.priority)?.label).join(" | ")||"אין דרישות"}.</p>}
 <button className="button" type="button" onClick={saveQa} disabled={criteria.some(c=>!c.text.trim())}>שמירת טיוטת QA</button>
 <Link href="/recruiter/jobs">חזרה לרשימת המשרות</Link>
 </>}
 </section></main>
}