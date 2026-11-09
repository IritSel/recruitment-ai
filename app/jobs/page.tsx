"use client";
import Link from "next/link";
import JobsBoard from "../components/JobsBoard";
import {useSiteLanguage} from "../components/useSiteLanguage";
export default function PublicJobs(){
 const en=useSiteLanguage()==="en";
 return <main className="shell" dir={en?"ltr":"rtl"}>
  <nav className="nav"><Link className="brand" href="/">HOW?</Link>
   <div className="navlinks">
    <b>{en?"All jobs":"כל המשרות"}</b>
    <Link href="/candidate/register">{en?"For candidates":"למועמדים"}</Link>
    <Link href="/login">{en?"Sign in":"התחברות"}</Link>
   </div>
  </nav>
  <JobsBoard/>
 </main>;
}