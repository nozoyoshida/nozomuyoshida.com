---
title: "Google TPUとJAX：ハードウェア設計から分散学習までの技術解説"
date: "2026-01-14"
excerpt: "シストリックアレイからTrillium・Ironwoodに至るTPUのハードウェア設計と、XLAコンパイラを軸としたJAXエコシステム・SPMD分散学習の仕組みを整理する。"
category: "Research"
pw: 0.9
so: 1.0
---

## 第1章 AI特化型シリコンとTPUの設計思想

大規模言語モデル（LLM）や生成AIのモデル規模が拡大し続ける一方で、ムーアの法則の鈍化により汎用プロセッサ単体の性能向上は緩やかになっている。汎用処理向けのCPUや、グラフィックス処理から発展したGPUだけでは消費電力とクラスタ規模の両面で制約が大きくなり、AIの計算処理に絞った専用シリコンが求められるようになった。Googleが開発したTPU（Tensor Processing Unit）と、XLAコンパイラを基盤とする数値計算フレームワークJAXは、こうした大規模AI計算を支えるハードウェア・ソフトウェアスタックとして広く使われている。

### 1.1 メモリの壁とデータ移動のボトルネック

ディープラーニングの学習や推論で最大のボトルネックになるのは、演算器の計算速度そのものではなくデータの移動である。従来のCPUやGPUは演算装置（ALU）とメモリを分離したフォン・ノイマン型アーキテクチャを基本としており、計算のたびにメモリからレジスタへデータを読み込み、演算結果をまた書き戻す。複雑な分岐予測やキャッシュ制御を伴う汎用プログラムには向いているが、単純な行列積和演算（Matrix Multiply-Accumulate）を数千億回繰り返すAIワークロードではデータ往復の無駄が大きい。

演算器の高速化に対してメモリ帯域幅の伸びが追いつかず、プロセッサがデータ到着待ちのアイドル状態（ストール）に陥る問題は「メモリの壁（Memory Wall）」と呼ばれる。モデルが大きくなるほどデータ移動にかかる電力とレイテンシの比重が増し、システム全体のスケーリングを縛る要因となる。

### 1.2 ドメイン特化型アーキテクチャとシストリックアレイ

Googleはこの課題に対し、汎用性を削って特定の計算領域（行列演算）に絞る「ドメイン特化型アーキテクチャ（Domain Specific Architecture: DSA）」を採った。TPUはニューラルネットワークの計算の大半を占める行列演算において、メモリアクセスのオーバーヘッドを最小限に抑えるよう設計されている。

その中核にあるのが「シストリックアレイ（Systolic Array）」である。心臓が血液を送り出す収縮（Systole）の動きにちなんだ名称で、アレイ状に並んだ演算器の間をデータが波のように順番に伝わっていく構造を指す。途中経過を毎回メインメモリへ書き戻さずに済むため、TPUはGPUと比べて高い電力効率（Performance per Watt）を実現している。

<figure style="margin: 26px 0; padding: 18px 16px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;">
<svg viewBox="0 0 780 310" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="従来型CPU/GPUアーキテクチャとTPUシストリックアレイ（MXU内MAC網）のデータ移動比較" style="width: 100%; max-width: 760px; height: auto; display: block; margin: 0 auto; font-family: 'Open Sans', 'Hiragino Sans', 'Meiryo', sans-serif;">
  <defs>
    <marker id="arr-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626"/>
    </marker>
    <marker id="arr-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb"/>
    </marker>
  </defs>
  <rect x="14" y="12" width="356" height="286" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="192" y="38" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">従来型 CPU / GPU アーキテクチャ</text>
  <rect x="38" y="56" width="90" height="42" rx="5" fill="#f1f5f9" stroke="#64748b" stroke-width="1.4"/>
  <text x="83" y="81" text-anchor="middle" font-size="12" font-weight="600" fill="#0f172a">ALU / SM</text>
  <rect x="147" y="56" width="90" height="42" rx="5" fill="#f1f5f9" stroke="#64748b" stroke-width="1.4"/>
  <text x="192" y="81" text-anchor="middle" font-size="12" font-weight="600" fill="#0f172a">ALU / SM</text>
  <rect x="256" y="56" width="90" height="42" rx="5" fill="#f1f5f9" stroke="#64748b" stroke-width="1.4"/>
  <text x="301" y="81" text-anchor="middle" font-size="12" font-weight="600" fill="#0f172a">ALU / SM</text>
  <line x1="83" y1="102" x2="83" y2="128" stroke="#dc2626" stroke-width="2" marker-start="url(#arr-red)" marker-end="url(#arr-red)"/>
  <line x1="192" y1="102" x2="192" y2="128" stroke="#dc2626" stroke-width="2" marker-start="url(#arr-red)" marker-end="url(#arr-red)"/>
  <line x1="301" y1="102" x2="301" y2="128" stroke="#dc2626" stroke-width="2" marker-start="url(#arr-red)" marker-end="url(#arr-red)"/>
  <rect x="38" y="132" width="308" height="44" rx="5" fill="#fff7ed" stroke="#ea580c" stroke-width="1.4"/>
  <text x="192" y="158" text-anchor="middle" font-size="12" font-weight="600" fill="#9a3412">Register File / L1・L2 Cache (SRAM)</text>
  <line x1="140" y1="180" x2="140" y2="224" stroke="#dc2626" stroke-width="2.5" marker-start="url(#arr-red)" marker-end="url(#arr-red)"/>
  <line x1="244" y1="180" x2="244" y2="224" stroke="#dc2626" stroke-width="2.5" marker-start="url(#arr-red)" marker-end="url(#arr-red)"/>
  <text x="192" y="206" text-anchor="middle" font-size="11" font-weight="600" fill="#dc2626">反復的な Load / Store（帯域幅ボトルネック）</text>
  <rect x="38" y="230" width="308" height="48" rx="5" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>
  <text x="192" y="259" text-anchor="middle" font-size="13" font-weight="700" fill="#991b1b">HBM（高帯域幅メインメモリ）</text>
  <rect x="394" y="12" width="372" height="286" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="580" y="38" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">TPU シストリックアレイ（MXU）</text>
  <rect x="466" y="54" width="236" height="154" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.6" stroke-dasharray="5,3"/>
  <text x="584" y="72" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8">MXU（行列乗算ユニット全体）</text>
  <text x="434" y="106" text-anchor="middle" font-size="11" font-weight="600" fill="#0f766e">入力</text>
  <text x="434" y="121" text-anchor="middle" font-size="10" fill="#475569">(VMEM)</text>
  <line x1="448" y1="102" x2="480" y2="102" stroke="#2563eb" stroke-width="1.8" marker-end="url(#arr-blue)"/>
  <line x1="448" y1="142" x2="480" y2="142" stroke="#2563eb" stroke-width="1.8" marker-end="url(#arr-blue)"/>
  <line x1="448" y1="182" x2="480" y2="182" stroke="#2563eb" stroke-width="1.8" marker-end="url(#arr-blue)"/>
  <rect x="484" y="86" width="52" height="30" rx="4" fill="#ffffff" stroke="#3b82f6" stroke-width="1.3"/>
  <text x="510" y="105" text-anchor="middle" font-size="11" font-weight="600" fill="#1e3a8a">MAC</text>
  <line x1="536" y1="101" x2="554" y2="101" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arr-blue)"/>
  <rect x="558" y="86" width="52" height="30" rx="4" fill="#ffffff" stroke="#3b82f6" stroke-width="1.3"/>
  <text x="584" y="105" text-anchor="middle" font-size="11" font-weight="600" fill="#1e3a8a">MAC</text>
  <line x1="610" y1="101" x2="628" y2="101" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arr-blue)"/>
  <rect x="632" y="86" width="52" height="30" rx="4" fill="#ffffff" stroke="#3b82f6" stroke-width="1.3"/>
  <text x="658" y="105" text-anchor="middle" font-size="11" font-weight="600" fill="#1e3a8a">MAC</text>
  <line x1="510" y1="116" x2="510" y2="124" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arr-blue)"/>
  <line x1="584" y1="116" x2="584" y2="124" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arr-blue)"/>
  <line x1="658" y1="116" x2="658" y2="124" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arr-blue)"/>
  <rect x="484" y="126" width="52" height="30" rx="4" fill="#ffffff" stroke="#3b82f6" stroke-width="1.3"/>
  <text x="510" y="145" text-anchor="middle" font-size="11" font-weight="600" fill="#1e3a8a">MAC</text>
  <line x1="536" y1="141" x2="554" y2="141" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arr-blue)"/>
  <rect x="558" y="126" width="52" height="30" rx="4" fill="#ffffff" stroke="#3b82f6" stroke-width="1.3"/>
  <text x="584" y="145" text-anchor="middle" font-size="11" font-weight="600" fill="#1e3a8a">MAC</text>
  <line x1="610" y1="141" x2="628" y2="141" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arr-blue)"/>
  <rect x="632" y="126" width="52" height="30" rx="4" fill="#ffffff" stroke="#3b82f6" stroke-width="1.3"/>
  <text x="658" y="145" text-anchor="middle" font-size="11" font-weight="600" fill="#1e3a8a">MAC</text>
  <line x1="510" y1="156" x2="510" y2="164" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arr-blue)"/>
  <line x1="584" y1="156" x2="584" y2="164" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arr-blue)"/>
  <line x1="658" y1="156" x2="658" y2="164" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arr-blue)"/>
  <rect x="484" y="166" width="52" height="30" rx="4" fill="#ffffff" stroke="#3b82f6" stroke-width="1.3"/>
  <text x="510" y="185" text-anchor="middle" font-size="11" font-weight="600" fill="#1e3a8a">MAC</text>
  <line x1="536" y1="181" x2="554" y2="181" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arr-blue)"/>
  <rect x="558" y="166" width="52" height="30" rx="4" fill="#ffffff" stroke="#3b82f6" stroke-width="1.3"/>
  <text x="584" y="185" text-anchor="middle" font-size="11" font-weight="600" fill="#1e3a8a">MAC</text>
  <line x1="610" y1="181" x2="628" y2="181" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arr-blue)"/>
  <rect x="632" y="166" width="52" height="30" rx="4" fill="#ffffff" stroke="#3b82f6" stroke-width="1.3"/>
  <text x="658" y="185" text-anchor="middle" font-size="11" font-weight="600" fill="#1e3a8a">MAC</text>
  <line x1="584" y1="208" x2="584" y2="226" stroke="#2563eb" stroke-width="2" marker-end="url(#arr-blue)"/>
  <rect x="424" y="230" width="316" height="48" rx="5" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
  <text x="582" y="251" text-anchor="middle" font-size="12" font-weight="700" fill="#166534">VMEM / Accumulator ⇄ HBM（一括転送のみ）</text>
  <text x="582" y="269" text-anchor="middle" font-size="10.5" fill="#475569">中間積和は隣接 MAC 間で直接伝播し HBM 往復を排除</text>
