---
title: 【DR】生成AI時代における技術デリバリー職の構造的変容：OpenAI Forward Deployed Engineer と Google Cloud Customer Engineer の包括的比較調査報告書
date: 2025-12-24
category: Career
pw: 0.8
so: 0.8
---

## **1\. エグゼクティブサマリー**

2020年代中盤、テクノロジー業界はクラウドコンピューティングの成熟期から生成AI（Generative AI）の実装期へと急激なパラダイムシフトを迎えている。この変革の中で、顧客接点を持つエンジニアリング職の役割もまた、劇的な再定義を迫られている。本報告書は、生成AI革命の震源地であるOpenAIの「Forward Deployed Engineer（FDE）」と、クラウドプラットフォームの巨人であるGoogle Cloudの「Customer Engineer（CE）」という二つの象徴的な職種を対象に、その役割、責任、スキルセット、報酬、そしてキャリアパスを徹底的に比較・分析したものである。特に、グローバル市場（北米中心）と日本市場（東京）におけるそれぞれの文脈の違いに焦点を当て、企業が採用戦略を立案する際、あるいはエンジニアがキャリアを選択する際の判断材料となる深い洞察を提供することを目的とする。

調査の結果、両者の決定的な違いは「デリバリーモデルの哲学」と「技術的関与の深度」にあることが明らかになった。Google CloudのCEが「One Capability, Many Customers（一つの機能を多数の顧客へ）」というスケーラビリティ重視のモデルの下、技術的なアドバイザーとしてプリセールス活動や標準化されたアーキテクチャ設計に重きを置くのに対し、OpenAIのFDEは「One Customer, Many Capabilities（一人の顧客に多数の機能・解決策を）」というハイタッチモデルに基づき、顧客内部に深く入り込み（Embed）、本番環境でのコード記述を含む最終的な価値創出（Delivery）までをエンドツーエンドで責任を持つ「技術的特殊部隊」としての性質が強い。

![FDE vs CE](/media/blog/fde-vs-ce.png)

日本市場においては、この構造的差異がさらに複雑な様相を呈する。日本のIT産業における伝統的な多重下請け構造やSIer（システムインテグレーター）文化の中で、FDEのモデルは「労働力の提供（SES）」と誤認されやすいリスクを孕んでいる。しかし、その本質は労働力の提供ではなく、「プロダクトと顧客の共進化」にある点で根本的に異なるものである。FDEは顧客の現場で得た知見をシリコンバレーの本社へフィードバックし、プロダクトロードマップを書き換える権限を持つ。

報酬面においても、OpenAIのFDEは日本市場の相場を大きく逸脱するグローバル水準（数千万円〜億円単位）を提示しており、これが日本のトップエンジニア層の流動性を高める要因となっている。一方でGoogle CloudのCEは、極めて安定した高水準の報酬と充実した福利厚生、そして整備されたキャリアパスを提供しており、リスク回避志向の強いハイパフォーマーにとって依然として魅力的な選択肢であり続けている。

本報告書では、これらの論点について、公開された求人情報、給与データ、業界の議論、および実際の従業員の証言に基づき、多角的に論じる。

## **2\. 背景と歴史的文脈：役割の進化論**

両職種の違いを深く理解するためには、それぞれの役割が生まれた歴史的背景と、それが解決しようとしている課題の変遷を理解する必要がある。技術営業（Technical Sales）の領域は、ソフトウェア産業の進化とともに形を変えてきた。

### **2.1 Sales Engineer から Customer Engineer への進化**

かつて、オンプレミスのパッケージソフトウェアやハードウェアを販売していた時代、エンジニアの役割は「Sales Engineer (SE)」と呼ばれ、主な任務は「製品が仕様通りに動くことをデモで見せること」であった。営業担当者が描いた夢を、技術的な側面から補完するのが役割であった。

クラウドコンピューティングの時代が到来し、Google CloudやAWSが登場すると、状況は一変した。クラウドは単なる製品ではなく、顧客のビジネス基盤そのものとなる「プラットフォーム」であった。顧客は単機能の製品を買うのではなく、デジタルトランスフォーメーション（DX）という継続的なプロセスを買うようになった。これに伴い、Sales Engineerは「Solutions Architect (SA)」や「Customer Engineer (CE)」へと進化した。

Google CloudにおけるCEは、単なる製品説明係ではない。顧客の既存システムを分析し、クラウドネイティブなアーキテクチャへと導く「信頼できる技術アドバイザー（Trusted Technical Advisor）」としての地位を確立した。彼らは、顧客のCTOやアーキテクトと対等に議論し、Googleの技術力を背景に、顧客のビジネス変革を支援する。しかし、その関与はあくまで「アドバイザリー」と「イネーブルメント（自走支援）」に留まることが多く、最終的なコードの実装や運用は、顧客自身やパートナー企業（SIer）に委ねられるのが一般的であった 。

### **2.2 Palantir モデルと Forward Deployed Engineer の誕生**

一方、ビッグデータ解析と特殊なセキュリティ要件を扱うPalantir Technologiesは、全く異なるアプローチを生み出した。彼らの顧客は政府機関、軍、あるいは巨大な金融機関であり、扱うデータは極めて機密性が高く、かつ構造化されていない「カオス」な状態にあった。単にツールを提供して「あとはご自由に」というSaaSモデルは通用しなかったのである。

