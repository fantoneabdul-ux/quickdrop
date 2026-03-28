import { useState, useEffect, useRef, useReducer } from "react";

/* ─── THEME ──────────────────────────────────────── */
const G={green:"linear-gradient(135deg,#00D084,#00956A)",dark:"#030712",card:"#0F1724",card2:"#0A1120",border:"#1E293B",text:"#F1F5F9",muted:"#64748B",accent:"#00D084",red:"#F87171",yellow:"#FBBF24",blue:"#60A5FA",purple:"#A78BFA"};

/* ─── NIGERIA ADDRESSES ──────────────────────────── */
const ADDR=[
  {n:"Terminus Market, Jos",lat:9.9236,lng:8.8951},{n:"Rayfield, Jos",lat:9.8800,lng:8.9100},
  {n:"Bukuru, Jos",lat:9.7900,lng:8.8600},{n:"UNIJOS, Jos",lat:9.9500,lng:8.8800},
  {n:"Bauchi Road, Jos",lat:9.9600,lng:9.0000},{n:"Zaria Road, Jos",lat:9.9400,lng:8.8700},
  {n:"Tudun Wada, Jos",lat:9.9100,lng:8.8650},{n:"Jos Museum, Jos",lat:9.9280,lng:8.8920},
  {n:"Naraguta, Jos",lat:9.9700,lng:8.8900},{n:"Anglo-Jos, Jos",lat:9.9180,lng:8.9100},
  {n:"Apata, Jos",lat:9.9000,lng:8.8750},{n:"Nassarawa GRA, Jos",lat:9.9150,lng:8.9050},
  {n:"Dogon Dutse, Jos",lat:9.9450,lng:8.9200},{n:"Jos Teaching Hospital, Jos",lat:9.9200,lng:8.8800},
  {n:"Polo Ground, Jos",lat:9.9310,lng:8.8960},{n:"Eto Baba, Jos",lat:9.9350,lng:8.9050},
  {n:"Wuse 2, Abuja",lat:9.0800,lng:7.4900},{n:"Maitama, Abuja",lat:9.0850,lng:7.4800},
  {n:"Garki, Abuja",lat:9.0540,lng:7.4850},{n:"Gwarinpa, Abuja",lat:9.1100,lng:7.3900},
  {n:"Jabi, Abuja",lat:9.0750,lng:7.4350},{n:"Asokoro, Abuja",lat:9.0400,lng:7.5200},
  {n:"Utako, Abuja",lat:9.0820,lng:7.4650},{n:"Kubwa, Abuja",lat:9.1600,lng:7.3600},
  {n:"Lugbe, Abuja",lat:8.9900,lng:7.4200},{n:"Central Business District, Abuja",lat:9.0579,lng:7.4951},
  {n:"Victoria Island, Lagos",lat:6.4281,lng:3.4219},{n:"Lekki Phase 1, Lagos",lat:6.4478,lng:3.4723},
  {n:"Ikeja GRA, Lagos",lat:6.6018,lng:3.3515},{n:"Yaba, Lagos",lat:6.5097,lng:3.3783},
  {n:"Surulere, Lagos",lat:6.5022,lng:3.3558},{n:"Apapa, Lagos",lat:6.4499,lng:3.3573},
  {n:"Ojota, Lagos",lat:6.5710,lng:3.3900},{n:"Maryland, Lagos",lat:6.5530,lng:3.3600},
  {n:"Ikorodu, Lagos",lat:6.6194,lng:3.5063},{n:"Ajah, Lagos",lat:6.4698,lng:3.5617},
  {n:"Sabon Gari, Kano",lat:12.0022,lng:8.5196},{n:"Bompai, Kano",lat:12.0200,lng:8.5400},
  {n:"Nassarawa GRA, Kano",lat:11.9900,lng:8.5100},{n:"Kano Central, Kano",lat:11.9965,lng:8.5166},
  {n:"GRA Phase 2, Port Harcourt",lat:4.8156,lng:7.0498},{n:"Trans-Amadi, Port Harcourt",lat:4.8240,lng:7.0310},
  {n:"Rumuola, Port Harcourt",lat:4.8320,lng:7.0090},{n:"Bodija, Ibadan",lat:7.4167,lng:3.9042},
  {n:"Dugbe, Ibadan",lat:7.3775,lng:3.9042},{n:"Enugu, Enugu",lat:6.4698,lng:7.5479},
  {n:"Owerri, Imo",lat:5.4836,lng:7.0333},{n:"Benin City, Edo",lat:6.3350,lng:5.6270},
  {n:"Calabar, Cross River",lat:4.9517,lng:8.3220},{n:"Asaba, Delta",lat:6.1956,lng:6.7357},
];

/* ─── DB ──────────────────────────────────────────── */
const DB0={
  users:[{id:"u1",name:"Abdullah Fantone",phone:"08012345678",email:"abdullah@quickdrop.ng",city:"Jos",type:"customer",orders:24,spent:42800,rating:4.8,joined:"Jan 2026"}],
  riders:[
    {id:"r1",name:"Daniel Gyang",avatar:"DG",rating:4.9,bike:"Honda CB125",plate:"JOS 234 AA",city:"Jos",online:true,trips:312,earnings:284000,phone:"08011111111",dist:0.6},
    {id:"r2",name:"Emmanuel Dung",avatar:"ED",rating:4.8,bike:"TVS Star City",plate:"JOS 567 BB",city:"Jos",online:true,trips:245,earnings:216000,phone:"08022222222",dist:1.2},
    {id:"r3",name:"Sunday Pam",avatar:"SP",rating:4.7,bike:"Bajaj Boxer",plate:"JOS 890 CC",city:"Jos",online:true,trips:198,earnings:178000,phone:"08033333333",dist:1.9},
    {id:"r4",name:"Musa Ibrahim",avatar:"MI",rating:4.9,bike:"Honda CB125",plate:"ABJ 111 DD",city:"Abuja",online:true,trips:289,earnings:312000,phone:"08044444444",dist:0.8},
    {id:"r5",name:"Yusuf Abubakar",avatar:"YA",rating:4.8,bike:"TVS Apache",plate:"ABJ 222 EE",city:"Abuja",online:true,trips:201,earnings:231000,phone:"08055555555",dist:1.5},
  ],
  orders:[
    {id:"#QD-0091",from:"Terminus Market, Jos",to:"Rayfield, Jos",rider:"Daniel Gyang",city:"Jos",date:"Today, 2:30PM",status:"Delivered",amount:800,km:3.2,userId:"u1",payment:"paystack"},
    {id:"#QD-0088",from:"UNIJOS, Jos",to:"Bauchi Road, Jos",rider:"Emmanuel Dung",city:"Jos",date:"Yesterday, 11AM",status:"Delivered",amount:600,km:2.1,userId:"u1",payment:"cash"},
    {id:"#QD-0084",from:"Zaria Road, Jos",to:"Bukuru, Jos",rider:"Sunday Pam",city:"Jos",date:"Mar 7, 9:00AM",status:"Cancelled",amount:1200,km:8.5,userId:"u1",payment:"transfer"},
    {id:"#QD-0079",from:"Jos Museum, Jos",to:"Naraguta, Jos",rider:"Daniel Gyang",city:"Jos",date:"Mar 5, 3:45PM",status:"Delivered",amount:500,km:1.8,userId:"u1",payment:"cash"},
  ],
  fareConfig:{
    Jos:{Standard:{base:300,perKm:120,minFare:400,enabled:true},Express:{base:500,perKm:200,minFare:700,enabled:true},Fragile:{base:450,perKm:160,minFare:600,enabled:true}},
    Abuja:{Standard:{base:400,perKm:150,minFare:600,enabled:true},Express:{base:700,perKm:250,minFare:1000,enabled:true},Fragile:{base:600,perKm:200,minFare:900,enabled:true}},
    Lagos:{Standard:{base:500,perKm:180,minFare:700,enabled:true},Express:{base:800,perKm:280,minFare:1200,enabled:true},Fragile:{base:700,perKm:220,minFare:1000,enabled:true}},
    Kano:{Standard:{base:300,perKm:110,minFare:400,enabled:true},Express:{base:500,perKm:190,minFare:700,enabled:true},Fragile:{base:400,perKm:150,minFare:550,enabled:true}},
    Default:{Standard:{base:400,perKm:150,minFare:600,enabled:true},Express:{base:700,perKm:250,minFare:1000,enabled:true},Fragile:{base:600,perKm:200,minFare:900,enabled:true}},
  },
  surge:{Jos:{enabled:false,multiplier:1.5,hours:"7AM–9AM, 5PM–8PM"},Abuja:{enabled:false,multiplier:1.5,hours:"7AM–9AM, 5PM–8PM"},Lagos:{enabled:false,multiplier:2.0,hours:"7AM–10AM, 4PM–9PM"},Kano:{enabled:false,multiplier:1.3,hours:"7AM–9AM, 5PM–7PM"}},
  notifications:[{id:1,msg:"Package delivered to Rayfield ✅",time:"2 min ago",read:false},{id:2,msg:"Daniel Gyang accepted your order 🏍️",time:"1 hr ago",read:false},{id:3,msg:"New promo: 20% off express!",time:"Today",read:true}],
  riderApplications:[],
  changelog:[{time:"Mar 10",city:"Jos",action:"Standard perKm ₦100→₦120",by:"Admin"},{time:"Mar 8",city:"Abuja",action:"Express base ₦600→₦700",by:"Admin"}],
};

function dbR(state,action){
  switch(action.type){
    case "ADD_ORDER":return{...state,orders:[action.order,...state.orders]};
    case "ADD_USER":return{...state,users:[...state.users,action.user]};
    case "ADD_RIDER_APP":return{...state,riderApplications:[...state.riderApplications,action.app]};
    case "UPDATE_FARES":return{...state,fareConfig:{...state.fareConfig,[action.city]:action.config},changelog:[{time:"Just now",city:action.city,action:"Fare config updated",by:"Admin"},...state.changelog]};
    case "UPDATE_SURGE":return{...state,surge:{...state.surge,[action.city]:action.config}};
    case "TOGGLE_RIDER":return{...state,riders:state.riders.map(r=>r.id===action.id?{...r,online:!r.online}:r)};
    case "READ_NOTIFS":return{...state,notifications:state.notifications.map(n=>({...n,read:true}))};
    default:return state;
  }
}

/* ─── HELPERS ─────────────────────────────────────── */
function hKm(la1,ln1,la2,ln2){const R=6371,a=((la2-la1)*Math.PI)/180,b=((ln2-ln1)*Math.PI)/180,c=Math.sin(a/2)**2+Math.cos((la1*Math.PI)/180)*Math.cos((la2*Math.PI)/180)*Math.sin(b/2)**2;return R*2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c));}
function cF(km,cfg,s){const r=cfg.base+km*cfg.perKm,f=Math.max(cfg.minFare,Math.round(r/50)*50);return s?.enabled?Math.round((f*s.multiplier)/50)*50:f;}
function gCF(addr,fc){const cs=["Jos","Abuja","Lagos","Kano"];const c=cs.find(x=>addr&&addr.includes(x));return fc[c||"Default"]||fc.Default;}
function gCS(addr,s){const cs=["Jos","Abuja","Lagos","Kano"];const c=cs.find(x=>addr&&addr.includes(x));return s[c]||{enabled:false,multiplier:1.5};}
const N=n=>`₦${Number(n).toLocaleString()}`;
const sc=s=>s==="Delivered"?"#22C55E":s==="Cancelled"?G.red:G.yellow;
const SVC={Standard:{icon:"📦",color:G.blue},Express:{icon:"⚡",color:G.yellow},Fragile:{icon:"🫙",color:G.red}};

/* ─── LOGO ─────────────────────────────────────────── */
function QDLogo({size=60,dark=false}){
  const p=dark?"#00D084":"white",b=dark?"white":"#00956A";
  return(<svg width={size} height={size} viewBox="0 0 100 100" fill="none"><defs><clipPath id="lc"><circle cx="50" cy="38" r="22"/></clipPath></defs><circle cx="50" cy="38" r="22" fill={p}/><path d="M50 60 L50 76" stroke={p} strokeWidth="5" strokeLinecap="round"/><circle cx="50" cy="79" r="3.5" fill={p}/><g clipPath="url(#lc)"><line x1="20" y1="40" x2="27" y2="40" stroke={b} strokeWidth="2" strokeLinecap="round"/><line x1="19" y1="44" x2="25" y2="44" stroke={b} strokeWidth="1.5" strokeLinecap="round"/><circle cx="34" cy="47" r="7" fill={b}/><circle cx="34" cy="47" r="3" fill={p}/><circle cx="62" cy="47" r="7" fill={b}/><circle cx="62" cy="47" r="3" fill={p}/><path d="M34 47 L40 36 L56 36 L62 47 Z" fill={b}/><rect x="39" y="32" width="18" height="5" rx="2.5" fill={b}/><path d="M48 32 L52 20 L60 22 L57 32 Z" fill={b}/><circle cx="54" cy="17" r="5" fill={b}/><rect x="27" y="28" width="13" height="11" rx="2" fill={b}/><line x1="27" y1="32" x2="40" y2="32" stroke={p} strokeWidth="1.5" strokeLinecap="round"/><line x1="33.5" y1="28" x2="33.5" y2="39" stroke={p} strokeWidth="1.5" strokeLinecap="round"/></g></svg>);
}

