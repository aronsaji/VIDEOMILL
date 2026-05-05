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
        user_id: user.id,
        title: payload.title || 'Untitled Production',
        status: 'pending',
        metadata: {
          ...payload,
          dispatched_at: new Date().toISOString(),
          agent_node: 'videomill-v2-dashboard'
        }
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

export const retryProduction = async (videoId: string) => {
  console.group('🔄 NEURAL_RETRY_PROTOCOL');
  console.log('Target ID:', videoId);
  
  try {
    const { error } = await supabase.rpc('handle_retry_request', { 
      video_id: videoId 
    });

    if (error) {
      console.error('❌ RPC Error:', error.message);
      throw error;
    }
    
    console.log('✅ Retry sequence successfully initiated');
    console.groupEnd();
    return true;
  } catch (err: any) {
    console.error('❌ Retry dispatch failure:', err.message);
    alert(`❌ RETRY_ERROR: ${err.message}`);
    console.groupEnd();
    return false;
  }
};