そこで生まれたのが「Forward Deployed Engineer (FDE)」である。彼らは「エンジニア」でありながら、ネクタイを締め、顧客の現場（Forward）に常駐（Deployed）した。彼らの任務は、Palantirのプラットフォームを使って、顧客の抱える具体的な課題（例えばテロリストのネットワーク分析や、工場の歩留まり改善）を、その場で解決することであった。彼らはプラットフォームをカスタマイズし、データパイプラインを構築し、必要であればコア機能の修正パッチすら当てる。この「結果にコミットするために手段を選ばない」姿勢こそが、FDEの原点である 。

### **2.3 生成AI時代における FDE の再興**

OpenAIがこのFDEモデルを採用したのは必然であった。大規模言語モデル（LLM）は、従来のソフトウェア以上に「導入の難易度」が高いからである。

1. **確率的な挙動:** LLMは同じ入力に対しても異なる出力を返すことがあり（確率的）、幻覚（ハルシネーション）のリスクがある。これを企業の業務プロセスに組み込むには、高度なエンジニアリングによるガードレール構築が必要となる。  
2. **曖昧な要件:** 「AIで何かしたい」という曖昧な顧客の要望を、具体的なプロンプトやシステム設計に落とし込むには、深い業務理解が必要となる。  
3. **セキュリティとプライバシー:** 企業の機密データを外部のモデルに入力することへの抵抗感は根強く、これを技術的・法的にクリアにする必要がある。

これらの課題は、外部からのアドバイスだけでは解決できない。顧客のデータの海に飛び込み、試行錯誤（トライアンドエラー）を高速で繰り返す「実装部隊」が必要とされたのである。OpenAIのFDEは、このPalantirの遺伝子を受け継ぎつつ、最先端のAI技術を武器に戦う現代の特殊部隊と言える 。

## **3\. グローバル市場における役割比較詳細**

米国を中心とするグローバル市場において、OpenAI FDEとGoogle Cloud CEはそれぞれ明確に異なるミッションを持っている。ここでは、その業務内容、時間配分、および求められる成果について詳述する。

### **3.1 OpenAI Forward Deployed Engineer (FDE)**

OpenAIのFDEは、シリコンバレー（サンフランシスコ）、ニューヨーク、ロンドンなどの拠点をベースとしつつ、顧客サイトへの出張や常駐を頻繁に行う。彼らは「OpenAIの顔」として顧客と対峙する。

#### **3.1.1 コアミッション：One Customer, Many Capabilities**

FDEの最大の使命は、担当する特定の戦略的顧客（Strategic Customer）において、OpenAIのモデル（GPT-4等）を活用したシステムを本番稼働させ、測定可能なビジネス価値を創出することである。彼らは「製品を売る」のではなく、「成功を作る」ことが求められる 。

#### **3.1.2 業務の詳細と時間の使い方**

FDEの業務は極めて多岐にわたり、流動的である。

* **埋め込み（Embedding）:** 多くのFDEは、週の3〜4日を顧客と共に過ごす。これは物理的なオフィスへの常駐だけでなく、顧客のSlack/Teamsへの参加、GitHubリポジトリへのアクセス権取得を含み、実質的に「顧客の従業員」のように振る舞うことを意味する 。  
* **スコーピングと発見:** 顧客の漠然とした課題（例：「カスタマーサポートを自動化したい」）を、技術的に実現可能なプロジェクトに落とし込む。これには、顧客のデータ構造の解析、セキュリティ要件の整理、ステークホルダーとの調整が含まれる。  
* **プロトタイピングから本番実装:** FDEは自らコードを書く。PythonやJavaScriptを駆使し、APIを叩くだけでなく、RAG（検索拡張生成）のパイプライン構築、評価用データセットの作成、UI/UXの構築まで、フルスタックな開発を行う。PoC（概念実証）で終わらせず、本番環境でのレイテンシ（遅延）やコスト最適化まで責任を持つ 。  
* **プロダクトフィードバック:** 現場での「うまくいかなかったこと」は、即座にOpenAI本社のResearch（研究）チームやProduct（製品）チームに共有される。FDEは、次期モデルの機能要件やAPIの改善を左右する重要な情報源となる 。

#### **3.1.3 技術的スタックと「カオス」の管理**

FDEが扱う技術領域は、従来のWeb開発とは異なる。LLMの挙動は予測不可能（Non-deterministic）であり、これを制御するためのプロンプトエンジニアリング、ファインチューニング、評価（Evals）の仕組み作りが業務の中心となる。これを「確率的なカオスの管理（Managing Stochastic Chaos）」と呼ぶ向きもある 。

### **3.2 Google Cloud Customer Engineer (CE)**

Google CloudのCEは、世界規模の巨大なインフラストラクチャと数千の製品群を背景に、エンタープライズ顧客の変革を支える。

#### **3.2.1 コアミッション：One Capability, Many Customers**

