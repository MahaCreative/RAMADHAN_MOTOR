import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
export default function KontrolMotor({ menu }) {
    const webcamRef = useRef(null);
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
        setCountdown(60); // Set countdown to 60 seconds
    };
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            clearInterval(timer);
            setPrediksi(false);
        }

        return () => clearInterval(timer);
    }, [countdown]);

    const prediksiUlang = () => {
        setPrediksi(false);
        setCountdown(0);
        setDatawajah({ ...datawajah, status_kenal: false, nama: "" });
    };

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "/models";
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
            await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        };

        loadModels();
    }, []);

    useEffect(() => {
        if (screenshot && prediksi) {
            const img = new Image();
            img.src = screenshot;
            img.onload = async () => {
                const detections = await faceapi
                    .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptors();
                if (detections.length > 0) {
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
                    results.forEach((result, i) => {
                        if (result.label !== "unknown") {
                            setDatawajah({
                                status_kenal: true,
                                nama: result.label,
                            });
                        } else {
                            setDatawajah({ status_kenal: false, nama: "" });
                        }
                    });
                } else {
                    setDatawajah({ status_kenal: false, nama: "" });
                }
            };
        }
    }, [screenshot, prediksi]);

    const loadLabeledImages = async () => {
        const labels = ["Guntur", "Person2"]; // Replace with actual labels
        return Promise.all(
            labels.map(async (label) => {
                const descriptions = [];
                for (let i = 1; i <= 2; i++) {
                    const img = await faceapi.fetchImage(
                        `/labeled_images/${label}/${i}.jpg`
                    );
                    const detections = await faceapi
                        .detectSingleFace(img)
                        .withFaceLandmarks()
                        .withFaceDescriptor();
                    descriptions.push(detections.descriptor);
                }
                return new faceapi.LabeledFaceDescriptors(label, descriptions);
            })
        );
    };

    const staterMotor = () => {
        // Logic for starting motor goes here
        console.log("Motor started");
    };

    return (
        <div
            className={`${
                menu == "kontrol" ? "translate-x-0" : "translate-x-full"
            } transition-all duration-300 ease-in-out -translate-y-28`}
        >
            <div className="max-h-[80vh] overflow-y-auto">
                <div className="bg-white/50 backdrop-blur-md py-2 px-4 flex justify-between items-center rounded-md my-3">
                    {prediksi ? (
                        <>
                            {screenshot && (
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
                                height={480}
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
                        <p className="text-white text-sm">
                            Silahkan Menyalakan Motor Selama {countdown} detik.
                            Jika waktu telah habis anda perlu melakukan foto
                            ulang
                        </p>
                        {datawajah.status_kenal ? (
                            <>
                                <div>
                                    <p className="text-red-500 capitalize">
                                        {datawajah.nama}
                                    </p>
                                    <button
                                        onClick={staterMotor}
                                        className="text-center bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500 text-white py-2 px-4 active:scale-105 cursor-pointer justify-center"
                                    >
                                        Stater Motor
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white my-3 py-2 px-3 text-red-500">
                                <p className="text-xs">
                                    Hasil prediksi menyatakan anda tidak
                                    terdaftar sebagai pengguna kendaraan. anda
                                    tidak bisa menyalakan stater motor
                                </p>
                                <button
                                    onClick={prediksiUlang}
                                    className="text-center bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500 text-white py-2 px-4 active:scale-105 cursor-pointer justify-center"
                                >
                                    Ambil ulang gambar
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <button
                        onClick={capture}
                        className="text-center bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500 text-red-500 py-2 px-4 active:scale-105 cursor-pointer justify-center"
                    >
                        Take Picture For Prediction
                    </button>
                )}
            </div>
        </div>
    );
}
