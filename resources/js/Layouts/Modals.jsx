import { Close } from "@mui/icons-material";
import React from "react";

export default function Modals({ children, open, setOpen, title }) {
    return (
        <div
            className={`${
                open ? "translate-y-0" : "translate-y-full"
            } absolute top-0 left-0 w-full h-full bg-white z-[99] transition-all duration-300 ease-in-out `}
        >
            <div className="py-3 px-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-red-500 text-sm">{title}</h3>
                    <button
                        onClick={() => setOpen()}
                        className="bg-red-500 py-2 px-2 rounded-md text-white text-base"
                    >
                        <Close color="inherit" fontSize="inherit" />
                    </button>
                </div>
                <div className="max-h-[90vh] overflow-y-auto py-3">
                    {children}
                </div>
            </div>
        </div>
    );
}
