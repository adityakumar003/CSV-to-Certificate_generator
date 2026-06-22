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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-950/95 backdrop-blur-md shadow-2xl shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Count */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
            <span className="text-green-400 text-lg">🎓</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">
              {certificates.length} Certificate{certificates.length !== 1 ? 's' : ''} Ready
            </p>
            <p className="text-gray-500 text-xs">High-resolution PNG · 1400×990px</p>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onReset}
            id="start-over-btn"
            className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-600"
          >
            ← Start Over
          </button>

          <button
            onClick={handleZipDownload}
            disabled={isZipping}
            id="download-all-zip-btn"
            className="flex-1 sm:flex-none px-6 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-400/40 transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isZipping ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Zipping…
              </>
            ) : (
              <>↓ Download All as ZIP</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
