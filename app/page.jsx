'use client'

import { useState, useCallback } from 'react'
import CSVUploader from '@/components/CSVUploader'
import EventConfigForm from '@/components/EventConfigForm'
import PreviewGrid from '@/components/PreviewGrid'
import DownloadBar from '@/components/DownloadBar'
import { generateCertificate } from '@/lib/generateCertificate'

const STEPS = [
  { id: 1, label: 'Upload CSV', icon: '📄' },
  { id: 2, label: 'Configure Event', icon: '⚙️' },
  { id: 3, label: 'Preview & Download', icon: '🎓' },
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
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent leading-tight">
              Awaara Run Club — Certificate Generator
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Built by <span className="text-orange-400 font-medium">Aditya Kumar</span>
              {' · '}
              <a href="mailto:adityakumar8303000000@gmail.com" className="text-gray-300 hover:text-orange-400 transition-colors">
                adityakumar8303000000@gmail.com
              </a>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 hidden sm:block">100% browser-based · No data leaves your device</span>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 w-full">
        <div className="flex items-center justify-center gap-0">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => {
                  if (s.id < step || (s.id === 2 && participants.length > 0)) {
                    setStep(s.id)
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  step === s.id
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : step > s.id
                    ? 'bg-gray-800 text-green-400 cursor-pointer hover:bg-gray-700'
                    : 'bg-gray-900 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="text-base">{step > s.id ? '✓' : s.icon}</span>
                <span className="hidden sm:block">{s.label}</span>
                <span className="sm:hidden">Step {s.id}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 transition-colors duration-300 ${step > s.id ? 'bg-orange-500' : 'bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">

        {/* Step 1: Upload CSV */}
        {step === 1 && (
          <div className="animate-slide-up">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Upload Participant List</h2>
                <p className="text-gray-400">Upload a CSV file with your participants' names, bib numbers, and race categories.</p>
              </div>
              <CSVUploader onParsed={handleParticipantsParsed} />
              {participants.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setStep(2)}
                    className="px-8 py-3 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-400/40 transition-all duration-200 hover:scale-105 active:scale-95"
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
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Configure Your Event</h2>
                <p className="text-gray-400">Customize the certificate details and choose a template style.</p>
              </div>
              <EventConfigForm config={eventConfig} onChange={setEventConfig} />

              <div className="mt-8">
                {isGenerating ? (
                  <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-300 font-medium">
                        Generating {participants.length} certificates...
                      </span>
                      <span className="text-orange-400 font-bold">{generationProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                    <p className="text-gray-500 text-sm mt-3 text-center">Please wait while we render each certificate on canvas…</p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition-all duration-200 w-full sm:w-auto"
                    >
                      ← Back
                    </button>
                    <div className="text-center">
                      <p className="text-gray-500 text-sm mb-2">{participants.length} participants loaded</p>
                      <button
                        onClick={handleGenerate}
                        disabled={!eventConfig.eventName || !eventConfig.eventDate}
                        className="px-10 py-4 bg-orange-500 hover:bg-orange-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-400/40 transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 disabled:shadow-none"
                      >
                        🎓 Generate Certificates
                      </button>
                      {(!eventConfig.eventName || !eventConfig.eventDate) && (
                        <p className="text-amber-500 text-xs mt-2">Please fill in Event Name and Date to continue</p>
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
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Your Certificates Are Ready! 🎉</h2>
              <p className="text-gray-400">
                {certificates.length} certificates generated · Click to download individually or get all as a ZIP
              </p>
            </div>
            <PreviewGrid certificates={certificates} />
            <DownloadBar certificates={certificates} onReset={handleReset} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-gray-400 text-sm">© 2025 Awaara Run Club</p>
            <p className="text-gray-600 text-xs mt-0.5">
              Built by Aditya Kumar · adityakumar8303000000@gmail.com
            </p>
          </div>
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            id="built-for-digital-heroes-btn"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-400/35 transition-all duration-200 hover:scale-105 active:scale-95 text-sm"
          >
            🚀 Built for Digital Heroes
          </a>
        </div>
      </footer>
    </div>
  )
}
