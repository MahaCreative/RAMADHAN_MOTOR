import GuestLayout from "@/Layouts/GuestLayout";

import React, { useState } from "react";
import Pengguna from "./Pengguna";
import { Group } from "@mui/icons-material";
import KontrolMotor from "./KontrolMotor";

export default function Index(props) {
    const pengguna = props.pengguna;
    const [menu, setMenu] = useState("kontrol");
    return (
        <div className="w-full h-full overflow-x-hidden">
            <div className="my-3 text-center bg-gray-800/50 bg-gradient-to-bl from-gray-700/50 via-transparent ring-1 ring-inset ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500 text-red-500 py-2 px-4 active:scale-105 cursor-pointer justify-between items-center">
                <p className="text-3xl leading-3">
                    <Group color="inherit" fontSize="inherit" />
                </p>
                <div className="text-right">
                    <p className="text-3xl font-bold">{pengguna.length}</p>
                    <p>Jumlah Pengguna</p>
                </div>
            </div>
            <div className="flex justify-between items-center ">
                <button
                    onClick={() => setMenu("pengguna")}
                    className="text-center bg-gray-800/50 bg-gradient-to-bl from-gray-700/50 via-transparent ring-1 ring-inset ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500 text-red-500 py-2 px-4 active:scale-105 cursor-pointer justify-center"
                >
                    Lihat Pengguna
                </button>
                <button
                    onClick={() => setMenu("kontrol")}
                    className="text-center bg-gray-800/50 bg-gradient-to-bl from-gray-700/50 via-transparent ring-1 ring-inset ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500 text-red-500 py-2 px-4 active:scale-105 cursor-pointer justify-center"
                >
                    Kontrol Motor
                </button>
            </div>
            <div className="my-3">
                <Pengguna menu={menu} pengguna={pengguna} />
                <KontrolMotor pengguna={pengguna} menu={menu} />
            </div>
        </div>
    );
}

Index.layout = (page) => <GuestLayout children={page} />;
