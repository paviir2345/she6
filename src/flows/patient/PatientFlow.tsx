import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Camera, Smartphone, UserRound, Stethoscope, QrCode, CheckCircle2,
  Mic, Keyboard, ThumbsUp, ThumbsDown, HelpCircle, Volume2, ArrowLeft,
  Languages, HeartPulse, Activity, ShieldCheck,
} from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { KioskShell } from '@/components/KioskShell';
import { LanguageCard } from '@/components/LanguageCard';
import { LargeButton } from '@/components/LargeButton';
import { AudioButton } from '@/components/AudioButton';
import { AccessibilityGuide } from '@/components/AccessibilityGuide';
import { MicrophoneButton } from '@/components/MicrophoneButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { QuestionCard } from '@/components/QuestionCard';
import { TouchAnswerCard } from '@/components/TouchAnswerCard';
import { ConfirmationCard } from '@/components/ConfirmationCard';
import { QRScannerInstruction } from '@/components/QRScannerInstruction';
import { DocumentCard } from '@/components/DocumentCard';
import { HelpButton } from '@/components/HelpButton';
import { CoachMark } from '@/components/CoachMark';
import { useSpeech } from '@/hooks/useSpeech';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { INTERVIEW_QUESTIONS, type InterviewQuestion } from '@/data/interview';
import { mcp__pexels__pexels_search } from '@/tools';

type Screen =
  | 'landing' | 'welcome' | 'language' | 'patient-caregiver' | 'relationship'
  | 'identity' | 'scan-abha' | 'hospital-reg'
  | 'consent' | 'department'
  | 'interview' | 'redflag'
  | 'doc-capture' | 'doc-qr' | 'doc-photo' | 'doc-processing'
  | 'confirmation' | 'completion';

type Department = 'general' | 'ayurveda';

interface PatientAnswers {
  [key: string]: string;
}

