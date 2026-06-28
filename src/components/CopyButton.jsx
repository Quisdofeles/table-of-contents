import { useState } from 'react'

export default function CopyButton({ getText }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getText())
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy to clipboard"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        borderRadius: '8px',
        background: 'var(--color-ui)',
        transition: 'color 0.1s ease, background 0.1s ease',
        color: copied ? 'var(--color-accent)' : 'var(--color-text-secondary)',
        fontSize: '13px',
        fontFamily: 'var(--font-text-semibold)',
      }}
      onMouseEnter={e => { if (!copied) e.currentTarget.style.color = 'var(--color-accent)' }}
      onMouseLeave={e => { if (!copied) e.currentTarget.style.color = 'var(--color-text-secondary)' }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