CEのミッションは、Google Cloudの技術的優位性を証明し、顧客によるプラットフォームの採用と消費（Consumption）を最大化することである。一人のCEは複数の顧客（または特定の業界全体）を担当し、スケーラブルな方法で価値を提供する 。

#### **3.2.2 業務の詳細と時間の使い方**

CEの業務は、より構造化されており、セールスサイクルと連動している。

* **技術的ディスカバリーと提案:** 営業担当（Account Executive）と共に顧客を訪問し、技術的な課題をヒアリングする。これに基づき、Google Cloud製品を組み合わせたソリューション構成案を作成する。  
* **デモンストレーションとPoC:** 顧客の目の前で製品のデモを行ったり、限定的な範囲でのPoCを支援したりする。ただし、本番用のコードをゼロから書き上げることは少なく、サンプルコードの提供や、設定のガイドを行うことが多い。  
* **ワークショップとエバンジェライズ:** 顧客向けに技術勉強会を開催したり、カンファレンスで登壇したりして、Google Cloudのファンを増やす活動を行う。  
* **技術的なブロッカーの排除:** セキュリティ懸念や競合他社（AWS, Azure）との機能比較において、Google Cloudが優れている点を論理的に説明し、採用の障害を取り除く。

#### **3.2.3 専門性と分業体制**

Google CloudのCE組織は高度に分業化されている。「インフラ担当」「データ分析担当」「AI/ML担当」「セキュリティ担当」「アプリケーション開発担当」といったスペシャリストCEが存在し、顧客の課題に応じて最適な専門家がアサインされる。これにより、個々のCEは特定の技術領域において極めて深い知識を持つことが求められる 。

![][image2]

## **4\. 日本市場（Tokyo）における特殊事情と適応**

日本市場は、欧米とは異なる独特の商習慣、言語障壁、そしてIT産業構造（SIerの存在）を持っている。この環境下において、FDEとCEの役割はどのように適応し、変容しているのかを分析する。

### **4.1 ITゼネコン構造とFDEの破壊的性質**

日本のIT業界は、ユーザー企業が自社で開発を行わず、SIer（システムインテグレーター）に開発を丸投げする構造が一般的である。この構造の中で、従来のベンダー（Microsoft, Oracle, Google等）のエンジニアは、SIerを支援する「パートナー支援」の役割を担うことが多かった。

#### **OpenAI Japan FDE の挑戦**

OpenAI JapanのFDEは、この構造に風穴を開ける存在として設計されている。彼らはSIerを介さず、直接ユーザー企業（例えば日本の大手商社、メガバンク、政府機関）に入り込み、ユーザー企業の社員と「共創」することを目指す。

* **SIerとの違い:** 日本の従来の常駐エンジニア（SES）は「仕様書通りに作ること」が求められ、成果物責任を負わない準委任契約が一般的であるが、FDEは「ビジネス成果」に責任を持ち、仕様自体を顧客と共に作り上げる。この点で、FDEは「高級SES」ではなく、「技術コンサルタント兼暫定CTO」に近い 。  
* **バイリンガル・ブリッジ:** 東京オフィスのFDEには、日本語と英語の高度な運用能力が求められる（Fully Bilingual）。これは、単なる通訳ではなく、日本の顧客特有のコンテキスト（稟議文化、根回し、曖昧な意思決定）を理解し、それをシリコンバレーのエンジニアリングチームに「機能要件」として翻訳して伝える能力である。日本の顧客が直面する日本語特有のLLMの課題（トークン化の問題、敬語の扱いなど）を本社にフィードバックし、モデルの改善を促す役割も担う 。

### **4.2 Google Cloud Japan CE の適応と成熟**

Google Cloud JapanのCE組織は、日本市場においてすでに強固な地位を築いている。彼らは、日本の商習慣に深く適応した組織体制を持っている。

* **業界縦割り（Industry Vertical）:** 日本のCEは、「金融（FSI）」「製造（Manufacturing）」「流通（Retail）」「公共（Public Sector）」などの業界カットで組織されていることが多い。これにより、例えばFISC安全対策基準（金融）や3省2ガイドライン（医療）といった、日本固有の業界規制に精通した対応が可能となっている 。  
* **パートナーエコシステム:** 日本ではGoogle Cloudを直接契約するよりも、パートナー経由で契約するケースが多い。そのため、CEの重要なミッションの一つは、パートナー企業（クラスメソッド、アイレット、大手SIerなど）の技術力を底上げし、彼らが自走してGoogle Cloudを販売・導入できるようにすることである。  
* **ハイタッチサポートの文化:** 日本の顧客は、障害発生時の詳細な原因究明や報告書を求める傾向が強い。これに対応するため、ポストセールスのサポート部隊やCustomer Solutions Engineer (CSE) が、グローバル基準よりも手厚い支援を提供する体制が整えられている 。

## **5\. 詳細な職種区分：FDE vs. FDSWE**

OpenAIの採用情報において、"Forward Deployed Engineer (FDE)" と "Forward Deployed *Software* Engineer (FDSWE)" という二つの類似した職種が見られる点は注目に値する。一見すると些細な違いに見えるが、これはチーム内での役割分担を示唆している。

### **5.1 役割分担の解像度**

