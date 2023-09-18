import { useContext, FormEvent, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/home.module.scss'

import LogoImg from '../../public/Logo.png'

import { Input } from '../components/ui/input/index'
import { Button } from '../components/ui/Button/index'

import { AuthContext } from '../contexts/AuthContext'

import Link from 'next/link'

import { toast } from 'react-toastify'


import { canSSRGuest } from '../utils/canSSRGuest'

export default function Home() {
  const { signIn } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent) {
    event.preventDefault()

    if (email === '' || password === '') {
      toast.warning("Preencha todos os campos")
      return;
    }

    setLoading(true)

    let data = {
      email,
      password
    }

    await signIn(data)

    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Eat Forever - Login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image className={styles.logo} src={LogoImg} alt="Logo Eat forever" />


        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input placeholder='Digite seu email' type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder='Digite sua senha' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" loading={loading} >Acessar</Button>

          </form>

          <Link href="/signup" className={styles.text}> Nao possui uma conta? Cadastra-se </Link>

        </div>

        <footer className={styles.copy}>
          &copy; 2023. Todos direitos reservado portalFooD
        </footer>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {

  return {
    props: {}
  }
})