/* ══════════════════════════════════════════════════════════════
   AELDRIN'S TABLE — 地下城主的旧日卷帙
   D&D 5e 本地跑团桌面 · 无账号 · 无上传 · 无遥测
   ══════════════════════════════════════════════════════════════ */
(() => {
'use strict';

/* ─────────────── 1. 规则数据 ─────────────── */

const AB = {
  str: { zh:'力量', short:'STR' }, dex: { zh:'敏捷', short:'DEX' },
  con: { zh:'体质', short:'CON' }, int: { zh:'智力', short:'INT' },
  wis: { zh:'感知', short:'WIS' }, cha: { zh:'魅力', short:'CHA' }
};
const ABKEYS = Object.keys(AB);

const SKILLS = [
  { n:'运动', a:'str' }, { n:'体操', a:'dex' }, { n:'巧手', a:'dex' }, { n:'隐匿', a:'dex' },
  { n:'奥秘', a:'int' }, { n:'历史', a:'int' }, { n:'调查', a:'int' }, { n:'自然', a:'int' }, { n:'宗教', a:'int' },
  { n:'驯兽', a:'wis' }, { n:'洞悉', a:'wis' }, { n:'医药', a:'wis' }, { n:'察觉', a:'wis' }, { n:'生存', a:'wis' },
  { n:'欺瞒', a:'cha' }, { n:'威吓', a:'cha' }, { n:'表演', a:'cha' }, { n:'说服', a:'cha' }
];
const SKILL_MAP = Object.fromEntries(SKILLS.map(s => [s.n, s]));

/* ── 种族：flavor = 世界观叙述（沉浸）／mech = 规则数值（机制） ── */
const RACES = {
  '人类': {
    bonus:{ str:1,dex:1,con:1,int:1,wis:1,cha:1 }, speed:30, size:'中型', note:'全属性 +1 · 额外技能与语言',
    flavor:'精灵说人类像蜉蝣，矮人说人类像野火。\n\n但正是这群只有七八十年可活的家伙，把荒原犁成了王国，把商路铺过了山脉，把名字刻进了连巨龙都不愿再提的史书里。他们没有精灵的寿数去等待，也没有矮人的耐心去雕琢，所以他们什么都试一点、什么都学一些——然后用最笨也最狠的方式，在世界上留下自己的痕迹。\n\n你的同伴会老去，你的敌手会记得你。这就是人类的活法：短暂，且不留余地。',
    mech:[
      ['属性加值','六项属性全部 +1'],
      ['速度','30 尺'],
      ['体型','中型'],
      ['额外技能','自选 1 项技能熟练'],
      ['语言','通用语 + 1 门自选语言'],
      ['点评','没有任何短板，也没有任何专长。适合你想自由发挥的时候。']
    ]
  },
  '高等精灵': {
    bonus:{ dex:2, int:1 }, speed:30, size:'中型', note:'黑暗视觉 · 法师戏法 · 长剑长弓熟练',
    flavor:'在月亮升起之前，高等精灵的城市就已经在计算星辰的轨迹了。\n\n他们不称自己为「高贵」，因为在他们看来那只是事实陈述。一个高等精灵的一生可能横跨三个王朝，因此他们把急躁视为最没有教养的表现——你说话慢一点，会有人愿意听的。\n\n只是别在精灵的酒馆里提起「人类的十年计划」，他们会笑出声。',
    mech:[
      ['属性加值','敏捷 +2，智力 +1'],
      ['速度','30 尺｜中型'],
      ['黑暗视觉','黑暗中可视 60 尺（暗处视为微光）'],
      ['精灵血统','对魅惑免疫；魔法无法使你入睡'],
      ['敏锐感官','自动获得「察觉」技能熟练'],
      ['戏法','自选 1 个法师戏法（如「火焰箭」）。施法属性为智力'],
      ['武器熟练','长剑、短剑、短弓、长弓']
    ]
  },
  '木精灵': {
    bonus:{ dex:2, wis:1 }, speed:35, size:'中型', note:'速度 35 · 野地潜行 · 察觉熟练',
    flavor:'城墙是石头的谎言。木精灵不住在墙里，他们住在树与树之间的空隙中。\n\n他们脚步极轻，轻到一片落叶会主动为他们让路。边境的猎人有个说法：如果你在林子里听到身后有木精灵的呼吸，那说明他已经跟了你两天，而且决定让你知道。\n\n他们对陌生人有耐心，对砍树的人没有。',
    mech:[
      ['属性加值','敏捷 +2，感知 +1'],
      ['速度','35 尺（全种族最快）｜中型'],
      ['黑暗视觉','黑暗中可视 60 尺'],
      ['精灵血统','魅惑免疫；魔法无法使你入睡'],
      ['敏锐感官','自动获得「察觉」技能熟练'],
      ['野地疾行','潜行时仍可保持正常移动速度，且可在轻度自然遮蔽中尝试隐藏']
    ]
  },
  '丘陵矮人': {
    bonus:{ con:2, wis:1 }, speed:25, size:'中型', note:'额外 HP · 毒素抗性 · 每级 +1 生命',
    flavor:'山里的矮人不写史书，他们凿史书。\n\n丘陵矮人在地下挖出的厅堂能装下整座人类的城镇，而他们最引以为傲的不是金子，是「从来没塌过」。这种骄傲是有道理的：矮人建的东西，三千年后还在。\n\n他们记仇，也记恩。一杯酒能交上朋友，一次背信会换来三代人的沉默。',
    mech:[
      ['属性加值','体质 +2，感知 +1'],
      ['速度','25 尺（穿重甲不减速）｜中型'],
      ['黑暗视觉','黑暗中可视 60 尺'],
      ['矮人韧性','毒素伤害抗性；对抗毒素的豁免具有优势'],
      ['石匠专精','涉及石建筑的「历史」检定掷两次（取高）'],
      ['丘陵坚韧','等级提升时，生命上限额外 +1／级（已自动计入 HP）'],
      ['武器熟练','战斧、手斧、轻锤、战锤']
    ]
  },
  '山地矮人': {
    bonus:{ con:2, str:2 }, speed:25, size:'中型', note:'中甲熟练 · 力量型矮人',
    flavor:'山地矮人住得比丘陵同胞更高，也更不满。\n\n他们在岩脊上修了没有门的要塞——因为「门」意味着有人可以敲。山地矮人锻造的盔甲比大多数国家的城墙还厚，而他们本人大概也差不多。\n\n要塞里的家规只有一条：能自己扛下来的，不要问别人。',
    mech:[
      ['属性加值','体质 +2，力量 +2'],
      ['速度','25 尺｜中型'],
      ['黑暗视觉','黑暗中可视 60 尺'],
      ['矮人韧性','毒素伤害抗性；对抗毒素的豁免具有优势'],
      ['矮人战训','获得轻甲与中甲熟练'],
      ['石匠专精','涉及石建筑的「历史」检定掷两次（取高）'],
      ['武器熟练','战斧、手斧、轻锤、战锤']
    ]
  },
  '半身人': {
    bonus:{ dex:2, cha:1 }, speed:25, size:'小型', note:'幸运 · 勇敢 · 体型小',
    flavor:'别的种族把冒险叫做「征程」，半身人把它叫做「出门」。\n\n他们个子小，胃口大，运气好得离谱。一个半身人从三层楼高的塔上摔下来，大概率会落进干草堆；如果他掉进的是河，那河里大概正好有条船。\n\n精灵把这叫「命运眷顾」。半身人自己管这叫「早饭吃得对」。',
    mech:[
      ['属性加值','敏捷 +2，魅力 +1'],
      ['速度','25 尺｜小型（可穿过更大生物占据的空间）'],
      ['幸运','攻击检定、属性检定或豁免骰出自然 1 时，可以重掷一次（每骰一次）'],
      ['勇敢','对抗恐惧的豁免具有优势'],
      ['半身人灵巧','可移动穿过任何体型大于你的生物所占据的空间'],
      ['语言','通用语与半身人语']
    ]
  },
  '龙裔': {
    bonus:{ str:2, cha:1 }, speed:30, size:'中型', note:'龙息武器 · 元素抗性',
    flavor:'龙裔不崇拜龙。他们记得龙。\n\n很久以前，他们的祖先用契约而非刀剑从巨龙那里换来了血脉。所以每个龙裔出生时，血液里就烧着一种元素——有人吐火，有人吐酸，有人吐雷。\n\n他们重视荣誉，因为荣誉是唯一能代代相传而不衰减的财产。龙裔的一个承诺，通常比人类的十条法律更管用。',
    mech:[
      ['属性加值','力量 +2，魅力 +1'],
      ['速度','30 尺｜中型'],
      ['龙族血脉','选择一种龙（决定元素类型：火焰／寒冷／闪电／强酸／毒素）'],
      ['元素抗性','获得所选元素的伤害抗性'],
      ['龙息武器','用一个动作喷吐元素，锥形 15 尺或直线 30 尺，伤害 2d6（每级 +1d6 上限 5d6）'],
      ['吐息 DC','8 + 体质调整值 + 熟练加值；成功则伤害减半。每次长休后恢复使用次数']
    ]
  },
  '侏儒': {
    bonus:{ int:2, dex:1 }, speed:25, size:'小型', note:'法术抗性 · 智力型小手',
    flavor:'侏儒的寿命比人类长得多，但他们把大部分时间花在了「这个能不能再小一点」上。\n\n他们发明了会自己转的齿轮、会说谎的钟、以及一种把爆炸装进玻璃球的方法。人类管这个叫「炼金术」，侏儒管这个叫「周二」。\n\n如果你在洞穴里听见有人一边咯咯笑一边拧什么东西，那大概率不是好事。',
    mech:[
      ['属性加值','智力 +2，敏捷 +1'],
      ['速度','25 尺｜小型'],
      ['黑暗视觉','黑暗中可视 60 尺'],
      ['侏儒狡黠','对抗智力、感知、魅力豁免的魔法效应时具有优势'],
      ['工匠直觉','自选一门工匠工具熟练（如修补匠工具）'],
      ['语言','通用语与侏儒语']
    ]
  },
  '半精灵': {
    bonus:{ cha:2, dex:1, wis:1 }, speed:30, size:'中型', note:'魅力 +2 · 两项技能 · 全能',
    flavor:'半精灵从不完全属于任何一边。\n\n人类的村庄觉得他们眼睛太亮，精灵的殿堂觉得他们走得太快。于是他们大多成了旅行者、译员、走私客、外交官——那些必须在两堵墙之间说话的人。\n\n这种夹缝里的活法有一种好处：他们对任何人都没有天生的忠诚，因此可以和任何人谈成任何事。',
    mech:[
      ['属性加值','魅力 +2，另自选两项属性各 +1'],
      ['速度','30 尺｜中型'],
      ['黑暗视觉','黑暗中可视 60 尺'],
      ['精灵血统','魅惑免疫；魔法无法使你入睡'],
      ['多才多艺','自选 2 项技能熟练'],
      ['语言','通用语、精灵语 + 1 门自选语言']
    ]
  },
  '半兽人': {
    bonus:{ str:2, con:1 }, speed:30, size:'中型', note:'凶蛮攻击 · 坚韧不屈',
    flavor:'半兽人的童年通常很短，也很响。\n\n他们比同族更早学会用拳头解决问题，也更早学会——在挨了第一刀之后还站着——这件事本身有多重要。别人靠盔甲活下来，半兽人靠不肯倒下来活下来。\n\n兽人部落里有句老话：「半兽人只有两种状态：站着，或者今天不想站。」',
    mech:[
      ['属性加值','力量 +2，体质 +1'],
      ['速度','30 尺｜中型'],
      ['黑暗视觉','黑暗中可视 60 尺'],
      ['凶蛮攻击','近战武器打出重击时，额外掷一个伤害骰'],
      ['坚韧不屈','生命降至 0 时，可改为降至 1 点。每次长休后恢复一次'],
      ['威吓熟练','自动获得「威吓」技能熟练'],
      ['语言','通用语与兽人语']
    ]
  },
  '提夫林': {
    bonus:{ cha:2, int:1 }, speed:30, size:'中型', note:'炼狱抗性 · 天生施法',
    flavor:'你出生那天，接生婆看了一眼就退了两步。\n\n一笔很久以前的交易，落在了你祖先身上，而你继承了账单的一部分。角、尾巴、还有旁人那种先看眼睛再看手的目光，都是收据。\n\n但提夫林有一个别人没有的本事：被人从第一天起就不信任，会让你很快学会怎么让人信任你。',
    mech:[
      ['属性加值','魅力 +2，智力 +1'],
      ['速度','30 尺｜中型'],
      ['黑暗视觉','黑暗中可视 60 尺'],
      ['炼狱抗性','获得火焰伤害抗性'],
      ['奇术','掌握戏法「奇术」（制造声音、小幻象等）'],
      ['一级法术','3 级起可每日一次施展「炼狱斥责」，魅力为施法属性'],
      ['语言','通用语与炼狱语']
    ]
  },
  '阿斯莫': {
    bonus:{ cha:2, str:1 }, speed:30, size:'中型', note:'治愈之手 · 天界血统',
    flavor:'阿斯莫的血脉里有一道来自上界的光。\n\n它不会让你长出翅膀，也不会让你说话带回声——但它会在你握住别人手腕的时候，从掌心渗出去一点温度。村里的老人会明白那是什么，然后跪下。\n\n麻烦在于，光只负责照亮，不负责告诉你该往哪走。',
    mech:[
      ['属性加值','魅力 +2，力量 +1'],
      ['速度','30 尺｜中型'],
      ['黑暗视觉','黑暗中可视 60 尺'],
      ['天界抗性','获得光耀与死灵伤害抗性'],
      ['治愈之手','一个动作触碰目标，回复等同于等级的 HP。每次长休后恢复一次'],
      ['光明使者','掌握戏法「光亮术」'],
      ['语言','通用语与天界语']
    ]
  }
};

/* ── 职业：hd 生命骰／prim 主属性／saves 豁免熟练／sk 可选技能 ── */
const CLASSES = {
  '野蛮人': {
    hd:12, prim:'str', saves:['str','con'], note:'最高生命骰 · 狂暴 · 无甲防御',
    sk:{ count:2, list:['运动','驯兽','威吓','自然','察觉','生存'] },
    equip:['巨斧','手斧 ×2','探索者背包','标枪 ×4'],
    flavor:'文明是一种协议。野蛮人不签这个协议。\n\n你从不需要理由去发怒，你需要的只是一个方向。你的同伴靠盔甲和法术活下来，你靠一件事：在别人倒下之前，你先把他劈成两半。\n\n有人管这叫野性。你管这叫效率。',
    mech:[
      ['生命骰','d12（全职业最高，平均每次升级 +7 HP）'],
      ['主属性','力量'],
      ['豁免熟练','力量、体质'],
      ['护甲熟练','轻甲、中甲、盾牌'],
      ['武器熟练','简易武器、军用武器'],
      ['特性 · 狂暴','附赠动作进入狂暴：近战伤害 +2；受到钝击／穿刺／挥砍伤害减半。战斗结束或 1 分钟后退散'],
      ['特性 · 无甲防御','不穿甲时，AC = 10 + 敏捷调整值 + 体质调整值']
    ]
  },
  '战士': {
    hd:10, prim:'str', saves:['str','con'], note:'最全能的前排 · 战斗风格 · 回气',
    sk:{ count:2, list:['运动','驯兽','历史','洞悉','威吓','察觉','生存'] },
    equip:['长剑','盾牌','链甲衫','轻弩与弩矢 ×20','探索者背包'],
    flavor:'别人在打仗的间隙里生活，战士在生活中随时准备打仗。\n\n你数过自己身上有多少道疤，也数过多少次是靠多站了一秒钟才活下来的。你的世界很简单：前面有敌人，你就在前面；同伴在后面，你就留在后面。\n\n所有战术手册的第一页都写着同一句话——「先活下来」。',
    mech:[
      ['生命骰','d10（平均每次升级 +6 HP）'],
      ['主属性','力量 或 敏捷'],
      ['豁免熟练','力量、体质'],
      ['护甲熟练','全部护甲与盾牌'],
      ['武器熟练','简易武器、军用武器'],
      ['特性 · 战斗风格','1 级自选：箭术（远程攻击 +2）／防御（穿甲时 AC +1）／巨武器战斗／双武器战斗'],
      ['特性 · 回气','附赠动作回复 1d10 + 等级 点 HP，每次短休后恢复']
    ]
  },
  '圣武士': {
    hd:10, prim:'str', saves:['wis','cha'], note:'誓言与重击之王 · 圣疗',
    sk:{ count:2, list:['运动','洞悉','威吓','医药','说服','宗教'] },
    equip:['战锤','盾牌','链甲','圣徽','祭司包'],
    flavor:'你的力量不是从剑上来的，是从一句你说过的、并且不打算收回的话里来的。\n\n誓言是圣武士的骨。它让你能在最该逃跑的那一刻站住，代价是——你必须一辈子记得自己答应过什么。\n\n神不需要你完美。神只需要你在没有人看着的时候，也说话算数。',
    mech:[
      ['生命骰','d10（平均每次升级 +6 HP）'],
      ['主属性','力量 与 魅力'],
      ['豁免熟练','感知、魅力'],
      ['护甲熟练','全部护甲与盾牌'],
      ['特性 · 神圣感知','一个动作感知 60 尺内的天界／邪魔／不死生物'],
      ['特性 · 圣疗','一池治疗能量（等级 × 5 点），一次触碰可消耗任意点数治疗目标'],
      ['特性 · 神圣重击','2 级起，命中后可消耗法术位追加 2d8 光耀伤害']
    ]
  },
  '游侠': {
    hd:10, prim:'dex', saves:['str','dex'], note:'弓箭与荒野 · 猎人印记',
    sk:{ count:3, list:['运动','驯兽','洞悉','调查','自然','察觉','隐匿','生存'] },
    equip:['长弓与箭矢 ×20','短剑 ×2','皮甲','探索者背包'],
    flavor:'你走过的地方没有路，只有你走过。\n\n城里的墙对你是噪音，林子里的风才是信息。你能从一根断枝的朝向看出那东西有多重、走了多久、还剩多久的路。\n\n你不是猎人，也不是士兵。你是介于两者之间的那种人——文明用来盯着荒野的那双眼睛。',
    mech:[
      ['生命骰','d10（平均每次升级 +6 HP）'],
      ['主属性','敏捷 与 感知'],
      ['豁免熟练','力量、敏捷'],
      ['护甲熟练','轻甲、中甲、盾牌'],
      ['特性 · 宿敌','自选一类敌手（如兽类、不死、巨人），追踪与回忆相关信息时具有优势'],
      ['特性 · 自然探索者','自选一种地形（森林、山地、沼泽…），在其中旅行与导航极快且不会迷路'],
      ['法术 · 猎人印记','以附赠动作标记目标，对其每次攻击额外造成 1d6 伤害']
    ]
  },
  '盗贼': {
    hd:8, prim:'dex', saves:['dex','int'], note:'技能最多 · 偷袭 · 灵巧动作',
    sk:{ count:4, list:['体操','运动','欺瞒','洞悉','威吓','调查','察觉','表演','说服','巧手','隐匿'] },
    equip:['短剑','短弓与箭矢 ×20','皮甲','盗贼工具','窃贼包'],
    flavor:'锁不是障碍，锁是一道题。\n\n你知道城里每一堵墙的厚度，也知道哪扇门后面的狗睡得比较沉。你从正面打不过任何人，所以你不打正面——你从侧面、从背后、从没有人检查过的地方过去。\n\n你唯一的原则是：活着回来的才是好计划。',
    mech:[
      ['生命骰','d8（平均每次升级 +5 HP）'],
      ['主属性','敏捷'],
      ['豁免熟练','敏捷、智力'],
      ['特性 · 偷袭','攻击具有优势（或敌人旁边有队友）时，额外造成 1d6 伤害，每两级 +1d6'],
      ['特性 · 专精','2 项熟练技能的加值翻倍'],
      ['特性 · 灵巧动作','2 级起每回合可用附赠动作执行：疾走、撤离或躲藏'],
      ['工具','盗贼工具熟练（开锁、解除陷阱）']
    ]
  },
  '武僧': {
    hd:8, prim:'dex', saves:['str','dex'], note:'气 · 无甲防御 · 徒手连击',
    sk:{ count:2, list:['体操','运动','历史','洞悉','宗教','隐匿'] },
    equip:['短剑','探索者背包','修行者服装'],
    flavor:'山上寺院的规矩很朴素：每天扫地，每天打拳，扫地和打拳是同一件事。\n\n你的身体是武器，所以你不能把它喂坏、穿重、或者随便借给别人用。别人靠铁活下来，你靠把铁打到不想要你。\n\n你下山的时候，师父只说了一句：「不要赢，只要不停。」',
    mech:[
      ['生命骰','d8（平均每次升级 +5 HP）'],
      ['主属性','敏捷 与 感知'],
      ['豁免熟练','力量、敏捷'],
      ['特性 · 无甲防御','不穿甲且不用盾时，AC = 10 + 敏捷调整值 + 感知调整值'],
      ['特性 · 武术','徒手打击伤害 1d4，可改为使用敏捷；可用附赠动作追加一次徒手攻击'],
      ['特性 · 气','2 级起获得「气」点数（等于等级），可消耗以疾走、撤离或追加攻击']
    ]
  },
  '吟游诗人': {
    hd:8, prim:'cha', saves:['dex','cha'], note:'全能手 · 诗人激励 · 万事通',
    sk:{ count:3, list:['任意技能（自选三项）'] },
    equip:['细剑','皮甲','匕首','乐器','艺人包'],
    flavor:'你不是队伍里最强的那个，你是让所有人相信自己是最强的那个。\n\n一句恰到好处的夸奖能让守卫忘记查你的包；一段即兴的小调能让酒馆里的刀收起一半。你的武器是别人记住你说过什么。\n\n诗人不写历史，诗人写的是大家愿意相信的那种历史。',
    mech:[
      ['生命骰','d8（平均每次升级 +5 HP）'],
      ['主属性','魅力'],
      ['豁免熟练','敏捷、魅力'],
      ['特性 · 诗人激励','附赠动作给队友一颗激励骰（d6），他可在任意检定中加上它。每次短休后恢复'],
      ['特性 · 万事通','2 级起，任何不含熟练加值的属性检定额外 +1'],
      ['法术','掌握法术，魅力为施法属性'],
      ['技能','可选任意三项技能熟练（全职业最自由）']
    ]
  },
  '牧师': {
    hd:8, prim:'wis', saves:['wis','cha'], note:'治疗核心 · 神圣领域 · 驱散不死',
    sk:{ count:2, list:['历史','洞悉','医药','说服','宗教'] },
    equip:['硬头锤','鳞甲','盾牌','圣徽','祭司包'],
    flavor:'你的神不会替你做决定，只会要求你在做完之后还敢抬头。\n\n你在别人最不体面的时刻站在他们旁边：失血、发热、临死。所以你不大在意礼貌，也不太容易被吓到。手里那点光，是你借来的，随时可能被要求还回去。\n\n你的职责不是让人不死，是让人死得不那么孤单。',
    mech:[
      ['生命骰','d8（平均每次升级 +5 HP）'],
      ['主属性','感知'],
      ['豁免熟练','感知、魅力'],
      ['特性 · 神圣领域','1 级自选领域（生命／光明／战争／知识…），获得对应领域法术与能力'],
      ['特性 · 驱散不死','一个动作：30 尺内不死生物须进行感知豁免，失败则被驱离 1 分钟'],
      ['法术','准备制施法，感知为施法属性；每日可更换准备列表']
    ]
  },
  '德鲁伊': {
    hd:8, prim:'wis', saves:['int','wis'], note:'野性形态 · 自然施法',
    sk:{ count:2, list:['奥秘','驯兽','洞悉','医药','自然','察觉','宗教','生存'] },
    equip:['弯刀','木盾','皮甲','德鲁伊法器','探索者背包'],
    flavor:'树不会说话，它会记账。\n\n你看得见林中每个脚印留下的时间，也听得懂鸟为什么不叫了。城市让你难受——不是因为它脏，而是因为它假装自己不需要依赖什么。\n\n你借世界的力量，所以你不从它那里拿多余的东西。',
    mech:[
      ['生命骰','d8（平均每次升级 +5 HP）'],
      ['主属性','感知'],
      ['豁免熟练','智力、感知'],
      ['特性 · 德鲁伊语','一门只有德鲁伊能懂的秘密语言；可与其他德鲁伊密谈'],
      ['特性 · 野性形态','2 级起，一个动作变身成野兽（如狼、熊）。每日 2 次，形态 HP 独立计算'],
      ['限制','不能使用金属护甲与金属盾牌'],
      ['法术','准备制施法，感知为施法属性']
    ]
  },
  '术士': {
    hd:6, prim:'cha', saves:['con','cha'], note:'血脉魔法 · 超魔法 · 高爆发',
    sk:{ count:2, list:['奥秘','欺瞒','洞悉','威吓','说服','宗教'] },
    equip:['轻弩','匕首 ×2','奥术法器','地城包'],
    flavor:'你不是学会了魔法，你是生下来就带着它。\n\n小时候有一次你很生气，然后厨房着了。从那以后你学会了管住自己的情绪，因为你发现——魔法不听你的话，它听你心跳的话。\n\n别人花十年背咒语，你只需要允许自己再放松一点。',
    mech:[
      ['生命骰','d6（全职业最低，平均每次升级 +4 HP）——请务必远离 frontline'],
      ['主属性','魅力'],
      ['豁免熟练','体质、魅力'],
      ['特性 · 法术源流','1 级自选血脉（龙族／野魔法／神圣…) ，获得对应血脉法术与特性'],
      ['特性 · 超魔法','2 级起可消耗「术法点」改变法术：瞬发、双发、延长、强化等'],
      ['法术','已知法术制（无需准备），魅力为施法属性；术法点 = 等级']
    ]
  },
  '法师': {
    hd:6, prim:'int', saves:['int','wis'], note:'法术最多 · 法术书 · 奥术恢复',
    sk:{ count:2, list:['奥秘','历史','洞悉','调查','医药','自然','宗教'] },
    equip:['法杖','匕首','奥术法器','法术书','学者包'],
    flavor:'你花了二十年读书，为的是能在关键时刻说出正确的那一个词。\n\n别人笑你背着一包纸走山路，直到那扇门需要被打开、那个伤口需要被止住、那个怪物需要被说服自己不应该存在。\n\n你的法术书比你的剑更沉，也更贵。别把它丢了。',
    mech:[
      ['生命骰','d6（全职业最低，平均每次升级 +4 HP）'],
      ['主属性','智力'],
      ['豁免熟练','智力、感知'],
      ['特性 · 法术书','记录已知法术，每日从中准备施法；可抄录卷轴上的新法术'],
      ['特性 · 奥术恢复','每日一次短休，回复总法术位的一半（向上取整，不超过 5 环）'],
      ['法术','准备制施法，智力为施法属性；仪式施法可省下法术位'],
      ['与术士的区别','法术种类更多、更灵活，但没有超魔法的爆发改法']
    ]
  },
  '邪术师': {
    hd:8, prim:'cha', saves:['wis','cha'], note:'魔契 · 短休回法术位 · 魔能爆',
    sk:{ count:2, list:['奥秘','欺瞒','历史','威吓','调查','自然','宗教'] },
    equip:['轻弩','匕首 ×2','皮甲','法器','学者包'],
    flavor:'你签过一份合约。条款你读了，可能没读完。\n\n你的力量不是学来的、也不是天生的，是借来的——而借东西要还。每次你施法，都有某个东西在看不见的地方记上一笔。\n\n不过老实说，到目前为止，这笔买卖还挺划算。',
    mech:[
      ['生命骰','d8（平均每次升级 +5 HP）'],
      ['主属性','魅力'],
      ['豁免熟练','感知、魅力'],
      ['特性 · 魔能爆','招牌远程法术：1d10 力场伤害，11 级起分裂成多束。几乎每个邪术师都会选'],
      ['特性 · 魔契恩赐','3 级自选：链之契（魔宠）／刃之契（召唤武器）／书之契（额外戏法）'],
      ['特性 · 祈唤','2 级起自选永久能力（如黑暗视觉、伪装术无限次等）'],
      ['法术位','法术位极少但环数高，且**短休即可恢复**']
    ]
  }
};

/* ── 背景：skills 固定两项熟练／tools 工具／feat 特性 ── */
const BACKGROUNDS = {
  '士兵': { skills:['运动','威吓'], tools:'一种赌具', feat:['军衔','你曾是正规军中一员，军中的老兵仍会承认你的身份，你可凭军衔征用简陋的宿营与补给'],
    flavor:'你听过真正的号角声，所以你知道电影里演的都是假的。\n\n你睡过泥地、吃过半份口粮、替不认识的人挡过一次箭。你离开军队的原因可能是伤，可能是厌倦，也可能只是有人把本该给你的东西给了别人。\n\n你不需要理由就能列队，也不需要理由就能拆掉一个战术失误的营地。',
    equip:['一套军装','一枚军衔徽记','一副骰子','约 10 金币'] },
  '贵族': { skills:['历史','说服'], tools:'一种棋盘游戏', feat:['特权地位','你的出身让你在任何重视血统的场合受到优待，可用身份换取接见、借贷或通行'],
    flavor:'你的姓氏在三个城市里能换来一张桌子，在第四个城市里能换来一次暗杀。\n\n你从小被教的是别的东西：怎么在别人说话之前判断他要什么，怎么在被冒犯时保持微笑，怎么在输的时候把输说成让。\n\n钱你可能还有一点。但地位是你唯一不能当掉的东西。',
    equip:['一套精美衣物','一枚家族玺戒','一份族谱卷轴','约 25 金币'] },
  '平民英雄': { skills:['驯兽','生存'], tools:'一种工匠工具', feat:['平民之望','同乡与底层民众愿意为你冒险援助，你能在村落中快速获得庇护与情报'],
    flavor:'你从没打算当英雄，事情只是恰好发生在你面前，而你是唯一没有转身的人。\n\n你熟悉谷物的价格、冬天的风，以及邻居家孩子什么时候该上学。你的勇气不是无畏，是你知道不挺身而出的代价。\n\n现在，整个镇子都在等你回来。',
    equip:['一套普通衣物','一把铲子','一只铁锅','约 10 金币'] },
  '流浪儿': { skills:['巧手','隐匿'], tools:'盗贼工具', feat:['城市秘密','你熟悉城市的暗面：捷径、藏身处、黑市与不设防的屋顶，在最拥挤的地方也可快速穿行'],
    flavor:'你学会走路的第一件事是学会不发出声音。\n\n城市对你有两副面孔：白天它赶你走，晚上它把一切都留给你。你知道哪个面包师的垃圾桶最丰盛，也知道哪个守卫收钱。\n\n你不是小偷。你只是比大多数人更早发现，规则是给有房子的人写的。',
    equip:['一套带兜帽的破旧衣物','一张城市地图','一只小老鼠（宠物）','约 10 金币'] },
  '隐士': { skills:['医药','宗教'], tools:'草药工具', feat:['重大发现','你在独居中窥见了某种被遗忘的知识或真相，可将其作为传说线索交给 DM'],
    flavor:'你在山里住了很久。久到你重新学会了听风的声音。\n\n你不是在逃避什么，你是在回答问题——那个没人能替你回答的问题：我到底是什么。\n\n你带回来的答案可能只有一句话，但那一句话会改变很多东西。',
    equip:['一套旧袍','一卷写满注解的羊皮纸','草药袋','约 5 金币'] },
  '学者': { skills:['历史','奥秘'], tools:'书法工具', feat:['博识','当你在图书馆或学院中查资料时，能迅速找到权威出处；对冷门知识常有印象'],
    flavor:'你知道的事情比这世界上大多数人加起来还多，其中有一半没人愿意听。\n\n你读书不是为了考试，是因为「不知道」这件事让你睡不着觉。你能背出一百年前那场战役的全部日期，却记不住邻居的名字。\n\n冒险对你来说不是逃离书，是终于能亲眼核对一遍。',
    equip:['一套学者袍','一瓶墨水与羽毛笔','一叠空白纸','约 10 金币'] },
  '艺人': { skills:['表演','说服'], tools:'一种乐器', feat:['万众瞩目','你在人群中表演时能吸引大量注意，可借此掩护队友行动或换取食宿'],
    flavor:'掌声是这个世界上最容易上瘾的东西。\n\n你走过很多镇子，在每个镇子里都当过一晚的名人。你知道一句笑话能赚多少铜币，也知道一段沉默能让整间酒馆安静。\n\n有人觉得你不正经。你觉得他们才是不常笑的那些人。',
    equip:['一件乐器','一套戏服','一副假发','约 15 金币'] },
  '罪犯': { skills:['欺瞒','隐匿'], tools:'一种赌具与盗贼工具', feat:['黑道人脉','你在犯罪圈里有人可联系——能买到违禁品，也能买到谁在追杀谁的消息'],
    flavor:'你欠某个人一件事，而那个人还没来收。\n\n你熟悉这一行的规矩：不问货从哪来，不问人往哪去。你做过不太光彩的事，也见过更不光彩的人——你发现后者往往穿得更好。\n\n你现在的目标是：还清那笔账，然后彻底消失。',
    equip:['一套深色兜帽衣物','一根撬棍','约 15 金币'] },
  '水手': { skills:['运动','察觉'], tools:'领航工具', feat:['船缘','你能以最低成本搭上任何一条顺路的船，海上的人愿意给你一个铺位'],
    flavor:'陆地让你觉得不稳。\n\n你在甲板上长大，所以你的膝盖会随着船身自动调整——而在平地上，你走路总有点怪。你听过海上有会唱歌的东西，也见过船在无风的日子里自己走。\n\n你不太怕死。你比较怕渴。',
    equip:['一根系绳（50 尺）','一套水手服','一副赌具','约 10 金币'] },
  '侍僧': { skills:['洞悉','宗教'], tools:'无', feat:['神殿庇护','你在同信仰的神殿中可获得免费治疗、食宿与仪式支持'],
    flavor:'你在神殿的走廊里扫过很多年的地。\n\n你听过太多人对着雕像说话，多到你能从语气里听出他是来求什么。你自己也求过——求过一次，没有得到答复。\n\n但你还是留下了。因为有些工作，需要有人一直站在那儿。',
    equip:['一套祭袍','一枚圣徽','一本祈祷册','约 15 金币'] },
  '工匠': { skills:['洞悉','说服'], tools:'一种工匠工具', feat:['同行之谊','各行业的工匠都认得你的手艺，愿意为你提供折扣、修理与行业内幕'],
    flavor:'东西坏了就需要有人修，而你恰好是那个人。\n\n你的手上有一层洗不掉的茧，还有几道烫出来的旧疤。你看一把椅子会先看它的接缝，听一句话会先听它有没有松动的地方。\n\n世界会坏。你的工作是让它再撑久一点。',
    equip:['一套工匠工具','一封行会推荐信','一套旅行衣物','约 15 金币'] },
  '猎人': { skills:['隐匿','生存'], tools:'一种工匠工具', feat:['荒野追踪','你能从足迹、断枝与风向判断目标的种类、数量与去向'],
    flavor:'林子会告诉你去哪，前提是你别急着走。\n\n你比大多数士兵更懂耐心：蹲两个时辰只为一箭，是正常的。（人类贵族管这叫无聊，你管这叫工作。）\n\n你杀死的东西你都会吃掉，这一点让你比很多「英雄」更干净。',
    equip:['一张长弓与箭矢 ×20','一把短刀','一张捕兽夹','约 10 金币'] }
};

const ALIGNMENTS = {
  '守序善良': '把规矩当成刀，把刀用来保护人。信条高于心情。',
  '中立善良': '不站队，只帮忙。谁需要就往哪走。',
  '混乱善良': '只要是对的，规矩可以绕；只要有人在被欺负，就得插手。',
  '守序中立': '规矩就是规矩。你可能是最可靠的同伴，也可能是最死板的官僚。',
  '绝对中立': '你不选边。你只选平衡，或者只选活下去。',
  '混乱中立': '自由是唯一的原则。你做什么取决于当时的心情。',
  '守序邪恶': '规矩是你用来控制别人的工具。你会很守约——只要对被控者有利。',
  '中立邪恶': '你只做对自己有利的事，不多做，不少做。',
  '混乱邪恶': '破坏本身就是目的。危险，且往往短命。'
};

const XP_TABLE = [0,300,900,2700,6500,14000,23000,34000,48000,64000,85000,100000,120000,140000,165000,195000,225000,265000,305000,355000];

/* 标准数组与推荐分配 */
const STD_ARRAY = [15,14,13,12,10,8];
const CLASS_AB_PRIORITY = {
  '野蛮人':['str','con','dex','wis','cha','int'], '战士':['str','con','dex','wis','cha','int'],
  '圣武士':['str','cha','con','wis','dex','int'], '游侠':['dex','wis','con','str','cha','int'],
  '盗贼':['dex','con','cha','int','wis','str'], '武僧':['dex','wis','con','str','cha','int'],
  '吟游诗人':['cha','dex','con','int','wis','str'], '牧师':['wis','con','str','cha','dex','int'],
  '德鲁伊':['wis','con','dex','int','cha','str'], '术士':['cha','con','dex','wis','int','str'],
  '法师':['int','con','dex','wis','cha','str'], '邪术师':['cha','con','dex','wis','int','str']
};

const PROVIDERS = [
  { id:'openai',    name:'OpenAI',        url:'https://api.openai.com/v1',        model:'gpt-4o-mini' },
  { id:'deepseek',  name:'DeepSeek 深度求索', url:'https://api.deepseek.com/v1',   model:'deepseek-chat' },
  { id:'openrouter',name:'OpenRouter',    url:'https://openrouter.ai/api/v1',      model:'anthropic/claude-3.5-sonnet' },
  { id:'silicon',   name:'硅基流动 SiliconFlow', url:'https://api.siliconflow.cn/v1', model:'Qwen/Qwen2.5-72B-Instruct' },
  { id:'moonshot',  name:'月之暗面 Kimi', url:'https://api.moonshot.cn/v1',        model:'moonshot-v1-8k' },
  { id:'zhipu',     name:'智谱 GLM',      url:'https://open.bigmodel.cn/api/paas/v4', model:'glm-4-flash' },
  { id:'custom',    name:'自定义 / 本地', url:'',                                model:'' }
];

const BUILTIN_MODULE = {
  title: '《余烬之冠》· 失落矿坑的余烬',
  content: `【模组：余烬之冠 —— 第一章：失落的矿坑】
类型：低等级入门冒险（推荐 1-3 级队伍，3-4 人）
背景：铜岭镇的铁矿脉已停摆三月。矿井深处的矿工再未归来，
而镇上开始有人梦见同一句话：「王冠在燃烧。」

▶ 关键地点
1. 铜岭镇（起点）—— 铁匠贝拉·索恩是委托发布人，她的哥哥是失踪矿工之一。
   旅店「锈锚」里可打探到三条线索：矿坑西侧的塌方、夜间的红色雾、一名自称调查员的陌生人。
2. 山道哨站 —— 半废弃的石哨塔，驻守着三名被收买的雇佣兵（推荐用交涉或潜行绕过；强攻会引来矿坑警报）。
3. 矿坑上层 —— 废弃矿车轨道。轨道尽头有一面刻着矮人符文的石门，
   符文大意：「火熄之时，门自开。」（解法：熄灭附近所有光源，或使用火焰以外的冷光照明）
4. 熔炉大厅（Boss 区）—— 中央是被熔岩半包围的祭坛，一名疯狂的矮人锻炉祭司
   正试图以熔岩重塑「余烬之冠」。他身边有两名灰烬侍从。

▶ 重要 NPC
- 贝拉·索恩（矮人女性，铁匠，直率、护短）
- 灰袍陌生人（真身为锻炉祭司的信使，携带一封密信）
- 矿工老汤姆（幸存者，被关在矿坑上层的工具间，神志恍惚）

▶ 已给出的宝物
- 余烬之冠（未完成，危险：佩戴者每回合受 1 点火焰伤害，但免疫恐惧）
- 贝拉的酬劳：每人 150 金币 + 一件精制武器

▶ 剧情触发提示
- 玩家在铜岭镇做出第一次调查动作时，灰袍陌生人会随后出现并主动攀谈。
- 若玩家在矿坑上层熄灭光源，石门开启，但熔炉大厅的温度会警示性地升高。
- 熔炉祭司不会立刻开战：他会先邀请玩家「一起点燃世界」，玩家拒绝后才进入战斗。`
};

/* ─────────────── 2. 工具 ─────────────── */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const rnd = n => Math.floor(Math.random() * n) + 1;
const D = n => Math.floor(Math.random() * n) + 1;

function fmtText(s) {
  let t = esc(s);
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(?<!\*)\*(?!\s)(.+?)(?<!\s)\*(?!\*)/g, '<em>$1</em>');
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  return t;
}
function toast(msg, kind = '') {
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.textContent = msg;
  $('#toast-root').appendChild(el);
  setTimeout(() => { el.style.transition = '.3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 320); }, 2200);
}
function fmtBytes(b) {
  if (!b) return '0 B';
  const u = ['B','KB','MB','GB']; let i = 0;
  while (b >= 1024 && i < 3) { b /= 1024; i++; }
  return b.toFixed(i ? 1 : 0) + ' ' + u[i];
}
function fmtTime(ts) {
  const d = new Date(ts);
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/* ─────────────── 3. 状态与存储 ─────────────── */

const LS_KEY = 'aeldrin_table_v1';

const DEFAULT_SETTINGS = {
  apiBase: 'https://api.openai.com/v1', apiKey: '', model: 'gpt-4o-mini', temp: 0.8,
  theme: 'dark', font: 'serif', fontSize: '16',
  anim: true, texture: true, autoSave: true, immersive: false,
  username: '无名的旅人',
  style: '史诗奇幻（经典英雄）', pov: '第二人称（你）', difficulty: '标准（DM 公平裁定）',
  diceOn: true, markerOn: true
};

let state = {
  settings: { ...DEFAULT_SETTINGS },
  chars: [],
  modules: [{ id: 'builtin', title: BUILTIN_MODULE.title, content: BUILTIN_MODULE.content, builtin: true, ts: Date.now() }],
  moduleId: 'builtin',
  partyIds: [],
  activeCharId: null,
  chat: [],
  combat: { on: false, round: 1, order: [], turn: 0 },
  saves: [],
  novels: [],
  campaigns: [],
  campaignId: null,
  pendingCampaignName: '',
  collapsed: {}
};

function persist() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); }
  catch (e) { toast('本地存储写入失败：' + e.message, 'err'); }
}
function restore() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const o = JSON.parse(raw);
    state = { ...state, ...o };
    state.settings = { ...DEFAULT_SETTINGS, ...(o.settings || {}) };
    if (!state.modules || !state.modules.length) state.modules = [{ id:'builtin', title:BUILTIN_MODULE.title, content:BUILTIN_MODULE.content, builtin:true, ts:Date.now() }];
    if (!state.combat) state.combat = { on:false, round:1, order:[], turn:0 };
    if (!Array.isArray(state.campaigns)) state.campaigns = [];
    if (!state.collapsed) state.collapsed = {};
    // 修正历史存档中可能过期的派生数值
    (state.chars || []).forEach(c => { try { if (!c.abBase) c.abBase = { ...c.ab }; syncDerived(c); } catch (_) {} });
  } catch (e) { console.warn('restore failed', e); }
}