export function PatientFlow({ onExit }: { onExit: () => void }) {
  const { lang, setLang, t, languages } = useI18n();
  const [screen, setScreen] = useState<Screen>('landing');
  const [isCaregiver, setIsCaregiver] = useState(false);
  const [relationship, setRelationship] = useState('');
  const [department, setDepartment] = useState<Department | null>(null);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<PatientAnswers>({});
  const [useTouchFallback, setUseTouchFallback] = useState(false);
  const [showStaffReg, setShowStaffReg] = useState(false);
  const [coachMark, setCoachMark] = useState<string | null>(null);

  const rec = useSpeechRecognition();
  const { speak, stop, speaking, supported: ttsSupported } = useSpeech();
  const prevScreenRef = useRef<Screen>('landing');

  // Auto-speak on screen change
  useEffect(() => {
    if (screen === prevScreenRef.current) return;
    prevScreenRef.current = screen;
    const audio = getScreenAudio(screen, t, INTERVIEW_QUESTIONS[questionIdx]);
    if (audio && ttsSupported) {
      // Small delay to let voices settle
      const timer = setTimeout(() => speak(audio, lang), 300);
      return () => clearTimeout(timer);
    }
  }, [screen, t, lang, questionIdx, ttsSupported, speak]);

  const goTo = useCallback((s: Screen) => {
    stop();
    setScreen(s);
    setUseTouchFallback(false);
  }, [stop]);

  const handleAnswer = useCallback((qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }, []);

  const nextQuestion = useCallback(() => {
    if (questionIdx === 1 && answers['pain_site']) {
      const v = answers['pain_site'].toLowerCase();
      if (v.includes('chest') || v.includes('heart') || rec.transcript.toLowerCase().includes('chest')) {
        setScreen('redflag');
        return;
      }
    }
    if (questionIdx + 1 >= INTERVIEW_QUESTIONS.length) {
      setScreen('doc-capture');
    } else {
      setQuestionIdx((i) => i + 1);
    }
  }, [questionIdx, answers, rec.transcript]);

  const reportedBy = isCaregiver ? (relationship || t('iAmHelping')) : t('reportedYou');

  // ---- Landing Page ----
  if (screen === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
          <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-sm text-white shadow-2xl mb-8 animate-breath">
            <svg viewBox="0 0 24 24" className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 5a7 7 0 0 0-7 7c0 5 7 8 7 8s7-3 7-8a7 7 0 0 0-7-7z" fill="currentColor" opacity="0.4" />
              <path d="M12 9v6M9 12h6" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="text-6xl font-bold text-white mb-3 tracking-tight">MediKiosk</h1>
          <p className="text-2xl text-primary-200 font-medium mb-2">Healthcare for everyone</p>
          <p className="text-lg text-primary-300/80 max-w-md mb-10 leading-relaxed">
            A simple way to tell the doctor about your health.
            No reading needed — just listen and speak.
          </p>

          <div className="flex flex-col gap-4 w-full max-w-sm">
            <button
              onClick={() => setScreen('welcome')}
              className="flex items-center justify-center gap-3 rounded-2xl bg-white text-primary-700 px-8 py-6 text-2xl font-bold shadow-2xl hover:shadow-3xl hover:bg-primary-50 transition-all duration-200 active:scale-[0.98] group"
            >
              <HeartPulse className="w-8 h-8 group-hover:scale-110 transition-transform" />
              Get started
            </button>
            <button
              onClick={onExit}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 text-white border border-white/20 px-6 py-4 text-lg font-semibold hover:bg-white/20 transition-all"
            >
              <ShieldCheck className="w-5 h-5" />
              Staff & workspace selection
            </button>
          </div>

          <div className="flex items-center gap-6 mt-12 text-primary-300/60">
            <div className="flex items-center gap-2 text-sm">
              <Volume2 className="w-5 h-5" /> Voice guided
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Languages className="w-5 h-5" /> 5 languages
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-5 h-5" /> Accessible
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Welcome Page ----
  if (screen === 'welcome') {
    return (
      <KioskShell
        audioText={t('welcomeAudio')}
        onBack={() => setScreen('landing')}
      >
        <div className="flex-1 flex flex-col justify-center items-center text-center animate-fade-in pt-4">
          <div className="relative mb-8">
            <span className="text-8xl block animate-breath">👋</span>
            <div className="absolute -inset-4 rounded-full bg-primary-100/40 -z-10 blur-xl" />
          </div>
          <h1 className="text-5xl font-bold text-primary-800 mb-4 leading-tight">{t('welcomeTitle')}</h1>
          <p className="text-2xl text-ink-600 mb-12 max-w-xl">{t('welcomeSub')}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl mb-12">
            {[
              { emoji: '🎤', text: t('stepAsk'), desc: '', delay: '0s' },
              { emoji: '👆', text: t('stepAnswer'), desc: '', delay: '0.1s' },
              { emoji: '👨‍⚕️', text: t('stepReview'), desc: '', delay: '0.2s' },
            ].map((s, i) => (
              <div
                key={i}
                className="card-kiosk p-7 flex flex-col items-center gap-3 animate-slide-up hover:shadow-kiosk transition-shadow"
                style={{ animationDelay: s.delay }}
              >
                <span className="text-5xl">{s.emoji}</span>
                <span className="text-xl font-bold text-ink-700">{s.text}</span>
              </div>
            ))}
          </div>

          <LargeButton
            variant="primary"
            icon={<CheckCircle2 className="w-8 h-8" />}
            onClick={() => setScreen('language')}
          >
            {t('start')}
          </LargeButton>
        </div>
      </KioskShell>
    );
  }

  // ---- Language Selection ----
  if (screen === 'language') {
    return (
      <KioskShell
        audioText={`${t('chooseLanguage')} ${t('chooseLanguageSub')}`}
        onBack={() => setScreen('welcome')}
      >
        <div className="flex-1 flex flex-col items-center justify-center pt-4 animate-fade-in">
          <h2 className="text-4xl font-bold text-ink-900 mb-2">{t('chooseLanguage')}</h2>
          <p className="text-xl text-ink-500 mb-8">{t('chooseLanguageSub')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-4xl">
            {languages.map((l) => (
              <LanguageCard
                key={l.code}
                language={l}
                onSelect={() => {
                  setLang(l.code);
                  stop();
                  setScreen('patient-caregiver');
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setCoachMark('lang')}
            className="mt-8 flex items-center gap-2 text-lg text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            <HelpCircle className="w-6 h-6" />
            {t('help')}
          </button>
        </div>

        {coachMark === 'lang' && (
          <CoachMark
            title={t('coachLangTitle')}
            body={t('coachLangBody')}
            icon={<Languages className="w-8 h-8" />}
            onClose={() => setCoachMark(null)}
          />
        )}
      </KioskShell>
    );
  }

  const currentQ: InterviewQuestion | undefined = INTERVIEW_QUESTIONS[questionIdx];

  return (
    <KioskShell
      audioText={getScreenAudio(screen, t, currentQ)}
      onBack={() => goTo('language')}
    >
      <HelpButton
        pageText={getScreenAudio(screen, t, currentQ)}
        onBack={() => goTo('language')}
      />

      {/* ---- Patient / Caregiver ---- */}
      {screen === 'patient-caregiver' && (
        <QuestionCard question={t('areYouPatient')} audioText={t('areYouPatient')} onBack={() => goTo('language')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <TouchAnswerCard emoji="👤" label={t('iAmPatient')} onSelect={() => { setIsCaregiver(false); goTo('identity'); }} />
            <TouchAnswerCard emoji="👨‍👩‍👧" label={t('iAmHelping')} onSelect={() => { setIsCaregiver(true); goTo('relationship'); }} />
          </div>
        </QuestionCard>
      )}

      {/* ---- Relationship ---- */}
      {screen === 'relationship' && (
        <QuestionCard question={t('relationship')} audioText={t('relationship')} onBack={() => goTo('patient-caregiver')}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl">
            {[
              { emoji: '👩', label: t('relMother'), val: t('relMother') },
              { emoji: '👨', label: t('relFather'), val: t('relFather') },
              { emoji: '👧', label: t('relDaughter'), val: t('relDaughter') },
              { emoji: '👦', label: t('relSon'), val: t('relSon') },
              { emoji: '🧓', label: t('relGrandparent'), val: t('relGrandparent') },
              { emoji: '🧑', label: t('relOther'), val: t('relOther') },
            ].map((r) => (
              <TouchAnswerCard
                key={r.label}
                emoji={r.emoji}
                label={r.label}
                onSelect={() => { setRelationship(r.val); goTo('identity'); }}
              />
            ))}
          </div>
        </QuestionCard>
      )}

      {/* ---- Identity ---- */}
      {screen === 'identity' && (
        <QuestionCard question={t('identityTitle')} audioText={`${t('identityTitle')} ${t('identitySub')}`} onBack={() => goTo(isCaregiver ? 'relationship' : 'patient-caregiver')}>
          <p className="text-xl text-ink-500 mb-8">{t('identitySub')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <TouchAnswerCard icon={<QrCode className="w-16 h-16" strokeWidth={1.5} />} label={t('scanAbha')} onSelect={() => goTo('scan-abha')} />
            <TouchAnswerCard icon={<UserRound className="w-16 h-16" strokeWidth={1.5} />} label={t('hospitalRegistration')} onSelect={() => goTo('hospital-reg')} />
          </div>
        </QuestionCard>
      )}

      {/* ---- Scan ABHA ---- */}
      {screen === 'scan-abha' && (
        <QuestionCard question={t('scanAbhaTitle')} audioText={t('scanAbhaSub')} onBack={() => goTo('identity')}>
          <p className="text-xl text-ink-500 mb-8">{t('scanAbhaSub')}</p>
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-72 h-72 rounded-3xl border-4 border-dashed border-primary-300 bg-primary-50/50 flex items-center justify-center">
              <div className="absolute inset-4 rounded-2xl border-2 border-primary-200" />
              <QrCode className="w-28 h-28 text-primary-400" strokeWidth={1} />
              <div className="absolute -inset-2 border-4 border-primary-400 rounded-3xl animate-pulse-soft pointer-events-none" />
            </div>
            <AccessibilityGuide message={t('scanAbhaSub')} target="top" />
            <LargeButton variant="primary" onClick={() => goTo('consent')}>{t('continue')}</LargeButton>
          </div>
        </QuestionCard>
      )}

      {/* ---- Hospital Registration ---- */}
      {screen === 'hospital-reg' && (
        <QuestionCard question={t('hospitalRegTitle')} audioText={t('hospitalRegSub')} onBack={() => goTo('identity')}>
          <div className="flex flex-col items-center gap-8 text-center max-w-lg mx-auto">
            {!showStaffReg ? (
              <>
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center animate-pulse-soft">
                  <UserRound className="w-12 h-12 text-primary-500" />
                </div>
                <p className="text-2xl text-ink-600">{t('hospitalRegSub')}</p>
                <LargeButton variant="secondary" onClick={() => setShowStaffReg(true)}>{t('continue')}</LargeButton>
              </>
            ) : (
              <>
                <div className="w-24 h-24 rounded-full bg-success-100 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-success-600" />
                </div>
                <p className="text-2xl font-bold text-success-700">{t('hospitalRegDone')}</p>
                <LargeButton variant="primary" onClick={() => goTo('consent')}>{t('continue')}</LargeButton>
              </>
            )}
          </div>
        </QuestionCard>
      )}

      {/* ---- Consent ---- */}
      {screen === 'consent' && (
        <QuestionCard question={t('consentTitle')} audioText={`${t('consentTitle')} ${t('consentSub')}`} onBack={() => goTo('identity')}>
          <p className="text-xl text-ink-500 mb-8 max-w-2xl">{t('consentSub')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10 max-w-4xl">
            {[
              { emoji: '🎤', label: t('consentVoice'), desc: t('consentVoiceDesc') },
              { emoji: '📄', label: t('consentDocs'), desc: t('consentDocsDesc') },
              { emoji: '🧠', label: t('consentProcess'), desc: t('consentProcessDesc') },
              { emoji: '👨‍⚕️', label: t('consentTeam'), desc: t('consentTeamDesc') },
            ].map((c) => (
              <div key={c.label} className="card-kiosk p-6 text-center hover:shadow-kiosk transition-shadow">
                <span className="text-4xl block mb-3">{c.emoji}</span>
                <p className="text-lg font-bold text-ink-800">{c.label}</p>
                <p className="text-sm text-ink-500 mt-1">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <LargeButton variant="success" icon={<ThumbsUp className="w-7 h-7" />} onClick={() => goTo('department')}>{t('agree')}</LargeButton>
            <LargeButton variant="secondary" icon={<ThumbsDown className="w-7 h-7" />} onClick={() => goTo('language')}>{t('dontAgree')}</LargeButton>
          </div>
        </QuestionCard>
      )}

      {/* ---- Department ---- */}
      {screen === 'department' && (
        <QuestionCard question={t('deptTitle')} audioText={t('deptTitle')} onBack={() => goTo('consent')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <TouchAnswerCard icon={<Stethoscope className="w-16 h-16" strokeWidth={1.5} />} label={t('deptGenMed')} onSelect={() => { setDepartment('general'); goTo('interview'); }} />
            <TouchAnswerCard emoji="🌿" label={t('deptAyurveda')} onSelect={() => { setDepartment('ayurveda'); goTo('interview'); }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mt-6">
            <p className="text-lg text-ink-500 text-center">{t('deptGenMedDesc')}</p>
            <p className="text-lg text-ink-500 text-center">{t('deptAyurvedaDesc')}</p>
          </div>
        </QuestionCard>
      )}

      {/* ---- Interview ---- */}
      {screen === 'interview' && currentQ && (
        <div className="flex flex-col flex-1 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => questionIdx > 0 ? setQuestionIdx((i) => i - 1) : goTo('department')} className="flex items-center gap-2 text-lg font-semibold text-ink-500 hover:text-primary-600 transition-colors">
              <ArrowLeft className="w-6 h-6" />
              {t('back')}
            </button>
            <div className="flex items-center gap-3">
              <p className="text-xl font-semibold text-primary-600">{t('doingWell')}</p>
              <button
                onClick={() => setCoachMark('mic')}
                className="flex items-center gap-1 text-base text-ink-400 hover:text-primary-600 font-medium"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mb-8">
            <ProgressIndicator total={INTERVIEW_QUESTIONS.length} current={questionIdx + 1} />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <h2 className="text-4xl font-bold text-ink-900 leading-tight">{currentQ.questionText}</h2>
              <AudioButton text={currentQ.questionText} label={t('repeat')} size="sm" />
            </div>

            {/* Voice question */}
            {currentQ.type === 'voice' && (
              <div className="flex flex-col items-center gap-8">
                {!useTouchFallback ? (
                  <>
                    <MicrophoneButton
                      listening={rec.listening}
                      onStart={() => { rec.reset(); rec.start(lang); }}
                      onStop={() => rec.stop()}
                      label={t('tapAndSpeak')}
                      listeningLabel={t('listening')}
                    />
                    {rec.transcript && (
                      <div className="card-kiosk p-6 max-w-2xl w-full text-center animate-slide-up">
                        <p className="text-2xl font-semibold text-ink-800">"{rec.transcript}"</p>
                        {rec.confidence < 0.6 && rec.confidence > 0 && (
                          <p className="text-lg text-warning-600 mt-3">{t('letsTryAnotherWay')}</p>
                        )}
                        <div className="flex gap-3 justify-center mt-4">
                          <LargeButton variant="success" onClick={() => { handleAnswer(currentQ.id, rec.transcript); nextQuestion(); }}>{t('continue')}</LargeButton>
                          {currentQ.touchFallback && (
                            <LargeButton variant="secondary" icon={<Keyboard className="w-6 h-6" />} onClick={() => setUseTouchFallback(true)}>{t('typeAnswer')}</LargeButton>
                          )}
                        </div>
                      </div>
                    )}
                    {!rec.transcript && currentQ.touchFallback && (
                      <LargeButton variant="secondary" icon={<Keyboard className="w-6 h-6" />} onClick={() => setUseTouchFallback(true)}>{t('typeAnswer')}</LargeButton>
                    )}
                  </>
                ) : (
                  <TouchFallbackInput
                    label={t('typeAnswer')}
                    onSubmit={(val) => { handleAnswer(currentQ.id, val); nextQuestion(); }}
                    submitLabel={t('continue')}
                  />
                )}
              </div>
            )}

            {/* Choice question */}
            {currentQ.type === 'choice' && currentQ.choices && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl">
                {currentQ.choices.map((c) => (
                  <TouchAnswerCard
                    key={c.value}
                    emoji={c.emoji}
                    label={c.label}
                    onSelect={() => { handleAnswer(currentQ.id, c.label); nextQuestion(); }}
                  />
                ))}
              </div>
            )}

            {/* Visual pain scale */}
            {currentQ.type === 'visual-pain' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl">
                {[
                  { emoji: '🙂', label: t('painMild'), value: 'mild' },
                  { emoji: '😐', label: t('painModerate'), value: 'moderate' },
                  { emoji: '😣', label: t('painSevere'), value: 'severe' },
                  { emoji: '😭', label: t('painVerySevere'), value: 'very_severe' },
                ].map((c) => (
                  <TouchAnswerCard
                    key={c.value}
                    emoji={c.emoji}
                    label={c.label}
                    onSelect={() => { handleAnswer(currentQ.id, c.value); nextQuestion(); }}
                  />
                ))}
              </div>
            )}

            {/* Yes / No */}
            {currentQ.type === 'yes-no' && (
              <div className="flex flex-col sm:flex-row gap-6 max-w-2xl">
                <TouchAnswerCard emoji="👍" label={t('yes')} onSelect={() => { handleAnswer(currentQ.id, 'yes'); nextQuestion(); }} variant="success" />
                <TouchAnswerCard emoji="👎" label={t('no')} onSelect={() => { handleAnswer(currentQ.id, 'no'); nextQuestion(); }} variant="danger" />
              </div>
            )}

            {/* I don't know */}
            {currentQ.allowIdk && (
              <div className="mt-8">
                <TouchAnswerCard emoji="🤷" label={t('iDontKnow')} onSelect={() => { handleAnswer(currentQ.id, 'unknown'); nextQuestion(); }} />
              </div>
            )}
          </div>

          {coachMark === 'mic' && (
            <CoachMark
              title={t('coachMicTitle')}
              body={t('coachMicBody')}
              icon={<Mic className="w-8 h-8" />}
              highlight={
                <div className="flex items-center gap-3">
                  <Volume2 className="w-6 h-6 text-primary-500" />
                  <span className="text-sm font-medium text-primary-700">{t('coachAudioBody')}</span>
                </div>
              }
              onClose={() => setCoachMark(null)}
            />
          )}
        </div>
      )}

      {/* ---- Red Flag ---- */}
      {screen === 'redflag' && (
        <div className="flex-1 flex flex-col justify-center items-center text-center animate-fade-in max-w-2xl mx-auto">
          <span className="text-7xl mb-8">💙</span>
          <h1 className="text-5xl font-bold text-primary-700 mb-4">{t('thankYouTelling')}</h1>
          <p className="text-3xl font-semibold text-ink-700 mb-3">{t('nurseComing')}</p>
          <p className="text-2xl text-ink-500 mb-10">{t('pleaseStay')}</p>
          <AudioButton text={`${t('thankYouTelling')} ${t('nurseComing')} ${t('pleaseStay')}`} label={t('listen')} size="lg" />
        </div>
      )}

      {/* ---- Document Capture ---- */}
      {screen === 'doc-capture' && (
        <QuestionCard question={t('docCaptureTitle')} audioText={`${t('docCaptureTitle')} ${t('docCaptureSub')}`} onBack={() => goTo('interview')}>
          <p className="text-xl text-ink-500 mb-8 max-w-2xl">{t('docCaptureSub')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-3xl">
            <DocumentCard type="prescription" label={t('docPrescription')} />
            <DocumentCard type="blood" label={t('docBloodReport')} />
            <DocumentCard type="discharge" label={t('docDischarge')} />
            <DocumentCard type="medicine" label={t('docMedicine')} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mb-6">
            <TouchAnswerCard icon={<Camera className="w-14 h-14" strokeWidth={1.5} />} label={t('takePhoto')} onSelect={() => goTo('doc-photo')} />
            <TouchAnswerCard icon={<Smartphone className="w-14 h-14" strokeWidth={1.5} />} label={t('useMyPhone')} onSelect={() => goTo('doc-qr')} />
            <TouchAnswerCard icon={<UserRound className="w-14 h-14" strokeWidth={1.5} />} label={t('askStaff')} onSelect={() => goTo('confirmation')} />
          </div>
          <LargeButton variant="ghost" icon={<HelpCircle className="w-6 h-6" />} onClick={() => goTo('confirmation')}>{t('noDocument')}</LargeButton>
        </QuestionCard>
      )}

      {/* ---- QR Upload ---- */}
      {screen === 'doc-qr' && (
        <QuestionCard question={t('scanThisCode')} onBack={() => goTo('doc-capture')}>
          <QRScannerInstruction qrValue="MK-SESS-7F3A-2026" />
          <div className="flex justify-center mt-8">
            <LargeButton variant="primary" onClick={() => goTo('doc-processing')}>{t('continue')}</LargeButton>
          </div>
        </QuestionCard>
      )}

      {/* ---- Photo ---- */}
      {screen === 'doc-photo' && (
        <QuestionCard question={t('takePhoto')} onBack={() => goTo('doc-capture')}>
          <div className="flex flex-col items-center gap-8">
            <div className="w-80 h-60 rounded-2xl border-4 border-dashed border-primary-300 bg-primary-50/50 flex items-center justify-center">
              <Camera className="w-20 h-20 text-primary-400" strokeWidth={1} />
            </div>
            <AccessibilityGuide message={t('takePhoto')} target="top" />
            <LargeButton variant="primary" onClick={() => goTo('doc-processing')}>{t('continue')}</LargeButton>
          </div>
        </QuestionCard>
      )}

      {/* ---- Processing ---- */}
      {screen === 'doc-processing' && (
        <div className="flex-1 flex flex-col justify-center items-center text-center animate-fade-in">
          <span className="text-6xl mb-8">📄</span>
          <h2 className="text-4xl font-bold text-ink-800 mb-3">{t('docReceived')}</h2>
          <p className="text-2xl text-ink-500 mb-10">{t('docReading')}</p>
          <div className="w-48 h-3 bg-ink-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full animate-[breath_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
          </div>
          <div className="mt-10">
            <LargeButton variant="primary" onClick={() => goTo('confirmation')}>{t('continue')}</LargeButton>
          </div>
        </div>
      )}

      {/* ---- Confirmation ---- */}
      {screen === 'confirmation' && (
        <div className="flex flex-col flex-1 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-bold text-ink-900">{t('almostFinished')}</h2>
            <AudioButton text={`${t('almostFinished')} ${t('hereIsWhat')}`} />
          </div>
          <p className="text-xl text-ink-500 mb-8">{t('hereIsWhat')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 max-w-3xl">
            <ConfirmationCard icon="🩺" label={t('mainProblem')} value={answers['chief_complaint'] || answers['pain_site'] || '—'} provenance={`${t('reportedBy')}: ${reportedBy}`} />
            <ConfirmationCard icon="📅" label={t('startedLabel')} value={answers['onset'] || '—'} provenance={`${t('reportedBy')}: ${reportedBy}`} />
            <ConfirmationCard icon="😣" label={t('severityLabel')} value={answers['severity'] || '—'} provenance={`${t('reportedBy')}: ${reportedBy}`} />
            <ConfirmationCard icon="💊" label={t('medicinesLabel')} value={answers['medications'] || '—'} provenance={`${t('reportedBy')}: ${reportedBy}`} />
          </div>
          <p className="text-2xl font-bold text-ink-800 mb-6">{t('isCorrect')}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <LargeButton variant="success" icon={<CheckCircle2 className="w-7 h-7" />} onClick={() => goTo('completion')}>{t('correct')}</LargeButton>
            <LargeButton variant="secondary" onClick={() => goTo('interview')}>{t('change')}</LargeButton>
          </div>
        </div>
      )}

      {/* ---- Completion ---- */}
      {screen === 'completion' && (
        <div className="flex-1 flex flex-col justify-center items-center text-center animate-fade-in max-w-2xl mx-auto">
          <div className="w-28 h-28 rounded-full bg-success-100 flex items-center justify-center mb-8 animate-breath">
            <CheckCircle2 className="w-16 h-16 text-success-600" />
          </div>
          <h1 className="text-5xl font-bold text-success-700 mb-4">{t('completionTitle')}</h1>
          <p className="text-2xl text-ink-700 mb-3">{t('completionBody')}</p>
          <p className="text-xl text-ink-500 mb-10">{t('completionWait')}</p>
          <AudioButton text={`${t('completionTitle')} ${t('completionBody')} ${t('completionWait')}`} label={t('listen')} size="lg" />
          <div className="mt-10">
            <LargeButton variant="secondary" onClick={() => { setAnswers({}); setQuestionIdx(0); setScreen('landing'); }}>
              {t('start')}
            </LargeButton>
          </div>
        </div>
      )}
    </KioskShell>
  );
}

function TouchFallbackInput({ label, onSubmit, submitLabel }: { label: string; onSubmit: (v: string) => void; submitLabel: string }) {
  const [val, setVal] = useState('');
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xl">
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder={label}
        autoFocus
        className="w-full rounded-2xl border-2 border-primary-200 px-6 py-5 text-2xl focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
      />
      <LargeButton variant="primary" onClick={() => val.trim() && onSubmit(val.trim())} disabled={!val.trim()}>
        {submitLabel}
      </LargeButton>
    </div>
  );
}

function getScreenAudio(screen: Screen, t: (k: string) => string, q?: InterviewQuestion): string {
  switch (screen) {
    case 'welcome': return t('welcomeAudio');
    case 'language': return `${t('chooseLanguage')} ${t('chooseLanguageSub')}`;
    case 'patient-caregiver': return t('areYouPatient');
    case 'relationship': return t('relationship');
    case 'identity': return `${t('identityTitle')} ${t('identitySub')}`;
    case 'consent': return `${t('consentTitle')} ${t('consentSub')}`;
    case 'department': return t('deptTitle');
    case 'interview': return q ? `${q.questionText} ${t('tapAndSpeak')}.` : '';
    case 'redflag': return `${t('thankYouTelling')} ${t('nurseComing')} ${t('pleaseStay')}`;
    case 'doc-capture': return `${t('docCaptureTitle')} ${t('docCaptureSub')}`;
    case 'confirmation': return `${t('almostFinished')} ${t('hereIsWhat')}`;
    case 'completion': return `${t('completionTitle')} ${t('completionBody')} ${t('completionWait')}`;
    default: return '';
  }
}
