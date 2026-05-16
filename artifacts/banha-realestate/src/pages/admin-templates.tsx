import { useState, useRef } from "react";
import { SlimToggle } from "../components/SlimToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, MessageSquare, Bell, Smartphone, Globe, Shield,
  CreditCard, User, Building2, Tag, ChevronRight, ChevronDown,
  Plus, Edit2, Trash2, Eye, Copy, RotateCcw, Download, Upload,
  Check, X, Search, Filter,
  Sparkles, Wand2, Send, Code, Monitor, Tablet, Moon, Sun,
  Hash, AlertCircle, CheckCircle, Clock, Zap, Star,
  Languages, MoreVertical, Save, ExternalLink, Layout,
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
  { id: "auth",         label: "المصادقة",             labelEn: "Authentication",  icon: Shield,       color: "#6366F1", count: 6  },
  { id: "property",     label: "العقارات",              labelEn: "Property",        icon: Building2,    color: "#2563EB", count: 6  },
  { id: "subscription", label: "الاشتراكات والمدفوعات", labelEn: "Subscriptions",   icon: CreditCard,   color: "#F59E0B", count: 4  },
  { id: "contact",      label: "التواصل والعملاء",      labelEn: "Contact & Leads", icon: User,         color: "#EC4899", count: 3  },
  { id: "admin",        label: "إشعارات الأدمن",        labelEn: "Admin Alerts",    icon: Bell,         color: "#EF4444", count: 3  },
  { id: "seo",          label: "إشعارات السيو",          labelEn: "SEO",             icon: Globe,        color: "#10B981", count: 2  },
  { id: "system",       label: "رسائل النظام",           labelEn: "System Alerts",   icon: AlertCircle,  color: "#8B5CF6", count: 3  },
  { id: "email",        label: "قوالب البريد",           labelEn: "Email Templates", icon: Mail,         color: "#3B82F6", count: 5  },
];

