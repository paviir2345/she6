import { useRef, useState, useCallback } from 'react';

type RecognitionResult = { transcript: string; confidence: number };

/**
 * Voice input hook using the Web Speech API (SpeechRecognition).
 * Falls back gracefully when unsupported. The production backend handles
 * the actual ASR; this provides an interactive demo in the browser.
 */
export function useSpeechRecognition() {
  const supported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const recRef = useRef<any>(null);

  const start = useCallback((lang: string) => {
    if (!supported) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;
    rec.onresult = (e: any) => {
      const r: RecognitionResult = e.results[0][0];
      setTranscript(r.transcript);
      setConfidence(r.confidence ?? 0.5);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setTranscript('');
    setConfidence(0);
    setListening(true);
    rec.start();
  }, [supported]);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setConfidence(0);
  }, []);

  return { start, stop, reset, listening, transcript, confidence, supported };
}
