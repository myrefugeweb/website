import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface StagingContextType {
  stagingMode: boolean;
}

const StagingContext = createContext<StagingContextType>({ stagingMode: false });

export const StagingProvider: React.FC<{ children: ReactNode; stagingMode: boolean }> = ({ children, stagingMode }) => {
  return (
    <StagingContext.Provider value={{ stagingMode }}>
      {children}
    </StagingContext.Provider>
  );
};

export const useStagingMode = () => useContext(StagingContext);

