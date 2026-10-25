"use client";
import Link from "next/link";
import QaDemoBanner from "../../components/QaDemoBanner";
import JobsBoard from "../../components/JobsBoard";
import {useSiteLanguage} from "../../components/useSiteLanguage";
export default function CandidateJobs(){const en=useSiteLanguage()==="en";return <main className="shell"><QaDemoBanner/><nav className="nav"><Link className="brand" href="/">HOW?</Link><div className="navlinks candidateTabs"><b>{en?"For me":"משרות בשבילי"}</b><Link href="/jobs">{en?"All jobs":"כל המשרות"}</Link><Link href="/candidate/applications">{en?"My applications":"המועמדויות שלי"}</Link><Link href="/candidate/profile">{en?"My profile":"הפרופיל שלי"}</Link></div></nav><JobsBoard personal/></main>}