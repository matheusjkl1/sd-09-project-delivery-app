import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Customer from '../context/customerContext';
import useTotalPrice from '../hooks/utils/useTotalPrice';

const ClientProducts = () => {
  const { token } = JSON.parse(localStorage.getItem('user'));
  const [products, setProducts] = useProducts();
  const { shoppingCart } = useContext(Customer);
  const [totalPrice, setTotalPrice] = useTotalPrice();
  const History = useHistory();
  const cartBtn = document.getElementById('cart-btn');

  let renderProducts;
  if (products.length > 0) {
    renderProducts = products.map(
      (prod) => <ProductCard key={ prod.id } product={ prod } />,
    );
  }

  useEffect(() => {
    setTotalPrice(shoppingCart);
    localStorage.setItem('cart', JSON.stringify(shoppingCart));
    if (cartBtn && shoppingCart.length > 0) {
      cartBtn.disabled = false;
    }
    if (cartBtn && shoppingCart.length === 0) {
      cartBtn.disabled = true;
    }
  }, [shoppingCart, setTotalPrice, cartBtn]);

  useEffect(() => {
    const loadProducts = async () => {
      await setProducts(token);
    };
    loadProducts();
  }, [token, setProducts]);

  function handleCheckout() {
    History.push('/customer/checkout');
  }

  return (
    <div>
      <Header />
      <div className="products">
        { renderProducts }
      </div>
      <button
        id="cart-btn"
        className="cartBtn"
        type="button"
        data-testid="customer_products__button-cart"
        onClick={ handleCheckout }
      >
        <span>Ver Carrinho: R$</span>
        <span
          data-testid="customer_products__checkout-bottom-value"
        >
          { totalPrice }
        </span>
      </button>
    </div>
  );
};

export default ClientProducts;
