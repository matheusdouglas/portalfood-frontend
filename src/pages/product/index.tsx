import { useState, ChangeEvent, FormEvent, useContext, useEffect } from "react";
import Head from "next/head";
import styles from "./styles.module.scss";
import { Header } from "../../components/Header/index";
import Image from 'next/image';

import { canSSRAuth } from "../../utils/canSSRAuth";

import { FiUpload } from "react-icons/fi";
import { setupAPIClient } from "../../services/api";

import { toast } from "react-toastify";

import { useRouter } from "next/router";
import { AuthContext } from '../../contexts/AuthContext';


type ItemProps = {
  id: string;
  name: string;
};

interface CategoryProps {
  categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps) {


  const { user } = useContext(AuthContext);
  const isAdmin = user?.is_admin;
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/unhatorized'); // Redirecionar para página de acesso negado
    }
  }, [isAdmin, router]);




  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [AvatarUrl, setAvatarUrl] = useState("");
  const [imageAvatar, setImageAvatar] = useState(null);

  //caso acesse essa pagina e nao tem nenhuma categoria
  const [categories, setCategories] = useState(categoryList || []);
  const [categorySelected, setCategorySelected] = useState(0);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get("/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, []);




  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    // se enviar varias image vou pegar so a primeira
    const image = event.target.files[0];

    if (!image) {
      return;
    }

    if (image.type === "image/jpeg" || image.type === "ímage.png") {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(event.target.files[0]));
    }
  }

  //quando voce seleciona uma nova categoria na lista
  function handleChangeCategory(e) {
    setCategorySelected(e.target.value);
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    try {
      const data = new FormData();

      if (name === "" || price === "" || description === "") {
        toast.warning("Preencha todos os campos");
        return;
      }

      data.append("name", name);
      data.append("price", price);
      data.append("description", description);
      data.append("category_id", categories[categorySelected].id);
      data.append("file", imageAvatar);

      const apiClient = setupAPIClient();
      await apiClient.post("/product", data);

      toast.success("Producto Cadastrado!");
    } catch (err) {
      console.log(err);
      toast.error("Ops... Erro ao cadasrar um produto");
    }

    setName("");
    setPrice("");
    setDescription("");
    setImageAvatar(null);
    setAvatarUrl("");
  }

  return (
    <>
      <Head>
        <title>Novo Produto - Eat Forever</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Novo Produto</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <label className={styles.labelAvatar}>
              <span>
                <FiUpload size={25} color="#FFA42D" />
              </span>

              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFile}
              />

              {AvatarUrl && (
                
             <Image
             className={styles.preview}
             src={AvatarUrl}
             alt="Foto do produto"
             width={250}
             height={250}
           />
              )}
            </label>

            <label className={styles.tags}>Categorias:</label>
            <select value={categorySelected} onChange={handleChangeCategory}>
              {categories.map((item, index) => {
                return (
                  <option key={item.id} value={index}>
                    {item.name}
                  </option>
                );
              })}
            </select>

            <label className={styles.tags}>Produto:</label>
            <input
              type="text"
              placeholder="Digite o nome do produto"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className={styles.tags}>Preço:</label>
            <input
              type="text"
              placeholder="Digite o Preço"
              className={styles.input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <label className={styles.tags}>Descrição:</label>
            <textarea
              placeholder="Descreva seu produto..."
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {}
  }
})
