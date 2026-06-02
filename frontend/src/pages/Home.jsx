import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
}

const float = {
  animate: {
    y: [0, -12, 0],
    rotate: [0, 3, -3, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
  }
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={styles.wrapper}>

      {/* ── Bold Color Blobs ── */}
      <div style={styles.blobBlue} />
      <div style={styles.blobPink} />
      <div style={styles.blobYellow} />

      {/* ── Navbar ── */}
      <nav style={styles.nav}>
        <span style={styles.logo}>✦ CREATIVE SIGNAL</span>
        <motion.button
          style={styles.navBtn}
          whileHover={{ backgroundColor: '#c800ff', color: '#fff' }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate('/upload')}
        >
          Try It Free
        </motion.button>
      </nav>

      {/* ── Hero ── */}
      <main style={styles.hero}>

        {/* Floating badge */}
        <motion.div
          style={styles.badge}
          variants={fadeUp}
          initial='hidden'
          animate='visible'
          custom={0}
        >
          🎨 Brand × Story Alignment Engine
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          style={styles.headline}
          variants={fadeUp}
          initial='hidden'
          animate='visible'
          custom={1}
        >
          DOES YOUR
          <span style={styles.outlineText}> VISION </span>
          <br />
          MATCH THE
          <span style={styles.highlightText}> BRAND? </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          style={styles.subtext}
          variants={fadeUp}
          initial='hidden'
          animate='visible'
          custom={2}
        >
          Drop your creative brief. We analyze its emotional signal
          against the world's most iconic brand identities — instantly.
        </motion.p>

        {/* CTA */}
        <motion.div
          style={styles.ctaRow}
          variants={fadeUp}
          initial='hidden'
          animate='visible'
          custom={3}
        >
          <motion.button
            style={styles.ctaPrimary}
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/upload')}
          >
            🚀 Analyze Your Signal
          </motion.button>

          <motion.button
            style={styles.ctaSecondary}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.96 }}
          >
            See How It Works ↓
          </motion.button>
        </motion.div>

        {/* Floating Brand Tags */}
        <motion.div
          style={styles.tagStrip}
          variants={fadeUp}
          initial='hidden'
          animate='visible'
          custom={4}
        >
          {[
            { name: 'Coca-Cola', color: '#FF2D78' },
            { name: 'Red Bull',  color: '#0057FF' },
            { name: 'Spotify',   color: '#00E676' },
            { name: 'Riot Games',color: '#FF6B00' },
            { name: 'Nike',      color: '#111111' },
          ].map((brand) => (
            <motion.span
              key={brand.name}
              style={{ ...styles.tag, borderColor: brand.color, color: brand.color }}
              whileHover={{ backgroundColor: brand.color, color: '#fff', scale: 1.08 }}
              transition={{ duration: 0.2 }}
            >
              {brand.name}
            </motion.span>
          ))}
        </motion.div>

      </main>

      {/* ── Floating Decorative Elements ── */}
      <motion.div style={styles.floatCircle1} variants={float} animate='animate' />
      <motion.div style={styles.floatCircle2} variants={float} animate='animate' />
      <motion.div style={{ ...styles.floatStar, top: '20%', right: '8%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >✦</motion.div>
      <motion.div style={{ ...styles.floatStar, bottom: '25%', left: '5%' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >◈</motion.div>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        <span>© 2025 Creative Signal — Editorial AI for Creative Directors</span>
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

  /* Color blobs */
  blobBlue: {
    position: 'absolute',
    top: '-120px',
    right: '-120px',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,87,255,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  blobPink: {
    position: 'absolute',
    bottom: '-100px',
    left: '-100px',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,45,120,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  blobYellow: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,229,0,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },

  /* Navbar */
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 48px',
    position: 'relative',
    zIndex: 2,
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    letterSpacing: '0.08em',
    color: 'var(--color-text-primary)',
  },
  navBtn: {
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: '13px',
    padding: '10px 24px',
    backgroundColor: 'transparent',
    color: 'var(--color-blue)',
    border: '2px solid var(--color-blue)',
    borderRadius: 'var(--radius-lg)',
    cursor: 'pointer',
    transition: 'var(--transition-base)',
  },

  /* Hero */
  hero: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 24px',
    position: 'relative',
    zIndex: 1,
    gap: '0px',
  },

  badge: {
    display: 'inline-block',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: '13px',
    letterSpacing: '0.05em',
    color: 'var(--color-blue)',
    backgroundColor: 'rgba(0,87,255,0.08)',
    border: '2px solid rgba(0,87,255,0.2)',
    borderRadius: 'var(--radius-lg)',
    padding: '8px 20px',
    marginBottom: '28px',
  },

  headline: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(56px, 10vw, 130px)',
    fontWeight: 400,
    lineHeight: 1.0,
    color: 'var(--color-text-primary)',
    letterSpacing: '0.04em',
    marginBottom: '28px',
    maxWidth: '900px',
  },
  outlineText: {
    WebkitTextStroke: '3px #0057FF',
    color: 'transparent',
  },
  highlightText: {
    backgroundColor: 'var(--color-yellow)',
    color: 'var(--color-text-primary)',
    padding: '0 12px',
    borderRadius: '8px',
    display: 'inline-block',
    transform: 'rotate(-1.5deg)',
  },

  subtext: {
    fontFamily: 'var(--font-body)',
    fontSize: '17px',
    fontWeight: 400,
    color: 'var(--color-text-secondary)',
    lineHeight: 1.8,
    marginBottom: '40px',
    maxWidth: '520px',
  },

  ctaRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '56px',
  },
  ctaPrimary: {
    fontFamily: 'var(--font-body)',
    fontWeight: 800,
    fontSize: '15px',
    padding: '16px 36px',
    backgroundColor: 'var(--color-blue)',
    color: '#ffffff',
    border: '3px solid #111111',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    boxShadow: '4px 4px 0px #111111',
    transition: 'var(--transition-base)',
  },
  ctaSecondary: {
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: '15px',
    padding: '16px 36px',
    backgroundColor: 'var(--color-yellow)',
    color: '#111111',
    border: '3px solid #111111',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    boxShadow: '4px 4px 0px #111111',
    transition: 'var(--transition-base)',
  },

  /* Brand Tags */
  tagStrip: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tag: {
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: '12px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    border: '2px solid',
    borderRadius: '100px',
    padding: '6px 18px',
    cursor: 'default',
    transition: 'var(--transition-base)',
  },

  /* Floating decorative */
  floatCircle1: {
    position: 'absolute',
    top: '15%',
    left: '3%',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-pink)',
    border: '3px solid #111',
    zIndex: 0,
    pointerEvents: 'none',
  },
  floatCircle2: {
    position: 'absolute',
    bottom: '20%',
    right: '4%',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-lime)',
    border: '3px solid #111',
    zIndex: 0,
    pointerEvents: 'none',
  },
  floatStar: {
    position: 'absolute',
    fontSize: '28px',
    color: 'var(--color-orange)',
    zIndex: 0,
    pointerEvents: 'none',
  },

  /* Footer */
  footer: {
    padding: '20px 48px',
    textAlign: 'center',
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    position: 'relative',
    zIndex: 1,
  }
}