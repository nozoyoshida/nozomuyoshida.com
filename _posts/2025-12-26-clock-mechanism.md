---
title: "手巻き式機械時計の工学と哲学"
date: 2025-12-25
excerpt: "リュウズから主ゼンマイへ指先の力を蓄える手巻き式機械時計について、その物理・機構のしくみと人と機械の関係を考察する。"
category: Hobby
pw: -0.8
so: 0.8
---

## 手巻き機構における人と機械の接続

現代の技術開発ではエネルギーの自律性が大きな目標とされることが多い。スマートフォンはバッテリー寿命を競い、自動車は給油や充電の頻度を減らそうとする。腕時計でもクオーツ時計は数年にわたる自律駆動を実現し、自動巻き時計（Automatic Watch）は着用者の無意識な腕の振りを動力に変えて動き続ける。そうした利便性の追求とは正反対の位置に残っているのが「手巻き式機械時計（Manual Winding Watch）」である。

手巻き式時計は自動巻き機構のローター（回転錘）を持たず、電池のような電気化学的な動力源にも頼らない。唯一の動力源は人間の指でリュウズ（Crown）を回す意図的な「捻り」だけである。人が手を貸さなければ時計は止まり、指先からエネルギーを送り込むことで初めて動き出す。この直接的な物理接続には現代のデジタル機器では希薄になった道具と使い手の密接な関係が残っている。

素朴な仕組みに見えて、その内部には数世紀の改良を経た材料工学やトライボロジー（摩擦学）、「巻き味」を作り込む感性工学が詰まっている。

## 1. 動力貯蔵の物理学とトライボロジー

手巻き時計の基本動作は指でリュウズを捻るトルクを弾性ポテンシャルエネルギーに変換し、長時間にわたって安定して放出することにある。その中心を担うのが香箱（Barrel）と主ゼンマイ（Mainspring）である。

### 1.1 主ゼンマイの進化とフックの法則

主ゼンマイは弾力のある金属リボンで、香箱と呼ばれる歯車付きのドラムに収められている。1945年以前の時計製造では炭素鋼が主流だったが、金属疲労による破損や錆、磁気帯びといった弱点があった。現代の主ゼンマイには「ニヴァフレックス（Nivaflex）」に代表されるコバルト、ニッケル、クロム、モリブデン、ベリリウムなどを含む合金が使われており、構造硬化（structural hardening）処理によって高い弾性限界と耐久性を備えている。

物理上の大きな課題はバネのトルク（回転力）が巻き上げ量（変位）に比例して変化する「フックの法則（Hooke's Law）」への対処である。時計の動力源としては最初から最後まで一定の力（定トルク）を出し続けるのが理想だが、実際のバネは巻き切った状態（フルワインド）でトルクが最大になり、解けるにつれて線形に低下する。トルクが変動するとテンプの振り角（Amplitude）が変わり、振り子の振幅によらず周期を一定に保つ等時性（Isochronism）が損なわれてしまう。

この制約を抑えるため、現代の主ゼンマイは解放状態で単純な渦巻きにならず、「S字型（S-shaped）」すなわち逆湾曲（Reverse curve）を描くように形状記憶されている。香箱内で巻き上げられる際、この逆湾曲部分は香箱の芯（アーバー）へ巻き付く力に抗して内壁側へ広がろうとする強い反発力を生む。ゼンマイが解けていく過程では、外側のコイルに残る反発力が内側のコイルのトルク低下を補うように働く。その結果、巻き上げ初期（高トルク）と末期（低トルク）の中間にあたる広い領域で、トルクカーブに比較的平坦な「プラトー（高原）」を形成できる。この平坦な領域を使うことで脱進機へ届くエネルギーの変動を抑え、実用上の精度を保っている。

### 1.2 香箱内のトライボロジーとエネルギー損失

手巻き時計の伝達効率と寿命は香箱内部の微細な摩擦管理（トライボロジー）に左右される。主ゼンマイは内端が香箱真（Barrel Arbor）に掛かり、外端は香箱の内壁に固定されるか強い摩擦で保持される。

ここでの摩擦には相反する条件が求められる。ゼンマイの各層（コイル）同士の摩擦はエネルギー放出を妨げてヒステリシスロス（履歴損失）を生むため、極力抑えなければならない。一方で、外端が香箱内壁で滑らずに留まるには、特に手巻きでは適切な摩擦が必要である。

自動巻き時計では、ローターが回り続けてもゼンマイが切れないよう、外端が香箱内壁を一定の力で滑る構造（スリッピングアタッチメント）を採り、内壁の溝と制動用グリスで滑り方を制御している。これに対し、手巻き専用ムーブメントの多くはゼンマイの外端を香箱に物理的に固定するか、段差へ強固に引っ掛けている。そのため巻き上げが限界に達すると、リュウズがそれ以上回らなくなる「ハードストップ」が生じる。この明確な止まり方が巻き上げ完了を伝える確かな手応えになる。