/* ─────────────── 4. 骰子引擎 ─────────────── */

function rollExpr(raw) {
  const s = String(raw).replace(/\s+/g, '').toLowerCase();
  if (!s) return null;
  const re = /([+-]?)(\d*)d(\d+)(?:(kh|kl)(\d+))?|([+-]?)(\d+)/g;
  const parts = []; let consumed = 0, m;
  while ((m = re.exec(s)) !== null) {
    if (!m[0]) { re.lastIndex++; continue; }
    consumed += m[0].length;
    if (m[3]) {
      parts.push({ t:'d', sign: m[1] === '-' ? -1 : 1, n: m[2] ? parseInt(m[2],10) : 1, f: parseInt(m[3],10), keep: m[4], kn: m[5] ? parseInt(m[5],10) : 1 });
    } else {
      parts.push({ t:'c', sign: m[6] === '-' ? -1 : 1, v: parseInt(m[7],10) });
    }
  }
  if (!parts.length || consumed !== s.length) return null;
  const rolls = []; let total = 0;
  for (const p of parts) {
    if (p.t === 'c') { total += p.sign * p.v; rolls.push({ kind:'c', v: p.sign * p.v, raw: p.v }); continue; }
    if (p.f < 2 || p.f > 1000 || p.n > 100) return null;
    let arr = Array.from({ length: p.n }, () => D(p.f));
    const shown = arr.slice();
    if (p.keep === 'kh') { const srt = [...arr].sort((a,b)=>b-a); arr = srt.slice(0, p.kn); }
    if (p.keep === 'kl') { const srt = [...arr].sort((a,b)=>a-b); arr = srt.slice(0, p.kn); }
    const sub = arr.reduce((a,b)=>a+b,0);
    total += p.sign * sub;
    rolls.push({ kind:'d', sign:p.sign, n:p.n, f:p.f, shown, kept:arr, sub });
  }
  return { total, rolls, expr: s };
}
function exprLabel(r) {
  return r.rolls.map(p => {
    if (p.kind === 'c') return (p.v >= 0 ? '+' + p.v : String(p.v));
    const base = `${p.n}d${p.f}[${p.shown.join(',')}]`;
    return (p.sign < 0 ? '−' : (r.rolls.indexOf(p) ? '+' : '')) + base;
  }).join(' ');
}

