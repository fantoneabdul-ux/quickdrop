import { useState, useEffect, useRef, useReducer } from "react";

/* ════════════════════════════════════════════════════
   THEME
════════════════════════════════════════════════════ */
const G = {
  green:  "linear-gradient(135deg,#00D084,#00956A)",
  dark:   "#030712",
  card:   "#0F1724",
  card2:  "#0A1120",
  border: "#1E293B",
  text:   "#F1F5F9",
  muted:  "#64748B",
  accent: "#00D084",
  red:    "#F87171",
  yellow: "#FBBF24",
  blue:   "#60A5FA",
};

/* ════════════════════════════════════════════════════
   BACKEND STATE (simulated in-memory database)
════════════════════════════════════════════════════ */
const initialDB = {
  users: [
    { id:"u1", name:"Abdullah Fantone", phone:"08012345678", email:"abdullah@quickdrop.ng", city:"Jos", type:"customer", orders:24, spent:42800, rating:4.8, joined:"Jan 2026" },
  ],
  riders: [
    { id:"r1", name:"Daniel Gyang",    avatar:"DG", rating:4.9, bike:"Honda CB125",   plate:"JOS 234 AA", city:"Jos",   online:true,  trips:312, earnings:284000, phone:"08011111111" },
    { id:"r2", name:"Emmanuel Dung",   avatar:"ED", rating:4.8, bike:"TVS Star City", plate:"JOS 567 BB", city:"Jos",   online:true,  trips:245, earnings:216000, phone:"08022222222" },
    { id:"r3", name:"Sunday Pam",      avatar:"SP", rating:4.7, bike:"Bajaj Boxer",   plate:"JOS 890 CC", city:"Jos",   online:false, trips:198, earnings:178000, phone:"08033333333" },
    { id:"r4", name:"Musa Ibrahim",    avatar:"MI", rating:4.9, bike:"Honda CB125",   plate:"ABJ 111 DD", city:"Abuja", online:true,  trips:289, earnings:312000, phone:"08044444444" },
    { id:"r5", name:"Yusuf Abubakar", avatar:"YA", rating:4.8, bike:"TVS Apache",    plate:"ABJ 222 EE", city:"Abuja", online:true,  trips:201, earnings:231000, phone:"08055555555" },
  ],
  orders: [
    { id:"#QD-0091", from:"Terminus Market",  to:"Rayfield",        rider:"Daniel Gyang",  city:"Jos",   date:"Today, 2:30PM",   status:"Delivered", amount:800,  km:3.2, userId:"u1" },
    { id:"#QD-0088", from:"UNIJOS",            to:"Bauchi Road",     rider:"Emmanuel Dung", city:"Jos",   date:"Yesterday, 11AM", status:"Delivered", amount:600,  km:2.1, userId:"u1" },
    { id:"#QD-0084", from:"Zaria Road",        to:"Bukuru",          rider:"Sunday Pam",    city:"Jos",   date:"Mar 7, 9:00AM",   status:"Cancelled", amount:1200, km:8.5, userId:"u1" },
    { id:"#QD-0079", from:"Jos Museum",        to:"Naraguta",        rider:"Daniel Gyang",  city:"Jos",   date:"Mar 5, 3:45PM",   status:"Delivered", amount:500,  km:1.8, userId:"u1" },
    { id:"#QD-0071", from:"Tudun Wada",        to:"Anglo-Jos",       rider:"Emmanuel Dung", city:"Jos",   date:"Mar 4, 1:10PM",   status:"Delivered", amount:450,  km:1.2, userId:"u1" },
  ],
  fareConfig: {
    Jos:   { Standard:{base:300,perKm:120,minFare:400,enabled:true}, Express:{base:500,perKm:200,minFare:700,enabled:true}, Fragile:{base:450,perKm:160,minFare:600,enabled:true} },
    Abuja: { Standard:{base:400,perKm:150,minFare:600,enabled:true}, Express:{base:700,perKm:250,minFare:1000,enabled:true}, Fragile:{base:600,perKm:200,minFare:900,enabled:true} },
    Lagos: { Standard:{base:500,perKm:180,minFare:700,enabled:true}, Express:{base:800,perKm:280,minFare:1200,enabled:true}, Fragile:{base:700,perKm:220,minFare:1000,enabled:true} },
    Kano:  { Standard:{base:300,perKm:110,minFare:400,enabled:true}, Express:{base:500,perKm:190,minFare:700,enabled:true}, Fragile:{base:400,perKm:150,minFare:550,enabled:true} },
  },
  surge: {
    Jos:   { enabled:false, multiplier:1.5, hours:"7AM–9AM, 5PM–8PM" },
    Abuja: { enabled:false, multiplier:1.5, hours:"7AM–9AM, 5PM–8PM" },
    Lagos: { enabled:false, multiplier:2.0, hours:"7AM–10AM, 4PM–9PM" },
    Kano:  { enabled:false, multiplier:1.3, hours:"7AM–9AM, 5PM–7PM" },
  },
  notifications: [
    { id:1, msg:"Your package was delivered to Rayfield ✅", time:"2 min ago", read:false },
    { id:2, msg:"Daniel Gyang rated 5 stars ⭐⭐⭐⭐⭐", time:"1 hr ago", read:false },
    { id:3, msg:"New promo: 20% off express delivery!", time:"Today", read:true },
  ],
  riderApplications: [],
  changelog: [
    { time:"Mar 10", city:"Jos",   action:"Standard perKm ₦100→₦120", by:"Admin" },
    { time:"Mar 8",  city:"Abuja", action:"Express base ₦600→₦700",   by:"Admin" },
  ],
};

function dbReducer(state, action) {
  switch(action.type) {
    case "ADD_ORDER":      return { ...state, orders: [action.order, ...state.orders] };
    case "CANCEL_ORDER":   return { ...state, orders: state.orders.map(o => o.id===action.id ? {...o,status:"Cancelled"} : o) };
    case "ADD_USER":       return { ...state, users: [...state.users, action.user] };
    case "ADD_RIDER_APP":  return { ...state, riderApplications: [...state.riderApplications, action.app] };
    case "UPDATE_FARES":   return { ...state, fareConfig: { ...state.fareConfig, [action.city]: action.config }, changelog: [{ time:"Just now", city:action.city, action:`Fare config updated`, by:"Admin" }, ...state.changelog] };
    case "UPDATE_SURGE":   return { ...state, surge: { ...state.surge, [action.city]: action.config } };
    case "TOGGLE_RIDER":   return { ...state, riders: state.riders.map(r => r.id===action.id ? {...r, online:!r.online} : r) };
    case "READ_NOTIFS":    return { ...state, notifications: state.notifications.map(n => ({...n, read:true})) };
    default:               return state;
  }
}

/* ════════════════════════════════════════════════════
   LOCATION DATA (Jos primary)
════════════════════════════════════════════════════ */
const LOCATIONS = {
  Jos: [
    {name:"Terminus Market",lat:9.9236,lng:8.8951,icon:"🛒"},
    {name:"Rayfield",       lat:9.8800,lng:8.9100,icon:"🌿"},
    {name:"Bukuru",         lat:9.7900,lng:8.8600,icon:"🏘️"},
    {name:"UNIJOS",         lat:9.9500,lng:8.8800,icon:"🎓"},
    {name:"Bauchi Road",    lat:9.9600,lng:9.0000,icon:"🛣️"},
    {name:"Zaria Road",     lat:9.9400,lng:8.8700,icon:"🚦"},
    {name:"Tudun Wada",     lat:9.9100,lng:8.8650,icon:"🏡"},
    {name:"Jos Museum",     lat:9.9280,lng:8.8920,icon:"🏛️"},
    {name:"Naraguta",       lat:9.9700,lng:8.8900,icon:"🏙️"},
    {name:"Anglo-Jos",      lat:9.9180,lng:8.9100,icon:"🏢"},
    {name:"Apata",          lat:9.9000,lng:8.8750,icon:"🌆"},
    {name:"Nassarawa GRA",  lat:9.9150,lng:8.9050,icon:"🏠"},
  ],
  Abuja: [
    {name:"Wuse 2",   lat:9.0800,lng:7.4900,icon:"🏙️"},
    {name:"Maitama",  lat:9.0850,lng:7.4800,icon:"💼"},
    {name:"Garki",    lat:9.0540,lng:7.4850,icon:"🏢"},
    {name:"Gwarinpa", lat:9.1100,lng:7.3900,icon:"🏘️"},
    {name:"Jabi",     lat:9.0750,lng:7.4350,icon:"🛍️"},
    {name:"Asokoro",  lat:9.0400,lng:7.5200,icon:"🏛️"},
    {name:"Utako",    lat:9.0820,lng:7.4650,icon:"🌆"},
    {name:"Kubwa",    lat:9.1600,lng:7.3600,icon:"🚌"},
  ],
  Lagos: [
    {name:"Victoria Island",lat:6.4281,lng:3.4219,icon:"🏙️"},
    {name:"Lekki Phase 1",  lat:6.4478,lng:3.4723,icon:"🌴"},
    {name:"Ikeja GRA",      lat:6.6018,lng:3.3515,icon:"✈️"},
    {name:"Yaba",           lat:6.5097,lng:3.3783,icon:"🎓"},
    {name:"Surulere",       lat:6.5022,lng:3.3558,icon:"🏘️"},
    {name:"Apapa",          lat:6.4499,lng:3.3573,icon:"⚓"},
  ],
  Kano: [
    {name:"Sabon Gari",     lat:12.0022,lng:8.5196,icon:"🏪"},
    {name:"Bompai",         lat:12.0200,lng:8.5400,icon:"🏭"},
    {name:"Nassarawa GRA",  lat:11.9900,lng:8.5100,icon:"🏡"},
    {name:"Kano Central",   lat:11.9965,lng:8.5166,icon:"🕌"},
  ],
};

