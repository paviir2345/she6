import { useState } from 'react';
import {
  LayoutDashboard, Users, FileText, Clock, ListChecks, FileBarChart,
  Code2, CheckSquare, ArrowLeft, Download, MessageSquareWarning,
  CheckCircle2, Pencil, ChevronRight,
} from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { PhysicianFactCard } from '@/components/PhysicianFactCard';
import { StatusBadge } from '@/components/StatusBadge';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';

type NavSection = 'dashboard' | 'patients' | 'documents' | 'timeline' | 'facts' | 'summary' | 'coding' | 'review';

interface FactVersion {
  value: string;
  reportedBy: string;
  source: 'voice' | 'prescription' | 'phone' | 'patient' | 'caregiver' | 'staff';
  detail?: string;
  version: number;
}

const FACTS: { label: string; key: string; versions: FactVersion[]; status: 'draft' | 'review' | 'edited' | 'approved' }[] = [
  {
    label: 'Chief Complaint', key: 'cc', status: 'review',
    versions: [
      { value: 'Chest pain', reportedBy: 'Patient', source: 'voice', version: 1 },
    ],
  },
  {
    label: 'Onset', key: 'onset', status: 'approved',
    versions: [
      { value: 'Started this morning', reportedBy: 'Patient', source: 'voice', version: 1 },
      { value: 'Started 6 hours ago, upon waking', reportedBy: 'Dr. R. Mehta', source: 'staff', version: 2 },
    ],
  },
  {
    label: 'Character', key: 'character', status: 'review',
    versions: [
      { value: 'Sharp, pressing', reportedBy: 'Patient', source: 'voice', version: 1 },
    ],
  },
  {
    label: 'Radiation', key: 'radiation', status: 'review',
    versions: [
      { value: 'Moves to left arm', reportedBy: 'Patient', source: 'voice', version: 1 },
    ],
  },
  {
    label: 'Severity', key: 'severity', status: 'edited',
    versions: [
      { value: 'Severe (8/10)', reportedBy: 'Patient', source: 'voice', version: 1 },
      { value: 'Severe (9/10) — patient appeared in distress', reportedBy: 'Daughter', source: 'voice', version: 2 },
    ],
  },
  {
    label: 'Current Medication', key: 'meds', status: 'draft',
    versions: [
      { value: 'Metformin 500 mg', reportedBy: 'Daughter', source: 'prescription', detail: 'Page 1', version: 1 },
    ],
  },
];

const TIMELINE = [
  { time: '10:30 AM', event: 'Session started', actor: 'Patient (kiosk)', icon: '🎤' },
  { time: '10:31 AM', event: 'Consent recorded', actor: 'Patient', icon: '✓' },
  { time: '10:35 AM', event: 'Chief complaint: Chest pain', actor: 'Patient (voice)', icon: '🎙️' },
  { time: '10:38 AM', event: 'Red-flag triggered — escalation to nurse', actor: 'Protocol Engine', icon: '🚩' },
  { time: '10:40 AM', event: 'Nurse acknowledged alert', actor: 'Nurse: Priya S.', icon: '✓' },
  { time: '10:45 AM', event: 'Interview completed', actor: 'Patient', icon: '📝' },
  { time: '10:47 AM', event: 'Document uploaded — prescription_p1.jpg', actor: 'Daughter (phone)', icon: '📄' },
  { time: '10:50 AM', event: 'OCR processed — 3 facts extracted', actor: 'Document Service', icon: '🧠' },
  { time: '10:55 AM', event: 'Case assigned to Dr. R. Mehta', actor: 'System', icon: '👨‍⚕️' },
];

