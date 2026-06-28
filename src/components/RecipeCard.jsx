import { motion } from 'framer-motion'
import styles from './RecipeCard.module.css'

export default function RecipeCard({ recipe, index, onClick }) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => onClick(recipe)}
      layout
      layoutId={`card-${recipe.id}`}
    >
      <div className={styles.imageWrap}>
        <img
          src={`/${recipe.bgImage}`}
          alt={recipe.title}
          className={styles.image}
          style={{ aspectRatio: recipe.aspectRatio }}
          loading="lazy"
        />
      </div>
      <p className={styles.title}>{recipe.title}</p>
    </motion.div>
  )
}
