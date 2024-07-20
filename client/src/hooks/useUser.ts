import { useContext } from 'react';
import { UserContext } from '../providers/userProvider.tsx';


const useUser = () => {
  const context = useContext(UserContext);
  return context;
};

export default useUser;
