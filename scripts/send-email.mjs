#!/usr/bin/env node

// ============================================================================
// follow-builders-daily / send-email.mjs
// ============================================================================
// 把生成好的「报纸 HTML 日报」作为邮件正文发送出去（邮件客户端会渲染 HTML）。
//
// 零依赖：手写解析 .env、使用 Node 18+ 内置的 global fetch。不需要 npm install。
//
// 复用原版 follow-builders 已有的邮箱配置：
//   - RESEND_API_KEY  ← ~/.follow-builders/.env
//   - 收件地址         ← ~/.follow-builders/config.json 的 delivery.email
// 也可用命令行参数覆盖。
//
// 用法：
//   node send-email.mjs --file <html路径> [--to <邮箱>] [--subject <主题>]
//
// 退出码：0 成功；非 0 失败（stderr 输出原因）。
// ============================================================================

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const ORIG_DIR = join(homedir(), '.follow-builders');         // 原版 skill 的用户目录
const ENV_PATH = join(ORIG_DIR, '.env');
const CONFIG_PATH = join(ORIG_DIR, 'config.json');

// -- 手写解析 .env（KEY=VALUE，跳过注释行）--------------------------------
function parseEnv(text) {
  const out = {};
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([A-Za-z0-9_]+)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
  return out;
}

// -- 读取命令行参数 --------------------------------------------------------
function arg(name) {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : undefined;
}

async function main() {
  // 1) HTML 文件
  const filePath = arg('--file');
  if (!filePath) {
    console.error('❌ 缺少 --file <html路径>');
    process.exit(1);
  }
  if (!existsSync(filePath)) {
    console.error(`❌ 找不到文件：${filePath}`);
    process.exit(1);
  }
  const html = await readFile(filePath, 'utf-8');

  // 2) API Key（环境变量优先，其次原版 .env）
  let env = {};
  if (existsSync(ENV_PATH)) env = parseEnv(await readFile(ENV_PATH, 'utf-8'));
  const apiKey = process.env.RESEND_API_KEY || env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ 没找到 RESEND_API_KEY。请在 ~/.follow-builders/.env 里填上，或导出为环境变量。');
    console.error('   （在原版 follow-builders 的 onboarding 里选邮件投递就会生成这个文件）');
    process.exit(1);
  }

  // 3) 收件地址（--to 优先，其次原版 config.json 的 delivery.email）
  let toEmail = arg('--to');
  if (!toEmail && existsSync(CONFIG_PATH)) {
    try {
      const cfg = JSON.parse(await readFile(CONFIG_PATH, 'utf-8'));
      toEmail = cfg?.delivery?.email;
    } catch { /* ignore */ }
  }
  if (!toEmail) {
    console.error('❌ 没有收件地址。请用 --to <邮箱>，或在 ~/.follow-builders/config.json 里设 delivery.email。');
    process.exit(1);
  }

  // 4) 主题与发件人
  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const subject = arg('--subject') || `📰 AI Builder 日报 — ${today}`;
  // Resend 的免费测试发件域：onboarding@resend.dev（仅能发给账号本人邮箱，足够「发给自己」场景）。
  // 验证了自有域名后，可用 FB_DAILY_FROM 覆盖成自己的发件地址。
  const from = process.env.FB_DAILY_FROM || 'AI Builder 日报 <onboarding@resend.dev>';

  // 5) 调 Resend 发信，HTML 作为正文
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ from, to: [toEmail], subject, html })
  });

  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json()).message; } catch { detail = await res.text().catch(() => ''); }
    console.error(`❌ Resend 发送失败（${res.status}）：${detail}`);
    process.exit(1);
  }

  console.log(JSON.stringify({ status: 'ok', to: toEmail, subject }, null, 2));
}

main().catch(err => {
  console.error('❌ ' + err.message);
  process.exit(1);
});
