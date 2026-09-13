import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// サーバーサイド専用の管理者クライアント
// 注意: フロントエンドには露出させないため、NEXT_PUBLIC_ プレフィックスのない環境変数を使います
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 新規ユーザーの作成
export async function POST(request: Request) {
  try {
    const { name, initials, student_no } = await request.json();
    
    const paddedNo = String(student_no).padStart(2, '0');
    const userId = `${initials}${paddedNo}`;
    const email = `${userId}@takoyaki.local`;
    const password = String(Math.floor(100000 + Math.random() * 900000)); // 6桁ランダム

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name }
    });

    if (error) throw error;

    // Triggerによって profiles が自動作成されるのを待機（または手動で student_no を更新）
    // 数ミリ秒待機して確実性を高める
    await new Promise(resolve => setTimeout(resolve, 500));

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ student_no, name })
      .eq('id', data.user.id);

    if (profileError) throw profileError;

    return NextResponse.json({ success: true, user: data.user, password, userId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ユーザーの更新（名前や出席番号など）
export async function PATCH(request: Request) {
  try {
    const { id, name, student_no } = await request.json();
    
    // Authのメタデータも一応更新しておく
    await supabaseAdmin.auth.admin.updateUserById(id, { user_metadata: { name } });

    // profilesを更新
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ name, student_no })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ユーザーの削除
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