| 比較項目 | FDE (Forward Deployed Engineer) | FDSWE (Forward Deployed Software Engineer) |
| :---- | :---- | :---- |
| **主な焦点** | **ビジネス課題の解決とプロジェクト統括** | **スケーラブルなソフトウェア実装と技術基盤** |
| **比喩的役割** | 現場監督、アーキテクト、外交官 | クラフトマン（職人）、ツールスミス |
| **顧客との対話** | CxO、事業責任者、PMとの折衝が中心 | 顧客側のエンジニアとのペアプロ、コードレビュー |
| **成果物** | プロジェクトの成功、ロードマップ、戦略 | 本番稼働するコード、再利用可能なライブラリ、ツール |
| **求められるスキル** | 曖昧さの構造化、交渉力、広範な技術知識 | 高速な実装力、フルスタック開発、データベース設計 |

調査資料  によると、FDSWEは「顧客の最も困難な問題を解決するためのスケーラブルなソリューションを設計・実装する」ことに特化しており、さらに「FDEのデリバリー速度と品質を向上させるための抽象化（Abstractions）を設計する」役割も担うとされる。つまり、FDEが顧客ごとの個別解を探索する最前線にいるのに対し、FDSWEはその背後で、個別解を汎用的な資産（アセット）に昇華させ、エンジニアリングとしての品質を担保する役割を担っていると解釈できる。

### **5.2 Google Cloud における類似の区分**

Google Cloudにおいては、これに完全に相当する区分はないが、機能的な類似性はある。

* **Customer Engineer (CE):** プリセールス段階でのアーキテクチャ設計と提案（FDEに近い）。  
* **Customer Solutions Engineer (CSE):** ポストセールス段階での技術的な深掘り、トラブルシューティング、特定のクリティカルな顧客に対するハンズオン支援（FDSWEに近い）。

しかし、OpenAIのFDSWEほど「コードを書くこと」に特化した役割は、Google CloudのCE組織内では相対的に少ない。Googleにおいてコードをバリバリ書く役割は、本来のSoftware Engineer (SWE) や、Professional Services Organization (PSO) のコンサルタントが担う領域である。

## **6\. 報酬（Salary）とインセンティブ構造の経済学**

両社の報酬体系は、それぞれのリスクプロファイルと企業フェーズを反映しており、エンジニアにとっての経済的な意味合いは大きく異なる。

### **6.1 OpenAI FDEの報酬：ハイリスク・ハイリターン**

OpenAIの報酬パッケージは、AIブームを背景に、業界の常識を覆す水準にある。特に「Profit Participation Units (PPU)」と呼ばれる独自の株式報酬制度が特徴的である。

* **グローバル水準:** 米国のデータでは、FDEのトータルコンペンセーション（TC）は **$300k \- $800k+**（約4,500万円〜1億2,000万円）に達する。ベース給与だけでも$200k（約3,000万円）を超え、これに巨額のPPUが上乗せされる 。  
* **日本市場（推定）:** 日本での採用においても、グローバル水準に近い提示がなされているとの噂が絶えない。推定では **2,500万円〜6,000万円** のレンジであり、これは日本の伝統的なIT企業の部長〜役員クラス、あるいは外資系IT企業のカントリーマネージャークラスに匹敵する 。  
* **構造:** PPUは、OpenAIの評価額（Valuation）が上昇することによって価値が増大する。現在、OpenAIの評価額は急激に上昇しており、初期に入社した社員は莫大な富を得る可能性があるが、上場（IPO）の予定が不透明であるため、換金（Liquidity）のタイミングには制限があるリスクも孕んでいる 。

### **6.2 Google Cloud CEの報酬：安定した高水準**

Googleの報酬は、テック業界のゴールドスタンダードであり、極めて安定している。

* **グローバル水準:** 米国でのCEのTCは **$150k \- $350k+**（約2,200万円〜5,300万円）程度が一般的である。Staffレベルなどの上位職になれば$500kを超えるが、その数は限られる 。  
* **日本市場:** 日本のCEの年収レンジは **1,000万円〜2,500万円** 程度に分布している。L4（中堅）で1,200〜1,600万円、L5（シニア）で1,800〜2,500万円程度と推定される 。  
* **構造:** ベース給与＋年間ボーナス＋RSU（譲渡制限付株式ユニット）。Googleの親会社Alphabetは上場企業であり、RSUは即座に市場で売却可能であるため、現金化の確実性が極めて高い。株価も長期的には上昇トレンドにあるが、OpenAIのような「短期間で10倍」といった爆発力は期待しにくい。

![][image3]

## **7\. キャリアパスと将来の展望**

FDEとCE、それぞれの職種を選んだ先には、どのようなキャリアが待っているのか。その出口戦略（Exit Strategy）と成長の方向性についても大きな違いが見られる。

### **7.1 OpenAI FDEのキャリアパス：起業家とプロダクトリーダーへの道**

FDEは、顧客の最前線で「何が売れるか」「何が価値を生むか」を肌感覚で理解し、それを自らの手で実装する経験を積む。これは、スタートアップの創業者が初期に行うプロセス（Product-Market Fitの探索）そのものである。