また研究によれば、香箱ドラムの摩耗や潤滑不足は脱進機へのエネルギー伝達効率を大きく落とす要因となる。香箱真や香箱内壁に施すコーティング（金メッキやニッケルなど）の厚みや表面粗さは摩耗の進み方に直結し、接触圧力・形状・摩擦特性を組み込んだ数理モデルから潤滑に必要な最小コーティング厚を導く実験も行われている。香箱内のエネルギー損失はテンプの振り角低下と精度悪化につながるため、現代の時計製造でも重要な研究テーマであり続けている。

### 1.3 トルクとパワーリザーブのトレードオフ

主ゼンマイの設計にはトルク（力強さ）と持続時間（パワーリザーブ）のトレードオフがある。トルクはゼンマイの厚みと幅に比例するが、厚くすれば香箱に収まる巻き数が減って持続時間が短くなる。反対に薄く長くすれば持続時間は伸びるものの、トルクが下がり、重い針を回す力や外部衝撃への耐性が弱まる。

一般的な手巻き時計のパワーリザーブは40時間前後だが、パネライなどの一部モデルでは薄いゼンマイと大型香箱、あるいは複数の香箱（ツインバレル）を組み合わせて8日間（192時間）以上のロングパワーリザーブを持たせている。駆動時間が長くなるほど、その間のトルク変動をどう抑えるかがさらに難しくなる。

## 2. リュウズから香箱への動力伝達機構

リュウズを指でつまんで回してから主ゼンマイに力が蓄えられるまでの経路には、回転方向を制御し、機能を切り替え、過度な力から機械を守るクラッチ機構と安全装置が組み込まれている。これらは「巻真・切り替え機構（Keyless Works）」および「巻き上げ機構（Winding Mechanism）」と呼ばれ、19世紀半ばに鍵（Key）を使わずリュウズだけで巻き上げと時刻合わせを行えるようにした技術革新に由来する。

### 2.1 オシドリとツヅミ車によるクラッチ機構

手巻き操作の感触と切り替えを担う主要部品は「キチ車（Winding Pinion）」と「ツヅミ車（Sliding Pinion / Clutch Wheel）」、そして両者を制御する「オシドリ（Setting Lever）」と「カンヌキ（Yoke）」である。これらは次の順序で連動する。

1. リュウズを押し込んだ通常位置（ポジション0）では、オシドリとカンヌキのバネ力によって、ツヅミ車が巻真の軸方向に沿ってキチ車側へ押し付けられている。
2. ツヅミ車とキチ車が向き合う面には、片側が垂直で反対側が緩やかな斜面になった鋸歯状の「ブレゲ歯（Breguet Ratchet）」が刻まれている。
3. リュウズを時計回りに回すと、巻真の四角い断面に嵌合したツヅミ車が回転し、ブレゲ歯の垂直面同士が噛み合ってキチ車へ無駄なく力を伝える。キチ車は丸穴車（Crown Wheel）を介して角穴車（Ratchet Wheel）を回し、香箱真を回転させてゼンマイを巻き上げる。
4. リュウズを反時計回りに回すと、ツヅミ車の斜面がキチ車の斜面を滑り上がり、ツヅミ車がバネに抗して一時的に後退するため歯が噛み合わず「空転」する。このとき指先に伝わる「カリカリ」という音と振動は、滑り上がった歯が次の谷へ落ちる衝突によるものである。このラチェット作用によって内部機構へ余計な力がかかるのを防ぎ、指を戻す動作を滑らかにする役割も持つ。

### 2.2 コハゼによる逆転防止とクリック音

ゼンマイを巻き上げると、その強い反発力で香箱真と角穴車はすぐに逆回転して解けようとする。それを食い止め、蓄えたエネルギーを保つ部品が「コハゼ（Click）」と「コハゼバネ（Click Spring）」である。爪状のコハゼが角穴車の歯に噛み込むことで、巻き上げ方向の回転だけを通し、解放方向の逆転を物理的に止める。

手巻き時計を巻くときに聞こえる「ジジジ」「チチチ」という小気味よい音は、コハゼが角穴車の歯を一つずつ乗り越え、コハゼバネの復元力で次の歯溝へ落ちる際の衝突音である。音の大きさや高さ、指先に伝わる振動（Haptic Feedback）はムーブメントの状態を知る手がかりになり、「エネルギーが確実に蓄えられている」と指先へ返す役割も持つ。手頃な価格帯の時計では軽いバネ音が混じることもあるが、高級機では重みのある澄んだクリック音が作り込まれる。

### 2.3 巻き心地の設計とグランドセイコー Cal. 9SA4

