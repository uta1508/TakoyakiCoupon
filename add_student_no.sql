-- 1. profilesテーブルに出席番号(student_no)カラムを追加
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_no INTEGER;

-- 2. 既に作成されたユーザーのメールアドレス（例: ak01@takoyaki.local）から数字部分を抽出して出席番号として更新する
UPDATE public.profiles p
SET student_no = CAST(SUBSTRING(u.email FROM '[0-9]+') AS INTEGER)
FROM auth.users u
WHERE p.id = u.id AND u.email LIKE '%@takoyaki.local';
