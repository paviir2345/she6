import { useState, useCallback, useRef } from 'react';
import {
  ArrowLeft, Upload, FileText, ScanLine, CheckCircle2, Loader2,
  Pill, Calendar, User, Stethoscope, FlaskConical, AlertCircle, X,
  FileUp, Sparkles,
} from 'lucide-react';

interface ExtractedField {
  label: string;
  value: string;
  icon: typeof Pill;
}

interface OCRResult {
  documentType: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  medications: string[];
  labValues: { test: string; result: string; range: string }[];
  notes: string;
}

const STATIC_RESULT: OCRResult = {
  documentType: 'Blood Test Report',
  patientName: 'Ramesh Kumar',
  patientAge: '54',
  patientGender: 'Male',
  date: '15-Aug-2026',
  doctorName: 'Dr. Anjali Sharma, MBBS MD',
  diagnosis: 'Type 2 Diabetes Mellitus · Hypertension',
  medications: [
    'Metformin 500mg — twice daily',
    'Glimepiride 2mg — once daily (morning)',
    'Telmisartan 40mg — once daily',
    'Atorvastatin 10mg — at bedtime',
  ],
  labValues: [
    { test: 'Fasting Blood Glucose', result: '142 mg/dL', range: '70-100' },
    { test: 'HbA1c', result: '8.2%', range: '<5.7' },
    { test: 'Total Cholesterol', result: '218 mg/dL', range: '<200' },
    { test: 'LDL Cholesterol', result: '148 mg/dL', range: '<100' },
    { test: 'Serum Creatinine', result: '1.1 mg/dL', range: '0.6-1.2' },
    { test: 'TSH', result: '3.4 µIU/mL', range: '0.4-4.0' },
  ],
  notes: 'Patient advised dietary modification and regular exercise. Follow-up review scheduled after 6 weeks. Continue current medication regimen.',
};

type Stage = 'idle' | 'preview' | 'scanning' | 'done';

export function OCRFlow({ onExit }: { onExit: () => void }) {
  const [stage, setStage] = useState<Stage>('idle');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    setStage('preview');
  }, []);

  const startScan = useCallback(() => {
    setStage('scanning');
    setTimeout(() => setStage('done'), 2600);
  }, []);

  const reset = useCallback(() => {
    setStage('idle');
    setFileName('');
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-50 via-primary-50/30 to-ink-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-ink-100 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-base font-semibold text-ink-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
            Back
          </button>
          <div className="flex items-center gap-3 ml-2">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-card">
              <ScanLine className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-bold text-primary-800 leading-tight">MediScan OCR</p>
              <p className="text-xs text-ink-400">Document Intelligence</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        {stage === 'idle' && (
          <UploadZone
            dragOver={dragOver}
            setDragOver={setDragOver}
            onFile={handleFile}
            inputRef={inputRef}
          />
        )}

        {stage === 'preview' && (
          <PreviewZone fileName={fileName} onScan={startScan} onReset={reset} />
        )}

        {stage === 'scanning' && <ScanningZone fileName={fileName} />}

        {stage === 'done' && <ResultView result={STATIC_RESULT} onReset={reset} />}
      </main>

      <footer className="px-6 py-3 text-center text-sm text-ink-300 shrink-0 border-t border-ink-100/50">
        MediKiosk · OCR Document Intelligence · v1.0
      </footer>
    </div>
  );
}

// ─── Upload Zone ──────────────────────────────────────────

function UploadZone({
  dragOver, setDragOver, onFile, inputRef,
}: {
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  onFile: (f: File) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center animate-fade-in">
      <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-100 text-primary-600 mb-6">
        <FileUp className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold text-ink-900 mb-2">Upload a Medical Document</h1>
      <p className="text-lg text-ink-500 mb-8 text-center max-w-md">
        Drag and drop a prescription, lab report, or discharge paper. The AI will extract the key details for you.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`w-full rounded-3xl border-2 border-dashed p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-primary-500 bg-primary-50 scale-[1.02]'
            : 'border-ink-200 bg-white hover:border-primary-300 hover:bg-primary-50/30'
        }`}
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-500">
          <Upload className="w-8 h-8" />
        </div>
        <p className="text-xl font-semibold text-ink-700">
          {dragOver ? 'Drop your file here' : 'Click to browse or drag a file'}
        </p>
        <p className="text-sm text-ink-400">Supports JPG, PNG, PDF · up to 10 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) onFile(e.target.files[0]); }}
        />
      </div>

      <div className="flex items-center gap-6 mt-8 text-sm text-ink-400">
        <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> Prescriptions</span>
        <span className="flex items-center gap-1.5"><FlaskConical className="w-4 h-4" /> Lab Reports</span>
        <span className="flex items-center gap-1.5"><Stethoscope className="w-4 h-4" /> Discharge Papers</span>
      </div>
    </div>
  );
}

// ─── Preview Zone ─────────────────────────────────────────

