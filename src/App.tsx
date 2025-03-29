import { useState } from 'react'
import './App.scss'
import Container from './comonents/container/Container'
import Header from './comonents/header/Header'
import Modal from './comonents/modal/Modal'
import Portfolio from './comonents/portfolio/Portfolio'

function App() {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <Container>
      <Header onOpenModal={setIsModalOpen} />
      <Portfolio/>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Container>
  )
}

export default App
