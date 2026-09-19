"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Copy, LogOut, Send } from "lucide-react";

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/coupon/login");
        return;
      }
      
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);

      const { data: couponsData } = await supabase
        .from("coupons")
        .select("*")
        .eq("issuer_id", user.id)
        .order("created_at", { ascending: true });
        
      if (couponsData) setCoupons(couponsData);
      setLoading(false);
    }
    loadData();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/coupon/login");
  };

  const getCouponUrl = (id: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/coupon/${id}`;
    }
    return "";
  };

  const shareViaLine = (id: string, amount: number) => {
    const url = getCouponUrl(id);
    const text = `文化祭の${amount}円引きクーポンだよ！ぜひお店に来てね！\n${url}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://line.me/R/share?text=${encodedText}`, "_blank");
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(getCouponUrl(id));
    alert("URLをコピーしました！");
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">読み込み中...</div>;

  return (
    <div className="flex-1 flex flex-col w-full max-w-md mx-auto p-2 space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{profile?.name} さんのクーポン</h1>
          <p className="text-sm text-slate-500 mt-1">割り当てられたクーポンを友達にシェアしよう</p>
        </div>
        <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {coupons.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center text-slate-500 shadow-sm border border-slate-100">
            まだクーポンが割り当てられていません。
          </div>
        ) : (
          coupons.map((coupon, index) => (
            <div key={coupon.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 text-lg shadow-sm">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-800 tracking-tight">{coupon.amount}円 OFF</div>
                    <div className="text-sm text-slate-500 font-medium mt-0.5">
                      状態: {coupon.status === "used" ? (
                        <span className="text-red-500 ml-1">使用済み</span>
                      ) : (
                        <span className="text-emerald-500 ml-1">未使用</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {coupon.status !== "used" && (
                <div className="flex gap-2 mt-2 pt-4 border-t border-slate-50">
                  <button 
                    onClick={() => shareViaLine(coupon.id, coupon.amount)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#06C755] text-white py-3 rounded-xl font-bold hover:bg-[#05b04b] transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    LINEで送る
                  </button>
                  <button 
                    onClick={() => copyToClipboard(coupon.id)}
                    className="flex-none w-14 flex items-center justify-center bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                    title="URLをコピー"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
