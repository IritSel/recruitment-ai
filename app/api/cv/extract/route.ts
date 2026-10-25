import {NextRequest,NextResponse} from "next/server";
export const runtime="nodejs";
export async function POST(request:NextRequest){
 try{
  const data=await request.formData();
  const file=data.get("file");
  if(!(file instanceof File))return NextResponse.json({error:"Missing file"},{status:400});
  if(file.size>5*1024*1024)return NextResponse.json({error:"File is too large"},{status:413});
  const bytes=Buffer.from(await file.arrayBuffer());
  let text="";
  if(file.name.toLowerCase().endsWith(".docx")){
   const mammoth=(await import("mammoth")).default;
   text=(await mammoth.extractRawText({buffer:bytes})).value;
  }else if(file.name.toLowerCase().endsWith(".pdf")){
   const pdf=(await import("pdf-parse")).default;
   text=(await pdf(bytes)).text;
  }else return NextResponse.json({error:"Only PDF and DOCX can be extracted"},{status:415});
  if(!text.trim())return NextResponse.json({error:"No selectable text found in document"},{status:422});
  return NextResponse.json({text:text.slice(0,30000)});
 }catch{ return NextResponse.json({error:"Document could not be read"},{status:422})}
}