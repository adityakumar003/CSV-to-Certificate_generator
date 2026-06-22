import Papa from 'papaparse'

/**
 * parseCSVFile — Parses a CSV File object using PapaParse
 * @param {File} file
 * @returns {Promise<Array<{name: string, bib_number: string, category: string}>>}
 */
export function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'))
      return
    }

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      reject(new Error('Please upload a .csv file'))
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const headers = results.meta?.fields || []

        if (!headers.includes('name')) {
          reject(
            new Error(
              `Missing required column: "name". Found columns: ${headers.join(', ') || '(none)'}`,
            ),
          )
          return
        }

        const processed = results.data
          .map((row, idx) => ({
            name: (row.name || '').toString().trim(),
            bib_number: row.bib_number
              ? row.bib_number.toString().trim()
              : String(idx + 1).padStart(3, '0'),
            category: (row.category || 'Finisher').toString().trim(),
          }))
          .filter((row) => row.name.length > 0)

        if (processed.length === 0) {
          reject(new Error('No participants found in CSV. Ensure the "name" column has values.'))
          return
        }

        resolve(processed)
      },
      error: (err) => reject(new Error(`CSV parse error: ${err.message}`)),
    })
  })
}
