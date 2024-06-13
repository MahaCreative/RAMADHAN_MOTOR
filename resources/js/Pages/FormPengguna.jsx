import { useForm } from "@inertiajs/react";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import ReactLoading from "react-loading";
export default function FormPengguna({ setOpen }) {
    const { data, setData, post, reset } = useForm({
        nama: "",
        foto: [],
    });
    const [errors, setErrors] = useState({ nama: "", foto: "" });
    const [loading, setLoading] = useState(false);
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setData({
            ...data,
            foto: files.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            })),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        post(route("create-pengguna"), {
            onStart: () => {},
            onError: (err) => {
                const fotoErrors = [];
                for (let key in err) {
                    if (key.startsWith("foto.")) {
                        const index = parseInt(key.split(".")[1], 10);
                        fotoErrors[index] = err[key];
                    }
                }
                setErrors({ nama: err.nama, foto: fotoErrors[0] });
            },
            onFinish: () => {
                setLoading(false);
                setOpen();
            },
        });
        // Proses pengiriman data menggunakan post
    };

    return (
        <>
            {loading && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-slate-700/50 z-50">
                    <ReactLoading
                        type={"spinningBubbles"}
                        color="#fff"
                        height={"20%"}
                        width={"20%"}
                    />
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="py-3 my-3 flex flex-col gap-3">
                    <p className="text-sm">
                        Silahkan mengupload foto selfi pengguna disini. Hasil
                        Prediksi akan sangat dipengaruhi oleh banyaknya jumlah
                        foto serta kejelasan wajah pengguna
                    </p>
                    <TextField
                        className="w-full block"
                        id="filled-basic"
                        label="Nama Pengguna"
                        variant="filled"
                        onChange={(e) =>
                            setData({ ...data, nama: e.target.value })
                        }
                        value={data.nama}
                        error={errors.nama ? true : false}
                        helperText={errors.nama}
                    />
                    <TextField
                        className="w-full block"
                        id="filled-basic"
                        label="Foto Pengguna"
                        variant="filled"
                        type="file"
                        inputProps={{ multiple: true }}
                        onChange={handleFileChange}
                        error={errors.foto ? true : false}
                        helperText={errors.foto}
                    />
                    <button
                        className="bg-blue-500 py-2 px-2 rounded-md text-white text-base"
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Submit
                    </button>

                    <div className="flex flex-wrap gap-2">
                        {data.foto.map((fileData, index) => (
                            <img
                                key={index}
                                src={fileData.preview}
                                alt={`preview ${index}`}
                                className="w-20 h-20 object-cover"
                            />
                        ))}
                    </div>
                </div>
            </form>
        </>
    );
}
