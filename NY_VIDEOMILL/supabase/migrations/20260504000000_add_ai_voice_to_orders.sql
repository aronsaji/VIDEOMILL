-- Legg til ai_voice kolonne i orders tabellen
-- Dette lar appen styre stemmevalg (ai_voice) i stedet for hardkodede verdier

ALTER TABLE orders ADD COLUMN IF NOT EXISTS ai_voice TEXT DEFAULT 'nb-NO-PernilleNeural';

-- Oppdater eksisterende rader til å bruke voice_id hvis ai_voice er tom
UPDATE orders SET ai_voice = voice_id WHERE ai_voice IS NULL OR ai_voice = '';

COMMENT ON COLUMN orders.ai_voice IS 'Stemme valgt i appen (f.eks. nb-NO-PernilleNeural, en-US-JennyNeural)';
