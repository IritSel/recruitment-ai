"use client";
import Link from "next/link";
import JobsBoard from "../components/JobsBoard";
export default function PublicJobs(){return <main className="shell"><nav className="nav"><Link className="brand" href="/">HOW?</Link><div className="navlinks"><b>כל המשרות</b><Link href="/candidate/register">למועמדים</Link><Link href="/login">התחברות</Link></div></nav><JobsBoard/></main>}