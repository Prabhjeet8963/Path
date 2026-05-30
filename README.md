<div align="center">

# ☬ ਪਾਠ | Path.io

**An immersive, distraction-free spiritual workspace for daily Gurbani.**<br/>
*Listen. Breathe. Remember.*

## Overview

**Path.io** is a modern spiritual audio platform built for the daily recitation of Nitnem — the prescribed Gurbani prayers of the Sikh faith. Designed with deep intentionality, it strips away every distraction to leave only what matters: the sacred sound, the breath, and the Word.

The application streams eight high-fidelity Gurbani recordings hosted on Supabase Storage, presented within a minimal dark interface that breathes alongside you as you listen. Whether you begin at Amrit Vela with Japji Sahib or settle into evening Rehras, Path.io holds the sequence with quiet reverence.

---

## The Eight Paths

The following Nitnem prayers are included in their prescribed sequence. The playlist completes after the eighth path and does not loop back — silence is the intended close.

| # | Gurmukhi | English | Time of Day |
|:-:|----------|---------|:-----------:|
| 1 | ਜਪੁਜੀ ਸਾਹਿਬ | Japji Sahib | Amrit Vela |
| 2 | ਜਾਪੁ ਸਾਹਿਬ | Jaap Sahib | Amrit Vela |
| 3 | ਤਵ ਪ੍ਰਸਾਦਿ ਸਵੈਯੇ | Tav Parshad Savaiye | Amrit Vela |
| 4 | ਬੇਨਤੀ ਚੌਪਈ ਸਾਹਿਬ | Chaupai Sahib | Amrit Vela |
| 5 | ਆਨੰਦੁ ਸਾਹਿਬ | Anand Sahib | Amrit Vela |
| 6 | ਰਹਿਰਾਸਿ ਸਾਹਿਬ | Rehras Sahib | Sunset |
| 7 | ਕੀਰਤਨ ਸੋਹਿਲਾ | Sohaila Sahib | Nighttime |
| 8 | ਸਿਮਰਨ | Simran | Any time |


## Features

<details>
<summary><strong>☬ &nbsp;Breathing Waheguru Card</strong></summary>
<br/>

When audio is actively playing, a central card pulsates with a soft, rhythmic glow — a gentle visual anchor for breath awareness. The animation is intentionally slow, calibrated to a natural breathing pace during recitation. When audio stops, the card stills.

</details>

<details>
<summary><strong>☬ Quick Sequence Paths</strong></summary>
<br/>

Automated queuing lets you begin a prescribed sequence in one tap:

| Sequence | Tracks Queued |
|----------|--------------|
| **Nitnem** | Japji Sahib → Jaap Sahib → Tav Parshad → Chaupai Sahib → Anand Sahib → Simran |
| **Rehras** | Rehras Sahib |
| **Sohaila** | Sohaila Sahib |
| **Full Sequence** | All 8 paths in order |

</details>

<details>
<summary><strong>☬ Audio Controls</strong></summary>
<br/>

| Control | Action |
|---------|--------|
| Play / Pause | Tap the central circle |
| − 5s / + 5s | Instant skip for missed or repeated passages |
| Loop | Repeat a single path indefinitely — gold accent when active |
| Next / Previous | Advance or return through the sequence |
| Reset | Return to the beginning of the current path |
| Seek bar | Scrub precisely with the gold-accented range slider |
| Autoplay | Next path begins automatically; sequence rests after path 8 |

</details>

<details>
<summary><strong>☬ Rotating Scriptural Quotes</strong></summary>
<br/>

Each track change surfaces a verse from Gurbani or the Rehatnama — rendered in Gurmukhi script with its English translation and attribution, fading in with a 200ms opacity transition.

</details>

<details>
<summary><strong>☬ &nbsp;Low Data Architecture</strong></summary>
<br/>

Audio is loaded intelligently to minimise bandwidth consumption:

- All inactive tracks use `preload="none"` — nothing is fetched until needed
- The active track uses `preload="auto"` — buffered fully on selection
- At 80% playback progress, the next track is silently preloaded in the background
- No YouTube, no iframes, no third-party player scripts

</details>

---

## Design System

Path.io uses a single, disciplined colour palette. There are no competing accent colours — only one gold.

### Colour Tokens

