// Graph.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
// import Api from '../Api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Graph = ({ customerId }) => {

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const { data } = await axios.get('https://my-json-server.typicode.com/ahmdomrnjr/jsonfile/db');
            setTransactions(data.transactions);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // const transactions = Api[1].transactions;
    const customerTransactions = transactions.filter(trans => trans.customer_id === customerId);


    const transactionAmountsByDate = customerTransactions.reduce((acc, trans) => {
        if (!acc[trans.date]) {
            acc[trans.date] = 0;
        }
        acc[trans.date] += trans.amount;
        return acc;
    }, {});


    const labels = Object.keys(transactionAmountsByDate);
    const data = {
        labels,
        datasets: [
            {
                label: 'Total Amount',
                data: labels.map(date => transactionAmountsByDate[date]),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    return <Line data={data} />;
};

export default Graph;

