"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useParams} from "next/navigation";
import {useSiteLanguage} from "../../../components/useSiteLanguage";
type Submission={candidateId?:string;id:string;jobId:string;title:string;company:string;status:string;submittedAt:string};
const data:Record<string,{title:string;city:string;description:string}>={"1":{title:"נציג/ת שירות לקוחות",city:"באר שבע",description:"שירות לקוחות, עבודה בצוות ומענה לפניות."},"2":{title:"נציג/ת שירות ומכירה",city:"באר שבע",description:"שירות לקוחות ומכירות."},"3":{title:"אחמ״ש/ית מוקד שירות",city:"אשדוד",description:"ניהול משמרת מוקד ותמיכה בצוות."},"4":{title:"רכז/ת משאבי אנוש",city:"תל אביב",description:"תמיכה בתהליכי גיוס וקליטת עובדים."}};
const enJobs:Record<string,{title:string;city:string;description:string}>={
 "1":{title:"Customer Service Representative",city:"Be'er Sheva",description:"Customer support and inquiries in a team environment."},
 "2":{title:"Customer Service & Sales Representative",city:"Be'er Sheva",description:"Customer service and sales."},
 "3":{title:"Customer Service Shift Supervisor",city:"Ashdod",description:"Shift management and support for service representatives."},
 "4":{title:"Human Resources Coordinator",city:"Tel Aviv",description:"Support for recruitment and onboarding."}
};
const key="how-qa-candidate-applications-v1";
const recruiterKey="how-qa-applications";
const recruiterJobIds:Record<string,string>={"1":"qa-demo-service","2":"qa-demo-service","3":"qa-demo-team","4":"qa-demo-backoffice"};
export default function JobDetails(){
 const en=useSiteLanguage()==="en";
 const params=useParams();const id=String(params?.id||"1");const job=data[id];const displayedJob=en?enJobs[id]||job:job;
 const [qa,setQa]=useState(false),[sent,setSent]=useState(false),[q,setQ]=useState(false),[no,setNo]=useState(false),[reason,setReason]=useState("");
 useEffect(()=>{try{const x=JSON.parse(sessionStorage.getItem("qa-demo-context")||"null");setQa(x?.kind==="demo"&&x?.role==="candidate");const stored=JSON.parse(localStorage.getItem(key)||"[]") as Submission[];const candidateId=localStorage.getItem("how-qa-selected-candidate-id")||"qa-noa-levi";setSent(Array.isArray(stored)&&stored.some(item=>item.jobId===id&&(item.candidateId===candidateId||(!item.candidateId&&candidateId==="qa-noa-levi"))))}catch{}},[id]);

 function submit(){
 if(!qa||!job)return;
 try{
  const raw=JSON.parse(localStorage.getItem(key)||"[]");
  const applications=Array.isArray(raw)?raw:[] as Submission[];
  const profiles=JSON.parse(localStorage.getItem("how-qa-candidate-profiles-v2")||"[]");
  const candidate=Array.isArray(profiles)?profiles.find((x:{id:string})=>x.id===localStorage.getItem("how-qa-selected-candidate-id"))||profiles[0]:null;
  const candidateId=candidate?.id||"qa-noa-levi";
  const selectedCv=Array.isArray(candidate?.cv)?candidate.cv.find((x:{primary?:boolean})=>x.primary)||candidate.cv[0]:null;
  const now=new Date().toISOString();
  if(!applications.some((x:Submission)=>x.jobId===id&&(x.candidateId===candidateId||(!x.candidateId&&candidateId==="qa-noa-levi")))){
   applications.unshift({id:"qa-"+id+"-"+candidateId,candidateId,jobId:id,title:job.title,company:"חברת דמו א׳",status:"review",submittedAt:now});
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
 <Link href="/candidate/jobs">{en?"← Back to jobs":"← חזרה למשרות"}</Link>
 {!qa||!job?<><h1>{en?"Job details":"פרטי משרה"}</h1><p>{en?"These are QA demonstration jobs and cannot be applied to outside candidate QA mode.":"משרות אלה מיועדות לבדיקות QA בלבד. לא ניתן להגיש מועמדות דמו מחוץ למצב QA של מועמד."}</p><Link className="button" href="/jobs">{en?"All jobs":"כל המשרות"}</Link></>:sent?<><h1>{en?"Application saved in QA ✓":"המועמדות נשמרה בסביבת QA ✓"}</h1><p>{en?`Your application for ${displayedJob.title} was saved in My applications. It is available to the recruiter in the same browser only; no real employer was contacted.`:`המועמדות למשרת ${job.title} נוספה לרשימת ״המועמדויות שלי״. המועמדות תופיע גם אצל המגייסת באותו דפדפן. אין שליחה למעסיק אמיתי.`}</p><Link className="button" href="/candidate/applications">{en?"My applications":"למועמדויות שלי"}</Link></>:<>
 <small>{en?"Demo company":"חברת דמו"} · {displayedJob.city} · QA</small><h1>{displayedJob.title}</h1><p>{displayedJob.description} {en?"Fictional information for interface testing only.":"הנתונים פיקטיביים לצורך בדיקה."}</p>
 {no?<><h2>{en?"What is not a good fit?":"מה פחות מתאים לך?"}</h2><p>{en?"This can help improve future recommendations.":"המידע ישמש בהמשך לשיפור ההמלצות."}</p>{(en?["The role","Location","Salary or conditions","Job type","Other"]:["התפקיד","המיקום","השכר/התנאים","סוג המשרה","אחר"]).map(x=><button type="button" key={x} onClick={()=>setReason(x)} style={{padding:10,margin:4}}>{x}</button>)}{reason&&<p>{en?"Selected: ":"נבחר: "}{reason} (QA)</p>}</>:q?<><h2>{en?"A quick question before applying":"שאלה קצרה לפני ההגשה"}</h2><p>{en?"Do you have relevant experience or skills for this role?":"האם יש לך ניסיון או כישורים רלוונטיים לתפקיד?"}</p><button type="button" className="button" onClick={submit}>{en?"Confirm and submit QA application":"אישור ושמירת מועמדות דמו"}</button></>:<div style={{display:"flex",flexWrap:"wrap",gap:12}}><button type="button" className="button" onClick={()=>setQ(true)}>{en?"Apply in QA":"הגש/י מועמדות דמו"}</button><button type="button" onClick={()=>setNo(true)}>{en?"Not interested":"לא מעוניין/ת"}</button></div>}
 </>}
 </section></main>
}