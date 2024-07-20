import React from 'react'
import { Ticket } from '../../../../types/ticket'
import TicketInfo from './TicketInfo.tsx'

type Props = {
    tickets: Ticket[]
}

export default function Bookings({ tickets }: Props) {
    return (
        <div className={tickets.length !==0 ? "tickets-list":""}>
            {tickets.length === 0 ? (
                <p style={{textAlign:"center", fontSize:20}}>Ви ще не замовили жодного квитка</p>
            ) : (
                <>
                    <div className='ticket-info-header'>
                        <p className='ticket-info-column' style={{fontWeight:"bold"}}>Номер вагона</p>
                        <p className='ticket-info-column' style={{fontWeight:"bold"}}>З/До</p>
                        <p className='ticket-info-column' style={{fontWeight:"bold"}}>Відправлення/Прибуття</p>
                        <p className='ticket-info-column' style={{fontWeight:"bold"}}>Номер місця у вагоні</p>
                        <p className='ticket-info-column' style={{fontWeight:"bold"}}>Ціна</p>
                    </div>
                    {tickets.map(ticket =>
                        <TicketInfo key={ticket.placeId} ticket={ticket} />
                    )}
                </>
            )}
        </div>
    )
}
