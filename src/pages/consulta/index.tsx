// @ts-nocheck

import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Select,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { setupAPIClient } from "../../services/api";
import styles from "./styles.module.scss";
import { Header } from "../../components/Header";
import { OrderItemProps } from "../dashboard";
import { ModalOrder } from "../../components/ModalOrder1/index";
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from "react-toastify";


const MyTable = () => {
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [aluno, setAluno] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [tabelaData, setTabelaData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState<OrderItemProps[]>();
  const [filtro, setFiltro] = useState("");
  const { user } = useContext(AuthContext);
  

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get(`/student/resposible/${user.id}`,);
        setAlunos(response.data);
        setAluno(response.data[0]?.id); // Use o operador de encadeamento opcional para evitar erros
      } catch (error) {
        console.error("Erro ao buscar a lista de estudantes:", error);
      }
    };

    fetchStudents();
  }, [user]);

  const handlePesquisa = async () => {
    try {
      if (!aluno) {
        toast.warning("Selecione um aluno");
        return;
      }
    
      const apiClient = setupAPIClient();
      const response = await apiClient.get(
        `/order/detail/student?student_id=${aluno}`
      );
      const data = response.data;

      setTabelaData(data);
    } catch (error) {
      console.error("Erro ao buscar os pedidos do aluno:", error);
    }
  };

  const calculateTotal = (order) => {
    let total = 0;

    order.items.forEach((item) => {
      const price = item.product.price;
      total += price * item.amount;
    });

    return total.toFixed(2);
  };

  const handleLimparPesquisa = () => {
    setDataInicial("");
    setDataFinal("");
    setTabelaData([]);
    setFiltro("")
  };

  const handleOpenModal = async (id: string) => {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/order/detail", {
        params: {
          order_id: id,
        },
      });
      const data = response.data;

      // Defina os detalhes do pedido no estado do modal
      setModalItem(data);

      // Abra o modal
      setModalVisible(true);
    } catch (error) {
      console.error("Erro ao buscar os detalhes do pedido:", error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <Header />
      <TableContainer style={{ maxHeight: "100vh", overflowY: "auto" }} >
        <div className={styles.container}>
          <Input
            type="date"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
            placeholder="Data Inicial"
            width={['100%', '100%', '100%', '300px']}
            focusBorderColor="yellow.400"
            mb={2}
            mr={2}
                    />
          <Input
            type="date"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
            placeholder="Data Final"
            width={['100%', '100%', '100%', '300px']}
            focusBorderColor="yellow.400"
            mr={2}
          />
          <Select
            value={aluno}
            onChange={(e) => setAluno(e.target.value)}
            placeholder="Aluno"
            width={['100%', '100%', '100%', '300px']}
            focusBorderColor="yellow.400"
            mb={2}
            mr={2}
            
          >
            {alunos.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </Select>

          <Input
            type="text"
            placeholder="Filtrar por nome do pedido"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            width={['100%', '100%', '100%', '300px']}
            focusBorderColor="yellow.400"
            mr={2}
          />    

          <IconButton
            onClick={handlePesquisa}
            icon={<Icon as={FaSearch} />}
            aria-label="Pesquisar"
            width={['100%', '100%', '100%', '300px']}
            colorScheme="red"
            mr={2}
          />
          <IconButton
            onClick={handleLimparPesquisa}
            icon={<Icon as={FaTimes} />}
            aria-label="Limpar Pesquisa"
            width={['100%', '100%', '100%', '300px']}
          />
        </div>
        {/* @ts-ignore */}
        <Table
          variant="striped"
          colorScheme="gray"
          mt={10}
        >
             {/* @ts-ignore */}
          <Thead>
            <Tr>
                
              <Th>ID do Pedido</Th>
              <Th>Nome do Pedido</Th>
              <Th>Total</Th>
              <Th>Ação</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tabelaData
            .filter(order => order.name.toLowerCase().includes(filtro.toLocaleLowerCase()))
            .map((order) => (
              
              <Tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>{order.name}</Td>
                <Td>R$ {calculateTotal(order)}</Td>
                <Td>
                  <IconButton
                    onClick={() => handleOpenModal(order.id)}
                    icon={<Icon as={FaSearch} />}
                    aria-label="Ver Detalhes"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {modalVisible && (
        <ModalOrder
          isOpen={modalVisible}
          onRequestClose={handleCloseModal}
          order={modalItem}
        />
      )}
    </div>
  );
};

export default MyTable;
