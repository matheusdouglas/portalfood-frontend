import React, { useState, useEffect, useContext } from "react";
import { setupAPIClient } from "../../services/api";
import { Header } from "../../components/Header";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";


const AddItemToOrder = () => {
  

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderNumber, setOrderNumber] = useState(""); // Agora é um campo select
  const [orderOptions, setOrderOptions] = useState([]); // Opções para o select de número do pedido
  const [addedItems, setAddedItems] = useState([]);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);

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

  useEffect(() => {
    // Busque a lista de pedidos abertos e configure as opções para o select
    const fetchOpenOrders = async () => {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get("/order/open");
        setOrderOptions(
          response.data.map((order) => ({ id: order.id, table: order.table }))
        );
      } catch (error) {
        console.error("Erro ao buscar pedidos abertos:", error);
      }
    };

    fetchOpenOrders();
  }, []);

  const handleCategoryChange = async (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get(
        `/category/product?category_id=${category}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos da categoria:", error);
    }
  };

  const handleAddItem = async () => {
    if (!orderNumber || !selectedCategory || !selectedProduct || !quantity) {
      toast.warning("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const apiClient = setupAPIClient();
      const cleanedOrderNumber = orderNumber.trim();

      const addItemData = {
        order_id: cleanedOrderNumber,
        product_id: selectedProduct,
        amount: quantity,
      };

      const selectedProductObject = products.find(
        (product) => product.id === selectedProduct
      );

      const response = await apiClient.post("/order/add", addItemData);
      toast.success("Item adicionado ao pedido com sucesso!");

      // Adicione o item ao estado addedItems com o nome do produto e o ID do item
      const newItem = {
        id: response.data.id, // ID do item
        product_id: selectedProduct,
        amount: quantity,
        product_name: selectedProductObject.name,
        product_price : selectedProductObject.price
      };
      setAddedItems([...addedItems, newItem]);

      setSelectedProduct("");
      setQuantity(0);
      setSelectedCategory("");
    } catch (error) {
      console.error("Erro ao adicionar item ao pedido:", error);
    }
  };

  const handleRemoveItem = async (item_id) => {
    try {
      const apiClient = setupAPIClient();
      await apiClient.delete(`/order/remove?item_id=${item_id}`);
      toast.success("Item Removido do pedido com sucesso!");

      // Atualize o estado de addedItems após a remoção bem-sucedida
      const updatedItems = addedItems.filter((item) => item.id !== item_id);
      setAddedItems(updatedItems);
    } catch (error) {
      console.error("Erro ao remover item do pedido", error);
    }
  };

  const handleSendOrder = async () => {
    try {
      if (!orderNumber || addedItems.length === 0) {
        toast.warning(
          "Por favor, preencha o número do pedido e adicione itens."
        );
        return;
      }

      const apiClient = setupAPIClient();

      // Envie os itens para a rota de envio do pedido junto com o número do pedido
      const orderData = {
        order_id: orderNumber,
        items: addedItems,
      };

      await apiClient.put("/order/send", orderData);

      // Limpe a lista de itens após o envio bem-sucedido
      setAddedItems([]);

      toast.success("Pedido concluído com sucesso!");
      setIsOrderCompleted(true);
      setOrderNumber("");
    } catch (error) {
      console.error("Erro ao concluir pedido:", error);
    }
  };

  return (
    <div>
      <main>
        <Header />

        <div className={styles.container}>
          <h1 className={styles.titulo}>Adicionar Item ao Pedido</h1>
          {/* Adicione um campo para selecionar o número do pedido */}
          <label htmlFor="orderNumber" className={styles.tags}>
            Número do Pedido:
          </label>
          <select
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className={styles.select}
          >
            <option value="">Selecione um número de pedido</option>
            {orderOptions.map((orderOption) => (
              <option key={orderOption.id} value={orderOption.id}>
                {orderOption.table}
              </option>
            ))}
          </select>

          <label htmlFor="category" className={styles.tags}>
            Categoria:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className={styles.select}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label htmlFor="product" className={styles.tags}>
            Produto:
          </label>
          <select
            id="product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className={styles.select}
          >
            <option value="">Selecione um produto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <label htmlFor="quantity" className={styles.tags}>
            Quantidade:
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            className={styles.input}
          />

          <button
            type="button"
            onClick={handleAddItem}
            className={styles.buttonAdd}
          >
            Adicionar item
          </button>

          {addedItems.length > 0 && !isOrderCompleted && (
            <div className={styles.addedItems}>
              <h2>Itens Adicionados:</h2>
              <ul>
                {addedItems.map((item) => (
                  <li key={item.id}>
                    Produto: <strong>{item.product_name}</strong>
                    Quantidade: <strong>{item.amount}</strong>
                    Total R$: <strong> {Number((item.product_price * item.amount)).toFixed(2)}</strong>
                    <button onClick={() => handleRemoveItem(item.id)}>
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {addedItems.length > 0 && !isOrderCompleted && (
            <button
              type="button"
              onClick={handleSendOrder}
              className={styles.buttonSend}
            >
              Concluir Pedido
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddItemToOrder;
