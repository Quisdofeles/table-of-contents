import { motion } from 'framer-motion'
import CopyButton from './CopyButton'
import styles from './ExpandedRecipe.module.css'

export default function ExpandedRecipe({ recipe, onBack }) {
  const getIngredientsText = () => {
    return recipe.ingredients
      .map(section => {
        const header = section.section
        const items = section.items.map(item => `- ${item}`).join('\n')
        return `${header}\n${items}`
      })
      .join('\n\n')
  }

  const getInstructionsText = () => {
    return recipe.instructions
      .map(section => {
        const header = section.section
        const steps = section.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')
        return `${header}\n${steps}`
      })
      .join('\n\n')
  }

  const statItems = [
    { icon: '/images/Serves-Icon.webp', value: recipe.stats.servings },
    { icon: '/images/Clock-Icon.webp', value: recipe.stats.time },
    { icon: '/images/Calories-Icon.webp', value: recipe.stats.calories },
    { icon: `/${recipe.stats.difficultyIcon}`, value: recipe.stats.difficulty },
  ]

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{recipe.title}</h1>
        <button className={styles.backButton} onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Close
        </button>
      </div>

      <div className={styles.columns}>
        <div className={styles.colImage}>
          <img
            src={`/${recipe.bgImage}`}
            alt={recipe.title}
            className={styles.heroImage}
          />
          <div className={styles.stats}>
            {statItems.map((stat, i) => (
              <div key={i} className={styles.statItem}>
                <img src={stat.icon} alt="" className={styles.statIcon} />
                <span className={styles.statValue}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.colIngredients}>
          <div className={styles.colHeader}>
            <h2 className={styles.colTitle}>Ingredients</h2>
            <CopyButton getText={getIngredientsText} />
          </div>
          {recipe.ingredients.map((section, i) => (
            <div key={i} className={styles.section}>
              <h3 className={styles.sectionTitle}>{section.section}</h3>
              <ul className={styles.ingredientList}>
                {section.items.map((item, j) => (
                  <li key={j} className={styles.ingredientItem}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.colInstructions}>
          <div className={styles.colHeader}>
            <h2 className={styles.colTitle}>Instructions</h2>
            <CopyButton getText={getInstructionsText} />
          </div>
          {recipe.instructions.map((section, i) => (
            <div key={i} className={styles.section}>
              <h3 className={styles.sectionTitle}>{section.section}</h3>
              <ol className={styles.stepList}>
                {section.steps.map((step, j) => (
                  <li key={j} className={styles.stepItem}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
