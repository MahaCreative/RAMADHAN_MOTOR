import { Head } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative max-w-[390px] max-h-[844px] sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center  bg-dots-lighter bg-gray-900 selection:bg-red-500 selection:text-white py-4 px-4 overflow-x-hidden overflow-y-hidden">
                {/* <div className="relative  sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 bg-dots-lighter bg-gray-900 selection:bg-red-500 selection:text-white py-4 px-4 "> */}
                {children}
            </div>

            <style>{`
                .bg-dots-darker {
                    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E");
                }

                }
            `}</style>
        </>
    );
}
