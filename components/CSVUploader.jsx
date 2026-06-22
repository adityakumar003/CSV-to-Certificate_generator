'use client'

import { useState, useRef, useCallback } from 'react'
import Papa from 'papaparse'

export default function CSVUploader({ onParsed }) {
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState('idle') // idle | success | error
  const [message, setMessage] = useState('')
  const [participants, setParticipants] = useState([])
  const fileInputRef = useRef(null)

  const processFile = useCallback((file) => {
    if (!file) return
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setStatus('error')
      setMessage('Please upload a .csv file only')
      return
    }

    Papa.parse(file, {
      header: true,
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

        // Normalize and validate each row
        const processed = rawData
          .map((row, idx) => ({
            name: (row.name || '').toString().trim(),
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
          setMessage(`⚠️ ${processed.length} participants loaded. Large batches may take a moment to generate.`)
        } else {
          setStatus('success')
          setMessage(`✓ ${processed.length} participant${processed.length !== 1 ? 's' : ''} loaded successfully`)
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

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    processFile(file)
  }, [processFile])

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)

  const handleFileChange = (e) => {
    processFile(e.target.files[0])
    e.target.value = ''
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-orange-500 bg-orange-500/5 scale-[1.01]'
            : status === 'error'
            ? 'border-red-500/50 bg-red-500/5'
            : status === 'success'
            ? 'border-green-500/50 bg-green-500/5'
            : 'border-gray-700 bg-gray-900 hover:border-orange-500/50 hover:bg-gray-800/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
          id="csv-file-input"
        />

        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-200 ${
            isDragging ? 'bg-orange-500/20 scale-110' : 'bg-gray-800'
          }`}>
            {status === 'success' ? '✅' : status === 'error' ? '❌' : isDragging ? '📂' : '📄'}
          </div>

          {status === 'idle' && (
            <>
              <div>
                <p className="text-white font-semibold text-lg">Drop your CSV here or click to upload</p>
                <p className="text-gray-500 text-sm mt-1">Supports .csv files only</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-px bg-gray-700 w-16" />
                <span className="text-gray-600 text-sm">or</span>
                <div className="h-px bg-gray-700 w-16" />
              </div>
              <button className="px-5 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg text-sm font-medium border border-orange-500/30 transition-colors">
                Browse File
              </button>
            </>
          )}

          {status === 'success' && (
            <div>
              <p className="text-green-400 font-bold text-xl">{message}</p>
              <p className="text-gray-500 text-sm mt-1 cursor-pointer hover:text-gray-400">Click to upload a different file</p>
            </div>
          )}

          {status === 'error' && (
            <div>
              <p className="text-red-400 font-semibold">{message}</p>
              <p className="text-gray-500 text-sm mt-1">Click to try a different file</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Table */}
      {status === 'success' && participants.length > 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden animate-fade-in">
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-300">Preview (first 5 rows)</h3>
            <span className="text-xs text-orange-400 font-medium">{participants.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800/50">
                  <th className="px-4 py-2.5 text-left text-gray-400 font-medium">#</th>
                  <th className="px-4 py-2.5 text-left text-gray-400 font-medium">Name</th>
                  <th className="px-4 py-2.5 text-left text-gray-400 font-medium">Bib #</th>
                  <th className="px-4 py-2.5 text-left text-gray-400 font-medium">Category</th>
                </tr>
              </thead>
              <tbody>
                {participants.slice(0, 5).map((p, i) => (
                  <tr key={i} className="border-t border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-2.5 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2.5 text-white font-medium">{p.name}</td>
                    <td className="px-4 py-2.5 text-orange-400">{p.bib_number}</td>
                    <td className="px-4 py-2.5 text-gray-300">{p.category}</td>
                  </tr>
                ))}
                {participants.length > 5 && (
                  <tr className="border-t border-gray-800/50">
                    <td colSpan={4} className="px-4 py-2.5 text-gray-600 text-center italic">
                      + {participants.length - 5} more participants…
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expected Format */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Expected CSV Format</p>
        <p className="text-xs text-gray-600 mb-2">Required: <span className="text-orange-400">name</span> · Optional: bib_number, category</p>
        <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs text-gray-400">
          <div className="text-orange-400">name,bib_number,category</div>
          <div>Aditya Kumar,001,10K Run</div>
          <div>Priya Nair,002,5K Run</div>
          <div>Rahul Sharma,003,Half Marathon</div>
        </div>
        <a
          href="/sample_participants.csv"
          download
          className="inline-flex items-center gap-1.5 mt-3 text-xs text-orange-400 hover:text-orange-300 transition-colors font-medium"
        >
          ↓ Download sample CSV
        </a>
      </div>
    </div>
  )
}
