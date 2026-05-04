const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

// --- KONFIGURASJON ---
// Last inn miljøvariabler fra .env.local manuelt for å unngå avhengigheter
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

if (!SUPABASE_KEY || SUPABASE_KEY.includes('placeholder') || SUPABASE_KEY.includes('LIM_INN')) {
  console.warn('⚠️ ADVARSEL: Mangler gyldig SUPABASE_KEY i .env.local. Serveren vil ikke kunne lagre resultater.');
}

const IMAGE_PROVIDER = process.env.IMAGE_PROVIDER || 'local'; // 'local' prøver RTX 4080, faller tilbake til skyen
const FOOOCUS_URL = process.env.FOOOCUS_URL || 'http://127.0.0.1:7865';

// --- HJELPEFUNKSJONER ---

const formatSRTTime = (seconds) => {
  const date = new Date(0);
  date.setSeconds(seconds);
  const ms = Math.floor((seconds % 1) * 1000);
  return date.toISOString().substr(11, 8) + ',' + ms.toString().padStart(3, '0');
};

// Konverter edge-tts tidsstempler (100-nanosekunder) til ASS tidsformat
const formatASSTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const centiseconds = Math.floor((seconds * 100) % 100);
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
};

const generateAnimatedASS = (timestamps, outputFile) => {
  // ASS header - Optimalisert for Viral 9:16 Format
  let ass = `[Script Info]
Title: VideoMill Viral Captions
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial Black,70,&H00FFFFFF,&H0000FFFF,&H00000000,&H80000000,-1,0,0,0,100,100,2,0,1,4,0,10,50,50,960,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  // Grupper ord i små bolker (1-3 ord) for å unngå at skjermen fylles
  const wordsPerLine = 3;
  for (let i = 0; i < timestamps.length; i += wordsPerLine) {
    const chunk = timestamps.slice(i, i + wordsPerLine);
    const startSec = chunk[0].offset / 10000000;
    const endSec = (chunk[chunk.length - 1].offset + chunk[chunk.length - 1].duration) / 10000000;
    
    const start = formatASSTime(startSec);
    const end = formatASSTime(endSec);
    
    // Lag karaoke-effekt for denne linjen
    let text = "";
    chunk.forEach(word => {
      const durationCS = Math.round(word.duration / 100000);
      text += `{\\k${durationCS}}${word.text.toUpperCase()} `;
    });
    
    ass += `Dialogue: 0,${start},${end},Default,,0,0,0,,{\\fscx110\\fscy110}${text.trim()}\n`;
  }
  
  fs.writeFileSync(outputFile, ass);
  console.log("✅ Virale undertekster generert!");
};

const downloadFile = (url, dest, retries = 3) => {
  return new Promise((resolve, reject) => {
    const attempt = (remaining) => {
      const options = { 
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' },
        timeout: 30000
      };
      
      const file = fs.createWriteStream(dest);
      https.get(url, options, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          return downloadFile(res.headers.location, dest, remaining).then(resolve).catch(reject);
        }
        
        if (res.statusCode !== 200) {
          file.close();
          if (fs.existsSync(dest)) fs.unlinkSync(dest);
          if (remaining > 0) {
            console.log(`🔄 Status ${res.statusCode} for ${url}. Prøver igjen...`);
            return setTimeout(() => attempt(remaining - 1), 5000);
          }
          return reject(new Error(`Nedlastingsfeil: ${res.statusCode}`));
        }
        
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          // Sjekk om vi fikk HTML i stedet for bilde (feilsider)
          const stats = fs.statSync(dest);
          if (stats.size < 500) {
            const content = fs.readFileSync(dest, 'utf8');
            if (content.includes('<html')) {
              if (fs.existsSync(dest)) fs.unlinkSync(dest);
              if (remaining > 0) return setTimeout(() => attempt(remaining - 1), 5000);
              return reject(new Error("Fikk HTML i stedet for bilde."));
            }
          }
          resolve();
        });
      }).on('error', (err) => {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        if (remaining > 0) return setTimeout(() => attempt(remaining - 1), 5000);
        reject(err);
      });
    };
    attempt(retries);
  });
};

async function updateStatus(id, status, extra = {}, user_id = null) {
  const body = JSON.stringify({ status, ...extra, updated_at: new Date() });
  const checkUrl = `${SUPABASE_URL}/rest/v1/orders?video_id=eq.${id}&select=id`;
  const patchUrl = `${SUPABASE_URL}/rest/v1/orders?video_id=eq.${id}`;
  const insertUrl = `${SUPABASE_URL}/rest/v1/orders`;
  
  return new Promise((resolve) => {
    // Først sjekk om raden finnes
    const checkReq = https.request(checkUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      }
    }, (checkRes) => {
      let data = '';
      checkRes.on('data', chunk => data += chunk);
      checkRes.on('end', () => {
        const exists = data !== '[]' && data !== '';
        
        if (exists) {
          // Oppdater eksisterende rad
          const patchReq = https.request(patchUrl, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${SUPABASE_KEY}`,
              'apikey': SUPABASE_KEY,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            }
          }, (patchRes) => {
            if (patchRes.statusCode >= 200 && patchRes.statusCode < 300) {
              console.log(`✅ Status oppdatert i Supabase: ${status}`);
            } else {
              console.error(`❌ Kunne ikke oppdatere Supabase. Status: ${patchRes.statusCode}`);
            }
            resolve();
          });
          patchReq.on('error', (e) => {
            console.error(`❌ Supabase nettverksfeil: ${e.message}`);
            resolve();
          });
          patchReq.write(body);
          patchReq.end();
        } else {
          // Opprett ny rad
          const insertBody = JSON.stringify({
            video_id: id,
            user_id: user_id || '00000000-0000-0000-0000-000000000000', // Fallback UUID
            title: extra.title || `Video ${id}`,
            status: status,
            ...extra,
            created_at: new Date(),
            updated_at: new Date()
          });
          
          const insertReq = https.request(insertUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${SUPABASE_KEY}`,
              'apikey': SUPABASE_KEY,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            }
          }, (insertRes) => {
            if (insertRes.statusCode >= 200 && insertRes.statusCode < 300) {
              console.log(`✅ Ny rad opprettet i Supabase med status: ${status}`);
            } else {
              console.error(`❌ Kunne ikke opprette rad. Status: ${insertRes.statusCode}`);
            }
            resolve();
          });
          insertReq.on('error', (e) => {
            console.error(`❌ Supabase nettverksfeil: ${e.message}`);
            resolve();
          });
          insertReq.write(insertBody);
          insertReq.end();
        }
      });
    });
    checkReq.on('error', (e) => {
      console.error(`❌ Supabase sjekkfeil: ${e.message}`);
      resolve();
    });
    checkReq.end();
  });
}

async function generateImage(prompt, dest) {
  if (IMAGE_PROVIDER === 'local') {
    try {
      console.log(`🤖 Prøver din RTX 4080 for: "${prompt.substring(0, 30)}..."`);
      const apiBody = {
        fn_index: 33, 
        data: [
          prompt, "", ["Fooocus V2", "Fooocus Cinematic"], "Speed", "1024*1792", "1", "png", -1, false, 2, 4, "Default", "Default", 0.5, [], true, 0.5, "None", 0, 0.5, "None", "", 0.75, "None", null, "None", null, "None", null, "None", null
        ]
      };

      await new Promise((resolve, reject) => {
        const data = JSON.stringify(apiBody);
        const req = http.request(`${FOOOCUS_URL}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': data.length },
          timeout: 180000 
        }, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', async () => {
            try {
              const json = JSON.parse(body);
              if (json.data && json.data[0] && json.data[0][0]) {
                const resultFile = json.data[0][0].name;
                const imageUrl = `${FOOOCUS_URL}/file=${resultFile}`;
                console.log("✅ Lokal GPU suksess!");
                await downloadFile(imageUrl, dest);
                resolve();
              } else {
                throw new Error("Feil svar-format.");
              }
            } catch (e) { reject(e); }
          });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
      });
      return;
    } catch (err) {
      console.log(`⚠️ Lokal GPU feilet. Prøver skyen...`);
    }
  }

  const seed = Math.floor(Math.random() * 1000000);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1792&seed=${seed}&nologo=true&model=flux`;
  console.log("☁️ Henter bilde fra Pollinations Sky...");
  await downloadFile(url, dest);
}

// --- HOVEDMOTOR ---

async function handleCinematicRender(data) {
  const { video_id, scenes, voice_id, ai_voice, platform } = data;
  const voiceToUse = ai_voice || voice_id || 'nb-NO-PernilleNeural';
  const videoDir = path.join(BASE_ASSETS_DIR, video_id).replace(/\\/g, '/');
  const tempDir = path.join(videoDir, 'temp').replace(/\\/g, '/');
  
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  const EXEC_OPTIONS = { stdio: 'inherit' };
  console.log(`🎬 Starter v13 Rendering: ${video_id}`);
  
  // 1. Musikk
  const musicFile = `${videoDir}/music.mp3`;
  let hasMusic = false;
  try {
    console.log("🎵 Henter bakgrunnsmusikk...");
    await downloadFile('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', musicFile);
    hasMusic = true;
  } catch (e) { console.warn("⚠️ Musikk hoppet over."); }

// 2. Tale
const voiceFile = `${videoDir}/voiceover.mp3`;
const timestampsFile = `${videoDir}/timestamps.json`;
const fullText = scenes.map(s => s.narration).join('. ');
  console.log("🎙️ Genererer tale med tidsstempler...");
  try {
    execSync(`"${EDGE_TTS_PATH}" --voice "${voiceToUse}" --text "${fullText}" --write-media "${voiceFile}" --timestamps "${timestampsFile}"`, EXEC_OPTIONS);
  } catch (e) {
    console.error(`❌ Feil ved talegenerering med tidsstempler: ${e.message}`);
    execSync(`"${EDGE_TTS_PATH}" --voice "${voiceToUse}" --text "${fullText}" --write-media "${voiceFile}"`, EXEC_OPTIONS);
  }

  // 3. Scener
  const processedClips = [];
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const imagePath = `${tempDir}/img_${i}.png`;
    const sceneVideo = `${tempDir}/scene_${i}.mp4`;
    console.log(`🎨 Scene ${i+1}/${scenes.length}...`);
    
    try {
      await generateImage(scene.prompt || scene.narration, imagePath);
    } catch (err) {
      console.error(`❌ Skippet scene ${i+1}: ${err.message}`);
      continue;
    }

    const dur = scene.duration_seconds || 5;
    const filter = platform !== 'youtube'
      ? `scale=2000:-1,zoompan=z='min(zoom+0.001,1.5)':d=${dur*30}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920`
      : `scale=-1:2000,zoompan=z='min(zoom+0.001,1.5)':d=${dur*30}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080`;

    console.log(`🎞️ Rendrer scene ${i+1}...`);
    execSync(`"${FFMPEG_PATH}" -y -loop 1 -i "${imagePath}" -t ${dur} -vf "${filter},vignette=angle=PI/4" -c:v libx264 -pix_fmt yuv420p -r 30 "${sceneVideo}"`, EXEC_OPTIONS);
    processedClips.push(sceneVideo);
  }

  if (processedClips.length === 0) throw new Error("Ingen scener ble laget.");

  // 4. Sammenføyning
  const listFile = `${videoDir}/list.txt`;
  fs.writeFileSync(listFile, processedClips.map(c => `file '${c}'`).join('\n'));
  const concatVideo = `${videoDir}/concat.mp4`;
  execSync(`"${FFMPEG_PATH}" -y -f concat -safe 0 -i "${listFile}" -c copy "${concatVideo}"`, EXEC_OPTIONS);

  // 5. Undertekster (animerte med tidsstempler fra edge-tts)
  const assFile = `${videoDir}/subs.ass`;
  const srtFile = `${videoDir}/subs.srt`;
  
  if (fs.existsSync(timestampsFile)) {
    // Generer ASS med ord-for-ord animasjon
    const timestamps = JSON.parse(fs.readFileSync(timestampsFile, 'utf8'));
    generateAnimatedASS(timestamps, assFile);
  } else {
    // Fallback til statiske SRT
    console.log("⚠️ Ingen tidsstempler funnet, bruker statiske undertekster");
    let currentTime = 0;
    const srtRows = [];
    for (let i = 0; i < scenes.length; i++) {
      const dur = scenes[i].duration_seconds || 5;
      srtRows.push(`${i+1}\n${formatSRTTime(currentTime)} --> ${formatSRTTime(currentTime + dur)}\n${scenes[i].narration.toUpperCase()}\n`);
      currentTime += dur;
    }
    fs.writeFileSync(srtFile, srtRows.join('\n'));
  }

  // 6. Sluttmiks
  const finalOutput = `${videoDir}/final.mp4`;
  
  console.log("🎞️ Sluttmiksing...");
  
  // Bruk ASS hvis tilgjengelig, ellers SRT
  let subtitleFilter;
  if (fs.existsSync(assFile)) {
    subtitleFilter = `subtitles='${assFile.replace(/\\/g, '/').replace(':', '\\:')}'`;
  } else if (fs.existsSync(srtFile)) {
    const srtStyle = "FontName=Arial Black,FontSize=24,PrimaryColour=&H00FFFFFF&,OutlineColour=&H000000&,BorderStyle=3,Outline=2,Alignment=2,MarginV=80";
    subtitleFilter = `subtitles='${srtFile.replace(/\\/g, '/').replace(':', '\\:')}':force_style='${srtStyle}'`;
  } else {
    subtitleFilter = null;
  }
  
  if (hasMusic) {
    if (subtitleFilter) {
      execSync(`"${FFMPEG_PATH}" -y -i "${concatVideo}" -i "${voiceFile}" -i "${musicFile}" -filter_complex "[1:a]volume=1.0[v];[2:a]volume=0.15[m];[v][m]amix=inputs=2:duration=first[a]" -vf "${subtitleFilter}" -map 0:v -map "[a]" -c:v libx264 -preset fast -shortest "${finalOutput}"`, EXEC_OPTIONS);
    } else {
      execSync(`"${FFMPEG_PATH}" -y -i "${concatVideo}" -i "${voiceFile}" -i "${musicFile}" -filter_complex "[1:a]volume=1.0[v];[2:a]volume=0.15[m];[v][m]amix=inputs=2:duration=first[a]" -map 0:v -map "[a]" -c:v libx264 -preset fast -shortest "${finalOutput}"`, EXEC_OPTIONS);
    }
  } else {
    if (subtitleFilter) {
      execSync(`"${FFMPEG_PATH}" -y -i "${concatVideo}" -i "${voiceFile}" -vf "${subtitleFilter}" -c:v libx264 -c:a aac -shortest "${finalOutput}"`, EXEC_OPTIONS);
    } else {
      execSync(`"${FFMPEG_PATH}" -y -i "${concatVideo}" -i "${voiceFile}" -c:v libx264 -c:a aac -shortest "${finalOutput}"`, EXEC_OPTIONS);
    }
  }

  // 7. Opplasting og Status
  const storagePath = `videos/${video_id}/final.mp4`;
  console.log("☁️ Laster opp til Supabase...");
  execSync(`curl -X POST "${SUPABASE_URL}/storage/v1/object/${storagePath}" -H "Authorization: Bearer ${SUPABASE_KEY}" -H "Content-Type: video/mp4" --data-binary @"${finalOutput}"`, { stdio: 'ignore' });
  
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${storagePath}`;
  
  // Vi dropper thumbnail_url her for å være helt sikre på at statusoppdateringen går gjennom
  await updateStatus(video_id, 'complete', { video_url: publicUrl });
  
  console.log('✅ VIDEO ER KLAR!');
}

// --- SERVER ---

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
          updateStatus(data.video_id, 'failed');
        });
      } catch (e) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => console.log(`🚀 Epic Engine (v13) kjører på http://localhost:${PORT}`));
