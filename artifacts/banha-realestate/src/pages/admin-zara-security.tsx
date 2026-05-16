import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, ShieldCheck, ShieldAlert, ShieldX, ShieldOff,
  Activity, Zap, Lock, Unlock, Globe, Eye, EyeOff,
  AlertTriangle, CheckCircle, XCircle, Clock, RefreshCw,
  Server, Database, Wifi, WifiOff, Cpu, HardDrive,
  Users, User, UserX, LogIn, LogOut, Key, Fingerprint,
  Upload, FileX, File, Image, Download, Archive,
  Bell, BellOff, Mail, Phone, Send,
  Settings, Sliders, ToggleLeft, ToggleRight,
  Search, Filter, ChevronDown, ChevronUp, MoreVertical,
  Flame, Bug, Crosshair, Radio, Radar,
  MapPin, Map, Flag, Ban, Check, X, Plus, Trash2,
  TrendingUp, TrendingDown, BarChart2, List, Terminal,
  Copy, ExternalLink, Info, Star, Award, Layers,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, Radar as ReRadar,
} from "recharts";

// ── Design tokens (light / white) ────────────────────────────────────────────
const BG      = "#F1F5F9";
const PANEL   = "#FFFFFF";
const CARD    = "#FFFFFF";
const BORDER  = "#E2E8F0";
const BORDER2 = "#CBD5E1";
const GREEN   = "#059669";
const RED     = "#EF4444";
const BLUE    = "#3B82F6";
const YELLOW  = "#D97706";
const PURPLE  = "#7C3AED";
const CYAN    = "#0891B2";
const TEXT    = "#1E293B";
const MUTED   = "#64748B";

