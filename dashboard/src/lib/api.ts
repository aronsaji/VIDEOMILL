import { supabase } from './supabase';

export const triggerProduction = async (payload: any) => {
  console.group('📡 SUPABASE_DISPATCH_PROTOCOL');
  console.log('Action:', payload.action);
  
  try {
    // 1. Get the current authenticated user session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('❌ User not authenticated. Cannot dispatch order.');
      alert('⚠️ AUTH_REQUIRED: Please sign in to initiate production.');
      return false;
    }

    console.log('Routing through Supabase for user:', user.id);

    // 2. Insert into orders table with the correct user_id
    const { error } = await supabase
      .from('orders')
      .insert([{
        user_id: user.id, // CRITICAL: Must match authenticated user
        video_id: payload.video_id || payload.retry_video_id || `manual-${Date.now()}`,
        title: payload.title || 'Untitled Production',
        topic: payload.topic || payload.action,
        language: payload.language || 'en',
        ai_voice: payload.ai_voice || 'standard',
        visual_style: payload.visual_style || 'industrial',
        metadata: payload, 
        status: 'pending'
      }]);

    if (error) {
      console.error('❌ Supabase Error:', error.message);
      throw error;
    }
    
    console.log('✅ Order successfully queued in database');
    console.groupEnd();
    return true;
  } catch (err: any) {
    console.error('❌ Database dispatch failure:', err.message);
    alert(`❌ DISPATCH_ERROR: ${err.message}`);
    console.groupEnd();
    return false;
  }
};
