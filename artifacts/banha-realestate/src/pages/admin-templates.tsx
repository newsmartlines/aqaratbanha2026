import { useState, useRef } from "react";
import { SlimToggle } from "../components/SlimToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, MessageSquare, Bell, Smartphone, Globe, Shield,
  CreditCard, User, Building2, Tag, ChevronRight,
  Plus, Edit2, Trash2, Eye, Copy, RotateCcw, Download, Upload,
  Check, X, Search, Filter,
  Sparkles, Wand2, Send, Code, Monitor, Tablet, Moon, Sun,
  Hash, AlertCircle, CheckCircle, Clock, Zap, Save, Layout,
} from "lucide-react";

const ACCENT = "#2563EB";
const SB_ACTIVE = "#1E3A8A";

type Channel = "email" | "sms" | "whatsapp" | "push" | "inapp";
type Lang = "ar" | "en";

interface Template {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  subject: string;
  subjectEn: string;
  body: string;
  bodyEn: string;
  channels: Channel[];
  active: boolean;
  lang: Lang;
  variables: string[];
  lastModified: string;
  isDefault?: boolean;
}

const CATEGORIES = [
  { id: "all",          label: "جميع القوالب",         icon: Globe,        color: "#2563EB", count: 0  },
  { id: "auth",         label: "المصادقة",              icon: Shield,       color: "#6366F1", count: 6  },
  { id: "property",     label: "العقارات",               icon: Building2,    color: "#2563EB", count: 6  },
  { id: "subscription", label: "الاشتراكات والمدفوعات", icon: CreditCard,   color: "#F59E0B", count: 4  },
  { id: "contact",      label: "التواصل والعملاء",       icon: User,         color: "#EC4899", count: 3  },
  { id: "admin",        label: "إشعارات الأدمن",         icon: Bell,         color: "#EF4444", count: 3  },
  { id: "seo",          label: "إشعارات السيو",           icon: Globe,        color: "#10B981", count: 2  },
  { id: "system",       label: "رسائل النظام",            icon: AlertCircle,  color: "#8B5CF6", count: 3  },
  { id: "email",        label: "قوالب البريد",            icon: Mail,         color: "#3B82F6", count: 5  },
];

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "auth-verify", name: "تفعيل الحساب", nameEn: "Account Verification", category: "auth",
    subject: "تفعيل حسابك في عقارات بنها", subjectEn: "Activate your Banha Real Estate account",
    body: "مرحباً {{user_name}}،\n\nشكراً لتسجيلك في عقارات بنها.\n\nللتحقق من بريدك الإلكتروني وتفعيل حسابك:\n{{verification_link}}\n\nينتهي هذا الرابط خلال 24 ساعة.\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nThank you for registering. Please click below to verify:\n{{verification_link}}\n\nExpires in 24 hours.\n\nBanha Real Estate Team",
    channels: ["email"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{verification_link}}", "{{email}}"],
    lastModified: "14 مايو 2026", isDefault: true,
  },
  {
    id: "auth-welcome", name: "ترحيب بالمستخدم الجديد", nameEn: "Welcome New User", category: "auth",
    subject: "أهلاً بك في عقارات بنها 🏠", subjectEn: "Welcome to Banha Real Estate 🏠",
    body: "مرحباً {{user_name}}،\n\nيسعدنا انضمامك! يمكنك الآن تصفح العقارات وإضافة إعلاناتك.\n\nابدأ: {{site_url}}\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nWelcome! Browse properties and list your own.\n\nGet started: {{site_url}}\n\nBanha Real Estate Team",
    channels: ["email", "inapp"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{site_url}}", "{{email}}"],
    lastModified: "14 مايو 2026", isDefault: true,
  },
  {
    id: "auth-reset", name: "إعادة تعيين كلمة المرور", nameEn: "Password Reset", category: "auth",
    subject: "إعادة تعيين كلمة المرور", subjectEn: "Reset your password",
    body: "مرحباً {{user_name}}،\n\nاضغط هنا لإعادة التعيين:\n{{reset_link}}\n\nصالح لساعة واحدة فقط.\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nClick to reset:\n{{reset_link}}\n\nValid for 1 hour.\n\nBanha Real Estate Team",
    channels: ["email"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{reset_link}}", "{{email}}"],
    lastModified: "14 مايو 2026", isDefault: true,
  },
  {
    id: "auth-login-success", name: "تسجيل دخول ناجح", nameEn: "Successful Login", category: "auth",
    subject: "تم تسجيل الدخول إلى حسابك", subjectEn: "New login to your account",
    body: "مرحباً {{user_name}}،\n\nتسجيل دخول ناجح في {{login_time}} من {{device}}.\n\nإذا لم تكن أنت، تواصل معنا فوراً.",
    bodyEn: "Hello {{user_name}},\n\nLogin detected at {{login_time}} from {{device}}.\n\nBanha Real Estate Team",
    channels: ["email"], active: false, lang: "ar",
    variables: ["{{user_name}}", "{{login_time}}", "{{device}}"],
    lastModified: "10 مايو 2026", isDefault: true,
  },
  {
    id: "auth-password-changed", name: "تغيير كلمة المرور", nameEn: "Password Changed", category: "auth",
    subject: "تم تغيير كلمة المرور بنجاح", subjectEn: "Password changed successfully",
    body: "مرحباً {{user_name}}،\n\nتم تغيير كلمة المرور بنجاح. إذا لم تفعل ذلك، تواصل معنا فوراً.",
    bodyEn: "Hello {{user_name}},\n\nYour password was changed successfully.\n\nBanha Real Estate Team",
    channels: ["email", "sms"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{email}}"],
    lastModified: "12 مايو 2026", isDefault: true,
  },
  {
    id: "auth-session-expired", name: "انتهاء صلاحية الجلسة", nameEn: "Session Expired", category: "auth",
    subject: "انتهت صلاحية جلستك", subjectEn: "Your session has expired",
    body: "مرحباً {{user_name}}،\n\nانتهت صلاحية جلستك. سجّل دخولك مجدداً: {{site_url}}/login",
    bodyEn: "Your session has expired. Please log in again.",
    channels: ["inapp"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{site_url}}"],
    lastModified: "8 مايو 2026", isDefault: true,
  },
  {
    id: "prop-added", name: "تم إضافة العقار", nameEn: "Property Added", category: "property",
    subject: "تم استلام إعلانك — قيد المراجعة", subjectEn: "Your listing is under review",
    body: "مرحباً {{user_name}}،\n\nإعلانك «{{property_title}}» قيد المراجعة وسيُنشر خلال 24 ساعة.\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nYour listing \"{{property_title}}\" is under review. It will be published within 24 hours.\n\nBanha Real Estate Team",
    channels: ["email", "inapp"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{property_title}}", "{{property_price}}", "{{city}}"],
    lastModified: "14 مايو 2026", isDefault: true,
  },
  {
    id: "prop-approved", name: "تم قبول العقار", nameEn: "Property Approved", category: "property",
    subject: "🎉 تم قبول إعلانك ونشره!", subjectEn: "🎉 Your listing is now live!",
    body: "تهانينا {{user_name}}! 🎉\n\nإعلانك «{{property_title}}» منشور الآن.\nرابط الإعلان: {{property_url}}\n\nفريق عقارات بنها",
    bodyEn: "Congratulations {{user_name}}! Your listing is live.\n\nView: {{property_url}}\n\nBanha Real Estate Team",
    channels: ["email", "sms", "inapp"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{property_title}}", "{{property_url}}"],
    lastModified: "14 مايو 2026", isDefault: true,
  },
  {
    id: "prop-rejected", name: "تم رفض العقار", nameEn: "Property Rejected", category: "property",
    subject: "بشأن إعلانك — يحتاج إلى مراجعة", subjectEn: "Your listing needs revision",
    body: "مرحباً {{user_name}}،\n\nتعذّر نشر «{{property_title}}».\nالسبب: {{rejection_reason}}\n\nيرجى التعديل وإعادة الإرسال.",
    bodyEn: "Hello {{user_name}},\n\nYour listing could not be published.\nReason: {{rejection_reason}}\n\nBanha Real Estate Team",
    channels: ["email", "inapp"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{property_title}}", "{{rejection_reason}}"],
    lastModified: "13 مايو 2026", isDefault: true,
  },
  {
    id: "prop-new-message", name: "رسالة جديدة على العقار", nameEn: "New Property Message", category: "property",
    subject: "لديك رسالة جديدة بخصوص عقارك", subjectEn: "New message about your property",
    body: "مرحباً {{agent_name}}،\n\nرسالة جديدة من {{sender_name}} بخصوص: {{property_title}}\n\n{{message_preview}}\n\nللرد: {{property_url}}",
    bodyEn: "Hello {{agent_name}},\n\nNew message on: {{property_title}}\nFrom: {{sender_name}}\n{{message_preview}}",
    channels: ["email", "whatsapp", "push"], active: true, lang: "ar",
    variables: ["{{agent_name}}", "{{property_title}}", "{{sender_name}}", "{{message_preview}}", "{{property_url}}"],
    lastModified: "14 مايو 2026", isDefault: true,
  },
  {
    id: "prop-expiring", name: "انتهاء اشتراك الإعلان", nameEn: "Listing Expiring", category: "property",
    subject: "⚠️ إعلانك سينتهي خلال 3 أيام", subjectEn: "⚠️ Your listing expires in 3 days",
    body: "مرحباً {{user_name}}،\n\nإعلانك «{{property_title}}» سينتهي في {{expiry_date}}.\nجدّد الآن: {{renewal_url}}",
    bodyEn: "Hello {{user_name}},\n\nYour listing expires on {{expiry_date}}.\nRenew: {{renewal_url}}",
    channels: ["email", "sms", "push"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{property_title}}", "{{expiry_date}}", "{{renewal_url}}"],
    lastModified: "11 مايو 2026", isDefault: true,
  },
  {
    id: "prop-view-inspection", name: "طلب معاينة العقار", nameEn: "Inspection Request", category: "property",
    subject: "طلب معاينة جديد لعقارك", subjectEn: "New inspection request",
    body: "مرحباً {{agent_name}}،\n\nطلب معاينة من {{client_name}} للعقار: {{property_title}}\n\nهاتف: {{phone}}\nالموعد: {{proposed_date}}",
    bodyEn: "Hello {{agent_name}},\n\nInspection request for: {{property_title}}\nBanha Real Estate Team",
    channels: ["email", "sms", "whatsapp"], active: true, lang: "ar",
    variables: ["{{agent_name}}", "{{property_title}}", "{{client_name}}", "{{phone}}", "{{proposed_date}}"],
    lastModified: "9 مايو 2026", isDefault: true,
  },
  {
    id: "sub-activated", name: "تفعيل الباقة", nameEn: "Subscription Activated", category: "subscription",
    subject: "🎊 تم تفعيل باقتك بنجاح!", subjectEn: "🎊 Subscription activated!",
    body: "تهانينا {{user_name}}! 🎊\n\nتم تفعيل باقة «{{plan_name}}».\nتنتهي في: {{expiry_date}}\nإعلانات مسموحة: {{listing_limit}}",
    bodyEn: "Congratulations {{user_name}}!\n\nYour «{{plan_name}}» subscription is active.\nExpires: {{expiry_date}}",
    channels: ["email", "inapp"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{plan_name}}", "{{expiry_date}}", "{{listing_limit}}"],
    lastModified: "14 مايو 2026", isDefault: true,
  },
  {
    id: "sub-payment-failed", name: "فشل عملية الدفع", nameEn: "Payment Failed", category: "subscription",
    subject: "⚠️ تعذّرت عملية الدفع", subjectEn: "⚠️ Payment failed",
    body: "مرحباً {{user_name}}،\n\nتعذّرت عملية الدفع لباقة «{{plan_name}}» بمبلغ {{amount}} جنيه.\nحدّث بيانات الدفع: {{payment_url}}",
    bodyEn: "Hello {{user_name}},\n\nPayment for «{{plan_name}}» failed.\nUpdate: {{payment_url}}",
    channels: ["email", "sms"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{plan_name}}", "{{amount}}", "{{payment_url}}"],
    lastModified: "12 مايو 2026", isDefault: true,
  },
  {
    id: "sub-invoice", name: "إصدار الفاتورة", nameEn: "Invoice Issued", category: "subscription",
    subject: "فاتورة اشتراكك في عقارات بنها", subjectEn: "Your Banha Real Estate invoice",
    body: "مرحباً {{user_name}}،\n\nفاتورة رقم {{invoice_id}} — {{plan_name}}: {{amount}} جنيه\nتحميل: {{invoice_url}}",
    bodyEn: "Hello {{user_name}},\n\nInvoice #{{invoice_id}}: {{amount}} EGP\nDownload: {{invoice_url}}",
    channels: ["email"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{invoice_id}}", "{{plan_name}}", "{{amount}}", "{{invoice_url}}"],
    lastModified: "14 مايو 2026", isDefault: true,
  },
  {
    id: "sub-expired", name: "انتهاء الاشتراك", nameEn: "Subscription Expired", category: "subscription",
    subject: "انتهى اشتراكك — جدّد الآن", subjectEn: "Your subscription expired",
    body: "مرحباً {{user_name}}،\n\nانتهى اشتراكك في «{{plan_name}}».\nجدّد الآن: {{renewal_url}}",
    bodyEn: "Hello {{user_name}},\n\nYour «{{plan_name}}» subscription expired.\nRenew: {{renewal_url}}",
    channels: ["email", "sms", "push"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{plan_name}}", "{{renewal_url}}"],
    lastModified: "10 مايو 2026", isDefault: true,
  },
  {
    id: "contact-sent", name: "تأكيد إرسال الرسالة", nameEn: "Message Sent Confirmation", category: "contact",
    subject: "تم إرسال رسالتك بنجاح", subjectEn: "Your message was sent",
    body: "مرحباً {{user_name}}،\n\nتم استلام رسالتك وسيتم الرد خلال 24 ساعة.\nالموضوع: {{message_subject}}",
    bodyEn: "Hello {{user_name}},\n\nYour message was received. We'll reply within 24 hours.",
    channels: ["email", "inapp"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{message_subject}}"],
    lastModified: "14 مايو 2026", isDefault: true,
  },
  {
    id: "contact-new-lead", name: "عميل مهتم جديد", nameEn: "New Lead Notification", category: "contact",
    subject: "🔔 عميل جديد مهتم بعقارك", subjectEn: "🔔 New interested client",
    body: "مرحباً {{agent_name}}،\n\nعميل جديد مهتم بـ: {{property_title}}\nالاسم: {{client_name}} | هاتف: {{phone}}\n\n{{message_preview}}",
    bodyEn: "Hello {{agent_name}},\n\nNew client for: {{property_title}}\nName: {{client_name}} | Phone: {{phone}}",
    channels: ["email", "sms", "whatsapp", "push"], active: true, lang: "ar",
    variables: ["{{agent_name}}", "{{property_title}}", "{{client_name}}", "{{phone}}", "{{message_preview}}"],
    lastModified: "14 مايو 2026", isDefault: true,
  },
  {
    id: "contact-inspection", name: "تأكيد طلب المعاينة", nameEn: "Inspection Confirmation", category: "contact",
    subject: "تم استلام طلب معاينتك", subjectEn: "Inspection request received",
    body: "مرحباً {{user_name}}،\n\nتم استلام طلب معاينة: {{property_title}}.\nسيتواصل معك المعلن على: {{phone}}",
    bodyEn: "Hello {{user_name}},\n\nInspection request received. Agent will contact you soon.",
    channels: ["email", "inapp"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{property_title}}", "{{phone}}"],
    lastModified: "12 مايو 2026", isDefault: true,
  },
  {
    id: "admin-new-property", name: "إعلان جديد للمراجعة", nameEn: "New Property for Review", category: "admin",
    subject: "🔔 إعلان جديد يحتاج مراجعة", subjectEn: "🔔 New listing needs review",
    body: "مرحباً أدمن،\n\nإعلان جديد من {{user_name}}: {{property_title}}\nتاريخ: {{date}}\n\nمراجعة: {{admin_url}}",
    bodyEn: "Admin,\n\nNew listing pending review:\n{{property_title}} by {{user_name}}\nReview: {{admin_url}}",
    channels: ["email", "push"], active: true, lang: "ar",
    variables: ["{{property_title}}", "{{user_name}}", "{{date}}", "{{admin_url}}"],
    lastModified: "14 مايو 2026", isDefault: true,
  },
  {
    id: "admin-new-user", name: "مستخدم جديد", nameEn: "New User Registered", category: "admin",
    subject: "مستخدم جديد انضم للمنصة", subjectEn: "New user registered",
    body: "مستخدم جديد:\nالاسم: {{user_name}} | البريد: {{email}}\nالتاريخ: {{date}}\n\nعرض: {{admin_url}}",
    bodyEn: "New user:\nName: {{user_name}} | Email: {{email}}\nDate: {{date}}",
    channels: ["email"], active: false, lang: "ar",
    variables: ["{{user_name}}", "{{email}}", "{{date}}", "{{admin_url}}"],
    lastModified: "10 مايو 2026", isDefault: true,
  },
  {
    id: "admin-report", name: "إبلاغ عن محتوى", nameEn: "Content Reported", category: "admin",
    subject: "⚠️ تم الإبلاغ عن إعلان", subjectEn: "⚠️ Content reported",
    body: "تنبيه: تم الإبلاغ عن #{{property_id}}\nالسبب: {{report_reason}}\nبواسطة: {{reporter_name}}\n\nمراجعة: {{admin_url}}",
    bodyEn: "Alert: Property #{{property_id}} reported.\nReason: {{report_reason}}\nReview: {{admin_url}}",
    channels: ["email", "push"], active: true, lang: "ar",
    variables: ["{{property_id}}", "{{report_reason}}", "{{reporter_name}}", "{{admin_url}}"],
    lastModified: "8 مايو 2026", isDefault: true,
  },
  {
    id: "sys-maintenance", name: "إشعار صيانة", nameEn: "Maintenance Notice", category: "system",
    subject: "⚙️ صيانة مجدولة للمنصة", subjectEn: "⚙️ Scheduled maintenance",
    body: "مرحباً {{user_name}}،\n\nصيانة مجدولة في {{maintenance_time}} لمدة {{duration}}.\nنعتذر عن أي إزعاج.",
    bodyEn: "Hello {{user_name}},\n\nScheduled maintenance at {{maintenance_time}} for {{duration}}.",
    channels: ["email", "inapp"], active: false, lang: "ar",
    variables: ["{{user_name}}", "{{maintenance_time}}", "{{duration}}"],
    lastModified: "5 مايو 2026", isDefault: true,
  },
  {
    id: "sys-security-alert", name: "تنبيه أمني", nameEn: "Security Alert", category: "system",
    subject: "🔐 تنبيه أمني مهم", subjectEn: "🔐 Important security alert",
    body: "تنبيه: محاولة دخول مشبوهة.\nالتاريخ: {{date}} | الجهاز: {{device}}\n\nغيّر كلمة المرور: {{reset_link}}",
    bodyEn: "Alert: Suspicious login.\nDate: {{date}} | Device: {{device}}\nReset: {{reset_link}}",
    channels: ["email", "sms"], active: true, lang: "ar",
    variables: ["{{date}}", "{{device}}", "{{reset_link}}"],
    lastModified: "14 مايو 2026", isDefault: true,
  },
  {
    id: "sys-error", name: "خطأ في النظام", nameEn: "System Error", category: "system",
    subject: "خطأ في النظام", subjectEn: "System Error",
    body: "خطأ في النظام:\nالكود: {{error_code}}\nالرسالة: {{error_message}}\nالوقت: {{date}}",
    bodyEn: "System Error:\nCode: {{error_code}}\nMessage: {{error_message}}\nTime: {{date}}",
    channels: ["email"], active: true, lang: "ar",
    variables: ["{{error_code}}", "{{error_message}}", "{{date}}"],
    lastModified: "6 مايو 2026", isDefault: true,
  },
  {
    id: "email-welcome-premium", name: "بريد الترحيب الفاخر", nameEn: "Premium Welcome Email", category: "email",
    subject: "مرحباً بك في عقارات بنها!", subjectEn: "Welcome to Banha Real Estate!",
    body: "مرحباً {{user_name}}،\n\nيسعدنا انضمامك إلى عائلة عقارات بنها!\n\nابدأ الآن: {{site_url}}",
    bodyEn: "Hello {{user_name}},\n\nWelcome to Banha Real Estate!\n\nGet started: {{site_url}}",
    channels: ["email"], active: true, lang: "ar",
    variables: ["{{user_name}}", "{{site_url}}"],
    lastModified: "14 مايو 2026", isDefault: false,
  },
];

