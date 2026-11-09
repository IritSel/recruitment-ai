"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useParams} from "next/navigation";
type Submission={id:string;jobId:string;title:string;company:string;status:string;submittedAt:string};
const data:Record<string,{title:string;city:string;description:string}>={"1":{title:"נציג/ת שירות לקוחות",city:"באר שבע",description:"שירות לקוחות, עבודה בצוות ומענה לפניות."},"2":{title:"נציג/ת שירות ומכירה",city:"באר שבע",description:"שירות לקוחות ומכירות."},"3":{title:"אחמ״ש/ית מוקד שירות",city:"אשדוד",description:"ניהול משמרת מוקד ותמיכה בצוות."},"4":{title:"רכז/ת משאבי אנוש",city:"תל אביב",description:"תמיכה בתהליכי גיוס וקליטת עובדים."}};
const key="how-qa-candidate-applications-v1";
const recruiterKey="how-qa-applications";
const recruiterJobIds:Record<string,string>={"1":"qa-demo-service","2":"qa-demo-service","3":"qa-demo-team","4":"qa-demo-backoffice"};
export default function JobDetails(){
 const params=useParams();const id=String(params?.id||"1");const job=data[id];
 const [qa,setQa]=useState(false),[sent,setSent]=useState(false),[q,setQ]=useState(false),[no,setNo]=useState(false),[reason,setReason]=useState("");
 useEffect(()=>{try{const x=JSON.parse(sessionStorage.getItem("qa-demo-context")||"null");setQa(x?.kind==="demo"&&x?.role==="candidate");const stored=JSON.parse(localStorage.getItem(key)||"[]") as Submission[];setSent(stored.some(item=>item.jobId===id))}catch{}},[id]);

 function submit(){
 if(!qa||!job)return;
 try{
  const raw=JSON.parse(localStorage.getItem(key)||"[]");
  const applications=Array.isArray(raw)?raw:[] as Submission[];
  const profiles=JSON.parse(localStorage.getItem("how-qa-candidate-profiles-v2")||"[]");
  const candidate=Array.isArray(profiles)?profiles[0]:null;
  const candidateId=candidate?.id||"qa-noa-levi";
  const selectedCv=Array.isArray(candidate?.cv)?candidate.cv.find((x:{primary?:boolean})=>x.primary)||candidate.cv[0]:null;
  const now=new Date().toISOString();
  if(!applications.some((x:Submission)=>x.jobId===id)){
   applications.unshift({id:"qa-"+id,jobId:id,title:job.title,company:"חברת דמו א׳",status:"review",submittedAt:now});
   localStorage.setItem(key,JSON.stringify(applications));
  }
  const stored=JSON.parse(localStorage.getItem(recruiterKey)||"[]");
  const recruiter=Array.isArray(stored)?stored:[];
  if(!recruiter.some((x:{candidateId?:string;sourceJobId?:string})=>x.candidateId===candidateId&&x.sourceJobId===id)){
   recruiter.unshift({candidateId,jobId:recruiterJobIds[id],sourceJobId:id,status:"review",submittedAt:now,origin:"candidate-qa",candidateName:candidate?.name||"מועמדת QA",candidateRole:candidate?.role||"",candidateCity:candidate?.city||"",candidateExperience:candidate?.experience||"",candidateSkills:candidate?.skills||"",cvTitle:selectedCv?.title||"",cvContent:selectedCv?.content||"",cvFileName:selectedCv?.fileName||""});
   localStorage.setItem(recruiterKey,JSON.stringify(recruiter));
  }
  setSent(true);
 }catch{setSent(false)}
}

 return <main className="shell"><section className="choice" style={{maxWidth:750,margin:"48px auto",display:"grid",gap:12}}>
 <Link href="/candidate/jobs">← חזרה למשרות</Link>
 {!qa||!job?<><h1>פרטי משרה</h1><p>משרות אלה מיועדות לבדיקות QA בלבד. לא ניתן להגיש מועמדות דמו מחוץ למצב QA של מועמד.</p><Link className="button" href="/jobs">כל המשרות</Link></>:sent?<><h1>המועמדות נשמרה בסביבת QA ✓</h1><p>המועמדות למשרת {job.title} נוספה לרשימת ״המועמדויות שלי״. המועמדות תופיע גם אצל המגייסת באותו דפדפן. אין שליחה למעסיק אמיתי.</p><Link className="button" href="/candidate/applications">למועמדויות שלי</Link></>:<>
 <small>חברת דמו · {job.city} · סביבת QA</small><h1>{job.title}</h1><p>{job.description} הנתונים פיקטיביים לצורך בדיקה.</p>
 {no?<><h2>מה פחות מתאים לך?</h2><p>המידע ישמש בהמשך לשיפור ההמלצות.</p>{["התפקיד","המיקום","השכר/התנאים","סוג המשרה","אחר"].map(x=><button type="button" key={x} onClick={()=>setReason(x)} style={{padding:10,margin:4}}>{x}</button>)}{reason&&<p>נבחר: {reason} (בדיקת QA)</p>}</>:q?<><h2>שאלה קצרה לפני ההגשה</h2><p>האם יש לך ניסיון או כישורים רלוונטיים לתפקיד?</p><button type="button" className="button" onClick={submit}>אישור ושמירת מועמדות דמו</button></>:<div style={{display:"flex",flexWrap:"wrap",gap:12}}><button type="button" className="button" onClick={()=>setQ(true)}>הגש/י מועמדות דמו</button><button type="button" onClick={()=>setNo(true)}>לא מעוניין/ת</button></div>}
 </>}
 </section></main>
}