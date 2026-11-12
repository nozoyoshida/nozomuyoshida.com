---
title: "Google TPUとJAX：次世代AI開発の標準スタックに関する包括的研究レポート"
date: "2026-01-14"
excerpt: "シリコンの限界とAI特化型計算の必然性、TPUアーキテクチャの進化、そしてJAXのコンパイラ駆動型ソフトウェア哲学についての詳細な技術レポート。"
category: "Research"
pw: 0.9
so: 1.0
---

## **第1章 序論：シリコンの限界とAI特化型計算の必然性**

人工知能（AI）、特に大規模言語モデル（LLM）と生成AIの急速な発展は、従来の計算機アーキテクチャに突きつけられた「挑戦状」と言える。ムーアの法則の鈍化が叫ばれる一方で、AIモデルのパラメータ数は指数関数的に増加し続けており、計算能力の供給と需要の間には巨大な乖離が生じている。このギャップを埋めるために、汎用的な計算処理装置（CPU）や、グラフィックス処理から転用されたGPU（Graphics Processing Unit）を超えた、AIワークロードに完全に特化したシリコンの必要性が叫ばれてきた。Googleが開発したTPU（Tensor Processing Unit）と、それを制御するためのコンパイラベースのフレームワークJAXは、この歴史的な要請に対する一つの回答であり、今後のAI開発における事実上の「標準スタック」としての地位を確立しつつある。

本レポートは、TPUハードウェアのアーキテクチャ的優位性、JAXの数理的・実装的哲学、そしてこれらが融合することで実現される大規模分散学習のメカニズムについて、包括的かつ詳細に分析を行うものである。

### **1.1 フォン・ノイマン・ボトルネックの終焉**

現代のAI計算、特にディープラーニングのトレーニングと推論における最大の障壁は、演算速度そのものではなく、データの移動にある。従来のCPUやGPUは「フォン・ノイマン型アーキテクチャ」に基づいて設計されており、演算装置（ALU）とメモリが分離されている。計算を行うたびに、データはメモリからレジスタへ読み込まれ、演算され、結果が書き戻される。このプロセスは、複雑な分岐予測やキャッシュ管理を必要とする汎用アプリケーションには適しているが、単純な行列積和演算（Matrix Multiply-Accumulate）を数千億回繰り返すAIワークロードにおいては、甚大な非効率を生む。

いわゆる「メモリの壁（Memory Wall）」問題である。演算器の速度向上に対し、メモリ帯域幅の向上は追いついておらず、プロセッサはデータの到着を待つアイドル状態（ストール）に陥りやすい。AIモデルが大規模化するにつれ、このデータ移動にかかるエネルギーとレイテンシがシステム全体のボトルネックとなり、スケーリングの限界を規定する要因となっている。

### **1.2 Googleの回答：ドメイン特化型アーキテクチャ（DSA）**

Googleはこの問題に対し、汎用性を犠牲にして特定のドメイン（ここでは行列演算）に特化する「ドメイン特化型アーキテクチャ（Domain Specific Architecture: DSA）」のアプローチを採用した。TPUは、ニューラルネットワークの計算の核心である行列演算において、メモリ配管（Data Plumbing）のオーバーヘッドを極限まで排除するように設計されている。

その中心となる技術が「シストリックアレイ（Systolic Array）」である。これは、心臓が血液を送り出す「収縮（Systole）」の動作にちなんで名付けられたアーキテクチャであり、データがプロセッサ内を波のように伝播する仕組みを指す。この設計思想の違いこそが、TPUがGPUと比較して高い電力効率（Performance per Watt）を実現する根本的な理由である。

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

## **第2章 TPUハードウェア・アーキテクチャの進化と詳細分析**

TPUは2015年の登場以来、急速な進化を遂げてきた。初期の推論専用チップから、現在では世界最大級のスーパーコンピュータを構成する基盤技術へと変貌している。本章では、各世代の技術的特異点と、最新のTrillium（TPU v6e）に至るまでの系譜を詳細に分析する。

