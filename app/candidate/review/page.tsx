"use client";
import Link from "next/link";
import {useSiteLanguage} from "../../components/useSiteLanguage";
export default function Review(){
 const en=useSiteLanguage()==="en";
 return <main className="shell"><nav className="nav"><Link className="brand" href="/">Recruitment AI</Link></nav>
 <section style={{maxWidth:650,margin:"70px auto",background:"#fff",padding:40,borderRadius:24,border:"1px solid #e8e4dc"}}>
 <Link href="/candidate" className="backLink">← {en?"Back to CV options":"חזרה לאפשרויות קורות החיים"}</Link>
 <span className="eyebrow">{en?"CV review":"בדיקת קורות החיים"}</span>
 <h1>{en?"CV analysis isn't available yet":"ניתוח קורות החיים עדיין לא זמין"}</h1>
 <p style={{color:"#64748b",lineHeight:1.7}}>{en?"Your file or pasted text has not been analyzed. We won't ask you to approve details we haven't extracted.":"הקובץ או הטקסט שהוזנו עדיין לא נותחו. לא נבקש ממך לאשר פרטים שלא חולצו."}</p>
 <div className="choice"><b>{en?"What can you do now?":"מה אפשר לעשות כרגע?"}</b>
 <p>{en?"You can build a CV manually in the demo, or return to the CV options. File upload and parsing will be connected later.":"אפשר לבנות קורות חיים ידנית בדמו, או לחזור לאפשרויות. העלאת הקובץ וניתוחו יחוברו בהמשך."}</p></div>
 <Link className="button" href="/candidate">{en?"Back to CV builder":"חזרה לבניית קורות חיים"}</Link>
 </section></main>;
}