</svg>
<figcaption style="font-size: 13px; color: #64748b; margin-top: 10px;">図1：従来型アーキテクチャ（ALU/SM ⇄ Register/Cache ⇄ HBM の反復アクセス）と、TPU の MXU（隣接 MAC［積和演算器］間で部分和を直接伝播するシストリックアレイ）の比較</figcaption>
</figure>

---

## 第2章 TPUハードウェアの世代別アーキテクチャ

2015年にデータセンター向けの推論専用チップとして登場したTPUは、世代を重ねるなかで学習対応や光インターコネクトを取り入れ、数千チップ規模のクラスタを構成する計算基盤へと発展してきた。ここでは初代TPU v1から第6世代のTrillium（TPU v6e）までの主な設計上の変化をたどる。

### 2.1 推論特化から学習対応へ（TPU v1〜v3）

#### TPU v1：データセンター推論の効率化

2015年に配備された初代TPUは、Google検索、翻訳、YouTubeなどのサービスで急増していた推論ワークロードをさばくために設計された。256×256の8ビット整数（INT8）乗算器からなるシストリックアレイを搭載し、当時のCPUやGPUと比べて15〜30倍の推論性能と30〜80倍の電力効率を達成している。一方で学習機能は持たず、ホストCPUからCISC命令で駆動されるコプロセッサという位置づけであり、メモリもDDR3で帯域幅は34 GB/sにとどまっていた。

#### TPU v2・v3：bfloat16と液冷Podの導入

2017年のTPU v2と2018年のTPU v3で、TPUはモデルの学習にも対応した。学習に必要な浮動小数点演算を扱うため、Googleは独自形式の「bfloat16（Brain Floating Point Format）」を導入した。FP32と同じ8ビットの指数部を残したまま仮数部を7ビットに詰めることで、学習に必要なダイナミックレンジを保ちつつメモリ帯域の消費を抑えている。

あわせて高帯域幅メモリ（HBM）と、チップ間を直接結ぶ独自インターコネクト（ICI）が採用され、256チップ以上を束ねる大規模クラスタ（Pod）構成を組めるようになった。続くTPU v3では発熱増大に対応するためデータセンターへの液冷システムが初めて導入され、1 Podあたりの演算性能は100ペタフロップスを超えた。

### 2.2 光回路スイッチと3Dトーラス網（TPU v4）

2021年に発表されたTPU v4では、チップ間ネットワークの仕組みが大きく刷新された。従来の電気的なパケットスイッチングに代わり、MEMSミラーを用いた光回路スイッチ（Optical Circuit Switches: OCS）を導入し、データセンター内の接続トポロジーを物理層のまま動的に組み替えられるようにしている。

各チップは6方向の隣接チップと直結して3次元トーラス構造を作る。障害が起きたチップをOCSで物理的に迂回できるほか、ワークロードに合わせてトポロジーを「Twisted Torus（ねじれたトーラス）」へ切り替えることで通信ホップ数とレイテンシを抑えている。1つのPodは4,096チップで構成され、最大1.1エクサフロップスの演算性能を持つ。同世代のNVIDIA A100 GPUと比べ、大規模モデル学習で1.2〜1.7倍の性能と高い電力効率を示した。

