import { useState } from 'react';
import {
  LayoutDashboard, Monitor, Users, Building2, ShieldCheck, Lock,
  ScrollText, FileCheck, Plug, ArrowLeft, ToggleLeft, ToggleRight,
  Smartphone, Activity, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { StatusBadge } from '@/components/StatusBadge';

type AdminSection =
  | 'overview' | 'devices' | 'users' | 'departments'
  | 'governance' | 'security' | 'audit' | 'consent' | 'integrations';

export function AdminDashboard({ onExit }: { onExit: () => void }) {
  const { t } = useI18n();
  const [section, setSection] = useState<AdminSection>('overview');
  const [govEnabled, setGovEnabled] = useState(true);
  const [secEnabled, setSecEnabled] = useState(true);

  const nav: { key: AdminSection; label: string; icon: typeof LayoutDashboard; gated?: boolean }[] = [
    { key: 'overview', label: t('overview'), icon: LayoutDashboard },
    { key: 'devices', label: t('devices'), icon: Monitor },
    { key: 'users', label: t('users'), icon: Users },
    { key: 'departments', label: t('departments'), icon: Building2 },
    { key: 'governance', label: t('governance'), icon: ShieldCheck, gated: !govEnabled },
    { key: 'security', label: t('security'), icon: Lock, gated: !secEnabled },
    { key: 'audit', label: t('audit'), icon: ScrollText },
    { key: 'consent', label: t('consent'), icon: FileCheck },
    { key: 'integrations', label: t('integrations'), icon: Plug },
  ];

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <header className="bg-white border-b border-ink-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-primary-600">
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>
          <span className="text-ink-200">|</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-ink-800 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-900">MediKiosk · Admin Console</p>
              <p className="text-xs text-ink-400">Enterprise Administration · Tenant: Apollo Hospital, Chennai</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status="online" label={t('online')} />
          <span className="text-sm text-ink-500">Admin: Suresh M.</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <nav className="w-48 bg-white border-r border-ink-200 p-3 shrink-0 overflow-y-auto">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => !item.gated && setSection(item.key)}
                disabled={item.gated}
                className={`staff-nav-link w-full ${section === item.key ? 'staff-nav-link-active' : ''} ${item.gated ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {item.gated && <Lock className="w-3 h-3 ml-auto text-ink-300" />}
              </button>
            );
          })}
        </nav>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Overview */}
          {section === 'overview' && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-6">{t('overview')}</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: t('totalPatients'), value: '12,847', color: 'text-primary-600' },
                  { label: t('onlineDevices'), value: '34 / 40', color: 'text-success-600' },
                  { label: t('registeredUsers'), value: '186', color: 'text-primary-600' },
                  { label: t('activeDepartments'), value: '6', color: 'text-primary-600' },
                  { label: t('redFlags'), value: '23', color: 'text-danger-600' },
                  { label: t('pendingReview'), value: '47', color: 'text-warning-600' },
                  { label: t('auditEvents'), value: '1,204', color: 'text-ink-600' },
                  { label: t('consentRate'), value: '98.2%', color: 'text-success-600' },
                ].map((s) => (
                  <div key={s.label} className="card-kiosk p-5">
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-sm text-ink-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="card-kiosk p-5">
                  <h2 className="text-lg font-bold text-ink-900 mb-4">Module Toggles</h2>
                  <div className="space-y-3">
                    <button onClick={() => setGovEnabled(!govEnabled)} className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-ink-50">
                      <span className="flex items-center gap-2 text-sm font-medium text-ink-700">
                        <ShieldCheck className="w-4 h-4 text-primary-500" />
                        {t('governance')}
                      </span>
                      {govEnabled ? <ToggleRight className="w-8 h-8 text-success-500" /> : <ToggleLeft className="w-8 h-8 text-ink-300" />}
                    </button>
                    <button onClick={() => setSecEnabled(!secEnabled)} className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-ink-50">
                      <span className="flex items-center gap-2 text-sm font-medium text-ink-700">
                        <Lock className="w-4 h-4 text-primary-500" />
                        {t('security')}
                      </span>
                      {secEnabled ? <ToggleRight className="w-8 h-8 text-success-500" /> : <ToggleLeft className="w-8 h-8 text-ink-300" />}
                    </button>
                  </div>
                </div>
                <div className="card-kiosk p-5">
                  <h2 className="text-lg font-bold text-ink-900 mb-4">System Health</h2>
                  <div className="space-y-2">
                    {[
                      { svc: 'Kiosk Client', st: 'online', pct: '100%' },
                      { svc: 'Protocol Engine', st: 'online', pct: '99.9%' },
                      { svc: 'Document OCR', st: 'online', pct: '97.2%' },
                      { svc: 'ABDM Gateway', st: 'offline', pct: '—' },
                    ].map((s) => (
                      <div key={s.svc} className="flex items-center justify-between text-sm">
                        <span className="text-ink-600">{s.svc}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-ink-400">{s.pct}</span>
                          <StatusBadge status={s.st as 'online' | 'offline'} label={s.st === 'online' ? t('online') : t('offline')} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Devices */}
          {section === 'devices' && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-6">{t('devices')}</h1>
              <div className="card-kiosk overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Device ID</th>
                      <th className="text-left px-4 py-3 font-semibold">Location</th>
                      <th className="text-left px-4 py-3 font-semibold">{t('version')}</th>
                      <th className="text-left px-4 py-3 font-semibold">Last seen</th>
                      <th className="text-left px-4 py-3 font-semibold">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {[
                      { id: 'KSK-001', loc: 'OPD Block A, Ground Floor', ver: '1.0.4', seen: '2 min ago', st: 'online' },
                      { id: 'KSK-002', loc: 'OPD Block A, First Floor', ver: '1.0.4', seen: '5 min ago', st: 'online' },
                      { id: 'KSK-003', loc: 'Ayurveda Wing, Reception', ver: '1.0.3', seen: '1 hour ago', st: 'offline' },
                      { id: 'KSK-004', loc: 'Emergency, Waiting Area', ver: '1.0.4', seen: '1 min ago', st: 'online' },
                      { id: 'KSK-005', loc: 'OPD Block B, Ground Floor', ver: '1.0.4', seen: '3 min ago', st: 'online' },
                    ].map((d) => (
                      <tr key={d.id} className="hover:bg-ink-50">
                        <td className="px-4 py-3 font-mono font-semibold text-ink-700"><Smartphone className="w-3.5 h-3.5 inline mr-1.5 text-ink-400" />{d.id}</td>
                        <td className="px-4 py-3 text-ink-600">{d.loc}</td>
                        <td className="px-4 py-3 text-ink-500 font-mono">{d.ver}</td>
                        <td className="px-4 py-3 text-ink-500">{d.seen}</td>
                        <td className="px-4 py-3"><StatusBadge status={d.st as 'online' | 'offline'} label={d.st === 'online' ? t('online') : t('offline')} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users */}
          {section === 'users' && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-6">{t('users')}</h1>
              <div className="card-kiosk overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Name</th>
                      <th className="text-left px-4 py-3 font-semibold">Role</th>
                      <th className="text-left px-4 py-3 font-semibold">{t('department')}</th>
                      <th className="text-left px-4 py-3 font-semibold">Last active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {[
                      { name: 'Dr. R. Mehta', role: 'Physician', dept: 'General Medicine', active: '10 min ago' },
                      { name: 'Dr. K. Anand', role: 'Physician', dept: 'Ayurveda', active: '1 hour ago' },
                      { name: 'Priya S.', role: 'Nurse', dept: 'General Medicine', active: '2 min ago' },
                      { name: 'Lakshmi R.', role: 'Nurse', dept: 'Emergency', active: '15 min ago' },
                      { name: 'Suresh M.', role: 'Admin', dept: 'Administration', active: 'now' },
                    ].map((u) => (
                      <tr key={u.name} className="hover:bg-ink-50">
                        <td className="px-4 py-3 font-semibold text-ink-800">{u.name}</td>
                        <td className="px-4 py-3 text-ink-600">{u.role}</td>
                        <td className="px-4 py-3 text-ink-500">{u.dept}</td>
                        <td className="px-4 py-3 text-ink-500">{u.active}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Departments */}
          {section === 'departments' && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-6">{t('departments')}</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[
                  { name: 'General Medicine', kiosks: 4, sessions: 1842, staff: 12 },
                  { name: 'Ayurveda', kiosks: 2, sessions: 318, staff: 5 },
                  { name: 'Emergency', kiosks: 1, sessions: 421, staff: 8 },
                  { name: 'Pediatrics', kiosks: 2, sessions: 267, staff: 6 },
                ].map((d) => (
                  <div key={d.name} className="card-kiosk p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-lg font-bold text-ink-900">{d.name}</p>
                      <StatusBadge status="active" label={t('online')} />
                    </div>
                    <div className="flex gap-6 text-sm text-ink-500">
                      <span><Activity className="w-3.5 h-3.5 inline mr-1" />{d.kiosks} kiosks</span>
                      <span>{d.sessions} sessions</span>
                      <span>{d.staff} staff</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Governance */}
          {section === 'governance' && govEnabled && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-6">{t('governance')}</h1>
              <div className="space-y-4 max-w-2xl">
                <div className="card-kiosk p-5">
                  <h2 className="text-sm font-bold text-ink-900 mb-3">Clinical Governance Policies</h2>
                  <div className="space-y-2 text-sm">
                    {[
                      { policy: 'Physician approval required before export', st: 'Enforced' },
                      { policy: 'Caregiver cannot consent on behalf of patient', st: 'Enforced' },
                      { policy: 'Red-flag escalation within 60 seconds', st: 'Enforced' },
                      { policy: 'ABDM consent separated from internal consent', st: 'Enforced' },
                      { policy: 'No autonomous diagnosis code assignment', st: 'Enforced' },
                    ].map((p) => (
                      <div key={p.policy} className="flex items-center justify-between py-2 border-b border-ink-50 last:border-0">
                        <span className="text-ink-700">{p.policy}</span>
                        <span className="text-xs font-semibold text-success-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{p.st}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card-kiosk p-5">
                  <h2 className="text-sm font-bold text-ink-900 mb-3">Data Retention</h2>
                  <div className="text-sm text-ink-600 space-y-1">
                    <p>Session audio: <span className="font-semibold text-ink-800">90 days</span> (encrypted)</p>
                    <p>Clinical facts: <span className="font-semibold text-ink-800">7 years</span> (per medical records law)</p>
                    <p>Audit logs: <span className="font-semibold text-ink-800">7 years</span></p>
                    <p>Document originals: <span className="font-semibold text-ink-800">5 years</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {section === 'security' && secEnabled && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-6">{t('security')}</h1>
              <div className="space-y-4 max-w-2xl">
                <div className="card-kiosk p-5">
                  <h2 className="text-sm font-bold text-ink-900 mb-3">Access Control</h2>
                  <div className="space-y-2 text-sm">
                    {[
                      { item: 'RLS enabled on all tables', st: true },
                      { item: 'Row-level policies per role', st: true },
                      { item: 'PHI excluded from frontend analytics', st: true },
                      { item: 'No raw Aadhaar stored', st: true },
                      { item: 'Server-side authorization enforced', st: true },
                      { item: 'JWT verification on all API routes', st: true },
                    ].map((s) => (
                      <div key={s.item} className="flex items-center justify-between py-2 border-b border-ink-50 last:border-0">
                        <span className="text-ink-700">{s.item}</span>
                        <span className={`text-xs font-semibold flex items-center gap-1 ${s.st ? 'text-success-600' : 'text-danger-600'}`}>
                          {s.st ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                          {s.st ? 'Pass' : 'Fail'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card-kiosk p-5">
                  <h2 className="text-sm font-bold text-ink-900 mb-3">Role Scopes</h2>
                  <div className="text-sm text-ink-600 space-y-2">
                    <p><span className="font-semibold text-ink-800">Patient:</span> Own session only</p>
                    <p><span className="font-semibold text-ink-800">Nurse:</span> Own department red-flag queue</p>
                    <p><span className="font-semibold text-ink-800">Physician:</span> Assigned department/session scope</p>
                    <p><span className="font-semibold text-ink-800">Admin:</span> Own tenant (no clinical record edits)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audit */}
          {section === 'audit' && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-6">{t('audit')}</h1>
              <div className="card-kiosk overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Timestamp</th>
                      <th className="text-left px-4 py-3 font-semibold">Actor</th>
                      <th className="text-left px-4 py-3 font-semibold">Action</th>
                      <th className="text-left px-4 py-3 font-semibold">Resource</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {[
                      { ts: '10:55:42', actor: 'Dr. R. Mehta', action: 'APPROVED case', res: 'MK-2031' },
                      { ts: '10:48:15', actor: 'Nurse: Priya S.', action: 'ACKNOWLEDGED alert', res: 'MK-2041' },
                      { ts: '10:47:03', actor: 'System', action: 'RED-FLAG triggered', res: 'MK-2041' },
                      { ts: '10:42:18', actor: 'Patient (kiosk)', action: 'CONSENT granted', res: 'MK-2041' },
                      { ts: '10:38:55', actor: 'System', action: 'OCR processed document', res: 'MK-2038' },
                      { ts: '10:35:10', actor: 'Admin: Suresh M.', action: 'DEVICE config updated', res: 'KSK-003' },
                      { ts: '10:30:00', actor: 'System', action: 'SESSION started', res: 'MK-2041' },
                    ].map((a, i) => (
                      <tr key={i} className="hover:bg-ink-50">
                        <td className="px-4 py-3 font-mono text-ink-400">{a.ts}</td>
                        <td className="px-4 py-3 text-ink-700">{a.actor}</td>
                        <td className="px-4 py-3 font-medium text-ink-800">{a.action}</td>
                        <td className="px-4 py-3 font-mono text-ink-500">{a.res}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Consent */}
          {section === 'consent' && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-6">{t('consent')}</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-3xl">
                <div className="card-kiosk p-5">
                  <h2 className="text-sm font-bold text-ink-900 mb-3">Internal MediKiosk Consent</h2>
                  <div className="text-sm text-ink-600 space-y-2">
                    <p>Granted: <span className="font-bold text-success-600">12,617</span> (98.2%)</p>
                    <p>Declined: <span className="font-bold text-danger-600">230</span> (1.8%)</p>
                    <p>Revoked: <span className="font-bold text-ink-500">14</span></p>
                  </div>
                </div>
                <div className="card-kiosk p-5">
                  <h2 className="text-sm font-bold text-ink-900 mb-3">ABDM Network Consent</h2>
                  <div className="text-sm text-ink-600 space-y-2">
                    <p>Linked via ABHA: <span className="font-bold text-primary-600">8,412</span></p>
                    <p>Pending ABDM link: <span className="font-bold text-warning-600">4,205</span></p>
                    <p className="text-xs text-ink-400 mt-2">ABDM consent is architecturally separate from internal consent.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {section === 'integrations' && (
            <div>
              <h1 className="text-2xl font-bold text-ink-900 mb-6">{t('integrations')}</h1>
              <div className="space-y-3 max-w-2xl">
                {[
                  { name: 'ABDM (Ayushman Bharat Digital Mission)', st: 'configured', desc: 'ABHA scan + consent link' },
                  { name: 'EHR Export (HL7 FHIR)', st: 'configured', desc: 'Approved records export to hospital EHR' },
                  { name: 'Speech-to-Text (ASR)', st: 'configured', desc: 'Multilingual voice recognition' },
                  { name: 'Document OCR', st: 'configured', desc: 'Prescription & report text extraction' },
                  { name: 'SMS Gateway', st: 'offline', desc: 'Session completion notifications' },
                ].map((i) => (
                  <div key={i.name} className="card-kiosk p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-ink-800">{i.name}</p>
                      <p className="text-xs text-ink-500 mt-0.5">{i.desc}</p>
                    </div>
                    <StatusBadge status={i.st === 'configured' ? 'online' : 'offline'} label={i.st === 'configured' ? 'Configured' : 'Not configured'} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
