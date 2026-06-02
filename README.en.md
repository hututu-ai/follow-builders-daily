<p align="right">
  <a href="README.md">中文</a> · <b>English</b>
</p>

# Follow Builders Daily 📰

> Turns the plain-text digest from [Follow Builders](https://github.com/zarazhangrui/follow-builders) into a **newspaper-style HTML daily**.

One edition a day — read Silicon Valley AI news like a real newspaper: a masthead, a front-page headline, a 30-second brief, columned builder cards, and an in-depth podcast feature. Opens right in your browser; easy to read, screenshot, and share.

![Daily preview](assets/preview-full.png)

---

## 💡 The one-line idea

> **Vanilla Follow Builders gives you "a block of text." This add-on turns it into "a newspaper."**

It doesn't fetch data or write summaries itself. It does exactly one thing — **takes the content the original skill produces and lays it out as a good-looking HTML newspaper.**

That's why it must be used together with the original. The step-by-step guide below works **even if you've never installed a skill before.**

---

## ⚠️ The most important thing: you need to install TWO skills

| | What it does | By whom |
|---|---|---|
| **① Original follow-builders** | Fetches data + writes the text digest (the engine) | [@zarazhangrui](https://github.com/zarazhangrui/follow-builders) |
| **② follow-builders-daily (this repo)** | Lays the text out as a newspaper HTML (the skin) | This repo |

- Install **①** only → you get a **plain-text** digest 📝
- Install **②** only → ❌ **it won't run**, there's no data source
- Install **① + ②** → you get a **newspaper HTML** 📰 ✅

> An analogy: **the original is the kitchen (ingredients + cooking); this add-on is the plate.** No kitchen, and an empty plate serves nothing.

---

## 🧩 How it actually works

```
┌──────────────────────────────────────────────────────────────┐
│  ① Original follow-builders (the kitchen)                      │
│                                                                │
│   prepare-digest.js                                            │
│   └─ Pulls today's data from a central feed                    │
│      (one HTTP request, no API key needed)                     │
│        ↓                                                       │
│      JSON { tweets[], podcasts[], summary prompts{} }          │
└──────────────────────────────────────────────────────────────┘
                          ↓  hands the data to the add-on
┌──────────────────────────────────────────────────────────────┐
│  ② follow-builders-daily (the plating)                         │
│                                                                │
│   1. Use the original's prompts to summarize tweets/podcasts   │
│   2. Pick the headline, 30s brief, quote of the day, tags      │
│   3. Assemble HTML from the newspaper template                 │
│      (headline spans two columns, the rest in columns)         │
│   4. Write the file → open it in the browser                   │
└──────────────────────────────────────────────────────────────┘
```

**Why split into two skills instead of merging them?**
Because the builder list and data sources are **continuously updated in the cloud** by Zara Zhang. By depending on the original, this add-on **always uses the latest sources** and never goes stale. It focuses on one job only: layout.

---

## 📦 Installation (step by step, beginner-friendly)

> **Prerequisite**: you already have [Claude Code](https://docs.claude.com/claude-code) installed.
> Skills live in `~/.claude/skills/`, one folder per skill.

### Step 1: Install the original follow-builders (the data engine, required)

Open your Terminal and paste:

```bash
git clone https://github.com/zarazhangrui/follow-builders.git ~/.claude/skills/follow-builders
cd ~/.claude/skills/follow-builders/scripts && npm install
```

> This downloads the original skill and installs its dependencies. If `npm install` finishes without red errors, you're good.

### Step 2: Install this add-on, follow-builders-daily (the newspaper skin)

```bash
git clone https://github.com/hututu-ai/follow-builders-daily.git ~/.claude/skills/follow-builders-daily
```

> This add-on needs **no** `npm install` — no extra dependencies, just clone it.

### Step 3: Verify both are installed

```bash
ls ~/.claude/skills/follow-builders/scripts/prepare-digest.js && \
ls ~/.claude/skills/follow-builders-daily/SKILL.md && \
echo "✅ Both skills are installed!"
```

If you see `✅ Both skills are installed!`, you're set.

### Step 4: Set up the original (one time only)

Open Claude Code and type:

```
set up follow builders
```

It will ask you a few questions conversationally — **choose like this**:

| It asks | Choose |
|---|---|
| Frequency | Daily |
| Language | **Chinese (zh)** or your preference |
| Delivery | **Show in terminal / stdout** (let the add-on take over output) |

> No config files to edit — just answer the prompts. It may send you a plain-text digest first; that's normal and means the engine works.

### Step 5: Generate your first newspaper 🎉

Still in Claude Code, type:

```
generate daily
```

Give it a minute or two — it fetches data, lays it out, and **pops a newspaper open in your browser**.

The generated files live here:

```
~/cola/outputs/follow-builders-daily/
├── index.html        ← latest edition (overwritten each time)
└── 2026-06-01.html   ← archived by date, never lost
```

---

## 🚀 Daily use after setup

Once installed, just say this in Claude Code:

```
generate daily
```

It also responds to: "today's daily", "make a newspaper", "日报", "newspaper".

---

## 📬 Email subscription (get the newspaper in your inbox)

Don't want to open the browser every time? You can have it **email the newspaper straight to your inbox** — email clients render HTML, so your inbox shows a fully laid-out newspaper. 📰

**How to enable:**

1. In Claude Code, say: `switch delivery to email`
   The original follow-builders will walk you through getting a **free** [Resend](https://resend.com) key (100 emails/day, more than enough) and entering your recipient address.
2. Once configured, say: `generate daily and email it` — the newspaper lands in your inbox.

> The email config and key are reused from the original (stored in `~/.follow-builders/`) — no need to set them up twice.

**Want it automatically every day?**
True "scheduled daily delivery" needs a timer that wakes up the generation. Because the newspaper's layout assembly depends on Claude, a plain shell cron can't do it — you need something that can schedule waking an agent (e.g. OpenClaw's cron, or a scheduler that triggers on time). Without a scheduler, saying it manually once a day still gets you the email.

> ⚠️ Note: HTML/CSS support varies across email clients; a few very old clients may render slightly off. Mainstream clients (Gmail, Apple Mail, Outlook web) render well.
> With Resend's free test sending domain, you can only email **your own account's** address ("send to self" is plenty). After verifying your own domain, you can send to any address.

---

## 📄 What's in an edition

| Section | Content |
|---------|---------|
| **Masthead** | Title, issue number, date, weather, edition |
| **Front-page headline** | The single biggest thing today, on a lime banner — grasp it in 5 seconds |
| **30-second brief** | 3 one-line takeaways; skim three lines if you're busy |
| **Quote of the day** | The best line pulled from the tweets, white-on-black |
| **Editor's note + tags** | Threads today's themes together + topic tags |
| **Builder card grid** | Headline spans two columns; what matters is physically bigger |
| **In-depth podcast feature** | A 1-hour podcast compressed into 3 minutes, with a drop cap + five key points |

---

## 🗂 Project structure (for those who want to tweak it)

```
follow-builders-daily/
├── SKILL.md                 # Claude's playbook: full steps from data to HTML
├── templates/
│   ├── base.html             # The "blank" newspaper: all CSS + layout + {{placeholders}}
│   └── components.md         # The "lego manual": what each card looks like and when to use it
├── scripts/
│   └── send-email.mjs        # Email delivery: sends the newspaper HTML to your inbox (zero-dep, reuses the original's email config)
├── examples/
│   └── 2026-05-12.html       # A complete sample edition — open it to see the result
├── assets/                   # Preview images for this README
└── README.md
```

**Want to change the design?**
- Colors / fonts → edit the `:root` CSS variables in `templates/base.html` (`--lime`, `--black`, etc.)
- Layout structure → edit the component HTML in `templates/components.md`

---

## ❓ FAQ

**Q: Can I install just this one, without the original?**
A: No. This add-on has no data source — it relies on the original to fetch data. That's intentional: the original's sources are maintained and updated in the cloud by Zara Zhang, so depending on it means you always get the latest list without any hassle.

**Q: Why does `generate daily` do nothing / say it can't find the script?**
A: Usually the original isn't installed properly. Re-run the check command from Step 3 and confirm `prepare-digest.js` exists.

**Q: Can the newspaper auto-deliver to Telegram like the original?**
A: HTML can't render directly inside Telegram. For now it's "generate locally + open in browser." If you've set up the original's Telegram, this add-on can additionally send a text note saying "today's newspaper is ready, open it in your browser."

**Q: The number of builders changes daily — will the layout break?**
A: No. `components.md` defines the arrangement rules — the headline always spans two columns, the rest go three per row, and an incomplete last row just leaves whitespace. Claude adapts automatically.

---

## 🌱 How this came to be

At first, it was really just **for myself.**

I have ADHD, and capturing information from plain text is genuinely hard for me — a dense wall of text in front of me, and my attention slides away within seconds; I'd often read for ages and retain nothing. So when I wanted to keep up with what frontline AI builders were doing every day, the original's plain-text digest was a bit exhausting for me.

So I laid it out as a **newspaper** for myself: the front-page headline tells me "what matters most today," the 30-second brief lets me get the gist in three lines, and the columned cards slice information into pieces — big and small, with visual hierarchy. Suddenly it was **much easier to read** — no longer a wall of text.

Later I posted this daily on social media, and to my surprise lots of friends loved it and asked if they could use it too. By popular request, I cleaned it up and open-sourced it on GitHub.

If you're like me — eager to learn about AI but easily lost in long text, easily distracted — I hope this newspaper makes your daily AI news a little easier to read.

## 🙏 Credits

This project only exists because it stands on the shoulders of **[Zara Zhang @zarazhangrui](https://github.com/zarazhangrui)**.

She coined the idea of "Follow Builders, Not Influencers" — instead of panning for gold in secondhand influencer takes, go straight to what frontline builders are actually doing. She runs the servers herself, shoulders the API costs alone, quietly handles all the daily fetching, and gives this incredibly useful skill away to everyone for free — even sparing us the hassle of configuring keys, so it works out of the box (no key needed).

The underlying data flow, source aggregation, and summarization logic are **100% Zara's work.** All I did was add a layer of "newspaper layout" on top of her industrial-grade engine, arranging her excellent content to look a little nicer and read a little easier. If this daily is valuable to you, please give your first ⭐️ to the **[original repo](https://github.com/zarazhangrui/follow-builders)** — that's the real source. Thank you, Zara. Respect to the real Builders.

---

## License

MIT — same as the original. Free to use, modify, and distribute.