近年、とりわけ高級時計では巻ければよいという機能要件にとどまらず、「巻き心地（Winding Feel）」そのものが設計対象になっている。

2024年に発表されたグランドセイコーの手巻きハイビートムーブメント「Cal. 9SA4」では、コハゼとコハゼバネの設計に感性工学の手法が取り入れられた。コハゼは製造拠点の岩手県に生息する「セキレイ（wagtail）」の頭部を思わせる形をしており、鳥がついばむような動きを見せる。見た目の造形だけでなく、コハゼバネの張力とコハゼの質量を追い込むことで、巻き上げ時の音質とクリック感を整えている点が特徴である。

一般に自動巻き時計にも手巻き機能は備わるが、その感触はまるでサンドペーパーを擦るような「ジャリジャリ」とした手応えになることが多い。自動巻き機構の減速輪列や切替車が連動して高速回転するためである。対して手巻き専用ムーブメントは余分な連動部品が少ないため歯車の噛み合いをそのまま指先で感じることができ、粒立ちのよいクリック感と巻き切りでの明確なハードストップによって操作の「終わり」がはっきりと分かる。

## 3. トルク制御の歴史とストップワーク

ゼンマイが解けるにつれて出力トルクが下がる性質をどう抑え、等時性を保つかという問いに対し、かつての時計師と現代の設計者では異なる方法が採られてきた。

### 3.1 ジュネーブ・ストップワーク（マルタ十字）の役割

懐中時計の時代や、現代でも特に高い精度を狙う一部の時計には、「ジュネーブ・ストップワーク（Geneva Stop Work）」、別名「マルタ十字（Maltese Cross）」と呼ばれる機構が載せられてきた。香箱真に取り付けた「指（Finger）」と呼ばれる突起付きホイールと、香箱蓋の上で回る星型（凹状の切り欠きを持つ十字型）ホイールを噛み合わせる構造である。

ストップワークは「過剰な巻き上げによるゼンマイの破損防止」と説明されることが多いが、それは役割の一部にすぎず、本来の主目的は「トルクのクリッピング」にある。仮に主ゼンマイが理論上12.5回転できるとしても、巻き上げ直後の最初の数回転はトルクが強すぎて振り当たり（Knocking）を起こす危険があり、反対に最後の数回転はトルクが低すぎて精度が出ない。ジュネーブ・ストップワークはこの最初と最後のたとえば1.75回転ずつを物理的に使えないように制限し、トルクカーブが平坦な中間の領域（この例では9回転分）だけを使う。こうして駆動中のトルクを安定した範囲に揃えている。

### 3.2 ストップワークの衰退とリコイル・コハゼ

現代の一般的な手巻きムーブメント（Unitas 6497など）ではジュネーブ・ストップワークはほとんど見られない。理由は主に二つあり、合金製主ゼンマイ（ニヴァフレックスなど）とS字形状の普及でトルクカーブ自体が平坦になったことと、整備の手間とコストがかかることである。

代わりに広く使われているのが「リコイル・コハゼ（Recoil Click）」である。フルワインドまで巻き上げて指を離した直後、コハゼがわずかに逆戻り（リコイル）してからロックされるよう遊びを持たせてある。このわずかな「戻り」が巻き切り直後の過剰なピークトルクを逃がし、初期の振り当たりと部品への負荷を抑える。

### 3.3 アーミン・シュトロームによる現代の再設計

一方で、ストップワークを現代の設計へ組み直す動きもある。独立系ブランドのアーミン・シュトローム（Armin Strom）は「Gravity Equal Force」において、自動巻き機構とストップワークを世界で初めて組み合わせた。通常の自動巻きはスリッピングアタッチメントを使うためハードストップを持たないが、同作は香箱内のスリップ機構を残したまま、香箱の外側にジュネーブ・ストップワークに似た制限機構を設け、主ゼンマイの安定したトルク領域（72%の範囲）だけで駆動できるようにした。古典的な機構と現代の自動巻き設計を結びつけた意欲的な試みである。

## 4. ETA/Unitas 6497・6498の構造

手巻き時計の基本構造を知るうえで欠かせない実例が、現在も手巻きムーブメントの基準機（Reference）として扱われるETA/Unitas 6497（および6498）である。

### 4.1 基本仕様と歴史的背景

| 特性 | 詳細仕様 | 備考 |
| :---- | :---- | :---- |
| 直径 | 16.5リーニュ（約36.6mm） | 懐中時計由来の大型サイズ |
| 厚さ | 4.5mm | ローターを持たない手巻きならではの薄さ |
| 振動数 | 18,000振動/時 (2.5Hz) または 21,600振動/時 (3Hz) | -1型はロービート、-2型はハイビート化 |
| 石数 | 17石 | 摩擦低減に必要な基本構成 |
| パワーリザーブ | 約46〜56時間 | 大型香箱によるゆとりある持続時間 |

