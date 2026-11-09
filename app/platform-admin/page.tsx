"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {getSupabase} from "../lib/supabase";
import {useSiteLanguage} from "../components/useSiteLanguage";
type Account={id:string;email:string;firstName:string;lastName:string;createdAt:string;lastSignInAt:string|null;emailConfirmedAt:string|null;provider:string;bannedUntil:string|null};
type AdminResponse={users?:Account[];total?:number|null;page?:number;hasNext?:boolean;error?:string};
const localDate=(value:string|null,en:boolean)=>value?new Date(value).toLocaleString(en?"en-US":"he-IL",{dateStyle:"medium",timeStyle:"short"}):"—";
const field:React.CSSProperties={padding:"10px 12px",border:"1px solid #ddd3ee",background:"#fff",borderRadius:9,font:"inherit",width:"100%"};
export default function PlatformAdmin(){
 const en=useSiteLanguage()==="en";
 const [status,setStatus]=useState<"checking"|"ready"|"login"|"denied"|"setup"|"error">("checking");
 const [rows,setRows]=useState<Account[]>([]);
 const [filter,setFilter]=useState("");
 const [page,setPage]=useState(1);
 const [hasNext,setHasNext]=useState(false);
 const [total,setTotal]=useState<number|null>(null);
 const [selected,setSelected]=useState<Account|null>(null);
 const [busy,setBusy]=useState(false);
 const [refreshKey,setRefreshKey]=useState(0);
 useEffect(()=>{let alive=true;(async()=>{
  setBusy(true);
  try{
   const client=getSupabase();
   const {data}=await client.auth.getSession();
   const token=data.session?.access_token;
   if(!token){if(alive)setStatus("login");return}
   const response=await fetch("/api/platform-admin/users?page="+page,{headers:{Authorization:"Bearer "+token},cache:"no-store"});
   const body:AdminResponse=await response.json();
   if(!alive)return;
   if(response.status===401){setStatus("login");return}
   if(response.status===403){setStatus("denied");return}
   if(response.status===503){setStatus("setup");return}
   if(!response.ok){setStatus("error");return}
   setRows(body.users||[]);setHasNext(Boolean(body.hasNext));setTotal(typeof body.total==="number"?body.total:null);setStatus("ready");
  }catch{if(alive)setStatus("error")}finally{if(alive)setBusy(false)}
 })();return()=>{alive=false}},[page,refreshKey]);
 const shown=rows.filter(a=>[a.email,a.firstName,a.lastName,a.id].some(v=>v.toLowerCase().includes(filter.trim().toLowerCase())));
 return <main className="shell" dir={en?"ltr":"rtl"}><nav className="nav"><Link className="brand" href="/">HOW?</Link><div className="navlinks"><Link href="/qa">QA</Link><Link href="/">{en?"Home":"דף הבית"}</Link></div></nav>
 <section style={{maxWidth:1160,margin:"25px auto 75px",display:"grid",gap:16}}>
 <header style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}>
 <div><small style={{color:"#6c549b",fontWeight:700}}>HOW? · {en?"Internal operations":"ניהול פנימי"}</small><h1 style={{fontSize:26,margin:"5px 0"}}>{en?"Platform administration":"ניהול האתר והתמיכה"}</h1><p style={{color:"#6d6281",fontSize:13,margin:0}}>{en?"Private access for authorized platform owners only. Real registered accounts, not QA personas.":"גישה פרטית למנהלי הפלטפורמה המורשים בלבד. אלו חשבונות רשומים אמיתיים, לא דמויות QA."}</p></div>
 {status==="ready"&&<button type="button" onClick={()=>setRefreshKey(k=>k+1)} disabled={busy} style={{...field,width:"auto",cursor:"pointer"}}>{en?"Refresh":"רענון נתונים"}</button>}
 </header>
 {status!=="ready"?<section className="choice" style={{padding:25}}>{status==="checking"?<p>{en?"Checking administrator permissions…":"בודק הרשאות מנהל..."}</p>:status==="login"?<p>{en?"Sign in with your authorized account.":"יש להתחבר באמצעות חשבון ניהול מורשה."} <Link href="/login">{en?"Sign in":"כניסה"}</Link></p>:status==="denied"?<p role="alert">{en?"This account does not have platform administrator access.":"לחשבון זה אין הרשאת ניהול פלטפורמה."}</p>:status==="setup"?<p role="alert">{en?"Administrator access is not configured. Set PLATFORM_ADMIN_EMAILS and the server-only SUPABASE_SERVICE_ROLE_KEY in the hosting environment.":"גישת מנהל טרם הוגדרה. יש להגדיר בסביבת השרת PLATFORM_ADMIN_EMAILS ואת SUPABASE_SERVICE_ROLE_KEY הסודי."}</p>:<p role="alert">{en?"Could not load users. Check Supabase availability and administrator configuration.":"לא ניתן לטעון משתמשים. יש לבדוק את זמינות Supabase ואת הגדרות ההרשאות."}</p>}</section>:<>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12}}>
 <div className="choice" style={{padding:16}}><small>{en?"Registered accounts":"חשבונות רשומים"}</small><h2 style={{margin:"5px 0",fontSize:25}}>{total===null?"—":total}</h2><small>{en?"From Supabase Auth":"מתוך Supabase Auth"}</small></div>
 <div className="choice" style={{padding:16}}><small>{en?"Accounts on this page":"חשבונות בעמוד הנוכחי"}</small><h2 style={{margin:"5px 0",fontSize:25}}>{rows.length}</h2><small>{en?"50 records per page":"עד 50 רשומות בעמוד"}</small></div>
 <div className="choice" style={{padding:16}}><small>{en?"Email confirmation pending":"ממתינים לאימות מייל בעמוד"}</small><h2 style={{margin:"5px 0",fontSize:25}}>{rows.filter(x=>!x.emailConfirmedAt).length}</h2><small>{en?"Current page only":"בעמוד הנוכחי בלבד"}</small></div>
 </div>
 <section className="choice" style={{padding:18,display:"grid",gap:13}}>
 <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}><h2 style={{margin:0,fontSize:18}}>{en?"User directory":"רשימת משתמשים"}</h2><small>{en?"Page":"עמוד"} {page}</small></div>
 <input style={field} aria-label={en?"Search accounts on this page":"חיפוש משתמשים בעמוד"} value={filter} onChange={e=>setFilter(e.target.value)} placeholder={en?"Search name, email or account ID on this page":"חיפוש שם, מייל או מזהה בעמוד הנוכחי"}/>
 <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",textAlign:"start",fontSize:13}}><thead><tr style={{borderBottom:"1px solid #ddd3ee"}}>{(en?["Name","Email","Registered","Last sign-in","Email verified","Support"]:["שם","אימייל","תאריך הרשמה","כניסה אחרונה","אימות מייל","תמיכה"]).map(x=><th key={x} style={{padding:"11px 8px",textAlign:"start"}}>{x}</th>)}</tr></thead><tbody>{shown.map(a=><tr key={a.id} style={{borderBottom:"1px solid #eee8f5"}}><td style={{padding:"12px 8px"}}>{[a.firstName,a.lastName].filter(Boolean).join(" ")||"—"}</td><td style={{padding:"12px 8px",overflowWrap:"anywhere"}}>{a.email||"—"}</td><td style={{padding:"12px 8px"}}>{localDate(a.createdAt,en)}</td><td style={{padding:"12px 8px"}}>{localDate(a.lastSignInAt,en)}</td><td style={{padding:"12px 8px"}}>{a.emailConfirmedAt?(en?"Verified":"אומת"):(en?"Pending":"ממתין")}</td><td style={{padding:"12px 8px"}}><button type="button" onClick={()=>setSelected(a)} style={{border:"1px solid #d9ccef",borderRadius:8,padding:"7px 10px",background:"#faf8ff",cursor:"pointer"}}>{en?"Details":"פרטים"}</button></td></tr>)}</tbody></table>{shown.length===0&&<p>{en?"No accounts found on this page.":"לא נמצאו משתמשים בעמוד זה."}</p>}</div>
 <div style={{display:"flex",gap:9,alignItems:"center",justifyContent:"space-between"}}><button type="button" disabled={page<=1||busy} onClick={()=>{setPage(x=>Math.max(1,x-1));setSelected(null)}} style={{...field,width:"auto"}}>{en?"Previous":"הקודם"}</button><span style={{fontSize:12}}>{en?"Page":"עמוד"} {page}</span><button type="button" disabled={!hasNext||busy} onClick={()=>{setPage(x=>x+1);setSelected(null)}} style={{...field,width:"auto"}}>{en?"Next":"הבא"}</button></div>
 </section>
 <section className="choice" style={{padding:18,display:"grid",gap:8}}><h2 style={{margin:0,fontSize:18}}>{en?"Support and troubleshooting":"תמיכה ואיתור תקלות"}</h2>
 <p style={{margin:0,fontSize:13}}>{en?"Open an account's Details to inspect the registration ID, account provider, verification and recent sign-in. This view does not expose passwords, CVs or private messages.":"לחצי על ״פרטים״ ליד משתמש כדי לראות מזהה חשבון, ספק התחברות, אימות וכניסה אחרונה. המסך אינו חושף סיסמאות, קורות חיים או הודעות פרטיות."}</p>
 <p style={{margin:0,fontSize:12,color:"#786b8c"}}>{en?"A shared support ticket queue and application error logs are planned but not connected yet.":"מערכת פניות תמיכה ויומן תקלות של האתר עדיין אינם מחוברים; בשלב זה אפשר לבדוק את נתוני החשבון."}</p></section>
 {selected&&<section className="choice" style={{padding:18,display:"grid",gap:8,borderColor:"#c8b5ed"}}><div style={{display:"flex",justifyContent:"space-between",gap:10}}><h2 style={{margin:0,fontSize:18}}>{en?"Account details":"פרטי חשבון"}</h2><button type="button" onClick={()=>setSelected(null)} aria-label={en?"Close details":"סגירת פרטים"}>✕</button></div>
 <p style={{margin:0}}><strong>{[selected.firstName,selected.lastName].filter(Boolean).join(" ")||selected.email}</strong></p>
 <p style={{margin:0,fontSize:13}}>{en?"Email":"מייל"}: {selected.email}</p><p style={{margin:0,fontSize:13}}>{en?"Account ID":"מזהה חשבון"}: <code style={{overflowWrap:"anywhere"}}>{selected.id}</code></p>
 <p style={{margin:0,fontSize:13}}>{en?"Registered":"נרשם בתאריך"}: {localDate(selected.createdAt,en)}</p><p style={{margin:0,fontSize:13}}>{en?"Last sign-in":"כניסה אחרונה"}: {localDate(selected.lastSignInAt,en)}</p>
 <p style={{margin:0,fontSize:13}}>{en?"Email verified":"מייל אומת"}: {localDate(selected.emailConfirmedAt,en)}</p><p style={{margin:0,fontSize:13}}>{en?"Authentication provider":"שיטת התחברות"}: {selected.provider}</p>
 <div style={{display:"flex",gap:9,flexWrap:"wrap"}}><button type="button" onClick={()=>navigator.clipboard?.writeText(selected.id)} style={{...field,width:"auto",cursor:"pointer"}}>{en?"Copy account ID":"העתקת מזהה חשבון"}</button><a href={"mailto:"+encodeURIComponent(selected.email)+"?subject="+encodeURIComponent("HOW? Support")} style={{...field,width:"auto",textDecoration:"none",display:"inline-block"}}>{en?"Email user":"שליחת מייל למשתמש"}</a></div></section>}
 </>}
 </section></main>
}
