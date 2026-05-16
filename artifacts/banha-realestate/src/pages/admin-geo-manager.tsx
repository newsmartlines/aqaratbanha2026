import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Plus, Edit2, Trash2, Search,
  X, Check, Flag, Building2, Download, Star, Eye, EyeOff,
  CheckSquare, Square, ChevronLeft, ChevronRight, Hash,
  Globe, Activity, Layers, AlertCircle,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Level = 0 | 1 | 2;

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

// ── Level config ──────────────────────────────────────────────────────────────
const LEVELS = [
  {
    label: "المحافظات", singular: "محافظة", singularF: "محافظة",
    icon: Flag, color: "#7C3AED", bg: "#7C3AED10", border: "#7C3AED28",
    placeholder: "مثل: القاهرة", placeholderEn: "e.g. Cairo",
  },
  {
    label: "المدن", singular: "مدينة", singularF: "مدينة",
    icon: Building2, color: "#2563EB", bg: "#2563EB10", border: "#2563EB28",
    placeholder: "مثل: بنها", placeholderEn: "e.g. Banha",
  },
  {
    label: "المناطق", singular: "منطقة", singularF: "منطقة",
    icon: MapPin, color: "#0EA5E9", bg: "#0EA5E910", border: "#0EA5E928",
    placeholder: "مثل: ميدان بنها", placeholderEn: "e.g. Banha Square",
  },
] as const;

// ── Seed data ─────────────────────────────────────────────────────────────────
function genId() { return `geo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`; }

