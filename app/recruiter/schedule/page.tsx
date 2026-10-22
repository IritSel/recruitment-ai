"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {useSiteLanguage} from "../../components/useSiteLanguage";

type Appointment={id:string;date:string;time:string;minutes:number;name:string;job:string;type:string};
type Settings={days:number[];start:string;end:string;breakStart:string;breakEnd:string;breakEnabled:boolean;durations:{phone:number;video:number;onsite:number}};
const defaults:Settings={days:[0,1,2,3,4],start:"09:00",end:"17:00",breakStart:"12:30",breakEnd:"13:00",breakEnabled:false,durations:{phone:15,video:30,onsite:45}};
const dayNames=["א׳","ב׳","ג׳","ד׳","ה׳","ו׳","ש׳"];
const boxStyle:React.CSSProperties={border:"1px solid #e4ddff",borderRadius:12,padding:11,background:"#fff"};
const field:React.CSSProperties={border:"1px solid #dcd5ff",borderRadius:12,padding:"10px 34px 10px 12px",font:"inherit",fontSize:13,width:"100%",boxSizing:"border-box",background:"#fff",color:"#21175b",minHeight:42,outlineColor:"#6953e9",cursor:"pointer"};
const calendarButton:React.CSSProperties={border:"1px solid #dcd5ff",borderRadius:11,padding:"10px 14px",background:"#fff",color:"#39279b",font:"inherit",fontWeight:600,fontSize:13,minHeight:40,cursor:"pointer",boxShadow:"0 1px 3px rgba(61,40,142,.05)"};
const todayButton:React.CSSProperties={...calendarButton,background:"#f0ecff",borderColor:"#cbbfff",color:"#3922a8"};
function minutes(s:string){const [h,m]=s.split(":").map(Number);return h*60+m}
function clock(n:number){return String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0")}
function localDate(d:Date){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
export default function SchedulePage(){
 const en=useSiteLanguage()==="en";
 const tr=(he:string,english:string)=>en?english:he;
 const days=en?["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]:dayNames;
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
 const [settingsOpen,setSettingsOpen]=useState(false);
 const [manualOpen,setManualOpen]=useState(false);
 useEffect(()=>{try{const s=localStorage.getItem("how-qa-calendar-settings");if(s){const v=JSON.parse(s);if(v&&Array.isArray(v.days))setSettings({...defaults,...v,durations:{...defaults.durations,...v.durations}})}const a=localStorage.getItem("how-qa-calendar-appointments");if(a){const v=JSON.parse(a);if(Array.isArray(v))setAppointments(v)}const query=new URLSearchParams(location.search);const d=query.get("date");const id=query.get("appointment");setDay(d||localDate(new Date()));if(id)setSelected(id);if(query.get("candidate")==="noa")setName("נועה כהן")}catch{setDay(localDate(new Date()))}setReady(true)},[]);
 const dateObj=useMemo(()=>day?new Date(day+"T12:00:00"):new Date(),[day]);
 const isWorking=settings.days.includes(dateObj.getDay());
 const slots=useMemo(()=>{if(!isWorking||minutes(settings.end)<=minutes(settings.start))return [];const arr:{time:string;busy:boolean;reason:string}[]=[];for(let m=minutes(settings.start);m+duration<=minutes(settings.end);m+=15){const breakOverlap=settings.breakEnabled&&minutes(settings.breakEnd)>minutes(settings.breakStart)&&m<minutes(settings.breakEnd)&&m+duration>minutes(settings.breakStart);const meeting=appointments.find(a=>a.date===day&&m<minutes(a.time)+a.minutes&&m+duration>minutes(a.time));arr.push({time:clock(m),busy:Boolean(breakOverlap||meeting),reason:meeting?"פגישה קיימת":breakOverlap?tr("הפסקה","Break"):""})}return arr},[settings,appointments,day,isWorking,duration]);
 const weekDates=useMemo(()=>{const base=new Date((day||localDate(new Date()))+"T12:00:00");base.setDate(base.getDate()-base.getDay());return Array.from({length:7},(_,i)=>{const d=new Date(base);d.setDate(base.getDate()+i);return {date:localDate(d),weekday:i,number:d.getDate()}})},[day]);
 const weekHours=useMemo(()=>{const start=minutes(settings.start),end=minutes(settings.end);const arr:number[]=[];for(let t=start;t<end;t+=15)arr.push(t);return arr},[settings.start,settings.end]);
 function slotInfo(date:string,weekday:number,startAt:number){
  if(!settings.days.includes(weekday))return {busy:true,reason:tr("לא פעיל","Non-working day"),appointment:null as Appointment|null};
  const breakBusy=settings.breakEnabled&&minutes(settings.breakEnd)>minutes(settings.breakStart)&&startAt<minutes(settings.breakEnd)&&startAt+duration>minutes(settings.breakStart);
  const meeting=appointments.find(a=>a.date===date&&startAt<minutes(a.time)+a.minutes&&startAt+duration>minutes(a.time))||null;
  const outside=startAt+duration>minutes(settings.end);
  return {busy:Boolean(breakBusy||meeting||outside),reason:meeting?tr("תפוס","Booked"):breakBusy?tr("הפסקה","Break"):outside?tr("לא זמין","Unavailable"):tr("פנוי","Available"),appointment:meeting};
 }
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
 return <main className="shell" dir={en?"ltr":"rtl"}><nav className="nav"><Link className="brand" href="/">HOW?</Link><Link href="/recruiter">← {en?"Dashboard":"דשבורד"}</Link></nav><section style={{maxWidth:1140,margin:"12px auto",display:"grid",gap:9,fontSize:13}}>
 <span className="eyebrow">QA · {en?"Internal calendar preview":"יומן פנימי להדגמה"}</span><h1 style={{margin:0,fontSize:26,lineHeight:1.2}}>{en?"Interview calendar":"יומן ראיונות"}</h1><p style={{margin:0,color:"#64748b"}}>{tr("היומן מדגים זמינות, שעות חסומות ופגישות בדפדפן זה בלבד. עדיין אין סנכרון עם Google Calendar או שליחת הזמנות.","This QA calendar demonstrates availability, blocked times, and interviews in this browser only. Google Calendar sync and real invitations are not enabled.")}</p>
 <div style={{...boxStyle,display:"grid",gap:12}}><button type="button" aria-expanded={settingsOpen} onClick={()=>setSettingsOpen(v=>!v)} style={{background:"transparent",border:0,textAlign:en?"left":"right",font:"inherit",fontWeight:700,cursor:"pointer"}}>⚙ {tr("הגדרות זמינות","Availability settings")} {settingsOpen?"▴":"▾"}</button>{settingsOpen&&<><h2 style={{margin:0,fontSize:16}}>{tr("ימי עבודה, שעות ומשכי ראיונות","Working days, hours and interview durations")}</h2><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{days.map((n,i)=><label key={i} style={{padding:"5px 8px",fontSize:12,border:"1px solid #ddd6fe",borderRadius:9,background:settings.days.includes(i)?"#ede9fe":"white",cursor:"pointer"}}><input type="checkbox" checked={settings.days.includes(i)} onChange={e=>saveSettings({...settings,days:e.target.checked?[...settings.days,i]:settings.days.filter(x=>x!==i)})}/> {n}</label>)}</div>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(125px,1fr))",gap:8}}>
 {([["start","תחילת יום"],["end","סיום יום"]] as const).map(([k,label])=><label key={k}>{label}<input type="time" style={field} value={settings[k]} onChange={e=>saveSettings({...settings,[k]:e.target.value})}/></label>)}
 <label style={{display:"flex",alignItems:"center",gap:7,alignSelf:"end",paddingBottom:10}}><input type="checkbox" checked={settings.breakEnabled} onChange={e=>saveSettings({...settings,breakEnabled:e.target.checked})}/> חסימת הפסקה ביומן</label>
 {settings.breakEnabled&&([["breakStart","תחילת הפסקה"],["breakEnd","סיום הפסקה"]] as const).map(([k,label])=><label key={k}>{label}<input type="time" style={field} value={settings[k]} onChange={e=>saveSettings({...settings,[k]:e.target.value})}/></label>)}
 {(["phone","video","onsite"] as const).map(k=><label key={k}>משך {k==="phone"?"שיחה טלפונית":k==="video"?tr("ראיון וידאו","Video interview"):tr("ראיון פרונטלי","On-site interview")}<select style={field} value={settings.durations[k]} onChange={e=>saveSettings({...settings,durations:{...settings.durations,[k]:Number(e.target.value)}})}>{[15,20,30,45,60].map(x=><option key={x} value={x}>{x} {tr("דקות","minutes")}</option>)}</select></label>)}</div></>}</div>
 <div style={{...boxStyle,display:"grid",gap:12}}>
 <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
 <h2 style={{margin:0,fontSize:17}}>{tr("יומן שבועי","Weekly calendar")}</h2>
 <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
 <button style={calendarButton} type="button" onClick={()=>{const d=new Date((day||localDate(new Date()))+"T12:00:00");d.setDate(d.getDate()-7);setDay(localDate(d));setSelected("")}}>{tr("שבוע קודם","Previous week")}</button>
 <button style={todayButton} type="button" onClick={()=>{setDay(localDate(new Date()));setSelected("")}}>{tr("היום","Today")}</button>
 <button style={calendarButton} type="button" onClick={()=>{const d=new Date((day||localDate(new Date()))+"T12:00:00");d.setDate(d.getDate()+7);setDay(localDate(d));setSelected("")}}>{tr("שבוע הבא","Next week")}</button>
 </div></div>
 <p style={{margin:0,color:"#64748b",fontSize:13}}>{tr("לחצי על שעה פנויה כדי לקבוע ראיון ידני. הזמנה אוטומטית למועמדת עדיין בפיתוח.","Select an available slot to schedule a QA interview manually. Automated candidate invitations are not yet available.")}</p>
 <div style={{overflowX:"auto",maxHeight:"min(62vh,560px)",overflowY:"auto"}}>
 <div style={{display:"grid",gridTemplateColumns:"46px repeat(7,minmax(68px,1fr))",gap:2,minWidth:565}}>
 <div/>
 {weekDates.map(d=><div key={d.date} style={{padding:5,fontSize:12,textAlign:"center",position:"sticky",top:0,zIndex:2,borderRadius:9,background:d.date===day?"#ede9fe":"#f8fafc",fontWeight:600}}>{days[d.weekday]} {d.number}</div>)}
 {weekHours.flatMap(hour=>[
 <div key={"h-"+hour} style={{padding:4,fontSize:11,color:"#64748b"}}>{clock(hour)}</div>,
 ...weekDates.map(d=>{const info=slotInfo(d.date,d.weekday,hour);const chosen=day===d.date&&selected===clock(hour);return <button key={d.date+"-"+hour} type="button" disabled={info.busy} title={info.appointment?info.appointment.name+" · "+info.appointment.job:info.reason} onClick={()=>{setDay(d.date);setSelected(clock(hour));setMessage("")}} style={{minHeight:24,padding:2,borderRadius:5,border:chosen?"2px solid #6147f5":"1px solid #e4ddff",background:info.appointment?"#e9e3ff":info.busy?"#f1f5f9":"#f0fdf4",cursor:info.busy?"not-allowed":"pointer",color:"#243047",fontSize:10,overflow:"hidden"}}>
 {info.appointment?<><strong>{info.appointment.name}</strong><span style={{display:"block"}}>{info.appointment.time} · {info.appointment.minutes} {tr("דק׳","min")}</span></>:info.busy?info.reason:chosen?tr("נבחר","Selected"):tr("פנוי","Available")}
 </button>})
 ])}
 </div></div>
 <div style={{display:"flex",gap:16,flexWrap:"wrap",fontSize:12,color:"#64748b"}}><span>🟩 {tr("פנוי","Available")}</span><span>🟪 {tr("פגישה","Meeting")}</span><span>⬜ {tr("חסום / הפסקה","Blocked / break")}</span></div>
 </div>
 <div style={{...boxStyle,display:"grid",gap:12}}><button type="button" aria-expanded={manualOpen} onClick={()=>setManualOpen(v=>!v)} style={{background:"transparent",border:0,textAlign:"right",font:"inherit",fontWeight:700,cursor:"pointer"}}>＋ {tr("קביעת פגישה ידנית","Schedule manually")} {manualOpen?"▴":"▾"}</button>{manualOpen&&<div style={{display:"grid",gap:12,maxWidth:540}}><h2 style={{margin:0,fontSize:16}}>{tr("קביעת ראיון QA","Schedule QA interview")}</h2><label>{tr("תאריך הראיון","Interview date")}<input type="date" style={field} value={day} onChange={e=>{setDay(e.target.value);setSelected("");setMessage("")}}/></label><label>{tr("שעת הראיון","Interview time")}<select style={field} value={active?"":selected} onChange={e=>{setSelected(e.target.value);setMessage("")}}><option value="">{tr("בחרי שעה פנויה","Select an available time")}</option>{slots.filter(s=>!s.busy).map(s=><option key={s.time} value={s.time}>{s.time}–{clock(minutes(s.time)+duration)}</option>)}</select></label><label>{tr("שם המועמדת","Candidate name")}<input style={field} value={name} onChange={e=>setName(e.target.value)}/></label><label>{tr("משרה","Job")}<input style={field} value={job} onChange={e=>setJob(e.target.value)}/></label><label>{tr("סוג ראיון","Interview format")}<select style={field} value={type} onChange={e=>{setType(e.target.value as "phone"|"video"|"onsite");setSelected("")}}><option value="phone">{tr("טלפוני","Phone")}</option><option value="video">{tr("וידאו (QA ללא קישור Meet)","Video (QA, no Meet link)")}</option><option value="onsite">{tr("פרונטלי","On-site")}</option></select></label>
 <p>{tr("משך הפגישה לפי סוג הראיון: ","Duration for this interview format: ")}<strong>{duration} דקות</strong></p><p>{tr("שעה שנבחרה: ","Selected time: ")}<strong>{selected&&!active?selected:tr("לא נבחרה שעה פנויה","No available time selected")}</strong></p><button type="button" className="button" disabled={!selected||Boolean(active)||!ready||!slots.some(s=>s.time===selected&&!s.busy)} onClick={saveAppointment}>{tr("קביעת ראיון ביומן QA","Add interview to QA calendar")}</button>
 {message&&<p role="status" style={{color:"#285b54"}}>{message}</p>}
 </div>}</div>
 <div style={{...boxStyle,display:"grid",gap:12}}><h2 style={{margin:0}}>{tr("פגישות בתאריך הנבחר","Interviews on selected date")}</h2>
 {dayAppointments.length===0?<p>{tr("אין פגישות שנקבעו ליום הזה.","No interviews scheduled for this day.")}</p>:dayAppointments.map(a=><div key={a.id} id={a.id} style={{padding:12,border:selected===a.id?"2px solid #6147f5":"1px solid #e4ddff",borderRadius:12,background:selected===a.id?"#faf8ff":"white"}}><button type="button" onClick={()=>setSelected(a.id)} style={{border:0,background:"transparent",textAlign:"right",cursor:"pointer",font:"inherit",width:"100%"}}><strong>{a.time}–{clock(minutes(a.time)+a.minutes)} · {a.name}</strong><p style={{margin:"5px 0"}}>{a.job} · {a.type==="phone"?tr("ראיון טלפוני","Phone interview"):a.type==="video"?tr("ראיון וידאו","Video interview"):tr("ראיון פרונטלי","On-site interview")} · {a.minutes} דקות</p></button></div>)}
 {active&&<div style={{background:"#f5f3ff",borderRadius:12,padding:12}}><h3>{tr("פרטי הפגישה","Interview details")}</h3><p>{active.name} · {active.job}</p><p>{active.date} · {active.time} · {active.minutes} דקות</p><button type="button" onClick={()=>{const next=appointments.filter(a=>a.id!==active.id);localStorage.setItem("how-qa-calendar-appointments",JSON.stringify(next));setAppointments(next);setSelected("");setMessage("פגישת QA בוטלה.")}}>{tr("ביטול פגישת QA","Cancel QA interview")}</button></div>}
 </div></section></main>;
}