import React from 'react'
import Api from '../Api'

export default function Sheet() {



    return (
        <>
            <div className='w-75'>
            <table className="text-center table table-success table-striped-colums table-hover table-bordered">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Transaction</th>
                    </tr>
                </thead>
                <tbody className='m-1'>
                    {Api[0].customers.map((person, index) => {
                        return <tr key={index}>
                            <th className='align-content-center' scope="row">{person.id}</th>
                            <td className='align-content-center'>{person.name}</td>
                            <td className='p-0' >{Api[1].transactions.map((trans, index) => {
                                {
                                    if (trans.customer_id == person.id) {
                                        return <div key={index} className='d-flex justify-content-around my-1 w-100'>
                                            <div className='text-start w-50 ps-2'> <span className='fw-semibold'>Date:</span> {trans.date}</div>
                                            <div className='text-start w-50'> <span className='fw-semibold'>Amount:</span> {trans.amount}</div>
                                        </div>
                                    }
                                }
                            })}</td>
                        </tr>
                    })}
                </tbody>
            </table>
            </div>
        </>
    )
}


