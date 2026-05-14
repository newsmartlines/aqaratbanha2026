import React, { useState } from "react";
import { 
  LayoutDashboard, Building2, Heart, MessageCircle, Package, Settings,
  Plus, Eye, Phone, Star, Edit3, Trash2, 
  MapPin, LogOut, Search, Bell, Mail, Power, CheckCircle
} from "lucide-react";
import logoColor from "@assets/rgb_1778457941418.png";

type Section = "overview" | "listings" | "favorites" | "messages" | "plans" | "settings";

export default function DashboardPage() {
  const [section, setSection] = useState<Section>("overview");

  const NAV_ITEMS = [
    { id: "overview", label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "listings", label: "إعلاناتي", icon: Building2 },
    { id: "favorites", label: "المفضلة", icon: Heart },
    { id: "messages", label: "الرسائل", icon: MessageCircle },
    { id: "plans", label: "الباقات", icon: Package },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ];

  const STATS = [
    { label: "المشاهدات", value: "24,830", trend: "+12%", color: "text-cyan-500" },
    { label: "ضغطات رقم الهاتف", value: "1,247", trend: "+5%", color: "text-purple-500" },
    { label: "الرسائل", value: "83", trend: "-2%", color: "text-amber-500" },
    { label: "العقارات المنشورة", value: "12", trend: "+2", color: "text-green-500" },
    { label: "العقارات المميزة", value: "5", trend: "0", color: "text-red-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      <aside className="w-64 bg-white border-l border-gray-100 flex flex-col fixed h-full z-10 shadow-sm">
        <div className="p-8">
            <img src={logoColor} alt="شعار عقارات بنها" className="h-8 w-auto" />
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id as Section)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                section === item.id ? "bg-cyan-50 text-[#1EBFD5]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">
                <LogOut className="w-5 h-5" /> تسجيل الخروج
            </button>
        </div>
      </aside>

      <div className="flex-1 mr-64">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-20">
            <div className="relative w-96">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="bg-gray-50 text-sm py-2.5 pr-10 pl-4 rounded-xl border border-gray-100 outline-none w-full" placeholder="بحث..." />
            </div>
            <div className="flex items-center gap-6">
                <button className="relative text-gray-400"><Bell className="w-6 h-6" /><span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" /></button>
                <button className="text-gray-400"><Mail className="w-6 h-6" /></button>
                <div className="flex items-center gap-3">
                    <div className="text-left">
                        <p className="font-bold text-sm">أحمد محمد</p>
                        <p className="text-xs text-green-500">نشط الآن</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm" />
                </div>
            </div>
        </header>

        <main className="p-10">
            {section === "overview" && (
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black mb-2">مرحبا بك، أحمد محمد</h2>
                            <p className="text-gray-500">إدارة عقاراتك أصبحت أسهل من أي وقت مضى.</p>
                        </div>
                        <button className="bg-[#1EBFD5] text-white px-8 py-3 rounded-xl font-bold">إضافة عقار جديد</button>
                    </div>
                    <div className="grid grid-cols-5 gap-6">
                        {STATS.map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-gray-400 text-xs font-bold mb-2">{stat.label}</p>
                                <div className="flex items-end justify-between">
                                    <h3 className="text-2xl font-black">{stat.value}</h3>
                                    <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stat.trend}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {section === "listings" && (
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:border-[#1EBFD5]/30 transition-all">
                            <div className="w-40 h-28 bg-gray-200 rounded-2xl" />
                            <div className="flex-1">
                                <h3 className="font-black text-xl mb-1">شقة فاخرة في منطقة الفلل</h3>
                                <p className="text-[#1EBFD5] font-black text-lg mb-3">1,200,000 ج.م</p>
                                <div className="flex items-center gap-6 text-sm text-gray-500 font-bold">
                                    <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> 120</span>
                                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> 15</span>
                                    <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> 5</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button className="text-xs font-black text-gray-600 bg-gray-50 px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-100"><Edit3 className="w-4 h-4" /> تعديل</button>
                                <button className="text-xs font-black text-red-500 bg-red-50 px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-red-100"><Trash2 className="w-4 h-4" /> حذف</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {section === "plans" && (
                <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm max-w-xl">
                    <h3 className="font-black text-2xl mb-2">الباقة الحالية: بريميوم</h3>
                    <p className="text-gray-500 mb-8 font-medium">سارية حتى 1 يوليو 2025</p>
                    <div className="h-3 bg-gray-100 rounded-full mb-8">
                        <div className="h-full bg-[#1EBFD5] rounded-full w-[70%]" />
                    </div>
                    <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm">ترقية الباقة الآن</button>
                </div>
            )}

            {section === "messages" && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-[600px] flex items-center justify-center text-gray-400 font-bold">
                    لا يوجد محادثات مختارة
                </div>
            )}

            {section === "settings" && (
                <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8 max-w-2xl">
                    <h3 className="font-black text-2xl">إعدادات الملف الشخصي</h3>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase">الاسم الكامل</label>
                            <input className="w-full p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100 outline-none focus:border-[#1EBFD5] font-bold" value="أحمد محمد السيد" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase">البريد الإلكتروني</label>
                            <input className="w-full p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100 outline-none focus:border-[#1EBFD5] font-bold" value="ahmed@example.com" />
                        </div>
                    </div>
                    <button className="bg-[#1EBFD5] text-white px-10 py-4 rounded-2xl font-black text-sm shadow-lg shadow-[#1EBFD5]/20">حفظ التغييرات</button>
                </div>
            )}
        </main>
      </div>
    </div>
  );
}
