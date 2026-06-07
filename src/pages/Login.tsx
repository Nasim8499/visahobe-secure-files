import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/lib/store";
import { BrandMark } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowRight, Globe, ShieldCheck, Plane } from "lucide-react";
import { toast } from "sonner";
import heroImg from "@/assets/login-hero.jpg";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState("admin@visahobe.com");
  const [pw, setPw] = useState("demo1234");
  const [remember, setRemember] = useState(true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    toast.success("Welcome back to VisaHOBe Vault");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Hero */}
      <div className="relative lg:w-1/2 gradient-hero text-primary-foreground p-8 lg:p-14 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-[hsl(var(--accent))]/30 blur-3xl" />
        <div className="relative z-10 flex flex-col h-full">
          <BrandMark />
          <div className="my-auto py-12">
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight tracking-tight">
              Secure file vault<br />for global consultancies.
            </h1>
            <p className="mt-4 text-white/80 max-w-md">
              VisaHOBe PTE. LTD. helps your team manage company records, client files and approvals with one beautiful workspace.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              {[{ i: ShieldCheck, t: "Secure" }, { i: Globe, t: "Global" }, { i: Plane, t: "Fast" }].map(({ i: I, t }) => (
                <div key={t} className="glass-dark rounded-2xl p-4 text-center">
                  <I className="h-5 w-5 mx-auto mb-1.5" />
                  <div className="text-xs font-medium">{t}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-white/60">© 2026 VisaHOBe PTE. LTD.</div>
        </div>
      </div>

      {/* Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <form onSubmit={submit} className="w-full max-w-md">
          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="text-sm text-muted-foreground mt-1">Use your VisaHOBe team credentials.</p>

          <div className="space-y-4 mt-8">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Email or Phone</span>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 rounded-xl" />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Password</span>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="pl-10 h-12 rounded-xl" />
              </div>
            </label>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded" />
                Remember me
              </label>
              <button type="button" className="text-primary font-medium hover:underline" onClick={() => toast("Recovery email sent")}>Forgot password?</button>
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl gradient-primary text-primary-foreground shadow-glow text-base font-semibold">
              Sign in <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" className="w-full h-12 rounded-xl" onClick={() => { login(); navigate("/dashboard"); }}>
              Demo sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
