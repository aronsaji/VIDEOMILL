export const triggerProduction = async (payload: any) => {
  const envUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  
  // Robust URL Construction
  // If envUrl is provided, we use its base and append the functional endpoint
  const baseUrl = envUrl ? envUrl.split('/webhook/')[0] + '/webhook' : 'http://localhost:5678/webhook';
  const endpoint = payload.action === 'SERIES_START' ? 'series-start' : (payload.retry_video_id ? 'viranode-retry' : 'viranode-generate');
  const WEBHOOK_URL = `${baseUrl}/${endpoint}`;
  
  console.group('📡 N8N WEBHOOK DISPATCH');
  console.log('Endpoint:', endpoint);
  console.log('Target URL:', WEBHOOK_URL);
  console.log('Payload:', payload);
  console.groupEnd();
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Source': 'VideoMill-Dashboard-v2'
      },
      body: JSON.stringify(payload)
    });
    return response.ok;
  } catch (err) {
    console.error('❌ Webhook dispatch failed. Verify VITE_N8N_WEBHOOK_URL in .env.local', err);
    return false;
  }
};