function d20Roll({ mode = 'normal' } = {}) {
  const a = D(20), b = D(20);
  if (mode === 'adv') return { v: Math.max(a,b), pair: [a,b], mode };
  if (mode === 'dis') return { v: Math.min(a,b), pair: [a,b], mode };
  return { v: a, pair: [a], mode };
}

/* ─────────────── 5. 角色规则 ─────────────── */

const MOD = v => Math.floor((v - 10) / 2);
const sign = n => (n >= 0 ? '+' + n : String(n));
const PROF = lvl => 2 + Math.floor(((lvl || 1) - 1) / 4);

function newChar(patch = {}) {
  const c = {
    id: uid(), name: '无名冒险者', race: '人类', cls: '战士', level: 1, xp: 0,
    bg: '士兵', align: '中立善良',
    ab: { str:10, dex:10, con:10, int:10, wis:10, cha:10 },
    abBase: { str:10, dex:10, con:10, int:10, wis:10, cha:10 },
    proficient: [], hp: 0, maxHp: 0, tempHp: 0, ac: 14, speed: 30, hitDie: 10,
    gold: 30, inv: ['长剑', '皮甲', '背包', '干粮 ×5', '火把 ×3'], spells: [], notes: '', avatar: '',
    conditions: [], hpManual: false, acManual: false
  };
  Object.assign(c, patch);
  // abBase 永远表示「未加种族加值」的基础值；调用方给的 ab 是最终值
  if (patch.abBase) c.abBase = { ...patch.abBase };
  else if (patch.ab) c.abBase = deriveBaseFromFinal(patch.ab, c.race);
  else if (!c.abBase) c.abBase = { ...c.ab };
  syncDerived(c);
  c.hp = c.hp || c.maxHp;
  return c;
}

/* 由最终属性反推基础属性（减去种族加值） */
function deriveBaseFromFinal(ab, race) {
  const b = (RACES[race] || {}).bonus || {};
  const out = {};
  ABKEYS.forEach(k => { out[k] = clamp((ab[k] || 10) - (b[k] || 0), 1, 30); });
  return out;
}

/* 从外部 JSON 采纳一张角色卡 */
function adoptChar(obj) {
  const base = newChar();
  const race = obj.race || base.race;
  const finalAb = Object.assign({}, base.ab, obj.ab || {});
  Object.assign(base, obj);
  base.ab = finalAb;
  base.abBase = obj.abBase ? { ...obj.abBase } : deriveBaseFromFinal(finalAb, base.race || race);
  if (!base.id) base.id = uid();
  syncDerived(base);
  base.hp = clamp(base.hp || base.maxHp, 0, base.maxHp);
  return base;
}

/* 职业生命骰 */
function classHd(cls) { return (CLASSES[cls] || {}).hd || 8; }

/* 把种族加值叠加到 abBase 上，得到最终属性 */
function applyRacial(c) {
  const b = (RACES[c.race] || {}).bonus || {};
  const base = c.abBase || c.ab || {};
  ABKEYS.forEach(k => { c.ab[k] = clamp((base[k] || 10) + (b[k] || 0), 1, 30); });
}

/* 生命上限：完全由 职业生命骰 + 体质调整值 + 等级 推导 */
function calcMaxHp(c) {
  const hd = classHd(c.cls);
  const cm = MOD(c.ab.con);
  const extra = c.race === '丘陵矮人' ? 1 : 0;          // 丘陵坚韧
  let hp = hd + cm + extra;
  for (let i = 2; i <= (c.level || 1); i++) hp += Math.floor(hd / 2) + 1 + cm + extra;
  return Math.max(1, hp);
}
function hpBreakdown(c) {
  const hd = classHd(c.cls), cm = MOD(c.ab.con), lv = c.level || 1;
  const extra = c.race === '丘陵矮人' ? 1 : 0;
  const per = Math.floor(hd / 2) + 1 + cm + extra;
  const parts = [`生命骰 d${hd}（首级取满 = ${hd}）`, `体质调整值 ${sign(cm)}`];
  if (extra) parts.push('丘陵坚韧 +1');
  if (lv > 1) parts.push(`2~${lv} 级每级 +${per}`);
  return { hd, cm, extra, per, total: calcMaxHp(c), text: parts.join(' ＋ ') };
}

/* 同步所有派生数值：HP、速度、生命骰 */
function syncDerived(c) {
  c.hitDie = classHd(c.cls);
  applyRacial(c);
  if (!c.hpManual) c.maxHp = calcMaxHp(c);
  if (c.maxHp < 1) c.maxHp = 1;
  c.hp = clamp(c.hp || c.maxHp, 0, c.maxHp);
  const r = RACES[c.race];
  if (r) c.speed = r.speed;
  return c;
}

/* 建议 AC（按常见护甲组合估算），仅作提示 */
function suggestAC(c) {
  const dm = MOD(c.ab.dex);
  return [
    { name:'无甲', v: 10 + dm },
    { name:'皮甲', v: 11 + dm },
    { name:'链甲衫', v: 13 + Math.min(dm, 2) },
    { name:'链甲 + 盾', v: 16 + 2 }
  ];
}
const charProf = c => PROF(c.level);
function skillBonus(c, name) {
  const sk = SKILL_MAP[name]; if (!sk) return 0;
  return MOD(c.ab[sk.a]) + (c.proficient.includes(name) ? PROF(c.level) : 0);
}
function saveBonus(c, key) {
  const cl = CLASSES[c.cls] || {};
  return MOD(c.ab[key]) + ((cl.saves || []).includes(key) ? PROF(c.level) : 0);
}
function getChar(id) { return state.chars.find(c => c.id === id) || null; }
function activeChar() { return getChar(state.activeCharId) || getChar(state.partyIds[0]) || null; }
function party() { return state.partyIds.map(getChar).filter(Boolean); }
function levelFromXp(xp) { let l = 1; for (let i = 0; i < XP_TABLE.length; i++) if (xp >= XP_TABLE[i]) l = i + 1; return clamp(l, 1, 20); }

/* ─────────────── 6. 导航 ─────────────── */

const TITLES = {
  home:  ['大厅', 'Aeldrin\'s Table — 让命运在骰子落定前保持沉默'],
  table: ['跑团桌面', 'AI 地下城主正在等待你的行动'],
  prep:  ['仪式准备', '挑选模组、点名队伍，然后推开门'],
  codex: ['角色档案', '每一位冒险者都始于一张纸和一串数字'],
  saves: ['记忆回廊', '已发生的，被记录；未发生的，仍可改写'],
  novel: ['吟游诗篇', '把骰点记录唱成一首歌'],
  manual:['地下城主手册', '规则速查 · 骰子语法 · 与 AI 相处之道'],
  settings:['设置中心', 'AELDRIN / CONTROL NODE']
};

function setView(v) {
  $$('.view').forEach(el => el.classList.toggle('on', el.dataset.view === v));
  $$('.nav-item').forEach(el => el.classList.toggle('on', el.dataset.view === v));
  const [t, s] = TITLES[v] || ['', ''];
  $('#tb-title').textContent = t;
  $('#tb-sub').textContent = s;
  state.ui = v;
  if (v === 'home') renderHome();
  if (v === 'prep') renderPrep();
  if (v === 'table') renderTable();
  if (v === 'codex') renderCodex();
  if (v === 'saves') renderSaves();
  if (v === 'novel') renderNovel();
  if (v === 'settings') renderSettings();
  // 跑团桌面在手机上铺满可视区（仅内部滚动），其余视图保持页面滚动
  $('#views').classList.toggle('table-mode', v === 'table');
  closeDrawers();
}
window.goto_ = setView;

/* ── 移动端抽屉：左导航 / 右侧角色面板 / 桌面侧栏 ── */
const MOBILE_BP = 1000;
function isMobile() { return window.innerWidth <= MOBILE_BP; }
function drawerEls() { return [$('#rail'), $('#sheet-panel'), $('#side-col')].filter(Boolean); }
function syncScrim() {
  const sc = $('#scrim');
  if (!sc) return;
  sc.classList.toggle('on', isMobile() && drawerEls().some(el => el.classList.contains('open')));
}
function closeDrawers() {
  drawerEls().forEach(el => el.classList.remove('open'));
  syncScrim();
}
function openDrawer(sel) {
  const el = typeof sel === 'string' ? $(sel) : sel;
  if (!el || !isMobile()) return;
  drawerEls().forEach(x => x !== el && x.classList.remove('open'));
  el.classList.add('open');
  syncScrim();
}
window.closeDrawers = closeDrawers;

/* ─────────────── 7. 视图：大厅 ─────────────── */

function renderHome() {
  const st = state.settings;
  $('#home-stat').innerHTML = `
    <div><b>${state.chars.length}</b><span>冒险者</span></div>
    <div><b>${state.saves.length}</b><span>存档</span></div>
    <div><b>${state.novels.length}</b><span>诗篇</span></div>
    <div><b>${state.modules.length}</b><span>模组</span></div>`;

  const recent = [...state.saves].sort((a,b)=>b.ts-a.ts).slice(0,4);
  $('#home-recent').innerHTML = recent.length
    ? recent.map(s => `<div class="pt-item" onclick="loadSave_('${s.id}')">
        <div class="pt-av">${s.auto ? '⏱' : '📜'}</div>
        <div class="pt-meta"><b>${esc(s.name)}</b><span>${fmtTime(s.ts)} · ${(s.session?.chat||[]).length} 条记录</span></div>
      </div>`).join('')
    : `<div class="empty"><i class="e-ico">🗄️</i>尚无存档。开启一次远征，历史自会写下。</div>`;

  const cs = state.chars.slice(0,4);
  $('#home-chars').innerHTML = cs.length
    ? cs.map(c => `<div class="pt-item" onclick="openSheetChar_('${c.id}')">
        <div class="pt-av">${c.avatar ? `<img src="${c.avatar}">` : esc(c.name[0]||'?')}</div>
        <div class="pt-meta"><b>${esc(c.name)}</b><span>${esc(c.race)} ${esc(c.cls)} · Lv.${c.level}</span></div>
      </div>`).join('')
    : `<div class="empty"><i class="e-ico">🧝</i>还没有角色卡。</div>`;

  $('#rail-user').querySelector('.ru-info b').textContent = st.username;
  $('#ru-avatar').textContent = (st.username || '旅')[0];
}

/* ─────────────── 8. 视图：仪式准备 ─────────────── */

function renderPrep() {
  const mod = state.modules.find(m => m.id === state.moduleId);
  $('#module-picker').innerHTML = state.modules.map(m => `
    <div class="mp-item ${m.id === state.moduleId ? 'on' : ''}" onclick="pickModule_('${m.id}')">
      <span>${m.builtin ? '📗' : '📄'}</span>
      <b>${esc(m.title)}</b>
      <span>${(m.content || '').length} 字</span>
      ${m.builtin ? '' : `<button class="sc-btn del" onclick="event.stopPropagation();delModule_('${m.id}')">删除</button>`}
    </div>`).join('') || '<p class="muted">尚无模组。</p>';

  $('#module-preview').innerHTML = mod
    ? `<div style="margin-bottom:8px;color:var(--brass)">◆ ${esc(mod.title)}</div>` + esc((mod.content || '').slice(0, 1400)) + ((mod.content||'').length > 1400 ? '\n…（已截断预览）' : '')
    : '<span class="muted">未选择模组。DM 将即兴创作。</span>';

  $('#roster').innerHTML = state.chars.length
    ? state.chars.map(c => `
        <label class="rs-item ${state.partyIds.includes(c.id) ? 'on' : ''}">
          <input type="checkbox" ${state.partyIds.includes(c.id) ? 'checked' : ''} onchange="toggleParty_('${c.id}',this.checked)">
          <div class="pt-av" style="width:34px;height:34px;flex:0 0 34px">${c.avatar ? `<img src="${c.avatar}">` : esc(c.name[0]||'?')}</div>
          <div class="pt-meta"><b>${esc(c.name)}</b><span>${esc(c.race)} ${esc(c.cls)} Lv.${c.level} · HP ${c.hp}/${c.maxHp}</span></div>
        </label>`).join('')
    : `<div class="empty"><i class="e-ico">🧝</i>名册空白。先创建一位冒险者。</div>`;

  const st = state.settings;
  $('#opt-style').value = st.style; $('#opt-pov').value = st.pov; $('#opt-diff').value = st.difficulty;
  $('#opt-dice-on').checked = st.diceOn; $('#opt-marker-on').checked = st.markerOn;
  const ci = $('#opt-campaign');
  if (ci) {
    ci.value = state.pendingCampaignName || '';
    ci.placeholder = '默认：' + defaultCampaignName();
  }
}

