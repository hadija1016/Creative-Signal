import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const MOOD_TAGS = [
  'Energetic', 'Cinematic', 'Minimal', 'Bold',
  'Playful', 'Emotional', 'Dark', 'Vibrant',
  'Luxury', 'Raw'
]

const TAG_COLORS = {
  Energetic: '#FF2D78',
  Cinematic: '#0057FF',
  Minimal:   '#111111',
  Bold:      '#FF6B00',
  Playful:   '#FFE500',
  Emotional: '#9B5FFF',
  Dark:      '#222222',
  Vibrant:   '#00E676',
  Luxury:    '#C9A84C',
  Raw:       '#FF4444',
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' }
  })
}

export default function Upload() {
  const navigate = useNavigate()
  const fileRef  = useRef(null)

  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [imageFile,   setImageFile]   = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragging,    setDragging]    = useState(false)

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleAnalyze = () => {
    if (!title || !description) return
    // Will wire to backend in next step
    navigate('/report', {
      state: { title, description, selectedTags, imageFile }
    })
  }

  const isReady = title.trim() && description.trim()

  return (
    <div style={styles.wrapper}>

      {/* ── Blobs ── */}
      <div style={styles.blobBlue} />
      <div style={styles.blobPink} />

      {/* ── Navbar ── */}
      <nav style={styles.nav}>
        <motion.button
          style={styles.backBtn}
          whileHover={{ x: -4 }}
          onClick={() => navigate('/')}
        >
          ← Back
        </motion.button>
        <span style={styles.logo}>✦ CREATIVE SIGNAL</span>
      </nav>

      {/* ── Content ── */}
      <main style={styles.main}>

        {/* Page Header */}
        <motion.div
          style={styles.pageHeader}
          variants={fadeUp} initial='hidden' animate='visible' custom={0}
        >
          <p style={styles.eyebrow}>Step 01 — Creative Brief</p>
          <h1 style={styles.headline}>TELL US YOUR<br />
            <span style={styles.headlineAccent}>SIGNAL.</span>
          </h1>
          <p style={styles.subtext}>
            Describe your creative project. The more honest, the sharper the analysis.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          style={styles.card}
          variants={fadeUp} initial='hidden' animate='visible' custom={1}
        >

          {/* Project Title */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Project Title *</label>
            <input
              style={styles.input}
              placeholder='e.g. Neon Runaway — Summer Campaign'
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={80}
            />
          </div>

          {/* Description */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Creative Description *
              <span style={styles.charCount}>{description.length}/400</span>
            </label>
            <textarea
              style={styles.textarea}
              placeholder='Describe the visual language, pacing, emotional tone, and storytelling approach of your project...'
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={400}
              rows={5}
            />
          </div>

          {/* Mood Tags */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Mood Tags
              <span style={styles.charCount}>{selectedTags.length} selected</span>
            </label>
            <div style={styles.tagGrid}>
              {MOOD_TAGS.map(tag => {
                const active = selectedTags.includes(tag)
                const color  = TAG_COLORS[tag]
                return (
                  <motion.button
                    key={tag}
                    style={{
                      ...styles.moodTag,
                      backgroundColor: active ? color : 'transparent',
                      color:           active ? (color === '#FFE500' ? '#111' : '#fff') : '#111',
                      borderColor:     color,
                    }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Image Upload */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Visual Reference <span style={styles.optional}>(optional)</span></label>
            <motion.div
              style={{
                ...styles.dropZone,
                borderColor: dragging ? '#0057FF' : '#E0E0E0',
                backgroundColor: dragging ? 'rgba(0,87,255,0.05)' : '#FAFAFA',
              }}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
              whileHover={{ borderColor: '#0057FF' }}
            >
              <input
                ref={fileRef}
                type='file'
                accept='image/*'
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])}
              />

              <AnimatePresence mode='wait'>
                {imagePreview ? (
                  <motion.div
                    key='preview'
                    style={styles.previewWrapper}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <img src={imagePreview} alt='preview' style={styles.previewImg} />
                    <p style={styles.previewName}>{imageFile.name}</p>
                    <p style={styles.previewChange}>Click to change</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key='placeholder'
                    style={styles.dropPlaceholder}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span style={styles.dropIcon}>🖼️</span>
                    <p style={styles.dropText}>Drag & drop or <span style={styles.dropLink}>browse</span></p>
                    <p style={styles.dropHint}>PNG, JPG, WEBP — max 10MB</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Submit */}
          <motion.button
            style={{
              ...styles.analyzeBtn,
              opacity:  isReady ? 1 : 0.4,
              cursor:   isReady ? 'pointer' : 'not-allowed',
            }}
            whileHover={isReady ? { scale: 1.03, rotate: -0.5 } : {}}
            whileTap={isReady ? { scale: 0.97 } : {}}
            onClick={handleAnalyze}
          >
            🚀 Analyze My Signal
          </motion.button>

          {!isReady && (
            <p style={styles.hint}>Fill in title and description to continue.</p>
          )}

        </motion.div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        © 2025 Creative Signal — Editorial AI for Creative Directors
      </footer>

    </div>
  )
}

/* ─── Styles ─────────────────────────────────────────────── */
const styles = {
  wrapper: {
    minHeight: '100dvh',
    backgroundColor: 'var(--color-bg)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  blobBlue: {
    position: 'absolute', top: '-100px', right: '-100px',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,87,255,0.1) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
  blobPink: {
    position: 'absolute', bottom: '-80px', left: '-80px',
    width: '350px', height: '350px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,45,120,0.1) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },

  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '24px 48px', position: 'relative', zIndex: 2,
  },
  backBtn: {
    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '14px',
    backgroundColor: 'transparent', border: '2px solid #111',
    borderRadius: 'var(--radius-lg)', padding: '8px 20px',
    cursor: 'pointer', color: '#111', transition: 'var(--transition-base)',
  },
  logo: {
    fontFamily: 'var(--font-display)', fontSize: '20px',
    letterSpacing: '0.08em', color: 'var(--color-text-primary)',
  },

  main: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', padding: '40px 24px 60px',
    position: 'relative', zIndex: 1, gap: '40px',
  },

  pageHeader: {
    textAlign: 'center', maxWidth: '600px',
  },
  eyebrow: {
    fontFamily: 'var(--font-body)', fontSize: '11px',
    letterSpacing: '0.2em', textTransform: 'uppercase',
    color: 'var(--color-blue)', marginBottom: '12px', fontWeight: 700,
  },
  headline: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(40px, 7vw, 80px)',
    lineHeight: 1.05, letterSpacing: '0.04em',
    color: 'var(--color-text-primary)', marginBottom: '16px',
  },
  headlineAccent: {
    WebkitTextStroke: '3px #FF2D78', color: 'transparent',
  },
  subtext: {
    fontFamily: 'var(--font-body)', fontSize: '15px',
    color: 'var(--color-text-secondary)', lineHeight: 1.7,
  },

  card: {
    width: '100%', maxWidth: '680px',
    backgroundColor: '#fff',
    border: '3px solid #111',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '6px 6px 0px #111',
    padding: '40px',
    display: 'flex', flexDirection: 'column', gap: '28px',
  },

  fieldGroup: {
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  label: {
    fontFamily: 'var(--font-body)', fontWeight: 800,
    fontSize: '13px', letterSpacing: '0.08em',
    textTransform: 'uppercase', color: '#111',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  charCount: {
    fontWeight: 400, fontSize: '11px', color: 'var(--color-text-muted)',
    textTransform: 'none', letterSpacing: 0,
  },
  optional: {
    fontWeight: 400, fontSize: '11px',
    color: 'var(--color-text-muted)', textTransform: 'none',
  },
  input: {
    fontFamily: 'var(--font-body)', fontSize: '15px',
    padding: '14px 16px', border: '2px solid #E0E0E0',
    borderRadius: 'var(--radius-md)', outline: 'none',
    transition: 'border-color 0.2s',
    color: '#111', backgroundColor: '#FAFAFA',
  },
  textarea: {
    fontFamily: 'var(--font-body)', fontSize: '15px',
    padding: '14px 16px', border: '2px solid #E0E0E0',
    borderRadius: 'var(--radius-md)', outline: 'none',
    resize: 'vertical', lineHeight: 1.7,
    color: '#111', backgroundColor: '#FAFAFA',
    transition: 'border-color 0.2s',
  },

  tagGrid: {
    display: 'flex', flexWrap: 'wrap', gap: '10px',
  },
  moodTag: {
    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px',
    letterSpacing: '0.06em', padding: '8px 18px',
    border: '2px solid', borderRadius: '100px',
    cursor: 'pointer', transition: 'all 0.2s ease',
  },

  dropZone: {
    border: '2px dashed', borderRadius: 'var(--radius-md)',
    padding: '32px', cursor: 'pointer',
    transition: 'all 0.2s ease', textAlign: 'center',
  },
  dropPlaceholder: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '8px',
  },
  dropIcon: { fontSize: '32px' },
  dropText: {
    fontFamily: 'var(--font-body)', fontSize: '14px',
    fontWeight: 600, color: '#111',
  },
  dropLink: { color: 'var(--color-blue)', textDecoration: 'underline' },
  dropHint: {
    fontFamily: 'var(--font-body)', fontSize: '11px',
    color: 'var(--color-text-muted)',
  },
  previewWrapper: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '8px',
  },
  previewImg: {
    width: '100%', maxHeight: '180px',
    objectFit: 'cover', borderRadius: 'var(--radius-md)',
    border: '2px solid #E0E0E0',
  },
  previewName: {
    fontFamily: 'var(--font-body)', fontSize: '12px',
    fontWeight: 700, color: '#111',
  },
  previewChange: {
    fontFamily: 'var(--font-body)', fontSize: '11px',
    color: 'var(--color-blue)', textDecoration: 'underline', cursor: 'pointer',
  },

  analyzeBtn: {
    fontFamily: 'var(--font-body)', fontWeight: 800,
    fontSize: '16px', padding: '18px',
    backgroundColor: 'var(--color-blue)', color: '#fff',
    border: '3px solid #111', borderRadius: 'var(--radius-md)',
    boxShadow: '4px 4px 0px #111', cursor: 'pointer',
    transition: 'var(--transition-base)', width: '100%',
    letterSpacing: '0.04em',
  },
  hint: {
    fontFamily: 'var(--font-body)', fontSize: '12px',
    color: 'var(--color-text-muted)', textAlign: 'center',
  },

  footer: {
    padding: '20px 48px', textAlign: 'center',
    fontFamily: 'var(--font-body)', fontSize: '12px',
    color: 'var(--color-text-muted)', position: 'relative', zIndex: 1,
  },
}