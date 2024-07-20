import React, { useState, useEffect, Children } from 'react';
import TrainData from './components/TrainData.tsx';
import CarriageSelectionForm from './components/CarriageSelectionForm.tsx';
import TicketForm from './components/TicketForm.tsx';
import "./TicketingPage.css";
import { useLoaderData } from 'react-router-dom';
import { TrainFullInfo, CarriageInfo, SelectedPlace } from '../../types/trainInfo.ts';
import { CarriagePlace } from '../../types/train.ts';
import PassengerData from '../../types/passengerData.ts';
import useUser from '../../hooks/useUser.ts';
import { useCart } from '../../hooks/useCart.ts';
import CartService from '../../services/CartService.ts';
import { Ticket } from '../../types/ticket.ts';
import useLoading from '../../hooks/useLoading.ts';
import Loader from '../../components/loader/Loader.tsx';
import BookingSuccess from './components/BookingSuccess.tsx';

export default function TicketingPage() {
    const trainData = useLoaderData() as TrainFullInfo;
    const userValue = useUser()
    const { setCart } = useCart();

    const calculateDuration = (departureTime: string, arrivalTime: string) => {
        const departure = new Date(departureTime);
        const arrival = new Date(arrivalTime);
        const duration = (arrival.getTime() - departure.getTime()) / (1000 * 60 * 60); // in hours
        return duration;
    };

    const [executeAsyncFunction, isLoading] = useLoading();

    const initialDuration = calculateDuration(trainData.route.departureTime, trainData.route.arrivalTime);

    const [isBookingFinished, setIsBookingFinished] = useState<boolean>(false);
    const [basePrice, setBasePrice] = useState<number>(150 * initialDuration);
    const [selectedCarriage, setSelectedCarriage] = useState<CarriageInfo | null>(null);
    const [selectedCarriageType, setSelectedCarriageType] = useState<string>(trainData.carriagesTypes[0] || '');
    const [selectedPlaces, setSelectedPlaces] = useState<SelectedPlace[]>([]);
    const [filledForms, setFilledForms] = useState<PassengerData[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(basePrice);

    useEffect(() => {
        const newBasePrice = 150 * initialDuration;
        setBasePrice(newBasePrice);
        setTotalPrice(newBasePrice);
    }, [trainData]);

    const handleSelectPlace = (place: CarriagePlace) => {
        setSelectedPlaces((prevSelectedPlaces) => {
            const isSelected = prevSelectedPlaces.some(p => p.id === place.id);
            const newSelectedPlaces = isSelected
                ? prevSelectedPlaces.filter(p => p.id !== place.id)
                : [...prevSelectedPlaces, { id: place.id, number: place.number, carriageNumber: selectedCarriage?.carriageNumber as number, carriageType: selectedCarriageType }];

            const newFilledForms = isSelected
                ? filledForms.slice(0, -1) 
                : [...filledForms, { name: '', lastname: '', patronymic: '', email: '', extraServices: [] }];

            setFilledForms(newFilledForms);
            return newSelectedPlaces;
        });
    };

    const handleFormSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        await executeAsyncFunction(async () => {
            const tickets: Ticket[] = []


            filledForms.forEach((form, index) => tickets.push({
                trainId: trainData.id,
                trainNumber: trainData.trainNumber,
                name: form.name,
                lastname: form.lastname,
                patronymic: form.patronymic,
                departurePoint: trainData.route.departurePoint,
                arrivalPoint: trainData.route.arrivalPoint,
                departureDate: new Date(trainData.route.departureTime),
                arrivalDate: new Date(trainData.route.arrivalTime),
                placeId: selectedPlaces[index].id,
                placeNumber: selectedPlaces[index].number,
                carriageNumber: selectedPlaces[index].carriageNumber,
                totalPrice: totalPrice,
                email: form.email,
                extraServices: form.extraServices,
            }));

            const cart = await CartService.addToCart(userValue?.user?.id as number, tickets);

            setCart(cart);
            setIsBookingFinished(true);
        })

    }

    const handleFormChange = (form: PassengerData, index: number) => {
        const newFilledForms = [...filledForms];
        newFilledForms[index] = form;
        setFilledForms(newFilledForms);
    };

    const updateTotalPrice = (price: number) => {
        setTotalPrice(price);
    };

    return (
        <div className='ticket-page-container'>
            {isBookingFinished ? <BookingSuccess />
                :
                <>
                    {isLoading && <Loader />}
                    <div style={{ background: "white", padding: 20 }}>
                        <TrainData train={trainData} />
                        <CarriageSelectionForm
                            carriages={trainData.carriages}
                            carriagesType={trainData.carriagesTypes}
                            selectedCarriageType={selectedCarriageType}
                            setSelectedCarriageType={setSelectedCarriageType}
                            selectedPlaces={selectedPlaces}
                            selectedCarriage={selectedCarriage}
                            setSelectedCarriage={setSelectedCarriage}
                            handleSelectPlace={handleSelectPlace}
                            basePrice={basePrice}
                            updateTotalPrice={updateTotalPrice}
                        />
                        {filledForms.length !== 0 &&
                            <>
                                <TicketForm
                                    filledForms={filledForms}
                                    onFormChange={handleFormChange}
                                    onFormSubmit={handleFormSubmit}
                                    totalPrice={totalPrice}
                                    updateTotalPrice={updateTotalPrice}
                                />
                                <h3>Повна ціна: ₴{totalPrice}</h3>
                            </>
                        }


                    </div>
                </>
            }
        </div>
    );
}