### **2.1 黎明期：推論特化から学習への跳躍 (v1 - v3)**

#### **TPU v1: 推論の効率化への挑戦**

2015年に配備された初代TPUは、Googleのデータセンターにおける推論ワークロード（Google検索、翻訳、YouTubeなど）の急増に対処するために設計された。

* **アーキテクチャ:** 256×256の8ビット整数（INT8）乗算器からなるシストリックアレイを搭載し、当時のCPUやGPUと比較して15〜30倍の推論性能と、30〜80倍の電力効率を実現した。  
* **制約:** トレーニング機能を持たず、ホストCPUからのCISC命令によって駆動されるコプロセッサ的な位置づけであった。メモリにはDDR3を使用し、帯域幅は34 GB/sに留まっていた。

#### **TPU v2 & v3: 学習への対応と液冷システムの導入**

2017年のTPU v2、2018年のv3の登場は、TPUを「推論チップ」から「学習プラットフォーム」へと変貌させた。

* **浮動小数点演算の導入:** トレーニングに不可欠な浮動小数点演算をサポートするため、Googleは「bfloat16（Brain Floating Point Format）」という独自のフォーマットを採用した。これは FP32 と同じ 8 ビットの指数部を持ちながら、仮数部を 7 ビットに削減することで、メモリ帯域を節約しつつ、学習に必要なダイナミックレンジを確保するものである。  
* **HBMとインターコネクト:** 高帯域幅メモリ（HBM）が採用され、チップ間を直接接続する独自のインターコネクト（ICI）により、256チップ以上の大規模クラスタ（Pod）構成が可能となった。TPU v3では、チップの発熱に対処するために液冷システムが導入され、Podあたりの性能は100ペタフロップスを超えた。

### **2.2 成熟期：光回路スイッチングとスケーラビリティの革新 (v4)**

2021年に発表されたTPU v4は、インターコネクト技術におけるパラダイムシフトをもたらした。

* **光回路スイッチ (Optical Circuit Switches: OCS):** 従来の電気的なパケットスイッチングに代わり、MEMSミラーを用いた光回路スイッチが導入された。これにより、データセンター内の接続トポロジーを物理層で動的に再構成することが可能となった。  
* **3Dトーラス・トポロジー:** チップ同士は6方向の隣接チップと直結され、3次元トーラス構造を形成する。OCSにより、障害が発生したチップを物理的にバイパスしたり、ワークロードに応じてトポロジーを「Twisted Torus（ねじれたトーラス）」に変更することで、通信のホップ数を削減し、レイテンシを最小化している。  
* **性能:** 1つのPodは4,096チップで構成され、最大1.1エクサフロップスの演算性能を提供する。これは、同世代のNVIDIA A100 GPUと比較して、大規模モデルの学習において1.2〜1.7倍の性能と、大幅な電力効率の向上を実現している。

### **2.3 分化と特化：v5eとv5p**

第5世代において、GoogleはTPUのラインナップを用途別に分化させる戦略をとった。

* **TPU v5e (Efficient):** コスト効率と推論性能を重視したモデル。v4と比較して、ドルあたりの推論スループットは2.5倍に向上している。Transformerモデルや推奨システムの推論、および中規模の学習に適しており、1チップあたりのコストを抑えつつ高いスケーラビリティを提供する。  
* **TPU v5p (Performance):** 大規模基盤モデル（Foundation Models）の学習に特化したハイエンドモデル。v4と比較してFLOPSは2倍、メモリ帯域は3倍に強化され、最大8,960チップのPod構成をサポートする。これにより、数兆パラメータ級のモデル学習時間を大幅に短縮可能とした。

### **2.4 Trillium (v6e) における演算密度と帯域の飛躍**

2024年5月に発表され、同年12月に一般提供（GA）が開始された第6世代「Trillium (v6e)」は、生成AI時代の要求に応えるため演算密度とメモリ帯域を大幅に引き上げた主力世代である（続く第7世代 Ironwood については第8章で後述する）。

