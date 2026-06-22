'use client'

const TEMPLATES = [
  {
    id: 'Classic',
    name: 'Classic',
    description: 'Elegant white background with gold accents. Timeless and prestigious.',
    emoji: '🏆',
    preview: 'bg-white border-2 border-yellow-500',
    accent: '#C9A84C',
    previewColors: ['bg-yellow-500/30', 'bg-yellow-900/20'],
  },
  {
    id: 'Bold',
    name: 'Bold',
    description: 'Dramatic dark background with fiery orange-red energy. Makes an impact.',
    emoji: '🔥',
    preview: 'bg-gray-950 border-2 border-orange-600',
    accent: '#FF4500',
    previewColors: ['bg-orange-600/40', 'bg-red-900/20'],
  },
  {
    id: 'Minimal',
    name: 'Minimal',
    description: 'Clean modern white design with razor-thin lines. Sophisticated and fresh.',
    emoji: '✨',
    preview: 'bg-gray-50 border-2 border-gray-800',
    accent: '#222222',
    previewColors: ['bg-gray-200', 'bg-gray-100'],
  },
]

export default function EventConfigForm({ config, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...config, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Event Details */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Event Details</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-name" className="block text-sm font-medium text-gray-300 mb-1.5">
              Event Name <span className="text-orange-500">*</span>
            </label>
            <input
              id="event-name"
              type="text"
              value={config.eventName}
              onChange={(e) => handleChange('eventName', e.target.value)}
              placeholder="Awaara Run 2025"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          <div>
            <label htmlFor="event-date" className="block text-sm font-medium text-gray-300 mb-1.5">
              Event Date <span className="text-orange-500">*</span>
            </label>
            <input
              id="event-date"
              type="date"
              value={config.eventDate}
              onChange={(e) => handleChange('eventDate', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm [color-scheme:dark]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="event-tagline" className="block text-sm font-medium text-gray-300 mb-1.5">
            Tagline
          </label>
          <input
            id="event-tagline"
            type="text"
            value={config.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="Keep Running, Keep Growing"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
          />
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Certificate Template</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              id={`template-${tpl.id.toLowerCase()}`}
              onClick={() => handleChange('template', tpl.id)}
              className={`relative rounded-xl p-4 border-2 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                config.template === tpl.id
                  ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              {config.template === tpl.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Mini preview */}
              <div className={`w-full h-16 rounded-lg mb-3 flex items-center justify-center text-2xl ${
                tpl.id === 'Classic' ? 'bg-yellow-50 border border-yellow-200' :
                tpl.id === 'Bold' ? 'bg-gray-950 border border-orange-900' :
                'bg-gray-50 border border-gray-200'
              }`}>
                {tpl.emoji}
              </div>

              <p className={`font-bold text-sm mb-1 ${config.template === tpl.id ? 'text-orange-400' : 'text-white'}`}>
                {tpl.name}
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">{tpl.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Live Preview Note */}
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <svg className="w-4 h-4 text-orange-500/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Certificates are rendered at 1400×990px — full resolution PNG suitable for printing.
      </div>
    </div>
  )
}