function PreviewZone({ fileName, onScan, onReset }: { fileName: string; onScan: () => void; onReset: () => void }) {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center animate-fade-in">
      <h1 className="text-3xl font-bold text-ink-900 mb-2">Ready to Scan</h1>
      <p className="text-lg text-ink-500 mb-8">Review your file, then start the AI extraction.</p>

      <div className="w-full card-kiosk p-8 flex items-center gap-5 mb-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 shrink-0">
          <FileText className="w-8 h-8" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-ink-800 truncate">{fileName}</p>
          <p className="text-sm text-ink-400">Document ready for OCR processing</p>
        </div>
        <button
          onClick={onReset}
          className="p-2 rounded-lg text-ink-400 hover:text-danger-500 hover:bg-danger-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={onScan}
        className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-700 text-white px-10 py-5 text-xl font-bold shadow-kiosk hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
      >
        <Sparkles className="w-7 h-7" />
        Extract with AI
      </button>
    </div>
  );
}

// ─── Scanning Zone ────────────────────────────────────────

function ScanningZone({ fileName }: { fileName: string }) {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center animate-fade-in">
      <div className="relative w-40 h-40 mb-8">
        <div className="absolute inset-0 rounded-3xl bg-primary-100 animate-pulse-soft" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <ScanLine className="w-8 h-8 text-primary-400 animate-bounce" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-ink-900 mb-2">Scanning Document</h1>
      <p className="text-lg text-ink-500 mb-8 text-center">
        AI is reading <span className="font-semibold text-primary-600">{fileName}</span>
      </p>

      <div className="w-full max-w-md space-y-3">
        {[
          'Detecting document type…',
          'Extracting patient details…',
          'Reading medications & dosages…',
          'Parsing lab values…',
          'Structuring clinical summary…',
        ].map((step, i) => (
          <div
            key={step}
            className="flex items-center gap-3 animate-slide-up"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            <div className="w-6 h-6 rounded-full border-2 border-primary-200 border-t-primary-500 animate-spin shrink-0" />
            <span className="text-base text-ink-600">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Result View ──────────────────────────────────────────

function ResultView({ result, onReset }: { result: OCRResult; onReset: () => void }) {
  const fields: ExtractedField[] = [
    { label: 'Patient Name', value: result.patientName, icon: User },
    { label: 'Age / Gender', value: `${result.patientAge} yrs · ${result.patientGender}`, icon: User },
    { label: 'Date', value: result.date, icon: Calendar },
    { label: 'Doctor', value: result.doctorName, icon: Stethoscope },
  ];

  return (
    <div className="w-full max-w-3xl flex flex-col animate-fade-in">
      {/* Success banner */}
      <div className="flex items-center gap-3 mb-6 card-kiosk p-5 bg-success-50 border-success-200">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-success-100 text-success-600 shrink-0">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <p className="text-xl font-bold text-success-700">Extraction Complete</p>
          <p className="text-sm text-success-600">{result.documentType} · processed successfully</p>
        </div>
      </div>

      {/* Patient info grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {fields.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="card-kiosk p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-semibold text-ink-400 uppercase tracking-wide">{f.label}</span>
              </div>
              <p className="text-base font-bold text-ink-800">{f.value}</p>
            </div>
          );
        })}
      </div>

      {/* Diagnosis */}
      <div className="card-kiosk p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-warning-500" />
          <h3 className="text-lg font-bold text-ink-800">Diagnosis</h3>
        </div>
        <p className="text-base text-ink-700">{result.diagnosis}</p>
      </div>

      {/* Medications */}
      <div className="card-kiosk p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-bold text-ink-800">Medications</h3>
        </div>
        <div className="space-y-3">
          {result.medications.map((med, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-primary-50/50 px-4 py-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-600 text-sm font-bold shrink-0">
                {i + 1}
              </span>
              <span className="text-base text-ink-700">{med}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lab Values */}
      <div className="card-kiosk p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="w-5 h-5 text-accent-500" />
          <h3 className="text-lg font-bold text-ink-800">Lab Values</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-ink-100">
                <th className="text-left py-3 px-2 font-semibold text-ink-500 text-sm">Test</th>
                <th className="text-left py-3 px-2 font-semibold text-ink-500 text-sm">Result</th>
                <th className="text-left py-3 px-2 font-semibold text-ink-500 text-sm">Reference Range</th>
              </tr>
            </thead>
            <tbody>
              {result.labValues.map((lv, i) => {
                const outOfRange = lv.test === 'Fasting Blood Glucose' || lv.test === 'HbA1c' || lv.test === 'Total Cholesterol' || lv.test === 'LDL Cholesterol';
                return (
                  <tr key={i} className="border-b border-ink-50 last:border-0">
                    <td className="py-3 px-2 text-ink-700 font-medium">{lv.test}</td>
                    <td className={`py-3 px-2 font-bold ${outOfRange ? 'text-danger-600' : 'text-success-600'}`}>
                      {lv.result}
                    </td>
                    <td className="py-3 px-2 text-ink-400">{lv.range}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div className="card-kiosk p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-ink-400" />
          <h3 className="text-lg font-bold text-ink-800">Clinical Notes</h3>
        </div>
        <p className="text-base text-ink-600 leading-relaxed">{result.notes}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 rounded-2xl bg-white text-primary-700 border-2 border-primary-200 px-8 py-4 text-lg font-semibold hover:border-primary-400 hover:bg-primary-50 transition-all"
        >
          <Upload className="w-5 h-5" />
          Scan Another Document
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary-500 text-white px-8 py-4 text-lg font-bold shadow-kiosk hover:bg-primary-600 transition-all"
        >
          <CheckCircle2 className="w-5 h-5" />
          Done
        </button>
      </div>
    </div>
  );
}
