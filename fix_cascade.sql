-- 既存の外部キー制約（紐付けルール）を一旦削除します
ALTER TABLE public.coupons
  DROP CONSTRAINT IF EXISTS coupons_issuer_id_fkey;

-- ユーザー（profiles）が削除されたら、紐づくクーポンも自動的にまとめて削除する（CASCADE）設定を追加します
ALTER TABLE public.coupons
  ADD CONSTRAINT coupons_issuer_id_fkey
  FOREIGN KEY (issuer_id)
  REFERENCES public.profiles(id)
  ON DELETE CASCADE;