* **マトリックス演算ユニット (MXU) の巨大化:** 特筆すべきは、MXUのサイズが従来の128×128から256×256へと拡張された点である。これにより、クロックあたりの演算数は4倍に増加し、ピーク演算性能（bf16）は1チップあたり918 TFLOPSに達した。これはv5eの約4.7倍の性能向上である。  
* **メモリと帯域の倍増:** HBM容量は32GB、帯域幅は1,600 GB/sへと倍増した。また、チップ間接続（ICI）帯域も800 GB/sに強化され、大規模分散学習における通信ボトルネックをさらに押し広げている。  
* **SparseCoreの進化:** 埋め込み層（Embedding）やGNN（グラフニューラルネットワーク）などの疎行列演算を加速する専用コア「SparseCore」の第3世代が搭載されている。これにより、TransformerのAttention計算だけでなく、検索やレコメンデーションといった広範なワークロードの高速化を実現している。

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

## **第3章 JAX：コンパイラ駆動型ソフトウェアの哲学**

ハードウェアがいかに高性能であっても、それを制御するソフトウェアが非効率であれば意味がない。PyTorchやTensorFlowといった従来のフレームワークが「命令型（Imperative）」であり、柔軟性が高い反面、超大規模な並列計算における最適化に限界を抱えていたのに対し、Googleは「コンパイラファースト」のアプローチをとる**JAX**を開発した。

### **3.1 「Just Another XLA」としてのJAX**

JAXという名称は「Just Another XLA」に由来するとも言われる通り、その本質は**XLA（Accelerated Linear Algebra）**コンパイラへのフロントエンドである。PythonとNumPyに親しみやすい構文を提供しつつ、その裏側では計算全体を中間表現（HLO: High Level Optimizer IR）に変換し、TPUやGPUのネイティブコードへとコンパイルする。

#### **純粋関数型プログラミングの強制**

JAXの設計思想の核にあるのは、厳格な関数型プログラミング（Functional Programming）の採用である。

* **純粋関数 (Pure Functions):** 関数は副作用（Side Effects）を持ってはならない。同じ入力に対しては常に同じ出力を返し、グローバル変数や外部の状態に依存してはならない。  
* **イミュータビリティ (Immutability):** 配列は変更不可能である。`x[0] = 1` のようなインプレース更新は禁止されており、`x.at[0].set(1)` のように新しい配列を生成する記法が求められる。

これらは一見、開発者に対する制約のように思えるが、実はコンパイラに対する「保証」である。副作用がないことが保証されているため、XLAは計算グラフの順序を自由に入れ替え、融合（Fusion）し、並列化することができる。PyTorchのような動的グラフ（Define-by-Run）では、ユーザーがいつ副作用を起こすか予測できないため、こうした大胆な最適化は困難である。

### **3.2 JAXの「3つの魔法」：jit, grad, vmap**

JAXの機能は、Python関数を別の関数に変換する（Transform）3つの主要なAPIに集約される。

1. `jax.jit` (Just-In-Time Compilation):  
   Python関数をXLAでコンパイルし、高速化する。初回の呼び出し時にトレーシングが行われ、計算グラフが構築・コンパイルされる。2回目以降はキャッシュされた機械語が実行されるため、Pythonのオーバーヘッドが完全に排除される。  
2. `jax.grad` (Automatic Differentiation):  
   関数の勾配（微分）を計算する新しい関数を生成する。JAXの自動微分は非常に柔軟で、`grad(grad(grad(f)))` のように高階微分を容易に記述できる。これは物理シミュレーションやメタ学習において強力な武器となる。  
3. `jax.vmap` (Auto-Vectorization):  
   単一のデータポイント用に書かれた関数を、自動的にバッチ処理（ベクトル化）用に変換する。forループを使ってバッチ処理を書く必要がなくなり、XLAが並列処理に最適なベクトル命令を生成する。