### 2.3 用途別の分化（TPU v5e / v5p）

第5世代でGoogleはTPUのラインナップを用途とコスト帯に応じて2モデルに分けた。

* TPU v5e（Efficient）：コスト効率と推論性能を重視したモデルである。v4比でドルあたりの推論スループットを2.5倍に高めており、Transformerや推薦システムの推論、中規模モデルの学習に向く。
* TPU v5p（Performance）：大規模基盤モデル（Foundation Models）の学習に特化した上位モデルである。v4比でFLOPSを2倍、メモリ帯域を3倍に引き上げ、最大8,960チップのPod構成に対応することで、数兆パラメータ規模の学習時間を短縮できる。

### 2.4 MXU拡張と帯域倍増（Trillium / TPU v6e）

2024年5月に発表され、同年12月に一般提供（GA）が始まった第6世代の「Trillium (v6e)」では、生成AIワークロードに向けて演算密度とメモリ帯域が大きく引き上げられた（続く第7世代 Ironwood については第8章で述べる）。

* マトリックス演算ユニット（MXU）のサイズを従来の128×128から256×256へ拡張し、クロックあたりの演算数を4倍に増やした。1チップあたりのピーク演算性能（bf16）は918 TFLOPSに達し、v5e比で約4.7倍となる。
* HBM容量を32GB、メモリ帯域幅を1,600 GB/sへそれぞれ倍増させ、チップ間接続（ICI）帯域も800 GB/sに引き上げて分散学習時の通信ボトルネックを緩和した。
* 埋め込み層（Embedding）やグラフニューラルネットワーク（GNN）などの疎行列演算を処理する専用コア「SparseCore」の第3世代を搭載し、TransformerのAttention計算に限らず検索や推薦系の処理も高速化している。

<figure style="margin: 26px 0; padding: 18px 16px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;">
<svg viewBox="-32 0 824 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="TPU v4・v5e・v5p・v6e (Trillium) の1チップあたりピーク演算性能とHBM帯域幅の比較" style="width: 100%; max-width: 760px; height: auto; display: block; margin: 0 auto; font-family: 'Open Sans', 'Hiragino Sans', 'Meiryo', sans-serif;">
  <rect x="175" y="10" width="14" height="14" rx="2" fill="#2563eb"/>
  <text x="195" y="22" font-size="12" font-weight="600" fill="#1e293b">ピーク演算性能 BF16 (TFLOPS / 左軸)</text>
  <rect x="435" y="10" width="14" height="14" rx="2" fill="#ea580c"/>
  <text x="455" y="22" font-size="12" font-weight="600" fill="#1e293b">HBM メモリ帯域幅 (GB/s / 右軸)</text>
  <line x1="70" y1="230" x2="690" y2="230" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="70" y1="185" x2="690" y2="185" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="70" y1="140" x2="690" y2="140" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="70" y1="95" x2="690" y2="95" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="70" y1="50" x2="690" y2="50" stroke="#e2e8f0" stroke-width="1"/>
  <text x="62" y="234" text-anchor="end" font-size="11" fill="#64748b">0</text>
  <text x="62" y="189" text-anchor="end" font-size="11" fill="#64748b">250</text>
  <text x="62" y="144" text-anchor="end" font-size="11" fill="#64748b">500</text>
  <text x="62" y="99" text-anchor="end" font-size="11" fill="#64748b">750</text>
  <text x="62" y="54" text-anchor="end" font-size="11" fill="#2563eb" font-weight="600">1,000 TFLOPS</text>
  <text x="698" y="234" text-anchor="start" font-size="11" fill="#64748b">0</text>
  <text x="698" y="189" text-anchor="start" font-size="11" fill="#64748b">750</text>
  <text x="698" y="144" text-anchor="start" font-size="11" fill="#64748b">1,500</text>
  <text x="698" y="99" text-anchor="start" font-size="11" fill="#64748b">2,250</text>
  <text x="698" y="54" text-anchor="start" font-size="11" fill="#ea580c" font-weight="600">3,000 GB/s</text>
  <rect x="112" y="180.5" width="42" height="49.5" rx="3" fill="#2563eb"/>
  <text x="133" y="174" text-anchor="middle" font-size="11" font-weight="600" fill="#1d4ed8">275</text>
  <rect x="160" y="158" width="42" height="72" rx="3" fill="#ea580c"/>
  <text x="181" y="152" text-anchor="middle" font-size="11" font-weight="600" fill="#c2410c">1,200</text>
  <text x="157" y="252" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">TPU v4</text>
  <rect x="262" y="194.5" width="42" height="35.5" rx="3" fill="#2563eb"/>
  <text x="283" y="188" text-anchor="middle" font-size="11" font-weight="600" fill="#1d4ed8">197</text>
  <rect x="310" y="181" width="42" height="49" rx="3" fill="#ea580c"/>
  <text x="331" y="175" text-anchor="middle" font-size="11" font-weight="600" fill="#c2410c">819</text>
  <text x="307" y="252" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">TPU v5e</text>
  <rect x="412" y="147.4" width="42" height="82.6" rx="3" fill="#2563eb"/>
  <text x="433" y="141" text-anchor="middle" font-size="11" font-weight="600" fill="#1d4ed8">459</text>
  <rect x="460" y="64.1" width="42" height="165.9" rx="3" fill="#ea580c"/>
  <text x="481" y="58" text-anchor="middle" font-size="11" font-weight="600" fill="#c2410c">2,765</text>
  <text x="457" y="252" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">TPU v5p</text>
  <rect x="562" y="64.8" width="42" height="165.2" rx="3" fill="#2563eb"/>
  <text x="583" y="58" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">918</text>
  <rect x="610" y="134" width="42" height="96" rx="3" fill="#ea580c"/>
  <text x="631" y="128" text-anchor="middle" font-size="11" font-weight="700" fill="#c2410c">1,600</text>
  <text x="607" y="252" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">TPU v6e (Trillium)</text>
</svg>
<figcaption style="font-size: 13px; color: #64748b; margin-top: 8px;">図2：TPU v4〜v6e（Trillium）の1チップあたりピーク演算性能（青：BF16 TFLOPS）および HBM メモリ帯域幅（橙：GB/s）の比較（Google Cloud 公開仕様に基づく）</figcaption>
</figure>

---

## 第3章 JAXとXLAコンパイラの設計

専用シリコンの性能を引き出すには、ハードウェアの特性に合わせて計算グラフ全体を最適化できるソフトウェアが要る。PyTorchやTensorFlowなどの命令型（Imperative）フレームワークは処理を動的に評価できて扱いやすい反面、数千チップにまたがる並列計算の全体最適化には限界が出やすい。これに対してGoogleが開発したJAXは、最初からコンパイラによる全体最適化を前提に設計されている。