const SEED: GeoItem[] = [
  // محافظات
  { id: "gov1", name: "القليوبية",    nameEn: "Qalyubia",       parentId: null, level: 0, active: true,  order: 1, featured: true },
  { id: "gov2", name: "القاهرة",      nameEn: "Cairo",          parentId: null, level: 0, active: true,  order: 2 },
  { id: "gov3", name: "الجيزة",       nameEn: "Giza",           parentId: null, level: 0, active: true,  order: 3 },
  { id: "gov4", name: "الإسكندرية",  nameEn: "Alexandria",     parentId: null, level: 0, active: true,  order: 4 },
  { id: "gov5", name: "المنوفية",     nameEn: "Monufia",        parentId: null, level: 0, active: false, order: 5 },
  { id: "gov6", name: "الشرقية",      nameEn: "Sharqia",        parentId: null, level: 0, active: false, order: 6 },
  { id: "gov7", name: "الغربية",      nameEn: "Gharbia",        parentId: null, level: 0, active: false, order: 7 },
  { id: "gov8", name: "البحيرة",      nameEn: "Beheira",        parentId: null, level: 0, active: false, order: 8 },

  // مدن — القليوبية
  { id: "cty1", name: "بنها",               nameEn: "Banha",             parentId: "gov1", level: 1, active: true,  order: 1, featured: true },
  { id: "cty2", name: "شبين القناطر",       nameEn: "Shebin Al-Qanatir", parentId: "gov1", level: 1, active: true,  order: 2 },
  { id: "cty3", name: "طوخ",                nameEn: "Toukh",             parentId: "gov1", level: 1, active: true,  order: 3 },
  { id: "cty4", name: "قليوب",              nameEn: "Qalyoub",           parentId: "gov1", level: 1, active: true,  order: 4 },
  { id: "cty5", name: "الخانكة",            nameEn: "El-Khanka",         parentId: "gov1", level: 1, active: false, order: 5 },
  { id: "cty6", name: "كفر شكر",            nameEn: "Kafr Shukr",        parentId: "gov1", level: 1, active: true,  order: 6 },
  { id: "cty7", name: "أبو زعبل",           nameEn: "Abu Zabal",         parentId: "gov1", level: 1, active: false, order: 7 },

  // مدن — القاهرة
  { id: "cty10", name: "مدينة نصر",         nameEn: "Nasr City",   parentId: "gov2", level: 1, active: true, order: 1 },
  { id: "cty11", name: "المعادي",            nameEn: "Maadi",       parentId: "gov2", level: 1, active: true, order: 2 },
  { id: "cty12", name: "مصر الجديدة",       nameEn: "Heliopolis",  parentId: "gov2", level: 1, active: true, order: 3 },
  { id: "cty13", name: "الزمالك",            nameEn: "Zamalek",     parentId: "gov2", level: 1, active: true, order: 4 },
  { id: "cty14", name: "شبرا",              nameEn: "Shubra",      parentId: "gov2", level: 1, active: true, order: 5 },

  // مدن — الجيزة
  { id: "cty20", name: "الشيخ زايد",        nameEn: "Sheikh Zayed", parentId: "gov3", level: 1, active: true, order: 1 },
  { id: "cty21", name: "أكتوبر",            nameEn: "6th October",  parentId: "gov3", level: 1, active: true, order: 2 },
  { id: "cty22", name: "الهرم",             nameEn: "Al-Haram",     parentId: "gov3", level: 1, active: true, order: 3 },

  // مدن — الإسكندرية
  { id: "cty30", name: "محرم بك",           nameEn: "Moharam Bek",   parentId: "gov4", level: 1, active: true, order: 1 },
  { id: "cty31", name: "سموحة",             nameEn: "Smouha",        parentId: "gov4", level: 1, active: true, order: 2 },
  { id: "cty32", name: "العجمي",            nameEn: "Agami",         parentId: "gov4", level: 1, active: false, order: 3 },

  // مناطق — بنها
  { id: "dst1",  name: "ميدان بنها",        nameEn: "Banha Square",    parentId: "cty1", level: 2, active: true,  order: 1, featured: true },
  { id: "dst2",  name: "الزهراء",            nameEn: "Al-Zahraa",       parentId: "cty1", level: 2, active: true,  order: 2 },
  { id: "dst3",  name: "المطرية",            nameEn: "Al-Matareya",     parentId: "cty1", level: 2, active: true,  order: 3 },
  { id: "dst4",  name: "الملك فيصل",        nameEn: "King Faisal St.", parentId: "cty1", level: 2, active: true,  order: 4 },
  { id: "dst5",  name: "عزبة النخل",         nameEn: "Izbat Al-Nakhl",  parentId: "cty1", level: 2, active: false, order: 5 },
  { id: "dst6",  name: "الكورنيش",           nameEn: "Al-Corniche",     parentId: "cty1", level: 2, active: true,  order: 6 },
  { id: "dst7",  name: "عين شمس",            nameEn: "Ain Shams",       parentId: "cty1", level: 2, active: true,  order: 7 },
  { id: "dst8",  name: "حي النيل",           nameEn: "Nile District",   parentId: "cty1", level: 2, active: true,  order: 8 },
  { id: "dst9",  name: "المنطقة الصناعية",   nameEn: "Industrial Zone", parentId: "cty1", level: 2, active: false, order: 9 },

  // مناطق — شبين القناطر
  { id: "dst20", name: "حي الخدمات",        nameEn: "Services Dist.", parentId: "cty2", level: 2, active: true, order: 1 },
  { id: "dst21", name: "حي النيل",           nameEn: "Nile District",  parentId: "cty2", level: 2, active: true, order: 2 },
  { id: "dst22", name: "القرية الجديدة",     nameEn: "New Village",    parentId: "cty2", level: 2, active: true, order: 3 },

  // مناطق — طوخ
  { id: "dst30", name: "وسط طوخ",           nameEn: "Toukh Center",  parentId: "cty3", level: 2, active: true, order: 1 },
  { id: "dst31", name: "حي الشباب",         nameEn: "Youth District", parentId: "cty3", level: 2, active: true, order: 2 },
  { id: "dst32", name: "المنطقة العمرانية", nameEn: "Urban Zone",    parentId: "cty3", level: 2, active: false, order: 3 },

  // مناطق — مدينة نصر
  { id: "dst40", name: "الحي الأول",        nameEn: "Zone 1",   parentId: "cty10", level: 2, active: true, order: 1 },
  { id: "dst41", name: "الحي السابع",       nameEn: "Zone 7",   parentId: "cty10", level: 2, active: true, order: 2 },
  { id: "dst42", name: "الحي الثامن",       nameEn: "Zone 8",   parentId: "cty10", level: 2, active: true, order: 3 },
  { id: "dst43", name: "حي المساجد",        nameEn: "Mosques District", parentId: "cty10", level: 2, active: false, order: 4 },
];