const DEFAULT_TEMPLATES: Template[] = [
  // Auth
  {
    id: "auth-verify",
    name: "تفعيل الحساب",
    nameEn: "Account Verification",
    category: "auth",
    subject: "تفعيل حسابك في عقارات بنها",
    subjectEn: "Activate your Banha Real Estate account",
    body: "مرحباً {{user_name}}،\n\nشكراً لتسجيلك في عقارات بنها — المنصة العقارية الأولى في بنها والقليوبية.\n\nللتحقق من بريدك الإلكتروني وتفعيل حسابك، اضغط على الرابط أدناه:\n\n{{verification_link}}\n\nينتهي هذا الرابط خلال 24 ساعة.\n\nإذا لم تقم بإنشاء هذا الحساب، يُرجى تجاهل هذه الرسالة.\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nThank you for registering at Banha Real Estate.\n\nPlease click the link below to verify your email:\n\n{{verification_link}}\n\nThis link expires in 24 hours.\n\nBanha Real Estate Team",
    channels: ["email"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{verification_link}}", "{{email}}"],
    lastModified: "14 مايو 2026",
    isDefault: true,
  },
  {
    id: "auth-welcome",
    name: "ترحيب بالمستخدم الجديد",
    nameEn: "Welcome New User",
    category: "auth",
    subject: "أهلاً بك في عقارات بنها 🏠",
    subjectEn: "Welcome to Banha Real Estate 🏠",
    body: "مرحباً {{user_name}}،\n\nيسعدنا انضمامك إلى عائلة عقارات بنها!\n\nيمكنك الآن:\n• تصفح آلاف العقارات في بنها والقليوبية\n• إضافة إعلاناتك العقارية\n• التواصل مباشرة مع المعلنين\n\nابدأ رحلتك الآن: {{site_url}}\n\nبالتوفيق،\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nWelcome to Banha Real Estate!\n\nYou can now browse thousands of properties and list your own.\n\nGet started: {{site_url}}\n\nBest regards,\nBanha Real Estate Team",
    channels: ["email", "inapp"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{site_url}}", "{{email}}"],
    lastModified: "14 مايو 2026",
    isDefault: true,
  },
  {
    id: "auth-reset",
    name: "إعادة تعيين كلمة المرور",
    nameEn: "Password Reset",
    category: "auth",
    subject: "إعادة تعيين كلمة المرور",
    subjectEn: "Reset your password",
    body: "مرحباً {{user_name}}،\n\nتلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.\n\nاضغط على الرابط أدناه لإعادة التعيين:\n{{reset_link}}\n\nهذا الرابط صالح لمدة ساعة واحدة فقط.\n\nإذا لم تطلب إعادة التعيين، تجاهل هذه الرسالة — حسابك بأمان تام.\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nWe received a request to reset your password.\n\nClick below to reset:\n{{reset_link}}\n\nThis link is valid for 1 hour only.\n\nBanha Real Estate Team",
    channels: ["email"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{reset_link}}", "{{email}}"],
    lastModified: "14 مايو 2026",
    isDefault: true,
  },
  {
    id: "auth-login-success",
    name: "تسجيل دخول ناجح",
    nameEn: "Successful Login",
    category: "auth",
    subject: "تم تسجيل الدخول إلى حسابك",
    subjectEn: "New login to your account",
    body: "مرحباً {{user_name}}،\n\nتم تسجيل الدخول إلى حسابك بنجاح.\n\nالوقت: {{login_time}}\nالجهاز: {{device}}\n\nإذا لم تكن أنت، تواصل معنا فوراً.\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nA login was detected on your account.\n\nTime: {{login_time}}\nDevice: {{device}}\n\nBanha Real Estate Team",
    channels: ["email"],
    active: false,
    lang: "ar",
    variables: ["{{user_name}}", "{{login_time}}", "{{device}}"],
    lastModified: "10 مايو 2026",
    isDefault: true,
  },
  {
    id: "auth-password-changed",
    name: "تغيير كلمة المرور",
    nameEn: "Password Changed",
    category: "auth",
    subject: "تم تغيير كلمة المرور بنجاح",
    subjectEn: "Password changed successfully",
    body: "مرحباً {{user_name}}،\n\nتم تغيير كلمة المرور الخاصة بحسابك بنجاح.\n\nإذا لم تقم بهذا الإجراء، تواصل معنا فوراً.\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nYour password was changed successfully.\n\nBanha Real Estate Team",
    channels: ["email", "sms"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{email}}"],
    lastModified: "12 مايو 2026",
    isDefault: true,
  },
  {
    id: "auth-session-expired",
    name: "انتهاء صلاحية الجلسة",
    nameEn: "Session Expired",
    category: "auth",
    subject: "انتهت صلاحية جلستك",
    subjectEn: "Your session has expired",
    body: "مرحباً {{user_name}}،\n\nانتهت صلاحية جلستك. يرجى تسجيل الدخول مجدداً للمتابعة.\n\nتسجيل الدخول: {{site_url}}/login\n\nفريق عقارات بنها",
    bodyEn: "Your session has expired. Please log in again.",
    channels: ["inapp"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{site_url}}"],
    lastModified: "8 مايو 2026",
    isDefault: true,
  },
  // Property
  {
    id: "prop-added",
    name: "تم إضافة العقار",
    nameEn: "Property Added",
    category: "property",
    subject: "تم استلام إعلانك — قيد المراجعة",
    subjectEn: "Your listing is under review",
    body: "مرحباً {{user_name}}،\n\nشكراً على إضافة إعلانك في عقارات بنها.\n\nتفاصيل إعلانك:\n• العنوان: {{property_title}}\n• السعر: {{property_price}}\n• المنطقة: {{city}}\n\nإعلانك الآن قيد المراجعة من فريقنا وسيُنشر خلال 24 ساعة.\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nYour listing \"{{property_title}}\" has been received and is under review. It will be published within 24 hours.\n\nBanha Real Estate Team",
    channels: ["email", "inapp"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{property_title}}", "{{property_price}}", "{{city}}"],
    lastModified: "14 مايو 2026",
    isDefault: true,
  },
  {
    id: "prop-approved",
    name: "تم قبول العقار",
    nameEn: "Property Approved",
    category: "property",
    subject: "🎉 تم قبول إعلانك ونشره!",
    subjectEn: "🎉 Your listing is now live!",
    body: "تهانينا {{user_name}}! 🎉\n\nتم قبول إعلانك ونشره على منصة عقارات بنها.\n\n• العنوان: {{property_title}}\n• رابط الإعلان: {{property_url}}\n\nشارك إعلانك الآن لتصل إلى أكبر عدد من المهتمين.\n\nفريق عقارات بنها",
    bodyEn: "Congratulations {{user_name}}! Your listing \"{{property_title}}\" is now live.\n\nView it here: {{property_url}}\n\nBanha Real Estate Team",
    channels: ["email", "sms", "inapp"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{property_title}}", "{{property_url}}"],
    lastModified: "14 مايو 2026",
    isDefault: true,
  },
  {
    id: "prop-rejected",
    name: "تم رفض العقار",
    nameEn: "Property Rejected",
    category: "property",
    subject: "بشأن إعلانك — يحتاج إلى مراجعة",
    subjectEn: "Your listing needs revision",
    body: "مرحباً {{user_name}}،\n\nللأسف، تعذّر علينا نشر الإعلان التالي:\n• العنوان: {{property_title}}\n\nالسبب: {{rejection_reason}}\n\nيرجى تعديل الإعلان وإعادة إرساله، أو تواصل معنا للمساعدة.\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nYour listing \"{{property_title}}\" could not be published.\n\nReason: {{rejection_reason}}\n\nPlease revise and resubmit.\n\nBanha Real Estate Team",
    channels: ["email", "inapp"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{property_title}}", "{{rejection_reason}}"],
    lastModified: "13 مايو 2026",
    isDefault: true,
  },
  {
    id: "prop-new-message",
    name: "رسالة جديدة على العقار",
    nameEn: "New Property Message",
    category: "property",
    subject: "لديك رسالة جديدة بخصوص عقارك",
    subjectEn: "New message about your property",
    body: "مرحباً {{agent_name}}،\n\nتلقيت رسالة جديدة بخصوص: {{property_title}}\n\nمن: {{sender_name}}\nالرسالة: {{message_preview}}\n\nللرد: {{property_url}}\n\nفريق عقارات بنها",
    bodyEn: "Hello {{agent_name}},\n\nNew message on: {{property_title}}\n\nFrom: {{sender_name}}\n{{message_preview}}\n\nBanha Real Estate Team",
    channels: ["email", "whatsapp", "push"],
    active: true,
    lang: "ar",
    variables: ["{{agent_name}}", "{{property_title}}", "{{sender_name}}", "{{message_preview}}", "{{property_url}}"],
    lastModified: "14 مايو 2026",
    isDefault: true,
  },
  {
    id: "prop-expiring",
    name: "انتهاء اشتراك الإعلان",
    nameEn: "Listing Expiring",
    category: "property",
    subject: "⚠️ إعلانك سينتهي خلال 3 أيام",
    subjectEn: "⚠️ Your listing expires in 3 days",
    body: "مرحباً {{user_name}}،\n\nإعلانك «{{property_title}}» سينتهي في {{expiry_date}}.\n\nجدّد الآن للحفاظ على ظهوره:\n{{renewal_url}}\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nYour listing \"{{property_title}}\" expires on {{expiry_date}}.\n\nRenew now: {{renewal_url}}\n\nBanha Real Estate Team",
    channels: ["email", "sms", "push"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{property_title}}", "{{expiry_date}}", "{{renewal_url}}"],
    lastModified: "11 مايو 2026",
    isDefault: true,
  },
  {
    id: "prop-view-inspection",
    name: "طلب معاينة العقار",
    nameEn: "Inspection Request",
    category: "property",
    subject: "طلب معاينة جديد لعقارك",
    subjectEn: "New inspection request for your property",
    body: "مرحباً {{agent_name}}،\n\nتلقيت طلب معاينة جديد للعقار: {{property_title}}\n\nالاسم: {{client_name}}\nالهاتف: {{phone}}\nالموعد المقترح: {{proposed_date}}\n\nفريق عقارات بنها",
    bodyEn: "Hello {{agent_name}},\n\nNew inspection request for: {{property_title}}\n\nBanha Real Estate Team",
    channels: ["email", "sms", "whatsapp"],
    active: true,
    lang: "ar",
    variables: ["{{agent_name}}", "{{property_title}}", "{{client_name}}", "{{phone}}", "{{proposed_date}}"],
    lastModified: "9 مايو 2026",
    isDefault: true,
  },
  // Subscription
  {
    id: "sub-activated",
    name: "تفعيل الباقة",
    nameEn: "Subscription Activated",
    category: "subscription",
    subject: "🎊 تم تفعيل باقتك بنجاح!",
    subjectEn: "🎊 Subscription activated!",
    body: "تهانينا {{user_name}}! 🎊\n\nتم تفعيل باقة «{{plan_name}}» بنجاح.\n\nتفاصيل الباقة:\n• نوع الباقة: {{plan_name}}\n• تاريخ الانتهاء: {{expiry_date}}\n• عدد الإعلانات المسموحة: {{listing_limit}}\n\nاستمتع بميزاتك الحصرية الآن!\n\nفريق عقارات بنها",
    bodyEn: "Congratulations {{user_name}}!\n\nYour «{{plan_name}}» subscription is now active.\n\nExpires: {{expiry_date}}\nListings allowed: {{listing_limit}}\n\nBanha Real Estate Team",
    channels: ["email", "inapp"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{plan_name}}", "{{expiry_date}}", "{{listing_limit}}"],
    lastModified: "14 مايو 2026",
    isDefault: true,
  },
  {
    id: "sub-payment-failed",
    name: "فشل عملية الدفع",
    nameEn: "Payment Failed",
    category: "subscription",
    subject: "⚠️ تعذّرت عملية الدفع",
    subjectEn: "⚠️ Payment failed",
    body: "مرحباً {{user_name}}،\n\nتعذّرت عملية الدفع الخاصة بباقة «{{plan_name}}».\n\nالمبلغ: {{amount}} جنيه\n\nيرجى تحديث بيانات الدفع:\n{{payment_url}}\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nPayment for «{{plan_name}}» failed.\n\nAmount: {{amount}} EGP\n\nUpdate payment: {{payment_url}}\n\nBanha Real Estate Team",
    channels: ["email", "sms"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{plan_name}}", "{{amount}}", "{{payment_url}}"],
    lastModified: "12 مايو 2026",
    isDefault: true,
  },
  {
    id: "sub-invoice",
    name: "إصدار الفاتورة",
    nameEn: "Invoice Issued",
    category: "subscription",
    subject: "فاتورة اشتراكك في عقارات بنها",
    subjectEn: "Your Banha Real Estate invoice",
    body: "مرحباً {{user_name}}،\n\nيسعدنا إخبارك بأنه تم إصدار فاتورتك بنجاح.\n\nرقم الفاتورة: {{invoice_id}}\nالباقة: {{plan_name}}\nالمبلغ: {{amount}} جنيه\nتاريخ الاستحقاق: {{due_date}}\n\nتحميل الفاتورة: {{invoice_url}}\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nInvoice #{{invoice_id}} for {{plan_name}}: {{amount}} EGP\n\nDownload: {{invoice_url}}\n\nBanha Real Estate Team",
    channels: ["email"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{invoice_id}}", "{{plan_name}}", "{{amount}}", "{{due_date}}", "{{invoice_url}}"],
    lastModified: "14 مايو 2026",
    isDefault: true,
  },
  {
    id: "sub-expired",
    name: "انتهاء الاشتراك",
    nameEn: "Subscription Expired",
    category: "subscription",
    subject: "انتهى اشتراكك — جدّد الآن",
    subjectEn: "Your subscription expired — renew now",
    body: "مرحباً {{user_name}}،\n\nانتهى اشتراكك في باقة «{{plan_name}}».\n\nجدّد الآن للاستمرار في الاستفادة بالميزات الحصرية:\n{{renewal_url}}\n\nنحن نقدر ثقتك بنا!\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nYour «{{plan_name}}» subscription has expired.\n\nRenew now: {{renewal_url}}\n\nBanha Real Estate Team",
    channels: ["email", "sms", "push"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{plan_name}}", "{{renewal_url}}"],
    lastModified: "10 مايو 2026",
    isDefault: true,
  },
  // Contact
  {
    id: "contact-sent",
    name: "تأكيد إرسال الرسالة",
    nameEn: "Message Sent Confirmation",
    category: "contact",
    subject: "تم إرسال رسالتك بنجاح",
    subjectEn: "Your message was sent",
    body: "مرحباً {{user_name}}،\n\nتم استلام رسالتك بنجاح وسيتم الرد عليها خلال 24 ساعة.\n\nموضوع رسالتك: {{message_subject}}\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nYour message has been received. We'll reply within 24 hours.\n\nBanha Real Estate Team",
    channels: ["email", "inapp"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{message_subject}}"],
    lastModified: "14 مايو 2026",
    isDefault: true,
  },
  {
    id: "contact-new-lead",
    name: "عميل مهتم جديد",
    nameEn: "New Lead Notification",
    category: "contact",
    subject: "🔔 عميل جديد مهتم بعقارك",
    subjectEn: "🔔 New interested client",
    body: "مرحباً {{agent_name}}،\n\nلديك عميل جديد مهتم بعقارك:\n\n• العقار: {{property_title}}\n• الاسم: {{client_name}}\n• الهاتف: {{phone}}\n• الرسالة: {{message_preview}}\n\nتواصل معه الآن!\n\nفريق عقارات بنها",
    bodyEn: "Hello {{agent_name}},\n\nNew client interested in: {{property_title}}\n\nName: {{client_name}}\nPhone: {{phone}}\n\nBanha Real Estate Team",
    channels: ["email", "sms", "whatsapp", "push"],
    active: true,
    lang: "ar",
    variables: ["{{agent_name}}", "{{property_title}}", "{{client_name}}", "{{phone}}", "{{message_preview}}"],
    lastModified: "14 مايو 2026",
    isDefault: true,
  },
  {
    id: "contact-inspection",
    name: "تأكيد طلب المعاينة",
    nameEn: "Inspection Confirmation",
    category: "contact",
    subject: "تم استلام طلب معاينتك",
    subjectEn: "Inspection request received",
    body: "مرحباً {{user_name}}،\n\nتم استلام طلب معاينة العقار: {{property_title}}\n\nسيتواصل معك المعلن قريباً على:\n{{phone}}\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nYour inspection request for \"{{property_title}}\" was received.\n\nThe agent will contact you soon.\n\nBanha Real Estate Team",
    channels: ["email", "inapp"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{property_title}}", "{{phone}}"],
    lastModified: "12 مايو 2026",
    isDefault: true,
  },
  // Admin
  {
    id: "admin-new-property",
    name: "إعلان جديد للمراجعة",
    nameEn: "New Property for Review",
    category: "admin",
    subject: "🔔 إعلان جديد يحتاج مراجعة",
    subjectEn: "🔔 New listing needs review",
    body: "مرحباً أدمن،\n\nتم رفع إعلان جديد يحتاج إلى مراجعتك:\n\n• العنوان: {{property_title}}\n• المُعلن: {{user_name}}\n• التاريخ: {{date}}\n\nمراجعة الإعلان: {{admin_url}}\n\nمنصة عقارات بنها",
    bodyEn: "Admin,\n\nNew listing pending review:\n{{property_title}} by {{user_name}}\n\nReview: {{admin_url}}",
    channels: ["email", "push"],
    active: true,
    lang: "ar",
    variables: ["{{property_title}}", "{{user_name}}", "{{date}}", "{{admin_url}}"],
    lastModified: "14 مايو 2026",
    isDefault: true,
  },
  {
    id: "admin-new-user",
    name: "مستخدم جديد",
    nameEn: "New User Registered",
    category: "admin",
    subject: "مستخدم جديد انضم للمنصة",
    subjectEn: "New user registered",
    body: "مستخدم جديد انضم للمنصة:\n\n• الاسم: {{user_name}}\n• البريد: {{email}}\n• التاريخ: {{date}}\n\nعرض في الأدمن: {{admin_url}}",
    bodyEn: "New user registered:\n\nName: {{user_name}}\nEmail: {{email}}\nDate: {{date}}",
    channels: ["email"],
    active: false,
    lang: "ar",
    variables: ["{{user_name}}", "{{email}}", "{{date}}", "{{admin_url}}"],
    lastModified: "10 مايو 2026",
    isDefault: true,
  },
  {
    id: "admin-report",
    name: "إبلاغ عن محتوى",
    nameEn: "Content Reported",
    category: "admin",
    subject: "⚠️ تم الإبلاغ عن إعلان",
    subjectEn: "⚠️ Content reported",
    body: "تنبيه: تم الإبلاغ عن الإعلان رقم {{property_id}}\n\nالسبب: {{report_reason}}\nبواسطة: {{reporter_name}}\n\nمراجعة: {{admin_url}}",
    bodyEn: "Alert: Property #{{property_id}} has been reported.\nReason: {{report_reason}}\n\nReview: {{admin_url}}",
    channels: ["email", "push"],
    active: true,
    lang: "ar",
    variables: ["{{property_id}}", "{{report_reason}}", "{{reporter_name}}", "{{admin_url}}"],
    lastModified: "8 مايو 2026",
    isDefault: true,
  },
  // System
  {
    id: "sys-maintenance",
    name: "إشعار صيانة",
    nameEn: "Maintenance Notice",
    category: "system",
    subject: "⚙️ صيانة مجدولة للمنصة",
    subjectEn: "⚙️ Scheduled maintenance",
    body: "مرحباً {{user_name}}،\n\nسيتم إجراء صيانة مجدولة للمنصة:\n\nالوقت: {{maintenance_time}}\nالمدة المتوقعة: {{duration}}\n\nنعتذر عن أي إزعاج.\n\nفريق عقارات بنها",
    bodyEn: "Hello {{user_name}},\n\nScheduled maintenance:\nTime: {{maintenance_time}}\nDuration: {{duration}}\n\nBanha Real Estate Team",
    channels: ["email", "inapp"],
    active: false,
    lang: "ar",
    variables: ["{{user_name}}", "{{maintenance_time}}", "{{duration}}"],
    lastModified: "5 مايو 2026",
    isDefault: true,
  },
  {
    id: "sys-security-alert",
    name: "تنبيه أمني",
    nameEn: "Security Alert",
    category: "system",
    subject: "🔐 تنبيه أمني مهم",
    subjectEn: "🔐 Important security alert",
    body: "تنبيه: رُصدت محاولة دخول مشبوهة لحسابك.\n\nالتاريخ: {{date}}\nالجهاز: {{device}}\n\nإذا لم تكن أنت، غيّر كلمة المرور فوراً:\n{{reset_link}}",
    bodyEn: "Alert: Suspicious login detected on your account.\n\nDate: {{date}}\nDevice: {{device}}\n\nReset password: {{reset_link}}",
    channels: ["email", "sms"],
    active: true,
    lang: "ar",
    variables: ["{{date}}", "{{device}}", "{{reset_link}}"],
    lastModified: "14 مايو 2026",
    isDefault: true,
  },
  {
    id: "sys-error",
    name: "خطأ في النظام",
    nameEn: "System Error",
    category: "system",
    subject: "خطأ في النظام",
    subjectEn: "System Error",
    body: "حدث خطأ في النظام:\n\nالكود: {{error_code}}\nالرسالة: {{error_message}}\nالوقت: {{date}}\n\nفريق عقارات بنها",
    bodyEn: "System error occurred:\n\nCode: {{error_code}}\nMessage: {{error_message}}\nTime: {{date}}",
    channels: ["email"],
    active: true,
    lang: "ar",
    variables: ["{{error_code}}", "{{error_message}}", "{{date}}"],
    lastModified: "6 مايو 2026",
    isDefault: true,
  },
  // Email templates
  {
    id: "email-welcome-premium",
    name: "بريد الترحيب الفاخر",
    nameEn: "Premium Welcome Email",
    category: "email",
    subject: "مرحباً بك في عقارات بنها — أهلاً بك!",
    subjectEn: "Welcome to Banha Real Estate!",
    body: "<!DOCTYPE html>\n<html dir=\"rtl\">\n<body style=\"font-family:Arial;background:#f8fafc;padding:20px\">\n  <div style=\"max-width:600px;margin:auto;background:white;border-radius:16px;overflow:hidden\">\n    <div style=\"background:linear-gradient(135deg,#1E3A8A,#2563EB);padding:40px;text-align:center\">\n      <h1 style=\"color:white;font-size:28px\">أهلاً {{user_name}}!</h1>\n    </div>\n    <div style=\"padding:32px\">\n      <p>يسعدنا انضمامك إلى عائلة عقارات بنها.</p>\n      <a href=\"{{site_url}}\" style=\"display:inline-block;background:#2563EB;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:bold\">ابدأ الآن</a>\n    </div>\n    <div style=\"background:#f8fafc;padding:20px;text-align:center;color:#94a3b8;font-size:12px\">\n      عقارات بنها — المنصة العقارية الأولى في بنها\n    </div>\n  </div>\n</body>\n</html>",
    bodyEn: "",
    channels: ["email"],
    active: true,
    lang: "ar",
    variables: ["{{user_name}}", "{{site_url}}"],
    lastModified: "14 مايو 2026",
    isDefault: false,
  },
];

