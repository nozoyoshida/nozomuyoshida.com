---
layout: post
title: "Geminiで45分超の長尺動画を処理する分割設計とパラメータ調整"
date: 2026-01-15
excerpt: "Vertex AI / Gemini APIで45分を超える長尺動画を扱う際の入力上限と、前後の文脈を保ちながら分割・統合する設計、サンプリングレート等の調整方法をまとめます。"
category: "Research"
---

動画検索システムで動画からメタデータを抽出する際、Vertex AI の Gemini API に動画をそのまま渡せる仕組みは重宝します。ただ、実運用では音声付き動画で45分という入力上限にぶつかることがあります。

### 1. Gemini APIの動画入力上限とトークン消費量

Google Cloudのドキュメントによると、Vertex AI Gemini APIにおける1リクエストあたりの動画入力上限は次の通りです。

- 音声あり動画: 約45分まで
- 音声なし動画: 約1時間まで

デフォルトのサンプリングレート（1秒あたり1フレーム、1 FPS）で換算すると、45分（2,700秒＝2,700フレーム）の動画は標準解像度（1フレームあたり約258トークン＋音声約32トークン/秒）で**合計約78万〜80万トークン規模**にのぼります。約66トークン/フレームの低解像度モードでも約26万トークン規模になるため、45分という上限は1M〜2Mトークンのコンテキストウィンドウ制約と、API側のペイロード・処理仕様の双方に関わっています。

### 2. 文脈を切らさない動画分割の設計

45分を超える動画はファイルを分割して複数回APIへ渡すことになりますが、機械的に「0〜45分」「45〜90分」と区切ると、境界の前後で会話や出来事の文脈が途切れる恐れがあります。実務ではセグメント間のオーバーラップと前パート要約の引き継ぎを組み合わせて対処します。

#### セグメント間に5分程度のオーバーラップを設ける

前後の文脈が切れないよう、前パートの末尾5分程度を次パートの冒頭に重ねて切り出します。

- 1パート目: 0分〜45分
- 2パート目: 40分〜85分

5分間の重なりを作っておけば、45分前後にまたがる発話やイベントが途中で切れるのを防げます。

#### Chain of Contextで前パートの要約を引き継ぐ

オーバーラップに加えて、1パート目で抽出した構造化メタデータ（要約や登場人物、時系列ログなどのテキスト情報）を、2パート目のAPIリクエスト時にプロンプトへ含めて渡します。

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

前パートの動画データそのものを再送するとトークン量や転送量がかさみますが、テキスト情報に圧縮してプロンプトへ添えれば、それまでの経緯を背景知識としてモデルに引き継いだ状態で後半パートを解析できます。

### 3. Map-Reduceによるメタデータの抽出と統合

分割して抽出したデータを動画全体のタイムラインにまとめる処理は、次の2段階で行います。

1. 個別抽出（Mapフェーズ）では分割した各セグメントから、タイムスタンプごとのイベント、キーワード、パート要約を抽出します。
2. 全体統合（Reduceフェーズ）では全セグメントのメタデータが出そろった後、抽出済みのテキストデータのみをGemini（Gemini 2.5 Pro / Flash など）に入力して全体のタイムラインを再構築します。

要約テキストをもう一段統合する形をとることで、長尺動画全体を一貫したコンテキストで検索対象にできます。

### 4. 動画の性質に合わせたFPSと解像度の調整

分割設計とあわせて、動画の性質や目的に応じてサンプリングレートと解像度を調整すると、処理効率と精度のバランスを取れます。

#### サンプリングレートを下げる

Vertex AI / Gemini API の `fps` パラメータ（サンプリングレート）をデフォルトの `1` より低く（例：`0.2`〜`0.5` FPS など 1 未満に）設定するか、前処理で動画を倍速化・フレーム間引きすることで、1時間以上の長尺動画でもトークン消費量を抑えて広い時間範囲を処理できます。ただしサンプリング間隔を広げすぎると動きの激しいシーンを取り逃す場合があるため、板書中心の講義動画や定点映像など変化が緩やかな動画に向いています。
（参考：[動画の理解 | Gemini API](https://ai.google.dev/gemini-api/docs/video-understanding?hl=ja)）

> 長い動画の場合は、FPS を低く（1 未満）設定することをおすすめします。この機能は、ほとんど静止している動画（講義など）に特に役立ちます。

#### 入力動画の解像度を下げる

動画の解像度を下げると、データの転送量を抑えて処理を速くできます。Geminiは低解像度でも高い認識精度を維持できるため、転送コストと処理の速さを優先したいメタデータ抽出に向いています。
（参考：[Gemini 1.5 Pro/Flashの動画解析におけるトークン消費量と制約](https://tech-tech.nddhq.co.jp/2025/09/24/gemini-tokens-on-video-analysis/#)）

#### Works cited

[1] 動画理解 | Generative AI on Vertex AI | Google Cloud Documentation [https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/video-understanding](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/video-understanding)

[2] Use the Gemini API for Video Analysis | Gemini API | Google for Developers [https://ai.google.dev/gemini-api/docs/video](https://ai.google.dev/gemini-api/docs/video)
