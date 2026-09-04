/**
 * Mock clinical interview data for the frontend demo.
 * In production, these questions are supplied by the backend protocol engine
 * (SOCRATES / Trividha / Ashtavidha / Dashavidha). The frontend never
 * decides clinical workflow or question ordering.
 */

export type AnswerType = 'voice' | 'choice' | 'visual-pain' | 'yes-no';

export interface InterviewQuestion {
  id: string;
  /** Translated question text is generated via the questionKey */
  questionKey: string;
  questionText: string; // fallback / demo text (English)
  type: AnswerType;
  choices?: { label: string; emoji?: string; value: string }[];
  allowIdk?: boolean;
  /** Whether low-confidence voice should offer touch fallback */
  touchFallback?: boolean;
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'chief_complaint',
    questionKey: 'q_feeling',
    questionText: 'How are you feeling today?',
    type: 'voice',
    touchFallback: true,
  },
  {
    id: 'pain_site',
    questionKey: 'q_where_hurt',
    questionText: 'Where does it hurt?',
    type: 'voice',
    touchFallback: true,
  },
  {
    id: 'onset',
    questionKey: 'q_when_start',
    questionText: 'When did it start?',
    type: 'choice',
    choices: [
      { label: 'Today', emoji: '📅', value: 'today' },
      { label: 'This week', emoji: '📆', value: 'this_week' },
      { label: 'A few weeks ago', emoji: '🗓️', value: 'weeks' },
      { label: 'Long time ago', emoji: '⏳', value: 'long' },
    ],
  },
  {
    id: 'character',
    questionKey: 'q_feel_like',
    questionText: 'What does it feel like?',
    type: 'choice',
    choices: [
      { label: 'Sharp', emoji: '⚡', value: 'sharp' },
      { label: 'Burning', emoji: '🔥', value: 'burning' },
      { label: 'Dull ache', emoji: '🪨', value: 'dull' },
      { label: 'Cramping', emoji: '🤏', value: 'cramping' },
    ],
  },
  {
    id: 'severity',
    questionKey: 'q_how_bad',
    questionText: 'How bad is it?',
    type: 'visual-pain',
    allowIdk: true,
  },
  {
    id: 'radiation',
    questionKey: 'q_move_anywhere',
    questionText: 'Does the pain move anywhere else?',
    type: 'yes-no',
  },
  {
    id: 'exacerbating',
    questionKey: 'q_makes_worse',
    questionText: 'What makes it worse?',
    type: 'voice',
    touchFallback: true,
    allowIdk: true,
  },
  {
    id: 'relieving',
    questionKey: 'q_makes_better',
    questionText: 'What makes it better?',
    type: 'voice',
    touchFallback: true,
    allowIdk: true,
  },
  {
    id: 'medications',
    questionKey: 'q_medicines',
    questionText: 'Are you taking any medicines?',
    type: 'yes-no',
  },
];
