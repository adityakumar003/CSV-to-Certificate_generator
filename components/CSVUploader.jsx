'use client'

import { useState, useRef, useCallback } from 'react'
import Papa from 'papaparse'

export default function CSVUploader({ onParsed }) {
  const [isDragging,    setIsDragging]    = useState(false)
  const [status,        setStatus]        = useState('idle') // idle | success | error
  const [message,       setMessage]       = useState('')
  const [participants,  setParticipants]  = useState([])
  const fileInputRef = useRef(null)

  const processFile = useCallback((file) => {
    if (!file) return
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setStatus('error')
      setMessage('Please upload a .csv file only')
      return
    }

    Papa.parse(file, {
      header:        true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const rawData = results.data
        if (!rawData || rawData.length === 0) {
          setStatus('error')
          setMessage('No participants found in CSV. Please check your file.')
          return
        }

        const headers = results.meta.fields || []
        if (!headers.includes('name')) {
          setStatus('error')
          setMessage('Missing required column: "name". Please check your CSV format.')
          return
        }

        const processed = rawData
          .map((row, idx) => ({
            name:       (row.name || '').toString().trim(),
            bib_number: row.bib_number
              ? row.bib_number.toString().trim()
              : String(idx + 1).padStart(3, '0'),
            category: (row.category || 'Finisher').toString().trim(),
          }))
          .filter((row) => row.name.length > 0)

        if (processed.length === 0) {
          setStatus('error')
          setMessage('No valid participants found. Make sure "name" column has values.')
          return
        }

        if (processed.length > 200) {
          setStatus('success')
          setMessage(`⚠ ${processed.length} participants loaded. Large batches may take a moment.`)
        } else {
          setStatus('success')
          setMessage(`${processed.length} participant${processed.length !== 1 ? 's' : ''} loaded`)
        }

        setParticipants(processed)
        onParsed(processed)
      },
      error: (err) => {
        setStatus('error')
        setMessage(`Error parsing CSV: ${err.message}`)
      },
    })
  }, [onParsed])

  const handleDrop      = useCallback((e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files[0]) }, [processFile])
  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)
  const handleFileChange = (e) => { processFile(e.target.files[0]); e.target.value = '' }

  const borderColor = isDragging
    ? '#cc0000'
    : status === 'error'
    ? 'rgba(220,38,38,0.5)'
    : status === 'success'
    ? 'rgba(34,197,94,0.3)'
    : 'rgba(255,255,255,0.1)'

  const bgColor = isDragging
    ? 'rgba(204,0,0,0.06)'
    : status === 'success'
    ? 'rgba(0,30,0,0.3)'
    : 'rgba(10,0,0,0.8)'

  return (
    <div className="space-y-4">

      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="relative cursor-pointer transition-all duration-200"
        style={{
          border: `1px solid ${borderColor}`,
          background: bgColor,
          padding: '48px 32px',
          transform: isDragging ? 'scale(1.01)' : 'scale(1)',
        }}
      >
        {/* Corner accents */}
        <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: '#cc0000' }} />
        <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: '#cc0000' }} />
        <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: '#cc0000' }} />
        <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: '#cc0000' }} />

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
          id="csv-file-input"
        />

        <div className="flex flex-col items-center gap-4 text-center">
          {/* Icon */}
          <div
            className="w-14 h-14 flex items-center justify-center text-2xl transition-all duration-200"
            style={{
              background: isDragging ? 'rgba(204,0,0,0.2)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              transform: isDragging ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {status === 'success' ? '✓' : status === 'error' ? '✕' : isDragging ? '📂' : '📄'}
          </div>

          {status === 'idle' && (
            <>
              <div>
                <p className="text-white font-bold text-base">Drop your CSV here or click to upload</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Supports .csv files only</p>
              </div>
              <button
                className="mt-1 px-5 py-2 text-xs font-bold tracking-widest uppercase transition-colors"
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  letterSpacing: '0.18em',
                  border: '1px solid rgba(204,0,0,0.5)',
                  color: '#cc0000',
                  background: 'rgba(204,0,0,0.08)',
                }}
              >
                Browse File
              </button>
            </>
          )}

          {status === 'success' && (
            <div>
              <p
                className="font-black text-lg tracking-wide"
                style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#22c55e' }}
              >
                ✓ {message}
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Click to upload a different file
              </p>
            </div>
          )}

          {status === 'error' && (
            <div>
              <p className="font-semibold text-sm" style={{ color: '#ef4444' }}>{message}</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Click to try a different file</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Table */}
      {status === 'success' && participants.length > 0 && (
        <div
          className="overflow-hidden animate-fade-in"
          style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(8,0,0,0.8)' }}
        >
          <div
            className="px-4 py-2.5 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p
              className="text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.18em' }}
            >
              Preview — first 5 rows
            </p>
            <span className="text-xs font-bold" style={{ color: '#cc0000' }}>
              {participants.length} total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['#', 'Name', 'Bib #', 'Category'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left font-bold tracking-widest uppercase"
                      style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participants.slice(0, 5).map((p, i) => (
                  <tr
                    key={i}
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td className="px-4 py-2" style={{ color: 'rgba(255,255,255,0.25)' }}>{i + 1}</td>
                    <td className="px-4 py-2 font-semibold text-white">{p.name}</td>
                    <td className="px-4 py-2 font-bold" style={{ color: '#cc0000' }}>{p.bib_number}</td>
                    <td className="px-4 py-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{p.category}</td>
                  </tr>
                ))}
                {participants.length > 5 && (
                  <tr style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <td
                      colSpan={4}
                      className="px-4 py-2 italic text-center"
                      style={{ color: 'rgba(255,255,255,0.2)' }}
                    >
                      + {participants.length - 5} more participants…
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Format Guide */}
      <div
        className="p-4"
        style={{ background: 'rgba(8,0,0,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p
          className="text-xs font-bold tracking-widest uppercase mb-2"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em' }}
        >
          Expected CSV Format
        </p>
        <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Required: <span style={{ color: '#cc0000' }}>name</span> · Optional: bib_number, category
        </p>
        <div
          className="p-3 font-mono text-xs"
          style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.4)' }}
        >
          <div style={{ color: '#cc0000' }}>name,bib_number,category</div>
          <div>Aditya Kumar,001,10K Run</div>
          <div>Priya Nair,002,5K Run</div>
          <div>Rahul Sharma,003,Half Marathon</div>
        </div>
        <a
          href="/sample_participants.csv"
          download
          className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold tracking-wider transition-colors hover:opacity-70"
          style={{ color: '#cc0000', letterSpacing: '0.1em' }}
        >
          ↓ Download sample CSV
        </a>
      </div>
    </div>
  )
}
