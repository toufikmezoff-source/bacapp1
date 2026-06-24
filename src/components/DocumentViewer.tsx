import React, { useState, useMemo } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  Printer, 
  Download, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Exam, Book } from '../types';

interface DocumentViewerProps {
  document: {
    type: 'exam' | 'book';
    data: Exam | Book;
    isSolution?: boolean;
  } | null;
  onClose: () => void;
}

export default function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  if (!document) return null;

  const { type, data, isSolution: initialIsSolution } = document;
  const [isSolution, setIsSolution] = useState(!!initialIsSolution);
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Derive pages based on document type
  const pages = useMemo(() => {
    if (type === 'exam') {
      const examData = data as Exam;
      const sections = isSolution ? examData.solutions : examData.problems;
      return sections.map((sec, idx) => ({
        title: sec.title,
        score: sec.score,
        questions: sec.questions,
        equations: sec.equations || [],
        diagramType: sec.diagramType || 'none',
        pageNumber: idx + 1
      }));
    } else {
      const bookData = data as Book;
      return bookData.sections.map((sec, idx) => ({
        title: sec.title,
        content: sec.content,
        pageNumber: idx + 1
      }));
    }
  }, [type, data, isSolution]);

  const activePageData = pages[currentPage] || pages[0] || null;

  const handleZoomIn = () => setZoom(z => Math.min(z + 10, 150));
  const handleZoomOut = () => setZoom(z => Math.max(z - 10, 70));

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(c => c + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(c => c - 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Simulated elegant download trigger
    const filename = type === 'exam' 
      ? `${(data as Exam).name}-${isSolution ? 'الحل' : 'الموضوع'}.html` 
      : `${(data as Book).title}.html`;
    
    const element = window.document.createElement('a');
    const file = new Blob([
      `<!DOCTYPE html>
       <html lang="ar" dir="rtl">
       <head>
         <meta charset="UTF-8">
         <title>${type === 'exam' ? (data as Exam).name : (data as Book).title}</title>
         <style>
           body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; background-color: white; color: black; }
           .header { text-align: center; border-bottom: 2px solid black; padding-bottom: 20px; margin-bottom: 30px; }
           .section { margin-bottom: 30px; border: 1px solid #ccc; padding: 20px; border-radius: 8px; }
           .score { float: left; font-weight: bold; }
           h2 { color: #1e90ff; }
         </style>
       </head>
       <body>
         <div class="header">
           <h1>الجمهورية الجزائرية الديمقراطية الشعبية</h1>
           <h2>وزارة التربية الوطنية</h2>
           <h3>امتحان شهادة البكالوريا - شعبة العلوم التجريبية</h3>
           <hr>
           <h2>${type === 'exam' ? (data as Exam).name : (data as Book).title}</h2>
           <p>الكاتب/المصدر: ${type === 'exam' ? (data as Exam).date : (data as Book).author}</p>
         </div>
         <div class="content">
           ${pages.map(p => `
             <div class="section">
               <span class="score">${'score' in p ? p.score : ''}</span>
               <h2>${p.title}</h2>
               <ul>
                 ${('questions' in p ? p.questions : p.content || []).map(q => `<li>${q}</li>`).join('')}
               </ul>
             </div>
           `).join('')}
         </div>
       </body>
       </html>`
    ], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    window.document.body.appendChild(element);
    element.click();
    window.document.body.removeChild(element);
  };

  // Searching logic within active page
  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return null;
    const q = searchQuery.toLowerCase();
    
    return pages.flatMap((page, pageIdx) => {
      const texts: string[] = [];
      if ('questions' in page) {
        texts.push(...page.questions);
      } else if ('content' in page) {
        texts.push(...page.content);
      }
      
      const matched = texts.filter(t => t.toLowerCase().includes(q));
      if (page.title.toLowerCase().includes(q) || matched.length > 0) {
        return [{
          pageIdx,
          pageTitle: page.title,
          matchedCount: matched.length + (page.title.toLowerCase().includes(q) ? 1 : 0),
          matches: matched
        }];
      }
      return [];
    });
  }, [searchQuery, pages]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-950/95 backdrop-blur-md animate-fade-in" dir="rtl">
      {/* Top Professional Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 bg-stone-900 px-4 py-3 text-stone-200">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="rounded p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition"
            title="إغلاق التصفح"
            id="btn-doc-close"
          >
            <X size={20} />
          </button>
          <div className="h-5 w-[1px] bg-stone-800"></div>
          <div>
            <h3 className="text-sm font-semibold text-stone-100 max-w-[200px] md:max-w-md truncate">
              {type === 'exam' ? (data as Exam).name : (data as Book).title}
            </h3>
            <p className="text-xs text-stone-400">
              {type === 'exam' ? 
                `امتحان بكالوريا رسمي • ${isSolution ? 'الحل النموذجي الوزاري' : 'الموضوع الأصلي'}` : 
                `كتاب خارجي للأساتذة • تأليفُ ${(data as Book).author}`
              }
            </p>
          </div>
        </div>

        {/* Exam subject vs Answer key toggle */}
        {type === 'exam' && (
          <div className="flex rounded-lg bg-stone-950 p-1 border border-stone-800 text-xs">
            <button
              onClick={() => { setIsSolution(false); setCurrentPage(0); }}
              className={`rounded px-3 py-1.5 transition font-medium ${!isSolution ? 'bg-sky-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'}`}
              id="btn-doc-subject"
            >
              <div className="flex items-center gap-1">
                <FileText size={14} />
                <span>الموضوع الرسمي</span>
              </div>
            </button>
            <button
              onClick={() => { setIsSolution(true); setCurrentPage(0); }}
              className={`rounded px-3 py-1.5 transition font-medium ${isSolution ? 'bg-emerald-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'}`}
              id="btn-doc-solution"
            >
              <div className="flex items-center gap-1">
                <CheckCircle size={14} />
                <span>الحل النموذجي</span>
              </div>
            </button>
          </div>
        )}

        {/* Toolbar Center: Zoom & Page navigation */}
        <div className="flex items-center gap-2">
          {/* Zoom Buttons */}
          <div className="flex items-center rounded-lg bg-stone-950 border border-stone-800 p-0.5">
            <button 
              onClick={handleZoomOut}
              disabled={zoom <= 70}
              className="rounded p-1 text-stone-400 hover:text-white hover:bg-stone-800 disabled:opacity-30 transition"
              title="تصغير"
              id="btn-doc-zoom-out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="px-2 text-xs font-mono w-12 text-center text-stone-300">{zoom}%</span>
            <button 
              onClick={handleZoomIn}
              disabled={zoom >= 150}
              className="rounded p-1 text-stone-400 hover:text-white hover:bg-stone-800 disabled:opacity-30 transition"
              title="تكبير"
              id="btn-doc-zoom-in"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <div className="h-5 w-[1px] bg-stone-800"></div>

          {/* Navigation */}
          <div className="flex items-center rounded-lg bg-stone-950 border border-stone-800 p-0.5">
            <button 
              onClick={handleNextPage}
              disabled={currentPage === pages.length - 1}
              className="rounded p-1 text-stone-400 hover:text-white hover:bg-stone-800 disabled:opacity-30 transition"
              title="الصفحة التالية"
              id="btn-doc-next"
            >
              <ChevronRight size={18} />
            </button>
            <span className="px-2 text-xs font-mono text-stone-300">
              الصفحة {currentPage + 1} من {pages.length}
            </span>
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="rounded p-1 text-stone-400 hover:text-white hover:bg-stone-800 disabled:opacity-30 transition"
              title="الصفحة السابقة"
              id="btn-doc-prev"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>

        {/* Toolbar Left: Actions & Search */}
        <div className="flex items-center gap-1.5">
          {/* Active Search Box */}
          <div className="relative">
            <button 
              onClick={() => setIsSearching(!isSearching)}
              className={`rounded p-1.5 transition ${isSearching ? 'bg-stone-800 text-sky-400' : 'text-stone-400 hover:bg-stone-800 hover:text-white'}`}
              title="بحث داخل المستند"
              id="btn-doc-search-toggle"
            >
              <Search size={18} />
            </button>
            
            {isSearching && (
              <div className="absolute left-0 top-10 z-50 w-64 rounded-lg border border-stone-800 bg-stone-900 p-2 shadow-xl">
                <input
                  type="text"
                  placeholder="ابحث عن كلمة مفتاحية..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded border border-stone-700 bg-stone-950 px-2.5 py-1 text-xs text-stone-100 placeholder-stone-500 focus:border-sky-500 focus:outline-none"
                  autoFocus
                  id="input-doc-search"
                />
                
                {searchQuery && (
                  <div className="mt-2 max-h-48 overflow-y-auto rounded bg-stone-950 p-1 text-[10px]">
                    {filteredQuestions && filteredQuestions.length > 0 ? (
                      filteredQuestions.map((f, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setCurrentPage(f.pageIdx);
                          }}
                          className={`w-full text-right p-1.5 rounded transition ${currentPage === f.pageIdx ? 'bg-sky-500/10 text-sky-400' : 'text-stone-400 hover:bg-stone-900'}`}
                        >
                          <p className="font-semibold">{f.pageTitle} (تفصيل)</p>
                          <p className="text-[9px] text-stone-500 truncate mt-0.5">
                            تم العثور على تطابقات في هذه الصفحة
                          </p>
                        </button>
                      ))
                    ) : (
                      <p className="p-2 text-stone-500 text-center">لا توجد نتائج مطابقة</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <button 
            onClick={handlePrint}
            className="rounded p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition"
            title="طباعة (PDF)"
            id="btn-doc-print"
          >
            <Printer size={18} />
          </button>
          
          <button 
            onClick={handleDownload}
            className="rounded p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition"
            title="تحميل كملف HTML مستقل"
            id="btn-doc-download"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center backdrop-brightness-50">
        {/* The Paper Sheet */}
        <div 
          className="relative my-4 shrink-0 transition-transform duration-200 border-stone-700 bg-stone-950 text-stone-100 rounded-lg shadow-2xl overflow-hidden select-text border"
          style={{ 
            width: `${Math.round(800 * (zoom / 100))}px`, 
            maxWidth: '100%' 
          }}
        >
          {/* Official Stamp Border Header (Simulating Ministry Sheets) */}
          <div className="border-b border-stone-800 bg-stone-900/60 p-6 md:p-8 text-center text-stone-300">
            <div className="text-xs tracking-widest font-bold mb-2">الجمهورية الجزائرية الديمقراطية الشعبية</div>
            <div className="text-xs font-semibold mb-3">وزارة التربية الوطنية</div>
            <div className="flex items-center justify-between mt-4 border-t border-b border-stone-800 py-3 mx-2 text-[11px] text-stone-400">
              <span>امتحان شهادة البكالوريا للتعليم الثانوي</span>
              <span>الشعبة: علوم تجريبية</span>
            </div>
            
            <div className="mt-5">
              <h2 className="text-lg md:text-xl font-black text-white hover:text-sky-400 transition">
                {type === 'exam' ? (data as Exam).name : (data as Book).title}
              </h2>
              <div className="mt-2 text-xs text-stone-400 flex items-center justify-center gap-4">
                <span>المخرج الفني: <b>{type === 'exam' ? 'الديوان الوطني للامتحانات' : (data as Book).author}</b></span>
                <span>•</span>
                <span>التاريخ: {type === 'exam' ? (data as Exam).date : 'إصدار حديث معتمد'}</span>
              </div>
            </div>
          </div>

          {/* Page Watermark Layer */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none opacity-[0.03]">
            <span className="text-7xl font-sans font-black tracking-widest uppercase rotate-45 select-none text-white">
              BAC - DZ
            </span>
          </div>

          {/* Active Page Sheet Body */}
          <div className="p-6 md:p-10 min-h-[500px]">
            {activePageData ? (
              type === 'exam' ? (
                // EXAM RENDERING
                <div>
                  <div className="flex justify-between items-center border-b border-sky-950 pb-3 mb-6">
                    <h3 className="text-base font-bold text-sky-400 flex items-center gap-2">
                      <HelpCircle size={18} className="text-sky-500" />
                      <span>{activePageData.title}</span>
                    </h3>
                    {'score' in activePageData && (
                      <span className="text-xs bg-sky-950/50 border border-sky-800/40 text-sky-300 font-bold px-3 py-1 rounded-full">
                        {activePageData.score}
                      </span>
                    )}
                  </div>

                  {/* Render simulated graphical diagrams when specified */}
                  {('diagramType' in activePageData) && activePageData.diagramType !== 'none' && (
                    <div className="my-6 border border-stone-850 bg-stone-900/40 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                      <div className="w-full max-w-sm h-32 relative border border-stone-800 rounded bg-stone-950 p-2 flex items-center justify-center">
                        {activePageData.diagramType === 'circuit' && (
                          <svg viewBox="0 0 400 120" className="w-full h-full text-sky-400 font-mono">
                            {/* Circuit schematic drawing */}
                            <path d="M 20 60 L 100 60 M 140 60 L 220 60 M 260 60 L 380 60" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            {/* Generator symbol */}
                            <circle cx="100" cy="60" r="15" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <text x="96" y="65" fill="currentColor" className="text-xs font-bold font-sans">E</text>
                            {/* Switch */}
                            <path d="M 140 60 L 170 30" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <text x="155" y="25" fill="currentColor" className="text-[10px]">K</text>
                            {/* Resistor */}
                            <rect x="220" y="45" width="40" height="30" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <text x="235" y="65" fill="currentColor" className="text-xs">R</text>
                            {/* Capacitor */}
                            <path d="M 300 40 L 300 80 M 310 40 L 310 80" stroke="currentColor" strokeWidth="2" fill="none" />
                            <text x="302" y="32" fill="currentColor" className="text-xs">C</text>
                            <path d="M 300 60 L 310 60" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M 310 60 L 380 60" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        )}
                        {activePageData.diagramType === 'projectile' && (
                          <svg viewBox="0 0 400 120" className="w-full h-full text-emerald-400 font-mono">
                            {/* Projectile graph/path */}
                            <path d="M 20 100 L 380 100" stroke="currentColor" strokeWidth="1.5" /> {/* ground */}
                            <path d="M 40 100 Q 180 10 320 100" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" fill="none" />
                            <circle cx="180" cy="55" r="5" fill="currentColor" />
                            <text x="180" y="45" fill="currentColor" className="text-[10px]">v(t)</text>
                            {/* Force vectors */}
                            <line x1="180" y1="55" x2="180" y2="90" stroke="tomato" strokeWidth="1.5" markerEnd="arrow" />
                            <text x="188" y="85" fill="tomato" className="text-[9px]">P (الثقل)</text>
                            <line x1="180" y1="55" x2="180" y2="30" stroke="orange" strokeWidth="1.5" />
                            <text x="188" y="38" fill="orange" className="text-[9px]">f (المقاومة)</text>
                          </svg>
                        )}
                        <span className="absolute bottom-1 right-2 text-[9px] text-stone-500 font-mono">شكل توضيحي ومخطط للدراسة</span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-2">الشكل المقترح في الأسئلة الملحقة بالوثيقة</p>
                    </div>
                  )}

                  {/* Render Problem Questions list */}
                  <div className="space-y-6">
                    {('questions' in activePageData) && activePageData.questions.map((q, qidx) => (
                      <div key={qidx} className="group flex items-start gap-3.5 leading-relaxed rounded-md hover:bg-stone-900/10 p-1.5 transition">
                        <span className="flex h-5 w-5 shrink-0 select-none items-center justify-center rounded-full bg-stone-900 text-[11px] font-bold text-stone-400 font-mono group-hover:bg-sky-950 group-hover:text-sky-400 transition">
                          {qidx + 1}
                        </span>
                        <p className="text-stone-300 text-sm whitespace-pre-wrap flex-1">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // BOOK CHAPTER PAGES RENDERING
                <div>
                  <h3 className="text-base font-bold text-amber-400 border-b border-amber-950/40 pb-3 mb-6">
                    {activePageData.title}
                  </h3>
                  <div className="space-y-6">
                    {('content' in activePageData) && activePageData.content.map((para, pidx) => (
                      <div key={pidx} className="leading-relaxed text-stone-300 text-sm pl-4 relative border-r-2 border-stone-800 hover:border-amber-500/50 transition pr-3 py-1">
                        <p>{para}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <p className="text-stone-500 text-center py-10">نعتذر، لم يتم تحميل البيانات لهذه الصفحة بشكل سليم.</p>
            )}
          </div>

          {/* Sheet Footer */}
          <div className="border-t border-stone-850 bg-stone-900/30 p-4 text-center text-[11px] text-stone-500 flex items-center justify-between">
            <span>صفحة {currentPage + 1} من {pages.length}</span>
            <span className="font-mono">bac-scientific-sciences-experimental</span>
            <span>بوابة البكالوريا الالكترونية © 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
