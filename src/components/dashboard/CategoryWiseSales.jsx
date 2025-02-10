import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../../styles/saleCard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CategoryWiseSales = () => {
 
    const [categorySales, setCategorySales] = useState([
        { categoryName: 'Tea Shop', totalSales: 5000 },
        { categoryName: 'Juice Shop', totalSales: 3000 },
        { categoryName: 'Coffee Shop', totalSales: 4500 },
        { categoryName: 'Snacks Bar', totalSales: 2500 },
        { categoryName: 'Bakery', totalSales: 3500 }
    ]);

    const productCategoryData = {
        labels: categorySales.map(item => item.categoryName),
        datasets: [
            {
                data: categorySales.map(item => item.totalSales),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                barThickness: 25,
            },
        ],
    };

    return (
        < >
            <h5>Sales by Shop</h5>
            <Bar
                data={productCategoryData}
                options={{
                    responsive: true,
                    plugins: {
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
                }}
            />
        </>
    );
};

export default CategoryWiseSales;
