import React from 'react';
import Button from '../../../components/buttons/Button.tsx';
import ExtraService from '../../../types/extraService.ts';
import PassengerData from '../../../types/passengerData.ts';

type Props = {
    filledForms: PassengerData[];
    onFormChange: (form: PassengerData, index: number) => void,
    onFormSubmit:(event: React.MouseEvent<HTMLButtonElement>) => void,
    totalPrice: number;
    updateTotalPrice: (price: number) => void;
};

const extraServicesData: ExtraService[] = [
    { id: 1, name: 'Дрип кава', price: 30 },
    { id: 2, name: 'Авторський чай', price: 40 },
    { id: 3, name: '1 напій', price: 50 }
];

const TicketForm: React.FC<Props> = ({ filledForms, onFormChange,onFormSubmit, totalPrice, updateTotalPrice }) => {
    const handleChange = (index: number, field: string, value: any) => {
        const newForm = { ...filledForms[index], [field]: value };
        onFormChange(newForm, index);
    };

    const handleCheckboxChange = (index: number, service: ExtraService) => {
        console.log(service)
        const form = filledForms[index];
        const existingServiceIndex = form.extraServices.findIndex(s => s.id === service.id);

        console.log("Index service")
        console.log(existingServiceIndex)

        const newExtraServices = existingServiceIndex !== undefined && existingServiceIndex >= 0
            ? form.extraServices?.filter(s => s.id !== service.id)
            : [...(form.extraServices || []), service];


        console.log("New extra services.")
        console.log(newExtraServices)

        const newForm = { ...form, extraServices: newExtraServices };
        onFormChange(newForm, index);

        updateTotalPrice(existingServiceIndex === - 1 ? totalPrice + service.price : totalPrice - service.price);
    };

    const renderPassengerForms = () => {
        return filledForms.map((form, i) => (
            <div key={i}>
                <h4>Пасажир №{i + 1}</h4>
                <div className="form-group">
                    <label>Прізвище:</label>
                    <input
                        type="text"
                        value={form.lastname}
                        onChange={(e) => handleChange(i, 'lastname', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Ім'я:</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange(i, 'name', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>По батькові:</label>
                    <input
                        type="text"
                        value={form.patronymic}
                        onChange={(e) => handleChange(i, 'patronymic', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={form.email || ''}
                        onChange={(e) => handleChange(i, 'email', e.target.value)}
                    />
                </div>
                <div className="checkbox-group">
                    {extraServicesData.map(service => (
                        <label key={service.id}>
                            <input
                                type="checkbox"
                                checked={form.extraServices?.some(s => s.id === service.id) || false}
                                onChange={() => handleCheckboxChange(i, service)}
                            />
                            {service.name} (₴{service.price})
                        </label>
                    ))}
                </div>
            </div>
        ));
    };

    return (
        <>
            <div>
                <h2>Введіть інформацію про пасажирів:</h2>
                {renderPassengerForms()}
            </div>
            <Button className='add-to-cart-btn' onClick={onFormSubmit}>
                Додати в кошик
            </Button>
        </>
    );
}

export default TicketForm;