### 3.1 XLAフロントエンドとしてのJAXと純粋関数

JAXという名前が「Just Another XLA」に由来するとも言われるとおり、その実体はXLA（Accelerated Linear Algebra）コンパイラのPythonフロントエンドである。PythonとNumPyに親しみやすい構文を保ちながら、裏側では計算全体を中間表現（HLO: High Level Optimizer IR）へ変換し、TPUやGPU向けのネイティブコードにまとめてコンパイルする。

この仕組みを成り立たせるため、JAXは関数型プログラミングのルールを求める。

* 純粋関数（Pure Functions）：関数は副作用（Side Effects）を持ってはならず、同じ入力に対しては常に同じ出力を返す。グローバル変数や外部の状態にも依存してはならない。
* イミュータビリティ（Immutability）：配列の中身を直接書き換える操作は禁止されている。`x[0] = 1` のようなインプレース更新は使えず、`x.at[0].set(1)` のように新しい配列を返す記法を使う。

開発者にとっては制約に見えるが、副作用がないと分かっているからこそ、XLAは安全に演算の順序を入れ替えたり、複数の演算を融合（Fusion）したり、複数デバイスへ並列展開したりできる。実行時にいつ外部状態が書き換わるか分からない動的グラフ（Define-by-Run）では、コンパイラ側でここまで踏み込んだ変換を行うのは難しい。

### 3.2 基本の関数変換：jit・grad・vmap

JAXの主要な機能はPython関数を受け取って別の関数へ変換する3つのAPIに集約されている。

1. `jax.jit`（Just-In-Time Compilation）：Python関数をXLAでコンパイルして高速化する。初回呼び出し時に計算をトレースしてグラフを構築・コンパイルし、2回目以降はキャッシュ済みの機械語を直接実行するため、Pythonインタプリタのオーバーヘッドがなくなる。
2. `jax.grad`（Automatic Differentiation）：関数の勾配（微分）を求める新しい関数を返す。`grad(grad(grad(f)))` のように重ねるだけで高階微分もそのまま記述でき、物理シミュレーションやメタ学習でも扱いやすい。
3. `jax.vmap`（Auto-Vectorization）：単一のデータに対して書いた関数を、バッチ処理用の関数へ自動変換する。Python側で `for` ループを回す必要がなくなり、XLAが並列処理向きのベクトル命令を生成する。

### 3.3 明示的な乱数状態（PRNGKey）の管理

PyTorchなどのフレームワークでは乱数生成器（RNG）の状態をグローバルに持つのが一般的だが、JAXでは純粋関数性を保つため、乱数の状態も引数として明示的に受け渡し、更新されたキーを返す必要がある。

```python
# PyTorch style (Implicit state)  
# torch.manual_seed(0)  
# r = torch.rand(1)

# JAX style (Explicit state)  
key = jax.random.PRNGKey(0)  
key, subkey = jax.random.split(key)  
r = jax.random.uniform(subkey)
```

記述量は少し増えるものの、どのデバイスで実行しても同じキーからは必ず同じ乱数が生成されるため、分散環境でも再現性（Reproducibility）を保ちやすく、デバッグや検証を進めやすい。

### 3.4 オペレータ・フュージョンによるメモリアクセス削減

XLAコンパイラの最適化のなかでも効果が大きいのが「オペレータ・フュージョン（Operator Fusion）」である。GPUやTPUでは、処理時間の多くが演算そのものではなくHBMとのデータ読み書きに費やされる。XLAは「行列積 → バイアス加算 → ReLU → 残差接続」といった連続する複数の演算を解析し、1つの融合カーネルにまとめる。

これにより途中結果をその都度HBMへ書き戻さず、レジスタやオンチップのキャッシュ上に置いたまま次の演算へ渡せる。いわゆる「メガカーネル（Megakernel）」の自動生成であり、手書きのCUDAカーネルに近いメモリアクセス効率をPythonコードから自動的に引き出せる点がJAX/XLAの強みとなっている。

---

## 第4章 JAX AI Stackの構成ライブラリ

JAX自体は数値計算と自動微分のライブラリであり、ニューラルネットワークの層やオプティマイザといった高レベルの機能は本体に含まれていない。実務のモデル開発では用途ごとに独立したライブラリを組み合わせる「JAX AI Stack」を使う。モノリシック（一枚岩）なフレームワークであるPyTorchやTensorFlowと違い、各コンポーネントが疎結合（Loosely Coupled）に作られているため、用途に合わせて自由に組み合わせられる。

### 4.1 Flax：状態分離型のモデル定義

FlaxはJAX上でニューラルネットワークを定義するための標準ライブラリであり、JAXの純粋関数モデルとオブジェクト指向的なモジュール記述をつなぐ役割を担う。

* Linen API：PyTorchの `nn.Module` に似た書き方ができるが、モジュール内部に状態を持たない。重みパラメータはモデル定義の外にある辞書（Dictionary）として管理し、推論や学習のたびに `apply` メソッドへ明示的に渡す。
* NNX：Pythonの参照セマンティクスを取り入れ、通常のクラスに近い感覚で状態を扱える新しいAPI「NNX」も導入が進んでいる。PyTorchに慣れた開発者でも移行しやすい設計が目指されている。

### 4.2 Optax：勾配変換の組み合わせによる最適化

Optaxは勾配降下法などの最適化アルゴリズムをまとめたライブラリである。オプティマイザを「勾配変換（Gradient Transformation）」の連鎖として定義できる点に特徴があり、たとえば「AdamW」は「Scale By Adam」と「Add Decayed Weights」といった基本ブロックの組み合わせとして表現される。オプティマイザ自体も状態を持たず、更新後のオプティマイザ状態（モーメンタムなど）と更新後のパラメータを返す純粋関数として実装されている。

### 4.3 OrbaxとGrain：チェックポイント管理とデータ供給

数千チップ・数兆パラメータ規模の学習では、計算以外のI/O周りを支えるOrbaxとGrainが重要になる。

* Orbax：大規模分散環境向けのチェックポイント管理ライブラリである。数千個のTPUチップに分散されたモデル状態を、非同期かつ高速にストレージへ保存・復元し、障害発生時の再開時間を短縮する。
* Grain：決定論的（Deterministic）な動作を保証するデータローディング・ライブラリである。PythonのGIL（Global Interpreter Lock）を避けてTPUの演算速度に見合う速さでデータを供給でき、学習を途中で止めて再開した際も、中断前とまったく同じデータ位置・シャッフル順序から再開できる。

### 4.4 スタックの階層構造

JAX AI Stackは上位のモデル実装から下位のハードウェア制御までを次の階層に分けている。

1. アプリケーション層：`MaxText`、`MaxDiffusion`、`Gemma`（学習済みモデルやリファレンス実装）
2. ライブラリ層：`Flax`（モデル定義）、`Optax`（最適化）、`Grain`（データ供給）
3. コア変換層：`JAX`（`jit`、`grad`、`vmap`、`shard_map`）
4. コンパイラ層：`XLA`、`StableHLO`
5. ハードウェア層：`Cloud TPU`、`GPU`

