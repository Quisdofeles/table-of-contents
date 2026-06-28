import { motion } from 'framer-motion'
import styles from './RecipeCard.module.css'

export default function RecipeCard({ recipe, index, onClick }) {
  return (
    <motion.div
      className={styles.card}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
      }}
      whileHover={{ scale: 1.025, transition: { duration: 0.1, ease: "easeOut" } }}
      onClick={() => onClick(recipe)}
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
