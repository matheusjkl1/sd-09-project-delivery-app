import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { NavBarElement } from '../styles';
import LogoImage from '../../images/Foto-Rick-and-Morty-PNG.png';
import LogOutImage from '../../images/logout.png';

const navBarStyle = {
  backgroundColor: '#1F1D2B',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 30px',
};

const logoStyle = {
  height: '100px',
  padding: '10px 5px',
};

const navigatorsStyle = {
  display: 'flex',
  padding: '10px 5px',
};

const navigationStyle = {
  backgroundColor: '#EA7C69',
  color: 'white',
  borderRadius: '12px',
  padding: '5px',
  margin: '0 20px',
  display: 'flex',
  alignItems: 'center',
};

const userNameDivStyle = {
  padding: '10px 5px',
  display: 'flex',
};

const userName = {
  backgroundColor: '#EA7C69',
  color: 'white',
  borderRadius: '12px',
  padding: '5px',
  margin: '0 20px',
  display: 'flex',
  alignItems: 'center',
};

function NavBar() {
  return (
    <NavBarElement style={ navBarStyle }>
      <div>
        <img style={ logoStyle } src={ LogoImage } alt="navbar-logo" />
      </div>
      <div style={ navigatorsStyle }>
        <Link
          style={ navigationStyle }
          to="/products"
          data-testid="customer_products__element-navbar-link-products"
        >
          <span>Produtos</span>
        </Link>
        <Link
          style={ navigationStyle }
          to="/orders"
          data-testid="customer_products__element-navbar-link-orders"
        >
          <span>Meus pedidos</span>
        </Link>
      </div>
      <div style={ userNameDivStyle }>
        <div
          style={ userName }
          data-testid="customer_products__element-navbar-user-full-name"
        >
          <span>Cicrano da silva</span>
        </div>
      </div>
      <div data-testid="customer_products__element-navbar-link-logout">
        <img style={ logoStyle } src={ LogOutImage } alt="logout" />
      </div>
    </NavBarElement>
  );
}

NavBar.propTypes = {
  children: PropTypes.string,
}.isRequired;

export default NavBar;
