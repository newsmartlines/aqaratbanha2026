import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, ChevronRight, ChevronLeft, Plus, Edit2, Trash2,
  Search, ToggleLeft, ToggleRight, X, Check, Home,
  Building2, Map, Layers, Eye, EyeOff, MoreVertical,
  Download, Upload, RefreshCw, Filter, Globe, Flag,
  ArrowRight, Hash, Star,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Level = 0 | 1 | 2 | 3;

interface GeoItem {
  id: string;
  name: string;
  nameEn: string;
  parentId: string | null;
  level: Level;
  active: boolean;
  order: number;
  featured?: boolean;
}

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED: GeoItem[] = [
  // ── Level 0 — محافظات ──────────────────────────────────────────────────────
  { id: "g1", name: "القليوبية",     nameEn: "Qalyubia",     parentId: null, level: 0, active: true,  order: 1, featured: true  },
  { id: "g2", name: "القاهرة",       nameEn: "Cairo",        parentId: null, level: 0, active: true,  order: 2 },
  { id: "g3", name: "الجيزة",        nameEn: "Giza",         parentId: null, level: 0, active: true,  order: 3 },
  { id: "g4", name: "الإسكندرية",   nameEn: "Alexandria",   parentId: null, level: 0, active: true,  order: 4 },
  { id: "g5", name: "المنوفية",      nameEn: "Monufia",      parentId: null, level: 0, active: false, order: 5 },
  { id: "g6", name: "الشرقية",       nameEn: "Sharqia",      parentId: null, level: 0, active: false, order: 6 },
  { id: "g7", name: "الغربية",       nameEn: "Gharbia",      parentId: null, level: 0, active: false, order: 7 },
  { id: "g8", name: "البحيرة",       nameEn: "Beheira",      parentId: null, level: 0, active: false, order: 8 },

  // ── Level 1 — مناطق/مراكز inside القليوبية ────────────────────────────────
  { id: "r1", name: "مركز بنها",              nameEn: "Banha Center",         parentId: "g1", level: 1, active: true,  order: 1, featured: true },
  { id: "r2", name: "مركز شبين القناطر",       nameEn: "Shebin Al-Qanatir",    parentId: "g1", level: 1, active: true,  order: 2 },
  { id: "r3", name: "مركز طوخ",               nameEn: "Toukh",                parentId: "g1", level: 1, active: true,  order: 3 },
  { id: "r4", name: "مركز قليوب",             nameEn: "Qalyoub",              parentId: "g1", level: 1, active: true,  order: 4 },
  { id: "r5", name: "مركز الخانكة",           nameEn: "El-Khanka",            parentId: "g1", level: 1, active: false, order: 5 },
  { id: "r6", name: "مركز كفر شكر",           nameEn: "Kafr Shukr",           parentId: "g1", level: 1, active: true,  order: 6 },

  // مناطق inside القاهرة
  { id: "r10", name: "مدينة نصر",    nameEn: "Nasr City",   parentId: "g2", level: 1, active: true,  order: 1 },
  { id: "r11", name: "المعادي",      nameEn: "Maadi",       parentId: "g2", level: 1, active: true,  order: 2 },
  { id: "r12", name: "مصر الجديدة", nameEn: "Heliopolis",  parentId: "g2", level: 1, active: true,  order: 3 },

  // مناطق inside الجيزة
  { id: "r20", name: "الشيخ زايد",   nameEn: "Sheikh Zayed", parentId: "g3", level: 1, active: true, order: 1 },
  { id: "r21", name: "أكتوبر",       nameEn: "October",      parentId: "g3", level: 1, active: true, order: 2 },

  // ── Level 2 — مدن inside مراكز ───────────────────────────────────────────
  // inside مركز بنها
  { id: "c1", name: "بنها",              nameEn: "Banha",           parentId: "r1", level: 2, active: true,  order: 1, featured: true },
  { id: "c2", name: "كفر شكر",          nameEn: "Kafr Shukr",      parentId: "r1", level: 2, active: true,  order: 2 },
  { id: "c3", name: "أبو زعبل",         nameEn: "Abu Zabal",       parentId: "r1", level: 2, active: true,  order: 3 },

  // inside مركز شبين القناطر
  { id: "c10", name: "شبين القناطر",    nameEn: "Shebin Al-Qanatir", parentId: "r2", level: 2, active: true, order: 1 },
  { id: "c11", name: "قها",             nameEn: "Qaha",              parentId: "r2", level: 2, active: true, order: 2 },

  // inside مركز طوخ
  { id: "c20", name: "طوخ",             nameEn: "Toukh",             parentId: "r3", level: 2, active: true, order: 1 },
  { id: "c21", name: "خوشة",            nameEn: "Khousha",           parentId: "r3", level: 2, active: true, order: 2 },

  // inside مركز قليوب
  { id: "c30", name: "قليوب",           nameEn: "Qalyoub",           parentId: "r4", level: 2, active: true, order: 1 },
  { id: "c31", name: "شبرا الخيمة",    nameEn: "Shubra El-Kheima",  parentId: "r4", level: 2, active: true, order: 2 },

  // ── Level 3 — أحياء inside مدن ───────────────────────────────────────────
  // inside بنها
  { id: "n1",  name: "ميدان بنها",      nameEn: "Banha Square",     parentId: "c1", level: 3, active: true,  order: 1, featured: true },
  { id: "n2",  name: "الزهراء",          nameEn: "Al-Zahraa",        parentId: "c1", level: 3, active: true,  order: 2 },
  { id: "n3",  name: "المطرية",          nameEn: "Al-Matareya",      parentId: "c1", level: 3, active: true,  order: 3 },
  { id: "n4",  name: "الملك فيصل",      nameEn: "King Faisal",      parentId: "c1", level: 3, active: true,  order: 4 },
  { id: "n5",  name: "عزبة النخل",       nameEn: "Izbat Al-Nakhl",   parentId: "c1", level: 3, active: false, order: 5 },
  { id: "n6",  name: "الإسكندرية",      nameEn: "Alexandria St.",   parentId: "c1", level: 3, active: true,  order: 6 },
  { id: "n7",  name: "عين شمس",          nameEn: "Ain Shams",        parentId: "c1", level: 3, active: true,  order: 7 },
  { id: "n8",  name: "الكورنيش",         nameEn: "Al-Corniche",      parentId: "c1", level: 3, active: true,  order: 8 },

  // inside كفر شكر
  { id: "n20", name: "وسط كفر شكر",    nameEn: "Kafr Shukr Center", parentId: "c2", level: 3, active: true, order: 1 },

  // inside شبين القناطر
  { id: "n30", name: "حي الخدمات",      nameEn: "Services District", parentId: "c10", level: 3, active: true, order: 1 },
  { id: "n31", name: "حي النيل",        nameEn: "Nile District",     parentId: "c10", level: 3, active: true, order: 2 },
];

