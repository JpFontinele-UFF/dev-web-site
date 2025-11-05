import React from 'react'

const HomePage: React.FC = () => {
  return (
    <main style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'}}>
      <div style={{maxWidth: 800, textAlign: 'center'}}>
        <h1 style={{fontSize: '1.6rem', margin: '0 0 0.5rem'}}>Trabalho da disciplina de Desenvolvimento Web 2025.2</h1>

        <p style={{margin: '0.25rem 0', fontWeight: 600}}>Professor</p>
        <p style={{margin: '0.25rem 0'}}>Carlos Alberto Soares Ribeiro</p>

        <p style={{marginTop: '1rem', fontWeight: 600}}>Feito pelos Alunos: João Pedro Fontinele e João Antunes</p>
      </div>
    </main>
  )
}

export default HomePage