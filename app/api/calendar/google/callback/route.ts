import {NextRequest,NextResponse} from "next/server";
import {timingSafeEqual} from "crypto";
export const dynamic="force-dynamic";
const redirect="https://www.hiredofwaiting.com/api/calendar/google/callback";
export async function GET(req:NextRequest){
 const back=new URL("/recruiter/schedule",req.url);
 const state=req.nextUrl.searchParams.get("state")||"";
 const expected=req.cookies.get("how_google_oauth_state")?.value||"";
 const a=Buffer.from(state),b=Buffer.from(expected);
 const valid=a.length===b.length&&a.length>0&&timingSafeEqual(a,b);
 const code=req.nextUrl.searchParams.get("code");
 if(req.nextUrl.searchParams.get("error")||!valid||!code){back.searchParams.set("calendar","denied");return NextResponse.redirect(back)}
 const id=process.env.GOOGLE_CLIENT_ID,secret=process.env.GOOGLE_CLIENT_SECRET;
 if(!id||!secret){back.searchParams.set("calendar","config");return NextResponse.redirect(back)}
 try{
 const body=new URLSearchParams({client_id:id,client_secret:secret,code,grant_type:"authorization_code",redirect_uri:redirect});
 const res=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:body.toString(),cache:"no-store"});
 if(!res.ok){back.searchParams.set("calendar","exchange_failed");return NextResponse.redirect(back)}
 const data=await res.json() as {access_token?:string};
 if(!data.access_token)throw new Error("No access token");
 const check=await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=1",{headers:{Authorization:"Bearer "+data.access_token},cache:"no-store"});
 back.searchParams.set("calendar",check.ok?"verified":"scope_error");
 }catch{back.searchParams.set("calendar","error")}
 // Deliberately discard OAuth tokens until encrypted per-user storage is implemented.
 const response=NextResponse.redirect(back);
 response.cookies.delete("how_google_oauth_state");
 return response;
}