window.pickModule_ = id => { state.moduleId = id; persist(); renderPrep(); };
window.delModule_ = id => {
  if (!confirm('确定删除该模组？')) return;
  state.modules = state.modules.filter(m => m.id !== id);
  if (state.moduleId === id) state.moduleId = state.modules[0]?.id || '';
  persist(); renderPrep();
};
window.toggleParty_ = (id, on) => {
  if (on) { if (!state.partyIds.includes(id)) state.partyIds.push(id); }
  else state.partyIds = state.partyIds.filter(x => x !== id);
  if (!state.activeCharId || !state.partyIds.includes(state.activeCharId)) state.activeCharId = state.partyIds[0] || null;
  persist(); renderPrep();
};

/* ─────────────── 9. 视图：跑团桌面 ─────────────── */

function renderTable() {
  const mod = state.modules.find(m => m.id === state.moduleId);
  $('#ch-mod-name').textContent = mod ? mod.title : '未载入模组（DM 将即兴创作）';
  renderChat(); renderPartySide(); renderCombat(); renderBag(); renderQuick(); renderSheet();
}

function renderQuick() {
  const c = activeChar();
  const skills = ['察觉','调查','洞悉','隐匿','运动','说服','欺瞒','威吓','生存','体操'];
  $('#chat-quick').innerHTML = skills.map(s =>
    `<button class="chip-btn" onclick="quickCheck_('${s}')">${s} ${c ? sign(skillBonus(c, s)) : ''}</button>`
  ).join('') + `<button class="chip-btn" onclick="quickRoll_('1d20')">d20</button>
    <button class="chip-btn" onclick="quickRoll_('1d100')">d100</button>`;
}
window.quickCheck_ = n => { const t = $('#chat-text'); t.value = '.ra ' + n + ' '; t.focus(); };
window.quickRoll_ = e => { const t = $('#chat-text'); t.value = '.r ' + e; sendChat(); };

function renderChat() {
  const log = $('#chat-log');
  if (!state.chat.length) {
    log.innerHTML = `<div class="empty"><i class="e-ico">🕯️</i>
      <p>桌面静默。当你说出第一句话，故事便开始了。</p>
      <p class="muted" style="margin-top:10px;font-size:12px">试试输入：「我推开锈锚旅店的门」</p></div>`;
    return;
  }
  log.innerHTML = state.chat.map((m, i) => msgHTML(m, i)).join('');
  log.scrollTop = log.scrollHeight;
}

function msgHTML(m, idx) {
  if (m.role === 'dice') {
    const cls = m.crit === 'nat20' ? 'pass' : (m.crit === 'nat1' ? 'fail' : (m.verdict === 'pass' ? 'pass' : m.verdict === 'fail' ? 'fail' : ''));
    return `<div class="msg dice"><div class="dice-card ${cls}">
      ${m.label ? `<div class="dl ${m.crit || ''}">${esc(m.label)}</div>` : ''}
      <div class="dd">${esc(m.detail)}</div>
      <div class="dv">${m.total}</div>
      ${m.compare ? `<div class="dc">${esc(m.compare)}</div>` : ''}
      ${m.note ? `<div class="dc" style="color:var(--ink-3)">${esc(m.note)}</div>` : ''}
      <div class="dcrit">${m.crit === 'nat20' ? '★ 自然 20 · 大成功' : m.crit === 'nat1' ? '✖ 自然 1 · 大失败' : ''}</div>
    </div></div>`;
  }
  if (m.role === 'sys') return `<div class="msg sys"><div class="body">— ${esc(m.text)} —</div></div>`;
  if (m.role === 'player') {
    return `<div class="msg player"><div class="who">${esc(m.name || '你')}</div><div class="body">${fmtText(m.text)}</div></div>`;
  }
  const markers = (state.settings.markerOn && m.markers && m.markers.length)
    ? `<div class="mk-row">${m.markers.map((k, j) => mkHTML(m, idx, j, k)).join('')}</div>` : '';
  const retry = idx === state.chat.length - 1
    ? `<div class="mk-row"><button class="mk" onclick="regenerate_()">↻ 让 DM 重新叙述这一段</button></div>` : '';
  return `<div class="msg dm"><div class="who">🜂 地下城主 · DM</div><div class="body">${fmtText(m.text)}</div>${markers}${retry}</div>`;
}

function mkHTML(m, mi, j, k) {
  const done = m.mkDone && m.mkDone[j];
  let label = '', cls = '';
  if (k.type === 'check') {
    label = `🎯 ${k.name} 检定${k.dc ? ` · DC ${k.dc}` : ''}`;
  } else if (k.type === 'dmg')  { label = `🩸 受到 ${k.val} 点伤害`; cls = 'dmg'; }
  else if (k.type === 'heal')   { label = `✚ 恢复 ${k.val} 点生命`; cls = 'heal'; }
  else if (k.type === 'xp')     { label = `✦ 获得 ${k.val} 点经验`; cls = 'xp'; }
  else if (k.type === 'gold')   { label = `🪙 金币 ${k.val >= 0 ? '+' : ''}${k.val}`; cls = 'xp'; }
  else if (k.type === 'hp')     { label = `❤️ 当前 HP ${k.val}`; cls = 'dmg'; }
  return `<button class="mk ${cls} ${done ? 'done' : ''}" ${done ? 'disabled' : ''} onclick="applyMarker_(${mi},${j})">${esc(label)}</button>`;
}

window.applyMarker_ = (mi, j) => {
  const m = state.chat[mi]; if (!m || !m.markers) return;
  const k = m.markers[j]; if (!k) return;
  m.mkDone = m.mkDone || {};
  if (m.mkDone[j]) return;
  const c = activeChar();
  if (k.type === 'check') {
    const dc = k.dc || 15;
    doCheck(k.name, dc, 'normal', null);
  } else if (!c) { toast('没有选中的角色', 'err'); return; }
  else if (k.type === 'dmg') { c.hp = clamp(c.hp - k.val, 0, c.maxHp); addSys(`${c.name} 受到 ${k.val} 点伤害（HP ${c.hp}/${c.maxHp}）`); }
  else if (k.type === 'heal') { c.hp = clamp(c.hp + k.val, 0, c.maxHp); addSys(`${c.name} 恢复 ${k.val} 点生命（HP ${c.hp}/${c.maxHp}）`); }
  else if (k.type === 'xp') { gainXp(c, k.val); }
  else if (k.type === 'gold') { c.gold = Math.max(0, (c.gold || 0) + k.val); addSys(`${c.name} 金币 ${k.val >= 0 ? '+' : ''}${k.val}（现 ${c.gold}）`); }
  m.mkDone[j] = true;
  // 自动重绘（保留滚动）
  const log = $('#chat-log'); const atBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 120;
  renderChat(); if (!atBottom) log.scrollTop = log.scrollHeight - 200;
  renderPartySide(); renderSheet(); renderBag(); persist();
};

function gainXp(c, n) {
  c.xp = (c.xp || 0) + n;
  const oldL = c.level, nl = levelFromXp(c.xp);
  if (nl > oldL) {
    c.level = nl;
    const old = c.maxHp;
    syncDerived(c);                        // 生命上限按新等级重算（尊重手动覆写）
    const diff = c.maxHp - old;
    if (diff > 0) c.hp = clamp(c.hp + diff, 0, c.maxHp);
    addSys(`✦ ${c.name} 升级至 Lv.${nl}！熟练加值 ${sign(PROF(nl))}，生命上限 ${c.maxHp}（${diff >= 0 ? '+' : ''}${diff}）`);
  } else {
    addSys(`✦ ${c.name} 获得 ${n} 点经验（${c.xp} XP · 距下一级还差 ${Math.max(0, XP_TABLE[c.level] - c.xp)}）`);
  }
}

function addSys(text) { state.chat.push({ role:'sys', text, ts: Date.now() }); }

function pushMsg(m) { state.chat.push(m); renderChat(); }

/* 侧栏：队员 */
function renderPartySide() {
  const p = party();
  $('#party-tag').textContent = p.length + ' 名';
  $('#party-list').innerHTML = p.length ? p.map(c => {
    const pct = clamp((c.hp / c.maxHp) * 100, 0, 100);
    return `<div class="pt-item ${c.id === state.activeCharId ? 'on' : ''}" onclick="setActive_('${c.id}')">
      <div class="pt-av">${c.avatar ? `<img src="${c.avatar}">` : esc(c.name[0]||'?')}</div>
      <div class="pt-meta">
        <b>${esc(c.name)}</b>
        <span>${esc(c.race)} ${esc(c.cls)} Lv.${c.level} · AC ${c.ac}</span>
        <div class="hpbar"><i style="width:${pct}%"></i></div>
      </div>
      <span class="cb-hp">${c.hp}/${c.maxHp}</span>
    </div>`;
  }).join('') : '<p class="muted" style="font-size:12.5px">队伍为空。前往「仪式准备」点名。</p>';
}
window.setActive_ = id => { state.activeCharId = id; persist(); renderPartySide(); renderSheet(); renderQuick(); };

/* 侧栏：先攻 */
function renderCombat() {
  const cb = state.combat;
  $('#combat-card').style.display = cb.on ? '' : 'none';
  if (!cb.on) return;
  $('#combat-round').textContent = '第 ' + cb.round + ' 轮';
  $('#combat-list').innerHTML = cb.order.map((o, i) => `
    <div class="cb-item ${i === cb.turn ? 'turn' : ''} ${o.hp <= 0 ? 'dead' : ''}">
      <div class="cb-init">${o.init}</div>
      <div class="cb-name">${esc(o.name)}${o.enemy ? ' <span class="muted" style="font-size:10px">敌</span>' : ''}</div>
      <span class="cb-hp">${o.hp}/${o.maxHp}</span>
    </div>`).join('') || '<p class="muted" style="font-size:12.5px">空。</p>';
}

/* 侧栏：行囊 */
function renderBag() {
  const c = activeChar();
  if (!c) { $('#bag-list').innerHTML = '<p class="muted" style="font-size:12.5px">未选中角色。</p>'; return; }
  const inv = c.inv || [];
  $('#bag-list').innerHTML = `
    <div class="bag-item"><span>🪙 金币</span><b>${c.gold || 0}</b></div>
    ${inv.length ? inv.map(i => `<div class="bag-item"><span>· ${esc(i)}</span></div>`).join('') : '<p class="muted" style="font-size:12.5px;padding-top:6px">行囊空空。</p>'}
    ${(c.spells && c.spells.length) ? `<div class="sp-sec" style="margin-top:12px"><h4>法术 <em>${c.spells.length}</em></h4>${c.spells.map(s=>`<div class="bag-item"><span>✨ ${esc(s)}</span></div>`).join('')}</div>` : ''}`;
}

/* ─────────────── 10. 右侧角色面板 ─────────────── */

