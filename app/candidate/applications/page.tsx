"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useSiteLanguage} from "../../components/useSiteLanguage";
type Submission={id:string;jobId:string;title:string;company:string;status:string;submittedAt:string};
const key="how-qa-candidate-applications-v1";
export default function Applications(){
 const en=useSiteLanguage()==="en";
 const [items,setItems]=useState<Submission[]>([]);
 const [qa,setQa]=useState(false);
 useEffect(()=>{try{const context=JSON.parse(sessionStorage.getItem("qa-demo-context")||"null");const active=context?.kind==="demo"&&context?.role==="candidate";setQa(active);if(active){const v=JSON.parse(localStorage.getItem(key)||"[]");setItems(Array.isArray(v)?v:[])}}catch{}},[]);
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">HOW?</Link><div className="navlinks candidateTabs"><Link href="/candidate/jobs">{en?"Jobs":"משרות"}</Link><b>{en?"My applications":"המועמדויות שלי"}</b><Link href="/candidate/profile">{en?"My profile":"הפרופיל שלי"}</Link></div></nav>
 <section style={{padding:"30px 0 60px",maxWidth:980,margin:"auto"}}>
 <h1 style={{fontSize:28}}>{en?"My applications":"המועמדויות שלי"}</h1>
 {qa&&<p style={{fontSize:13,color:"#745f46",background:"#fff7e6",padding:12,borderRadius:10}}>{en?"QA mode: entries are saved in this browser only, not delivered to employers.":"מצב QA: מועמדויות דמו נשמרות בדפדפן הזה בלבד ואינן נשלחות למעסיקים."}</p>}
 {items.length?items.map(item=><article className="choice" key={item.id} style={{marginBottom:14,padding:20}}>
 <small style={{color:"#5c428b",fontWeight:700}}>{en?"Demo submitted":"הוגשה — דמו"}</small>
 <h2 style={{fontSize:19}}>{item.title}</h2>
 <p style={{fontSize:13}}>{item.company} · {en?"Submitted":"נשלחה לבדיקה"} · {new Date(item.submittedAt).toLocaleDateString(en?"en-US":"he-IL")}</p>
 <Link className="button" href={"/candidate/jobs/"+item.jobId}>{en?"Job details":"לפרטי המשרה"}</Link>
 </article>):<div className="choice" style={{padding:25}}><h2 style={{fontSize:18}}>{en?"No applications yet":"עדיין אין מועמדויות"}</h2><p>{qa?(en?"Apply to a QA demo job to test that it appears here.":"הגישי מועמדות למשרת דמו כדי לבדוק שהיא מופיעה כאן."):(en?"Your real submitted applications will appear here when the live application service is connected.":"כאן יוצגו המועמדויות שלך לאחר חיבור מערכת ההגשה הפעילה.")}</p><Link className="button" href="/candidate/jobs">{en?"Browse jobs":"מעבר למשרות"}</Link></div>}
 </section></main>
}