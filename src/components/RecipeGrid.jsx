import { useState, useRef, useEffect, useCallback } from 'react'
import RecipeCard from './RecipeCard'
import styles from './RecipeGrid.module.css'

const MIN_COL_WIDTH = 240

function getColCount(containerWidth) {
  return Math.max(1, Math.floor(containerWidth / MIN_COL_WIDTH))
}

export default function RecipeGrid({ recipes, onSelectRecipe }) {
  const gridRef = useRef(null)
  const [colCount, setColCount] = useState(4)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    let timeout
    const observer = new ResizeObserver((entries) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        const width = entries[0].contentRect.width
        setColCount(getColCount(width))
      }, 100)
    })

    observer.observe(el)
    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [])

  const columns = Array.from({ length: colCount }, () => [])
  recipes.forEach((recipe, i) => {
    columns[i % colCount].push({ recipe, index: i })
  })

  return (
    <div className={styles.grid} ref={gridRef}>
      {columns.map((col, colIndex) => (
        <div key={colIndex} className={styles.column}>
          {col.map(({ recipe, index }) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              index={index}
              onClick={onSelectRecipe}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
