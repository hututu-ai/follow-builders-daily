# 报纸 HTML 组件手册

本文件定义了日报 HTML 中每个可复用组件的 HTML 结构。生成日报时，严格按照这些模式填充内容。

---

## 1. 导航栏项 (NAV_ITEMS)

根据当天内容生成导航栏。第一个默认高亮（加 `active` class）。

```html
<span class="active">X 动态</span>
<span>播客专题</span>
<span>AI 工程</span>
<span>产品动向</span>
<span>行业观察</span>
```

导航标签从今日推文的话题分类中提取，通常 4-6 个。第一个固定为「X 动态」，如有播客则加「播客专题」，其余根据内容生成。

---

## 2. 30 秒速览项 (SPEED_READ_ITEMS)

固定 3 项。每项一个编号 + 一句话核心信息（带 `<strong>` 人名前缀）。

```html
<div class="sp-item">
  <div class="sp-n">1</div>
  <div class="sp-t"><strong>Karpathy：</strong>让 LLM 直接输出 HTML——视觉是 AI 向人类表达的「10 车道高速」。</div>
</div>
<div class="sp-item">
  <div class="sp-n">2</div>
  <div class="sp-t"><strong>Long Lake：</strong>63 亿美元私有化 Amex GBT，史上首笔 AI 驱动大型取私。</div>
</div>
<div class="sp-item">
  <div class="sp-n">3</div>
  <div class="sp-t"><strong>Claude Code：</strong>新命令 <code>claude agents</code> 上线，终端一键统管所有并行 Agent。</div>
</div>
```

---

## 3. 话题标签 (TAG_ITEMS)

3-5 个标签，用 `#` 前缀。

```html
<span class="tag">#AI输出范式</span>
<span class="tag">#HTML优先</span>
<span class="tag">#AI并购</span>
<span class="tag">#Claude Code</span>
<span class="tag">#Agent</span>
```

---

## 4. Builder 卡片 — 头条版（span-2，占两列）

互动量最高或话题最前沿的 builder 使用此模板。放在第一个 `.grid-3` 的第一个位置。

```html
<div class="gcol span-2">
  <div class="art-kicker">AI 工程 · 人机交互</div>
  <h2 class="art-hed lg">让 LLM 直接输出 HTML：<br>下一个 AI 交互默认范式已在成形</h2>
  <p class="art-deck">Karpathy：音频是人类向 AI 输入的首选，视觉则是 AI 向人类输出的最优载体。</p>
  <div class="byline">
    记者：Andrej Karpathy
    <span class="handle">@karpathy</span>
    <span class="ts">05-12 00:20 UTC+8</span>
  </div>

  <!-- 原推引用（如有精彩原文，截取关键段落） -->
  <div class="tweet-orig">
    This works really well btw, at the end of your query ask your LLM to "structure your response as HTML"...
    <a href="https://x.com/karpathy/status/xxx" target="_blank">↗ 查看原推 · x.com/karpathy</a>
  </div>

  <!-- Pull quote（可选：特别精彩的一句话拉出来） -->
  <div class="pull">
    <p>纯文本 → Markdown → HTML（当前新兴默认）→ … → 交互式神经视频</p>
  </div>

  <!-- 摘要框（重要的用 .lime） -->
  <div class="sumbox lime">
    <div class="lbl">记者摘要</div>
    <p>Karpathy 系统性地描绘了 AI 输出格式演进路径：当前处于第 3 阶段（HTML），终点是扩散神经网络直接生成的交互视频。</p>
  </div>
  <div class="engage"><span>❤ 13,038</span><span>↻ 1,338</span><span>💬 662</span></div>
</div>
```

**注意：**
- 标题用 `<h2 class="art-hed lg">`（大号）
- 摘要框用 `.sumbox.lime`（高亮）
- 必须包含 `.tweet-orig` 原推引用
- `.pull` 和 `.art-deck` 是可选的，只在内容足够精彩时使用

---

## 5. Builder 卡片 — 普通版（单列）

其余 builder 使用此模板。

```html
<div class="gcol">
  <div class="art-kicker">AI 工程 · 实时推理</div>
  <h3 class="art-hed">@thinkymachines 将「实时」标准整体拉高一档</h3>
  <div class="byline">Swyx <span class="handle">@swyx</span><span class="ts">05-12 08:03</span></div>

  <!-- 原推引用（可选） -->
  <div class="tweet-orig">
    I believe the kids call this "@thinkymachines just brutally framemogged gdm and oai"...
    <a href="https://x.com/swyx/status/xxx" target="_blank">↗ 原推</a>
  </div>

  <div class="sumbox">
    <div class="lbl">背景解读</div>
    <p>此次发布对 Google DeepMind 和 OpenAI 在实时 AI 领域构成降维打击。</p>
  </div>
  <div class="engage"><span>❤ 798</span><span>↻ 31</span><span>💬 33</span></div>
</div>
```

**注意：**
- 标题用 `<h3 class="art-hed">`（标准号）
- 摘要框用 `.sumbox`（普通白底）
- `.lbl` 文字可以是「摘要」「背景解读」「意义」「操作指南」等

---

## 6. Builder 卡片 — 小稿版（一列内堆叠多个）

当一列需要放 2 个较短的 builder 内容时，用 `<hr class="art-divider">` 分隔。

