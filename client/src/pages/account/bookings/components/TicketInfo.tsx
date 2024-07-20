import React from 'react'
import { Ticket } from '../../../../types/ticket'
import RedButton from '../../../../components/buttons/redButton/RedButton.tsx'


type Props = {
    ticket: Ticket
}

export default function TicketInfo({ ticket }: Props) {
    return (
        <div className='ticket-info'>
            <div className='ticket-info-row'>
                <p className='ticket-info-column'>{ticket.carriageNumber}</p>
                <p className='ticket-info-column'>{ticket.departurePoint}-{ticket.arrivalPoint}</p>
                <div className='ticket-info-column'>
                    <p>{new Date(ticket.departureDate).toLocaleString()}</p>
                    <p>{new Date(ticket.arrivalDate).toLocaleString()}</p>
                </div>
                <p className='ticket-info-column'>{ticket.placeNumber}</p>
                <p className='ticket-info-column'>{ticket.totalPrice}</p>
            </div>
            <div className='ticket-info-row ticket-info-cancel-btn'>
                <RedButton>Відмовитися від квитка</RedButton>
            </div>
        </div>
    )
}
