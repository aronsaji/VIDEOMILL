const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

// --- KONFIGURASJON ---
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.join('=').trim();
    }
  });
}

const PORT = process.env.PORT || 3001;
const FFMPEG_PATH = process.env.FFMPEG_PATH || `C:/VideoMill/NY_VIDEOMILL_V2/ffmpeg-2026-04-30-git-cc3ca17127-full_build/bin/ffmpeg.exe`;
const BASE_ASSETS_DIR = process.env.BASE_ASSETS_DIR || `C:/VideoMill/VideoMill_Assets`;
const EDGE_TTS_PATH = process.env.EDGE_TTS_PATH || `C:/Users/saji_/AppData/Local/Python/pythoncore-3.14-64/Scripts/edge-tts.exe`;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://gvthmjfsdawowithwivj.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const IMAGE_PROVIDER = process.env.IMAGE_PROVIDER || 'local';
let FOOOCUS_URL = process.env.FOOOCUS_URL || 'http://127.0.0.1:7865';

// --- HJELPEFUNKSJONER ---

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scanForFooocus() {
  const ports = [7865, 7860, 7861, 7862, 7863, 7864, 7866, 7867, 7868, 7869, 7870];
  console.log("🔍 Scanner etter RTX 4080 (Fooocus)...");
  for (const p of ports) {
    try {
      const url = `http://127.0.0.1:${p}`;
      const success = await new Promise((resolve) => {
        const req = http.get(url, { timeout: 800 }, (res) => resolve(res.statusCode === 200));
        req.on('error', () => resolve(false));
      });
      if (success) { FOOOCUS_URL = url; console.log(`✅ Fant Fooocus på port ${p}!`); return true; }
    } catch (e) {}
  }
  return false;
}