// ── Mock live data generators ─────────────────────────────────────────────────
function rnd(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const ATTACK_DATA = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}:00`, attacks: rnd(0, 120), blocked: rnd(0, 90), requests: rnd(200, 800),
}));

const COUNTRIES = [
  { country: "روسيا",       code: "🇷🇺", attempts: 1842, blocked: 1840 },
  { country: "الصين",       code: "🇨🇳", attempts: 1205, blocked: 1200 },
  { country: "الولايات المتحدة", code: "🇺🇸", attempts:  934, blocked:  920 },
  { country: "ألمانيا",     code: "🇩🇪", attempts:  612, blocked:  610 },
  { country: "البرازيل",    code: "🇧🇷", attempts:  441, blocked:  438 },
];

const THREAT_TYPES = [
  { type: "SQL Injection",      count: 341, color: RED },
  { type: "XSS Attack",         count: 289, color: YELLOW },
  { type: "Brute Force",        count: 512, color: PURPLE },
  { type: "DDoS",               count: 183, color: CYAN },
  { type: "Bot Traffic",        count: 924, color: BLUE },
  { type: "File Upload Abuse",  count:  77, color: "#F97316" },
];

const RADAR_DATA = [
  { subject: "API",       A: 88 },
  { subject: "Login",     A: 95 },
  { subject: "Upload",    A: 79 },
  { subject: "Admin",     A: 98 },
  { subject: "DB",        A: 91 },
  { subject: "Sessions",  A: 86 },
];

const LIVE_EVENTS = [
  { time: "الآن",         ip: "185.220.101.x",  event: "محاولة SQL Injection",     severity: "critical", blocked: true },
  { time: "منذ 12 ث",    ip: "77.247.181.x",   event: "Brute Force على تسجيل الدخول", severity: "high",  blocked: true },
  { time: "منذ 28 ث",    ip: "195.54.160.x",   event: "تطفل XSS في نموذج الاتصال", severity: "high",    blocked: true },
  { time: "منذ 45 ث",    ip: "209.141.54.x",   event: "Bot Scanner محتمل",         severity: "medium",  blocked: true },
  { time: "منذ 1 د",     ip: "104.21.36.x",    event: "طلبات API مشبوهة",          severity: "medium",  blocked: false },
  { time: "منذ 2 د",     ip: "103.127.8.x",    event: "محاولة رفع ملف .exe",       severity: "critical",blocked: true },
  { time: "منذ 3 د",     ip: "46.166.162.x",   event: "DDoS Flood صغير",           severity: "high",    blocked: true },
  { time: "منذ 5 د",     ip: "5.188.86.x",     event: "تسجيل دخول من IP جديد",    severity: "low",     blocked: false },
];

const LOGIN_HISTORY = [
  { user: "admin@banha.com", ip: "197.46.x.x",    country: "🇪🇬 مصر",        time: "الآن",     device: "Chrome / Windows", status: "success" },
  { user: "admin@banha.com", ip: "185.220.101.x",  country: "🇷🇺 روسيا",     time: "منذ 2 د",  device: "Firefox / Linux",  status: "blocked" },
  { user: "admin@banha.com", ip: "45.61.53.x",     country: "🇺🇸 أمريكا",    time: "منذ 8 د",  device: "Chrome / Mac",     status: "blocked" },
  { user: "admin@banha.com", ip: "197.46.x.x",    country: "🇪🇬 مصر",        time: "أمس 23:14",device: "Safari / iPhone",  status: "success" },
];

const LOGS = [
  { id: "L-9821", time: "16:42:03", type: "FIREWALL",  ip: "185.220.101.x", msg: "SQL Injection blocked",           sev: "critical" },
  { id: "L-9820", time: "16:41:51", type: "AUTH",      ip: "77.247.181.x",  msg: "Brute force login blocked",      sev: "high"     },
  { id: "L-9819", time: "16:41:38", type: "UPLOAD",    ip: "209.141.54.x",  msg: "Malicious file rejected: a.exe", sev: "critical" },
  { id: "L-9818", time: "16:41:12", type: "API",       ip: "104.21.36.x",   msg: "Rate limit exceeded (>100/min)", sev: "medium"   },
  { id: "L-9817", time: "16:40:55", type: "SESSION",   ip: "197.46.x.x",    msg: "Admin session renewed",          sev: "info"     },
  { id: "L-9816", time: "16:40:22", type: "FIREWALL",  ip: "46.166.162.x",  msg: "DDoS flood mitigated",           sev: "high"     },
  { id: "L-9815", time: "16:39:44", type: "AUTH",      ip: "195.54.160.x",  msg: "XSS attempt in form body",       sev: "high"     },
  { id: "L-9814", time: "16:39:01", type: "DB",        ip: "internal",      msg: "Schema validation passed",       sev: "info"     },
  { id: "L-9813", time: "16:38:27", type: "UPLOAD",    ip: "103.127.8.x",   msg: "MIME mismatch: image/php",       sev: "critical" },
  { id: "L-9812", time: "16:37:50", type: "API",       ip: "5.188.86.x",    msg: "Suspicious endpoint probe",      sev: "medium"   },
];

const BACKUPS = [
  { id: "BK-112", name: "Full Backup",     date: "2026-05-16 03:00", size: "2.4 GB", status: "success", type: "auto" },
  { id: "BK-111", name: "Full Backup",     date: "2026-05-15 03:00", size: "2.3 GB", status: "success", type: "auto" },
  { id: "BK-110", name: "DB Only",         date: "2026-05-15 14:22", size: "380 MB", status: "success", type: "manual" },
  { id: "BK-109", name: "Full Backup",     date: "2026-05-14 03:00", size: "2.2 GB", status: "success", type: "auto" },
  { id: "BK-108", name: "Emergency Snap",  date: "2026-05-13 19:01", size: "2.1 GB", status: "success", type: "manual" },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function PulseDot({ color = GREEN }: { color?: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
        style={{ backgroundColor: color }} />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: color }} />
    </span>
  );
}

function SevBadge({ sev }: { sev: string }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    critical: { bg: "#FF3B5C22", color: RED,    label: "خطر بالغ" },
    high:     { bg: "#F59E0B22", color: YELLOW, label: "عالي"     },
    medium:   { bg: "#3B82F622", color: BLUE,   label: "متوسط"    },
    low:      { bg: "#00D97E22", color: GREEN,  label: "منخفض"    },
    info:     { bg: "#64748B22", color: MUTED,  label: "معلومة"   },
  };
  const c = cfg[sev] ?? cfg.info;
  return (
    <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
      style={{ backgroundColor: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, glow }: {
  icon: any; label: string; value: string | number; sub?: string; color: string; glow?: boolean;
}) {
  return (
    <div className="rounded-2xl p-5 border flex items-start gap-4 relative overflow-hidden"
      style={{ backgroundColor: CARD, borderColor: BORDER }}>
      {glow && (
        <div className="absolute inset-0 opacity-5 pointer-events-none rounded-2xl"
          style={{ background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)` }} />
      )}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}22` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium" style={{ color: MUTED }}>{label}</p>
        <p className="text-2xl font-black mt-0.5" style={{ color: TEXT }}>{value}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: MUTED }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Security Score Ring ───────────────────────────────────────────────────────
function SecurityScore({ score }: { score: number }) {
  const r = 54, circ = 2 * Math.PI * r;
  const fill = circ - (score / 100) * circ;
  const color = score >= 85 ? GREEN : score >= 60 ? YELLOW : RED;
  return (
    <div className="flex flex-col items-center">
      <svg width="130" height="130" className="-rotate-90">
        <circle cx="65" cy="65" r={r} fill="none" stroke={BORDER2} strokeWidth="10" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={fill}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 8px ${color})` }} />
      </svg>
      <div className="text-center -mt-[4.5rem]">
        <p className="text-4xl font-black" style={{ color }}>{score}</p>
        <p className="text-xs" style={{ color: MUTED }}>/ 100</p>
      </div>
      <div className="mt-7 text-center">
        <p className="text-sm font-bold" style={{ color }}>
          {score >= 85 ? "ممتاز" : score >= 60 ? "جيد" : "يحتاج تحسين"}
        </p>
        <p className="text-xs mt-0.5" style={{ color: MUTED }}>درجة الأمان الكلية</p>
      </div>
    </div>
  );
}

// ── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard",   label: "Dashboard",         icon: Radar },
  { id: "firewall",    label: "جدار الحماية",       icon: ShieldCheck },
  { id: "threats",     label: "التهديدات",          icon: Flame },
  { id: "admin",       label: "حماية الأدمن",       icon: Lock },
  { id: "upload",      label: "حماية الرفع",        icon: Upload },
  { id: "logs",        label: "السجلات",            icon: Terminal },
  { id: "backup",      label: "النسخ الاحتياطي",   icon: Archive },
  { id: "settings",    label: "الإعدادات",          icon: Sliders },
  { id: "notifs",      label: "الإشعارات",          icon: Bell },
];

