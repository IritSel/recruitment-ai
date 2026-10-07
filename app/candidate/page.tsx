"use client";
import Link from "next/link";
import {useRef,useState} from "react";
export default function Candidate(){
 const fileRef=useRef<HTMLInputElement>(null); const [mode,setMode]=useState("home"); const [file,setFile]=useState(""); const [step,setStep]=useState(0); const [data,setData]=useState({role:"",company:"",years:"",tasks:"",previous:"",education:"",skills:"",languages:""});
 const set=(k:string,v:string)=>setData({...data,[k]:v});
 const questions=[
 ["role","מה היה התפקיד האחרון שלך?","לדוגמה: מוכרת בגדים"],
 ["company","איפה עבדת?","שם החנות או סוג העסק"],
 ["years","באילו שנים עבדת שם?","לדוגמה: 2023–2026"],
 ["tasks","מה עשית בתפקיד ביום־יום?","מכירות, שירות, קופה, סידור סחורה..."],
 ["previous","היה לך ניסיון קודם?","כתבי תפקיד ומקום, או 'לא'"],
 ["education","מה לגבי השכלה או הכשרות?","תיכון, תואר, קורסים, תעודות..."],
 ["skills","אילו כישורים מקצועיים יש לך?","לדוגמה: שירות לקוחות, מכירות, Office"],
 ["languages","אילו שפות את יודעת ובאיזו רמה?","לדוגמה: עברית שפת אם, אנגלית טובה"]
 ];
 if(mode==="builder"){
  if(step<questions.length){const [k,q,p]=questions[step]; const val=(data as any)[k];return <main className="shell"><nav className="nav"><Link className="brand" href="/">Recruitment AI</Link></nav><section style={{maxWidth:650,margin:"70px auto",background:"#fff",padding:40,borderRadius:24,border:"1px solid #e8e4dc"}}><button onClick={()=>step?setStep(step-1):setMode("home")} style={{border:0,background:"transparent",cursor:"pointer"}}>→ חזרה</button><span className="eyebrow">בניית קורות חיים · {step+1}/{questions.length}</span><h1>{q}</h1><input value={val} onChange={e=>set(k,e.target.value)} placeholder={p} style={{width:"100%",padding:14,border:"1px solid #ddd",borderRadius:12,font:"inherit"}}/><button disabled={!val.trim()} onClick={()=>setStep(step+1)} className="button" style={{border:0,marginTop:16,cursor:val.trim()?"pointer":"not-allowed",opacity:val.trim()?1:.45}}>המשך</button></section></main>}
  return <main className="shell"><section style={{maxWidth:720,margin:"60px auto",background:"#fff",padding:40,borderRadius:24,border:"1px solid #e8e4dc"}}><span className="eyebrow">טיוטת קורות החיים שלך</span><h1>{data.role}</h1><h2>ניסיון</h2><p><b>{data.company}</b> · {data.years}</p><p>{data.tasks}</p><p><b>ניסיון קודם:</b> {data.previous}</p><h2>השכלה והכשרות</h2><p>{data.education}</p><h2>כישורים</h2><p>{data.skills}</p><h2>שפות</h2><p>{data.languages}</p><div style={{display:"flex",gap:12}}><button onClick={()=>setStep(0)} style={{padding:12}}>עריכת התשובות</button><Link className="button" href="/candidate/jobs">אישור קורות החיים והמשך למשרות ←</Link></div></section></main>
 }
 if(mode==="paste")return <main className="shell"><section style={{maxWidth:650,margin:"70px auto"}}><button onClick={()=>setMode("home")}>→ חזרה</button><h1>הדבקת קורות חיים</h1><textarea style={{width:"100%",minHeight:240}}/><Link className="button" href="/candidate/review">המשך לניתוח</Link></section></main>;
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">Recruitment AI</Link></nav><section style={{maxWidth:650,margin:"70px auto",background:"#fff",padding:40,borderRadius:24,border:"1px solid #e8e4dc"}}><span className="eyebrow">מסלול מועמד/ת</span><h1>בואו נתחיל מקורות החיים שלך</h1><p>אפשר להעלות קובץ, להדביק קורות חיים או לבנות אותם יחד.</p><input ref={fileRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={e=>setFile(e.target.files?.[0]?.name||"")}/><div style={{display:"grid",gap:12}}><button onClick={()=>fileRef.current?.click()} className="button">{file||"העלאת PDF או Word"}</button><button onClick={()=>setMode("paste")}>הדבקת קורות חיים</button><button onClick={()=>{setMode("builder");setStep(0)}}>אין לי קורות חיים — עזרו לי לבנות</button></div>{file&&<Link className="button" href="/candidate/review" style={{marginTop:16}}>המשך לניתוח קורות החיים ←</Link>}</section></main>
}