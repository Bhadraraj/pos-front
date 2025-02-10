import React from 'react';
import { Modal } from 'antd';
import { MdOutlineCurrencyRupee, MdAdd } from 'react-icons/md';
import { TiMinus } from 'react-icons/ti';
import briyani from '../images/briyani.png';

const Cart = ({ isOpen, onClose }) => {
  return (
    <Modal
      title='SEAT NO : #S21'
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <div className="cartScrollContainer">
        {[...Array(6)].map((_, index) => (
          <div className="cartCardMainOuter mt-4" key={index}>
            <div className="row">
              <div className="col-3">
                <img src={briyani} alt="Cart Item Img" className="img-fluid" />
              </div>
              <div className="col-6 me-0 pe-0">
                <p className="cardItemName mb-0">Thanthoori Chicken</p>
                <p className="cardItemPrice mb-0">
                  <MdOutlineCurrencyRupee /> 150
                </p>
              </div>
              <div className="col-3 d-flex justify-content-between align-items-center ps-0">
                <span className="cartaddBtn">
                  <MdAdd />
                </span>
                <span className="cartItemAmount mx-1">150</span>
                <span className="cartRemoveBtn">
                  <TiMinus />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cartAmountSection">
        <div className="row">
          <div className="col-6">
            <span className="subTotalText">Sub Total</span>
          </div>
          <div className="col-6 text-end">
            <span className="cartSubTotalAmount">Rs. 180.00</span>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <span className="subTotalText">GST 10%</span>
          </div>
          <div className="col-6 text-end">
            <span className="cartSubTotalAmount">Rs. 10.00</span>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-12">
            <button className="placeOrderBtn">Place Order</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Cart;
