"use client";
import {useEffect,useState} from "react";
export default function LanguageSwitch(){
 const[lang,setLang]=useState("he");
 useEffect(()=>{const v=localStorage.getItem("site-language")||"he";setLang(v);document.documentElement.lang=v;document.documentElement.dir=v==="he"?"rtl":"ltr"},[]);
 const change=(v:string)=>{setLang(v);localStorage.setItem("site-language",v);document.documentElement.lang=v;document.documentElement.dir=v==="he"?"rtl":"ltr";window.dispatchEvent(new Event("languagechange"))};
 return <div className="languageSwitch" aria-label="Language"><button className={lang==="he"?"active":""} onClick={()=>change("he")}>עברית</button><span>/</span><button className={lang==="en"?"active":""} onClick={()=>change("en")}>English</button></div>
}