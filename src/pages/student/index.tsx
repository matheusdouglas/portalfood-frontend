import React, { useState, useEffect, useContext } from "react";
import { setupAPIClient } from "../../services/api";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import { Header } from "../../components/Header";
import { AuthContext } from "../../contexts/AuthContext";

function App() {
  const { user } = useContext(AuthContext); // Obtenha o usuário logado a partir do contexto de autenticação

  const [users, setUsers] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [plate, setPlate] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Não foi possível carregar os usuários", error);
      }
    };

    fetchUsers();
  }, []);

  const handleNameChange = (event) => {
    setStudentName(event.target.value);
  };

  const handlePlateChange = (event) => {
    setPlate(event.target.value);
  }

  const handleCadastroClick = async () => {
    if (studentName === "" || plate === "") {
      toast.warning("prencha todos os campos");
      return;
    }

    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.post("/student", {
        name: studentName,
        plate: plate,
        responsible_id: user.id, // Use o ID do usuário logado diretamente
      });

      if (response.status === 200) {
        toast.success("Aluno cadastrado com sucesso");
        setStudentName("");
        setPlate("");
      } else {
        toast.error("Erro ao cadastrar aluno");
      }
    } catch (error) {
      console.error("Erro ao cadastrar aluno", error);
      toast.error("Erro ao cadastrar aluno");
    }
  };

  return (
    <div>
      <Header />

      <main className={styles.container}>
        <h1>Cadastro de Aluno</h1>
        <br></br>

        <label className={styles.tags}>Nome do aluno:</label>
        <input
          type="text"
          value={studentName}
          onChange={handleNameChange}
          placeholder="Nome do estudante"
          className={styles.input}
        />

        <label className={styles.tags}>Matricula do aluno:</label>
        <input
          type="text"
          value={plate}
          onChange={handlePlateChange}
          placeholder="Matricula do aluno"
          className={styles.input}
        />

        <button onClick={handleCadastroClick} className={styles.buttonAdd}>
          Cadastrar
        </button>
      </main>
    </div>
  );
}

export default App;
