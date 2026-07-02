import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import RecipeCard from './RecipeCard'
import styles from './RecipeGrid.module.css'

const MIN_COL_WIDTH = 240

function getColCount(containerWidth) {
  if (containerWidth <= 300) return 1
  if (containerWidth <= 600) return 2
  return Math.max(2, Math.floor(containerWidth / MIN_COL_WIDTH))
}

const columnVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
}

export default function RecipeGrid({ recipes, onSelectRecipe }) {
  const gridRef = useRef(null)
  const [colCount, setColCount] = useState(() => getColCount(window.innerWidth))

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width
      setColCount(getColCount(width))
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const columns = Array.from({ length: colCount }, () => [])
  recipes.forEach((recipe, i) => {
    columns[i % colCount].push({ recipe, index: i })
  })

  return (
    <div className={styles.grid} ref={gridRef}>
      {columns.map((col, colIndex) => (
        <motion.div
          key={colIndex}
          className={styles.column}
          initial="hidden"
          animate="visible"
          variants={columnVariants}
        >
          {col.map(({ recipe, index }) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              index={index}
              onClick={onSelectRecipe}
            />
          ))}
        </motion.div>
      ))}
    </div>
  )
}