import React from 'react';



const BookingSuccess: React.FC = () => {

    return (
        <div className="booking-success-overlay">
            <div className="booking-success-container">
            <div className="success-icon">
            <div className="checkmark"></div>
                </div>
                <p>Ваші білети заброньовані та додані в кошик. Протягом 15 хвилин ви повинні закінчити покупку.</p>
            </div>
        </div>
    );
};

export default BookingSuccess;