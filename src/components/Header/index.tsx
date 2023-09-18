import { useContext } from 'react'
import styles from './styles.module.scss'
import Link from 'next/link'

import { FiLogOut } from 'react-icons/fi'

import { AuthContext } from '../../contexts/AuthContext'

export function Header() {

  const { signOut } = useContext(AuthContext)



  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href={"/dashboard"} className={styles.logo}>
          <img src="/logo.png" width={190} height={160} />
        </Link>

        {/* caso por enquanto nao tenha nada ele nao
             vai da erro ele vai deixar vazio  */}




        <nav className={styles.menuNav}>
          <Link href="/">
            Pedido
          </Link>

          <Link href="/">
            Aluno
          </Link>

          <Link href="/category">
            Categoria
          </Link>


          <Link href="/product">
            Produto
          </Link>

          <button onClick={signOut}>
            <FiLogOut color='#FFA42D' size={24}  />
          </button>

        </nav>


      </div>
    </header>
  )
} 