import { useState, useMemo } from 'react'
import Logo from './Logo'
import styles from './Header.module.css'

export default function Header({ onSearch, onTagFilter, allTags, onLogoClick }) {
  const [searchValue, setSearchValue] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchValue(value)
    onSearch(value)
  }

  const handleTagChange = (e) => {
    const value = e.target.value
    setSelectedTag(value)
    onTagFilter(value)
  }

  const handleLogoClick = () => {
    setSearchValue('')
    setSelectedTag('')
    onSearch('')
    onTagFilter('')
    onLogoClick()
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo onClick={handleLogoClick} />
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
              className={styles.searchInput}
            />
          </div>
          <select
            value={selectedTag}
            onChange={handleTagChange}
            className={styles.tagFilter}
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  )
}
