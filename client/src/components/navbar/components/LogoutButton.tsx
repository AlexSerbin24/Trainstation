import React from 'react';
import RedButton from '../../buttons/redButton/RedButton.tsx';
import "./LogoutButton.css";

// Предположим, что privateAuth экспортируется из файла 'privateAuth.js'
import PrivateAuthService from '../../../services/PrivateAuth.ts';
import useUser from '../../../hooks/useUser.ts';
import { UserContextType } from '../../../types/userContext.ts';

export default function LogoutButton() {

    const {setUser} = useUser() as UserContextType 
  // Обработчик клика
  const handleClick = async() => {
    // Вызов статического метода logout
    const result = await PrivateAuthService.logout();

    if(result) setUser(null);
  };

  return (
    <RedButton className='logout-btn' onClick={handleClick}>
      Вихід
    </RedButton>
  );
}
