import {cart, removeCartItem, updateDeliveryOption } from '../../data/cart.js';
import { products, getProduct,loadProducts } from '../../data/products.js';
import { formatCurrency } from '../utilities/money.js';
//import { hello } from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';//
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';



export function renderOrderSummary() {

  let cartSummaryHtml;

  cart.forEach((cartItem)=>{

    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);


    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays,'days');
    const datestring = deliveryDate.format('dddd, MMMM D');


    cartSummaryHtml += `
      <div class="cart-item-container 
      ja-cart-item-container
      js-cart-item-container-${matchingProduct.id}">
          <div class="delivery-date">
            Delivery date: ${datestring}
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image"
              src="${matchingProduct.image}">

            <div class="cart-item-details">
              <div class="product-name">
                ${matchingProduct.name}
              </div>
              <div class="product-price">
                ${matchingProduct.getPrice()}
              </div>
              <div class="product-quantity">
                <span>
                  Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary">
                  Update
                </span>
                <span class="delete-quantity-link link-primary js-delete-link"
                data-product-id="${matchingProduct.id}">
                  Delete
                </span>
              </div>
            </div>

            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
              ${deliveryOptionsHtml(matchingProduct,cartItem)}
            </div>
          </div>
        </div>
      `;
  });

  function deliveryOptionsHtml (matchingProduct,cartItem) {
    let html='';

    deliveryOptions.forEach((deliveryOption)=>{
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays,'days');
      const datestring = deliveryDate.format('dddd, MMMM D');

      const priceString = deliveryOption.priceCents===0
        ? 'FREE'
        : deliveryOption.priceCents

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked':''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${datestring}
            </div>
            <div class="delivery-option-price">
              &#x20B9;${priceString} - Shipping
            </div>
          </div>
        </div>
      `
    });

    return html;
  }

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHtml;

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click',() => {
        const productId = link.dataset.productId
        removeCartItem(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();

        renderPaymentSummary();
      })
    });

  document.querySelectorAll('.js-delivery-option')
    .forEach((divElement)=>{
      divElement.addEventListener('click',()=>{
        const productId = divElement.dataset.productId;
        const deliveryOptionId = divElement.dataset.deliveryOptionId;
        updateDeliveryOption(productId,deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
};