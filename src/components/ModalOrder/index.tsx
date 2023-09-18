import Modal from "react-modal";
import styles from "./styles.module.scss";

import { FiX } from "react-icons/fi";
import { OrderItemProps } from "../../pages/dashboard";

interface ModalOrderProps {
  isOpen: boolean;
  onRequestClose: () => void;
  order: OrderItemProps[];
  handleFinishOrder: (id: String) => void;
}

export function ModalOrder({
  isOpen,
  onRequestClose,
  order,
  handleFinishOrder,
}: ModalOrderProps) {
  const customStyles = {
    content: {
      top: "50%",
      bottom: "auto",
      left: "50%",
      right: "auto",
      padding: "30px",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#ffffff",
    },
  };

  const calcularTotalGeral = () => {
    let totalGeral = 0;
    order.forEach((item) => {
      totalGeral += item.product.price * item.amount;
    });
    return totalGeral;
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <button
        type="button"
        onClick={onRequestClose}
        className="react-modal-close"
        style={{ background: "transparent", border: 0 }}
      >
        <FiX size={45} color="#f34748" />
      </button>

      <div className={styles.container}>
        <h2>
          <strong>Detalhes do pedido</strong>
        </h2>
        <span className={styles.table}>
          Matricula: <strong>{order[0].order.table}</strong>
        </span>

        <section className={styles.containerItem}>
          <div className={styles.tableRow}>
            <div className={styles.tableCell}>
              <strong>Quantidade</strong>
            </div>
            <div className={styles.tableCell}>
              <strong>Produto</strong>
            </div>
            <div className={styles.tableCell}>
              <strong>Descrição</strong>
            </div>
            <div className={styles.tableCell}>
              <strong>Preço</strong>
            </div>
            <div className={styles.tableCell}>
              <strong>Total</strong>
            </div>
          </div>

          {order.map((item) => (
            <div key={item.id} className={styles.tableRow}>
              <div className={styles.tableCell}>{item.amount}</div>
              <div className={styles.tableCell}>{item.product.name}</div>
              <div className={styles.tableCell}>{item.product.description}</div>
              <div className={styles.tableCell}>{item.product.price}</div>
              <div className={styles.tableCell}>
                <label>R$ </label>
                {item.product.price * item.amount}
              </div>
            </div>
          ))}

          <label className={styles.total}>
            <strong>Total Geral</strong>
          </label>
          <div className={styles.totalGeral}>
            <label>R$ </label>
            {calcularTotalGeral()}
          </div>
        </section>

        <button
          className={styles.buttonOrder}
          onClick={() => handleFinishOrder(order[0].order_id)}
        >
          Concluir Pedido
        </button>
      </div>
    </Modal>
  );
}