普段の開発ではライブラリ層を触れば足りるが、特定の処理でハードウェア限界に近い性能を出したい場合は、後述するPallasを使ってコンパイラ層の下へ降り、直接カーネルを書くこともできる。

---

## 第5章 SPMDによる大規模分散学習

TPUは数千チップを相互接続したPodとして動くときに本来の性能を発揮する。この大規模な並列処理を支えるのがSPMD（Single Program, Multiple Data）という仕組みである。

### 5.1 SPMDとデバイスメッシュ（jax.sharding）

Parameter Server方式などの従来の分散学習では、コントローラが各ワーカーへ個別の命令を送る複雑さがあった。これに対しSPMDでは、すべてのチップが「全く同じプログラム」を実行しつつ、それぞれ異なる「データ」を処理する。JAXでは巨大な配列（Tensor）を論理的なメッシュ（Device Mesh）のどの軸に沿って分割（Shard）するかを定義するだけでこれを実現できる。

たとえば8個のTPUコアを `(2, 4)` の2次元メッシュとして定義する場合は次のように書く。

```python
mesh = jax.make_mesh((2, 4), ('data', 'model'))
```

入力データのバッチ次元を `data` 軸に、モデルの隠れ層次元を `model` 軸に割り当てれば、データ並列（Data Parallelism）とモデル並列（Model Parallelism）を同じ枠組みのなかで同時に記述できる。

### 5.2 並列化の3つの記述レベル

JAXでは制御の細かさに応じて3つの並列化アプローチを使い分けられる。

1. 自動並列化（Auto-sharding）：シングルデバイス向けに書いたコードをそのまま渡し、計算グラフの解析からデータ分割・通信（All-Reduceなど）の挿入までをコンパイラ（XLA/GSPMD）に任せる方式である。手軽に試せる反面、意図しない分割が選ばれるリスクがある。
2. 明示的シャーディング（Explicit Sharding）：`NamedSharding` や `jax.jit(in_shardings=...)` を使い、データの分割方法を開発者が指定し、必要な通信挿入だけをJAXとXLAに任せる方式である。挙動の見通しと制御性のバランスが良く、現在の標準的な書き方となっている。
3. 手動並列化（`shard_map`）：各デバイスから見たローカルな処理と、`psum` や `all_gather` などの集団通信（Collective Ops）を明示的に書く方式である。`FlashAttention` のように通信と演算の重なりを細かく制御したいアルゴリズムで使われる。

### 5.3 pmapからshard_mapへの移行

初期のJAXでは並列化APIとして `pmap`（Parallel Map）が広く使われていた。配列の先頭次元をデバイス数にそのまま対応づける分かりやすいAPIだったが、多次元デバイスメッシュの特定の軸だけで通信したり、並列化をネストさせたりする用途には柔軟性が足りなかった。

そのため現在は `pmap` から `shard_map` への移行が推奨されている。`shard_map` ではデバイスメッシュの任意の軸を指定してマッピングと通信を書けるため、大規模LLMの学習でよく使われる Tensor Parallelism（テンソル並列）や Pipeline Parallelism（パイプライン並列）も簡潔に記述できる。

### 5.4 PartitionSpecによるFSDPの記述

大規模モデル学習で広く使われるFSDP（Fully Sharded Data Parallel）も、JAXのシャーディング機構でそのまま書ける。FSDPはモデルのパラメータ、勾配、オプティマイザ状態を全デバイスへ分散して保持し、各層の計算直前に必要なパラメータだけを `All-Gather` で集める手法である。JAXではパラメータの分割規則を `PartitionSpec` で指定しておけば、XLAコンパイラが前後の `All-Gather` や `Reduce-Scatter` を計算グラフへ自動挿入するため、手書きの通信コードは不要になる。

---

## 第6章 Pallasによるカスタムカーネル実装

多くのワークロードではXLAが生成する融合カーネルで十分な速度が出るが、FlashAttentionや特定の量子化カーネルのようにメモリアクセス手順まで突き詰めたい場面では、汎用コンパイラの自動最適化だけでは届かない場合がある。そうした箇所のために用意されているJAX拡張がPallasである。

### 6.1 Pythonによるメモリ階層とパイプラインの制御

Pallasを使うと、OpenAIのTriton言語に近いプログラミングモデルで、TPUやGPU向けのカスタムカーネルをPythonのまま直接記述できる。具体的には次のような低レベル制御を行える。

* TPUのHBM（グローバルメモリ）からVMEM（ベクターメモリ／SRAM）へのデータ転送を明示的に記述する。
* メモリからのデータ読み込みと演算をパイプライン化して重ね合わせ、転送レイテンシを隠蔽する。
* `BlockSpec` と `Grid` を使い、大きな行列を小さなブロック（タイル）へ分割してシストリックアレイ上で順番に処理するスケジュールを組む。

### 6.2 jax.jitとの組み合わせ

Pallasで書いたカーネルは通常のJAXコードとそのまま統合でき、`jax.jit` でコンパイルされた関数の中から `pallas_call` で呼び出せる。モデル全体の99%は高レベルなJAX/Flaxで書き、ボトルネックになる残り1%の処理だけをPallasで最適化する、といった段階的な使い分けができる。

---

## 第7章 実践ガイド：Colab TPUでの学習手順

ここからはGoogle ColabやKaggleなどの無料利用可能な環境を使い、実際にTPU上でJAX/Flaxのモデルを学習させる手順を確認する。2025年以降、Google Colab無料枠のTPUランタイムは従来のTPU v2が廃止され、TPU v5e（v2-8の代替となるv5e-1など）を利用できるようになっている。

### 7.1 環境とデバイスの確認

まずColabのランタイムのタイプを「TPU」に切り替え、JAXがTPUバックエンドを認識しているかを確認する。

```python
import jax
import jax.numpy as jnp

# TPUデバイスの確認
# Colabでは自動的にTPUバックエンドが構成されるが、念のため確認
try:
    print(f"JAX Backend: {jax.default_backend()}")
    print(f"Available devices: {jax.devices()}")
    print(f"Number of devices: {jax.device_count()}") # v5e-1は1、v5e-8等は8
except RuntimeError:
    print("TPU not found. Please check runtime settings.")
```

### 7.2 データローディング（TFDS）

JAX自体にはデータローダーが含まれないため、ここではTensorFlow Datasets（TFDS）でMNISTを読み込み、JAXが扱えるNumPy配列のイテレータへ変換する。

```python
import tensorflow_datasets as tfds  
import tensorflow as tf

def get_mnist_dataset(batch_size):  
    # TFDSでMNISTをロード  
    ds = tfds.load('mnist', split='train', as_supervised=True)  
    # 前処理：float32へのキャストと正規化  
    ds = ds.map(lambda x, y: (tf.cast(x, tf.float32) / 255.0, y))  
    # シャッフル、バッチ化、プリフェッチ  
    ds = ds.shuffle(1024).batch(batch_size).prefetch(tf.data.AUTOTUNE)  
    # tfds.as_numpyでJAX互換のイテレータに変換  
    return tfds.as_numpy(ds)
```

