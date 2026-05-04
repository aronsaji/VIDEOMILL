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
const FOOOCUS_URL = process.env.FOOOCUS_URL || 'http://127.0.0.1:7865';

// --- HJELPEFUNKSJONER ---

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const formatASSTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const centiseconds = Math.floor((seconds * 100) % 100);
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
};

const generateAnimatedASS = (timestamps, outputFile) => {
  // ASS header - Optimalisert for Viral 9:16 Format med kraftig styling
  let ass = `[Script Info]
Title: VideoMill Pro Viral Captions
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial Black,90,&H00FFFFFF,&H0000FFFF,&H00000000,&H80000000,-1,0,0,0,100,100,2,0,1,5,2,10,50,50,960,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  const wordsPerLine = 2; // Færre ord for mer "punch"
  for (let i = 0; i < timestamps.length; i += wordsPerLine) {
    const chunk = timestamps.slice(i, i + wordsPerLine);
    const startSec = chunk[0].offset / 10000000;
    const endSec = (chunk[chunk.length - 1].offset + chunk[chunk.length - 1].duration) / 10000000;
    const start = formatASSTime(startSec);
    const end = formatASSTime(endSec);
    
    let text = "";
    chunk.forEach(word => {
      const durationCS = Math.round(word.duration / 100000);
      // Legg til en liten animasjon på hvert ord
      text += `{\\k${durationCS}}{\\fscx120\\fscy120}${word.text.toUpperCase()}{\\fscx100\\fscy100} `;
    });
    
    ass += `Dialogue: 0,${start},${end},Default,,0,0,0,,${text.trim()}\n`;
  }
  fs.writeFileSync(outputFile, ass);
  console.log("✅ Pro-undertekster generert!");
};

const downloadFile = (url, dest, retries = 5) => {
  return new Promise((resolve, reject) => {
    const attempt = (remaining) => {
      const options = { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 60000 };
      const file = fs.createWriteStream(dest);
      https.get(url, options, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          return downloadFile(res.headers.location, dest, remaining).then(resolve).catch(reject);
        }
        if (res.statusCode === 429) {
          file.close();
          if (remaining > 0) return setTimeout(() => attempt(remaining - 1), 10000);
        }
        if (res.statusCode !== 200) {
          file.close();
          if (remaining > 0) return setTimeout(() => attempt(remaining - 1), 5000);
          return reject(new Error(`Nedlastingsfeil: ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }).on('error', (err) => {
        file.close();
        if (remaining > 0) return setTimeout(() => attempt(remaining - 1), 5000);
        reject(err);
      });
    };
    attempt(retries);
  });
};