/* ─── ATOMS ───────────────────────────────────────── */
const Av=({t,sz=44,color})=>(<div style={{width:sz,height:sz,borderRadius:sz/2,background:color||G.green,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:sz*.3,flexShrink:0}}>{t}</div>);
const Card=({children,style={}})=>(<div style={{background:G.card,borderRadius:20,padding:20,border:`1px solid ${G.border}`,...style}}>{children}</div>);
const Pill=({s})=>(<span style={{background:sc(s)+"22",color:sc(s),borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:800}}>{s}</span>);
const PBtn=({children,onClick,disabled,loading,style={}})=>(<button onClick={onClick} disabled={disabled||loading} style={{width:"100%",padding:"16px",borderRadius:16,border:"none",cursor:disabled||loading?"not-allowed":"pointer",background:disabled||loading?"#1E293B":G.green,color:disabled||loading?"#475569":"#fff",fontSize:15,fontWeight:800,boxShadow:disabled||loading?"none":"0 8px 24px rgba(0,208,132,.35)",fontFamily:"inherit",letterSpacing:.3,...style}}>{loading?"Please wait…":children}</button>);
const GBtn=({children,onClick,danger,style={}})=>(<button onClick={onClick} style={{width:"100%",padding:"14px",borderRadius:16,cursor:"pointer",background:"transparent",color:danger?G.red:G.muted,border:`1.5px solid ${danger?G.red:G.border}`,fontSize:14,fontWeight:700,fontFamily:"inherit",...style}}>{children}</button>);
const Inp=({label,value,onChange,placeholder,type="text",icon,error})=>(<div style={{marginBottom:16}}>{label&&<div style={{color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:6}}>{label}</div>}<div style={{position:"relative"}}>{icon&&<span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16}}>{icon}</span>}<input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{width:"100%",padding:icon?"13px 14px 13px 44px":"13px 16px",borderRadius:14,border:`1.5px solid ${error?G.red:G.border}`,background:G.card2,color:G.text,fontSize:14,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/></div>{error&&<div style={{color:G.red,fontSize:12,marginTop:4}}>{error}</div>}</div>);
const Toggle=({value,onChange,label})=>(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>{label&&<span style={{color:G.muted,fontSize:13,fontWeight:600}}>{label}</span>}<div onClick={()=>onChange(!value)} style={{width:44,height:24,borderRadius:12,cursor:"pointer",position:"relative",background:value?G.accent:"#1E293B",transition:"background .3s"}}><div style={{width:18,height:18,borderRadius:9,background:"#fff",position:"absolute",top:3,left:value?23:3,transition:"left .3s"}}/></div></div>);
const Bk=({onClick})=>(<button onClick={onClick} style={{background:"none",border:"none",color:G.muted,fontSize:14,cursor:"pointer",padding:"0 0 16px",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>← Back</button>);
const Toast=({msg,type})=>(<div style={{position:"absolute",top:14,left:14,right:14,zIndex:9999,background:type==="err"?"#DC2626":G.accent,color:"#fff",borderRadius:16,padding:"13px 18px",fontWeight:800,fontSize:14,boxShadow:"0 10px 36px rgba(0,0,0,.5)",animation:"sd .3s ease",display:"flex",gap:10,alignItems:"center"}}><span>{type==="err"?"❌":"✅"}</span>{msg}</div>);
const Frame=({children,bg})=>(<div style={{width:"100%",maxWidth:430,margin:"0 auto",height:"100vh",background:bg||G.dark,fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>{children}<style>{`@keyframes sd{from{transform:translateY(-14px);opacity:0}to{transform:translateY(0);opacity:1}} @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}} @keyframes blink{0%,100%{opacity:.2}50%{opacity:1}} @keyframes spin{to{transform:rotate(360deg)}} @keyframes ping{0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)}50%{opacity:0;transform:translate(-50%,-50%) scale(2.5)}} *{box-sizing:border-box;-webkit-tap-highlight-color:transparent} input::placeholder{color:#334155} ::-webkit-scrollbar{display:none}`}</style></div>);
function SB({pwd}){const s=pwd.length;return(<div style={{marginBottom:16}}><div style={{display:"flex",gap:4,marginBottom:4}}>{[1,2,3,4].map(i=><div key={i} style={{flex:1,height:4,borderRadius:2,background:s>=i*3?(s>=10?G.accent:G.yellow):G.border,transition:"background .3s"}}/>)}</div><div style={{color:G.muted,fontSize:11}}>{s<6?"Too short":s<10?"Moderate":"Strong ✓"}</div></div>);}
function CP({value,onChange}){return(<div style={{marginBottom:16}}><div style={{color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:8}}>CITY</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{[["Jos","🏔️","Flagship"],["Abuja","🏛️","Flagship"],["Lagos","🌊","Active"],["Kano","🌅","Active"]].map(([c,ic,tag])=><div key={c} onClick={()=>onChange(c)} style={{background:value===c?"#0D2B1E":G.card2,border:`1.5px solid ${value===c?G.accent:G.border}`,borderRadius:12,padding:"12px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{ic}</span><div><div style={{color:"#fff",fontWeight:700,fontSize:13}}>{c}</div><div style={{color:value===c?G.accent:G.muted,fontSize:10,fontWeight:700}}>{tag}</div></div></div>)}</div></div>);}

/* ─── ADDRESS SEARCH ──────────────────────────────── */
function AS({placeholder,value,onChange,onSelect,dot}){
  const [q,setQ]=useState(value||"");
  const [res,setRes]=useState([]);
  const [focused,setFocused]=useState(false);
  useEffect(()=>{if(q.length<2){setRes([]);return;}setRes(ADDR.filter(a=>a.n.toLowerCase().includes(q.toLowerCase())).slice(0,6));},[q]);
  return(
    <div style={{position:"relative"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:G.card2,borderRadius:14,border:`1.5px solid ${focused?dot||G.accent:G.border}`,transition:"border-color .2s"}}>
        <div style={{width:10,height:10,borderRadius:"50%",background:dot||G.accent,flexShrink:0}}/>
        <input value={q} onChange={e=>{setQ(e.target.value);onChange(e.target.value);}} onFocus={()=>setFocused(true)} onBlur={()=>setTimeout(()=>setFocused(false),200)} placeholder={placeholder} style={{flex:1,background:"none",border:"none",outline:"none",color:G.text,fontSize:14,fontFamily:"inherit"}}/>
        {q&&<span onClick={()=>{setQ("");onChange("");onSelect(null);}} style={{color:G.muted,cursor:"pointer",fontSize:16}}>✕</span>}
      </div>
      {focused&&res.length>0&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:999,background:G.card,border:`1px solid ${G.border}`,borderRadius:16,marginTop:4,overflow:"hidden",boxShadow:"0 16px 48px rgba(0,0,0,.6)"}}>
          {res.map(r=>(
            <div key={r.n} onClick={()=>{setQ(r.n);onChange(r.n);onSelect(r);setRes([]);}} style={{padding:"12px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${G.border}20`}}>
              <span>📍</span>
              <div><div style={{color:G.text,fontSize:14,fontWeight:600}}>{r.n}</div><div style={{color:G.muted,fontSize:11}}>Nigeria</div></div>
            </div>
          ))}
          <div style={{padding:"8px 16px",background:G.card2,display:"flex",gap:6,alignItems:"center"}}>
            <span style={{fontSize:12}}>🗺️</span><span style={{color:G.muted,fontSize:11}}>QuickDrop Maps • Google Maps API ready</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MAP VIEW ─────────────────────────────────────── */
function MV({from,to,riders=[],pct=0,rx=8,h=200}){
  return(
    <div style={{background:"#070F1C",borderRadius:18,height:h,position:"relative",overflow:"hidden",border:`1px solid ${G.border}`}}>
      {[...Array(8)].map((_,i)=><div key={i} style={{position:"absolute",left:`${i*14.5}%`,top:0,bottom:0,borderLeft:"1px solid #0D1F35"}}/>)}
      {[...Array(6)].map((_,i)=><div key={i} style={{position:"absolute",top:`${i*19}%`,left:0,right:0,borderTop:"1px solid #0D1F35"}}/>)}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}><defs><linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#00D084" stopOpacity="0.8"/><stop offset="100%" stopColor="#00D084" stopOpacity="0.2"/></linearGradient></defs><path d="M 36 155 C 120 60 230 40 360 105" stroke="url(#rg)" strokeWidth="3" fill="none" strokeDasharray="10,6"/></svg>
      {riders.slice(0,3).map((r,i)=><div key={r.id} style={{position:"absolute",left:`${15+i*22}%`,top:`${28+i*12}%`,transform:"translate(-50%,-50%)"}}><div style={{width:8,height:8,borderRadius:4,background:G.yellow,boxShadow:`0 0 8px ${G.yellow}`,animation:"ping 2s infinite"}}/></div>)}
      <div style={{position:"absolute",left:"7%",top:"72%",transform:"translate(-50%,-50%)"}}><div style={{width:14,height:14,borderRadius:7,background:G.accent,boxShadow:`0 0 16px ${G.accent}`}}/></div>
      <div style={{position:"absolute",right:"4%",top:"44%",transform:"translate(50%,-50%)",fontSize:22}}>📍</div>
      <div style={{position:"absolute",left:`${rx}%`,top:"54%",transform:"translate(-50%,-50%)",fontSize:24,transition:"left .25s",filter:`drop-shadow(0 2px 8px ${G.accent}80)`}}>🏍️</div>
      {from&&<div style={{position:"absolute",left:"7%",bottom:8,transform:"translateX(-50%)",background:G.accent,color:"#fff",borderRadius:6,padding:"2px 8px",fontSize:9,fontWeight:700,whiteSpace:"nowrap"}}>{from.split(",")[0].slice(0,14)}</div>}
      {to&&<div style={{position:"absolute",right:"4%",bottom:8,transform:"translateX(50%)",background:"#F87171",color:"#fff",borderRadius:6,padding:"2px 8px",fontSize:9,fontWeight:700,whiteSpace:"nowrap"}}>{to.split(",")[0].slice(0,14)}</div>}
      {pct>0&&<div style={{position:"absolute",top:10,right:10,background:G.accent,color:"#fff",borderRadius:10,padding:"5px 12px",fontSize:12,fontWeight:800}}>{pct<100?`~${Math.ceil((100-pct)/8)} min`:"Arrived! 🎉"}</div>}
    </div>
  );
}

/* ─── RIDER MATCH MODAL ───────────────────────────── */
function RMM({riders,onSelect,onCancel,from,to,km}){
  const [searching,setSrch]=useState(true);
  const [found,setFound]=useState([]);
  const [sel,setSel]=useState(null);
  useEffect(()=>{setTimeout(()=>{setSrch(false);setFound(riders.filter(r=>r.online).slice(0,3));},2500);},[]);
  return(
    <div style={{position:"fixed",inset:0,zIndex:9000,background:"rgba(3,7,18,.96)",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div style={{background:G.card,borderRadius:"24px 24px 0 0",padding:"24px 20px 48px",border:`1px solid ${G.border}`,maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{width:40,height:4,borderRadius:2,background:G.border,margin:"0 auto 20px"}}/>
        {searching?(
          <div style={{textAlign:"center",padding:"30px 0"}}>
            <div style={{fontSize:48,marginBottom:16,animation:"spin 1.5s linear infinite"}}>🔄</div>
            <div style={{color:"#fff",fontWeight:800,fontSize:18,marginBottom:8}}>Notifying Nearby Riders</div>
            <div style={{color:G.muted,fontSize:13,marginBottom:16}}>Finding 3 closest riders…</div>
            <div style={{display:"flex",gap:6,justifyContent:"center"}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:4,background:G.accent,animation:`blink 1.2s ${i*0.2}s infinite`}}/>)}</div>
          </div>
        ):(
          <>
            <div style={{color:"#fff",fontWeight:900,fontSize:18,marginBottom:4}}>🏍️ {found.length} Riders Available</div>
            <div style={{color:G.muted,fontSize:13,marginBottom:8}}>{from?.split(",")[0]} → {to?.split(",")[0]}</div>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              <div style={{background:G.accent+"22",borderRadius:10,padding:"5px 12px",color:G.accent,fontSize:12,fontWeight:700}}>📏 {km?.toFixed(1)}km</div>
              <div style={{background:G.card2,borderRadius:10,padding:"5px 12px",color:G.muted,fontSize:12}}>Sorted by proximity</div>
            </div>
            {found.map((r,i)=>(
              <div key={r.id} onClick={()=>setSel(r)} style={{background:sel?.id===r.id?"#0D2B1E":G.card2,borderRadius:18,padding:"16px",marginBottom:10,border:`2px solid ${sel?.id===r.id?G.accent:G.border}`,cursor:"pointer",transition:"all .15s"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{position:"relative"}}><Av t={r.avatar} sz={50}/>{i===0&&<div style={{position:"absolute",top:-6,right:-6,background:G.yellow,borderRadius:10,padding:"2px 7px",fontSize:9,fontWeight:900,color:"#000"}}>NEAREST</div>}</div>
                  <div style={{flex:1}}>
                    <div style={{color:"#fff",fontWeight:700,fontSize:15}}>{r.name}</div>
                    <div style={{color:G.muted,fontSize:12,marginTop:2}}>{r.bike} • {r.plate}</div>
                    <div style={{display:"flex",gap:12,marginTop:4}}><span style={{color:G.yellow,fontSize:12,fontWeight:700}}>⭐{r.rating}</span><span style={{color:G.accent,fontSize:12,fontWeight:700}}>📍{r.dist}km</span><span style={{color:G.muted,fontSize:12}}>{r.trips} trips</span></div>
                  </div>
                  <div style={{textAlign:"right"}}><div style={{color:G.accent,fontSize:13,fontWeight:800}}>{["~3","~5","~8"][i]} min</div><div style={{color:G.muted,fontSize:10,marginTop:2}}>ETA</div></div>
                </div>
              </div>
            ))}
            <PBtn style={{marginTop:8}} onClick={()=>sel?onSelect(sel):null} disabled={!sel}>{sel?`Book ${sel.name.split(" ")[0]} →`:"Tap a rider to select"}</PBtn>
            <GBtn style={{marginTop:10}} onClick={onCancel}>Cancel</GBtn>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── PAYMENT MODAL ───────────────────────────────── */
function PM({amount,onSuccess,onClose}){
  const [screen,setScreen]=useState("options"); // options | paystack | cash | transfer
  const [loading,setL]=useState(false);
  const [psStep,setPsStep]=useState(0);
  const [cardNum,setCardNum]=useState("");
  const [expiry,setExpiry]=useState("");
  const [cvv,setCvv]=useState("");
  const [pin,setPin]=useState("");
  const [otp,setOtp]=useState("");
  const [transferDone,setTransferDone]=useState(false);
  const ref=useState(()=>"QD-"+Date.now().toString().slice(-6))[0];

  const pay=(method)=>{
    setL(true);
    setTimeout(()=>{setL(false);onSuccess(method);},1800);
  };

  return(
    <div style={{position:"fixed",inset:0,zIndex:9000,background:"rgba(3,7,18,.96)",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div style={{background:G.card,borderRadius:"24px 24px 0 0",padding:"24px 20px 48px",maxHeight:"90vh",overflowY:"auto",border:`1px solid ${G.border}`}}>
        <div style={{width:40,height:4,borderRadius:2,background:G.border,margin:"0 auto 20px"}}/>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div>
            <div style={{color:"#fff",fontWeight:900,fontSize:18}}>
              {screen==="options"?"Choose Payment":screen==="paystack"?"Paystack Checkout":screen==="cash"?"Cash on Delivery":"Bank Transfer"}
            </div>
            <div style={{color:G.muted,fontSize:13,marginTop:2}}>Total: <span style={{color:G.accent,fontWeight:900}}>{N(amount)}</span></div>
          </div>
          <button onClick={screen==="options"?onClose:()=>{setScreen("options");setPsStep(0);}} style={{background:G.card2,border:`1px solid ${G.border}`,borderRadius:10,padding:"7px 14px",color:G.muted,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>
            {screen==="options"?"✕":"← Back"}
          </button>
        </div>

        {/* OPTIONS SCREEN */}
        {screen==="options"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div onClick={()=>setScreen("paystack")} style={{background:G.card2,borderRadius:18,padding:"18px",border:`1px solid ${G.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"border-color .2s"}}>
              <div style={{width:52,height:52,borderRadius:16,background:"linear-gradient(135deg,#00C3FF,#0066FF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>💳</div>
              <div style={{flex:1}}>
                <div style={{color:"#fff",fontWeight:800,fontSize:15}}>Pay with Paystack</div>
                <div style={{color:G.muted,fontSize:12,marginTop:2}}>Card • Bank Transfer • USSD</div>
              </div>
              <div style={{color:G.accent,fontSize:11,fontWeight:700,background:G.accent+"22",borderRadius:8,padding:"3px 9px"}}>Secure</div>
              <div style={{color:G.muted,fontSize:20}}>›</div>
            </div>

            <div onClick={()=>setScreen("cash")} style={{background:G.card2,borderRadius:18,padding:"18px",border:`1px solid ${G.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:52,height:52,borderRadius:16,background:"linear-gradient(135deg,#22C55E,#16A34A)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>💵</div>
              <div style={{flex:1}}>
                <div style={{color:"#fff",fontWeight:800,fontSize:15}}>Cash on Delivery</div>
                <div style={{color:G.muted,fontSize:12,marginTop:2}}>Pay rider when package arrives</div>
              </div>
              <div style={{color:G.muted,fontSize:20}}>›</div>
            </div>

            <div onClick={()=>setScreen("transfer")} style={{background:G.card2,borderRadius:18,padding:"18px",border:`1px solid ${G.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:52,height:52,borderRadius:16,background:"linear-gradient(135deg,#A78BFA,#7C3AED)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>🏦</div>
              <div style={{flex:1}}>
                <div style={{color:"#fff",fontWeight:800,fontSize:15}}>Bank Transfer</div>
                <div style={{color:G.muted,fontSize:12,marginTop:2}}>Transfer to QuickDrop account</div>
              </div>
              <div style={{color:G.muted,fontSize:20}}>›</div>
            </div>

            <div style={{marginTop:8,background:G.card2,borderRadius:14,padding:"12px 16px",border:`1px solid ${G.border}`,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14}}>🔒</span>
              <span style={{color:G.muted,fontSize:12}}>All payments are secured and encrypted</span>
            </div>
          </div>
        )}

        {/* PAYSTACK SCREEN */}
        {screen==="paystack"&&(
          <div>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{width:60,height:60,borderRadius:18,background:"linear-gradient(135deg,#00C3FF,#0066FF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 10px"}}>💳</div>
              <div style={{color:G.accent,fontWeight:900,fontSize:28}}>{N(amount)}</div>
            </div>
            {psStep===0&&(
              <>
                <div style={{color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:6}}>CARD NUMBER</div>
                <input value={cardNum} onChange={e=>setCardNum(e.target.value.replace(/\D/g,"").slice(0,16))} placeholder="0000 0000 0000 0000" style={{width:"100%",padding:"13px 16px",borderRadius:14,border:`1.5px solid ${G.border}`,background:G.card2,color:G.text,fontSize:16,fontFamily:"inherit",outline:"none",boxSizing:"border-box",letterSpacing:2,marginBottom:16}}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
                  <div>
                    <div style={{color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:6}}>EXPIRY</div>
                    <input value={expiry} onChange={e=>setExpiry(e.target.value)} placeholder="MM/YY" style={{width:"100%",padding:"13px 14px",borderRadius:14,border:`1.5px solid ${G.border}`,background:G.card2,color:G.text,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
                  </div>
                  <div>
                    <div style={{color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:6}}>CVV</div>
                    <input value={cvv} onChange={e=>setCvv(e.target.value.slice(0,3))} placeholder="•••" type="password" style={{width:"100%",padding:"13px 14px",borderRadius:14,border:`1.5px solid ${G.border}`,background:G.card2,color:G.text,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
                  </div>
                </div>
                <PBtn onClick={()=>setPsStep(1)}>Continue →</PBtn>
              </>
            )}
            {psStep===1&&(
              <>
                <div style={{color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:6}}>ENTER CARD PIN</div>
                <input value={pin} onChange={e=>setPin(e.target.value.slice(0,4))} placeholder="••••" type="password" style={{width:"100%",padding:"13px 16px",borderRadius:14,border:`1.5px solid ${G.border}`,background:G.card2,color:G.text,fontSize:28,fontFamily:"inherit",outline:"none",boxSizing:"border-box",textAlign:"center",letterSpacing:8,marginBottom:20}}/>
                <PBtn onClick={()=>setPsStep(2)}>Verify PIN →</PBtn>
              </>
            )}
            {psStep===2&&(
              <>
                <div style={{background:"#0D2B1E",borderRadius:14,padding:16,marginBottom:16,border:`1px solid ${G.accent}30`}}>
                  <div style={{color:G.accent,fontWeight:700,fontSize:13,marginBottom:4}}>📱 OTP Sent</div>
                  <div style={{color:G.muted,fontSize:12}}>Check your registered phone number</div>
                </div>
                <div style={{color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:6}}>ENTER OTP</div>
                <input value={otp} onChange={e=>setOtp(e.target.value.slice(0,6))} placeholder="000000" style={{width:"100%",padding:"13px 16px",borderRadius:14,border:`1.5px solid ${G.border}`,background:G.card2,color:G.text,fontSize:24,fontFamily:"inherit",outline:"none",boxSizing:"border-box",textAlign:"center",letterSpacing:8,marginBottom:20}}/>
                <PBtn onClick={()=>pay("paystack")} loading={loading}>Confirm Payment ✅</PBtn>
              </>
            )}
            <div style={{color:"#334155",fontSize:11,textAlign:"center",marginTop:14}}>🔒 256-bit SSL Encryption • PCI DSS Level 1</div>
          </div>
        )}

        {/* CASH SCREEN */}
        {screen==="cash"&&(
          <div>
            <div style={{background:"#0D2B1E",borderRadius:20,padding:24,border:`1px solid ${G.accent}30`,marginBottom:20,textAlign:"center"}}>
              <div style={{fontSize:52,marginBottom:10}}>💵</div>
              <div style={{color:"#fff",fontWeight:800,fontSize:18,marginBottom:8}}>Cash on Delivery</div>
              <div style={{color:G.accent,fontWeight:900,fontSize:32,marginBottom:8}}>{N(amount)}</div>
              <div style={{color:G.muted,fontSize:13,lineHeight:1.6}}>Have this exact amount ready when your rider arrives.</div>
            </div>
            {["Have exact change ready","Collect paper receipt from rider","Confirm delivery in the app after"].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}>
                <div style={{width:28,height:28,borderRadius:14,background:G.green,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:13,flexShrink:0}}>{i+1}</div>
                <div style={{color:"#CBD5E1",fontSize:14}}>{t}</div>
              </div>
            ))}
            <PBtn onClick={()=>pay("cash")} loading={loading}>Confirm — Pay on Delivery 💵</PBtn>
          </div>
        )}

        {/* TRANSFER SCREEN */}
        {screen==="transfer"&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#A78BFA22,#7C3AED11)",borderRadius:20,padding:20,border:`1px solid #A78BFA40`,marginBottom:16}}>
              <div style={{color:G.muted,fontSize:12,marginBottom:4}}>Transfer exactly this amount</div>
              <div style={{color:"#A78BFA",fontWeight:900,fontSize:34,marginBottom:20}}>{N(amount)}</div>
              {[
                ["🏦 Bank","Guaranty Trust Bank (GTB)"],
                ["👤 Account Name","QuickDrop Nigeria Ltd"],
                ["🔢 Account No.","0123456789"],
                ["📋 Reference",ref],
              ].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${G.border}30`}}>
                  <span style={{color:G.muted,fontSize:13}}>{k}</span>
                  <span style={{color:"#fff",fontWeight:700,fontSize:14,textAlign:"right",maxWidth:"55%"}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{background:"#0D2B1E",borderRadius:14,padding:"14px 16px",marginBottom:20,border:`1px solid ${G.accent}30`}}>
              <div style={{color:G.accent,fontSize:13,fontWeight:700,marginBottom:4}}>⚠️ Important</div>
              <div style={{color:G.muted,fontSize:12,lineHeight:1.6}}>Include the reference number <strong style={{color:"#fff"}}>{ref}</strong> in your transfer narration so we can match your payment instantly.</div>
            </div>
            {!transferDone
              ? <PBtn onClick={()=>setTransferDone(true)}>I've Completed the Transfer ✓</PBtn>
              : <PBtn onClick={()=>pay("transfer")} loading={loading}>Confirm & Book My Rider →</PBtn>
            }
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   ROOT APP
════════════════════════════════════════════════════ */
export default function QuickDrop(){
  const [db,dispatch]=useReducer(dbR,DB0);
  const [screen,setSc]=useState("splash");
  const [authMode,setAM]=useState(null);
  const [user,setUser]=useState(null);
  useEffect(()=>{setTimeout(()=>setSc("onboard"),2400);},[]);
  const login=(type,data)=>{setUser({...data,type});setSc("app");};
  if(screen==="splash") return <Splash/>;
  if(screen==="onboard") return <Onboard setSc={setSc} setAM={setAM}/>;
  if(screen==="auth") return <Auth mode={authMode} db={db} dispatch={dispatch} login={login} setSc={setSc}/>;
  if(screen==="app") return <App user={user} db={db} dispatch={dispatch} setSc={setSc}/>;
  return null;
}

/* ─── SPLASH ──────────────────────────────────────── */
function Splash(){
  const [v,setV]=useState(false);
  useEffect(()=>{setTimeout(()=>setV(true),100);},[]);
  return(
    <Frame bg="radial-gradient(ellipse at 40% 30%,#0D3320,#030712)">
      {[500,380,260].map(s=><div key={s} style={{position:"absolute",width:s,height:s,borderRadius:"50%",border:`1px solid #00D084${s===500?"10":s===380?"18":"25"}`,top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>)}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",position:"relative"}}>
        <div style={{opacity:v?1:0,transform:v?"translateY(0) scale(1)":"translateY(20px) scale(0.8)",transition:"all 0.7s cubic-bezier(0.34,1.56,0.64,1)",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{width:110,height:110,borderRadius:32,background:G.green,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24,boxShadow:"0 0 80px rgba(0,208,132,.5),0 0 160px rgba(0,208,132,.2)",animation:"float 2.5s ease-in-out infinite"}}><QDLogo size={80} dark={false}/></div>
          <div style={{color:"#fff",fontSize:40,fontWeight:900,letterSpacing:-2,marginBottom:6}}>QuickDrop</div>
          <div style={{color:G.accent,fontSize:11,letterSpacing:5,textTransform:"uppercase",marginBottom:36}}>Nigeria's Dispatch Network</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
            {["🏔️ Jos","🏛️ Abuja","🌊 Lagos","🌅 Kano"].map((c,i)=><div key={c} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,padding:"5px 12px",color:"rgba(255,255,255,.6)",fontSize:11,fontWeight:600,opacity:v?1:0,transform:v?"translateY(0)":"translateY(10px)",transition:`all 0.5s ease ${0.3+i*0.1}s`}}>{c}</div>)}
          </div>
        </div>
        <div style={{position:"absolute",bottom:60,opacity:v?1:0,transition:"opacity 0.5s ease 0.6s",display:"flex",gap:6}}>
          {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:3,background:G.accent,animation:`blink 1.2s ease-in-out ${i*0.2}s infinite`}}/>)}
        </div>
      </div>
    </Frame>
  );
}

/* ─── ONBOARD ─────────────────────────────────────── */
const SL=[
  {e:"🗺️",t:"Search Anywhere in Nigeria",s:"Type any address — Jos, Lagos, Abuja, Port Harcourt and beyond.",c:G.accent},
  {e:"🏍️",t:"3 Nearest Riders Compete",s:"Your order notifies 3 nearby riders. Pick the best by rating and distance.",c:G.yellow},
  {e:"🔒",t:"3 Ways to Pay",s:"Paystack card, Cash on delivery, or Bank transfer. Your choice.",c:G.blue},
];
function Onboard({setSc,setAM}){
  const go=m=>{setAM(m);setSc("auth");};
  const [sl,setSl]=useState(0);
  const [en,setEn]=useState(true);
  const gs=n=>{setEn(false);setTimeout(()=>{setSl(n);setEn(true);},150);};
  if(sl<3){
    const s=SL[sl];
    return(
      <Frame>
        <div style={{display:"flex",justifyContent:"space-between",padding:"52px 24px 0",flexShrink:0,alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:30,height:30,borderRadius:9,background:G.green,display:"flex",alignItems:"center",justifyContent:"center"}}><QDLogo size={22} dark={false}/></div><span style={{color:"#fff",fontWeight:800,fontSize:15}}>QuickDrop</span></div>
          <div onClick={()=>gs(3)} style={{color:G.muted,fontSize:14,fontWeight:600,cursor:"pointer"}}>Skip →</div>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 32px 20px",opacity:en?1:0,transform:en?"translateY(0)":"translateY(24px)",transition:"all 0.45s ease"}}>
          <div style={{width:180,height:180,borderRadius:"50%",background:`radial-gradient(circle,${s.c}22,${s.c}05)`,border:`2px solid ${s.c}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:80,marginBottom:36,boxShadow:`0 0 60px ${s.c}20`}}>{s.e}</div>
          <div style={{color:"#fff",fontSize:26,fontWeight:900,textAlign:"center",letterSpacing:-1,marginBottom:14,lineHeight:1.2}}>{s.t}</div>
          <div style={{color:G.muted,fontSize:15,textAlign:"center",lineHeight:1.7,maxWidth:280}}>{s.s}</div>
        </div>
        <div style={{padding:"0 28px 48px",display:"flex",flexDirection:"column",alignItems:"center",gap:24,flexShrink:0}}>
          <div style={{display:"flex",gap:8}}>{SL.map((_,i)=><div key={i} onClick={()=>gs(i)} style={{width:sl===i?24:8,height:8,borderRadius:4,background:sl===i?s.c:G.border,cursor:"pointer",transition:"all .35s"}}/>)}</div>
          <button onClick={()=>gs(sl===2?3:sl+1)} style={{width:"100%",padding:"16px",borderRadius:18,border:"none",background:G.green,color:"#fff",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 8px 28px rgba(0,208,132,.35)"}}>{sl===2?"Get Started 🚀":"Next →"}</button>
        </div>
      </Frame>
    );
  }
  return(
    <Frame>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px 0",background:"radial-gradient(ellipse at 50% 0%,#0D2B1E,#030712)"}}>
        <div style={{marginBottom:20,animation:"float 3s ease-in-out infinite"}}><div style={{width:100,height:100,borderRadius:28,background:G.green,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 60px rgba(0,208,132,.4)"}}><QDLogo size={74} dark={false}/></div></div>
        <div style={{color:"#fff",fontSize:32,fontWeight:900,textAlign:"center",letterSpacing:-1.5,lineHeight:1.15,marginBottom:12}}>Lagos to Jos,<br/><span style={{color:G.accent}}>Delivered Fast.</span></div>
        <div style={{color:G.muted,fontSize:14,textAlign:"center",lineHeight:1.7,maxWidth:280}}>Nigeria's trusted dispatch network. Verified riders. Smart pricing. Real-time tracking.</div>
        <div style={{display:"flex",gap:0,marginTop:24,background:G.card,borderRadius:18,border:`1px solid ${G.border}`,overflow:"hidden"}}>
          {[["500+","Riders"],["10k+","Deliveries"],["4.8★","Rating"]].map(([v,l],i)=><div key={l} style={{flex:1,padding:"14px 16px",textAlign:"center",borderRight:i<2?`1px solid ${G.border}`:"none"}}><div style={{color:G.accent,fontWeight:900,fontSize:18}}>{v}</div><div style={{color:G.muted,fontSize:11,marginTop:2}}>{l}</div></div>)}
        </div>
      </div>
      <div style={{padding:"20px 28px 48px",display:"flex",flexDirection:"column",gap:12}}>
        <div style={{color:G.muted,fontSize:13,textAlign:"center",fontWeight:600,marginBottom:4}}>I want to…</div>
        <div onClick={()=>go("customer")} style={{background:G.green,borderRadius:20,padding:"20px",cursor:"pointer",boxShadow:"0 10px 32px rgba(0,208,132,.35)",display:"flex",alignItems:"center",gap:14}}><div style={{width:52,height:52,borderRadius:16,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>📦</div><div style={{flex:1}}><div style={{color:"#fff",fontWeight:900,fontSize:17}}>Send a Package</div><div style={{color:"rgba(255,255,255,.75)",fontSize:13,marginTop:2}}>Sign up or log in as customer</div></div><div style={{color:"rgba(255,255,255,.5)",fontSize:24}}>›</div></div>
        <div onClick={()=>go("rider")} style={{background:G.card,borderRadius:20,padding:"20px",cursor:"pointer",border:`1.5px solid ${G.border}`,display:"flex",alignItems:"center",gap:14}}><div style={{width:52,height:52,borderRadius:16,background:"#0D2B1E",border:`1px solid ${G.accent}30`,display:"flex",alignItems:"center",justifyContent:"center"}}><QDLogo size={38} dark={true}/></div><div style={{flex:1}}><div style={{color:"#fff",fontWeight:900,fontSize:17}}>I'm a Dispatch Rider</div><div style={{color:G.muted,fontSize:13,marginTop:2}}>Earn up to ₦80k/month in Jos</div></div><div style={{color:G.muted,fontSize:24}}>›</div></div>
        <div onClick={()=>go("admin")} style={{background:"#070D18",borderRadius:16,padding:"13px 18px",cursor:"pointer",border:`1px solid ${G.border}`,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:16}}>🔐</span><span style={{color:G.muted,fontSize:14,fontWeight:600,flex:1}}>Admin Login</span><span style={{color:"#334155",fontSize:16}}>›</span></div>
        <div style={{textAlign:"center",marginTop:2}}><span style={{color:G.muted,fontSize:13}}>Already have an account? </span><span onClick={()=>go("customer")} style={{color:G.accent,fontSize:13,fontWeight:700,cursor:"pointer"}}>Log In</span></div>
      </div>
    </Frame>
  );
}

/* ─── AUTH ────────────────────────────────────────── */
function Auth({mode,db,dispatch,login,setSc}){
  const [isSu,setIsSu]=useState(mode!=="admin");
  const [step,setStep]=useState(1);
  const [load,setLoad]=useState(false);
  const [toast,setToast]=useState(null);
  const [f,setF]=useState({fn:"",ln:"",ph:"",em:"",pw:"",cp:"",city:"Jos",bk:"",bp:"",by:"",li:"",nin:"",gn:"",gp:""});
  const [er,setEr]=useState({});
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  const pop=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};
  const tot=mode==="rider"?4:mode==="customer"?3:1;
  const val=()=>{
    const e={};
    if(mode==="admin"){if(!f.em||!f.pw)e.em="Required";}
    else if(step===1){if(!f.fn.trim())e.fn="Required";if(!f.ln.trim())e.ln="Required";if(!f.ph.match(/^(\+234|0)[0-9]{10}$/))e.ph="Valid Nigerian number";if(!f.em.match(/\S+@\S+\.\S+/))e.em="Valid email";}
    else if(step===2){if(f.pw.length<6)e.pw="Min 6 chars";if(isSu&&f.pw!==f.cp)e.cp="Passwords don't match";}
    else if(step===3&&mode==="rider"){if(!f.bk.trim())e.bk="Required";if(!f.bp.trim())e.bp="Required";}
    setEr(e);return Object.keys(e).length===0;
  };
  const next=()=>{if(val())setStep(s=>s+1);};
  const sub=()=>{
    if(!val())return;setLoad(true);
    setTimeout(()=>{
      if(mode==="admin")login("admin",{id:"admin",name:"QuickDrop Admin",email:f.em});
      else if(mode==="customer"){const u={id:"u"+Date.now(),name:`${f.fn} ${f.ln}`,phone:f.ph,email:f.em,city:f.city,type:"customer",orders:0,spent:0,rating:5.0,joined:"Mar 2026"};if(isSu)dispatch({type:"ADD_USER",user:u});login("customer",u);}
      else{dispatch({type:"ADD_RIDER_APP",app:{id:"a"+Date.now(),name:`${f.fn} ${f.ln}`,phone:f.ph,email:f.em,bike:f.bk,plate:f.bp,city:f.city,status:"Pending",date:"Today"}});login("rider",{id:"r"+Date.now(),name:`${f.fn} ${f.ln}`,avatar:f.fn[0]+(f.ln[0]||""),bike:f.bk,plate:f.bp,city:f.city,rating:5.0,trips:0,earnings:0,online:false,dist:0.5});}
      setLoad(false);pop(mode==="rider"?"Application submitted! ✅":"Welcome to QuickDrop! 🎉");
    },1800);
  };
  const col=mode==="customer"?G.accent:mode==="rider"?G.yellow:G.blue;
  return(
    <Frame>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
      <div style={{padding:"52px 20px 20px",background:`radial-gradient(ellipse at 50% 0%,${col}15,#030712)`,flexShrink:0}}>
        <Bk onClick={()=>step>1?setStep(s=>s-1):setSc("onboard")}/>
        <div style={{width:44,height:44,borderRadius:14,background:G.green,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}><QDLogo size={32} dark={false}/></div>
        <div style={{color:"#fff",fontSize:22,fontWeight:900,letterSpacing:-1}}>{mode==="admin"?"Admin Login":isSu?`Sign up as ${mode==="customer"?"Customer":"Rider"}`:`Log in as ${mode==="customer"?"Customer":"Rider"}`}</div>
        {mode!=="admin"&&<div style={{color:G.muted,fontSize:13,marginTop:6}}>{isSu?"Already have an account? ":"New here? "}<span onClick={()=>{setIsSu(!isSu);setStep(1);setEr({});}} style={{color:col,fontWeight:700,cursor:"pointer"}}>{isSu?"Log In":"Sign Up"}</span></div>}
        {isSu&&tot>1&&<div style={{display:"flex",alignItems:"center",gap:0,marginTop:16}}>{Array.from({length:tot}).map((_,i)=><div key={i} style={{display:"flex",alignItems:"center",flex:1}}><div style={{width:28,height:28,borderRadius:14,background:step>i+1?G.green:step===i+1?`${col}22`:"#0A1120",border:`2px solid ${step>i+1?G.accent:step===i+1?col:G.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:step>i+1?"#fff":step===i+1?col:G.muted,fontWeight:900,fontSize:12,flexShrink:0,transition:"all .3s"}}>{step>i+1?"✓":i+1}</div>{i<tot-1&&<div style={{flex:1,height:2,background:step>i+1?G.accent:G.border,transition:"background .3s"}}/>}</div>)}</div>}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"20px 20px 48px"}}>
        {mode==="admin"&&(<><Inp label="ADMIN EMAIL" value={f.em} onChange={e=>set("em",e.target.value)} placeholder="admin@quickdrop.ng" icon="✉️" error={er.em}/><Inp label="PASSWORD" value={f.pw} onChange={e=>set("pw",e.target.value)} placeholder="••••••••" type="password" icon="🔒"/><PBtn onClick={sub} loading={load}>🔐 Access Dashboard</PBtn></>)}
        {mode!=="admin"&&!isSu&&(<><Inp label="PHONE OR EMAIL" value={f.em} onChange={e=>set("em",e.target.value)} placeholder="08012345678 or email" icon="👤" error={er.em}/><Inp label="PASSWORD" value={f.pw} onChange={e=>set("pw",e.target.value)} placeholder="••••••••" type="password" icon="🔒"/><PBtn onClick={sub} loading={load}>Log In →</PBtn><div style={{textAlign:"center",marginTop:14,color:G.accent,fontSize:13,fontWeight:700,cursor:"pointer"}}>Forgot Password?</div></>)}
        {mode==="customer"&&isSu&&(<>
          {step===1&&(<><div style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:16}}>Personal Info</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><Inp label="FIRST NAME" value={f.fn} onChange={e=>set("fn",e.target.value)} placeholder="Daniel" error={er.fn}/><Inp label="LAST NAME" value={f.ln} onChange={e=>set("ln",e.target.value)} placeholder="Gyang" error={er.ln}/></div><Inp label="PHONE" value={f.ph} onChange={e=>set("ph",e.target.value)} placeholder="08012345678" icon="📞" error={er.ph}/><Inp label="EMAIL" value={f.em} onChange={e=>set("em",e.target.value)} placeholder="you@email.com" icon="✉️" type="email" error={er.em}/><PBtn onClick={next}>Continue →</PBtn></>)}
          {step===2&&(<><div style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:16}}>Create Password</div><Inp label="PASSWORD" value={f.pw} onChange={e=>set("pw",e.target.value)} placeholder="Min 6 characters" type="password" icon="🔒" error={er.pw}/><Inp label="CONFIRM" value={f.cp} onChange={e=>set("cp",e.target.value)} placeholder="Repeat password" type="password" icon="🔒" error={er.cp}/>{f.pw.length>0&&<SB pwd={f.pw}/>}<PBtn onClick={next}>Continue →</PBtn></>)}
          {step===3&&(<><div style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:6}}>Your Location</div><div style={{color:G.muted,fontSize:13,marginBottom:16}}>Helps us find nearby riders</div><CP value={f.city} onChange={v=>set("city",v)}/><PBtn onClick={sub} loading={load} style={{marginTop:8}}>🎉 Create Account</PBtn></>)}
        </>)}
        {mode==="rider"&&isSu&&(<>
          {step===1&&(<><div style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:16}}>Personal Info</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><Inp label="FIRST NAME" value={f.fn} onChange={e=>set("fn",e.target.value)} placeholder="Daniel" error={er.fn}/><Inp label="LAST NAME" value={f.ln} onChange={e=>set("ln",e.target.value)} placeholder="Gyang" error={er.ln}/></div><Inp label="PHONE" value={f.ph} onChange={e=>set("ph",e.target.value)} placeholder="08012345678" icon="📞" error={er.ph}/><Inp label="EMAIL" value={f.em} onChange={e=>set("em",e.target.value)} placeholder="you@email.com" icon="✉️" error={er.em}/><CP value={f.city} onChange={v=>set("city",v)}/><PBtn onClick={next} style={{marginTop:4}}>Continue →</PBtn></>)}
          {step===2&&(<><div style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:16}}>Create Password</div><Inp label="PASSWORD" value={f.pw} onChange={e=>set("pw",e.target.value)} placeholder="Min 6 characters" type="password" icon="🔒" error={er.pw}/><Inp label="CONFIRM" value={f.cp} onChange={e=>set("cp",e.target.value)} placeholder="Repeat password" type="password" icon="🔒" error={er.cp}/>{f.pw.length>0&&<SB pwd={f.pw}/>}<PBtn onClick={next}>Continue →</PBtn></>)}
          {step===3&&(<><div style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:6}}>Bike Details</div><Inp label="BIKE MODEL" value={f.bk} onChange={e=>set("bk",e.target.value)} placeholder="Honda CB125" icon="🏍️" error={er.bk}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><Inp label="PLATE NO." value={f.bp} onChange={e=>set("bp",e.target.value)} placeholder="JOS 234 AA" error={er.bp}/><Inp label="YEAR" value={f.by} onChange={e=>set("by",e.target.value)} placeholder="2021"/></div><Card style={{background:"#0D2B1E",border:`1px solid ${G.accent}30`,marginBottom:16}}><div style={{color:G.accent,fontWeight:700,fontSize:12,marginBottom:4}}>✅ Accepted: Honda, Bajaj, TVS, Suzuki (2015+)</div><div style={{color:G.muted,fontSize:11}}>Must have valid road worthiness certificate</div></Card><PBtn onClick={next}>Continue →</PBtn></>)}
          {step===4&&(<><div style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:6}}>Identity Verification</div><div style={{color:G.muted,fontSize:13,marginBottom:16}}>Required to operate legally in Nigeria</div><Inp label="DRIVER'S LICENSE" value={f.li} onChange={e=>set("li",e.target.value)} placeholder="ABC12345678" icon="🪪"/><Inp label="NIN" value={f.nin} onChange={e=>set("nin",e.target.value)} placeholder="12345678901" icon="🔐"/><Inp label="GUARANTOR NAME" value={f.gn} onChange={e=>set("gn",e.target.value)} placeholder="Full name" icon="👤"/><Inp label="GUARANTOR PHONE" value={f.gp} onChange={e=>set("gp",e.target.value)} placeholder="08012345678" icon="📞"/><Card style={{background:G.card2,marginBottom:16}}><div style={{color:G.muted,fontSize:12,lineHeight:1.7}}>📄 Upload documents after signup. Our Jos team verifies within <strong style={{color:"#fff"}}>24–48 hours</strong>.</div></Card><PBtn onClick={sub} loading={load}>🏍️ Submit Application</PBtn></>)}
        </>)}
      </div>
    </Frame>
  );
}

/* ─── MAIN APP ────────────────────────────────────── */
function App({user,db,dispatch,setSc}){
  const [tab,setTab]=useState(user.type==="admin"?"dash":user.type==="rider"?"ride":"home");
  const [toast,setToast]=useState(null);
  const pop=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),3200);};
  const unread=db.notifications.filter(n=>!n.read).length;
  const ct=[{id:"home",ic:"🏠",lb:"Home"},{id:"track",ic:"📍",lb:"Track"},{id:"history",ic:"📋",lb:"Orders"},{id:"profile",ic:"👤",lb:"Profile"}];
  const rt=[{id:"ride",ic:"logo",lb:"Ride"},{id:"earnings",ic:"💰",lb:"Earnings"},{id:"history",ic:"📋",lb:"History"},{id:"profile",ic:"👤",lb:"Profile"}];
  const at=[{id:"dash",ic:"📊",lb:"Overview"},{id:"riders",ic:"logo",lb:"Riders"},{id:"orders",ic:"📦",lb:"Orders"},{id:"fares",ic:"💰",lb:"Fares"}];
  const tabs=user.type==="admin"?at:user.type==="rider"?rt:ct;
  return(
    <Frame>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
      <div style={{flex:1,overflowY:"auto",paddingBottom:84}}>
        {user.type==="customer"&&tab==="home"&&<CHome user={user} db={db} dispatch={dispatch} pop={pop}/>}
        {user.type==="customer"&&tab==="track"&&<TrackSc db={db}/>}
        {user.type==="customer"&&tab==="history"&&<OH db={db} userId={user.id}/>}
        {user.type==="customer"&&tab==="profile"&&<Prof user={user} dispatch={dispatch} pop={pop} setSc={setSc} unread={unread}/>}
        {user.type==="rider"&&tab==="ride"&&<RHome user={user} db={db} dispatch={dispatch} pop={pop}/>}
        {user.type==="rider"&&tab==="earnings"&&<REarn/>}
        {user.type==="rider"&&tab==="history"&&<OH db={db}/>}
        {user.type==="rider"&&tab==="profile"&&<Prof user={user} dispatch={dispatch} pop={pop} setSc={setSc}/>}
        {user.type==="admin"&&tab==="dash"&&<ADash db={db}/>}
        {user.type==="admin"&&tab==="riders"&&<ARiders db={db} dispatch={dispatch} pop={pop}/>}
        {user.type==="admin"&&tab==="orders"&&<AOrders db={db}/>}
        {user.type==="admin"&&tab==="fares"&&<AFares db={db} dispatch={dispatch} pop={pop}/>}
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:"#070D18",borderTop:`1px solid ${G.border}`,display:"flex",padding:"10px 0 22px"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:0,position:"relative"}}>
            {t.ic==="logo"?<div style={{width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center"}}><QDLogo size={26} dark={tab===t.id}/></div>:<span style={{fontSize:22}}>{t.ic}</span>}
            <span style={{fontSize:11,fontWeight:800,color:tab===t.id?G.accent:"#334155"}}>{t.lb}</span>
            {tab===t.id&&<div style={{width:18,height:3,borderRadius:2,background:G.accent,marginTop:1}}/>}
            {t.id==="profile"&&unread>0&&<div style={{position:"absolute",top:0,right:"18%",width:8,height:8,borderRadius:4,background:G.red,border:"2px solid #070D18"}}/>}
          </button>
        ))}
      </div>
    </Frame>
  );
}

/* ─── CUSTOMER HOME ───────────────────────────────── */
function CHome({user,db,dispatch,pop}){
  const [fA,setFA]=useState("");const [tA,setTA]=useState("");
  const [fL,setFL]=useState(null);const [tL,setTL]=useState(null);
  const [step,setStep]=useState(0);const [svc,setSvc]=useState("Standard");
  const [fares,setFares]=useState(null);const [km,setKm]=useState(0);
  const [showM,setShowM]=useState(false);const [rider,setRider]=useState(null);
  const [showP,setShowP]=useState(false);const [paid,setPaid]=useState(false);
  const [pct,setPct]=useState(0);const [rx,setRx]=useState(8);const [promo,setPromo]=useState(0);
  const ref=useRef(null);
  const cf=getCF||gCF;const cs=gCS;
  const cityFare=gCF(tA||fA,db.fareConfig);
  const citySurge=gCS(tA||fA,db.surge);
  const online=db.riders.filter(r=>r.online);

  useEffect(()=>{
    if(paid&&step===4){ref.current=setInterval(()=>{setPct(p=>{if(p>=100){clearInterval(ref.current);return 100;}return p+0.7;});setRx(x=>Math.min(x+0.5,82));},120);}
    return()=>clearInterval(ref.current);
  },[paid,step]);

  const find=()=>{
    if(!fA||!tA){pop("Enter pickup and drop-off address","err");return;}
    const d=fL&&tL?hKm(fL.lat,fL.lng,tL.lat,tL.lng):Math.random()*8+2;
    setKm(d);
    const res={};Object.entries(cityFare).forEach(([t,cfg])=>{if(cfg.enabled)res[t]=cF(d,cfg,citySurge);});
    setFares(res);setStep(1);
  };

  const onRider=r=>{setRider(r);setShowM(false);setStep(3);};
  const onPaid=m=>{
    setShowP(false);setPaid(true);setStep(4);
    dispatch({type:"ADD_ORDER",order:{id:"#QD-"+Math.floor(Math.random()*9000+1000),from:fA,to:tA,rider:rider?.name||"",city:fA.split(",").pop()?.trim()||"Nigeria",date:"Just now",status:"Delivered",amount:fares?.[svc]||0,km:parseFloat(km.toFixed(1)),userId:user.id,payment:m}});
    pop(`Payment confirmed! ${rider?.name?.split(" ")[0]||"Rider"} is on the way 🏍️`);
  };
  const reset=()=>{setStep(0);setFA("");setTA("");setFL(null);setTL(null);setSvc("Standard");setFares(null);setKm(0);setRider(null);setPaid(false);setPct(0);setRx(8);};

  const PROMOS=[
    {bg:"linear-gradient(135deg,#00D084,#00956A)",e:"⚡",t:"Express Delivery",s:"First order 20% off",tag:"LIMITED"},
    {bg:"linear-gradient(135deg,#6366F1,#4338CA)",e:"🎁",t:"Refer & Earn",s:"₦500 per referral",tag:"NEW"},
    {bg:"linear-gradient(135deg,#F59E0B,#D97706)",e:"🏍️",t:"Ride With Us",s:"Earn ₦80k/month in Jos",tag:"HIRING"},
  ];

  return(
    <div>
      {showM&&<RMM riders={online} onSelect={onRider} onCancel={()=>setShowM(false)} from={fA} to={tA} km={km}/>}
      {showP&&<PM amount={fares?.[svc]||0} onSuccess={onPaid} onClose={()=>setShowP(false)}/>}

      <div style={{padding:"52px 20px 20px",background:"radial-gradient(ellipse at 50% -10%,#0D2B1E,#030712)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div><div style={{color:G.muted,fontSize:13}}>Good day 👋</div><div style={{color:"#fff",fontSize:24,fontWeight:900,letterSpacing:-1}}>{user.name.split(" ")[0]}</div></div>
          <div style={{width:44,height:44,borderRadius:14,background:G.green,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 16px rgba(0,208,132,.3)"}}><QDLogo size={32} dark={false}/></div>
        </div>
        <div style={{background:G.card,borderRadius:20,padding:"8px",border:`1px solid ${G.border}`,marginBottom:12}}>
          <div style={{marginBottom:6}}><AS placeholder="Pickup address anywhere in Nigeria…" value={fA} onChange={setFA} onSelect={setFL} dot={G.accent}/></div>
          <div style={{height:1,background:G.border,margin:"0 8px"}}/>
          <div style={{marginTop:6}}><AS placeholder="Drop-off address anywhere in Nigeria…" value={tA} onChange={setTA} onSelect={setTL} dot={G.red}/></div>
        </div>
        {fL&&tL&&(
          <div style={{background:"#0D2B1E",borderRadius:14,padding:"10px 14px",marginBottom:12,border:`1px solid ${G.accent}30`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{color:G.accent,fontSize:13,fontWeight:700}}>📏 {hKm(fL.lat,fL.lng,tL.lat,tL.lng).toFixed(1)} km estimated</div>
            <div style={{color:G.accent,fontWeight:900,fontSize:16}}>~{N(cF(hKm(fL.lat,fL.lng,tL.lat,tL.lng),cityFare.Standard,citySurge))}</div>
          </div>
        )}
        <PBtn onClick={find}>🏍️ Find Nearest Riders</PBtn>
      </div>

      <div style={{padding:"16px 20px 32px"}}>
        {step===0&&(<>
          <div style={{marginBottom:24}}>
            <div style={{color:"#fff",fontWeight:800,fontSize:15,marginBottom:12}}>What are you sending?</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[["📦","Package"],["🍔","Food"],["💊","Pharmacy"],["🛒","Groceries"],["📄","Documents"],["🛍️","Shopping"]].map(([ic,lb])=>(
                <div key={lb} style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:16,padding:"13px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:20}}>{ic}</span><span style={{color:"#CBD5E1",fontSize:13,fontWeight:600}}>{lb}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{color:"#fff",fontWeight:800,fontSize:15}}>🎁 Offers</div>
              <div style={{display:"flex",gap:5}}>{PROMOS.map((_,i)=><div key={i} onClick={()=>setPromo(i)} style={{width:promo===i?18:5,height:5,borderRadius:3,background:promo===i?G.accent:G.border,cursor:"pointer",transition:"width .3s"}}/>)}</div>
            </div>
            <div style={{borderRadius:22,background:PROMOS[promo].bg,padding:"20px",position:"relative",cursor:"pointer",overflow:"hidden"}} onClick={()=>pop("Offer applied! ✅")}>
              <div style={{position:"absolute",top:-20,right:-10,fontSize:86,opacity:.12}}>{PROMOS[promo].e}</div>
              <div style={{background:"rgba(255,255,255,.2)",borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:900,color:"#fff",display:"inline-block",marginBottom:8}}>{PROMOS[promo].tag}</div>
              <div style={{color:"#fff",fontSize:18,fontWeight:900,marginBottom:3}}>{PROMOS[promo].e} {PROMOS[promo].t}</div>
              <div style={{color:"rgba(255,255,255,.8)",fontSize:13}}>{PROMOS[promo].s}</div>
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{color:"#fff",fontWeight:800,fontSize:15}}>🏍️ Riders Nearby</div>
              <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:7,height:7,borderRadius:4,background:G.accent,boxShadow:`0 0 6px ${G.accent}`}}/><span style={{color:G.accent,fontSize:12,fontWeight:700}}>{online.length} online</span></div>
            </div>
            {online.slice(0,3).map(r=>(
              <Card key={r.id} style={{marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
                <Av t={r.avatar} sz={44}/>
                <div style={{flex:1}}><div style={{color:"#fff",fontWeight:700}}>{r.name}</div><div style={{color:G.muted,fontSize:12,marginTop:1}}>{r.bike} • ⭐{r.rating}</div></div>
                <div style={{textAlign:"right"}}><div style={{color:G.accent,fontSize:12,fontWeight:700}}>📍 {r.dist}km</div><div style={{color:G.muted,fontSize:11,marginTop:1}}>{r.dist<1?"~3":r.dist<2?"~5":"~8"} min</div></div>
              </Card>
            ))}
          </div>
          {db.orders.filter(o=>o.userId===user.id).length>0&&(<>
            <div style={{color:"#fff",fontWeight:800,fontSize:15,marginBottom:12}}>🕒 Recent Order</div>
            {(()=>{const o=db.orders.find(x=>x.userId===user.id);return o&&(
              <Card>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div style={{color:"#fff",fontWeight:800}}>{o.id}</div><Pill s={o.status}/></div>
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  <div style={{flex:1,background:G.card2,borderRadius:10,padding:"9px 12px"}}><div style={{color:"#475569",fontSize:10,fontWeight:700}}>FROM</div><div style={{color:"#CBD5E1",fontSize:12,fontWeight:600}}>{o.from?.split(",")[0]}</div></div>
                  <div style={{color:"#334155",alignSelf:"center"}}>→</div>
                  <div style={{flex:1,background:G.card2,borderRadius:10,padding:"9px 12px"}}><div style={{color:"#475569",fontSize:10,fontWeight:700}}>TO</div><div style={{color:"#CBD5E1",fontSize:12,fontWeight:600}}>{o.to?.split(",")[0]}</div></div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${G.border}`}}>
                  <div><div style={{color:G.muted,fontSize:11}}>🏍️ {o.rider}</div><div style={{color:G.muted,fontSize:11,marginTop:1}}>{o.payment==="paystack"?"💳":o.payment==="cash"?"💵":"🏦"} {o.payment}</div></div>
                  <div style={{color:G.accent,fontWeight:900,fontSize:16}}>{N(o.amount)}</div>
                </div>
              </Card>
            );})()}
          </>)}
        </>)}

        {step===1&&fares&&(
          <Card>
            <Bk onClick={()=>setStep(0)}/>
            <div style={{color:"#fff",fontWeight:800,fontSize:17,marginBottom:4}}>💰 Choose Service</div>
            <div style={{color:G.muted,fontSize:13,marginBottom:8}}>{fA.split(",")[0]} → {tA.split(",")[0]}</div>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              <div style={{background:G.accent+"22",borderRadius:10,padding:"5px 12px",color:G.accent,fontSize:12,fontWeight:700}}>📏 {km.toFixed(1)}km</div>
              {citySurge.enabled&&<div style={{background:G.yellow+"22",borderRadius:10,padding:"5px 12px",color:G.yellow,fontSize:12,fontWeight:700}}>⚡ Surge {citySurge.multiplier}x</div>}
            </div>
            {Object.entries(fares).map(([t,price])=>(
              <div key={t} onClick={()=>setSvc(t)} style={{background:svc===t?"#0D2B1E":G.card2,borderRadius:16,padding:"15px",marginBottom:10,border:`2px solid ${svc===t?G.accent:G.border}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all .15s"}}>
                <div><div style={{color:"#fff",fontWeight:800,fontSize:15}}>{SVC[t].icon} {t}</div><div style={{color:G.muted,fontSize:12,marginTop:2}}>{t==="Standard"?"15–20 mins":t==="Express"?"8–12 mins":"20–25 mins"}</div><div style={{color:G.muted,fontSize:11,marginTop:2}}>{N(cityFare[t]?.base)} base + {N(cityFare[t]?.perKm)}/km</div></div>
                <div style={{textAlign:"right"}}><div style={{color:SVC[t].color,fontWeight:900,fontSize:24}}>{N(price)}</div>{svc===t&&<div style={{color:G.accent,fontSize:10,fontWeight:700,marginTop:2}}>✓ Selected</div>}</div>
              </div>
            ))}
            <PBtn onClick={()=>setShowM(true)}>Find My Rider →</PBtn>
          </Card>
        )}

        {step===3&&rider&&(
          <Card>
            <Bk onClick={()=>setStep(1)}/>
            <div style={{color:"#fff",fontWeight:800,fontSize:17,marginBottom:16}}>✅ Rider Confirmed</div>
            <div style={{background:"#0D2B1E",borderRadius:16,padding:16,marginBottom:16,border:`1px solid ${G.accent}30`,display:"flex",alignItems:"center",gap:12}}>
              <Av t={rider.avatar} sz={52}/>
              <div style={{flex:1}}><div style={{color:"#fff",fontWeight:800,fontSize:16}}>{rider.name}</div><div style={{color:G.muted,fontSize:12,marginTop:2}}>{rider.bike} • {rider.plate}</div><div style={{display:"flex",gap:10,marginTop:4}}><span style={{color:G.yellow,fontSize:12,fontWeight:700}}>⭐{rider.rating}</span><span style={{color:G.accent,fontSize:12}}>📍{rider.dist}km away</span></div></div>
              <div style={{textAlign:"right"}}><div style={{color:G.accent,fontWeight:900,fontSize:18}}>{N(fares?.[svc])}</div><div style={{color:G.muted,fontSize:11,marginTop:2}}>{SVC[svc].icon} {svc}</div></div>
            </div>
            <div style={{background:G.card2,borderRadius:14,padding:14,marginBottom:16}}>
              {[["From",fA.split(",")[0]],["To",tA.split(",")[0]],["Distance",`${km.toFixed(1)} km`],["Service",`${SVC[svc].icon} ${svc}`]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:G.muted,fontSize:13}}>{k}</span><span style={{color:"#CBD5E1",fontSize:13,fontWeight:600,textAlign:"right",maxWidth:"55%"}}>{v}</span></div>
              ))}
            </div>
            <PBtn onClick={()=>setShowP(true)}>Choose Payment →</PBtn>
          </Card>
        )}

        {step===4&&paid&&(
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div style={{color:G.accent,fontWeight:800,fontSize:16}}>🏍️ Rider En Route!</div>
              <div style={{background:G.accent+"22",color:G.accent,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:800}}>{pct<100?`~${Math.ceil((100-pct)/8)} min`:"Arrived! 🎉"}</div>
            </div>
            <div style={{color:G.muted,fontSize:13,marginBottom:14}}>{rider?.name} heading to {fA?.split(",")[0]}</div>
            <MV from={fA} to={tA} riders={online} pct={pct} rx={rx} h={200}/>
            <div style={{background:"#1E293B",borderRadius:6,height:6,marginTop:14,marginBottom:14}}><div style={{background:G.green,height:"100%",borderRadius:6,width:`${pct}%`,transition:"width .25s"}}/></div>
            <div style={{background:G.card2,borderRadius:16,padding:"13px",display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <Av t={rider?.avatar} sz={44}/>
              <div style={{flex:1}}><div style={{color:"#fff",fontWeight:700}}>{rider?.name}</div><div style={{color:G.muted,fontSize:12}}>{rider?.plate} • ⭐{rider?.rating}</div></div>
              <button style={{background:G.accent,border:"none",borderRadius:10,padding:"9px 13px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:16}}>📞</button>
              <button style={{background:"#1E293B",border:"none",borderRadius:10,padding:"9px 13px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:16}}>💬</button>
            </div>
            {pct>=100&&<PBtn onClick={()=>{reset();pop("Package delivered! ⭐ Rate your rider");}}>✅ Delivery Complete!</PBtn>}
          </Card>
        )}
      </div>
    </div>
  );
}

/* ─── TRACK SCREEN ────────────────────────────────── */
function TrackSc(){
  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{color:"#fff",fontSize:22,fontWeight:900,marginBottom:16}}>📍 Live Tracking</div>
      <MV h={250}/>
      <div style={{textAlign:"center",paddingTop:28}}><div style={{color:"#fff",fontWeight:800,fontSize:18,marginBottom:6}}>No Active Delivery</div><div style={{color:G.muted,fontSize:14}}>Book a rider from the Home tab</div></div>
    </div>
  );
}

/* ─── ORDER HISTORY ───────────────────────────────── */
function OH({db,userId}){
  const orders=userId?db.orders.filter(o=>o.userId===userId):db.orders;
  const [filter,setF]=useState("All");
  const filtered=filter==="All"?orders:orders.filter(o=>o.status===filter);
  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{color:"#fff",fontSize:22,fontWeight:900,marginBottom:16}}>📋 Order History</div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {["All","Delivered","Cancelled"].map(f=><div key={f} onClick={()=>setF(f)} style={{flex:1,padding:"8px",borderRadius:12,textAlign:"center",cursor:"pointer",background:filter===f?G.card2:G.card,border:`1.5px solid ${filter===f?G.accent:G.border}`,color:filter===f?G.accent:G.muted,fontWeight:700,fontSize:12}}>{f}</div>)}
      </div>
      {filtered.length===0&&<div style={{textAlign:"center",paddingTop:60,color:G.muted}}>No orders yet</div>}
      {filtered.map(o=>(
        <Card key={o.id} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div><div style={{color:"#fff",fontWeight:800}}>{o.id}</div><div style={{color:G.muted,fontSize:12,marginTop:2}}>{o.date}</div></div><Pill s={o.status}/></div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <div style={{flex:1,background:G.card2,borderRadius:10,padding:"9px 12px"}}><div style={{color:"#475569",fontSize:10,fontWeight:700}}>FROM</div><div style={{color:"#CBD5E1",fontSize:13,fontWeight:600}}>{o.from?.split(",")[0]}</div></div>
            <div style={{color:"#334155",alignSelf:"center"}}>→</div>
            <div style={{flex:1,background:G.card2,borderRadius:10,padding:"9px 12px"}}><div style={{color:"#475569",fontSize:10,fontWeight:700}}>TO</div><div style={{color:"#CBD5E1",fontSize:13,fontWeight:600}}>{o.to?.split(",")[0]}</div></div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:`1px solid ${G.border}`,alignItems:"center"}}>
            <div><div style={{color:G.muted,fontSize:11}}>🏍️ {o.rider}</div><div style={{color:G.muted,fontSize:11,marginTop:1}}>{o.payment==="paystack"?"💳":o.payment==="cash"?"💵":"🏦"} {o.payment}</div></div>
            <div style={{color:G.accent,fontWeight:900,fontSize:16}}>{N(o.amount)}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ─── PROFILE ─────────────────────────────────────── */
function Prof({user,dispatch,pop,setSc,unread=0}){
  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{background:"radial-gradient(ellipse at 50% 0%,#0D2B1E,#030712)",borderRadius:24,padding:"28px 20px",textAlign:"center",marginBottom:20,border:`1px solid ${G.border}`}}>
        <div style={{width:72,height:72,borderRadius:36,background:G.green,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",boxShadow:"0 0 40px rgba(0,208,132,.3)"}}><QDLogo size={52} dark={false}/></div>
        <div style={{color:"#fff",fontSize:20,fontWeight:900}}>{user.name}</div>
        <div style={{color:G.muted,fontSize:13,marginTop:3}}>{user.email||user.phone}</div>
        <div style={{color:G.accent,fontSize:12,marginTop:4}}>{user.city||"Nigeria"} • {user.type==="rider"?`${user.trips||0} trips`:user.type==="admin"?"Administrator":`${user.orders||0} orders`}</div>
      </div>
      {[["🔔",`Notifications${unread>0?` (${unread} new)`:""}`],["📍","Saved Addresses"],["💳","Payment Methods"],["🛡️","Safety & Support"],["⚙️","Settings"]].map(([ic,lb])=>(
        <div key={lb} style={{background:G.card,borderRadius:16,padding:"15px",marginBottom:10,display:"flex",alignItems:"center",border:`1px solid ${G.border}`,cursor:"pointer"}}>
          <span style={{fontSize:20,marginRight:12}}>{ic}</span>
          <span style={{color:"#CBD5E1",fontSize:15,fontWeight:600,flex:1}}>{lb}</span>
          {lb.includes("new")&&<div style={{background:G.red,color:"#fff",borderRadius:10,padding:"2px 8px",fontSize:11,fontWeight:800,marginRight:8}}>{unread}</div>}
          <span style={{color:"#334155",fontSize:18}}>›</span>
        </div>
      ))}
      <GBtn danger onClick={()=>setSc("onboard")} style={{marginTop:8}}>Sign Out</GBtn>
    </div>
  );
}

/* ─── RIDER HOME ──────────────────────────────────── */
function RHome({user,db,dispatch,pop}){
  const [online,setOnline]=useState(user.online||false);
  const [inc,setInc]=useState(null);
  const [acc,setAcc]=useState(null);
  const [eta,setEta]=useState(100);
  const ref=useRef(null);const it=useRef(null);

  useEffect(()=>{
    if(online&&!inc&&!acc){it.current=setTimeout(()=>setInc({id:"#QD-"+Math.floor(Math.random()*9000+1000),from:"Terminus Market, Jos",to:"Rayfield, Jos",amount:800,km:3.2,customer:"Daniel Adamu",rating:4.7}),4000);}
    return()=>clearTimeout(it.current);
  },[online,inc,acc]);

  useEffect(()=>{
    if(acc){setEta(100);ref.current=setInterval(()=>setEta(e=>{if(e<=0){clearInterval(ref.current);return 0;}return e-0.5;}),150);}
    return()=>clearInterval(ref.current);
  },[acc]);

  const tog=()=>{setOnline(o=>!o);dispatch({type:"TOGGLE_RIDER",id:user.id});if(online){setInc(null);setAcc(null);}};

  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><div style={{color:G.muted,fontSize:13}}>Welcome back 🏍️</div><div style={{color:"#fff",fontSize:22,fontWeight:900,letterSpacing:-1}}>{user.name.split(" ")[0]}</div></div>
        <div onClick={tog} style={{background:online?G.green:"#1E293B",borderRadius:30,padding:"9px 18px",cursor:"pointer",color:"#fff",fontWeight:800,fontSize:14,boxShadow:online?"0 4px 20px rgba(0,208,132,.3)":"none",transition:"all .3s"}}>{online?"🟢 Online":"⚫ Offline"}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
        {[["💰","₦8,400","Today"],["📦","7","Trips"],["⭐",user.rating||"5.0","Rating"]].map(([ic,v,l])=>(<Card key={l} style={{padding:"14px 10px",textAlign:"center"}}><div style={{fontSize:22,marginBottom:6}}>{ic}</div><div style={{color:G.accent,fontWeight:900,fontSize:17}}>{v}</div><div style={{color:G.muted,fontSize:11,marginTop:2}}>{l}</div></Card>))}
      </div>
      {online&&<div style={{marginBottom:16}}><MV h={160} rx={acc?50:20} pct={acc?(100-eta):0}/></div>}
      {online&&inc&&!acc&&(
        <Card style={{border:`2px solid ${G.accent}`,background:"linear-gradient(135deg,#0D2B1E,#0F1724)",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:10,height:10,borderRadius:5,background:G.accent,animation:"ping 1s infinite"}}/><div style={{color:G.accent,fontWeight:800,fontSize:15}}>New Order!</div></div><div style={{color:G.yellow,fontWeight:900,fontSize:20}}>{N(inc.amount)}</div></div>
          <div style={{background:G.card2,borderRadius:12,padding:"12px 14px",marginBottom:14}}>
            <div style={{color:G.muted,fontSize:12,marginBottom:3}}>📍 Pickup</div><div style={{color:"#CBD5E1",fontWeight:600,marginBottom:8}}>{inc.from.split(",")[0]}</div>
            <div style={{color:G.muted,fontSize:12,marginBottom:3}}>🎯 Drop-off</div><div style={{color:"#CBD5E1",fontWeight:600,marginBottom:8}}>{inc.to.split(",")[0]}</div>
            <div style={{display:"flex",gap:12}}><span style={{color:G.accent,fontSize:12,fontWeight:700}}>📏{inc.km}km</span><span style={{color:G.muted,fontSize:12}}>👤{inc.customer}</span><span style={{color:G.yellow,fontSize:12}}>⭐{inc.rating}</span></div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{setAcc(inc);setInc(null);pop("Order accepted! 🏍️");}} style={{flex:1,padding:13,borderRadius:14,border:"none",background:G.green,color:"#fff",fontWeight:800,cursor:"pointer",fontSize:15,fontFamily:"inherit"}}>✅ Accept</button>
            <button onClick={()=>{setInc(null);pop("Declined","err");}} style={{flex:1,padding:13,borderRadius:14,border:"none",background:"#1E293B",color:G.red,fontWeight:800,cursor:"pointer",fontSize:15,fontFamily:"inherit"}}>✕ Decline</button>
          </div>
        </Card>
      )}
      {acc&&(
        <Card style={{border:`1px solid ${G.accent}`,marginBottom:16}}>
          <div style={{color:G.accent,fontWeight:800,fontSize:15,marginBottom:10}}>🏍️ Active Delivery</div>
          <div style={{color:"#CBD5E1",fontSize:14,marginBottom:4}}>{acc.from.split(",")[0]} → {acc.to.split(",")[0]}</div>
          <div style={{display:"flex",gap:10,marginBottom:12}}><span style={{color:G.accent,fontSize:13,fontWeight:700}}>{N(acc.amount)}</span><span style={{color:G.muted,fontSize:13}}>• {acc.km}km</span></div>
          <div style={{background:"#1E293B",borderRadius:6,height:6,marginBottom:8}}><div style={{background:G.green,height:"100%",borderRadius:6,width:`${100-eta}%`,transition:"width .3s"}}/></div>
          <div style={{color:G.muted,fontSize:12,marginBottom:14}}>{Math.ceil(eta/10)} min remaining</div>
          <PBtn onClick={()=>{setAcc(null);setEta(100);pop("Delivered! ₦"+acc.amount+" earned 💰");}}>✅ Mark as Delivered</PBtn>
        </Card>
      )}
      {online&&!inc&&!acc&&(<Card style={{textAlign:"center",padding:"36px 20px"}}><div style={{fontSize:46,marginBottom:12,animation:"spin 3s linear infinite"}}>🔄</div><div style={{color:"#fff",fontWeight:800,fontSize:17}}>Looking for orders…</div><div style={{color:G.muted,fontSize:13,marginTop:5}}>New order appears in ~4 seconds</div></Card>)}
      {!online&&(<Card style={{textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:60,marginBottom:12}}>😴</div><div style={{color:"#fff",fontWeight:800,fontSize:18}}>You're Offline</div><div style={{color:G.muted,fontSize:13,marginTop:5}}>Go online to start earning</div><PBtn style={{marginTop:16}} onClick={tog}>Go Online</PBtn></Card>)}
      <style>{`@keyframes ping{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:0;transform:scale(2)}}`}</style>
    </div>
  );
}

/* ─── RIDER EARNINGS ──────────────────────────────── */
function REarn(){
  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{color:"#fff",fontSize:22,fontWeight:900,marginBottom:20}}>💰 Earnings</div>
      <div style={{background:G.green,borderRadius:22,padding:"26px 22px",marginBottom:20,textAlign:"center",boxShadow:"0 8px 36px rgba(0,208,132,.28)"}}><div style={{color:"rgba(255,255,255,.75)",fontSize:13}}>This Week</div><div style={{color:"#fff",fontSize:42,fontWeight:900,letterSpacing:-2}}>₦42,800</div><div style={{color:"rgba(255,255,255,.7)",fontSize:13,marginTop:3}}>38 deliveries completed</div></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
        {[["💳","₦18,400","Paystack"],["💵","₦16,200","Cash"],["🏦","₦8,200","Transfer"]].map(([ic,v,l])=>(<Card key={l} style={{textAlign:"center",padding:"14px 10px"}}><div style={{fontSize:20,marginBottom:4}}>{ic}</div><div style={{color:G.accent,fontWeight:900,fontSize:15}}>{v}</div><div style={{color:G.muted,fontSize:10,marginTop:2}}>{l}</div></Card>))}
      </div>
      {[["Today","₦8,400",7],["Yesterday","₦11,200",9],["Monday","₦9,800",8],["Sunday","₦7,600",6]].map(([d,a,c])=>(<Card key={d} style={{marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{color:"#CBD5E1",fontWeight:700}}>{d}</div><div style={{color:G.muted,fontSize:12,marginTop:2}}>{c} deliveries</div></div><div style={{color:G.accent,fontWeight:900,fontSize:18}}>{a}</div></Card>))}
    </div>
  );
}

/* ─── ADMIN DASHBOARD ─────────────────────────────── */
function ADash({db}){
  const rev=db.orders.filter(o=>o.status==="Delivered").reduce((s,o)=>s+o.amount,0);
  const byP={paystack:0,cash:0,transfer:0};
  db.orders.filter(o=>o.status==="Delivered").forEach(o=>{if(byP[o.payment]!==undefined)byP[o.payment]+=o.amount;});
  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{color:"#fff",fontSize:22,fontWeight:900}}>📊 Dashboard</div>
      <div style={{color:G.muted,fontSize:13,marginBottom:20}}>QuickDrop Operations — Jos & Abuja</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        {[["💰",N(rev),"Revenue","All time"],["🏍️",`${db.riders.filter(r=>r.online).length}/${db.riders.length}`,"Riders","Online now"],["📦",db.orders.length,"Orders","Total"],["⏳",db.riderApplications.filter(a=>a.status==="Pending").length,"Pending","Applications"]].map(([ic,v,l,s])=>(<Card key={l} style={{padding:"15px 14px"}}><div style={{fontSize:24,marginBottom:8}}>{ic}</div><div style={{color:G.accent,fontWeight:900,fontSize:20}}>{v}</div><div style={{color:"#CBD5E1",fontSize:13,fontWeight:700}}>{l}</div><div style={{color:G.muted,fontSize:11,marginTop:2}}>{s}</div></Card>))}
      </div>
      <Card style={{marginBottom:14}}>
        <div style={{color:"#fff",fontWeight:800,marginBottom:14,fontSize:14}}>💳 Payment Breakdown</div>
        {[["💳","Paystack",byP.paystack,"#00C3FF"],["💵","Cash",byP.cash,"#22C55E"],["🏦","Transfer",byP.transfer,G.purple]].map(([ic,l,v,col])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <span style={{fontSize:20}}>{ic}</span>
            <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:"#CBD5E1",fontSize:13,fontWeight:600}}>{l}</span><span style={{color:col,fontWeight:700,fontSize:13}}>{N(v)}</span></div><div style={{height:5,background:"#1E293B",borderRadius:3}}><div style={{height:"100%",width:`${rev>0?(v/rev*100):0}%`,background:col,borderRadius:3}}/></div></div>
          </div>
        ))}
      </Card>
      <Card style={{marginBottom:14}}>
        <div style={{color:"#fff",fontWeight:800,marginBottom:14,fontSize:14}}>📈 Weekly Revenue</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:5,height:80}}>
          {[35,58,42,75,50,88,65].map((h,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}><div style={{width:"100%",height:`${h}%`,background:i===5?G.green:`${G.accent}40`,borderRadius:"5px 5px 0 0"}}/><div style={{color:G.muted,fontSize:10,fontWeight:700}}>{"MTWTFSS"[i]}</div></div>)}
        </div>
      </Card>
      <Card>
        <div style={{color:"#fff",fontWeight:800,marginBottom:12,fontSize:14}}>🔴 Live Activity</div>
        {[...db.orders.slice(0,3).map(o=>({dot:G.accent,msg:`${o.id} — ${o.from?.split(",")[0]} → ${o.to?.split(",")[0]}`,time:o.date})),...db.changelog.slice(0,2).map(c=>({dot:G.yellow,msg:c.action,time:c.time}))].map((a,i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:10}}><div style={{width:8,height:8,borderRadius:4,background:a.dot,marginTop:4,flexShrink:0}}/><div><div style={{color:"#CBD5E1",fontSize:13}}>{a.msg}</div><div style={{color:"#334155",fontSize:11,marginTop:1}}>{a.time}</div></div></div>
        ))}
      </Card>
    </div>
  );
}

/* ─── ADMIN RIDERS ────────────────────────────────── */
function ARiders({db,dispatch,pop}){
  const [tab,setTab]=useState("active");
  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{color:"#fff",fontSize:22,fontWeight:900,marginBottom:16}}>🏍️ Riders</div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {["active","applications"].map(id=><div key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"9px",borderRadius:14,textAlign:"center",cursor:"pointer",background:tab===id?"#0D2B1E":G.card2,border:`1.5px solid ${tab===id?G.accent:G.border}`,color:tab===id?G.accent:G.muted,fontWeight:700,fontSize:13}}>{id==="active"?"Active":<>Applications{db.riderApplications.filter(a=>a.status==="Pending").length>0&&<span style={{background:G.red,color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10,marginLeft:4,fontWeight:900}}>{db.riderApplications.filter(a=>a.status==="Pending").length}</span>}</>}</div>)}
      </div>
      {tab==="active"&&db.riders.map(r=>(
        <Card key={r.id} style={{marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}><Av t={r.avatar} sz={44}/><div style={{flex:1}}><div style={{color:"#fff",fontWeight:700,fontSize:15}}>{r.name}</div><div style={{color:G.muted,fontSize:12,marginTop:2}}>{r.bike} • {r.plate} • {r.city}</div></div><div style={{background:r.online?G.accent+"22":"#1E293B",color:r.online?G.accent:G.muted,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:800}}>{r.online?"🟢 Online":"⚫ Offline"}</div></div>
          <div style={{display:"flex",gap:0,paddingTop:10,borderTop:`1px solid ${G.border}`,alignItems:"center"}}>
            {[[r.trips,"Trips",G.accent],[`⭐${r.rating}`,"Rating",G.yellow],[N(r.earnings),"Earned","#CBD5E1"]].map(([v,l,c])=>(<div key={l} style={{flex:1,textAlign:"center"}}><div style={{color:c,fontWeight:800,fontSize:14}}>{v}</div><div style={{color:G.muted,fontSize:10,marginTop:2}}>{l}</div></div>))}
            <button onClick={()=>pop(`${r.name} suspended`,"err")} style={{padding:"7px 14px",borderRadius:10,border:"none",background:"#F8717122",color:G.red,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Suspend</button>
          </div>
        </Card>
      ))}
      {tab==="applications"&&(db.riderApplications.length===0?<div style={{textAlign:"center",paddingTop:60,color:G.muted}}>No pending applications</div>:db.riderApplications.map(a=>(
        <Card key={a.id} style={{marginBottom:12}}>
          <div style={{color:"#fff",fontWeight:700,marginBottom:4}}>{a.name}</div>
          <div style={{color:G.muted,fontSize:12,marginBottom:4}}>{a.phone} • {a.email}</div>
          <div style={{color:G.muted,fontSize:12,marginBottom:10}}>{a.bike} • {a.plate} • {a.city}</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>pop(`${a.name} approved ✅`)} style={{flex:1,padding:"9px",borderRadius:10,border:"none",background:G.green,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Approve</button>
            <button onClick={()=>pop(`${a.name} rejected`,"err")} style={{flex:1,padding:"9px",borderRadius:10,border:"none",background:"#1E293B",color:G.red,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Reject</button>
          </div>
        </Card>
      )))}
    </div>
  );
}

/* ─── ADMIN ORDERS ────────────────────────────────── */
function AOrders({db}){
  const [f,setF]=useState("All");
  const filtered=f==="All"?db.orders:db.orders.filter(o=>o.status===f);
  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{color:"#fff",fontSize:22,fontWeight:900,marginBottom:16}}>📦 Orders</div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>{["All","Delivered","Cancelled"].map(x=><div key={x} onClick={()=>setF(x)} style={{flex:1,padding:"8px",borderRadius:12,textAlign:"center",cursor:"pointer",background:f===x?G.card2:G.card,border:`1.5px solid ${f===x?G.accent:G.border}`,color:f===x?G.accent:G.muted,fontWeight:700,fontSize:12}}>{x}</div>)}</div>
      {filtered.map(o=>(
        <Card key={o.id} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div style={{color:"#fff",fontWeight:800}}>{o.id}</div><Pill s={o.status}/></div>
          <div style={{color:G.muted,fontSize:13,marginBottom:3}}>📍 {o.from?.split(",")[0]} → {o.to?.split(",")[0]}</div>
          <div style={{color:G.muted,fontSize:12,marginBottom:8}}>🏍️ {o.rider} • {o.city} • {o.date}</div>
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:`1px solid ${G.border}`,alignItems:"center"}}>
            <div style={{display:"flex",gap:8}}><span style={{color:G.muted,fontSize:11}}>{o.km}km</span><span style={{color:G.muted,fontSize:11}}>{o.payment==="paystack"?"💳":o.payment==="cash"?"💵":"🏦"} {o.payment}</span></div>
            <div style={{color:G.accent,fontWeight:900,fontSize:15}}>{N(o.amount)}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ─── ADMIN FARES ─────────────────────────────────── */
function AFares({db,dispatch,pop}){
  const [city,setCity]=useState("Jos");
  const [tab,setTab]=useState("rates");
  const [lc,setLc]=useState(()=>JSON.parse(JSON.stringify(db.fareConfig)));
  const [ls,setLs]=useState(()=>JSON.parse(JSON.stringify(db.surge)));
  const [dirty,setD]=useState(false);
  const [pk,setPk]=useState(5);
  const ur=(svc,f,v)=>{setLc(p=>({...p,[city]:{...p[city],[svc]:{...p[city][svc],[f]:v}}}));setD(true);};
  const us=(f,v)=>{setLs(p=>({...p,[city]:{...p[city],[f]:v}}));setD(true);};
  const save=()=>{dispatch({type:"UPDATE_FARES",city,config:lc[city]});dispatch({type:"UPDATE_SURGE",city,config:ls[city]});setD(false);pop(`✅ ${city} rates saved!`);};
  const rst=()=>{setLc(JSON.parse(JSON.stringify(db.fareConfig)));setLs(JSON.parse(JSON.stringify(db.surge)));setD(false);pop("↩️ Reset");};
  const cfg=lc[city]||lc.Default;const srg=ls[city]||{enabled:false,multiplier:1.5,hours:""};
  return(
    <div style={{padding:"56px 20px 100px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div><div style={{color:"#fff",fontSize:22,fontWeight:900}}>💰 Fare Control</div><div style={{color:G.muted,fontSize:13}}>Set prices per city</div></div>
        <div style={{background:dirty?G.yellow+"22":"#0D2B1E",color:dirty?G.yellow:G.accent,borderRadius:10,padding:"5px 12px",fontSize:12,fontWeight:800}}>{dirty?"● Unsaved":"✓ Saved"}</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
        {Object.keys(lc).map(c=><div key={c} onClick={()=>setCity(c)} style={{flexShrink:0,padding:"7px 14px",borderRadius:20,cursor:"pointer",background:city===c?"#0D2B1E":G.card2,border:`1.5px solid ${city===c?G.accent:G.border}`,color:city===c?G.accent:G.muted,fontWeight:700,fontSize:12}}>{c}{(c==="Jos"||c==="Abuja")&&<span style={{marginLeft:4,fontSize:9,background:G.accent+"22",borderRadius:6,padding:"1px 5px",color:G.accent}}>★</span>}</div>)}
      </div>
      <div style={{display:"flex",borderBottom:`1px solid ${G.border}`,marginBottom:16}}>
        {[["rates","📊 Rates"],["surge","⚡ Surge"],["preview","🧮 Preview"]].map(([id,lb])=><div key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"11px 0",textAlign:"center",cursor:"pointer",color:tab===id?G.accent:G.muted,fontWeight:tab===id?800:600,fontSize:12,borderBottom:tab===id?`2px solid ${G.accent}`:"2px solid transparent"}}>{lb}</div>)}
      </div>
      {tab==="rates"&&Object.entries(cfg||{}).map(([svc,r])=>r&&(
        <Card key={svc} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:r.enabled?14:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,borderRadius:10,background:(SVC[svc]?.color||G.muted)+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{SVC[svc]?.icon||"📦"}</div><div><div style={{color:"#fff",fontWeight:800,fontSize:15}}>{svc}</div><div style={{color:SVC[svc]?.color||G.muted,fontSize:11}}>{N(r.base)} + {N(r.perKm)}/km</div></div></div>
            <Toggle value={r.enabled} onChange={v=>ur(svc,"enabled",v)}/>
          </div>
          {r.enabled&&(<>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
              {[["BASE","base"],["PER KM","perKm"],["MIN FARE","minFare"]].map(([lb,fld])=>(
                <div key={fld}><div style={{color:G.muted,fontSize:9,fontWeight:700,letterSpacing:1,marginBottom:4}}>{lb}</div><div style={{display:"flex",alignItems:"center",background:G.card2,borderRadius:10,border:`1px solid ${G.border}`,overflow:"hidden"}}><span style={{color:G.muted,fontSize:12,padding:"0 7px",borderRight:`1px solid ${G.border}`}}>₦</span><input type="number" value={r[fld]} onChange={e=>ur(svc,fld,Number(e.target.value))} style={{flex:1,background:"none",border:"none",outline:"none",color:G.text,fontSize:13,fontWeight:700,padding:"9px 7px",fontFamily:"inherit",width:"100%"}}/></div></div>
              ))}
            </div>
            <div style={{background:G.card2,borderRadius:10,padding:"9px 12px",display:"flex",justifyContent:"space-between"}}><span style={{color:G.muted,fontSize:12}}>5km estimate</span><span style={{color:SVC[svc]?.color||G.accent,fontWeight:900,fontSize:16}}>{N(cF(5,r,srg))}</span></div>
          </>)}
        </Card>
      ))}
      {tab==="surge"&&(
        <Card>
          <Toggle value={srg.enabled} onChange={v=>us("enabled",v)} label="Enable Surge Pricing"/>
          {srg.enabled&&(<div style={{marginTop:18}}>
            <div style={{color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:8}}>MULTIPLIER</div>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}><input type="range" min="1.1" max="3.0" step="0.1" value={srg.multiplier} onChange={e=>us("multiplier",parseFloat(e.target.value))} style={{flex:1,accentColor:G.accent}}/><div style={{background:G.card2,borderRadius:10,padding:"7px 14px",minWidth:56,textAlign:"center"}}><div style={{color:G.accent,fontWeight:900,fontSize:18}}>{srg.multiplier}x</div></div></div>
            <div style={{color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:6}}>PEAK HOURS</div>
            <input value={srg.hours} onChange={e=>us("hours",e.target.value)} style={{width:"100%",background:G.card2,border:`1px solid ${G.border}`,borderRadius:12,padding:"11px 14px",color:G.text,fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>)}
        </Card>
      )}
      {tab==="preview"&&(<>
        <Card style={{marginBottom:14}}>
          <div style={{color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:8}}>DISTANCE</div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}><input type="range" min="0.5" max="30" step="0.5" value={pk} onChange={e=>setPk(parseFloat(e.target.value))} style={{flex:1,accentColor:G.accent}}/><div style={{background:G.card2,borderRadius:10,padding:"7px 12px",minWidth:64,textAlign:"center"}}><div style={{color:G.accent,fontWeight:900,fontSize:18}}>{pk}</div><div style={{color:G.muted,fontSize:10}}>km</div></div></div>
        </Card>
        {Object.entries(cfg||{}).map(([svc,r])=>r?.enabled&&(<Card key={svc} style={{marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{color:"#fff",fontWeight:700}}>{SVC[svc]?.icon} {svc}</div><div style={{color:G.muted,fontSize:11,marginTop:2}}>{N(r.base)} + {N(r.perKm)}×{pk}km</div></div><div style={{textAlign:"right"}}><div style={{color:SVC[svc]?.color||G.accent,fontWeight:900,fontSize:22}}>{N(cF(pk,r,{enabled:false}))}</div>{srg.enabled&&<div style={{color:G.yellow,fontSize:11,fontWeight:700}}>⚡{N(cF(pk,r,srg))}</div>}</div></Card>))}
      </>)}
      <div style={{position:"sticky",bottom:0,background:G.dark,paddingTop:14,paddingBottom:8,display:"flex",gap:8}}>
        <button onClick={rst} style={{flex:1,padding:"13px",borderRadius:14,border:`1px solid ${G.border}`,background:"transparent",color:G.muted,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>↩️ Reset</button>
        <button onClick={save} style={{flex:2,padding:"13px",borderRadius:14,border:"none",background:dirty?G.green:"#1E293B",color:dirty?"#fff":G.muted,fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit",boxShadow:dirty?"0 5px 18px rgba(0,208,132,.3)":"none"}}>{dirty?`💾 Save ${city} Rates`:"✓ All Saved"}</button>
      </div>
    </div>
  );
}