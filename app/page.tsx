"use client";
import Link from "next/link";
import {useSiteLanguage} from "./components/useSiteLanguage";

export default function Home(){
 const en=useSiteLanguage()==="en";
 return <main className="howSite">
  <header className="howNav howWrap">
   <Link href="/" className="howLogo" aria-label="HOW home"><strong>HOW<span>?</span></strong><i>〃</i><small>Hired of Waiting?</small></Link>
   <nav aria-label={en?"Main navigation":"ניווט ראשי"}>
    <a href="#how-it-works">{en?"How it works":"איך זה עובד"}</a>
    <Link href="/jobs">{en?"All jobs":"כל המשרות"}</Link><Link href="/candidate/register">{en?"For candidates":"למחפשי עבודה"}</Link>
    <Link href="/recruiter/register">{en?"For employers":"למעסיקים"}</Link>
    <Link href="/about">{en?"About":"אודות"}</Link>
   </nav>
   <div className="howNavActions"><Link className="howSignIn" href="/login">{en?"Log in":"התחברות"}</Link><Link className="howPrimary" href="/candidate/register">{en?"Get started":"מתחילים עכשיו"}</Link></div>
  </header>
  <section className="howHero howWrap">
   <div className="howIntro">
    <h1 lang="en" dir="ltr">Hired of<br/>Waiting<span className="howMark">?</span><span className="howAccent">〃</span></h1>
    <h2>{en?"Connecting people with opportunities.":"מחברים בין אנשים להזדמנויות."}</h2>
    <p>{en?"A simpler, faster, more thoughtful way to find a role or the right person.":"תהליך גיוס פשוט, מהיר ומדויק יותר — למי שמחפש עבודה ולמי שמגייס."}</p>
    <div className="howChoices">
     <Link href="/candidate/register" className="howChoice howCandidate"><span className="howChoiceIcon" aria-hidden="true">♙</span><strong>{en?"I'm looking for a job":"אני מחפש/ת עבודה"}</strong><small>{en?"Discover opportunities that fit you":"לגלות משרות שמתאימות לך באמת"}</small><span className="howArrow" aria-hidden="true">←</span></Link>
     <Link href="/recruiter/register" className="howChoice howEmployer"><span className="howChoiceIcon" aria-hidden="true">▥</span><strong>{en?"I'm hiring":"אני מגייס/ת"}</strong><small>{en?"Find people who fit, with less busywork":"למצוא מועמדים מתאימים בפחות עבודה ידנית"}</small><span className="howArrow" aria-hidden="true">←</span></Link>
    </div>
   </div>
   <div className="howVisual" aria-label={en?"Product interface preview":"המחשה של ממשק המערכת"}>
    <div className="howGlow"></div>
    <div className="howDashboard">
     <div className="howDashSidebar"><strong className="howDashLogo" dir="ltr">HOW?</strong><span className="active">{en?"Overview":"סקירה"}</span><span>{en?"Jobs":"משרות"}</span><span>{en?"Candidates":"מועמדים"}</span><span>{en?"Messages":"הודעות"}</span><span>{en?"Interviews":"ראיונות"}</span></div>
     <div className="howDashMain"><div className="howDashTop"><span>{en?"Candidates":"מועמדים למשרה"}</span><span className="howDotMenu">•••</span></div><h3>{en?"Customer support specialist":"נציג/ת שירות לקוחות"}</h3><div className="howFilters"><span>{en?"All":"הכול"}</span><span>{en?"Suggested":"מומלצים"}</span><span>{en?"To review":"לבדיקה"}</span></div>
     <div className="howPerson"><span className="howAvatar">ד</span><div><strong>{en?"Dana":"דנה"}</strong><small>{en?"Service · Customer care":"שירות · קשרי לקוחות"}</small></div><span className="howMatch">{en?"Relevant skills":"כישורים רלוונטיים"}</span></div>
     <div className="howPerson"><span className="howAvatar two">א</span><div><strong>{en?"Amit":"עמית"}</strong><small>{en?"Sales · Support":"מכירות · תמיכה"}</small></div><span className="howMatch">{en?"Experience":"ניסיון מתאים"}</span></div>
     <div className="howPerson"><span className="howAvatar three">מ</span><div><strong>{en?"Maya":"מאיה"}</strong><small>{en?"Customer success":"הצלחת לקוחות"}</small></div><span className="howMatch">{en?"To review":"לבדיקה"}</span></div></div>
    </div>
    <div className="howJobCard"><div className="howJobHeader"><span className="howMiniLogo" dir="ltr">HOW?</span><span>♡</span></div><small>{en?"Suggested for you":"משרה שעשויה להתאים לך"}</small><h3>{en?"Customer support":"נציג/ת שירות לקוחות"}</h3><p>{en?"A service role in a supportive team.":"תפקיד שירות בצוות מקצועי, עם אפשרויות להתפתח."}</p><div className="howTags"><span>{en?"Service":"שירות"}</span><span>{en?"Teamwork":"עבודת צוות"}</span></div><span className="howFakeAction">{en?"Explore job":"לפרטי המשרה"}</span></div>
    <div className="howScribble">{en?"Less waiting.":"פחות לחכות."}<br/>{en?"More connecting.":"יותר להתחבר."} <span>♡</span></div>
   </div>
  </section>
  <section className="howBenefits"><div className="howWrap howBenefitsGrid"><div><span>⚡</span><strong>{en?"Less manual work":"חוסכים זמן"}</strong><small>{en?"Less repetitive screening":"פחות סינון ידני, יותר עשייה"}</small></div><div><span>◎</span><strong>{en?"Better-fit opportunities":"התאמות מדויקות יותר"}</strong><small>{en?"Relevant skills, not just keywords":"מסתכלים על כישורים, לא רק מילות מפתח"}</small></div><div><span>♡</span><strong>{en?"A human experience":"חוויה אנושית"}</strong><small>{en?"Clarity for both sides":"שקיפות וכבוד לשני הצדדים"}</small></div><div><span>▥</span><strong>{en?"Useful insights":"תובנות שימושיות"}</strong><small>{en?"Make informed decisions":"מידע שמסייע לקבל החלטות"}</small></div></div></section>
  <section id="how-it-works" className="howSteps"><div className="howWrap"><div className="howStepsIntro"><small>{en?"HOW IT WORKS":"איך זה עובד?"}</small><h2>{en?"Simple. Smart. Human.":"פשוט. יעיל. אנושי."}</h2><p>{en?"From setting up a profile to the next conversation.":"מהפרופיל הראשוני ועד לשיחה הבאה — בלי סיבוכים מיותרים."}</p></div><div className="howStepsGrid">{(en?[["01","Build a profile","Add your experience and preferences."],["02","Discover matches","See relevant roles or candidates."],["03","Connect","Choose where to apply or whom to invite."],["04","Move forward","Stay updated and schedule the next step."]]:[["01","יוצרים פרופיל","מוסיפים ניסיון, כישורים והעדפות."],["02","מגלים התאמות","מוצאים משרות או מועמדים רלוונטיים."],["03","יוצרים קשר","בוחרים לאן להגיש או את מי להזמין."],["04","מתקדמים הלאה","מתעדכנים וממשיכים לשלב הבא."]]).map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
 </main>;
}