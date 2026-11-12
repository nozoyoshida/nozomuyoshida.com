---
layout: post
title: "Geminiで長時間の動画を処理させるコツ：分割とパラメータ最適化の戦略"
date: 2026-01-15
excerpt: "Geminiで45分を超える長尺動画を扱う際の制限事項と、文脈を維持しながら分割・処理するための具体的な戦略について解説します。"
category: "Research"
---

動画検索システムの構築において、Gemini（Vertex AI）を活用した動画のメタデータ抽出は非常に強力な手法です。しかし、実運用では「45分の壁」という技術的な制約に直面することがあります。

本稿では、仕様上の上限を超える長尺動画を処理する際の「分割のコツ」と「パラメータ最適化」について、具体的な実装戦略を提案します。

---

### 1. Geminiの動画処理における「45分の壁」

Google Cloudのドキュメントによれば、現状のVertex AI Gemini APIにおける動画入力の制限は以下の通りです。

- **音声あり動画**: 約45分まで
- **音声なし動画**: 約1時間まで

これをデフォルトの1秒あたり1フレーム（1 FPS）のサンプリングレートで見ると、45分（2,700秒＝2,700フレーム）の動画は、標準解像度（1フレームあたり約258トークン＋音声約32トークン/秒）で**合計約78万〜80万トークン規模**に達します（低解像度モードの約66トークン/フレーム設定でも約26万トークン規模）。つまり45分という上限は、1M〜2Mトークンのコンテキストウィンドウ制約およびAPI側のペイロード・処理仕様の双方に直結しています。

### 2. 動画分割：単なる「半分」ではいけない理由

45分を超える動画を処理する場合、動画ファイルを分割して複数回処理することになりますが、単純に「0〜45分」「45〜90分」のように分割すると、境界線で会話や文脈が分断されるリスクがあります。これを防ぐための2つの重要戦略を紹介します。

#### A: 5分程度のオーバーラップを設ける
境界付近の文脈を保持するため、セグメント間に重なりを持たせることが不可欠です。

- **1処理目**: 0分 〜 45分 (実際の処理: 0-45分)
- **2処理目**: 40分 〜 85分 (実際の処理: 40-85分)
このように、前パートの末尾5分程度を次パートの冒頭に含めることで、イベントの分断を防ぎます。

#### B: 「Chain of Context」：前パートのメタデータを次パートのプロンプトに注入
より高度な手法として、1パート目の処理で抽出されたメタデータ（サマリーなどのテキスト情報）を、2パート目のAPIコール時のプロンプトに含める方法が有効です。

<figure style="margin: 24px 0; padding: 18px 16px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;">
<svg viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chain of Contextによる長尺動画分割・文脈引き継ぎフロー" style="width: 100%; max-width: 740px; height: auto; display: block; margin: 0 auto; font-family: 'Open Sans', 'Hiragino Sans', 'Meiryo', sans-serif;">
  <defs>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb"/>
    </marker>
    <marker id="arrow-teal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0f766e"/>
    </marker>
  </defs>
  <rect x="20" y="20" width="210" height="68" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="125" y="47" text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b">セグメント 1（00:00〜45:00）</text>
  <text x="125" y="69" text-anchor="middle" font-size="11" fill="#64748b">長尺動画の前半パート</text>
  <line x1="230" y1="54" x2="278" y2="54" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
  <rect x="284" y="20" width="180" height="68" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="374" y="47" text-anchor="middle" font-size="13" font-weight="600" fill="#1d4ed8">マルチモーダル推論 (Map)</text>
  <text x="374" y="69" text-anchor="middle" font-size="11" fill="#475569">イベント・要約の抽出</text>
  <line x1="464" y1="54" x2="512" y2="54" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
  <rect x="518" y="20" width="222" height="68" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
  <text x="629" y="47" text-anchor="middle" font-size="13" font-weight="600" fill="#15803d">構造化メタデータ 1</text>
  <text x="629" y="69" text-anchor="middle" font-size="11" fill="#475569">要約・登場人物・時系列ログ</text>
  <path d="M 629 88 L 629 118 L 130 118 L 130 146" fill="none" stroke="#0f766e" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#arrow-teal)"/>
  <rect x="255" y="104" width="250" height="26" rx="13" fill="#ccfbf1" stroke="#14b8a6" stroke-width="1"/>
  <text x="380" y="121" text-anchor="middle" font-size="11" font-weight="600" fill="#0f766e">Chain of Context（次パートのプロンプトへ注入）</text>
  <rect x="20" y="152" width="220" height="72" rx="6" fill="#ffffff" stroke="#0f766e" stroke-width="1.5"/>
  <text x="130" y="178" text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b">セグメント 2（40:00〜85:00）</text>
  <text x="130" y="198" text-anchor="middle" font-size="11" fill="#0f766e">5分重複 ＋ 前パートの構造化メタデータ</text>
  <line x1="240" y1="188" x2="278" y2="188" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
  <rect x="284" y="152" width="180" height="72" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="374" y="178" text-anchor="middle" font-size="13" font-weight="600" fill="#1d4ed8">文脈維持推論 (Map)</text>
  <text x="374" y="198" text-anchor="middle" font-size="11" fill="#475569">前後の文脈を踏まえた抽出</text>
  <line x1="464" y1="188" x2="512" y2="188" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
  <rect x="518" y="152" width="222" height="72" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
  <text x="629" y="178" text-anchor="middle" font-size="13" font-weight="600" fill="#0f172a">全体タイムライン統合 (Reduce)</text>
  <text x="629" y="198" text-anchor="middle" font-size="11" fill="#475569">全セグメント要約のテキスト統合</text>
