import { useState, useEffect, useRef, useReducer } from "react";

/* ─── THEME ──────────────────────────────────────── */
const G={green:"linear-gradient(135deg,#00D084,#00956A)",dark:"#030712",card:"#0F1724",card2:"#0A1120",border:"#1E293B",text:"#F1F5F9",muted:"#64748B",accent:"#00D084",red:"#F87171",yellow:"#FBBF24",blue:"#60A5FA",purple:"#A78BFA"};

/* ─── NIGERIA ADDRESSES (Jos, Abuja, Lagos, etc.) ─── */
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
const N=n=>`₦${Number(n).toLocaleString()}`;
const sc=s=>s==="Delivered"?"#22C55E":s==="Cancelled"?G.red:G.yellow;

/* ─── ATOMS (UI COMPONENTS) ───────────────────────── */
const Av=({t,sz=44,color})=>(<div style={{width:sz,height:sz,borderRadius:sz/2,background:color||G.green,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:sz*.3,flexShrink:0}}>{t}</div>);
const Frame=({children,bg})=>(<div style={{width:"100%",maxWidth:430,margin:"0 auto",height:"100vh",background:bg||G.dark,fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>{children}<style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box;-webkit-tap-highlight-color:transparent} ::-webkit-scrollbar{display:none}`}</style></div>);

/* ════════════════════════════════════════════════════
   ROOT APP
════════════════════════════════════════════════════ */
export default function QuickDrop(){
  const [db,dispatch]=useReducer(dbR,DB0);
  const [screen,setSc]=useState("main"); 
  const [authMode,setAM]=useState("login");

  return (
    <Frame>
      <div style={{padding: 20, textAlign: 'center'}}>
        <h1 style={{color: G.accent, fontWeight: 900}}>QUICKDROP</h1>
        <p style={{color: G.muted}}>Welcome back, {db.users[0].name}</p>
        
        <div style={{marginTop: 30}}>
          <h2 style={{color: '#fff', fontSize: 18, textAlign: 'left'}}>Recent Orders</h2>
          {db.orders.map(order => (
            <div key={order.id} style={{background: G.card, padding: 15, borderRadius: 15, marginBottom: 10, border: `1px solid ${G.border}`, textAlign: 'left'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#fff', fontWeight: 800}}>{order.id}</span>
                <span style={{color: G.accent, fontWeight: 800}}>{N(order.amount)}</span>
              </div>
              <div style={{color: G.muted, fontSize: 12, marginTop: 5}}>From: {order.from}</div>
              <div style={{color: G.muted, fontSize: 12}}>To: {order.to}</div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}