const CODING = [
  { code: 'R07.9', desc: 'Chest pain, unspecified', confidence: 'High', source: 'AI draft' },
  { code: 'I20.9', desc: 'Angina pectoris, unspecified', confidence: 'Medium', source: 'AI draft' },
  { code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications', confidence: 'High', source: 'Medication inference' },
];

type ReviewStatus = 'draft' | 'review' | 'edited' | 'clarification' | 'rejected' | 'approved' | 'exported';

export function PhysicianDashboard({ onExit }: { onExit: () => void }) {
  const { t } = useI18n();
  const [section, setSection] = useState<NavSection>('dashboard');
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>('review');

  const nav: { key: NavSection; label: string; icon: typeof LayoutDashboard }[] = [
    { key: 'dashboard', label: t('staffDashboard'), icon: LayoutDashboard },
    { key: 'patients', label: t('patients'), icon: Users },
    { key: 'documents', label: t('documents'), icon: FileText },
    { key: 'timeline', label: t('timeline'), icon: Clock },
    { key: 'facts', label: t('clinicalFacts'), icon: ListChecks },
    { key: 'summary', label: t('summary'), icon: FileBarChart },
    { key: 'coding', label: t('coding'), icon: Code2 },
    { key: 'review', label: t('review'), icon: CheckSquare },
  ];

  const statusLabel = (s: ReviewStatus) => ({
    draft: t('draft'), review: t('underReview'), edited: t('edited'),
    clarification: t('clarificationRequested'), rejected: t('rejected'),
    approved: t('approved'), exported: t('exported'),
  }[s]);

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <header className="bg-white border-b border-ink-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-primary-600">
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>
          <span className="text-ink-200">|</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500 text-white">
              <FileBarChart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-900">MediKiosk · Physician Workspace</p>
              <p className="text-xs text-ink-400">Dr. R. Mehta · General Medicine</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status="review" label={statusLabel(reviewStatus)} />
          <span className="text-sm text-ink-500">Session #MK-2041</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <nav className="w-48 bg-white border-r border-ink-200 p-3 shrink-0 overflow-y-auto">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`staff-nav-link w-full ${section === item.key ? 'staff-nav-link-active' : ''}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard */}
          {section === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-6">{t('staffDashboard')}</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: t('totalPatients'), value: '247', color: 'text-primary-600' },
                  { label: t('activeSessions'), value: '12', color: 'text-success-600' },
                  { label: t('pendingReview'), value: '8', color: 'text-warning-600' },
                  { label: t('redFlags'), value: '3', color: 'text-danger-600' },
                ].map((s) => (
                  <div key={s.label} className="card-kiosk p-5">
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-sm text-ink-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="card-kiosk p-5">
                <h2 className="text-lg font-bold text-ink-900 mb-4">Recent Patients</h2>
                <div className="space-y-2">
                  {[
                    { id: 'MK-2041', name: 'Ramesh K.', complaint: 'Chest pain', status: 'review' as ReviewStatus },
                    { id: 'MK-2038', name: 'Lakshmi P.', complaint: 'Breathlessness', status: 'draft' as ReviewStatus },
                    { id: 'MK-2031', name: 'Abdul S.', complaint: 'High fever', status: 'approved' as ReviewStatus },
                  ].map((p) => (
                    <button key={p.id} onClick={() => setSection('review')} className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-ink-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-ink-400">{p.id}</span>
                        <span className="text-sm font-semibold text-ink-800">{p.name}</span>
                        <span className="text-sm text-ink-500">· {p.complaint}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={p.status} label={statusLabel(p.status)} />
                        <ChevronRight className="w-4 h-4 text-ink-300" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Patients */}
          {section === 'patients' && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-6">{t('patients')}</h1>
              <div className="card-kiosk overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Session</th>
                      <th className="text-left px-4 py-3 font-semibold">Patient</th>
                      <th className="text-left px-4 py-3 font-semibold">{t('chiefComplaint')}</th>
                      <th className="text-left px-4 py-3 font-semibold">{t('reportedBy')}</th>
                      <th className="text-left px-4 py-3 font-semibold">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {[
                      { id: 'MK-2041', name: 'Ramesh K., 54M', complaint: 'Chest pain', by: 'Patient', st: 'review' as ReviewStatus },
                      { id: 'MK-2038', name: 'Lakshmi P., 67F', complaint: 'Breathlessness', by: 'Daughter', st: 'draft' as ReviewStatus },
                      { id: 'MK-2031', name: 'Abdul S., 45M', complaint: 'High fever', by: 'Patient', st: 'approved' as ReviewStatus },
                      { id: 'MK-2025', name: 'Kavita R., 38F', complaint: 'Weight loss', by: 'Husband', st: 'clarification' as ReviewStatus },
                    ].map((p) => (
                      <tr key={p.id} className="hover:bg-ink-50 cursor-pointer" onClick={() => setSection('review')}>
                        <td className="px-4 py-3 font-mono text-ink-500">{p.id}</td>
                        <td className="px-4 py-3 font-semibold text-ink-800">{p.name}</td>
                        <td className="px-4 py-3 text-ink-600">{p.complaint}</td>
                        <td className="px-4 py-3"><ProvenanceBadge reportedBy={p.by} /></td>
                        <td className="px-4 py-3"><StatusBadge status={p.st} label={statusLabel(p.st)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Documents */}
          {section === 'documents' && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-6">{t('documents')}</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {['prescription_p1.jpg', 'blood_report.pdf', 'discharge_2024.pdf'].map((doc) => (
                  <div key={doc} className="card-kiosk p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-8 h-8 text-primary-500" />
                      <div>
                        <p className="text-sm font-semibold text-ink-800">{doc}</p>
                        <ProvenanceBadge reportedBy="Daughter" source="phone" />
                      </div>
                    </div>
                    <div className="aspect-video bg-ink-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-16 h-16 text-ink-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {section === 'timeline' && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-6">{t('timeline')}</h1>
              <div className="max-w-2xl space-y-0">
                {TIMELINE.map((item, i) => (
                  <div key={i} className="flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-lg">
                        {item.icon}
                      </div>
                      {i < TIMELINE.length - 1 && <div className="w-0.5 flex-1 bg-ink-200 mt-1" />}
                    </div>
                    <div className="pt-1.5">
                      <p className="text-xs font-mono text-ink-400">{item.time}</p>
                      <p className="text-sm font-semibold text-ink-800">{item.event}</p>
                      <p className="text-xs text-ink-500">{item.actor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Facts */}
          {section === 'facts' && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-1">{t('clinicalFacts')}</h1>
              <p className="text-sm text-ink-400 mb-6">SOCRATES-structured · Every fact shows {t('provenance').toLowerCase()}</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {FACTS.map((f) => (
                  <PhysicianFactCard
                    key={f.key}
                    label={f.label}
                    versions={f.versions}
                    status={f.status}
                    statusLabel={statusLabel(f.status)}
                    editLabel={t('editFact')}
                    onEdit={() => setSection('review')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {section === 'summary' && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-6">{t('summary')}</h1>
              <div className="card-kiosk p-6 max-w-2xl space-y-4">
                <div>
                  <p className="text-xs font-semibold text-ink-400 uppercase">AI-Generated Draft</p>
                  <p className="text-sm text-ink-700 mt-2 leading-relaxed">
                    54-year-old male presents with acute-onset chest pain, described as sharp and pressing,
                    radiating to the left arm. Onset this morning upon waking. Severity 9/10. Patient is
                    diabetic, currently on Metformin 500 mg (reported by daughter from prescription).
                    No relieving factors reported. Red-flag escalation triggered for cardiac evaluation.
                  </p>
                </div>
                <div className="border-t border-ink-100 pt-4">
                  <p className="text-xs font-semibold text-ink-400 uppercase mb-2">Conflicts</p>
                  <div className="flex items-start gap-2 text-sm text-warning-700">
                    <MessageSquareWarning className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Severity discrepancy: patient reported 8/10, caregiver reported 9/10 with visible distress.</span>
                  </div>
                </div>
                <div className="border-t border-ink-100 pt-4">
                  <ProvenanceBadge reportedBy="AI draft" detail="requires physician approval" />
                </div>
              </div>
            </div>
          )}

          {/* Coding */}
          {section === 'coding' && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-1">{t('coding')}</h1>
              <p className="text-sm text-ink-400 mb-6">ICD-10 suggestions · AI-drafted, physician-approved</p>
              <div className="card-kiosk overflow-hidden max-w-2xl">
                <table className="w-full text-sm">
                  <thead className="bg-ink-50 text-ink-500 text-xs uppercase">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Code</th>
                      <th className="text-left px-4 py-3 font-semibold">Description</th>
                      <th className="text-left px-4 py-3 font-semibold">Confidence</th>
                      <th className="text-left px-4 py-3 font-semibold">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {CODING.map((c) => (
                      <tr key={c.code} className="hover:bg-ink-50">
                        <td className="px-4 py-3 font-mono font-semibold text-primary-700">{c.code}</td>
                        <td className="px-4 py-3 text-ink-700">{c.desc}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold ${c.confidence === 'High' ? 'text-success-600' : 'text-warning-600'}`}>{c.confidence}</span>
                        </td>
                        <td className="px-4 py-3 text-ink-500">{c.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Review */}
          {section === 'review' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-ink-900">{t('review')}</h1>
                  <p className="text-sm text-ink-400">Session #MK-2041 · Ramesh K., 54M</p>
                </div>
                <StatusBadge status={reviewStatus} label={statusLabel(reviewStatus)} />
              </div>

              {/* Review status flow */}
              <div className="card-kiosk p-4 mb-6 max-w-3xl">
                <div className="flex items-center gap-1 flex-wrap text-xs">
                  {(['draft', 'review', 'edited', 'clarification', 'rejected', 'approved', 'exported'] as ReviewStatus[]).map((s, i, arr) => (
                    <div key={s} className="flex items-center gap-1">
                      <span className={`px-2.5 py-1 rounded-full font-semibold ${
                        s === reviewStatus ? 'bg-primary-100 text-primary-700' : 'bg-ink-50 text-ink-400'
                      }`}>{statusLabel(s)}</span>
                      {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-ink-300" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-4xl mb-6">
                <div className="card-kiosk p-5 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-ink-900"><FileText className="w-4 h-4 text-primary-500" /> Documents</div>
                  <p className="text-sm text-ink-500">3 documents · OCR complete</p>
                </div>
                <div className="card-kiosk p-5 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-ink-900"><ListChecks className="w-4 h-4 text-primary-500" /> {t('clinicalFacts')}</div>
                  <p className="text-sm text-ink-500">6 facts · 1 conflict</p>
                </div>
                <div className="card-kiosk p-5 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-ink-900"><Code2 className="w-4 h-4 text-primary-500" /> {t('coding')}</div>
                  <p className="text-sm text-ink-500">3 ICD-10 suggestions</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setReviewStatus('clarification')}
                  className="flex items-center gap-2 rounded-lg bg-warning-50 text-warning-700 px-4 py-2.5 text-sm font-semibold hover:bg-warning-100 transition-colors"
                >
                  <MessageSquareWarning className="w-4 h-4" />
                  {t('requestClarification')}
                </button>
                <button
                  onClick={() => setReviewStatus('edited')}
                  className="flex items-center gap-2 rounded-lg bg-accent-50 text-accent-700 px-4 py-2.5 text-sm font-semibold hover:bg-accent-100 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  {t('editFact')}
                </button>
                <button
                  onClick={() => setReviewStatus('rejected')}
                  className="flex items-center gap-2 rounded-lg bg-danger-50 text-danger-700 px-4 py-2.5 text-sm font-semibold hover:bg-danger-100 transition-colors"
                >
                  ✕ {t('rejected')}
                </button>
                <button
                  onClick={() => setReviewStatus('approved')}
                  className="flex items-center gap-2 rounded-lg bg-success-50 text-success-700 px-4 py-2.5 text-sm font-semibold hover:bg-success-100 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t('approve')}
                </button>
                <button
                  onClick={() => reviewStatus === 'approved' ? setReviewStatus('exported') : undefined}
                  disabled={reviewStatus !== 'approved'}
                  className="flex items-center gap-2 rounded-lg bg-primary-500 text-white px-4 py-2.5 text-sm font-semibold hover:bg-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {t('exportRecord')}
                </button>
              </div>
              {reviewStatus !== 'approved' && reviewStatus !== 'exported' && (
                <p className="text-xs text-ink-400 mt-3">{t('exportReady')} — {t('approved')} required first.</p>
              )}
              {reviewStatus === 'exported' && (
                <p className="text-xs text-success-600 mt-3 font-semibold">✓ Record exported to EHR.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