const generateAnimatedASS = (vttContent, outputFile) => {
  let ass = `[Script Info]\nTitle: VideoMill Viral\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Default,Arial Black,95,&H00FFFFFF,&H0000FFFF,&H00000000,&H80000000,-1,0,0,0,100,100,2,0,1,5,2,10,50,50,960,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;
  const blocks = vttContent.split('\n\n').filter(b => b.includes('-->'));
  blocks.forEach(block => {
    const lines = block.split('\n');
    const times = lines[0].match(/(\d+:\d+:\d+\.\d+)/g);
    if (times && times.length >= 2) {
      const start = times[0].replace('.', ',');
      const end = times[1].replace('.', ',');
      const text = lines.slice(1).join(' ').toUpperCase().replace(/<[^>]*>/g, '');
      ass += `Dialogue: 0,${start},${end},Default,,0,0,0,,{\\fscx110\\fscy110}${text}\n`;
    }
  });
  fs.writeFileSync(outputFile, ass);
};

const downloadFile = (url, dest, retries = 5) => {
  return new Promise((resolve, reject) => {
    const attempt = (remaining) => {
      const file = fs.createWriteStream(dest);
      const req = (url.startsWith('https') ? https : http).get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 60000 }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) { file.close(); return downloadFile(res.headers.location, dest, remaining).then(resolve).catch(reject); }
        if (res.statusCode !== 200) { file.close(); if (remaining > 0) return setTimeout(() => attempt(remaining - 1), 5000); return reject(new Error(`Status ${res.statusCode}`)); }
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }).on('error', (err) => { file.close(); if (remaining > 0) return setTimeout(() => attempt(remaining - 1), 5000); reject(err); });
    };
    attempt(retries);
  });
};

async function updateStatus(id, status, extra = {}) {
  const body = JSON.stringify({ status, ...extra, updated_at: new Date() });
  const checkUrl = `${SUPABASE_URL}/rest/v1/orders?video_id=eq.${id}&select=id`;
  
  return new Promise((resolve) => {
    https.get(checkUrl, { headers: { 'Authorization': `Bearer ${SUPABASE_KEY}`, 'apikey': SUPABASE_KEY } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const exists = data !== '[]' && data !== '';
        const method = exists ? 'PATCH' : 'POST';
        const url = exists ? `${SUPABASE_URL}/rest/v1/orders?video_id=eq.${id}` : `${SUPABASE_URL}/rest/v1/orders`;
        
        const finalBody = exists ? body : JSON.stringify({
          video_id: id,
          title: extra.title || `Video ${id}`,
          status: status,
          ...extra,
          created_at: new Date(),
          updated_at: new Date(),
          platform_destinations: ['tiktok', 'youtube'],
          user_id: '00000000-0000-0000-0000-000000000000'
        });

        const req = https.request(url, {
          method,
          headers: { 'Authorization': `Bearer ${SUPABASE_KEY}`, 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' }
        }, (res) => {
          console.log(`✅ DB Update [${id}]: ${status} (${method})`);
          resolve();
        });
        req.write(finalBody);
        req.end();
      });
    }).on('error', (e) => { console.error('❌ Supabase error:', e.message); resolve(); });
  });
}

async function callFooocus(prompt, dest, fnIndex = 33) {
  const cinematicPrompt = `${prompt}, cinematic shot, 8k resolution, highly detailed, masterpiece, stunning lighting, unreal engine 5 render, professional photography, viral aesthetic`;
  const apiBody = {
    fn_index: fnIndex, 
    data: [cinematicPrompt, "text, watermark, blurry, low quality, distorted", ["Fooocus V2", "Fooocus Cinematic", "Fooocus Masterpiece"], "Quality", "1024*1792", "1", "png", -1, false, 2, 4, "Default", "Default", 0.5, [], true, 0.5, "None", 0, 0.5, "None", "", 0.75, "None", null, "None", null, "None", null, "None", null]
  };
  
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(apiBody);
    const req = http.request(`${FOOOCUS_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': data.length },
      timeout: 300000 
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', async () => {
        try {
          if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);
          const json = JSON.parse(body);
          if (json.data && json.data[0] && json.data[0][0]) {
            await downloadFile(`${FOOOCUS_URL}/file=${json.data[0][0].name}`, dest);
            resolve(true);
          } else { throw new Error("Formatfeil i svar"); }
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function generateImage(prompt, dest) {
  if (IMAGE_PROVIDER === 'local') {
    console.log(`🤖 Prøver RTX 4080: "${prompt.substring(0, 30)}..."`);
    try {
      // Prøv først standard fn_index 33
      await callFooocus(prompt, dest, 33);
      console.log("✅ Lokal GPU Suksess (Metode A)!");
      return;
    } catch (err) {
      console.log(`⚠️ Metode A feilet, prøver Metode B...`);
      try {
        // Prøv alternativ fn_index 34
        await callFooocus(prompt, dest, 34);
        console.log("✅ Lokal GPU Suksess (Metode B)!");
        return;
      } catch (err2) {
        console.log(`⚠️ Alle GPU-metoder feilet (${err2.message}). Fallback til skyen...`);
      }
    }
  }
  const seed = Math.floor(Math.random() * 1000000);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ", cinematic, 8k")}?width=1024&height=1792&seed=${seed}&nologo=true`;
  await downloadFile(url, dest);
}

async function handleCinematicRender(data) {
  const { video_id, scenes, ai_voice, title } = data;
  const voiceToUse = ai_voice || 'nb-NO-PernilleNeural';
  const videoDir = path.join(BASE_ASSETS_DIR, video_id).replace(/\\/g, '/');
  const tempDir = path.join(videoDir, 'temp').replace(/\\/g, '/');
  
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  await updateStatus(video_id, 'rendering', { title, progress: 5, sub_status: 'Klargjør AI-motor...' });

  const voiceFile = `${videoDir}/voiceover.mp3`;
  const vttFile = `${videoDir}/subs.vtt`;
  const fullText = scenes.map(s => s.narration).join('. ');
  console.log("🎙️ Genererer tale...");
  try {
    execSync(`"${EDGE_TTS_PATH}" --voice "${voiceToUse}" --text "${fullText}" --write-media "${voiceFile}" --write-subtitles "${vttFile}"`, { stdio: 'ignore' });
  } catch (e) {
    execSync(`"${EDGE_TTS_PATH}" --voice "${voiceToUse}" --text "${fullText}" --write-media "${voiceFile}"`, { stdio: 'ignore' });
  }

  const processedClips = [];
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const imagePath = `${tempDir}/img_${i}.png`;
    const sceneVideo = `${tempDir}/scene_${i}.mp4`;
    await updateStatus(video_id, 'rendering', { progress: 10 + (i * 15), sub_status: `Scene ${i+1}/${scenes.length}: Genererer bilde...` });
    await generateImage(scene.prompt || scene.narration, imagePath);
    
    const dur = scene.duration_seconds || 4;
    const filter = `scale=2500:-1,zoompan=z='min(zoom+0.0015,1.5)':d=${dur*30}:x='(iw-(iw/zoom))/2 + (iw/zoom/4)*sin(2*PI*it/20)':y='(ih-(ih/zoom))/2':s=1080x1920`;
    execSync(`"${FFMPEG_PATH}" -y -loop 1 -i "${imagePath}" -t ${dur} -vf "${filter},vignette=angle=PI/4" -c:v libx264 -pix_fmt yuv420p -r 30 "${sceneVideo}"`, { stdio: 'ignore' });
    processedClips.push(sceneVideo);
    await sleep(1000);
  }

  await updateStatus(video_id, 'rendering', { progress: 85, sub_status: 'Sluttfører video...' });
  const listFile = `${videoDir}/list.txt`;
  fs.writeFileSync(listFile, processedClips.map(c => `file '${c}'`).join('\n'));
  const concatVideo = `${videoDir}/concat.mp4`;
  execSync(`"${FFMPEG_PATH}" -y -f concat -safe 0 -i "${listFile}" -c copy "${concatVideo}"`, { stdio: 'ignore' });

  const assFile = `${videoDir}/subs.ass`;
  if (fs.existsSync(vttFile)) generateAnimatedASS(fs.readFileSync(vttFile, 'utf8'), assFile);

  const finalOutput = `${videoDir}/final.mp4`;
  const subFilter = fs.existsSync(assFile) ? `subtitles='${assFile.replace(/\\/g, '/').replace(':', '\\:')}'` : '';
  execSync(`"${FFMPEG_PATH}" -y -i "${concatVideo}" -i "${voiceFile}" -filter_complex "[1:a]volume=1.2[a]" ${subFilter ? `-vf "${subFilter}"` : ''} -map 0:v -map "[a]" -c:v libx264 -preset fast -shortest "${finalOutput}"`, { stdio: 'ignore' });

  const storagePath = `videos/${video_id}/final.mp4`;
  try {
    execSync(`curl -X POST "${SUPABASE_URL}/storage/v1/object/${storagePath}" -H "Authorization: Bearer ${SUPABASE_KEY}" -H "Content-Type: video/mp4" --data-binary @"${finalOutput}"`, { stdio: 'ignore' });
    await updateStatus(video_id, 'complete', { video_url: `${SUPABASE_URL}/storage/v1/object/public/${storagePath}`, progress: 100 });
  } catch (e) {
    await updateStatus(video_id, 'failed', { sub_status: 'Kunne ikke laste opp til skyen' });
  }
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/render') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'received' }));
        handleCinematicRender(data).catch(err => {
          console.error("🔥 Render error:", err);
          updateStatus(data.video_id, 'failed', { sub_status: err.message });
        });
      } catch (e) { res.writeHead(400); res.end('Error'); }
    });
  } else { res.writeHead(404); res.end(); }
});

scanForFooocus().then(() => {
  server.listen(PORT, () => console.log(`🚀 Epic Engine (v14.4 PRO) kjører på http://localhost:${PORT}`));
});