// ── Inline form component ─────────────────────────────────────────────────────
function InlineForm({
  level, onSave, onCancel, initialName = "", initialNameEn = "",
}: {
  level: Level; onSave: (name: string, nameEn: string) => void;
  onCancel: () => void; initialName?: string; initialNameEn?: string;
}) {
  const [name, setName] = useState(initialName);
  const [nameEn, setNameEn] = useState(initialNameEn);
  const nameRef = useRef<HTMLInputElement>(null);
  const lc = LEVELS[level];

  useEffect(() => { nameRef.current?.focus(); }, []);

  const handleSave = () => { if (name.trim()) onSave(name.trim(), nameEn.trim()); };
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onCancel();
  };

  return (
    <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.15 }}
      className="mx-2 mb-2 rounded-xl border p-3 space-y-2"
      style={{ backgroundColor: lc.bg, borderColor: lc.border }}>
      <input ref={nameRef} value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKey}
        placeholder={lc.placeholder}
        className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 bg-white outline-none focus:border-blue-300 transition-colors font-medium" />
      <input value={nameEn} onChange={e => setNameEn(e.target.value)} onKeyDown={handleKey}
        placeholder={lc.placeholderEn}
        className="w-full px-3 py-2 rounded-lg text-xs border border-gray-200 bg-white outline-none focus:border-blue-300 transition-colors text-gray-500 dir-ltr" />
      <div className="flex gap-2">
        <button onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold text-white transition-colors"
          style={{ backgroundColor: lc.color }}>
          <Check className="w-3.5 h-3.5" /> حفظ
        </button>
        <button onClick={onCancel}
          className="w-9 h-8 rounded-lg hover:bg-white flex items-center justify-center transition-colors text-gray-400">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Column row item ────────────────────────────────────────────────────────────
