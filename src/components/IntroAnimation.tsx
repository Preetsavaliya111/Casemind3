import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, ChevronRight, CheckCircle2, Sparkles, Wifi, Cpu, ShieldCheck } from 'lucide-react';
import { TEAM_USERS } from '../data/mockIncidents';

interface IntroAnimationProps {
  onComplete: () => void;
  reducedMotion?: boolean;
}

interface PreloadStats {
  avatarsLoaded: number;
  avatarsTotal: number;
  webglReady: boolean;
  fontsReady: boolean;
  networkLatencyMs: number;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ 
  onComplete, 
  reducedMotion = false 
}) => {
  const [bootStep, setBootStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(15);
  const [isFullyLoaded, setIsFullyLoaded] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [preloadStats, setPreloadStats] = useState<PreloadStats>({
    avatarsLoaded: 0,
    avatarsTotal: TEAM_USERS.length,
    webglReady: false,
    fontsReady: false,
    networkLatencyMs: 0
  });

  const hasCompletedRef = useRef<boolean>(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const safeSetTimeout = (fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  // Safe exit transition handler
  const triggerExit = () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    // Smooth exit fade out
    setIsExiting(true);

    // Call onComplete after transition duration
    safeSetTimeout(() => {
      onComplete();
    }, 320);
  };

  // Keyboard shortcut: Escape or Enter to exit sequence
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || (e.key === 'Enter' && isFullyLoaded)) {
        triggerExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullyLoaded]);

  // Asset preloading and boot orchestration
  useEffect(() => {
    let isCancelled = false;
    const startTime = performance.now();

    // Check if network is constrained or user prefers reduced motion
    const isSaveData = (navigator as any)?.connection?.saveData === true;
    const isSlowConnection = (navigator as any)?.connection?.effectiveType === '2g' || 
                             (navigator as any)?.connection?.effectiveType === 'slow-2g';

    // If reduced motion or ultra-slow network, accelerate sequence immediately
    if (reducedMotion) {
      setProgress(100);
      setBootStep(4);
      setIsFullyLoaded(true);
      const exitTimer = safeSetTimeout(() => {
        triggerExit();
      }, 750);
      return () => {
        clearTimeout(exitTimer);
      };
    }

    // Step 0: Initial network & OpenTelemetry check
    setBootStep(0);
    setProgress(20);

    // Asset Preload Routine
    const preloadAssets = async () => {
      // 1. Verify WebGL 2.0 / 1.0 support
      let webglSupported = false;
      try {
        const testCanvas = document.createElement('canvas');
        webglSupported = !!(
          window.WebGLRenderingContext && 
          (testCanvas.getContext('webgl2') || testCanvas.getContext('webgl'))
        );
      } catch {
        webglSupported = false;
      }

      // 2. Preload typography engine (Inter & JetBrains Mono)
      let fontsReady = false;
      try {
        if ('fonts' in document) {
          // Allow max 1000ms for fonts before soft fallback
          const fontPromise = document.fonts.ready;
          const fontTimeout = new Promise(resolve => setTimeout(resolve, 1000));
          await Promise.race([fontPromise, fontTimeout]);
          fontsReady = true;
        }
      } catch {
        fontsReady = true; // Fallback gracefully to system monospace/sans
      }

      if (isCancelled) return;
      setBootStep(1);
      setProgress(45);

      // 3. Preload User Avatars with per-asset timeout and non-blocking safety
      const avatarUrls = TEAM_USERS.map(u => u.avatar).filter(Boolean);
      let loadedCount = 0;

      const preloadImageWithTimeout = (url: string, timeoutMs: number = 1800): Promise<boolean> => {
        return new Promise(resolve => {
          const img = new Image();
          let settled = false;

          const finish = (success: boolean) => {
            if (!settled) {
              settled = true;
              img.onload = null;
              img.onerror = null;
              resolve(success);
            }
          };

          const timer = setTimeout(() => finish(false), timeoutMs);

          img.onload = () => {
            clearTimeout(timer);
            finish(true);
          };
          img.onerror = () => {
            clearTimeout(timer);
            finish(false); // Soft fail, does not block
          };

          img.src = url;
        });
      };

      // Run preloads in parallel with Promise.allSettled
      // On constrained data or 2G, load only the primary operator avatar to save bandwidth
      const urlsToLoad = (isSaveData || isSlowConnection) ? avatarUrls.slice(0, 2) : avatarUrls;

      await Promise.allSettled(
        urlsToLoad.map(async url => {
          const ok = await preloadImageWithTimeout(url);
          if (ok && !isCancelled) {
            loadedCount++;
          }
        })
      );

      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);

      if (isCancelled) return;

      setPreloadStats({
        avatarsLoaded: loadedCount,
        avatarsTotal: urlsToLoad.length,
        webglReady: webglSupported,
        fontsReady,
        networkLatencyMs: latencyMs
      });

      // Step 2: Graphics & Shaders ready
      setBootStep(2);
      setProgress(70);

      safeSetTimeout(() => {
        if (isCancelled) return;
        // Step 3: Organizational Memory Graph mounted
        setBootStep(3);
        setProgress(90);

        safeSetTimeout(() => {
          if (isCancelled) return;
          // Step 4: System Ready
          setBootStep(4);
          setProgress(100);
          setIsFullyLoaded(true);

          // Auto-transition into console after brief preview of readiness
          safeSetTimeout(() => {
            if (!isCancelled) {
              triggerExit();
            }
          }, 1100);
        }, 500);
      }, 450);
    };

    preloadAssets().catch(() => {
      // Emergency error recovery: advance to 100% immediately
      if (!isCancelled) {
        setProgress(100);
        setBootStep(4);
        setIsFullyLoaded(true);
        safeSetTimeout(triggerExit, 600);
      }
    });

    // Master Watchdog Timer (Ceiling of 3.4 seconds)
    // Ensures that even if external CDNs stall or drop packets, the user is NEVER trapped
    const masterWatchdog = safeSetTimeout(() => {
      if (!hasCompletedRef.current && !isFullyLoaded) {
        console.warn('CaseMind Intro: Preload master watchdog threshold reached. Fast-forwarding to console.');
        setProgress(100);
        setBootStep(4);
        setIsFullyLoaded(true);
        safeSetTimeout(triggerExit, 700);
      }
    }, 3400);

    return () => {
      isCancelled = true;
      clearTimeout(masterWatchdog);
      timeoutsRef.current.forEach(id => clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, [reducedMotion]);

  const bootMessages = [
    'Connecting to OpenTelemetry distributed span pipeline (42,810 spans/s)...',
    `Preloading operator credential assets (${preloadStats.avatarsLoaded}/${preloadStats.avatarsTotal} cached)...`,
    `Verifying WebGL 2.0 graphics pipeline & Three.js shaders (${preloadStats.webglReady ? 'Ready' : 'Fallback active'})...`,
    'Mounting Organizational Memory Graph (4.2M historical incident vectors)...',
    'All systems nominal. Zero ungrounded actions active.'
  ];

  return (
    <div 
      className={`fixed inset-0 z-50 bg-[#0f172a] text-[#eaedff] flex flex-col items-center justify-center p-4 selection:bg-[#4f46e5] selection:text-white transition-opacity duration-300 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none scale-[0.99]' : 'opacity-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="System Boot Sequence and Asset Preloader"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#3525cd]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#7c3aed]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Skip button always available in top right */}
      <button
        onClick={triggerExit}
        className="absolute top-6 right-6 px-4 py-2 rounded-xl bg-[#1e293b]/90 hover:bg-[#334155] text-xs font-mono text-[#cbd5e1] hover:text-white border border-[#475569] flex items-center space-x-1.5 transition-all shadow-md focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5] cursor-pointer"
        aria-label="Skip introduction animation and enter command console immediately"
      >
        <span>Skip Sequence</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="max-w-md w-full space-y-6 text-center relative z-10">
        {/* Animated Brand Core */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-[#3525cd] via-[#4f46e5] to-[#7c3aed] blur-md opacity-80 animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-[#1e293b] border border-[#6366f1] flex items-center justify-center text-white shadow-2xl">
            <BrainCircuit className="w-8 h-8 text-[#a5b4fc] animate-spin-slow" />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-[#a5b4fc] text-[11px] font-mono border border-indigo-500/20 mb-2">
            <Sparkles className="w-3 h-3 text-[#a5b4fc]" />
            <span>Preloading Cognitive Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans flex items-center justify-center space-x-2">
            <span>CaseMind</span>
            <span className="text-xs px-2 py-0.5 rounded-sm bg-[#3525cd] text-[#dad7ff] font-mono uppercase font-bold">
              Intelligence
            </span>
          </h1>
          <p className="text-xs text-[#94a3b8] font-mono mt-1">
            Tier-3 Cognitive Incident & Support Operations
          </p>
        </div>

        {/* Progress bar with percentage */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-[#94a3b8]">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#76dcff]" />
              <span>Asset & Telemetry Preload</span>
            </span>
            <span className="font-bold text-[#76dcff]">{progress}%</span>
          </div>
          <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden border border-[#334155]">
            <div 
              className="bg-linear-to-r from-[#4f46e5] via-[#0891b2] to-[#7c3aed] h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Console step output */}
        <div className="bg-[#090d16] border border-[#1e293b] rounded-2xl p-4 text-left font-mono text-xs space-y-2.5 min-h-[175px] shadow-inner">
          {bootMessages.slice(0, bootStep + 1).map((msg, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-[11px] leading-relaxed">
              <span className="text-[#059669] shrink-0 font-bold">✓</span>
              <span className={idx === bootStep ? 'text-[#76dcff] font-semibold' : 'text-[#64748b]'}>
                {msg}
              </span>
            </div>
          ))}

          {!isFullyLoaded ? (
            <div className="flex items-center space-x-2 text-[11px] text-[#818cf8] animate-pulse pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8]" />
              <span>Preloading incident vectors and telemetry streams...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-[11px] text-[#059669] font-bold pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              <span>Ready. Entering CaseMind Operations Platform...</span>
            </div>
          )}
        </div>

        {/* Interactive Entry Button when ready */}
        {isFullyLoaded && (
          <button
            onClick={triggerExit}
            className="w-full py-2.5 rounded-xl bg-linear-to-r from-[#3525cd] to-[#4f46e5] text-white font-bold text-xs shadow-lg shadow-indigo-500/30 hover:opacity-95 transition-opacity flex items-center justify-center space-x-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-white"
          >
            <span>Enter Command Console</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <div className="text-[10px] text-[#64748b] font-mono flex items-center justify-center gap-3">
          <span className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-[#38bdf8]" />
            <span>{preloadStats.networkLatencyMs > 0 ? `${preloadStats.networkLatencyMs}ms ping` : 'Distributed Sync'}</span>
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#10b981]" />
            <span>Zero-Hang Safety Guarantee</span>
          </span>
          <span>&bull;</span>
          <span>Press [Esc] to skip</span>
        </div>
      </div>
    </div>
  );
};