Unitas 6497はもともと1950年代に懐中時計用として開発されたムーブメントで、部品の一つひとつが大きく堅牢に作られている。クオーツショックを経て一度は姿を消しかけたが、1990年代後半からの大型腕時計ブーム、とりわけパネライ（Panerai）が「Cal. OP X」などとして採用したことを機に信頼性と視認性が見直され、再び広く使われるようになった。

6497と6498の主な違いはスモールセコンド（秒針）の位置にあり、懐中時計時代のケース様式に対応している。

- 6497 (Lépine) はリュウズの反対側に秒針が来る「オープンフェイス」懐中時計の配置で、腕時計としてリュウズを3時位置に置くと秒針は9時位置になる。
- 6498 (Savonnette/Hunter) はリュウズから90度ずれた位置に秒針が来る蓋付き「ハンターケース」懐中時計の配置で、腕時計に転用すると秒針が6時位置に来るため、端正なドレスウォッチに向く。

### 4.2 輪列構成とギア比

手巻き時計の輪列は香箱の回転を正確な時間単位へ置き換える減速機構である。Unitas 6498を例にギア比（Gear Ratio）を追うと次のようになる。

- 四番車（秒針）はガンギカナ（Escape Pinion）とのギア比が10:1（18,000振動/時・15歯ガンギ車で6秒に1回転する仕様の場合）などに設計されており、60秒で1回転する。
- 三番車は四番車との比率に7.5:1などが用いられ、7.5分で1回転する。
- 二番車（分針）は三番車との比率が8:1になっており、60分（7.5分×8）で1回転して分針を回す。

香箱の大きなトルクはこの減速比の積み重ねによって細かな時間の刻みへと変換される。裏蓋越しに見える歯車の噛み合いはその比率の計算をそのまま金属の機構として形にしたものである。

### 4.3 教材・カスタムベースとしてのUnitas 6497

構造が明快で部品も大きいUnitas 6497は、世界中の時計学校で分解・組立の教材に使われている。受け（ブリッジ）の面積が広いため、コート・ド・ジュネーブ（波状紋様）やペルラージュ（鱗状紋様）、スケルトン加工や彫金といった装飾も施しやすい。さらに、ハック機能（秒針停止機能）の追加やスワンネック緩急針の装着、チラネジ付きテンプへの換装など多様な改造ができる点も、愛好家や独立時計師にとって定番のベースムーブメントであり続ける理由になっている。

## 5. 複雑機構における手巻きの利点

複雑時計（コンプリケーション）では構造や厚みの面で合理的な選択として手巻き機構が採用されることが多い。

### 5.1 クロノグラフの操作感と視認性

ストップウォッチ機能を備えたクロノグラフ、なかでも「コラムホイール（Column Wheel）」式の手巻きクロノグラフは、プッシャーを押したときの操作感が「カム（Cam）」式より優れているとされる。プッシャーを押し込むと、コラムホイールの制御による硬質で歯切れのよい「カチッ」としたクリック感が指先に伝わり、カム式にありがちな「グニャッ」とした感触とははっきり異なる。加えて自動巻きローターがないため、複雑に組み合わさったレバーやハンマー、ホイールの動きを裏蓋から遮られることなく眺められる。A.ランゲ＆ゾーネの「ダトグラフ」などが手巻きを採用しているのも、機構の美しさを見せる狙いとムーブメントの厚みを抑える実用上の理由からである。

### 5.2 ミニッツリピーターとケース内の音響空間

音で時刻を告げる「ミニッツリピーター」でも、音響上の理由から手巻きが好まれる。自動巻きローターとその駆動輪列はケース内部の容積を奪うが、手巻きムーブメントならケース内に空洞（Air volume）を確保しやすく、そこがゴングの音を響かせる共鳴室（Resonance chamber）として働く。また、ローターの回転音やベアリングの摺動音は繊細なチャイム音を邪魔する雑音になり得るため、余計な可動音が出ない手巻きの方が澄んだ打刻音を引き出しやすい。

## 6. 手巻きという行為が持つ意味

手巻き時計が今も選ばれる理由は数値上のスペックや設計上の合理性だけでは語り切れない。そこには、使い手と時計との間に生まれる独特の関係がある。

### 6.1 2日で止まる不便さと能動的な時間管理

自動巻き時計は腕の動きに反応して受動的に巻き上がり、クオーツ時計は電池が切れるまで数年間、持ち主が何もしなくても動き続ける。それに対して手巻き時計は、人が意識してリュウズを巻かなければ、およそ2日以内に確実に止まる。

