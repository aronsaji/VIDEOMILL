export const triggerProduction = async (payload: any) => {
  // Use the full URL if provided, otherwise construct it from base
  const envUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  const baseUrl = envUrl ? envUrl.split('/webhook/')[0] + '/webhook' : 'http://localhost:5678/webhook';
  
  // Select endpoint
  const endpoint = payload.action === 'SERIES_START' ? 'series-start' : (payload.retry_video_id ? 'viranode-retry' : 'viranode-generate');
  const WEBHOOK_URL = `${baseUrl}/${endpoint}`;
  
  console.log(`🚀 Triggering ${endpoint} at ${WEBHOOK_URL}`, payload);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response.ok;
  } catch (err) {
    console.error('Webhook trigger failed:', err);
    return false;
  }
};