### **3.3 乱数生成のパラダイムシフト**

従来のフレームワーク（PyTorchなど）では、乱数生成器（RNG）はグローバルな状態として管理される。しかし、JAXでは純粋関数性を維持するため、RNGの状態も明示的に引数として受け渡し、更新されたキーを返す必要がある。

```python
# PyTorch style (Implicit state)  
# torch.manual_seed(0)  
# r = torch.rand(1)

# JAX style (Explicit state)  
key = jax.random.PRNGKey(0)  
key, subkey = jax.random.split(key)  
r = jax.random.uniform(subkey)
```

この明示的な状態管理は、記述量を増やす一方で、分散環境における「再現性（Reproducibility）」を完全に制御することを可能にする。どのデバイスで実行しても、同じキーからは必ず同じ乱数が生成されるため、デバッグや検証が極めて容易になる。

### **3.4 XLAによる最適化：オペレータ・フュージョンとメガカーネル**

XLAコンパイラの最大の功績は「オペレータ・フュージョン（Operator Fusion）」である。GPUやTPUにおいて、処理時間の多くは演算そのものではなく、データをHBMから読み書きする時間に費やされる。XLAは、複数の演算（例：行列積 → バイアス加算 → ReLU → 残差接続）を解析し、それらを一つのカーネル（融合カーネル）に統合する。

これにより、中間結果をメモリに書き戻すことなく、レジスタやキャッシュ上で連続して処理を行うことが可能になる。いわゆる「メガカーネル（Megakernel）」の自動生成である。手書きのCUDAカーネルによる最適化に近い性能を、Pythonコードから自動的に得られる点が、JAX/XLAスタックの最大の競争力と言える。

---

## **第4章 JAX AIスタック：モジュラーなエコシステムの全貌**

JAX自体は「数値計算ライブラリ」であり、ニューラルネットワークの層やオプティマイザといった高レベルの機能を持たない。これらを補完し、完全なAI開発環境として機能させるのが、Googleが提唱する「JAX AI Stack」である。このスタックは、モノリシック（一枚岩）なフレームワークであるPyTorchやTensorFlowとは異なり、各コンポーネントが疎結合（Loosely Coupled）に設計されており、必要に応じて自由に組み合わせることができる。

### **4.1 Flax: 状態管理の分離とモデル構築**

**Flax**は、JAX上でニューラルネットワークを構築するための標準的なライブラリである。JAXの純粋関数性と、開発者が慣れ親しんだオブジェクト指向プログラミングのギャップを埋める役割を果たす。

* **Linen API:** PyTorchの `nn.Module` に似た記法を提供するが、内部的には状態を持たない。モデルのパラメータ（重み）はモデル定義の外にある辞書（Dictionary）として管理され、推論や学習のたびに `apply` メソッドに明示的に渡される。  
* **NNX (Experimental):** より直感的な記述を可能にするため、Pythonの参照セマンティクスを活用した新しいAPI「NNX」も導入されつつある。これにより、PyTorchユーザーの移行障壁を大幅に下げることが期待されている。

### **4.2 Optax: コンポーザブルな最適化**

**Optax**は、勾配降下法などの最適化アルゴリズムを提供するライブラリである。

* **コンポーザビリティ:** Optaxの最大の特徴は、オプティマイザを「勾配変換（Gradient Transformation）」の連鎖として定義できる点である。例えば、「AdamW」は「Scale By Adam」と「Add Decayed Weights」といった基本ブロックの組み合わせとして表現される。  
* **ステートレス設計:** オプティマイザ自体も状態を持たず、更新されたオプティマイザ状態（モーメンタムなど）と更新されたパラメータを返す純粋関数として実装されている。

### **4.3 インフラストラクチャ：OrbaxとGrain**

数兆パラメータ規模のモデル学習を支えるのが、**Orbax**と**Grain**である。

