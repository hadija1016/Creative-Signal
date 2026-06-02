import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { analyzeBrief } from '../services/api'

const CATEGORY_COLORS = ['#FF2D78', '#0057FF', '#FF6B00', '#00C896', '#9B5FFF']
const CATEGORY_BG     = ['#FFF0F5', '#F0F4FF', '#FFF4EE', '#F0FFF8', '#F8F0FF']

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' }
  })
}

export default function Report() {
  const navigate     = useNavigate()
  const location     = useLocation()
  const brief        = location.state

  const [results,     setResults]     = useState([])
  const [visualBoard, setVisualBoard] = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [expanded,    setExpanded]    = useState(null)

  useEffect(() => {
    if (!brief) { navigate('/upload'); return }
    analyzeBrief({
      title:       brief.title,
      description: brief.description,
      moodTags:    brief.selectedTags,
      hasImage:    !!brief.imageFile,
    })
      .then(data => {
        setResults(Array.isArray(data.results) ? data.results : [])
        setVisualBoard(data.visualBoard || null)
        setLoading(false)
      })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) return (
    <div style={styles.centerScreen}>
      <motion.div style={styles.loader}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.p style={styles.loadingText}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🔍 Reading your creative signal...
      </motion.p>
    </div>
  )

  if (error) return (
    <div style={styles.centerScreen}>
      <p style={{ fontSize: '48px' }}>⚠️</p>
      <p style={styles.errorText}>{error}</p>
      <motion.button style={styles.retryBtn}
        whileHover={{ scale: 1.04 }}
        onClick={() => navigate('/upload')}
      >← Try Again</motion.button>
    </div>
  )

  return (
    <div style={styles.wrapper}>

      {/* Sticky Nav */}
      <nav style={styles.nav}>
        <motion.button style={styles.backBtn}
          whileHover={{ x: -4 }}
          onClick={() => navigate('/upload')}
        >← New Analysis</motion.button>
        <span style={styles.logo}>✦ CREATIVE SIGNAL</span>
        <span style={styles.navTag}>Signal Report</span>
      </nav>

      <main style={styles.main}>

        {/* ── Hero Header ── */}
        <motion.div style={styles.heroSection}
          variants={fadeUp} initial='hidden' animate='visible' custom={0}
        >
          <div style={styles.heroBg} />
          <p style={styles.eyebrow}>✦ Signal Analysis Complete</p>
          <h1 style={styles.headline}>
            YOUR BRIEF
            <span style={styles.headlineAccent}> BELONGS</span>
            <br />
            <span style={styles.headlineOutline}>HERE.</span>
          </h1>
          <div style={styles.briefMeta}>
            <span style={styles.briefChip}>📁 {brief.title}</span>
            {brief.selectedTags?.length > 0 && brief.selectedTags.map((tag, i) => (
              <span key={i} style={{
                ...styles.tag,
                backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] + '20',
                borderColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
              }}>{tag}</span>
            ))}
          </div>
        </motion.div>

        {/* ── Overview Bar ── */}
        <motion.div style={styles.overviewCard}
          variants={fadeUp} initial='hidden' animate='visible' custom={1}
        >
          <p style={styles.overviewTitle}>📊 Category Alignment Overview</p>
          <div style={styles.overviewGrid}>
            {results.map((r, i) => {
              const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length]
              const bg    = CATEGORY_BG[i % CATEGORY_BG.length]
              return (
                <div key={i} style={{ ...styles.overviewItem, backgroundColor: bg, borderColor: color }}>
                  <div style={{ ...styles.overviewScoreBig, color }}>{r.compatibility_score}</div>
                  <div style={styles.overviewDetails}>
                    <span style={{ ...styles.overviewDot, backgroundColor: color }} />
                    <span style={styles.overviewName}>{r.category_name}</span>
                  </div>
                  <div style={styles.miniTrack}>
                    <motion.div
                      style={{ ...styles.miniFill, backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${r.compatibility_score}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* ── Category Cards Grid ── */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>🎯 Brand Category Matches</h2>
          <p style={styles.sectionSub}>Click any card to expand strategic insights</p>
        </div>

        <div style={styles.cardsGrid}>
          {results.map((result, i) => {
            const color  = CATEGORY_COLORS[i % CATEGORY_COLORS.length]
            const bg     = CATEGORY_BG[i % CATEGORY_BG.length]
            const isOpen = expanded === result.category_name
            return (
              <motion.div
                key={i}
                style={{
                  ...styles.card,
                  borderColor: color,
                  boxShadow: isOpen ? `6px 6px 0px ${color}` : `4px 4px 0px ${color}`,
                  gridColumn: results.length === 5 && i === 4 ? 'span 1' : 'span 1',
                }}
                variants={fadeUp} initial='hidden' animate='visible' custom={i + 2}
                whileHover={{ y: -6, boxShadow: `6px 6px 0px ${color}` }}
              >
                {/* Top Color Strip */}
                <div style={{ ...styles.cardStrip, backgroundColor: color }}>
                  <span style={styles.stripScore}>{result.compatibility_score}</span>
                  <span style={styles.stripLabel}>/ 100</span>
                </div>

                {/* Card Content */}
                <div style={{ ...styles.cardContent, backgroundColor: isOpen ? bg : '#fff' }}>
                  <p style={{ ...styles.categoryName, color }}>{result.category_name}</p>
                  <p style={styles.categoryDesc}>{result.category_description}</p>

                  {/* Signal Quote */}
                  <div style={{ ...styles.signalBox, borderColor: color }}>
                    <p style={styles.signalText}>"{result.signal_headline}"</p>
                  </div>

                  {/* Brand Pills */}
                  <div style={styles.brandsRow}>
                    {result.example_brands?.map((brand, bi) => (
                      <span key={bi} style={{ ...styles.brandChip, backgroundColor: color, }}>
                        {brand}
                      </span>
                    ))}
                  </div>

                  {/* Expand Button */}
                  <motion.button
                    style={{ ...styles.expandBtn, borderColor: color, color }}
                    whileHover={{ backgroundColor: color, color: '#fff' }}
                    onClick={() => setExpanded(isOpen ? null : result.category_name)}
                  >
                    {isOpen ? '− Hide Insights' : '+ View Insights'}
                  </motion.button>

                  {/* Expanded */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={styles.expandedContent}>
                          <p style={{ ...styles.blockLabel, color }}>Strategic Observations</p>
                          {result.observations?.map((obs, oi) => (
                            <div key={oi} style={styles.obsRow}>
                              <span style={{ ...styles.obsBullet, backgroundColor: color }}>{oi + 1}</span>
                              <p style={styles.obsText}>{obs}</p>
                            </div>
                          ))}
                          <div style={{ ...styles.verdictBox, borderColor: color, backgroundColor: color + '10' }}>
                            <p style={{ ...styles.blockLabel, color }}>✦ Creative Verdict</p>
                            <p style={styles.verdictText}>{result.creative_verdict}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* ── Visual Signal Board ── */}
        {visualBoard && (
          <motion.div style={styles.visualBoard}
            variants={fadeUp} initial='hidden' animate='visible' custom={7}
          >
            {/* Board Header */}
            <div style={styles.boardHeader}>
              <div>
                <p style={styles.boardEyebrow}>✦ Visual Reference Board</p>
                <h2 style={styles.boardTitle}>YOUR AESTHETIC DNA</h2>
              </div>
              <span style={styles.boardIcon}>🎨</span>
            </div>

            {/* 2-Column Grid Layout */}
            <div style={styles.boardGrid}>

              {/* Color Palette */}
              <div style={styles.boardCell}>
                <p style={styles.sectionLabel}>🎨 Color Palette</p>
                <div style={styles.paletteRow}>
                  {visualBoard.color_palette?.map((hex, i) => (
                    <div key={i} style={styles.paletteItem}>
                      <motion.div
                        style={{ ...styles.colorSwatch, backgroundColor: hex }}
                        whileHover={{ scale: 1.15, y: -6 }}
                        title={hex}
                      />
                      <span style={styles.hexLabel}>{hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mood Keywords */}
              <div style={styles.boardCell}>
                <p style={styles.sectionLabel}>✨ Mood Keywords</p>
                <div style={styles.keywordsRow}>
                  {visualBoard.mood_keywords?.map((kw, i) => (
                    <motion.span
                      key={i}
                      style={{
                        ...styles.keyword,
                        backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] + '15',
                        borderColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                      }}
                      whileHover={{ scale: 1.08 }}
                    >
                      {kw}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Cinematography */}
              <div style={{ ...styles.boardCell, gridColumn: 'span 2' }}>
                <p style={styles.sectionLabel}>🎬 Cinematography Style</p>
                <div style={styles.cinemaBox}>
                  <p style={styles.cinemaText}>{visualBoard.cinematography_style}</p>
                </div>
              </div>

              {/* Reference Works */}
              <div style={{ ...styles.boardCell, gridColumn: 'span 2', borderBottom: 'none' }}>
                <p style={styles.sectionLabel}>📽️ Reference Works</p>
                <div style={styles.refsGrid}>
                  {visualBoard.reference_works?.map((ref, i) => {
                    const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length]
                    return (
                      <motion.div
                        key={i}
                        style={{ ...styles.refCard, borderColor: color }}
                        whileHover={{ y: -4, boxShadow: `4px 4px 0px ${color}` }}
                      >
                        <div style={{ ...styles.refType, backgroundColor: color }}>{ref.type}</div>
                        <p style={{ ...styles.refTitle, color }}>{ref.title}</p>
                        <p style={styles.refReason}>{ref.reason}</p>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div style={styles.ctaBlock}
          variants={fadeUp} initial='hidden' animate='visible' custom={8}
        >
          <motion.button style={styles.ctaBtn}
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/upload')}
          >
            🚀 Analyze Another Brief
          </motion.button>
          <p style={styles.ctaNote}>Every brief tells a different story.</p>
        </motion.div>

      </main>

      <footer style={styles.footer}>
        <span>© 2025 Creative Signal</span>
        <span style={styles.footerDivider}>✦</span>
        <span>Editorial AI for Creative Directors</span>
      </footer>
    </div>
  )
}

/* ─── Styles ─────────────────────────────────────────────── */
const styles = {
  wrapper: { minHeight: '100dvh', backgroundColor: '#ffecfd', display: 'flex', flexDirection: 'column' },

  centerScreen: { minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e3b0f9', gap: '20px' },
  loader: { width: '52px', height: '52px', borderRadius: '50%', border: '5px solid #cae7fa', borderTopColor: '#0057FF' },
  loadingText: { fontFamily: 'var(--font-body)', fontSize: '16px', color: '#444', fontWeight: 700 },
  errorText: { fontFamily: 'var(--font-body)', fontSize: '15px', color: '#FF2D78', fontWeight: 600, textAlign: 'center', maxWidth: '400px' },
  retryBtn: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '14px', padding: '12px 28px', backgroundColor: '#0057FF', color: '#fff', border: '3px solid #111', borderRadius: '12px', boxShadow: '4px 4px 0px #111', cursor: 'pointer' },

  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '3px solid #111', backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 10 },
  backBtn: { fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13px', backgroundColor: 'transparent', border: '2px solid #111', borderRadius: '100px', padding: '8px 18px', cursor: 'pointer', color: '#111' },
  logo: { fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '0.08em', color: '#111' },
  navTag: { fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', border: '2px solid #E0E0E0', borderRadius: '100px', padding: '6px 14px' },

  main: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px 80px', gap: '40px' },

  /* Hero */
  heroSection: { width: '100%', textAlign: 'center', padding: '60px 24px 48px', position: 'relative', borderBottom: '3px solid #111', backgroundColor: '#fff', overflow: 'hidden' },
  heroBg: { position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,87,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' },
  eyebrow: { fontFamily: 'var(--font-body)', fontSize: '12px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0057FF', marginBottom: '16px', fontWeight: 700 },
  headline: { fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 9vw, 110px)', lineHeight: 1.0, letterSpacing: '0.04em', color: '#111', marginBottom: '24px' },
  headlineAccent: { color: '#FF2D78' },
  headlineOutline: { WebkitTextStroke: '3px #0057FF', color: 'transparent' },
  briefMeta: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' },
  briefChip: { fontFamily: 'var(--font-body)', fontSize: '14px', fontStyle: 'italic', color: '#444', backgroundColor: '#F0F0F0', border: '2px solid #E0E0E0', borderRadius: '100px', padding: '8px 20px' },
  tag: { fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid', borderRadius: '100px', padding: '6px 14px' },

  /* Overview */
  overviewCard: { width: '100%', maxWidth: '1100px', backgroundColor: '#fff', border: '3px solid #111', borderRadius: '20px', boxShadow: '6px 6px 0px #111', padding: '32px 36px', marginTop: '40px' },
  overviewTitle: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '14px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#111', marginBottom: '20px' },
  overviewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' },
  overviewItem: { border: '2px solid', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  overviewScoreBig: { fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 700, lineHeight: 1 },
  overviewDetails: { display: 'flex', alignItems: 'center', gap: '8px' },
  overviewDot: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  overviewName: { fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px', color: '#111', letterSpacing: '0.04em', lineHeight: 1.3 },
  miniTrack: { height: '6px', backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' },
  miniFill: { height: '100%', borderRadius: '3px' },

  /* Section Header */
  sectionHeader: { width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: '28px', color: '#111', letterSpacing: '0.04em' },
  sectionSub: { fontFamily: 'var(--font-body)', fontSize: '13px', color: '#888', fontStyle: 'italic' },

  /* Cards Grid — 3 columns */
  cardsGrid: { width: '100%', maxWidth: '1100px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  card: { backgroundColor: '#fff', border: '3px solid', borderRadius: '20px', overflow: 'hidden', transition: 'all 0.25s ease', display: 'flex', flexDirection: 'column' },
  cardStrip: { padding: '16px 20px', display: 'flex', alignItems: 'baseline', gap: '4px' },
  stripScore: { fontFamily: 'var(--font-display)', fontSize: '48px', color: '#fff', fontWeight: 700, lineHeight: 1 },
  stripLabel: { fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 },
  cardContent: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, transition: 'background 0.3s ease' },
  categoryName: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '17px', lineHeight: 1.2 },
  categoryDesc: { fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888', lineHeight: 1.6 },
  signalBox: { border: '2px solid', borderRadius: '10px', padding: '12px 14px' },
  signalText: { fontFamily: 'var(--font-body)', fontSize: '12px', fontStyle: 'italic', color: '#333', lineHeight: 1.7 },
  brandsRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  brandChip: { fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', borderRadius: '100px', padding: '4px 12px', color: '#fff' },
  expandBtn: { fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', padding: '10px 16px', backgroundColor: 'transparent', border: '2px solid', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'center', marginTop: 'auto' },
  expandedContent: { marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '12px', borderTop: '2px dashed #E0E0E0' },
  blockLabel: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '6px' },
  obsRow: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
  obsBullet: { width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '11px', flexShrink: 0 },
  obsText: { fontFamily: 'var(--font-body)', fontSize: '12px', color: '#444', lineHeight: 1.7 },
  verdictBox: { border: '2px solid', borderRadius: '10px', padding: '12px 14px' },
  verdictText: { fontFamily: 'var(--font-body)', fontSize: '12px', fontStyle: 'italic', color: '#111', lineHeight: 1.7, fontWeight: 600 },

  /* Visual Board */
  visualBoard: { width: '100%', maxWidth: '1100px', backgroundColor: '#fff', border: '3px solid #111', borderRadius: '20px', boxShadow: '6px 6px 0px #111', overflow: 'hidden' },
  boardHeader: { backgroundColor: '#111', padding: '28px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  boardEyebrow: { fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FFE500', marginBottom: '6px', fontWeight: 700 },
  boardTitle: { fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '0.06em', color: '#fff' },
  boardIcon: { fontSize: '48px' },
  boardGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' },
  boardCell: { padding: '28px 32px', borderBottom: '2px solid #F0F0F0', borderRight: '2px solid #F0F0F0' },
  sectionLabel: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', marginBottom: '16px' },
  paletteRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  paletteItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  colorSwatch: { width: '56px', height: '56px', borderRadius: '12px', border: '3px solid #111', boxShadow: '3px 3px 0px #111', cursor: 'pointer' },
  hexLabel: { fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700, color: '#444', letterSpacing: '0.06em' },
  keywordsRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  keyword: { fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', border: '2px solid', borderRadius: '100px', padding: '6px 14px', cursor: 'default' },
  cinemaBox: { backgroundColor: '#F8F8F8', border: '2px solid #E0E0E0', borderRadius: '12px', padding: '20px' },
  cinemaText: { fontFamily: 'var(--font-body)', fontSize: '15px', color: '#333', lineHeight: 1.9, fontStyle: 'italic' },
  refsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  refCard: { border: '3px solid', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.2s ease' },
  refType: { padding: '6px 14px', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff' },
  refTitle: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '15px', padding: '12px 16px 4px' },
  refReason: { fontFamily: 'var(--font-body)', fontSize: '12px', color: '#666', lineHeight: 1.6, padding: '0 16px 16px' },

  /* CTA */
  ctaBlock: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  ctaBtn: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '16px', padding: '18px 52px', backgroundColor: '#0057FF', color: '#fff', border: '3px solid #111', borderRadius: '14px', boxShadow: '5px 5px 0px #111', cursor: 'pointer' },
  ctaNote: { fontFamily: 'var(--font-body)', fontSize: '13px', color: '#888', fontStyle: 'italic' },

  footer: { padding: '24px 48px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888', borderTop: '3px solid #111', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center' },
  footerDivider: { color: '#FFE500', fontSize: '16px' },
}