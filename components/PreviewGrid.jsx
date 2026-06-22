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
      <div className="text-center py-20 text-gray-600">
        <p className="text-4xl mb-3">📋</p>
        <p>No certificates to preview</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map((cert, index) => (
        <div
          key={index}
          className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-orange-500/40 transition-all duration-200 hover:shadow-xl hover:shadow-orange-500/10 group animate-fade-in"
          style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
        >
          {/* Certificate Thumbnail */}
          <div className="relative bg-gray-950 overflow-hidden aspect-[1400/990]">
            <img
              src={cert.url}
              alt={`Certificate for ${cert.name}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
              <button
                onClick={() => handleDownloadSingle(cert)}
                id={`download-cert-${index}`}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold text-sm shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-200"
              >
                ↓ Download PNG
              </button>
            </div>
          </div>

          {/* Card Footer */}
          <div className="px-4 py-3 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{cert.name}</p>
              <p className="text-gray-600 text-xs">Certificate #{String(index + 1).padStart(3, '0')}</p>
            </div>
            <button
              onClick={() => handleDownloadSingle(cert)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-orange-500/20 text-gray-400 hover:text-orange-400 rounded-lg text-xs font-medium border border-gray-700 hover:border-orange-500/40 transition-all duration-200"
              title={`Download ${cert.name}'s certificate`}
            >
              ↓ Download
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
