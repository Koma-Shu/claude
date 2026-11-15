-- ============================================================
-- ARCADE — Migration v8: 移転済みの学習データを削除する（任意）
-- ARCADE 用の Supabase プロジェクトの SQL Editor で実行する（何度実行しても安全）。
--
-- ENGLISH / STUDY は personal-tools（別の Supabase プロジェクト）へ移転し、
-- 学習データは取り込みページでコピー済み。ARCADE 側の以下のテーブルは
-- もうどのページからも使われていないので削除する。
--   english_progress … ENGLISH の学習状態（migrate v6 で作成）
--   study_progress   … STUDY の問題ごとの進捗（migrate v3 で作成）
--   study_reviews    … STUDY の回答ログ（migrate v3 で作成、未使用）
-- ============================================================

drop table if exists public.english_progress;
drop table if exists public.study_progress;
drop table if exists public.study_reviews;