* **起業家 (Founder):** 多くのFDE経験者が、その経験を活かして自らAIスタートアップを創業するケースが増えている。彼らは技術だけでなく、顧客課題の発見能力に長けているため、成功確率が高いとされる。  
* **プロダクトマネージャー (PM):** 顧客の声を直接製品開発にフィードバックする経験から、OpenAI内部や他社におけるプロダクトマネージャーへの転身も自然な流れである。  
* **エンジニアリングリーダー:** FDEチームのマネージャーや、Technical Deployment Lead (TDL) として組織を牽引する役割。あるいは、AI導入を推進する大企業のCTO/CDO（Chief Digital Officer）としてヘッドハンティングされる可能性もある 。

FDEのキャリアパスは、一本道ではなく、放射状に広がる「ハブ」のような性質を持つ。特に、ビジネスとエンジニアリングの境界線上で活躍できる人材は希少であり、市場価値は極めて高い。

### **7.2 Google Cloud CEのキャリアパス：組織リーダーとスペシャリストへの道**

Google CloudのCEは、大規模組織の中での動き方、政治的な調整、そして広範な技術知識を身につける。

* **技術スペシャリスト:** 特定の技術領域（例えばKubernetesやBigQuery）の世界的権威として、Distinguished EngineerやFellowを目指す道。  
* **セールス/ビジネスリーダー:** CEのマネジメントを経て、Google Cloudや他社の営業統括本部長（Director/VP）へと昇進する道。技術背景を持つ営業リーダーは非常に重宝される。  
* **カスタマーサクセス/プロフェッショナルサービス:** より長期的な顧客関係構築や、大規模プロジェクト管理に興味があれば、Customer Success Manager (CSM) や Professional Services Organization (PSO) への異動も可能である。  
* **「Ex-Google」ブランド:** Googleでの経験は、あらゆる企業へのパスポートとなる。他社のCTOやVPoEとして招聘されるケースは枚挙に暇がない。

### **7.3 インタビューと採用基準の違い**

採用プロセスにおいても、両社が求める資質の違いが鮮明に現れる。

* **OpenAI FDEの面接:** 「実技」が重視される。実際のコーディング試験（アルゴリズムだけでなく、実用的なアプリ構築やAPI利用）、システムデザイン、そして「曖昧なシナリオ」に対する対処能力を見るケース面接が行われる。技術的な深さだけでなく、顧客とのコミュニケーションにおける「瞬発力」や「判断力」が厳しく問われる 。  
* **Google Cloud CEの面接:** 「広さと論理性」が重視される。Google Leadership Principles (Googleiness) への適合を見る行動面接に加え、広範な技術知識を問う「General Technical Cognitive Ability」、そして特定のシナリオに対するソリューション提案力を問う「Role Related Knowledge」が中心となる。コーディング試験はある場合もあるが、SWEほど厳密ではないことが多い。

## **8\. 結論と提言**

### **8.1 総括**

OpenAIのForward Deployed EngineerとGoogle CloudのCustomer Engineerは、表面的には「顧客を技術で支援する」という同じカテゴリに属するように見えるが、そのDNAは全く異なる生物である。

* **Google Cloud CE** は、成熟したクラウドエコシステムにおける「外交官兼建築家」である。彼らは既存の地図（ベストプラクティス）を使い、多くの人々を安全に目的地（クラウド）へと導く。  
* **OpenAI FDE** は、未踏のAIフロンティアにおける「探検家兼開拓者」である。彼らは地図のない場所で、自ら鉈を振るって道を切り開き（コーディング）、時には橋を架けて（ツール開発）、目的地そのもの（ユースケース）を発見する。

### **8.2 個人のキャリア選択への提言**

* もしあなたが、**「カオス」を愛し、自らのコードで世界を変える手応えをダイレクトに感じたい**なら、そしてそのための不確実性や激務を受け入れる覚悟があるなら、OpenAI FDE（あるいはそれに類するAIスタートアップのFDE）は、現代において最もエキサイティングで報酬の高い選択肢となるだろう。  
* もしあなたが、**社会インフラとなる巨大なシステムを支え、多くの企業に影響を与えたい**と願い、ワークライフバランスと長期的な安定、そして組織的な成長を重視するなら、Google Cloud CEは依然として最高のキャリアプラットフォームの一つである。

### **8.3 企業・採用担当者への提言**

日本企業がOpenAIのFDEモデルを模倣しようとする場合、最大の障壁は「エンジニアに対する信頼と権限委譲」の欠如にある。FDEが機能するためには、彼らを単なる「高級作業員」として扱うのではなく、ビジネスの意思決定に参画させ、現場での即断即決を許容する文化が必要である。また、報酬制度についても、従来の年功序列や職能給の枠組みを超えた、市場価値に見合う柔軟な設計が不可欠となるだろう。生成AI時代の競争力は、技術そのものだけでなく、それを使いこなす「人間」をどう組織し、どう報いるかにかかっているのである。

## **9\. 補遺**

### **9.1 用語集**

* **LLM (Large Language Model):** 大規模言語モデル。GPT-4などを指す。  
* **RAG (Retrieval-Augmented Generation):** 検索拡張生成。LLMに外部データの検索結果を与えて回答精度を高める技術。  
* **SaaS (Software as a Service):** サービスとしてのソフトウェア。  
* **SIer (System Integrator):** システムインテグレーター。顧客のシステム開発を請け負う企業。  
* **SES (System Engineering Service):** エンジニアの技術力を提供する準委任契約の一形態。