</svg>
<figcaption style="font-size: 13px; color: #64748b; margin-top: 10px;">図：5分間のオーバーラップと前パート要約のプロンプト注入（Chain of Context）を組み合わせた長尺動画処理フロー</figcaption>
</figure>

動画データそのものを渡すのは重いですが、テキスト情報に圧縮して伝えることで、前パートの状況を「コンテキスト（背景知識）」としてモデルに引き継ぎ、一貫した理解が可能になります。

### 3. メタデータの抽出と統合（Map-Reduceアプローチ）

分割して抽出したデータをどのように統合すべきでしょうか。以下の2つのステップを推奨します。

1.  **各セグメントの個別抽出 (Map)**: 各セグメントに対して、特定のタイムスタンプごとのイベント、キーワード、サマリーを抽出させます。
2.  **サマリーの統合サマリー (Reduce)**: 全セグメントのメタデータが出揃った後、抽出されたテキストデータのみをGemini（Gemini 2.5 Pro / Flash など）に入力し、全体のタイムラインを再構築させます。

この「情報の要約をさらに要約する」アプローチにより、動画全体を一貫したコンテキストで検索対象にすることが可能になります。

### 4. APIのパラメータ最適化アプローチ

動画の性質や目的に応じて、以下のパラメータを調整することで処理効率と精度をコントロールできます。

#### A: FPS調整と速度のトレードオフ
Vertex AI / Gemini API の `fps` パラメータ（サンプリングレート）をデフォルトの `1` より低く（例：`0.2`〜`0.5` FPS など 1 未満に）設定するか、前処理で動画を倍速化・フレーム間引きすることで、1時間以上の長尺動画でもトークン消費量を抑えて多くの時間範囲を処理させることができます。ただしサンプリング間隔を広げすぎると動きの激しいシーンを取り逃す場合があるため、板書中心の講義動画や定点映像など変化が緩やかな動画に特に有効です。
（参考：[動画の理解 | Gemini API](https://ai.google.dev/gemini-api/docs/video-understanding?hl=ja)）

> 長い動画の場合は、FPS を低く（1 未満）設定することをおすすめします。この機能は、ほとんど静止している動画（講義など）に特に役立ちます。

#### B: 解像度の最適化によるスピードアップ
動画の解像度を下げることで、処理スピード自体を上げることが可能です。Geminiは低解像度でも高い認識精度を維持できるため、メタデータ抽出などのタスクでは、転送コストとスピードのトレードオフとして非常に有効な手段です。
（参考：[Gemini 1.5 Pro/Flashの動画解析におけるトークン消費量と制約](https://tech-tech.nddhq.co.jp/2025/09/24/gemini-tokens-on-video-analysis/#)）

### まとめ

45分超えの動画をGeminiで処理する際は、**「適切なオーバーラップとコンテクストの連鎖」**、そして**「動画の性質に合わせたFPS・解像度の最適化」**が鍵となります。

単なる結合ではなく、境界の文脈を維持しつつ、計算リソースを最適に配分する工夫を実装に盛り込むことで、実用的で高度な動画検索システムの基盤を構築できるはずです。

#### **Works cited**

[1] 動画理解 | Generative AI on Vertex AI | Google Cloud Documentation [https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/video-understanding](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/video-understanding)

[2] Use the Gemini API for Video Analysis | Gemini API | Google for Developers [https://ai.google.dev/gemini-api/docs/video](https://ai.google.dev/gemini-api/docs/video)
