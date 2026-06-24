import React, { useState, useEffect } from 'react';
import { Clock, Star, Award } from 'lucide-react';

export default function CountdownHeader() {
  // Target: Baccalaureate Exam - June 13, 2027 at 08:00:00
  const targetDate = new Date('2027-06-13T08:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  const [motivationIndex, setMotivationIndex] = useState(0);

  const motivations = [
    "النجاح لا يأتي بالصدفة، بل بالعمل المستمر والتركيز! 🎯",
    "أنت تستطيع تجاوز هذا التحدي بجدارة وثقة عالية! 💪",
    "كل ساعة دراسة تقربك خطوة إضافية نحو تخصص أحلامك! 🎓",
    "تذكر دائماً فرحة والديك يوم الإعلان عن النتائج! 🧡",
    "البكالوريا مجرد محطة، وأنت مسلح بالجد والمثابرة لتخطيها! ✨"
  ];

  useEffect(() => {
    // Setup interval for countdown
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, isOver: false });
      }
    }, 1000);

    // Swap motivation index every 10 seconds
    const motivationInterval = setInterval(() => {
      setMotivationIndex((prev) => (prev + 1) % motivations.length);
    }, 12000);

    return () => {
      clearInterval(interval);
      clearInterval(motivationInterval);
    };
  }, []);

  return (
    <div className="w-full bg-stone-900 border-b border-stone-800 text-stone-100 py-3.5 px-4 md:px-8 relative overflow-hidden" id="countdown-banner">
      {/* Background glow lines */}
      <div className="absolute top-0 right-0 h-full w-[25%] bg-sky-500/5 blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Title & MOTIVATIONAL MSG */}
        <div className="flex items-center gap-3 text-right">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
            <Award className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-sky-950/80 border border-sky-800/40 text-sky-300 font-bold px-2.5 py-0.5 rounded-full select-none">
                امتحانات بكالوريا 2027
              </span>
              <h2 className="text-sm font-bold text-white font-sans">العد التنازلي الحاسم</h2>
            </div>
            <p className="text-xs text-stone-400 mt-1 transition-all duration-500 font-medium">
              {motivations[motivationIndex]}
            </p>
          </div>
        </div>

        {/* TIME CELLS */}
        <div className="flex items-center gap-2.5 md:gap-4 ml-0 lg:ml-4 select-none">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="min-w-[54px] md:min-w-[64px] bg-stone-950 border border-stone-800 rounded-lg p-2 text-center shadow-inner relative">
              <span className="text-base md:text-lg font-black text-white font-mono block">
                {String(timeLeft.days).padStart(3, '0')}
              </span>
              <span className="text-[9px] text-stone-500 font-semibold block mt-0.5">يوم</span>
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-stone-900/40"></div>
            </div>
          </div>

          <span className="text-xl font-bold text-sky-500 animate-pulse">:</span>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="min-w-[50px] md:min-w-[54px] bg-stone-950 border border-stone-800 rounded-lg p-2 text-center shadow-inner relative">
              <span className="text-base md:text-lg font-black text-sky-400 font-mono block">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-stone-500 font-semibold block mt-0.5">ساعة</span>
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-stone-900/40"></div>
            </div>
          </div>

          <span className="text-xl font-bold text-sky-500 animate-pulse">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="min-w-[50px] md:min-w-[54px] bg-stone-950 border border-stone-800 rounded-lg p-2 text-center shadow-inner relative">
              <span className="text-base md:text-lg font-black text-sky-400 font-mono block">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-stone-500 font-semibold block mt-0.5">دقيقة</span>
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-stone-900/40"></div>
            </div>
          </div>

          <span className="text-xl font-bold text-sky-500 animate-pulse">:</span>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="min-w-[50px] md:min-w-[54px] bg-sky-500/10 border border-sky-500/30 rounded-lg p-2 text-center shadow-inner relative">
              <span className="text-base md:text-lg font-black text-sky-400 font-mono block animate-none">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-sky-500/70 font-semibold block mt-0.5">ثانية</span>
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-sky-500/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
