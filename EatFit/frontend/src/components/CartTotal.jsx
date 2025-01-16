import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount, user } = useContext(ShopContext);

  const studentDiscount = 0.1; // 10% discount for students

  const totalAmount = getCartAmount();
  const discountedTotal = user?.isStudent ? totalAmount * (1 - studentDiscount) : totalAmount;

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{currency} {totalAmount.toFixed(2)}</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{currency} {delivery_fee.toFixed(2)}</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <b>Total</b>
          <b>{currency} {(discountedTotal + delivery_fee).toFixed(2)}</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
