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
const FFPROBE_PATH = FFMPEG_PATH.replace('ffmpeg.exe', 'ffprobe.exe');
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

const POWER_WORDS = ['PENGER', 'SUKSESS', 'HEMMELIGHET', 'SJOKK', 'UTROLIG', 'FAKTA', 'ADVARSEL', 'GRATIS', 'RIKHET', 'FREMTID', 'KRAFT', 'LYKKE', 'VIDEO'];

const generateAnimatedASS = (vttContent, outputFile) => {
  let ass = `[Script Info]
Title: VideoMill Viral ELITE
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial Black,80,&H00FFFFFF,&H0000FFFF,&H00000000,&H80000000,-1,0,0,0,100,100,2,0,1,5,2,2,10,10,120,1
`;
  ass += `\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;
  
  vttContent.forEach(item => {
    let text = item.text.toUpperCase().trim();
    if (text) {
      POWER_WORDS.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        text = text.replace(regex, `{\\1c&H0000FFFF&}${word}{\\1c&H00FFFFFF&}`);
      });
      ass += `Dialogue: 0,${item.start},${item.end},Default,,0,0,0,,{\\pos(540,1400)\\fscx80\\fscy80\\t(0,100,\\fscx105\\fscy105)\\t(100,200,\\fscx100\\fscy100)}${text}\n`;
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
  const checkUrl = `${SUPABASE_URL}/rest/v1/productions?id=eq.${id}&select=id`;
  
  return new Promise((resolve) => {
    https.get(checkUrl, { headers: { 'Authorization': `Bearer ${SUPABASE_KEY}`, 'apikey': SUPABASE_KEY } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const exists = data !== '[]' && data !== '';
        const method = exists ? 'PATCH' : 'POST';
        const url = exists ? `${SUPABASE_URL}/rest/v1/productions?id=eq.${id}` : `${SUPABASE_URL}/rest/v1/productions`;
        
        const finalBody = exists ? body : JSON.stringify({
          id: id,
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

async function callFooocus(prompt, dest) {
  const cinematicPrompt = `${prompt}, cinematic shot, 8k resolution, highly detailed, masterpiece, stunning lighting, unreal engine 5 render, professional photography, viral aesthetic`;
  
  // Vi prøver flere vanlige signaturer for Fooocus API
  const attempts = [
    { fn: 32, data: [cinematicPrompt, "text, watermark, blurry", ["Fooocus V2", "Fooocus Cinematic"], "Quality", "1024*1792", "1", -1, false, 2, 4, "Default", "Default", 0.5, [], true, 0.5, "None", 0, 0.5, "None", "", 0.75, "None", null, "None", null, "None", null, "None", null] },
    { fn: 33, data: [cinematicPrompt, "text, watermark, blurry", ["Fooocus V2", "Fooocus Cinematic"], "Quality", "1024*1792", "1", "png", -1, false, 2, 4, "Default", "Default", 0.5, [], true, 0.5, "None", 0, 0.5, "None", "", 0.75, "None", null, "None", null, "None", null, "None", null] }
  ];

  for (const attempt of attempts) {
    try {
      const success = await new Promise((resolve, reject) => {
        const body = JSON.stringify({ fn_index: attempt.fn, data: attempt.data });
        const req = http.request(`${FOOOCUS_URL}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
          timeout: 120000 
        }, (res) => {
          let resBody = '';
          res.on('data', chunk => resBody += chunk);
          res.on('end', async () => {
            if (res.statusCode === 200) {
              const json = JSON.parse(resBody);
              if (json.data && json.data[0] && json.data[0][0]) {
                await downloadFile(`${FOOOCUS_URL}/file=${json.data[0][0].name}`, dest);
                resolve(true);
              } else resolve(false);
            } else {
              console.log(`⚠️ Fooocus Error [fn:${attempt.fn}]: ${res.statusCode} - ${resBody.slice(0, 100)}`);
              resolve(false);
            }
          });
        });
        req.on('error', () => resolve(false));
        req.write(body);
        req.end();
      });
      if (success) return true;
    } catch (e) {}
  }
  return false;
}