// ── Level config ──────────────────────────────────────────────────────────────
const LEVEL_CONFIG = [
  { label: "المحافظات",  labelSingle: "محافظة",  icon: Flag,     color: "#7C3AED", bg: "#7C3AED15", border: "#7C3AED33" },
  { label: "المناطق",   labelSingle: "منطقة",   icon: Map,      color: "#0D9488", bg: "#0D948815", border: "#0D948833" },
  { label: "المدن",     labelSingle: "مدينة",   icon: Building2,color: "#2563EB", bg: "#2563EB15", border: "#2563EB33" },
  { label: "الأحياء",   labelSingle: "حي",      icon: MapPin,   color: "#D97706", bg: "#D9770615", border: "#D9770633" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function genId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

function childCount(items: GeoItem[], parentId: string, level: Level) {
  if (level >= 3) return 0;
  return items.filter(i => i.parentId === parentId && i.level === (level + 1) as Level).length;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function GeoModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md" dir="rtl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

// ── Item Card ─────────────────────────────────────────────────────────────────
function GeoCard({
  item, level, items, onDrillDown, onEdit, onDelete, onToggle,
}: {
  item: GeoItem; level: Level; items: GeoItem[];
  onDrillDown: (id: string) => void;
  onEdit: (item: GeoItem) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const cfg = LEVEL_CONFIG[level];
  const nextCfg = level < 3 ? LEVEL_CONFIG[level + 1] : null;
  const children = level < 3 ? childCount(items, item.id, level) : 0;
  const LevelIcon = cfg.icon;

  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">

      {/* Color bar */}
      <div className="h-1 w-full" style={{ backgroundColor: cfg.color }} />

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
            <LevelIcon className="w-5 h-5" style={{ color: cfg.color }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
              {item.featured && (
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{item.nameEn}</p>
            {nextCfg && (
              <p className="text-xs mt-1.5 font-medium" style={{ color: children > 0 ? cfg.color : "#CBD5E1" }}>
                {children} {nextCfg.label}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
              {item.active ? "ظاهر" : "مخفي"}
            </span>
            <span className="text-[10px] text-gray-300 font-medium">#{item.order}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
          {level < 3 && (
            <button onClick={() => onDrillDown(item.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
              style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
              <span>عرض {nextCfg?.label}</span>
              <ChevronLeft className="w-3 h-3" />
            </button>
          )}
          <button onClick={() => onToggle(item.id)}
            className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors">
            {item.active
              ? <ToggleRight className="w-5 h-5" style={{ color: "#0D9488" }} />
              : <ToggleLeft  className="w-5 h-5 text-gray-300" />}
          </button>
          <button onClick={() => onEdit(item)}
            className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center transition-colors">
            <Edit2 className="w-3.5 h-3.5 text-blue-400" />
          </button>
          <button onClick={() => onDelete(item.id)}
            className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors">
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function GeoManagerSection() {
  const [items, setItems]     = useState<GeoItem[]>(SEED);
  const [path, setPath]       = useState<string[]>([]);    // IDs from root → current parent
  const [search, setSearch]   = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "hidden">("all");

  // Modal state
  const [addOpen, setAddOpen]   = useState(false);
  const [editItem, setEditItem] = useState<GeoItem | null>(null);
  const [form, setForm]         = useState({ name: "", nameEn: "", featured: false, order: 1 });

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentLevel = path.length as Level;
  const parentId     = path.length > 0 ? path[path.length - 1] : null;
  const cfg          = LEVEL_CONFIG[currentLevel];
  const LevelIcon    = cfg.icon;

  const breadcrumb = path.map(id => items.find(i => i.id === id)).filter(Boolean) as GeoItem[];

  const currentItems = useMemo(() => {
    return items
      .filter(i => {
        if (i.level !== currentLevel) return false;
        if (i.parentId !== parentId)  return false;
        if (filterStatus === "active" && !i.active)  return false;
        if (filterStatus === "hidden" && i.active)   return false;
        if (search && !i.name.includes(search) && !i.nameEn.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [items, currentLevel, parentId, search, filterStatus]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = LEVEL_CONFIG.map((_, l) => ({
    total:  items.filter(i => i.level === l).length,
    active: items.filter(i => i.level === l && i.active).length,
  }));

  // ── Handlers ──────────────────────────────────────────────────────────────
  const drillDown = (id: string) => {
    if (currentLevel < 3) setPath(p => [...p, id]);
    setSearch("");
  };

  const goUp = () => {
    setPath(p => p.slice(0, -1));
    setSearch("");
  };

  const goTo = (index: number) => {
    setPath(p => p.slice(0, index));
    setSearch("");
  };

  const openAdd = () => {
    const maxOrder = Math.max(0, ...items.filter(i => i.level === currentLevel && i.parentId === parentId).map(i => i.order));
    setForm({ name: "", nameEn: "", featured: false, order: maxOrder + 1 });
    setAddOpen(true);
  };

  const saveAdd = () => {
    if (!form.name.trim()) return;
    const newItem: GeoItem = {
      id: genId(),
      name: form.name.trim(),
      nameEn: form.nameEn.trim(),
      parentId,
      level: currentLevel,
      active: true,
      order: form.order,
      featured: form.featured,
    };
    setItems(p => [...p, newItem]);
    setAddOpen(false);
  };

  const openEdit = (item: GeoItem) => {
    setForm({ name: item.name, nameEn: item.nameEn, featured: !!item.featured, order: item.order });
    setEditItem(item);
  };

  const saveEdit = () => {
    if (!editItem || !form.name.trim()) return;
    setItems(p => p.map(i => i.id === editItem.id
      ? { ...i, name: form.name.trim(), nameEn: form.nameEn.trim(), featured: form.featured, order: form.order }
      : i));
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    // Collect all descendant IDs recursively
    const toDelete = new Set<string>();
    const collect = (pid: string) => {
      toDelete.add(pid);
      items.filter(i => i.parentId === pid).forEach(c => collect(c.id));
    };
    collect(id);
    if (!window.confirm(`حذف هذا العنصر وكل ما يحتويه (${toDelete.size - 1} عنصر فرعي)؟`)) return;
    setItems(p => p.filter(i => !toDelete.has(i.id)));
  };

  const handleToggle = (id: string) =>
    setItems(p => p.map(i => i.id === id ? { ...i, active: !i.active } : i));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-gray-900">إدارة المناطق الجغرافية</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            نظام هرمي متكامل: محافظات → مناطق → مدن → أحياء
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            <Download className="w-3.5 h-3.5" /> تصدير
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            <Upload className="w-3.5 h-3.5" /> استيراد
          </button>
        </div>
      </div>

      {/* ── Global stats strip ── */}
      <div className="grid grid-cols-4 gap-3">
        {LEVEL_CONFIG.map((lc, l) => {
          const Icon = lc.icon;
          const isActive = l === currentLevel;
          return (
            <button key={l} onClick={() => { setPath([]); setSearch(""); }}
              className="rounded-2xl p-4 border text-right transition-all hover:shadow-sm"
              style={{
                backgroundColor: isActive ? lc.bg : "white",
                borderColor: isActive ? lc.border : "#F1F5F9",
              }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: lc.bg }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: lc.color }} />
                </div>
                <span className="text-xs font-semibold text-gray-500">{lc.label}</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{stats[l].total}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{stats[l].active} ظاهر</p>
            </button>
          );
        })}
      </div>

      {/* ── Breadcrumb ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-1.5 flex-wrap">
        <button onClick={() => { setPath([]); setSearch(""); }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors text-gray-600">
          <Home className="w-3.5 h-3.5" />
          الرئيسية
        </button>

        {breadcrumb.map((b, i) => {
          const bc = LEVEL_CONFIG[b.level];
          return (
            <span key={b.id} className="flex items-center gap-1.5">
              <ChevronLeft className="w-3.5 h-3.5 text-gray-300" />
              <button onClick={() => goTo(i + 1)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors"
                style={{ color: bc.color }}>
                <bc.icon className="w-3 h-3" />
                {b.name}
              </button>
            </span>
          );
        })}

        <span className="flex items-center gap-1.5 mr-auto">
          <div className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ backgroundColor: cfg.bg }}>
            <LevelIcon className="w-3 h-3" style={{ color: cfg.color }} />
          </div>
          <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
          <span className="text-xs text-gray-400">({currentItems.length})</span>
        </span>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {path.length > 0 && (
          <button onClick={goUp}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-4 h-4" />
            رجوع
          </button>
        )}

        <div className="flex-1 min-w-48 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={`بحث في ${cfg.label}...`}
            className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-teal-300 focus:bg-white transition-all" />
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(["all", "active", "hidden"] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterStatus === s ? "bg-white shadow-sm text-gray-800" : "text-gray-500"}`}>
              {s === "all" ? "الكل" : s === "active" ? "الظاهر" : "المخفي"}
            </button>
          ))}
        </div>

        <button onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
          style={{ backgroundColor: cfg.color }}>
          <Plus className="w-4 h-4" />
          إضافة {cfg.labelSingle}
        </button>
      </div>

      {/* ── Context info (inside a parent) ── */}
      {path.length > 0 && (
        <div className="rounded-xl px-4 py-3 flex items-center gap-2 text-sm"
          style={{ backgroundColor: `${cfg.color}0D`, border: `1px solid ${cfg.border}` }}>
          <LevelIcon className="w-4 h-4 flex-shrink-0" style={{ color: cfg.color }} />
          <span className="font-medium text-gray-700">
            تعرض الآن {cfg.label} داخل:
          </span>
          {breadcrumb.map((b, i) => (
            <span key={b.id} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-300 mx-1">›</span>}
              <span className="font-bold" style={{ color: LEVEL_CONFIG[b.level].color }}>{b.name}</span>
            </span>
          ))}
        </div>
      )}

      {/* ── Grid ── */}
      <AnimatePresence mode="popLayout">
        {currentItems.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentItems.map(item => (
              <GeoCard key={item.id} item={item} level={currentLevel} items={items}
                onDrillDown={drillDown} onEdit={openEdit}
                onDelete={handleDelete} onToggle={handleToggle} />
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4"
              style={{ backgroundColor: cfg.bg }}>
              <LevelIcon className="w-7 h-7" style={{ color: cfg.color }} />
            </div>
            <p className="font-semibold text-gray-700 mb-1">لا توجد {cfg.label} {search ? "تطابق البحث" : "بعد"}</p>
            <p className="text-sm text-gray-400 mb-5">
              {search ? "جرب كلمة بحث مختلفة" : `اضغط "إضافة ${cfg.labelSingle}" للبدء`}
            </p>
            {!search && (
              <button onClick={openAdd}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: cfg.color }}>
                <Plus className="w-4 h-4" />
                إضافة {cfg.labelSingle}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add Modal ── */}
      <AnimatePresence>
        {addOpen && (
          <GeoModal title={`إضافة ${cfg.labelSingle} جديد${["ة","ة","ة",""][currentLevel]}`} onClose={() => setAddOpen(false)}>
            <div className="space-y-4">
              {/* Parent context */}
              {path.length > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl text-xs font-semibold"
                  style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                  <LevelIcon className="w-3.5 h-3.5" />
                  داخل: {breadcrumb.map(b => b.name).join(" › ")}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">الاسم بالعربي *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder={`مثل: ${currentLevel === 0 ? "القاهرة" : currentLevel === 1 ? "مركز بنها" : currentLevel === 2 ? "بنها" : "ميدان بنها"}`}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-teal-300 transition-all" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">الاسم بالإنجليزي</label>
                <input value={form.nameEn} onChange={e => setForm(p => ({ ...p, nameEn: e.target.value }))}
                  placeholder={`e.g. ${currentLevel === 0 ? "Cairo" : currentLevel === 1 ? "Banha Center" : currentLevel === 2 ? "Banha" : "Banha Square"}`}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-teal-300 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">ترتيب الظهور</label>
                  <input type="number" min={1} value={form.order}
                    onChange={e => setForm(p => ({ ...p, order: +e.target.value }))}
                    className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-teal-300 transition-all" />
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured}
                      onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                      className="w-4 h-4 accent-amber-400" />
                    <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400" /> مميز
                    </span>
                  </label>
                </div>
              </div>

              <button onClick={saveAdd}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: cfg.color }}>
                <Plus className="w-4 h-4" /> إضافة {cfg.labelSingle}
              </button>
            </div>
          </GeoModal>
        )}
      </AnimatePresence>

      {/* ── Edit Modal ── */}
      <AnimatePresence>
        {editItem && (
          <GeoModal title={`تعديل ${LEVEL_CONFIG[editItem.level].labelSingle}`} onClose={() => setEditItem(null)}>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">الاسم بالعربي *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-teal-300 transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">الاسم بالإنجليزي</label>
                <input value={form.nameEn} onChange={e => setForm(p => ({ ...p, nameEn: e.target.value }))}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-teal-300 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">ترتيب الظهور</label>
                  <input type="number" min={1} value={form.order}
                    onChange={e => setForm(p => ({ ...p, order: +e.target.value }))}
                    className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-teal-300 transition-all" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured}
                      onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                      className="w-4 h-4 accent-amber-400" />
                    <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400" /> مميز
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditItem(null)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  إلغاء
                </button>
                <button onClick={saveEdit}
                  className="flex-[2] py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                  style={{ backgroundColor: LEVEL_CONFIG[editItem.level].color }}>
                  <Check className="w-4 h-4" /> حفظ التعديل
                </button>
              </div>
            </div>
          </GeoModal>
        )}
      </AnimatePresence>
    </div>
  );
}
