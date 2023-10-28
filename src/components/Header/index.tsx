import { useContext } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import Image from "next/image";

import { FiLogOut } from "react-icons/fi";

import { AuthContext } from "../../contexts/AuthContext";

export function Header() {
  const { signOut, user } = useContext(AuthContext);
  const isAdmin = user?.is_admin;

  // Defina os links que você deseja exibir no cabeçalho com base nas permissões
  const headerLinks = [
    { href: "/consulta", label: "Consultas" },
    { href: "/student", label: "Aluno" },
  ];

  // Adicione links adicionais se o usuário for administrador
  if (isAdmin) {
    headerLinks.push(
      { href: "/order", label: "Pedido" },
      { href: "/add-item-to-order", label: "Item" },
      { href: "/category", label: "Categoria" },
      { href: "/product", label: "Produto" }
    );
  }

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard" className={styles.logo}>
          <Image src="/logo.png" alt="Logo da sua empresa" width={190} height={160} />
        </Link>

        <nav className={styles.menuNav}>
          {headerLinks.map((link, index) => (
            <Link key={index} href={link.href}>
              {link.label}
            </Link>
          ))}

          <button onClick={signOut}>
            <FiLogOut color="#FFA42D" size={24} />
          </button>
        </nav>
      </div>
    </header>
  );
}
