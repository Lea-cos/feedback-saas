// Composant principal de l'application
import { useState } from 'react'
import './App.css'

function App() {
  // Texte en cours de saisie dans le champ
  const [titreIdee, setTitreIdee] = useState('')
  // Liste des idées ajoutées (perdue au rechargement de la page)
  const [idees, setIdees] = useState([])

  // Ajoute l'idée saisie à la liste, puis vide le champ
  function ajouterIdee() {
    if (titreIdee.trim() === '') return // on ignore un champ vide
    setIdees([...idees, titreIdee.trim()])
    setTitreIdee('')
  }

  return (
    <div>
      {/* Nom lu dans .env.development ou .env.production selon la commande */}
      <h1>{import.meta.env.VITE_APP_NAME}</h1>

      <label htmlFor="titre-idee">Titre de l'idée</label>
      <input
        id="titre-idee"
        type="text"
        value={titreIdee}
        onChange={(event) => setTitreIdee(event.target.value)}
      />
      <button onClick={ajouterIdee}>Ajouter</button>

      <ul>
        {idees.map((idee, index) => (
          <li key={index}>{idee}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