function renderSheet() {
  const c = activeChar(); const box = $('#sp-inner');
  if (!c) {
    box.innerHTML = `<div class="sp-empty"><i class="e-ico">🧝</i>未选中角色。<br>在「角色档案」创建，或在「仪式准备」点名入队。</div>`;
    return;
  }
  const hpPct = clamp((c.hp / c.maxHp) * 100, 0, 100);
  box.innerHTML = `
    <div class="sp-head">
      <div class="sp-av">${c.avatar ? `<img src="${c.avatar}">` : esc(c.name[0]||'?')}</div>
      <div style="min-width:0">
        <div class="sp-name">${esc(c.name)}</div>
        <div class="sp-sub">${esc(c.race)} · ${esc(c.cls)} · ${esc(c.align)}</div>
        <div class="sp-tags">
          <span class="sp-tag">LV ${c.level}</span>
          <span class="sp-tag">${esc(c.bg)}</span>
          <span class="sp-tag">XP ${c.xp||0}</span>
        </div>
      </div>
    </div>

    <div class="sp-vitals">
      <div class="vital hp" title="${esc(hpBreakdown(c).text)}"><div class="vl">HP 生命</div><div class="vv">${c.hp}<small>/${c.maxHp}</small></div>
        <div class="hpbar" style="margin-top:5px"><i style="width:${hpPct}%"></i></div>
        <div class="vl" style="margin-top:5px;font-size:9px">${c.hpManual ? '手动覆写' : `1d${c.hitDie} ＋ 体质 ${sign(MOD(c.ab.con))}`}</div></div>
      <div class="vital ac" title="AC 由护甲与敏捷调整值决定，可在角色编辑中调整"><div class="vl">AC 护甲</div><div class="vv">${c.ac}</div>
        <div class="vl" style="margin-top:5px">速度 ${c.speed} 尺 · 敏捷 ${sign(MOD(c.ab.dex))} · 熟练 ${sign(PROF(c.level))}</div></div>
    </div>

    <div class="sp-sec">
      <h4>基础属性 <em>点击掷检定</em></h4>
      <div class="ab-grid">
        ${ABKEYS.map(k => `<div class="ab-cell" onclick="rollAbility_('${k}')">
          <div class="an">${AB[k].short}</div>
          <div class="av">${c.ab[k]}</div>
          <div class="am">${sign(MOD(c.ab[k]))}</div>
        </div>`).join('')}
      </div>
      <div class="sp-actions" style="margin-top:9px;padding-top:9px">
        ${ABKEYS.map(k => `<button class="chip-btn" onclick="rollSave_('${k}')">${AB[k].zh}豁免 ${sign(saveBonus(c,k))}</button>`).join('')}
      </div>
    </div>

    <div class="sp-sec">
      <h4>技能 <em>● 为熟练项</em></h4>
      <div class="sk-list">
        ${SKILLS.map(s => {
          const prof = c.proficient.includes(s.n);
          return `<div class="sk-row ${prof ? 'prof' : ''}" onclick="rollSkill_('${s.n}')">
            <span class="sk-dot"></span>
            <span class="sn">${s.n}</span>
            <span class="sk-ab">${AB[s.a].short}</span>
            <span class="sv">${sign(skillBonus(c, s.n))}</span>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="sp-sec">
      <h4>装备与法术</h4>
      <div class="inv-row"><span>🪙 金币</span><em>${c.gold || 0}</em></div>
      ${(c.inv||[]).slice(0,6).map(i => `<div class="inv-row"><span>${esc(i)}</span></div>`).join('')}
      ${(c.spells||[]).length ? `<div style="margin-top:8px"></div>` + (c.spells||[]).map(s=>`<div class="inv-row"><span>✨ ${esc(s)}</span></div>`).join('') : ''}
    </div>

    ${c.notes ? `<div class="sp-sec"><h4>背景</h4><div style="font-size:12.5px;color:var(--ink-2);line-height:1.7">${fmtText(c.notes)}</div></div>` : ''}

    <div class="sp-actions">
      <button class="chip-btn" onclick="editChar_('${c.id}')">✎ 编辑</button>
      <button class="chip-btn" onclick="rollAbility_('str')">🎲 掷骰</button>
      <button class="chip-btn" onclick="longRest_('${c.id}')">🌙 长休</button>
      <button class="chip-btn" onclick="toggleSheetMobile_()">↔ 收起</button>
    </div>`;
}
window.toggleSheetMobile_ = () => {
  const el = $('#sheet-panel');
  if (el.classList.contains('open')) closeDrawers(); else openDrawer(el);
};
window.openSheetChar_ = id => { state.activeCharId = id; persist(); setView('table'); renderSheet(); showDiceSheetHint(); };
function showDiceSheetHint(){ openDrawer('#sheet-panel'); }
window.longRest_ = id => {
  const c = getChar(id); if (!c) return;
  c.hp = c.maxHp; c.tempHp = 0;
  addSys(`🌙 ${c.name} 完成长休，生命与法术位已恢复（HP ${c.hp}/${c.maxHp}）`);
  renderPartySide(); renderSheet(); persist();
};

window.rollAbility_ = k => doCheck(AB[k].zh, null, 'normal', 'ability:' + k);
window.rollSkill_  = n => doCheck(n, null, 'normal', 'skill:' + n);
window.rollSave_   = k => doCheck(AB[k].zh + '豁免', null, 'normal', 'save:' + k);

/* ─────────────── 11. 检定与掷骰 ─────────────── */

function resolveCheck(name) {
  const c = activeChar();
  const raw = name.replace(/\s*(检定|豁免)\s*$/, '');
  // 技能
  if (SKILL_MAP[raw] && c) return { label: raw, ab: SKILL_MAP[raw].a, bonus: skillBonus(c, raw) };
  // 属性中文/英文
  let key = ABKEYS.find(k => AB[k].zh === raw || k === raw.toLowerCase());
  if (key && c) {
    if (/豁免$/.test(name)) return { label: AB[key].zh + '豁免', ab: key, bonus: saveBonus(c, key) };
    return { label: AB[key].zh + '检定', ab: key, bonus: MOD(c.ab[key]) };
  }
  return { label: name, ab: null, bonus: c ? 0 : 0 };
}

function doCheck(name, dc, mode, hint) {
  const c = activeChar();
  let bonus = 0, label = name;
  if (hint && hint.startsWith('ability:')) { const k = hint.slice(8); bonus = MOD(c.ab[k]); label = AB[k].zh + '检定'; }
  else if (hint && hint.startsWith('skill:')) { const n = hint.slice(6); bonus = skillBonus(c, n); label = n + '检定'; }
  else if (hint && hint.startsWith('save:')) { const k = hint.slice(5); bonus = saveBonus(c, k); label = AB[k].zh + '豁免'; }
  else { const r = resolveCheck(name); bonus = r.bonus; label = r.label + (/检定|豁免/.test(r.label) ? '' : ' 检定'); }
  if (!c) { toast('请先选择一名角色', 'err'); return; }

  const { v, pair, mode: md } = d20Roll({ mode });
  const total = v + bonus;
  const dlabel = label + (md === 'adv' ? '（优势）' : md === 'dis' ? '（劣势）' : '');
  const crit = v === 20 ? 'nat20' : v === 1 ? 'nat1' : '';
  const verdict = dc ? (v === 20 ? 'pass' : v === 1 ? 'fail' : (total >= dc ? 'pass' : 'fail')) : '';
  const detail = (md === 'normal' ? 'd20' : `2d20[${pair.join(',')}]→${v}`) + sign(bonus);

  flashDice(v, dlabel, crit);
  pushMsg({
    role:'dice', label: dlabel, detail, total, crit, verdict,
    compare: dc ? `对抗 DC ${dc} — ${verdict === 'pass' ? '成功' : '失败'}` : '',
    note: `${c.name}`, ts: Date.now()
  });
  persist();
}

function doRoll(expr, note, label) {
  const r = rollExpr(expr);
  if (!r) { toast('骰子语法无法解析：' + expr, 'err'); return null; }
  const crit = (r.rolls.length === 1 && r.rolls[0].kind === 'd' && r.rolls[0].f === 20) ? (r.rolls[0].kept[0] === 20 ? 'nat20' : r.rolls[0].kept[0] === 1 ? 'nat1' : '') : '';
  flashDice(r.total, label || '骰点', crit);
  pushMsg({ role:'dice', label: label || '命运投掷', detail: exprLabel(r), total: r.total, crit, note, ts: Date.now() });
  persist();
  return r;
}

function flashDice(v, label, crit) {
  if (!state.settings.anim) return;
  const layer = $('#dice-layer');
  const el = document.createElement('div');
  el.className = 'dice-flash rolling ' + (crit || '');
  el.innerHTML = `<div class="die3d">?</div><div class="dlabel">${esc(label || '投掷中')}</div>`;
  layer.appendChild(el);
  const die = el.querySelector('.die3d');
  const iv = setInterval(() => { die.textContent = D(20); }, 62);
  let n = 0;
  const total = 16;
  const t2 = setInterval(() => {
    n++;
    if (n >= total) {
      clearInterval(iv); clearInterval(t2);
      die.textContent = v;
      el.classList.remove('rolling');
      if (crit === 'nat20' || crit === 'nat1') {
        for (let i = 0; i < 14; i++) {
          const s = document.createElement('div');
          s.className = 'spark';
          s.style.left = '50%'; s.style.top = '50%';
          s.style.setProperty('--dx', (Math.random() * 200 - 100).toFixed(0) + 'px');
          s.style.setProperty('--dy', (Math.random() * 200 - 100).toFixed(0) + 'px');
          s.style.background = crit === 'nat20' ? '#c8a45e' : '#a33a34';
          el.appendChild(s);
        }
      }
      setTimeout(() => { el.style.transition = '.4s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 420); }, crit ? 1050 : 700);
    }
  }, 34);
}

/* ─────────────── 12. 聊天输入与指令 ─────────────── */

function sendChat() {
  const box = $('#chat-text');
  const raw = box.value.trim();
  if (!raw) return;
  box.value = ''; box.style.height = 'auto';
  if (handleCommand(raw)) return;
  // 纯骰子表达式
  if (/^[0-9]*d[0-9]+([+-]\d+)?([a-z]{2}\d+)?$/i.test(raw.replace(/\s/g, ''))) { doRoll(raw, '', '快速投掷'); return; }
  const c = activeChar();
  pushMsg({ role:'player', name: c ? c.name : '你', text: raw, ts: Date.now() });
  askDM();
}

function handleCommand(t) {
  const m0 = t.match(/^[.\/]([a-z\u4e00-\u9fa5]+)\s*([\s\S]*)$/i);
  if (!m0) return false;
  const cmd = m0[1].toLowerCase(), rest = m0[2].trim();
  switch (cmd) {
    case 'r': case 'roll': {
      const mm = rest.match(/^([0-9dD+\-*\s]+)(.*)$/);
      const expr = mm ? mm[1].trim() : rest;
      const note = mm ? mm[2].trim() : '';
      if (!expr) { toast('用法：.r 2d6+3 描述', 'err'); return true; }
      doRoll(expr, note, note || '命运投掷'); return true;
    }
    case 'ra': case 'check': case '检定': {
      if (!rest) { toast('用法：.ra 察觉 15', 'err'); return true; }
      const mm = rest.match(/^(\S+)\s*(?:dc)?\s*(\d+)?\s*(.*)$/i);
      const name = mm[1], dc = mm[2] ? parseInt(mm[2], 10) : null, desc = (mm[3] || '').trim();
      if (desc) pushMsg({ role:'player', name: (activeChar()||{}).name || '你', text: desc, ts: Date.now() });
      doCheck(name, dc, 'normal', null); return true;
    }
    case 'adv': case 'dis': {
      const mm = rest.match(/^(\S+)\s*(\d+)?/);
      if (!mm) { toast('用法：.adv 隐匿 15', 'err'); return true; }
      doCheck(mm[1], mm[2] ? parseInt(mm[2],10) : null, cmd === 'adv' ? 'adv' : 'dis', null); return true;
    }
    case 'atk': case '攻击': {
      const c = activeChar(); if (!c) { toast('请先选择角色', 'err'); return true; }
      const mm = rest.match(/^(\S+)\s*(\d+)?\s*([+-]\d+)?/);
      const weapon = mm ? mm[1] : '武器';
      const ac = mm && mm[2] ? parseInt(mm[2], 10) : 13;
      const extra = mm && mm[3] ? parseInt(mm[3], 10) : 0;
      const isFinesse = /匕首|短剑|细剑|鞭|弓|弩/.test(weapon);
      const k = isFinesse ? 'dex' : 'str';
      const bonus = MOD(c.ab[k]) + PROF(c.level) + extra;
      const { v } = d20Roll({});
      const total = v + bonus;
      const hit = v === 20 || (v !== 1 && total >= ac);
      const dmgExpr = weapon.includes('巨') || weapon.includes('双手') ? '2d6' : (weapon.includes('短') || /匕首|飞刀/.test(weapon) ? '1d4' : '1d8');
      const crit = v === 20 ? 'nat20' : v === 1 ? 'nat1' : '';
      flashDice(v, `攻击 · ${weapon}`, crit);
      let dmg = null;
      if (hit) { dmg = rollExpr(dmgExpr + sign(MOD(c.ab[k])) + (v === 20 ? `+${dmgExpr}` : '')).total; }
      pushMsg({
        role:'dice', label:`攻击 · ${weapon}`, detail:`d20+${bonus}`, total, crit,
        compare:`对抗 AC ${ac} — ${hit ? '命中' : '失手'}${dmg !== null ? ` · 伤害 ${dmg}` : ''}`,
        note:c.name, ts:Date.now()
      });
      return true;
    }
    case 'hp': case '血': {
      const c = activeChar(); if (!c) { toast('请先选择角色', 'err'); return true; }
      const n = parseFloat(rest);
      if (isNaN(n)) { toast('用法：.hp -8 或 .hp 12', 'err'); return true; }
      c.hp = clamp(c.hp + n, 0, c.maxHp);
      addSys(`${c.name} HP ${n >= 0 ? '+' : ''}${n} → ${c.hp}/${c.maxHp}`);
      renderChat(); renderPartySide(); renderSheet(); persist(); return true;
    }
    case 'xp': {
      const c = activeChar(); if (!c) { toast('请先选择角色', 'err'); return true; }
      const n = parseInt(rest, 10); if (isNaN(n)) { toast('用法：.xp 300', 'err'); return true; }
      gainXp(c, n); renderChat(); renderPartySide(); renderSheet(); persist(); return true;
    }
    case 'gold': {
      const c = activeChar(); if (!c) { toast('请先选择角色', 'err'); return true; }
      const n = parseInt(rest, 10); if (isNaN(n)) { toast('用法：.gold +50', 'err'); return true; }
      c.gold = Math.max(0, (c.gold||0) + n);
      addSys(`${c.name} 金币 ${n>=0?'+':''}${n} → ${c.gold}`);
      renderChat(); renderSheet(); persist(); return true;
    }
    case 'save': { saveSession(); return true; }
    case 'clear': { state.chat = []; persist(); renderChat(); toast('桌面已清空'); return true; }
    default: return false;
  }
}

/* ─────────────── 13. AI 地下城主 ─────────────── */

function buildSystemPrompt() {
  const st = state.settings;
  const mod = state.modules.find(m => m.id === state.moduleId);
  const p = party();
  const sheetText = p.length ? p.map(c => {
    const sk = c.proficient.length ? `，熟练技能：${c.proficient.join('、')}` : '';
    const ab = ABKEYS.map(k => `${AB[k].zh}${c.ab[k]}(${sign(MOD(c.ab[k]))})`).join(' ');
    return `◆ ${c.name}｜${c.race}${c.cls} Lv.${c.level}｜AC ${c.ac}｜HP ${c.hp}/${c.maxHp}｜速度 ${c.speed}\n  ${ab}${sk}\n  装备：${(c.inv||[]).join('、') || '无'}｜金币 ${c.gold||0}${(c.spells||[]).length ? `\n  法术：${c.spells.join('、')}` : ''}`;
  }).join('\n') : '（本场暂无预设角色卡）';

  return `你是「艾尔德林（Aeldrin）」，一位经验老到的《龙与地下城》第五版（D&D 5e）地下城主（DM）。你正在主持一场线下跑团，玩家就在你对面。

【你的职责】
1. 描绘场景：用五感（视觉、声音、气味、触感）让世界可信。每次回复 2–4 段，不要写成小说旁白，要留出玩家行动的空间。
2. 扮演所有 NPC 与怪物，给他们性格、口音与动机。用「」包裹对话。
3. 公平裁定：玩家做任何有失败风险的事，让你知道他该掷什么骰。绝不代替玩家掷骰，绝不替玩家决定行动。
4. 推动剧情：不要原地打转。每次回复末尾至少给出一个可被感知的线索、威胁或选择。
5. 保持连续性：牢记已发生的事，不要前后矛盾。

【本场设定】
· 叙事风格：${st.style}
· 叙事视角：${st.pov}
· 难度取向：${st.difficulty}
· 参考规则：D&D 5e 核心规则（属性检定 d20+调整值 vs DC；攻击 d20+加值 vs AC；自然 20 大成功，自然 1 大失败）
· 属性调整值：属性值 10-11=+0，12-13=+1，14-15=+2，16-17=+3，18-19=+4
· 常见 DC：容易 10 / 中等 15 / 困难 20 / 极难 25

【当前模组】
${mod ? `《${mod.title}》\n${(mod.content || '').slice(0, 9000)}` : '（无预设模组，请你即兴创作一个符合上述风格的开场。）'}

【冒险者角色卡】
${sheetText}

【输出格式 · 必须遵守】
- 用中文，第二人称或按设定视角。
- 需要玩家掷骰时，在叙事之后**另起一行**输出指令块，格式严格如下：
[检定: 技能名|DC 数值]
例如：[检定: 察觉|DC 15]  或  [检定: 力量|DC 13]
- 只有在剧情确实造成数值变化时才使用（每条独占一行，一次最多 3 条）：
[伤害: 8]   [治疗: 6]   [经验: 150]   [金币: 50]
- 不要解释指令块的含义，不要用引号包住它，不要在指令块前加「检定：」之类的说明文字。
- 不要输出 JSON、代码块或 Markdown 表格。
- 如果玩家只是闲聊或做无风险的动作，直接叙事即可，不要强行索要掷骰。

开场时，用一段有画面感的场景描写把玩家带进故事，然后给出两三个可感知的切入点。`;
}

async function askDM() {
  const st = state.settings;
  if (!st.apiBase || !st.apiKey || !st.model) {
    pushMsg({ role:'sys', text:'尚未配置 AI 接口。请前往「设置中心」填写 API 地址与密钥（也可先只用骰子与角色卡功能）', ts: Date.now() });
    openSettingsHint();
    return;
  }
  const typingId = 'typing-' + uid();
  const log = $('#chat-log');
  const holder = document.createElement('div');
  holder.className = 'msg dm'; holder.id = typingId;
  holder.innerHTML = `<div class="who">🜂 地下城主 · DM</div><div class="body"><span class="typing"><i></i><i></i><i></i></span></div>`;
  log.appendChild(holder); log.scrollTop = log.scrollHeight;
  $('#btn-send').disabled = true;

  const msgs = [{ role:'system', content: buildSystemPrompt() }];
  const hist = state.chat.filter(m => m.role === 'dm' || m.role === 'player').slice(-24);
  for (const h of hist) msgs.push({ role: h.role === 'dm' ? 'assistant' : 'user', content: (h.role === 'player' && h.name ? `【${h.name}】` : '') + h.text });

  let full = '';
  try {
    full = await callAI(msgs, (deltaTxt, acc) => {
      full = acc;
      holder.querySelector('.body').innerHTML = fmtText(acc) || '<span class="typing"><i></i><i></i><i></i></span>';
      log.scrollTop = log.scrollHeight;
    });
  } catch (e) {
    holder.remove();
    $('#btn-send').disabled = false;
    pushMsg({ role:'sys', text:'接口调用失败：' + e.message, ts: Date.now() });
    setApiStatus('err', '请求失败：' + e.message);
    return;
  }
  holder.remove();
  $('#btn-send').disabled = false;

  const { text, markers } = parseMarkers(full);
  state.chat.push({ role:'dm', text: (text || full).trim(), markers, ts: Date.now() });
  renderChat(); renderQuick();
  if (state.settings.autoSave) saveSession(true);
  persist();
}

function parseMarkers(txt) {
  const markers = [];
  const re = /\[(检定|伤害|治疗|经验|金币|HP)\s*[:：]\s*([^\]\n]+)\]/g;
  const text = String(txt).replace(re, (full, type, body) => {
    body = body.trim();
    if (type === '检定') {
      const parts = body.split(/[|｜]/);
      let name = (parts[0] || '').trim();
      let dc = null;
      for (const p of parts.slice(1)) {
        const mm = p.match(/(\d+)/); if (mm) dc = parseInt(mm[1], 10);
      }
      if (!dc) { const mm = name.match(/(\d+)/); if (mm) { dc = parseInt(mm[1], 10); name = name.replace(/\d+/g, '').replace(/[|｜]/g, '').trim(); } }
      if (name) markers.push({ type:'check', name: name.replace(/\s+/g,''), dc });
    } else {
      const n = parseInt((body.match(/-?\d+/) || [0])[0], 10);
      if (type === '伤害') markers.push({ type:'dmg', val: Math.abs(n) });
      else if (type === '治疗') markers.push({ type:'heal', val: Math.abs(n) });
      else if (type === '经验') markers.push({ type:'xp', val: Math.abs(n) });
      else if (type === '金币') markers.push({ type:'gold', val: n });
      else if (type === 'HP') markers.push({ type:'hp', val: n });
    }
    return '';
  }).replace(/\n{3,}/g, '\n\n').trim();
  return { text, markers };
}

window.regenerate_ = () => {
  // 去除最后一条 DM 消息，重新生成
  for (let i = state.chat.length - 1; i >= 0; i--) {
    if (state.chat[i].role === 'dm') { state.chat.splice(i, 1); break; }
    if (state.chat[i].role === 'player') { state.chat.splice(i + 1); break; }
  }
  renderChat(); askDM();
};

async function callAI(msgs, onDelta) {
  const st = state.settings;
  const url = st.apiBase.replace(/\/+$/, '') + '/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + st.apiKey },
    body: JSON.stringify({ model: st.model, messages: msgs, temperature: Number(st.temp) || 0.8, stream: true })
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${t.slice(0, 220)}`);
  }
  if (!res.body || !res.body.getReader) {
    const j = await res.json();
    const c = j.choices?.[0]?.message?.content || '';
    onDelta(c, c); return c;
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder('utf-8');
  let buf = '', full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n'); buf = lines.pop();
    for (const line of lines) {
      const s = line.trim();
      if (!s || !s.startsWith('data:')) continue;
      const d = s.slice(5).trim();
      if (d === '[DONE]') continue;
      try {
        const j = JSON.parse(d);
        const c = j.choices?.[0]?.delta?.content || j.choices?.[0]?.message?.content || '';
        if (c) { full += c; onDelta(c, full); }
      } catch (_) { /* 忽略半包 */ }
    }
  }
  if (!full.trim()) throw new Error('接口返回为空，请检查模型名称是否正确');
  return full;
}

/* ─────────────── 14. 存档（按远征分组） ─────────────── */

const LEGACY_GROUP = '__legacy__';

function defaultCampaignName() {
  const m = state.modules.find(x => x.id === state.moduleId);
  return m ? m.title.replace(/^《|》$/g, '') : '即兴冒险';
}
function campaignGet(id) { return (state.campaigns || []).find(c => c.id === id) || null; }
function campaignCurrent() { return campaignGet(state.campaignId); }
function ensureCampaign(name) {
  let c = campaignCurrent();
  if (!c) {
    c = { id: uid(), name: (name || defaultCampaignName()).trim() || '未命名远征', moduleId: state.moduleId, ts: Date.now() };
    state.campaigns.push(c);
    state.campaignId = c.id;
  } else if (name && name.trim()) {
    c.name = name.trim();
  }
  if (!c.moduleId) c.moduleId = state.moduleId;
  return c;
}

function snapshot() {
  return {
    moduleId: state.moduleId,
    partyIds: [...state.partyIds],
    activeCharId: state.activeCharId,
    chat: JSON.parse(JSON.stringify(state.chat)),
    combat: JSON.parse(JSON.stringify(state.combat)),
    chars: party().map(c => JSON.parse(JSON.stringify(c)))
  };
}

function saveSession(auto = false) {
  if (!state.chat.length && !state.partyIds.length) { if (!auto) toast('桌面为空，无需保存', 'err'); return; }
  const camp = ensureCampaign(state.pendingCampaignName || defaultCampaignName());
  const snap = snapshot();
  const last = [...state.chat].reverse().find(m => m.role === 'dm' || m.role === 'player');
  let rec = auto ? state.saves.find(s => s.auto && s.campaignId === camp.id) : null;
  if (!rec) rec = { id: uid(), auto, ts: 0 };
  const stamp = fmtTime(Date.now()).slice(5);
  rec.name = (auto ? '自动存档 · ' : '手动存档 · ') + stamp;
  rec.campaignId = camp.id;
  rec.campaignName = camp.name;
  rec.mode = state.partyIds.length > 1 ? 'multi' : 'solo';
  rec.ts = Date.now();
  rec.session = snap;
  rec.preview = last ? String(last.text).replace(/\[[^\]]*\]/g, '').replace(/[\n\r]+/g, ' ').trim().slice(0, 90) : '（无记录）';
  if (!state.saves.includes(rec)) state.saves.unshift(rec);
  state.saves.sort((a, b) => b.ts - a.ts);
  persist();
  if (!auto) toast('已存入「' + camp.name + '」');
  renderHome(); renderSaves();
}

window.loadSave_ = id => {
  const s = state.saves.find(x => x.id === id); if (!s) return;
  const sess = s.session || {};
  // 合并角色（保留原有 id），并重算派生数值
  (sess.chars || []).forEach(c => {
    if (!c.abBase) c.abBase = { ...c.ab };
    try { syncDerived(c); } catch (_) {}
    const i = state.chars.findIndex(x => x.id === c.id);
    if (i >= 0) state.chars[i] = { ...state.chars[i], ...c };
    else state.chars.push(c);
  });
  state.moduleId = sess.moduleId || state.moduleId;
  state.partyIds = sess.partyIds || [];
  state.activeCharId = sess.activeCharId || state.partyIds[0] || null;
  state.chat = sess.chat || [];
  state.combat = sess.combat || { on: false, round: 1, order: [], turn: 0 };
  // 恢复远征归属
  if (s.campaignId) {
    if (!campaignGet(s.campaignId)) {
      state.campaigns.push({ id: s.campaignId, name: s.campaignName || '未命名远征', moduleId: state.moduleId, ts: s.ts || Date.now() });
    }
    state.campaignId = s.campaignId;
    const c = campaignGet(s.campaignId);
    state.pendingCampaignName = c ? c.name : '';
  } else {
    state.campaignId = null;
    state.pendingCampaignName = s.campaignName || defaultCampaignName();
  }
  persist();
  setView('table');
  renderPrep();
  toast('记忆已读取');
};

window.delSave_ = id => {
  if (!confirm('永久移除这条记录？')) return;
  state.saves = state.saves.filter(s => s.id !== id);
  persist(); renderSaves(); renderHome();
};

