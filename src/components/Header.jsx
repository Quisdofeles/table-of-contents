import { useState, useRef, useEffect } from 'react'
import Logo from './Logo'
import styles from './Header.module.css'

export default function Header({ onSearch, onTagFilter, allTags, onLogoClick }) {
  const [searchValue, setSearchValue] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchValue(value)
    onSearch(value)
  }

  const handleTagSelect = (value) => {
    setSelectedTag(value)
    onTagFilter(value)
    setDropdownOpen(false)
  }

  const handleLogoClick = () => {
    setSearchValue('')
    setSelectedTag('')
    onSearch('')
    onTagFilter('')
    onLogoClick()
  }

  useEffect(() => {
    if (!dropdownOpen) return
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logoWrap}>
          <Logo onClick={handleLogoClick} />
        </div>
        <div className={styles.controls}>
          <div className={styles.searchBar}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchValue}
              onChange={handleSearch}
              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur() }}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.dropdown} ref={dropdownRef}>
            <button
              className={styles.tagFilter}
              onClick={() => setDropdownOpen(prev => !prev)}
              type="button"
            >
              {selectedTag || 'All Tags'}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={styles.chevron} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>
                <path d="M1 1L5 5L9 1" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {dropdownOpen && (
              <ul className={styles.dropdownList}>
                <li
                  className={`${styles.dropdownItem} ${selectedTag === '' ? styles.dropdownItemActive : ''}`}
                  onClick={() => handleTagSelect('')}
                >
                  All Tags
                </li>
                {allTags.map(tag => (
                  <li
                    key={tag}
                    className={`${styles.dropdownItem} ${selectedTag === tag ? styles.dropdownItemActive : ''}`}
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