* **Orbax:** 超大規模なチェックポイント・ライブラリ。数千のTPUチップに分散されたモデルの状態を、非同期かつ高速にストレージへ保存・復元する機能を提供する。これにより、障害発生時のリカバリ時間を最小化する。  
* **Grain:** 大規模かつ決定論的（Deterministic）なデータローディング・ライブラリ。PythonのGIL（Global Interpreter Lock）を回避し、TPUの計算速度に追いつく高速なデータ供給を実現する。また、学習を中断・再開した際にも、データセットの全く同じ位置から、同じシャッフル順序で再開することを保証する。

### **4.4 スタックの階層構造と「抽象化の連続体」**

JAX AIスタックは、高レベルの抽象化から低レベルの制御までをシームレスにつなぐ「抽象化の連続体（Continuum of Abstraction）」を提供している。

1. **アプリケーション層:** `MaxText`, `MaxDiffusion`, `Gemma` (学習済みモデルやリファレンス実装)  
2. **ライブラリ層:** `Flax` (モデル定義), `Optax` (最適化), `Grain` (データ)  
3. **コア変換層:** `JAX` (`jit`, `grad`, `vmap`, `shard_map`)  
4. **コンパイラ層:** `XLA`, `StableHLO`  
5. **ハードウェア層:** `Cloud TPU`, `GPU`

この構造において、開発者は通常ライブラリ層を利用するが、パフォーマンスの限界を追求する場合は、コンパイラ層をバイパスして直接ハードウェアを制御する「Pallas」のようなツール（後述）を利用することも可能である。

---

## **第5章 スケーリングの技術：SPMDと分散学習のパラダイム**

TPUの真価は、単一チップではなく、数千チップが相互接続されたPodとして動作する際に発揮される。この大規模並列処理を支えるのが、**SPMD（Single Program, Multiple Data）**というパラダイムである。

### **5.1 SPMDとjax.sharding**

従来の分散学習（Parameter Server方式など）では、コントローラが各ワーカーに個別の命令を送る複雑さがあった。対してSPMDでは、全てのチップが「全く同じプログラム」を実行するが、処理する「データ」が異なる。JAXにおいてこれは、巨大な配列（Tensor）を論理的なメッシュ（Device Mesh）上にどう分割（Shard）するかを定義するだけで実現できる。

#### **仮想デバイスメッシュの概念**

例えば、8個のTPUコアを `(2, 4)` の2次元メッシュとして定義する。

```python
mesh = jax.make_mesh((2, 4), ('data', 'model'))
```

このメッシュに対し、データのバッチ次元を `data` 軸に、モデルの隠れ層次元を `model` 軸に割り当てることで、データ並列（Data Parallelism）とモデル並列（Model Parallelism）を同時に、かつ直感的に記述できる。

### **5.2 自動並列化 vs 明示的シャーディング**

JAXは並列化において3つのアプローチを提供する。

1. 自動並列化 (Auto-sharding):  
   コンパイラ（XLA/GSPMD）に全てを委ねる。開発者はシングルデバイス用のコードを書き、コンパイラが計算グラフを解析して、最適なデータの分割と通信（All-Reduceなど）を自動挿入する。手軽だが、意図しない分割が行われるリスクがある。  
2. 明示的シャーディング (Explicit Sharding):  
   `NamedSharding` や `jax.jit(in_shardings=...)` を用いて、ユーザーがデータの分割方法を型システムレベルで指定する。JAXは指定されたシャーディングを満たすように通信を挿入する。これが現在の主流かつ推奨される方法であり、予測可能性と制御性のバランスが取れている。  
3. 手動並列化 (`shard_map`):  
   `pmap`（後述）の進化形。デバイスごとのローカルな視点でコードを書き、明示的に通信集団演算（Collective Ops: `psum`, `all_gather` など）を記述する。`FlashAttention` のような高度なアルゴリズムを実装する際に使用される。

### **5.3 pmapからshard_mapへの進化**

