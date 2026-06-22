# Awaara Run Club — Certificate Generator

A 100% browser-based tool for generating beautiful participation certificates for running events.

**Live Demo**: [Deploy on Vercel]

Built by **Aditya Kumar** · adityakumar8303000000@gmail.com

---

## Features

- 📄 **CSV Upload** — Drag & drop your participants CSV file
- 🎨 **3 Certificate Templates** — Classic (gold), Bold (orange/dark), Minimal (clean white)
- 🖼️ **Canvas Rendering** — High-resolution 1400×990px PNG certificates
- 📦 **ZIP Download** — Download all certificates as a single ZIP file
- 📱 **Mobile Responsive** — Works on all screen sizes
- 🔒 **100% Browser-based** — No data leaves your device, no backend needed

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **CSV Parsing**: PapaParse
- **Certificate Rendering**: HTML5 Canvas API
- **Font Loading**: FontFace API (Montserrat from Google Fonts)
- **Bulk Download**: JSZip + FileSaver.js

## CSV Format

```csv
name,bib_number,category
Aditya Kumar,001,10K Run
Priya Nair,002,5K Run
Rahul Sharma,003,Half Marathon
```

**Required column**: `name`  
**Optional columns**: `bib_number` (auto-generated if missing), `category` (defaults to "Finisher")

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

No environment variables required — it's 100% frontend.

---

[Built for Digital Heroes](https://digitalheroesco.com) · © 2025 Awaara Run Club
