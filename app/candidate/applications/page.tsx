"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useSiteLanguage} from "../../components/useSiteLanguage";
type QaAction={id:string;candidateId:string;sourceJobId:string;kind:"question"|"meeting";message:string;date?:string;time?:string;mode?:string;slots?:{date:string;time:string}[];selectedSlot?:{date:string;time:string};status:"pending"|"answered"|"accepted"|"declined";response?:string;createdAt:string};
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
 const [selectedSlots,setSelectedSlots]=useState<Record<string,number>>({});
 useEffect(()=>{
  const refresh=()=>{try{const context=JSON.parse(sessionStorage.getItem("qa-demo-context")||"null");const active=context?.kind==="demo"&&context?.role==="candidate";setQa(active);setItems(active?load():[]);const raw=JSON.parse(localStorage.getItem(actionKey)||"[]");setActions(active&&Array.isArray(raw)?raw:[])}catch{setItems([])}};
  refresh();window.addEventListener("focus",refresh);window.addEventListener("storage",refresh);
  return()=>{window.removeEventListener("focus",refresh);window.removeEventListener("storage",refresh)}
 },[]);

 function respond(action:QaAction,status:"answered"|"accepted"|"declined",slot?:{date:string;time:string}){
  const value=(answers[action.id]||"").trim();
  if(status==="answered"&&!value)return;
  if(status==="accepted"&&!slot)return;
  try{
   const raw=JSON.parse(localStorage.getItem(actionKey)||"[]");
   const list:QaAction[]=Array.isArray(raw)?raw:[];
   const next=list.map(x=>x.id===action.id?{...x,status,selectedSlot:status==="accepted"?slot:undefined,response:status==="answered"?value:status==="declined"?"המועמדת ביקשה הצעת מועדים נוספים":"המועמדת בחרה מועד ואישרה את הראיון"}:x);
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
   {id:"demo-meeting-"+candidateId+"-"+first.jobId,candidateId,sourceJobId:first.jobId,kind:"meeting",message:"נשמח להזמינך לשיחת היכרות קצרה. אנא אשרי את המועד או דחי את ההזמנה.",date:upcoming,time:"10:00",slots:[{date:upcoming,time:"10:00"},{date:upcoming,time:"14:00"},{date:new Date(now.getTime()+8*86400000).toISOString().slice(0,10),time:"11:30"}],mode:"video",status:"pending",createdAt:now.toISOString()}
  ];
  try{
   const raw=JSON.parse(localStorage.getItem(actionKey)||"[]");
   const list:QaAction[]=Array.isArray(raw)?raw:[];
   const next=[...list.filter(x=>!x.id.startsWith("demo-meeting-"+candidateId+"-"+first.jobId)),...examples.filter(x=>x.kind==="meeting"||!list.some(a=>a.id===x.id))];
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
 {jobActions.length>0&&<section style={{borderTop:"1px solid #ece5f6",paddingTop:10,display:"grid",gap:8}}>
 <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
 <strong style={{fontSize:13,color:"#493479"}}>עדכונים מהמגייסת</strong>
 {jobActions.some(x=>x.status==="pending")&&<span style={{fontSize:11,background:"#f0eafb",borderRadius:7,padding:"5px 8px",color:"#5a3d91"}}>{jobActions.filter(x=>x.status==="pending").length} פעולות ממתינות</span>}
 </div>
 {jobActions.map(action=><div key={action.id} style={{border:"1px solid #e9e0f3",borderRadius:10,padding:"11px 12px",background:"#fff",display:"grid",gap:8}}>
 <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",flexWrap:"wrap"}}><strong style={{fontSize:13}}>{action.kind==="question"?"שאלה מהמגייסת":"בחירת מועד לראיון"}</strong><span style={{fontSize:11,color:"#685d82"}}>{action.status==="pending"?"ממתין לתגובתך":action.status==="answered"?"נשלחה תשובה":action.status==="accepted"?"המועד אושר":"ממתינים להצעה חלופית"}</span></div>
 <p style={{margin:0,fontSize:12,lineHeight:1.55}}>{action.message}</p>
 {action.kind==="question"?(action.status==="pending"?<details style={{borderRadius:8,background:"#faf8ff",padding:"7px 9px"}}><summary style={{cursor:"pointer",fontWeight:650,fontSize:12,color:"#5d4297"}}>כתיבת תשובה</summary><div style={{display:"grid",gap:8,paddingTop:8}}><textarea aria-label="תשובה למגייסת" rows={2} value={answers[action.id]||""} onChange={e=>setAnswers(p=>({...p,[action.id]:e.target.value}))} placeholder="כתבי כאן תשובה למגייסת" style={{border:"1px solid #d9cceb",borderRadius:8,padding:8,font:"inherit",width:"100%",fontSize:12}}/><button type="button" disabled={!answers[action.id]?.trim()} onClick={()=>respond(action,"answered")} style={{justifySelf:"start",padding:"7px 12px",border:0,background:"#6944a7",color:"white",borderRadius:8,cursor:"pointer",fontSize:12}}>שליחת תשובה</button></div></details>:<p style={{margin:0,color:"#26725d",fontSize:12}}>התשובה נשלחה: {action.response||""}</p>):<>
 <span style={{fontSize:12,color:"#665881"}}>{action.mode==="video"?"ראיון וידאו":action.mode==="phone"?"ראיון טלפוני":"ראיון פרונטלי"} · בחרי את המועד המתאים לך</span>
 {action.status==="pending"?<>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:7}}>
 {(action.slots&&action.slots.length?action.slots:action.date&&action.time?[{date:action.date,time:action.time}]:[]).map((slot,i)=><button type="button" key={slot.date+"-"+slot.time+"-"+i} onClick={()=>setSelectedSlots(p=>({...p,[action.id]:i}))} aria-pressed={selectedSlots[action.id]===i} style={{border:selectedSlots[action.id]===i?"2px solid #704cac":"1px solid #d8c8eb",borderRadius:9,padding:"10px 8px",background:selectedSlots[action.id]===i?"#eee8fa":"#fbf9ff",color:"#442e79",cursor:"pointer",fontSize:12,fontWeight:650,textAlign:"center"}}>{new Date(slot.date+"T12:00:00").toLocaleDateString("he-IL",{weekday:"short",day:"numeric",month:"short"})} · {slot.time}<span style={{display:"block",fontSize:10,fontWeight:400,marginTop:4}}>{selectedSlots[action.id]===i?"נבחר ✓":"בחירת מועד"}</span></button>)}
 </div>
 <button type="button" className="button" disabled={selectedSlots[action.id]===undefined} onClick={()=>{const all=action.slots&&action.slots.length?action.slots:action.date&&action.time?[{date:action.date,time:action.time}]:[];respond(action,"accepted",all[selectedSlots[action.id]])}} style={{justifySelf:"start",fontSize:12,padding:"8px 14px"}}>אישור ושליחת המועד למגייסת</button>
 <button type="button" onClick={()=>respond(action,"declined")} style={{justifySelf:"start",border:0,background:"transparent",color:"#6c5198",textDecoration:"underline",fontSize:11,cursor:"pointer",padding:2}}>אף אחד מהמועדים לא מתאים</button>
 </>:<p style={{fontSize:12,color:action.status==="accepted"?"#26725d":"#6b607d",margin:0}}>{action.status==="accepted"?(action.selectedSlot?"אישרת ראיון לתאריך "+new Date(action.selectedSlot.date+"T12:00:00").toLocaleDateString("he-IL")+" בשעה "+action.selectedSlot.time:"הראיון אושר"):"נשלחה בקשה למועדים חלופיים. המגייסת תצטרך לשלוח הזמנה חדשה."}</p>}
 </>}
 </div>)}
 </section>}
 <div><Link className="button" href={"/candidate/jobs/"+item.jobId}>לפרטי המשרה</Link></div>
 </article>}):<div className="choice" style={{padding:24}}><h2>עדיין אין מועמדויות</h2><p>{qa?"הגישי מועמדות למשרת QA כדי לבדוק שהמגייסת מקבלת אותה.":"המועמדויות יופיעו לאחר חיבור שירות הגשה פעיל."}</p><Link className="button" href="/candidate/jobs">מעבר למשרות</Link></div>}
 </section></main>
}