この「不便さ」がかえって手巻き時計ならではの価値を生んでいる。持ち主が手をかけなければ動き続けられないからこそ、毎日あるいは使うたびにゼンマイを巻く行為を通じて、自分の時間を手で管理する感覚が生まれる。かつて時計を巻くことは遅刻を許されない労働者や商人にとって社会的な責務（Slavery to the clock）でもあった。現代では逆に、スマートフォンによる受動的な時間消費から少し離れるきっかけになる。リュウズを巻く数秒の静かな手作業は「マインドフルネス」や「デジタルデトックス」にも通じる習慣（Ritual）として機能している。

### 6.2 停止と巻き上げが示す「死と再生」の比喩

手巻き時計が止まることは象徴的な「死」にあたる。針が止まり、テンプの鼓動が途絶えると、文字盤の上の時間は止まる。そこから持ち主がリュウズを巻き、エネルギーを送り込んでテンプが再び振動を始める瞬間は「再生（Rebirth）」になぞらえられる。

文学や神話学でジョセフ・キャンベルが提唱した「ヒーローの旅（Hero's Journey）」では、主人公が試練を経て生まれ変わる「死と再生」が描かれるが、止まった時計を巻いて再び動かすサイクルもこの循環の比喩として読める。静止した冷たい金属の塊に指先からエネルギーを吹き込み、心臓部であるテンプを動かすとき、持ち主は時計という小宇宙（Microcosm）を動かす担い手になる。また、ゼンマイが解けていく過程はエントロピーの増大にあたり、それを手で巻き戻す行為はエントロピーへの抵抗（ネゲントロピー）に対応する。止まっては巻く日々の繰り返しが、生活のリズムと時間の有限性を静かに意識させる。

### 6.3 ジョージ・ダニエルズと「機能する美」

20世紀を代表する時計師の一人であり、コーアクシャル脱進機の発明者でもあるジョージ・ダニエルズ（George Daniels）は、手巻き時計に対して明確な考えを持っていた。彼は時計の仕上げ（Finish）とは「ただの気難しい人々（fusspots）を満足させるための装飾」ではなく、すべての部品が均質に見え、滞りなく機能するための必然であると説いた。

代表作「スペース・トラベラー」をはじめとする彼の主要作品が手巻きなのも、自動巻きローターがムーブメントの半分を覆い隠し、時計師が手をかけて仕上げた輪列やテンプの振動、レバーの動きを視界から遮ってしまうからである。

手巻き時計ではシースルーバック越しにムーブメント全体を見渡せる。電子回路のようなブラックボックスとはちがい、力のつながりを目で追える「透明な機械」である。自分が指で巻いたエネルギーが一番車から二番車、三番車、四番車、ガンギ車へと伝わり、テンプによって時が刻まれる様子をそのまま観察できる。「機能する美」を味わえるこの構造こそ、ダニエルズやフィリップ・デュフォーといった独立時計師たちが手巻きにこだわる理由の核心でもある。

## おわりに

人の指の捻りだけを動力とする手巻き式機械時計は効率を優先する現代の基準で見れば「不完全」な機械かもしれない。しかし、S字型主ゼンマイやストップワークによるトルク管理、ツヅミ車とコハゼが返すクリック音とハードストップには、スマートウォッチのハプティックエンジンが模倣しようとする物理現象そのものの手応えがある。

自動巻きやクオーツが「時間を消費するための道具」だとすれば、手巻き時計は「時間を動かし、関わるための機械」である。リュウズを巻く指先に返ってくるバネの反発力は、香箱に蓄えられたポテンシャルエネルギーの重みであり、これから持ち主が過ごす時間の重みとしても感じられる。指先と歯車がじかに結びつくこの感覚こそが、技術が進んだ今も手巻き時計が愛され続ける理由である。

#### Works cited

