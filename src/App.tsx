import React, { useState } from 'react';
import CountdownHeader from './components/CountdownHeader';
import ExamSection from './components/ExamSection';
import VideoSection from './components/VideoSection';
import BookSection from './components/BookSection';
import DocumentViewer from './components/DocumentViewer';

import { 
  GraduationCap, 
  BookOpen, 
  Film, 
  BookMarked, 
  Menu, 
  X, 
  Info,
  Layers,
  Heart,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

type TabId = 'exams' | 'videos' | 'books';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('exams');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<{ 
    type: 'exam' | 'book'; 
    data: any; 
    isSolution?: boolean; 
  } | null>(null);

  const tabs = [
    {
      id: 'exams' as TabId,
      name: 'بنك الامتحانات',
      description: 'أرشيف المواضيع مع الحلول النموذجية',
      icon: BookOpen,
      accentColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'videos' as TabId,
      name: 'فيديوهات وشروحات',
      description: 'متابعة مرئية للدروس والمحاور المنهجية',
      icon: Film,
      accentColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'books' as TabId,
      name: 'الكتب والمراجع الخارجية',
      description: 'سلاسل كتب الأساتذة الموثوقة والمطالعة',
      icon: BookMarked,
      accentColor: 'text-emerald-400 text-emerald-400 border-emerald-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-stone-100 flex flex-col font-sans" dir="rtl">
      
      {/* 🔴 BAC COUNTER BANNER HEADER */}
      <CountdownHeader />

      {/* 🔴 MAIN HEADER BAR */}
      <header className="sticky top-0 z-40 w-full bg-[#0d0d0f]/95 backdrop-blur border-b border-stone-850 px-4 md:px-8 py-3.5 flex items-center justify-between" id="app-header">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          
          {/* Logo / Title Area */}
          <div className="flex items-center gap-2.5 flex-row-reverse">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-stone-950 flex items-center justify-center shadow-lg shadow-emerald-500/10 shrink-0">
              <GraduationCap size={22} strokeWidth={2.5} />
            </div>
            <div className="text-right">
              <h1 className="text-sm md:text-base font-black text-white font-sans flex items-center gap-1.5 flex-row-reverse">
                <span>بوابة البكالوريا الإلكترونية</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800/40 select-none">
                  العلوم التجريبية
                </span>
              </h1>
              <p className="text-[10px] text-stone-500 font-bold mt-0.5">منصة مرافقة ذكية وشاملة ومجانية</p>
            </div>
          </div>

          {/* Desktop horizontal tabs menu */}
          <nav className="hidden md:flex items-center gap-1.5 flex-row-reverse" id="desktop-nav">
            {tabs.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border ${isActive ? 'bg-emerald-500 text-stone-950 border-emerald-500 shadow-md font-black' : 'text-stone-400 border-transparent hover:border-stone-800 hover:text-stone-200'}`}
                  id={`tab-nav-${tab.id}`}
                >
                  <IconComp size={15} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Hamburguer trigger */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition cursor-pointer"
            title="القائمة"
            id="mobile-menu-trigger"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </header>

      {/* 🔴 MOBILE DRAWER/SIDEBAR */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden animate-fade-in" id="mobile-sidebar-backdrop">
          {/* Overlay mask */}
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
          
          {/* Sidebar Drawer panel */}
          <div className="relative w-72 max-w-sm h-full bg-[#0d0d0f] border-r border-stone-850 p-6 flex flex-col justify-between text-right z-10 shadow-2xl">
            <div className="space-y-6">
              
              {/* Close & branding */}
              <div className="flex items-center justify-between border-b border-stone-850 pb-4 flex-row-reverse">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500 text-stone-950 flex items-center justify-center">
                    <GraduationCap size={16} />
                  </div>
                  <span className="text-xs font-bold text-white">العلوم التجريبية</span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded p-1 text-stone-400 hover:bg-stone-900 hover:text-white transition cursor-pointer"
                  id="btn-sidebar-close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1.5 text-right">
                <span className="text-[10px] text-stone-500 font-bold block mb-2 px-1">الأقسام التعليمية الرئيسية</span>
                {tabs.map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-right transition border ${isActive ? 'bg-emerald-500 text-stone-950 border-emerald-500 font-black shadow-lg shadow-emerald-500/5' : 'text-stone-300 border-transparent hover:bg-stone-900'}`}
                      id={`sidebar-tab-${tab.id}`}
                    >
                      <IconComp size={16} />
                      <div className="flex flex-col text-right">
                        <span>{tab.name}</span>
                        <span className={`text-[9px] font-normal leading-tight mt-0.5 ${isActive ? 'text-stone-900/80' : 'text-stone-500'}`}>
                          {tab.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer metadata info */}
            <div className="border-t border-stone-850 pt-4 space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-550 text-stone-500 font-bold justify-end">
                <span>تطوير طلابي وطني خالص لأجلكم</span>
                <Heart size={10} className="text-rose-500 fill-rose-500 animate-pulse" />
              </div>
              <p className="text-[9px] text-stone-600 text-center font-mono">bac-sciences-exp-portal</p>
            </div>

          </div>
        </div>
      )}

      {/* 🔴 MAIN CONTAINER CONTENT PANEL */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8" id="master-panel">
        
        {/* Intro/Welcome Greeting */}
        <div className="mb-8 border border-stone-800 bg-stone-900/40 p-6 md:p-8 rounded-2xl relative overflow-hidden" id="greeting-banner">
          <div className="absolute top-0 left-0 h-full w-[25%] bg-emerald-500/5 blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-6">
            <div className="space-y-2 text-right">
              <div className="flex items-center gap-2 flex-row-reverse justify-start">
                <Sparkles size={16} className="text-emerald-400 animate-bounce" />
                <h2 className="text-base md:text-lg font-black text-white">أهلاً بك يا بطل المستقبل في مساحة تفوقك!</h2>
              </div>
              <p className="text-stone-400 text-xs md:text-sm leading-relaxed max-w-2xl font-normal">
                بوابتك المتكاملة والمجانية 100% الموجهة خصيصاً لطلاب **بكالوريا شعبة العلوم التجريبية**. تقدم المنصة بنك امتحانات مصححاً بالكامل، شروحات مرئية منهجية للمحاور الصعبة، ومطالعة الكتب الخارجية للأساتذة بمستعرض PDF تفاعلي ذكي.
              </p>
            </div>
            
            {/* Quick stats badges column */}
            <div className="flex gap-2.5 flex-row-reverse shrink-0">
              <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl text-center min-w-[90px]">
                <span className="text-sm font-black text-emerald-400 font-mono block">10+</span>
                <span className="text-[9px] text-stone-500 font-semibold block mt-0.5">مواد علمية</span>
              </div>
              <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl text-center min-w-[90px]">
                <span className="text-sm font-black text-emerald-400 font-mono block">2015-2025</span>
                <span className="text-[9px] text-stone-500 font-semibold block mt-0.5">أرشيف رسمي</span>
              </div>
              <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl text-center min-w-[90px]">
                <span className="text-sm font-black text-emerald-400 font-mono block">تفاعلي</span>
                <span className="text-[9px] text-stone-500 font-semibold block mt-0.5">مستعرض PDF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab section Switchboard */}
        <div className="transition-all duration-300">
          {activeTab === 'exams' && (
            <ExamSection onOpenDocument={(doc) => setActiveDocument(doc)} />
          )}
          {activeTab === 'videos' && (
            <VideoSection />
          )}
          {activeTab === 'books' && (
            <BookSection onOpenDocument={(doc) => setActiveDocument(doc)} />
          )}
        </div>

      </main>

      {/* 🔴 PLATFORM FOOTER */}
      <footer className="bg-stone-950/80 border-t border-stone-850 py-8 px-4 mt-16 text-center select-none" id="app-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 flex-row-reverse text-stone-500 text-xs font-medium">
          
          <div className="flex items-center gap-1 justify-center md:justify-end flex-row-reverse">
            <span>صُنع بحب مكلل بالتفوق لجميع طلبة البكالوريا</span>
            <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse mt-0.5" />
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-stone-600">
            <span>bac-dz-experimental-sciences @ 2026</span>
          </div>

          <p className="text-[10px] text-stone-500 text-center max-w-sm leading-relaxed">
            محتوى هذه المنصة أرشيف دراسي رسمي مع حلول نموذجية تابعة لوزارة التربية الوطنية وديوان الامتحانات والمسابقات متاح مجاناً للجميع بدون اشتراك.
          </p>
        </div>
      </footer>

      {/* 🔴 EMBEDDED INTUITIVE DOCUMENT PREVIEWER MODAL */}
      {activeDocument && (
        <DocumentViewer 
          document={activeDocument} 
          onClose={() => setActiveDocument(null)} 
        />
      )}

    </div>
  );
}