const CHANNEL_CONFIG: Record<Channel, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  email:     { label: "بريد",     icon: Mail,          color: "#3B82F6", bg: "#EFF6FF" },
  sms:       { label: "SMS",      icon: Smartphone,    color: "#10B981", bg: "#ECFDF5" },
  whatsapp:  { label: "واتساب",  icon: MessageSquare, color: "#22C55E", bg: "#F0FDF4" },
  push:      { label: "إشعار",    icon: Bell,          color: "#F59E0B", bg: "#FFFBEB" },
  inapp:     { label: "داخلي",    icon: Zap,           color: "#8B5CF6", bg: "#F5F3FF" },
};

const AI_SUGGESTIONS = [
  { label: "حسّن النص",        prompt: "improve" },
  { label: "اجعله أقصر",      prompt: "shorten" },
  { label: "اجعله أكثر تأثيراً", prompt: "powerful" },
  { label: "اقترح subject جذاب", prompt: "subject" },
  { label: "أضف CTA احترافي", prompt: "cta" },
];

function ChannelBadge({ ch }: { ch: Channel }) {
  const cfg = CHANNEL_CONFIG[ch];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <Icon style={{ width: 9, height: 9 }} />
      {cfg.label}
    </span>
  );
}

function VariablePill({ v }: { v: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(v).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button onClick={copy}
      className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-1 rounded-lg border border-dashed transition-all hover:scale-105"
      style={{ color: ACCENT, borderColor: ACCENT + "60", backgroundColor: ACCENT + "10" }}>
      {copied ? <Check className="w-2.5 h-2.5" /> : <Hash className="w-2.5 h-2.5" />}
      {v}
    </button>
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
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + v.length, start + v.length);
    }, 0);
  }

  function toggleChannel(ch: Channel) {
    const chs = draft.channels.includes(ch)
      ? draft.channels.filter(c => c !== ch)
      : [...draft.channels, ch];
    set("channels", chs);
  }

  function handleAI(prompt: string) {
    setAiLoading(prompt);
    const responses: Record<string, string> = {
      improve: activeLang === "ar"
        ? `مرحباً {{user_name}}،\n\nنود إعلامك بـ...`
        : `Dear {{user_name}},\n\nWe're pleased to inform you...`,
      shorten: activeLang === "ar"
        ? `{{user_name}}، ${draft.body.split("\n")[0]}`
        : `{{user_name}}, ${draft.bodyEn.split("\n")[0]}`,
      powerful: activeLang === "ar"
        ? `🚀 أخبار رائعة {{user_name}}!\n\n${draft.body}`
        : `🚀 Great news {{user_name}}!\n\n${draft.bodyEn}`,
      subject: activeLang === "ar"
        ? `🔔 ${draft.subject} — لا تفوّت الفرصة!`
        : `🔔 ${draft.subjectEn} — Don't miss out!`,
      cta: activeLang === "ar"
        ? `${draft.body}\n\n👉 ابدأ الآن ولا تضيع الوقت!`
        : `${draft.bodyEn}\n\n👉 Get started now!`,
    };
    setTimeout(() => {
      setAiResult(responses[prompt] ?? "");
      setAiLoading(null);
    }, 1200);
  }

  function applyAI() {
    if (!aiResult) return;
    if (aiResult.startsWith("🔔") || aiResult.includes("—")) {
      if (activeLang === "ar") set("subject", aiResult);
      else set("subjectEn", aiResult);
    } else {
      if (activeLang === "ar") set("body", aiResult);
      else set("bodyEn", aiResult);
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
  const deviceW = previewDevice === "desktop" ? "100%" : previewDevice === "tablet" ? "640px" : "375px";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex" onClick={onClose}>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="mr-auto w-full max-w-5xl h-full flex flex-col bg-white shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
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
            {/* Lang switch */}
            <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
              {(["ar", "en"] as Lang[]).map(l => (
                <button key={l} onClick={() => setActiveLang(l)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${activeLang === l ? "bg-white shadow text-gray-900" : "text-gray-400 hover:text-gray-600"}`}>
                  {l === "ar" ? "عربي" : "English"}
                </button>
              ))}
            </div>
            {/* Status toggle */}
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
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-100 bg-white px-6">
          {([["content", "المحتوى", Layout], ["preview", "المعاينة", Eye], ["html", "HTML", Code], ["channels", "القنوات", Send]] as [string, string, React.ElementType][]).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id as typeof tab)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 -mb-px transition-all ${tab === id ? "border-current" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              style={tab === id ? { color: ACCENT, borderColor: ACCENT } : {}}>
              <Icon style={{ width: 13, height: 13 }} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Main Editor Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">

            {tab === "content" && (
              <>
                {/* Subject */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-2">
                    {activeLang === "ar" ? "موضوع الرسالة (Subject)" : "Subject"}
                  </label>
                  <input
                    value={subjectVal}
                    onChange={e => activeLang === "ar" ? set("subject", e.target.value) : set("subjectEn", e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-gray-300 transition-all"
                    dir={activeLang === "ar" ? "rtl" : "ltr"}
                    placeholder={activeLang === "ar" ? "موضوع الرسالة..." : "Email subject..."}
                  />
                </div>

                {/* Body */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-2">
                    {activeLang === "ar" ? "نص الرسالة" : "Message Body"}
                  </label>
                  <textarea
                    ref={textRef}
                    value={body}
                    onChange={e => activeLang === "ar" ? set("body", e.target.value) : set("bodyEn", e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-300 transition-all resize-none leading-relaxed min-h-[240px]"
                    dir={activeLang === "ar" ? "rtl" : "ltr"}
                    placeholder={activeLang === "ar" ? "اكتب نص الرسالة هنا..." : "Write your message here..."}
                  />
                </div>

                {/* Variables */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">متغيرات ديناميكية — انقر للنسخ أو انقر داخل النص ثم انقر متغير لإدراجه</p>
                  <div className="flex flex-wrap gap-1.5">
                    {draft.variables.map(v => (
                      <button key={v} onClick={() => insertVar(v)}
                        className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-1 rounded-lg border border-dashed transition-all hover:scale-105"
                        style={{ color: ACCENT, borderColor: ACCENT + "60", backgroundColor: ACCENT + "10" }}>
                        <Hash className="w-2.5 h-2.5" />
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Assistant */}
                <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#A78BFA40" }}>
                  <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ backgroundColor: "#F5F3FF", borderColor: "#A78BFA30" }}>
                    <Sparkles className="w-4 h-4" style={{ color: "#7C3AED" }} />
                    <span className="text-xs font-bold" style={{ color: "#7C3AED" }}>AI Template Assistant</span>
                    <span className="text-[10px] text-purple-400 mr-auto">مساعد ذكاء اصطناعي لتحسين رسائلك</span>
                  </div>
                  <div className="p-4 bg-white space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {AI_SUGGESTIONS.map(s => (
                        <button key={s.prompt} onClick={() => handleAI(s.prompt)}
                          disabled={!!aiLoading}
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
                            <button onClick={applyAI}
                              className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-lg text-white"
                              style={{ backgroundColor: "#7C3AED" }}>
                              <Check className="w-3 h-3" /> تطبيق
                            </button>
                            <button onClick={() => setAiResult("")}
                              className="text-[11px] font-bold px-3 py-1 rounded-lg border text-gray-500 border-gray-200 hover:bg-gray-50">
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
                {/* Device switcher */}
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
                  <div
                    className="rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300"
                    style={{ width: deviceW, maxWidth: "100%" }}>
                    <div className={`p-4 ${previewDark ? "bg-gray-900" : "bg-gray-50"} border-b border-gray-200`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold ${previewDark ? "text-gray-400" : "text-gray-500"}`}>من: نظام عقارات بنها &lt;noreply@banha.estate&gt;</span>
                      </div>
                      <p className={`text-sm font-bold ${previewDark ? "text-white" : "text-gray-900"}`}>{draft.subject || "موضوع الرسالة"}</p>
                    </div>
                    <div className={`p-6 ${previewDark ? "bg-gray-800" : "bg-white"}`} dir="rtl">
                      <div className={`rounded-xl overflow-hidden border ${previewDark ? "border-gray-700" : "border-gray-100"}`}>
                        <div className="h-16 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1E3A8A,#2563EB)" }}>
                          <span className="text-white font-bold text-sm">🏠 عقارات بنها</span>
                        </div>
                        <div className={`p-5 ${previewDark ? "bg-gray-900" : "bg-white"}`}>
                          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${previewDark ? "text-gray-200" : "text-gray-700"}`} dir="rtl">
                            {draft.body.replace(/\{\{(\w+)\}\}/g, (m, k) => `[${k}]`)}
                          </p>
                          {draft.channels.includes("email") && (
                            <div className="mt-4 flex justify-center">
                              <span className="px-5 py-2.5 text-xs font-bold text-white rounded-xl" style={{ backgroundColor: ACCENT }}>
                                اضغط هنا ←
                              </span>
                            </div>
                          )}
                        </div>
                        <div className={`px-5 py-4 border-t text-center ${previewDark ? "bg-gray-800 border-gray-700 text-gray-500" : "bg-gray-50 border-gray-100 text-gray-400"} text-[10px]`}>
                          عقارات بنها — بنها، القليوبية، مصر | إلغاء الاشتراك
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
                    {["#EF4444", "#F59E0B", "#22C55E"].map(c => (
                      <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                    <span className="text-white/30 text-[10px] mr-2">email-template.html</span>
                  </div>
                  <textarea
                    className="w-full bg-transparent text-green-400 font-mono text-xs p-5 outline-none resize-none min-h-[320px] leading-relaxed"
                    value={`<!DOCTYPE html>\n<html dir="rtl" lang="ar">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width">\n  <title>${draft.subject}</title>\n</head>\n<body style="margin:0;padding:20px;background:#f8fafc;font-family:Arial,sans-serif">\n  <div style="max-width:600px;margin:auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">\n    <div style="background:linear-gradient(135deg,#1E3A8A,#2563EB);padding:32px;text-align:center">\n      <h1 style="color:white;margin:0;font-size:24px">🏠 عقارات بنها</h1>\n    </div>\n    <div style="padding:32px;line-height:1.8;direction:rtl">\n      <p style="color:#374151;white-space:pre-wrap">${draft.body.replace(/</g, "&lt;")}</p>\n    </div>\n    <div style="background:#f8fafc;padding:20px;text-align:center;color:#9ca3af;font-size:12px;border-top:1px solid #f1f5f9">\n      © 2026 عقارات بنها — بنها، القليوبية\n    </div>\n  </div>\n</body>\n</html>`}
                    readOnly
                  />
                </div>
              </div>
            )}

            {tab === "channels" && (
              <div className="space-y-4">
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
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800">{cfg.label}</p>
                          <p className="text-[11px] text-gray-400">
                            {ch === "email" ? "إرسال عبر البريد الإلكتروني" :
                             ch === "sms" ? "رسالة نصية قصيرة" :
                             ch === "whatsapp" ? "رسالة واتساب بيزنس" :
                             ch === "push" ? "إشعار فوري للتطبيق" :
                             "رسالة داخل الموقع"}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${active ? "border-current" : "border-gray-300"}`}
                          style={active ? { borderColor: cfg.color, backgroundColor: cfg.color } : {}}>
                          {active && <Check style={{ width: 10, height: 10, color: "white" }} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar (only on content tab) */}
          {tab === "content" && (
            <div className="w-52 border-r border-gray-100 bg-gray-50/50 flex flex-col p-4 space-y-4 overflow-y-auto flex-shrink-0">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">التصنيف</p>
                <select
                  value={draft.category}
                  onChange={e => set("category", e.target.value)}
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg px-2 py-2 outline-none">
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">اسم القالب</p>
                <input
                  value={draft.name}
                  onChange={e => set("name", e.target.value)}
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg px-2 py-2 outline-none"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">قنوات الإرسال</p>
                <div className="flex flex-wrap gap-1">
                  {draft.channels.map(ch => <ChannelBadge key={ch} ch={ch} />)}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">المتغيرات</p>
                <div className="space-y-1">
                  {draft.variables.map(v => <VariablePill key={v} v={v} />)}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">آخر تعديل</p>
                <p className="text-[11px] text-gray-500">{draft.lastModified}</p>
              </div>
              {draft.isDefault && (
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                  <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1"><Star className="w-3 h-3" /> قالب افتراضي</p>
                  <p className="text-[10px] text-amber-500 mt-1">يمكن إعادة الافتراضي في أي وقت</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function TemplatesSection() {
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Template | null>(null);
  const [filterChannel, setFilterChannel] = useState<Channel | "all">("all");
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  }

  function handleSave(updated: Template) {
    setTemplates(ts => ts.map(t => t.id === updated.id ? updated : t));
    showToast("تم حفظ القالب بنجاح ✓");
  }

  function handleDuplicate(tpl: Template) {
    const newTpl: Template = {
      ...tpl,
      id: `${tpl.id}-copy-${Date.now()}`,
      name: `${tpl.name} (نسخة)`,
      nameEn: `${tpl.nameEn} (copy)`,
      isDefault: false,
      lastModified: new Date().toLocaleDateString("ar-EG"),
    };
    setTemplates(ts => [...ts, newTpl]);
    showToast("تم نسخ القالب ✓");
  }

  function handleToggle(id: string) {
    setTemplates(ts => ts.map(t => t.id === id ? { ...t, active: !t.active } : t));
  }

  function handleDelete(id: string) {
    setTemplates(ts => ts.filter(t => t.id !== id));
    showToast("تم حذف القالب");
  }

  function handleRestore(id: string) {
    const original = DEFAULT_TEMPLATES.find(t => t.id === id);
    if (original) {
      setTemplates(ts => ts.map(t => t.id === id ? { ...original } : t));
      showToast("تم استعادة الافتراضي ✓");
    }
  }

  const filtered = templates.filter(t => {
    if (activeCategory !== "all" && t.category !== activeCategory) return false;
    if (search && !t.name.includes(search) && !t.subject.includes(search) && !t.nameEn.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterChannel !== "all" && !t.channels.includes(filterChannel)) return false;
    if (showOnlyActive && !t.active) return false;
    return true;
  });

  const totalActive = templates.filter(t => t.active).length;
  const totalInactive = templates.filter(t => !t.active).length;

  return (
    <div className="space-y-5" dir="rtl">
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-5 py-3 rounded-2xl text-white text-sm font-bold shadow-xl"
            style={{ backgroundColor: ACCENT }}>
            <CheckCircle className="w-4 h-4" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">إدارة الرسائل والقوالب</h2>
          <p className="text-sm text-gray-400 mt-0.5">تحكم كامل في كل الرسائل والإيميلات والإشعارات</p>
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
                id: `custom-${Date.now()}`,
                name: "قالب جديد",
                nameEn: "New Template",
                category: "auth",
                subject: "",
                subjectEn: "",
                body: "",
                bodyEn: "",
                channels: ["email"],
                active: true,
                lang: "ar",
                variables: ["{{user_name}}", "{{email}}"],
                lastModified: new Date().toLocaleDateString("ar-EG"),
                isDefault: false,
              };
              setTemplates(ts => [...ts, newTpl]);
              setEditing(newTpl);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
            style={{ backgroundColor: ACCENT }}>
            <Plus className="w-3.5 h-3.5" /> قالب جديد
          </button>
        </div>
      </div>

      {/* ── Top Category Tabs ── */}
      <div className="flex items-end gap-0 border-b border-gray-200" style={{ overflowX: "auto", overflowY: "visible" }}>
        {/* "الكل" tab */}
        {(() => {
          const active = activeCategory === "all";
          return (
            <button
              onClick={() => setActiveCategory("all")}
              className="relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px whitespace-nowrap flex-shrink-0"
              style={active ? { color: SB_ACTIVE, borderColor: SB_ACTIVE } : { color: "#111827", borderColor: "transparent" }}>
              <Globe style={{ width: 13, height: 13 }} />
              الكل
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                style={active
                  ? { backgroundColor: SB_ACTIVE, color: "white" }
                  : { backgroundColor: "#F1F5F9", color: "#6B7280" }}>
                {templates.length}
              </span>
            </button>
          );
        })()}
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const count = templates.filter(t => t.category === cat.id).length;
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px whitespace-nowrap flex-shrink-0"
              style={active ? { color: cat.color, borderColor: cat.color } : { color: "#111827", borderColor: "transparent" }}>
              <Icon style={{ width: 13, height: 13 }} />
              {cat.label}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                style={active
                  ? { backgroundColor: cat.color, color: "white" }
                  : { backgroundColor: "#F1F5F9", color: "#6B7280" }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Filters + Templates List ── */}
      <div className="space-y-3">
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2 pr-9 pl-3 text-xs outline-none focus:border-gray-300 transition-all"
              placeholder="بحث في القوالب..."
            />
          </div>
          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setFilterChannel("all")}
              className={`px-3 py-2 text-[11px] font-semibold transition-all ${filterChannel === "all" ? "text-white" : "text-gray-400"}`}
              style={filterChannel === "all" ? { backgroundColor: ACCENT } : {}}>
              الكل
            </button>
            {(Object.entries(CHANNEL_CONFIG) as [Channel, typeof CHANNEL_CONFIG[Channel]][]).map(([ch, cfg]) => {
              const Icon = cfg.icon;
              return (
                <button key={ch} onClick={() => setFilterChannel(ch)}
                  className={`px-3 py-2 transition-all border-r border-gray-100`}
                  style={filterChannel === ch ? { backgroundColor: cfg.bg } : {}}>
                  <Icon style={{ width: 12, height: 12, color: filterChannel === ch ? cfg.color : "#9CA3AF" }} />
                </button>
              );
            })}
          </div>
          <button onClick={() => setShowOnlyActive(!showOnlyActive)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all ${showOnlyActive ? "border-current" : "border-gray-200 text-gray-400"}`}
            style={showOnlyActive ? { color: "#16A34A", borderColor: "#BBF7D0", backgroundColor: "#F0FDF4" } : {}}>
            <Filter className="w-3 h-3" />
            النشطة فقط
          </button>
        </div>

        {/* Templates Grid */}
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center">
                <Mail className="w-12 h-12 text-gray-200 mb-3" />
                <p className="text-gray-400 font-medium">لا توجد قوالب</p>
                <p className="text-gray-300 text-sm">جرّب تغيير معايير البحث</p>
              </motion.div>
            ) : filtered.map((tpl, i) => {
                const cat = CATEGORIES.find(c => c.id === tpl.category);
                const CatIcon = cat?.icon ?? Tag;
                return (
                  <motion.div
                    key={tpl.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-3 p-4">
                      {/* Category icon */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: (cat?.color ?? ACCENT) + "15" }}>
                        <CatIcon style={{ width: 16, height: 16, color: cat?.color ?? ACCENT }} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-gray-800 truncate">{tpl.name}</p>
                          {tpl.isDefault && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 flex-shrink-0">افتراضي</span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 truncate mb-1.5">{tpl.subject}</p>
                        <div className="flex items-center gap-1 flex-wrap">
                          {tpl.channels.map(ch => <ChannelBadge key={ch} ch={ch} />)}
                        </div>
                      </div>

                      {/* Status + Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock className="w-3 h-3" />
                          {tpl.lastModified}
                        </div>
                        <SlimToggle on={tpl.active} onToggle={() => handleToggle(tpl.id)} color={ACCENT} />
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditing(tpl)} title="تعديل"
                            className="w-7 h-7 rounded-lg hover:bg-amber-50 text-amber-400 flex items-center justify-center transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDuplicate(tpl)} title="نسخ"
                            className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-400 flex items-center justify-center transition-colors">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {tpl.isDefault && (
                            <button onClick={() => handleRestore(tpl.id)} title="استعادة الافتراضي"
                              className="w-7 h-7 rounded-lg hover:bg-amber-50 text-amber-500 flex items-center justify-center transition-colors">
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {!tpl.isDefault && (
                            <button onClick={() => handleDelete(tpl.id)} title="حذف"
                              className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-400 flex items-center justify-center transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Preview snippet */}
                    <div className="px-4 pb-3">
                      <div className="bg-gray-50 rounded-xl px-3 py-2 text-[11px] text-gray-400 leading-relaxed truncate border border-gray-100">
                        {tpl.body.split("\n").filter(Boolean)[0] ?? "لا يوجد محتوى"}
                      </div>
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
          <EditorPanel
            tpl={editing}
            onClose={() => setEditing(null)}
            onSave={updated => {
              handleSave(updated);
              setEditing(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
