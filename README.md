

# ☬ ਪਾਠ | Path.io

**An immersive, distraction-free spiritual workspace for daily Gurbani.**<br/>
*Listen. Breathe. Remember.*

## Overview

**Path.io** is a modern web application for listening to Nitnem, the daily Sikh prayers, in a structured and distraction-free environment.

Built with Next.js and Supabase, it provides access to eight Gurbani recordings through a simple audio experience that respects the traditional Nitnem sequence. The focus is on clarity, ease of use, and creating a peaceful space for daily spiritual practice.

---

## The Eight Paths

The following Nitnem prayers are included in their prescribed sequence. The playlist completes after the eighth path and does not loop back — silence is the intended close.

| # |Gurmukhi |English |Time of Day |
| --- | --- | --- | --- |
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



## Project Structure

```text
Path/
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── AudioPlayer.jsx
│   │   ├── CustomCursor.jsx
│   │   └── InteractiveBackground.jsx
│   └── lib/
│       ├── supabase.js
│       └── tracks.js
├── public/
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── package-lock.json
├── postcss.config.mjs
└── README.md
```

```
### Key Files

| File                                       | Purpose                           |
| ------------------------------------------ | --------------------------------- |
| `src/app/layout.js`                        | Root layout and global setup      |
| `src/app/page.js`                          | Main application page             |
| `src/components/AudioPlayer.jsx`           | Audio playback logic and controls |
| `src/components/InteractiveBackground.jsx` | Breathing Waheguru animation      |
| `src/components/CustomCursor.jsx`          | Custom desktop cursor             |
| `src/lib/tracks.js`                        | Track metadata and audio URLs     |
| `src/lib/supabase.js`                      | Supabase configuration            |

```
```
## Contributing

This project is a personal spiritual tool, open for respectful contributions. If you find a bug or have a considered suggestion, please open an issue. Pull requests are welcome with a clear description of the change.
Please treat the Gurbani and the Gurmukhi script within this application with the reverence they deserve.

---

<br/>

☬ &nbsp;**ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ &nbsp;·&nbsp; ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ**&nbsp; ☬

<br/>

*Built with humility. Offered to the Sangat.*

<br/>


