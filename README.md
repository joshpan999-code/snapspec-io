# SnapSpec.io

**VESC Configuration Analysis & First Principles Validation Dashboard**

A Next.js 15 application for parsing, validating, and analyzing VESC motor controller configurations using first-principles physics rules.

## 🚀 Quick Start

```bash
# One-click start (installs deps + opens browser)
./start.ps1

# Or manually:
npm install
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## 📦 Features

- **VESC Parser**: Supports XML and PDF configuration files
- **First Principles Engine**: Physics-based validation rules
- **Radar Chart**: Visual validation overview
- **Parameter Dialog**: Review before applying changes
- **Supabase Integration**: Save and load configurations

## 🛠️ Scripts

| Script | Description |
|--------|-------------|
| `start.ps1` | One-click dev server start |
| `deploy-local.ps1` | Build for production (Vercel-ready) |
| `push.ps1` | Git add, commit, push to GitHub |

## ⌨️ Keyboard Shortcuts (VS Code / Cursor)

- `Ctrl+Shift+B` → Start Dev Server
- `Ctrl+Shift+T` → Push to GitHub

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── parse/route.ts      # File parsing API
│   │   └── validate/route.ts   # Validation API
│   └── dashboard/page.tsx      # Main dashboard
├── components/
│   ├── RadarChart.tsx          # Validation visualization
│   └── ParameterDialog.tsx     # Confirmation dialog
├── lib/
│   ├── parser.ts               # VESC file parser
│   ├── first-principles.ts     # Rules engine
│   └── supabase.ts             # Database client
└── types/index.ts              # TypeScript definitions
```

## 🔬 First Principles Rules

1. **Motor Current vs Battery Current** - Safe operating ratios
2. **KV Rating vs Voltage** - Max RPM limits
3. **Battery vs Motor Voltage** - Voltage matching
4. **Thermal Derating** - Temperature-based current limits
5. **FOC Angle Calibration** - Optimal efficiency
6. **PID Stability** - Control loop tuning

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## 📄 Sample Files

Test with the included sample:
- `public/samples/vesc-config.xml` - Example VESC configuration

## 🔗 Links

- **Repository**: https://github.com/joshpan999-code/snapspec-io
- **Live Demo**: https://www.snapspec.io (after Vercel deployment)

## 📝 License

MIT
