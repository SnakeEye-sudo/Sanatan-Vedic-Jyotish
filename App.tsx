import React, { useState, useRef } from 'react';
import { Layout } from './components/Layout';
import { NorthIndianChart } from './components/NorthIndianChart';
import { AppView, Language, UserDetails, KundaliData, MilanData, NumerologyData, PalmistryResult, RashifalData } from './types';
import { TRANSLATIONS, SIGNS } from './utils/translations';
import { generateKundali, calculateMilan, calculateNumerology, analyzeBiometricImage, calculateDailyRashifal } from './utils/astrologyLogic';
import { generatePDF } from './utils/pdfGenerator';
import { Calendar, Heart, Hash, ArrowLeft, Download, Sparkles, Gem, AlertTriangle, ScrollText, ScanLine, Camera, Upload, Fingerprint, Eye, Sun, Home } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.ENGLISH);
  const [view, setView] = useState<AppView>(AppView.LANGUAGE_SELECT);
  const [activeTab, setActiveTab] = useState<'chart'|'houses'|'planets'|'dosha'|'remedy'>('chart');
  
  // Data States
  const [kundaliForm, setKundaliForm] = useState<UserDetails>({
    name: 'User', day: 15, month: 6, year: 1995, hour: 14, minute: 30, location: 'Varanasi', gender: 'male'
  });
  const [kundaliResult, setKundaliResult] = useState<KundaliData | null>(null);
  
  const [milanBoy, setMilanBoy] = useState<UserDetails>({
    name: 'Groom', day: 1, month: 1, year: 1995, hour: 12, minute: 0, location: 'Delhi', gender: 'male'
  });
  const [milanGirl, setMilanGirl] = useState<UserDetails>({
    name: 'Bride', day: 1, month: 1, year: 1998, hour: 12, minute: 0, location: 'Mumbai', gender: 'female'
  });
  const [milanResult, setMilanResult] = useState<MilanData | null>(null);
  
  const [numerologyForm, setNumerologyForm] = useState<{name: string, d: number, m: number, y: number}>({
    name: '', d: 1, m: 1, y: 2000
  });
  const [numerologyResult, setNumerologyResult] = useState<NumerologyData | null>(null);

  // Palmistry States
  const [palmistryType, setPalmistryType] = useState<'palm' | 'face'>('palm');
  const [palmistryImage, setPalmistryImage] = useState<File | null>(null);
  const [palmistryScanning, setPalmistryScanning] = useState(false);
  const [palmistryResult, setPalmistryResult] = useState<PalmistryResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rashifal State
  const [selectedRashi, setSelectedRashi] = useState<number>(0);
  const [rashifalResult, setRashifalResult] = useState<RashifalData | null>(null);

  const t = TRANSLATIONS[lang];

  // --- HANDLERS ---
  const handlePalmistryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPalmistryImage(file);
      setPalmistryScanning(true);
      // Pass lang to the analysis function
      const result = await analyzeBiometricImage(file, palmistryType, lang);
      setPalmistryResult(result);
      setPalmistryScanning(false);
    }
  };

  // Helper Inputs
  const DateInput = ({ label, d, m, y, setD, setM, setY }: any) => (
    <div className="space-y-1">
      <label className="text-xs font-bold text-saffron-800 uppercase tracking-wider">{label}</label>
      <div className="flex space-x-2">
        <input type="number" value={d} onChange={e => setD(parseInt(e.target.value))} placeholder="DD" className="w-1/3 p-3 bg-white border border-gold-200 rounded-lg focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all shadow-sm" min={1} max={31} />
        <input type="number" value={m} onChange={e => setM(parseInt(e.target.value))} placeholder="MM" className="w-1/3 p-3 bg-white border border-gold-200 rounded-lg focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all shadow-sm" min={1} max={12} />
        <input type="number" value={y} onChange={e => setY(parseInt(e.target.value))} placeholder="YYYY" className="w-1/3 p-3 bg-white border border-gold-200 rounded-lg focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all shadow-sm" />
      </div>
    </div>
  );

  const TimeInput = ({ h, m, setH, setM }: any) => (
    <div className="space-y-1">
      <label className="text-xs font-bold text-saffron-800 uppercase tracking-wider">{t.tob}</label>
      <div className="flex space-x-2">
        <input type="number" value={h} onChange={e => setH(parseInt(e.target.value))} placeholder="HH" className="w-1/2 p-3 bg-white border border-gold-200 rounded-lg focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all shadow-sm" min={0} max={23} />
        <input type="number" value={m} onChange={e => setM(parseInt(e.target.value))} placeholder="MM" className="w-1/2 p-3 bg-white border border-gold-200 rounded-lg focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all shadow-sm" min={0} max={59} />
      </div>
    </div>
  );

  // --- VIEW: LANGUAGE SELECT ---
  if (view === AppView.LANGUAGE_SELECT) {
    return (
      <div className="min-h-screen bg-saffron-50 flex items-center justify-center p-4 bg-mandala">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gold-400 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-saffron-500 to-gold-400"></div>
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-saffron-100 rounded-full flex items-center justify-center text-saffron-600 border-2 border-saffron-500 animate-spin-slow">
              <Sparkles size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">Sanatan Vedic Jyotish</h1>
              <p className="text-gray-500 mt-2">Premium Offline Astrology Suite</p>
            </div>
            <div className="space-y-3">
              {[
                { code: Language.ENGLISH, label: "English" },
                { code: Language.HINDI, label: "हिंदी (Hindi)" },
                { code: Language.SANSKRIT, label: "संस्कृतम् (Sanskrit)" }
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setView(AppView.DASHBOARD); }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-white to-orange-50 hover:from-orange-100 hover:to-orange-200 border border-orange-200 rounded-xl text-saffron-900 font-bold text-lg transition-all transform hover:scale-[1.02] flex items-center justify-between shadow-sm"
                >
                  <span>{l.label}</span>
                  <ArrowLeft className="rotate-180" size={20} />
                </button>
              ))}
            </div>
          </div>
          <div className="bg-saffron-50 p-4 text-center border-t border-saffron-200 text-xs text-saffron-800 font-bold">
            Developed by Er. Sangam Krishna
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout lang={lang} setLang={setLang} goHome={() => setView(AppView.DASHBOARD)}>
      
      {/* --- DASHBOARD --- */}
      {view === AppView.DASHBOARD && (
        <div className="space-y-8 mt-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-display font-bold text-saffron-900">{t.welcome}</h2>
            <p className="text-gray-600">Explore the divine science of stars and numbers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <DashboardCard 
              title={t.janmaKundali} 
              icon={<Calendar size={32} />} 
              desc="Detailed Chart, Doshas & Remedies"
              color="bg-orange-50 border-orange-200 text-orange-700"
              onClick={() => setView(AppView.KUNDALI_FORM)} 
            />
            <DashboardCard 
              title={t.match} 
              icon={<Heart size={32} />} 
              desc="36 Guna Milan & Manglik Check"
              color="bg-pink-50 border-pink-200 text-pink-700"
              onClick={() => setView(AppView.MILAN_FORM)} 
            />
            <DashboardCard 
              title={t.numerology} 
              icon={<Hash size={32} />} 
              desc="Mulank, Bhagyank & Lucky Gems"
              color="bg-indigo-50 border-indigo-200 text-indigo-700"
              onClick={() => setView(AppView.NUMEROLOGY_FORM)} 
            />
            <DashboardCard 
              title={t.rashifal} 
              icon={<Sun size={32} />} 
              desc="Daily Horoscope by Moon Sign"
              color="bg-yellow-50 border-yellow-200 text-yellow-700"
              onClick={() => setView(AppView.RASHIFAL)} 
            />
             {/* Split Palmistry & Face Reading Cards */}
            <DashboardCard 
              title={t.palmAnalysis} 
              icon={<Fingerprint size={32} />} 
              desc="Read Heart, Head & Life Lines"
              color="bg-teal-50 border-teal-200 text-teal-700"
              onClick={() => {
                setPalmistryType('palm');
                setPalmistryResult(null);
                setPalmistryImage(null);
                setView(AppView.PALMISTRY);
              }} 
            />
            <DashboardCard 
              title={t.faceAnalysis} 
              icon={<Eye size={32} />} 
              desc="Face Symmetry & Planetary Influence"
              color="bg-purple-50 border-purple-200 text-purple-700"
              onClick={() => {
                setPalmistryType('face');
                setPalmistryResult(null);
                setPalmistryImage(null);
                setView(AppView.PALMISTRY);
              }} 
            />
          </div>
        </div>
      )}

      {/* --- RASHIFAL FLOW --- */}
      {view === AppView.RASHIFAL && (
        <Card title={t.rashifal} onBack={() => setView(AppView.DASHBOARD)}>
          <div className="space-y-6">
            {!rashifalResult ? (
              <>
              <div>
                <label className="text-xs font-bold text-saffron-800 uppercase tracking-wider mb-2 block">{t.selectRashi}</label>
                <div className="grid grid-cols-3 gap-3">
                  {SIGNS.map((sign, index) => (
                    <button 
                      key={index}
                      onClick={() => setSelectedRashi(index)}
                      className={`p-3 rounded-lg border text-sm font-bold transition-all ${selectedRashi === index ? 'bg-saffron-600 text-white border-saffron-600 shadow-md' : 'bg-white border-gold-200 text-gray-700 hover:bg-orange-50'}`}
                    >
                      {sign}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => {
                  const result = calculateDailyRashifal(selectedRashi, lang);
                  setRashifalResult(result);
                }}
                className="w-full bg-saffron-600 text-white py-3 rounded-lg font-bold hover:bg-saffron-700 transition"
              >
                {t.viewHoroscope}
              </button>
              </>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center border-b pb-4 border-gray-100">
                  <h3 className="text-2xl font-display font-bold text-saffron-800">{rashifalResult.rashi}</h3>
                  <p className="text-gray-500">{rashifalResult.date}</p>
                </div>
                
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 shadow-sm">
                   <div className="flex gap-3 mb-4">
                     <Sun className="text-saffron-500 flex-shrink-0" />
                     <p className="text-lg font-serif leading-relaxed text-gray-800">
                       {rashifalResult.prediction}
                     </p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
                    <span className="text-xs uppercase text-gray-500 font-bold block mb-1">Lucky Color</span>
                    <span className="font-bold text-lg text-saffron-700">{rashifalResult.luckyColor}</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
                    <span className="text-xs uppercase text-gray-500 font-bold block mb-1">Lucky Number</span>
                    <span className="font-display text-2xl text-saffron-700">{rashifalResult.luckyNumber}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setRashifalResult(null)}
                  className="w-full py-2 text-saffron-600 font-bold hover:bg-saffron-50 rounded transition"
                >
                  Check Another Rashi
                </button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* --- PALMISTRY / FACE READING --- */}
      {view === AppView.PALMISTRY && (
         <Card 
           title={palmistryType === 'palm' ? t.palmAnalysis : t.faceAnalysis} 
           onBack={() => setView(AppView.DASHBOARD)}
         >
            {!palmistryScanning && !palmistryResult ? (
              <div className="space-y-6">
                 {/* No toggle selector here anymore to strictly separate them */}
                 <div className="p-4 bg-orange-50 rounded-lg text-center border border-orange-200">
                    <p className="font-bold text-orange-800">
                      {palmistryType === 'palm' ? "Palmistry Mode" : "Face Reading Mode"}
                    </p>
                 </div>
                 
                 <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center space-y-4 hover:border-saffron-400 transition-colors bg-gray-50">
                    <div className="p-4 bg-white rounded-full shadow-sm">
                       {palmistryType === 'palm' ? <Fingerprint size={48} className="text-saffron-400" /> : <ScanLine size={48} className="text-saffron-400" />}
                    </div>
                    <p className="text-center text-gray-500 max-w-xs">
                      {t.uploadInstruction}
                    </p>
                    
                    <div className="flex flex-col w-full gap-3">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 bg-saffron-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-saffron-700"
                      >
                         <Upload size={20} /> {t.uploadPhoto}
                      </button>
                      <input 
                         type="file" 
                         ref={fileInputRef}
                         className="hidden" 
                         accept="image/*"
                         onChange={handlePalmistryUpload} 
                      />
                      
                      {/* Camera Button (Mobile) */}
                      <label className="w-full py-3 bg-white border border-saffron-600 text-saffron-600 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-saffron-50">
                         <Camera size={20} /> {t.takePhoto}
                         <input 
                           type="file" 
                           className="hidden" 
                           accept="image/*" 
                           capture="environment"
                           onChange={handlePalmistryUpload} 
                         />
                      </label>
                    </div>
                 </div>
              </div>
            ) : palmistryScanning ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
                 <div className="relative">
                    {palmistryImage && <img src={URL.createObjectURL(palmistryImage)} alt="Scan" className="w-48 h-48 object-cover rounded-full opacity-50 blur-sm" />}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <ScanLine size={64} className="text-saffron-600 animate-spin-slow" />
                    </div>
                    <div className="absolute inset-0 border-4 border-saffron-400 border-t-transparent rounded-full animate-spin"></div>
                 </div>
                 <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-saffron-800">{t.scanning}</h3>
                    <p className="text-sm text-gray-500">
                      {palmistryType === 'palm' ? "Analyzing Palm lines..." : "Analyzing Face symmetry..."}
                    </p>
                 </div>
              </div>
            ) : palmistryResult ? (
              <div className="space-y-6 animate-fade-in">
                 <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-gold-400 h-64 bg-black">
                    <img src={palmistryResult.imageUrl} className="w-full h-full object-contain opacity-80" />
                    {/* SVG Overlay for Scan Effect */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                       <rect x="10%" y="10%" width="80%" height="80%" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="10,5" />
                       <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#fbbf24" strokeWidth="1" />
                       <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#fbbf24" strokeWidth="1" />
                    </svg>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                       <h3 className="text-white font-display text-xl font-bold">{t.aiReport}</h3>
                    </div>
                 </div>
                 
                 {/* Prediction */}
                 <div className="bg-white p-6 rounded-xl border-l-4 border-saffron-500 shadow">
                    <div className="flex items-center gap-2 mb-2">
                       <Sparkles size={20} className="text-saffron-600" />
                       <h4 className="font-bold text-gray-800">Future Insight</h4>
                    </div>
                    <p className="text-gray-700 italic whitespace-pre-wrap">{palmistryResult.prediction}</p>
                 </div>

                 {/* Traits */}
                 <div className="grid grid-cols-2 gap-4">
                    {palmistryResult.traits.map((trait, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <div className="text-xs uppercase text-gray-500 font-bold mb-1">{trait.label}</div>
                         <div className="font-bold text-saffron-900">{trait.value}</div>
                         <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
                            <div className="bg-saffron-500 h-1.5 rounded-full" style={{ width: `${trait.score}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
                 
                 {/* Keywords */}
                 <div className="flex flex-wrap gap-2">
                    {palmistryResult.personalityKeywords.map((k, i) => (
                      <span key={i} className="px-3 py-1 bg-teal-50 text-teal-800 text-sm font-bold rounded-full border border-teal-200">
                         {k}
                      </span>
                    ))}
                 </div>

                 <button onClick={() => {
                   setPalmistryResult(null);
                   setPalmistryImage(null);
                 }} className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition">
                    Scan Another
                 </button>
              </div>
            ) : null}
         </Card>
      )}

      {/* --- KUNDALI FLOW --- */}
      {view === AppView.KUNDALI_FORM && (
        <Card title={t.enterDetails} onBack={() => setView(AppView.DASHBOARD)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-saffron-800 uppercase tracking-wider">{t.name}</label>
              <input 
                type="text" 
                value={kundaliForm.name} 
                onChange={(e) => setKundaliForm({...kundaliForm, name: e.target.value})}
                className="w-full p-3 bg-white border border-gold-200 rounded-lg focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all"
              />
            </div>
            <DateInput 
              label={t.dob} 
              d={kundaliForm.day} m={kundaliForm.month} y={kundaliForm.year}
              setD={(v: number) => setKundaliForm({...kundaliForm, day: v})}
              setM={(v: number) => setKundaliForm({...kundaliForm, month: v})}
              setY={(v: number) => setKundaliForm({...kundaliForm, year: v})}
            />
            <TimeInput 
              h={kundaliForm.hour} m={kundaliForm.minute}
              setH={(v: number) => setKundaliForm({...kundaliForm, hour: v})}
              setM={(v: number) => setKundaliForm({...kundaliForm, minute: v})}
            />
            <div>
              <label className="text-xs font-bold text-saffron-800 uppercase tracking-wider">{t.pob}</label>
              <input 
                type="text" 
                value={kundaliForm.location}
                onChange={(e) => setKundaliForm({...kundaliForm, location: e.target.value})}
                className="w-full p-3 bg-white border border-gold-200 rounded-lg focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => {
                setKundaliResult(generateKundali(kundaliForm, lang));
                setActiveTab('chart');
                setView(AppView.KUNDALI_RESULT);
              }}
              className="w-full bg-gradient-to-r from-saffron-600 to-saffron-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              {t.generate}
            </button>
          </div>
        </Card>
      )}

      {view === AppView.KUNDALI_RESULT && kundaliResult && (
        <div className="space-y-6 animate-fade-in pb-12">
          {/* Header */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gold-200 flex flex-col md:flex-row justify-between items-center gap-4">
             <div>
                <h2 className="text-2xl font-display font-bold text-saffron-900">{kundaliResult.details.name}</h2>
                <p className="text-sm text-gray-500">
                  {kundaliResult.details.day}/{kundaliResult.details.month}/{kundaliResult.details.year} • {kundaliResult.details.location}
                </p>
             </div>
             <div className="flex space-x-2">
                <button onClick={() => setView(AppView.KUNDALI_FORM)} className="px-4 py-2 text-saffron-700 font-bold hover:bg-saffron-50 rounded-lg transition">{t.back}</button>
                <button 
                  onClick={() => generatePDF(kundaliResult, null, lang)}
                  className="px-4 py-2 bg-saffron-600 text-white rounded-lg flex items-center space-x-2 hover:bg-saffron-700 transition shadow"
                >
                  <Download size={18} />
                  <span>PDF</span>
                </button>
             </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-white rounded-lg shadow p-1 overflow-x-auto">
             {['chart', 'houses', 'planets', 'dosha', 'remedy'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`flex-1 py-3 px-4 rounded-md font-bold text-sm uppercase tracking-wide transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-saffron-100 text-saffron-800' : 'text-gray-500 hover:bg-gray-50'}`}
               >
                 {tab === 'chart' && t.janmaKundali}
                 {tab === 'houses' && (lang === Language.HINDI ? 'भाव फल' : 'House Analysis')}
                 {tab === 'planets' && t.planetaryPos}
                 {tab === 'dosha' && t.doshas}
                 {tab === 'remedy' && t.remedies}
               </button>
             ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-lg border border-gold-100 min-h-[400px]">
            {activeTab === 'chart' && (
              <div className="p-6 flex flex-col items-center">
                 <NorthIndianChart data={kundaliResult} />
              </div>
            )}

            {/* NEW: House Analysis Grid */}
            {activeTab === 'houses' && (
              <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {kundaliResult.houseReports.map((report) => (
                  <div key={report.houseNumber} className="border border-gold-200 rounded-xl p-4 bg-orange-50 hover:shadow-md transition">
                    <div className="flex justify-between items-center mb-2 border-b border-orange-200 pb-2">
                      <span className="font-bold text-saffron-800 text-lg">
                        {lang === Language.HINDI ? `भाव ${report.houseNumber}` : `House ${report.houseNumber}`}
                      </span>
                      <span className="text-xs bg-white px-2 py-1 rounded text-gray-500 font-semibold border">{report.sign}</span>
                    </div>
                    <div className="text-sm space-y-2">
                       <p className="text-gray-600"><strong>Lord:</strong> {report.lord}</p>
                       <div className="flex flex-wrap gap-1">
                          {report.planets.length > 0 ? (
                            report.planets.map(p => (
                              <span key={p.planet} className="px-2 py-0.5 bg-saffron-200 text-saffron-900 text-xs rounded-full font-bold">
                                {p.planet}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs italic">No Planets</span>
                          )}
                       </div>
                       <p className="text-gray-800 text-sm leading-relaxed mt-2 border-t border-orange-100 pt-2">
                         {report.analysis}
                       </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'planets' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-saffron-600 text-white">
                    <tr>
                      <th className="p-4">{t.planet}</th>
                      <th className="p-4">{t.sign}</th>
                      <th className="p-4">{t.house}</th>
                      <th className="p-4">{t.nakshatra}</th>
                      <th className="p-4">Degree</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {kundaliResult.planets.map((p, idx) => (
                      <tr key={idx} className="hover:bg-orange-50 transition-colors">
                        <td className="p-4 font-bold text-gray-800 flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${['Sun','Mars'].includes(p.planet)?'bg-red-500':'bg-blue-500'}`}></div>
                           {p.planet} {p.isRetrograde && <span className="text-xs text-red-500 font-bold">(R)</span>}
                        </td>
                        <td className="p-4">{p.signIndex + 1}</td>
                        <td className="p-4">{p.house}</td>
                        <td className="p-4 font-medium text-saffron-800">{p.nakshatra}</td>
                        <td className="p-4 text-gray-500">{p.degree.toFixed(2)}°</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'dosha' && (
              <div className="p-6 grid gap-6 md:grid-cols-2">
                 <DoshaCard 
                   title="Mangal Dosha" 
                   active={kundaliResult.doshas.hasMangalDosha} 
                   desc={kundaliResult.doshas.description}
                 />
                 <DoshaCard 
                   title="Kaal Sarp Yoga" 
                   active={kundaliResult.doshas.hasKaalSarp} 
                   desc={kundaliResult.doshas.hasKaalSarp ? "Planets hemmed between Rahu & Ketu." : "No Kaal Sarp Yoga detected."}
                 />
                 <div className="col-span-1 md:col-span-2 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-2">Expert Dosha Analysis</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{kundaliResult.doshas.description}</p>
                 </div>
              </div>
            )}

            {activeTab === 'remedy' && (
              <div className="p-6 grid gap-4">
                {kundaliResult.remedies.map((r, i) => (
                  <div key={i} className="flex gap-4 p-4 border border-gold-200 rounded-lg hover:shadow-md transition bg-gradient-to-r from-white to-orange-50">
                     <div className="p-3 bg-saffron-100 rounded-full h-fit text-saffron-600">
                        {r.type === 'Gemstone' && <Gem size={24} />}
                        {r.type === 'Mantra' && <ScrollText size={24} />}
                        {r.type === 'Rudraksha' && <Sparkles size={24} />}
                     </div>
                     <div>
                       <h4 className="font-bold text-lg text-gray-800">{r.name}</h4>
                       <span className="text-xs font-bold text-saffron-600 uppercase tracking-wide">{r.type}</span>
                       <p className="text-gray-600 mt-1 text-sm">{r.description}</p>
                       <p className="text-gray-500 mt-2 text-xs font-mono bg-white p-2 rounded border border-gray-100 inline-block">
                         {r.procedure}
                       </p>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MILAN FLOW --- */}
      {view === AppView.MILAN_FORM && (
        <Card title={t.match} onBack={() => setView(AppView.DASHBOARD)}>
           <div className="space-y-6">
             <div className="p-4 bg-blue-50 rounded border border-blue-200">
               <h3 className="font-bold text-blue-800 mb-3 uppercase tracking-wide text-xs">{t.boyDetails}</h3>
               <div className="space-y-3">
                  <input className="w-full p-2 border rounded" placeholder={t.name} value={milanBoy.name} onChange={e => setMilanBoy({...milanBoy, name: e.target.value})} />
                  <DateInput label={t.dob} d={milanBoy.day} m={milanBoy.month} y={milanBoy.year} setD={(v:number) => setMilanBoy({...milanBoy, day: v})} setM={(v:number) => setMilanBoy({...milanBoy, month: v})} setY={(v:number) => setMilanBoy({...milanBoy, year: v})} />
               </div>
             </div>
             <div className="p-4 bg-pink-50 rounded border border-pink-200">
               <h3 className="font-bold text-pink-800 mb-3 uppercase tracking-wide text-xs">{t.girlDetails}</h3>
               <div className="space-y-3">
                  <input className="w-full p-2 border rounded" placeholder={t.name} value={milanGirl.name} onChange={e => setMilanGirl({...milanGirl, name: e.target.value})} />
                  <DateInput label={t.dob} d={milanGirl.day} m={milanGirl.month} y={milanGirl.year} setD={(v:number) => setMilanGirl({...milanGirl, day: v})} setM={(v:number) => setMilanGirl({...milanGirl, month: v})} setY={(v:number) => setMilanGirl({...milanGirl, year: v})} />
               </div>
             </div>
             <button onClick={() => { setMilanResult(calculateMilan(milanBoy, milanGirl, lang)); setView(AppView.MILAN_RESULT); }} className="w-full bg-saffron-600 text-white py-3 rounded-lg font-bold hover:bg-saffron-700 transition">
                {t.calculateMatch}
             </button>
           </div>
        </Card>
      )}

      {view === AppView.MILAN_RESULT && milanResult && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="text-2xl font-display font-bold text-saffron-800">{t.match} Report</h2>
             <button onClick={() => setView(AppView.MILAN_FORM)} className="text-saffron-600 underline font-bold">{t.back}</button>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-saffron-500 text-center">
             <div className="inline-block p-4 rounded-full bg-saffron-50 mb-4">
               <Heart size={48} className="text-saffron-600 fill-saffron-600 animate-pulse" />
             </div>
             <div className="text-6xl font-display font-bold text-gray-900 mb-2">
               {milanResult.score} <span className="text-2xl text-gray-400">/ 36</span>
             </div>
             <p className="text-xl font-bold text-saffron-800 mb-2">{milanResult.conclusion}</p>
             <p className="text-sm text-gray-500 mb-6">{milanResult.manglikStatus}</p>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-left bg-gray-50 p-4 rounded-xl">
               {Object.entries(milanResult.categoryScores).map(([key, val]) => (
                 <div key={key} className="flex flex-col border-b border-gray-200 pb-2 last:border-0">
                    <span className="text-xs uppercase text-gray-500 font-bold">{key}</span>
                    <span className="font-display font-bold text-lg text-gray-800">{val}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {/* --- NUMEROLOGY FLOW --- */}
      {view === AppView.NUMEROLOGY_FORM && (
        <Card title={t.numerology} onBack={() => setView(AppView.DASHBOARD)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-saffron-800 uppercase tracking-wider">{t.name}</label>
              <input type="text" value={numerologyForm.name} onChange={e => setNumerologyForm({...numerologyForm, name: e.target.value})} className="w-full p-3 bg-white border border-gold-200 rounded-lg focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition-all" />
            </div>
            <DateInput label={t.dob} d={numerologyForm.d} m={numerologyForm.m} y={numerologyForm.y} setD={(v:number) => setNumerologyForm({...numerologyForm, d: v})} setM={(v:number) => setNumerologyForm({...numerologyForm, m: v})} setY={(v:number) => setNumerologyForm({...numerologyForm, y: v})} />
            <button onClick={() => { setNumerologyResult(calculateNumerology(numerologyForm.name, numerologyForm.d, numerologyForm.m, numerologyForm.y, lang)); setView(AppView.NUMEROLOGY_RESULT); }} className="w-full bg-saffron-600 text-white py-3 rounded-lg font-bold hover:bg-saffron-700 transition">
              {t.calculateNum}
            </button>
          </div>
        </Card>
      )}

      {view === AppView.NUMEROLOGY_RESULT && numerologyResult && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="text-2xl font-display font-bold text-saffron-800">{t.numerology} Report</h2>
             <button onClick={() => setView(AppView.NUMEROLOGY_FORM)} className="text-saffron-600 underline font-bold">{t.back}</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <NumCard title={t.mulank} val={numerologyResult.mulank} sub="Psychic Number" />
             <NumCard title={t.bhagyank} val={numerologyResult.bhagyank} sub="Destiny Number" />
             <NumCard title={t.namank} val={numerologyResult.namank} sub="Name Number" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-xl shadow border-l-4 border-purple-500">
               <div className="text-xs text-gray-500 uppercase">Soul Urge</div>
               <div className="text-2xl font-bold">{numerologyResult.soulUrge}</div>
             </div>
             <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
               <div className="text-xs text-gray-500 uppercase">Personality</div>
               <div className="text-2xl font-bold">{numerologyResult.personality}</div>
             </div>
          </div>
          
          {/* Arrows Section (David Phillips) */}
          {numerologyResult.arrows.length > 0 && (
             <div className="bg-white p-4 rounded-xl shadow border border-gold-200">
               <h3 className="font-bold text-lg mb-2 text-saffron-800">{t.arrows}</h3>
               <ul className="list-disc pl-5 space-y-1">
                 {numerologyResult.arrows.map((arrow, i) => (
                   <li key={i} className="text-gray-700">{arrow}</li>
                 ))}
               </ul>
             </div>
          )}

          <div className="bg-white p-6 rounded-xl shadow border border-gold-200">
             <h3 className="font-bold text-lg mb-2 text-saffron-800">In-Depth Analysis</h3>
             <p className="text-gray-700 font-serif leading-relaxed italic border-l-2 border-gold-400 pl-4 whitespace-pre-wrap">"{numerologyResult.prediction}"</p>
             <div className="mt-4 flex gap-4 text-sm">
               <span className="px-3 py-1 bg-gray-100 rounded-full">Lucky Color: <b>{numerologyResult.luckyColor}</b></span>
               <span className="px-3 py-1 bg-gray-100 rounded-full">Gem: <b>{numerologyResult.luckyGem}</b></span>
             </div>
          </div>
        </div>
      )}

    </Layout>
  );
}

// UI Components
const DashboardCard = ({ title, icon, desc, color, onClick }: any) => (
  <div onClick={onClick} className={`p-6 rounded-xl shadow-md border-2 cursor-pointer transform hover:-translate-y-2 hover:shadow-xl transition-all group flex flex-col items-center text-center bg-white ${color.replace('bg-', 'hover:bg-opacity-50 ')}`}>
    <div className={`mb-4 p-4 rounded-full bg-opacity-10 ${color.split(' ')[2]}`}>{icon}</div>
    <h3 className="text-xl font-display font-bold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500 mt-2">{desc}</p>
  </div>
);

const Card = ({ children, title, onBack }: any) => (
  <div className="bg-white max-w-lg mx-auto w-full p-8 rounded-2xl shadow-xl border border-gold-200">
    <div className="flex items-center mb-6">
      <button onClick={onBack} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft /></button>
      <h2 className="text-xl font-display font-bold text-saffron-900">{title}</h2>
    </div>
    {children}
  </div>
);

const NumCard = ({ title, val, sub }: any) => (
  <div className="bg-gradient-to-br from-saffron-600 to-red-700 text-white p-6 rounded-xl shadow-lg relative overflow-hidden group">
    <div className="absolute -right-6 -top-6 text-white opacity-10 text-9xl font-bold font-display group-hover:scale-110 transition-transform">{val}</div>
    <div className="text-5xl font-bold mb-1 relative z-10">{val}</div>
    <div className="text-lg font-bold opacity-90 relative z-10">{title}</div>
    <div className="text-xs uppercase tracking-wider opacity-70 relative z-10 mt-1">{sub}</div>
  </div>
);

const DoshaCard = ({ title, active, desc }: {title:string, active:boolean, desc:string}) => (
  <div className={`p-4 rounded-lg border-l-4 ${active ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
    <div className="flex items-center gap-2 mb-1">
      {active ? <AlertTriangle size={18} className="text-red-600" /> : <Sparkles size={18} className="text-green-600" />}
      <h4 className={`font-bold ${active ? 'text-red-800' : 'text-green-800'}`}>{title}</h4>
    </div>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);

export default App;