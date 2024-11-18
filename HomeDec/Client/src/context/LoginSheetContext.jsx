import React, { createContext, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import LoginForm from '@/pages/User/Login/components/LoginForm';


const LoginContext = createContext();

export const LoginProvider = ({ children }) => {

    const { role } = useSelector((state) => state.auth)

    const [loginSheet, setLoginSheet] = useState(false)
    const [userFunction, setUserFunction] = useState(null)

    const AutherizeUser = (proceedAction) => {
        console.log(role);
        if (role === "user") {
            proceedAction()
        } else {
            setUserFunction(() => proceedAction); 
            setLoginSheet(true);
        }
    };

    const proceedAction = () => {
        if (userFunction) {
            userFunction();
        }
        setLoginSheet(false);
    }

    return (
        <LoginContext.Provider value={{ AutherizeUser }}>
            {children}
            <Sheet open={loginSheet} onOpenChange={setLoginSheet}>
                <SheetContent className="w-full h-full sm:w-96 bg-white rounded-lg p-8 shadow-lg max-w-md">
                    <LoginForm proceedAction={proceedAction} />
                </SheetContent>
            </Sheet>
        </LoginContext.Provider>
    );
};

export const useLoginSheet = () => {
    return useContext(LoginContext);
};
