import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../../styles/saleCard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MostSellingProductGraph = () => {
    const [selectedShop, setSelectedShop] = useState('tea'); // Default selection is 'tea'


    const teaShopData = [
        { productName: 'Masala Tea', salesCount: 120 },
        { productName: 'Green Tea', salesCount: 80 },
        { productName: 'Chai Latte', salesCount: 60 },
        { productName: 'Black Tea', salesCount: 150 }
    ];

    const juiceShopData = [
        { productName: 'Orange Juice', salesCount: 90 },
        { productName: 'Apple Juice', salesCount: 70 },
        { productName: 'Mango Juice', salesCount: 110 },
        { productName: 'Pineapple Juice', salesCount: 50 }
    ];

    const data = selectedShop === 'tea' ? teaShopData : juiceShopData;

    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const mostSellingData = {
        labels: data.map(product => product.productName),
        datasets: [
            {
                label: 'Sales Count',
                data: data.map(product => product.salesCount),
                backgroundColor: data.map(() => generateRandomColor()), 
                borderWidth: 1,
                barThickness: 25,
            }
        ]
    };

    return (
        <div className='mostSellingProduct'>
            <h5>Most Selling Products</h5>
            <div className="row">
                <div className="col-12 d-flex justify-content-end">
               
                        <select className='custom-select' value={selectedShop} onChange={(e) => setSelectedShop(e.target.value)}>
                            <option value="tea"> Restaurant</option>
                            <option value="juice">Juice Shop</option>
                        </select>
                 
                </div>
            </div>
            <Bar data={mostSellingData} options={{
                responsive: true, plugins: {
                    legend: {
                        display: false, 
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
            }} />
        </div>
    );
};

export default MostSellingProductGraph;
