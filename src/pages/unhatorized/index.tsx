import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.scss";

const AccessDeniedPage = () => {
  return (
    <div className={styles.accessDenied}>
      <p className={styles.message}>
        Você não tem permissão para acessar esta página.
      </p>
      <div className={styles.imageContainer}>
        <Image
          src="/acesso-negado.jpg"
          alt="Acesso Negado"
          width={800}
          height={600}
        />
      </div>
      <Link href="/consulta" className={styles.link}>
        Voltar para a página inicial
      </Link>
    </div>
  );
};

export default AccessDeniedPage;
