import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Speech synthesis hook using the Web Speech API.
 * Handles voice loading — many browsers load voices asynchronously,
 * so we must wait for the `voiceschanged` event before selecting a voice.
 * If no matching language voice is found, falls back to the default voice.
 */
export function useSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [speaking, setSpeaking] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const timerRef = useRef<number | null>(null);

  // Load voices (async on Chrome)
  useEffect(() => {
    if (!supported) return;
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        voicesRef.current = v;
        setVoicesReady(true);
      }
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    // Safari sometimes needs a kick
    const t = window.setTimeout(loadVoices, 500);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.clearTimeout(t);
    };
  }, [supported]);

  const pickVoice = useCallback((lang: string): SpeechSynthesisVoice | undefined => {
    const voices = voicesRef.current;
    if (voices.length === 0) return undefined;
    const langMap: Record<string, string[]> = {
      en: ['en-IN', 'en-GB', 'en-US', 'en'],
      hi: ['hi-IN', 'hi'],
      ta: ['ta-IN', 'ta'],
      te: ['te-IN', 'te'],
      ml: ['ml-IN', 'ml'],
    };
    const targets = langMap[lang] ?? ['en-IN'];
    for (const target of targets) {
      const match = voices.find((v) => v.lang === target);
      if (match) return match;
      const partial = voices.find((v) => v.lang.startsWith(target.split('-')[0]));
      if (partial) return partial;
    }
    return voices[0];
  }, []);

  const speak = useCallback((text: string, lang: string) => {
    if (!supported || !text) return;
    // Cancel anything already in progress
    window.speechSynthesis.cancel();
    // Small delay — Chrome sometimes ignores an utterance queued immediately after cancel
    window.setTimeout(() => {
      const u = new SpeechSynthesisUtterance(text);
      const voice = pickVoice(lang);
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang;
      } else {
        const langMap: Record<string, string> = {
          en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', ml: 'ml-IN',
        };
        u.lang = langMap[lang] ?? 'en-IN';
      }
      u.rate = 0.82;
      u.pitch = 1;
      u.volume = 1;
      u.onstart = () => setSpeaking(true);
      u.onend = () => {
        setSpeaking(false);
        if (timerRef.current) window.clearTimeout(timerRef.current);
      };
      u.onerror = (e) => {
        setSpeaking(false);
        if (timerRef.current) window.clearTimeout(timerRef.current);
      };
      // Chrome bug: if utterance is too long it can get cut off.
      // Split into sentences for reliability.
      const sentences = text.match(/[^.!?]+[.!?]*/g) ?? [text];
      if (sentences.length <= 1) {
        window.speechSynthesis.speak(u);
      } else {
        sentences.forEach((s) => {
          const su = new SpeechSynthesisUtterance(s.trim());
          if (voice) { su.voice = voice; su.lang = voice.lang; }
          else { su.lang = u.lang; }
          su.rate = u.rate;
          su.pitch = u.pitch;
          su.volume = u.volume;
          su.onstart = () => setSpeaking(true);
          su.onend = () => setSpeaking(false);
          su.onerror = () => setSpeaking(false);
          window.speechSynthesis.speak(su);
        });
      }
    }, 80);
    timerRef.current = window.setTimeout(() => setSpeaking(false), 60000);
  }, [supported, pickVoice]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { speak, stop, speaking, supported: !!supported, voicesReady };
}
