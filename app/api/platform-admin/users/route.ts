import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
export const dynamic="force-dynamic";
export const runtime="nodejs";
const deny=(status:number,code:string)=>NextResponse.json({error:code},{status,headers:{"Cache-Control":"no-store"}});
export async function GET(request:NextRequest){
 const allow=(process.env.PLATFORM_ADMIN_EMAILS||"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const publicKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 const privateKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!allow.length||!url||!publicKey||!privateKey)return deny(503,"admin_not_configured");
 const token=request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
 if(!token)return deny(401,"authentication_required");
 try{
  const auth=createClient(url,publicKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:identity,error:authError}=await auth.auth.getUser(token);
  const user=identity.user;
  if(authError||!user)return deny(401,"invalid_session");
  if(!user.email_confirmed_at||!allow.includes((user.email||"").trim().toLowerCase()))return deny(403,"access_denied");
  const pageParam=Number(request.nextUrl.searchParams.get("page")||"1");
  const page=Number.isInteger(pageParam)?Math.min(10000,Math.max(1,pageParam)):1;
  const admin=createClient(url,privateKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await admin.auth.admin.listUsers({page,perPage:50});
  if(error)return deny(502,"users_unavailable");
  const rows=data.users.map(x=>({
   id:x.id,email:x.email||"",firstName:String(x.user_metadata?.first_name||""),
   lastName:String(x.user_metadata?.last_name||""),
   createdAt:x.created_at,lastSignInAt:x.last_sign_in_at||null,
   emailConfirmedAt:x.email_confirmed_at||null,
   provider:x.app_metadata?.provider||"email",
   bannedUntil:x.banned_until||null
  }));
  return NextResponse.json({users:rows,page,total:data.total??null,hasNext:rows.length===50}, {headers:{"Cache-Control":"no-store, private","X-Content-Type-Options":"nosniff"}});
 }catch{return deny(502,"admin_service_unavailable")}
}
