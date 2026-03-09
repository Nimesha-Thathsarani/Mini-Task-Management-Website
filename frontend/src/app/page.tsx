import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-purple-500/30 overflow-hidden font-sans relative">
      {/* Background Effects */}
      <div className="absolute w-[800px] h-[800px] bg-purple-200/60 rounded-full blur-[150px] top-[-20%] left-[-10%] pointer-events-none animate-pulse"></div>
      <div className="absolute w-[600px] h-[600px] bg-orange-100/60 rounded-full blur-[120px] bottom-[-10%] right-[-10%] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-x-0 bottom-0 h-[600px] bg-gradient-to-t from-purple-50/80 to-transparent pointer-events-none"></div>

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-sm">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Mini Task</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors px-2 py-2 sm:px-4"
            >
              Log In
            </Link>
            <Link 
              href="/register" 
              className="text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full transition-all hover:shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto relative z-10 text-center lg:text-left">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Copy */}
          <div className="space-y-8 relative z-20 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 pb-2">
             Organize your work,<br />Complete tasks faster.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-lg leading-relaxed font-normal mx-auto lg:mx-0">
              Stay organized by managing your tasks, tracking progress, and completing your goals efficiently - all in one place.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link 
                href="/register" 
                className="flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#ff7e4f] text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-orange-500/20 transform transition-all hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
              
            </div>
            
            <div className="pt-12 grid grid-cols-2 gap-8 lg:gap-6 border-t border-slate-200/60 w-full">
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-slate-900">10x</h3>
                <p className="text-sm text-slate-500 font-medium">Better Task Management</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-slate-900">100%</h3>
                <p className="text-sm text-slate-500 font-medium">Improved Productivity</p>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Abstract */}
          <div className="relative h-[600px] hidden lg:block" style={{ perspective: '1000px' }}>
             {/* 3D-like geometric composition */}
             <div className="absolute inset-0 flex items-center justify-center">
                {/* Main clean block */}
                <div className="w-[340px] h-[420px] bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] relative z-20 overflow-hidden transform rotate-[-3deg] hover:rotate-0 transition-transform duration-700">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.8)_50%,transparent_100%)] w-[200%] animate-[shimmer_3s_infinite] -left-[100%]"></div>
                  <div className="p-8 h-full flex flex-col gap-6 relative z-10">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center shadow-sm">
                      <Layers className="text-purple-600" size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">Smart Task Management</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">Create, organize, and prioritize your tasks with ease and efficiency.</p>
                    </div>
                    {/* Mock UI elements */}
                    <div className="mt-auto space-y-4">
                      <div className="h-3 w-full bg-slate-100 rounded-full"></div>
                      <div className="h-3 w-3/4 bg-slate-100 rounded-full"></div>
                      <div className="h-3 w-5/6 bg-slate-100 rounded-full"></div>
                      <div className="h-3 w-1/2 bg-slate-100 rounded-full mt-6"></div>
                    </div>
                  </div>
                </div>

                {/* Background block 1 */}
                <div className="absolute w-[280px] h-[280px] bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] z-10 right-[-5%] top-[5%] transform rotate-[8deg]"></div>
             </div>
          </div>
        </div>
      </main>

      {/* Global generic keyframes for tailwind classes if needed */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { left: 100%; }
        }
      `}} />
    </div>
  );
}
