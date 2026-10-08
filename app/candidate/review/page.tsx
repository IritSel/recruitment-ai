"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useSiteLanguage} from "../../components/useSiteLanguage";
type Experience={role:string;company:string;period:string;details:string};
type Profile={fullName:string;email:string;phone:string;summary:string;experience:Experience[];education:string;training:string;skills:string;languages:string};
export default function Review(){
 const en=useSiteLanguage()==="en";
 const [profile,setProfile]=useState<Profile|null>(null);
 useEffect(()=>{try{const raw=sessionStorage.getItem("cv-analysis");if(raw)setProfile(JSON.parse(raw));}catch{}},[]);
 const labels:Record<string,string>=en?{fullName:"Full name",email:"Email",phone:"Phone",summary:"Professional summary",education:"Education",training:"Training",skills:"Skills",languages:"Languages"}:{fullName:"שם מלא",email:"אימייל",phone:"טלפון",summary:"תקציר מקצועי",education:"השכלה",training:"הכשרות",skills:"כישורים",languages:"שפות"};
 const update=(key:keyof Profile,value:string)=>setProfile(x=>x?{...x,[key]:value}:x);
 const save=()=>{if(!profile)return;sessionStorage.setItem("candidate-profile",JSON.stringify(profile));window.location.href="/candidate/jobs";};
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">Recruitment AI</Link></nav><section className="choice" style={{maxWidth:760,margin:"60px auto"}}>
 <Link href="/candidate">← {en?"Back":"חזרה"}</Link>
 <h1>{en?"Review your CV details":"בדיקת הפרטים שחולצו מקורות החיים"}</h1>
 {!profile?<p>{en?"No analyzed CV found. Upload or paste a CV first.":"לא נמצא ניתוח קורות חיים. יש להעלות קובץ או להדביק טקסט קודם."}</p>:<>
 <p>{en?"Check every field, correct errors and add missing information before approval.":"בדקו את הפרטים, תקנו שגיאות והוסיפו מידע חסר לפני האישור."}</p>
 {(["fullName","email","phone","summary","education","training","skills","languages"] as const).map(k=><label key={k} style={{display:"grid",gap:6,marginBottom:14}}><b>{labels[k]}</b><textarea value={String(profile[k]||"")} onChange={e=>update(k,e.target.value)} rows={k==="summary"?3:2} style={field}/></label>)}
 <h2>{en?"Work experience":"ניסיון תעסוקתי"}</h2>
 {(profile.experience||[]).map((x,i)=><div className="choice" key={i}>{(["role","company","period","details"] as const).map(k=><label key={k} style={{display:"grid",gap:5,marginBottom:10}}><b>{({role:en?"Role":"תפקיד",company:en?"Company":"חברה",period:en?"Period":"תקופה",details:en?"Responsibilities":"תחומי אחריות"})[k]}</b><textarea value={x[k]||""} rows={2} style={field} onChange={e=>setProfile(p=>p?{...p,experience:p.experience.map((v,j)=>i===j?{...v,[k]:e.target.value}:v)}:p)}/></label>)}<button onClick={()=>setProfile(p=>p?{...p,experience:p.experience.filter((_,j)=>j!==i)}:p)}>{en?"Remove role":"הסרת תפקיד"}</button></div>)}
 <button onClick={()=>setProfile(p=>p?{...p,experience:[...(p.experience||[]),{role:"",company:"",period:"",details:""}]}:p)}>{en?"Add experience":"הוספת ניסיון"}</button>
 <div style={{marginTop:24}}><button className="button" disabled={!profile.fullName?.trim()} onClick={save}>{en?"Approve profile and continue":"אישור הפרופיל והמשך למשרות"}</button></div>
 <small>{en?"Demo: profile is saved in this browser tab, not a user database.":"דמו: הפרופיל נשמר בלשונית הדפדפן ולא במסד נתוני משתמשים."}</small>
 </>}
 </section></main>;
}
const field={width:"100%",padding:12,border:"1px solid #ddd",borderRadius:10,font:"inherit"};