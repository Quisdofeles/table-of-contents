import { useState, useMemo, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import recipesData from './data/recipes.json'
import Header from './components/Header'
import RecipeGrid from './components/RecipeGrid'
import ExpandedRecipe from './components/ExpandedRecipe'
import styles from './App.module.css'

const allRecipes = recipesData.recipes.slice().sort((a, b) =>
  a.title.localeCompare(b.title)
)

const allTags = [...new Set(allRecipes.flatMap(r => r.tags))].sort()

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const contentRef = useRef(null)

  const filteredRecipes = useMemo(() => {
    return allRecipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTag = !selectedTag || recipe.tags.includes(selectedTag)
      return matchesSearch && matchesTag
    })
  }, [searchQuery, selectedTag])

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setSelectedRecipe(null)
  }

  const handleLogoClick = () => {
    setSelectedRecipe(null)
  }

  const remainingRecipes = selectedRecipe
    ? filteredRecipes.filter(r => r.id !== selectedRecipe.id)
    : []

  return (
    <>
      <Header
        onSearch={setSearchQuery}
        onTagFilter={setSelectedTag}
        allTags={allTags}
        onLogoClick={handleLogoClick}
      />
      <main className={styles.main} ref={contentRef}>
        <AnimatePresence mode="wait">
          {selectedRecipe ? (
            <div key="expanded">
              <ExpandedRecipe recipe={selectedRecipe} onBack={handleBack} />
              {remainingRecipes.length > 0 && (
                <div style={{ marginTop: '48px' }}>
                  <RecipeGrid recipes={remainingRecipes} onSelectRecipe={handleSelectRecipe} />
                </div>
              )}
            </div>
          ) : (
            <RecipeGrid key="grid" recipes={filteredRecipes} onSelectRecipe={handleSelectRecipe} />
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
