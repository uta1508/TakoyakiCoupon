"use client";

import { useEffect, useState, use } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

import confetti from "canvas-confetti";

// 成功時のサウンド再生（Web Audio API）
function playSuccessSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sine";
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // 最初の音 (C5)
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
    
    // 次の音 (E5)
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.5);
    }, 150);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch(e) {
    console.error("Audio API not supported", e);
  }
}

export default function CouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const supabase = createClient();
  const [coupon, setCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isUsed, setIsUsed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCoupon() {
      try {
        const { data, error } = await supabase
          .from("coupons")
          .select("*, profiles:issuer_id(name)")
          .eq("id", id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setCoupon(data);
          setIsUsed(data.status === "used");
        }
      } catch (err: any) {
        console.error(err);
        setError("クーポンの取得に失敗しました。URLが正しいか確認してください。");
      } finally {
        setLoading(false);
      }
    }
    fetchCoupon();
  }, [id, supabase]);

  const handleUseClick = () => {
    if (isUsed) return;
    
    // 店員の前で操作させるための警告
    const confirmed = window.confirm(
      "【注意】\n" +
      "この操作は必ず「お店の人の前」で行ってください。\n\n" +
      "※自分でスワイプしてしまうと、クーポンが無効になる場合があります。\n\n" +
      "店員に画面を見せる準備はよろしいですか？"
    );
    
    if (!confirmed) return;
    
    setIsFlipped(true);
  };

  const handleSwipeComplete = async () => {
    setIsUsed(true);
    
    // 🎉 紙吹雪とサウンドを再生
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#34D399', '#FBBF24', '#60A5FA', '#F87171', '#A78BFA']
    });
    playSuccessSound();

    await supabase
      .from("coupons")
      .update({ status: "used", used_at: new Date().toISOString() })
      .eq("id", id);
  };

  if (loading) {
    return <div className="flex-1 flex justify-center items-center"><Loader2 className="animate-spin w-8 h-8 text-slate-400" /></div>;
  }

  if (error || !coupon) {
    return <div className="text-center mt-10 text-slate-500 bg-white p-6 rounded-2xl shadow-sm">{error || "クーポンが見つかりません。"}</div>;
  }

  // Supabase join response depends on how relationships are set up.
  // Using an array check or direct property depending on the query result shape.
  const issuerName = Array.isArray(coupon.profiles) ? coupon.profiles[0]?.name : coupon.profiles?.name;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 w-full h-full">
      <motion.div
        className="relative w-full max-w-sm aspect-[3/4]"
        animate={{ rotate: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 150, damping: 20 }}
      >
        <div className="absolute inset-0 w-full h-full bg-white rounded-[2rem] shadow-xl p-8 flex flex-col items-center text-center border border-slate-100 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-slate-50 rounded-full blur-2xl opacity-60 pointer-events-none" />
          
          {/* 表面 (未フリップ時) または 裏面 (フリップ時) を条件表示 */}
          {!isFlipped ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="w-full h-full flex flex-col items-center z-10"
            >
              <div className="text-sm font-semibold tracking-wider text-slate-400 mb-3 uppercase">Special Offer</div>
              <div className="text-xl font-bold text-slate-800 mb-8">{issuerName || "クラスメイト"} さんから</div>
              
              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="text-7xl font-black text-slate-900 tracking-tighter flex items-baseline">
                  <span className="text-4xl mr-1">¥</span>
                  {coupon.amount}
                </div>
                <div className="text-lg font-bold text-slate-500 mt-1 uppercase tracking-widest">Discount</div>
              </div>
              
              <div className="mt-8 w-full">
                {isUsed ? (
                  <div className="w-full py-4 bg-slate-50 text-slate-400 font-bold rounded-2xl flex items-center justify-center gap-2 border border-slate-100">
                    <CheckCircle className="w-5 h-5" />
                    利用済み
                  </div>
                ) : (
                  <button 
                    onClick={handleUseClick}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98]"
                  >
                    店員用：利用する
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full h-full flex flex-col items-center justify-center z-10"
            >
              <div className="text-xl font-bold mb-16 text-slate-800 leading-relaxed">
                画面を店員に見せて<br />スワイプしてもらってください
              </div>
              
              {isUsed ? (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-40 h-40 border-4 border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center rotate-[-15deg] shadow-[0_0_30px_rgba(52,211,153,0.2)] bg-emerald-50/50"
                >
                  <div className="text-4xl font-black tracking-widest border-y-2 border-emerald-400 py-2 px-1">
                    使用済
                  </div>
                </motion.div>
              ) : (
                <div className="w-full px-4">
                  <SwipeToUse onComplete={handleSwipeComplete} />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function SwipeToUse({ onComplete }: { onComplete: () => void }) {
  const containerWidth = 260;
  const knobWidth = 64;
  const maxDrag = containerWidth - knobWidth - 8; // 8px padding
  
  // 画面全体が180度回転しているため、Framer Motionのドラッグ判定が指の動きと逆になるバグを回避するため、
  // このコンポーネント自体をさらに180度回転させて相殺（実質0度）し、内部を店員向けにレイアウトし直します。
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, -maxDrag * 0.5], [1, 0]);
  const bgProgress = useTransform(x, [0, -maxDrag], ["#1e293b", "#10b981"]);

  const handleDragEnd = () => {
    if (x.get() <= -maxDrag * 0.8) {
      onComplete();
    }
  };

  return (
    <div className="relative h-[72px] rounded-[36px] p-1 overflow-hidden border border-slate-700/50 flex justify-end rotate-180" style={{ width: containerWidth }}>
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: bgProgress }}
      />
      <motion.div 
        className="absolute inset-0 flex items-center justify-center font-bold text-sm tracking-widest text-slate-300 z-10 pointer-events-none pr-6 rotate-180"
        style={{ opacity }}
      >
        右へスワイプ
      </motion.div>
      <motion.div
        drag="x"
        dragConstraints={{ left: -maxDrag, right: 0 }}
        dragElastic={0.05}
        dragSnapToOrigin
        onDragEnd={handleDragEnd}
        style={{ x, width: knobWidth }}
        className="relative h-full bg-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-20 shadow-md"
      >
        <ChevronLeft className="text-slate-900 w-6 h-6" />
      </motion.div>
    </div>
  );
}
