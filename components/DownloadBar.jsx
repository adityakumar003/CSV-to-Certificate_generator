'use client'

import { useState } from 'react'
import { downloadAllAsZip } from '@/lib/zipDownload'

export default function DownloadBar({ certificates, onReset }) {
  const [isZipping, setIsZipping] = useState(false)

  const handleZipDownload = async () => {
    if (isZipping || !certificates.length) return
    setIsZipping(true)
    try {
      await downloadAllAsZip(certificates)
    } catch (err) {
      console.error('ZIP download failed:', err)
      alert('Failed to create ZIP. Please try downloading certificates individually.')
    } finally {
      setIsZipping(false)
    }
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(4,0,0,0.97)',
        borderTop: '1px solid rgba(204,0,0,0.4)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.8)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Left: count */}
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: 'rgba(204,0,0,0.15)', border: '1px solid rgba(204,0,0,0.3)' }}
          >
            🎓
          </div>
          <div>
            <p
              className="text-white font-black text-sm tracking-wide uppercase"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.1em' }}
            >
              {certificates.length} Certificate{certificates.length !== 1 ? 's' : ''} Ready
            </p>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: 'rgba(255,255,255,0.3)', fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.15em' }}
            >
              High-res PNG · 1400×990px
            </p>
          </div>
        </div>

        {/* Right: buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onReset}
            id="start-over-btn"
            className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              letterSpacing: '0.18em',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.45)',
              background: 'rgba(255,255,255,0.04)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
          >
            ← Start Over
          </button>

          <button
            onClick={handleZipDownload}
            disabled={isZipping}
            id="download-all-zip-btn"
            className="flex-1 sm:flex-none px-8 py-2.5 text-xs font-black tracking-widest uppercase text-white transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed"
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              letterSpacing: '0.2em',
              background: isZipping ? 'rgba(120,0,0,0.8)' : '#cc0000',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
            }}
          >
            {isZipping ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Zipping…
              </>
            ) : (
              '↓ Download All as ZIP'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
