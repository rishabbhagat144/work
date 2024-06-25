import {cart, resetCart} from '../../data/cart.js';
import { getProduct} from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import {formatCurrency} from '../utilities/money.js';
import { addOrder } from '../../data/orders.js';



export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem)=>{
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents*cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents

  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = taxCents + totalBeforeTaxCents;

  const paymentSummaryHTML=
  `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items:</div>
      <div class="payment-summary-money">&#x20B9;${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">&#x20B9;${formatCurrency(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">&#x20B9;${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">&#x20B9;${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order">Place Your Order</button>
  `;

  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order')
    .addEventListener('click',async ()=>{
      try {
        const response = await fetch('https://supersimplebackend.dev/orders',{
          method: 'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body: JSON.stringify({
            cart: cart
          })
        });
  
        const order = await response.json();
        addOrder(order);
      } catch (error) {
        console.log('Unexpected error.try again later')
      }
      resetCart();
      window.location.href = 'orders.html';
    });
}