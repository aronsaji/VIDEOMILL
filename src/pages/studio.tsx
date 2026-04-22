const handleCreate = async (topic: typeof displayTopics[0]) => {
  if (!user || generating) return;

  setSelectedId(topic.id);
  setGenerating(true);

  try {
    const currentLang = language || 'nb';
    
    const { data: order, error } = await createOrder({
      user_id: user.id,
      topic: topic.title,
      title: topic.title.slice(0, 80),
      promp: `Lag en-engasjerende video om: ${topic.title}. ${topic.growth_stat || ''}`,
      platform: topic.platform || 'tiktok',
      language: currentLang,
      voice_id: 'XB0fDUnXU5powFXDhCwa',
      aspect_ratio: '9:16',
    });

    if (error) throw error;

    if (order) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/trigger-n8n`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'new_order',
              video_id: order.id,
              title: topic.title,
              topic: topic.title,
              language: currentLang,
              platform: topic.platform || 'tiktok',
              promp: topic.title,
              voice_id: 'XB0fDUnXU5powFXDhCwa',
              aspect_ratio: '9:16',
            }),
          }
        );
      }
    }

    setSuccess(true);
    setTimeout(() => {
      window.location.hash = 'library';
    }, 2000);

  } catch (err) {
    console.error(err);
  } finally {
    setGenerating(false);
  }
};