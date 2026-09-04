import { useState } from 'react';
import { I18nProvider } from '@/i18n/I18nContext';
import { PatientFlow } from '@/flows/patient/PatientFlow';
import { NurseDashboard } from '@/flows/nurse/NurseDashboard';
import { PhysicianDashboard } from '@/flows/physician/PhysicianDashboard';
import { AdminDashboard } from '@/flows/admin/AdminDashboard';
import { Monitor, Stethoscope, Activity, ShieldCheck, ArrowRight } from 'lucide-react';

type Workspace = 'launcher' | 'patient' | 'nurse' | 'physician' | 'admin';

function Launcher({ onSelect }: { onSelect: (w: Workspace) => void }) {
  const roles: { key: Workspace; label: string; desc: string; icon: typeof Monitor; color: string }[] = [
    { key: 'patient', label: 'Patient Kiosk', desc: 'Touchscreen kiosk for patient case-taking', icon: Monitor, color: 'bg-primary-500' },
    { key: 'nurse', label: 'Nurse Station', desc: 'Triage alerts & red-flag escalation', icon: Activity, color: 'bg-danger-500' },
    { key: 'physician', label: 'Physician', desc: 'Clinical review workspace', icon: Stethoscope, color: 'bg-success-500' },
    { key: 'admin', label: 'Admin Console', desc: 'Enterprise administration', icon: ShieldCheck, color: 'bg-ink-800' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-ink-50 flex flex-col items-center justify-center p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-500 text-white shadow-kiosk">
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5a7 7 0 0 0-7 7c0 5 7 8 7 8s7-3 7-8a7 7 0 0 0-7-7z" fill="currentColor" opacity="0.3" />
            <path d="M12 9v6M9 12h6" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-primary-800">MediKiosk</h1>
      </div>
      <p className="text-lg text-ink-400 mb-12">Select a workspace to continue</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {roles.map((r) => {
          const Icon = r.icon;
          return (
            <button
              key={r.key}
              onClick={() => onSelect(r.key)}
              className="card-kiosk p-8 flex items-start gap-4 text-left transition-all duration-200 hover:shadow-kiosk hover:border-primary-300 active:scale-[0.98] group"
            >
              <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${r.color} text-white shrink-0`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <p className="text-xl font-bold text-ink-900">{r.label}</p>
                <p className="text-sm text-ink-500 mt-1">{r.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-ink-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all shrink-0" />
            </button>
          );
        })}
      </div>

      <p className="text-sm text-ink-300 mt-12 max-w-md text-center">
        MediKiosk is a hospital kiosk patient case-taking platform for Indian OPDs.
        Role-based access is enforced server-side. Route visibility is presentation only.
      </p>
    </div>
  );
}

function AppInner() {
  const [workspace, setWorkspace] = useState<Workspace>('launcher');

  if (workspace === 'launcher') return <Launcher onSelect={setWorkspace} />;
  if (workspace === 'patient') return <PatientFlow onExit={() => setWorkspace('launcher')} />;
  if (workspace === 'nurse') return <NurseDashboard onExit={() => setWorkspace('launcher')} />;
  if (workspace === 'physician') return <PhysicianDashboard onExit={() => setWorkspace('launcher')} />;
  if (workspace === 'admin') return <AdminDashboard onExit={() => setWorkspace('launcher')} />;
  return <Launcher onSelect={setWorkspace} />;
}

export default function App() {
  return (
    <I18nProvider>
      <AppInner />
    </I18nProvider>
  );
}
