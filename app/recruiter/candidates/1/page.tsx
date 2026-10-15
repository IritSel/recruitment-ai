"use client";
import Link from "next/link";
import {useSiteLanguage} from "../../../components/useSiteLanguage";
import {useState} from "react";
export default function CandidateSearchProfile(){
 const en=useSiteLanguage()==="en";
 const [note,setNote]=useState("");
 return <main className="shell"><section className="choice" style={{maxWidth:800,margin:"50px auto"}}>
 <Link href="/recruiter/candidates">→ {en?"Back to search":"חזרה לחיפוש"}</Link>
 <h1>נועה כהן</h1><p>{en?"Team management · 4 years experience · Beer Sheva":"מנהלת צוות · 4 שנות ניסיון · באר שבע"}</p>
 <p style={{fontSize:13,color:"#6b5d91"}}>{en?"QA DEMO: Sample candidate, not an uploaded real CV.":"הדגמת QA: מועמדת לדוגמה, לא קורות חיים שהועלו בפועל."}</p>
 <h2>{en?"Experience & skills":"ניסיון וכישורים"}</h2><p>{en?"Team management · Customer service · Training · Process implementation":"ניהול צוות · שירות · הדרכה · הטמעת תהליכים"}</p>
 <div style={{border:"1px solid #ddd6fe",borderRadius:14,padding:20,margin:"22px 0"}}>
 <h2>{en?"CV and job fit":"קורות חיים וניתוח התאמה"}</h2>
 <p>{en?"Open the sample CV and a short explanation based on its contents.":"צפי בפרופיל קורות החיים לדוגמה ובהסבר קצר המבוסס על המידע שמופיע בו."}</p>
 <Link className="button" href="/recruiter/candidate/1">{en?"View full CV and analysis":"צפייה בקורות חיים מלאים ובניתוח התאמה"}</Link>
 </div>
 <h2>{en?"Next action":"המשך טיפול"}</h2>
 <p>{en?"An invitation is appropriate only for someone who has not applied to the job. It does not submit an application on their behalf.":"הזמנה רלוונטית רק למועמדת שעדיין לא הגישה מועמדות. הזמנה אינה הגשת מועמדות בשמה."}</p>
 <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><Link className="button" href="/recruiter/schedule?candidate=noa">קביעת ראיון ביומן QA</Link>
 <button className="button" onClick={()=>setNote(en?"Demo only: No invitation was actually sent.":"הדגמה בלבד: לא נשלחה הזמנה בפועל.")}>{en?"Invite to apply (demo)":"הזמנה להגשת מועמדות (הדגמה)"}</button>
 <button onClick={()=>setNote(en?"Demo only: Candidate not saved to database.":"הדגמה בלבד: המועמדת לא נשמרה במסד הנתונים.")} style={{padding:12}}>{en?"Save for later (demo)":"שמירה לעתיד (הדגמה)"}</button>
 </div>{note&&<p role="status" style={{color:"#2f6f6a"}}>{note}</p>}
 <p style={{color:"#64748b",marginTop:20}}>{en?"Other applications, employers and activity history are private.":"מועמדויות, חברות אחרות והיסטוריית פעילות אינן חשופות."}</p>
 </section></main>;
}