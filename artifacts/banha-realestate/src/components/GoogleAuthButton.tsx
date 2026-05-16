import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface GoogleAuthButtonProps {
  mode?: "login" | "register";
  onSuccess?: (user: GoogleUser) => void;
  className?: string;
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  googleId: string;
  registeredAt: string;
}

type OAuthState = "idle" | "loading" | "success" | "error" | "unconfigured";

export function GoogleAuthButton({ mode = "login", onSuccess, className = "" }: GoogleAuthButtonProps) {
  const [, navigate] = useLocation();
  const [state, setState] = useState<OAuthState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const clientId = typeof localStorage !== "undefined"
    ? localStorage.getItem("oauth_google_client_id") ?? ""
    : "";

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setState("loading");
      try {
        const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        if (!res.ok) throw new Error("فشل في جلب بيانات المستخدم من Google");
        const profile = await res.json();

        const apiRes = await fetch("/api/v1/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            googleId: profile.sub,
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
          }),
        });

        const data = await apiRes.json();

        if (!apiRes.ok) throw new Error(data?.error?.message ?? "خطأ في المصادقة");

        const user: GoogleUser = {
          id: data.data?.user?.id ?? profile.sub,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          googleId: profile.sub,
          registeredAt: new Date().toISOString(),
        };

        if (data.data?.token) {
          localStorage.setItem("auth_token", data.data.token);
          localStorage.setItem("auth_user", JSON.stringify(user));
        }

        setState("success");
        onSuccess?.(user);

        setTimeout(() => {
          navigate("/");
        }, 800);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
        setErrorMsg(msg);
        setState("error");
        setTimeout(() => setState("idle"), 3000);
      }
    },
    onError: () => {
      setErrorMsg("تم إلغاء تسجيل الدخول بجوجل");
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    },
    flow: "implicit",
  });

  function handleClick() {
    if (!clientId) {
      setState("unconfigured");
      setTimeout(() => setState("idle"), 3500);
      return;
    }
    setState("loading");
    login();
  }

  const label = mode === "register" ? "التسجيل بحساب Google" : "الدخول بحساب Google";

  return (
    <div className={`relative ${className}`}>
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={state === "loading" || state === "success"}
        whileHover={state === "idle" ? { scale: 1.01, boxShadow: "0 4px 20px rgba(0,0,0,0.10)" } : {}}
        whileTap={state === "idle" ? { scale: 0.98 } : {}}
        className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border font-semibold text-sm transition-all duration-200 select-none ${
          state === "success"
            ? "bg-green-50 border-green-200 text-green-700"
            : state === "error"
            ? "bg-red-50 border-red-200 text-red-600"
            : state === "unconfigured"
            ? "bg-amber-50 border-amber-200 text-amber-700"
            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50/60"
        }`}
      >
        <AnimatePresence mode="wait">
          {state === "loading" && (
            <motion.div key="spinner" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            </motion.div>
          )}
          {state === "success" && (
            <motion.div key="check" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
          {state === "error" && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          )}
          {(state === "idle" || state === "unconfigured") && (
            <motion.div key="google-icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GoogleIcon />
            </motion.div>
          )}
        </AnimatePresence>

        <span>
          {state === "loading" && "جارٍ التحقق..."}
          {state === "success" && "تم تسجيل الدخول!"}
          {state === "error" && (errorMsg || "حدث خطأ، حاول مجدداً")}
          {state === "unconfigured" && "Google OAuth غير مُفعَّل"}
          {state === "idle" && label}
        </span>
      </motion.button>

      {state === "unconfigured" && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center text-[11px] text-amber-600 mt-1.5 font-medium"
        >
          يرجى إضافة Google Client ID من لوحة التحكم ← إعدادات المصادقة
        </motion.p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
