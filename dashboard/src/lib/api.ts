export const triggerProduction = async (payload: any) => {
  const envUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  
  // Determine the correct endpoint based on action
  const endpoint = payload.action === 'SERIES_START' 
    ? 'series-start' 
    : (payload.retry_video_id || payload.action === 'viranode-retry' ? 'viranode-retry' : 'viranode-generate');

  let WEBHOOK_URL = envUrl;
  
  if (!WEBHOOK_URL) {
    console.warn('⚠️ No VITE_N8N_WEBHOOK_URL detected. Falling back to localhost.');
    WEBHOOK_URL = `http://localhost:5678/webhook/${endpoint}`;
  } else {
    // Force the correct endpoint even if .env has a different one
    const baseUrl = WEBHOOK_URL.split('/webhook/')[0];
    WEBHOOK_URL = `${baseUrl}/webhook/${endpoint}`;
  }
  
  console.group('📡 N8N_COMM_PROTOCOL');
  console.log('Action:', payload.action);
  console.log('Endpoint:', endpoint);
  console.log('Final URL:', WEBHOOK_URL);
  console.groupEnd();
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Source': 'VideoMill-Tactical-v2',
      },
      body: JSON.stringify(payload)
    });
    
    return response.ok;
  } catch (err) {
    console.error('❌ Network failure during dispatch:', err);
    return false;
  }
};