const CHANNEL_CONFIG: Record<Channel, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  email:    { label: "بريد",    icon: Mail,          color: "#3B82F6", bg: "#EFF6FF" },
  sms:      { label: "SMS",     icon: Smartphone,    color: "#10B981", bg: "#ECFDF5" },
  whatsapp: { label: "واتساب", icon: MessageSquare, color: "#22C55E", bg: "#F0FDF4" },
  push:     { label: "إشعار",   icon: Bell,          color: "#F59E0B", bg: "#FFFBEB" },
  inapp:    { label: "داخلي",   icon: Zap,           color: "#8B5CF6", bg: "#F5F3FF" },
};

const AI_SUGGESTIONS = [
  { label: "حسّن النص",           prompt: "improve"  },
  { label: "اجعله أقصر",         prompt: "shorten"  },
  { label: "أكثر تأثيراً",       prompt: "powerful" },
  { label: "subject جذاب",       prompt: "subject"  },
  { label: "أضف CTA احترافي",    prompt: "cta"      },
];

function ChannelBadge({ ch }: { ch: Channel }) {
  const cfg = CHANNEL_CONFIG[ch];
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}>
      <Icon style={{ width: 9, height: 9 }} />
      {cfg.label}
    </span>
  );
}

interface EditorPanelProps {
  tpl: Template;
  onClose: () => void;
  onSave: (t: Template) => void;
}

