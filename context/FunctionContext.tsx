// FunctionContext.tsx
import React, { createContext, useContext } from "react";

// Define the type for the function
type OnCreationFunction = () => void;

// Define the context type
interface FunctionContextType {
  onCreation: OnCreationFunction;
  children?: React.ReactNode; // Include children property
}

// Create the context
const FunctionContext = createContext<FunctionContextType | undefined>(
  undefined
);

// Define a custom hook to consume the context
export const useFunction = () => {
  const context = useContext(FunctionContext);
  if (!context) {
    throw new Error("useFunction must be used within a FunctionProvider");
  }
  return context.onCreation;
};

// FunctionProvider component to wrap the application
export const FunctionProvider: React.FC<{ onCreation: OnCreationFunction }> = ({
  children,
  onCreation,
}) => {
  return (
    <FunctionContext.Provider value={{ onCreation, children }}>
      {" "}
      {/* Include children */}
      {children}
    </FunctionContext.Provider>
  );
};
