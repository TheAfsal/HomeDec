import React, { createContext, useContext, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Create the context
const ConfirmationContext = createContext();

// Provider component
export const ConfirmationProvider = ({ children }) => {
  const [confirmation, setConfirmation] = useState({
    message: '',
    onConfirm: null,
    visible: false, // Start with false
  });

  const requestConfirmation = (message, onConfirm) => {
    setConfirmation({ message, onConfirm, visible: true });
  };

  const handleConfirm = () => {
    if (confirmation.onConfirm) confirmation.onConfirm();
    setConfirmation({ ...confirmation, visible: false }); 
  };

  const handleCancel = () => {
    setConfirmation({ ...confirmation, visible: false }); 
  };

  return (
    <ConfirmationContext.Provider value={requestConfirmation}>
      {children}
      {confirmation.visible && (
        <Alert
          message={confirmation.message}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmationContext.Provider>
  );
};

// Custom hook to use the confirmation context
export const useConfirmation = () => {
  return useContext(ConfirmationContext);
};

const Alert = ({ message, onConfirm, onCancel }) => (
  <AlertDialog open={true} onOpenChange={onCancel}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-green_800">Confirmation</AlertDialogTitle>
        <AlertDialogDescription>
          {message}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel} className="text-green_600 hover:text-green_700" >Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => { onConfirm(); onCancel(); }} className="bg-green_600 hover:bg-green_700">
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