function EditorPanel({ tpl, onClose, onSave }: EditorPanelProps) {
  const [draft, setDraft] = useState<Template>({ ...tpl });
  const [tab, setTab] = useState<"content" | "preview" | "html" | "channels">("content");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewDark, setPreviewDark] = useState(false);
  const [activeLang, setActiveLang] = useState<Lang>("ar");
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState("");
  const [saved, setSaved] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  function set<K extends keyof Template>(key: K, val: Template[K]) {
    setDraft(d => ({ ...d, [key]: val }));
  }

  function insertVar(v: string) {
    const ta = textRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const body = activeLang === "ar" ? draft.body : draft.bodyEn;
    const newBody = body.substring(0, start) + v + body.substring(end);
    if (activeLang === "ar") set("body", newBody);
    else set("bodyEn", newBody);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + v.length, start + v.length); }, 0);
  }

  function toggleChannel(ch: Channel) {
    const chs = draft.channels.includes(ch) ? draft.channels.filter(c => c !== ch) : [...draft.channels, ch];
    set("channels", chs);
  }

  function handleAI(prompt: string) {
    setAiLoading(prompt);
    const responses: Record<string, string> = {
      improve:  activeLang === "ar" ? `مرحباً {{user_name}}،\n\nنود إعلامك بـ...` : `Dear {{user_name}},\n\nWe're pleased to inform you...`,
      shorten:  activeLang === "ar" ? `{{user_name}}، ${draft.body.split("\n")[0]}` : `{{user_name}}, ${draft.bodyEn.split("\n")[0]}`,
      powerful: activeLang === "ar" ? `🚀 أخبار رائعة {{user_name}}!\n\n${draft.body}` : `🚀 Great news {{user_name}}!\n\n${draft.bodyEn}`,
      subject:  activeLang === "ar" ? `🔔 ${draft.subject} — لا تفوّت الفرصة!` : `🔔 ${draft.subjectEn} — Don't miss out!`,
      cta:      activeLang === "ar" ? `${draft.body}\n\n👉 ابدأ الآن!` : `${draft.bodyEn}\n\n👉 Get started now!`,
    };
    setTimeout(() => { setAiResult(responses[prompt] ?? ""); setAiLoading(null); }, 1200);
  }

  function applyAI() {
    if (!aiResult) return;
    if (aiResult.startsWith("🔔") || aiResult.includes("—")) {
      if (activeLang === "ar") set("subject", aiResult); else set("subjectEn", aiResult);
    } else {
      if (activeLang === "ar") set("body", aiResult); else set("bodyEn", aiResult);
    }
    setAiResult("");
  }

  function handleSave() {
    onSave({ ...draft, lastModified: new Date().toLocaleDateString("ar-EG") });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const body = activeLang === "ar" ? draft.body : draft.bodyEn;
  const subjectVal = activeLang === "ar" ? draft.subject : draft.subjectEn;
  const deviceW = previewDevice === "desktop" ? "100%" : previewDevice === "tablet" ? "600px" : "360px";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex" onClick={onClose}>
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="mr-auto w-full max-w-4xl h-full flex flex-col bg-white shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: ACCENT + "15" }}>
              <Mail className="w-4 h-4" style={{ color: ACCENT }} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">{draft.name}</h2>
              <p className="text-[11px] text-gray-400">{draft.nameEn}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {(["ar", "en"] as Lang[]).map(l => (
                <button key={l} onClick={() => setActiveLang(l)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${activeLang === l ? "bg-white shadow text-gray-900" : "text-gray-400"}`}>
                  {l === "ar" ? "عربي" : "English"}
                </button>
              ))}
            </div>
            <button onClick={() => set("active", !draft.active)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all"
              style={draft.active ? { color: "#16A34A", borderColor: "#BBF7D0", backgroundColor: "#F0FDF4" } : { color: "#9CA3AF", borderColor: "#E5E7EB" }}>
              {draft.active ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {draft.active ? "نشط" : "معطّل"}
            </button>
            <button onClick={handleSave}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-lg text-white transition-all"
              style={{ backgroundColor: saved ? "#16A34A" : ACCENT }}>
              {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? "تم الحفظ!" : "حفظ"}
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-100 px-6">
          {([["content", "المحتوى", Layout], ["preview", "المعاينة", Eye], ["html", "HTML", Code], ["channels", "القنوات", Send]] as [string, string, React.ElementType][]).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id as typeof tab)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 -mb-px transition-all ${tab === id ? "border-current" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              style={tab === id ? { color: ACCENT, borderColor: ACCENT } : {}}>
              <Icon style={{ width: 13, height: 13 }} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {tab === "content" && (
            <>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-2">
                  {activeLang === "ar" ? "موضوع الرسالة" : "Subject"}
                </label>
                <input value={subjectVal}
                  onChange={e => activeLang === "ar" ? set("subject", e.target.value) : set("subjectEn", e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-blue-300 transition-all"
                  dir={activeLang === "ar" ? "rtl" : "ltr"}
                  placeholder={activeLang === "ar" ? "موضوع الرسالة..." : "Email subject..."} />
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-2">
                  {activeLang === "ar" ? "نص الرسالة" : "Message Body"}
                </label>
                <textarea ref={textRef} value={body}
                  onChange={e => activeLang === "ar" ? set("body", e.target.value) : set("bodyEn", e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-300 transition-all resize-none leading-relaxed min-h-[200px]"
                  dir={activeLang === "ar" ? "rtl" : "ltr"}
                  placeholder={activeLang === "ar" ? "اكتب نص الرسالة هنا..." : "Write your message here..."} />
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">متغيرات ديناميكية — انقر لإدراجها</p>
                <div className="flex flex-wrap gap-1.5">
                  {draft.variables.map(v => (
                    <button key={v} onClick={() => insertVar(v)}
                      className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-1 rounded-lg border border-dashed transition-all hover:scale-105"
                      style={{ color: ACCENT, borderColor: ACCENT + "60", backgroundColor: ACCENT + "10" }}>
                      <Hash className="w-2.5 h-2.5" />{v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#A78BFA40" }}>
                <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ backgroundColor: "#F5F3FF", borderColor: "#A78BFA30" }}>
                  <Sparkles className="w-4 h-4" style={{ color: "#7C3AED" }} />
                  <span className="text-xs font-bold" style={{ color: "#7C3AED" }}>AI Template Assistant</span>
                </div>
                <div className="p-4 bg-white space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {AI_SUGGESTIONS.map(s => (
                      <button key={s.prompt} onClick={() => handleAI(s.prompt)} disabled={!!aiLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-50"
                        style={{ color: "#7C3AED", borderColor: "#DDD6FE", backgroundColor: aiLoading === s.prompt ? "#EDE9FE" : "#FAFAFA" }}>
                        {aiLoading === s.prompt
                          ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}><Wand2 className="w-3 h-3" /></motion.div>
                          : <Wand2 className="w-3 h-3" />}
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence>
                    {aiResult && (
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-purple-50 border border-purple-100 rounded-xl p-3 space-y-2">
                        <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{aiResult}</p>
                        <div className="flex gap-2">
                          <button onClick={applyAI} className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-lg text-white" style={{ backgroundColor: "#7C3AED" }}>
                            <Check className="w-3 h-3" /> تطبيق
                          </button>
                          <button onClick={() => setAiResult("")} className="text-[11px] font-bold px-3 py-1 rounded-lg border text-gray-500 border-gray-200 hover:bg-gray-50">
                            تجاهل
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}

          {tab === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
                  {([["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]] as [typeof previewDevice, React.ElementType][]).map(([d, Icon]) => (
                    <button key={d} onClick={() => setPreviewDevice(d)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${previewDevice === d ? "bg-white shadow text-gray-900" : "text-gray-400"}`}>
                      <Icon style={{ width: 13, height: 13 }} />
                    </button>
                  ))}
                </div>
                <button onClick={() => setPreviewDark(!previewDark)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-gray-600">
                  {previewDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  {previewDark ? "فاتح" : "داكن"}
                </button>
              </div>
              <div className="flex justify-center">
                <div className="rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300" style={{ width: deviceW, maxWidth: "100%" }}>
                  <div className={`p-4 ${previewDark ? "bg-gray-900" : "bg-gray-50"} border-b border-gray-200`}>
                    <p className={`text-[10px] ${previewDark ? "text-gray-400" : "text-gray-500"} mb-1`}>من: نظام عقارات بنها &lt;noreply@banha.estate&gt;</p>
                    <p className={`text-sm font-bold ${previewDark ? "text-white" : "text-gray-900"}`}>{draft.subject || "موضوع الرسالة"}</p>
                  </div>
                  <div className={`p-6 ${previewDark ? "bg-gray-800" : "bg-white"}`} dir="rtl">
                    <div className={`rounded-xl overflow-hidden border ${previewDark ? "border-gray-700" : "border-gray-100"}`}>
                      <div className="h-14 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1E3A8A,#2563EB)" }}>
                        <span className="text-white font-bold text-sm">🏠 عقارات بنها</span>
                      </div>
                      <div className={`p-5 ${previewDark ? "bg-gray-900" : "bg-white"}`}>
                        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${previewDark ? "text-gray-200" : "text-gray-700"}`} dir="rtl">
                          {draft.body.replace(/\{\{(\w+)\}\}/g, (_m, k) => `[${k}]`)}
                        </p>
                      </div>
                      <div className={`px-5 py-4 border-t text-center ${previewDark ? "bg-gray-800 border-gray-700 text-gray-500" : "bg-gray-50 border-gray-100 text-gray-400"} text-[10px]`}>
                        عقارات بنها — بنها، القليوبية، مصر
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "html" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">كود HTML للبريد الإلكتروني</p>
                <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">
                  <Copy className="w-3.5 h-3.5" /> نسخ الكود
                </button>
              </div>
              <div className="bg-[#0F172A] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
                  {["#EF4444", "#F59E0B", "#22C55E"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />)}
                  <span className="text-white/30 text-[10px] mr-2">email-template.html</span>
                </div>
                <textarea readOnly
                  className="w-full bg-transparent text-green-400 font-mono text-xs p-5 outline-none resize-none min-h-[280px] leading-relaxed"
                  value={`<!DOCTYPE html>\n<html dir="rtl" lang="ar">\n<head>\n  <meta charset="UTF-8">\n  <title>${draft.subject}</title>\n</head>\n<body style="margin:0;padding:20px;background:#f8fafc">\n  <div style="max-width:600px;margin:auto;background:white;border-radius:16px">\n    <div style="background:linear-gradient(135deg,#1E3A8A,#2563EB);padding:32px;text-align:center">\n      <h1 style="color:white;margin:0">🏠 عقارات بنها</h1>\n    </div>\n    <div style="padding:32px;line-height:1.8">\n      <p>${draft.body.replace(/</g, "&lt;")}</p>\n    </div>\n    <div style="background:#f8fafc;padding:20px;text-align:center;color:#9ca3af;font-size:12px">\n      © 2026 عقارات بنها\n    </div>\n  </div>\n</body>\n</html>`}
                />
              </div>
            </div>
          )}

          {tab === "channels" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">اختر قنوات الإرسال لهذا القالب</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Object.entries(CHANNEL_CONFIG) as [Channel, typeof CHANNEL_CONFIG[Channel]][]).map(([ch, cfg]) => {
                  const Icon = cfg.icon;
                  const active = draft.channels.includes(ch);
                  return (
                    <button key={ch} onClick={() => toggleChannel(ch)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-right ${active ? "shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
                      style={active ? { borderColor: cfg.color, backgroundColor: cfg.bg } : {}}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: active ? cfg.color : "#F3F4F6" }}>
                        <Icon style={{ width: 18, height: 18, color: active ? "white" : "#9CA3AF" }} />
                      </div>
                      <div className="flex-1 text-right">
                        <p className="text-sm font-bold text-gray-800">{cfg.label}</p>
                        <p className="text-[11px] text-gray-400">
                          {ch === "email" ? "إرسال عبر البريد الإلكتروني" :
                           ch === "sms" ? "رسائل SMS للجوال" :
                           ch === "whatsapp" ? "إرسال عبر واتساب" :
                           ch === "push" ? "إشعارات الجهاز" : "إشعارات داخل التطبيق"}
                        </p>
                      </div>
                      {active && <Check className="w-4 h-4 flex-shrink-0" style={{ color: cfg.color }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function TemplatesSection() {
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [filterChannel, setFilterChannel] = useState<Channel | "all">("all");
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [editing, setEditing] = useState<Template | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2800);
  }

  function handleToggle(id: string) {
    setTemplates(ts => ts.map(t => t.id === id ? { ...t, active: !t.active } : t));
  }

  function handleSave(updated: Template) {
    setTemplates(ts => ts.map(t => t.id === updated.id ? updated : t));
    showToast("تم حفظ القالب بنجاح ✓");
  }

  function handleDuplicate(tpl: Template) {
    const copy: Template = {
      ...tpl,
      id: `copy-${Date.now()}`,
      name: `نسخة من ${tpl.name}`,
      nameEn: `Copy of ${tpl.nameEn}`,
      isDefault: false,
      lastModified: new Date().toLocaleDateString("ar-EG"),
    };
    setTemplates(ts => [...ts, copy]);
    showToast("تم نسخ القالب");
  }

  function handleDelete(id: string) {
    setTemplates(ts => ts.filter(t => t.id !== id));
    showToast("تم حذف القالب");
  }

  function handleRestore(id: string) {
    const original = DEFAULT_TEMPLATES.find(t => t.id === id);
    if (original) {
      setTemplates(ts => ts.map(t => t.id === id ? { ...original } : t));
      showToast("تم استعادة القالب الافتراضي");
    }
  }

  const filtered = templates.filter(t => {
    if (activeCategory !== "all" && t.category !== activeCategory) return false;
    if (filterChannel !== "all" && !t.channels.includes(filterChannel)) return false;
    if (showOnlyActive && !t.active) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name.includes(search) || t.nameEn.toLowerCase().includes(q) || t.subject.includes(search);
    }
    return true;
  });

  const getCategoryCount = (catId: string) =>
    catId === "all" ? templates.length : templates.filter(t => t.category === catId).length;

  return (
    <div className="flex bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm" style={{ minHeight: "calc(100vh - 160px)", maxWidth: "100%" }}>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-5 py-3 rounded-2xl text-white text-sm font-bold shadow-xl"
            style={{ backgroundColor: "#16A34A" }}>
            <CheckCircle className="w-4 h-4" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Left Sidebar: Categories ── */}
      <div className="w-56 flex-shrink-0 border-l border-gray-100 bg-gray-50/50 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">الأقسام</p>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const count = getCategoryCount(cat.id);
            const isActive = activeCategory === cat.id;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all text-right ${isActive ? "text-white shadow-sm" : "text-gray-600 hover:bg-white hover:shadow-sm"}`}
                style={isActive ? { backgroundColor: cat.id === "all" ? SB_ACTIVE : cat.color } : {}}>
                <Icon style={{ width: 15, height: 15, flexShrink: 0, color: isActive ? "white" : cat.id === "all" ? "#6B7280" : cat.color }} />
                <span className="flex-1 text-right truncate">{cat.label}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Stats */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400">نشطة</span>
            <span className="font-bold text-green-600">{templates.filter(t => t.active).length}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400">معطّلة</span>
            <span className="font-bold text-gray-400">{templates.filter(t => !t.active).length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div className="h-1.5 rounded-full bg-green-500 transition-all"
              style={{ width: `${(templates.filter(t => t.active).length / templates.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {CATEGORIES.find(c => c.id === activeCategory)?.label ?? "القوالب"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{filtered.length} قالب</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all">
              <Upload className="w-3.5 h-3.5" /> استيراد
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all">
              <Download className="w-3.5 h-3.5" /> تصدير
            </button>
            <button
              onClick={() => {
                const newTpl: Template = {
                  id: `custom-${Date.now()}`, name: "قالب جديد", nameEn: "New Template",
                  category: activeCategory === "all" ? "auth" : activeCategory,
                  subject: "", subjectEn: "", body: "", bodyEn: "",
                  channels: ["email"], active: true, lang: "ar",
                  variables: ["{{user_name}}", "{{email}}"],
                  lastModified: new Date().toLocaleDateString("ar-EG"), isDefault: false,
                };
                setTemplates(ts => [...ts, newTpl]);
                setEditing(newTpl);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: ACCENT }}>
              <Plus className="w-3.5 h-3.5" /> قالب جديد
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-white">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pr-9 pl-3 text-xs outline-none focus:border-blue-300 focus:bg-white transition-all"
              placeholder="بحث في القوالب..." />
          </div>
          <div className="flex bg-gray-100 rounded-xl overflow-hidden p-0.5 gap-0.5">
            <button onClick={() => setFilterChannel("all")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${filterChannel === "all" ? "bg-white shadow text-gray-800" : "text-gray-400"}`}>
              الكل
            </button>
            {(Object.entries(CHANNEL_CONFIG) as [Channel, typeof CHANNEL_CONFIG[Channel]][]).map(([ch, cfg]) => {
              const Icon = cfg.icon;
              return (
                <button key={ch} onClick={() => setFilterChannel(ch)}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${filterChannel === ch ? "bg-white shadow" : ""}`}
                  title={cfg.label}>
                  <Icon style={{ width: 12, height: 12, color: filterChannel === ch ? cfg.color : "#9CA3AF" }} />
                </button>
              );
            })}
          </div>
          <button onClick={() => setShowOnlyActive(!showOnlyActive)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all ${showOnlyActive ? "bg-green-50 border-green-200 text-green-700" : "border-gray-200 text-gray-400 hover:bg-gray-50"}`}>
            <Filter className="w-3 h-3" />
            النشطة فقط
          </button>
        </div>

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-gray-500 font-semibold">لا توجد قوالب</p>
                <p className="text-gray-300 text-sm mt-1">جرّب تغيير معايير البحث</p>
              </motion.div>
            ) : filtered.map((tpl, i) => {
              const cat = CATEGORIES.find(c => c.id === tpl.category);
              const CatIcon = cat?.icon ?? Tag;
              return (
                <motion.div key={tpl.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.025 }}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer"
                  onClick={() => setEditing(tpl)}>
                  <div className="flex items-center gap-3 p-4">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: (cat?.color ?? ACCENT) + "15" }}>
                      <CatIcon style={{ width: 16, height: 16, color: cat?.color ?? ACCENT }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-gray-800 truncate">{tpl.name}</p>
                        {tpl.isDefault && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-500 flex-shrink-0 border border-amber-100">
                            افتراضي
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 truncate mb-1.5">{tpl.subject}</p>
                      <div className="flex items-center gap-1 flex-wrap">
                        {tpl.channels.map(ch => <ChannelBadge key={ch} ch={ch} />)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="hidden md:flex items-center gap-1 text-[10px] text-gray-300">
                        <Clock className="w-3 h-3" />
                        {tpl.lastModified}
                      </span>
                      <div onClick={e => e.stopPropagation()}>
                        <SlimToggle on={tpl.active} onToggle={() => handleToggle(tpl.id)} color={ACCENT} />
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setEditing(tpl)} title="تعديل"
                          className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-400 flex items-center justify-center transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDuplicate(tpl)} title="نسخ"
                          className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 flex items-center justify-center transition-colors">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {tpl.isDefault ? (
                          <button onClick={() => handleRestore(tpl.id)} title="استعادة الافتراضي"
                            className="w-7 h-7 rounded-lg hover:bg-amber-50 text-amber-400 flex items-center justify-center transition-colors">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button onClick={() => handleDelete(tpl.id)} title="حذف"
                            className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-400 flex items-center justify-center transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-gray-400 transition-colors" />
                    </div>
                  </div>

                  {/* Body preview */}
                  <div className="px-4 pb-3">
                    <p className="text-[11px] text-gray-300 truncate bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
                      {tpl.body.split("\n").filter(Boolean)[0] ?? "لا يوجد محتوى"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Editor Drawer */}
      <AnimatePresence>
        {editing && (
          <EditorPanel tpl={editing} onClose={() => setEditing(null)}
            onSave={updated => { handleSave(updated); setEditing(null); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
