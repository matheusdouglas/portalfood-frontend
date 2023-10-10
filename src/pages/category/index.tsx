import React, { useState, FormEvent } from 'react'
import Head from "next/head"
import { Header } from '../../components/Header'
import styles from './styles.module.scss'

import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify'

import { canSSRAuth } from '../../utils/canSSRAuth'

import { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';


export default function Category() {

  const { user } = useContext(AuthContext);
  const isAdmin = user?.is_admin;
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/unhatorized'); // Redirecionar para página de acesso negado
    }
  }, [isAdmin, router]);

  const [name, setName] = useState('')
  const [errorMessage, setErrorMessage] = useState(""); 

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    // Validação para campo em branco
    if (name === '') {
      toast.warning("prencha todos os campos")
      return;
    }

    const apiClient = setupAPIClient();
    await apiClient.post('/category', {
      name: name
    })

    toast.success('Categoria cadastrada com sucesso!')
    setName('');


  }

  return (
    <>
      <Head>
        <title>Nova categoria - Sujeito Pizzaria</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Cadastrar categorias</h1>

          <form className={styles.form} onSubmit={handleRegister}>
          {/* Exibe a mensagem de erro se houver */}
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          <label className={styles.tags}>
            Nome da Categoria:
          </label>
            <input
              type="text"
              placeholder="Digite o nome da categoria"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>

          </form>

        </main>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {}
  }
})
