import {NextRequest,NextResponse} from "next/server";
export const runtime="nodejs";
function analyze(text:string){
 const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 const skills=["CRM","Excel","Word","PowerPoint","SQL","Python","JavaScript","שירות לקוחות","מכירות","ניהול צוות","ניהול פרויקטים","תפעול","שירות פרונטלי","הדרכה","גיוס","משאבי אנוש","customer service","sales","project management","leadership","training"];
 const found=skills.filter(x=>text.toLowerCase().includes(x.toLowerCase()));
 const years=[...text.matchAll(/(?:19|20)\d{2}/g)].map(x=>Number(x[0])).filter(x=>x>=1950&&x<=new Date().getFullYear());
 const education=lines.filter(x=>/(תואר|בגרות|השכלה|אוניברסיט|מכלל|BA\b|B\.A|MBA|M\.A|degree|bachelor|master|university|college)/i.test(x)).slice(0,5);
 const work=lines.filter(x=>/(ניסיון|עבדתי|עבודה ב|אחראי|מנהלת|מנהל|נציג|רכז|20\d{2}\s*[-–]\s*(?:20\d{2}|היום)|experience|manager|representative|coordinator|specialist)/i.test(x)).slice(0,8);
 const missing:string[]=[];if(!education.length)missing.push("Education / השכלה לא זוהתה");if(!work.length)missing.push("Work experience / ניסיון מקצועי לא זוהה");if(!found.length)missing.push("Skills / מיומנויות לא זוהו");
 return {experience:work,education,skills:found,yearsMentioned:[...new Set(years)].sort(),missing,note:"זיהוי ראשוני באמצעות כללים בלבד; העדר זיהוי אינו מעיד על העדר ניסיון. / Basic rule-based extraction, not AI."};
}
export async function POST(req:NextRequest){try{const form=await req.formData();let text=String(form.get("text")||"");const file=form.get("file");if(file instanceof File){if(file.size>5*1024*1024)return NextResponse.json({error:"Maximum file size is 5 MB"},{status:413});const bytes=Buffer.from(await file.arrayBuffer());const name=file.name.toLowerCase();if(name.endsWith(".docx")){const mammoth=(await import("mammoth")).default;text=(await mammoth.extractRawText({buffer:bytes})).value}else if(name.endsWith(".pdf")){const pdf=(await import("pdf-parse")).default;text=(await pdf(bytes)).text}else return NextResponse.json({error:"Only PDF and DOCX supported for extraction"},{status:415})}if(text.trim().length<10)return NextResponse.json({error:"No readable CV text detected"},{status:422});return NextResponse.json({analysis:analyze(text.slice(0,30000))})}catch{return NextResponse.json({error:"Unable to analyze this document"},{status:422})}}