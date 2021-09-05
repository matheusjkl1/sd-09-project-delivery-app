const rescue = require('express-rescue');
const { newOrder, populateSaleProd, findOrderById } = require('../service/orderServices');

const insertOrderInSale = rescue(async (req, res) => {
  const { userId,
    sellerId,
    totalPrice,
    deliveryAddress,
    deliveryNumber,
    status, products } = req.body;

  console.log(req.body);

  const insertNewOrder = await newOrder(userId,
    sellerId,
    totalPrice,
    deliveryAddress,
    deliveryNumber,
    status);

  await populateSaleProd(insertNewOrder.id, products);

  const findById = await findOrderById(insertNewOrder.id);

  res.status(201).json(findById);
});

module.exports = { insertOrderInSale };