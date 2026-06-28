import { AnimatePresence } from 'framer-motion'
import RecipeCard from './RecipeCard'
import styles from './RecipeGrid.module.css'

export default function RecipeGrid({ recipes, onSelectRecipe }) {
  return (
    <div className={styles.grid}>
      <AnimatePresence mode="popLayout">
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            index={index}
            onClick={onSelectRecipe}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
