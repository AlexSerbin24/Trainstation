import React from 'react';
import './Modal.css';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const Modal: React.FC<Props> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                {children}
            </div>
        </div>
    );
};

export default Modal;