JAXの初期には、並列化APIとして `pmap` (Parallel Map) が使われていた。これは配列の先頭次元をデバイス数にマッピングするシンプルなものであったが、柔軟性に欠けていた（例えば、デバイスメッシュの特定の軸だけでの通信や、ネストした並列化が困難だった）。

現在、Googleは `pmap` から**`shard_map`** への移行を推奨している。`shard_map` は、デバイスメッシュの任意の軸に対してマッピングが可能であり、より詳細な通信制御が可能である。これにより、最先端のLLM学習で必須となる Tensor Parallelism（テンソル並列）や Pipeline Parallelism（パイプライン並列）といった複雑な戦略も、JAX上で簡潔に記述できるようになった。

### **5.4 FSDP（Fully Sharded Data Parallel）の実装**

大規模モデル学習における事実上の標準技術であるFSDPも、JAXではエレガントに実装できる。FSDPは、モデルのパラメータ、勾配、オプティマイザ状態を全てのデバイスに分散させ、計算が必要な瞬間だけ通信を行ってパラメータを集める（All-Gather）手法である。  
JAXでは、パラメータのシャーディング指定を `PartitionSpec` で記述するだけで、XLAコンパイラが自動的に必要な `All-Gather` と `Reduce-Scatter` を計算グラフに挿入する。ユーザーは複雑な通信コードを書く必要がない。

---

## **第6章 Pallas：XLAの限界を超える「抜け道」**

通常、XLAコンパイラは非常に効率的なコードを生成するが、極限のパフォーマンスが求められる特定のカーネル（例えば、TransformerのAttention機構におけるFlashAttentionや、特定の量子化カーネル）では、汎用コンパイラの最適化では不十分な場合がある。ここで登場するのが**Pallas**である。

### **6.1 Pythonで書くカーネル言語**

Pallasは、JAXの拡張機能であり、TPUやGPUのカーネルをPythonで直接記述することを可能にする。OpenAIのTriton言語に似たプログラミングモデルを採用しており、開発者は以下のような低レベルの制御を行うことができる。

* **メモリ階層の制御:** TPUのHBM（グローバルメモリ）からVMEM（ベクターメモリ/SRAM）へのデータ転送を明示的に記述する。  
* **パイプライン処理:** メモリロードと演算をオーバーラップさせる（パイプライン化する）ことで、レイテンシを隠蔽する。  
* **ブロック・プログラミング:** `BlockSpec` と `Grid` を用いて、巨大な行列を小さなブロック（タイル）に分割し、シストリックアレイ上で効率的に処理するスケジュールを記述する。

### **6.2 XLAとの共存**

Pallasの強力な点は、JAXの通常のコードとシームレスに統合できることである。`jax.jit` でコンパイルされた関数の中から、`pallas_call` を使ってカスタムカーネルを呼び出すことができる。つまり、モデルの99%は高レベルなJAX/Flaxで記述し、ボトルネックとなる1%の処理だけをPallasで最適化するという「いいとこ取り」が可能である。これは、開発効率と実行性能の両立を迫られるAIエンジニアにとって強力な武器となる。

---

## **第7章 実践ガイド：Zero to TPU Training**

理論的な解説に加え、実際にGoogle ColabやKaggleといった無料利用可能な環境を用いて、TPU上でJAX/Flaxによるモデル学習を行う手順を解説する。  
特筆すべき点として、2025年以降、Google Colabの無料枠におけるTPUランタイムが更新され、従来のTPU v2が廃止され、より高性能なTPU v5e（v2-8の代替としてv5e-1など）が利用可能になっている。これは学習者にとって、新しい世代のアーキテクチャに触れる絶好の機会である。

### **7.1 環境セットアップ**

まず、JAXがTPUを正しく認識しているか確認する。Colabではランタイムのタイプを「TPU」に変更しておく。

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

### **7.2 データローディング (TFDS & Grain)**

