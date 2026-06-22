'use client'

const TEMPLATES = [
  {
    id:          'Classic',
    name:        'Classic',
    description: 'Elegant white background with gold accents. Timeless and prestigious.',
    previewBg:   '#fff8e7',
    previewBorder: '#C9A84C',
    dotColor:    '#C9A84C',
  },
  {
    id:          'Bold',
    name:        'Bold',
    description: 'Dramatic dark background with fiery orange-red energy. Makes an impact.',
    previewBg:   '#0F0F0F',
    previewBorder: '#FF4500',
    dotColor:    '#FF4500',
  },
  {
    id:          'Minimal',
    name:        'Minimal',
    description: 'Clean modern white design with razor-thin lines. Sophisticated and fresh.',
    previewBg:   '#FAFAFA',
    previewBorder: '#333333',
    dotColor:    '#222222',
  },
]

export default function EventConfigForm({ config, onChange }) {
  const handleChange = (field, value) => onChange({ ...config, [field]: value })

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#ffffff',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'Montserrat, sans-serif',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '10px',
    fontFamily: '"Barlow Condensed", sans-serif',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '6px',
    fontWeight: 700,
  }

  return (
    <div className="space-y-5">

      {/* Event Details Card */}
      <div
        className="p-6 space-y-5 relative"
        style={{ background: 'rgba(8,0,0,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Left accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: '#cc0000' }} />

        <p style={{ ...labelStyle, color: 'rgba(204,0,0,0.8)' }}>Event Details</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-name" style={labelStyle}>
              Event Name <span style={{ color: '#cc0000' }}>*</span>
            </label>
            <input
              id="event-name"
              type="text"
              value={config.eventName}
              onChange={(e) => handleChange('eventName', e.target.value)}
              placeholder="Awaara Run 2025"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#cc0000')}
              onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>
          <div>
            <label htmlFor="event-date" style={labelStyle}>
              Event Date <span style={{ color: '#cc0000' }}>*</span>
            </label>
            <input
              id="event-date"
              type="date"
              value={config.eventDate}
              onChange={(e) => handleChange('eventDate', e.target.value)}
              style={{ ...inputStyle, colorScheme: 'dark' }}
              onFocus={(e) => (e.target.style.borderColor = '#cc0000')}
              onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="event-tagline" style={labelStyle}>Tagline</label>
          <input
            id="event-tagline"
            type="text"
            value={config.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="Keep Running, Keep Growing"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#cc0000')}
            onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>
      </div>

      {/* Template Selection */}
      <div
        className="p-6 relative"
        style={{ background: 'rgba(8,0,0,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: '#cc0000' }} />
        <p style={{ ...labelStyle, color: 'rgba(204,0,0,0.8)', marginBottom: '16px' }}>
          Certificate Template
        </p>

        <div className="grid sm:grid-cols-3 gap-3">
          {TEMPLATES.map((tpl) => {
            const isSelected = config.template === tpl.id
            return (
              <button
                key={tpl.id}
                id={`template-${tpl.id.toLowerCase()}`}
                onClick={() => handleChange('template', tpl.id)}
                className="relative text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] p-4"
                style={{
                  border: isSelected
                    ? '1px solid #cc0000'
                    : '1px solid rgba(255,255,255,0.07)',
                  background: isSelected
                    ? 'rgba(204,0,0,0.1)'
                    : 'rgba(255,255,255,0.02)',
                }}
              >
                {isSelected && (
                  <div
                    className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center text-white"
                    style={{ background: '#cc0000', fontSize: '10px', fontWeight: 900 }}
                  >
                    ✓
                  </div>
                )}

                {/* Mini colour preview */}
                <div
                  className="w-full h-12 mb-3 flex items-end px-2 pb-1.5"
                  style={{
                    background: tpl.previewBg,
                    border: `1.5px solid ${tpl.previewBorder}`,
                  }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: tpl.dotColor }} />
                </div>

                <p
                  className="font-black text-sm mb-1"
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    letterSpacing: '0.12em',
                    color: isSelected ? '#cc0000' : '#ffffff',
                    textTransform: 'uppercase',
                  }}
                >
                  {tpl.name}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {tpl.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Info line */}
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
        Certificates rendered at 1400×990px — full resolution PNG suitable for printing.
      </p>
    </div>
  )
}
