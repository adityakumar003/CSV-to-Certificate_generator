// lib/generateCertificate.js
// Core canvas-based certificate generation logic

const CANVAS_W = 1400
const CANVAS_H = 990

// Font URLs from Google Fonts CDN
const FONT_URL_REGULAR =
  'url(https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXo.woff2)'
const FONT_URL_BOLD =
  'url(https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq_p9.woff2)'

let fontsLoaded = false

async function ensureFontsLoaded() {
  if (fontsLoaded) return true
  try {
    const fontRegular = new FontFace('Montserrat', FONT_URL_REGULAR, { weight: '400' })
    const fontBold = new FontFace('Montserrat', FONT_URL_BOLD, { weight: '700' })
    const [r, b] = await Promise.all([fontRegular.load(), fontBold.load()])
    document.fonts.add(r)
    document.fonts.add(b)
    fontsLoaded = true
    return true
  } catch (err) {
    console.warn('Font loading failed, using Arial fallback:', err)
    return false
  }
}

function getFont(fontLoaded) {
  return fontLoaded ? 'Montserrat' : 'Arial'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function fitText(ctx, text, maxWidth, baseFontSize, fontWeight, fontFamily) {
  let fontSize = baseFontSize
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  while (ctx.measureText(text).width > maxWidth && fontSize > 24) {
    fontSize -= 4
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  }
  return fontSize
}

// ─────────────────────────────────────────────
// Template: Classic
// ─────────────────────────────────────────────
function drawClassic(ctx, participant, eventConfig, fontFamily) {
  const W = CANVAS_W, H = CANVAS_H
  const GOLD = '#C9A84C'
  const DARK = '#1B1B2F'

  // White background
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, W, H)

  // Header band
  ctx.fillStyle = DARK
  ctx.fillRect(0, 0, W, 180)

  // Footer band
  ctx.fillStyle = DARK
  ctx.fillRect(0, 810, W, 180)

  // Outer gold border (inset 30px)
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 8
  ctx.strokeRect(30, 30, W - 60, H - 60)

  // Inner gold border (inset 45px)
  ctx.lineWidth = 2
  ctx.strokeRect(45, 45, W - 90, H - 90)

  // Decorative corner flourishes
  const cornerSize = 40
  const corners = [[50, 50], [W - 50, 50], [50, H - 50], [W - 50, H - 50]]
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 3
  corners.forEach(([cx, cy]) => {
    const dx = cx < W / 2 ? 1 : -1
    const dy = cy < H / 2 ? 1 : -1
    ctx.beginPath()
    ctx.moveTo(cx, cy + dy * cornerSize)
    ctx.lineTo(cx, cy)
    ctx.lineTo(cx + dx * cornerSize, cy)
    ctx.stroke()
  })

  // ── Club Name ──
  ctx.fillStyle = GOLD
  ctx.font = `bold 30px ${fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('AWAARA RUN CLUB', W / 2, 85)

  ctx.font = `400 16px ${fontFamily}`
  ctx.fillStyle = 'rgba(201,168,76,0.7)'
  ctx.fillText('digitalheroesco.com', W / 2, 120)

  // Small gold line under header text
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(W / 2 - 120, 145)
  ctx.lineTo(W / 2 + 120, 145)
  ctx.stroke()

  // ── Certificate Title ──
  ctx.fillStyle = DARK
  ctx.font = `bold 42px ${fontFamily}`
  ctx.fillText('CERTIFICATE OF PARTICIPATION', W / 2, 230)

  // ── This certifies that ──
  ctx.font = `italic 400 26px ${fontFamily}`
  ctx.fillStyle = '#666666'
  ctx.fillText('This is to certify that', W / 2, 310)

  // ── Participant Name ──
  const nameFontSize = fitText(ctx, participant.name, 900, 88, 'bold', fontFamily)
  ctx.font = `bold ${nameFontSize}px ${fontFamily}`
  ctx.fillStyle = GOLD
  ctx.fillText(participant.name, W / 2, 430)

  // Decorative underline
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(W / 2 - 250, 465)
  ctx.lineTo(W / 2 + 250, 465)
  ctx.stroke()

  // ── Has successfully completed ──
  ctx.font = `400 26px ${fontFamily}`
  ctx.fillStyle = '#666666'
  ctx.fillText('has successfully completed', W / 2, 520)

  // ── Category ──
  ctx.font = `bold 52px ${fontFamily}`
  ctx.fillStyle = DARK
  ctx.fillText(participant.category || 'Finisher', W / 2, 590)

  // ── Event name + date ──
  const eventLine = eventConfig.eventName + '  ·  ' + formatDate(eventConfig.eventDate)
  ctx.font = `400 26px ${fontFamily}`
  ctx.fillStyle = '#888888'
  ctx.fillText(eventLine, W / 2, 660)

  // ── Bib Number Box ──
  ctx.fillStyle = GOLD
  drawRoundedRect(ctx, 120, 720, 160, 70, 10)
  ctx.fill()
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `bold 12px ${fontFamily}`
  ctx.fillText('BIB #', 200, 742)
  ctx.font = `bold 32px ${fontFamily}`
  ctx.fillText(String(participant.bib_number || '—'), 200, 775)

  // ── Tagline ──
  ctx.font = `italic 400 22px ${fontFamily}`
  ctx.fillStyle = '#999999'
  ctx.fillText(eventConfig.tagline || '', W / 2, 760)

  // Footer text
  ctx.fillStyle = GOLD
  ctx.font = `bold 14px ${fontFamily}`
  ctx.fillText('AWAARA RUN CLUB — CERTIFICATE OF PARTICIPATION', W / 2, 870)
}

// ─────────────────────────────────────────────
// Template: Bold
// ─────────────────────────────────────────────
function drawBold(ctx, participant, eventConfig, fontFamily) {
  const W = CANVAS_W, H = CANVAS_H
  const ORANGE = '#FF4500'

  // Near-black background
  ctx.fillStyle = '#0F0F0F'
  ctx.fillRect(0, 0, W, H)

  // Left + right accent sidebars
  ctx.fillStyle = ORANGE
  ctx.fillRect(0, 0, 18, H)
  ctx.fillRect(W - 18, 0, 18, H)

  // Top diagonal accent lines (top-left)
  ctx.save()
  ctx.globalAlpha = 0.5
  ctx.strokeStyle = ORANGE
  ctx.lineWidth = 3
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.moveTo(30 + i * 20, 0)
    ctx.lineTo(0, 30 + i * 20)
    ctx.stroke()
  }
  // Bottom-right diagonal
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.moveTo(W - 30 - i * 20, H)
    ctx.lineTo(W, H - 30 - i * 20)
    ctx.stroke()
  }
  ctx.restore()

  // Subtle horizontal accent lines
  ctx.strokeStyle = 'rgba(255,69,0,0.2)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(30, 195)
  ctx.lineTo(W - 30, 195)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(30, 795)
  ctx.lineTo(W - 30, 795)
  ctx.stroke()

  // ── Club Name ──
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = ORANGE
  ctx.font = `bold 30px ${fontFamily}`
  ctx.fillText('AWAARA RUN CLUB', W / 2, 80)

  ctx.font = `400 16px ${fontFamily}`
  ctx.fillStyle = 'rgba(255,69,0,0.6)'
  ctx.fillText('digitalheroesco.com', W / 2, 115)

  // ── Certificate Title ──
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `bold 42px ${fontFamily}`
  ctx.fillText('CERTIFICATE OF PARTICIPATION', W / 2, 230)

  // Thin orange separator
  ctx.strokeStyle = ORANGE
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(W / 2 - 200, 268)
  ctx.lineTo(W / 2 + 200, 268)
  ctx.stroke()

  // ── This certifies that ──
  ctx.font = `italic 400 26px ${fontFamily}`
  ctx.fillStyle = '#AAAAAA'
  ctx.fillText('This is to certify that', W / 2, 310)

  // ── Participant Name ──
  const nameFontSize = fitText(ctx, participant.name, 900, 88, 'bold', fontFamily)
  ctx.font = `bold ${nameFontSize}px ${fontFamily}`
  ctx.fillStyle = ORANGE
  ctx.fillText(participant.name, W / 2, 430)

  // Decorative underline
  ctx.strokeStyle = ORANGE
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(W / 2 - 250, 465)
  ctx.lineTo(W / 2 + 250, 465)
  ctx.stroke()

  // ── Has successfully completed ──
  ctx.font = `400 26px ${fontFamily}`
  ctx.fillStyle = '#AAAAAA'
  ctx.fillText('has successfully completed', W / 2, 520)

  // ── Category ──
  ctx.font = `bold 52px ${fontFamily}`
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(participant.category || 'Finisher', W / 2, 590)

  // ── Event + Date ──
  const eventLine = eventConfig.eventName + '  ·  ' + formatDate(eventConfig.eventDate)
  ctx.font = `400 26px ${fontFamily}`
  ctx.fillStyle = '#888888'
  ctx.fillText(eventLine, W / 2, 660)

  // ── Bib Number Box ──
  ctx.fillStyle = ORANGE
  drawRoundedRect(ctx, 120, 720, 160, 70, 10)
  ctx.fill()
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `bold 12px ${fontFamily}`
  ctx.fillText('BIB #', 200, 742)
  ctx.font = `bold 32px ${fontFamily}`
  ctx.fillText(String(participant.bib_number || '—'), 200, 775)

  // ── Tagline ──
  ctx.font = `italic 400 22px ${fontFamily}`
  ctx.fillStyle = '#666666'
  ctx.fillText(eventConfig.tagline || '', W / 2, 760)

  // Footer text
  ctx.fillStyle = 'rgba(255,69,0,0.5)'
  ctx.font = `bold 14px ${fontFamily}`
  ctx.fillText('AWAARA RUN CLUB — CERTIFICATE OF PARTICIPATION', W / 2, 870)
}

// ─────────────────────────────────────────────
// Template: Minimal
// ─────────────────────────────────────────────
function drawMinimal(ctx, participant, eventConfig, fontFamily) {
  const W = CANVAS_W, H = CANVAS_H
  const DARK = '#111111'

  // Off-white background
  ctx.fillStyle = '#FAFAFA'
  ctx.fillRect(0, 0, W, H)

  // Top thin line
  ctx.fillStyle = DARK
  ctx.fillRect(0, 80, W, 2)

  // Bottom thin line
  ctx.fillRect(0, 910, W, 2)

  // Small square accent top-left
  ctx.fillStyle = DARK
  ctx.fillRect(60, 60, 14, 14)

  // Small square accent bottom-right
  ctx.fillRect(W - 74, H - 74, 14, 14)

  // ── Club Name ──
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = DARK
  ctx.font = `bold 28px ${fontFamily}`
  ctx.fillText('AWAARA RUN CLUB', W / 2, 50)

  ctx.font = `400 14px ${fontFamily}`
  ctx.fillStyle = '#888888'
  ctx.fillText('digitalheroesco.com', W / 2, 72)

  // ── Certificate Title ──
  ctx.fillStyle = DARK
  ctx.font = `bold 40px ${fontFamily}`
  ctx.fillText('CERTIFICATE OF PARTICIPATION', W / 2, 215)

  // Thin line accent
  ctx.strokeStyle = '#DDDDDD'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(W / 2 - 250, 255)
  ctx.lineTo(W / 2 + 250, 255)
  ctx.stroke()

  // ── This certifies that ──
  ctx.font = `italic 400 24px ${fontFamily}`
  ctx.fillStyle = '#555555'
  ctx.fillText('This is to certify that', W / 2, 305)

  // ── Participant Name ──
  const nameFontSize = fitText(ctx, participant.name, 900, 88, 'bold', fontFamily)
  ctx.font = `bold ${nameFontSize}px ${fontFamily}`
  ctx.fillStyle = DARK
  ctx.fillText(participant.name, W / 2, 430)

  // Decorative underline
  ctx.strokeStyle = DARK
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(W / 2 - 250, 465)
  ctx.lineTo(W / 2 + 250, 465)
  ctx.stroke()

  // ── Has successfully completed ──
  ctx.font = `400 24px ${fontFamily}`
  ctx.fillStyle = '#555555'
  ctx.fillText('has successfully completed', W / 2, 515)

  // ── Category ──
  ctx.font = `bold 50px ${fontFamily}`
  ctx.fillStyle = DARK
  ctx.fillText(participant.category || 'Finisher', W / 2, 590)

  // ── Event + Date ──
  const eventLine = eventConfig.eventName + '  ·  ' + formatDate(eventConfig.eventDate)
  ctx.font = `400 24px ${fontFamily}`
  ctx.fillStyle = '#888888'
  ctx.fillText(eventLine, W / 2, 660)

  // ── Bib Number Box ──
  ctx.fillStyle = DARK
  drawRoundedRect(ctx, 120, 720, 160, 70, 8)
  ctx.fill()
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `bold 12px ${fontFamily}`
  ctx.fillText('BIB #', 200, 742)
  ctx.font = `bold 32px ${fontFamily}`
  ctx.fillText(String(participant.bib_number || '—'), 200, 775)

  // ── Tagline ──
  ctx.font = `italic 400 20px ${fontFamily}`
  ctx.fillStyle = '#AAAAAA'
  ctx.fillText(eventConfig.tagline || '', W / 2, 760)

  // Footer
  ctx.fillStyle = '#CCCCCC'
  ctx.font = `400 13px ${fontFamily}`
  ctx.fillText('AWAARA RUN CLUB — CERTIFICATE OF PARTICIPATION', W / 2, 950)
}

// ─────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────
export async function generateCertificate(participant, eventConfig) {
  // Ensure fonts are loaded (cached after first call)
  const fontLoaded = await ensureFontsLoaded()
  const fontFamily = getFont(fontLoaded)

  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_W
  canvas.height = CANVAS_H
  const ctx = canvas.getContext('2d')

  // Set global text rendering
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.textRendering = 'optimizeLegibility'

  const template = eventConfig.template || 'Classic'
  if (template === 'Bold') {
    drawBold(ctx, participant, eventConfig, fontFamily)
  } else if (template === 'Minimal') {
    drawMinimal(ctx, participant, eventConfig, fontFamily)
  } else {
    drawClassic(ctx, participant, eventConfig, fontFamily)
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob)
        resolve({ url, blob, name: participant.name })
      },
      'image/png',
      1.0,
    )
  })
}
