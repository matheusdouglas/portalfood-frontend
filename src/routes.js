const routes = require('next-routes')();

// Defina suas rotas aqui
routes
  .add('add-item-to-order', '/add-item-to-order/:orderId'); // Rota para adicionar um item ao pedido

module.exports = routes;
