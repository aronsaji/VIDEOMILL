export const triggerProduction = async (payload: any) => {
  const envUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  
  // Use the provided URL exactly as is if it's a full URL, 
  // otherwise fallback to common functional endpoints
  let WEBHOOK_URL = envUrl;
  
  if (!WEBHOOK_URL) {
    console.warn('⚠️ No VITE_N8N_WEBHOOK_URL detected. Falling back to localhost for development.');
    const endpoint = payload.action === 'SERIES_START' ? 'series-start' : (payload.retry_video_id ? 'viranode-retry' : 'viranode-generate');
    WEBHOOK_URL = `http://localhost:5678/webhook/${endpoint}`;
  }
  
  console.group('📡 N8N_COMM_PROTOCOL');
  console.log('Dispatching to:', WEBHOOK_URL);
  console.log('Payload Data:', payload);
  console.groupEnd();
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Source': 'VideoMill-Dashboard-v2',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      console.error(`❌ Webhook Error [${response.status}]: ${response.statusText}`);
    }
    
    return response.ok;
  } catch (err) {
    console.error('❌ Network failure during webhook dispatch. Verify n8n server is online and CORS is enabled.', err);
    return false;
  }
};
