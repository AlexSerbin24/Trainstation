import React, { useEffect, useState } from 'react';
import { Ticket } from '../../../types/ticket.ts';
import Bookings from './components/Bookings.tsx';
import useUser from '../../../hooks/useUser.ts';
import { useLoaderData } from 'react-router-dom';
import "./BookingsPage.css"

export default function BookingsPage() {
    const tikcetsData = useLoaderData() as Ticket[];

    const [tickets, setTickets] = useState<Ticket[]>(tikcetsData);
    const userValue = useUser(); 


    return (
        <>
            <h1 style={{marginLeft:15}}>Куплені квитки</h1>
            <Bookings tickets={tickets} />
        </>
    );
}
