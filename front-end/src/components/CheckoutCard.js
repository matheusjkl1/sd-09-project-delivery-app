import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { getUsersRole } from '../services/api';
import './CheckoutCard.css';

const CheckoutCard = ({ cart, setCart }) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const { token } = userData;
  const [currSeller, setCurrSeller] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [allSellers, setAllSellers] = useState([]);
  const orderTotalPrice = cart.reduce((acc, curr) => {
    // é desnecessário transformar pra number, mas o lint tá mt phoda;
    const operation = (acc + (curr.quantity * curr.price));
    return Number(operation);
  }, 0).toFixed(2);
  const removeProduct = ({ target }) => {
    const newCart = cart.filter((element) => {
      const currProdId = target.getAttribute('curr-prod-id');
      return element.id !== Number(currProdId);
    });
    setCart(newCart);
  };

  // user_id: DataTypes.INTEGER, OK
  // seller_id: DataTypes.INTEGER, OK
  // total_price: DataTypes.DECIMAL, OK
  // delivery_address: DataTypes.STRING, OK
  // delivery_number: DataTypes.STRING, OK
  // status: DataTypes.STRING, OK
  // sale_date: DataTypes.DATE, x
  // updated_At: DataTypes.DATE, x
  const submitOrder = async () => {
    const orderBody = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: token,
      },
      body: JSON.stringify({
        userId: userData.id,
        sellerId: currSeller.split('-')[0],
        totalPrice: orderTotalPrice,
        deliveryAddress: address,
        deliveryNumber: number,
        status: 'Pendente',
        // saleDate: Date.now(), Já possui defaultValue
        // updatedAt: Date.now(), Já possui defaultValue
        // products: cart.map(({ id, quantity }) => ({ id, quantity })), // verificar se há necessidade de fazer o envio junto, assim já preenche o salesproducts
      }),
    };
    await fetch('http://localhost:3001/customer/order', orderBody);
    return orderBody;
  };

  useEffect(() => {
    getUsersRole(token, 'seller', setAllSellers);
  }, []);

  return (
    /* A ordem pt 01 */
    <div className="CheckoutCard-wrapper-table">
      <table className="CheckoutCard-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Valor Unitário</th>
            <th>Sub-total</th>
            <th>Remover Item</th>
          </tr>
        </thead>
        <tbody>
          { cart.map((element, index) => (
            <tr key={ index }>
              <td
                data-testid={
                  `customer_checkout__element-order-table-item-number-${index}`
                }
              >
                { index + 1 }
              </td>
              <td
                data-testid={ `customer_checkout__element-order-table-name-${index}` }
              >
                { element.name }
              </td>
              <td
                data-testid={ `customer_checkout__element-order-table-quantity-${index}` }
              >
                { element.quantity }
              </td>
              <td
                data-testid={
                  `customer_checkout__element-order-table-unit-price-${index}`
                }
              >
                { String(element.price.toFixed(2)).replace('.', ',') }
              </td>
              <td
                data-testid={
                  `customer_checkout__element-order-table-sub-total-${index}`
                }
              >
                { String((Number(element.price) * Number(element.quantity)).toFixed(2))
                  .replace('.', ',') }
              </td>
              <button
                curr-prod-id={ element.id }
                onClick={ removeProduct }
                type="button"
                data-testid={ `customer_checkout__element-order-table-remove-${index}` }
              >
                Remover
              </button>
            </tr>
          )) }
        </tbody>
      </table>
      <h4
        ref={ useRef() }
        data-testid="customer_checkout__element-order-total-price"
      >
        { `Total Price: ${orderTotalPrice}` }
      </h4>
      {/* Fim da ordem pt 01 */ }
      {/* Começo ordem pt 02 - Endereços */ }
      <fieldset className="CheckoutCard-form-container">
        <legend>Detalhes do endereço</legend>
        <div className="Checkout-select-input">
          <p>Pessoa Vendedora Responsável:</p>
          <select
            value={ currSeller }
            onChange={ ({ target }) => {
              // const theId = target.value.split('-')[0];
              setCurrSeller(target.value);
              console.log((currSeller));
            } }
            data-testid="customer_checkout__select-seller"
            name="currSeller"
          >
            { allSellers.map((element, index) => (
              <option
                key={ index }
              >
                { `${element.id}-${element.name}` }
              </option>
            )) }
          </select>
        </div>
        <label htmlFor="adress">
          Endereço:
          <input
            value={ address }
            onChange={ (e) => setAddress(e.target.value) }
            data-testid="customer_checkout__input-address"
            type="text"
          />
        </label>
        <label htmlFor="number">
          Número:
          <input
            value={ number }
            onChange={ (e) => setNumber(e.target.value) }
            data-testid="customer_checkout__input-addressNumber"
            type="text"
          />
        </label>
      </fieldset>
      {/* Fim ordem pt 02 */ }
      <button type="submit" onClick={ console.log(submitOrder()) }>
        FINALIZAR PEDIDO
      </button>
    </div>
  );
};

CheckoutCard.propTypes = {
  cart: PropTypes.arrayOf(Object).isRequired,
  setCart: PropTypes.func.isRequired,
};

export default CheckoutCard;
