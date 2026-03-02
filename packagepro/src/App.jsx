import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const STAGES_LIBRARY = [
  "Design","Plate Making","Printing","Lamination","Die Cutting",
  "Foiling","Embossing","Spot UV","Pasting","Quality Check","Packing","Delivery"
];

const CLIENTS = [
  { id:"CLT-001", name:"Apex Packaging Co.", contact:"Ahmed Raza", phone:"+92-300-1234567", email:"ahmed@apex.com", category:"VIP", balance:45000, creditLimit:200000, jobs:24, status:"Active" },
  { id:"CLT-002", name:"GreenLeaf Foods", contact:"Sara Khan", phone:"+92-321-9876543", email:"sara@greenleaf.com", category:"Regular", balance:12500, creditLimit:80000, jobs:11, status:"Active" },
  { id:"CLT-003", name:"Royal Cosmetics", contact:"Zara Ali", phone:"+92-333-5556677", email:"zara@royalcosmetics.com", category:"VIP", balance:0, creditLimit:300000, jobs:38, status:"Active" },
  { id:"CLT-004", name:"Metro Confections", contact:"Usman Malik", phone:"+92-345-2223344", email:"usman@metro.com", category:"New", balance:8800, creditLimit:50000, jobs:3, status:"Active" },
  { id:"CLT-005", name:"EcoBox Solutions", contact:"Fatima Qureshi", phone:"+92-311-7778899", email:"fatima@ecobox.com", category:"Regular", balance:32000, creditLimit:120000, jobs:15, status:"Inactive" },
];

const STAFF = [
  { id:"STF-001", name:"Ravi Kumar", role:"Designer", dept:"Design", earningType:"Monthly", rate:45000, thisMonth:45000, status:"Active" },
  { id:"STF-002", name:"Kamran Ali", role:"Lamination Operator", dept:"Lamination", earningType:"Per Piece", rate:1.5, thisMonth:28500, status:"Active" },
  { id:"STF-003", name:"Saeed Akhtar", role:"Die Cutting Operator", dept:"Die Cutting", earningType:"Per Hour", rate:180, thisMonth:32400, status:"Active" },
  { id:"STF-004", name:"Tariq Hassan", role:"Printer Operator", dept:"Printing", earningType:"Per Piece", rate:0.8, thisMonth:41600, status:"Active" },
  { id:"STF-005", name:"Nadia Bibi", role:"Pasting Supervisor", dept:"Pasting", earningType:"Per Piece", rate:2, thisMonth:24000, status:"Active" },
  { id:"STF-006", name:"Imran Shaikh", role:"QC Inspector", dept:"Quality Check", earningType:"Monthly", rate:38000, thisMonth:38000, status:"Active" },
];

const MATERIALS = [
  { id:"MAT-001", name:"Art Card 300gsm", category:"Paper/Board", unit:"Sheets", stock:45000, minStock:10000, rate:4.5, value:202500 },
  { id:"MAT-002", name:"Duplex Board 400gsm", category:"Paper/Board", unit:"Sheets", stock:8500, minStock:5000, rate:6.2, value:52700 },
  { id:"MAT-003", name:"Gloss BOPP Lam Roll", category:"Lamination", unit:"Meters", stock:320, minStock:500, rate:85, value:27200 },
  { id:"MAT-004", name:"Matte BOPP Lam Roll", category:"Lamination", unit:"Meters", stock:180, minStock:200, rate:92, value:16560 },
  { id:"MAT-005", name:"Gold Foil Roll", category:"Foil", unit:"Meters", stock:95, minStock:100, rate:220, value:20900 },
  { id:"MAT-006", name:"Hot Melt Glue", category:"Adhesive", unit:"KG", stock:85, minStock:30, rate:350, value:29750 },
  { id:"MAT-007", name:"Kraft Paper 120gsm", category:"Paper/Board", unit:"Sheets", stock:3200, minStock:5000, rate:2.8, value:8960 },
];

const JOBS = [
  {
    id:"PKG-2024-0051", client:"Apex Packaging Co.", clientId:"CLT-001",
    title:"Premium Gift Box with Gold Foiling", product:"Gift Box",
    qty:10000, deadline:"2024-12-28", priority:"Urgent", status:"In Progress",
    pipeline:["Design","Printing","Lamination","Die Cutting","Foiling","Pasting","Quality Check","Packing","Delivery"],
    currentStage:3, revenue:185000, materialCost:62000, operatorCost:28500,
    stages:[
      {name:"Design", operator:"Ravi Kumar", status:"Done", completedAt:"2024-12-18 10:30", qty:10000, notes:"Client approved v3"},
      {name:"Printing", operator:"Tariq Hassan", status:"Done", completedAt:"2024-12-20 16:00", qty:9950, notes:"50 spoilage"},
      {name:"Lamination", operator:"Kamran Ali", status:"Done", completedAt:"2024-12-22 14:30", qty:9950, notes:"Gloss applied"},
      {name:"Die Cutting", operator:"Saeed Akhtar", status:"Active", completedAt:null, qty:0, notes:""},
      {name:"Foiling", operator:"Tariq Hassan", status:"Pending", completedAt:null, qty:0, notes:""},
      {name:"Pasting", operator:"Nadia Bibi", status:"Pending", completedAt:null, qty:0, notes:""},
      {name:"Quality Check", operator:"Imran Shaikh", status:"Pending", completedAt:null, qty:0, notes:""},
      {name:"Packing", operator:"Nadia Bibi", status:"Pending", completedAt:null, qty:0, notes:""},
      {name:"Delivery", operator:"Tariq Hassan", status:"Pending", completedAt:null, qty:0, notes:""},
    ]
  },
  {
    id:"PKG-2024-0052", client:"GreenLeaf Foods", clientId:"CLT-002",
    title:"Eco Kraft Snack Box", product:"Carton Box",
    qty:25000, deadline:"2024-12-30", priority:"Normal", status:"In Progress",
    pipeline:["Design","Printing","Die Cutting","Pasting","Quality Check","Delivery"],
    currentStage:2, revenue:95000, materialCost:38000, operatorCost:14000,
    stages:[
      {name:"Design", operator:"Ravi Kumar", status:"Done", completedAt:"2024-12-19 09:00", qty:25000, notes:""},
      {name:"Printing", operator:"Tariq Hassan", status:"Done", completedAt:"2024-12-21 18:00", qty:24800, notes:"200 spoilage"},
      {name:"Die Cutting", operator:"Saeed Akhtar", status:"Active", completedAt:null, qty:0, notes:""},
      {name:"Pasting", operator:"Nadia Bibi", status:"Pending", completedAt:null, qty:0, notes:""},
      {name:"Quality Check", operator:"Imran Shaikh", status:"Pending", completedAt:null, qty:0, notes:""},
      {name:"Delivery", operator:"Tariq Hassan", status:"Pending", completedAt:null, qty:0, notes:""},
    ]
  },
  {
    id:"PKG-2024-0053", client:"Royal Cosmetics", clientId:"CLT-003",
    title:"Luxury Perfume Box - Matte + Emboss", product:"Luxury Box",
    qty:5000, deadline:"2024-12-25", priority:"Rush", status:"Overdue",
    pipeline:["Design","Plate Making","Printing","Lamination","Die Cutting","Embossing","Pasting","Quality Check","Packing","Delivery"],
    currentStage:5, revenue:320000, materialCost:95000, operatorCost:42000,
    stages:[
      {name:"Design", operator:"Ravi Kumar", status:"Done", completedAt:"2024-12-15 11:00", qty:5000, notes:""},
      {name:"Plate Making", operator:"Tariq Hassan", status:"Done", completedAt:"2024-12-16 15:00", qty:5000, notes:""},
      {name:"Printing", operator:"Tariq Hassan", status:"Done", completedAt:"2024-12-18 17:00", qty:4980, notes:""},
      {name:"Lamination", operator:"Kamran Ali", status:"Done", completedAt:"2024-12-20 12:00", qty:4980, notes:"Matte applied"},
      {name:"Die Cutting", operator:"Saeed Akhtar", status:"Done", completedAt:"2024-12-22 09:00", qty:4950, notes:""},
      {name:"Embossing", operator:"Kamran Ali", status:"Active", completedAt:null, qty:0, notes:""},
      {name:"Pasting", operator:"Nadia Bibi", status:"Pending", completedAt:null, qty:0, notes:""},
      {name:"Quality Check", operator:"Imran Shaikh", status:"Pending", completedAt:null, qty:0, notes:""},
      {name:"Packing", operator:"Nadia Bibi", status:"Pending", completedAt:null, qty:0, notes:""},
      {name:"Delivery", operator:"Tariq Hassan", status:"Pending", completedAt:null, qty:0, notes:""},
    ]
  },
  {
    id:"PKG-2024-0054", client:"Metro Confections", clientId:"CLT-004",
    title:"Candy Wrapper Box Plain Print", product:"Carton Box",
    qty:50000, deadline:"2025-01-05", priority:"Normal", status:"In Progress",
    pipeline:["Design","Printing","Die Cutting","Pasting","Quality Check","Packing","Delivery"],
    currentStage:1, revenue:75000, materialCost:28000, operatorCost:12000,
    stages:[
      {name:"Design", operator:"Ravi Kumar", status:"Active", completedAt:null, qty:0, notes:"Awaiting client approval"},
      {name:"Printing", operator:"Tariq Hassan", status:"Pending", completedAt:null, qty:0, notes:""},
      {name:"Die Cutting", operator:"Saeed Akhtar", status:"Pending", completedAt:null, qty:0, notes:""},
      {name:"Pasting", operator:"Nadia Bibi", status:"Pending", completedAt:null, qty:0, notes:""},
      {name:"Quality Check", operator:"Imran Shaikh", status:"Pending", completedAt:null, qty:0, notes:""},
      {name:"Packing", operator:"Nadia Bibi", status:"Pending", completedAt:null, qty:0, notes:""},
      {name:"Delivery", operator:"Tariq Hassan", status:"Pending", completedAt:null, qty:0, notes:""},
    ]
  },
  {
    id:"PKG-2024-0049", client:"Royal Cosmetics", clientId:"CLT-003",
    title:"Serum Bottle Gift Box", product:"Gift Box",
    qty:8000, deadline:"2024-12-22", priority:"Normal", status:"Delivered",
    pipeline:["Design","Printing","Lamination","Foiling","Die Cutting","Pasting","Quality Check","Delivery"],
    currentStage:8, revenue:145000, materialCost:52000, operatorCost:22000,
    stages:[]
  },
  {
    id:"PKG-2024-0050", client:"EcoBox Solutions", clientId:"CLT-005",
    title:"Organic Tea Packaging Box", product:"Carton Box",
    qty:15000, deadline:"2024-12-26", priority:"Normal", status:"Ready for Delivery",
    pipeline:["Design","Printing","Die Cutting","Pasting","Quality Check","Packing","Delivery"],
    currentStage:7, revenue:68000, materialCost:24000, operatorCost:11000,
    stages:[]
  },
];

const INVOICES = [
  { id:"INV-2024-0088", jobId:"PKG-2024-0049", client:"Royal Cosmetics", amount:145000, paid:145000, status:"Paid", date:"2024-12-22", due:"2024-12-29" },
  { id:"INV-2024-0087", jobId:"PKG-2024-0048", client:"GreenLeaf Foods", amount:88000, paid:44000, status:"Partial", date:"2024-12-18", due:"2024-12-25" },
  { id:"INV-2024-0086", jobId:"PKG-2024-0047", client:"Apex Packaging Co.", amount:210000, paid:0, status:"Overdue", date:"2024-12-10", due:"2024-12-17" },
  { id:"INV-2024-0085", jobId:"PKG-2024-0046", client:"Metro Confections", amount:32000, paid:0, status:"Unpaid", date:"2024-12-20", due:"2025-01-03" },
  { id:"INV-2024-0084", jobId:"PKG-2024-0045", client:"Royal Cosmetics", amount:95000, paid:95000, status:"Paid", date:"2024-12-15", due:"2024-12-22" },
];

