import React, { useState} from 'react';
import Navbar from './components/navbar/Navbar.tsx';
import Footer from './components/footer/Footer.tsx';
import { Outlet} from 'react-router-dom';
import CartModal from './components/modals/customModals/cartModal/CartModal.tsx';




function Root() {

  const [isModalOpen, setIsModalOpen] = useState(false);



  return (
    <>
      {isModalOpen && (
        <CartModal  onClose={() => setIsModalOpen(false)} />
      )}

      <Navbar onClick={() => setIsModalOpen(true)}/>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default Root;
