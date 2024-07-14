import React, { useEffect, useState } from 'react';
import Graph from '../Graph/Graph';
import axios from 'axios';

export default function Sheet() {
    
    const [customers, setCustomers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('name');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const { data: customerData } = await axios.get('https://my-json-server.typicode.com/ahmdomrnjr/jsonfile/db');
            const { customers, transactions } = customerData;
            setCustomers(customers);
            setTransactions(transactions);
            console.log(customers, transactions);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const calculateTotalAmount = (customerId) => {
        return transactions
            .filter((trans) => trans.customer_id === customerId)
            .reduce((total, trans) => total + trans.amount, 0);
    };

    const handleSort = (order, by) => {
        setSortOrder(order);
        setSortBy(by);
    };

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);
    };

    const sortedCustomers = [...customers].sort((a, b) => {
        if (sortBy === 'name') {
            return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortBy === 'amount') {
            const aTotal = calculateTotalAmount(a.id);
            const bTotal = calculateTotalAmount(b.id);
            return sortOrder === 'asc' ? aTotal - bTotal : bTotal - aTotal;
        }
        return 0;
    });

    const filteredCustomers = sortedCustomers.filter((person) => {
        return (
            person.name.toLowerCase().includes(searchTerm) ||
            transactions.some((trans) => trans.customer_id === person.id && trans.amount.toString().includes(searchTerm))
        );
    });

    const handleCustomerClick = (customerId) => {
        setSelectedCustomerId(customerId);
    };

    return (
        <>
            <div className='w-25 mt-5'>
                <Graph  customerId={selectedCustomerId} />
            </div>
            <div className='w-75 h-75 overflow-y-scroll'>
                <div className='dropdown mb-3'>
                    <button className='btn btn-secondary dropdown-toggle bg-success' type='button' data-bs-toggle='dropdown' aria-expanded='false'>
                        Sort By:
                    </button>
                    <ul className='dropdown-menu bg-success-subtle fw-medium'>
                        <li><a className='dropdown-item' href='#' onClick={() => handleSort('asc', 'name')}>Name: Asc</a></li>
                        <li><a className='dropdown-item' href='#' onClick={() => handleSort('desc', 'name')}>Name: Desc</a></li>
                        <li><a className='dropdown-item' href='#' onClick={() => handleSort('asc', 'amount')}>Amount: Asc</a></li>
                        <li><a className='dropdown-item' href='#' onClick={() => handleSort('desc', 'amount')}>Amount: Desc</a></li>
                    </ul>
                </div>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Search by name or amount..." onChange={handleSearch} />
                </div>
                <div>
                    <table className='text-center table table-success table-striped-columns table-hover table-bordered'>
                        <thead>
                            <tr>
                                <th scope='col'>ID</th>
                                <th scope='col'>Customer</th>
                                <th scope='col'>Transaction</th>
                            </tr>
                        </thead>
                        <tbody className='m-1'>
                            {filteredCustomers.map((person, index) => (
                                <tr key={index} onClick={() => handleCustomerClick(person.id)}>
                                    <th className='align-content-center' scope='row'>{person.id}</th>
                                    <td className='align-content-center'>{person.name}</td>
                                    <td className='p-0'>
                                        {transactions.map((trans, transIndex) => {
                                            if (trans.customer_id === person.id) {
                                                return (
                                                    <div key={transIndex} className='d-flex justify-content-around my-1 w-100'>
                                                        <div className='text-start w-50 ps-2'>
                                                            <span className='fw-semibold'>Date:</span> {trans.date}
                                                        </div>
                                                        <div className='text-start w-50'>
                                                            <span className='fw-semibold'>Amount:</span> {trans.amount}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