function GeoRow({
  item, level, isSelected, childCount, isEditing,
  onSelect, onToggle, onEdit, onDelete, onSaveEdit, onCancelEdit,
}: {
  item: GeoItem; level: Level; isSelected: boolean; childCount: number; isEditing: boolean;
  onSelect: () => void; onToggle: () => void;
  onEdit: () => void; onDelete: () => void;
  onSaveEdit: (name: string, nameEn: string) => void;
  onCancelEdit: () => void;
}) {
  const lc = LEVELS[level];
  const IconComp = lc.icon;

  if (isEditing) {
    return (
      <AnimatePresence>
        <InlineForm level={level} initialName={item.name} initialNameEn={item.nameEn}
          onSave={onSaveEdit} onCancel={onCancelEdit} />
      </AnimatePresence>
    );
  }

  return (
    <motion.div layout initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
      className={`group mx-2 mb-1 rounded-xl border transition-all cursor-pointer select-none
        ${isSelected
          ? "border-opacity-40 shadow-sm"
          : "border-transparent hover:border-gray-100 hover:bg-gray-50/60"
        }`}
      style={isSelected ? {
        backgroundColor: `${lc.color}08`,
        borderColor: `${lc.color}40`,
        borderLeftWidth: 3,
        borderLeftColor: lc.color,
      } : {}}
      onClick={onSelect}>
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        {/* Icon */}
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: isSelected ? `${lc.color}18` : "#F8FAFC",
            border: `1px solid ${isSelected ? `${lc.color}30` : "#E2E8F0"}`,
          }}>
          <IconComp className="w-3.5 h-3.5" style={{ color: isSelected ? lc.color : "#94A3B8" }} />
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-semibold truncate ${isSelected ? "text-gray-900" : "text-gray-700"}`}>
              {item.name}
            </span>
            {item.featured && <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />}
          </div>
          {item.nameEn && (
            <p className="text-[11px] text-gray-400 truncate leading-tight">{item.nameEn}</p>
          )}
        </div>

        {/* Child count badge */}
        {level < 2 && childCount > 0 && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-gray-400 bg-gray-100 flex-shrink-0">
            {childCount}
          </span>
        )}

        {/* Active badge */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
          item.active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
        }`}>
          {item.active ? "ظاهر" : "مخفي"}
        </span>
      </div>

      {/* Action row — visible on hover or when selected */}
      <div className={`flex items-center gap-1 px-3 pb-2.5 transition-all ${
        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden"
      }`}>
        <button onClick={e => { e.stopPropagation(); onToggle(); }}
          title={item.active ? "إخفاء" : "إظهار"}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all hover:shadow-sm"
          style={item.active
            ? { color: "#10B981", borderColor: "#D1FAE5", backgroundColor: "#F0FDF4" }
            : { color: "#94A3B8", borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" }
          }>
          {item.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {item.active ? "ظاهر" : "مخفي"}
        </button>
        <button onClick={e => { e.stopPropagation(); onEdit(); }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border border-blue-100 bg-blue-50 text-blue-500 transition-all hover:bg-blue-100">
          <Edit2 className="w-3 h-3" /> تعديل
        </button>
        <button onClick={e => { e.stopPropagation(); onDelete(); }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border border-red-100 bg-red-50 text-red-500 transition-all hover:bg-red-100">
          <Trash2 className="w-3 h-3" /> حذف
        </button>

        {/* Drill-right indicator for level < 2 */}
        {level < 2 && (
          <ChevronLeft className="w-3.5 h-3.5 text-gray-300 mr-auto flex-shrink-0" />
        )}
      </div>
    </motion.div>
  );
}

// ── Column ─────────────────────────────────────────────────────────────────────
function GeoColumn({
  level, items, selectedId, parentLabel, onSelectItem, onToggle, onAdd, onEdit, onDelete, allItems,
}: {
  level: Level; items: GeoItem[]; selectedId: string | null; parentLabel?: string;
  onSelectItem: (id: string) => void; onToggle: (id: string) => void;
  onAdd: (name: string, nameEn: string) => void;
  onEdit: (id: string, name: string, nameEn: string) => void;
  onDelete: (id: string) => void;
  allItems: GeoItem[];
}) {
  const lc = LEVELS[level];
  const Icon = lc.icon;
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterHidden, setFilterHidden] = useState(false);

  const filtered = useMemo(() =>
    items.filter(i => {
      if (filterHidden && i.active) return false;
      if (!search) return true;
      return i.name.includes(search) || i.nameEn.toLowerCase().includes(search.toLowerCase());
    }), [items, search, filterHidden]);

  const activeCount = items.filter(i => i.active).length;
  const hiddenCount = items.length - activeCount;

  const getChildCount = (id: string) =>
    allItems.filter(i => i.parentId === id && i.level === (level + 1) as Level).length;

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[600px]">
      {/* Column header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: lc.bg, border: `1px solid ${lc.border}` }}>
              <Icon className="w-3.5 h-3.5" style={{ color: lc.color }} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">{lc.label}</p>
              {parentLabel && (
                <p className="text-[10px] text-gray-400 truncate max-w-[100px]">داخل: {parentLabel}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Stats pills */}
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
              {activeCount} ظاهر
            </span>
            {hiddenCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                {hiddenCount} مخفي
              </span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={`بحث...`}
              className="w-full pr-8 pl-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs outline-none focus:border-blue-300 focus:bg-white transition-all" />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <button onClick={() => setFilterHidden(f => !f)}
            title={filterHidden ? "عرض الكل" : "عرض المخفية فقط"}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
              filterHidden ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
            }`}>
            <EyeOff className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => { setAdding(true); setEditingId(null); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-all hover:opacity-90"
            style={{ backgroundColor: lc.color }}
            title={`إضافة ${lc.singular}`}>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        <AnimatePresence>
          {adding && (
            <InlineForm key="add-form" level={level}
              onSave={(name, nameEn) => { onAdd(name, nameEn); setAdding(false); }}
              onCancel={() => setAdding(false)} />
          )}
        </AnimatePresence>

        {filtered.length === 0 && !adding ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: lc.bg }}>
              <Icon className="w-5 h-5" style={{ color: lc.color }} />
            </div>
            <p className="text-xs font-semibold text-gray-500 mb-1">
              {search ? "لا توجد نتائج" : items.length === 0 ? `لا توجد ${lc.label} بعد` : "كلها مخفية"}
            </p>
            {!search && items.length === 0 && (
              <button onClick={() => setAdding(true)}
                className="mt-2 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90"
                style={{ backgroundColor: lc.color }}>
                + إضافة {lc.singular}
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map(item => (
              <GeoRow key={item.id}
                item={item} level={level}
                isSelected={selectedId === item.id}
                childCount={getChildCount(item.id)}
                isEditing={editingId === item.id}
                onSelect={() => { onSelectItem(item.id); setEditingId(null); }}
                onToggle={() => onToggle(item.id)}
                onEdit={() => { setEditingId(item.id); }}
                onDelete={() => onDelete(item.id)}
                onSaveEdit={(name, nameEn) => { onEdit(item.id, name, nameEn); setEditingId(null); }}
                onCancelEdit={() => setEditingId(null)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Column footer */}
      <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">{items.length} إجمالي</span>
        {items.length > 0 && (
          <button
            onClick={() => {
              const allActive = items.every(i => i.active);
              items.forEach(i => { if (allActive ? i.active : !i.active) onToggle(i.id); });
            }}
            className="text-[11px] font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            {items.every(i => i.active) ? "إخفاء الكل" : "إظهار الكل"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export function GeoManagerSection() {
  const [items, setItems] = useState<GeoItem[]>(SEED);
  const [selGov, setSelGov] = useState<string | null>("gov1");
  const [selCity, setSelCity] = useState<string | null>("cty1");

  // ── Computed lists ────────────────────────────────────────────────────────
  const govs = useMemo(() =>
    items.filter(i => i.level === 0).sort((a, b) => a.order - b.order), [items]);

  const cities = useMemo(() =>
    selGov ? items.filter(i => i.level === 1 && i.parentId === selGov).sort((a, b) => a.order - b.order) : [],
    [items, selGov]);

  const districts = useMemo(() =>
    selCity ? items.filter(i => i.level === 2 && i.parentId === selCity).sort((a, b) => a.order - b.order) : [],
    [items, selCity]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = [0, 1, 2].map(l => ({
    total: items.filter(i => i.level === l).length,
    active: items.filter(i => i.level === l && i.active).length,
  }));

  const totalActive = items.filter(i => i.active).length;
  const coverage = Math.round((totalActive / items.length) * 100);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const toggle = (id: string) =>
    setItems(p => p.map(i => i.id === id ? { ...i, active: !i.active } : i));

  const addItem = (level: Level, parentId: string | null, name: string, nameEn: string) => {
    const siblings = items.filter(i => i.level === level && i.parentId === parentId);
    setItems(p => [...p, {
      id: genId(), name, nameEn, parentId, level, active: true, order: siblings.length + 1,
    }]);
  };

  const editItem = (id: string, name: string, nameEn: string) =>
    setItems(p => p.map(i => i.id === id ? { ...i, name, nameEn } : i));

  const deleteItem = (id: string) => {
    const toDelete = new Set<string>();
    const collect = (pid: string) => {
      toDelete.add(pid);
      items.filter(i => i.parentId === pid).forEach(c => collect(c.id));
    };
    collect(id);
    const childCount = toDelete.size - 1;
    const label = childCount > 0 ? `حذف هذا العنصر وكل ما يحتويه (${childCount} عنصر فرعي)؟` : "حذف هذا العنصر؟";
    if (!window.confirm(label)) return;
    if (selGov && toDelete.has(selGov)) { setSelGov(null); setSelCity(null); }
    if (selCity && toDelete.has(selCity)) setSelCity(null);
    setItems(p => p.filter(i => !toDelete.has(i.id)));
  };

  const selGovItem = items.find(i => i.id === selGov);
  const selCityItem = items.find(i => i.id === selCity);

  // Export
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "geo-data.json"; a.click();
  };

  return (
    <div className="space-y-5" dir="rtl">

      {/* ── Header ── */}
      <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#2563EB12", border: "1px solid #2563EB28" }}>
            <Layers className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">إدارة المناطق الجغرافية</h2>
            <p className="text-xs text-gray-400 mt-0.5">نظام هرمي ثلاثي المستويات: محافظات ← مدن ← مناطق</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            <Download className="w-3.5 h-3.5" /> تصدير JSON
          </button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {LEVELS.map((lc, l) => {
          const Icon = lc.icon;
          return (
            <div key={l} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: lc.bg, border: `1px solid ${lc.border}` }}>
                  <Icon className="w-4 h-4" style={{ color: lc.color }} />
                </div>
                <span className="text-xs font-semibold text-gray-500">{lc.label}</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{stats[l].total}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{
                    width: stats[l].total ? `${(stats[l].active / stats[l].total) * 100}%` : "0%",
                    backgroundColor: lc.color,
                  }} />
                </div>
                <span className="text-[10px] text-gray-400 font-medium flex-shrink-0">
                  {stats[l].active} ظاهر
                </span>
              </div>
            </div>
          );
        })}

        {/* Coverage card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-50 border border-emerald-100">
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500">نسبة الظهور</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{coverage}%</p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${coverage}%` }} />
            </div>
            <span className="text-[10px] text-gray-400 font-medium flex-shrink-0">{totalActive}/{items.length}</span>
          </div>
        </div>
      </div>

      {/* ── Breadcrumb trail ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-semibold text-gray-500">
          <Globe className="w-3.5 h-3.5" /> مصر
        </div>
        <ChevronLeft className="w-4 h-4 text-gray-300" />
        {selGovItem ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ backgroundColor: "#7C3AED12", color: "#7C3AED", border: "1px solid #7C3AED28" }}>
            <Flag className="w-3.5 h-3.5" /> {selGovItem.name}
          </div>
        ) : (
          <span className="text-xs text-gray-400">اختر محافظة</span>
        )}
        {selGovItem && <ChevronLeft className="w-4 h-4 text-gray-300" />}
        {selCityItem ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ backgroundColor: "#2563EB12", color: "#2563EB", border: "1px solid #2563EB28" }}>
            <Building2 className="w-3.5 h-3.5" /> {selCityItem.name}
          </div>
        ) : selGovItem ? (
          <span className="text-xs text-gray-400">اختر مدينة</span>
        ) : null}
        {selCityItem && <ChevronLeft className="w-4 h-4 text-gray-300" />}
        {selCityItem && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ backgroundColor: "#0EA5E912", color: "#0EA5E9", border: "1px solid #0EA5E928" }}>
            <MapPin className="w-3.5 h-3.5" /> {districts.length} منطقة
          </div>
        )}
      </div>

      {/* ── Three-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Column 1 — محافظات */}
        <GeoColumn
          level={0}
          items={govs}
          selectedId={selGov}
          allItems={items}
          onSelectItem={id => { setSelGov(id); setSelCity(null); }}
          onToggle={toggle}
          onAdd={(name, nameEn) => addItem(0, null, name, nameEn)}
          onEdit={(id, name, nameEn) => editItem(id, name, nameEn)}
          onDelete={deleteItem}
        />

        {/* Column 2 — مدن */}
        <GeoColumn
          level={1}
          items={cities}
          selectedId={selCity}
          parentLabel={selGovItem?.name}
          allItems={items}
          onSelectItem={id => setSelCity(id)}
          onToggle={toggle}
          onAdd={(name, nameEn) => selGov && addItem(1, selGov, name, nameEn)}
          onEdit={(id, name, nameEn) => editItem(id, name, nameEn)}
          onDelete={deleteItem}
        />

        {/* Column 3 — مناطق */}
        <GeoColumn
          level={2}
          items={districts}
          selectedId={null}
          parentLabel={selCityItem?.name}
          allItems={items}
          onSelectItem={() => {}}
          onToggle={toggle}
          onAdd={(name, nameEn) => selCity && addItem(2, selCity, name, nameEn)}
          onEdit={(id, name, nameEn) => editItem(id, name, nameEn)}
          onDelete={deleteItem}
        />
      </div>

      {/* ── Info bar ── */}
      <div className="flex items-center gap-2 p-4 rounded-2xl border border-blue-100 bg-blue-50/40">
        <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <p className="text-xs text-blue-700">
          اضغط على أي محافظة لعرض مدنها · اضغط على أي مدينة لعرض مناطقها · التغييرات تُطبَّق فوراً على الموقع
        </p>
      </div>
    </div>
  );
}
