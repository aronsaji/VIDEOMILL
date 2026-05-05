import { supabase } from './supabase';

export const triggerProduction = async (payload: any) => {
  console.group('📡 SUPABASE_DISPATCH_PROTOCOL');
  console.log('Action:', payload.action);
  console.log('Routing through Supabase orders table...');
  
  try {
    // We insert into orders table. The Supabase Trigger handle_new_order() 
    // will catch this and forward it to n8n server-side (No CORS issues).
    const { error } = await supabase
      .from('orders')
      .insert([{
        video_id: payload.video_id || payload.retry_video_id || `manual-${Date.now()}`,
        title: payload.title || 'Untitled Production',
        topic: payload.topic || payload.action,
        language: payload.language || 'en',
        ai_voice: payload.ai_voice || 'standard',
        visual_style: payload.visual_style || 'industrial',
        metadata: payload, // Store the full original payload in metadata
        status: 'pending'
      }]);

    if (error) throw error;
    
    console.log('✅ Order successfully queued in database');
    console.groupEnd();
    return true;
  } catch (err) {
    console.error('❌ Database dispatch failure:', err);
    console.groupEnd();
    return false;
  }
};
