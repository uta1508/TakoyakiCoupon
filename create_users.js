const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const fs = require('fs');

// ★ Supabaseのプロジェクト設定
const SUPABASE_URL = 'https://ltidgutprsfcgnozteje.supabase.co';
// ★★★ ダッシュボードの Project Settings -> API から「service_role secret」をコピーしてここに貼り付けてください ★★★
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0aWRndXRwcnNmY2dub3p0ZWplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTI3MDA0MSwiZXhwIjoyMTA0ODQ2MDQxfQ.VzsXsXZwM1gF8wnU0zK_hawyLkDTg2iAIxT0GKVtJIU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const students = [
  { no: 1, name: "朝日 康太", initials: "ak" },
  { no: 2, name: "新井 紫月", initials: "as" },
  { no: 3, name: "小笠原 颯介", initials: "os" },
  { no: 5, name: "柏木 志織", initials: "ks" },
  { no: 6, name: "梶原 悠太郎", initials: "ky" },
  { no: 7, name: "片柳 涼太", initials: "kr" },
  { no: 8, name: "片山 愛翔", initials: "ka" },
  { no: 9, name: "加藤 礼惟", initials: "kr" },
  { no: 10, name: "菊地 旺佑", initials: "ko" },
  { no: 11, name: "小林 択真", initials: "kt" },
  { no: 12, name: "小林 真大", initials: "km" },
  { no: 13, name: "齋藤 真子", initials: "sm" },
  { no: 14, name: "齋藤 みなみ", initials: "sm" },
  { no: 15, name: "佐藤 楓", initials: "sk" },
  { no: 16, name: "澤中 伶実", initials: "sr" },
  { no: 17, name: "柴山 泰樹", initials: "sh" },
  { no: 18, name: "滝澤 幸", initials: "tk" },
  { no: 19, name: "田村 碧大", initials: "ta" },
  { no: 20, name: "津田 凱斗", initials: "tk" },
  { no: 21, name: "弦巻 魁良", initials: "tk" },
  { no: 22, name: "堂脇 麟太朗", initials: "dr" },
  { no: 23, name: "戸田 琉太", initials: "tr" },
  { no: 24, name: "中里 茉瑚", initials: "nm" },
  { no: 25, name: "奈良 優美", initials: "ny" },
  { no: 26, name: "西岡 将登", initials: "nm" },
  { no: 27, name: "根城 尚宗", initials: "nn" },
  { no: 28, name: "萩原 颯人", initials: "hh" },
  { no: 29, name: "羽田 乃彩", initials: "hn" },
  { no: 30, name: "馬場 凛太", initials: "br" },
  { no: 31, name: "細川 結衣", initials: "hy" },
  { no: 32, name: "本間 宇太郎", initials: "hu" },
  { no: 33, name: "松本 竜汰", initials: "mr" },
  { no: 34, name: "宮本 真衣利", initials: "mm" },
  { no: 35, name: "村上 廉", initials: "mr" },
  { no: 36, name: "望月 健志", initials: "mk" },
  { no: 37, name: "山内 玲二", initials: "yr" },
  { no: 38, name: "山﨑 祐翔", initials: "yh" },
  { no: 39, name: "渡邊 太詞", initials: "wt" },
  { no: 40, name: "渡部 綾奈", initials: "wa" }
];

async function main() {
  if (SUPABASE_SERVICE_ROLE_KEY.includes('貼り付け')) {
    console.error("エラー: SUPABASE_SERVICE_ROLE_KEY を設定してください！");
    return;
  }

  let outputCsv = "番号,氏名,ユーザーID,パスワード\n";

  console.log("アカウントの作成を開始します...");

  for (const student of students) {
    const paddedNo = String(student.no).padStart(2, '0');
    const userId = `${student.initials}${paddedNo}`;
    const email = `${userId}@takoyaki.local`;
    
    // 6桁のランダムな数字パスワードを生成
    const password = String(Math.floor(100000 + Math.random() * 900000));

    // Admin APIを使ってユーザー作成（メール確認不要、レートリミット回避）
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { name: student.name }
    });

    if (error) {
      console.error(`❌ ${student.name} の作成に失敗:`, error.message);
    } else {
      console.log(`✅ ${student.name} (ID: ${userId}) を作成しました`);
      outputCsv += `${student.no},${student.name},${userId},${password}\n`;
    }
    
    // 少し待機（安全のため）
    await new Promise(r => setTimeout(r, 200));
  }

  fs.writeFileSync('account_list.csv', outputCsv);
  console.log("🎉 すべて完了しました！パスワードリストを account_list.csv に保存しました。");
}

main();
