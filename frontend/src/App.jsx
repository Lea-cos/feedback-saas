// Composant principal de l'application
import { useEffect, useState } from 'react'
import './App.css'

// --- Réglages du décor (uniquement pour le style) ---

// Couleurs possibles pour les stickers et les confettis
const COULEURS = ['orange', 'moutarde', 'framboise', 'sauge']

// Emojis attribués aux idées
const EMOJIS_IDEES = ['🌼', '✌️', '🌈', '🪩', '🍊', '✨', '🌻', '🍄', '🌙', '💛', '🎸', '🌸']

// Fleurs du fond : position, taille, couleur et profondeur (effet parallaxe)
const FLEURS = [
  { haut: '10%', gauche: '6%', taille: 90, couleur: '#d6336c', profondeur: 18 },
  { haut: '66%', gauche: '84%', taille: 120, couleur: '#e8a917', profondeur: 28 },
  { haut: '80%', gauche: '20%', taille: 70, couleur: '#e2571e', profondeur: 12 },
  { haut: '18%', gauche: '88%', taille: 60, couleur: '#7fa36b', profondeur: 22 },
  { haut: '44%', gauche: '3%', taille: 50, couleur: '#e8a917', profondeur: 35 },
  { haut: '42%', gauche: '93%', taille: 44, couleur: '#d6336c', profondeur: 40 },
]

// Emojis qui dérivent lentement en fond
const EMOJIS_FLOTTANTS = [
  { emoji: '🌼', haut: '24%', gauche: '18%', duree: 26 },
  { emoji: '✌️', haut: '72%', gauche: '70%', duree: 32 },
  { emoji: '🌈', haut: '58%', gauche: '10%', duree: 28 },
  { emoji: '🪩', haut: '12%', gauche: '72%', duree: 34 },
  { emoji: '🍊', haut: '86%', gauche: '48%', duree: 30 },
  { emoji: '✨', haut: '34%', gauche: '80%', duree: 24 },
]

// Donne toujours le même nombre pour une même idée,
// pour choisir sa couleur, son emoji et son inclinaison
function nombreDepuisIdee(idee, index) {
  let total = index * 31 + 17
  for (const lettre of idee) {
    total = (total * 7 + lettre.charCodeAt(0)) % 9973
  }
  return total
}