const NOTIFICATIONS = [
  { id:1, type:"alert", icon:"⚠️", msg:"PKG-2024-0053 is OVERDUE — Embossing stage delayed", time:"2 min ago", read:false },
  { id:2, type:"stock", icon:"📦", msg:"Gloss BOPP Lamination Roll below minimum stock", time:"15 min ago", read:false },
  { id:3, type:"payment", icon:"💰", msg:"Invoice INV-2024-0086 overdue — Apex Packaging Co.", time:"1 hr ago", read:false },
  { id:4, type:"job", icon:"✅", msg:"PKG-2024-0052 — Die Cutting stage started by Saeed Akhtar", time:"2 hr ago", read:true },
  { id:5, type:"client", icon:"👤", msg:"New order inquiry from Royal Cosmetics via portal", time:"3 hr ago", read:true },
  { id:6, type:"delivery", icon:"🚚", msg:"PKG-2024-0050 is Ready for Delivery", time:"4 hr ago", read:true },
];

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg:        "#0a0e1a",
  bgCard:    "#111827",
  bgCard2:   "#1a2235",
  bgCard3:   "#1f2d3d",
  border:    "#1e2d42",
  border2:   "#253448",
  accent:    "#3b82f6",
  accent2:   "#60a5fa",
  accentGlow:"rgba(59,130,246,0.15)",
  cyan:      "#06b6d4",
  emerald:   "#10b981",
  amber:     "#f59e0b",
  rose:      "#f43f5e",
  violet:    "#8b5cf6",
  text:      "#f1f5f9",
  textMuted: "#64748b",
  textDim:   "#94a3b8",
};

// ─── SHARED MICRO-COMPONENTS ──────────────────────────────────────────────────
const Badge = ({ label, color }) => {
  const map = {
    "VIP":color||"violet","Regular":"cyan","New":"emerald","Inactive":"rose",
    "Active":"emerald","Done":"emerald","Active stage":"accent","Pending":"amber",
    "Overdue":"rose","In Progress":"accent","Delivered":"emerald",
    "Ready for Delivery":"cyan","Rush":"rose","Urgent":"amber","Normal":"textMuted",
    "Paid":"emerald","Partial":"amber","Unpaid":"textMuted",
    "Monthly":"violet","Per Piece":"cyan","Per Hour":"amber",
  };
  const c = map[label] || color || "textMuted";
  const cols = {
    violet:  { bg:"rgba(139,92,246,0.15)", text:"#c4b5fd", border:"rgba(139,92,246,0.3)" },
    cyan:    { bg:"rgba(6,182,212,0.15)",  text:"#67e8f9", border:"rgba(6,182,212,0.3)" },
    emerald: { bg:"rgba(16,185,129,0.15)", text:"#6ee7b7", border:"rgba(16,185,129,0.3)" },
    rose:    { bg:"rgba(244,63,94,0.15)",  text:"#fda4af", border:"rgba(244,63,94,0.3)" },
    amber:   { bg:"rgba(245,158,11,0.15)", text:"#fcd34d", border:"rgba(245,158,11,0.3)" },
    accent:  { bg:"rgba(59,130,246,0.15)", text:"#93c5fd", border:"rgba(59,130,246,0.3)" },
    textMuted:{ bg:"rgba(100,116,139,0.15)",text:"#94a3b8",border:"rgba(100,116,139,0.3)"},
  };
  const s = cols[c] || cols.textMuted;
  return (
    <span style={{
      background:s.bg, color:s.text, border:`1px solid ${s.border}`,
      borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600,
      letterSpacing:"0.03em", whiteSpace:"nowrap"
    }}>{label}</span>
  );
};

const Pill = ({ val, max, color="#3b82f6" }) => {
  const pct = Math.min(100, Math.round((val/max)*100));
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ flex:1, height:6, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:3,
          boxShadow:`0 0 8px ${color}88`, transition:"width 0.6s ease" }} />
      </div>
      <span style={{ fontSize:11, color:T.textDim, minWidth:32 }}>{pct}%</span>
    </div>
  );
};

const Stat = ({ label, value, sub, icon, color="#3b82f6", glow }) => (
  <div style={{
    background:T.bgCard2, border:`1px solid ${T.border}`, borderRadius:14, padding:"20px 22px",
    position:"relative", overflow:"hidden",
    boxShadow: glow ? `0 0 32px ${color}22` : "none",
  }}>
    <div style={{ position:"absolute", top:-20, right:-20, fontSize:64, opacity:0.06 }}>{icon}</div>
    <div style={{ fontSize:11, color:T.textMuted, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8 }}>{label}</div>
    <div style={{ fontSize:28, fontWeight:800, color:color, letterSpacing:"-0.02em", lineHeight:1 }}>{value}</div>
    {sub && <div style={{ fontSize:12, color:T.textDim, marginTop:6 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ title, sub, action, onAction }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20 }}>
    <div>
      <div style={{ fontSize:20, fontWeight:800, color:T.text, letterSpacing:"-0.02em" }}>{title}</div>
      {sub && <div style={{ fontSize:13, color:T.textMuted, marginTop:2 }}>{sub}</div>}
    </div>
    {action && <button onClick={onAction} style={{
      background:T.accentGlow, border:`1px solid ${T.border2}`, color:T.accent2,
      borderRadius:8, padding:"7px 16px", fontSize:13, cursor:"pointer", fontWeight:600,
    }}>{action}</button>}
  </div>
);

const Input = ({ label, placeholder, value, onChange, type="text", style={} }) => (
  <div style={{ marginBottom:16, ...style }}>
    {label && <div style={{ fontSize:12, color:T.textDim, fontWeight:600, marginBottom:6, letterSpacing:"0.04em" }}>{label.toUpperCase()}</div>}
    <input
      type={type} value={value||""} onChange={e=>onChange&&onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width:"100%", background:T.bgCard3, border:`1px solid ${T.border2}`,
        borderRadius:8, padding:"10px 14px", color:T.text, fontSize:14,
        outline:"none", boxSizing:"border-box",
        fontFamily:"inherit",
      }}
    />
  </div>
);

