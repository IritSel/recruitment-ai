"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useSiteLanguage} from "../../components/useSiteLanguage";
type QaAction={id:string;candidateId:string;sourceJobId:string;kind:"question"|"meeting";message:string;date?:string;time?:string;mode?:string;status:"pending"|"answered"|"accepted"|"declined";response?:string;createdAt:string};
type Submission={id:string;jobId:string;title:string;company:string;status:string;submittedAt:string};
type RecruiterApplication={candidateId:string;jobId:string;sourceJobId?:string;status:string;submittedAt?:string;candidateName?:string};
const key="how-qa-candidate-applications-v1";
const recruiterKey="how-qa-applications";
const actionKey="how-qa-application-actions-v1";
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
 const candidate=Array.isArray(p)?p.find((x:{id:string})=>x.id===localStorage.getItem("how-qa-selected-candidate-id"))||p[0]:null;
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
 const [actions,setActions]=useState<QaAction[]>([]);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 useEffect(()=>{
  const refresh=()=>{try{const context=JSON.parse(sessionStorage.getItem("qa-demo-context")||"null");const active=context?.kind==="demo"&&context?.role==="candidate";setQa(active);setItems(active?load():[]);const raw=JSON.parse(localStorage.getItem(actionKey)||"[]");setActions(active&&Array.isArray(raw)?raw:[])}catch{setItems([])}};
  refresh();window.addEventListener("focus",refresh);window.addEventListener("storage",refresh);
  return()=>{window.removeEventListener("focus",refresh);window.removeEventListener("storage",refresh)}
 },[]);

 function respond(action:QaAction,status:"answered"|"accepted"|"declined"){
  const value=(answers[action.id]||"").trim();
  if(status==="answered"&&!value)return;
  try{
   const raw=JSON.parse(localStorage.getItem(actionKey)||"[]");
   const list:QaAction[]=Array.isArray(raw)?raw:[];
   const next=list.map(x=>x.id===action.id?{...x,status,response:status==="answered"?value:status==="declined"?"המועמדת דחתה את ההזמנה":"המועמדת אישרה את ההזמנה"}:x);
   localStorage.setItem(actionKey,JSON.stringify(next));
   setActions(next);
  }catch{}
 }
 function demoActions(){
  const first=items[0];if(!first)return;
  const profiles=JSON.parse(localStorage.getItem("how-qa-candidate-profiles-v2")||"[]");
  const selected=Array.isArray(profiles)?profiles.find((x:{id:string})=>x.id===localStorage.getItem("how-qa-selected-candidate-id"))||profiles[0]:null;
  const candidateId=selected?.id||"qa-noa-levi";
  const now=new Date();
  const upcoming=new Date(now.getTime()+7*86400000).toISOString().slice(0,10);
  const examples:QaAction[]=[
   {id:"demo-question-"+candidateId+"-"+first.jobId,candidateId,sourceJobId:first.jobId,kind:"question",message:"נשמח לשמוע על ניסיון בעבודה עם לקוחות ועל מערכות השירות שבהן השתמשת.",status:"pending",createdAt:now.toISOString()},
   {id:"demo-meeting-"+candidateId+"-"+first.jobId,candidateId,sourceJobId:first.jobId,kind:"meeting",message:"נשמח להזמינך לשיחת היכרות קצרה. אנא אשרי את המועד או דחי את ההזמנה.",date:upcoming,time:"10:00",mode:"video",status:"pending",createdAt:now.toISOString()}
  ];
  try{
   const raw=JSON.parse(localStorage.getItem(actionKey)||"[]");
   const list:QaAction[]=Array.isArray(raw)?raw:[];
   const next=[...list,...examples.filter(x=>!list.some(a=>a.id===x.id))];
   localStorage.setItem(actionKey,JSON.stringify(next));setActions(next);
  }catch{}
 }
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">HOW?</Link><div className="navlinks candidateTabs"><Link href="/candidate/jobs">{en?"Jobs":"משרות"}</Link><b>{en?"My applications":"המועמדויות שלי"}</b><Link href="/candidate/profile">{en?"My profile":"הפרופיל שלי"}</Link></div></nav>
 <section style={{padding:"28px 0 65px",maxWidth:900,margin:"auto",display:"grid",gap:13}}>
 <h1 style={{fontSize:27,margin:"0 0 5px"}}>{en?"My applications":"המועמדויות שלי"}</h1>
 {qa&&<p style={{fontSize:12,color:"#755e3e",background:"#fff7e6",padding:12,borderRadius:10,margin:0}}>QA — מעקב אחר סטטוס המגייסת באותו דפדפן. אין עדיין סנכרון בין מכשירים או שליחה למעסיקים אמיתיים.</p>}
 {qa&&items.length>0&&<button type="button" onClick={demoActions} style={{justifySelf:"start",padding:"8px 12px",background:"#f0eafb",color:"#553c8c",border:"1px solid #d8c9ef",borderRadius:9,cursor:"pointer"}}>הצגת דמו: שאלת מגייסת והזמנה לראיון</button>}
 {items.length?items.map(item=>{const status=statuses[item.status]||statuses.review;const profiles=JSON.parse(typeof window!=="undefined"?localStorage.getItem("how-qa-candidate-profiles-v2")||"[]":"[]");const selected=Array.isArray(profiles)?profiles.find((x:{id:string})=>x.id===localStorage.getItem("how-qa-selected-candidate-id"))||profiles[0]:null;const cid=selected?.id||"qa-noa-levi";const jobActions=actions.filter(x=>x.sourceJobId===item.jobId&&x.candidateId===cid);return <article className="choice" key={item.id} style={{margin:0,padding:19,display:"grid",gap:11}}>
 <div style={{display:"flex",alignItems:"start",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
 <div><h2 style={{fontSize:18,margin:"0 0 5px"}}>{item.title}</h2><small>{item.company} · הוגשה ב־{new Date(item.submittedAt).toLocaleDateString("he-IL")}</small></div>
 <strong style={{fontSize:12,color:"#503487",background:"#f0eafb",padding:"7px 10px",borderRadius:8}}>{status.label}</strong>
 </div>
 <div aria-label="שלבי המועמדות" style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:5}}>
 {["הוגשה","בדיקה","בתהליך","החלטה"].map((name,i)=><div key={name} style={{display:"grid",gap:5}}><div style={{height:5,background:i<status.step?"#6d50ad":"#e8e2f3",borderRadius:8}}/><span style={{fontSize:11,color:i<status.step?"#503487":"#9087a4"}}>{name}</span></div>)}
 </div>
 <p style={{fontSize:13,margin:0,color:"#665c80"}}>{status.detail}</p>
 {jobActions.length>0&&<section style={{border:"1px solid #dfd3f2",borderRadius:12,padding:14,background:"#fcfbff",display:"grid",gap:11}}>
 <strong style={{fontSize:15,color:"#422b79"}}>הודעות ופעולות מהמגייסת {jobActions.some(x=>x.status==="pending")?"· נדרשת פעולה":""}</strong>
 {jobActions.map(action=><div key={action.id} style={{border:"1px solid #ebe3f5",borderRadius:10,padding:12,display:"grid",gap:9,background:"white"}}>
 <div style={{display:"flex",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}><strong>{action.kind==="question"?"שאלה מהמגייסת":"הזמנה לראיון"}</strong><span style={{fontSize:12,color:"#695a82"}}>{action.status==="pending"?"ממתין לתגובתך":action.status==="answered"?"נשלחה תשובה":action.status==="accepted"?"ההזמנה אושרה":"ההזמנה נדחתה"}</span></div>
 <p style={{margin:0,fontSize:13,lineHeight:1.6}}>{action.message}</p>
 {action.kind==="meeting"&&<p style={{margin:0,fontSize:13,color:"#4c387c"}}>מועד מוצע: {action.date} בשעה {action.time} · {action.mode==="video"?"שיחת וידאו":action.mode==="phone"?"טלפוני":"פגישה פרונטלית"}</p>}
 {action.status==="pending"&&(action.kind==="question"?<><textarea aria-label="תשובה למגייסת" rows={3} value={answers[action.id]||""} onChange={e=>setAnswers(p=>({...p,[action.id]:e.target.value}))} placeholder="כתבי כאן תשובה לשאלת המגייסת" style={{border:"1px solid #d9cceb",borderRadius:9,padding:11,font:"inherit",width:"100%"}}/><button type="button" disabled={!answers[action.id]?.trim()} className="button" style={{justifySelf:"start"}} onClick={()=>respond(action,"answered")}>שליחת תשובה למגייסת</button></>:<div style={{display:"flex",flexWrap:"wrap",gap:8}}><button type="button" className="button" onClick={()=>respond(action,"accepted")}>אישור הראיון</button><button type="button" onClick={()=>respond(action,"declined")} style={{padding:"8px 12px",border:"1px solid #d7cbe9",background:"white",borderRadius:9}}>המועד לא מתאים</button></div>)}
 {action.status!=="pending"&&action.response&&<p style={{margin:0,color:"#26725d",fontSize:12}}>התגובה שנשלחה: {action.response}</p>}
 </div>)}
 </section>}
 <div><Link className="button" href={"/candidate/jobs/"+item.jobId}>לפרטי המשרה</Link></div>
 </article>}):<div className="choice" style={{padding:24}}><h2>עדיין אין מועמדויות</h2><p>{qa?"הגישי מועמדות למשרת QA כדי לבדוק שהמגייסת מקבלת אותה.":"המועמדויות יופיעו לאחר חיבור שירות הגשה פעיל."}</p><Link className="button" href="/candidate/jobs">מעבר למשרות</Link></div>}
 </section></main>
}