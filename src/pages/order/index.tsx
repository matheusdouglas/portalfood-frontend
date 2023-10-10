import React, { useState, useEffect, useContext } from "react";
import styles from "./styles.module.scss";
import Head from "next/head";
import { Header } from "../../components/Header";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";


import { AuthContext } from '../../contexts/AuthContext';



const CreateOrderForm = () => {

  const { user } = useContext(AuthContext);
  const isAdmin = user?.is_admin;
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/unhatorized'); // Redirecionar para página de acesso negado
    }
  }, [isAdmin, router]);


  const [formData, setFormData] = useState({
    table: 0,
    name: "",
    selectedStudent: "",
  });

  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para a mensagem de erro

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get("/student");
        setStudents(response.data);
      } catch (error) {
        console.error("Erro ao buscar a lista de estudantes:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "table" ? parseInt(value, 10) : value;
    setFormData({ ...formData, [name]: updatedValue });
  };

  const handleStudentChange = (e) => {
    const selectedStudent = e.target.value;
    setFormData({ ...formData, selectedStudent });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação para campos em branco
    if (!formData.table || !formData.name || !formData.selectedStudent) {
      toast.warning("Preencha todos os campos antes de enviar.");
      return;
    }

    try {
      const apiClient = setupAPIClient();
      const orderData = {
        table: formData.table,
        name: formData.name,
        student_id: formData.selectedStudent,
      };
      await apiClient.post("/order", orderData);
      toast.success("Pedido criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Nova categoria - Sujeito Pizzaria</title>
      </Head>

      <div>
        <Header />

        <main className={styles.container}>
          <h1>Criar Pedido</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Exibe a mensagem de erro se houver */}
            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}

            <label className={styles.tags}>Numero do Pedido:</label>
            <input
              type="number"
              name="table"
              value={formData.table}
              onChange={handleChange}
              className={styles.input}
              placeholder="Número do pedido"
              required
            />

            <label className={styles.tags}>Nome do Pedido: </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Digite um nome para o pedido"
            />

            <label className={styles.tags}>Aluno:</label>
            <select
              name="selectedStudent"
              value={formData.selectedStudent}
              onChange={handleStudentChange}
              className={styles.select}
            >
              <option value="">Selecione um estudante</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>

            <button type="submit" className={styles.buttonAdd}>
              Criar Pedido
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default CreateOrderForm;
