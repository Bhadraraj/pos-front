import React from 'react';
import { Table, Button, InputNumber, Form } from 'antd';

const CartComponent = ({ cartItems, updateQuantity, removeItemFromCart, totalAmount, discount, tax, finalAmount, setDiscount, setTax, calculateTotalAmount, showPaymentModal }) => {

    const cartColumns = [
        { title: 'Item Name', dataIndex: 'name', key: 'name' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        {
            title: 'Quantity',
            key: 'quantity',
            render: (_, record) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={(value) => updateQuantity(record._id, value)}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Button type="danger" onClick={() => removeItemFromCart(record._id)}>
                    Remove
                </Button>
            ),
        },
    ];

    return (
        <div className="cart-section">
            <h3>Cart</h3>
            <Table dataSource={cartItems} columns={cartColumns} rowKey="_id" />
            <div className="cart-summary">
                <p>Total Amount: ₹{totalAmount.toFixed(2)}</p>
                <Form layout="inline">
                    <Form.Item label="Discount (%)">
                        <InputNumber
                            min={0}
                            max={100}
                            value={discount}
                            onChange={(value) => {
                                setDiscount(value);
                                calculateTotalAmount();
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="Tax (%)">
                        <InputNumber
                            min={0}
                            max={100}
                            value={tax}
                            onChange={(value) => {
                                setTax(value);
                                calculateTotalAmount();
                            }}
                        />
                    </Form.Item>
                </Form>
                <p>Final Amount: ₹{finalAmount.toFixed(2)}</p>
                <Button type="primary" onClick={showPaymentModal}>
                    Proceed to Payment
                </Button>
            </div>
        </div>
    );
};

export default CartComponent;