window.toggleGroup_ = gid => {
  state.collapsed[gid] = !state.collapsed[gid];
  persist(); renderSaves();
};
window.renameCampaign_ = gid => {
  const c = campaignGet(gid);
  if (!c) { toast('早期存档分组无法重命名', 'err'); return; }
  const n = prompt('新的远征名称（这场冒险的所有存档会一起归到这个名字下）', c.name);
  if (n === null) return;
  if (!n.trim()) { toast('名称不能为空', 'err'); return; }
  c.name = n.trim();
  state.saves.forEach(s => { if (s.campaignId === gid) s.campaignName = c.name; });
  if (state.campaignId === gid) state.pendingCampaignName = c.name;
  persist(); renderSaves(); renderPrep(); toast('已重命名为「' + c.name + '」');
};
window.delCampaign_ = gid => {
  if (!confirm('解散这个分组？组内存档会保留，并归入「早期存档」。')) return;
  state.saves.forEach(s => { if (s.campaignId === gid) { delete s.campaignId; } });
  state.campaigns = state.campaigns.filter(c => c.id !== gid);
  if (state.campaignId === gid) state.campaignId = null;
  persist(); renderSaves(); toast('分组已解散');
};

function saveCardHTML(s) {
  return `<div class="save-card">
    <div class="sc-hd">
      <b>${esc(s.name)}</b>
      <span class="sc-mode ${s.mode === 'multi' ? 'multi' : ''}">${s.auto ? '自动' : (s.mode === 'multi' ? '多角色' : '单人')}</span>
    </div>
    <div class="sc-prev">${esc(s.preview || '无记录…')}</div>
    <div class="sc-ft">
      <span class="sc-date">${fmtTime(s.ts)} · ${(s.session?.chat || []).length} 条 · ${(s.session?.chars || []).length} 名角色</span>
      <button class="sc-btn" onclick="loadSave_('${s.id}')">读取</button>
      <button class="sc-btn" onclick="exportSave_('${s.id}')">导出</button>
      <button class="sc-btn del" onclick="delSave_('${s.id}')">删除</button>
    </div>
  </div>`;
}

function renderSaves() {
  const box = $('#save-grid');
  if (!state.saves.length) {
    box.innerHTML = `<div class="empty"><i class="e-ico">🗄️</i>这里空无一物，只有时间的尘埃。<br>
      <span class="muted" style="font-size:12px">每次「开启远征」都会建立一个独立的存档分组。</span></div>`;
    return;
  }
  const groups = new Map();
  state.saves.forEach(s => {
    const gid = s.campaignId || LEGACY_GROUP;
    if (!groups.has(gid)) groups.set(gid, []);
    groups.get(gid).push(s);
  });
  const arr = [...groups.entries()].map(([gid, list]) => {
    list.sort((a, b) => b.ts - a.ts);
    const camp = gid === LEGACY_GROUP ? null : campaignGet(gid);
    const modId = list[0].session && list[0].session.moduleId;
    const mod = state.modules.find(m => m.id === modId);
    return {
      gid, list,
      name: camp ? camp.name : (list[0].campaignName || '早期存档（未分组）'),
      latest: list[0].ts,
      auto: list.filter(s => s.auto).length,
      mod: mod ? mod.title.replace(/^《|》$/g, '') : '',
      chars: (list[0].session && list[0].session.chars || []).map(c => c.name).join('、')
    };
  }).sort((a, b) => b.latest - a.latest);

  box.innerHTML = arr.map(g => `
    <div class="group ${state.collapsed[g.gid] ? 'collapsed' : ''}">
      <div class="group-hd" onclick="toggleGroup_('${g.gid}')">
        <span class="gh-ico">🗂️</span>
        <div class="gh-meta">
          <b>${esc(g.name)}</b>
          <span>${g.list.length} 条记录 · 最近 ${fmtTime(g.latest)}${g.mod ? ' · 模组：' + esc(g.mod) : ''}${g.chars ? ' · ' + esc(g.chars) : ''}</span>
        </div>
        ${g.auto ? '<span class="card-tag">含自动存档</span>' : ''}
        <div class="gh-act">
          <button class="sc-btn" onclick="event.stopPropagation();loadSave_('${g.list[0].id}')">读取最新</button>
          ${g.gid !== LEGACY_GROUP ? `<button class="sc-btn" onclick="event.stopPropagation();renameCampaign_('${g.gid}')">重命名</button>
          <button class="sc-btn del" onclick="event.stopPropagation();delCampaign_('${g.gid}')">解散</button>` : ''}
          <span class="gd-arrow">▾</span>
        </div>
      </div>
      <div class="group-bd">${g.list.map(saveCardHTML).join('')}</div>
    </div>`).join('');
}
window.exportSave_ = id => {
  const s = state.saves.find(x => x.id === id); if (!s) return;
  download(`${s.name || '存档'}.json`, JSON.stringify(s, null, 2));
};

/* ─────────────── 15. 吟游诗篇 ─────────────── */

function renderNovel() {
  $('#novel-tag').textContent = state.novels.length + ' 篇';
  const box = $('#novel-shelf');
  box.innerHTML = state.novels.length ? state.novels.map(n => `
    <div class="save-card" style="margin-bottom:14px">
      <div class="sc-hd"><b>${esc(n.title)}</b><span class="sc-mode">${esc(n.style || '')}</span></div>
      <div class="sc-prev" style="height:auto;max-height:80px">${esc((n.text || '').slice(0, 160))}…</div>
      <div class="sc-ft">
        <span class="sc-date">${fmtTime(n.ts)} · ${(n.text || '').length} 字</span>
        <button class="sc-btn" onclick="readNovel_('${n.id}')">阅读</button>
        <button class="sc-btn" onclick="exportNovel_('${n.id}')">导出 MD</button>
        <button class="sc-btn del" onclick="delNovel_('${n.id}')">删除</button>
      </div>
    </div>`).join('') : `<div class="empty"><i class="e-ico">🪶</i>书架上空空如也。</div>`;
}
window.readNovel_ = id => {
  const n = state.novels.find(x => x.id === id); if (!n) return;
  openModal({ title: n.title, wide: true, body: `<div class="novel-read"><h1>${esc(n.title)}</h1>${esc(n.text)}</div>`, footer: `<button class="btn" onclick="closeModal()">关闭</button>` });
};
window.exportNovel_ = id => {
  const n = state.novels.find(x => x.id === id); if (!n) return;
  download(`${n.title}.md`, `# ${n.title}\n\n> ${n.style || ''} · ${fmtTime(n.ts)}\n\n${n.text}\n`, 'text/markdown');
};
window.delNovel_ = id => { state.novels = state.novels.filter(n => n.id !== id); persist(); renderNovel(); };