1. A Guide To Mechanical Watch Movements | Calibre | Watches Of Switzerland UK, accessed November 15, 2025, [https://www.watches-of-switzerland.co.uk/calibre/inspiration/a-guide-to-mechanical-watch-movements](https://www.watches-of-switzerland.co.uk/calibre/inspiration/a-guide-to-mechanical-watch-movements)  
2. Podcast How Watches Work E3 \- Movements As Torque Managers \- BEYOND THE DIAL, accessed November 15, 2025, [https://www.beyondthedial.com/post/how-they-work-episode-3-torque/](https://www.beyondthedial.com/post/how-they-work-episode-3-torque/)  
3. The Mechanical Watch Movement \- From Spring to Spring \- SNGLRTY Watch, accessed November 15, 2025, [https://www.snglrtywatch.com/all/how-watches-work/mechanical-watch-movement/](https://www.snglrtywatch.com/all/how-watches-work/mechanical-watch-movement/)  
4. The Allure of Manual Winding in Luxury Timekeeping. \- RESERVOIR watch, accessed November 15, 2025, [https://www.reservoir-watch.com/services/glossary/manual-winding-luxury-mechanical-watches-explained/](https://www.reservoir-watch.com/services/glossary/manual-winding-luxury-mechanical-watches-explained/)  
5. All Hail the Mighty Mainspring \- LIV Swiss Watches, accessed November 15, 2025, [https://www.livwatches.com/en-au/blogs/everything-about-watches/hail-mighty-mainspring](https://www.livwatches.com/en-au/blogs/everything-about-watches/hail-mighty-mainspring)  
6. Mainspring \- Wikipedia, accessed November 15, 2025, [https://en.wikipedia.org/wiki/Mainspring](https://en.wikipedia.org/wiki/Mainspring)  
7. Inside the Mainspring: The Power Behind Your Timepiece \- 4 Ω'Clock, accessed November 15, 2025, [https://itsfouroclock.wordpress.com/2018/09/13/automatic-watch-mainspring/](https://itsfouroclock.wordpress.com/2018/09/13/automatic-watch-mainspring/)  
8. Technical Perspective: The Where, How, And Why Of Constant Force Mechanisms In Watchmaking \- Hodinkee, accessed November 15, 2025, [https://www.hodinkee.com/articles/a-close-look-at-constant-force-in-watchmaking](https://www.hodinkee.com/articles/a-close-look-at-constant-force-in-watchmaking)  
9. Armin Strom Gravity Equal Force Technical Review \- Professional Watches, accessed November 15, 2025, [https://professionalwatches.com/technical-review-of-the-armin-strom-gravity-equal-force/](https://professionalwatches.com/technical-review-of-the-armin-strom-gravity-equal-force/)  
10. ELI5: How do mechanical (automatic) watches keep time exactly when springs exert different amounts of force depending on how tightly wound they are? : r/explainlikeimfive \- Reddit, accessed November 15, 2025, [https://www.reddit.com/r/explainlikeimfive/comments/15v0lsh/eli5\_how\_do\_mechanical\_automatic\_watches\_keep/](https://www.reddit.com/r/explainlikeimfive/comments/15v0lsh/eli5_how_do_mechanical_automatic_watches_keep/)  
11. Mechanical Watch \- Bartosz Ciechanowski, accessed November 15, 2025, [https://ciechanow.ski/mechanical-watch/](https://ciechanow.ski/mechanical-watch/)  
12. File:Mainspring torque curves.svg \- Wikimedia Commons, accessed November 15, 2025, [https://commons.wikimedia.org/wiki/File:Mainspring\_torque\_curves.svg](https://commons.wikimedia.org/wiki/File:Mainspring_torque_curves.svg)  
13. Tribological Approach to the Watch Movements \- EPFL Graph Search, accessed November 15, 2025, [https://graphsearch.epfl.ch/en/publication/275344](https://graphsearch.epfl.ch/en/publication/275344)  
14. \[Question\] Why do some movements make distinct clicking sounds when wound (ETA 6498, lots of older non-autos) while others (ETA 2824, all Rolexes, etc) make more of a smooth sound \-- almost like sandpaper \-- when wound? : r/Watches \- Reddit, accessed November 15, 2025, [https://www.reddit.com/r/Watches/comments/trvzgj/question\_why\_do\_some\_movements\_make\_distinct/](https://www.reddit.com/r/Watches/comments/trvzgj/question_why_do_some_movements_make_distinct/)  
15. Best place to source new mainsprings? : r/watchrepair \- Reddit, accessed November 15, 2025, [https://www.reddit.com/r/watchrepair/comments/1br8frv/best\_place\_to\_source\_new\_mainsprings/](https://www.reddit.com/r/watchrepair/comments/1br8frv/best_place_to_source_new_mainsprings/)  
16. ETA 6497 \- Grail Watch Wiki, accessed November 15, 2025, [https://wiki.grail-watch.com/index.php/ETA\_6497](https://wiki.grail-watch.com/index.php/ETA_6497)  
17. Watchmaker's Bench: What Makes It Tick? (Part 3\) \- Keyless Works and the Hand Setting Mechanism \- Worn & Wound, accessed November 15, 2025, [https://wornandwound.com/watchmakers-bench-what-makes-it-tick-part-3-keyless-works-and-the-hand-setting-mechanism/](https://wornandwound.com/watchmakers-bench-what-makes-it-tick-part-3-keyless-works-and-the-hand-setting-mechanism/)  
18. 用語集【ま～わ】 | 時計修理 宝石・時計いのうえ, accessed November 15, 2025, [https://www.inouewatch.com/trivia-term/1610](https://www.inouewatch.com/trivia-term/1610)  
19. Every part of a watch movement, from screw to pinion, accessed November 15, 2025, [https://timeandtidewatches.com/watch-movement-parts-watch-education/](https://timeandtidewatches.com/watch-movement-parts-watch-education/)  
20. Parts Of A Watch Explained \- Jack Mason, accessed November 15, 2025, [https://jackmasonbrand.com/blogs/news/explained-the-different-parts-of-a-watch](https://jackmasonbrand.com/blogs/news/explained-the-different-parts-of-a-watch)  
21. Unitas 6497 Movement \- The Watchmakers Friend\! \- YouTube, accessed November 15, 2025, [https://www.youtube.com/watch?v=zffQ6YhT8bk](https://www.youtube.com/watch?v=zffQ6YhT8bk)  
22. Keyless Work \- Vintage Watch Straps, accessed November 15, 2025, [https://www.vintagewatchstraps.com/keylesswork.php](https://www.vintagewatchstraps.com/keylesswork.php)  
23. Caliber 9SA4 \- Grand Seiko, accessed November 15, 2025, [https://www.grand-seiko.com/us-en/collections/movement/mechanical/9sa4](https://www.grand-seiko.com/us-en/collections/movement/mechanical/9sa4)  
24. Watch 101 — Click \- Hodinkee, accessed November 15, 2025, [https://www.hodinkee.com/watch101/click](https://www.hodinkee.com/watch101/click)  
25. Hands On: Grand Seiko “Birch Bark” SLGW002 and SLGW003 | SJX Watches, accessed November 15, 2025, [https://watchesbysjx.com/2024/05/grand-seiko-birch-bark-slgw002-slgw003-review.html](https://watchesbysjx.com/2024/05/grand-seiko-birch-bark-slgw002-slgw003-review.html)  
26. \[VIDEO\] Hands-on Impressions of the Beautifully Slender Grand Seiko SLGW002 and SLGW003 \- Worn & Wound, accessed November 15, 2025, [https://wornandwound.com/video-hands-on-impressions-of-the-beautifully-slender-grand-seiko-slgw002-and-slgw003/](https://wornandwound.com/video-hands-on-impressions-of-the-beautifully-slender-grand-seiko-slgw002-and-slgw003/)  
27. Up Close: Nomos Orion Hand-Wind \- SJX Watches, accessed November 15, 2025, [https://watchesbysjx.com/2020/08/13](https://watchesbysjx.com/2020/08/13)  
28. Geneva Stopwork \- YouTube, accessed November 15, 2025, [https://www.youtube.com/watch?v=l7cyHiuKWuY](https://www.youtube.com/watch?v=l7cyHiuKWuY)  
29. How it Works: Malta Cross (Geneva) Mechanism \- All-Terrain Family, accessed November 15, 2025, [https://allterrainfam.com/how-it-works-malta-cross-geneva-mechanism/](https://allterrainfam.com/how-it-works-malta-cross-geneva-mechanism/)  
30. Geneva drive \- Wikipedia, accessed November 15, 2025, [https://en.wikipedia.org/wiki/Geneva\_drive](https://en.wikipedia.org/wiki/Geneva_drive)  
31. Blog: Stop Work and Recoiling Clicks \- Vintage Watch Straps, accessed November 15, 2025, [https://www.vintagewatchstraps.com/blogstopwork.php](https://www.vintagewatchstraps.com/blogstopwork.php)  
32. Gravity Equal Force Ultimate Sapphire \- Armin Strom, accessed November 15, 2025, [https://arminstrom.com/watch-collections/gravity-equal-force-ultimate-sapphire/](https://arminstrom.com/watch-collections/gravity-equal-force-ultimate-sapphire/)  
33. Introducing The Armin Strom Gravity Equal Force System 78 Watches \- WristReview.com, accessed November 15, 2025, [https://wristreview.com/introducing-the-armin-strom-gravity-equal-force-system-78-watches/](https://wristreview.com/introducing-the-armin-strom-gravity-equal-force-system-78-watches/)  
34. Armin Strom Gravity Equal Force: Invention Is No Accident, Or How To Start Fresh, accessed November 15, 2025, [https://quillandpad.com/2019/11/23/armin-strom-gravity-equal-force-invention-is-no-accident-or-how-to-start-fresh/](https://quillandpad.com/2019/11/23/armin-strom-gravity-equal-force-invention-is-no-accident-or-how-to-start-fresh/)  
35. Armin Strom Orbit: The Best Watch With A Date Complication Currently Available, accessed November 15, 2025, [https://quillandpad.com/2022/04/13/armin-strom-orbit-the-best-watch-with-a-date-complication-currently-available/](https://quillandpad.com/2022/04/13/armin-strom-orbit-the-best-watch-with-a-date-complication-currently-available/)  
36. ETA/Unitas Caliber 6497 Watch Movement, accessed November 15, 2025, [https://calibercorner.com/unitas-caliber-6497/](https://calibercorner.com/unitas-caliber-6497/)  
37. Unitas 6497 \- Ranfft DB, accessed November 15, 2025, [https://ranfft.org/caliber/10348-Unitas-6497](https://ranfft.org/caliber/10348-Unitas-6497)  
38. Unitas 6497: The Surprisingly Versatile Calibre : \- Deployant :, accessed November 15, 2025, [https://deployant.com/unitas-6497-the-surprisingly-versatile-calibre/](https://deployant.com/unitas-6497-the-surprisingly-versatile-calibre/)  
39. In-Depth: The History of the ETA Unitas 6497 and 6498 \- Monochrome Watches, accessed November 15, 2025, [https://monochrome-watches.com/history-eta-unitas-6497-and-6498-hand-wound-lepine-savonette-movements-technical-guide/](https://monochrome-watches.com/history-eta-unitas-6497-and-6498-hand-wound-lepine-savonette-movements-technical-guide/)  
40. Unitas/ETA 6497 \- Horology student, accessed November 15, 2025, [http://horology-student.org/movements/modern-eta-and-clones/unitas-eta-6497-6498/](http://horology-student.org/movements/modern-eta-and-clones/unitas-eta-6497-6498/)  
41. Up Close: Keaton Myrick '1 of 30' Wristwatch \- SJX Watches, accessed November 15, 2025, [https://watchesbysjx.com/2020/02/19](https://watchesbysjx.com/2020/02/19)  
42. What is Mono-pusher Chronograph? \- Barrington Watch Winders, accessed November 15, 2025, [https://barringtonwatchwinders.com/en-us/pages/mono-pusher-chronograph-1](https://barringtonwatchwinders.com/en-us/pages/mono-pusher-chronograph-1)  
43. Spring Drive Chronograph 9R86 and SBGC201 | GS9 Club | Grand Seiko, accessed November 15, 2025, [https://grandseikogs9club.com/chronicle-9/spring-drive-chronograph-gmt-sbgc201/](https://grandseikogs9club.com/chronicle-9/spring-drive-chronograph-gmt-sbgc201/)  
44. Here's Why: Manual Winding Watches Are For Horological Connoisseurs \- Reprise, accessed November 15, 2025, [https://quillandpad.com/2019/01/13/heres-why-manual-winding-watches-are-for-horological-connoisseurs/](https://quillandpad.com/2019/01/13/heres-why-manual-winding-watches-are-for-horological-connoisseurs/)  
45. The Art of Complications \- The Minute Repeater \- Watch Advice, accessed November 15, 2025, [https://www.watchadvice.com.au/28252/the-art-of-complications-the-minute-repeater/](https://www.watchadvice.com.au/28252/the-art-of-complications-the-minute-repeater/)  
46. Harmony, music and mechanics: what is a striking watch? \- Hour Passion, accessed November 15, 2025, [https://www.hourpassion.com/en/news/harmony-music-and-mechanics-what-striking-watch](https://www.hourpassion.com/en/news/harmony-music-and-mechanics-what-striking-watch)  
47. Holding on to Time \- Bowearswatches, accessed November 15, 2025, [https://bowearswatches.com/holding-on-to-time/](https://bowearswatches.com/holding-on-to-time/)  
48. Tick talk: what is a manual movement? \- H. Moser & Cie., accessed November 15, 2025, [https://h-moser.com/chronicles/very-rare-knowledge/manual-movement/](https://h-moser.com/chronicles/very-rare-knowledge/manual-movement/)  
49. Winding Watches and The Mechanics Art Behind It, accessed November 15, 2025, [https://www.wryst-timepieces.com/en/blog/winding-watches-guide-hand-vs-self-winding-mechanics-b826.htm](https://www.wryst-timepieces.com/en/blog/winding-watches-guide-hand-vs-self-winding-mechanics-b826.htm)  
50. A History of Independent Watchmaking \- Curated by Phillips \- WatchProSite, accessed November 15, 2025, [https://www.watchprosite.com/editors-picks/a-history-of-independent-watchmaking--curated-by-phillips/16.1284121.10856446/](https://www.watchprosite.com/editors-picks/a-history-of-independent-watchmaking--curated-by-phillips/16.1284121.10856446/)  
51. Understanding Watch Movements: Manual, Automatic, and Quartz Explained, accessed November 15, 2025, [https://www.grayandsons.com/blog/understanding-watch-movements-manual-automatic-and-quartz-explained/](https://www.grayandsons.com/blog/understanding-watch-movements-manual-automatic-and-quartz-explained/)  
52. The Hour Glass honours artisanal watchmaking in 'The Persistence of Memory' exhibition, accessed November 15, 2025, [https://www.optionstheedge.com/topic/watches/hour-glass-honours-artisanal-watchmaking-persistence-memory-exhibition](https://www.optionstheedge.com/topic/watches/hour-glass-honours-artisanal-watchmaking-persistence-memory-exhibition)
