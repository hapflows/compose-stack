import React, { createContext as createReactContext, useContext } from 'react';

type CreateContextReturnType<ContextType> = [React.Provider<ContextType>, () => ContextType];

type CreateContextOptions = { shouldThrowError?: boolean };

export const createContext = <ContextType>(options: CreateContextOptions = {}) => {
  const { shouldThrowError = true } = options;
  const ctx = createReactContext<ContextType | undefined>(undefined);

  const useCtx = () => {
    const context = useContext(ctx);

    if (!context && shouldThrowError) {
      throw new Error('Context is undefined');
    }

    return context;
  };

  return [ctx.Provider, useCtx] as CreateContextReturnType<ContextType>;
};