async function generateNovel() {
  const st = state.settings;
  const src = state.chat.filter(m => m.role === 'dm' || m.role === 'player');
  if (src.length < 3) { toast('日志太短了，先跑一段剧情吧', 'err'); return; }
  const style = $('#novel-style').value, lenMap = { 0:'600', 1:'1500', 2:'3000' };
  const len = lenMap[$('#novel-len').selectedIndex] || '900';
  const wantTitle = $('#novel-title').value.trim();
  if (!st.apiKey) { toast('需要配置 AI 接口才能创作', 'err'); return; }
  openModal({
    title: '吟游诗篇 · 正在撰写', narrow: true,
    body: `<div style="text-align:center;padding:26px 0"><div class="typing"><i></i><i></i><i></i></div>
      <p class="muted" style="margin-top:14px">羽毛笔正在纸上飞舞…</p></div>`, noFooter: true
  });
  const log = src.map(m => (m.role === 'player' ? `【玩家】` : `【DM】`) + String(m.text).replace(/\[(检定|伤害|治疗|经验|金币)[^\]]*\]/g, '')).join('\n').slice(-12000);
  const prompt = `下面是一场《龙与地下城》跑团的过程记录。请把它改写成一篇完整的短篇小说。

要求：
- 文体：${style}
- 目标篇幅：约 ${len} 字
- ${wantTitle ? `标题定为《${wantTitle}》` : '请在开头第一行用一个「# 标题」的形式给出你认为合适的标题'}
- 保留关键情节、角色名字、战斗与抉择，但可以补充氛围描写与心理活动。
- 不要出现骰子数值、DC、HP 之类的游戏术语，要让它读起来像真正的文学。
- 使用中文。只输出小说正文（含标题行），不要任何解释、前言或结语。

【跑团记录】
${log}`;
  try {
    const out = await callAI([{ role:'user', content: prompt }], () => {});
    let title = wantTitle || '无名之章';
    let text = out.trim();
    const m = text.match(/^#\s*(.+)$/m);
    if (m) { if (!wantTitle) title = m[1].trim(); text = text.replace(/^#\s*.+$/m, '').trim(); }
    state.novels.unshift({ id: uid(), title, style, text, ts: Date.now() });
    persist(); closeModal(); renderNovel();
    openModal({ title, wide: true, body: `<div class="novel-read"><h1>${esc(title)}</h1>${esc(text)}</div>`,
      footer: `<button class="btn ghost" onclick="closeModal()">关闭</button><button class="btn" onclick="exportNovel_('${state.novels[0].id}')">导出 Markdown</button>` });
  } catch (e) {
    closeModal(); toast('创作失败：' + e.message, 'err');
  }
}

/* ─────────────── 16. 角色卡编辑器（分步向导） ─────────────── */

let WIZ = null;
const WIZ_STEPS = ['种族', '职业', '出身', '属性', '技能', '细节'];

function renderCodex() {
  const box = $('#char-grid');
  if (!state.chars.length) {
    box.innerHTML = `<div class="empty"><i class="e-ico">🧝</i>档案室空空如也。点击右上角创建第一位冒险者。<br>
      <span class="muted" style="font-size:12px">创建流程分为 6 步：种族 → 职业 → 出身 → 属性 → 技能 → 细节</span></div>`;
    return;
  }
  box.innerHTML = state.chars.map(c => `
    <div class="char-card" onclick="editChar_('${c.id}')">
      <button class="cc-del" onclick="event.stopPropagation();delChar_('${c.id}')">✕</button>
      <div class="cc-top">
        <div class="cc-av">${c.avatar ? `<img src="${c.avatar}">` : esc(c.name[0]||'?')}</div>
        <div style="min-width:0">
          <div class="cc-name">${esc(c.name)}</div>
          <div class="cc-sub">${esc(c.race)} · ${esc(c.cls)} · ${esc(c.bg)} · Lv.${c.level}</div>
        </div>
      </div>
      <div class="cc-stats">
        ${ABKEYS.map(k => `<div class="cc-stat"><b>${c.ab[k]}</b><span>${AB[k].short}</span></div>`).join('')}
      </div>
      <div class="cc-strip">
        <i>❤️ ${c.hp}/${c.maxHp}</i><i>🛡 AC ${c.ac}</i><i>🪙 ${c.gold||0}</i>
      </div>
    </div>`).join('');
}
window.delChar_ = id => {
  if (!confirm('删除这位冒险者？相关存档中的副本不受影响。')) return;
  state.chars = state.chars.filter(c => c.id !== id);
  state.partyIds = state.partyIds.filter(x => x !== id);
  if (state.activeCharId === id) state.activeCharId = state.partyIds[0] || null;
  persist(); renderCodex(); renderSheet();
};

/* ── 向导入口 ── */
function wizOpen(id) {
  const src = id ? getChar(id) : null;
  const d = src ? JSON.parse(JSON.stringify(src)) : newChar();
  if (!d.abBase) d.abBase = { ...d.ab };
  WIZ = {
    isNew: !src, step: 0, d,
    method: src ? 'manual' : 'array',
    pool: src ? null : [...STD_ARRAY],
    assign: { str:0, dex:1, con:2, int:3, wis:4, cha:5 },
    picks: (src ? d.proficient.filter(n => !wizLockedSkills(d).includes(n)) : []),
    avatarTmp: d.avatar || ''
  };
  if (!src) wizAutoAssign(true);
  wizRender();
}
window.editChar_ = wizOpen;

/* ── 技能来源计算 ── */
function wizLockedSkills(d) {
  const bg = BACKGROUNDS[d.bg] || {};
  const out = [...(bg.skills || [])];
  if (d.race === '高等精灵' || d.race === '木精灵') out.push('察觉');
  if (d.race === '半兽人') out.push('威吓');
  if (d.race === '半身人') { /* 无固定技能 */ }
  return [...new Set(out)];
}
function wizSkillBudget(d) {
  const cl = CLASSES[d.cls] || {};
  const cls = (cl.sk && cl.sk.count) || 2;
  let free = 0;
  if (d.race === '人类') free = 1;
  if (d.race === '半精灵') free = 2;
  return { cls, free, total: cls + free, list: (cl.sk && cl.sk.list) || [] };
}
function wizClassOpen(d) {
  const b = wizSkillBudget(d);
  return !b.list.length || /^任意/.test(b.list[0]);
}

/* ── 属性分配 ── */
function wizBaseOf(k) {
  if (WIZ.pool && WIZ.assign) return WIZ.pool[WIZ.assign[k]];
  return WIZ.d.abBase[k];
}
function wizAutoAssign(silent) {
  const d = WIZ.d;
  if (!WIZ.pool) return;
  const idx = WIZ.pool.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).map(x => x[1]);
  const pr = CLASS_AB_PRIORITY[d.cls] || ABKEYS;
  pr.forEach((k, i) => { WIZ.assign[k] = idx[i]; });
  ABKEYS.forEach(k => { d.abBase[k] = wizBaseOf(k); });
  if (!silent) toast('已按「' + d.cls + '」的推荐顺序分配');
}

/* ── 渲染 ── */
function wizRender() {
  const d = WIZ.d;
  // 同步 base → 最终属性
  ABKEYS.forEach(k => { d.abBase[k] = wizBaseOf(k); });
  syncDerived(d);
  const step = WIZ.step;
  const body = [wizStep0, wizStep1, wizStep2, wizStep3, wizStep4, wizStep5][step]();
  const nav = `
    <button class="btn ghost" onclick="wizPrev_()" ${step === 0 ? 'disabled' : ''}>← 上一步</button>
    ${step < 5
      ? `<button class="btn primary" onclick="wizNext_()">下一步 →</button>`
      : `<button class="btn primary" onclick="wizSave_()">${WIZ.isNew ? '✦ 放入档案室' : '✦ 保存修改'}</button>`}`;
  openModal({
    title: (WIZ.isNew ? '创建冒险者' : '编辑 · ' + d.name) + '　—　' + WIZ_STEPS[step],
    wide: true,
    body: `
      <div class="wiz-steps">
        ${WIZ_STEPS.map((s, i) => `<button class="wiz-step ${i === step ? 'on' : (i < step ? 'done' : '')}" onclick="wizGo_(${i})">${i+1}. ${s}</button>`).join('')}
      </div>
      ${body}`,
    footer: `<button class="btn ghost" onclick="closeModal()">取消</button>${nav}`
  });
}

/* ── 步骤 0：种族 ── */
function wizStep0() {
  const d = WIZ.d;
  return `
    <div class="wiz-split">
      <div class="wiz-list">
        ${Object.keys(RACES).map(r => `<div class="wiz-li ${r === d.race ? 'on' : ''}" onclick="wizPick_('race','${r}')">
          <span>${esc(r)}</span><small>${esc(RACES[r].note)}</small></div>`).join('')}
      </div>
      <div class="wiz-detail">${raceDetail(d.race)}</div>
    </div>`;
}
function raceDetail(name) {
  const r = RACES[name]; if (!r) return '';
  const fla = esc(r.flavor).split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  return `
    <div class="wiz-flavor"><h4>世界观 · ${esc(name)}</h4>${fla}</div>
    <div class="wiz-mech"><h4>规则 · 数值与机制</h4>
      <table class="mech-table">${r.mech.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table>
      <p class="mech-note">属性加值：${Object.entries(r.bonus).map(([k, v]) => AB[k].zh + ' +' + v).join('　')}　｜　速度 ${r.speed} 尺　｜　体型 ${r.size}</p>
    </div>`;
}

/* ── 步骤 1：职业 ── */
function wizStep1() {
  const d = WIZ.d;
  return `
    <div class="wiz-split">
      <div class="wiz-list">
        ${Object.keys(CLASSES).map(c => `<div class="wiz-li ${c === d.cls ? 'on' : ''}" onclick="wizPick_('cls','${c}')">
          <span>${esc(c)}</span><small>d${CLASSES[c].hd} · ${esc(CLASSES[c].note)}</small></div>`).join('')}
      </div>
      <div class="wiz-detail">${classDetail(d.cls)}</div>
    </div>`;
}
function classDetail(name) {
  const c = CLASSES[name]; if (!c) return '';
  const fla = esc(c.flavor).split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  return `
    <div class="wiz-flavor"><h4>世界观 · ${esc(name)}</h4>${fla}</div>
    <div class="wiz-mech"><h4>规则 · 数值与机制</h4>
      <table class="mech-table">${c.mech.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table>
      <p class="mech-note">主属性：${AB[c.prim].zh}　｜　豁免熟练：${c.saves.map(s => AB[s].zh).join('、')}　｜　可选技能 ${c.sk.count} 项<br>
      起始装备：${esc(c.equip.join('、'))}</p>
    </div>`;
}

/* ── 步骤 2：出身与阵营 ── */
function wizStep2() {
  const d = WIZ.d;
  const bg = BACKGROUNDS[d.bg] || {};
  const fla = esc(bg.flavor || '').split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  return `
    <div class="wiz-split">
      <div class="wiz-list">
        ${Object.keys(BACKGROUNDS).map(b => `<div class="wiz-li ${b === d.bg ? 'on' : ''}" onclick="wizPick_('bg','${b}')">
          <span>${esc(b)}</span><small>${esc((BACKGROUNDS[b].skills || []).join(' · '))}</small></div>`).join('')}
      </div>
      <div class="wiz-detail">
        <div class="wiz-flavor"><h4>世界观 · ${esc(d.bg)}</h4>${fla}</div>
        <div class="wiz-mech"><h4>规则 · 数值与机制</h4>
          <table class="mech-table">
            <tr><th>技能熟练</th><td>${esc((bg.skills || []).join('、'))}（自动获得，不可更换）</td></tr>
            <tr><th>工具熟练</th><td>${esc(bg.tools || '无')}</td></tr>
            <tr><th>特性 · ${esc(bg.feat ? bg.feat[0] : '—')}</th><td>${esc(bg.feat ? bg.feat[1] : '')}</td></tr>
            <tr><th>携带物品</th><td>${esc((bg.equip || []).join('、'))}</td></tr>
          </table>
        </div>
        <div class="wiz-sec"><h4>阵营（决定你行事的底色）</h4>
          <div class="align-grid">
            ${Object.keys(ALIGNMENTS).map(a => `<div class="align-cell ${a === d.align ? 'on' : ''}" onclick="wizPick_('align','${a}')">
              ${esc(a)}<small>${esc(ALIGNMENTS[a])}</small></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

/* ── 步骤 3：属性 ── */
function wizStep3() {
  const d = WIZ.d;
  const poolMode = !!WIZ.pool;
  const hb = hpBreakdown(d);
  return `
    <div class="roll-bar">
      <button class="btn ghost sm ${WIZ.method === 'array' ? 'on' : ''}" onclick="wizMethod_('array')">📐 标准数组 15/14/13/12/10/8</button>
      <button class="btn ghost sm ${WIZ.method === 'roll' ? 'on' : ''}" onclick="wizMethod_('roll')">🎲 掷 4d6 去最低</button>
      <button class="btn ghost sm ${WIZ.method === 'manual' ? 'on' : ''}" onclick="wizMethod_('manual')">✎ 手动填写</button>
      ${poolMode ? `<button class="btn ghost sm" onclick="wizAutoAssign_()">⚙️ 按「${esc(d.cls)}」推荐分配</button>` : ''}
    </div>

    ${poolMode ? `<p class="mech-note" style="margin-bottom:12px">已分配池：<b style="color:var(--brass)">${WIZ.pool.join(' / ')}</b> 　—— 每个数值只能用于一项属性，改变某项会与另一项自动对调。</p>` : ''}

    <div class="ab-wiz">
      ${ABKEYS.map(k => {
        const base = d.abBase[k];
        const fin = d.ab[k];
        const rb = (RACES[d.race].bonus || {})[k] || 0;
        return `<div class="aw">
          <div class="awn"><span>${AB[k].zh}</span><span>${AB[k].short}</span></div>
          ${poolMode
            ? `<select onchange="wizAbSet_('${k}', this.value)">
                ${WIZ.pool.map((v, i) => {
                  const owner = ABKEYS.find(x => WIZ.assign[x] === i);
                  return `<option value="${i}" ${owner === k ? 'selected' : ''}>${v}</option>`;
                }).join('')}
              </select>`
            : `<input type="number" min="3" max="20" value="${base}" oninput="wizAbManual_('${k}', this.value)">`}
          <div class="awv">${fin}</div>
          <div class="awm">调整值 ${sign(MOD(fin))}</div>
          <div class="awr">基础 ${base}${rb ? ` ＋ 种族 ${rb > 0 ? '+' : ''}${rb}` : '　（种族无加值）'}</div>
        </div>`;
      }).join('')}
    </div>

    <div class="wiz-sec"><h4>由此推导出的战斗数值</h4>
      <div class="hpbox">
        <div>生命上限 <b>${hb.total}</b><span class="derive">自动计算 · 不可手填</span></div>
        <div style="font-size:11.5px;color:var(--ink-3);margin-top:4px">${esc(hb.text)}</div>
        <div style="margin-top:10px">建议 AC：
          ${suggestAC(d).map(s => `<button class="chip-btn" onclick="wizSetAC_(${s.v})">${s.name} ${s.v}</button>`).join(' ')}
          <span style="margin-left:6px">当前 AC <b style="color:var(--brass)">${d.ac}</b></span>
        </div>
      </div>
      <label class="switch-row" style="margin-top:10px"><input type="checkbox" checked disabled><span>等级 ${d.level}：生命上限随等级自动增长（升级在跑团桌面处理）</span></label>
    </div>`;
}

/* ── 步骤 4：技能 ── */
function wizStep4() {
  const d = WIZ.d;
  const locked = wizLockedSkills(d);
  const bud = wizSkillBudget(d);
  const open = wizClassOpen(d);
  const picked = WIZ.picks.filter(n => !locked.includes(n));
  const over = picked.length > bud.total;
  return `
    <div class="skill-counter ${over ? 'over' : ''}">
      <span>职业可选 <b>${picked.length} / ${bud.total}</b>（${d.cls} ${bud.cls} 项${bud.free ? ` ＋ ${d.race} ${bud.free} 项自由` : ''}）</span>
      ${over ? '<span style="color:#e0a95c">已超出建议数量（房规允许，DM 可能会问）</span>' : ''}
    </div>
    <p class="mech-note" style="margin-bottom:12px">
      <b style="color:var(--brass)">●</b> 金色实心 = 已熟练（加值含熟练加值 ${sign(PROF(d.level))}）。
      「出身／种族」来源的技能自动获得且不可取消，其余请从职业可选列表中挑选。
    </p>
    ${bud.cls && !open ? `<p class="mech-note" style="margin-bottom:12px">${esc(d.cls)} 的可选范围：${esc(bud.list.join('、'))}</p>` : ''}
    <div class="sk-picker" style="max-height:none">
      ${SKILLS.map(s => {
        const isLocked = locked.includes(s.n);
        const on = isLocked || picked.includes(s.n);
        const src = isLocked
          ? ((BACKGROUNDS[d.bg].skills || []).includes(s.n) ? '出身' : (d.race === '半兽人' && s.n === '威吓' ? '种族' : '种族'))
          : (picked.includes(s.n) ? '自选' : '');
        const bonus = MOD(d.ab[s.a]) + (on ? PROF(d.level) : 0);
        return `<label class="sk-pick ${isLocked ? 'locked' : ''}" ${isLocked ? '' : `onclick="wizToggleSkill_('${s.n}')"`}>
          <input type="checkbox" ${on ? 'checked' : ''} ${isLocked ? 'disabled' : ''}>
          <span>${s.n}</span><span class="sk-ab">${AB[s.a].short}</span>
          <span class="sk-src">${sign(bonus)}${src ? ` · ${src}` : ''}</span>
        </label>`;
      }).join('')}
    </div>`;
}

/* ── 步骤 5：细节与确认 ── */
function wizStep5() {
  const d = WIZ.d;
  const hb = hpBreakdown(d);
  const locked = wizLockedSkills(d);
  const allSk = [...new Set([...locked, ...WIZ.picks])];
  const items = [...(d.inv || [])];
  return `
    <div class="form-grid">
      <label class="field"><span>姓名</span><input type="text" id="wz-name" value="${esc(d.name)}" oninput="wizSet_('name', this.value)" onchange="wizRefresh_()"></label>
      <label class="field"><span>等级</span><input type="number" id="wz-level" min="1" max="20" value="${d.level}" oninput="wizSetLevel_(this.value)"></label>
    </div>

    <div class="wiz-sec"><h4>生命与护甲</h4>
      <div class="hpbox">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <span>生命上限 <b>${d.maxHp}</b></span>
          <label class="switch-row" style="border:0;padding:0;font-size:11.5px">
            <input type="checkbox" ${d.hpManual ? 'checked' : ''} onchange="wizToggleHpManual_(this.checked)">
            <span>手动覆写（房规）</span>
          </label>
          ${d.hpManual ? `<input type="number" min="1" style="width:96px" value="${d.maxHp}" oninput="wizSetMaxHp_(this.value)">` : ''}
        </div>
        <div style="font-size:11.5px;color:var(--ink-3);margin-top:4px">${esc(hb.text)}</div>
        <div style="margin-top:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span>当前 HP <input type="number" min="0" max="${d.maxHp}" value="${d.hp}" style="width:88px" oninput="wizSetHp_(this.value)"> / ${d.maxHp}</span>
          <span>AC <input type="number" min="1" max="30" value="${d.ac}" style="width:70px" oninput="wizSet_('ac', +this.value)">
            ${suggestAC(d).map(s => `<button class="chip-btn" onclick="wizSetAC_(${s.v})">${s.v}</button>`).join('')}</span>
          <span>速度 <b style="color:var(--brass)">${d.speed}</b> 尺（由种族决定）</span>
        </div>
      </div>
    </div>

    <div class="wiz-sec"><h4>随身物品与法术（每行一项）</h4>
      <div class="form-grid">
        <label class="field"><span>物品</span><textarea rows="4" oninput="wizSetList_('inv', this.value)">${esc(items.join('\n'))}</textarea></label>
        <label class="field"><span>法术 / 特性</span><textarea rows="4" oninput="wizSetList_('spells', this.value)">${esc((d.spells || []).join('\n'))}</textarea></label>
        <label class="field full"><span>背景故事</span><textarea rows="3" oninput="wizSet_('notes', this.value)">${esc(d.notes || '')}</textarea></label>
        <label class="field full"><span>头像图片（可选）</span><input type="file" accept="image/*" onchange="wizAvatar_(this)"></label>
      </div>
      <div class="row gap" style="margin-top:10px">
        <button class="btn ghost sm" onclick="wizFillEquip_()">＋ 填入职业与出身的起始装备</button>
        <button class="btn ghost sm" onclick="wizSet_('gold', 0)">清零金币</button>
      </div>
    </div>

    <div class="wiz-sec"><h4>确认卷宗</h4>
      <div class="wiz-sum">
        <div class="ws-hd">
          <div class="cc-av" style="width:46px;height:46px;flex:0 0 46px">${WIZ.avatarTmp ? `<img src="${WIZ.avatarTmp}">` : esc(d.name[0] || '?')}</div>
          <div>
            <b>${esc(d.name)}</b>
            <div class="cc-sub">${esc(d.race)} · ${esc(d.cls)} Lv.${d.level} · ${esc(d.bg)} · ${esc(d.align)}</div>
          </div>
        </div>
        <div class="ws-grid">
          ${ABKEYS.map(k => `<div><span>${AB[k].zh}</span><b>${d.ab[k]}</b><em>${sign(MOD(d.ab[k]))}</em></div>`).join('')}
        </div>
        <div class="ws-line">❤️ HP ${d.hp}/${d.maxHp}　🛡 AC ${d.ac}　👣 ${d.speed} 尺　🪙 ${d.gold || 0}　✦ 熟练 ${sign(PROF(d.level))}</div>
        <div class="ws-line">● 技能：${allSk.length ? esc(allSk.join('、')) : '无'}</div>
        <div class="ws-line">豁免熟练：${(CLASSES[d.cls].saves || []).map(s => AB[s].zh).join('、')}</div>
      </div>
    </div>`;
}

/* ── 向导交互 ── */
window.wizGo_ = i => { WIZ.step = clamp(i, 0, 5); wizRender(); };
window.wizNext_ = () => {
  const d = WIZ.d;
  if (WIZ.step === 0 && !d.race) return toast('请选择种族', 'err');
  if (WIZ.step === 2 && !d.bg) return toast('请选择出身', 'err');
  if (WIZ.step === 5) return wizSave_();
  WIZ.step++; wizRender();
};
window.wizPrev_ = () => { if (WIZ.step > 0) { WIZ.step--; wizRender(); } };
window.wizPick_ = (field, val) => {
  const d = WIZ.d;
  const oldBg = d.bg;
  d[field] = val;
  if (field === 'race') {
    // 种族固定技能自动进入熟练（无需额外操作，由 wizLockedSkills 处理）
  }
  if (field === 'cls') {
    // 职业变化可能使原先选中的技能超出可选范围，但保留（房规宽松）
  }
  if (field === 'bg' && oldBg !== val) {
    // 出身固定技能由 locked 处理，无需清理 picks
  }
  wizRender();
};
window.wizMethod_ = m => {
  WIZ.method = m;
  if (m === 'manual') { WIZ.pool = null; WIZ.assign = null; }
  else if (m === 'array') { WIZ.pool = [...STD_ARRAY]; WIZ.assign = { str:0,dex:1,con:2,int:3,wis:4,cha:5 }; }
  else { WIZ.pool = Array.from({ length: 6 }, () => { const a = [D(6),D(6),D(6),D(6)].sort((x,y)=>y-x); return a[0]+a[1]+a[2]; }); WIZ.assign = { str:0,dex:1,con:2,int:3,wis:4,cha:5 }; }
  if (WIZ.pool) wizAutoAssign(true);
  wizRender();
};
window.wizAutoAssign_ = () => { wizAutoAssign(false); wizRender(); };
window.wizAbSet_ = (k, idx) => {
  idx = parseInt(idx, 10);
  const other = ABKEYS.find(x => x !== k && WIZ.assign[x] === idx);
  const old = WIZ.assign[k];
  WIZ.assign[k] = idx;
  if (other) WIZ.assign[other] = old;     // 对调，保证是排列
  ABKEYS.forEach(x => { WIZ.d.abBase[x] = WIZ.pool[WIZ.assign[x]]; });
  wizRender();
};
window.wizAbManual_ = (k, v) => {
  WIZ.d.abBase[k] = clamp(parseInt(v, 10) || 10, 3, 20);
  const scroll = $('#modal-root .modal-bd').scrollTop;
  wizRender();
  $('#modal-root .modal-bd').scrollTop = scroll;
};
window.wizSetAC_ = v => { WIZ.d.ac = v; wizRender(); };
window.wizSet_ = (k, v) => { WIZ.d[k] = v; };
window.wizRefresh_ = () => { const s = $('#modal-root .modal-bd').scrollTop; wizRender(); $('#modal-root .modal-bd').scrollTop = s; };
window.wizToggleHpManual_ = v => {
  WIZ.d.hpManual = !!v;
  if (WIZ.d.hpManual) WIZ.d.maxHp = WIZ.d.maxHp || calcMaxHp(WIZ.d);
  window.wizRefresh_();
};
window.wizSetHp_ = v => { WIZ.d.hp = clamp(parseInt(v, 10) || 0, 0, WIZ.d.maxHp); const s = $('#modal-root .modal-bd').scrollTop; wizRender(); $('#modal-root .modal-bd').scrollTop = s; };
window.wizSetMaxHp_ = v => { WIZ.d.maxHp = Math.max(1, parseInt(v, 10) || 1); const s = $('#modal-root .modal-bd').scrollTop; wizRender(); $('#modal-root .modal-bd').scrollTop = s; };
window.wizSetLevel_ = v => { WIZ.d.level = clamp(parseInt(v, 10) || 1, 1, 20); const s = $('#modal-root .modal-bd').scrollTop; wizRender(); $('#modal-root .modal-bd').scrollTop = s; };
window.wizSetList_ = (k, v) => { WIZ.d[k] = v.split('\n').map(x => x.trim()).filter(Boolean); };
window.wizFillEquip_ = () => {
  const d = WIZ.d;
  const set = new Set([...(CLASSES[d.cls].equip || []), ...((BACKGROUNDS[d.bg] || {}).equip || []), ...(d.inv || [])]);
  d.inv = [...set];
  wizRender();
  toast('已填入起始装备');
};
window.wizAvatar_ = el => {
  const f = el.files[0]; if (!f) return;
  const rd = new FileReader();
  rd.onload = () => { WIZ.avatarTmp = rd.result; wizRender(); };
  rd.readAsDataURL(f);
};
window.wizToggleSkill_ = n => {
  const locked = wizLockedSkills(WIZ.d);
  if (locked.includes(n)) return;
  const i = WIZ.picks.indexOf(n);
  if (i >= 0) WIZ.picks.splice(i, 1); else WIZ.picks.push(n);
  wizRender();
};

function wizSave_() {
  const d = WIZ.d;
  d.proficient = [...new Set([...wizLockedSkills(d), ...WIZ.picks])];
  d.avatar = WIZ.avatarTmp || '';
  if (!WIZ.pool) { /* 手动模式，abBase 已直接写入 */ } else { ABKEYS.forEach(k => { d.abBase[k] = wizPoolBase(k); }); }
  syncDerived(d);
  if (!d.hpManual) { d.maxHp = calcMaxHp(d); }
  d.hp = clamp(d.hp || d.maxHp, 0, d.maxHp);
  if (d.hp === 0 && !d.hpManual) d.hp = d.maxHp;

  const old = getChar(d.id);
  if (old) Object.assign(old, d);
  else {
    state.chars.push(d);
    if (state.partyIds.length < 4) state.partyIds.push(d.id);
    if (!state.activeCharId) state.activeCharId = d.id;
  }
  const isNew = !old;
  WIZ = null;
  persist(); closeModal();
  renderCodex(); renderPrep(); renderSheet(); renderPartySide();
  toast(isNew ? '冒险者已入档' : '已保存');
}
function wizPoolBase(k) { return WIZ.pool[WIZ.assign[k]]; }
window.wizSave_ = wizSave_;
window.wizOpen = wizOpen;

window.exportChar_ = id => {
  const c = getChar(id); if (!c) return;
  download(`${c.name}.json`, JSON.stringify(c, null, 2));
};

/* ─────────────── 17. 弹窗 ─────────────── */

function openModal({ title, body, footer = '', wide = false, narrow = false, noFooter = false }) {
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal ${wide ? 'wide' : ''} ${narrow ? 'narrow' : ''}">
    <div class="modal-hd"><h3>${esc(title)}</h3><button class="x-btn" onclick="closeModal()">✕</button></div>
    <div class="modal-bd">${body}</div>
    ${noFooter ? '' : `<div class="modal-ft">${footer || '<button class="btn" onclick="closeModal()">关闭</button>'}</div>`}
  </div>`;
  root.classList.add('on');
}
window.openModal = openModal;
window.closeModal = () => { $('#modal-root').classList.remove('on'); $('#modal-root').innerHTML = ''; };
window.openModal_ = openModal;

/* ─────────────── 18. 设置 ─────────────── */

function renderSettings() {
  const st = state.settings;
  const sel = $('#api-provider');
  sel.innerHTML = PROVIDERS.map(p => `<option value="${p.id}" ${p.url === st.apiBase ? 'selected' : ''}>${p.name}</option>`).join('');
  $('#api-base').value = st.apiBase;
  $('#api-key').value = st.apiKey;
  $('#api-model').value = st.model;
  $('#api-temp').value = st.temp;
  $('#temp-val').textContent = Number(st.temp).toFixed(1);
  $('#set-username').value = st.username;

  setSeg('#seg-theme', st.theme); setSeg('#seg-font', st.font); setSeg('#seg-fs', st.fontSize);
  $('#set-anim').checked = st.anim; $('#set-texture').checked = st.texture;
  $('#set-autosave').checked = st.autoSave; $('#set-immersive').checked = st.immersive;

  recountSpace();
}
function setSeg(sel, val) { $$(sel + ' button').forEach(b => b.classList.toggle('on', b.dataset.val === String(val))); }

function recountSpace() {
  const bytes = new Blob([JSON.stringify(state)]).size;
  const quota = 5 * 1024 * 1024;
  const pct = clamp((bytes / quota) * 100, 0.4, 100);
  $('#space-fill').style.width = pct + '%';
  $('#space-text').textContent = `已用 ${fmtBytes(bytes)} / 浏览器通常提供约 ${fmtBytes(quota)} · ${state.chars.length} 角色 · ${state.saves.length} 存档 · ${state.novels.length} 诗篇`;
}
function setApiStatus(kind, text) {
  const el = $('#api-status');
  el.className = 'api-status ' + (kind || '');
  el.textContent = text;
}
function openSettingsHint() { setView('settings'); }

async function checkApi() {
  const st = state.settings;
  if (!st.apiBase || !st.apiKey) { setApiStatus('err', '请先填写 API 地址与密钥'); return false; }
  setApiStatus('', '检测中…');
  try {
    const res = await fetch(st.apiBase.replace(/\/+$/, '') + '/models', { headers: { 'Authorization': 'Bearer ' + st.apiKey } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const j = await res.json();
    const n = (j.data || []).length;
    setApiStatus('ok', `连接正常 · 接口返回 ${n} 个模型`);
    return true;
  } catch (e) {
    setApiStatus('err', '连接失败：' + e.message + '（若为跨域限制，实际对话仍可能可用）');
    return false;
  }
}

/* ─────────────── 19. 全量事件绑定 ─────────────── */

function bind() {
  // 导航
  $$('.nav-item').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
  $('#rail-user').addEventListener('click', () => setView('settings'));
  $('#btn-menu').addEventListener('click', () => {
    const el = $('#rail');
    if (el.classList.contains('open')) closeDrawers(); else openDrawer(el);
  });
  $$('[data-goto]').forEach(b => b.addEventListener('click', () => setView(b.dataset.goto)));

  // 移动端抽屉开关
  $('#scrim').addEventListener('click', closeDrawers);
  $('#btn-rail-close').addEventListener('click', closeDrawers);
  $('#btn-sp-close').addEventListener('click', closeDrawers);
  $('#btn-side-close').addEventListener('click', closeDrawers);
  $('#btn-m-party').addEventListener('click', () => {
    renderPartySide(); renderCombat(); renderBag();
    openDrawer('#side-col');
  });
  $('#btn-m-sheet').addEventListener('click', () => { renderSheet(); openDrawer('#sheet-panel'); });

  // 桌面
  $('#btn-send').addEventListener('click', sendChat);
  const ta = $('#chat-text');
  ta.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
  });
  ta.addEventListener('input', () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 150) + 'px'; });
  $('#btn-dice-quick').addEventListener('click', () => { const c = activeChar(); doCheck('察觉', null, 'normal', null); });
  $('#btn-save').addEventListener('click', () => saveSession());
  $('#btn-clear-chat').addEventListener('click', () => { if (confirm('清空当前桌面对话？（不影响存档）')) { state.chat = []; persist(); renderChat(); } });
  $('#btn-roll-panel').addEventListener('click', openDicePanel);
  $('#btn-combat').addEventListener('click', openCombatPanel);

  // 准备
  $('#module-drop').addEventListener('click', () => $('#module-file').click());
  $('#module-file').addEventListener('change', e => importModuleFile(e.target.files[0]));
  ['dragover','dragenter'].forEach(ev => $('#module-drop').addEventListener(ev, e => { e.preventDefault(); $('#module-drop').classList.add('over'); }));
  ['dragleave','drop'].forEach(ev => $('#module-drop').addEventListener(ev, e => { e.preventDefault(); $('#module-drop').classList.remove('over'); }));
  $('#module-drop').addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f) importModuleFile(f); });
  $('#btn-load-builtin').addEventListener('click', () => {
    if (!state.modules.find(m => m.id === 'builtin')) { state.modules.unshift({ id:'builtin', title:BUILTIN_MODULE.title, content:BUILTIN_MODULE.content, builtin:true, ts:Date.now() }); }
    state.moduleId = 'builtin'; persist(); renderPrep(); toast('已载入内置模组');
  });
  $('#btn-new-module').addEventListener('click', openNewModuleModal);
  $('#btn-export-module').addEventListener('click', () => {
    const m = state.modules.find(x => x.id === state.moduleId); if (!m) return;
    download(m.title + '.txt', m.content, 'text/plain');
  });
  $('#btn-new-char-prep').addEventListener('click', () => editChar_(null));
  $('#btn-run-anyway').addEventListener('click', launchSession);
  $('#btn-launch').addEventListener('click', launchSession);
  $('#opt-style').addEventListener('change', e => { state.settings.style = e.target.value; persist(); });
  $('#opt-pov').addEventListener('change', e => { state.settings.pov = e.target.value; persist(); });
  $('#opt-diff').addEventListener('change', e => { state.settings.difficulty = e.target.value; persist(); });
  $('#opt-dice-on').addEventListener('change', e => { state.settings.diceOn = e.target.checked; persist(); });
  $('#opt-campaign').addEventListener('change', e => { state.pendingCampaignName = e.target.value.trim(); persist(); });
  $('#opt-marker-on').addEventListener('change', e => { state.settings.markerOn = e.target.checked; persist(); });

  // 角色
  $('#btn-new-char').addEventListener('click', () => editChar_(null));
  $('#btn-import-char').addEventListener('click', () => $('#char-file').click());
  $('#char-file').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const o = JSON.parse(rd.result);
        const arr = Array.isArray(o) ? o : [o];
        arr.forEach(c => { c.id = c.id || uid(); if (state.chars.find(x => x.id === c.id)) c.id = uid(); state.chars.push(adoptChar(c)); });
        persist(); renderCodex(); toast('已导入 ' + arr.length + ' 张角色卡');
      } catch (err) { toast('文件解析失败', 'err'); }
    };
    rd.readAsText(f); e.target.value = '';
  });

  // 存档
  $('#btn-new-save-from-table').addEventListener('click', () => { saveSession(); setView('saves'); });
  $('#btn-import-save').addEventListener('click', () => $('#save-file').click());
  $('#save-file').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const o = JSON.parse(rd.result);
        o.id = uid(); o.auto = false; if (!o.ts) o.ts = Date.now();
        state.saves.unshift(o); persist(); renderSaves(); toast('存档已导入');
      } catch (err) { toast('存档解析失败', 'err'); }
    };
    rd.readAsText(f); e.target.value = '';
  });

  // 诗篇
  $('#btn-novel-go').addEventListener('click', generateNovel);
  $('#btn-novel-from-table').addEventListener('click', () => { setView('novel'); toast('已选中当前桌面日志，点击「开始创作」'); });
  $('#btn-novel-pick').addEventListener('click', openSavePickerForNovel);

  // 设置
  $('#api-provider').addEventListener('change', e => {
    const p = PROVIDERS.find(x => x.id === e.target.value);
    if (p && p.url) { $('#api-base').value = p.url; $('#api-model').value = p.model; state.settings.apiBase = p.url; state.settings.model = p.model; persist(); }
  });
  $('#api-base').addEventListener('change', e => { state.settings.apiBase = e.target.value.trim(); persist(); });
  $('#api-key').addEventListener('change', e => { state.settings.apiKey = e.target.value.trim(); persist(); });
  $('#api-model').addEventListener('change', e => { state.settings.model = e.target.value.trim(); persist(); });
  $('#api-temp').addEventListener('input', e => { $('#temp-val').textContent = Number(e.target.value).toFixed(1); state.settings.temp = Number(e.target.value); persist(); });
  $('#btn-check-api').addEventListener('click', checkApi);
  $('#btn-fetch-models').addEventListener('click', fetchModels);
  $('#set-username').addEventListener('change', e => { state.settings.username = e.target.value.trim() || '无名的旅人'; persist(); applySettings(); renderHome(); });

  bindSeg('#seg-theme', v => { state.settings.theme = v; });
  bindSeg('#seg-font', v => { state.settings.font = v; });
  bindSeg('#seg-fs', v => { state.settings.fontSize = v; });
  ['anim','texture','autoSave','immersive'].forEach(k => {
    const id = '#set-' + (k === 'autoSave' ? 'autosave' : k);
    $(id).addEventListener('change', e => { state.settings[k] = e.target.checked; persist(); applySettings(); });
  });
  $('#btn-recount').addEventListener('click', () => { recountSpace(); toast('已重新统计'); });
  $('#btn-export-all').addEventListener('click', () => download('aeldrin-archive-' + Date.now() + '.json', JSON.stringify(state, null, 2)));
  $('#btn-reset-settings').addEventListener('click', () => { if (!confirm('恢复默认设置？角色与存档不受影响。')) return; state.settings = { ...DEFAULT_SETTINGS, apiKey: state.settings.apiKey }; persist(); applySettings(); renderSettings(); toast('设置已重置'); });
  $('#btn-wipe').addEventListener('click', () => {
    if (!confirm('⚠️ 将永久删除全部角色卡、存档、诗篇与设置，且无法恢复。确定继续？')) return;
    if (!confirm('最后确认：真的要清空所有本地数据吗？')) return;
    localStorage.removeItem(LS_KEY);
    location.reload();
  });

  // 键盘
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeDrawers(); }
  });

  // 视口变化：变宽（或旋屏到横屏桌面式布局）时收起抽屉并清掉遮罩
  let resizeTimer = null;
  const onViewportChange = () => {
    if (!isMobile()) drawerEls().forEach(el => el.classList.remove('open'));
    syncScrim();
  };
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(onViewportChange, 140); });
  window.addEventListener('orientationchange', () => setTimeout(onViewportChange, 280));
}
function bindSeg(sel, fn) {
  $$(sel + ' button').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.val; fn(v);
    // 字号/字体/主题需保留原类型
    if (sel === '#seg-fs') state.settings.fontSize = v;
    persist(); applySettings(); setSeg(sel, v);
  }));
}

function applySettings() {
  const st = state.settings;
  document.documentElement.dataset.theme = st.theme;
  document.documentElement.dataset.font = st.font;
  document.documentElement.dataset.fs = st.fontSize;
  document.documentElement.dataset.tex = st.texture ? 'on' : 'off';
  document.documentElement.dataset.immersive = st.immersive ? 'on' : 'off';
  // 移动端浏览器地址栏配色跟随主题
  const metaTheme = $('#meta-theme');
  if (metaTheme) metaTheme.setAttribute('content', st.theme === 'light' ? '#efe6d4' : '#0c0a08');
}

async function fetchModels() {
  const st = state.settings;
  const box = $('#model-pick');
  box.innerHTML = '<span class="mp-chip">正在探索时空裂缝…</span>';
  try {
    const res = await fetch(st.apiBase.replace(/\/+$/, '') + '/models', { headers: { 'Authorization': 'Bearer ' + st.apiKey } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const j = await res.json();
    const list = (j.data || []).map(m => m.id).filter(Boolean).slice(0, 120);
    if (!list.length) { box.innerHTML = '<span class="mp-chip">未找到任何模型</span>'; return; }
    box.innerHTML = list.map(m => `<span class="mp-chip" onclick="pickModel_('${esc(m)}')">${esc(m)}</span>`).join('');
    setApiStatus('ok', `已获取 ${list.length} 个模型，点击即可选用`);
  } catch (e) {
    box.innerHTML = '<span class="mp-chip">获取失败，请检查地址与 Key</span>';
    setApiStatus('err', '模型列表获取失败：' + e.message);
  }
}
window.pickModel_ = m => { state.settings.model = m; $('#api-model').value = m; persist(); toast('已选用 ' + m); };

/* ─────────────── 20. 模组 / 开团 / 骰盘 / 先攻 ─────────────── */

function importModuleFile(f) {
  if (!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    let text = rd.result, title = f.name.replace(/\.[^.]+$/, '');
    if (/\.json$/i.test(f.name)) {
      try {
        const o = JSON.parse(text);
        title = o.title || title; text = o.content || JSON.stringify(o, null, 2);
      } catch (_) { /* 保留原文 */ }
    }
    const m = { id: uid(), title, content: text, ts: Date.now() };
    state.modules.push(m); state.moduleId = m.id; persist(); renderPrep(); toast('模组已录入：' + title);
  };
  rd.readAsText(f);
}

function openNewModuleModal() {
  openModal({
    title: '手写模组', wide: true,
    body: `<label class="field"><span>模组标题</span><input type="text" id="nm-title" placeholder="《某某之某某》"></label>
      <label class="field" style="margin-top:12px"><span>模组正文（场景、NPC、线索、遭遇，越具体 DM 越听话）</span>
      <textarea id="nm-content" rows="14" placeholder="▶ 关键地点&#10;▶ 重要 NPC&#10;▶ 剧情触发提示&#10;▶ 宝物与奖励"></textarea></label>`,
    footer: `<button class="btn ghost" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveNewModule_()">录入卷宗</button>`
  });
}
window.saveNewModule_ = () => {
  const t = $('#nm-title').value.trim() || '未命名模组';
  const c = $('#nm-content').value.trim();
  if (!c) { toast('正文不能为空', 'err'); return; }
  const m = { id: uid(), title: t, content: c, ts: Date.now() };
  state.modules.push(m); state.moduleId = m.id; persist(); closeModal(); renderPrep(); toast('模组已录入');
};

