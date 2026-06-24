import React, { useState, useMemo } from 'react';
import { BOOKS, SUBJECTS } from '../data';
import { SubjectId, Book } from '../types';
import { 
  BookOpen, 
  Library, 
  User, 
  Calendar, 
  Search, 
  ChevronLeft, 
  HelpCircle, 
  FileText, 
  Layers,
  Sparkles
} from 'lucide-react';

interface BookSectionProps {
  onOpenDocument: (document: { type: 'exam' | 'book'; data: any; isSolution?: boolean }) => void;
}

export default function BookSection({ onOpenDocument }: BookSectionProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter books based on active selections
  const filteredBooks = useMemo(() => {
    return BOOKS.filter(book => {
      const matchSubject = selectedSubjectId === 'all' || book.subjectId === selectedSubjectId;
      const matchQuery = searchQuery === '' || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchQuery;
    });
  }, [selectedSubjectId, searchQuery]);

  return (
    <div className="space-y-8 py-2 animate-fade-in text-right">

      {/* 🔴 ROW FILTER + SEARCH BOARD */}
      <div className="flex flex-col md:flex-row gap-5 items-center justify-between bg-stone-900/40 p-6 rounded-2xl border border-stone-850">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="ابحث بـاسم الكتاب أو المؤلف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pr-10 pl-4 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-sky-500 text-right font-medium"
            id="book-search-input"
          />
        </div>

        {/* Subjects filters */}
        <div className="w-full md:w-auto flex items-center gap-3 overflow-x-auto py-1 scrollbar-none flex-row-reverse">
          <span className="text-xs font-bold text-stone-400 shrink-0">المادة الدراسية:</span>
          <div className="flex gap-1.5 flex-row-reverse">
            <button
              onClick={() => setSelectedSubjectId('all')}
              className={`rounded-lg px-3 py-1.5 text-xs transition border cursor-pointer font-bold ${selectedSubjectId === 'all' ? 'bg-sky-500 text-stone-950 border-sky-500' : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'}`}
              id="book-filter-all"
            >
              الكل
            </button>
            {SUBJECTS.filter(s => BOOKS.some(b => b.subjectId === s.id)).map(sub => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`rounded-lg px-3 py-1.5 text-xs transition border cursor-pointer font-bold ${selectedSubjectId === sub.id ? 'bg-sky-500 text-stone-900 border-sky-550' : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'}`}
                id={`book-filter-${sub.id}`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔴 INTRO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-l from-stone-950 to-stone-900 border border-stone-850 p-6 rounded-2xl flex flex-col md:flex-row-reverse justify-between items-center gap-4">
        <div className="absolute top-0 left-0 h-full w-[20%] bg-sky-500/5 blur-3xl pointer-events-none"></div>
        <div className="space-y-1 text-right">
          <h4 className="text-sm font-black text-white flex items-center gap-2 flex-row-reverse">
            <Library size={18} className="text-sky-400" />
            <span>خزانة المراجع والكتب الخارجية للأساتذة</span>
          </h4>
          <p className="text-stone-400 text-xs leading-relaxed max-w-xl">
            حقيبة تعليمية رقمية متكاملة تضم أفضل السلاسل والكتب الخارجية بصيغتها التفاعلية. تصفح الفصول والدروس واطبع الملخصات مباشرة.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-stone-900 border border-stone-850 px-3 py-1.5 rounded-xl text-sky-400 select-none">
          {filteredBooks.length} كتب متوفرة للمطالعة
        </span>
      </div>

      {/* 🔴 BOOK CARD GRID */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const sub = SUBJECTS.find(s => s.id === book.subjectId)!;
            return (
              <div
                key={book.id}
                className="group flex flex-col justify-between bg-stone-900 border border-stone-800/80 rounded-2xl overflow-hidden hover:border-stone-700 hover:shadow-2xl transition duration-300"
                id={`book-card-${book.id}`}
              >
                {/* Book Cover Frame (3:4 ratio for books) */}
                <div className="relative aspect-[3/4] bg-stone-950 overflow-hidden">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Color cover gradient mask */}
                  <div className="absolute inset-0 bg-stone-950/40 group-hover:bg-stone-950/60 transition-colors" />

                  {/* Top subject label float */}
                  <span className="absolute top-3.5 right-3.5 bg-stone-950/90 border border-stone-800 text-[9px] font-black text-sky-450 text-sky-400 px-2.5 py-1 rounded-full shadow-lg">
                    {sub.name}
                  </span>

                  {/* Centered book icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-14 w-14 rounded-full bg-stone-950/90 backdrop-blur border border-stone-800 flex items-center justify-center scale-90 group-hover:scale-100 group-hover:bg-sky-500 group-hover:text-stone-950 transition-all duration-350">
                      <BookOpen size={24} />
                    </div>
                  </div>

                  {/* Volume pages indicator float */}
                  <span className="absolute bottom-3.5 left-3.5 bg-stone-950/90 border border-stone-800 text-[9px] text-stone-400 px-2.5 py-1 rounded-full font-mono font-bold">
                    {book.pagesCount} صفحة
                  </span>
                </div>

                {/* Content body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Author line */}
                    <p className="text-[10px] text-stone-500 font-bold flex items-center gap-1 flex-row-reverse">
                      <User size={11} className="text-sky-500/80" />
                      <span>تأليف: {book.author}</span>
                    </p>

                    <h4 className="text-xs md:text-sm font-black text-stone-100 group-hover:text-sky-400 transition truncate mt-1">
                      {book.title}
                    </h4>

                    {/* Book description */}
                    <p className="text-[11px] text-stone-400 leading-relaxed line-clamp-3">
                      {book.description}
                    </p>
                  </div>

                  {/* Bottom Open action button */}
                  <div className="mt-4 pt-3.5 border-t border-stone-850">
                    <button
                      onClick={() => onOpenDocument({ type: 'book', data: book })}
                      className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-xl bg-sky-500/10 border border-sky-500/25 text-xs font-bold text-sky-400 hover:bg-sky-500/15 hover:text-sky-300 transition py-2.5"
                      id={`btn-read-book-${book.id}`}
                    >
                      <BookOpen size={14} />
                      <span>اقرأ وتصفح الكتاب الآن</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-stone-900/20 rounded-2xl border border-stone-850 p-12 text-center">
          <p className="text-stone-400 text-xs">لا توجد مصادر أو كتب خارجية مطابقة لمعايير التصفية والبحث الحالية.</p>
          <button
            onClick={() => { setSelectedSubjectId('all'); setSearchQuery(''); }}
            className="mt-4 rounded-lg bg-sky-500 text-stone-950 font-bold px-4 py-2 text-xs hover:bg-sky-400 transition"
            id="btn-books-reset"
          >
            إعادة التصفية
          </button>
        </div>
      )}

    </div>
  );
}
