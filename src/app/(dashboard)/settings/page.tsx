"use client";
import { useState } from "react";
import { User, Bell, CreditCard, AlertTriangle, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mock-data";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const plans = [
  {
    id: "free", name: "Free", price: 0, credits: 5, features: [
      "5 credits/month", "720p output", "Basic captions", "3 shorts per video"
    ]
  },
  {
    id: "pro", name: "Pro", price: 29, credits: 100, highlighted: true, features: [
      "100 credits/month", "1080p output", "AI Viral Mode", "7 shorts per video",
      "Advanced captions", "Metadata generation", "Priority processing"
    ]
  },
  {
    id: "agency", name: "Agency", price: 99, credits: 500, features: [
      "500 credits/month", "Everything in Pro", "API access", "Bulk processing",
      "White-label exports", "Dedicated support"
    ]
  },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn("w-11 h-6 rounded-full transition-all relative", enabled ? "bg-violet-500" : "bg-base-600")}
    >
      <div className={cn("w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm", enabled ? "left-6" : "left-1")} />
    </button>
  );
}

function NotificationRow({ label, desc, defaultEnabled = true }: { label: string; desc: string; defaultEnabled?: boolean }) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0">
      <div>
        <p className="text-sm font-medium text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{label}</p>
        <p className="text-xs text-base-400 mt-0.5">{desc}</p>
      </div>
      <Toggle enabled={enabled} onChange={setEnabled} />
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const user = mockUser;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-[fade-in_0.3s_ease-out]">
      {/* Tab navigation */}
      <div className="flex gap-1 bg-base-800/60 p-1 rounded-xl overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              tab === id
                ? "bg-violet-500/20 text-violet-300"
                : "text-base-400 hover:text-white"
            )}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Icon size={14} className={id === "danger" && tab !== "danger" ? "text-red-500" : ""} />
            {label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-coral-500 flex items-center justify-center text-2xl font-bold text-white">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{user.name}</p>
              <p className="text-sm text-base-400">{user.email}</p>
              <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors mt-1">
                Change avatar
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            <Input label="Full Name" defaultValue={user.name} />
            <Input label="Email Address" type="email" defaultValue={user.email} />
            <Input label="Current Password" type="password" placeholder="••••••••" />
            <Input label="New Password" type="password" placeholder="••••••••" />
          </div>

          <Button onClick={handleSave} icon={saved ? <Check size={16} /> : undefined}>
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      )}

      {/* Notifications tab */}
      {tab === "notifications" && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <h2 className="font-semibold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Email Notifications</h2>
          <p className="text-sm text-base-400 mb-4">Control what emails you receive from ShortsAI</p>
          <NotificationRow label="Processing Complete" desc="When your shorts are ready to download" />
          <NotificationRow label="Processing Failed" desc="When a video fails to process" />
          <NotificationRow label="Credit Low Warning" desc="When you have less than 10 credits remaining" />
          <NotificationRow label="Weekly Summary" desc="A weekly digest of your activity" defaultEnabled={false} />
          <NotificationRow label="Product Updates" desc="New features and improvements" />
          <NotificationRow label="Marketing Emails" desc="Tips, tutorials, and special offers" defaultEnabled={false} />
        </div>
      )}

      {/* Billing tab */}
      {tab === "billing" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "rounded-2xl border p-5 relative transition-all",
                  plan.highlighted
                    ? "border-violet-500/40 bg-violet-500/5 shadow-[0_0_30px_rgba(124,58,237,0.15)]"
                    : "border-white/[0.06] bg-white/[0.03]"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-violet-500 to-coral-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <p className="font-bold text-white text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{plan.name}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      ${plan.price}
                    </span>
                    {plan.price > 0 && <span className="text-sm text-base-400">/mo</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-violet-400">
                    <Zap size={10} />
                    {plan.credits} credits/month
                  </div>
                </div>

                <ul className="space-y-2 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-base-300">
                      <Check size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.id === user.plan ? "ghost" : "primary"}
                  size="sm"
                  className="w-full"
                  disabled={plan.id === user.plan}
                >
                  {plan.id === user.plan ? "Current" : `Upgrade to ${plan.name}`}
                </Button>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
            <h3 className="font-semibold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Payment Method</h3>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-base-800 border border-white/[0.06]">
              <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
              <span className="text-sm text-white">•••• •••• •••• 4242</span>
              <span className="text-xs text-base-400 ml-auto">Expires 12/26</span>
            </div>
            <button className="mt-3 text-sm text-violet-400 hover:text-violet-300 transition-colors">
              + Add payment method
            </button>
          </div>
        </div>
      )}

      {/* Danger zone tab */}
      {tab === "danger" && (
        <div className="rounded-2xl border border-red-900/40 bg-red-950/10 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-red-400" />
            <h2 className="font-semibold text-red-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Danger Zone</h2>
          </div>

          {[
            { label: "Clear Processing History", desc: "Permanently delete all project history. Generated files will be lost.", btn: "Clear History", variant: "danger" as const },
            { label: "Delete All Projects", desc: "Permanently delete all your projects and generated shorts.", btn: "Delete Projects", variant: "danger" as const },
            { label: "Delete Account", desc: "Permanently delete your account and all associated data. This cannot be undone.", btn: "Delete Account", variant: "danger" as const },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-red-950/10 border border-red-900/20">
              <div>
                <p className="text-sm font-medium text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.label}</p>
                <p className="text-xs text-base-400 mt-0.5 max-w-xs">{item.desc}</p>
              </div>
              <Button variant={item.variant} size="sm">{item.btn}</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