### 7.3 モデル定義（Flax Linen）

Flaxの `nn.Module` でシンプルなCNNを定義する。`@nn.compact` デコレータを付けると、`__call__` メソッドの中で層の定義と実行をまとめて書ける。

```python
from flax import linen as nn

class CNN(nn.Module):  
    @nn.compact  
    def __call__(self, x):  
        x = nn.Conv(features=32, kernel_size=(3, 3))(x)  
        x = nn.relu(x)  
        x = nn.avg_pool(x, window_shape=(2, 2), strides=(2, 2))  
        x = x.reshape((x.shape[0], -1)) # Flatten  
        x = nn.Dense(features=256)(x)  
        x = nn.relu(x)  
        x = nn.Dense(features=10)(x)  
        return x
```

### 7.4 学習状態の管理（TrainState）

モデルのパラメータとOptaxオプティマイザの状態は、Flaxの `TrainState` オブジェクトでまとめて管理する。

```python
import optax  
from flax.training import train_state

def create_train_state(rng, learning_rate):  
    model = CNN()  
    # パラメータの初期化（ダミー入力を使用）  
    params = model.init(rng, jnp.ones((1, 28, 28, 1)))['params']  
    # オプティマイザの定義  
    tx = optax.adam(learning_rate)  
    return train_state.TrainState.create(apply_fn=model.apply, params=params, tx=tx)
```

### 7.5 学習ステップの実装とデータ並列化

1ステップ分の学習関数 `train_step` を `jax.jit` でコンパイルし、`NamedSharding` を使って入力バッチをTPUデバイスへ分散配置する。

```python
from jax.sharding import Mesh, NamedSharding, PartitionSpec as P

# 1. デバイスメッシュの作成 (利用可能な全TPUデバイスをデータ並列軸 'batch' に割り当て)
mesh = Mesh(jax.devices(), axis_names=('batch',))

# 2. 学習ステップ関数の定義とJITコンパイル
@jax.jit
def train_step(state, batch):
    images, labels = batch

    def loss_fn(params):
        logits = state.apply_fn({'params': params}, images)
        loss = optax.softmax_cross_entropy_with_integer_labels(logits, labels).mean()
        return loss, logits

    # jax.value_and_grad: 損失と勾配を同時に計算
    (loss, logits), grads = jax.value_and_grad(loss_fn, has_aux=True)(state.params)

    # パラメータの更新
    state = state.apply_gradients(grads=grads)
    return state, loss

# 3. 学習ループ
def train_epoch(state, train_ds):
    # モデル状態は全デバイスにレプリケートし、入力データは images (4D) と labels (1D) それぞれで先頭の Batch 次元を分割
    state = jax.device_put(state, NamedSharding(mesh, P()))
    img_sharding = NamedSharding(mesh, P('batch', None, None, None))
    lbl_sharding = NamedSharding(mesh, P('batch'))

    for images, labels in train_ds:
        # デバイス数で割り切れない端数バッチをスキップ
        if images.shape[0] % jax.device_count() != 0:
            continue
        batch = (
            jax.device_put(images, img_sharding),
            jax.device_put(labels, lbl_sharding),
        )
        state, loss = train_step(state, batch)
        # ここでprint(loss)などを入れる場合、非同期実行に注意
    return state
```

`NamedSharding` と `jax.device_put` でテンソルの配置規則を指定するだけで、各TPUデバイスへのデータ分散とSPMD方式での並列学習が動き、通信コードを手で書く必要はない。

---

## 第8章 インフラ選定の観点と今後の動向

### 8.1 推論コストとメモリ帯域幅の効率

実運用でTPUとJAXのスタックを選ぶ大きな理由に、推論あたりのコスト効率とメモリ帯域幅の広さがある。TPU v5eはv4と比べて推論時のドルあたり性能が2.5倍に向上しており、大規模な推論サービスの運用コストを抑えやすい。

また、TPU v6e（Trillium）は1チップあたり1,600 GB/sのHBM帯域幅を備えている。大規模モデルの実行速度が計算速度（FLOPS）以上にメモリ転送速度に左右されるなか、広いメモリ帯域は「メモリの壁」を和らげ、ハードウェア稼働率（MFU: Model FLOPs Utilization）を高く維持するうえで重要になる。

### 8.2 OpenXLAによるポータビリティ

「TPUを使うとGoogle Cloudにロックインされるのではないか？」という懸念はよく挙がるが、ソフトウェア層のJAX自体は特定のハードウェアに依存しない。Googleはコンパイラ基盤をOpenXLAおよびStableHLOとしてオープンソース化しており、JAXで書いたコードはNVIDIA GPUやAMD GPU上でもそのまま高い効率で動作する。

公開情報でも、Apple（公開フレームワーク AXLearn）やxAI（Grok-1 公開実装）、Anthropicなどが研究開発においてJAXを活用していることが知られており、特定のクラウドやチップに閉じない移植性を裏付けている。第7世代のTPU v7（Ironwood）をはじめ、将来他社の新型チップが登場した際も、コンパイラ層が差分を吸収するため最小限の修正で移行できる。

### 8.3 第7世代TPU「Ironwood (v7)」と今後の展開

2025年4月のGoogle Cloud Next '25において、Googleは第7世代TPU「Ironwood (v7)」を発表した。Ironwoodは「推論の時代（Age of Inference）」を見据え、FP8演算へのネイティブ対応と超大規模推論ワークロード向けの最適化が図られている。ソフトウェア面でも、Pallasによるカスタムカーネル開発の広がりや量子コンピューティング（Quantum Computing）分野との連携など、JAXの適用領域を広げる試みが続いている。