JAX自体にはデータローダーが含まれていないため、TensorFlow Datasets (TFDS) を使用し、最終的にJAXが扱えるNumpy配列のイテレータに変換する手法が一般的である。

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

### **7.3 モデル定義 (Flax)**

Flaxの `nn.Module` を使用してシンプルなCNNを定義する。`@nn.compact` デコレータを使用することで、`__call__` メソッド内で層を定義・実行でき、コードが簡潔になる。

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

### **7.4 学習状態の管理 (TrainState)**

Flaxでは、モデルのパラメータとオプティマイザの状態を `TrainState` というオブジェクトで一元管理する。

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

### **7.5 学習ステップ (Train Step) の実装と並列化**

ここがJAXの核心部分である。`train_step` 関数を定義し、それを `jax.jit` でコンパイルする。さらに、データ並列化を実現するためにシャーディングを指定する。

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

このコード例では、`NamedSharding` と `jax.device_put` を使用することで、データが自動的に各TPUデバイスに分散され、SPMD方式での並列学習が実行される。ユーザーは内部の通信コードを一切書く必要がない。

---

## **第8章 戦略的示唆と将来展望**

### **8.1 TCO（総所有コスト）の最適化**

企業がJAX/TPUスタックを採用する最大の経済的動機は、圧倒的なコストパフォーマンスである。

* **推論コストの削減:** TPU v5eは、v4と比較して推論時のドルあたり性能が2.5倍に向上している。これは大規模サービスを運用する企業にとって、インフラコストの劇的な削減を意味する。  
* **メモリ帯域の価値:** TPU v6e (Trillium) は、チップあたり1,600 GB/sという広帯域HBMを搭載している。AIモデルの性能向上が計算速度（FLOPS）よりもメモリ転送速度に依存するようになる中、この帯域幅は「メモリの壁」を突破し、ハードウェアの稼働率（MFU: Model FLOPs Utilization）を高く維持するための重要な資産となる。

### **8.2 ベンダーロックインのリスクとOpenXLA**

「TPUを使うとGoogle Cloudにロックインされるのではないか？」という懸念は、経営層やアーキテクトにとって重要な課題である。しかし、JAXスタック自体はハードウェア非依存であることを理解する必要がある。

* **OpenXLAとStableHLO:** Googleはコンパイラ基盤をオープンソース化しており、JAXで書かれたコードは NVIDIA GPU や AMD GPU 上でも、極めて高い効率で動作する。実際に、Apple（公開フレームワーク AXLearn）や xAI（Grok-1 公開実装）、Anthropic といった企業も研究開発において JAX を活用していることが公開情報から知られており、このスタックのポータビリティを裏付けている。  
* **戦略的柔軟性:** JAXを採用することは、特定のハードウェアへの依存ではなく、「コンパイラ最適化」という普遍的な技術への投資を意味する。これにより、第7世代の TPU v7（Ironwood）をはじめ、将来他社の新型チップが登場した際も、最小限の修正で最新ハードウェアの恩恵を受けることができる。

### **8.3 将来展望：Ironwoodとその先へ**

2025年4月の Google Cloud Next '25 において、Googleは第7世代TPU「Ironwood (v7)」を発表した。Ironwoodは「推論の時代（Age of Inference）」を見据え、FP8演算へのネイティブ対応と超大規模推論ワークロードへの徹底的な最適化が図られている。また、JAXエコシステムにおいても、Pallasによるカーネル開発の民主化や、量子コンピューティング（Quantum Computing）との連携など、計算のフロンティアを拡張する試みが続いている。

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

### **結論**

Google TPUとJAXは、もはやGoogle内部だけの秘伝の技術ではない。それは、ムーアの法則の鈍化とAIモデルの巨大化という二重の課題に対する、業界全体の標準的な解になりつつある。Pythonの柔軟性とスーパーコンピュータの性能を両立させるこのスタックを習得することは、AIエンジニアにとって、次の10年を生き抜くための最も強力な武器となるだろう。

#### **Works cited**

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