```html
<div class="gcol" style="display:flex;flex-direction:column;gap:0;">
  <!-- Builder A -->
  <div>
    <div class="art-kicker">OpenAI · 产品</div>
    <h3 class="art-hed sm">OpenAI VP：「这是黄金级内容」</h3>
    <div class="byline">Kevin Weil <span class="handle">@kevinweil</span><span class="ts">05-12 12:57</span></div>
    <div class="sumbox">
      <div class="lbl">摘要</div>
      <p>Kevin Weil 转发并高度称赞 @tdrobbo 的观点为「gold」。</p>
    </div>
    <div class="engage"><span>❤ 12</span><span>↻ 1</span></div>
  </div>

  <hr class="art-divider">

  <!-- Builder B -->
  <div>
    <div class="art-kicker">Anthropic · AI 对齐</div>
    <h3 class="art-hed sm">Claude 宪法现已上线有声书版本</h3>
    <div class="byline">Amanda Askell <span class="handle">@AmandaAskell</span><span class="ts">05-12 09:29</span></div>
    <p class="art-body">Model Spec 现由 Amanda 本人与 Joe 亲自朗读。</p>
    <div class="sumbox" style="margin-top:10px;">
      <div class="lbl">意义</div>
      <p>Anthropic 将 AI 对齐原则大众化的重要一步。</p>
    </div>
    <div class="engage"><span>❤ 416</span><span>↻ 22</span><span>💬 61</span></div>
  </div>
</div>
```

**注意：**
- 标题用 `<h3 class="art-hed sm">`（小号）
- 适合内容较短的 builder
- 同一个 `.gcol` 内可堆叠 2-3 个

---

## 7. 网格排列规则 (BUILDER_CARDS)

```
第 1 行 (.grid-3):
  列 1-2: 头条 builder (span-2)
  列 3:   1-2 个小稿 builder（堆叠）

第 2 行 (.grid-3, border-top:none, margin-top:3px):
  列 1、2、3: 各 1 个普通 builder

第 3 行（如有更多 builder，继续 .grid-3-row2）:
  列 1、2、3: 各 1 个普通 builder

最后一行如不足 3 个，空位留白即可。
```

**HTML 结构示例：**

```html
<!-- ROW 1: 头条 + 小稿 -->
<div class="grid-3">
  <div class="gcol span-2"><!-- 头条 builder --></div>
  <div class="gcol" style="display:flex;flex-direction:column;gap:0;">
    <!-- 小稿 builder A -->
    <hr class="art-divider">
    <!-- 小稿 builder B -->
  </div>
</div>

<!-- ROW 2: 3 个普通 builder -->
<div class="grid-3" style="border-top:none;margin-top:3px;">
  <div class="gcol"><!-- builder C --></div>
  <div class="gcol"><!-- builder D --></div>
  <div class="gcol"><!-- builder E --></div>
</div>
```

---

## 8. 播客专题 (PODCAST_SECTION)

如果有播客数据，生成完整的播客区块。如果没有，整个区块不输出。

```html
<div class="sec-bar" style="margin-top:32px;">
  <span class="sec-tag lime">播客专题</span>
  <span class="sec-title">深度报道</span>
  <span class="sec-count">No Priors · 本期精译</span>
</div>

<div class="feature-wrap">

  <!-- Hero 区 -->
  <div class="feature-hero">
    <div class="feat-kicker">No Priors Podcast · 2026-05-11 · 约 22 分钟 · 嘉宾：Alexander Taubman</div>
    <h2 class="feat-hed">史上首笔 AI 取私：Long Lake 以 63 亿美元收购 Amex 全球差旅</h2>
    <p class="feat-deck">Long Lake CEO 阐述了一条有别于硅谷 SaaS 路径的另类打法。</p>
  </div>

  <!-- Body 2:1 双栏 -->
  <div class="feature-body-grid">

    <!-- 左：正文 -->
    <div class="feat-main">
      <p class="feat-body drop">首段文字（首字母会自动下沉放大）。此次交易被广泛认为是全球首笔 AI 驱动的上市公司大型取私。</p>
      <p class="feat-body">后续段落正常排列...</p>

      <div class="feat-pull">
        <p>「我们不是在削减成本——我们在把服务公司变成软件公司的增长曲线。」</p>
      </div>

      <p class="feat-body">更多正文...</p>
    </div>

    <!-- 右：五大要点 -->
    <div class="feat-sidebar">
      <div class="kp-header">五大核心要点</div>

      <div class="kp">
        <div class="kp-n">1</div>
        <div class="kp-t"><strong>要点标题。</strong>要点解释说明。</div>
      </div>
      <div class="kp">
        <div class="kp-n">2</div>
        <div class="kp-t"><strong>要点标题。</strong>要点解释说明。</div>
      </div>
      <!-- ... 共 5 个 .kp -->

      <div class="feat-meta">
        <strong>嘉宾：</strong> Alexander Taubman，Long Lake CEO<br>
        <strong>节目：</strong> No Priors（Sarah Guo &amp; Elad Gil）<br>
        <strong>发布：</strong> 2026-05-11<br>
        <strong>链接：</strong> <a href="https://youtube.com/watch?v=xxx" target="_blank">youtube.com ↗</a>
      </div>
    </div>

  </div>
</div>
```

**关键细节：**
- 首段正文必须加 `class="feat-body drop"` 实现首字下沉
- 后续段落用 `class="feat-body"`
- `.feat-pull` 中放播客中最精彩的一句引用
- 五大要点 `.kp` 固定 5 个
- `.feat-meta` 中的链接必须用 JSON 中的 `url` 字段
