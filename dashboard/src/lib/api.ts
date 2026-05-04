export const triggerProduction = async (payload: any) => {
  const BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_URL_BASE || 'http://localhost:5678/webhook';
  
  // Velg riktig endepunkt basert på om det er en retry eller ny generering
  const endpoint = payload.retry_video_id ? 'viranode-retry' : 'viranode-generate';
  const WEBHOOK_URL = `${BASE_URL}/${endpoint}`;
  
  console.log(`🚀 Sender ${endpoint} til n8n:`, payload);
  
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