async function updateStatus(id, status, extra = {}) {
  const body = JSON.stringify({ status, ...extra, updated_at: new Date() });
  const patchUrl = `${SUPABASE_URL}/rest/v1/orders?video_id=eq.${id}`;
  
  return new Promise((resolve) => {
    const req = https.request(patchUrl, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${SUPABASE_KEY}`, 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' }
    }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(`✅ Status -> ${status}`);
      }
      resolve();
    });
    req.write(body);
    req.end();
  });
}

async function generateImage(prompt, dest) {
  // Oppgrader prompten automatisk for maksimal kvalitet
  const cinematicPrompt = `${prompt}, cinematic shot, 8k resolution, highly detailed, masterpiece, stunning lighting, unreal engine 5 render, professional photography, viral aesthetic`;
  
  if (IMAGE_PROVIDER === 'local') {
    try {
      console.log(`🤖 RTX 4080: "${prompt.substring(0, 40)}..."`);
      const apiBody = {
        fn_index: 33, 
        data: [cinematicPrompt, "text, watermark, blurry, low quality, distorted", ["Fooocus V2", "Fooocus Cinematic", "Fooocus Masterpiece"], "Quality", "1024*1792", "1", "png", -1, false, 2, 4, "Default", "Default", 0.5, [], true, 0.5, "None", 0, 0.5, "None", "", 0.75, "None", null, "None", null, "None", null, "None", null]
      };

      await new Promise((resolve, reject) => {
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
              const json = JSON.parse(body);
              if (json.data && json.data[0] && json.data[0][0]) {
                await downloadFile(`${FOOOCUS_URL}/file=${json.data[0][0].name}`, dest);
                console.log("✅ Lokal GPU Suksess!");
                resolve();
              } else { throw new Error("GPU Svarfeil"); }
            } catch (e) { reject(e); }
          });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
      });
      return;
    } catch (err) {
      console.log(`⚠️ GPU feilet, bruker skyen...`);
    }
  }

  const seed = Math.floor(Math.random() * 1000000);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(cinematicPrompt)}?width=1024&height=1792&seed=${seed}&nologo=true&model=flux`;
  await downloadFile(url, dest);
}

async function handleCinematicRender(data) {
  const { video_id, scenes, voice_id, ai_voice, platform, title } = data;
  const voiceToUse = ai_voice || voice_id || 'nb-NO-PernilleNeural';
  const videoDir = path.join(BASE_ASSETS_DIR, video_id).replace(/\\/g, '/');
  const tempDir = path.join(videoDir, 'temp').replace(/\\/g, '/');
  
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  await updateStatus(video_id, 'rendering', { title, progress: 5, sub_status: 'Klargjør AI-motor...' });

  // 1. Tale
  const voiceFile = `${videoDir}/voiceover.mp3`;
  const timestampsFile = `${videoDir}/timestamps.json`;
  const fullText = scenes.map(s => s.narration).join('. ');
  console.log("🎙️ Genererer tale...");
  execSync(`"${EDGE_TTS_PATH}" --voice "${voiceToUse}" --text "${fullText}" --write-media "${voiceFile}" --timestamps "${timestampsFile}"`, { stdio: 'inherit' });

  // 2. Scener med Ken Burns 2.0 (Pan + Zoom)
  const processedClips = [];
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const imagePath = `${tempDir}/img_${i}.png`;
    const sceneVideo = `${tempDir}/scene_${i}.mp4`;
    
    await updateStatus(video_id, 'rendering', { progress: 10 + (i * 15), sub_status: `Lager cinematic scene ${i+1}/${scenes.length}...` });
    await generateImage(scene.prompt || scene.narration, imagePath);

    const dur = scene.duration_seconds || 4;
    // Ken Burns 2.0: Panorerer fra venstre til høyre mens den zoomer sakte inn
    const filter = platform !== 'youtube'
      ? `scale=2500:-1,zoompan=z='min(zoom+0.0015,1.5)':d=${dur*30}:x='(iw-(iw/zoom))/2 + (iw/zoom/4)*sin(2*PI*it/20)':y='(ih-(ih/zoom))/2':s=1080x1920`
      : `scale=-1:2500,zoompan=z='min(zoom+0.0015,1.5)':d=${dur*30}:x='(iw-(iw/zoom))/2':y='(ih-(ih/zoom))/2 + (ih/zoom/4)*sin(2*PI*it/20)':s=1920x1080`;

    console.log(`🎞️ Rendrer scene ${i+1} (Ken Burns 2.0)...`);
    execSync(`"${FFMPEG_PATH}" -y -loop 1 -i "${imagePath}" -t ${dur} -vf "${filter},vignette=angle=PI/4,curves=vintage" -c:v libx264 -pix_fmt yuv420p -r 30 "${sceneVideo}"`, { stdio: 'ignore' });
    processedClips.push(sceneVideo);
    await sleep(2000);
  }

  // 3. Sammenføyning & Viral Teksting
  await updateStatus(video_id, 'rendering', { progress: 85, sub_status: 'Legger på viral tekst...' });
  const listFile = `${videoDir}/list.txt`;
  fs.writeFileSync(listFile, processedClips.map(c => `file '${c}'`).join('\n'));
  const concatVideo = `${videoDir}/concat.mp4`;
  execSync(`"${FFMPEG_PATH}" -y -f concat -safe 0 -i "${listFile}" -c copy "${concatVideo}"`, { stdio: 'ignore' });

  const assFile = `${videoDir}/subs.ass`;
  if (fs.existsSync(timestampsFile)) {
    generateAnimatedASS(JSON.parse(fs.readFileSync(timestampsFile, 'utf8')), assFile);
  }

  const finalOutput = `${videoDir}/final.mp4`;
  const subFilter = fs.existsSync(assFile) ? `subtitles='${assFile.replace(/\\/g, '/').replace(':', '\\:')}'` : '';
  
  console.log("🎞️ Sluttmiksing...");
  execSync(`"${FFMPEG_PATH}" -y -i "${concatVideo}" -i "${voiceFile}" -filter_complex "[1:a]volume=1.2,anequalizer=f=100:g=5:w=100[a]" ${subFilter ? `-vf "${subFilter}"` : ''} -map 0:v -map "[a]" -c:v libx264 -preset fast -shortest "${finalOutput}"`, { stdio: 'ignore' });

  // 4. Ferdigstilling
  await updateStatus(video_id, 'rendering', { progress: 95, sub_status: 'Laster opp...' });
  const storagePath = `videos/${video_id}/final.mp4`;
  execSync(`curl -X POST "${SUPABASE_URL}/storage/v1/object/${storagePath}" -H "Authorization: Bearer ${SUPABASE_KEY}" -H "Content-Type: video/mp4" --data-binary @"${finalOutput}"`, { stdio: 'ignore' });
  
  await updateStatus(video_id, 'complete', { video_url: `${SUPABASE_URL}/storage/v1/object/public/${storagePath}`, progress: 100 });
  console.log('✅ CINEMATIC VIDEO ER KLAR!');
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
          console.error('❌ Renderfeil:', err.message);
          updateStatus(data.video_id, 'failed', { sub_status: err.message });
        });
      } catch (e) { res.writeHead(400); res.end('Invalid JSON'); }
    });
  } else { res.writeHead(404); res.end(); }
});

server.listen(PORT, () => console.log(`🚀 Epic Engine (v14 PRO) kjører på http://localhost:${PORT}`));
