import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {randomBytes} from "crypto";
export const dynamic="force-dynamic";
export async function POST(req:NextRequest){
 const id=process.env.GOOGLE_CLIENT_ID;
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!id||!url||!key)return NextResponse.json({error:"calendar_not_configured"},{status:503});
 const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
 if(!token)return NextResponse.json({error:"unauthorized"},{status:401});
 const sb=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await sb.auth.getUser(token);
 const allowed=(process.env.QA_TESTER_EMAILS||"").split(",").map(x=>x.trim().toLowerCase());
 if(error||!data.user?.email_confirmed_at||!allowed.includes((data.user.email||"").toLowerCase()))return NextResponse.json({error:"forbidden"},{status:403});
 const state=randomBytes(32).toString("hex");
 const redirect="https://www.hiredofwaiting.com/api/calendar/google/callback";
 const google=new URL("https://accounts.google.com/o/oauth2/v2/auth");
 google.searchParams.set("client_id",id);
 google.searchParams.set("redirect_uri",redirect);
 google.searchParams.set("response_type","code");
 google.searchParams.set("scope","https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.freebusy");
 google.searchParams.set("access_type","offline");
 google.searchParams.set("prompt","consent");
 google.searchParams.set("state",state);
 const response=NextResponse.json({url:google.toString()});
 response.cookies.set("how_google_oauth_state",state,{httpOnly:true,secure:true,sameSite:"lax",maxAge:600,path:"/api/calendar/google"});
 return response;
}