/**
 * 카드뉴스 WebSocket 서버
 * 포트 3200 — 24/7 실행
 *
 * 실행: node server.mjs
 *
 * 메시지 형식:
 *   요청: { type: "cardnews", url: "https://..." }
 *         { type: "cardnews", text: "직접 입력 내용" }
 *   진행: { type: "progress", step: "scraping|summarizing|rendering", message: "..." }
 *   완료: { type: "done", files: ["경로1.png", ...] }
 *   오류: { type: "error", message: "오류 내용" }
 */

import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3200;

const wss = new WebSocketServer({ port: PORT });

console.log(`카드뉴스 WebSocket 서버 시작 — ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  console.log('[연결] 클라이언트 접속');

  ws.on('message', async (raw) => {
    let req;
    try {
      req = JSON.parse(raw.toString());
    } catch {
      ws.send(JSON.stringify({ type: 'error', message: '잘못된 JSON 형식입니다.' }));
      return;
    }

    if (req.type !== 'cardnews') {
      ws.send(JSON.stringify({ type: 'error', message: `알 수 없는 요청 타입: ${req.type}` }));
      return;
    }

    if (!req.url && !req.text) {
      ws.send(JSON.stringify({ type: 'error', message: 'url 또는 text 중 하나를 입력하세요.' }));
      return;
    }

    console.log(`[요청] url=${req.url || '(직접 입력)'}`);

    send(ws, 'progress', 'scraping', '콘텐츠 준비 중...');

    try {
      // agent.py 실행 (python3)
      const args = ['agent.py'];
      if (req.url)  args.push('--url', req.url);
      if (req.text) args.push('--text', req.text);

      const result = await runAgent(args, (line) => {
        // stdout 라인을 파싱해서 진행 상황 중계
        if (line.startsWith('1/3')) send(ws, 'progress', 'scraping', line.replace('1/3 ', ''));
        else if (line.startsWith('2/3')) send(ws, 'progress', 'summarizing', line.replace('2/3 ', ''));
        else if (line.startsWith('3/3')) send(ws, 'progress', 'rendering', line.replace('3/3 ', ''));
        else if (line.startsWith('   ')) send(ws, 'progress', 'rendering', line.trim());
      });

      ws.send(JSON.stringify({ type: 'done', files: result.files }));
      console.log(`[완료] ${result.files.length}장 생성`);

    } catch (err) {
      console.error('[오류]', err.message);
      ws.send(JSON.stringify({ type: 'error', message: err.message }));
    }
  });

  ws.on('close', () => console.log('[연결 종료]'));
  ws.on('error', (err) => console.error('[소켓 오류]', err.message));
});

function send(ws, type, step, message) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify({ type, step, message }));
  }
}

function runAgent(args, onLine) {
  return new Promise((resolve, reject) => {
    const proc = spawn('python3', args, {
      cwd: __dirname,
      env: { ...process.env },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(Boolean);
      lines.forEach((line) => {
        stdout += line + '\n';
        onLine(line);
        console.log('[agent]', line);
      });
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `agent.py 종료 코드: ${code}`));
        return;
      }

      // 생성된 파일 경로 파싱
      const files = [];
      stdout.split('\n').forEach((line) => {
        if (line.trim().endsWith('.png')) {
          files.push(line.trim());
        }
      });

      resolve({ files });
    });
  });
}
