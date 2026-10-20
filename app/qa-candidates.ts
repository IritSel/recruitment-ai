export type QaCandidate={id:string;name:string;role:string;city:string;experience:string;skills:string;open:boolean};
export const qaCandidates:QaCandidate[]=[
{id:"noa",name:"נועה כהן",role:"מנהלת צוות",city:"באר שבע",experience:"4 שנות ניסיון",skills:"ניהול צוות, שירות לקוחות, הדרכה והטמעת תהליכים",open:true},
{id:"daniel",name:"דניאל לוי",role:"נציג שירות לקוחות",city:"אשדוד",experience:"שנתיים ניסיון",skills:"שירות טלפוני, CRM, טיפול בפניות",open:true},
{id:"maya",name:"מאיה רוזן",role:"מנהלת מכירות",city:"תל אביב",experience:"6 שנות ניסיון",skills:"ניהול מכירות, הדרכה, יעדים, משא ומתן",open:true},
{id:"amir",name:"אמיר פרץ",role:"בק אופיס",city:"באר שבע",experience:"3 שנות ניסיון",skills:"Excel, ניהול מסמכים, דיוק, מערכות מידע",open:true},
{id:"shira",name:"שירה אברהם",role:"נציגת שירות",city:"חיפה",experience:"ללא ניסיון קודם",skills:"תקשורת בין־אישית, עבודה בצוות, למידה מהירה",open:true},
{id:"ron",name:"רון מזרחי",role:"מנהל פרויקטים",city:"ירושלים",experience:"5 שנות ניסיון",skills:"תכנון פרויקטים, ניהול תקציב, תפעול",open:false}
];
export const qaDemoJobs=[{id:"qa-demo-service",title:"נציגי שירות"},{id:"qa-demo-team",title:"מנהל/ת צוות"},{id:"qa-demo-backoffice",title:"בק אופיס"}];
