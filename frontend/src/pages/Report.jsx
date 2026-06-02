import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { analyzeBrief } from '../services/api'

const CATEGORY_COLORS = ['#FF2D78', '#0057FF', '#FF6B00', '#00C896', '#9B5FFF']

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' }
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
        console.log('PARSED DATA:', data)
        setResults(Array.isArray(data.results) ? data.results : [])
        setVisualBoard(data.visualBoard || null)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
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
        Reading your creative signal...
      </motion.p>
    </div>
  )

  if (error) return (
    <div style={styles.centerScreen}>
      <p style={{ fontSize: '40px' }}>⚠️</p>
      <p style={styles.errorText}>{error}</p>
      <motion.button style={styles.retryBtn}
        whileHover={{ scale: 1.04 }}
        onClick={() => navigate('/upload')}
      >← Try Again</motion.button>
    </div>
  )

  return (
    <div style={styles.wrapper}>

      <nav style={styles.nav}>
        <motion.button style={styles.backBtn}
          whileHover={{ x: -4 }}
          onClick={() => navigate('/upload')}
        >← New Analysis</motion.button>
        <span style={styles.logo}>✦ CREATIVE SIGNAL</span>
      </nav>

      <main style={styles.main}>

        {/* Header */}
        <motion.div style={styles.pageHeader}
          variants={fadeUp} initial='hidden' animate='visible' custom={0}
        >
          <p style={styles.eyebrow}>✦ Signal Analysis Complete</p>
          <h1 style={styles.headline}>
            YOUR BRIEF<br />
            <span style={styles.headlineAccent}>BELONGS HERE.</span>
          </h1>
          <div style={styles.briefChip}>"{brief.title}"</div>
          {brief.selectedTags?.length > 0 && (
            <div style={styles.tagRow}>
              {brief.selectedTags.map((tag, i) => (
                <span key={i} style={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Overview */}
        <motion.div style={styles.overviewCard}
          variants={fadeUp} initial='hidden' animate='visible' custom={1}
        >
          <p style={styles.overviewTitle}>📊 Category Alignment Overview</p>
          {results.map((r, i) => {
            const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length]
            return (
              <div key={i} style={styles.overviewRow}>
                <div style={styles.overviewLeft}>
                  <span style={{ ...styles.overviewDot, backgroundColor: color }} />
                  <span style={styles.overviewName}>{r.category_name}</span>
                </div>
                <div style={styles.overviewRight}>
                  <div style={styles.scoreTrack}>
                    <motion.div
                      style={{ ...styles.scoreFill, backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${r.compatibility_score}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                  <span style={{ ...styles.scoreNum, color }}>{r.compatibility_score}</span>
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* Cards */}
        <div style={styles.cardsGrid}>
          {results.map((result, i) => {
            const color  = CATEGORY_COLORS[i % CATEGORY_COLORS.length]
            const isOpen = expanded === result.category_name
            return (
              <motion.div
                key={i}
                style={{ ...styles.card, borderColor: color, boxShadow: `5px 5px 0px ${color}` }}
                variants={fadeUp} initial='hidden' animate='visible' custom={i + 2}
                whileHover={{ y: -4 }}
              >
                <div style={{ ...styles.scoreBanner, backgroundColor: color }}>
                  <span style={styles.bannerScore}>{result.compatibility_score}</span>
                  <span style={styles.bannerLabel}>MATCH SCORE</span>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.cardHeader}
                    onClick={() => setExpanded(isOpen ? null : result.category_name)}
                  >
                    <div>
                      <p style={styles.categoryName}>{result.category_name}</p>
                      <p style={styles.categoryDesc}>{result.category_description}</p>
                    </div>
                    <motion.span
                      style={{ ...styles.expandBtn, borderColor: color, color }}
                      whileHover={{ backgroundColor: color, color: '#fff' }}
                    >
                      {isOpen ? '−' : '+'}
                    </motion.span>
                  </div>

                  <div style={{ ...styles.signalBox, borderColor: color, backgroundColor: `${color}10` }}>
                    <p style={styles.signalText}>"{result.signal_headline}"</p>
                  </div>

                  <div style={styles.brandsRow}>
                    <span style={styles.brandsLabel}>Examples:</span>
                    {result.example_brands?.map((brand, bi) => (
                      <span key={bi} style={{ ...styles.brandChip, borderColor: color, color }}>
                        {brand}
                      </span>
                    ))}
                  </div>

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
                          <p style={styles.blockLabel}>Strategic Observations</p>
                          {result.observations?.map((obs, oi) => (
                            <div key={oi} style={styles.obsRow}>
                              <span style={{ ...styles.obsBullet, backgroundColor: color }}>
                                {oi + 1}
                              </span>
                              <p style={styles.obsText}>{obs}</p>
                            </div>
                          ))}
                          <div style={{ ...styles.verdictBox, borderColor: color }}>
                            <p style={styles.blockLabel}>Creative Verdict</p>
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

        {/* Visual Signal Board */}
        {visualBoard && (
          <motion.div style={styles.visualBoard}
            variants={fadeUp} initial='hidden' animate='visible' custom={7}
          >
            <div style={styles.boardHeader}>
              <p style={styles.boardEyebrow}>✦ Visual Reference Board</p>
              <h2 style={styles.boardTitle}>YOUR AESTHETIC DNA</h2>
            </div>

            <div style={styles.boardSection}>
              <p style={styles.sectionLabel}>Color Palette</p>
              <div style={styles.paletteRow}>
                {visualBoard.color_palette?.map((hex, i) => (
                  <div key={i} style={styles.paletteItem}>
                    <motion.div
                      style={{ ...styles.colorSwatch, backgroundColor: hex }}
                      whileHover={{ scale: 1.1, y: -4 }}
                    />
                    <span style={styles.hexLabel}>{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.boardSection}>
              <p style={styles.sectionLabel}>Mood Keywords</p>
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
                    whileHover={{ scale: 1.06 }}
                  >
                    {kw}
                  </motion.span>
                ))}
              </div>
            </div>

            <div style={styles.boardSection}>
              <p style={styles.sectionLabel}>Cinematography Style</p>
              <div style={styles.cinemaBox}>
                <span style={styles.cinemaIcon}>🎬</span>
                <p style={styles.cinemaText}>{visualBoard.cinematography_style}</p>
              </div>
            </div>

            <div style={{ ...styles.boardSection, borderBottom: 'none' }}>
              <p style={styles.sectionLabel}>Reference Works</p>
              <div style={styles.refsGrid}>
                {visualBoard.reference_works?.map((ref, i) => {
                  const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length]
                  return (
                    <div key={i} style={{ ...styles.refCard, borderColor: color }}>
                      <div style={{ ...styles.refType, backgroundColor: color }}>{ref.type}</div>
                      <p style={styles.refTitle}>{ref.title}</p>
                      <p style={styles.refReason}>{ref.reason}</p>
                    </div>
                  )
                })}
              </div>
            </div>

          </motion.div>
        )}

        {/* CTA */}
        <motion.div variants={fadeUp} initial='hidden' animate='visible' custom={8}>
          <motion.button style={styles.ctaBtn}
            whileHover={{ scale: 1.04, rotate: -0.5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/upload')}
          >
            🚀 Analyze Another Brief
          </motion.button>
        </motion.div>

      </main>

      <footer style={styles.footer}>
        © 2025 Creative Signal — Editorial AI for Creative Directors
      </footer>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100dvh', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' },
  centerScreen: { minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', gap: '20px' },
  loader: { width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #E0E0E0', borderTopColor: '#0057FF' },
  loadingText: { fontFamily: 'var(--font-body)', fontSize: '15px', color: '#444', fontWeight: 600 },
  errorText: { fontFamily: 'var(--font-body)', fontSize: '15px', color: '#FF2D78', fontWeight: 600, textAlign: 'center', maxWidth: '400px' },
  retryBtn: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '14px', padding: '12px 28px', backgroundColor: '#0057FF', color: '#fff', border: '3px solid #111', borderRadius: '12px', boxShadow: '4px 4px 0px #111', cursor: 'pointer' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px', borderBottom: '3px solid #111', backgroundColor: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10 },
  backBtn: { fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '14px', backgroundColor: 'transparent', border: '2px solid #111', borderRadius: '100px', padding: '8px 20px', cursor: 'pointer', color: '#111' },
  logo: { fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '0.08em', color: '#111' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px 80px', gap: '40px' },
  pageHeader: { textAlign: 'center', maxWidth: '680px' },
  eyebrow: { fontFamily: 'var(--font-body)', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0057FF', marginBottom: '16px', fontWeight: 700 },
  headline: { fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 1.0, letterSpacing: '0.04em', color: '#111', marginBottom: '20px' },
  headlineAccent: { WebkitTextStroke: '3px #FF2D78', color: 'transparent' },
  briefChip: { display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: '14px', fontStyle: 'italic', color: '#444', backgroundColor: '#F5F5F5', border: '2px solid #E0E0E0', borderRadius: '100px', padding: '8px 20px', marginBottom: '16px' },
  tagRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' },
  tag: { fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid #0057FF', borderRadius: '100px', padding: '5px 14px', color: '#0057FF', backgroundColor: 'rgba(0,87,255,0.06)' },
  overviewCard: { width: '100%', maxWidth: '720px', backgroundColor: '#fff', border: '3px solid #111', borderRadius: '16px', boxShadow: '6px 6px 0px #111', padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '18px' },
  overviewTitle: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '14px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#111', marginBottom: '4px' },
  overviewRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' },
  overviewLeft: { display: 'flex', alignItems: 'center', gap: '10px', width: '200px', flexShrink: 0 },
  overviewDot: { width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0 },
  overviewName: { fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', color: '#111', letterSpacing: '0.04em' },
  overviewRight: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1 },
  scoreTrack: { flex: 1, height: '10px', backgroundColor: '#F0F0F0', borderRadius: '5px', overflow: 'hidden', border: '1px solid #E0E0E0' },
  scoreFill: { height: '100%', borderRadius: '5px' },
  scoreNum: { fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, width: '40px', textAlign: 'right', flexShrink: 0 },
  cardsGrid: { width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { backgroundColor: '#fff', border: '3px solid', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.25s ease' },
  scoreBanner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' },
  bannerScore: { fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700, color: '#fff', lineHeight: 1 },
  bannerLabel: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' },
  cardBody: { padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' },
  categoryName: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '18px', color: '#111', marginBottom: '4px' },
  categoryDesc: { fontFamily: 'var(--font-body)', fontSize: '13px', color: '#888', lineHeight: 1.5, maxWidth: '480px' },
  expandBtn: { width: '36px', height: '36px', borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '20px', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s ease', backgroundColor: 'transparent' },
  signalBox: { border: '2px solid', borderRadius: '12px', padding: '14px 18px' },
  signalText: { fontFamily: 'var(--font-body)', fontSize: '14px', fontStyle: 'italic', color: '#333', lineHeight: 1.7 },
  brandsRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  brandsLabel: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' },
  brandChip: { fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', border: '2px solid', borderRadius: '100px', padding: '4px 14px', backgroundColor: 'transparent' },
  expandedContent: { marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px', borderTop: '2px dashed #E0E0E0' },
  blockLabel: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#111', marginBottom: '8px' },
  obsRow: { display: 'flex', gap: '12px', alignItems: 'flex-start' },
  obsBullet: { width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '12px', flexShrink: 0 },
  obsText: { fontFamily: 'var(--font-body)', fontSize: '14px', color: '#444', lineHeight: 1.7 },
  verdictBox: { borderLeft: '4px solid', paddingLeft: '16px', marginTop: '8px' },
  verdictText: { fontFamily: 'var(--font-body)', fontSize: '14px', fontStyle: 'italic', color: '#111', lineHeight: 1.7, fontWeight: 600 },
  visualBoard: { width: '100%', maxWidth: '720px', backgroundColor: '#fff', border: '3px solid #111', borderRadius: '16px', boxShadow: '6px 6px 0px #111', overflow: 'hidden' },
  boardHeader: { backgroundColor: '#111', padding: '28px 36px', textAlign: 'center' },
  boardEyebrow: { fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FFE500', marginBottom: '8px', fontWeight: 700 },
  boardTitle: { fontFamily: 'var(--font-display)', fontSize: '36px', letterSpacing: '0.06em', color: '#fff' },
  boardSection: { padding: '28px 36px', borderBottom: '2px solid #F0F0F0' },
  sectionLabel: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#888', marginBottom: '16px' },
  paletteRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  paletteItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  colorSwatch: { width: '64px', height: '64px', borderRadius: '12px', border: '3px solid #111', boxShadow: '3px 3px 0px #111', cursor: 'pointer' },
  hexLabel: { fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700, color: '#444', letterSpacing: '0.06em' },
  keywordsRow: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  keyword: { fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', border: '2px solid', borderRadius: '100px', padding: '8px 18px', cursor: 'default' },
  cinemaBox: { display: 'flex', gap: '16px', alignItems: 'flex-start', backgroundColor: '#F8F8F8', border: '2px solid #E0E0E0', borderRadius: '12px', padding: '20px' },
  cinemaIcon: { fontSize: '28px', flexShrink: 0 },
  cinemaText: { fontFamily: 'var(--font-body)', fontSize: '15px', color: '#333', lineHeight: 1.8, fontStyle: 'italic' },
  refsGrid: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  refCard: { flex: '1 1 180px', border: '3px solid', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  refType: { padding: '6px 14px', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff' },
  refTitle: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '14px', color: '#111', padding: '12px 14px 4px' },
  refReason: { fontFamily: 'var(--font-body)', fontSize: '12px', color: '#666', lineHeight: 1.6, padding: '0 14px 14px' },
  ctaBtn: { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '16px', padding: '18px 48px', backgroundColor: '#0057FF', color: '#fff', border: '3px solid #111', borderRadius: '12px', boxShadow: '5px 5px 0px #111', cursor: 'pointer' },
  footer: { padding: '24px 48px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888', borderTop: '2px solid #F0F0F0' },
}