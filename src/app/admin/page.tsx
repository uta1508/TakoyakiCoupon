"use client";
import React, { useEffect, useState, Fragment } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Users, LayoutDashboard, Ticket, CheckCircle, PieChart, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function AdminPage() {
  const supabase = createClient();
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isIssuing, setIsIssuing] = useState<string | null>(null);
  
  // State for expanded management panel
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [issueAmount, setIssueAmount] = useState<number>(50);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      
      const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (adminProfile?.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      const [profilesRes, couponsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("role", "classmate").order("name"),
        supabase.from("coupons").select("*").order("created_at", { ascending: false })
      ]);

      if (profilesRes.data) setProfiles(profilesRes.data);
      if (couponsRes.data) setCoupons(couponsRes.data);
      setLoading(false);
    }
    loadData();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const issueCoupon = async (userId: string) => {
    setIsIssuing(userId);
    const { data, error } = await supabase
      .from("coupons")
      .insert({ issuer_id: userId, amount: issueAmount, status: "active" })
      .select()
      .single();
      
    if (data && !error) {
      setCoupons(prev => [data, ...prev]);
    } else {
      alert("発行に失敗しました。");
    }
    setIsIssuing(null);
  };

  const deleteCoupon = async (couponId: string) => {
    if (!confirm("本当にこのクーポンを削除しますか？")) return;
    
    const { error } = await supabase.from("coupons").delete().eq("id", couponId);
    if (!error) {
      setCoupons(prev => prev.filter(c => c.id !== couponId));
    } else {
      alert("削除に失敗しました。");
    }
  };

  const [bulkIssueAmount, setBulkIssueAmount] = useState<number>(50);
  const [isBulkIssuing, setIsBulkIssuing] = useState(false);

  const bulkIssueCoupons = async () => {
    if (!confirm(`クラスメイト全員（${profiles.length}人）に ${bulkIssueAmount}円引きクーポン を1枚ずつ一斉発行します。よろしいですか？`)) return;
    setIsBulkIssuing(true);
    
    const newCoupons = profiles.map(p => ({
      issuer_id: p.id,
      amount: bulkIssueAmount,
      status: "active"
    }));

    const { data, error } = await supabase
      .from("coupons")
      .insert(newCoupons)
      .select();

    if (data && !error) {
      setCoupons(prev => [...data, ...prev]);
      alert(`${profiles.length}人にクーポンを一斉発行しました！`);
    } else {
      console.error(error);
      alert("一斉発行に失敗しました。");
    }
    setIsBulkIssuing(false);
  };

  const toggleExpand = (userId: string) => {
    setExpandedUserId(prev => prev === userId ? null : userId);
    setIssueAmount(50); // Reset amount when opening new panel
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold text-xl">読み込み中...</div>;

  const totalIssued = coupons.length;
  const totalUsed = coupons.filter(c => c.status === "used").length;
  const usageRate = totalIssued > 0 ? Math.round((totalUsed / totalIssued) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto md:p-8 space-y-8">
      {/* ヘッダー */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 p-3 rounded-xl hidden md:block">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">管理者ダッシュボード</h1>
            <p className="text-sm text-slate-500 mt-1">クラス全体の利用状況とクーポン発行管理</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-bold transition-colors border border-slate-200">
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">ログアウト</span>
        </button>
      </div>

      {/* 統計パネル */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            総発行数
          </div>
          <div className="text-5xl font-black text-slate-800">{totalIssued}<span className="text-2xl text-slate-400 ml-2 font-bold">枚</span></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            総利用数
          </div>
          <div className="text-5xl font-black text-emerald-500">{totalUsed}<span className="text-2xl text-emerald-300 ml-2 font-bold">枚</span></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            利用率
          </div>
          <div className="text-5xl font-black text-blue-500">{usageRate}<span className="text-2xl text-blue-300 ml-2 font-bold">%</span></div>
        </div>
      </div>

      {/* クラスメイト一覧 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-slate-600" />
            <h2 className="font-bold text-lg text-slate-800">クラスメイト管理</h2>
          </div>
          
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="relative">
              <select 
                value={bulkIssueAmount} 
                onChange={(e) => setBulkIssueAmount(Number(e.target.value))}
                className="appearance-none bg-white border border-slate-200 text-slate-700 font-bold py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
              >
                <option value={50}>50円</option>
                <option value={100}>100円</option>
                <option value={150}>150円</option>
                <option value={200}>200円</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <button 
              onClick={bulkIssueCoupons}
              disabled={isBulkIssuing || profiles.length === 0}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Ticket className="w-4 h-4" />
              <span className="hidden md:inline">全員に一斉発行</span>
              <span className="md:hidden">一斉発行</span>
            </button>
          </div>
        </div>
        
        {profiles.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            クラスメイトが登録されていません。
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  <th className="p-4 font-bold text-slate-500 text-sm">名前</th>
                  <th className="p-4 font-bold text-slate-500 text-sm">発行数</th>
                  <th className="p-4 font-bold text-slate-500 text-sm">使用済</th>
                  <th className="p-4 font-bold text-slate-500 text-sm">利用率</th>
                  <th className="p-4 font-bold text-slate-500 text-sm text-right">アクション</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map(profile => {
                  const userCoupons = coupons.filter(c => c.issuer_id === profile.id);
                  const userUsed = userCoupons.filter(c => c.status === "used").length;
                  const userRate = userCoupons.length > 0 ? Math.round((userUsed / userCoupons.length) * 100) : 0;
                  const isExpanded = expandedUserId === profile.id;
                  
                  return (
                    <React.Fragment key={profile.id}>
                      <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{profile.name}</td>
                        <td className="p-4 font-medium text-slate-600">{userCoupons.length} 枚</td>
                        <td className="p-4 font-bold text-emerald-500">{userUsed} 枚</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-full max-w-[100px] bg-slate-100 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${userRate}%` }}></div>
                            </div>
                            <span className="text-sm font-bold text-slate-600">{userRate}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => toggleExpand(profile.id)}
                            className="inline-flex items-center justify-center gap-1 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors"
                          >
                            管理
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                      
                      {/* 詳細管理パネル */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80 border-b border-slate-200">
                          <td colSpan={5} className="p-6">
                            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                              
                              {/* 追加発行フォーム */}
                              <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                <div className="font-bold text-slate-700">クーポンの追加発行</div>
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <select 
                                      value={issueAmount} 
                                      onChange={(e) => setIssueAmount(Number(e.target.value))}
                                      className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    >
                                      <option value={50}>50円引き</option>
                                      <option value={100}>100円引き</option>
                                      <option value={150}>150円引き</option>
                                      <option value={200}>200円引き</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                      <ChevronDown className="w-4 h-4" />
                                    </div>
                                  </div>
                                  
                                  <button 
                                    onClick={() => issueCoupon(profile.id)}
                                    disabled={isIssuing === profile.id}
                                    className="inline-flex items-center gap-1 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
                                  >
                                    <Plus className="w-4 h-4" />
                                    発行する
                                  </button>
                                </div>
                              </div>

                              {/* クーポンリスト */}
                              <div>
                                <h3 className="text-sm font-bold text-slate-500 mb-3">発行済みクーポン一覧</h3>
                                {userCoupons.length === 0 ? (
                                  <div className="text-sm text-slate-400">クーポンはありません。</div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {userCoupons.map((coupon, idx) => (
                                      <div key={coupon.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">
                                            #{userCoupons.length - idx}
                                          </div>
                                          <div>
                                            <div className="font-bold text-slate-800">{coupon.amount}円 OFF</div>
                                            <div className="text-xs font-medium">
                                              {coupon.status === "used" ? (
                                                <span className="text-red-500">使用済み</span>
                                              ) : (
                                                <span className="text-emerald-500">未使用</span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <button 
                                          onClick={() => deleteCoupon(coupon.id)}
                                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                          title="削除する"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
