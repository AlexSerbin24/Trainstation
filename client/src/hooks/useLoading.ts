import { useState } from 'react';

type AsyncFunction<A extends any[] = any[]> = (...args: A) => Promise<any>;

function useLoading(): [(asyncFunction: AsyncFunction) => Promise<void>, boolean] {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const executeAsyncFunction = async (asyncFunction: AsyncFunction, ...args: any[]) => {
    setIsLoading(true);
    try {
      await asyncFunction(...args);
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return [executeAsyncFunction, isLoading];
}

export default useLoading;
