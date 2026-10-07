import "./globals.css";import type{Metadata}from"next";import LanguageSwitch from"./components/LanguageSwitch";
export const metadata:Metadata={title:"Recruitment AI",description:"Smart recruitment for candidates and recruiters"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="he" dir="rtl"><body><LanguageSwitch/>{children}</body></html>}