function App() {
  // Texte en cours de saisie dans le champ
  const [titreIdee, setTitreIdee] = useState('')
  // Liste des idées ajoutées (perdue au rechargement de la page)
  const [idees, setIdees] = useState([])
  // Confettis affichés après un ajout
  const [confettis, setConfettis] = useState([])
  // Vrai pendant le petit rebond du bouton
  const [boutonRebondit, setBoutonRebondit] = useState(false)

  // Nom de l'application, lu dans .env.development ou .env.production
  const nomApplication = import.meta.env.VITE_APP_NAME

  // Effet parallaxe : les fleurs bougent un peu avec la souris
  useEffect(() => {
    // On ne fait rien si la personne préfère moins d'animations
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    function suivreSouris(event) {
      const x = (event.clientX / window.innerWidth - 0.5) * 2
      const y = (event.clientY / window.innerHeight - 0.5) * 2
      document.documentElement.style.setProperty('--souris-x', x.toFixed(3))
      document.documentElement.style.setProperty('--souris-y', y.toFixed(3))
    }

    window.addEventListener('mousemove', suivreSouris)
    return () => window.removeEventListener('mousemove', suivreSouris)
  }, [])

  // Fait partir des confettis et des fleurs depuis le bouton
  function lancerConfettis(bouton) {
    const zone = bouton.getBoundingClientRect()
    const departX = zone.left + zone.width / 2
    const departY = zone.top + zone.height / 2

    const nouveauxConfettis = Array.from({ length: 28 }, (_, numero) => {
      const angle = Math.random() * Math.PI * 2
      const distance = 80 + Math.random() * 150
      return {
        id: `${Date.now()}-${numero}`,
        x: departX,
        y: departY,
        decalageX: Math.cos(angle) * distance,
        decalageY: Math.sin(angle) * distance - 60,
        tour: Math.random() * 720 - 360,
        couleur: COULEURS[numero % COULEURS.length],
        estUneFleur: numero % 5 === 0,
      }
    })

    setConfettis((anciens) => [...anciens, ...nouveauxConfettis])

    // On retire ces confettis une fois l'animation terminée
    const identifiants = nouveauxConfettis.map((confetti) => confetti.id)
    setTimeout(() => {
      setConfettis((anciens) => anciens.filter((confetti) => !identifiants.includes(confetti.id)))
    }, 1300)
  }

  // Ajoute l'idée saisie à la liste, puis vide le champ
  function ajouterIdee(event) {
    if (titreIdee.trim() === '') return // on ignore un champ vide
    setIdees([...idees, titreIdee.trim()])
    setTitreIdee('')

    // Petites animations de célébration
    lancerConfettis(event.currentTarget)
    setBoutonRebondit(true)
  }

  // Lettres du titre, pour les disposer en courbe
  const nombreDeLettres = nomApplication.length
  const milieuDuTitre = Math.max((nombreDeLettres - 1) / 2, 1)
  let positionLettre = 0

  return (
    <>
      {/* ---------- Décor de fond ---------- */}

      {/* Modèle de fleur, réutilisé plusieurs fois */}
      <svg width="0" height="0" className="modele-svg" aria-hidden="true">
        <symbol id="fleur" viewBox="0 0 100 100">
          <circle cx="76" cy="50" r="20" fill="currentColor" />
          <circle cx="63" cy="72.5" r="20" fill="currentColor" />
          <circle cx="37" cy="72.5" r="20" fill="currentColor" />
          <circle cx="24" cy="50" r="20" fill="currentColor" />
          <circle cx="37" cy="27.5" r="20" fill="currentColor" />
          <circle cx="63" cy="27.5" r="20" fill="currentColor" />
          <circle cx="50" cy="50" r="15" fill="#fbf3e4" />
          <circle cx="50" cy="50" r="7" fill="#3b2418" />
        </symbol>
      </svg>

      {/* Grand soleil aux rayons qui tournent */}
      <div className="soleil" aria-hidden="true">
        <div className="soleil-rayons" />
        <div className="soleil-disque" />
      </div>

      {/* Fleurs flottantes */}
      <div className="decor" aria-hidden="true">
        {FLEURS.map((fleur, numero) => (
          <div
            key={numero}
            className="fleur-parallaxe"
            style={{ top: fleur.haut, left: fleur.gauche, '--profondeur': fleur.profondeur }}
          >
            <svg
              className="fleur"
              width={fleur.taille}
              height={fleur.taille}
              style={{ color: fleur.couleur, animationDelay: `${numero * -2}s` }}
            >
              <use href="#fleur" />
            </svg>
          </div>
        ))}

        {/* Emojis qui dérivent */}
        {EMOJIS_FLOTTANTS.map((element, numero) => (
          <span
            key={numero}
            className="emoji-flottant"
            style={{
              top: element.haut,
              left: element.gauche,
              animationDuration: `${element.duree}s`,
              animationDelay: `${numero * -4}s`,
            }}
          >
            {element.emoji}
          </span>
        ))}
      </div>

      {/* ---------- Carte principale ---------- */}
      <div className="carte">
        {/* Sticker rond qui tourne, collé de travers */}
        <div className="sticker-groovy" aria-hidden="true">
          <svg viewBox="0 0 100 100" className="sticker-groovy-texte">
            <defs>
              <path id="cercle-sticker" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
            </defs>
            <circle cx="50" cy="50" r="48" />
            <text>
              <textPath href="#cercle-sticker" textLength="222" lengthAdjust="spacing">
                groovy ideas • groovy ideas •
              </textPath>
            </text>
          </svg>
          <span className="sticker-groovy-centre">✌️</span>
        </div>

        {/* Titre en courbe, lettre par lettre */}
        <h1 aria-label={nomApplication}>
          {nomApplication.split(' ').map((mot, numeroMot) => {
            if (numeroMot > 0) positionLettre += 1 // l'espace entre deux mots
            return (
              <span key={numeroMot} className="mot" aria-hidden="true">
                {[...mot].map((lettre, numeroLettre) => {
                  const ecart = (positionLettre - milieuDuTitre) / milieuDuTitre
                  const style = {
                    transform: `translateY(${ecart * ecart * 14}px) rotate(${ecart * 8}deg)`,
                    animationDelay: `${positionLettre * 0.08}s`,
                  }
                  positionLettre += 1
                  return (
                    <span key={numeroLettre} className="lettre" style={style}>
                      {lettre}
                    </span>
                  )
                })}
              </span>
            )
          })}
        </h1>

        <label htmlFor="titre-idee">Titre de l'idée</label>
        <input
          id="titre-idee"
          type="text"
          placeholder="Ex : mode sombre 🌙"
          value={titreIdee}
          onChange={(event) => setTitreIdee(event.target.value)}
        />
        <button
          className={boutonRebondit ? 'rebondit' : ''}
          onClick={ajouterIdee}
          onAnimationEnd={() => setBoutonRebondit(false)}
        >
          Ajouter
        </button>

        {/* Liste des idées, ou message si elle est vide */}
        {idees.length === 0 ? (
          <p className="liste-vide">Pas encore d'idées… sois le premier à mettre le groove 🪩</p>
        ) : (
          <ul>
            {idees.map((idee, index) => {
              const nombre = nombreDepuisIdee(idee, index)
              const couleur = COULEURS[nombre % COULEURS.length]
              const emoji = EMOJIS_IDEES[Math.floor(nombre / 4) % EMOJIS_IDEES.length]
              const inclinaison = (Math.floor(nombre / 48) % 61) / 10 - 3 // entre -3° et 3°
              return (
                <li
                  key={index}
                  className={`sticker sticker-${couleur}`}
                  style={{ '--inclinaison': `${inclinaison}deg` }}
                >
                  <span className="sticker-emoji">{emoji}</span>
                  {idee}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Confettis de célébration */}
      {confettis.map((confetti) => (
        <span
          key={confetti.id}
          className={`confetti ${confetti.estUneFleur ? 'confetti-fleur' : `confetti-${confetti.couleur}`}`}
          style={{
            left: confetti.x,
            top: confetti.y,
            '--decalage-x': `${confetti.decalageX}px`,
            '--decalage-y': `${confetti.decalageY}px`,
            '--tour': `${confetti.tour}deg`,
          }}
          aria-hidden="true"
        >
          {confetti.estUneFleur ? '🌼' : ''}
        </span>
      ))}
    </>
  )
}

export default App