function launchSession() {
  if (!state.partyIds.length && !confirm('队伍里还没有角色，仍要开始吗？（DM 会把你当成无名冒险者）')) return;
  state.combat = { on: false, round: 1, order: [], turn: 0 };
  state.activeCharId = state.activeCharId || state.partyIds[0] || null;
  const mod = state.modules.find(m => m.id === state.moduleId);
  // 每次开团建立一个新的「远征」分组，记忆回廊会按它归档
  state.campaignId = null;
  const camp = ensureCampaign(state.pendingCampaignName || defaultCampaignName());
  state.pendingCampaignName = camp.name;
  state.chat = [];
  addSys(`远征开始 · ${camp.name}${mod ? '（模组：' + mod.title + '）' : ' · 即兴冒险'} · 队伍 ${party().map(c => c.name).join('、') || '无名旅人'}`);
  persist();
  setView('table');
  askDM();
}

function openDicePanel() {
  const dice = [4,6,8,10,12,20,100];
  openModal({
    title: '骰盘', narrow: true,
    body: `<p class="muted" style="margin-bottom:14px">点击即掷。也可以输入 <code style="color:var(--brass)">.r 2d6+3</code> 自定义骰式。</p>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
        ${dice.map(d => `<button class="btn" onclick="doRoll('1d${d}','','d${d}')">d${d}</button>`).join('')}
        <button class="btn ghost" onclick="doRoll('1d20','','优势')" style="grid-column:span 2">d20 优势</button>
        <button class="btn ghost" onclick="doRoll('1d20','','劣势')" style="grid-column:span 2">d20 劣势</button>
      </div>
      <label class="field" style="margin-top:16px"><span>自定义骰式</span>
        <div class="row gap"><input type="text" id="dice-custom" placeholder="4d6kh3" style="flex:1">
        <button class="btn" onclick="const v=document.getElementById('dice-custom').value.trim();if(v){doRoll(v,'','自定义');closeModal()}">掷</button></div>
      </label>`,
    footer: `<button class="btn ghost" onclick="closeModal()">关闭</button>`
  });
}
window.doRoll = doRoll;

function openCombatPanel() {
  const cb = state.combat;
  openModal({
    title: '先攻序列', 
    body: `${cb.on ? `<div class="muted" style="margin-bottom:12px">进行中 · 第 ${cb.round} 轮</div>` : '<p class="muted" style="margin-bottom:12px">尚未开始战斗。</p>'}
      <button class="btn" onclick="startCombat_()">⚔️ 掷先攻并开始</button>
      <button class="btn ghost" onclick="addEnemy_()" style="margin-left:8px">+ 添加敌人</button>
      <div style="margin-top:16px" id="cb-manage"></div>`,
    footer: `${cb.on ? `<button class="btn ghost" onclick="nextTurn_()">下一回合</button><button class="btn danger" onclick="endCombat_()">结束战斗</button>` : '<button class="btn ghost" onclick="closeModal()">关闭</button>'}
      <button class="btn" onclick="closeModal()">关闭</button>`
  });
}
window.startCombat_ = () => {
  const order = party().map(c => ({ id: c.id, name: c.name, init: D(20) + MOD(c.ab.dex), hp: c.hp, maxHp: c.maxHp, enemy:false }));
  (state.combat.enemies || []).forEach(e => order.push(e));
  order.sort((a,b) => b.init - a.init);
  state.combat = { on:true, round:1, order, turn:0, enemies: state.combat.enemies || [] };
  persist(); closeModal(); renderCombat(); renderTable();
  addSys('⚔️ 战斗开始 · 先攻顺序：' + order.map(o => `${o.name}(${o.init})`).join(' → '));
  renderChat();
  toast('先攻已排定');
};
window.addEnemy_ = () => {
  const name = prompt('敌人名称（可加数量，如：地精 x3）', '地精');
  if (!name) return;
  const mm = name.match(/x\s*(\d+)/i);
  const n = mm ? parseInt(mm[1],10) : 1;
  const base = name.replace(/x\s*\d+/i, '').trim() || '敌人';
  state.combat.enemies = state.combat.enemies || [];
  for (let i = 0; i < n; i++) {
    const hp = 7 + D(6);
    const e = { id: uid(), name: n > 1 ? `${base} #${i+1}` : base, init: D(20) + 1, hp, maxHp: hp, enemy: true };
    state.combat.enemies.push(e);
    if (state.combat.on) { state.combat.order.push(e); state.combat.order.sort((a,b)=>b.init-a.init); }
  }
  persist(); closeModal(); renderCombat(); renderTable();
  toast('已加入 ' + n + ' 个敌人');
};
window.nextTurn_ = () => {
  const cb = state.combat; if (!cb.on) return;
  cb.turn++;
  if (cb.turn >= cb.order.length) { cb.turn = 0; cb.round++; addSys(`— 第 ${cb.round} 轮 —`); }
  persist(); closeModal(); renderCombat(); renderTable();
  const cur = cb.order[cb.turn];
  if (cur) toast('轮到 ' + cur.name);
};
window.endCombat_ = () => {
  state.combat = { on:false, round:1, order:[], turn:0, enemies: state.combat.enemies || [] };
  persist(); closeModal(); renderCombat(); renderTable();
  addSys('战斗结束'); renderChat();
};

/* ─────────────── 21. 诗篇 · 从存档创作 ─────────────── */
function openSavePickerForNovel() {
  if (!state.saves.length) { toast('还没有存档', 'err'); return; }
  openModal({
    title: '从存档创作', 
    body: `<div class="modal-list">${state.saves.map(s => `<div class="ml-item" onclick="loadForNovel_('${s.id}')">
      <b>${esc(s.name)}</b><span>${fmtTime(s.ts)} · ${(s.session?.chat||[]).length} 条</span></div>`).join('')}</div>`
  });
}
window.loadForNovel_ = id => {
  const s = state.saves.find(x => x.id === id); if (!s) return;
  state.chat = (s.session?.chat || []).map(m => ({ ...m }));
  persist(); closeModal(); setView('novel');
  toast('已载入日志，点击「开始创作」');
};

/* ─────────────── 22. 启动 ─────────────── */

function bootSequence() {
  const steps = [
    '正在唤醒沉睡的卷帙…',
    '校准 156.7 MHz 频段…',
    '装配 d20 与十八项技能…',
    '为地下城主斟上第三杯酒…',
    '桌面已就绪。'
  ];
  let i = 0;
  const el = $('#boot-log');
  const iv = setInterval(() => {
    el.textContent = steps[i] || steps[steps.length - 1];
    i++;
    if (i >= steps.length) {
      clearInterval(iv);
      setTimeout(() => {
        $('#app').classList.remove('hidden');
        const bs = $('#boot-screen');
        if (bs) { bs.classList.add('gone'); setTimeout(() => bs.remove(), 800); }
      }, 320);
    }
  }, 320);
}

function init() {
  restore();
  applySettings();
  bind();
  renderHome();
  renderSheet();
  bootSequence();
  setView('home');
  if (!state.partyIds.length && state.chars.length) state.partyIds = state.chars.slice(0, 3).map(c => c.id);
  // 首屏提示
  setTimeout(() => {
    if (!state.settings.apiKey) toast('提示：前往「设置中心」填入 API 密钥即可让 AI 担任地下城主');
  }, 2400);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

/* 调试接口：便于在控制台或自动化测试中调用核心逻辑 */
window.AELDRIN = {
  get state() { return state; },
  get WIZ() { return WIZ; },
  RACES, CLASSES, BACKGROUNDS, ALIGNMENTS, SKILLS, AB,
  rollExpr, MOD, PROF, sign, calcMaxHp, hpBreakdown, syncDerived, applyRacial, suggestAC,
  newChar, adoptChar, deriveBaseFromFinal, parseMarkers, doRoll, doCheck, saveSession, persist, setView,
  launchSession, ensureCampaign, buildSystemPrompt
};

})();