### **9.2 参考文献・引用元**

本報告書の作成にあたり、以下の資料を参照した。文中の引用符 はこれに対応する。

* OpenAI Careers pages (Global & Japan)  
* Google Cloud Careers pages (Global & Japan)  
* Industry Analysis & Blogs on FDE  
* Salary Data Sources  
* Job Board & Discussion Forums

#### **Works cited**

1. Customer Engineer, Automotive Industry, Google Cloud (Japanese) \- TimesJobs, accessed December 21, 2025, [http://m.timesjobs.com/mobile/job-detail/customer-engineer-automotive-industry-google-cloud-japanese-google-india-pvt-ltd-japan-6-to-9-yrs-jobid-CDwiZok9L2dzpSvf\_\_PLUS\_\_uAgZw==](http://m.timesjobs.com/mobile/job-detail/customer-engineer-automotive-industry-google-cloud-japanese-google-india-pvt-ltd-japan-6-to-9-yrs-jobid-CDwiZok9L2dzpSvf__PLUS__uAgZw==)  
2. Director, Google Cloud Consulting, South East Asia, accessed December 21, 2025, [https://www.google.com/about/careers/applications/jobs/results/121477486201447110-director-google-cloud-consulting-south-east-asia?sort\_by=date](https://www.google.com/about/careers/applications/jobs/results/121477486201447110-director-google-cloud-consulting-south-east-asia?sort_by=date)  
3. The Forward Deployed AI Engineer \- Sundeep Teki, accessed December 21, 2025, [https://www.sundeepteki.org/advice/forward-deployed-ai-engineer](https://www.sundeepteki.org/advice/forward-deployed-ai-engineer)  
4. Tech's secret weapon: A complete guide to the Forward Deployed Engineer (Role, salary, & interviews) \- Hashnode, accessed December 21, 2025, [https://hashnode.com/blog/a-complete-guide-to-the-forward-deployed-engineer](https://hashnode.com/blog/a-complete-guide-to-the-forward-deployed-engineer)  
5. Forward Deployed Engineer \- SF \- OpenAI, accessed December 21, 2025, [https://openai.com/careers/forward-deployed-engineer-sf-san-francisco/](https://openai.com/careers/forward-deployed-engineer-sf-san-francisco/)  
6. Forward Deployed Engineers: AI's Hottest New Role \- Index.dev, accessed December 21, 2025, [https://www.index.dev/blog/forward-deployed-engineers-ai-hottest-job](https://www.index.dev/blog/forward-deployed-engineers-ai-hottest-job)  
7. Forward Deployed Engineer (FDE): The Ultimate Guide for the AI Era \- Sundeep Teki, accessed December 21, 2025, [https://www.sundeepteki.org/blog/forwarded-deployed-engineer](https://www.sundeepteki.org/blog/forwarded-deployed-engineer)  
8. カスタマー エンジニア、AI、インフラストラクチャ ..., accessed December 21, 2025, [https://careers.google.com/jobs/results/77565147324785350-/](https://careers.google.com/jobs/results/77565147324785350-/)  
9. Forward Deployed Engineer（FDE）とは？AI導入成功のカギを握る次世代エンジニア \- GitLab, accessed December 21, 2025, [https://experts.zyyx.jp/gitlab/blog/what-is-forward-deployed-engineer](https://experts.zyyx.jp/gitlab/blog/what-is-forward-deployed-engineer)  
10. FDE（Forward Deployed Engineer）はDX現場をどう動かす？AI時代の新しいエンジニア像に迫る, accessed December 21, 2025, [https://www.members.co.jp/column/20250926-fde-engineer](https://www.members.co.jp/column/20250926-fde-engineer)  
11. Forward Deployed Engineer \- Tokyo \- OpenAI, accessed December 21, 2025, [https://openai.com/careers/forward-deployed-engineer-tokyo-tokyo-japan/](https://openai.com/careers/forward-deployed-engineer-tokyo-tokyo-japan/)  
12. Top Customer Solutions Engineer, Networking, Google Cloud ..., accessed December 21, 2025, [https://careers.google.com/jobs/results/103832480112353990-top-customer-solutions-engineer/](https://careers.google.com/jobs/results/103832480112353990-top-customer-solutions-engineer/)  
13. Forward Deployed Software Engineer \- SF \- OpenAI, accessed December 21, 2025, [https://openai.com/careers/forward-deployed-software-engineer-sf-san-francisco/](https://openai.com/careers/forward-deployed-software-engineer-sf-san-francisco/)  
14. Forward Deployed Software Engineer \- Tokyo \- OpenAI, accessed December 21, 2025, [https://openai.com/careers/forward-deployed-software-engineer-tokyo-tokyo-japan/](https://openai.com/careers/forward-deployed-software-engineer-tokyo-tokyo-japan/)  
15. Customer Solutions Engineer, High Touch Support, GKE, Compute — Google Careers, accessed December 21, 2025, [https://careers.google.com/jobs/results/93555705704784582-customer-solutions-engineer/](https://careers.google.com/jobs/results/93555705704784582-customer-solutions-engineer/)  
16. OpenAI Software Engineer Salaries 2025 | $706k-$2.4M \- 6figr.com, accessed December 21, 2025, [https://6figr.com/us/salary/openai--software-engineer](https://6figr.com/us/salary/openai--software-engineer)  
17. トップAIスタートアップ破格報酬の内実。政府情報で13社が明らかに…OpenAI、Anthropic、Perplexity | Business Insider Japan, accessed December 21, 2025, [https://www.businessinsider.jp/article/2507ai\_salaries\_revealed/](https://www.businessinsider.jp/article/2507ai_salaries_revealed/)  
18. 【OpenAI（ChatGPT開発元）の年収は高い？】2000万円越え？募集職種とその年収についてご紹介 \- JobQ Town, accessed December 21, 2025, [https://job-q.me/articles/15022](https://job-q.me/articles/15022)  
19. To prevent competitors from poaching talent… OpenAI's radical move 'Stock options immediately upon hire', accessed December 21, 2025, [https://bloomingbit.io/en/feed/news/102430](https://bloomingbit.io/en/feed/news/102430)  
20. Salary: Google Japan (December, 2025\) United States \- ZipRecruiter, accessed December 21, 2025, [https://www.ziprecruiter.com/Salaries/Google-Japan-Salary](https://www.ziprecruiter.com/Salaries/Google-Japan-Salary)  
21. 2025 Cloud Engineer Salaries in Tokyo \- Morgan McKinley, accessed December 21, 2025, [https://www.morganmckinley.com/jp/salary-guide/data/cloud-engineer/tokyo](https://www.morganmckinley.com/jp/salary-guide/data/cloud-engineer/tokyo)  
22. Google Japan Salaries \- OpenSalary, accessed December 21, 2025, [https://opensalary.jp/en/companies/google-japan/roles/software-engineer](https://opensalary.jp/en/companies/google-japan/roles/software-engineer)  
23. Technical Deployment Lead, Forward Deployed Engineering \- Tokyo | OpenAI, accessed December 21, 2025, [https://openai.com/careers/technical-deployment-lead-forward-deployed-engineering-tokyo-tokyo-japan/](https://openai.com/careers/technical-deployment-lead-forward-deployed-engineering-tokyo-tokyo-japan/)  
24. Forward Deployed Engineer, Gov \- OpenAI, accessed December 21, 2025, [https://openai.com/careers/forward-deployed-engineer-gov-washington-dc/](https://openai.com/careers/forward-deployed-engineer-gov-washington-dc/)  
25. Manager, Forward Deployed Engineering \- Tokyo | OpenAI, accessed December 21, 2025, [https://openai.com/careers/manager-forward-deployed-engineering-tokyo-tokyo-japan/](https://openai.com/careers/manager-forward-deployed-engineering-tokyo-tokyo-japan/)  
26. Manager, Forward Deployed Engineering | OpenAI, accessed December 21, 2025, [https://openai.com/careers/manager-forward-deployed-engineering-new-york-city/](https://openai.com/careers/manager-forward-deployed-engineering-new-york-city/)  
27. Application Programming Interface Management Engineer — Google Careers, accessed December 21, 2025, [https://www.google.com/about/careers/applications/jobs/results/136504403170337478-application-programming-interface-management-engineer/](https://www.google.com/about/careers/applications/jobs/results/136504403170337478-application-programming-interface-management-engineer/)  
28. Forward Deployed Engineers: The VARs of the Cloud Era? | by Richard Clark | Medium, accessed December 21, 2025, [https://medium.com/@richclark808/forward-deployed-engineers-the-vars-of-the-cloud-era-c97192cfe484](https://medium.com/@richclark808/forward-deployed-engineers-the-vars-of-the-cloud-era-c97192cfe484)  
29. Forward Deployed Engineer: AI時代の新しいエンジニアリング職を深掘りする \- Zenn, accessed December 21, 2025, [https://zenn.dev/kimkiyong/articles/f29adc1809c10c](https://zenn.dev/kimkiyong/articles/f29adc1809c10c)  
30. IT業界で台頭する新職種の全貌:FDE、TPM、SRE、Platform Engineer、MLOps Engineerなど欧米メガテック企業の専門職種と日本での展望｜hagaji \- note, accessed December 21, 2025, [https://note.com/hagaji/n/nb1dde1817ccd](https://note.com/hagaji/n/nb1dde1817ccd)  
31. AI時代を勝ち抜くFDE(フォワードデプロイドエンジニア)とは？米国発・顧客密着エンジニアが日本のITを変える可能性 \- note, accessed December 21, 2025, [https://note.com/shimada\_g/n/n28ce04da1f0c](https://note.com/shimada_g/n/n28ce04da1f0c)  
32. Why Forward Deployed Engineers are Accelerating AI Adoption | Certified GitLab Partner ZYYX Inc, accessed December 21, 2025, [https://experts.zyyx.jp/gitlab/en/blog/why-forward-deployed-engineers-are-accelerating-ai-adoption](https://experts.zyyx.jp/gitlab/en/blog/why-forward-deployed-engineers-are-accelerating-ai-adoption)  
33. The Rise of the Forward Deployed Engineer: How FDEs Are Reshaping the Future of AI-Driven Teams | Carbon, accessed December 21, 2025, [https://www.carbonremote.com/blog/the-rise-of-the-forward-deployed-engineer-how-fdes-are-reshaping-the-future-of-ai-driven-teams](https://www.carbonremote.com/blog/the-rise-of-the-forward-deployed-engineer-how-fdes-are-reshaping-the-future-of-ai-driven-teams)  
34. The 'Forward Deployed Engineer' role is seeing a reported 800% spike in job listings. It's a hybrid, 'technical special ops' job at places like OpenAI and Palantir with $400k+ salaries. They're not Sales Engineers, they ship production code. : r/programming \- Reddit, accessed December 21, 2025, [https://www.reddit.com/r/programming/comments/1op0evu/the\_forward\_deployed\_engineer\_role\_is\_seeing\_a/](https://www.reddit.com/r/programming/comments/1op0evu/the_forward_deployed_engineer_role_is_seeing_a/)  
35. OpenAI Salaries 2025: Compensation, Roles & Pay Ranges \- Nahc.io, accessed December 21, 2025, [https://www.nahc.io/blog/openai-salaries-what-employees-really-earn-in-2025-9ecfb](https://www.nahc.io/blog/openai-salaries-what-employees-really-earn-in-2025-9ecfb)  
36. Google Japan Salaries \- OpenSalary, accessed December 21, 2025, [https://opensalary.jp/en/companies/google-japan/roles/engineering-manager](https://opensalary.jp/en/companies/google-japan/roles/engineering-manager)  
37. Google Japanの年収 \- OpenSalary, accessed December 21, 2025, [https://opensalary.jp/companies/google-japan](https://opensalary.jp/companies/google-japan)  
38. OpenAI Salaries 2025 | $691k-$3.2M \- 6figr.com, accessed December 21, 2025, [https://6figr.com/us/salary/openai](https://6figr.com/us/salary/openai)  
39. The $925K Developer: Why OpenAI's Engineers Are Worth Their Weight in GoldIn a world. | by Venugopal Adep | AI Product Leader @ Jio | Medium, accessed December 21, 2025, [https://medium.com/@venugopal.adep/the-925k-developer-why-openais-engineers-are-worth-their-weight-in-goldin-a-world-c26c8c5bbb0c](https://medium.com/@venugopal.adep/the-925k-developer-why-openais-engineers-are-worth-their-weight-in-goldin-a-world-c26c8c5bbb0c)  
40. Software Engineer Salaries \- OpenSalary, accessed December 21, 2025, [https://opensalary.jp/en/roles/software-engineer](https://opensalary.jp/en/roles/software-engineer)  
41. イーロン・マスクが再び批判！OpenAIの「贅沢すぎる報酬」の実態とは？ \- Multifverse, accessed December 21, 2025, [https://www.multifverse.com/blog-posts/elon-musk-vs-openai](https://www.multifverse.com/blog-posts/elon-musk-vs-openai)  
42. 【OpenAI】年収億超えエンジニア \- 従業員の年収サンプル｜本郷喜千 \- note, accessed December 21, 2025, [https://note.com/yoshiyuki\_hongoh/n/n651474633d01](https://note.com/yoshiyuki_hongoh/n/n651474633d01)  
43. OpenAI Paris (Forward Deployed Engineer) vs. DeepMind Mountain View (Junior Product Role) : r/cscareerquestionsEU \- Reddit, accessed December 21, 2025, [https://www.reddit.com/r/cscareerquestionsEU/comments/1pbs04h/openai\_paris\_forward\_deployed\_engineer\_vs/](https://www.reddit.com/r/cscareerquestionsEU/comments/1pbs04h/openai_paris_forward_deployed_engineer_vs/)  
44. Remote Support Engineer Jobs in Japan – Apply Now, accessed December 21, 2025, [https://www.remoterocketship.com/country/japan/jobs/support-engineer/](https://www.remoterocketship.com/country/japan/jobs/support-engineer/)  
45. 【2025年12月最新】Google（グーグル）への転職は「激務」なのか？年収・求人・評判を「年収1,720万円」のリアルで徹底解剖！ | CAREER FOCUS, accessed December 21, 2025, [https://careerfocus.co.jp/google/](https://careerfocus.co.jp/google/)  
46. カスタマーエンジニアはやめとけ？きつい実態と将来性を徹底解説, accessed December 21, 2025, [https://www.engineer-factory.com/media/career/5890/](https://www.engineer-factory.com/media/career/5890/)  
47. Google Cloud Japan に入社してみた \- Medium, accessed December 21, 2025, [https://medium.com/google-cloud-jp/google-cloud-japan-%E3%81%AB%E5%85%A5%E7%A4%BE%E3%81%97%E3%81%A6%E3%81%BF%E3%81%9F-ceb58b38f99c](https://medium.com/google-cloud-jp/google-cloud-japan-%E3%81%AB%E5%85%A5%E7%A4%BE%E3%81%97%E3%81%A6%E3%81%BF%E3%81%9F-ceb58b38f99c)