"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useSiteLanguage} from "../../components/useSiteLanguage";
type Submission={id:string;jobId:string;title:string;company:string;status:string;submittedAt:string};
type RecruiterApplication={candidateId:string;jobId:string;sourceJobId?:string;status:string;submittedAt?:string;candidateName?:string};
const key="how-qa-candidate-applications-v1";
const recruiterKey="how-qa-applications";
const mappings:Record<string,string>={"1":"qa-demo-service","2":"qa-demo-service","3":"qa-demo-team","4":"qa-demo-backoffice"};
const statuses:Record<string,{label:string;step:number;detail:string}>={
 review:{label:"התקבלה — ממתינה לבדיקה",step:1,detail:"המועמדות התקבלה בתור הבדיקות של המגייסת."},
 clarification:{label:"נדרשת השלמת מידע",step:2,detail:"המגייסת סימנה מידע שיש לברר לפני המשך הטיפול."},
 process:{label:"בתהליך גיוס",step:3,detail:"המגייסת העבירה את המועמדות לשלב הטיפול."},
 rejected:{label:"המועמדות לא ממשיכה",step:4,detail:"המגייסת החליטה שלא להתקדם עם המועמדות."},
 hired:{label:"התקבלה לעבודה",step:4,detail:"המגייסת סימנה את התהליך כהושלם בהצלחה."},
 closed:{label:"התהליך נסגר",step:4,detail:"התהליך הסתיים."}
};
function load(){
 const raw=JSON.parse(localStorage.getItem(key)||"[]");
 const items:Submission[]=Array.isArray(raw)?raw:[];
 const p=JSON.parse(localStorage.getItem("how-qa-candidate-profiles-v2")||"[]");
 const candidate=Array.isArray(p)?p[0]:null;
 const candidateId=candidate?.id||"qa-noa-levi";
 const rRaw=JSON.parse(localStorage.getItem(recruiterKey)||"[]");
 const recruiter:RecruiterApplication[]=Array.isArray(rRaw)?rRaw:[];
 let updated=false;
 for(const a of items){
  if(!recruiter.some(x=>x.candidateId===candidateId&&x.sourceJobId===a.jobId)){
   recruiter.unshift({candidateId,jobId:mappings[a.jobId]||a.jobId,sourceJobId:a.jobId,status:"review",submittedAt:a.submittedAt,candidateName:candidate?.name||"מועמדת QA"});
   updated=true;
  }
 }
 if(updated)localStorage.setItem(recruiterKey,JSON.stringify(recruiter));
 return items.map(a=>({...a,status:recruiter.find(x=>x.candidateId===candidateId&&x.sourceJobId===a.jobId)?.status||"review"}));
}
export default function Applications(){
 const en=useSiteLanguage()==="en";
 const [items,setItems]=useState<Submission[]>([]);
 const [qa,setQa]=useState(false);
 useEffect(()=>{
  const refresh=()=>{try{const context=JSON.parse(sessionStorage.getItem("qa-demo-context")||"null");const active=context?.kind==="demo"&&context?.role==="candidate";setQa(active);setItems(active?load():[])}catch{setItems([])}};
  refresh();window.addEventListener("focus",refresh);window.addEventListener("storage",refresh);
  return()=>{window.removeEventListener("focus",refresh);window.removeEventListener("storage",refresh)}
 },[]);
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">HOW?</Link><div className="navlinks candidateTabs"><Link href="/candidate/jobs">{en?"Jobs":"משרות"}</Link><b>{en?"My applications":"המועמדויות שלי"}</b><Link href="/candidate/profile">{en?"My profile":"הפרופיל שלי"}</Link></div></nav>
 <section style={{padding:"28px 0 65px",maxWidth:900,margin:"auto",display:"grid",gap:13}}>
 <h1 style={{fontSize:27,margin:"0 0 5px"}}>{en?"My applications":"המועמדויות שלי"}</h1>
 {qa&&<p style={{fontSize:12,color:"#755e3e",background:"#fff7e6",padding:12,borderRadius:10,margin:0}}>QA — מעקב אחר סטטוס המגייסת באותו דפדפן. אין עדיין סנכרון בין מכשירים או שליחה למעסיקים אמיתיים.</p>}
 {items.length?items.map(item=>{const status=statuses[item.status]||statuses.review;return <article className="choice" key={item.id} style={{margin:0,padding:19,display:"grid",gap:11}}>
 <div style={{display:"flex",alignItems:"start",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
 <div><h2 style={{fontSize:18,margin:"0 0 5px"}}>{item.title}</h2><small>{item.company} · הוגשה ב־{new Date(item.submittedAt).toLocaleDateString("he-IL")}</small></div>
 <strong style={{fontSize:12,color:"#503487",background:"#f0eafb",padding:"7px 10px",borderRadius:8}}>{status.label}</strong>
 </div>
 <div aria-label="שלבי המועמדות" style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5}}>
 {["הוגשה","בדיקה","בתהליך","החלטה"].map((name,i)=><div key={name} style={{display:"grid",gap:5}}><div style={{height:5,background:i<status.step?"#6d50ad":"#e8e2f3",borderRadius:8}}/><span style={{fontSize:11,color:i<status.step?"#503487":"#9087a4"}}>{name}</span></div>)}
 </div>
 <p style={{fontSize:13,margin:0,color:"#665c80"}}>{status.detail}</p>
 <div><Link className="button" href={"/candidate/jobs/"+item.jobId}>לפרטי המשרה</Link></div>
 </article>}):<div className="choice" style={{padding:24}}><h2>עדיין אין מועמדויות</h2><p>{qa?"הגישי מועמדות למשרת QA כדי לבדוק שהמגייסת מקבלת אותה.":"המועמדויות יופיעו לאחר חיבור שירות הגשה פעיל."}</p><Link className="button" href="/candidate/jobs">מעבר למשרות</Link></div>}
 </section></main>
}