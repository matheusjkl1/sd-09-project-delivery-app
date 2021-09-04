import React from 'react';
import { useHistory } from 'react-router-dom';

function NavBar() {
  const history = useHistory();

  const { name } = JSON.parse(localStorage.getItem('user'));
  // console.log('userrrr', user.name);

  const goToOrders = () => {
    const redirectRole = {
      customer: '/customer/orders',
    };

    const getUser = localStorage.getItem('user');
    const user = JSON.parse(getUser);
    return history.push(redirectRole[user.role]);
  };

  return (
    <nav className="navbar-container">
      <span className="navbar-left">
        <button
          type="button"
          onClick={ () => history.push('/customer/products') }
          data-testid="customer_products__element-navbar-link-products"
        >
          Produtos
        </button>
        <button
          data-testid="customer_products__element-navbar-link-orders"
          type="button"
          onClick={ goToOrders }
        >
          Meus Pedidos
        </button>
      </span>
      <span className="navbar-right">
        <span data-testid="customer_products__element-navbar-user-full-name">
          { name }
        </span>
        <button
          data-testid="customer_products__element-navbar-link-logout"
          type="button"
          onClick={ () => {
            localStorage.removeItem('user');
            history.push('/login');
          } }
        >
          Sair
        </button>
      </span>
    </nav>
  );
}

export default NavBar;