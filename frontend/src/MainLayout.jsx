import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./components/misc/SideBar";
import LanguageSelector from "./components/language/LanguageSelector";

const MainLayout = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile(); // Initial check
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile); // Cleanup
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <div className="bg-white shadow-md flex justify-end items-center">
                    <LanguageSelector />
                </div>
                <div className={`pt-10 md:pt-16 ${collapsed ? 'md:pl-0' : 'md:pl-0'} transition-all duration-300 overflow-y-auto h-screen`}>
                    <Outlet />
                </div>

            </div>
        </div>
    );
};

export default MainLayout;