| Token | Value | Role |
|-------|:-----:|------|
| Background | `#0d0d0d` | Page background |
| Surface | `#141414` | Cards and panels |
| Border | `#1e1e1e` | All structural lines |
| Text Primary | `#f5f0e8` | Gurmukhi titles, active items |
| Text Secondary | `#888888` | Descriptions, inactive labels |
| Text Muted | `#444444` | Metadata, timestamps |
| Text Ghost | `#2e2e2e` | Decorative symbols |
| **Accent Gold** | `#c8a96e` | Active states, seek fill, loop indicator |
| Accent Hover | `#d4b87a` | Play button hover |

### Typography

- **Gurmukhi** — `Noto Sans Gurmukhi`, weight 400, always rendered larger than its English equivalent
- **English** — `Inter`, weight 400–500
- **Monospace** (time display, track numbers) — system monospace stack

### Motion

- Quote transitions — 200ms opacity fade on track change
- Breathing card — slow sinusoidal pulse, 3–4s cycle, only active during playback
- Control interactions — `scale(0.95)` on tap, no bounce

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 — App Router + Turbopack |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Audio Storage | Supabase Storage (public bucket) |
| Deployment | Vercel |

---

## Project Structure

```
Path/ (Repository Root)
├── src/
│   ├── app/
│   │   ├── layout.js                   # Root layout, fonts, CustomCursor
│   │   ├── page.js                     # Home page, header, AudioPlayer
│   │   └── globals.css                 # Global styles, scrollbar, selection
│   ├── components/
│   │   ├── AudioPlayer.jsx             # Player state, controls, playlist
│   │   ├── InteractiveBackground.jsx   # Breathing Waheguru card
│   │   └── CustomCursor.jsx            # Spring-physics amber cursor (desktop)
│   └── lib/
│       ├── tracks.js                   # Static track metadata + audio URLs
│       └── supabase.js                 # Supabase client initialisation
├── .env.local                          # Environment variables (git-ignored)
├── .env.example                        # Environment variable template
├── next.config.mjs
├── tailwind.config.js
├── package.json
└── README.md
```

---

## Installation

### Prerequisites

- Node.js 18 or higher
- A Supabase account with a project created
- Your eight MP3 files, ready to upload

### 1 — Clone the repository

```bash
git clone https://github.com/prabhjeet8963/Path.git
cd Path
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Both values are in your Supabase project under **Settings → API**.

### 4 — Upload audio files to Supabase Storage

1. In your Supabase dashboard go to **Storage**
2. Create a new bucket named `audio` and set it to **Public**
3. Upload your eight MP3 files with clean lowercase filenames:

```
japji-sahib.mp3
jaap-sahib.mp3
tav-parshad.mp3
chaupai-sahib.mp3
anand-sahib.mp3
rehras-sahib.mp3
sohaila-sahib.mp3
simran.mp3
```

4. Copy each file's public URL into `src/lib/tracks.js` as the `audioUrl` for the corresponding track

### 5 — Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6 — Build for production

```bash
npm run build
npm run start
```

---

## Deployment

Path.io deploys to Vercel with zero configuration.

1. Push your repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Framework preset: **Next.js** (auto-detected)
4. Add environment variables under **Project Settings → Environment Variables**
5. Click **Deploy** — Vercel auto-deploys on every push to `main`

Your live URL will be `your-project-name.vercel.app`. A custom domain can be configured in Vercel project settings.

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|:--------:|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✓ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous public key | ✓ |

---

## Roadmap

- [ ] Supabase Auth — Google Sign-In for per-user progress saving
- [ ] Per-track listen history persisted to Supabase database
- [ ] PWA support — offline playback via Service Worker after first listen
- [ ] Mobile home screen install prompt
- [ ] Light mode variant

---

## Contributing

This project is a personal spiritual tool, open for respectful contributions. If you find a bug or have a considered suggestion, please open an issue. Pull requests are welcome with a clear description of the change.

Please treat the Gurbani, the Rehatnama, and the Gurmukhi script within this application with the reverence they deserve.

---

## Acknowledgements

> *ਓੁਹ ਠਾਕੁਰੁ ਮੈ ਉਸ ਕਾ ਚੇਰਾ*
>
> *"He is the Master. I am His humble servant."*
>
> — Rehatnama, Guru Gobind Singh Ji

All Gurbani is from Sri Guru Granth Sahib Ji and the Rehatnama of Guru Gobind Singh Ji. This application exists solely as a tool for the Sangat. It carries no commercial intent regarding the sacred content it holds.

---

<div align="center">

<br/>

☬ &nbsp;**ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ &nbsp;·&nbsp; ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ**&nbsp; ☬

<br/>

*Built with humility. Offered to the Sangat.*

<br/>

</div>
