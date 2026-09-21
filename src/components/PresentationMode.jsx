import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  Sparkles, 
  Clock 
} from 'lucide-react';
import { DEMO_STEPS } from '../core/demoSteps.js';

export default function PresentationMode({ 
  isActive, 
  onClose, 
  onStepChange, 
  onTriggerAiTask 
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(8);

  const activeStepData = DEMO_STEPS[currentStep];

  // Auto-advance steps when playing
  useEffect(() => {
    if (!isActive) return;

    if (onStepChange) {
      onStepChange(activeStepData);
    }

    if (activeStepData.step === 8) {
      if (onTriggerAiTask) {
        onTriggerAiTask("Find the Login button and log me in.");
      }
    }
  }, [currentStep, isActive]);

  useEffect(() => {
    if (!isActive || !isPlaying) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (currentStep < DEMO_STEPS.length - 1) {
            setCurrentStep(c => c + 1);
            return 9;
          } else {
            setIsPlaying(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPlaying, currentStep]);

  if (!isActive) return null;

  const handleNext = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      setCurrentStep(s => s + 1);
      setSecondsRemaining(9);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
      setSecondsRemaining(9);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-[#0f1422] border-2 border-amber-500 rounded-lg shadow-2xl p-3.5 text-white font-mono text-xs">
        {/* Top bar with progress and close */}
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="font-bold text-amber-400 uppercase tracking-wider">
              2-Min Demo Tour: Step {currentStep + 1} of {DEMO_STEPS.length}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Next in {secondsRemaining}s
            </span>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-0.5"
              title="Exit Demo Mode"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-0.5 mb-2">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {activeStepData.title}
          </h3>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            {activeStepData.description}
          </p>
        </div>

        {/* Step Navigation & Controls */}
        <div className="flex items-center justify-between pt-1.5 border-t border-slate-800">
          <div className="flex items-center space-x-1">
            {DEMO_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => {
                  setCurrentStep(idx);
                  setSecondsRemaining(9);
                }}
                className={`w-4 h-1.5 rounded transition-all cursor-pointer ${
                  idx === currentStep 
                    ? 'bg-amber-400 w-6' 
                    : idx < currentStep 
                      ? 'bg-emerald-500' 
                      : 'bg-slate-700'
                }`}
                title={`Jump to step ${s.step}`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 cursor-pointer"
            >
              <SkipBack className="w-3 h-3" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === DEMO_STEPS.length - 1}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 cursor-pointer"
            >
              <SkipForward className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
