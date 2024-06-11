import Modals from "@/Layouts/Modals";
import { router } from "@inertiajs/react";
import { Add, Delete } from "@mui/icons-material";

import React, { useState } from "react";
import FormPengguna from "./FormPengguna";

export default function Pengguna(props) {
    const pengguna = props.pengguna;
    const menu = props.menu;
    const [modalTambah, setModalTambah] = useState(false);
    const [open, setOpen] = useState(false);
    const [model, setModel] = useState(null);
    const showItem = (item) => {
        setModel(item);
        setModalTambah(false);
        setOpen(true);
    };
    const setDelete = (item) => {
        router.delete(route("delete-foto-pengguna", { id: item.id }), {
            onSuccess: () => {
                setOpen(false);
                setModel(null);
            },
        });
    };
    const deleteData = (row) => {
        router.delete(route("delete-pengguna", { id: row.id }));
    };
    return (
        <>
            <Modals
                title={"Create Pengguna"}
                open={modalTambah}
                setOpen={() => setModalTambah(false)}
            >
                <FormPengguna setOpen={() => setModalTambah(false)} />
            </Modals>
            <Modals
                title={"Show Foto Pengguna"}
                open={open}
                setOpen={() => {
                    setOpen(false);
                    setModel(null);
                }}
            >
                {model && (
                    <>
                        <div className="grid grid-cols-3">
                            {model?.foto.map((item, key) => (
                                <div className="relative">
                                    <img
                                        src={"/storage/" + item.foto}
                                        alt=""
                                        className="w-[200px] object-cover"
                                    />
                                    <button
                                        onClick={() => setDelete(item)}
                                        className="absolute top-1 left-1 text-xs bg-red-500 py-2 px-2 rounded-md text-white"
                                    >
                                        <Delete
                                            color="inherit"
                                            fontSize="inherit"
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </Modals>
            <div
                className={`${
                    menu == "pengguna" ? "translate-x-0" : "translate-x-full"
                } transition-all duration-300 ease-in-out`}
            >
                <button
                    onClick={() => {
                        setModalTambah(true);
                        setOpen(false);
                    }}
                    className="bg-blue-500 py-2 px-2 rounded-md text-white text-base"
                >
                    <Add color="inherit" fontSize="inherit" />
                </button>
                <div className="max-h-[80vh] overflow-y-auto">
                    {pengguna.map((item, key) => (
                        <div
                            key={key}
                            className="bg-white/50 backdrop-blur-md py-2 px-4 flex justify-between items-center rounded-md my-3"
                        >
                            <div className="">
                                <h3 className="text-red-500 text-sm">
                                    {item.nama}
                                </h3>
                                <p className="text-xs">
                                    Jumlah Foto {item.foto.length}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => deleteData(item)}
                                    className="bg-red-500/90 rounded-md py-2 px-2 text-xs text-white active:bg-red-600 transition-all ease-in-out duration-300"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => showItem(item)}
                                    className="bg-green-500/90 rounded-md py-2 px-2 text-xs text-white active:bg-green-600 transition-all ease-in-out duration-300"
                                >
                                    Show
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
