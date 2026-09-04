import { useState } from 'react';
import { Activity, ArrowLeft, BellRing, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { AlertCard } from '@/components/AlertCard';
import { StatusBadge } from '@/components/StatusBadge';
import type { Severity } from '@/components/AlertCard';

interface AlertItem {
  id: string;
  patientId: string;
  department: string;
  timestamp: string;
  redFlagInfo: string;
  severity: Severity;
  acknowledged: boolean;
  escalated: boolean;
}

const INITIAL_ALERTS: AlertItem[] = [
  { id: '1', patientId: 'Session #MK-2041', department: 'General Medicine', timestamp: '10:42 AM', redFlagInfo: 'Chest pain, radiating to left arm, severe', severity: 'critical', acknowledged: false, escalated: false },
  { id: '2', patientId: 'Session #MK-2038', department: 'General Medicine', timestamp: '10:35 AM', redFlagInfo: 'Shortness of breath, onset today', severity: 'high', acknowledged: false, escalated: false },
  { id: '3', patientId: 'Session #MK-2031', department: 'Ayurveda', timestamp: '10:18 AM', redFlagInfo: 'High fever > 103°F, 3 days', severity: 'high', acknowledged: true, escalated: false },
  { id: '4', patientId: 'Session #MK-2025', department: 'General Medicine', timestamp: '09:55 AM', redFlagInfo: 'Unexplained weight loss, 8kg in 2 weeks', severity: 'medium', acknowledged: true, escalated: true },
  { id: '5', patientId: 'Session #MK-2019', department: 'General Medicine', timestamp: '09:30 AM', redFlagInfo: 'Persistent vomiting, unable to keep fluids', severity: 'medium', acknowledged: false, escalated: false },
];

type Tab = 'high' | 'alerts' | 'acknowledged' | 'escalated';

export function NurseDashboard({ onExit }: { onExit: () => void }) {
  const { t } = useI18n();
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [tab, setTab] = useState<Tab>('high');

  const ack = (id: string) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true } : a));
  const esc = (id: string) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, escalated: true, acknowledged: true } : a));

  const filtered = alerts.filter((a) => {
    if (tab === 'high') return a.severity === 'critical' || a.severity === 'high';
    if (tab === 'alerts') return !a.acknowledged;
    if (tab === 'acknowledged') return a.acknowledged && !a.escalated;
    if (tab === 'escalated') return a.escalated;
    return true;
  });

  const counts = {
    high: alerts.filter((a) => a.severity === 'critical' || a.severity === 'high').length,
    alerts: alerts.filter((a) => !a.acknowledged).length,
    acknowledged: alerts.filter((a) => a.acknowledged && !a.escalated).length,
    escalated: alerts.filter((a) => a.escalated).length,
  };

  const tabs: { key: Tab; label: string; count: number; icon: typeof Activity }[] = [
    { key: 'high', label: t('highPriority'), count: counts.high, icon: BellRing },
    { key: 'alerts', label: t('alerts'), count: counts.alerts, icon: Activity },
    { key: 'acknowledged', label: t('acknowledged'), count: counts.acknowledged, icon: CheckCircle2 },
    { key: 'escalated', label: t('escalated'), count: counts.escalated, icon: ArrowUpRight },
  ];

  const severityLabel = (s: Severity) => s === 'critical' ? 'Critical' : s === 'high' ? 'High' : s === 'medium' ? 'Medium' : 'Low';

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
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-900">MediKiosk · Nurse Station</p>
              <p className="text-xs text-ink-400">Triage Dashboard · General Medicine</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status="active" label={t('online')} />
          <span className="text-sm text-ink-500">Nurse: Priya S.</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <nav className="w-48 bg-white border-r border-ink-200 p-3 shrink-0">
          <p className="text-xs font-bold text-ink-400 uppercase tracking-wide px-2 mb-2">Triage</p>
          {tabs.map((tabItem) => {
            const Icon = tabItem.icon;
            return (
              <button
                key={tabItem.key}
                onClick={() => setTab(tabItem.key)}
                className={`staff-nav-link w-full justify-between ${tab === tabItem.key ? 'staff-nav-link-active' : ''}`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  {tabItem.label}
                </span>
                <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                  tabItem.count > 0 ? 'bg-danger-100 text-danger-700' : 'bg-ink-100 text-ink-400'
                }`}>{tabItem.count}</span>
              </button>
            );
          })}
        </nav>

        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-ink-900 mb-1">
            {tabs.find((x) => x.key === tab)?.label}
          </h1>
          <p className="text-sm text-ink-400 mb-6">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</p>
          <div className="space-y-3 max-w-4xl">
            {filtered.length === 0 ? (
              <div className="card-kiosk p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-success-400 mx-auto mb-3" />
                <p className="text-lg font-semibold text-ink-500">No alerts in this view.</p>
              </div>
            ) : (
              filtered.map((a) => (
                <AlertCard
                  key={a.id}
                  patientId={a.patientId}
                  department={a.department}
                  timestamp={a.timestamp}
                  redFlagInfo={a.redFlagInfo}
                  severity={a.severity}
                  severityLabel={severityLabel(a.severity)}
                  departmentLabel={t('department')}
                  timestampLabel={t('timestamp')}
                  redFlagLabel={t('redFlagInfo')}
                  onAcknowledge={() => ack(a.id)}
                  onEscalate={() => esc(a.id)}
                  acknowledgeLabel={t('acknowledge')}
                  escalateLabel={t('escalate')}
                  acknowledged={a.acknowledged}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
