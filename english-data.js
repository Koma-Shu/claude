/* english-data.js — Course/Lesson structure for the ENGLISH (口頭英作文) manager
   ----------------------------------------------------------------------------
   PROGRIT の「口頭英作文」の学習を管理するための、コース→パート→レッスンの構造定義。
   各レッスンは10問。レッスンIDは `${part.id}-L{nn}` の形で **安定**しており、
   間隔反復（忘却曲線）スケジューリングのキーになる。一度公開したら変更しないこと。

   window.ENGLISH_META    : アプリ全体の定数（1レッスンの問題数・所要時間モデルなど）
   window.ENGLISH_COURSES : 並び順つきのコース定義（parts に各パートのレッスン数）

   レッスン数の出典:
     Advanced 2 …… Part1:17 / Part2:14 / Part3:15  (= 46 Lessons)
     Common Verb … Part1:22 / Part2:24 / Part3:24  (= 70 Lessons)
     Business Phrases … 16トピック（添付スクリーンショット準拠, = 55 Lessons）
   合計 171 Lessons = 1,710 問。
   ------------------------------------------------------------------------- */
(function (w) {
  'use strict';

  w.ENGLISH_META = {
    source: 'PROGRIT 口頭英作文',
    questionsPerLesson: 10,
    // 1レッスンあたりの所要時間モデル（分）。今日のおすすめ量・所要時間の算出に使用。
    // 口頭英作文は「日本語→1〜2秒で英語」を10問。初回はチェック込みでやや長め、復習は速い。
    minutesNew: 6,
    minutesReview: 3,
    // 「定着」とみなす間隔（日）。これを超えて生き残った記憶は忘却曲線上で十分に安定。
    masteredIntervalDays: 30
  };

  w.ENGLISH_COURSES = [
    {
      id: 'adv2', name: 'Advanced 2', icon: '🚀', color: '#60a5fa',
      desc: '応用構文の瞬間英作文。語順・コロケーションを自動化して仕上げる。',
      parts: [
        { id: 'adv2-p1', name: 'Part 1', lessons: 17 },
        { id: 'adv2-p2', name: 'Part 2', lessons: 14 },
        { id: 'adv2-p3', name: 'Part 3', lessons: 15 }
      ]
    },
    {
      id: 'cv', name: 'Common Verb', icon: '🔤', color: '#34d399',
      desc: '高頻度の基本動詞で、発話の土台となる瞬発力（語順の自動化）を鍛える。',
      parts: [
        { id: 'cv-p1', name: 'Part 1', lessons: 22 },
        { id: 'cv-p2', name: 'Part 2', lessons: 24 },
        { id: 'cv-p3', name: 'Part 3', lessons: 24 }
      ]
    },
    {
      id: 'bp', name: 'Business Phrases', icon: '💼', color: '#fb923c',
      desc: '実務シーン別のビジネス表現。目標の「ビジネス英会話」に直結。',
      // Business Phrases はトピック＝パート。番号と名称はアプリ内表示準拠。
      parts: [
        { id: 'bp-01', name: '01. 着任と新環境への適応',            lessons: 3 },
        { id: 'bp-02', name: '02. オフィスの日常コミュニケーション',  lessons: 4 },
        { id: 'bp-03', name: '03. 会議の進行と発言',                lessons: 5 },
        { id: 'bp-04', name: '04. 1on1・上司とのコミュニケーション',  lessons: 3 },
        { id: 'bp-05', name: '05. プロジェクトとタスク推進',          lessons: 5 },
        { id: 'bp-06', name: '06. 他部署との連携・横の調整',          lessons: 3 },
        { id: 'bp-07', name: '07. チーム・現地スタッフとの協働',      lessons: 4 },
        { id: 'bp-08', name: '08. プレゼンテーションと説明',          lessons: 3 },
        { id: 'bp-09', name: '09. 商談・外部パートナーとの折衝',      lessons: 4 },
        { id: 'bp-10', name: '10. 電話・オンライン対応',              lessons: 3 },
        { id: 'bp-11', name: '11. 視察・来客対応とネットワーキング',  lessons: 4 },
        { id: 'bp-12', name: '12. 日常的なトラブルと問題解決',        lessons: 3 },
        { id: 'bp-13', name: '13. 緊急事態・クレームの初動',          lessons: 3 },
        { id: 'bp-14', name: '14. 異文化理解とニュアンスの調整',      lessons: 3 },
        { id: 'bp-15', name: '15. 本社への報告と橋渡し',              lessons: 3 },
        { id: 'bp-16', name: '16. 離任と引き継ぎ',                    lessons: 2 }
      ]
    }
  ];
})(window);
