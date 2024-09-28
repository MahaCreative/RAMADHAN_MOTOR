import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import ReactLoading from "react-loading";
import mqtt from "mqtt";
export default function KontrolMotor({ menu, pengguna }) {
    const webcamRef = useRef(null);
    const [label, setLabel] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user",
    };

    const [screenshot, setScreenshot] = useState(null);
    const [prediksi, setPrediksi] = useState(false);
    const [datawajah, setDatawajah] = useState({ status_kenal: "", nama: "" });
    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setScreenshot(imageSrc);
        setPrediksi(true);
        setLoading(true);
    };
    useEffect(() => {
        let lab = [];
        pengguna.map((item) => lab.push(item.nama));
        setLabel(lab);
    }, [pengguna]);
    useEffect(() => {
        async function loadModels() {
            try {
                await Promise.all([
                    faceapi.nets.ageGenderNet.loadFromUri("/models"),
                    faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
                    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
                    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
                    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
                    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
                ]);
            } catch (error) {
                console.error("Failed to load models:", error);
            }
        }
        loadModels();
    }, []);
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            clearInterval(timer);
            setPrediksi(false);
            setDatawajah({ ...datawajah, status_kenal: false, nama: "" });
        }

        return () => clearInterval(timer);
    }, [countdown]);

    const prediksiUlang = () => {
        setPrediksi(false);
        setLoading(false);
        setCountdown(0);
        setDatawajah({ ...datawajah, status_kenal: false, nama: "" });
    };

    useEffect(() => {
        if (screenshot) {
            const img = new Image();
            img.src = screenshot;
            img.onload = async () => {
                const detections = await faceapi
                    .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptors();
                setPrediksi(false);
                setLoading(false);
                if (detections && detections.length > 0) {
                    const labeledDescriptors = await loadLabeledImages();
                    const faceMatcher = new faceapi.FaceMatcher(
                        labeledDescriptors,
                        0.6
                    );
                    const resizedDetections = faceapi.resizeResults(
                        detections,
                        { width: img.width, height: img.height }
                    );
                    const results = resizedDetections.map((d) =>
                        faceMatcher.findBestMatch(d.descriptor)
                    );

                    results.forEach((result) => {
                        if (result.label !== "unknown") {
                            setDatawajah({
                                status_kenal: true,
                                nama: result.label,
                            });
                            setCountdown(60);
                        } else {
                            console.log("abg");
                            setDatawajah({
                                status_kenal: false,
                                nama: "unknow",
                            });
                        }
                    });
                } else {
                    setDatawajah({ status_kenal: false, nama: "" });
                }
            };
        }
    }, [screenshot, prediksi]);

    const loadLabeledImages = async () => {
        return Promise.all(
            label.map(async (labels) => {
                const descriptions = [];
                for (let i = 1; i <= 3; i++) {
                    const img = await faceapi.fetchImage(
                        `/storage/${labels}/${labels}${i}.jpeg`
                    );
                    const detections = await faceapi
                        .detectSingleFace(img)
                        .withFaceLandmarks()
                        .withFaceDescriptor();
                    if (detections && detections.descriptor) {
                        descriptions.push(detections.descriptor);
                    }
                }
                return new faceapi.LabeledFaceDescriptors(labels, descriptions);
            })
        );
    };

    const staterMotor = async () => {
        try {
            const response = await fetch("/sent-mqtt", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {
            console.error("Error posting data:", error);
        }
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

            {menu == "kontrol" && (
                <div
                    className={`${
                        menu == "kontrol" ? "translate-x-0" : "translate-x-full"
                    } transition-all duration-300 ease-in-out `}
                >
                    <div className="overflow-y-auto">
                        <div className="bg-white/50 backdrop-blur-md py-2 px-4 flex justify-between items-center rounded-md my-3">
                            {prediksi ? (
                                <>
                                    {screenshot != null && (
                                        <div className="mt-4">
                                            <h3 className="text-center">
                                                Captured Image:
                                            </h3>
                                            <img
                                                src={screenshot}
                                                alt="Screenshot"
                                                className="mt-2"
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div>
                                    <Webcam
                                        audio={false}
                                        height={280}
                                        width={640}
                                        videoConstraints={videoConstraints}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                    />
                                </div>
                            )}
                        </div>
                        {prediksi ? (
                            <>
                                {datawajah.status_kenal ? (
                                    <>
                                        <p className="text-white text-sm">
                                            Silahkan Menyalakan Motor Selama{" "}
                                            {countdown} detik. Jika waktu telah
                                            habis anda perlu melakukan foto
                                            ulang
                                        </p>

                                        <div>
                                            <p className="text-red-500 capitalize">
                                                {datawajah.nama}
                                            </p>
                                            <button
                                                onClick={staterMotor}
                                                className="text-center text-red-500 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500 py-2 px-4 active:scale-105 cursor-pointer justify-center"
                                            >
                                                Stater Motor
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-white my-3 py-2 px-3 text-red-500">
                                        <p className="text-red-500 capitalize font-bold">
                                            {datawajah.nama}
                                        </p>
                                        <p className="text-xs">
                                            Hasil prediksi menyatakan anda tidak
                                            terdaftar sebagai pengguna
                                            kendaraan. anda tidak bisa
                                            menyalakan stater motor
                                        </p>
                                        <button
                                            onClick={prediksiUlang}
                                            className="text-center bg-white  dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500 text-red-500 py-2 px-4 active:scale-105 cursor-pointer justify-center"
                                        >
                                            Ambil ulang gambar
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={capture}
                                    className="text-center bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500 text-red-500 py-2 px-4 active:scale-105 cursor-pointer justify-center"
                                >
                                    Take Picture For Prediction
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
