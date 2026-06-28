import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.copyright}>&copy;2026 TABLE OF CONTENTS &bull; ALL RIGHTS RESERVED</span>
      <span className={styles.powered}>
        POWERED BY{' '}
        <a
          href="https://robertbookdesign.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          ROBERT BOOK DESIGN
        </a>
      </span>
    </footer>
  )
}