<figure style="margin: 26px 0; padding: 16px 16px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
<div style="overflow-x: auto;">
<table style="width: 100%; border-collapse: collapse; font-size: 13.5px; line-height: 1.55; text-align: left; background: #ffffff; border: 1px solid #cbd5e1;">
  <thead>
    <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; color: #0f172a;">
      <th style="padding: 10px 12px; white-space: nowrap;">発表・導入時期</th>
      <th style="padding: 10px 12px; white-space: nowrap;">TPU ハードウェア世代</th>
      <th style="padding: 10px 12px;">主なアーキテクチャ革新</th>
      <th style="padding: 10px 12px;">対応ソフトウェア / JAX エコシステム進化</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 9px 12px; white-space: nowrap; font-weight: 600; color: #334155;">2015年</td>
      <td style="padding: 9px 12px; white-space: nowrap; font-weight: 600; color: #1e3a8a;">TPU v1</td>
      <td style="padding: 9px 12px; color: #334155;">推論特化設計・256×256 INT8 シストリックアレイ・DDR3 (34 GB/s)</td>
      <td style="padding: 9px 12px; color: #334155;">TensorFlow 公開（2015）・ホストCPUからのCISC命令駆動</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0; background: #fcfdff;">
      <td style="padding: 9px 12px; white-space: nowrap; font-weight: 600; color: #334155;">2017年</td>
      <td style="padding: 9px 12px; white-space: nowrap; font-weight: 600; color: #1e3a8a;">TPU v2</td>
      <td style="padding: 9px 12px; color: #334155;">学習対応・独自浮動小数点 <code>bfloat16</code> 導入・HBM ＆ ICI による Pod 構成</td>
      <td style="padding: 9px 12px; color: #334155;">XLA（Accelerated Linear Algebra）コンパイラ基盤の導入</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 9px 12px; white-space: nowrap; font-weight: 600; color: #334155;">2018年</td>
      <td style="padding: 9px 12px; white-space: nowrap; font-weight: 600; color: #1e3a8a;">TPU v3</td>
      <td style="padding: 9px 12px; color: #334155;">液冷システム初導入・MXU 倍増・Pod あたり 100 PFLOPS 超へ拡大</td>
      <td style="padding: 9px 12px; color: #334155;">JAX 公開（2018：<code>jit</code> / <code>grad</code> / <code>vmap</code> / <code>pmap</code> による関数変換）</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0; background: #fcfdff;">
      <td style="padding: 9px 12px; white-space: nowrap; font-weight: 600; color: #334155;">2021年</td>
      <td style="padding: 9px 12px; white-space: nowrap; font-weight: 600; color: #1e3a8a;">TPU v4</td>
      <td style="padding: 9px 12px; color: #334155;">光回路スイッチ（OCS）＆ 3D トーラス網・4,096チップ Pod（1.1 EFLOPS）</td>
      <td style="padding: 9px 12px; color: #334155;">Flax (Linen) / Optax 整備・GSPMD による大規模自動並列化</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 9px 12px; white-space: nowrap; font-weight: 600; color: #334155;">2023年</td>
      <td style="padding: 9px 12px; white-space: nowrap; font-weight: 600; color: #1e3a8a;">TPU v5e / v5p</td>
      <td style="padding: 9px 12px; color: #334155;">コスト・推論効率重視の v5e と大規模学習特化の v5p（最大8,960チップ）へ分化</td>
      <td style="padding: 9px 12px; color: #334155;">OpenXLA / StableHLO 設立・<code>jax.sharding</code> (<code>NamedSharding</code>)・Orbax / Grain</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0; background: #fcfdff;">
      <td style="padding: 9px 12px; white-space: nowrap; font-weight: 600; color: #334155;">2024年<br><span style="font-size: 11.5px; font-weight: 400; color: #64748b;">(5月発表・12月GA)</span></td>
      <td style="padding: 9px 12px; white-space: nowrap; font-weight: 600; color: #1d4ed8;">Trillium (TPU v6e)</td>
      <td style="padding: 9px 12px; color: #334155;">256×256 MXU（918 TFLOPS BF16）・HBM 32GB (1,600 GB/s)・第3世代 SparseCore</td>
      <td style="padding: 9px 12px; color: #334155;"><code>shard_map</code> 移行推奨・Pallas カスタムカーネル言語・JAX AI Stack 体系化</td>
    </tr>
    <tr>
      <td style="padding: 9px 12px; white-space: nowrap; font-weight: 600; color: #334155;">2025年<br><span style="font-size: 11.5px; font-weight: 400; color: #64748b;">(4月 Next '25 発表)</span></td>
      <td style="padding: 9px 12px; white-space: nowrap; font-weight: 700; color: #1d4ed8;">Ironwood (TPU v7)</td>
      <td style="padding: 9px 12px; color: #334155;">「推論の時代」を見据えた推論特化設計・ネイティブ FP8 対応・超大規模スケーリング</td>
      <td style="padding: 9px 12px; color: #334155;">Flax NNX 普及・Pallas 推論カーネル最適化・マルチホスト推論基盤の高度化</td>
    </tr>
  </tbody>
</table>
</div>
<figcaption style="font-size: 13px; color: #64748b; margin-top: 10px; text-align: center;">表1：Google TPU 公式世代年表（v1〜v7）と JAX / XLA ソフトウェアスタックの進化</figcaption>
</figure>

### まとめ

シストリックアレイと光インターコネクトによってデータ移動のボトルネックを抑えるTPUと、純粋関数をXLAで融合カーネルやSPMD通信へコンパイルするJAXは、ハードウェアとソフトウェアを一体で最適化する設計に基づいている。OpenXLAを介したGPU環境との互換性も整っており、大規模な学習・推論基盤を設計するうえで有力な選択肢となるだろう。

#### Works cited

[1] TPU architecture | Google Cloud Documentation, accessed January 13, 2026, [https://docs.cloud.google.com/tpu/docs/system-architecture-tpu-vm](https://docs.cloud.google.com/tpu/docs/system-architecture-tpu-vm)

[2] Why the JAX AI Stack is the New Standard for Megakernel Infrastructure - Rajat Pandit, accessed January 13, 2026, [https://rajatpandit.com/business-case-for-jax/](https://rajatpandit.com/business-case-for-jax/)

[3] Google TPU Architecture: 7 Generations Explained | Introl Blog, accessed January 13, 2026, [https://introl.com/blog/google-tpu-architecture-complete-guide-7-generations](https://introl.com/blog/google-tpu-architecture-complete-guide-7-generations)

[4] Tensor Processing Unit - Wikipedia, accessed January 13, 2026, [https://en.wikipedia.org/wiki/Tensor_Processing_Unit](https://en.wikipedia.org/wiki/Tensor_Processing_Unit)

[5] Google TPUs Explained: Architecture & Performance for Gemini 3 | IntuitionLabs, accessed January 13, 2026, [https://intuitionlabs.ai/articles/google-tpu-architecture-gemini-3](https://intuitionlabs.ai/articles/google-tpu-architecture-gemini-3)

[6] How to Think About TPUs | How To Scale Your Model - GitHub Pages, accessed January 13, 2026, [https://jax-ml.github.io/scaling-book/tpus/](https://jax-ml.github.io/scaling-book/tpus/)

[7] GPU and TPU Comparative Analysis Report | by ByteBridge - Medium, accessed January 13, 2026, [https://bytebridge.medium.com/gpu-and-tpu-comparative-analysis-report-a5268e4f0d2a](https://bytebridge.medium.com/gpu-and-tpu-comparative-analysis-report-a5268e4f0d2a)

[8] Tensor Processing Units (TPUs) - Google Cloud, accessed January 13, 2026, [https://cloud.google.com/tpu](https://cloud.google.com/tpu)

[9] TPU v5e - Google Cloud Documentation, accessed January 13, 2026, [https://docs.cloud.google.com/tpu/docs/v5e](https://docs.cloud.google.com/tpu/docs/v5e)

[10] TPU v6e - Google Cloud Documentation, accessed January 13, 2026, [https://docs.cloud.google.com/tpu/docs/v6e](https://docs.cloud.google.com/tpu/docs/v6e)

[11] Google Trillium TPU (v6e) introduction : r/LocalLLaMA - Reddit, accessed January 13, 2026, [https://www.reddit.com/r/LocalLLaMA/comments/1gnru7c/google_trillium_tpu_v6e_introduction/](https://www.reddit.com/r/LocalLLaMA/comments/1gnru7c/google_trillium_tpu_v6e_introduction/)

[12] JAX vs PyTorch: Comparing Two Deep Learning Frameworks - New Horizons, accessed January 13, 2026, [https://www.newhorizons.com/resources/blog/jax-vs-pytorch-comparing-two-deep-learning-frameworks](https://www.newhorizons.com/resources/blog/jax-vs-pytorch-comparing-two-deep-learning-frameworks)

[13] A guide to JAX for PyTorch developers | Google Cloud Blog, accessed January 13, 2026, [https://cloud.google.com/blog/products/ai-machine-learning/guide-to-jax-for-pytorch-developers](https://cloud.google.com/blog/products/ai-machine-learning/guide-to-jax-for-pytorch-developers)

[14] Deep Learning in Practice: A Technical Comparison of PyTorch and JAX - Medium, accessed January 13, 2026, [https://medium.com/@nijesh-kanjinghat/deep-learning-in-practice-a-technical-comparison-of-pytorch-and-jax-6458a115dcde](https://medium.com/@nijesh-kanjinghat/deep-learning-in-practice-a-technical-comparison-of-pytorch-and-jax-6458a115dcde)

[15] jax-ml/jax: Composable transformations of Python+NumPy programs: differentiate, vectorize, JIT to GPU/TPU, and more - GitHub, accessed January 13, 2026, [https://github.com/jax-ml/jax](https://github.com/jax-ml/jax)

[16] Part 1: JAX neural net basics - JAX AI Stack, accessed January 13, 2026, [https://docs.jaxstack.ai/en/latest/neural_net_basics.html](https://docs.jaxstack.ai/en/latest/neural_net_basics.html)

[17] Building production AI on Google Cloud TPUs with JAX, accessed January 13, 2026, [https://developers.googleblog.com/building-production-ai-on-google-cloud-tpus-with-jax/](https://developers.googleblog.com/building-production-ai-on-google-cloud-tpus-with-jax/)

[18] Building production AI on Cloud TPUs with JAX, accessed January 13, 2026, [https://docs.cloud.google.com/tpu/docs/jax-ai-stack](https://docs.cloud.google.com/tpu/docs/jax-ai-stack)

[19] Writing a Training Loop in JAX and Flax - Wandb, accessed January 13, 2026, [https://wandb.ai/jax-series/simple-training-loop/reports/Writing-a-Training-Loop-in-JAX-and-Flax--VmlldzoyMzA4ODEy](https://wandb.ai/jax-series/simple-training-loop/reports/Writing-a-Training-Loop-in-JAX-and-Flax--VmlldzoyMzA4ODEy)

[20] Image Classification with JAX, Flax, and Optax : A Step-by-Step Guide - Analytics Vidhya, accessed January 13, 2026, [https://www.analyticsvidhya.com/blog/2024/11/image-classification-with-jax-flax-and-optax/](https://www.analyticsvidhya.com/blog/2024/11/image-classification-with-jax-flax-and-optax/)

[21] MNIST Tutorial - Flax - Read the Docs, accessed January 13, 2026, [https://flax.readthedocs.io/en/v0.8.2/experimental/nnx/mnist_tutorial.html](https://flax.readthedocs.io/en/v0.8.2/experimental/nnx/mnist_tutorial.html)

[22] Fine-tuning RecurrentGemma using JAX and Flax | Google AI for Developers, accessed January 13, 2026, [https://ai.google.dev/gemma/docs/recurrentgemma/recurrentgemma_jax_finetune](https://ai.google.dev/gemma/docs/recurrentgemma/recurrentgemma_jax_finetune)

[23] SPMD Parallelism with jax.shard_map and the Evolution Beyond pmap | CodeSignal Learn, accessed January 13, 2026, [https://codesignal.com/learn/courses/advanced-jax-transformations-for-speed-scale/lessons/parallel-universes-spmd-parallelism-with-jaxshardmap-and-the-evolution-beyond-pmap](https://codesignal.com/learn/courses/advanced-jax-transformations-for-speed-scale/lessons/parallel-universes-spmd-parallelism-with-jaxshardmap-and-the-evolution-beyond-pmap)

[24] Programming TPUs in JAX | How To Scale Your Model - GitHub Pages, accessed January 13, 2026, [https://jax-ml.github.io/scaling-book/jax-stuff/](https://jax-ml.github.io/scaling-book/jax-stuff/)

[25] What's the difference between xmap, shmap, pmap (pjit?) and which should I use? · jax-ml jax · Discussion #20312 - GitHub, accessed January 13, 2026, [https://github.com/jax-ml/jax/discussions/20312](https://github.com/jax-ml/jax/discussions/20312)

[26] jax.pmap - JAX documentation, accessed January 13, 2026, [https://docs.jax.dev/en/latest/_autosummary/jax.pmap.html](https://docs.jax.dev/en/latest/_autosummary/jax.pmap.html)

[27] Manual parallelism with shard_map - JAX documentation, accessed January 13, 2026, [https://docs.jax.dev/en/latest/notebooks/shard_map.html](https://docs.jax.dev/en/latest/notebooks/shard_map.html)

[28] The Training Cookbook — JAX documentation, accessed January 13, 2026, [https://docs.jax.dev/en/latest/the-training-cookbook.html](https://docs.jax.dev/en/latest/the-training-cookbook.html)

[29] Pallas Design - JAX documentation, accessed January 13, 2026, [https://docs.jax.dev/en/latest/pallas/design/design.html](https://docs.jax.dev/en/latest/pallas/design/design.html)

[30] Matrix Multiplication - JAX documentation, accessed January 13, 2026, [https://docs.jax.dev/en/latest/pallas/tpu/matmul.html](https://docs.jax.dev/en/latest/pallas/tpu/matmul.html)

[31] Colab - Google for Developers, accessed January 13, 2026, [https://developers.google.com/colab/release-notes](https://developers.google.com/colab/release-notes)

[32] Issues · googlecolab/colabtools - GitHub, accessed January 13, 2026, [https://github.com/googlecolab/colabtools/issues](https://github.com/googlecolab/colabtools/issues)

[33] Train a GPT2 model with JAX on TPU for free - Google Developers ..., accessed January 13, 2026, [https://developers.googleblog.com/train-gpt2-model-with-jax-on-tpu/](https://developers.googleblog.com/train-gpt2-model-with-jax-on-tpu/)

[34] MNIST tutorial - Flax - Read the Docs, accessed January 13, 2026, [https://flax.readthedocs.io/en/stable/mnist_tutorial.html](https://flax.readthedocs.io/en/stable/mnist_tutorial.html)