// ── Dashboard Tab ─────────────────────────────────────────────────────────────
function DashboardTab() {
  const [score] = useState(92);
  const [liveCount, setLiveCount] = useState(7);
  const [requestsTick, setRequestsTick] = useState(1234);

  useEffect(() => {
    const t1 = setInterval(() => setLiveCount(rnd(4, 14)), 3000);
    const t2 = setInterval(() => setRequestsTick(p => p + rnd(1, 8)), 1200);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <div className="space-y-5">
      {/* Top row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShieldCheck} label="درجة الأمان" value="92%" sub="ممتاز" color={GREEN} glow />
        <StatCard icon={Ban} label="تهديدات محجوبة" value="3,841" sub="اليوم" color={RED} glow />
        <StatCard icon={Users} label="مستخدمون نشطون" value={liveCount} sub="لحظياً" color={BLUE} />
        <StatCard icon={Activity} label="طلبات API" value={requestsTick.toLocaleString()} sub="منذ الإقلاع" color={PURPLE} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={LogIn} label="تسجيلات فاشلة" value="512" sub="اليوم" color={YELLOW} />
        <StatCard icon={Server} label="حالة الخادم" value="سليم" sub="Uptime 99.9%" color={GREEN} />
        <StatCard icon={Zap} label="جدار الحماية" value="نشط" sub="WAF Online" color={CYAN} />
        <StatCard icon={AlertTriangle} label="أنشطة مشبوهة" value="28" sub="هذا الشهر" color={YELLOW} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Security Score */}
        <div className="rounded-2xl border p-6 flex flex-col items-center justify-center"
          style={{ backgroundColor: CARD, borderColor: BORDER }}>
          <p className="text-sm font-bold mb-4" style={{ color: TEXT }}>Security Score</p>
          <SecurityScore score={score} />
        </div>

        {/* 24h attacks chart */}
        <div className="rounded-2xl border p-5 lg:col-span-2" style={{ backgroundColor: CARD, borderColor: BORDER }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold" style={{ color: TEXT }}>الهجمات خلال 24 ساعة</p>
            <div className="flex items-center gap-1.5">
              <PulseDot color={RED} />
              <span className="text-xs" style={{ color: MUTED }}>مباشر</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={ATTACK_DATA}>
              <defs>
                <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={RED} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={RED} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GREEN} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="h" stroke={MUTED} tick={{ fontSize: 9, fill: MUTED }} interval={3} />
              <YAxis stroke={MUTED} tick={{ fontSize: 9, fill: MUTED }} />
              <Tooltip contentStyle={{ backgroundColor: PANEL, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT }} />
              <Area type="monotone" dataKey="attacks" stroke={RED} fill="url(#ga)" strokeWidth={2} name="هجمات" />
              <Area type="monotone" dataKey="blocked" stroke={GREEN} fill="url(#gb)" strokeWidth={2} name="محجوبة" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Live threat feed */}
        <div className="rounded-2xl border" style={{ backgroundColor: CARD, borderColor: BORDER }}>
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
            <p className="text-sm font-bold" style={{ color: TEXT }}>التهديدات المباشرة</p>
            <div className="flex items-center gap-1.5">
              <PulseDot color={RED} />
              <span className="text-[11px]" style={{ color: RED }}>LIVE</span>
            </div>
          </div>
          <div className="divide-y">
            {LIVE_EVENTS.slice(0, 5).map((e, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: e.blocked ? `${RED}22` : `${YELLOW}22` }}>
                  {e.blocked ? <ShieldX className="w-4 h-4" style={{ color: RED }} />
                             : <AlertTriangle className="w-4 h-4" style={{ color: YELLOW }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: TEXT }}>{e.event}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>{e.ip} · {e.time}</p>
                </div>
                <SevBadge sev={e.severity} />
              </div>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div className="rounded-2xl border" style={{ backgroundColor: CARD, borderColor: BORDER }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <p className="text-sm font-bold" style={{ color: TEXT }}>أكثر الدول هجوماً</p>
          </div>
          <div className="p-5 space-y-3">
            {COUNTRIES.map((c, i) => {
              const pct = Math.round((c.blocked / c.attempts) * 100);
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.code}</span>
                      <span className="text-xs font-semibold" style={{ color: TEXT }}>{c.country}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: RED }}>{c.attempts.toLocaleString()} محاولة</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: BORDER2 }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: RED }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Firewall Tab ──────────────────────────────────────────────────────────────
function FirewallTab() {
  const rules = [
    { name: "SQL Injection Protection", status: true,  hits: 341, action: "Block" },
    { name: "XSS Protection",           status: true,  hits: 289, action: "Block" },
    { name: "CSRF Protection",          status: true,  hits:  98, action: "Block" },
    { name: "Rate Limiting (100/min)",  status: true,  hits: 512, action: "Block + Captcha" },
    { name: "Bot Detection",            status: true,  hits: 924, action: "Challenge" },
    { name: "Geo Blocking",             status: true,  hits: 183, action: "Block" },
    { name: "Brute Force Protection",   status: true,  hits: 200, action: "Temp Ban" },
    { name: "API Abuse Protection",     status: true,  hits:  77, action: "Throttle" },
    { name: "DDoS Detection",           status: true,  hits:  12, action: "Auto Mitigate" },
    { name: "Header Validation",        status: false, hits:   0, action: "Warn" },
  ];
  const [states, setStates] = useState(rules.map(r => r.status));
  const toggle = (i: number) => setStates(p => p.map((v, j) => j === i ? !v : v));

  const IPS = [
    { ip: "185.220.101.34", reason: "SQL Injection",       since: "منذ 12 د", type: "permanent" },
    { ip: "77.247.181.22",  reason: "Brute Force",         since: "منذ 30 د", type: "temporary" },
    { ip: "46.166.162.89",  reason: "DDoS",                since: "منذ 1 س",  type: "permanent" },
    { ip: "195.54.160.11",  reason: "XSS Attempt",         since: "منذ 2 س",  type: "temporary" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={ShieldCheck} label="قواعد نشطة"    value="9"       sub="من 10 قواعد"  color={GREEN} />
        <StatCard icon={Ban}         label="IPs محجوبة"    value="47"      sub="هذا الشهر"    color={RED}   />
        <StatCard icon={Zap}         label="إجمالي الإيقاف" value="2,441"  sub="هذا الأسبوع"  color={CYAN}  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* WAF Rules */}
        <div className="rounded-2xl border" style={{ backgroundColor: CARD, borderColor: BORDER }}>
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
            <p className="text-sm font-bold" style={{ color: TEXT }}>قواعد WAF</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: `${GREEN}22`, color: GREEN }}>
              {states.filter(Boolean).length} / {states.length} نشط
            </span>
          </div>
          <div className="divide-y">
            {rules.map((r, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: TEXT }}>{r.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px]" style={{ color: MUTED }}>{r.action}</span>
                    {r.hits > 0 && <span className="text-[10px] font-bold" style={{ color: YELLOW }}>{r.hits} إيقاف</span>}
                  </div>
                </div>
                <button onClick={() => toggle(i)}>
                  {states[i]
                    ? <ToggleRight className="w-8 h-8" style={{ color: GREEN }} />
                    : <ToggleLeft  className="w-8 h-8" style={{ color: MUTED }} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Blocked IPs */}
        <div className="space-y-4">
          <div className="rounded-2xl border" style={{ backgroundColor: CARD, borderColor: BORDER }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
              <p className="text-sm font-bold" style={{ color: TEXT }}>IPs المحجوبة</p>
              <button className="text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5"
                style={{ backgroundColor: `${BLUE}22`, color: BLUE }}>
                <Plus className="w-3 h-3" /> إضافة IP
              </button>
            </div>
            <div className="divide-y">
              {IPS.map((ip, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono font-bold" style={{ color: RED }}>{ip.ip}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px]" style={{ color: MUTED }}>{ip.reason} · {ip.since}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: ip.type === "permanent" ? `${RED}22` : `${YELLOW}22`,
                             color: ip.type === "permanent" ? RED : YELLOW }}>
                    {ip.type === "permanent" ? "دائم" : "مؤقت"}
                  </span>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${MUTED}22` }}>
                    <X className="w-3 h-3" style={{ color: MUTED }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Threat types bar chart */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: CARD, borderColor: BORDER }}>
            <p className="text-sm font-bold mb-4" style={{ color: TEXT }}>توزيع أنواع الهجمات</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={THREAT_TYPES} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke={MUTED} tick={{ fontSize: 9, fill: MUTED }} />
                <YAxis dataKey="type" type="category" stroke={MUTED} tick={{ fontSize: 9, fill: MUTED }} width={100} />
                <Tooltip contentStyle={{ backgroundColor: PANEL, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} fill={RED} name="عدد" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Threats Tab ───────────────────────────────────────────────────────────────
function ThreatsTab() {
  const [filter, setFilter] = useState("الكل");
  const filters = ["الكل", "critical", "high", "medium", "low"];
  const filtered = filter === "الكل" ? LIVE_EVENTS : LIVE_EVENTS.filter(e => e.severity === filter);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Flame}       label="تهديدات بالغة"  value="12"  sub="اليوم"       color={RED}    glow />
        <StatCard icon={AlertTriangle} label="تهديدات عالية" value="89"  sub="اليوم"       color={YELLOW}     />
        <StatCard icon={Bug}         label="بوتات مكتشفة"  value="924" sub="هذا الأسبوع" color={BLUE}       />
        <StatCard icon={Crosshair}   label="هجمات مصدّة"   value="3,841" sub="الإجمالي"  color={GREEN}      />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border p-5" style={{ backgroundColor: CARD, borderColor: BORDER }}>
          <p className="text-sm font-bold mb-4" style={{ color: TEXT }}>رادار التهديدات الأمنية</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke={BORDER2} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: MUTED }} />
              <ReRadar dataKey="A" stroke={CYAN} fill={CYAN} fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border p-5" style={{ backgroundColor: CARD, borderColor: BORDER }}>
          <p className="text-sm font-bold mb-4" style={{ color: TEXT }}>محاولات الاختراق — 7 أيام</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={[
              { d: "الأحد",      v: 84 }, { d: "الاثنين",  v: 120 }, { d: "الثلاثاء", v: 98  },
              { d: "الأربعاء",  v: 142 }, { d: "الخميس",   v: 89  }, { d: "الجمعة",   v: 201 },
              { d: "السبت",     v: 134 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="d" stroke={MUTED} tick={{ fontSize: 9, fill: MUTED }} />
              <YAxis stroke={MUTED} tick={{ fontSize: 9, fill: MUTED }} />
              <Tooltip contentStyle={{ backgroundColor: PANEL, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT }} />
              <Line type="monotone" dataKey="v" stroke={RED} strokeWidth={2} dot={{ fill: RED, r: 3 }} name="محاولات" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live events table */}
      <div className="rounded-2xl border" style={{ backgroundColor: CARD, borderColor: BORDER }}>
        <div className="px-5 py-4 border-b flex items-center justify-between flex-wrap gap-3" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-2">
            <PulseDot color={RED} />
            <p className="text-sm font-bold" style={{ color: TEXT }}>سجل التهديدات المباشر</p>
          </div>
          <div className="flex gap-1.5">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="text-[11px] font-bold px-3 py-1 rounded-lg transition-all"
                style={{ backgroundColor: filter === f ? RED : `${MUTED}22`, color: filter === f ? "#fff" : MUTED }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y overflow-y-auto max-h-64">
          {filtered.map((e, i) => (
            <div key={i} className="px-5 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: e.blocked ? `${RED}22` : `${YELLOW}22` }}>
                {e.blocked ? <ShieldX className="w-4 h-4" style={{ color: RED }} />
                           : <Eye className="w-4 h-4" style={{ color: YELLOW }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: TEXT }}>{e.event}</p>
                <p className="text-[10px] mt-0.5 font-mono" style={{ color: MUTED }}>{e.ip} · {e.time}</p>
              </div>
              <SevBadge sev={e.severity} />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: e.blocked ? `${GREEN}22` : `${YELLOW}22`,
                         color: e.blocked ? GREEN : YELLOW }}>
                {e.blocked ? "محجوب" : "مراقَب"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Admin Protection Tab ──────────────────────────────────────────────────────
function AdminProtectionTab() {
  const features = [
    { name: "المصادقة الثنائية 2FA",        desc: "رمز OTP عند كل تسجيل دخول",    on: true  },
    { name: "التحقق من الجهاز",             desc: "تأكيد الأجهزة الجديدة بالإيميل", on: true  },
    { name: "إشعار تسجيل الدخول",           desc: "إيميل فوري عند الدخول",         on: true  },
    { name: "انتهاء الجلسة التلقائي",       desc: "بعد 30 دقيقة من الخمول",       on: true  },
    { name: "كشف البلد المشبوه",            desc: "تنبيه عند دخول من بلد جديد",    on: true  },
    { name: "قفل الحساب بعد 5 محاولات",     desc: "حماية Brute Force",            on: true  },
    { name: "تسجيل نشاط الأدمن",           desc: "كل عملية مسجلة مع IP + وقت",   on: true  },
    { name: "Captcha على صفحة الدخول",      desc: "Google reCAPTCHA v3",          on: false },
  ];
  const [states, setStates] = useState(features.map(f => f.on));
  const toggle = (i: number) => setStates(p => p.map((v, j) => j === i ? !v : v));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Features */}
        <div className="rounded-2xl border" style={{ backgroundColor: CARD, borderColor: BORDER }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <p className="text-sm font-bold" style={{ color: TEXT }}>ميزات الحماية</p>
          </div>
          <div className="divide-y">
            {features.map((f, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: TEXT }}>{f.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>{f.desc}</p>
                </div>
                <button onClick={() => toggle(i)}>
                  {states[i]
                    ? <ToggleRight className="w-8 h-8" style={{ color: GREEN }} />
                    : <ToggleLeft  className="w-8 h-8" style={{ color: MUTED }} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Login history */}
          <div className="rounded-2xl border" style={{ backgroundColor: CARD, borderColor: BORDER }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
              <p className="text-sm font-bold" style={{ color: TEXT }}>سجل تسجيل الدخول</p>
              <button className="text-[10px] flex items-center gap-1" style={{ color: MUTED }}>
                <Download className="w-3 h-3" /> تصدير
              </button>
            </div>
            <div className="divide-y">
              {LOGIN_HISTORY.map((l, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: l.status === "success" ? `${GREEN}22` : `${RED}22` }}>
                    {l.status === "success"
                      ? <CheckCircle className="w-3.5 h-3.5" style={{ color: GREEN }} />
                      : <XCircle className="w-3.5 h-3.5" style={{ color: RED }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: TEXT }}>{l.country} · {l.time}</p>
                    <p className="text-[10px] mt-0.5 font-mono" style={{ color: MUTED }}>{l.ip} · {l.device}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active sessions */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: CARD, borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold" style={{ color: TEXT }}>الجلسات النشطة</p>
              <button className="text-[11px] px-3 py-1.5 rounded-lg font-bold"
                style={{ backgroundColor: `${RED}22`, color: RED }}>
                إنهاء الكل
              </button>
            </div>
            <div className="space-y-2">
              {[
                { device: "Chrome / Windows",  ip: "197.46.x.x",  time: "الآن",          current: true  },
                { device: "Safari / iPhone",   ip: "197.46.x.x",  time: "منذ 40 د",      current: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: s.current ? `${GREEN}11` : PANEL, border: `1px solid ${s.current ? GREEN + "44" : BORDER}` }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: TEXT }}>{s.device}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>{s.ip} · {s.time}</p>
                  </div>
                  {s.current
                    ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${GREEN}22`, color: GREEN }}>الجهاز الحالي</span>
                    : <button className="text-[10px] font-bold px-2 py-1 rounded-lg"
                        style={{ backgroundColor: `${RED}22`, color: RED }}>إنهاء</button>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Upload Protection Tab ─────────────────────────────────────────────────────
function UploadProtectionTab() {
  const rules = [
    { rule: "منع الملفات التنفيذية (.exe, .sh, .php)", on: true  },
    { rule: "التحقق من MIME Type",                     on: true  },
    { rule: "الحد الأقصى للحجم (10 MB)",               on: true  },
    { rule: "فحص الصور من البرمجيات الخبيثة",          on: true  },
    { rule: "إزالة Metadata الحساسة",                  on: true  },
    { rule: "ضغط الصور تلقائياً",                      on: true  },
    { rule: "تحويل الصور إلى WebP",                    on: false },
    { rule: "حظر الصور المكررة",                       on: false },
  ];
  const [states, setStates] = useState(rules.map(r => r.on));
  const toggle = (i: number) => setStates(p => p.map((v, j) => j === i ? !v : v));

  const rejected = [
    { file: "malware_test.exe",  size: "2.1 MB",  ip: "209.141.54.x", time: "منذ 5 د",  reason: "ملف تنفيذي" },
    { file: "shell.php",        size: "18 KB",   ip: "103.127.8.x",  time: "منذ 1 س",  reason: "MIME مزيف"  },
    { file: "exploit.jpg.sh",   size: "441 KB",  ip: "46.166.162.x", time: "منذ 2 س",  reason: "امتداد مزدوج" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={FileX}    label="ملفات مرفوضة"  value="29"   sub="هذا الشهر"  color={RED}   />
        <StatCard icon={ShieldCheck} label="ملفات آمنة"  value="1,482" sub="تم رفعها"  color={GREEN} />
        <StatCard icon={Image}    label="صور مضغوطة"    value="1,203" sub="وفّرت 34%"  color={BLUE}  />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border" style={{ backgroundColor: CARD, borderColor: BORDER }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <p className="text-sm font-bold" style={{ color: TEXT }}>قواعد حماية الرفع</p>
          </div>
          <div className="divide-y">
            {rules.map((r, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                <p className="flex-1 text-xs font-semibold" style={{ color: TEXT }}>{r.rule}</p>
                <button onClick={() => toggle(i)}>
                  {states[i]
                    ? <ToggleRight className="w-8 h-8" style={{ color: GREEN }} />
                    : <ToggleLeft  className="w-8 h-8" style={{ color: MUTED }} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border" style={{ backgroundColor: CARD, borderColor: BORDER }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <p className="text-sm font-bold" style={{ color: TEXT }}>الملفات المرفوضة مؤخراً</p>
          </div>
          <div className="divide-y">
            {rejected.map((f, i) => (
              <div key={i} className="px-5 py-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${RED}22` }}>
                  <FileX className="w-4 h-4" style={{ color: RED }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono font-bold" style={{ color: RED }}>{f.file}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>{f.size} · {f.ip} · {f.time}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
                    style={{ backgroundColor: `${YELLOW}22`, color: YELLOW }}>
                    {f.reason}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t" style={{ borderColor: BORDER }}>
            <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: `${BLUE}11`, color: BLUE, border: `1px solid ${BLUE}33` }}>
              💡 جميع الملفات المرفوضة يتم تسجيلها وإخطار الأدمن فوراً
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Logs Tab ──────────────────────────────────────────────────────────────────
function LogsTab() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("الكل");
  const types = ["الكل", "FIREWALL", "AUTH", "UPLOAD", "API", "SESSION", "DB"];

  const sevColor: Record<string, string> = {
    critical: RED, high: YELLOW, medium: BLUE, info: MUTED,
  };

  const filtered = LOGS.filter(l => {
    const matchType = typeFilter === "الكل" || l.type === typeFilter;
    const matchSearch = !search || l.msg.toLowerCase().includes(search.toLowerCase()) || l.ip.includes(search);
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Search + filter */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: MUTED }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="بحث في السجلات..."
            className="w-full pr-9 pl-4 py-2.5 rounded-xl text-sm outline-none font-mono"
            style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, color: TEXT }} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className="text-[11px] font-bold px-3 py-2 rounded-lg transition-all"
              style={{ backgroundColor: typeFilter === t ? BLUE : `${MUTED}22`, color: typeFilter === t ? "#fff" : MUTED }}>
              {t}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
          style={{ backgroundColor: `${GREEN}22`, color: GREEN }}>
          <Download className="w-3.5 h-3.5" /> تصدير
        </button>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: CARD, borderColor: BORDER }}>
        <div className="px-5 py-3 border-b flex items-center gap-3" style={{ borderColor: BORDER }}>
          <span className="text-xs" style={{ color: MUTED }}>ID</span>
          <span className="text-xs w-16" style={{ color: MUTED }}>الوقت</span>
          <span className="text-xs w-20" style={{ color: MUTED }}>النوع</span>
          <span className="text-xs w-28" style={{ color: MUTED }}>IP</span>
          <span className="text-xs flex-1" style={{ color: MUTED }}>الحدث</span>
          <span className="text-xs w-16" style={{ color: MUTED }}>الخطورة</span>
        </div>
        <div className="overflow-y-auto max-h-80 font-mono">
          {filtered.map((l, i) => (
            <div key={i} className="px-5 py-2.5 flex items-center gap-3 border-b hover:bg-white/5 transition-colors"
              style={{ borderColor: BORDER }}>
              <span className="text-[10px] w-12 flex-shrink-0" style={{ color: MUTED }}>{l.id}</span>
              <span className="text-[10px] w-16 flex-shrink-0" style={{ color: MUTED }}>{l.time}</span>
              <span className="text-[10px] w-20 flex-shrink-0 font-bold" style={{ color: CYAN }}>{l.type}</span>
              <span className="text-[10px] w-28 flex-shrink-0" style={{ color: MUTED }}>{l.ip}</span>
              <span className="text-[11px] flex-1" style={{ color: TEXT }}>{l.msg}</span>
              <SevBadge sev={l.sev} />
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-10 text-center text-xs" style={{ color: MUTED }}>لا توجد نتائج</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Backup Tab ────────────────────────────────────────────────────────────────
function BackupTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Archive}    label="إجمالي النسخ"   value={BACKUPS.length} sub="متاحة الآن"     color={BLUE}  />
        <StatCard icon={HardDrive}  label="حجم الاحتياطي"  value="9.4 GB"         sub="إجمالي المساحة" color={PURPLE}/>
        <StatCard icon={Clock}      label="آخر نسخة"       value="منذ 3 س"         sub="تلقائية"        color={GREEN} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border" style={{ backgroundColor: CARD, borderColor: BORDER }}>
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
            <p className="text-sm font-bold" style={{ color: TEXT }}>النسخ الاحتياطية</p>
            <button className="text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5"
              style={{ backgroundColor: `${BLUE}22`, color: BLUE }}>
              <Plus className="w-3 h-3" /> نسخة الآن
            </button>
          </div>
          <div className="divide-y">
            {BACKUPS.map((b, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${GREEN}22` }}>
                  <Archive className="w-4 h-4" style={{ color: GREEN }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: TEXT }}>{b.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>{b.date} · {b.size}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ backgroundColor: b.type === "auto" ? `${BLUE}22` : `${PURPLE}22`,
                           color: b.type === "auto" ? BLUE : PURPLE }}>
                  {b.type === "auto" ? "تلقائي" : "يدوي"}
                </span>
                <div className="flex gap-1.5">
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${GREEN}22` }}>
                    <Download className="w-3 h-3" style={{ color: GREEN }} />
                  </button>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${MUTED}22` }}>
                    <Trash2 className="w-3 h-3" style={{ color: MUTED }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border p-5" style={{ backgroundColor: CARD, borderColor: BORDER }}>
            <p className="text-sm font-bold mb-4" style={{ color: TEXT }}>جدولة النسخ الاحتياطي</p>
            {[
              { label: "نسخة يومية تلقائية", time: "03:00 ص", on: true  },
              { label: "نسخة أسبوعية كاملة", time: "الأحد 02:00 ص", on: true  },
              { label: "نسخة قاعدة البيانات فقط", time: "كل 6 ساعات", on: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0"
                style={{ borderColor: BORDER }}>
                <div>
                  <p className="text-xs font-semibold" style={{ color: TEXT }}>{s.label}</p>
                  <p className="text-[10px]" style={{ color: MUTED }}>{s.time}</p>
                </div>
                {s.on
                  ? <ToggleRight className="w-8 h-8" style={{ color: GREEN }} />
                  : <ToggleLeft  className="w-8 h-8" style={{ color: MUTED }} />}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border p-5" style={{ backgroundColor: `${RED}0A`, borderColor: `${RED}33` }}>
            <p className="text-sm font-bold mb-2" style={{ color: RED }}>استعادة طارئة</p>
            <p className="text-xs mb-4" style={{ color: MUTED }}>
              استعادة المنصة بالكامل من آخر نسخة احتياطية سليمة
            </p>
            <button className="w-full py-2.5 rounded-xl font-bold text-sm"
              style={{ backgroundColor: `${RED}22`, color: RED, border: `1px solid ${RED}44` }}>
              🚨 تفعيل الاستعادة الطارئة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────────
function SecuritySettingsTab() {
  const [level, setLevel] = useState<"low" | "medium" | "high" | "extreme">("high");
  const levels: Array<{ id: typeof level; label: string; desc: string; color: string }> = [
    { id: "low",     label: "منخفض",    desc: "حماية أساسية",                    color: MUTED   },
    { id: "medium",  label: "متوسط",    desc: "توازن بين الأمان والأداء",        color: BLUE    },
    { id: "high",    label: "عالي",     desc: "حماية قوية (موصى به)",            color: GREEN   },
    { id: "extreme", label: "أقصى",    desc: "أشد الحماية — قد يؤثر على الأداء", color: RED     },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border p-5" style={{ backgroundColor: CARD, borderColor: BORDER }}>
        <p className="text-sm font-bold mb-4" style={{ color: TEXT }}>مستوى الأمان الكلي</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {levels.map(l => (
            <button key={l.id} onClick={() => setLevel(l.id)}
              className="p-4 rounded-xl border-2 text-right transition-all"
              style={{
                borderColor: level === l.id ? l.color : BORDER,
                backgroundColor: level === l.id ? `${l.color}15` : PANEL,
              }}>
              <p className="text-sm font-black" style={{ color: l.color }}>{l.label}</p>
              <p className="text-[11px] mt-1" style={{ color: MUTED }}>{l.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border p-5 space-y-4" style={{ backgroundColor: CARD, borderColor: BORDER }}>
          <p className="text-sm font-bold" style={{ color: TEXT }}>إعدادات الجلسة</p>
          {[
            { label: "مهلة الجلسة (دقيقة)", value: "30" },
            { label: "الحد الأقصى لمحاولات الدخول", value: "5" },
            { label: "مدة الحظر المؤقت (دقيقة)", value: "15" },
          ].map((s, i) => (
            <div key={i}>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: MUTED }}>{s.label}</label>
              <input defaultValue={s.value} className="w-full py-2.5 px-4 rounded-xl text-sm outline-none"
                style={{ backgroundColor: PANEL, border: `1px solid ${BORDER}`, color: TEXT }} />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border p-5" style={{ backgroundColor: CARD, borderColor: BORDER }}>
            <p className="text-sm font-bold mb-4" style={{ color: TEXT }}>Whitelist / Blacklist</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: GREEN }}>IPs موثوقة (Whitelist)</label>
                <textarea defaultValue={"197.46.0.0/16\n192.168.1.0/24"} rows={3}
                  className="w-full py-2 px-3 rounded-xl text-xs font-mono outline-none resize-none"
                  style={{ backgroundColor: PANEL, border: `1px solid ${BORDER}`, color: TEXT }} />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: RED }}>IPs محظورة (Blacklist)</label>
                <textarea defaultValue={"185.220.101.0/24\n77.247.181.0/24"} rows={3}
                  className="w-full py-2 px-3 rounded-xl text-xs font-mono outline-none resize-none"
                  style={{ backgroundColor: PANEL, border: `1px solid ${BORDER}`, color: TEXT }} />
              </div>
            </div>
          </div>

          <button className="w-full py-3 rounded-xl font-bold text-sm"
            style={{ backgroundColor: GREEN, color: "#000" }}>
            ✓ حفظ جميع الإعدادات
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Notifications Tab ─────────────────────────────────────────────────────────
function NotificationsTab() {
  const channels = [
    { name: "إيميل",            icon: Mail,  desc: "تنبيهات على الإيميل الرسمي",     on: true  },
    { name: "Telegram Bot",    icon: Send,  desc: "إرسال تنبيهات لبوت تيليجرام",    on: false },
    { name: "WhatsApp",        icon: Phone, desc: "إرسال رسائل على واتساب",          on: false },
    { name: "Browser Notifications", icon: Bell, desc: "إشعارات المتصفح المباشرة", on: true  },
  ];
  const [chanState, setChanState] = useState(channels.map(c => c.on));
  const toggleChan = (i: number) => setChanState(p => p.map((v, j) => j === i ? !v : v));

  const triggers = [
    { name: "تسجيل دخول مشبوه",       on: true  },
    { name: "هجوم SQL Injection",      on: true  },
    { name: "محاولات Brute Force",     on: true  },
    { name: "رفع ملف خطير",           on: true  },
    { name: "تجاوز Rate Limit",       on: true  },
    { name: "IP جديد للأدمن",         on: true  },
    { name: "نجاح النسخة الاحتياطية", on: false },
    { name: "تحديث قواعد الحماية",    on: false },
  ];
  const [trigState, setTrigState] = useState(triggers.map(t => t.on));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border" style={{ backgroundColor: CARD, borderColor: BORDER }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <p className="text-sm font-bold" style={{ color: TEXT }}>قنوات الإشعارات</p>
          </div>
          <div className="divide-y">
            {channels.map((c, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <c.icon className="w-4 h-4" style={{ color: CYAN }} />
                    <p className="text-xs font-bold" style={{ color: TEXT }}>{c.name}</p>
                  </div>
                  <button onClick={() => toggleChan(i)}>
                    {chanState[i]
                      ? <ToggleRight className="w-8 h-8" style={{ color: GREEN }} />
                      : <ToggleLeft  className="w-8 h-8" style={{ color: MUTED }} />}
                  </button>
                </div>
                <p className="text-[11px] mb-2" style={{ color: MUTED }}>{c.desc}</p>
                {chanState[i] && (
                  <input placeholder="أدخل التفاصيل..."
                    className="w-full py-2 px-3 rounded-lg text-xs outline-none"
                    style={{ backgroundColor: PANEL, border: `1px solid ${BORDER}`, color: TEXT }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border" style={{ backgroundColor: CARD, borderColor: BORDER }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}>
            <p className="text-sm font-bold" style={{ color: TEXT }}>متى يتم الإشعار</p>
          </div>
          <div className="divide-y">
            {triggers.map((t, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <p className="text-xs font-semibold" style={{ color: TEXT }}>{t.name}</p>
                <button onClick={() => setTrigState(p => p.map((v, j) => j === i ? !v : v))}>
                  {trigState[i]
                    ? <ToggleRight className="w-7 h-7" style={{ color: GREEN }} />
                    : <ToggleLeft  className="w-7 h-7" style={{ color: MUTED }} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ZARA Security Section ────────────────────────────────────────────────
export function ZARASecuritySection() {
  const [tab, setTab] = useState("dashboard");
  const [threatTick, setThreatTick] = useState(3841);

  useEffect(() => {
    const t = setInterval(() => setThreatTick(p => p + rnd(0, 3)), 2000);
    return () => clearInterval(t);
  }, []);

  const CONTENT: Record<string, React.ReactNode> = {
    dashboard: <DashboardTab />,
    firewall:  <FirewallTab />,
    threats:   <ThreatsTab />,
    admin:     <AdminProtectionTab />,
    upload:    <UploadProtectionTab />,
    logs:      <LogsTab />,
    backup:    <BackupTab />,
    settings:  <SecuritySettingsTab />,
    notifs:    <NotificationsTab />,
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="bg-white rounded-2xl border px-6 py-5" style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${GREEN}22`, border: `1px solid ${GREEN}44` }}>
              <Shield className="w-5 h-5" style={{ color: GREEN }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black" style={{ color: TEXT }}>ZARA Security AI</h1>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: `${GREEN}22`, color: GREEN, border: `1px solid ${GREEN}44` }}>
                  <PulseDot color={GREEN} />
                  ACTIVE
                </div>
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>
                نظام الأمان الذكي · {threatTick.toLocaleString()} تهديد محجوب
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: `${CYAN}15`, color: CYAN, border: `1px solid ${CYAN}33` }}>
              <Activity className="w-3.5 h-3.5" />
              Real-time Monitoring
            </div>
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}33` }}>
              <ShieldCheck className="w-3.5 h-3.5" />
              Score: 92/100
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0.5 mt-5 overflow-x-auto">
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all"
                style={{
                  backgroundColor: active ? `${GREEN}20` : "transparent",
                  color: active ? GREEN : MUTED,
                  border: active ? `1px solid ${GREEN}44` : "1px solid transparent",
                }}>
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div>
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            {CONTENT[tab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
