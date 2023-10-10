import { useState, useContext, FormEvent } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../../../styles/home.module.scss";
import LogoImg from "../../../public/Logo.png";
import { Input } from "../../components/ui/input/index";
import { Button } from "../../components/ui/Button/index";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";

export default function SignUp() {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    if (name === "" || email === "" || password === "") {
      toast.warning("Preencha todos os campos ");
      return;
    }

    setLoading(false);

    let data = {
      name,
      email,
      password,
    };

    await signUp(data);
  }

  return (
    <>
      <Head>
        <title>Eat Forever - Login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image className={styles.logo} src={LogoImg} alt="Logo Eat forever" />

        <div className={styles.login}>
          <form onSubmit={handleSignUp}>
            <Input
              placeholder="Digite seu nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Digite seu email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" loading={loading}>
              Cadastrar
            </Button>
          </form>

          <Link href="/" className={styles.text}>
            Ja tenho uma conta
          </Link>
        </div>

        <footer className={styles.copy}>
          &copy; 2022. Todos direitos reservado PortalFooD
        </footer>
      </div>
    </>
  );
}
