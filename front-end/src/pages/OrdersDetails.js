import React from 'react';
import PropTypes from 'prop-types';
import fetchGET from '../services/fetchGET';
import ItensDetailsOrder from '../components/ItensDetailsOrder';
import socket from '../utils/socket';
import '../styles/Checkout.css';
import '../styles/OrderDetails.css';

class Order extends React.Component {
  constructor() {
    super();

    this.state = {
      allInfo: [],
      statusP: '',
    };

    this.fetchAPI = this.fetchAPI.bind(this);
    this.dateFormat = this.dateFormat.bind(this);
    this.tableItens = this.tableItens.bind(this);
  }

  componentDidMount() {
    this.fetchAPI();
    this.updateSocket();
  }

  async fetchAPI() {
    const { match: { params: { id } } } = this.props;
    const result = await fetchGET('sales-products');

    const filterResult = result.find((sale) => sale.id === Number(id));

    this.setState({
      allInfo: filterResult,
      statusP: filterResult.status,
    });
  }

  updateSocket() {
    const { match: { params } } = this.props;
    socket.on('newStatus', ({ id, status, rgb }) => {
      if (Number(params.id) === id) {
        const text = document.querySelector('.status-color');
        text.style.backgroundColor = rgb;
        this.setState({
          statusP: status,
        });
      }
    });
  }

  dateFormat(date) {
    const num10 = 10;
    const num8 = 8;
    const num5 = 5;
    const num4 = 4;
    date = date.substr(0, num10);

    const day = date.substr(num8, 2);
    const month = date.substr(num5, 2);
    const year = date.substr(0, num4);

    const newDate = `${day}/${month}/${year}`;
    return newDate;
  }

  updateStatus(status, rgb) {
    const { allInfo: { id } } = this.state;
    socket.emit('updateStatus', { id, status, rgb });
    this.setState({
      statusP: status,
    });
  }

  buttonCustomer(role, status) {
    return (
      <button
        className="btn-status"
        type="button"
        disabled={ status !== 'Em Trânsito' }
        onClick={ () => this.updateStatus('Entregue', '#00cc9b') }
        data-testid={ `${role}_order_details__button-delivery-check` }
      >
        MARCAR COMO ENTREGUE
      </button>
    );
  }

  buttonSeller(role, status) {
    return (
      <div>
        <button
          className="btn-status"
          type="button"
          disabled={ status !== 'Pendente' }
          onClick={ () => this.updateStatus('Preparando', '#66cc00') }
          data-testid={ `${role}_order_details__button-preparing-check` }
        >
          PREPARAR PEDIDO
        </button>
        <button
          className="btn-status"
          type="button"
          disabled={ status !== 'Preparando' }
          onClick={ () => this.updateStatus('Em Trânsito', '#056cf9') }
          data-testid={ `${role}_order_details__button-dispatch-check` }
        >
          SAIU PARA ENTREGA
        </button>
      </div>
    );
  }

  tableItens() {
    const { allInfo: { products } } = this.state;
    const { role } = JSON.parse(localStorage.user);
    return (
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Descricao</th>
            <th>Quantidade</th>
            <th>Valor Unitario</th>
            <th>Sub-total</th>
          </tr>
        </thead>
        <tbody>
          { products.map((product, index) => (
            <ItensDetailsOrder
              key={ `${product}${index}` }
              product={ product }
              idP={ index }
              role={ role }
            />
          )) }
        </tbody>
      </table>
    );
  }

  renderSeller(role) {
    const { allInfo: { seller } } = this.state;
    return (
      <p
        data-testid={
          `${role}_order_details__element-order-details-label-seller-name`
        }
      >
        <span>P.Vend:</span>
        {seller.name}
      </p>
    );
  }

  render() {
    const { allInfo, statusP } = this.state;
    const { role } = JSON.parse(localStorage.user);

    if (allInfo.length === 0) {
      return <p>Loading...</p>;
    }

    const { id, saleDate, totalPrice } = allInfo;

    const newDate = this.dateFormat(saleDate);
    return (
      <div className="ordersDetail">
        <h3>Detalhe do Pedido</h3>
        <div className="order-detail-container">
          <div className="order-detail-up">
            <p
              data-testid={
                `${role}_order_details__element-order-details-label-order-id`
              }
            >
              <span>PEDIDO:</span>
              { id }
            </p>
            { role === 'customer' && this.renderSeller(role)}
            <p
              data-testid={
                `${role}_order_details__element-order-details-label-order-date`
              }
            >
              { newDate }
            </p>
            <p
              className="status-color"
              data-testid={
                `${role}_order_details__element-order-details-label-delivery-status`
              }
            >
              { statusP }
            </p>
            { role === 'customer' && this.buttonCustomer(role, statusP) }
            { role === 'seller' && this.buttonSeller(role, statusP) }
          </div>
          <div className="order-detail-down">
            { this.tableItens() }
            <div className="total-price">
              <span>Total: R$ </span>
              <span
                data-testid={ `${role}_order_details__element-order-total-price` }
              >
                { totalPrice.replace(/\./, ',') }
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Order.propTypes = ({
  match: {
    params: {
      id: PropTypes.number,
    },
  },
}).isRequired;

export default Order;
