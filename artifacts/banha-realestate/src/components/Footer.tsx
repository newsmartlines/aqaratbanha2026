import { MapPin, Phone, ChevronDown } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import logoWhite from "@assets/footer_1778457955133.png";

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#0a1f3d] text-gray-300 pt-16 pb-8" dir="rtl">
      <div className="container mx-auto px-4 md:px-6">
        <div className="h-0.5 w-24 mb-12" style={{ background: "linear-gradient(90deg, #123C79, #1EBFD5)" }} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <img src={logoWhite} alt="عقارات بنها" className="h-12 w-auto object-contain mb-4" />
            <p className="text-gray-400 leading-relaxed mb-6 text-sm">
              المنصة الأولى المخصصة للعقارات في بنها. نهدف لتسهيل عملية البحث عن العقار المناسب بكل شفافية ومصداقية.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: FaFacebook, hover: "hover:bg-blue-600" },
                { Icon: FaInstagram, hover: "hover:bg-pink-600" },
                { Icon: FaYoutube, hover: "hover:bg-red-600" },
                { Icon: FaWhatsapp, hover: "hover:bg-green-600" },
              ].map(({ Icon, hover }, i) => (
                <a key={i} href="#" className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ${hover} hover:text-white transition-colors`}>
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-4 h-0.5 inline-block" style={{ background: "#1EBFD5" }} />
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              {["الرئيسية", "من نحن", "سياسة الخصوصية", "الشروط والأحكام"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-[#1EBFD5] transition-colors flex items-center gap-2 text-sm">
                    <ChevronDown className="w-3.5 h-3.5 -rotate-90 flex-shrink-0" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-4 h-0.5 inline-block" style={{ background: "#1EBFD5" }} />
              أنواع العقارات
            </h3>
            <ul className="space-y-3">
              {["شقق للبيع", "فلل للبيع", "أراضي للبيع", "محلات للإيجار", "مكاتب إدارية"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-[#1EBFD5] transition-colors flex items-center gap-2 text-sm">
                    <ChevronDown className="w-3.5 h-3.5 -rotate-90 flex-shrink-0" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-4 h-0.5 inline-block" style={{ background: "#1EBFD5" }} />
              تواصل معنا
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#1EBFD5" }} />
                <span className="text-gray-400">بنها، شارع فريد ندا، برج الياسمين، الدور الثالث</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" style={{ color: "#1EBFD5" }} />
                <span dir="ltr" className="text-gray-400">+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsapp className="w-5 h-5 flex-shrink-0 text-green-500" />
                <span dir="ltr" className="text-gray-400">+20 109 876 5432</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2025 عقارات بنها. جميع الحقوق محفوظة.</p>
          <p className="mt-2 md:mt-0">
            تصميم وبرمجة{" "}
            <a
              href="https://www.smartlines-eg.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1EBFD5] hover:underline font-bold"
            >
              سمارت لاينز للنظم المتطورة
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
