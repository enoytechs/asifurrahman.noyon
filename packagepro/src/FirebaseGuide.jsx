import { useState, useEffect, useCallback } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PACKAGEPRO × FIREBASE — COMPLETE INTEGRATION GUIDE + WORKING APP
//  This single file shows EVERYTHING you need to connect PackagePro to Firebase
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  bg:"#080c14", bgCard:"#0f1623", bgCard2:"#141e2e", bgCard3:"#192234",
  border:"#1c2a3e", border2:"#243447",
  accent:"#f97316", accent2:"#fb923c", accentGlow:"rgba(249,115,22,0.12)",
  blue:"#3b82f6", blue2:"#60a5fa",
  green:"#10b981", green2:"#34d399",
  red:"#ef4444", red2:"#f87171",
  yellow:"#f59e0b", yellow2:"#fbbf24",
  violet:"#8b5cf6",
  text:"#f1f5f9", textMuted:"#64748b", textDim:"#94a3b8",
  firebase:"#FF6F00", firebaseLight:"#FFA726",
};

// ─── TINY HELPERS ─────────────────────────────────────────────────────────────
const Badge = ({ label, color = "blue" }) => {
  const map = {
    blue:   { bg:"rgba(59,130,246,0.15)",  text:"#93c5fd", border:"rgba(59,130,246,0.3)" },
    green:  { bg:"rgba(16,185,129,0.15)",  text:"#6ee7b7", border:"rgba(16,185,129,0.3)" },
    orange: { bg:"rgba(249,115,22,0.15)",  text:"#fdba74", border:"rgba(249,115,22,0.3)" },
    red:    { bg:"rgba(239,68,68,0.15)",   text:"#fca5a5", border:"rgba(239,68,68,0.3)" },
    yellow: { bg:"rgba(245,158,11,0.15)",  text:"#fcd34d", border:"rgba(245,158,11,0.3)" },
    violet: { bg:"rgba(139,92,246,0.15)",  text:"#c4b5fd", border:"rgba(139,92,246,0.3)" },
    grey:   { bg:"rgba(100,116,139,0.15)", text:"#94a3b8", border:"rgba(100,116,139,0.3)" },
    firebase:{ bg:"rgba(255,111,0,0.15)", text:"#FFA726",  border:"rgba(255,111,0,0.3)" },
  };
  const s = map[color] || map.blue;
  return (
    <span style={{ background:s.bg, color:s.text, border:`1px solid ${s.border}`,
      borderRadius:6, padding:"2px 9px", fontSize:11, fontWeight:700, letterSpacing:"0.02em" }}>
      {label}
    </span>
  );
};

const CodeBlock = ({ code, lang = "javascript" }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  // Simple syntax highlighting
  const highlight = (text) => {
    return text
      .replace(/\/\/.+/g, m => `<span style="color:#64748b;font-style:italic">${m}</span>`)
      .replace(/(".*?"|'.*?'|`[\s\S]*?`)/g, m => `<span style="color:#86efac">${m}</span>`)
      .replace(/\b(import|export|from|const|let|var|function|return|await|async|if|else|new|true|false|null|undefined|default|class|extends)\b/g,
        m => `<span style="color:#f97316;font-weight:600">${m}</span>`)
      .replace(/\b(firebase|firestore|auth|db|collection|doc|getDoc|getDocs|setDoc|addDoc|updateDoc|deleteDoc|onSnapshot|signInWithEmailAndPassword|createUserWithEmailAndPassword|where|orderBy|limit|query|serverTimestamp|initializeApp|getFirestore|getAuth)\b/g,
        m => `<span style="color:#60a5fa">${m}</span>`);
  };
  return (
    <div style={{ position:"relative", marginBottom:16 }}>
      <div style={{ position:"absolute", top:10, right:10, zIndex:2, display:"flex", gap:8, alignItems:"center" }}>
        {lang && <span style={{ fontSize:10, color:T.textMuted, background:T.bgCard3,
          border:`1px solid ${T.border}`, borderRadius:4, padding:"2px 8px" }}>{lang}</span>}
        <button onClick={copy} style={{
          background:copied ? T.green : T.bgCard3, border:`1px solid ${copied?T.green:T.border2}`,
          color:copied ? "#fff" : T.textMuted, borderRadius:6, padding:"4px 12px",
          fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:600, transition:"all 0.2s"
        }}>{copied ? "✓ Copied!" : "Copy"}</button>
      </div>
      <pre style={{
        background:"#0a0f1a", border:`1px solid ${T.border}`, borderRadius:12,
        padding:"18px 20px", paddingTop:44, overflowX:"auto", margin:0,
        fontSize:12.5, lineHeight:1.7, fontFamily:"'JetBrains Mono','Fira Code','Courier New',monospace",
        color:"#e2e8f0",
      }}>
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  );
};

const Step = ({ num, title, children, done }) => (
  <div style={{ display:"flex", gap:20, marginBottom:32 }}>
    <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div style={{
        width:40, height:40, borderRadius:"50%",
        background: done ? T.green : `linear-gradient(135deg, ${T.accent}, ${T.firebaseLight})`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:done?18:15, fontWeight:900, color:"#fff",
        boxShadow: done ? `0 0 16px rgba(16,185,129,0.4)` : `0 0 20px rgba(249,115,22,0.35)`,
        flexShrink:0,
      }}>{done ? "✓" : num}</div>
      <div style={{ width:2, flex:1, minHeight:20, background:T.border, marginTop:8 }} />
    </div>
    <div style={{ flex:1, paddingBottom:16 }}>
      <div style={{ fontSize:17, fontWeight:800, color:T.text, marginBottom:12,
        letterSpacing:"-0.02em" }}>{title}</div>
      {children}
    </div>
  </div>
);

const InfoBox = ({ children, color = "blue", icon = "ℹ️" }) => {
  const map = {
    blue:   { bg:"rgba(59,130,246,0.08)",  border:"rgba(59,130,246,0.25)",  text:"#93c5fd" },
    green:  { bg:"rgba(16,185,129,0.08)",  border:"rgba(16,185,129,0.25)",  text:"#6ee7b7" },
    orange: { bg:"rgba(249,115,22,0.08)",  border:"rgba(249,115,22,0.25)",  text:"#fdba74" },
    red:    { bg:"rgba(239,68,68,0.08)",   border:"rgba(239,68,68,0.25)",   text:"#fca5a5" },
    yellow: { bg:"rgba(245,158,11,0.08)",  border:"rgba(245,158,11,0.25)",  text:"#fcd34d" },
  };
  const s = map[color] || map.blue;
  return (
    <div style={{ background:s.bg, border:`1px solid ${s.border}`,
      borderRadius:10, padding:"14px 18px", marginBottom:16,
      borderLeft:`3px solid ${s.border.replace("0.25","0.8")}` }}>
      <div style={{ fontSize:13, color:T.textDim, lineHeight:1.6 }}>
        <span style={{ marginRight:8 }}>{icon}</span>{children}
      </div>
    </div>
  );
};

