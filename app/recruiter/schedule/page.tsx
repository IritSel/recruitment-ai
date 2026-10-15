"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {useSiteLanguage} from "../../components/useSiteLanguage";

type Appointment={id:string;date:string;time:string;minutes:number;name:string;job:string;type:string};
type Settings={days:number[];start:string;end:string;breakStart:string;breakEnd:string;durations:{phone:number;video:number;onsite:number}};
const defaults:Settings={days:[0,1,2,3,4],start:"09:00",end:"17:00",breakStart:"12:30",breakEnd:"13:00",durations:{phone:15,video:30,onsite:45}};
const dayNames=["א׳","ב׳","ג׳","ד׳","ה׳","ו׳","ש׳"];
const boxStyle:React.CSSProperties={border:"1px solid #e4ddff",borderRadius:14,padding:16,background:"#fff"};
const field:React.CSSProperties={border:"1px solid #ddd6fe",borderRadius:9,padding:9,font:"inherit",width:"100%",boxSizing:"border-box"};
function minutes(s:string){const [h,m]=s.split(":").map(Number);return h*60+m}
function clock(n:number){return String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0")}
function localDate(d:Date){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
export default function SchedulePage(){
 const en=useSiteLanguage()==="en";
 const [settings,setSettings]=useState<Settings>(defaults);
 const [appointments,setAppointments]=useState<Appointment[]>([]);
 const [day,setDay]=useState("");
 const [selected,setSelected]=useState("");
 const [name,setName]=useState("נועה כהן");
 const [job,setJob]=useState("שירות לקוחות");
 const [type,setType]=useState<"phone"|"video"|"onsite">("phone");
 const duration=settings.durations[type];
 const [message,setMessage]=useState("");
 const [ready,setReady]=useState(false);
 useEffect(()=>{try{const s=localStorage.getItem("how-qa-calendar-settings");if(s){const v=JSON.parse(s);if(v&&Array.isArray(v.days))setSettings({...defaults,...v,durations:{...defaults.durations,...v.durations}})}const a=localStorage.getItem("how-qa-calendar-appointments");if(a){const v=JSON.parse(a);if(Array.isArray(v))setAppointments(v)}const query=new URLSearchParams(location.search);const d=query.get("date");const id=query.get("appointment");setDay(d||localDate(new Date()));if(id)setSelected(id);if(query.get("candidate")==="noa")setName("נועה כהן")}catch{setDay(localDate(new Date()))}setReady(true)},[]);
 const dateObj=useMemo(()=>day?new Date(day+"T12:00:00"):new Date(),[day]);
 const isWorking=settings.days.includes(dateObj.getDay());
 const slots=useMemo(()=>{if(!isWorking||minutes(settings.end)<=minutes(settings.start))return [];const arr:{time:string;busy:boolean;reason:string}[]=[];for(let m=minutes(settings.start);m+duration<=minutes(settings.end);m+=15){const breakOverlap=minutes(settings.breakEnd)>minutes(settings.breakStart)&&m<minutes(settings.breakEnd)&&m+duration>minutes(settings.breakStart);const meeting=appointments.find(a=>a.date===day&&m<minutes(a.time)+a.minutes&&m+duration>minutes(a.time));arr.push({time:clock(m),busy:Boolean(breakOverlap||meeting),reason:meeting?"פגישה קיימת":breakOverlap?"הפסקה":""})}return arr},[settings,appointments,day,isWorking,duration]);
 const dayAppointments=appointments.filter(a=>a.date===day).sort((a,b)=>a.time.localeCompare(b.time));
 function saveSettings(v:Settings){setSettings(v);localStorage.setItem("how-qa-calendar-settings",JSON.stringify(v));setMessage("הגדרות הזמינות נשמרו בדפדפן לצורכי QA.")}
 function saveAppointment(){
 const slot=slots.find(s=>s.time===selected);
 if(!slot||slot.busy||!name.trim()){setMessage("יש לבחור שעה פנויה ולהזין שם מועמדת.");return}
 try{
  const raw=localStorage.getItem("how-qa-calendar-appointments");
  const parsed=raw?JSON.parse(raw):[];
  const latest:Appointment[]=Array.isArray(parsed)?parsed:appointments;
  const startAt=minutes(selected);
  const conflict=latest.some(a=>a.date===day&&startAt<minutes(a.time)+a.minutes&&startAt+duration>minutes(a.time));
  if(conflict){setAppointments(latest);setSelected("");setMessage("השעה כבר תפוסה. יש לבחור מועד אחר.");return}
  const entry:Appointment={id:"qa-"+Date.now(),date:day,time:selected,minutes:duration,name:name.trim(),job:job.trim(),type};
  const next=[...latest,entry];
  localStorage.setItem("how-qa-calendar-appointments",JSON.stringify(next));
  setAppointments(next);
  setSelected(entry.id);
  setMessage("ראיון QA נקבע: "+entry.time+"–"+clock(startAt+duration)+". השעה נחסמה ביומן. לא נשלחה הזמנה ולא נוצר אירוע ב־Google.");
 }catch{setMessage("לא ניתן לשמור את הראיון בדפדפן. הפגישה לא נקבעה.")}
}
 const active=appointments.find(a=>a.id===selected);
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">HOW?</Link><Link href="/recruiter">← {en?"Dashboard":"דשבורד"}</Link></nav><section style={{maxWidth:1020,margin:"35px auto",display:"grid",gap:18}}>
 <span className="eyebrow">QA · {en?"Internal calendar preview":"יומן פנימי להדגמה"}</span><h1 style={{margin:0}}>{en?"Interview calendar":"יומן ראיונות"}</h1><p style={{margin:0,color:"#64748b"}}>היומן מדגים זמינות, שעות חסומות ופגישות בדפדפן זה בלבד. עדיין אין סנכרון עם Google Calendar או שליחת הזמנות.</p>
 <div style={{...boxStyle,display:"grid",gap:12}}><h2 style={{margin:0}}>הגדרת זמינות מראש</h2><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{dayNames.map((n,i)=><label key={i} style={{padding:"9px 12px",border:"1px solid #ddd6fe",borderRadius:9,background:settings.days.includes(i)?"#ede9fe":"white",cursor:"pointer"}}><input type="checkbox" checked={settings.days.includes(i)} onChange={e=>saveSettings({...settings,days:e.target.checked?[...settings.days,i]:settings.days.filter(x=>x!==i)})}/> {n}</label>)}</div>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
 {([["start","תחילת יום"],["end","סיום יום"],["breakStart","תחילת הפסקה"],["breakEnd","סיום הפסקה"]] as const).map(([k,label])=><label key={k}>{label}<input type="time" style={field} value={settings[k]} onChange={e=>saveSettings({...settings,[k]:e.target.value})}/></label>)}
 {(["phone","video","onsite"] as const).map(k=><label key={k}>משך {k==="phone"?"שיחה טלפונית":k==="video"?"ראיון וידאו":"ראיון פרונטלי"}<select style={field} value={settings.durations[k]} onChange={e=>saveSettings({...settings,durations:{...settings.durations,[k]:Number(e.target.value)}})}>{[15,20,30,45,60].map(x=><option key={x} value={x}>{x} דקות</option>)}</select></label>)}</div></div>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
 <div style={{...boxStyle,display:"grid",gap:12,alignContent:"start"}}><h2 style={{margin:0}}>זמינות ליום נבחר</h2><label>תאריך<input type="date" style={field} value={day} onChange={e=>{setDay(e.target.value);setSelected("");setMessage("")}}/></label>
 {!isWorking?<p>יום זה מוגדר כיום לא פעיל. אפשר לשנות את ימי העבודה למעלה.</p>:<div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:8}}>
 {slots.map(s=><button key={s.time} type="button" disabled={s.busy} onClick={()=>setSelected(s.time)} title={s.reason||"פנוי"} style={{padding:"12px 4px",borderRadius:10,border:selected===s.time?"2px solid #6147f5":"1px solid #ddd6fe",background:s.busy?"#f1f5f9":selected===s.time?"#ede9fe":"#ecfdf5",color:s.busy?"#64748b":"#172554",cursor:s.busy?"not-allowed":"pointer"}}>{s.time}<small style={{display:"block"}}>{s.busy?s.reason:"פנוי"}</small></button>)}</div>}
 {slots.length===0&&isWorking&&<p>אין חלונות זמינים בהגדרות הנוכחיות.</p>}
 </div>
 <div style={{...boxStyle,display:"grid",gap:12,alignContent:"start"}}><h2 style={{margin:0}}>קביעת ראיון QA</h2><label>שם המועמדת<input style={field} value={name} onChange={e=>setName(e.target.value)}/></label><label>משרה<input style={field} value={job} onChange={e=>setJob(e.target.value)}/></label><label>סוג ראיון<select style={field} value={type} onChange={e=>{setType(e.target.value as "phone"|"video"|"onsite");setSelected("")}}><option value="phone">טלפוני</option><option value="video">וידאו (QA ללא קישור Meet)</option><option value="onsite">פרונטלי</option></select></label>
 <p>משך הפגישה לפי סוג הראיון: <strong>{duration} דקות</strong></p><p>שעה שנבחרה: <strong>{selected&&!active?selected:"לא נבחרה שעה פנויה"}</strong></p><button type="button" className="button" disabled={!selected||Boolean(active)||!ready} onClick={saveAppointment}>קביעת ראיון ביומן QA</button>
 {message&&<p role="status" style={{color:"#285b54"}}>{message}</p>}
 </div></div>
 <div style={{...boxStyle,display:"grid",gap:12}}><h2 style={{margin:0}}>פגישות בתאריך הנבחר</h2>
 {dayAppointments.length===0?<p>אין פגישות שנקבעו ליום הזה.</p>:dayAppointments.map(a=><div key={a.id} id={a.id} style={{padding:12,border:selected===a.id?"2px solid #6147f5":"1px solid #e4ddff",borderRadius:12,background:selected===a.id?"#faf8ff":"white"}}><button type="button" onClick={()=>setSelected(a.id)} style={{border:0,background:"transparent",textAlign:"right",cursor:"pointer",font:"inherit",width:"100%"}}><strong>{a.time}–{clock(minutes(a.time)+a.minutes)} · {a.name}</strong><p style={{margin:"5px 0"}}>{a.job} · {a.type==="phone"?"ראיון טלפוני":a.type==="video"?"ראיון וידאו":"ראיון פרונטלי"} · {a.minutes} דקות</p></button></div>)}
 {active&&<div style={{background:"#f5f3ff",borderRadius:12,padding:12}}><h3>פרטי הפגישה</h3><p>{active.name} · {active.job}</p><p>{active.date} · {active.time} · {active.minutes} דקות</p><button type="button" onClick={()=>{const next=appointments.filter(a=>a.id!==active.id);localStorage.setItem("how-qa-calendar-appointments",JSON.stringify(next));setAppointments(next);setSelected("");setMessage("פגישת QA בוטלה.")}}>ביטול פגישת QA</button></div>}
 </div></section></main>;
}