/* ════════════════════════════════════════════════════
   FARE ENGINE
════════════════════════════════════════════════════ */
function haversineKm(lat1,lng1,lat2,lng2){
  const R=6371, dLat=((lat2-lat1)*Math.PI)/180, dLng=((lng2-lng1)*Math.PI)/180;
  const a=Math.sin(dLat/2)**2+Math.cos((lat1*Math.PI)/180)*Math.cos((lat2*Math.PI)/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
function calcFare(km, cfg, surge){
  const raw=cfg.base+km*cfg.perKm;
  const fare=Math.max(cfg.minFare, Math.round(raw/50)*50);
  return surge?.enabled ? Math.round((fare*surge.multiplier)/50)*50 : fare;
}
const N  = n => `₦${Number(n).toLocaleString()}`;
const sc = s => s==="Delivered"?"#22C55E":s==="Cancelled"?"#F87171":"#FBBF24";
const SVC_META = { Standard:{icon:"📦",color:G.blue}, Express:{icon:"⚡",color:G.yellow}, Fragile:{icon:"🫙",color:G.red} };

/* ════════════════════════════════════════════════════
   TINY UI ATOMS
════════════════════════════════════════════════════ */
const Avatar=({t,size=44})=>(<div style={{width:size,height:size,borderRadius:size/2,background:G.green,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:size*.3,flexShrink:0}}>{t}</div>);
const Card=({children,style={}})=>(<div style={{background:G.card,borderRadius:18,padding:20,border:`1px solid ${G.border}`,...style}}>{children}</div>);
const Pill=({s})=>(<span style={{background:sc(s)+"22",color:sc(s),borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:800}}>{s}</span>);
const PBtn=({children,onClick,disabled,loading,style={}})=>(<button onClick={onClick} disabled={disabled||loading} style={{width:"100%",padding:"15px",borderRadius:16,border:"none",cursor:disabled||loading?"not-allowed":"pointer",background:disabled||loading?"#1E293B":G.green,color:disabled||loading?"#475569":"#fff",fontSize:15,fontWeight:800,boxShadow:disabled||loading?"none":"0 6px 20px rgba(0,208,132,.3)",fontFamily:"inherit",letterSpacing:.3,...style}}>{loading?"Please wait…":children}</button>);
const GBtn=({children,onClick,danger,style={}})=>(<button onClick={onClick} style={{width:"100%",padding:"14px",borderRadius:16,cursor:"pointer",background:"transparent",color:danger?G.red:G.muted,border:`1.5px solid ${danger?G.red:G.border}`,fontSize:14,fontWeight:700,fontFamily:"inherit",...style}}>{children}</button>);
const Inp=({label,value,onChange,placeholder,type="text",icon,error})=>(<div style={{marginBottom:16}}>{label&&<div style={{color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:6}}>{label}</div>}<div style={{position:"relative"}}>{icon&&<span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16}}>{icon}</span>}<input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{width:"100%",padding:icon?"13px 14px 13px 44px":"13px 16px",borderRadius:14,border:`1.5px solid ${error?G.red:G.border}`,background:G.card2,color:G.text,fontSize:14,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/></div>{error&&<div style={{color:G.red,fontSize:12,marginTop:4}}>{error}</div>}</div>);
const Toggle=({value,onChange,label})=>(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>{label&&<span style={{color:G.muted,fontSize:13,fontWeight:600}}>{label}</span>}<div onClick={()=>onChange(!value)} style={{width:44,height:24,borderRadius:12,cursor:"pointer",position:"relative",background:value?G.accent:"#1E293B",transition:"background .3s"}}><div style={{width:18,height:18,borderRadius:9,background:"#fff",position:"absolute",top:3,left:value?23:3,transition:"left .3s",boxShadow:"0 1px 4px rgba(0,0,0,.3)"}}/></div></div>);
const Back=({onClick})=>(<button onClick={onClick} style={{background:"none",border:"none",color:G.muted,fontSize:14,cursor:"pointer",padding:"0 0 16px",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>← Back</button>);

/* ════════════════════════════════════════════════════
   ROOT APP
════════════════════════════════════════════════════ */
export default function QuickDrop(){
  const [db, dispatch] = useReducer(dbReducer, initialDB);
  const [screen, setScreen]   = useState("splash");
  const [authMode, setAuthMode] = useState(null); // customer|rider|admin
  const [currentUser, setUser] = useState(null);
  const [toast, setToast]       = useState(null);

  useEffect(()=>{ setTimeout(()=>setScreen("onboard"),2200); },[]);

  const pop=(msg,type="ok")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const login=(type,data)=>{ setUser({...data,type}); setScreen("app"); };

  if(screen==="splash") return <Splash/>;
  if(screen==="onboard") return <Onboard setScreen={setScreen} setAuthMode={setAuthMode}/>;
  if(screen==="auth") return <Auth mode={authMode} db={db} dispatch={dispatch} login={login} pop={pop} setScreen={setScreen}/>;
  if(screen==="app") return <MainApp user={currentUser} db={db} dispatch={dispatch} pop={pop} setScreen={setScreen}/>;
  return null;
}

/* ════════════════════════════════════════════════════
   V2 LOGO COMPONENT
════════════════════════════════════════════════════ */
function QDLogo({ size=60, dark=false }){
  const pinColor = dark ? "#00D084" : "white";
  const bikeColor = dark ? "white" : "#00956A";
  return(
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="pc"><circle cx="50" cy="38" r="22"/></clipPath>
      </defs>
      {/* Pin circle */}
      <circle cx="50" cy="38" r="22" fill={pinColor}/>
      {/* Stem */}
      <path d="M50 60 L50 76" stroke={pinColor} strokeWidth="5" strokeLinecap="round"/>
      {/* Bottom dot */}
      <circle cx="50" cy="79" r="3.5" fill={pinColor}/>
      {/* Bike inside circle */}
      <g clipPath="url(#pc)">
        {/* Speed lines */}
        <line x1="20" y1="40" x2="27" y2="40" stroke={bikeColor} strokeWidth="2" strokeLinecap="round"/>
        <line x1="19" y1="44" x2="25" y2="44" stroke={bikeColor} strokeWidth="1.5" strokeLinecap="round"/>
        {/* Rear wheel */}
        <circle cx="34" cy="47" r="7" fill={bikeColor}/>
        <circle cx="34" cy="47" r="3" fill={pinColor}/>
        {/* Front wheel */}
        <circle cx="62" cy="47" r="7" fill={bikeColor}/>
        <circle cx="62" cy="47" r="3" fill={pinColor}/>
        {/* Frame */}
        <path d="M34 47 L40 36 L56 36 L62 47 Z" fill={bikeColor}/>
        {/* Seat */}
        <rect x="39" y="32" width="18" height="5" rx="2.5" fill={bikeColor}/>
        {/* Rider body */}
        <path d="M48 32 L52 20 L60 22 L57 32 Z" fill={bikeColor}/>
        {/* Rider head */}
        <circle cx="54" cy="17" r="5" fill={bikeColor}/>
        {/* Delivery box */}
        <rect x="27" y="28" width="13" height="11" rx="2" fill={bikeColor}/>
        <line x1="27" y1="32" x2="40" y2="32" stroke={pinColor} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="33.5" y1="28" x2="33.5" y2="39" stroke={pinColor} strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

/* ════════════════════════════════════════════════════
   SPLASH
════════════════════════════════════════════════════ */
function Splash(){
  const [visible,setVisible]=useState(false);
  useEffect(()=>{ setTimeout(()=>setVisible(true),100); },[]);
  return(
    <Frame bg="radial-gradient(ellipse at 40% 30%,#0D3320,#030712)">
      {/* Background rings */}
      {[500,380,260].map(s=>(
        <div key={s} style={{position:"absolute",width:s,height:s,borderRadius:"50%",border:`1px solid #00D084${s===500?"10":s===380?"18":"25"}`,top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>
      ))}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:0,position:"relative"}}>
        <div style={{opacity:visible?1:0,transform:visible?"translateY(0) scale(1)":"translateY(20px) scale(0.8)",transition:"all 0.7s cubic-bezier(0.34,1.56,0.64,1)",display:"flex",flexDirection:"column",alignItems:"center",gap:0}}>
          <div style={{width:110,height:110,borderRadius:32,background:G.green,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24,boxShadow:"0 0 80px rgba(0,208,132,.5),0 0 160px rgba(0,208,132,.2)",animation:"float 2.5s ease-in-out infinite"}}><QDLogo size={80} dark={false}/></div>
          <div style={{color:"#fff",fontSize:40,fontWeight:900,letterSpacing:-2,marginBottom:6}}>QuickDrop</div>
          <div style={{color:G.accent,fontSize:11,letterSpacing:5,textTransform:"uppercase",marginBottom:36}}>Nigeria's Dispatch Network</div>
          <div style={{display:"flex",gap:8}}>
            {["🏔️ Jos","🏛️ Abuja","🌊 Lagos","🌅 Kano"].map((c,i)=>(
              <div key={c} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,padding:"5px 12px",color:"rgba(255,255,255,.6)",fontSize:11,fontWeight:600,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(10px)",transition:`all 0.5s ease ${0.3+i*0.1}s`}}>{c}</div>
            ))}
          </div>
        </div>
        {/* Loading dots */}
        <div style={{position:"absolute",bottom:60,opacity:visible?1:0,transition:"opacity 0.5s ease 0.6s",display:"flex",gap:6}}>
          {[0,1,2].map(i=>(
            <div key={i} style={{width:6,height:6,borderRadius:3,background:G.accent,opacity:0.4,animation:`blink 1.2s ease-in-out ${i*0.2}s infinite`}}/>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes blink{0%,100%{opacity:.2}50%{opacity:1}}
      `}</style>
    </Frame>
  );
}

/* ════════════════════════════════════════════════════
   ONBOARD (3 feature slides → join screen)
════════════════════════════════════════════════════ */
const SLIDES=[
  {emoji:"📍",title:"Real-Time Tracking",sub:"Watch your package move across the city. Live GPS tracking from pickup to doorstep.",color:"#00D084"},
  {emoji:"💰",title:"Smart Pricing",sub:"Pay only for the distance. Our fare engine calculates your exact price in seconds.",color:"#FBBF24"},
  {emoji:"🛡️",title:"Verified Riders",sub:"Every rider on QuickDrop is verified with NIN, license check, and guarantor review.",color:"#60A5FA"},
];

function Onboard({setScreen,setAuthMode}){
  const go=(mode)=>{ setAuthMode(mode); setScreen("auth"); };
  const [slide,setSlide]=useState(0); // 0-2 = feature slides, 3 = join
  const [entered,setEntered]=useState(true);

  const goSlide=(n)=>{ setEntered(false); setTimeout(()=>{ setSlide(n); setEntered(true); },150); };

  if(slide<3){
    const s=SLIDES[slide];
    return(
      <Frame>
        {/* Skip */}
        <div style={{display:"flex",justifyContent:"flex-end",padding:"52px 24px 0",flexShrink:0}}>
          <div onClick={()=>goSlide(3)} style={{color:G.muted,fontSize:14,fontWeight:600,cursor:"pointer"}}>Skip →</div>
        </div>
        {/* Slide */}
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 32px 20px",opacity:entered?1:0,transform:entered?"translateY(0)":"translateY(24px)",transition:"all 0.45s ease"}}>
          <div style={{width:180,height:180,borderRadius:"50%",background:`radial-gradient(circle,${s.color}22,${s.color}05)`,border:`2px solid ${s.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:80,marginBottom:36,boxShadow:`0 0 60px ${s.color}20`}}>
            {s.emoji}
          </div>
          <div style={{color:"#fff",fontSize:28,fontWeight:900,textAlign:"center",letterSpacing:-1,marginBottom:14,lineHeight:1.2}}>{s.title}</div>
          <div style={{color:G.muted,fontSize:15,textAlign:"center",lineHeight:1.7,maxWidth:280}}>{s.sub}</div>
        </div>
        {/* Dots + button */}
        <div style={{padding:"0 28px 48px",display:"flex",flexDirection:"column",alignItems:"center",gap:24,flexShrink:0}}>
          <div style={{display:"flex",gap:8}}>
            {SLIDES.map((_,i)=>(
              <div key={i} onClick={()=>goSlide(i)} style={{width:slide===i?24:8,height:8,borderRadius:4,background:slide===i?s.color:G.border,cursor:"pointer",transition:"all .35s"}}/>
            ))}
          </div>
          <button onClick={()=>goSlide(slide===SLIDES.length-1?3:slide+1)} style={{width:"100%",padding:"16px",borderRadius:18,border:"none",background:G.green,color:"#fff",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 8px 28px rgba(0,208,132,.35)"}}>
            {slide===SLIDES.length-1?"Get Started 🚀":"Next →"}
          </button>
        </div>
      </Frame>
    );
  }

  /* ── JOIN SCREEN ── */
  return(
    <Frame>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px 0",background:"radial-gradient(ellipse at 50% 0%,#0D2B1E,#030712)"}}>
        <div style={{marginBottom:20,animation:"float 3s ease-in-out infinite",filter:"drop-shadow(0 0 28px rgba(0,208,132,.4))"}}>
          <div style={{width:100,height:100,borderRadius:28,background:G.green,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 60px rgba(0,208,132,.4)"}}>
            <QDLogo size={74} dark={false}/>
          </div>
        </div>
        <div style={{color:"#fff",fontSize:32,fontWeight:900,textAlign:"center",letterSpacing:-1.5,lineHeight:1.15,marginBottom:12}}>Lagos to Jos,<br/><span style={{color:G.accent}}>Delivered Fast.</span></div>
        <div style={{color:G.muted,fontSize:14,textAlign:"center",lineHeight:1.7,maxWidth:280}}>Nigeria's trusted dispatch network. Verified riders. Dynamic pricing. Real-time tracking.</div>
        {/* Stats */}
        <div style={{display:"flex",gap:0,marginTop:24,background:G.card,borderRadius:18,border:`1px solid ${G.border}`,overflow:"hidden"}}>
          {[["500+","Riders"],["10k+","Deliveries"],["4.8★","Rating"]].map(([v,l],i)=>(
            <div key={l} style={{flex:1,padding:"14px 16px",textAlign:"center",borderRight:i<2?`1px solid ${G.border}`:"none"}}>
              <div style={{color:G.accent,fontWeight:900,fontSize:18}}>{v}</div>
              <div style={{color:G.muted,fontSize:11,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"20px 28px 48px",display:"flex",flexDirection:"column",gap:12}}>
        <div style={{color:G.muted,fontSize:13,textAlign:"center",fontWeight:600,marginBottom:4}}>I want to…</div>
        <div onClick={()=>go("customer")} style={{background:G.green,borderRadius:20,padding:"20px",cursor:"pointer",boxShadow:"0 10px 32px rgba(0,208,132,.35)",display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:52,height:52,borderRadius:16,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>📦</div>
          <div style={{flex:1}}><div style={{color:"#fff",fontWeight:900,fontSize:17}}>Send a Package</div><div style={{color:"rgba(255,255,255,.75)",fontSize:13,marginTop:2}}>Sign up or log in as customer</div></div>
          <div style={{color:"rgba(255,255,255,.5)",fontSize:24}}>›</div>
        </div>
        <div onClick={()=>go("rider")} style={{background:G.card,borderRadius:20,padding:"20px",cursor:"pointer",border:`1.5px solid ${G.border}`,display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:52,height:52,borderRadius:16,background:"#0D2B1E",border:`1px solid ${G.accent}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🏍️</div>
          <div style={{flex:1}}><div style={{color:"#fff",fontWeight:900,fontSize:17}}>I'm a Dispatch Rider</div><div style={{color:G.muted,fontSize:13,marginTop:2}}>Earn up to ₦80k/month in Jos</div></div>
          <div style={{color:G.muted,fontSize:24}}>›</div>
        </div>
        <div onClick={()=>go("admin")} style={{background:"#070D18",borderRadius:16,padding:"13px 18px",cursor:"pointer",border:`1px solid ${G.border}`,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:16}}>🔐</span><span style={{color:G.muted,fontSize:14,fontWeight:600,flex:1}}>Admin Login</span><span style={{color:"#334155",fontSize:16}}>›</span>
        </div>
        <div style={{textAlign:"center",marginTop:2}}>
          <span style={{color:G.muted,fontSize:13}}>Already have an account? </span>
          <span onClick={()=>go("customer")} style={{color:G.accent,fontSize:13,fontWeight:700,cursor:"pointer"}}>Log In</span>
        </div>
      </div>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </Frame>
  );
}

/* ════════════════════════════════════════════════════
   AUTH (Login + Signup)
════════════════════════════════════════════════════ */
function Auth({mode,db,dispatch,login,pop,setScreen}){
  const [isSignup, setIsSignup] = useState(mode!=="admin");
  const [step, setStep]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [form, setForm]         = useState({firstName:"",lastName:"",phone:"",email:"",password:"",confirm:"",city:"Jos",bikeModel:"",bikePlate:"",bikeYear:"",licenseNo:"",nin:"",guarantor:"",guarantorPhone:""});
  const [errors, setErrors]     = useState({});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  const totalSteps = mode==="rider" ? 4 : mode==="customer" ? 3 : 1;

  const validate=()=>{
    const e={};
    if(mode==="admin"){ if(!form.email||!form.password) e.email="Required"; }
    else if(step===1){
      if(!form.firstName.trim()) e.firstName="Required";
      if(!form.lastName.trim())  e.lastName="Required";
      if(!form.phone.match(/^(\+234|0)[0-9]{10}$/)) e.phone="Valid Nigerian number required";
      if(!isSignup&&!form.email.match(/\S+@\S+\.\S+/)) e.email="Valid email required";
      if(isSignup&&!form.email.match(/\S+@\S+\.\S+/)) e.email="Valid email required";
    } else if(step===2){
      if(form.password.length<6) e.password="Min 6 characters";
      if(isSignup&&form.password!==form.confirm) e.confirm="Passwords don't match";
    } else if(step===3&&mode==="rider"){
      if(!form.bikeModel.trim()) e.bikeModel="Required";
      if(!form.bikePlate.trim()) e.bikePlate="Required";
    }
    setErrors(e); return Object.keys(e).length===0;
  };

  const next=()=>{ if(validate()) setStep(s=>s+1); };

  const submit=()=>{
    if(!validate()) return;
    setLoading(true);
    setTimeout(()=>{
      if(mode==="admin"){
        login("admin",{id:"admin",name:"QuickDrop Admin",email:form.email});
      } else if(mode==="customer"){
        const user={id:"u"+Date.now(),name:`${form.firstName} ${form.lastName}`,phone:form.phone,email:form.email,city:form.city,type:"customer",orders:0,spent:0,rating:5.0,joined:"Mar 2026"};
        if(isSignup) dispatch({type:"ADD_USER",user});
        login("customer",user);
      } else {
        const app={id:"a"+Date.now(),name:`${form.firstName} ${form.lastName}`,phone:form.phone,email:form.email,bike:form.bikeModel,plate:form.bikePlate,city:form.city,status:"Pending",date:"Today"};
        dispatch({type:"ADD_RIDER_APP",app});
        login("rider",{id:"r"+Date.now(),name:`${form.firstName} ${form.lastName}`,avatar:form.firstName[0]+(form.lastName[0]||""),bike:form.bikeModel,plate:form.bikePlate,city:form.city,rating:5.0,trips:0,earnings:0,online:false});
      }
      setLoading(false);
      pop(mode==="rider"?"Application submitted! ✅":"Welcome to QuickDrop! 🎉");
    },1800);
  };

  const modeInfo={ customer:{emoji:"📦",title:"Customer",color:"#00D084"}, rider:{emoji:"🏍️",title:"Rider",color:G.yellow}, admin:{emoji:"🔐",title:"Admin",color:G.blue} };
  const mi=modeInfo[mode];

  return(
    <Frame>
      <div style={{padding:"52px 20px 20px",background:`radial-gradient(ellipse at 50% 0%,${mi.color}15,#030712)`}}>
        <Back onClick={()=>step>1?setStep(s=>s-1):setScreen("onboard")}/>
        <div style={{fontSize:36,marginBottom:8}}>{mi.emoji}</div>
        <div style={{color:"#fff",fontSize:22,fontWeight:900,letterSpacing:-1}}>
          {mode==="admin"?"Admin Login":isSignup?`Sign up as ${mi.title}`:`Log in as ${mi.title}`}
        </div>
        {mode!=="admin"&&(
          <div style={{color:G.muted,fontSize:13,marginTop:4,marginBottom:16}}>
            {isSignup?"Already have an account? ":"New here? "}
            <span onClick={()=>{setIsSignup(!isSignup);setStep(1);setErrors({});}} style={{color:G.accent,fontWeight:700,cursor:"pointer"}}>
              {isSignup?"Log In":"Sign Up"}
            </span>
          </div>
        )}
        {isSignup&&totalSteps>1&&(
          <div style={{display:"flex",alignItems:"center",gap:0,marginTop:8}}>
            {Array.from({length:totalSteps}).map((_,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",flex:1}}>
                <div style={{width:28,height:28,borderRadius:14,background:step>i+1?G.green:step===i+1?`${mi.color}22`:"#0A1120",border:`2px solid ${step>i+1?G.accent:step===i+1?mi.color:G.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:step>i+1?"#fff":step===i+1?mi.color:G.muted,fontWeight:900,fontSize:12,flexShrink:0,transition:"all .3s"}}>{step>i+1?"✓":i+1}</div>
                {i<totalSteps-1&&<div style={{flex:1,height:2,background:step>i+1?G.accent:G.border,margin:"0 2px 0",transition:"background .3s"}}/>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{padding:"20px 20px 48px",overflowY:"auto",flex:1}}>
        {/* Admin Login */}
        {mode==="admin"&&(
          <>
            <Inp label="ADMIN EMAIL" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="admin@quickdrop.ng" icon="✉️" error={errors.email}/>
            <Inp label="PASSWORD" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="••••••••" type="password" icon="🔒"/>
            <PBtn onClick={submit} loading={loading}>🔐 Access Dashboard</PBtn>
          </>
        )}

        {/* Customer/Rider — Login */}
        {mode!=="admin"&&!isSignup&&(
          <>
            <Inp label="PHONE OR EMAIL" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="08012345678 or email" icon="👤" error={errors.email}/>
            <Inp label="PASSWORD" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="••••••••" type="password" icon="🔒"/>
            <PBtn onClick={submit} loading={loading}>Log In →</PBtn>
            <div style={{textAlign:"center",marginTop:14,color:G.accent,fontSize:13,fontWeight:700,cursor:"pointer"}}>Forgot Password?</div>
          </>
        )}

        {/* Customer Signup */}
        {mode==="customer"&&isSignup&&(
          <>
            {step===1&&(<>
              <div style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:16}}>Personal Info</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="FIRST NAME" value={form.firstName} onChange={e=>set("firstName",e.target.value)} placeholder="Daniel" error={errors.firstName}/>
                <Inp label="LAST NAME"  value={form.lastName}  onChange={e=>set("lastName",  e.target.value)} placeholder="Gyang"   error={errors.lastName}/>
              </div>
              <Inp label="PHONE" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="08012345678" icon="📞" error={errors.phone}/>
              <Inp label="EMAIL" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="you@email.com" icon="✉️" type="email" error={errors.email}/>
              <PBtn onClick={next}>Continue →</PBtn>
            </>)}
            {step===2&&(<>
              <div style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:16}}>Create Password</div>
              <Inp label="PASSWORD" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Min 6 chars" type="password" icon="🔒" error={errors.password}/>
              <Inp label="CONFIRM" value={form.confirm} onChange={e=>set("confirm",e.target.value)} placeholder="Repeat password" type="password" icon="🔒" error={errors.confirm}/>
              {form.password.length>0&&<StrengthBar pwd={form.password}/>}
              <PBtn onClick={next}>Continue →</PBtn>
            </>)}
            {step===3&&(<>
              <div style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:6}}>Your Location</div>
              <div style={{color:G.muted,fontSize:13,marginBottom:16}}>Helps us find nearby riders</div>
              <CityPicker value={form.city} onChange={v=>set("city",v)}/>
              <PBtn onClick={submit} loading={loading} style={{marginTop:8}}>🎉 Create Account</PBtn>
            </>)}
          </>
        )}

        {/* Rider Signup */}
        {mode==="rider"&&isSignup&&(
          <>
            {step===1&&(<>
              <div style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:16}}>Personal Info</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="FIRST NAME" value={form.firstName} onChange={e=>set("firstName",e.target.value)} placeholder="Daniel" error={errors.firstName}/>
                <Inp label="LAST NAME"  value={form.lastName}  onChange={e=>set("lastName",  e.target.value)} placeholder="Gyang"   error={errors.lastName}/>
              </div>
              <Inp label="PHONE" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="08012345678" icon="📞" error={errors.phone}/>
              <Inp label="EMAIL" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="you@email.com" icon="✉️" error={errors.email}/>
              <CityPicker value={form.city} onChange={v=>set("city",v)}/>
              <PBtn onClick={next} style={{marginTop:4}}>Continue →</PBtn>
            </>)}
            {step===2&&(<>
              <div style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:16}}>Create Password</div>
              <Inp label="PASSWORD" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Min 6 chars" type="password" icon="🔒" error={errors.password}/>
              <Inp label="CONFIRM"  value={form.confirm}  onChange={e=>set("confirm",  e.target.value)} placeholder="Repeat" type="password" icon="🔒" error={errors.confirm}/>
              {form.password.length>0&&<StrengthBar pwd={form.password}/>}
              <PBtn onClick={next}>Continue →</PBtn>
            </>)}
            {step===3&&(<>
              <div style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:6}}>Bike Details</div>
              <Inp label="BIKE MODEL" value={form.bikeModel} onChange={e=>set("bikeModel",e.target.value)} placeholder="Honda CB125" icon="🏍️" error={errors.bikeModel}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="PLATE NO." value={form.bikePlate} onChange={e=>set("bikePlate",e.target.value)} placeholder="JOS 234 AA" error={errors.bikePlate}/>
                <Inp label="YEAR" value={form.bikeYear} onChange={e=>set("bikeYear",e.target.value)} placeholder="2021"/>
              </div>
              <Card style={{background:"#0D2B1E",border:`1px solid ${G.accent}30`,marginBottom:16}}>
                <div style={{color:G.accent,fontWeight:700,fontSize:12,marginBottom:4}}>✅ Accepted: Honda, Bajaj, TVS, Suzuki, Daylong (2015+)</div>
                <div style={{color:G.muted,fontSize:11}}>Must have valid road worthiness certificate</div>
              </Card>
              <PBtn onClick={next}>Continue →</PBtn>
            </>)}
            {step===4&&(<>
              <div style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:6}}>Identity Verification</div>
              <div style={{color:G.muted,fontSize:13,marginBottom:16}}>Required to operate legally in Nigeria</div>
              <Inp label="DRIVER'S LICENSE" value={form.licenseNo} onChange={e=>set("licenseNo",e.target.value)} placeholder="ABC12345678" icon="🪪" error={errors.licenseNo}/>
              <Inp label="NIN" value={form.nin} onChange={e=>set("nin",e.target.value)} placeholder="12345678901" icon="🔐"/>
              <Inp label="GUARANTOR NAME" value={form.guarantor} onChange={e=>set("guarantor",e.target.value)} placeholder="Full name" icon="👤"/>
              <Inp label="GUARANTOR PHONE" value={form.guarantorPhone} onChange={e=>set("guarantorPhone",e.target.value)} placeholder="08012345678" icon="📞"/>
              <Card style={{background:G.card2,marginBottom:16}}>
                <div style={{color:G.muted,fontSize:12,lineHeight:1.7}}>📄 Upload documents after signup. Our Jos team verifies within <strong style={{color:"#fff"}}>24–48 hours</strong>.</div>
              </Card>
              <PBtn onClick={submit} loading={loading}>🏍️ Submit Application</PBtn>
            </>)}
          </>
        )}
      </div>
    </Frame>
  );
}

/* ════════════════════════════════════════════════════
   MAIN APP SHELL
════════════════════════════════════════════════════ */
function MainApp({user,db,dispatch,pop,setScreen}){
  const [tab,setTab]   = useState(user.type==="admin"?"dash":user.type==="rider"?"ride":"home");
  const [toast,setToast] = useState(null);

  const fireToast=(msg,type="ok")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const custTabs=[{id:"home",icon:"🏠",lbl:"Home"},{id:"track",icon:"📍",lbl:"Track"},{id:"history",icon:"📋",lbl:"Orders"},{id:"profile",icon:"👤",lbl:"Profile"}];
  const rideTabs=[{id:"ride",icon:"🏍️",lbl:"Ride"},{id:"earnings",icon:"💰",lbl:"Earnings"},{id:"history",icon:"📋",lbl:"History"},{id:"profile",icon:"👤",lbl:"Profile"}];
  const admTabs =[{id:"dash",icon:"📊",lbl:"Overview"},{id:"riders",icon:"🏍️",lbl:"Riders"},{id:"orders",icon:"📦",lbl:"Orders"},{id:"fares",icon:"💰",lbl:"Fares"}];
  const tabs=user.type==="admin"?admTabs:user.type==="rider"?rideTabs:custTabs;

  const unread=db.notifications.filter(n=>!n.read).length;

  return(
    <Frame>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
      <div style={{flex:1,overflowY:"auto",paddingBottom:84}}>
        {/* CUSTOMER */}
        {user.type==="customer"&&tab==="home"    &&<CustomerHome    user={user} db={db} dispatch={dispatch} pop={fireToast} setTab={setTab}/>}
        {user.type==="customer"&&tab==="track"   &&<TrackScreen     db={db}/>}
        {user.type==="customer"&&tab==="history" &&<OrderHistory    db={db} userId={user.id}/>}
        {user.type==="customer"&&tab==="profile" &&<ProfileScreen   user={user} dispatch={dispatch} pop={fireToast} setScreen={setScreen} unread={unread}/>}
        {/* RIDER */}
        {user.type==="rider"   &&tab==="ride"    &&<RiderHome       user={user} db={db} dispatch={dispatch} pop={fireToast}/>}
        {user.type==="rider"   &&tab==="earnings"&&<RiderEarnings   user={user} db={db}/>}
        {user.type==="rider"   &&tab==="history" &&<OrderHistory    db={db} riderId={user.id}/>}
        {user.type==="rider"   &&tab==="profile" &&<ProfileScreen   user={user} dispatch={dispatch} pop={fireToast} setScreen={setScreen}/>}
        {/* ADMIN */}
        {user.type==="admin"   &&tab==="dash"    &&<AdminDashboard  db={db}/>}
        {user.type==="admin"   &&tab==="riders"  &&<AdminRiders     db={db} dispatch={dispatch} pop={fireToast}/>}
        {user.type==="admin"   &&tab==="orders"  &&<AdminOrders     db={db} dispatch={dispatch}/>}
        {user.type==="admin"   &&tab==="fares"   &&<AdminFares      db={db} dispatch={dispatch} pop={fireToast}/>}
      </div>
      {/* NAV */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:"#070D18",borderTop:`1px solid ${G.border}`,display:"flex",padding:"10px 0 22px"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:0,position:"relative"}}>
            {(t.id==="ride"||t.id==="riders")
              ? <div style={{width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center"}}><QDLogo size={26} dark={tab===t.id}/></div>
              : <span style={{fontSize:22}}>{t.icon}</span>
            }
            <span style={{fontSize:11,fontWeight:800,color:tab===t.id?G.accent:"#334155"}}>{t.lbl}</span>
            {tab===t.id&&<div style={{width:18,height:3,borderRadius:2,background:G.accent,marginTop:1}}/>}
            {t.id==="profile"&&unread>0&&<div style={{position:"absolute",top:0,right:"20%",width:8,height:8,borderRadius:4,background:G.red,border:"2px solid #070D18"}}/>}
          </button>
        ))}
      </div>
    </Frame>
  );
}

/* ════════════════════════════════════════════════════
   CUSTOMER HOME + BOOKING FLOW
════════════════════════════════════════════════════ */
function CustomerHome({user,db,dispatch,pop,setTab}){
  const [step,setStep]     = useState(0);
  const [city,setCity]     = useState(user.city||"Jos");
  const [from,setFrom]     = useState(null);
  const [to,setTo]         = useState(null);
  const [svc,setSvc]       = useState("Standard");
  const [rider,setRider]   = useState(null);
  const [fares,setFares]   = useState(null);
  const [km,setKm]         = useState(0);
  const [paying,setPaying] = useState(false);
  const [paid,setPaid]     = useState(false);
  const [pct,setPct]       = useState(0);
  const [rx,setRx]         = useState(8);
  const [promo,setPromo]   = useState(0);
  const [cat,setCat]       = useState(0);
  const trackRef           = useRef(null);
  const locs               = LOCATIONS[city]||LOCATIONS.Jos;
  const cityFare           = db.fareConfig[city]||db.fareConfig.Jos;
  const citySurge          = db.surge[city]||db.surge.Jos;
  const onlineRiders       = db.riders.filter(r=>r.city===city&&r.online);

  useEffect(()=>{
    if(paid&&step===4){
      trackRef.current=setInterval(()=>{
        setPct(p=>{if(p>=100){clearInterval(trackRef.current);return 100;}return p+0.7;});
        setRx(x=>Math.min(x+0.5,82));
      },120);
    }
    return()=>clearInterval(trackRef.current);
  },[paid,step]);

  const computeFares=()=>{
    const d=haversineKm(from.lat,from.lng,to.lat,to.lng);
    setKm(d);
    const result={};
    Object.entries(cityFare).forEach(([t,cfg])=>{ if(cfg.enabled) result[t]=calcFare(d,cfg,citySurge); });
    setFares(result);
  };

  const handlePay=()=>{
    setPaying(true);
    setTimeout(()=>{
      const order={
        id:"#QD-"+Math.floor(Math.random()*9000+1000),
        from:from.name,to:to.name,rider:rider.name,city,
        date:"Just now",status:"Delivered",amount:fares[svc],km:km.toFixed(1),userId:user.id
      };
      dispatch({type:"ADD_ORDER",order});
      setPaying(false);setPaid(true);setStep(4);
      pop("Payment confirmed! Rider is on the way 🏍️");
    },1800);
  };

  const reset=()=>{ setStep(0);setFrom(null);setTo(null);setSvc("Standard");setRider(null);setFares(null);setKm(0);setPaying(false);setPaid(false);setPct(0);setRx(8); };

  const PROMOS=[
    {bg:"linear-gradient(135deg,#00D084,#00956A)",emoji:"⚡",title:"Express Delivery",sub:"First order 20% off",tag:"LIMITED"},
    {bg:"linear-gradient(135deg,#6366F1,#4338CA)",emoji:"🎁",title:"Refer & Earn",sub:"₦500 per referral",tag:"NEW"},
    {bg:"linear-gradient(135deg,#F59E0B,#D97706)",emoji:"🏍️",title:"Ride With Us",sub:"Earn ₦80k/month in Jos",tag:"HIRING"},
  ];
  const CATS=[{icon:"📦",lbl:"Package"},{icon:"🍔",lbl:"Food"},{icon:"💊",lbl:"Pharmacy"},{icon:"🛒",lbl:"Groceries"},{icon:"📄",lbl:"Docs"},{icon:"🛍️",lbl:"Shopping"}];

  return(
    <div>
      {paying&&<div style={{position:"fixed",inset:0,zIndex:8888,background:"rgba(3,7,18,.94)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}><div style={{width:80,height:80,borderRadius:24,background:G.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,animation:"pulse 1s infinite"}}>🔒</div><div style={{color:"#fff",fontWeight:800,fontSize:18}}>Processing Payment…</div><div style={{color:G.muted,fontSize:14}}>Secured by Paystack</div><div style={{width:200,height:4,background:"#1E293B",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",background:G.green,borderRadius:4,animation:"load 1.8s linear forwards"}}/></div></div>}

      <div style={{padding:"52px 20px 20px",background:"radial-gradient(ellipse at 50% -10%,#0D2B1E,#030712)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{color:G.muted,fontSize:13}}>Good day 👋</div>
            <div style={{color:"#fff",fontSize:24,fontWeight:900,letterSpacing:-1}}>{user.name.split(" ")[0]}</div>
          </div>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:G.card,border:`1px solid ${G.border}`,borderRadius:20,padding:"7px 14px",cursor:"pointer"}} onClick={()=>{ const cs=["Jos","Abuja","Lagos","Kano"]; setCity(cs[(cs.indexOf(city)+1)%cs.length]); }}>
            <span>{city==="Jos"?"🏔️":city==="Abuja"?"🏛️":city==="Lagos"?"🌊":"🌅"}</span>
            <span style={{color:"#fff",fontWeight:700,fontSize:13}}>{city}</span>
            {(city==="Jos"||city==="Abuja")&&<span style={{background:G.accent+"22",color:G.accent,fontSize:9,fontWeight:800,borderRadius:6,padding:"1px 5px"}}>★</span>}
          </div>
        </div>

        {/* Location inputs */}
        <div style={{background:G.card,borderRadius:18,padding:"4px 6px",border:`1px solid ${G.border}`,marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px",borderBottom:`1px solid ${G.border}`}}>
            <div style={{width:10,height:10,borderRadius:5,background:G.accent,boxShadow:`0 0 8px ${G.accent}`,flexShrink:0}}/>
            <select value={from?.name||""} onChange={e=>{ const l=locs.find(x=>x.name===e.target.value); setFrom(l||null); }} style={{flex:1,background:"none",border:"none",outline:"none",color:from?G.text:G.muted,fontSize:14,fontFamily:"inherit",cursor:"pointer"}}>
              <option value="">Pickup in {city}…</option>
              {locs.map(l=><option key={l.name} value={l.name}>{l.icon} {l.name}</option>)}
            </select>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px"}}>
            <div style={{width:10,height:10,borderRadius:3,background:G.red,flexShrink:0}}/>
            <select value={to?.name||""} onChange={e=>{ const l=locs.find(x=>x.name===e.target.value); setTo(l||null); }} style={{flex:1,background:"none",border:"none",outline:"none",color:to?G.text:G.muted,fontSize:14,fontFamily:"inherit",cursor:"pointer"}}>
              <option value="">Drop-off location…</option>
              {locs.filter(l=>l.name!==from?.name).map(l=><option key={l.name} value={l.name}>{l.icon} {l.name}</option>)}
            </select>
          </div>
        </div>

        <PBtn onClick={()=>{ if(from&&to){computeFares();setStep(1);}else pop("Select both locations","err"); }}>
          🏍️ Find a Rider in {city}
        </PBtn>
      </div>

      <div style={{padding:"16px 20px 32px"}}>

        {/* STEP 0 — Home content */}
        {step===0&&(<>
          {/* Categories */}
          <div style={{marginBottom:24}}>
            <div style={{color:"#fff",fontWeight:800,fontSize:15,marginBottom:12}}>What are you sending?</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
              {CATS.map((c,i)=>(
                <div key={c.lbl} onClick={()=>setCat(i)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,background:cat===i?"#0D2B1E":G.card,border:`1.5px solid ${cat===i?G.accent:G.border}`,borderRadius:14,padding:"11px 4px",cursor:"pointer"}}>
                  <span style={{fontSize:20}}>{c.icon}</span>
                  <span style={{color:cat===i?G.accent:G.muted,fontSize:9,fontWeight:700}}>{c.lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Promo banner */}
          <div style={{marginBottom:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{color:"#fff",fontWeight:800,fontSize:15}}>Offers for you</div>
              <div style={{display:"flex",gap:5}}>{PROMOS.map((_,i)=><div key={i} onClick={()=>setPromo(i)} style={{width:promo===i?18:5,height:5,borderRadius:3,background:promo===i?G.accent:G.border,cursor:"pointer",transition:"width .3s"}}/>)}</div>
            </div>
            <div style={{borderRadius:20,background:PROMOS[promo].bg,padding:"22px",position:"relative",cursor:"pointer"}} onClick={()=>pop("Offer claimed! ✅")}>
              <div style={{position:"absolute",top:-20,right:-10,fontSize:86,opacity:.12}}>{PROMOS[promo].emoji}</div>
              <div style={{background:"rgba(255,255,255,.2)",borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:900,color:"#fff",display:"inline-block",marginBottom:8}}>{PROMOS[promo].tag}</div>
              <div style={{color:"#fff",fontSize:20,fontWeight:900,marginBottom:3}}>{PROMOS[promo].emoji} {PROMOS[promo].title}</div>
              <div style={{color:"rgba(255,255,255,.8)",fontSize:13}}>{PROMOS[promo].sub}</div>
            </div>
          </div>

          {/* Popular spots */}
          <div style={{marginBottom:24}}>
            <div style={{color:"#fff",fontWeight:800,fontSize:15,marginBottom:12}}>📌 Popular in {city}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {locs.slice(0,6).map(l=>(
                <div key={l.name} onClick={()=>setTo(l)} style={{background:to?.name===l.name?"#0D2B1E":G.card,border:`1px solid ${to?.name===l.name?G.accent:G.border}`,borderRadius:14,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:18}}>{l.icon}</span>
                    <span style={{color:"#CBD5E1",fontSize:13,fontWeight:600}}>{l.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent order */}
          {db.orders.filter(o=>o.userId===user.id).length>0&&(<>
            <div style={{color:"#fff",fontWeight:800,fontSize:15,marginBottom:12}}>🕒 Recent Order</div>
            <Card style={{marginBottom:8}}>
              {(()=>{const o=db.orders.find(x=>x.userId===user.id);return o&&(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div style={{color:"#fff",fontWeight:800}}>{o.id}</div><Pill s={o.status}/></div>
                  <div style={{display:"flex",gap:8,marginBottom:12}}>
                    <div style={{flex:1,background:G.card2,borderRadius:10,padding:"9px 12px"}}><div style={{color:"#475569",fontSize:10,fontWeight:700}}>FROM</div><div style={{color:"#CBD5E1",fontSize:13,fontWeight:600}}>{o.from}</div></div>
                    <div style={{color:"#334155",alignSelf:"center"}}>→</div>
                    <div style={{flex:1,background:G.card2,borderRadius:10,padding:"9px 12px"}}><div style={{color:"#475569",fontSize:10,fontWeight:700}}>TO</div><div style={{color:"#CBD5E1",fontSize:13,fontWeight:600}}>{o.to}</div></div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${G.border}`}}>
                    <div style={{color:G.muted,fontSize:12}}>🏍️ {o.rider}</div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <div style={{color:G.accent,fontWeight:900,fontSize:15}}>{N(o.amount)}</div>
                      <button onClick={()=>{const l=locs.find(x=>x.name===o.to);if(l)setTo(l);pop("Drop-off set! Now select pickup.");}} style={{background:G.green,border:"none",borderRadius:10,padding:"7px 14px",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Reorder</button>
                    </div>
                  </div>
                </>
              );})()}
            </Card>
          </>)}

          {/* Nearby riders */}
          <div style={{marginTop:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{color:"#fff",fontWeight:800,fontSize:15}}>🏍️ Riders Nearby</div>
              <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:7,height:7,borderRadius:4,background:G.accent,boxShadow:`0 0 6px ${G.accent}`}}/><span style={{color:G.accent,fontSize:12,fontWeight:700}}>{onlineRiders.length} online</span></div>
            </div>
            {onlineRiders.slice(0,3).map(r=>(
              <Card key={r.id} style={{marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
                <Avatar t={r.avatar}/>
                <div style={{flex:1}}><div style={{color:"#fff",fontWeight:700}}>{r.name}</div><div style={{color:G.muted,fontSize:12}}>{r.bike}</div></div>
                <div style={{textAlign:"right"}}><div style={{color:G.yellow,fontSize:13,fontWeight:700}}>⭐{r.rating}</div><div style={{color:G.accent,fontSize:12}}>{r.id==="r1"?"3 mins":r.id==="r2"?"5 mins":"7 mins"}</div></div>
              </Card>
            ))}
          </div>
        </>)}

        {/* STEP 1 — Fare */}
        {step===1&&fares&&(
          <Card>
            <Back onClick={()=>setStep(0)}/>
            <div style={{color:"#fff",fontWeight:800,fontSize:17,marginBottom:4}}>💰 Choose Service</div>
            <div style={{color:G.muted,fontSize:13,marginBottom:4}}>{from?.name} → {to?.name}</div>
            <div style={{color:G.accent,fontSize:12,fontWeight:700,marginBottom:16}}>📏 Distance: {km.toFixed(1)} km</div>
            {citySurge.enabled&&<div style={{background:G.yellow+"22",borderRadius:12,padding:"8px 14px",marginBottom:12,color:G.yellow,fontSize:12,fontWeight:700}}>⚡ Surge pricing active ({citySurge.multiplier}x) • {citySurge.hours}</div>}
            {Object.entries(fares).map(([t,price])=>(
              <div key={t} onClick={()=>{setSvc(t);setStep(2);}} style={{background:svc===t?"#0D2B1E":G.card2,borderRadius:14,padding:"15px",marginBottom:10,border:`1.5px solid ${svc===t?G.accent:G.border}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{color:"#fff",fontWeight:800,fontSize:15}}>{SVC_META[t].icon} {t}</div><div style={{color:G.muted,fontSize:12,marginTop:2}}>{t==="Standard"?"15–20 mins":t==="Express"?"8–12 mins":"20–25 mins"}</div><div style={{color:G.muted,fontSize:11,marginTop:2}}>{N(db.fareConfig[city]?.[t]?.base||300)} base + {N(db.fareConfig[city]?.[t]?.perKm||120)}/km</div></div>
                <div style={{textAlign:"right"}}><div style={{color:SVC_META[t].color,fontWeight:900,fontSize:24}}>{N(price)}</div>{citySurge.enabled&&<div style={{color:G.muted,fontSize:10,textDecoration:"line-through"}}>{N(Math.round(price/citySurge.multiplier/50)*50)}</div>}</div>
              </div>
            ))}
          </Card>
        )}

        {/* STEP 2 — Pick Rider */}
        {step===2&&(
          <Card>
            <Back onClick={()=>setStep(1)}/>
            <div style={{color:"#fff",fontWeight:800,fontSize:17,marginBottom:16}}>🏍️ Choose Rider</div>
            {onlineRiders.length===0&&<div style={{textAlign:"center",padding:40,color:G.muted}}>No riders available in {city} right now</div>}
            {onlineRiders.map(r=>(
              <div key={r.id} onClick={()=>setRider(r)} style={{background:rider?.id===r.id?"#0D2B1E":G.card2,borderRadius:14,padding:"14px",marginBottom:10,border:`1.5px solid ${rider?.id===r.id?G.accent:G.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                <Avatar t={r.avatar}/>
                <div style={{flex:1}}><div style={{color:"#fff",fontWeight:700,fontSize:15}}>{r.name}</div><div style={{color:G.muted,fontSize:12}}>{r.bike} • {r.plate}</div></div>
                <div style={{textAlign:"right"}}><div style={{color:G.yellow,fontWeight:700}}>⭐{r.rating}</div><div style={{color:G.accent,fontSize:12}}>{r.id==="r1"?"3 mins":r.id==="r2"?"5 mins":"7 mins"}</div></div>
              </div>
            ))}
            <PBtn style={{marginTop:8}} onClick={()=>rider?setStep(3):pop("Select a rider","err")}>Continue →</PBtn>
          </Card>
        )}

        {/* STEP 3 — Payment */}
        {step===3&&(
          <Card>
            <Back onClick={()=>setStep(2)}/>
            <div style={{color:"#fff",fontWeight:800,fontSize:17,marginBottom:16}}>💳 Confirm & Pay</div>
            <div style={{background:G.card2,borderRadius:14,padding:16,marginBottom:16}}>
              {[["Pickup",from?.name],["Drop-off",to?.name],["Service",`${SVC_META[svc].icon} ${svc}`],["Rider",rider?.name],["Distance",`${km.toFixed(1)} km`]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:9}}><span style={{color:G.muted,fontSize:13}}>{k}</span><span style={{color:"#CBD5E1",fontSize:13,fontWeight:600,textAlign:"right",maxWidth:"55%"}}>{v}</span></div>
              ))}
              <div style={{borderTop:`1px solid ${G.border}`,paddingTop:12,marginTop:4,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:"#94A3B8",fontWeight:700}}>Total</span>
                <span style={{color:G.accent,fontWeight:900,fontSize:26}}>{N(fares?.[svc])}</span>
              </div>
            </div>
            <div onClick={handlePay} style={{background:G.green,borderRadius:16,padding:"18px",cursor:"pointer",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:12,boxShadow:"0 8px 24px rgba(0,208,132,.3)"}}>
              <div style={{background:"rgba(255,255,255,.2)",borderRadius:10,padding:"6px 10px",fontSize:20}}>🔒</div>
              <div><div style={{color:"#fff",fontWeight:900,fontSize:16}}>Pay with Paystack</div><div style={{color:"rgba(255,255,255,.7)",fontSize:12}}>Card • Bank Transfer • USSD</div></div>
            </div>
            <div style={{color:"#334155",fontSize:11,textAlign:"center"}}>256-bit SSL • PCI DSS Compliant</div>
          </Card>
        )}

        {/* STEP 4 — Live Tracking */}
        {step===4&&paid&&(
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div style={{color:G.accent,fontWeight:800,fontSize:16}}>🏍️ Rider En Route!</div>
              <div style={{background:G.accent+"22",color:G.accent,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:800}}>{pct<100?`~${Math.ceil((100-pct)/8)} min`:"Arrived! 🎉"}</div>
            </div>
            <div style={{color:G.muted,fontSize:13,marginBottom:16}}>{rider?.name} heading to {from?.name}</div>
            {/* Map */}
            <div style={{background:"#070F1C",borderRadius:16,height:190,position:"relative",overflow:"hidden",marginBottom:14,border:`1px solid ${G.border}`}}>
              {[...Array(8)].map((_,i)=><div key={i} style={{position:"absolute",left:`${i*14.5}%`,top:0,bottom:0,borderLeft:"1px solid #0D1F35"}}/>)}
              {[...Array(6)].map((_,i)=><div key={i} style={{position:"absolute",top:`${i*19}%`,left:0,right:0,borderTop:"1px solid #0D1F35"}}/>)}
              <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
                <path d="M 36 155 C 120 60 230 40 360 105" stroke={`${G.accent}50`} strokeWidth="3" fill="none" strokeDasharray="10,6"/>
              </svg>
              <div style={{position:"absolute",left:"7%",top:"72%",transform:"translate(-50%,-50%)"}}><div style={{width:14,height:14,borderRadius:7,background:G.accent,boxShadow:`0 0 16px ${G.accent}`}}/></div>
              <div style={{position:"absolute",right:"4%",top:"44%",transform:"translate(50%,-50%)",fontSize:22}}>📍</div>
              <div style={{position:"absolute",left:`${rx}%`,top:"54%",transform:"translate(-50%,-50%)",fontSize:26,transition:"left .25s",filter:`drop-shadow(0 2px 8px ${G.accent}80)`}}>🏍️</div>
              <div style={{position:"absolute",top:10,right:10,background:G.accent,color:"#fff",borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:800}}>{pct<100?`~${Math.ceil((100-pct)/8)}min`:"Here!"}</div>
            </div>
            <div style={{background:"#1E293B",borderRadius:6,height:6,marginBottom:14}}><div style={{background:G.green,height:"100%",borderRadius:6,width:`${pct}%`,transition:"width .25s"}}/></div>
            <div style={{background:G.card2,borderRadius:14,padding:"13px",display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <Avatar t={rider?.avatar}/>
              <div style={{flex:1}}><div style={{color:"#fff",fontWeight:700}}>{rider?.name}</div><div style={{color:G.muted,fontSize:12}}>{rider?.plate} • ⭐{rider?.rating}</div></div>
              <button style={{background:G.accent,border:"none",borderRadius:10,padding:"9px 13px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:16}}>📞</button>
              <button style={{background:"#1E293B",border:"none",borderRadius:10,padding:"9px 13px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:16}}>💬</button>
            </div>
            {pct>=100&&<PBtn onClick={()=>{reset();pop("Package delivered! ⭐ Rate your rider");}}>✅ Delivery Complete!</PBtn>}
          </Card>
        )}
      </div>
      <style>{`@keyframes load{from{width:0}to{width:100%}}`}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   TRACK SCREEN
════════════════════════════════════════════════════ */
function TrackScreen({db}){
  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{color:"#fff",fontSize:22,fontWeight:900,marginBottom:20}}>📍 Live Tracking</div>
      <div style={{textAlign:"center",paddingTop:60}}>
        <div style={{fontSize:70,marginBottom:14}}>📦</div>
        <div style={{color:"#fff",fontWeight:800,fontSize:18}}>No Active Delivery</div>
        <div style={{color:G.muted,fontSize:14,marginTop:6}}>Book a rider from the Home tab to track in real time</div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   ORDER HISTORY
════════════════════════════════════════════════════ */
function OrderHistory({db,userId,riderId}){
  const orders=userId?db.orders.filter(o=>o.userId===userId):db.orders;
  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{color:"#fff",fontSize:22,fontWeight:900,marginBottom:20}}>📋 Order History</div>
      {orders.length===0&&<div style={{textAlign:"center",paddingTop:60,color:G.muted}}>No orders yet</div>}
      {orders.map(o=>(
        <Card key={o.id} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div><div style={{color:"#fff",fontWeight:800}}>{o.id}</div><div style={{color:G.muted,fontSize:12,marginTop:2}}>{o.date}</div></div><Pill s={o.status}/></div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <div style={{flex:1,background:G.card2,borderRadius:10,padding:"9px 12px"}}><div style={{color:"#475569",fontSize:10,fontWeight:700}}>FROM</div><div style={{color:"#CBD5E1",fontSize:13,fontWeight:600}}>{o.from}</div></div>
            <div style={{color:"#334155",alignSelf:"center"}}>→</div>
            <div style={{flex:1,background:G.card2,borderRadius:10,padding:"9px 12px"}}><div style={{color:"#475569",fontSize:10,fontWeight:700}}>TO</div><div style={{color:"#CBD5E1",fontSize:13,fontWeight:600}}>{o.to}</div></div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:`1px solid ${G.border}`}}>
            <div style={{color:G.muted,fontSize:12}}>🏍️ {o.rider} {o.km&&`• ${o.km}km`}</div>
            <div style={{color:G.accent,fontWeight:900,fontSize:15}}>{N(o.amount)}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   PROFILE
════════════════════════════════════════════════════ */
function ProfileScreen({user,dispatch,pop,setScreen,unread=0}){
  const markRead=()=>{ dispatch({type:"READ_NOTIFS"}); pop("All notifications marked as read"); };
  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{background:"radial-gradient(ellipse at 50% 0%,#0D2B1E,#030712)",borderRadius:24,padding:"28px 20px",textAlign:"center",marginBottom:20,border:`1px solid ${G.border}`}}>
        <div style={{width:72,height:72,borderRadius:36,background:G.green,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:30,boxShadow:"0 0 40px rgba(0,208,132,.3)"}}>{user.name?.[0]||"👤"}</div>
        <div style={{color:"#fff",fontSize:20,fontWeight:900}}>{user.name}</div>
        <div style={{color:G.muted,fontSize:13,marginTop:3}}>{user.email||user.phone}</div>
        <div style={{color:G.accent,fontSize:12,marginTop:4}}>{user.city} • {user.type==="rider"?`${user.trips||0} trips`:user.type==="admin"?"Administrator":`${user.orders||0} orders`}</div>
      </div>
      {[["🔔",`Notifications${unread>0?` (${unread} new)`:""}`,markRead],["📍","Saved Addresses",null],["💳","Payment Methods",null],["🛡️","Safety & Support",null],["⚙️","Settings",null]].map(([ic,lbl,fn])=>(
        <div key={lbl} onClick={fn||undefined} style={{background:G.card,borderRadius:14,padding:"15px",marginBottom:10,display:"flex",alignItems:"center",border:`1px solid ${G.border}`,cursor:"pointer"}}>
          <span style={{fontSize:20,marginRight:12}}>{ic}</span>
          <span style={{color:"#CBD5E1",fontSize:15,fontWeight:600,flex:1}}>{lbl}</span>
          {lbl.includes("new")&&<div style={{background:G.red,color:"#fff",borderRadius:10,padding:"2px 8px",fontSize:11,fontWeight:800,marginRight:8}}>{unread}</div>}
          <span style={{color:"#334155",fontSize:18}}>›</span>
        </div>
      ))}
      <GBtn danger onClick={()=>setScreen("onboard")} style={{marginTop:8}}>Sign Out</GBtn>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   RIDER HOME
════════════════════════════════════════════════════ */
function RiderHome({user,db,dispatch,pop}){
  const [online,setOnline]       = useState(user.online||false);
  const [incoming,setIncoming]   = useState(null);
  const [accepted,setAccepted]   = useState(null);
  const inTimer                  = useRef(null);

  useEffect(()=>{
    if(online&&!incoming&&!accepted){
      inTimer.current=setTimeout(()=>setIncoming({id:"#QD-"+Math.floor(Math.random()*9000+1000),from:"Terminus Market",to:"Rayfield",amount:800,km:3.2,city:user.city||"Jos"}),4000);
    }
    return()=>clearTimeout(inTimer.current);
  },[online,incoming,accepted]);

  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><div style={{color:G.muted,fontSize:13}}>Welcome back 🏍️</div><div style={{color:"#fff",fontSize:22,fontWeight:900,letterSpacing:-1}}>{user.name.split(" ")[0]}</div></div>
        <div onClick={()=>{setOnline(o=>!o);dispatch({type:"TOGGLE_RIDER",id:user.id});if(online){setIncoming(null);setAccepted(null);}}} style={{background:online?G.green:"#1E293B",borderRadius:30,padding:"9px 18px",cursor:"pointer",color:"#fff",fontWeight:800,fontSize:14,boxShadow:online?"0 4px 20px rgba(0,208,132,.3)":"none",transition:"all .3s"}}>
          {online?"🟢 Online":"⚫ Offline"}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
        {[["💰","₦8,400","Today"],["📦","7","Trips"],["⭐",user.rating||"5.0","Rating"]].map(([ic,v,l])=>(
          <Card key={l} style={{padding:"14px 10px",textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:6}}>{ic}</div>
            <div style={{color:G.accent,fontWeight:900,fontSize:17}}>{v}</div>
            <div style={{color:G.muted,fontSize:11,marginTop:2}}>{l}</div>
          </Card>
        ))}
      </div>

      {online&&incoming&&!accepted&&(
        <Card style={{border:`2px solid ${G.accent}`,background:"linear-gradient(135deg,#0D2B1E,#0F1724)",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:10,height:10,borderRadius:5,background:G.accent,animation:"ping 1s infinite"}}/><div style={{color:G.accent,fontWeight:800,fontSize:15}}>New Order!</div></div>
            <div style={{color:G.yellow,fontWeight:900,fontSize:20}}>{N(incoming.amount)}</div>
          </div>
          <div style={{background:G.card2,borderRadius:12,padding:"12px 14px",marginBottom:14}}>
            <div style={{color:G.muted,fontSize:12,marginBottom:3}}>📍 Pickup</div>
            <div style={{color:"#CBD5E1",fontWeight:600,marginBottom:8}}>{incoming.from}</div>
            <div style={{color:G.muted,fontSize:12,marginBottom:3}}>🎯 Drop-off</div>
            <div style={{color:"#CBD5E1",fontWeight:600}}>{incoming.to}</div>
            <div style={{color:G.accent,fontSize:12,marginTop:8,fontWeight:700}}>📏 {incoming.km}km • Est. 15–20 mins</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{setAccepted(incoming);setIncoming(null);pop("Order accepted! Head to pickup 🏍️");}} style={{flex:1,padding:13,borderRadius:14,border:"none",background:G.green,color:"#fff",fontWeight:800,cursor:"pointer",fontSize:15,fontFamily:"inherit"}}>✅ Accept</button>
            <button onClick={()=>{setIncoming(null);pop("Order declined","err");}} style={{flex:1,padding:13,borderRadius:14,border:"none",background:"#1E293B",color:G.red,fontWeight:800,cursor:"pointer",fontSize:15,fontFamily:"inherit"}}>✕ Decline</button>
          </div>
        </Card>
      )}

      {accepted&&(
        <Card style={{border:`1px solid ${G.accent}`,marginBottom:16}}>
          <div style={{color:G.accent,fontWeight:800,fontSize:15,marginBottom:10}}>🏍️ Active Delivery</div>
          <div style={{color:"#CBD5E1",fontSize:14,marginBottom:4}}>📍 {accepted.from} → {accepted.to}</div>
          <div style={{color:G.accent,fontSize:13,fontWeight:700,marginBottom:14}}>{N(accepted.amount)} • {accepted.km}km</div>
          <PBtn onClick={()=>{setAccepted(null);pop("Delivery completed! ₦"+accepted.amount+" earned 💰");}}>✅ Mark as Delivered</PBtn>
        </Card>
      )}

      {online&&!incoming&&!accepted&&(
        <Card style={{textAlign:"center",padding:"36px 20px"}}>
          <div style={{fontSize:46,marginBottom:12,animation:"spin 3s linear infinite"}}>🔄</div>
          <div style={{color:"#fff",fontWeight:800,fontSize:17}}>Looking for orders…</div>
          <div style={{color:G.muted,fontSize:13,marginTop:5}}>A new order will appear in ~4 seconds</div>
        </Card>
      )}

      {!online&&(
        <Card style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:60,marginBottom:12}}>😴</div>
          <div style={{color:"#fff",fontWeight:800,fontSize:18}}>You're Offline</div>
          <div style={{color:G.muted,fontSize:13,marginTop:5}}>Go online to start earning</div>
          <PBtn style={{marginTop:16}} onClick={()=>{setOnline(true);dispatch({type:"TOGGLE_RIDER",id:user.id});}}>Go Online</PBtn>
        </Card>
      )}
      <style>{`@keyframes ping{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:0;transform:scale(1.8)}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   RIDER EARNINGS
════════════════════════════════════════════════════ */
function RiderEarnings({user,db}){
  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{color:"#fff",fontSize:22,fontWeight:900,marginBottom:20}}>💰 Earnings</div>
      <div style={{background:G.green,borderRadius:22,padding:"26px 22px",marginBottom:20,textAlign:"center",boxShadow:"0 8px 36px rgba(0,208,132,.28)"}}>
        <div style={{color:"rgba(255,255,255,.75)",fontSize:13}}>This Week</div>
        <div style={{color:"#fff",fontSize:42,fontWeight:900,letterSpacing:-2}}>₦42,800</div>
        <div style={{color:"rgba(255,255,255,.7)",fontSize:13,marginTop:3}}>38 deliveries completed</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
        {[["Cash","₦28,400"],["Transfer","₦14,400"]].map(([l,v])=>(
          <Card key={l} style={{textAlign:"center",padding:"14px"}}><div style={{color:G.muted,fontSize:12,marginBottom:5}}>{l}</div><div style={{color:G.accent,fontWeight:900,fontSize:17}}>{v}</div></Card>
        ))}
      </div>
      {[["Today","₦8,400",7],["Yesterday","₦11,200",9],["Monday","₦9,800",8],["Sunday","₦7,600",6]].map(([d,a,c])=>(
        <Card key={d} style={{marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{color:"#CBD5E1",fontWeight:700}}>{d}</div><div style={{color:G.muted,fontSize:12,marginTop:2}}>{c} deliveries</div></div>
          <div style={{color:G.accent,fontWeight:900,fontSize:18}}>{a}</div>
        </Card>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   ADMIN DASHBOARD
════════════════════════════════════════════════════ */
function AdminDashboard({db}){
  const totalRevenue = db.orders.filter(o=>o.status==="Delivered").reduce((s,o)=>s+o.amount,0);
  const totalOrders  = db.orders.length;
  const onlineRiders = db.riders.filter(r=>r.online).length;
  const pending      = db.riderApplications.filter(a=>a.status==="Pending").length;
  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{color:"#fff",fontSize:22,fontWeight:900}}>📊 Dashboard</div>
      <div style={{color:G.muted,fontSize:13,marginBottom:20}}>QuickDrop Operations — Jos & Abuja</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {[["💰",N(totalRevenue),"Revenue","All time"],["🏍️",`${onlineRiders}/${db.riders.length}`,"Riders","Online now"],["📦",totalOrders,"Orders","All time"],["⏳",pending,"Pending","Applications"]].map(([ic,v,l,s])=>(
          <Card key={l} style={{padding:"16px 14px"}}>
            <div style={{fontSize:26,marginBottom:8}}>{ic}</div>
            <div style={{color:G.accent,fontWeight:900,fontSize:20}}>{v}</div>
            <div style={{color:"#CBD5E1",fontSize:13,fontWeight:700}}>{l}</div>
            <div style={{color:G.muted,fontSize:11,marginTop:2}}>{s}</div>
          </Card>
        ))}
      </div>
      <Card style={{marginBottom:16}}>
        <div style={{color:"#fff",fontWeight:800,marginBottom:14}}>📈 Revenue (Last 7 Days)</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:6,height:80}}>
          {[35,58,42,75,50,88,65].map((h,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
              <div style={{width:"100%",height:`${h}%`,background:i===5?G.green:`${G.accent}40`,borderRadius:"5px 5px 0 0"}}/>
              <div style={{color:G.muted,fontSize:10,fontWeight:700}}>{"MTWTFSS"[i]}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{color:"#fff",fontWeight:800,marginBottom:12}}>🔴 Live Activity</div>
        {[...db.orders.slice(0,3).map(o=>({dot:G.accent,msg:`Order ${o.id} — ${o.from} → ${o.to}`,time:o.date})),...db.changelog.slice(0,2).map(c=>({dot:G.yellow,msg:c.action,time:c.time}))].map((a,i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:10}}>
            <div style={{width:8,height:8,borderRadius:4,background:a.dot,marginTop:4,flexShrink:0,boxShadow:`0 0 6px ${a.dot}`}}/>
            <div><div style={{color:"#CBD5E1",fontSize:13}}>{a.msg}</div><div style={{color:"#334155",fontSize:11,marginTop:1}}>{a.time}</div></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   ADMIN RIDERS
════════════════════════════════════════════════════ */
function AdminRiders({db,dispatch,pop}){
  const [tab,setTab]=useState("active");
  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{color:"#fff",fontSize:22,fontWeight:900,marginBottom:16}}>🏍️ Riders</div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[["active","Active"],["applications","Applications"]].map(([id,lbl])=>(
          <div key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"10px",borderRadius:14,textAlign:"center",cursor:"pointer",background:tab===id?"#0D2B1E":G.card2,border:`1.5px solid ${tab===id?G.accent:G.border}`,color:tab===id?G.accent:G.muted,fontWeight:700,fontSize:13}}>
            {lbl} {id==="applications"&&db.riderApplications.length>0&&<span style={{background:G.accent,color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10,marginLeft:4}}>{db.riderApplications.length}</span>}
          </div>
        ))}
      </div>
      {tab==="active"&&db.riders.map(r=>(
        <Card key={r.id} style={{marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <Avatar t={r.avatar}/>
            <div style={{flex:1}}><div style={{color:"#fff",fontWeight:700}}>{r.name}</div><div style={{color:G.muted,fontSize:12}}>{r.bike} • {r.plate} • {r.city}</div></div>
            <div style={{background:r.online?G.accent+"22":"#1E293B",color:r.online?G.accent:G.muted,borderRadius:20,padding:"4px 10px",fontSize:12,fontWeight:800}}>{r.online?"Online":"Offline"}</div>
          </div>
          <div style={{display:"flex",gap:14,paddingTop:10,borderTop:`1px solid ${G.border}`,alignItems:"center"}}>
            <div style={{textAlign:"center"}}><div style={{color:G.accent,fontWeight:800}}>{r.trips}</div><div style={{color:G.muted,fontSize:10}}>Trips</div></div>
            <div style={{textAlign:"center"}}><div style={{color:G.yellow,fontWeight:800}}>⭐{r.rating}</div><div style={{color:G.muted,fontSize:10}}>Rating</div></div>
            <div style={{textAlign:"center"}}><div style={{color:"#CBD5E1",fontWeight:800}}>{N(r.earnings)}</div><div style={{color:G.muted,fontSize:10}}>Earned</div></div>
            <div style={{flex:1,display:"flex",gap:6,justifyContent:"flex-end"}}>
              <button onClick={()=>pop(`${r.name} suspended`,"err")} style={{padding:"6px 12px",borderRadius:10,border:"none",background:"#F8717122",color:G.red,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Suspend</button>
            </div>
          </div>
        </Card>
      ))}
      {tab==="applications"&&(
        db.riderApplications.length===0
          ? <div style={{textAlign:"center",paddingTop:60,color:G.muted}}>No pending applications</div>
          : db.riderApplications.map(a=>(
            <Card key={a.id} style={{marginBottom:12}}>
              <div style={{color:"#fff",fontWeight:700,marginBottom:4}}>{a.name}</div>
              <div style={{color:G.muted,fontSize:12,marginBottom:4}}>{a.phone} • {a.email}</div>
              <div style={{color:G.muted,fontSize:12,marginBottom:10}}>{a.bike} • {a.plate} • {a.city}</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>pop(`${a.name} approved ✅`)} style={{flex:1,padding:"9px",borderRadius:10,border:"none",background:G.green,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Approve</button>
                <button onClick={()=>pop(`${a.name} rejected`,"err")} style={{flex:1,padding:"9px",borderRadius:10,border:"none",background:"#1E293B",color:G.red,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Reject</button>
              </div>
            </Card>
          ))
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   ADMIN ORDERS
════════════════════════════════════════════════════ */
function AdminOrders({db,dispatch}){
  const [filter,setFilter]=useState("All");
  const filtered=filter==="All"?db.orders:db.orders.filter(o=>o.status===filter);
  return(
    <div style={{padding:"56px 20px 20px"}}>
      <div style={{color:"#fff",fontSize:22,fontWeight:900,marginBottom:16}}>📦 Orders</div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {["All","Delivered","Cancelled"].map(f=>(
          <div key={f} onClick={()=>setFilter(f)} style={{flex:1,padding:"8px",borderRadius:12,textAlign:"center",cursor:"pointer",background:filter===f?G.card2:G.card,border:`1.5px solid ${filter===f?G.accent:G.border}`,color:filter===f?G.accent:G.muted,fontWeight:700,fontSize:12}}>{f}</div>
        ))}
      </div>
      {filtered.map(o=>(
        <Card key={o.id} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div style={{color:"#fff",fontWeight:800}}>{o.id}</div><Pill s={o.status}/></div>
          <div style={{color:G.muted,fontSize:13,marginBottom:3}}>📍 {o.from} → {o.to}</div>
          <div style={{color:G.muted,fontSize:12,marginBottom:8}}>🏍️ {o.rider} • {o.city} • {o.date}</div>
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:`1px solid ${G.border}`,alignItems:"center"}}>
            <div style={{color:G.muted,fontSize:12}}>{o.km}km</div>
            <div style={{color:G.accent,fontWeight:900,fontSize:15}}>{N(o.amount)}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   ADMIN FARES (full control panel)
════════════════════════════════════════════════════ */
function AdminFares({db,dispatch,pop}){
  const [city,setCity]       = useState("Jos");
  const [tab,setTab]         = useState("rates");
  const [localCfg,setLocal]  = useState(()=>JSON.parse(JSON.stringify(db.fareConfig)));
  const [localSurge,setLS]   = useState(()=>JSON.parse(JSON.stringify(db.surge)));
  const [previewKm,setPK]    = useState(5);
  const [dirty,setDirty]     = useState(false);

  const updRate=(svc,field,val)=>{ setLocal(p=>({...p,[city]:{...p[city],[svc]:{...p[city][svc],[field]:val}}})); setDirty(true); };
  const updSurge=(field,val)=>{ setLS(p=>({...p,[city]:{...p[city],[field]:val}})); setDirty(true); };
  const save=()=>{ dispatch({type:"UPDATE_FARES",city,config:localCfg[city]}); dispatch({type:"UPDATE_SURGE",city,config:localSurge[city]}); setDirty(false); pop(`✅ ${city} rates saved!`); };
  const reset=()=>{ setLocal(JSON.parse(JSON.stringify(db.fareConfig))); setLS(JSON.parse(JSON.stringify(db.surge))); setDirty(false); pop(`↩️ ${city} rates reset`); };

  const cfg=localCfg[city]; const srg=localSurge[city];

  return(
    <div style={{padding:"56px 20px 100px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div><div style={{color:"#fff",fontSize:22,fontWeight:900}}>💰 Fare Control</div><div style={{color:G.muted,fontSize:13}}>Set prices per city</div></div>
        <div style={{background:dirty?G.yellow+"22":"#0D2B1E",color:dirty?G.yellow:G.accent,borderRadius:10,padding:"5px 12px",fontSize:12,fontWeight:800}}>{dirty?"● Unsaved":"✓ Saved"}</div>
      </div>

      {/* City tabs */}
      <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto"}}>
        {Object.keys(localCfg).map(c=>(
          <div key={c} onClick={()=>setCity(c)} style={{flexShrink:0,padding:"7px 14px",borderRadius:20,cursor:"pointer",background:city===c?"#0D2B1E":G.card2,border:`1.5px solid ${city===c?G.accent:G.border}`,color:city===c?G.accent:G.muted,fontWeight:700,fontSize:13}}>
            {c==="Jos"?"🏔️":c==="Abuja"?"🏛️":c==="Lagos"?"🌊":"🌅"} {c}
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${G.border}`,marginBottom:20}}>
        {[["rates","📊 Rates"],["surge","⚡ Surge"],["preview","🧮 Preview"]].map(([id,lbl])=>(
          <div key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"12px 0",textAlign:"center",cursor:"pointer",color:tab===id?G.accent:G.muted,fontWeight:tab===id?800:600,fontSize:12,borderBottom:tab===id?`2px solid ${G.accent}`:"2px solid transparent"}}>{lbl}</div>
        ))}
      </div>

      {/* RATES */}
      {tab==="rates"&&Object.entries(cfg).map(([svc,r])=>(
        <Card key={svc} style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:38,height:38,borderRadius:10,background:SVC_META[svc].color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{SVC_META[svc].icon}</div>
              <div><div style={{color:"#fff",fontWeight:800,fontSize:15}}>{svc}</div><div style={{color:SVC_META[svc].color,fontSize:11}}>{N(r.base)} + {N(r.perKm)}/km</div></div>
            </div>
            <Toggle value={r.enabled} onChange={v=>updRate(svc,"enabled",v)}/>
          </div>
          {r.enabled&&(
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                {[["BASE FARE","base"],["PER KM","perKm"],["MIN FARE","minFare"]].map(([lbl,fld])=>(
                  <div key={fld}>
                    <div style={{color:G.muted,fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:4}}>{lbl}</div>
                    <div style={{display:"flex",alignItems:"center",background:G.card2,borderRadius:10,border:`1px solid ${G.border}`,overflow:"hidden"}}>
                      <span style={{color:G.muted,fontSize:12,padding:"0 8px",borderRight:`1px solid ${G.border}`}}>₦</span>
                      <input type="number" value={r[fld]} onChange={e=>updRate(svc,fld,Number(e.target.value))} style={{flex:1,background:"none",border:"none",outline:"none",color:G.text,fontSize:14,fontWeight:700,padding:"9px 8px",fontFamily:"inherit",width:"100%"}}/>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{background:G.card2,borderRadius:10,padding:"9px 12px",display:"flex",justifyContent:"space-between"}}>
                <span style={{color:G.muted,fontSize:12}}>5km delivery</span>
                <span style={{color:SVC_META[svc].color,fontWeight:900,fontSize:16}}>{N(calcFare(5,r,srg))}</span>
              </div>
            </>
          )}
        </Card>
      ))}

      {/* SURGE */}
      {tab==="surge"&&(
        <Card>
          <Toggle value={srg.enabled} onChange={v=>updSurge("enabled",v)} label="Enable Surge Pricing"/>
          {srg.enabled&&(
            <div style={{marginTop:18}}>
              <div style={{color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:8}}>MULTIPLIER</div>
              <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:6}}>
                <input type="range" min="1.1" max="3.0" step="0.1" value={srg.multiplier} onChange={e=>updSurge("multiplier",parseFloat(e.target.value))} style={{flex:1,accentColor:G.accent}}/>
                <div style={{background:G.card2,borderRadius:10,padding:"7px 14px",minWidth:56,textAlign:"center"}}>
                  <div style={{color:G.accent,fontWeight:900,fontSize:18}}>{srg.multiplier}x</div>
                </div>
              </div>
              <div style={{color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:6,marginTop:16}}>PEAK HOURS</div>
              <input value={srg.hours} onChange={e=>updSurge("hours",e.target.value)} style={{width:"100%",background:G.card2,border:`1px solid ${G.border}`,borderRadius:12,padding:"11px 14px",color:G.text,fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
              <div style={{marginTop:16}}>
                <div style={{color:G.accent,fontWeight:700,fontSize:12,marginBottom:10}}>⚡ Impact at 5km</div>
                {Object.entries(cfg).filter(([,r])=>r.enabled).map(([svc,r])=>{
                  const n=calcFare(5,r,{enabled:false}), s=calcFare(5,r,srg);
                  return(<div key={svc} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{color:G.muted,fontSize:13}}>{SVC_META[svc].icon} {svc}</span>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{color:"#475569",fontSize:11,textDecoration:"line-through"}}>{N(n)}</span><span style={{color:G.yellow,fontWeight:800}}>{N(s)}</span></div>
                  </div>);
                })}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* PREVIEW */}
      {tab==="preview"&&(
        <>
          <Card style={{marginBottom:16}}>
            <div style={{color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:8}}>DISTANCE</div>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <input type="range" min="0.5" max="30" step="0.5" value={previewKm} onChange={e=>setPK(parseFloat(e.target.value))} style={{flex:1,accentColor:G.accent}}/>
              <div style={{background:G.card2,borderRadius:10,padding:"7px 14px",minWidth:64,textAlign:"center"}}><div style={{color:G.accent,fontWeight:900,fontSize:18}}>{previewKm}</div><div style={{color:G.muted,fontSize:10}}>km</div></div>
            </div>
          </Card>
          {Object.entries(cfg).map(([svc,r])=>r.enabled&&(
            <Card key={svc} style={{marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{color:"#fff",fontWeight:700}}>{SVC_META[svc].icon} {svc}</div><div style={{color:G.muted,fontSize:11,marginTop:2}}>{N(r.base)} + {N(r.perKm)}×{previewKm}km</div></div>
              <div style={{textAlign:"right"}}>
                <div style={{color:SVC_META[svc].color,fontWeight:900,fontSize:22}}>{N(calcFare(previewKm,r,{enabled:false}))}</div>
                {srg.enabled&&<div style={{color:G.yellow,fontSize:11,fontWeight:700}}>⚡ {N(calcFare(previewKm,r,srg))} w/ surge</div>}
              </div>
            </Card>
          ))}
          <Card style={{marginTop:8}}>
            <div style={{color:"#fff",fontWeight:800,marginBottom:12,fontSize:14}}>📊 Rate Table</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr"}}>
              {["Km","Std","Exp","Fra"].map(h=><div key={h} style={{color:G.muted,fontSize:11,fontWeight:700,padding:"5px 3px",borderBottom:`1px solid ${G.border}`,textAlign:h==="Km"?"left":"right"}}>{h}</div>)}
              {[1,2,3,5,8,10,15,20].flatMap(km=>[
                <div key={`k${km}`} style={{color:G.muted,fontSize:12,padding:"7px 3px",borderBottom:`1px solid ${G.border}20`}}>{km}km</div>,
                ...["Standard","Express","Fragile"].map(svc=><div key={`${km}${svc}`} style={{color:"#CBD5E1",fontSize:12,fontWeight:600,padding:"7px 3px",textAlign:"right",borderBottom:`1px solid ${G.border}20`}}>{N(calcFare(km,cfg[svc],{enabled:false}))}</div>)
              ])}
            </div>
          </Card>
        </>
      )}

      {/* Save bar */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#070D18",borderTop:`1px solid ${G.border}`,padding:"12px 20px 24px",display:"flex",gap:10}}>
        <button onClick={reset} style={{flex:1,padding:"13px",borderRadius:14,border:`1px solid ${G.border}`,background:"transparent",color:G.muted,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>↩️ Reset</button>
        <button onClick={save} style={{flex:2,padding:"13px",borderRadius:14,border:"none",background:dirty?G.green:"#1E293B",color:dirty?"#fff":G.muted,fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit",boxShadow:dirty?"0 6px 20px rgba(0,208,132,.3)":"none"}}>{dirty?`💾 Save ${city} Rates`:"✓ All Saved"}</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════ */
function StrengthBar({pwd}){
  const s=pwd.length;
  return(<div style={{marginBottom:16}}><div style={{display:"flex",gap:4,marginBottom:4}}>{[1,2,3,4].map(i=><div key={i} style={{flex:1,height:4,borderRadius:2,background:s>=i*3?(s>=10?G.accent:G.yellow):G.border,transition:"background .3s"}}/>)}</div><div style={{color:G.muted,fontSize:11}}>{s<6?"Too short":s<10?"Moderate":"Strong ✓"}</div></div>);
}
function CityPicker({value,onChange}){
  return(<div style={{marginBottom:16}}><div style={{color:G.muted,fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:8}}>CITY</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{[["Jos","🏔️","Flagship"],["Abuja","🏛️","Flagship"],["Lagos","🌊","Active"],["Kano","🌅","Active"]].map(([c,ic,tag])=><div key={c} onClick={()=>onChange(c)} style={{background:value===c?"#0D2B1E":G.card2,border:`1.5px solid ${value===c?G.accent:G.border}`,borderRadius:12,padding:"12px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{ic}</span><div><div style={{color:"#fff",fontWeight:700,fontSize:13}}>{c}</div><div style={{color:value===c?G.accent:G.muted,fontSize:10,fontWeight:700}}>{tag}</div></div></div>)}</div></div>);
}
function Toast({msg,type}){
  return(<div style={{position:"absolute",top:14,left:14,right:14,zIndex:9999,background:type==="err"?"#DC2626":G.accent,color:"#fff",borderRadius:16,padding:"13px 18px",fontWeight:800,fontSize:14,boxShadow:"0 10px 36px rgba(0,0,0,.5)",animation:"sd .3s ease",display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:18}}>{type==="err"?"❌":"✅"}</span>{msg}</div>);
}
function Frame({children,bg}){
  return(<div style={{width:"100%",maxWidth:430,margin:"0 auto",height:"100vh",background:bg||G.dark,fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>{children}<style>{`@keyframes sd{from{transform:translateY(-14px);opacity:0}to{transform:translateY(0);opacity:1}} @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}} *{box-sizing:border-box;-webkit-tap-highlight-color:transparent} input::placeholder{color:#334155} ::-webkit-scrollbar{display:none} select option{background:#0F1724;color:#F1F5F9}`}</style></div>);
}