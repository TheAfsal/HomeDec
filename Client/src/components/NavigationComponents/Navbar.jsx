import React, { useEffect, useState } from 'react';
import { PanelRightOpen, PanelLeftOpen } from 'lucide-react';
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Moon, Sun } from "lucide-react"

const Navbar = ({ isCollapsed, setIsCollapsed }) => {

    const [isDarkMode, setIsDarkMode] = useState(false)

    // useEffect(() => {
    //     applyTheme(isDarkMode)
    // }, [])

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode)
        // applyTheme(!isDarkMode)
    }

    // const applyTheme = (dark) => {
    //     if (dark) {
    //         document.documentElement.classList.add('dark')
    //     } else {
    //         document.documentElement.classList.remove('dark')
    //     }
    // }

    return (
        <header className="bg-white shadow-md p-4 my-2 flex justify-between items-center rounded-lg">
            <div className='flex gap-4'>
                <button onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <PanelLeftOpen size={25} /> : <PanelRightOpen size={25} />}
                </button>
                <input
                    type="text"
                    placeholder="Search..."
                    className="border border-gray-300 rounded-lg p-2 w-96"
                />
            </div>
            <div className='flex items-center gap-3'>
                <div className="flex items-center">
                    <div className="flex items-center space-x-2 p-4 bg-background text-foreground">
                        <Switch
                            id="night-mode"
                            checked={isDarkMode}
                            onCheckedChange={toggleTheme}
                        />
                        <Label htmlFor="night-mode" className="flex items-center space-x-2 cursor-pointer">
                            {isDarkMode ? (
                                <>
                                    <Moon className="h-4 w-4" />
                                    <span>Night mode</span>
                                </>
                            ) : (
                                <>
                                    <Sun className="h-4 w-4" />
                                    <span>Light mode</span>
                                </>
                            )}
                        </Label>
                    </div>
                    <span className="mr-3 font-nunito">Admin</span>
                    <img src="https://res.cloudinary.com/dnw0c83bh/image/upload/v1729330577/mgzyristxxoamofehukk.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
                </div>

            </div>
        </header>
    );
};

export default Navbar;
