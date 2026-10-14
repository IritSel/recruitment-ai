import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
export const dynamic="force-dynamic";
export async function GET(request:NextRequest){
 const allowed=(process.env.QA_TESTER_EMAILS||"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);
 if(!allowed.length)return NextResponse.json({allowed:false,reason:"not_configured"},{status:403});
 const token=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
 if(!token)return NextResponse.json({allowed:false},{status:401});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return NextResponse.json({allowed:false},{status:503});
 const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await client.auth.getUser(token);
 if(error||!data.user||!data.user.email_confirmed_at||!allowed.includes((data.user.email||"").toLowerCase()))return NextResponse.json({allowed:false},{status:403});
 return NextResponse.json({allowed:true});
}
