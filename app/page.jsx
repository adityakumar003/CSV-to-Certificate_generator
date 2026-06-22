'use client'

import { useState, useCallback } from 'react'
import CSVUploader from '@/components/CSVUploader'
import EventConfigForm from '@/components/EventConfigForm'
import PreviewGrid from '@/components/PreviewGrid'
import DownloadBar from '@/components/DownloadBar'
import { generateCertificate } from '@/lib/generateCertificate'

const STEPS = [
  { id: 1, label: 'Upload CSV', icon: '01' },
  { id: 2, label: 'Configure Event', icon: '02' },
  { id: 3, label: 'Preview & Download', icon: '03' },
]

export default function Home() {
  const [participants, setParticipants] = useState([])
  const [eventConfig, setEventConfig] = useState({
    eventName: 'Awaara Run 2025',
    eventDate: '',
    tagline: 'Keep Running, Keep Growing',
    template: 'Classic',
  })
  const [certificates, setCertificates] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [step, setStep] = useState(1)

  const handleParticipantsParsed = useCallback((data) => {
    setParticipants(data)
  }, [])

  const handleGenerate = async () => {
    if (participants.length === 0) return
    setIsGenerating(true)
    setGenerationProgress(0)
    const results = []

    for (let i = 0; i < participants.length; i++) {
      const cert = await generateCertificate(participants[i], eventConfig)
      results.push(cert)
      setGenerationProgress(Math.round(((i + 1) / participants.length) * 100))
    }

    setCertificates(results)
    setIsGenerating(false)
    setStep(3)
  }

  const handleReset = () => {
    setParticipants([])
    setEventConfig({
      eventName: 'Awaara Run 2025',
      eventDate: '',
      tagline: 'Keep Running, Keep Growing',
      template: 'Classic',
    })
    setCertificates([])
    setIsGenerating(false)
    setGenerationProgress(0)
    setStep(1)
  }

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: '#0a0000' }}
    >
      {/* Ambient red glow — top left */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 0% 0%, rgba(160,0,0,0.22) 0%, transparent 70%)',
        }}
      />

      {/* ─── HEADER ─── */}
      <header
        className="relative z-40 sticky top-0"
        style={{
          background: 'rgba(8,0,0,0.92)',
          borderBottom: '1px solid rgba(180,0,0,0.3)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            {/* Red accent stripe */}
            <div className="hidden sm:block w-1 h-10 bg-red-700 flex-shrink-0" />
            <div>
              <h1
                className="text-lg sm:text-xl font-black tracking-widest uppercase text-white leading-tight"
                style={{ fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.14em' }}
              >
                Awaara Run Club
                <span className="text-red-600 mx-2">/</span>
                <span className="text-red-500">Certificate Generator</span>
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Built by{' '}
                <span className="text-red-400 font-semibold">Aditya Kumar Singh</span>
                {' · '}
                <a
                  href="mailto:aditya.kr.singh0306@gmail.com"
                  className="hover:text-red-400 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  aditya.kr.singh0306@gmail.com
                </a>
              </p>
            </div>
          </div>
          <span
            className="text-xs tracking-widest uppercase hidden sm:block"
            style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em' }}
          >
            100% browser-based · No data leaves your device
          </span>
        </div>
      </header>

      {/* ─── STEP INDICATOR ─── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 w-full">
        <div className="flex items-center justify-center gap-0">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => {
                  if (s.id < step || (s.id === 2 && participants.length > 0)) {
                    setStep(s.id)
                  }
                }}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-300"
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  letterSpacing: '0.18em',
                  fontSize: '11px',
                  color:
                    step === s.id
                      ? '#ffffff'
                      : step > s.id
                        ? '#cc0000'
                        : 'rgba(255,255,255,0.25)',
                  cursor:
                    s.id < step || (s.id === 2 && participants.length > 0)
                      ? 'pointer'
                      : step === s.id
                        ? 'default'
                        : 'not-allowed',
                  borderBottom:
                    step === s.id
                      ? '2px solid #cc0000'
                      : '2px solid transparent',
                  paddingBottom: '6px',
                }}
              >
                <span
                  style={{
                    color: step === s.id ? '#cc0000' : step > s.id ? '#cc0000' : 'rgba(255,255,255,0.2)',
                    fontFamily: 'monospace',
                    fontSize: '10px',
                  }}
                >
                  {step > s.id ? '✓' : `[${s.icon}]`}
                </span>
                <span className="hidden sm:block">{s.label}</span>
                <span className="sm:hidden">Step {s.id}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div
                  className="w-10 h-px mx-1"
                  style={{
                    background: step > s.id ? '#cc0000' : 'rgba(255,255,255,0.1)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">

        {/* Step 1: Upload CSV */}
        {step === 1 && (
          <div className="animate-slide-up">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <p
                  className="text-xs tracking-widest uppercase mb-2"
                  style={{ color: '#cc0000', fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.2em' }}
                >
                  [ Step 01 ]
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-black uppercase text-white leading-none"
                  style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
                >
                  Upload Participant List
                </h2>
                <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Upload a CSV file with your participants' names, bib numbers, and race categories.
                </p>
              </div>
              <CSVUploader onParsed={handleParticipantsParsed} />
              {participants.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setStep(2)}
                    className="group relative px-10 py-3 font-black text-sm tracking-widest uppercase text-white transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      fontFamily: '"Barlow Condensed", sans-serif',
                      letterSpacing: '0.2em',
                      background: '#cc0000',
                      clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                    }}
                  >
                    Continue to Configure →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Configure Event */}
        {step === 2 && (
          <div className="animate-slide-up">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <p
                  className="text-xs tracking-widest uppercase mb-2"
                  style={{ color: '#cc0000', fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.2em' }}
                >
                  [ Step 02 ]
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-black uppercase text-white leading-none"
                  style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
                >
                  Configure Your Event
                </h2>
                <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Customize the certificate details and choose a template style.
                </p>
              </div>
              <EventConfigForm config={eventConfig} onChange={setEventConfig} />

              <div className="mt-8">
                {isGenerating ? (
                  <div
                    className="p-6"
                    style={{
                      background: 'rgba(12,0,0,0.9)',
                      border: '1px solid rgba(204,0,0,0.3)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-sm font-bold tracking-widest uppercase"
                        style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em' }}
                      >
                        Generating {participants.length} certificates...
                      </span>
                      <span className="font-black text-red-500" style={{ fontFamily: '"Barlow Condensed", sans-serif' }}>
                        {generationProgress}%
                      </span>
                    </div>
                    <div
                      className="w-full h-1.5 overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.07)' }}
                    >
                      <div
                        className="h-full transition-all duration-300"
                        style={{ width: `${generationProgress}%`, background: '#cc0000' }}
                      />
                    </div>
                    <p
                      className="text-xs mt-3 text-center tracking-widest uppercase"
                      style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}
                    >
                      Please wait while we render each certificate on canvas…
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 font-bold text-xs tracking-widest uppercase transition-all duration-200 w-full sm:w-auto"
                      style={{
                        fontFamily: '"Barlow Condensed", sans-serif',
                        letterSpacing: '0.2em',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.5)',
                      }}
                    >
                      ← Back
                    </button>
                    <div className="text-center">
                      <p
                        className="text-xs mb-3 tracking-widest uppercase"
                        style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}
                      >
                        {participants.length} participants loaded
                      </p>
                      <button
                        onClick={handleGenerate}
                        disabled={!eventConfig.eventName || !eventConfig.eventDate}
                        className="px-12 py-4 font-black text-sm tracking-widest uppercase text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
                        style={{
                          fontFamily: '"Barlow Condensed", sans-serif',
                          letterSpacing: '0.2em',
                          background: !eventConfig.eventName || !eventConfig.eventDate ? 'rgba(100,0,0,0.4)' : '#cc0000',
                          clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                        }}
                      >
                        🎓 Generate Certificates
                      </button>
                      {(!eventConfig.eventName || !eventConfig.eventDate) && (
                        <p
                          className="text-xs mt-2 tracking-wider"
                          style={{ color: 'rgba(255,180,0,0.7)', letterSpacing: '0.05em' }}
                        >
                          Please fill in Event Name and Date to continue
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preview & Download */}
        {step === 3 && (
          <div className="animate-slide-up pb-28">
            <div className="mb-8">
              <p
                className="text-xs tracking-widest uppercase mb-2"
                style={{ color: '#cc0000', fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.2em' }}
              >
                [ Step 03 ]
              </p>
              <h2
                className="text-4xl sm:text-5xl font-black uppercase text-white leading-none"
                style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
              >
                Your Certificates Are Ready!
              </h2>
              <p
                className="mt-3 text-sm"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {certificates.length} certificates generated · Click to download individually or get all as a ZIP
              </p>
            </div>
            <PreviewGrid certificates={certificates} />
            <DownloadBar certificates={certificates} onReset={handleReset} />
          </div>
        )}
      </main>

      {/* ─── FOOTER ─── */}
      <footer
        className="relative z-10 mt-auto"
        style={{
          background: 'rgba(5,0,0,0.95)',
          borderTop: '1px solid rgba(180,0,0,0.2)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em' }}
            >
              © 2025 Awaara Run Club
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              Built by Aditya Kumar Singh· aditya.kr.singh0306@gmail.com
            </p>
          </div>
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            id="built-for-digital-heroes-btn"
            className="inline-flex items-center gap-2 px-7 py-3 text-xs font-black tracking-widest uppercase text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              letterSpacing: '0.2em',
              background: '#cc0000',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
            }}
          >
            🚀 Built for Digital Heroes
          </a>
        </div>
      </footer>
    </div>
  )
}