const Select = ({ label, options, value, onChange }) => (
  <div style={{ marginBottom:16 }}>
    {label && <div style={{ fontSize:12, color:T.textDim, fontWeight:600, marginBottom:6, letterSpacing:"0.04em" }}>{label.toUpperCase()}</div>}
    <select value={value||""} onChange={e=>onChange&&onChange(e.target.value)} style={{
      width:"100%", background:T.bgCard3, border:`1px solid ${T.border2}`,
      borderRadius:8, padding:"10px 14px", color:T.text, fontSize:14,
      outline:"none", boxSizing:"border-box", fontFamily:"inherit",
    }}>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Btn = ({ label, onClick, color=T.accent, ghost=false, icon, style={} }) => (
  <button onClick={onClick} style={{
    background: ghost ? "transparent" : color,
    border: `1px solid ${ghost ? T.border2 : color}`,
    color: ghost ? T.textDim : "#fff",
    borderRadius:9, padding:"10px 20px", fontSize:14, fontWeight:700,
    cursor:"pointer", display:"flex", alignItems:"center", gap:6,
    fontFamily:"inherit", transition:"all 0.15s", ...style
  }}>{icon&&<span>{icon}</span>}{label}</button>
);

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const MENU = [
  { id:"dashboard",  icon:"⬡",  label:"Dashboard" },
  { id:"jobs",       icon:"📋", label:"Job Orders" },
  { id:"pipeline",   icon:"⚡", label:"Pipeline View" },
  { id:"production", icon:"🔧", label:"Production" },
  { id:"clients",    icon:"👥", label:"Clients" },
  { id:"staff",      icon:"👤", label:"Staff & Earnings" },
  { id:"stock",      icon:"📦", label:"Stock & Material" },
  { id:"finance",    icon:"💰", label:"Finance & Invoice" },
  { id:"reports",    icon:"📊", label:"Reports" },
  { id:"operator",   icon:"🖥️", label:"Operator View" },
  { id:"client_portal", icon:"🌐", label:"Client Portal" },
  { id:"settings",   icon:"⚙️", label:"Settings" },
];

const Sidebar = ({ active, setActive, notifCount }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{
      width: collapsed ? 64 : 230, minHeight:"100vh",
      background:"linear-gradient(180deg, #0d1526 0%, #080d1a 100%)",
      borderRight:`1px solid ${T.border}`,
      display:"flex", flexDirection:"column",
      transition:"width 0.25s ease", flexShrink:0,
      position:"relative", zIndex:10,
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed?"16px 0":"20px 20px", display:"flex", alignItems:"center", gap:10,
        borderBottom:`1px solid ${T.border}`, cursor:"pointer" }} onClick={()=>setCollapsed(!collapsed)}>
        <div style={{
          width:36, height:36, borderRadius:10, flexShrink:0,
          background:"linear-gradient(135deg, #3b82f6, #06b6d4)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:18, fontWeight:900, color:"#fff",
          boxShadow:"0 0 20px rgba(59,130,246,0.4)",
          marginLeft: collapsed ? "auto" : 0, marginRight: collapsed ? "auto" : 0,
        }}>P</div>
        {!collapsed && <div>
          <div style={{ fontSize:16, fontWeight:900, color:T.text, letterSpacing:"-0.03em" }}>PackagePro</div>
          <div style={{ fontSize:10, color:T.textMuted, fontWeight:600, letterSpacing:"0.05em" }}>MANAGEMENT SYSTEM</div>
        </div>}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"12px 8px", overflowY:"auto" }}>
        {MENU.map(m => {
          const isActive = active === m.id;
          return (
            <div key={m.id} onClick={()=>setActive(m.id)}
              title={collapsed ? m.label : ""}
              style={{
                display:"flex", alignItems:"center", gap:10,
                padding: collapsed?"10px 0":"10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius:10, marginBottom:2, cursor:"pointer",
                background: isActive ? "rgba(59,130,246,0.15)" : "transparent",
                border: isActive ? `1px solid rgba(59,130,246,0.3)` : "1px solid transparent",
                color: isActive ? T.accent2 : T.textMuted,
                transition:"all 0.15s", position:"relative",
              }}>
              <span style={{ fontSize:17, flexShrink:0 }}>{m.icon}</span>
              {!collapsed && <span style={{ fontSize:13, fontWeight:isActive?700:500 }}>{m.label}</span>}
              {!collapsed && m.id==="jobs" && <span style={{
                marginLeft:"auto", background:T.amber, color:"#000",
                borderRadius:10, padding:"1px 7px", fontSize:10, fontWeight:800
              }}>4</span>}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: collapsed?"12px 0":"14px 16px", borderTop:`1px solid ${T.border}`,
        display:"flex", alignItems:"center", gap:10, justifyContent: collapsed?"center":"flex-start" }}>
        <div style={{
          width:32, height:32, borderRadius:50, background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#fff", flexShrink:0
        }}>A</div>
        {!collapsed && <div>
          <div style={{ fontSize:13, fontWeight:700, color:T.text }}>Admin</div>
          <div style={{ fontSize:11, color:T.textMuted }}>Owner</div>
        </div>}
      </div>
    </div>
  );
};

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
const Topbar = ({ title, sub, notifications, setShowNotif, showNotif, setActive }) => {
  const unread = notifications.filter(n=>!n.read).length;
  return (
    <div style={{
      height:64, background:T.bgCard, borderBottom:`1px solid ${T.border}`,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 28px", gap:20, flexShrink:0
    }}>
      <div>
        <div style={{ fontSize:19, fontWeight:800, color:T.text, letterSpacing:"-0.02em" }}>{title}</div>
        {sub && <div style={{ fontSize:12, color:T.textMuted }}>{sub}</div>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        {/* Search */}
        <div style={{ display:"flex", alignItems:"center", gap:8, background:T.bgCard2,
          border:`1px solid ${T.border}`, borderRadius:9, padding:"7px 14px" }}>
          <span style={{ fontSize:13, color:T.textMuted }}>🔍</span>
          <input placeholder="Search jobs, clients..." style={{
            background:"transparent", border:"none", outline:"none",
            color:T.text, fontSize:13, width:180, fontFamily:"inherit"
          }} />
        </div>
        {/* Notif */}
        <div style={{ position:"relative" }}>
          <button onClick={()=>setShowNotif(!showNotif)} style={{
            background:T.bgCard2, border:`1px solid ${T.border}`,
            borderRadius:9, width:40, height:40, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:17,
            color: unread ? T.amber : T.textMuted, position:"relative"
          }}>🔔
            {unread>0 && <span style={{
              position:"absolute", top:6, right:6, width:8, height:8,
              background:T.rose, borderRadius:"50%", border:`2px solid ${T.bgCard}`
            }} />}
          </button>
          {showNotif && <NotifPanel notifications={notifications} setShowNotif={setShowNotif} />}
        </div>
        {/* New Job */}
        <button onClick={()=>setActive("jobs")} style={{
          background:"linear-gradient(135deg,#3b82f6,#06b6d4)", border:"none",
          color:"#fff", borderRadius:9, padding:"9px 18px", fontSize:13, fontWeight:700,
          cursor:"pointer", fontFamily:"inherit", boxShadow:"0 0 20px rgba(59,130,246,0.3)"
        }}>+ New Job</button>
      </div>
    </div>
  );
};

const NotifPanel = ({ notifications, setShowNotif }) => (
  <div style={{
    position:"absolute", top:48, right:0, width:340,
    background:T.bgCard, border:`1px solid ${T.border}`,
    borderRadius:12, boxShadow:"0 20px 60px rgba(0,0,0,0.5)",
    zIndex:100, overflow:"hidden"
  }}>
    <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`,
      display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <span style={{ fontWeight:700, fontSize:14, color:T.text }}>Notifications</span>
      <button onClick={()=>setShowNotif(false)} style={{ background:"none", border:"none", color:T.textMuted, cursor:"pointer", fontSize:16 }}>✕</button>
    </div>
    {notifications.map(n => (
      <div key={n.id} style={{
        padding:"12px 16px", borderBottom:`1px solid ${T.border}`,
        background: n.read ? "transparent" : "rgba(59,130,246,0.05)",
        display:"flex", gap:12, alignItems:"flex-start"
      }}>
        <span style={{ fontSize:20 }}>{n.icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, color: n.read ? T.textDim : T.text, lineHeight:1.4 }}>{n.msg}</div>
          <div style={{ fontSize:11, color:T.textMuted, marginTop:4 }}>{n.time}</div>
        </div>
        {!n.read && <div style={{ width:8, height:8, borderRadius:"50%", background:T.accent, flexShrink:0, marginTop:4 }} />}
      </div>
    ))}
  </div>
);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ jobs, setActive, setSelectedJob }) => {
  const activeJobs = jobs.filter(j=>j.status==="In Progress"||j.status==="Overdue");
  const overdue = jobs.filter(j=>j.status==="Overdue");
  const delivered = jobs.filter(j=>j.status==="Delivered"||j.status==="Ready for Delivery");
  const totalRevenue = jobs.reduce((a,j)=>a+j.revenue,0);

  const stageCount = {};
  STAGES_LIBRARY.forEach(s => stageCount[s] = 0);
  jobs.forEach(j => {
    const active = j.stages?.find(s=>s.status==="Active");
    if(active) stageCount[active.name] = (stageCount[active.name]||0)+1;
  });

  return (
    <div style={{ padding:28, overflowY:"auto", flex:1 }}>
      {/* Stats Row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        <Stat label="Active Jobs" value={activeJobs.length} sub="Currently in production" icon="📋" color={T.accent} glow />
        <Stat label="Overdue" value={overdue.length} sub="Need immediate attention" icon="⚠️" color={T.rose} />
        <Stat label="Delivered This Month" value={delivered.length} sub="Completed successfully" icon="✅" color={T.emerald} />
        <Stat label="Revenue (Month)" value={`₨${(totalRevenue/1000).toFixed(0)}K`} sub="Total invoiced value" icon="💰" color={T.amber} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        {/* Production Board */}
        <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:20 }}>
          <SectionTitle title="Live Production Board" sub="All active jobs by status" action="View All" onAction={()=>setActive("jobs")} />
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {jobs.filter(j=>j.status!=="Delivered").map(job=>{
              const progress = Math.round((job.currentStage / job.pipeline.length)*100);
              const statusColors = { "In Progress":T.accent, "Overdue":T.rose, "Rush":T.rose, "Ready for Delivery":T.emerald };
              const c = statusColors[job.status] || T.accent;
              return (
                <div key={job.id} onClick={()=>{ setSelectedJob(job); setActive("jobs"); }}
                  style={{
                    background:T.bgCard2, border:`1px solid ${T.border}`,
                    borderRadius:10, padding:"12px 14px", cursor:"pointer",
                    borderLeft:`3px solid ${c}`,
                    transition:"all 0.15s",
                  }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div>
                      <div style={{ fontSize:12, color:T.accent2, fontWeight:700 }}>{job.id}</div>
                      <div style={{ fontSize:13, color:T.text, fontWeight:600, marginTop:2 }}>{job.title}</div>
                      <div style={{ fontSize:11, color:T.textMuted }}>{job.client}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <Badge label={job.status} />
                      <div style={{ fontSize:11, color:T.textMuted, marginTop:4 }}>Due: {job.deadline}</div>
                    </div>
                  </div>
                  <Pill val={job.currentStage} max={job.pipeline.length} color={c} />
                  <div style={{ fontSize:11, color:T.textMuted, marginTop:4 }}>
                    Stage {job.currentStage}/{job.pipeline.length} — {job.pipeline[job.currentStage-1] || "Complete"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Stage Bottleneck */}
          <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:20 }}>
            <SectionTitle title="Stage Workload" sub="Jobs active per stage" />
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {Object.entries(stageCount).filter(([,v])=>v>0).concat(
                [["Printing",2],["Die Cutting",2]]
              ).slice(0,6).map(([stage, count]) => (
                <div key={stage} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ fontSize:12, color:T.textDim, width:110, flexShrink:0 }}>{stage}</div>
                  <div style={{ flex:1, height:8, background:"rgba(255,255,255,0.04)", borderRadius:4, overflow:"hidden" }}>
                    <div style={{ width:`${Math.min(100,count*33)}%`, height:"100%", background:T.accent,
                      borderRadius:4, boxShadow:`0 0 8px ${T.accent}88` }} />
                  </div>
                  <div style={{ fontSize:12, color:T.textMuted, width:24, textAlign:"right" }}>{count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:20 }}>
            <SectionTitle title="⚠️ Stock Alerts" sub="Materials below minimum" />
            {MATERIALS.filter(m=>m.stock<m.minStock).map(m=>(
              <div key={m.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
                <div>
                  <div style={{ fontSize:13, color:T.text, fontWeight:600 }}>{m.name}</div>
                  <div style={{ fontSize:11, color:T.textMuted }}>Current: {m.stock} {m.unit}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <Badge label="Low Stock" color="rose" />
                  <div style={{ fontSize:11, color:T.textMuted, marginTop:4 }}>Min: {m.minStock}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:20 }}>
            <SectionTitle title="This Month" />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                {l:"Invoiced", v:"₨8.2L", c:T.accent},
                {l:"Collected", v:"₨6.1L", c:T.emerald},
                {l:"Outstanding", v:"₨2.1L", c:T.rose},
                {l:"Net Profit", v:"₨2.9L", c:T.amber},
              ].map(s=>(
                <div key={s.l} style={{ background:T.bgCard2, borderRadius:10, padding:"12px 14px",
                  border:`1px solid ${T.border}` }}>
                  <div style={{ fontSize:11, color:T.textMuted, marginBottom:4 }}>{s.l}</div>
                  <div style={{ fontSize:18, fontWeight:800, color:s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Deliveries */}
      <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:20 }}>
        <SectionTitle title="Upcoming Deliveries" sub="Next 7 days" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {jobs.filter(j=>j.status!=="Delivered").slice(0,3).map(job=>(
            <div key={job.id} style={{ background:T.bgCard2, border:`1px solid ${T.border}`, borderRadius:10, padding:"14px 16px" }}>
              <div style={{ fontSize:11, color:T.accent2, fontWeight:700 }}>{job.id}</div>
              <div style={{ fontSize:13, color:T.text, fontWeight:600, margin:"4px 0" }}>{job.client}</div>
              <div style={{ fontSize:12, color:T.textMuted }}>Qty: {job.qty.toLocaleString()}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
                <span style={{ fontSize:12, color:T.amber, fontWeight:600 }}>📅 {job.deadline}</span>
                <Badge label={job.priority} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── JOB ORDERS ──────────────────────────────────────────────────────────────
const JobOrdersView = ({ jobs, selectedJob, setSelectedJob }) => {
  const [filter, setFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const filters = ["All","In Progress","Overdue","Ready for Delivery","Delivered","Rush"];
  const filtered = filter==="All" ? jobs : jobs.filter(j=>j.status===filter||j.priority===filter);

  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
      {/* List */}
      <div style={{ width:selectedJob?380:undefined, flex:selectedJob?undefined:1,
        padding:24, overflowY:"auto", borderRight: selectedJob?`1px solid ${T.border}`:"none" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:800, color:T.text }}>Job Orders</div>
            <div style={{ fontSize:13, color:T.textMuted }}>{filtered.length} jobs found</div>
          </div>
          <Btn label="+ Create Job" onClick={()=>setShowCreate(true)} />
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
          {filters.map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{
              background: filter===f ? T.accent : T.bgCard2,
              border:`1px solid ${filter===f ? T.accent : T.border}`,
              color: filter===f ? "#fff" : T.textMuted,
              borderRadius:8, padding:"6px 14px", fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:600
            }}>{f}</button>
          ))}
        </div>

        {/* Job Cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {filtered.map(job=>{
            const isSelected = selectedJob?.id===job.id;
            const pct = Math.round((job.currentStage/job.pipeline.length)*100);
            const statusColor = { "In Progress":T.accent,"Overdue":T.rose,"Ready for Delivery":T.emerald,"Delivered":T.textMuted }[job.status]||T.accent;
            return (
              <div key={job.id} onClick={()=>setSelectedJob(isSelected?null:job)}
                style={{
                  background: isSelected?"rgba(59,130,246,0.1)" : T.bgCard,
                  border:`1px solid ${isSelected?T.accent:T.border}`,
                  borderRadius:12, padding:16, cursor:"pointer",
                  transition:"all 0.15s",
                  boxShadow: isSelected?"0 0 20px rgba(59,130,246,0.15)":"none",
                }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ fontSize:12, color:T.accent2, fontWeight:700 }}>{job.id}</span>
                  <Badge label={job.priority} />
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:T.text, marginBottom:3 }}>{job.title}</div>
                <div style={{ fontSize:12, color:T.textMuted, marginBottom:10 }}>{job.client} · {job.qty.toLocaleString()} pcs</div>
                <Pill val={job.currentStage} max={job.pipeline.length} color={statusColor} />
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
                  <span style={{ fontSize:11, color:T.textMuted }}>Stage {job.currentStage}/{job.pipeline.length}</span>
                  <span style={{ fontSize:11, color:statusColor, fontWeight:600 }}>{job.status}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                  <span style={{ fontSize:11, color:T.textMuted }}>Due: {job.deadline}</span>
                  <span style={{ fontSize:11, color:T.amber, fontWeight:600 }}>₨{(job.revenue/1000).toFixed(0)}K</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedJob && <JobDetail job={selectedJob} onClose={()=>setSelectedJob(null)} />}

      {/* Create Modal */}
      {showCreate && <CreateJobModal onClose={()=>setShowCreate(false)} />}
    </div>
  );
};

const JobDetail = ({ job, onClose }) => {
  const profit = job.revenue - job.materialCost - job.operatorCost;
  const margin = Math.round((profit/job.revenue)*100);
  return (
    <div style={{ flex:1, overflowY:"auto", padding:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div>
          <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:4 }}>
            <span style={{ fontSize:14, color:T.accent2, fontWeight:700 }}>{job.id}</span>
            <Badge label={job.priority} />
            <Badge label={job.status} />
          </div>
          <div style={{ fontSize:20, fontWeight:800, color:T.text, letterSpacing:"-0.02em" }}>{job.title}</div>
          <div style={{ fontSize:13, color:T.textMuted, marginTop:2 }}>Client: {job.client} · Qty: {job.qty.toLocaleString()} pcs · Due: {job.deadline}</div>
        </div>
        <button onClick={onClose} style={{ background:T.bgCard2, border:`1px solid ${T.border}`,
          color:T.textMuted, borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16 }}>✕</button>
      </div>

      {/* Financials */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {[
          {l:"Revenue", v:`₨${(job.revenue/1000).toFixed(0)}K`, c:T.accent},
          {l:"Material Cost", v:`₨${(job.materialCost/1000).toFixed(0)}K`, c:T.rose},
          {l:"Operator Cost", v:`₨${(job.operatorCost/1000).toFixed(0)}K`, c:T.amber},
          {l:"Net Profit", v:`₨${(profit/1000).toFixed(0)}K (${margin}%)`, c:T.emerald},
        ].map(s=>(
          <div key={s.l} style={{ background:T.bgCard2, border:`1px solid ${T.border}`, borderRadius:10, padding:14 }}>
            <div style={{ fontSize:11, color:T.textMuted, marginBottom:4 }}>{s.l}</div>
            <div style={{ fontSize:16, fontWeight:800, color:s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Timeline */}
      <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:20, marginBottom:20 }}>
        <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:16 }}>Pipeline Progress</div>
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {job.stages.map((stage, i) => {
            const isDone = stage.status==="Done";
            const isActive = stage.status==="Active";
            const isPending = stage.status==="Pending";
            const dotColor = isDone ? T.emerald : isActive ? T.accent : T.border2;
            const isLast = i===job.stages.length-1;
            return (
              <div key={stage.name} style={{ display:"flex", gap:14 }}>
                {/* Timeline */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:24, flexShrink:0 }}>
                  <div style={{
                    width:22, height:22, borderRadius:"50%",
                    background: isDone ? T.emerald : isActive ? T.accent : "transparent",
                    border: `2px solid ${dotColor}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:10, color:"#fff", fontWeight:800, flexShrink:0,
                    boxShadow: isActive ? `0 0 12px ${T.accent}` : isDone ? `0 0 8px ${T.emerald}44` : "none",
                    position:"relative", zIndex:1,
                  }}>{isDone?"✓":isActive?"●":""}</div>
                  {!isLast && <div style={{ width:2, flex:1, minHeight:20, background:isDone?T.emerald:T.border }} />}
                </div>
                {/* Content */}
                <div style={{
                  flex:1, background: isActive ? "rgba(59,130,246,0.08)" : "transparent",
                  border: isActive ? `1px solid rgba(59,130,246,0.25)` : "1px solid transparent",
                  borderRadius:10, padding:"10px 14px", marginBottom:6,
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <span style={{ fontSize:13, fontWeight:700,
                        color: isDone ? T.emerald : isActive ? T.accent2 : T.textMuted }}>{stage.name}</span>
                      <span style={{ fontSize:11, color:T.textMuted, marginLeft:8 }}>→ {stage.operator}</span>
                    </div>
                    <Badge label={isDone?"Done":isActive?"Active stage":"Pending"} />
                  </div>
                  {isDone && <div style={{ fontSize:11, color:T.textMuted, marginTop:4 }}>
                    ✅ {stage.completedAt} · {stage.qty.toLocaleString()} pcs {stage.notes&&`· ${stage.notes}`}
                  </div>}
                  {isActive && <div style={{ fontSize:11, color:T.accent, marginTop:4 }}>⚡ Currently in progress</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CreateJobModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [pipeline, setPipeline] = useState([]);
  const toggleStage = (s) => setPipeline(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);
  const moveStage = (i, dir) => {
    const p = [...pipeline];
    const j = i+dir;
    if(j<0||j>=p.length) return;
    [p[i],p[j]]=[p[j],p[i]];
    setPipeline(p);
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:200,
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:16, width:680,
        maxHeight:"88vh", overflowY:"auto", boxShadow:"0 40px 100px rgba(0,0,0,0.6)" }}>
        {/* Header */}
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:T.text }}>Create New Job Order</div>
            <div style={{ fontSize:12, color:T.textMuted, marginTop:2 }}>Step {step} of 3</div>
          </div>
          <button onClick={onClose} style={{ background:T.bgCard2, border:`1px solid ${T.border}`,
            color:T.textMuted, borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
        {/* Step Indicators */}
        <div style={{ display:"flex", padding:"16px 24px", gap:8, borderBottom:`1px solid ${T.border}` }}>
          {["Job Info","Build Pipeline","Assign & Launch"].map((s,i)=>(
            <div key={s} style={{ display:"flex", alignItems:"center", gap:8, flex:1 }}>
              <div style={{ width:24, height:24, borderRadius:"50%", display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:11, fontWeight:800,
                background: step>i+1?T.emerald:step===i+1?T.accent:T.border,
                color: step>=i+1?"#fff":T.textMuted }}>
                {step>i+1?"✓":i+1}
              </div>
              <span style={{ fontSize:12, color:step===i+1?T.text:T.textMuted, fontWeight:step===i+1?700:400 }}>{s}</span>
              {i<2&&<div style={{ flex:1, height:1, background:T.border }} />}
            </div>
          ))}
        </div>

        <div style={{ padding:24 }}>
          {step===1 && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
              <Select label="Client" options={["Select Client",...CLIENTS.map(c=>c.name)]} />
              <Input label="Job Title" placeholder="e.g. Premium Gift Box with Foil" />
              <Select label="Product Type" options={["Gift Box","Carton Box","Paper Bag","Kraft Box","Luxury Box","Custom"]} />
              <Input label="Quantity" placeholder="e.g. 10000" type="number" />
              <Input label="Size (W×H×D mm)" placeholder="e.g. 200×150×80" />
              <Select label="Priority" options={["Normal","Urgent","Rush"]} />
              <Input label="Deadline Date" type="date" />
              <Select label="Paper / Board Type" options={["Art Card 300gsm","Duplex Board 400gsm","Kraft 120gsm","Custom"]} />
              <Input label="Colour Count" placeholder="e.g. 4 (CMYK)" style={{ gridColumn:"span 2" }} />
              <div style={{ gridColumn:"span 2", marginBottom:16 }}>
                <div style={{ fontSize:12, color:T.textDim, fontWeight:600, marginBottom:6, letterSpacing:"0.04em" }}>SPECIAL NOTES</div>
                <textarea placeholder="Any special requirements, client instructions..." rows={3} style={{
                  width:"100%", background:T.bgCard3, border:`1px solid ${T.border2}`,
                  borderRadius:8, padding:"10px 14px", color:T.text, fontSize:14,
                  outline:"none", boxSizing:"border-box", fontFamily:"inherit", resize:"vertical"
                }} />
              </div>
            </div>
          )}

          {step===2 && (
            <div>
              <div style={{ fontSize:14, color:T.textDim, marginBottom:16 }}>
                Select stages needed for this job and arrange them in order:
              </div>
              {/* Available */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, color:T.textMuted, fontWeight:600, marginBottom:10, letterSpacing:"0.04em" }}>AVAILABLE STAGES — Click to add</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {STAGES_LIBRARY.filter(s=>!pipeline.includes(s)).map(s=>(
                    <button key={s} onClick={()=>toggleStage(s)} style={{
                      background:T.bgCard3, border:`1px solid ${T.border2}`,
                      color:T.textDim, borderRadius:8, padding:"7px 14px",
                      fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:600
                    }}>+ {s}</button>
                  ))}
                </div>
              </div>
              {/* Pipeline */}
              {pipeline.length>0&&<div>
                <div style={{ fontSize:12, color:T.accent2, fontWeight:600, marginBottom:10, letterSpacing:"0.04em" }}>YOUR JOB PIPELINE (drag to reorder)</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {pipeline.map((s,i)=>(
                    <div key={s} style={{ display:"flex", alignItems:"center", gap:10,
                      background:T.bgCard2, border:`1px solid ${T.border}`,
                      borderRadius:9, padding:"10px 14px" }}>
                      <span style={{ fontSize:12, color:T.accent2, fontWeight:800, minWidth:22 }}>{i+1}</span>
                      <span style={{ flex:1, fontSize:13, color:T.text, fontWeight:600 }}>{s}</span>
                      <button onClick={()=>moveStage(i,-1)} disabled={i===0}
                        style={{ background:"none",border:"none",color:i===0?T.border:T.textMuted,cursor:i===0?"default":"pointer",fontSize:14 }}>▲</button>
                      <button onClick={()=>moveStage(i,1)} disabled={i===pipeline.length-1}
                        style={{ background:"none",border:"none",color:i===pipeline.length-1?T.border:T.textMuted,cursor:i===pipeline.length-1?"default":"pointer",fontSize:14 }}>▼</button>
                      <button onClick={()=>toggleStage(s)}
                        style={{ background:"none",border:"none",color:T.rose,cursor:"pointer",fontSize:14,fontWeight:800 }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>}
              {pipeline.length===0&&<div style={{ textAlign:"center", padding:"40px 0", color:T.textMuted, fontSize:14 }}>
                👆 Select stages above to build the pipeline
              </div>}
            </div>
          )}

          {step===3 && (
            <div>
              <div style={{ fontSize:14, color:T.textDim, marginBottom:16 }}>Assign an operator to each stage:</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {(pipeline.length>0?pipeline:["Design","Printing","Lamination","Die Cutting","Delivery"]).map((s,i)=>(
                  <div key={s} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, alignItems:"center",
                    background:T.bgCard2, border:`1px solid ${T.border}`, borderRadius:9, padding:"12px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:24, height:24, borderRadius:"50%", background:T.accentGlow,
                        border:`1px solid ${T.accent}`, display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:10, color:T.accent2, fontWeight:800 }}>{i+1}</div>
                      <span style={{ fontSize:13, color:T.text, fontWeight:600 }}>{s}</span>
                    </div>
                    <select style={{ background:T.bgCard3, border:`1px solid ${T.border2}`,
                      borderRadius:7, padding:"7px 12px", color:T.text, fontSize:12,
                      outline:"none", fontFamily:"inherit" }}>
                      <option>Assign Operator</option>
                      {STAFF.map(st=><option key={st.id}>{st.name} ({st.dept})</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:24 }}>
            <Btn label="Cancel" onClick={onClose} ghost />
            <div style={{ display:"flex", gap:10 }}>
              {step>1&&<Btn label="← Back" onClick={()=>setStep(step-1)} ghost />}
              {step<3
                ? <Btn label="Next →" onClick={()=>setStep(step+1)} />
                : <Btn label="🚀 Launch Job" onClick={onClose} color={T.emerald} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PIPELINE VIEW ────────────────────────────────────────────────────────────
const PipelineView = () => {
  const stages = ["Design","Printing","Lamination","Die Cutting","Foiling","Pasting","Quality Check","Packing","Delivery"];
  const getJobsAtStage = (stage) => JOBS.filter(j => {
    const active = j.stages?.find(s=>s.status==="Active");
    return active?.name===stage;
  });
  return (
    <div style={{ padding:24, overflowX:"auto", flex:1 }}>
      <SectionTitle title="Pipeline Kanban View" sub="Drag-and-drop production flow — all active jobs" />
      <div style={{ display:"flex", gap:12, minWidth:"max-content" }}>
        {stages.map(stage=>{
          const stageJobs = getJobsAtStage(stage);
          const pendingJobs = JOBS.filter(j=>j.stages?.some(s=>s.name===stage&&s.status==="Pending"));
          const doneJobs = JOBS.filter(j=>j.stages?.some(s=>s.name===stage&&s.status==="Done"));
          return (
            <div key={stage} style={{ width:200, flexShrink:0 }}>
              {/* Stage header */}
              <div style={{ background:T.bgCard2, border:`1px solid ${T.border}`, borderRadius:"12px 12px 0 0",
                padding:"10px 14px", borderBottom:`2px solid ${T.accent}` }}>
                <div style={{ fontSize:12, fontWeight:700, color:T.text }}>{stage}</div>
                <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>
                  {stageJobs.length} active · {doneJobs.length} done
                </div>
              </div>
              {/* Cards */}
              <div style={{ background:"rgba(17,24,39,0.5)", border:`1px solid ${T.border}`,
                borderTop:"none", borderRadius:"0 0 12px 12px", padding:8, minHeight:200,
                display:"flex", flexDirection:"column", gap:8 }}>
                {stageJobs.map(job=>(
                  <div key={job.id} style={{
                    background:T.bgCard, border:`1px solid ${T.accent}`,
                    borderRadius:9, padding:"10px 12px",
                    boxShadow:`0 0 12px rgba(59,130,246,0.15)`,
                  }}>
                    <div style={{ fontSize:10, color:T.accent2, fontWeight:700 }}>{job.id}</div>
                    <div style={{ fontSize:12, color:T.text, fontWeight:600, margin:"3px 0" }}>{job.client}</div>
                    <div style={{ fontSize:11, color:T.textMuted }}>{job.qty.toLocaleString()} pcs</div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
                      <Badge label={job.priority} />
                      <span style={{ fontSize:10, color:job.status==="Overdue"?T.rose:T.amber }}>
                        {job.status==="Overdue"?"🔴":"📅"} {job.deadline}
                      </span>
                    </div>
                  </div>
                ))}
                {pendingJobs.slice(0,1).map(job=>(
                  <div key={job.id} style={{
                    background:"rgba(100,116,139,0.05)", border:`1px dashed ${T.border}`,
                    borderRadius:9, padding:"10px 12px", opacity:0.6
                  }}>
                    <div style={{ fontSize:10, color:T.textMuted, fontWeight:700 }}>{job.id}</div>
                    <div style={{ fontSize:12, color:T.textMuted, fontWeight:600, margin:"3px 0" }}>{job.client}</div>
                    <div style={{ fontSize:10, color:T.textMuted }}>Waiting...</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── CLIENTS ─────────────────────────────────────────────────────────────────
const ClientsView = () => {
  const [sel, setSel] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
      <div style={{ flex:1, padding:24, overflowY:"auto", borderRight: sel?`1px solid ${T.border}`:"none" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <SectionTitle title="Clients" sub={`${CLIENTS.length} registered clients`} />
          <Btn label="+ Add Client" onClick={()=>setShowAdd(true)} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
          {CLIENTS.map(c=>(
            <div key={c.id} onClick={()=>setSel(sel?.id===c.id?null:c)} style={{
              background:T.bgCard, border:`1px solid ${sel?.id===c.id?T.accent:T.border}`,
              borderRadius:14, padding:18, cursor:"pointer",
              boxShadow: sel?.id===c.id?"0 0 20px rgba(59,130,246,0.15)":"none",
              transition:"all 0.15s"
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,${T.accent},${T.cyan})`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:"#fff" }}>
                  {c.name[0]}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end" }}>
                  <Badge label={c.category} />
                  <Badge label={c.status} />
                </div>
              </div>
              <div style={{ fontSize:15, fontWeight:700, color:T.text, marginBottom:2 }}>{c.name}</div>
              <div style={{ fontSize:12, color:T.textMuted, marginBottom:12 }}>{c.contact} · {c.phone}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <div style={{ background:T.bgCard2, borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ fontSize:10, color:T.textMuted }}>Outstanding</div>
                  <div style={{ fontSize:14, fontWeight:700, color:c.balance>0?T.rose:T.emerald }}>
                    ₨{c.balance.toLocaleString()}
                  </div>
                </div>
                <div style={{ background:T.bgCard2, borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ fontSize:10, color:T.textMuted }}>Total Jobs</div>
                  <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{c.jobs}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {sel && (
        <div style={{ width:340, padding:24, overflowY:"auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div style={{ fontSize:16, fontWeight:800, color:T.text }}>Client Detail</div>
            <button onClick={()=>setSel(null)} style={{ background:T.bgCard2, border:`1px solid ${T.border}`,
              color:T.textMuted, borderRadius:8, width:28, height:28, cursor:"pointer" }}>✕</button>
          </div>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <div style={{ width:64, height:64, borderRadius:16, background:`linear-gradient(135deg,${T.accent},${T.cyan})`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:900, color:"#fff",
              margin:"0 auto 12px" }}>{sel.name[0]}</div>
            <div style={{ fontSize:17, fontWeight:800, color:T.text }}>{sel.name}</div>
            <div style={{ fontSize:12, color:T.textMuted }}>{sel.id}</div>
          </div>
          {[
            {l:"Contact", v:sel.contact}, {l:"Phone", v:sel.phone}, {l:"Email", v:sel.email},
            {l:"Category", v:sel.category}, {l:"Status", v:sel.status},
            {l:"Credit Limit", v:`₨${sel.creditLimit.toLocaleString()}`},
            {l:"Outstanding", v:`₨${sel.balance.toLocaleString()}`},
            {l:"Total Jobs", v:sel.jobs},
          ].map(({l,v})=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
              <span style={{ fontSize:12, color:T.textMuted }}>{l}</span>
              <span style={{ fontSize:12, color:T.text, fontWeight:600 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop:16, display:"flex", gap:8 }}>
            <Btn label="View Jobs" style={{ flex:1, justifyContent:"center" }} />
            <Btn label="Invoice" ghost style={{ flex:1, justifyContent:"center" }} />
          </div>
        </div>
      )}
    </div>
  );
};

// ─── STAFF & EARNINGS ─────────────────────────────────────────────────────────
const StaffView = () => {
  const [sel, setSel] = useState(null);
  const totalEarnings = STAFF.reduce((a,s)=>a+s.thisMonth,0);
  return (
    <div style={{ flex:1, padding:24, overflowY:"auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <SectionTitle title="Staff & Earnings" sub="December 2024 — Auto-calculated from job completions" />
        <Btn label="+ Add Staff" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        <Stat label="Total Staff" value={STAFF.length} icon="👥" color={T.accent} />
        <Stat label="Total Payroll" value={`₨${(totalEarnings/1000).toFixed(0)}K`} icon="💸" color={T.amber} />
        <Stat label="Processed" value="0" sub="Pending processing" icon="✅" color={T.textMuted} />
        <Stat label="Avg Earning" value={`₨${Math.round(totalEarnings/STAFF.length/1000)}K`} icon="📊" color={T.violet} />
      </div>
      <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:T.bgCard2 }}>
              {["Staff ID","Name","Department","Earning Type","Rate","This Month","Status",""].map(h=>(
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11,
                  color:T.textMuted, fontWeight:700, letterSpacing:"0.05em",
                  borderBottom:`1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STAFF.map((s,i)=>(
              <tr key={s.id} onClick={()=>setSel(sel?.id===s.id?null:s)} style={{
                cursor:"pointer",
                background: sel?.id===s.id ? "rgba(59,130,246,0.08)" : i%2===0?T.bgCard:"rgba(26,34,53,0.5)",
                transition:"background 0.1s"
              }}>
                <td style={{ padding:"13px 16px", fontSize:12, color:T.accent2, fontWeight:600, borderBottom:`1px solid ${T.border}` }}>{s.id}</td>
                <td style={{ padding:"13px 16px", fontSize:13, color:T.text, fontWeight:600, borderBottom:`1px solid ${T.border}` }}>{s.name}</td>
                <td style={{ padding:"13px 16px", fontSize:12, color:T.textMuted, borderBottom:`1px solid ${T.border}` }}>{s.dept}</td>
                <td style={{ padding:"13px 16px", borderBottom:`1px solid ${T.border}` }}><Badge label={s.earningType} /></td>
                <td style={{ padding:"13px 16px", fontSize:12, color:T.textDim, borderBottom:`1px solid ${T.border}` }}>
                  {s.earningType==="Monthly"?`₨${s.rate.toLocaleString()}/mo`:s.earningType==="Per Piece"?`₨${s.rate}/pc`:`₨${s.rate}/hr`}
                </td>
                <td style={{ padding:"13px 16px", fontSize:14, fontWeight:800, color:T.emerald, borderBottom:`1px solid ${T.border}` }}>₨{s.thisMonth.toLocaleString()}</td>
                <td style={{ padding:"13px 16px", borderBottom:`1px solid ${T.border}` }}><Badge label={s.status} /></td>
                <td style={{ padding:"13px 16px", borderBottom:`1px solid ${T.border}` }}>
                  <Btn label="Details" ghost style={{ padding:"5px 12px", fontSize:11 }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Earning Type Breakdown */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:20 }}>
        {["Per Piece","Per Hour","Monthly"].map(type=>{
          const staff = STAFF.filter(s=>s.earningType===type);
          const total = staff.reduce((a,s)=>a+s.thisMonth,0);
          return (
            <div key={type} style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:18 }}>
              <Badge label={type} />
              <div style={{ fontSize:22, fontWeight:800, color:T.text, margin:"10px 0 4px" }}>
                ₨{(total/1000).toFixed(0)}K
              </div>
              <div style={{ fontSize:12, color:T.textMuted }}>{staff.length} staff members</div>
              <div style={{ marginTop:12 }}>
                {staff.map(s=>(
                  <div key={s.id} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0",
                    borderBottom:`1px solid ${T.border}`, fontSize:12 }}>
                    <span style={{ color:T.textDim }}>{s.name}</span>
                    <span style={{ color:T.text, fontWeight:700 }}>₨{s.thisMonth.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── STOCK ───────────────────────────────────────────────────────────────────
const StockView = () => (
  <div style={{ flex:1, padding:24, overflowY:"auto" }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
      <SectionTitle title="Material & Stock" sub="Live inventory with auto-deduction tracking" />
      <div style={{ display:"flex", gap:10 }}>
        <Btn label="+ Purchase Entry" ghost />
        <Btn label="+ Add Material" />
      </div>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
      <Stat label="Total Items" value={MATERIALS.length} icon="📦" color={T.accent} />
      <Stat label="Stock Value" value="₨3.6L" icon="💎" color={T.emerald} />
      <Stat label="Low Stock Alerts" value={MATERIALS.filter(m=>m.stock<m.minStock).length} icon="⚠️" color={T.rose} />
      <Stat label="Categories" value="5" icon="🏷️" color={T.violet} />
    </div>
    <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, overflow:"hidden" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr style={{ background:T.bgCard2 }}>
            {["Material ID","Name","Category","Stock","Min Stock","Rate","Stock Value","Status"].map(h=>(
              <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11,
                color:T.textMuted, fontWeight:700, letterSpacing:"0.05em",
                borderBottom:`1px solid ${T.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MATERIALS.map((m,i)=>{
            const isLow = m.stock < m.minStock;
            const pct = Math.min(100, (m.stock/m.minStock)*100);
            return (
              <tr key={m.id} style={{ background: i%2===0?T.bgCard:"rgba(26,34,53,0.5)" }}>
                <td style={{ padding:"12px 16px", fontSize:12, color:T.accent2, fontWeight:600, borderBottom:`1px solid ${T.border}` }}>{m.id}</td>
                <td style={{ padding:"12px 16px", fontSize:13, color:T.text, fontWeight:600, borderBottom:`1px solid ${T.border}` }}>{m.name}</td>
                <td style={{ padding:"12px 16px", fontSize:12, color:T.textMuted, borderBottom:`1px solid ${T.border}` }}>{m.category}</td>
                <td style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ fontSize:13, color:isLow?T.rose:T.text, fontWeight:700 }}>{m.stock.toLocaleString()} {m.unit}</div>
                  <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:2, marginTop:4, width:80 }}>
                    <div style={{ width:`${Math.min(100,pct)}%`, height:"100%", background:isLow?T.rose:T.emerald, borderRadius:2 }} />
                  </div>
                </td>
                <td style={{ padding:"12px 16px", fontSize:12, color:T.textMuted, borderBottom:`1px solid ${T.border}` }}>{m.minStock.toLocaleString()} {m.unit}</td>
                <td style={{ padding:"12px 16px", fontSize:12, color:T.textDim, borderBottom:`1px solid ${T.border}` }}>₨{m.rate}/{m.unit}</td>
                <td style={{ padding:"12px 16px", fontSize:13, fontWeight:700, color:T.amber, borderBottom:`1px solid ${T.border}` }}>₨{m.value.toLocaleString()}</td>
                <td style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}>
                  <Badge label={isLow?"Low Stock":"In Stock"} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── FINANCE ─────────────────────────────────────────────────────────────────
const FinanceView = () => {
  const [tab, setTab] = useState("Invoices");
  const tabs = ["Invoices","Expenses","Salary"];
  return (
    <div style={{ flex:1, padding:24, overflowY:"auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <SectionTitle title="Finance & Invoicing" sub="Invoices, payments, expenses, and salary management" />
        <Btn label="+ Generate Invoice" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        <Stat label="Total Invoiced" value="₨8.2L" sub="This month" icon="📄" color={T.accent} glow />
        <Stat label="Collected" value="₨6.1L" sub="Payments received" icon="✅" color={T.emerald} />
        <Stat label="Outstanding" value="₨2.1L" sub="3 invoices pending" icon="⏳" color={T.amber} />
        <Stat label="Overdue" value="₨2.1L" sub="Past due date" icon="🔴" color={T.rose} />
      </div>
      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:20 }}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            background:tab===t?T.accent:"transparent", border:`1px solid ${tab===t?T.accent:T.border}`,
            color:tab===t?"#fff":T.textMuted, borderRadius:8, padding:"8px 18px",
            fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:600
          }}>{t}</button>
        ))}
      </div>

      {tab==="Invoices" && (
        <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:T.bgCard2 }}>
              {["Invoice","Job Ref","Client","Amount","Paid","Balance","Status","Date","Due Date"].map(h=>(
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:T.textMuted,
                  fontWeight:700, letterSpacing:"0.05em", borderBottom:`1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {INVOICES.map((inv,i)=>(
                <tr key={inv.id} style={{ background:i%2===0?T.bgCard:"rgba(26,34,53,0.5)", cursor:"pointer" }}>
                  <td style={{ padding:"13px 16px", fontSize:12, color:T.accent2, fontWeight:700, borderBottom:`1px solid ${T.border}` }}>{inv.id}</td>
                  <td style={{ padding:"13px 16px", fontSize:12, color:T.textMuted, borderBottom:`1px solid ${T.border}` }}>{inv.jobId}</td>
                  <td style={{ padding:"13px 16px", fontSize:13, color:T.text, fontWeight:600, borderBottom:`1px solid ${T.border}` }}>{inv.client}</td>
                  <td style={{ padding:"13px 16px", fontSize:13, fontWeight:800, color:T.text, borderBottom:`1px solid ${T.border}` }}>₨{inv.amount.toLocaleString()}</td>
                  <td style={{ padding:"13px 16px", fontSize:13, fontWeight:700, color:T.emerald, borderBottom:`1px solid ${T.border}` }}>₨{inv.paid.toLocaleString()}</td>
                  <td style={{ padding:"13px 16px", fontSize:13, fontWeight:700, color:inv.amount-inv.paid>0?T.rose:T.emerald, borderBottom:`1px solid ${T.border}` }}>
                    ₨{(inv.amount-inv.paid).toLocaleString()}
                  </td>
                  <td style={{ padding:"13px 16px", borderBottom:`1px solid ${T.border}` }}><Badge label={inv.status} /></td>
                  <td style={{ padding:"13px 16px", fontSize:12, color:T.textMuted, borderBottom:`1px solid ${T.border}` }}>{inv.date}</td>
                  <td style={{ padding:"13px 16px", fontSize:12, color:inv.status==="Overdue"?T.rose:T.textMuted, fontWeight:inv.status==="Overdue"?700:400, borderBottom:`1px solid ${T.border}` }}>{inv.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab==="Salary" && (
        <div>
          <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:T.bgCard2 }}>
                {["Name","Dept","Type","Calculated","Advance","Net Payable","Action"].map(h=>(
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:T.textMuted,
                    fontWeight:700, letterSpacing:"0.05em", borderBottom:`1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {STAFF.map((s,i)=>(
                  <tr key={s.id} style={{ background:i%2===0?T.bgCard:"rgba(26,34,53,0.5)" }}>
                    <td style={{ padding:"13px 16px", fontSize:13, color:T.text, fontWeight:600, borderBottom:`1px solid ${T.border}` }}>{s.name}</td>
                    <td style={{ padding:"13px 16px", fontSize:12, color:T.textMuted, borderBottom:`1px solid ${T.border}` }}>{s.dept}</td>
                    <td style={{ padding:"13px 16px", borderBottom:`1px solid ${T.border}` }}><Badge label={s.earningType} /></td>
                    <td style={{ padding:"13px 16px", fontSize:14, fontWeight:800, color:T.accent2, borderBottom:`1px solid ${T.border}` }}>₨{s.thisMonth.toLocaleString()}</td>
                    <td style={{ padding:"13px 16px", fontSize:12, color:T.textMuted, borderBottom:`1px solid ${T.border}` }}>₨0</td>
                    <td style={{ padding:"13px 16px", fontSize:14, fontWeight:800, color:T.emerald, borderBottom:`1px solid ${T.border}` }}>₨{s.thisMonth.toLocaleString()}</td>
                    <td style={{ padding:"13px 16px", borderBottom:`1px solid ${T.border}` }}>
                      <Btn label="Mark Paid" color={T.emerald} style={{ padding:"5px 12px", fontSize:11 }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab==="Expenses" && (
        <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ fontSize:15, fontWeight:700, color:T.text }}>December 2024 Expenses</div>
            <Btn label="+ Add Expense" />
          </div>
          {[["Electricity","Monthly","₨45,000","2024-12-01"],["Generator Fuel","Monthly","₨12,000","2024-12-05"],
            ["Machine Maintenance","One-time","₨8,500","2024-12-10"],["Office Supplies","Monthly","₨3,200","2024-12-15"],
            ["Rent","Monthly","₨80,000","2024-12-01"]].map(([name,type,amount,date])=>(
            <div key={name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
              <div>
                <div style={{ fontSize:13, color:T.text, fontWeight:600 }}>{name}</div>
                <div style={{ fontSize:11, color:T.textMuted }}>{type} · {date}</div>
              </div>
              <span style={{ fontSize:15, fontWeight:800, color:T.rose }}>{amount}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:16, paddingTop:16, borderTop:`1px solid ${T.border}` }}>
            <div style={{ fontSize:16, fontWeight:800, color:T.text }}>Total: <span style={{ color:T.rose }}>₨1,48,700</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── REPORTS ─────────────────────────────────────────────────────────────────
const ReportsView = () => {
  const monthData = [
    {m:"Jul",rev:380,cost:220},
    {m:"Aug",rev:420,cost:240},
    {m:"Sep",rev:490,cost:270},
    {m:"Oct",rev:445,cost:260},
    {m:"Nov",rev:520,cost:295},
    {m:"Dec",rev:580,cost:320},
  ];
  const maxRev = Math.max(...monthData.map(d=>d.rev));
  return (
    <div style={{ flex:1, padding:24, overflowY:"auto" }}>
      <SectionTitle title="Reports & Analytics" sub="Performance overview — December 2024" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        <Stat label="Profit Margin" value="38%" sub="This month avg" icon="📈" color={T.emerald} glow />
        <Stat label="On-Time Delivery" value="78%" sub="12 of 15 jobs" icon="🚚" color={T.accent} />
        <Stat label="QC Rejection Rate" value="2.1%" sub="Acceptable range" icon="✅" color={T.amber} />
        <Stat label="Jobs Completed" value="15" sub="This month" icon="📦" color={T.violet} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20, marginBottom:20 }}>
        {/* Revenue Chart */}
        <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:20 }}>
          <div style={{ fontSize:15, fontWeight:700, color:T.text, marginBottom:20 }}>Revenue vs Cost (in K₨)</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:12, height:140 }}>
            {monthData.map(d=>(
              <div key={d.m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, height:"100%" }}>
                <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"flex-end", width:"100%", gap:2 }}>
                  <div style={{ height:`${(d.rev/maxRev)*100}%`, background:`linear-gradient(180deg,${T.accent},${T.accent}88)`,
                    borderRadius:"4px 4px 0 0", minHeight:4, position:"relative" }}>
                    <div style={{ position:"absolute", top:-18, left:"50%", transform:"translateX(-50%)",
                      fontSize:10, color:T.accent2, fontWeight:700, whiteSpace:"nowrap" }}>{d.rev}K</div>
                  </div>
                </div>
                <div style={{ fontSize:11, color:T.textMuted }}>{d.m}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:16, marginTop:16 }}>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <div style={{ width:12, height:12, borderRadius:3, background:T.accent }} />
              <span style={{ fontSize:11, color:T.textMuted }}>Revenue</span>
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <div style={{ width:12, height:12, borderRadius:3, background:T.rose }} />
              <span style={{ fontSize:11, color:T.textMuted }}>Total Cost</span>
            </div>
          </div>
        </div>

        {/* Product Mix */}
        <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:20 }}>
          <div style={{ fontSize:15, fontWeight:700, color:T.text, marginBottom:16 }}>Product Mix</div>
          {[
            {type:"Gift Box", count:6, color:T.accent},
            {type:"Carton Box", count:5, color:T.cyan},
            {type:"Luxury Box", count:3, color:T.violet},
            {type:"Paper Bag", count:1, color:T.amber},
          ].map(p=>(
            <div key={p.type} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:T.textDim }}>{p.type}</span>
                <span style={{ fontSize:12, color:T.text, fontWeight:700 }}>{p.count} jobs</span>
              </div>
              <Pill val={p.count} max={6} color={p.color} />
            </div>
          ))}
        </div>
      </div>

      {/* Client-wise report */}
      <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontSize:15, fontWeight:700, color:T.text }}>Client Performance Report</div>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:T.bgCard2 }}>
            {["Client","Jobs","Revenue","Avg Margin","Outstanding","Category"].map(h=>(
              <th key={h} style={{ padding:"11px 16px", textAlign:"left", fontSize:11, color:T.textMuted,
                fontWeight:700, borderBottom:`1px solid ${T.border}` }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {CLIENTS.slice(0,4).map((c,i)=>(
              <tr key={c.id} style={{ background:i%2===0?T.bgCard:"rgba(26,34,53,0.5)" }}>
                <td style={{ padding:"12px 16px", fontSize:13, color:T.text, fontWeight:600, borderBottom:`1px solid ${T.border}` }}>{c.name}</td>
                <td style={{ padding:"12px 16px", fontSize:12, color:T.textMuted, borderBottom:`1px solid ${T.border}` }}>{c.jobs}</td>
                <td style={{ padding:"12px 16px", fontSize:13, fontWeight:800, color:T.accent2, borderBottom:`1px solid ${T.border}` }}>₨{Math.round(c.jobs*12.5)}K</td>
                <td style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ color:T.emerald, fontWeight:700 }}>{30+Math.floor(Math.random()*15)}%</span>
                </td>
                <td style={{ padding:"12px 16px", fontSize:13, fontWeight:700, color:c.balance>0?T.rose:T.emerald, borderBottom:`1px solid ${T.border}` }}>₨{c.balance.toLocaleString()}</td>
                <td style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}><Badge label={c.category} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── OPERATOR VIEW ────────────────────────────────────────────────────────────
const OperatorView = () => {
  const operator = STAFF[2]; // Saeed Akhtar - Die Cutting
  const myJobs = JOBS.filter(j=>j.stages?.some(s=>s.operator===operator.name&&s.status==="Active"));
  const [marking, setMarking] = useState(false);
  const [qty, setQty] = useState("");
  return (
    <div style={{ flex:1, padding:24, overflowY:"auto" }}>
      {/* Operator Banner */}
      <div style={{ background:`linear-gradient(135deg, #1e2d3d, #0f1a2e)`, border:`1px solid ${T.border}`,
        borderRadius:16, padding:24, marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-20, top:-20, fontSize:100, opacity:0.04 }}>🔧</div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:`linear-gradient(135deg,${T.accent},${T.cyan})`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:900, color:"#fff" }}>
            {operator.name[0]}
          </div>
          <div>
            <div style={{ fontSize:13, color:T.textMuted, fontWeight:600 }}>OPERATOR DASHBOARD</div>
            <div style={{ fontSize:22, fontWeight:800, color:T.text }}>{operator.name}</div>
            <div style={{ fontSize:13, color:T.textDim }}>{operator.role} · {operator.dept}</div>
          </div>
          <div style={{ marginLeft:"auto", textAlign:"right" }}>
            <div style={{ fontSize:11, color:T.textMuted }}>Earning this month</div>
            <div style={{ fontSize:26, fontWeight:900, color:T.emerald }}>₨{operator.thisMonth.toLocaleString()}</div>
            <div style={{ fontSize:11, color:T.textMuted }}>Rate: ₨{operator.rate}/hr</div>
          </div>
        </div>
      </div>

      {/* Active Job */}
      {myJobs.length>0 ? (
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:14 }}>⚡ Active Stage — Ready to Work</div>
          {myJobs.map(job=>{
            const stage = job.stages.find(s=>s.operator===operator.name&&s.status==="Active");
            return (
              <div key={job.id} style={{ background:T.bgCard, border:`2px solid ${T.accent}`,
                borderRadius:16, padding:24, marginBottom:20,
                boxShadow:`0 0 30px rgba(59,130,246,0.15)` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <div>
                    <div style={{ fontSize:12, color:T.accent2, fontWeight:700 }}>{job.id}</div>
                    <div style={{ fontSize:18, fontWeight:800, color:T.text, margin:"4px 0" }}>{job.title}</div>
                    <div style={{ fontSize:13, color:T.textMuted }}>Client: {job.client} · Total: {job.qty.toLocaleString()} pcs</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <Badge label="Active stage" />
                    <div style={{ fontSize:12, color:T.amber, marginTop:6, fontWeight:600 }}>Due: {job.deadline}</div>
                  </div>
                </div>
                {/* Stage info */}
                <div style={{ background:T.bgCard2, borderRadius:12, padding:16, marginBottom:16 }}>
                  <div style={{ fontSize:13, color:T.textMuted, marginBottom:8 }}>CURRENT STAGE</div>
                  <div style={{ fontSize:20, fontWeight:800, color:T.accent2 }}>{stage?.name}</div>
                  <div style={{ fontSize:12, color:T.textMuted, marginTop:4 }}>Previous stage: Lamination completed — 9,950 pcs received</div>
                </div>
                {!marking ? (
                  <Btn label="▶ Start / Mark Complete" onClick={()=>setMarking(true)} color={T.emerald} style={{ width:"100%", justifyContent:"center" }} />
                ) : (
                  <div style={{ background:T.bgCard2, borderRadius:12, padding:16 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:T.text, marginBottom:14 }}>Stage Completion Form</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
                      <Input label="Quantity Completed" placeholder="e.g. 9800" value={qty} onChange={setQty} type="number" />
                      <Input label="Quantity Rejected" placeholder="e.g. 150" type="number" />
                      <Input label="Time Taken (hrs)" placeholder="e.g. 4.5" type="number" />
                      <Select label="Machine Used" options={["Die Cut Machine 1","Die Cut Machine 2"]} />
                    </div>
                    <div style={{ marginBottom:16 }}>
                      <div style={{ fontSize:12, color:T.textDim, fontWeight:600, marginBottom:6, letterSpacing:"0.04em" }}>NOTES / ISSUES</div>
                      <textarea placeholder="Any quality notes, machine issues..." rows={2} style={{
                        width:"100%", background:T.bgCard3, border:`1px solid ${T.border2}`,
                        borderRadius:8, padding:"10px 14px", color:T.text, fontSize:13,
                        outline:"none", boxSizing:"border-box", fontFamily:"inherit", resize:"none"
                      }} />
                    </div>
                    {qty && <div style={{ background:"rgba(16,185,129,0.1)", border:`1px solid rgba(16,185,129,0.3)`,
                      borderRadius:10, padding:"12px 16px", marginBottom:14 }}>
                      <div style={{ fontSize:12, color:T.textMuted, marginBottom:4 }}>AUTO EARNING CALCULATION</div>
                      <div style={{ fontSize:18, fontWeight:900, color:T.emerald }}>
                        ₨{(parseFloat(qty||0)*operator.rate).toLocaleString()} earned for this stage
                      </div>
                      <div style={{ fontSize:11, color:T.textMuted }}>{qty} hrs × ₨{operator.rate}/hr</div>
                    </div>}
                    <div style={{ display:"flex", gap:10 }}>
                      <Btn label="Cancel" ghost onClick={()=>setMarking(false)} style={{ flex:1, justifyContent:"center" }} />
                      <Btn label="✅ Submit & Complete Stage" color={T.emerald} onClick={()=>setMarking(false)} style={{ flex:2, justifyContent:"center" }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign:"center", padding:"60px 0", color:T.textMuted }}>
          <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
          <div style={{ fontSize:16, fontWeight:600 }}>No active stages right now</div>
          <div style={{ fontSize:13, marginTop:4 }}>You'll be notified when the next stage is ready</div>
        </div>
      )}

      {/* Earnings breakdown */}
      <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:20 }}>
        <div style={{ fontSize:15, fontWeight:700, color:T.text, marginBottom:16 }}>My Earnings — December 2024</div>
        {[
          {job:"PKG-2024-0047",stage:"Die Cutting",qty:"18,000 pcs",time:"4.5 hrs",earning:810},
          {job:"PKG-2024-0048",stage:"Die Cutting",qty:"12,000 pcs",time:"3.2 hrs",earning:576},
          {job:"PKG-2024-0049",stage:"Die Cutting",qty:"24,500 pcs",time:"5.8 hrs",earning:1044},
          {job:"PKG-2024-0050",stage:"Die Cutting",qty:"8,000 pcs",time:"2.1 hrs",earning:378},
        ].map(e=>(
          <div key={e.job} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"11px 0", borderBottom:`1px solid ${T.border}` }}>
            <div>
              <div style={{ fontSize:12, color:T.accent2, fontWeight:700 }}>{e.job}</div>
              <div style={{ fontSize:12, color:T.textMuted }}>{e.stage} · {e.time}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:14, fontWeight:800, color:T.emerald }}>₨{e.earning}</div>
              <div style={{ fontSize:11, color:T.textMuted }}>{e.qty}</div>
            </div>
          </div>
        ))}
        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:12, paddingTop:12, borderTop:`1px solid ${T.border}` }}>
          <div style={{ fontSize:18, fontWeight:900, color:T.emerald }}>Total: ₨{operator.thisMonth.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

// ─── CLIENT PORTAL ────────────────────────────────────────────────────────────
const ClientPortal = () => {
  const client = CLIENTS[2]; // Royal Cosmetics
  const clientJobs = JOBS.filter(j=>j.clientId===client.id);
  return (
    <div style={{ flex:1, padding:24, overflowY:"auto" }}>
      {/* Client Banner */}
      <div style={{ background:`linear-gradient(135deg, #1e2d3d, #0f1a2e)`, border:`1px solid ${T.border}`,
        borderRadius:16, padding:24, marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:200,
          background:"linear-gradient(90deg,transparent,rgba(59,130,246,0.05))" }} />
        <div style={{ fontSize:11, color:T.accent2, fontWeight:700, letterSpacing:"0.08em", marginBottom:8 }}>CLIENT PORTAL</div>
        <div style={{ fontSize:22, fontWeight:900, color:T.text }}>{client.name}</div>
        <div style={{ fontSize:13, color:T.textMuted, marginTop:2 }}>{client.contact} · {client.email}</div>
        <div style={{ display:"flex", gap:16, marginTop:16 }}>
          {[{l:"Active Orders",v:clientJobs.filter(j=>j.status==="In Progress"||j.status==="Overdue").length},{l:"Delivered",v:1},{l:"Outstanding",v:`₨${client.balance.toLocaleString()}`}].map(s=>(
            <div key={s.l} style={{ background:"rgba(255,255,255,0.05)", borderRadius:10, padding:"10px 16px" }}>
              <div style={{ fontSize:11, color:T.textMuted }}>{s.l}</div>
              <div style={{ fontSize:18, fontWeight:800, color:T.text }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* My Orders */}
      <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:14 }}>My Orders</div>
      <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:24 }}>
        {clientJobs.map(job=>{
          const pct = Math.round((job.currentStage/job.pipeline.length)*100);
          const statusColor = {"In Progress":T.accent,"Overdue":T.rose,"Delivered":T.emerald,"Ready for Delivery":T.cyan}[job.status]||T.accent;
          return (
            <div key={job.id} style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:12, color:T.accent2, fontWeight:700 }}>{job.id}</div>
                  <div style={{ fontSize:16, fontWeight:800, color:T.text, margin:"4px 0" }}>{job.title}</div>
                  <div style={{ fontSize:12, color:T.textMuted }}>Qty: {job.qty.toLocaleString()} pcs · Due: {job.deadline}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <Badge label={job.status} />
                  <Badge label={job.priority} />
                </div>
              </div>
              {/* Progress */}
              <div style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:12, color:T.textMuted }}>Progress: Stage {job.currentStage} of {job.pipeline.length}</span>
                  <span style={{ fontSize:12, color:statusColor, fontWeight:700 }}>{pct}%</span>
                </div>
                <div style={{ height:8, background:"rgba(255,255,255,0.06)", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ width:`${pct}%`, height:"100%", background:statusColor, borderRadius:4,
                    boxShadow:`0 0 10px ${statusColor}88` }} />
                </div>
              </div>
              {/* Stage pills */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {job.pipeline.map((stage,i)=>{
                  const isDone = i<job.currentStage-1;
                  const isActive = i===job.currentStage-1;
                  return (
                    <div key={stage} style={{
                      padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600,
                      background: isDone?"rgba(16,185,129,0.15)":isActive?"rgba(59,130,246,0.2)":"rgba(255,255,255,0.04)",
                      border:`1px solid ${isDone?"rgba(16,185,129,0.3)":isActive?"rgba(59,130,246,0.4)":T.border}`,
                      color: isDone?T.emerald:isActive?T.accent2:T.textMuted,
                    }}>
                      {isDone?"✓ ":isActive?"⚡ ":""}{stage}
                    </div>
                  );
                })}
              </div>
              {/* Design approval if in design stage */}
              {job.stages?.[0]?.status==="Active" && (
                <div style={{ background:"rgba(245,158,11,0.1)", border:`1px solid rgba(245,158,11,0.3)`,
                  borderRadius:10, padding:"12px 16px", marginTop:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:T.amber }}>⚠️ Design Approval Required</div>
                    <div style={{ fontSize:12, color:T.textMuted, marginTop:2 }}>Please review and approve the design to proceed</div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <Btn label="✓ Approve" color={T.emerald} style={{ padding:"7px 14px", fontSize:12 }} />
                    <Btn label="✗ Revision" ghost style={{ padding:"7px 14px", fontSize:12 }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Invoices */}
      <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:14 }}>My Invoices</div>
      <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, overflow:"hidden" }}>
        {INVOICES.filter(inv=>inv.client===client.name).map((inv,i,arr)=>(
          <div key={inv.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"14px 20px", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{inv.id}</div>
              <div style={{ fontSize:11, color:T.textMuted }}>Date: {inv.date} · Due: {inv.due}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:14, fontWeight:800, color:T.text }}>₨{inv.amount.toLocaleString()}</div>
                <div style={{ fontSize:11, color:inv.status==="Paid"?T.emerald:T.rose }}>{inv.status}</div>
              </div>
              <Btn label="📥 Download" ghost style={{ padding:"6px 12px", fontSize:11 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SETTINGS ────────────────────────────────────────────────────────────────
const SettingsView = () => {
  const [section, setSection] = useState("Company");
  const sections = ["Company","Stage Library","User Roles","Material Categories","Notifications","Tax & Finance"];
  return (
    <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
      {/* Settings nav */}
      <div style={{ width:200, borderRight:`1px solid ${T.border}`, padding:16, flexShrink:0 }}>
        <div style={{ fontSize:13, color:T.textMuted, fontWeight:600, marginBottom:12, letterSpacing:"0.05em" }}>SETTINGS</div>
        {sections.map(s=>(
          <div key={s} onClick={()=>setSection(s)} style={{
            padding:"9px 12px", borderRadius:9, marginBottom:3, cursor:"pointer", fontSize:13,
            background:section===s?"rgba(59,130,246,0.15)":"transparent",
            color:section===s?T.accent2:T.textMuted, fontWeight:section===s?700:400,
            border:`1px solid ${section===s?"rgba(59,130,246,0.25)":"transparent"}`
          }}>{s}</div>
        ))}
      </div>
      <div style={{ flex:1, padding:24, overflowY:"auto" }}>
        {section==="Stage Library" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <div style={{ fontSize:18, fontWeight:800, color:T.text }}>Stage Library</div>
                <div style={{ fontSize:12, color:T.textMuted, marginTop:2 }}>All available production stages — fully dynamic</div>
              </div>
              <Btn label="+ Add Stage" />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {STAGES_LIBRARY.map((s,i)=>(
                <div key={s} style={{ display:"flex", alignItems:"center", gap:12,
                  background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 16px" }}>
                  <span style={{ fontSize:12, color:T.accent2, fontWeight:800, width:24 }}>{i+1}</span>
                  <span style={{ flex:1, fontSize:13, color:T.text, fontWeight:600 }}>{s}</span>
                  <Badge label="Active" />
                  <button style={{ background:"none", border:"none", color:T.textMuted, cursor:"pointer", fontSize:13 }}>✏️</button>
                  <button style={{ background:"none", border:"none", color:T.rose, cursor:"pointer", fontSize:13 }}>🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {section==="Company" && (
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:T.text, marginBottom:20 }}>Company Settings</div>
            <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:24 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
                <Input label="Company Name" value="PackagePro Industries" />
                <Input label="Registration No." value="REG-2019-08821" />
                <Input label="Phone" value="+92-21-35xxxxxx" />
                <Input label="Email" value="info@packagepro.pk" />
                <Input label="Address" value="Industrial Area, Karachi" style={{ gridColumn:"span 2" }} />
                <Input label="Tax Rate (%)" value="17" />
                <Input label="Currency Symbol" value="₨" />
              </div>
              <div style={{ marginTop:8 }}>
                <Btn label="Save Changes" color={T.emerald} />
              </div>
            </div>
          </div>
        )}
        {section!=="Company"&&section!=="Stage Library"&&(
          <div style={{ textAlign:"center", padding:"80px 0", color:T.textMuted }}>
            <div style={{ fontSize:40, marginBottom:12 }}>⚙️</div>
            <div style={{ fontSize:16, fontWeight:600 }}>{section} Settings</div>
            <div style={{ fontSize:13, marginTop:4 }}>Configure {section.toLowerCase()} options here</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── PRODUCTION VIEW ──────────────────────────────────────────────────────────
const ProductionView = () => (
  <div style={{ flex:1, padding:24, overflowY:"auto" }}>
    <SectionTitle title="Production Management" sub="Stage-wise overview with operator assignments" />
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
      {STAFF.slice(0,6).map(s=>{
        const activeJob = JOBS.find(j=>j.stages?.some(st=>st.operator===s.name&&st.status==="Active"));
        return (
          <div key={s.id} style={{ background:T.bgCard, border:`1px solid ${activeJob?T.accent:T.border}`,
            borderRadius:14, padding:18, boxShadow:activeJob?`0 0 20px rgba(59,130,246,0.1)`:"none" }}>
            <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:`linear-gradient(135deg,${T.accent},${T.violet})`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:"#fff" }}>
                {s.name[0]}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{s.name}</div>
                <div style={{ fontSize:11, color:T.textMuted }}>{s.role}</div>
              </div>
              <div style={{ marginLeft:"auto" }}>
                {activeJob ? <Badge label="Working" color="emerald" /> : <Badge label="Available" color="textMuted" />}
              </div>
            </div>
            {activeJob ? (
              <div style={{ background:"rgba(59,130,246,0.08)", border:`1px solid rgba(59,130,246,0.2)`,
                borderRadius:10, padding:"10px 12px" }}>
                <div style={{ fontSize:11, color:T.accent2, fontWeight:700 }}>{activeJob.id}</div>
                <div style={{ fontSize:12, color:T.text, fontWeight:600 }}>{activeJob.title.slice(0,30)}...</div>
                <div style={{ fontSize:11, color:T.textMuted, marginTop:4 }}>
                  Stage: {activeJob.stages?.find(st=>st.operator===s.name&&st.status==="Active")?.name}
                </div>
              </div>
            ) : (
              <div style={{ fontSize:12, color:T.textMuted, textAlign:"center", padding:"12px 0" }}>No active assignment</div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:12, paddingTop:12, borderTop:`1px solid ${T.border}` }}>
              <span style={{ fontSize:11, color:T.textMuted }}>This month</span>
              <span style={{ fontSize:13, fontWeight:800, color:T.emerald }}>₨{s.thisMonth.toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
    <SectionTitle title="All Active Stages" sub="Jobs currently being worked on" />
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {JOBS.filter(j=>j.stages?.some(s=>s.status==="Active")).map(job=>{
        const activeStage = job.stages?.find(s=>s.status==="Active");
        return (
          <div key={job.id} style={{ background:T.bgCard, border:`1px solid ${T.border}`,
            borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", gap:8, marginBottom:4 }}>
                <span style={{ fontSize:12, color:T.accent2, fontWeight:700 }}>{job.id}</span>
                <Badge label={job.priority} />
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{job.title}</div>
            </div>
            <div style={{ textAlign:"center", minWidth:120 }}>
              <div style={{ fontSize:11, color:T.textMuted }}>CURRENT STAGE</div>
              <div style={{ fontSize:14, fontWeight:700, color:T.accent2, marginTop:2 }}>{activeStage?.name}</div>
            </div>
            <div style={{ textAlign:"center", minWidth:120 }}>
              <div style={{ fontSize:11, color:T.textMuted }}>OPERATOR</div>
              <div style={{ fontSize:13, fontWeight:700, color:T.text, marginTop:2 }}>{activeStage?.operator}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11, color:T.textMuted }}>DEADLINE</div>
              <div style={{ fontSize:12, fontWeight:700, color:job.status==="Overdue"?T.rose:T.amber, marginTop:2 }}>{job.deadline}</div>
            </div>
            <Badge label={job.status} />
          </div>
        );
      })}
    </div>
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const pageMap = {
    dashboard:    { title:"Dashboard", sub:"Welcome back — here's what's happening today" },
    jobs:         { title:"Job Orders", sub:"Create and manage all production jobs" },
    pipeline:     { title:"Pipeline View", sub:"Visual production flow board" },
    production:   { title:"Production", sub:"Stage and operator management" },
    clients:      { title:"Clients", sub:"Client profiles, history and portal access" },
    staff:        { title:"Staff & Earnings", sub:"Team management and salary processing" },
    stock:        { title:"Stock & Materials", sub:"Inventory management with auto-deduction" },
    finance:      { title:"Finance & Invoices", sub:"Invoicing, payments and financial reports" },
    reports:      { title:"Reports & Analytics", sub:"Business intelligence and performance metrics" },
    operator:     { title:"Operator Dashboard", sub:"Logged in as: Saeed Akhtar (Die Cutting)" },
    client_portal:{ title:"Client Portal", sub:"Logged in as: Royal Cosmetics" },
    settings:     { title:"Settings", sub:"Configure system — stages, roles, materials, notifications" },
  };
  const page = pageMap[active] || pageMap.dashboard;

  return (
    <div style={{
      display:"flex", minHeight:"100vh",
      background:T.bg, color:T.text,
      fontFamily:"'SF Pro Display', -apple-system, 'Segoe UI', system-ui, sans-serif",
    }}>
      <Sidebar active={active} setActive={setActive} notifCount={notifs.filter(n=>!n.read).length} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:"100vh", overflow:"hidden" }}>
        <Topbar
          title={page.title} sub={page.sub}
          notifications={notifs}
          showNotif={showNotif} setShowNotif={setShowNotif}
          setActive={setActive}
        />
        <div style={{ flex:1, overflow:"hidden", display:"flex" }}>
          {active==="dashboard"    && <Dashboard jobs={JOBS} setActive={setActive} setSelectedJob={setSelectedJob} />}
          {active==="jobs"         && <JobOrdersView jobs={JOBS} selectedJob={selectedJob} setSelectedJob={setSelectedJob} />}
          {active==="pipeline"     && <PipelineView />}
          {active==="production"   && <ProductionView />}
          {active==="clients"      && <ClientsView />}
          {active==="staff"        && <StaffView />}
          {active==="stock"        && <StockView />}
          {active==="finance"      && <FinanceView />}
          {active==="reports"      && <ReportsView />}
          {active==="operator"     && <OperatorView />}
          {active==="client_portal"&& <ClientPortal />}
          {active==="settings"     && <SettingsView />}
        </div>
      </div>
    </div>
  );
}
