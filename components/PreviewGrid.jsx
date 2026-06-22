'use client'

export default function PreviewGrid({ certificates }) {
  const handleDownloadSingle = (cert) => {
    const a = document.createElement('a')
    a.href = cert.url
    a.download = cert.name.replace(/\s+/g, '_') + '_certificate.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (!certificates || certificates.length === 0) {
    return (
      <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.2)' }}>
        <p className="text-4xl mb-3">📋</p>
        <p className="text-sm">No certificates to preview</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {certificates.map((cert, index) => (
        <div
          key={index}
          className="group animate-fade-in transition-all duration-200 overflow-hidden"
          style={{
            animationDelay: `${Math.min(index * 50, 500)}ms`,
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(8,0,0,0.85)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(204,0,0,0.5)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
        >
          {/* Certificate thumbnail */}
          <div className="relative bg-black overflow-hidden" style={{ aspectRatio: '1400/990' }}>
            <img
              src={cert.url}
              alt={`Certificate for ${cert.name}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
              style={{ background: 'rgba(0,0,0,0.65)' }}
            >
              <button
                onClick={() => handleDownloadSingle(cert)}
                id={`download-cert-${index}`}
                className="px-5 py-2 text-xs font-black tracking-widest uppercase text-white transition-all duration-200 scale-90 group-hover:scale-100"
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  letterSpacing: '0.2em',
                  background: '#cc0000',
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                }}
              >
                ↓ Download PNG
              </button>
            </div>
          </div>

          {/* Card footer */}
          <div
            className="px-4 py-3 flex items-center justify-between gap-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{cert.name}</p>
              <p
                className="text-xs tracking-widest"
                style={{
                  color: 'rgba(255,255,255,0.25)',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  letterSpacing: '0.15em',
                }}
              >
                #{String(index + 1).padStart(3, '0')}
              </p>
            </div>
            <button
              onClick={() => handleDownloadSingle(cert)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-widest uppercase transition-all duration-200"
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                letterSpacing: '0.15em',
                border: '1px solid rgba(204,0,0,0.35)',
                color: '#cc0000',
                background: 'rgba(204,0,0,0.06)',
              }}
              title={`Download ${cert.name}'s certificate`}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(204,0,0,0.15)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(204,0,0,0.06)' }}
            >
              ↓ Download
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
