"use client";
import Link from "next/link";
import {useState} from "react";
import {useSiteLanguage} from "../../../components/useSiteLanguage";
const example={name:"נועה כהן",city:"באר שבע",summary:"בעלת ניסיון של שלוש שנים בשירות לקוחות, טיפול בפניות לקוחות ועבודה בסביבה ממוחשבת.",experience:[{role:"נציגת שירות לקוחות",company:"חברה לדוגמה א׳",period:"2023–2026",details:"מענה לפניות לקוחות בטלפון ובערוצים דיגיטליים, תיעוד פניות במערכת CRM ועבודה עם ממשקים פנימיים."},{role:"נציגת מוקד",company:"חברה לדוגמה ב׳",period:"2022–2023",details:"מענה ראשוני לפניות, ניתוב פניות ומעקב אחר טיפול."}],education:"12 שנות לימוד",skills:["שירות לקוחות","תקשורת בין־אישית","עבודה עם CRM","עבודה בצוות"],languages:["עברית — שוטפת"],availability:"מיידית"};
export default function CandidateProfile(){
 const en=useSiteLanguage()==="en";
 const [status,setStatus]=useState("בדיקת מגייסת");
 const [cvOpen,setCvOpen]=useState(true);
 return <main className="shell"><section style={{maxWidth:980,margin:"40px auto"}}>
 <Link href="/recruiter/jobs/1">→ {en?"Back to job":"חזרה למשרה"}</Link>
 <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap",marginTop:20}}><div><h1>{example.name}</h1><p>{example.city} · {example.availability}</p></div><span className="eyebrow">{en?"DEMO DATA — NOT A REAL CV":"נתוני הדגמה — לא קורות חיים אמיתיים"}</span></div>
 <div className="choice"><h2>{en?"Why this candidate may fit":"למה נועה עשויה להתאים למשרה?"}</h2>
 <p>{en?"Based only on the sample CV below and the demo job requirements. Not a real AI assessment.":"ההסבר מבוסס רק על קורות החיים לדוגמה ועל דרישות המשרה לדוגמה. זה אינו ניתוח AI אמיתי."}</p>
 <ul style={{lineHeight:2}}><li><b>{en?"Relevant experience":"ניסיון רלוונטי"}:</b> {en?"3 years in customer service are stated in the demo CV.":"בקורות החיים לדוגמה מצוינות שלוש שנות ניסיון בשירות לקוחות."}</li><li><b>{en?"Location":"מיקום"}:</b> {en?"Beer Sheva matches the demo job location.":"באר שבע תואמת למיקום המשרה לדוגמה."}</li><li><b>{en?"Relevant skills":"כישורים רלוונטיים"}:</b> {en?"CRM and customer communication are listed.":"מופיעים ניסיון בעבודה עם CRM ותקשורת עם לקוחות."}</li></ul>
 <p><b>{en?"Still needs verification":"דורש בירור"}:</b> {en?"Working hours, specific employer requirements, and availability need confirmation.":"התאמה לשעות העבודה, לדרישות המעסיק הספציפיות ואימות הזמינות."}</p></div>
 <div className="choice"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}><h2>{en?"Full CV — demo":"קורות חיים מלאים — הדגמה"}</h2><button type="button" onClick={()=>setCvOpen(x=>!x)} style={{border:"1px solid #ddd6fe",borderRadius:10,padding:10,background:"white",cursor:"pointer"}}>{cvOpen?(en?"Collapse":"צמצום"):(en?"Expand":"הצגה")}</button></div>
 {cvOpen&&<article style={{lineHeight:1.9}}>
 <h3>{example.name}</h3><p>{example.city}</p>
 <h3>{en?"Professional summary":"תקציר מקצועי"}</h3><p>{example.summary}</p>
 <h3>{en?"Work experience":"ניסיון תעסוקתי"}</h3>{example.experience.map((x,i)=><div key={i} style={{padding:"12px 0",borderBottom:"1px solid #eee"}}><b>{x.role} — {x.company}</b><p>{x.period}</p><p>{x.details}</p></div>)}
 <h3>{en?"Education":"השכלה"}</h3><p>{example.education}</p>
 <h3>{en?"Skills":"כישורים"}</h3><p>{example.skills.join(" · ")}</p>
 <h3>{en?"Languages":"שפות"}</h3><p>{example.languages.join(" · ")}</p>
 <h3>{en?"Availability":"זמינות"}</h3><p>{example.availability}</p>
 <p style={{fontSize:13,color:"#64748b"}}>{en?"This is a complete sample profile, not an uploaded CV or a verified candidate record.":"זהו פרופיל הדגמה מלא, לא מסמך קורות חיים שהועלה ולא רשומת מועמדת מאומתת."}</p>
 </article>}</div>
 <div className="choice"><h2>{en?"Recruitment decision":"המשך טיפול"}</h2><p><b>{en?"Status":"סטטוס"}:</b> {status}</p><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button className="button" onClick={()=>setStatus("שיחת טלפון")}>{en?"Phone screening":"שיחת טלפון 15–20 דק׳"}</button><button className="button" onClick={()=>setStatus("הוזמנה לראיון")}>{en?"Invite to interview":"הזמנה לראיון"}</button><button type="button" onClick={()=>setStatus("התהליך הסתיים")} style={{padding:12}}>{en?"Do not proceed":"לא ממשיכים"}</button></div><p style={{fontSize:13,color:"#64748b"}}>{en?"Status changes are temporary demo interactions; no message is sent.":"שינויי הסטטוס הם הדגמה בלבד ואינם שולחים הודעות למועמדת."}</p></div>
 </section></main>
}