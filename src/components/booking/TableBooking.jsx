import React, { useState } from 'react';

import '../../styles/tableBooking.css'
const BookingCard = () => {
    const [tables, setTables] = useState([
        { id: 1, status: 'available' },
        { id: 2, status: 'booked' },
        { id: 3, status: 'available' },
        { id: 4, status: 'booked' },
        { id: 5, status: 'available' },
        { id: 6, status: 'booked' },
        { id: 7, status: 'available' },
        { id: 8, status: 'booked' },
        { id: 9, status: 'available' },
        { id: 10, status: 'available' },
        { id: 11, status: 'available' },
        { id: 12, status: 'available' },
    ]);

    const toggleBooking = (id) => {
        setTables(tables.map(table =>
            table.id === id
                ? { ...table, status: table.status === 'available' ? 'booked' : 'available' }
                : table
        ));
    };
    // Calculate totals
    const totalAvailable = tables.filter(table => table.status === 'available').length;
    const totalBooked = tables.filter(table => table.status === 'booked').length;

    return (
        <>
            <div className="row d-flex justify-content-between">
                <div className="col-6"> <h2>Table Reservations</h2></div>
                <div className="col-6 text-end table-summary">
                    <p> <span className="avaliableCircle"></span> Avaliable : {totalAvailable}</p>
                    <p><span className="bookedCircle"></span> Total Booked Tables: {totalBooked} </p></div>
            </div>


            <div className="row d-flex justify-content-evenly g-4">


                {tables.map(table => (
                    <div className="col-lg-2 col-md-3 col-sm-4 col-6">
                        <div
                            key={table.id}
                            className={`booking-card ${table.status}`}
                        >
                            <p>Table {table.id}</p>
                            <button onClick={() => toggleBooking(table.id)} className='tableBtn'>
                                {table.status === 'available' ? 'Book' : 'Booked'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default BookingCard;
