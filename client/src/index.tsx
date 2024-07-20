import React from 'react';
import ReactDOM from 'react-dom/client';
import "@fontsource/inter";
import './index.css';
import Routes from './Routes.tsx';
import { UserProvider } from './providers/userProvider.tsx';
import { CartProvider } from './providers/cartProvider.tsx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <UserProvider>
      <CartProvider>
        <Routes />
      </CartProvider>
    </UserProvider>
);