const SectionHeader = ({ icon, title, sub, badge }) => (
  <div style={{
    background:`linear-gradient(135deg, #0f1a2e, #0a0f1a)`,
    border:`1px solid ${T.border}`, borderRadius:16, padding:"24px 28px",
    marginBottom:28, position:"relative", overflow:"hidden",
  }}>
    <div style={{ position:"absolute", right:-10, top:-10, fontSize:80, opacity:0.04 }}>{icon}</div>
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
      <span style={{ fontSize:28 }}>{icon}</span>
      {badge && <Badge label={badge} color="firebase" />}
    </div>
    <div style={{ fontSize:22, fontWeight:900, color:T.text, letterSpacing:"-0.03em" }}>{title}</div>
    {sub && <div style={{ fontSize:14, color:T.textMuted, marginTop:4 }}>{sub}</div>}
  </div>
);

// ─── FIREBASE COLLECTION SCHEMA VISUAL ───────────────────────────────────────
const SchemaCard = ({ collection, icon, fields, color = "blue" }) => {
  const colorMap = {
    blue: T.blue, orange: T.accent, green: T.green, violet: T.violet, yellow: T.yellow
  };
  const c = colorMap[color] || T.blue;
  return (
    <div style={{ background:T.bgCard2, border:`1px solid ${T.border}`, borderRadius:12,
      padding:18, borderTop:`3px solid ${c}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <span style={{ fontSize:20 }}>{icon}</span>
        <span style={{ fontSize:14, fontWeight:800, color:c, fontFamily:"monospace" }}>/{collection}</span>
        <span style={{ fontSize:11, color:T.textMuted, marginLeft:"auto" }}>Collection</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
        {fields.map(f => (
          <div key={f.name} style={{ display:"flex", alignItems:"center", gap:10,
            padding:"5px 8px", background:T.bgCard3, borderRadius:6 }}>
            <span style={{ fontSize:11, color:T.textMuted, fontFamily:"monospace", minWidth:140 }}>{f.name}</span>
            <span style={{ fontSize:10, color:c, background:`${c}22`, borderRadius:4,
              padding:"1px 7px", fontFamily:"monospace" }}>{f.type}</span>
            {f.note && <span style={{ fontSize:10, color:T.textMuted }}>{f.note}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── TAB NAVIGATION ──────────────────────────────────────────────────────────
const TABS = [
  { id:"setup",     icon:"🚀", label:"Step 1: Setup" },
  { id:"schema",    icon:"🗄️", label:"Step 2: Database" },
  { id:"connect",   icon:"🔌", label:"Step 3: Connect" },
  { id:"auth",      icon:"🔐", label:"Step 4: Auth" },
  { id:"realtime",  icon:"⚡", label:"Step 5: Realtime" },
  { id:"rules",     icon:"🛡️", label:"Step 6: Rules" },
  { id:"seed",      icon:"🌱", label:"Step 7: Seed Data" },
  { id:"deploy",    icon:"🌍", label:"Step 8: Deploy" },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MAIN APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function App() {
  const [tab, setTab] = useState("setup");
  const [checklist, setChecklist] = useState({});
  const toggle = (key) => setChecklist(p => ({ ...p, [key]: !p[key] }));

  const Check = ({ id, label }) => (
    <div onClick={() => toggle(id)} style={{
      display:"flex", alignItems:"center", gap:12, padding:"10px 14px",
      background:checklist[id] ? "rgba(16,185,129,0.08)" : T.bgCard3,
      border:`1px solid ${checklist[id] ? "rgba(16,185,129,0.3)" : T.border}`,
      borderRadius:9, cursor:"pointer", marginBottom:8, transition:"all 0.15s",
    }}>
      <div style={{
        width:20, height:20, borderRadius:6, flexShrink:0,
        background:checklist[id] ? T.green : "transparent",
        border:`2px solid ${checklist[id] ? T.green : T.textMuted}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:11, color:"#fff", fontWeight:900,
      }}>{checklist[id] ? "✓" : ""}</div>
      <span style={{ fontSize:13, color:checklist[id] ? T.text : T.textDim, fontWeight:checklist[id] ? 600 : 400 }}>{label}</span>
    </div>
  );

  const content = {

    // ── STEP 1: SETUP ─────────────────────────────────────────────────────────
    setup: (
      <div>
        <SectionHeader icon="🚀" title="Firebase Project Setup" badge="Start Here"
          sub="Create your Firebase project and install packages into your React app" />

        <Step num={1} title="Create Firebase Project" done={checklist.c1}>
          <InfoBox color="orange" icon="📌">
            Go to <strong style={{color:T.accent2}}>console.firebase.google.com</strong> → Click <strong>"Add project"</strong> → Name it <strong>"packagepro"</strong> → Disable Google Analytics (not needed) → Click Create Project
          </InfoBox>
          <Check id="c1" label="Firebase project created at console.firebase.google.com" />
        </Step>

        <Step num={2} title="Enable Firestore Database" done={checklist.c2}>
          <InfoBox color="blue" icon="🗄️">
            In your Firebase project → Left sidebar → <strong>"Firestore Database"</strong> → Click <strong>"Create database"</strong> → Choose <strong>"Start in test mode"</strong> (we'll secure it in Step 6) → Select your region → Done
          </InfoBox>
          <Check id="c2" label="Firestore Database created in test mode" />
        </Step>

        <Step num={3} title="Enable Authentication" done={checklist.c3}>
          <InfoBox color="violet" icon="🔐">
            Left sidebar → <strong>"Authentication"</strong> → <strong>"Get started"</strong> → Click <strong>"Email/Password"</strong> → Enable it → Save
          </InfoBox>
          <Check id="c3" label="Email/Password Authentication enabled" />
        </Step>

        <Step num={4} title="Get Your Config Keys" done={checklist.c4}>
          <InfoBox color="yellow" icon="🔑">
            Project Settings (gear icon) → <strong>"Your apps"</strong> → Click <strong>"Web app" (&lt;/&gt;)</strong> → Register app → Copy the <code style={{color:T.accent2}}>firebaseConfig</code> object — you'll need it in Step 3
          </InfoBox>
          <Check id="c4" label="Copied firebaseConfig object from Project Settings" />
        </Step>

        <Step num={5} title="Create Your React Project" done={checklist.c5}>
          <div style={{ fontSize:13, color:T.textMuted, marginBottom:12 }}>
            Open terminal and run these commands one by one:
          </div>
          <CodeBlock lang="bash" code={`# 1. Create React app (skip if you already have one)
npx create-react-app packagepro
cd packagepro

# 2. Install Firebase SDK
npm install firebase

# 3. Start the development server
npm start
# App opens at http://localhost:3000`} />
          <Check id="c5" label="React project created and Firebase installed (npm install firebase)" />
        </Step>

        <Step num={6} title="Project Folder Structure" done={checklist.c6}>
          <div style={{ fontSize:13, color:T.textMuted, marginBottom:12 }}>
            Create this folder structure in your <code style={{color:T.accent2}}>src/</code> folder:
          </div>
          <CodeBlock lang="text" code={`src/
├── firebase/
│   ├── config.js        ← Your Firebase keys go here
│   ├── auth.js          ← Login / logout functions
│   ├── jobs.js          ← Job CRUD operations
│   ├── clients.js       ← Client CRUD operations
│   ├── staff.js         ← Staff operations
│   ├── materials.js     ← Stock operations
│   ├── invoices.js      ← Invoice operations
│   └── notifications.js ← Notifications
├── hooks/
│   ├── useJobs.js       ← Realtime jobs listener
│   ├── useClients.js    ← Realtime clients listener
│   └── useAuth.js       ← Auth state hook
├── components/
│   └── (your UI components)
└── App.jsx              ← Main app`} />
          <Check id="c6" label="Folder structure created in src/" />
        </Step>
      </div>
    ),

    // ── STEP 2: DATABASE SCHEMA ───────────────────────────────────────────────
    schema: (
      <div>
        <SectionHeader icon="🗄️" title="Firestore Database Schema"
          sub="How all your data is organized in Firebase — 7 collections for the complete system" />

        <InfoBox color="blue" icon="📖">
          Firestore stores data as <strong>Collections → Documents → Fields</strong>. Think of Collections as tables, Documents as rows, and Fields as columns. Each document auto-generates a unique ID.
        </InfoBox>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:24 }}>
          <SchemaCard collection="clients" icon="👥" color="blue" fields={[
            {name:"name", type:"string", note:"Company name"},
            {name:"contact", type:"string", note:"Contact person"},
            {name:"phone", type:"string"},
            {name:"email", type:"string"},
            {name:"category", type:"string", note:"VIP / Regular / New"},
            {name:"creditLimit", type:"number"},
            {name:"balance", type:"number", note:"Outstanding amount"},
            {name:"status", type:"string", note:"Active / Inactive"},
            {name:"portalAccess", type:"boolean"},
            {name:"createdAt", type:"timestamp"},
          ]} />

          <SchemaCard collection="jobs" icon="📋" color="orange" fields={[
            {name:"jobId", type:"string", note:"e.g. PKG-2024-0051"},
            {name:"clientId", type:"string", note:"→ clients doc ID"},
            {name:"clientName", type:"string"},
            {name:"title", type:"string"},
            {name:"product", type:"string"},
            {name:"qty", type:"number"},
            {name:"deadline", type:"timestamp"},
            {name:"priority", type:"string", note:"Normal/Urgent/Rush"},
            {name:"status", type:"string"},
            {name:"pipeline", type:"array", note:"Stage names in order"},
            {name:"currentStage", type:"number", note:"Index in pipeline"},
            {name:"revenue", type:"number"},
            {name:"materialCost", type:"number"},
            {name:"operatorCost", type:"number"},
            {name:"createdAt", type:"timestamp"},
            {name:"createdBy", type:"string", note:"uid of manager"},
          ]} />

          <SchemaCard collection="job_stages" icon="⚡" color="green" fields={[
            {name:"jobId", type:"string", note:"→ jobs doc ID"},
            {name:"stageName", type:"string"},
            {name:"stageIndex", type:"number"},
            {name:"operatorId", type:"string", note:"→ staff doc ID"},
            {name:"operatorName", type:"string"},
            {name:"status", type:"string", note:"Pending/Active/Done"},
            {name:"qtyCompleted", type:"number"},
            {name:"qtyRejected", type:"number"},
            {name:"materialUsed", type:"array"},
            {name:"timeHours", type:"number"},
            {name:"earningAmount", type:"number", note:"Auto-calculated"},
            {name:"startedAt", type:"timestamp"},
            {name:"completedAt", type:"timestamp"},
            {name:"notes", type:"string"},
          ]} />

          <SchemaCard collection="staff" icon="👤" color="violet" fields={[
            {name:"name", type:"string"},
            {name:"role", type:"string"},
            {name:"department", type:"string"},
            {name:"earningType", type:"string", note:"Per Piece/Hour/Monthly"},
            {name:"rate", type:"number"},
            {name:"uid", type:"string", note:"Firebase Auth UID"},
            {name:"status", type:"string", note:"Active / Inactive"},
            {name:"joinedAt", type:"timestamp"},
          ]} />

          <SchemaCard collection="materials" icon="📦" color="yellow" fields={[
            {name:"name", type:"string"},
            {name:"category", type:"string"},
            {name:"unit", type:"string", note:"Sheets/Meters/KG"},
            {name:"stock", type:"number"},
            {name:"minStock", type:"number"},
            {name:"rate", type:"number", note:"Cost per unit"},
            {name:"lastUpdated", type:"timestamp"},
          ]} />

          <SchemaCard collection="invoices" icon="💰" color="blue" fields={[
            {name:"invoiceNo", type:"string", note:"e.g. INV-2024-0088"},
            {name:"jobId", type:"string"},
            {name:"clientId", type:"string"},
            {name:"amount", type:"number"},
            {name:"paid", type:"number"},
            {name:"status", type:"string", note:"Unpaid/Partial/Paid"},
            {name:"dueDate", type:"timestamp"},
            {name:"createdAt", type:"timestamp"},
          ]} />
        </div>

        <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:20 }}>
          <div style={{ fontSize:15, fontWeight:800, color:T.text, marginBottom:12 }}>🔗 How Collections Link Together</div>
          <div style={{ fontSize:13, color:T.textDim, lineHeight:2 }}>
            <code style={{color:T.accent2}}>jobs</code> → has field <code style={{color:T.accent2}}>clientId</code> → points to <code style={{color:T.blue2}}>clients</code> document<br/>
            <code style={{color:T.green2}}>job_stages</code> → has field <code style={{color:T.accent2}}>jobId</code> → points to <code style={{color:T.accent2}}>jobs</code> document<br/>
            <code style={{color:T.green2}}>job_stages</code> → has field <code style={{color:T.accent2}}>operatorId</code> → points to <code style={{color:T.violet}}>staff</code> document<br/>
            <code style={{color:T.blue2}}>invoices</code> → has fields <code style={{color:T.accent2}}>jobId</code> + <code style={{color:T.accent2}}>clientId</code> → links to both
          </div>
        </div>
      </div>
    ),

    // ── STEP 3: CONNECT ───────────────────────────────────────────────────────
    connect: (
      <div>
        <SectionHeader icon="🔌" title="Connect React to Firebase"
          sub="Create all the service files that your UI will use to read and write data" />

        <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:12 }}>
          📄 File 1: <code style={{color:T.accent2}}>src/firebase/config.js</code>
        </div>
        <InfoBox color="red" icon="🔑">
          Replace all the <code>YOUR_XXX_HERE</code> values below with the actual values from your Firebase Project Settings → Your apps → Web app config
        </InfoBox>
        <CodeBlock code={`// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// ⚠️  PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export database and auth instances
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;`} />

        <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:12, marginTop:28 }}>
          📄 File 2: <code style={{color:T.accent2}}>src/firebase/jobs.js</code>
        </div>
        <div style={{ fontSize:13, color:T.textMuted, marginBottom:12 }}>All functions to create, read, update jobs:</div>
        <CodeBlock code={`// src/firebase/jobs.js
import { db } from './config';
import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc,
  query, orderBy, where, serverTimestamp, onSnapshot
} from 'firebase/firestore';

// ── READ: Get all jobs (one time) ─────────────────────────────────────────
export async function getAllJobs() {
  const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ── READ: Get single job with all its stages ──────────────────────────────
export async function getJobWithStages(jobId) {
  // Get the job
  const jobDoc = await getDoc(doc(db, 'jobs', jobId));
  if (!jobDoc.exists()) return null;

  // Get all stages for this job
  const stagesQuery = query(
    collection(db, 'job_stages'),
    where('jobId', '==', jobId),
    orderBy('stageIndex', 'asc')
  );
  const stagesSnapshot = await getDocs(stagesQuery);
  const stages = stagesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

  return { id: jobDoc.id, ...jobDoc.data(), stages };
}

// ── CREATE: New job order ─────────────────────────────────────────────────
export async function createJob(jobData, pipeline, operatorAssignments) {
  // 1. Generate job ID
  const jobCount = (await getDocs(collection(db, 'jobs'))).size + 1;
  const year = new Date().getFullYear();
  const jobId = \`PKG-\${year}-\${String(jobCount).padStart(4,'0')}\`;

  // 2. Save the job
  const jobRef = await addDoc(collection(db, 'jobs'), {
    ...jobData,
    jobId,
    pipeline,
    currentStage: 0,
    status: 'In Progress',
    materialCost: 0,
    operatorCost: 0,
    createdAt: serverTimestamp(),
  });

  // 3. Create a stage document for each pipeline stage
  for (let i = 0; i < pipeline.length; i++) {
    await addDoc(collection(db, 'job_stages'), {
      jobId: jobRef.id,
      stageName: pipeline[i],
      stageIndex: i,
      operatorId: operatorAssignments[i]?.id || '',
      operatorName: operatorAssignments[i]?.name || '',
      status: i === 0 ? 'Active' : 'Pending',
      qtyCompleted: 0,
      qtyRejected: 0,
      timeHours: 0,
      earningAmount: 0,
      notes: '',
      startedAt: i === 0 ? serverTimestamp() : null,
      completedAt: null,
    });
  }

  return jobRef.id;
}

// ── UPDATE: Mark a stage complete ─────────────────────────────────────────
export async function completeStage(stageId, jobId, stageData, nextStageId, staffRate, earningType) {
  // 1. Calculate operator earning
  let earning = 0;
  if (earningType === 'Per Piece') earning = stageData.qtyCompleted * staffRate;
  else if (earningType === 'Per Hour') earning = stageData.timeHours * staffRate;

  // 2. Mark this stage as Done
  await updateDoc(doc(db, 'job_stages', stageId), {
    ...stageData,
    status: 'Done',
    earningAmount: earning,
    completedAt: serverTimestamp(),
  });

  // 3. Activate the next stage
  if (nextStageId) {
    await updateDoc(doc(db, 'job_stages', nextStageId), {
      status: 'Active',
      startedAt: serverTimestamp(),
    });
  }

  // 4. Update job's currentStage and add operator cost
  const jobDoc = await getDoc(doc(db, 'jobs', jobId));
  const job = jobDoc.data();
  await updateDoc(doc(db, 'jobs', jobId), {
    currentStage: job.currentStage + 1,
    operatorCost: (job.operatorCost || 0) + earning,
    status: nextStageId ? 'In Progress' : 'Ready for Delivery',
  });
}

// ── REALTIME: Listen to all jobs (live updates) ───────────────────────────
export function listenToJobs(callback) {
  const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
  // Returns an unsubscribe function — call it to stop listening
  return onSnapshot(q, (snapshot) => {
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(jobs);
  });
}`} />

        <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:12, marginTop:28 }}>
          📄 File 3: <code style={{color:T.accent2}}>src/firebase/clients.js</code>
        </div>
        <CodeBlock code={`// src/firebase/clients.js
import { db } from './config';
import { collection, addDoc, getDocs, doc, updateDoc,
  orderBy, query, serverTimestamp, onSnapshot } from 'firebase/firestore';

// Get all clients
export async function getAllClients() {
  const snapshot = await getDocs(query(collection(db, 'clients'), orderBy('name')));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Add new client
export async function addClient(data) {
  const count = (await getDocs(collection(db, 'clients'))).size + 1;
  return addDoc(collection(db, 'clients'), {
    ...data,
    id: \`CLT-\${String(count).padStart(3,'0')}\`,
    balance: 0,
    status: 'Active',
    portalAccess: false,
    createdAt: serverTimestamp(),
  });
}

// Update client balance (after payment)
export async function updateClientBalance(clientId, amount) {
  return updateDoc(doc(db, 'clients', clientId), { balance: amount });
}

// Realtime listener
export function listenToClients(callback) {
  return onSnapshot(query(collection(db, 'clients'), orderBy('name')), snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}`} />

        <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:12, marginTop:28 }}>
          📄 File 4: <code style={{color:T.accent2}}>src/firebase/staff.js</code>
        </div>
        <CodeBlock code={`// src/firebase/staff.js
import { db } from './config';
import { collection, addDoc, getDocs, doc, updateDoc,
  query, where, orderBy, serverTimestamp } from 'firebase/firestore';

// Get all staff
export async function getAllStaff() {
  const snap = await getDocs(query(collection(db, 'staff'), orderBy('name')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Get monthly earnings for a staff member
export async function getStaffMonthlyEarning(staffId, month, year) {
  const startDate = new Date(year, month - 1, 1);
  const endDate   = new Date(year, month, 1);

  const snap = await getDocs(query(
    collection(db, 'job_stages'),
    where('operatorId', '==', staffId),
    where('status', '==', 'Done'),
    where('completedAt', '>=', startDate),
    where('completedAt', '<',  endDate)
  ));

  const stages = snap.docs.map(d => d.data());
  const total  = stages.reduce((sum, s) => sum + (s.earningAmount || 0), 0);
  return { total, stages };
}

// Add staff member
export async function addStaff(data) {
  const count = (await getDocs(collection(db, 'staff'))).size + 1;
  return addDoc(collection(db, 'staff'), {
    ...data,
    staffId: \`STF-\${String(count).padStart(3,'0')}\`,
    status: 'Active',
    joinedAt: serverTimestamp(),
  });
}`} />

        <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:12, marginTop:28 }}>
          📄 File 5: <code style={{color:T.accent2}}>src/firebase/materials.js</code>
        </div>
        <CodeBlock code={`// src/firebase/materials.js
import { db } from './config';
import { collection, doc, getDocs, updateDoc, addDoc,
  query, orderBy, onSnapshot, serverTimestamp, increment } from 'firebase/firestore';

// Get all materials
export async function getAllMaterials() {
  const snap = await getDocs(query(collection(db, 'materials'), orderBy('name')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Deduct material stock (called when operator completes a stage)
export async function deductStock(materialId, quantity) {
  return updateDoc(doc(db, 'materials', materialId), {
    stock: increment(-quantity),  // Firebase increment — safe for concurrent updates!
    lastUpdated: serverTimestamp(),
  });
}

// Add stock (when purchasing material)
export async function addStock(materialId, quantity, purchaseRate) {
  return updateDoc(doc(db, 'materials', materialId), {
    stock: increment(quantity),
    rate: purchaseRate, // Update rate to latest purchase price
    lastUpdated: serverTimestamp(),
  });
}

// Listen for low stock alerts (realtime)
export function listenToLowStock(callback) {
  return onSnapshot(collection(db, 'materials'), snap => {
    const lowStock = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(m => m.stock < m.minStock);
    callback(lowStock);
  });
}`} />
      </div>
    ),

    // ── STEP 4: AUTH ──────────────────────────────────────────────────────────
    auth: (
      <div>
        <SectionHeader icon="🔐" title="Authentication & User Roles"
          sub="Login system with 5 roles — Admin, Manager, Operator, Accountant, Client" />

        <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:12 }}>
          📄 <code style={{color:T.accent2}}>src/firebase/auth.js</code> — All auth functions
        </div>
        <CodeBlock code={`// src/firebase/auth.js
import { auth, db } from './config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// ── LOGIN ──────────────────────────────────────────────────────────────────
export async function login(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);

  // Get user profile from Firestore (has role info)
  const profile = await getUserProfile(result.user.uid);
  return { user: result.user, profile };
}

// ── LOGOUT ─────────────────────────────────────────────────────────────────
export async function logout() {
  return signOut(auth);
}

// ── GET USER PROFILE (role, name, dept) ───────────────────────────────────
export async function getUserProfile(uid) {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
  return null;
}

// ── CREATE USER (Admin only) ───────────────────────────────────────────────
export async function createUser(email, password, profile) {
  // Create Firebase Auth account
  const result = await createUserWithEmailAndPassword(auth, email, password);

  // Save profile to Firestore users collection
  await setDoc(doc(db, 'users', result.user.uid), {
    uid: result.user.uid,
    email,
    name: profile.name,
    role: profile.role,     // 'admin' | 'manager' | 'operator' | 'accountant' | 'client'
    staffId: profile.staffId || null,
    clientId: profile.clientId || null,
    department: profile.department || null,
    createdAt: serverTimestamp(),
  });

  return result.user;
}`} />

        <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:12, marginTop:28 }}>
          📄 <code style={{color:T.accent2}}>src/hooks/useAuth.js</code> — React hook for auth state
        </div>
        <CodeBlock code={`// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../firebase/auth';

export function useAuth() {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser.uid);
        setUser(firebaseUser);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  // Helper: check if user has permission
  const hasRole = (...roles) => profile && roles.includes(profile.role);

  return { user, profile, loading, hasRole };
}`} />

        <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:12, marginTop:28 }}>
          📄 Login Screen Component — Replace your App.jsx root with this
        </div>
        <CodeBlock code={`// In your App.jsx — wrap everything with auth check
import { useAuth } from './hooks/useAuth';
import { login, logout } from './firebase/auth';

function LoginScreen() {
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      // useAuth hook will auto-detect and redirect
    } catch (err) {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div style={{ /* your login UI styles */ }}>
      <form onSubmit={handleLogin}>
        <input value={email}    onChange={e=>setEmail(e.target.value)}    type="email"    placeholder="Email" />
        <input value={password} onChange={e=>setPass(e.target.value)}     type="password" placeholder="Password" />
        {error && <p style={{color:'red'}}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default function App() {
  const { user, profile, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Not logged in → show login
  if (!user) return <LoginScreen />;

  // Logged in → show the right dashboard based on role
  if (profile?.role === 'operator')   return <OperatorDashboard profile={profile} />;
  if (profile?.role === 'client')     return <ClientPortal profile={profile} />;
  if (profile?.role === 'accountant') return <AccountantDashboard profile={profile} />;

  // Admin or Manager → full app
  return <FullApp profile={profile} onLogout={logout} />;
}`} />

        <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:20, marginTop:8 }}>
          <div style={{ fontSize:15, fontWeight:800, color:T.text, marginBottom:14 }}>👤 User Roles Summary</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[
              { role:"admin",      badge:"Admin",      color:"orange", what:"Full access to everything" },
              { role:"manager",    badge:"Manager",    color:"blue",   what:"Create jobs, build pipelines, assign operators, communicate clients" },
              { role:"operator",   badge:"Operator",   color:"green",  what:"See only their assigned stages, complete stages, view own earnings" },
              { role:"accountant", badge:"Accountant", color:"violet", what:"Invoices, payments, salary processing, financial reports" },
              { role:"client",     badge:"Client",     color:"grey",   what:"Track their own orders, approve designs, view invoices" },
            ].map(r => (
              <div key={r.role} style={{ display:"flex", alignItems:"center", gap:12,
                padding:"10px 14px", background:T.bgCard2, borderRadius:9 }}>
                <Badge label={r.badge} color={r.color} />
                <span style={{ fontSize:12, color:T.textDim }}>{r.what}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    // ── STEP 5: REALTIME ──────────────────────────────────────────────────────
    realtime: (
      <div>
        <SectionHeader icon="⚡" title="Realtime Live Updates"
          sub="Dashboard and production board update automatically — no refresh needed" />

        <InfoBox color="green" icon="⚡">
          Firebase's <strong>onSnapshot</strong> is the magic function. When any data changes in Firestore, it instantly pushes the update to all connected browsers. Your production board will update live when operators complete stages.
        </InfoBox>

        <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:12 }}>
          📄 <code style={{color:T.accent2}}>src/hooks/useJobs.js</code> — Live jobs hook
        </div>
        <CodeBlock code={`// src/hooks/useJobs.js
// This hook gives you live job data — updates automatically!
import { useState, useEffect } from 'react';
import { listenToJobs } from '../firebase/jobs';

export function useJobs() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    // Start listening — Firebase calls this every time data changes
    const unsubscribe = listenToJobs((newJobs) => {
      setJobs(newJobs);
      setLoading(false);
    });

    // When component unmounts, stop listening (prevent memory leaks)
    return () => unsubscribe();
  }, []);

  return { jobs, loading, error };
}`} />

        <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:12, marginTop:28 }}>
          How to use the hook in your Dashboard:
        </div>
        <CodeBlock code={`// In your Dashboard component — replace mock JOBS with real data
import { useJobs } from '../hooks/useJobs';
import { useClients } from '../hooks/useClients';

function Dashboard() {
  // These update LIVE from Firebase — no refresh needed!
  const { jobs, loading: jobsLoading }       = useJobs();
  const { clients, loading: clientsLoading } = useClients();

  if (jobsLoading) return <div>Loading jobs...</div>;

  // Now use 'jobs' exactly like you used the JOBS mock array before
  const activeJobs  = jobs.filter(j => j.status === 'In Progress');
  const overdueJobs = jobs.filter(j => j.status === 'Overdue');

  return (
    <div>
      {/* Stats */}
      <Stat label="Active Jobs" value={activeJobs.length} />
      <Stat label="Overdue"     value={overdueJobs.length} />

      {/* Production board — updates live when operator completes a stage! */}
      {jobs.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  );
}`} />

        <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:12, marginTop:28 }}>
          Operator completes stage → Dashboard updates instantly:
        </div>
        <CodeBlock code={`// In OperatorView component — when operator clicks "Complete Stage"
import { completeStage } from '../firebase/jobs';
import { deductStock } from '../firebase/materials';

async function handleStageComplete(formData) {
  try {
    // 1. Complete the stage in Firebase
    await completeStage(
      activeStage.id,   // stage document ID
      job.id,           // job document ID
      {
        qtyCompleted: parseInt(formData.qty),
        qtyRejected:  parseInt(formData.rejected),
        timeHours:    parseFloat(formData.hours),
        notes:        formData.notes,
        materialUsed: formData.materials,
      },
      nextStage?.id,    // next stage ID (to activate it)
      operator.rate,    // earning rate
      operator.earningType
    );

    // 2. Deduct materials used from stock
    for (const mat of formData.materials) {
      await deductStock(mat.materialId, mat.quantity);
    }

    // 3. Done! Firebase automatically:
    //    ✅ Notifies the next operator's dashboard
    //    ✅ Updates the admin production board
    //    ✅ Recalculates job cost
    //    ✅ Adds to operator's monthly earnings

    alert('Stage completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}`} />
      </div>
    ),

    // ── STEP 6: SECURITY RULES ────────────────────────────────────────────────
    rules: (
      <div>
        <SectionHeader icon="🛡️" title="Firestore Security Rules"
          sub="Control who can read and write what — essential before going live" />

        <InfoBox color="red" icon="⚠️">
          You created the database in "test mode" which allows anyone to read/write everything. Before using in production, replace the rules below. Go to Firebase Console → Firestore Database → Rules tab → paste this.
        </InfoBox>

        <CodeBlock lang="firestore-rules" code={`// Firestore Security Rules — paste in Firebase Console → Firestore → Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ── Helper functions ─────────────────────────────────────────────────
    function isLoggedIn() {
      return request.auth != null;
    }
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    function isAdmin()      { return isLoggedIn() && getUserRole() == 'admin'; }
    function isManager()    { return isLoggedIn() && getUserRole() in ['admin', 'manager']; }
    function isOperator()   { return isLoggedIn() && getUserRole() in ['admin', 'manager', 'operator']; }
    function isAccountant() { return isLoggedIn() && getUserRole() in ['admin', 'accountant']; }
    function isClient()     { return isLoggedIn() && getUserRole() == 'client'; }

    // ── Users collection ─────────────────────────────────────────────────
    match /users/{userId} {
      allow read: if isLoggedIn() && (request.auth.uid == userId || isAdmin());
      allow write: if isAdmin();
    }

    // ── Jobs — Managers create, Operators read their assigned jobs ────────
    match /jobs/{jobId} {
      allow read:   if isOperator();                  // All staff can read
      allow create: if isManager();                   // Only managers create
      allow update: if isManager() || isOperator();   // Both can update
      allow delete: if isAdmin();
    }

    // ── Job Stages — Operators can only update their assigned stages ──────
    match /job_stages/{stageId} {
      allow read: if isOperator();
      allow create: if isManager();
      allow update: if isManager() ||
        (isOperator() &&
         resource.data.operatorId == request.auth.uid); // Only assigned operator!
      allow delete: if isAdmin();
    }

    // ── Clients — Managers full access, Clients see only their own ────────
    match /clients/{clientId} {
      allow read: if isManager() ||
        (isClient() && resource.data.uid == request.auth.uid);
      allow write: if isManager();
    }

    // ── Staff — Admin manages, staff read their own ───────────────────────
    match /staff/{staffId} {
      allow read: if isLoggedIn();
      allow write: if isAdmin();
    }

    // ── Materials — Admin and managers manage stock ───────────────────────
    match /materials/{matId} {
      allow read: if isLoggedIn();
      allow write: if isManager();
    }

    // ── Invoices — Accountant and managers only ───────────────────────────
    match /invoices/{invoiceId} {
      allow read: if isAccountant() ||
        (isClient() && resource.data.clientUid == request.auth.uid);
      allow write: if isAccountant();
    }
  }
}`} />
      </div>
    ),

    // ── STEP 7: SEED DATA ─────────────────────────────────────────────────────
    seed: (
      <div>
        <SectionHeader icon="🌱" title="Seed Initial Data"
          sub="Run this once to populate Firebase with your starting data" />

        <InfoBox color="yellow" icon="🌱">
          Create this file and run it once from your browser console or as a temporary component. It will add the initial stages library, one admin user profile, and sample materials to your Firebase.
        </InfoBox>

        <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:12 }}>
          📄 <code style={{color:T.accent2}}>src/firebase/seed.js</code> — Run once to setup initial data
        </div>
        <CodeBlock code={`// src/firebase/seed.js
// IMPORTANT: Run this ONCE after setting up Firebase, then delete the file
import { db, auth } from './config';
import { collection, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  // ── 1. Create Admin User ──────────────────────────────────────────────
  const adminCred = await createUserWithEmailAndPassword(
    auth, 'admin@packagepro.com', 'Admin@12345'
  );
  await setDoc(doc(db, 'users', adminCred.user.uid), {
    name: 'Administrator',
    email: 'admin@packagepro.com',
    role: 'admin',
    createdAt: serverTimestamp(),
  });
  console.log('✅ Admin user created — admin@packagepro.com / Admin@12345');

  // ── 2. Seed Stage Library (Settings collection) ───────────────────────
  const stages = [
    'Design', 'Plate Making', 'Printing', 'Lamination',
    'Die Cutting', 'Foiling', 'Embossing', 'Spot UV',
    'Pasting', 'Quality Check', 'Packing', 'Delivery'
  ];
  for (let i = 0; i < stages.length; i++) {
    await addDoc(collection(db, 'stage_library'), {
      name: stages[i], order: i, active: true,
    });
  }
  console.log('✅ Stage library seeded');

  // ── 3. Seed Materials ─────────────────────────────────────────────────
  const materials = [
    { name:'Art Card 300gsm',      category:'Paper/Board', unit:'Sheets', stock:45000, minStock:10000, rate:4.5 },
    { name:'Duplex Board 400gsm',  category:'Paper/Board', unit:'Sheets', stock:8500,  minStock:5000,  rate:6.2 },
    { name:'Gloss BOPP Lam Roll',  category:'Lamination',  unit:'Meters', stock:320,   minStock:500,   rate:85  },
    { name:'Matte BOPP Lam Roll',  category:'Lamination',  unit:'Meters', stock:180,   minStock:200,   rate:92  },
    { name:'Gold Foil Roll',       category:'Foil',        unit:'Meters', stock:95,    minStock:100,   rate:220 },
    { name:'Hot Melt Glue',        category:'Adhesive',    unit:'KG',     stock:85,    minStock:30,    rate:350 },
  ];
  for (const mat of materials) {
    await addDoc(collection(db, 'materials'), {
      ...mat, lastUpdated: serverTimestamp(),
    });
  }
  console.log('✅ Materials seeded');

  // ── 4. Company Settings ───────────────────────────────────────────────
  await setDoc(doc(db, 'settings', 'company'), {
    name: 'PackagePro Industries',
    phone: '+92-21-XXXXXXX',
    email: 'info@packagepro.com',
    address: 'Industrial Area, Karachi',
    currency: '₨',
    taxRate: 17,
    updatedAt: serverTimestamp(),
  });
  console.log('✅ Company settings saved');

  console.log('🎉 Database seed complete!');
  console.log('📧 Admin login: admin@packagepro.com');
  console.log('🔑 Password: Admin@12345');
  console.log('⚠️  Change the password after first login!');
}

// To run: import this in App.jsx temporarily:
// import { seedDatabase } from './firebase/seed';
// useEffect(() => { seedDatabase(); }, []); // Run once, then remove!`} />
      </div>
    ),

    // ── STEP 8: DEPLOY ────────────────────────────────────────────────────────
    deploy: (
      <div>
        <SectionHeader icon="🌍" title="Deploy to Live"
          sub="Host your PackagePro app free on Firebase Hosting — accessible from any browser" />

        <Step num={1} title="Install Firebase CLI" done={checklist.d1}>
          <CodeBlock lang="bash" code={`# Install Firebase command-line tools globally
npm install -g firebase-tools

# Login to your Firebase account
firebase login
# (Opens browser to authenticate with Google)`} />
          <Check id="d1" label="Firebase CLI installed and logged in" />
        </Step>

        <Step num={2} title="Initialize Firebase Hosting" done={checklist.d2}>
          <CodeBlock lang="bash" code={`# In your project root folder:
firebase init hosting

# Answer the questions:
# ? What do you want to use as your public directory? → build
# ? Configure as single-page app? → Yes
# ? Set up automatic builds with GitHub? → No (for now)
# ? File build/index.html already exists. Overwrite? → No`} />
          <Check id="d2" label="firebase init hosting complete" />
        </Step>

        <Step num={3} title="Build and Deploy" done={checklist.d3}>
          <CodeBlock lang="bash" code={`# Build your React app for production
npm run build

# Deploy to Firebase Hosting
firebase deploy

# ✅ Done! Your app is live at:
# https://YOUR-PROJECT-ID.web.app
# https://YOUR-PROJECT-ID.firebaseapp.com

# Deploy again anytime after changes:
npm run build && firebase deploy`} />
          <Check id="d3" label="App deployed and live!" />
        </Step>

        <div style={{ background:`linear-gradient(135deg, rgba(249,115,22,0.1), rgba(16,185,129,0.1))`,
          border:`1px solid ${T.border}`, borderRadius:14, padding:24, marginTop:16 }}>
          <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:12 }}>🎉 You're Live! What happens now:</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[
              { icon:"🌐", text:"App is accessible from any browser, phone, or tablet — worldwide" },
              { icon:"⚡", text:"Realtime updates work — operators complete stages and dashboards update instantly" },
              { icon:"🔐", text:"Login system active — each person sees only their own dashboard" },
              { icon:"📦", text:"Firebase free tier handles up to 50,000 reads and 20,000 writes per day" },
              { icon:"💾", text:"All data is safely stored in Google's cloud — automatic backup" },
              { icon:"📱", text:"Works on mobile browsers too — operators can use it from the factory floor" },
            ].map(i => (
              <div key={i.text} style={{ display:"flex", gap:12, padding:"10px 0",
                borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontSize:20 }}>{i.icon}</span>
                <span style={{ fontSize:13, color:T.textDim }}>{i.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, padding:20, marginTop:20 }}>
          <div style={{ fontSize:15, fontWeight:800, color:T.text, marginBottom:14 }}>📊 Firebase Free Tier Limits</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              {l:"Firestore reads/day",   v:"50,000",   ok:true},
              {l:"Firestore writes/day",  v:"20,000",   ok:true},
              {l:"Storage",               v:"1 GB",     ok:true},
              {l:"Hosting bandwidth/mo",  v:"10 GB",    ok:true},
              {l:"Auth users",            v:"Unlimited",ok:true},
              {l:"Realtime connections",  v:"100",      ok:true},
            ].map(s => (
              <div key={s.l} style={{ background:T.bgCard2, borderRadius:9, padding:"12px 14px",
                border:`1px solid ${T.border}` }}>
                <div style={{ fontSize:11, color:T.textMuted }}>{s.l}</div>
                <div style={{ fontSize:16, fontWeight:800, color:s.ok?T.green:T.yellow }}>{s.v}</div>
              </div>
            ))}
          </div>
          <InfoBox color="green" icon="✅">
            For a packaging company with 10-20 staff, the free tier is more than enough. You'll only need to upgrade if you have thousands of jobs per day.
          </InfoBox>
        </div>
      </div>
    ),
  };

  const completedSteps = Object.values(checklist).filter(Boolean).length;

  return (
    <div style={{
      minHeight:"100vh", background:T.bg, color:T.text,
      fontFamily:"'SF Pro Display', -apple-system, 'Segoe UI', system-ui, sans-serif",
    }}>
      {/* TOP BANNER */}
      <div style={{
        background:`linear-gradient(135deg, #0f1a2e 0%, #0a0f1a 100%)`,
        borderBottom:`1px solid ${T.border}`,
        padding:"28px 40px",
        position:"sticky", top:0, zIndex:50,
      }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", gap:20 }}>
          <div style={{
            width:48, height:48, borderRadius:14, flexShrink:0,
            background:`linear-gradient(135deg, ${T.firebase}, ${T.firebaseLight})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:24, boxShadow:`0 0 24px rgba(255,111,0,0.4)`,
          }}>🔥</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:20, fontWeight:900, color:T.text, letterSpacing:"-0.03em" }}>
              PackagePro × Firebase
              <span style={{ fontSize:13, fontWeight:500, color:T.textMuted, marginLeft:12 }}>Complete Integration Guide</span>
            </div>
            <div style={{ fontSize:12, color:T.textMuted, marginTop:2 }}>
              Follow all 8 steps to connect your PackagePro UI to a live Firebase backend
            </div>
          </div>
          {/* Progress */}
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontSize:11, color:T.textMuted, marginBottom:6 }}>CHECKLIST PROGRESS</div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <div style={{ width:140, height:8, background:T.border, borderRadius:4, overflow:"hidden" }}>
                <div style={{ width:`${(completedSteps/20)*100}%`, height:"100%",
                  background:`linear-gradient(90deg, ${T.accent}, ${T.green})`,
                  borderRadius:4, transition:"width 0.3s" }} />
              </div>
              <span style={{ fontSize:13, fontWeight:700, color:T.accent2 }}>{completedSteps}/20</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", gap:0 }}>
        {/* SIDEBAR TABS */}
        <div style={{
          width:220, flexShrink:0, padding:"24px 16px",
          position:"sticky", top:88, alignSelf:"flex-start",
          height:"calc(100vh - 88px)", overflowY:"auto",
        }}>
          <div style={{ fontSize:10, color:T.textMuted, fontWeight:700, letterSpacing:"0.08em", marginBottom:12 }}>STEPS</div>
          {TABS.map(t => (
            <div key={t.id} onClick={() => setTab(t.id)} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px", borderRadius:10, marginBottom:4, cursor:"pointer",
              background: tab === t.id ? T.accentGlow : "transparent",
              border: `1px solid ${tab === t.id ? T.accent : "transparent"}`,
              color: tab === t.id ? T.accent2 : T.textMuted,
              transition:"all 0.15s",
            }}>
              <span style={{ fontSize:16 }}>{t.icon}</span>
              <span style={{ fontSize:12, fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
            </div>
          ))}

          {/* Quick reference */}
          <div style={{ marginTop:28, padding:14, background:T.bgCard2,
            border:`1px solid ${T.border}`, borderRadius:12 }}>
            <div style={{ fontSize:11, color:T.accent2, fontWeight:700, marginBottom:10 }}>⚡ QUICK COMMANDS</div>
            {[
              ["Install Firebase", "npm install firebase"],
              ["Install CLI", "npm i -g firebase-tools"],
              ["Login CLI", "firebase login"],
              ["Build app", "npm run build"],
              ["Deploy", "firebase deploy"],
            ].map(([label, cmd]) => (
              <div key={label} style={{ marginBottom:8 }}>
                <div style={{ fontSize:10, color:T.textMuted, marginBottom:2 }}>{label}</div>
                <code style={{ fontSize:10, color:T.green2, background:T.bgCard3,
                  padding:"3px 8px", borderRadius:5, display:"block",
                  border:`1px solid ${T.border}` }}>{cmd}</code>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex:1, padding:"28px 32px", minWidth:0 }}>
          {content[tab] || (
            <div style={{ textAlign:"center", padding:"80px 0", color:T.textMuted }}>
              Select a step from the left menu
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:32,
            paddingTop:24, borderTop:`1px solid ${T.border}` }}>
            {(() => {
              const idx = TABS.findIndex(t => t.id === tab);
              const prev = TABS[idx - 1];
              const next = TABS[idx + 1];
              return (
                <>
                  {prev
                    ? <button onClick={() => setTab(prev.id)} style={{
                        background:T.bgCard2, border:`1px solid ${T.border}`,
                        color:T.textDim, borderRadius:9, padding:"10px 20px",
                        fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:600
                      }}>← {prev.icon} {prev.label}</button>
                    : <div />}
                  {next
                    ? <button onClick={() => setTab(next.id)} style={{
                        background:`linear-gradient(135deg, ${T.accent}, ${T.firebaseLight})`,
                        border:"none", color:"#fff", borderRadius:9, padding:"10px 24px",
                        fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:700,
                        boxShadow:`0 0 20px rgba(249,115,22,0.35)`,
                      }}>Next: {next.icon} {next.label} →</button>
                    : <button style={{
                        background:`linear-gradient(135deg, ${T.green}, ${T.green2})`,
                        border:"none", color:"#fff", borderRadius:9, padding:"10px 24px",
                        fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:700,
                        boxShadow:`0 0 20px rgba(16,185,129,0.35)`,
                      }}>🎉 All Steps Complete — You're Live!</button>}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
