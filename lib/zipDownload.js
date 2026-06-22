import JSZip from 'jszip'
import { saveAs } from 'file-saver'

/**
 * downloadAllAsZip — Bundles all certificate blobs into a ZIP file and triggers download
 * @param {Array<{url: string, blob: Blob, name: string}>} certificates
 */
export async function downloadAllAsZip(certificates) {
  if (!certificates || certificates.length === 0) {
    throw new Error('No certificates to download')
  }

  const zip = new JSZip()
  const folder = zip.folder('Awaara_Certificates')

  for (const cert of certificates) {
    const safeName = cert.name
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_\-]/g, '')
    const filename = `${safeName}_certificate.png`
    folder.file(filename, cert.blob)
  }

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  })

  saveAs(content, 'Awaara_Certificates.zip')
}