async function generateImage(prompt, dest) {
  if (IMAGE_PROVIDER === 'local') {
    console.log(`🤖 Prøver RTX 4080: "${prompt.substring(0, 30)}..."`);
    const success = await callFooocus(prompt, dest);
    if (success) {
      console.log("✅ Lokal GPU Suksess!");
      return;
    } else {
      console.log(`⚠️ Lokal GPU feilet. Fallback til skyen...`);
    }
  }
  const seed = Math.floor(Math.random() * 1000000);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ", cinematic, 8k")}?width=1024&height=1792&seed=${seed}&nologo=true`;
  await downloadFile(url, dest);
}

async function handleCinematicRender(data) {
  const { video_id, scenes, ai_voice, title } = data;
  const defaultVoice = ai_voice || 'nb-NO-PernilleNeural';
  const videoDir = path.join(BASE_ASSETS_DIR, video_id).replace(/\\/g, '/');
  const tempDir = path.join(videoDir, 'temp').replace(/\\/g, '/');
  const musicDir = path.join(BASE_ASSETS_DIR, 'music').replace(/\\/g, '/');
  
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  await updateStatus(video_id, 'rendering', { title, progress: 5, sub_status: 'Initialiserer Multi-Voice Engine...' });

  const processedClips = [];
  const voiceClips = [];
  const vttClips = [];

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const voiceToUse = scene.voice_id || defaultVoice;
    const sceneAudio = `${tempDir}/voice_${i}.mp3`;
    const sceneVtt = `${tempDir}/subs_${i}.vtt`;
    const imagePath = `${tempDir}/img_${i}.png`;
    const sceneVideo = `${tempDir}/scene_${i}.mp4`;

    await updateStatus(video_id, 'rendering', { progress: 10 + (i * 15), sub_status: `Scene ${i+1}/${scenes.length}: Genererer tale og bilde...` });

    // 1. GENERER TALE FOR DENNE SCENEN
    try {
      execSync(`"${EDGE_TTS_PATH}" --voice "${voiceToUse}" --text "${scene.narration}" --write-media "${sceneAudio}" --write-subtitles "${sceneVtt}"`, { stdio: 'ignore' });
    } catch (e) {
      execSync(`"${EDGE_TTS_PATH}" --voice "${voiceToUse}" --text "${scene.narration}" --write-media "${sceneAudio}"`, { stdio: 'ignore' });
    }
    voiceClips.push(sceneAudio);
    if (fs.existsSync(sceneVtt)) vttClips.push(sceneVtt);

    // Finn varighet på lyd (default 4s hvis feil)
    let dur = 4;
    try {
      const ffprobeResult = execSync(`"${FFPROBE_PATH}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${sceneAudio}"`).toString().trim();
      dur = parseFloat(ffprobeResult) + 0.3; // Legg til litt buffer
    } catch (e) { dur = scene.duration_seconds || 4; }

    // 2. GENERER BILDE OG VIDEO
    await generateImage(scene.prompt || scene.narration, imagePath);
    const zoomFilter = `scale=2500:-1,zoompan=z='min(zoom+0.0015,1.5)':d=${Math.ceil(dur*30)}:x='(iw-(iw/zoom))/2 + (iw/zoom/4)*sin(2*PI*it/20)':y='(ih-(ih/zoom))/2':s=1080x1920`;
    const colorFilter = `eq=brightness=0.02:contrast=1.1:saturation=1.2`;
    
    execSync(`"${FFMPEG_PATH}" -y -loop 1 -i "${imagePath}" -t ${dur} -vf "${zoomFilter},${colorFilter},vignette=angle=PI/4" -c:v libx264 -pix_fmt yuv420p -r 30 "${sceneVideo}"`, { stdio: 'ignore' });
    processedClips.push(sceneVideo);
  }

  // 3. SETT SAMMEN VIDEO OG LYD
  await updateStatus(video_id, 'rendering', { progress: 85, sub_status: 'Sluttfører Multi-Voice Mix...' });
  
  const concatVideo = `${videoDir}/concat.mp4`;
  // Bruk xfade hvis vi har mer enn én scene
  if (processedClips.length > 1) {
    let filterComplex = '';
    let lastOutput = '[v0]';
    let offset = 0;
    const transitionTime = 0.5;

    for (let i = 0; i < processedClips.length; i++) {
      filterComplex += `[${i}:v]settb=1/30[v${i}];`;
    }

    for (let i = 0; i < processedClips.length - 1; i++) {
      const dur = parseFloat(execSync(`"${FFMPEG_PATH.replace('ffmpeg.exe', 'ffprobe.exe')}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${processedClips[i]}"`).toString().trim());
      offset += dur - transitionTime;
      const nextOutput = `[xf${i}]`;
      filterComplex += `${i === 0 ? '[v0]' : lastOutput}[v${i+1}]xfade=transition=fade:duration=${transitionTime}:offset=${offset}${nextOutput};`;
      lastOutput = nextOutput;
    }

    const inputArgs = processedClips.map(c => `-i "${c}"`).join(' ');
    execSync(`"${FFMPEG_PATH}" -y ${inputArgs} -filter_complex "${filterComplex.slice(0, -1)}" -map "${lastOutput}" -c:v libx264 -pix_fmt yuv420p "${concatVideo}"`, { stdio: 'ignore' });
  } else {
    execSync(`"${FFMPEG_PATH}" -y -i "${processedClips[0]}" -c copy "${concatVideo}"`, { stdio: 'ignore' });
  }

  const voiceList = `${videoDir}/a_list.txt`;
  fs.writeFileSync(voiceList, voiceClips.map(c => `file '${c}'`).join('\n'));
  const finalVoice = `${videoDir}/voiceover.mp3`;
  execSync(`"${FFMPEG_PATH}" -y -f concat -safe 0 -i "${voiceList}" -c copy "${finalVoice}"`, { stdio: 'ignore' });

  // 4. UNDERTEKSTER (Med offset-logikk)
  const assFile = `${videoDir}/subs.ass`;
  const allSubData = [];
  let currentTime = 0;

  for (let i = 0; i < scenes.length; i++) {
    const vfile = vttClips[i];
    if (fs.existsSync(vfile)) {
      const content = fs.readFileSync(vfile, 'utf8');
      const blocks = content.split('\n\n').filter(b => b.includes('-->'));
      blocks.forEach(block => {
        const lines = block.split('\n');
        const times = lines[0].match(/(\d+):(\d+):(\d+)\.(\d+)/g);
        if (times) {
          const toSeconds = (t) => {
            const [h, m, s_ms] = t.split(':');
            return parseInt(h)*3600 + parseInt(m)*60 + parseFloat(s_ms);
          };
          const formatASS = (sec) => {
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = (sec % 60).toFixed(2);
            return `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(5,'0').replace('.',',')}`;
          };

          const startSec = toSeconds(times[0]) + currentTime;
          const endSec = toSeconds(times[1]) + currentTime;
          allSubData.push({
            start: formatASS(startSec),
            end: formatASS(endSec),
            text: lines.slice(1).join(' ').replace(/<[^>]*>/g, '').trim()
          });
        }
      });
    }
    // Oppdater currentTime basert på scenens varighet (minus xfade overlap hvis vi er nøye, men buffer holder her)
    const dur = parseFloat(execSync(`"${FFMPEG_PATH.replace('ffmpeg.exe', 'ffprobe.exe')}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${processedClips[i]}"`).toString().trim());
    currentTime += dur;
  }
  generateAnimatedASS(allSubData, assFile);

  // 5. FINN EKSTRA ASSETS (Musikk, Overlay, Logo)
  let musicFile = null;
  let overlayFile = null;
  let logoFile = null;

  if (fs.existsSync(musicDir)) {
    const mFiles = fs.readdirSync(musicDir).filter(f => f.endsWith('.mp3'));
    if (mFiles.length > 0) musicFile = path.join(musicDir, mFiles[Math.floor(Math.random() * mFiles.length)]).replace(/\\/g, '/');
  }
  
  const overlayPath = path.join(BASE_ASSETS_DIR, 'overlays/dust.mp4').replace(/\\/g, '/');
  if (fs.existsSync(overlayPath)) overlayFile = overlayPath;
  
  const logoPath = path.join(BASE_ASSETS_DIR, 'logo.png').replace(/\\/g, '/');
  if (fs.existsSync(logoPath)) logoFile = logoPath;

  // 6. FINAL MIX (Voice + Music + Overlay + Logo + Subs)
  const finalOutput = `${videoDir}/final.mp4`;
  const subFilter = fs.existsSync(assFile) ? `subtitles='${assFile.replace(/\\/g, '/').replace(':', '\\:')}'` : '';
  
  let inputArgs = `-i "${concatVideo}" -i "${finalVoice}"`;
  let filterComplex = '[1:a]volume=1.3[v]';
  let videoMap = '[0:v]';
  let audioInputs = 1;

  if (musicFile) {
    inputArgs += ` -i "${musicFile}"`;
    filterComplex += ';[2:a]volume=0.15[m]';
    audioInputs++;
  }

  if (overlayFile) {
    inputArgs += ` -stream_loop -1 -i "${overlayFile}"`;
    const overlayIdx = audioInputs + 1;
    filterComplex += `;[${overlayIdx}:v]format=rgba,colorchannelmixer=aa=0.3[ov];[0:v][ov]overlay=shortest=1[v_ov]`;
    videoMap = '[v_ov]';
  }

  if (logoFile) {
    inputArgs += ` -i "${logoFile}"`;
    const logoIdx = overlayFile ? audioInputs + 2 : audioInputs + 1;
    filterComplex += `;[${logoIdx}:v]scale=150:-1[logo];${videoMap}[logo]overlay=main_w-170:20[v_logo]`;
    videoMap = '[v_logo]';
  }

  // Audio mix
  const mixLabel = musicFile ? '[v][m]amix=inputs=2:duration=first[a]' : '[v]amix=inputs=1[a]';
  filterComplex += `;${mixLabel}`;

  const vf = subFilter ? `-vf "${videoMap}${subFilter ? ',' + subFilter : ''}"` : `-vf "${videoMap}"`;

  console.log("🎬 Rendrer final video...");
  execSync(`"${FFMPEG_PATH}" -y ${inputArgs} -filter_complex "${filterComplex}" ${vf} -map "${videoMap}" -map "[a]" -c:v libx264 -preset fast -shortest "${finalOutput}"`, { stdio: 'ignore' });

  // 7. LAST OPP
  const storagePath = `videos/${video_id}/final.mp4`;
  try {
    execSync(`curl -X POST "${SUPABASE_URL}/storage/v1/object/${storagePath}" -H "Authorization: Bearer ${SUPABASE_KEY}" -H "Content-Type: video/mp4" --data-binary @"${finalOutput}"`, { stdio: 'ignore' });
    await updateStatus(video_id, 'completed', { video_url: `${SUPABASE_URL}/storage/v1/object/public/${storagePath}`, progress: 100, sub_status: 'Mesterverk ferdigstilt!' });
    console.log(`✨ Elite Produksjon ferdig: ${video_id}`);
  } catch (e) {
    console.error("❌ Upload feilet:", e.message);
    await updateStatus(video_id, 'failed', { sub_status: 'Kunne ikke laste opp til skyen' });
  }
}

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  async function getGPUStats() {
    try {
      const out = execSync('nvidia-smi --query-gpu=temperature.gpu,memory.used --format=csv,noheader,nounits').toString().split(',');
      return {
        temp: parseInt(out[0]),
        vram: (parseInt(out[1]) / 1024).toFixed(1)
      };
    } catch (e) {
      return { temp: 42, vram: 0 };
    }
  }

  if (req.url === '/health' || req.url === '/') {
    const gpu = await getGPUStats();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ONLINE', engine: 'Epic Engine v14.4 PRO', gpu: gpu, timestamp: new Date() }));
    return;
  }

  if (req.method === 'POST' && req.url === '/render') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'received', video_id: data.video_id }));
        handleCinematicRender(data).catch(err => {
          console.error("🔥 Render error:", err);
          updateStatus(data.video_id, 'failed', { sub_status: err.message });
        });
      } catch (e) { res.writeHead(400); res.end('Error'); }
    });
  } else { 
    res.writeHead(404); 
    res.end(JSON.stringify({ error: 'Not Found' })); 
  }
});

// --- AUTONOMOUS POLLING ENGINE ---
let isProcessing = false;

async function pollForTasks() {
  if (isProcessing) return;
  
  try {
    const url = `${SUPABASE_URL}/rest/v1/productions?status=eq.pending&order=created_at.asc&limit=1`;
    const res = await new Promise((resolve) => {
      https.get(url, { headers: { 'Authorization': `Bearer ${SUPABASE_KEY}`, 'apikey': SUPABASE_KEY } }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', () => resolve([]));
    });

    if (res && res.length > 0) {
      const task = res[0];
      console.log(`📡 Auto-Pilot: Fant oppgave "${task.title || task.id}". Starter rendering...`);
      isProcessing = true;
      try {
        await handleCinematicRender(task);
        console.log(`✅ Auto-Pilot: Ferdig med "${task.title || task.id}".`);
      } catch (e) {
        console.error(`❌ Auto-Pilot Feil:`, e.message);
        await updateStatus(task.id, 'failed', { error: e.message });
      } finally {
        isProcessing = false;
      }
    }
  } catch (e) {
    console.error("⚠️ Polling Error:", e.message);
  }
}

// Start polling hvert 10. sekund
setInterval(pollForTasks, 10000);

scanForFooocus().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Epic Engine (v14.4 PRO) kjører på http://localhost:${PORT}`);
    console.log(`📡 Auto-Pilot er AKTIV og lytter etter 'pending' oppgaver...`);
  });
});
