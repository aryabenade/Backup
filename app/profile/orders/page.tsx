
// Path: app/profile/orders/page.tsx
//part 1
'use client';
import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { fetchGroomingBookingsForUser, updateGroomingBookingStatus, deleteGroomingBooking } from '@/app/services/grooming/groomingBooking';
import { fetchVetBookingsForUser, updateVetBookingStatus, deleteVetBooking } from '@/app/services/vet/vetBooking';
import { GroomingBookingData, VetBookingData } from '@/app/types';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Popup from '@/app/components/Popup';
import { toast, Toaster } from 'react-hot-toast';
import { FaTimes, FaRedoAlt, FaTrashAlt } from 'react-icons/fa';


// import { text } from 'stream/consumers';

const OrdersPage: React.FC = () => {
    const { user } = useUser();
    const router = useRouter();
    const [groomingOrders, setGroomingOrders] = useState<GroomingBookingData[]>([]);
    const [vetOrders, setVetOrders] = useState<VetBookingData[]>([]);
    const [activeService, setActiveService] = useState('grooming');
    const [activeTab, setActiveTab] = useState('ongoing');
    const [popupMessage, setPopupMessage] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupAction, setPopupAction] = useState<() => void>(() => {});
    

    // Function to handle confirming popup action
    const handleConfirmAction = () => {
        popupAction();
        setIsPopupOpen(false);
    };

    // Function to handle cancelling popup action
    const handleCancelAction = () => {
        setIsPopupOpen(false);
    };

    

    useEffect(() => {
        const loadOrders = async () => {
            if (!user) return; // Check if user is defined

            try {
                if (activeService === 'grooming') {
                    const orders = await fetchGroomingBookingsForUser(user.id);
                    setGroomingOrders(orders);
                } else if (activeService === 'vet') {
                    const orders = await fetchVetBookingsForUser(user.id);
                    setVetOrders(orders);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        loadOrders();
    }, [user, activeService]);

    useEffect(() => {
        const intervalId = setInterval(async () => {
            const currentTime = new Date();
            const updatedGroomingOrders = await Promise.all(
                groomingOrders.map(async (order) => {
                    const bookingTime = new Date(order.date + ' ' + order.timeSlot);
                    if (currentTime >= bookingTime && order.status === 'Scheduled') {
                        await updateGroomingBookingStatus(order.id, 'In Progress');
                        return { ...order, status: 'In Progress' };
                    } else if (currentTime > bookingTime && order.status === 'In Progress') {
                        await updateGroomingBookingStatus(order.id, 'Completed');
                        return { ...order, status: 'Completed' };
                    }
                    return order;
                })
            );

            const updatedVetOrders = await Promise.all(
                vetOrders.map(async (order) => {
                    const bookingTime = new Date(order.date + ' ' + order.timeSlot);
                    if (currentTime >= bookingTime && order.status === 'Scheduled') {
                        await updateVetBookingStatus(order.id, 'In Progress');
                        return { ...order, status: 'In Progress' };
                    } else if (currentTime > bookingTime && order.status === 'In Progress') {
                        await updateVetBookingStatus(order.id, 'Completed');
                        return { ...order, status: 'Completed' };
                    }
                    return order;
                })
            );

            setGroomingOrders(updatedGroomingOrders);
            setVetOrders(updatedVetOrders);
        }, 60000); // Check every minute

        return () => clearInterval(intervalId);
    }, [groomingOrders, vetOrders]);

    const handleCancelBooking = async (bookingId: number, service: string) => {
        setPopupMessage('Are you sure you want to cancel this booking?');
        setPopupAction(() => async () => {
            try {
                if (service === 'grooming') {
                    await updateGroomingBookingStatus(bookingId, 'Cancelled');
                    setGroomingOrders((prevOrders) =>
                        prevOrders.map((order) =>
                            order.id === bookingId ? { ...order, status: 'Cancelled' } : order
                        )
                    );
                } else if (service === 'vet') {
                    await updateVetBookingStatus(bookingId, 'Cancelled');
                    setVetOrders((prevOrders) =>
                        prevOrders.map((order) =>
                            order.id === bookingId ? { ...order, status: 'Cancelled' } : order
                        )
                    );
                }
                toast.success('Booking cancelled successfully!', {
                    position: 'bottom-center'
                });
            } catch (error) {
                console.error('Error cancelling booking:', error);
                toast.error('Failed to cancel booking!', {
                    position: 'bottom-center'
                });
            }
        });
        setIsPopupOpen(true);
    };
    
    const handleDeleteBooking = async (bookingId: number, service: string) => {
        setPopupMessage('Are you sure you want to delete this booking?');
        setPopupAction(() => async () => {
            try {
                if (service === 'grooming') {
                    await deleteGroomingBooking(bookingId);
                    setGroomingOrders((prevOrders) =>
                        prevOrders.filter((order) => order.id !== bookingId)
                    );
                } else if (service === 'vet') {
                    await deleteVetBooking(bookingId);
                    setVetOrders((prevOrders) =>
                        prevOrders.filter((order) => order.id !== bookingId)
                    );
                }
                toast.success('Booking deleted successfully!', {
                    position: 'bottom-center'
                });
            } catch (error) {
                console.error('Error deleting booking:', error);
                toast.error('Failed to delete booking!', {
                    position: 'bottom-center'
                });
            }
        });
        setIsPopupOpen(true);
    };
    
//part 1 ends here
//part 2
    const handleRepeatOrder = (order: GroomingBookingData | VetBookingData, service: string) => {
        sessionStorage.setItem('repeatOrder', JSON.stringify(order));
        if (service === 'grooming') {
            router.push('/services/grooming/form');
        } else if (service === 'vet') {
            router.push('/services/vet/form');
        }
    };

    const renderOrders = (orders: (GroomingBookingData | VetBookingData)[], service: string) => {
        if (orders.length === 0) {
            return (
                <div className="text-center font-medium mt-10 text-xl">
                    No orders found.
                </div>
            );
        }
        return (
            <ul className="space-y-4">
                {orders.map((order) => (
                    <li key={order.id} className="border p-4 rounded-lg shadow">
                        <p><strong>Package:</strong> {order.packageTitle}</p>
                        <p><strong>Date:</strong> {new Date(order.date).toDateString()}</p>
                        <p><strong>Time:</strong> {order.timeSlot}</p>
                        <p><strong>Price:</strong> {order.packagePrice}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        {order.status === 'Scheduled' || order.status === 'In Progress' ? (
                            <button
                                onClick={() => handleCancelBooking(order.id, service)}
                                className="flex items-center px-4 py-2 bg-red-600 mt-3 text-white rounded-md hover:bg-red-700 transition"
                            >
                                <FaTimes className="mr-2" />
                                Cancel Booking
                            </button>
                        ) : (
                            <div className="flex space-x-2 mt-3">
                                <button
                                    onClick={() => handleRepeatOrder(order, service)}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                >
                                    <FaRedoAlt className="mr-2" />
                                    Repeat Order
                                </button>
                                <button
                                    onClick={() => handleDeleteBooking(order.id, service)}
                                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                >
                                    <FaTrashAlt className="mr-2" />
                                    Delete Booking
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        );
    };
    
    
    
    const filterOngoingOrders = (orders: (GroomingBookingData | VetBookingData)[]) => {
        return orders.filter(order => order.status === 'Scheduled' || order.status === 'In Progress');
    }
    
    const filterHistoryOrders = (orders: (GroomingBookingData | VetBookingData)[]) => {
        return orders.filter(order => order.status === 'Completed' || order.status === 'Cancelled');
    }
    
    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4 min-h-screen">
                <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
    
                {/* Navigation Bar */}
                <div className="flex space-x-4 border-b mb-4">
                    <button
                        className={`py-2 px-4 text-lg font-semibold ${activeService === 'grooming' ? 'border-b-2 border-indigo-500 text-indigo-500' : ''}`}
                        onClick={() => setActiveService('grooming')}
                    >
                        Grooming
                    </button>
                    <button
                        className={`py-2 px-4 text-lg font-semibold ${activeService === 'vet' ? 'border-b-2 border-indigo-500 text-indigo-500' : ''}`}
                        onClick={() => setActiveService('vet')}
                    >
                        Vet Consultation
                    </button>
                </div>
    
                {/* Tabs for Ongoing and History */}
                <div className="flex space-x-4 border-b mb-4">
                    <button
                        className={`py-2 px-4 text-md font-semibold ${activeTab === 'ongoing' ? 'border-b-2 border-indigo-500 text-indigo-500' : ''}`}
                        onClick={() => setActiveTab('ongoing')}
                    >
                        Ongoing
                    </button>
                    <button
                        className={`py-2 px-4 text-md font-semibold ${activeTab === 'history' ? 'border-b-2 border-indigo-500 text-indigo-500' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        History
                    </button>
                </div>
    
                {/* Content based on active service and tab */}
                {activeService === 'grooming' && activeTab === 'ongoing' && renderOrders(filterOngoingOrders(groomingOrders), 'grooming')}
                {activeService === 'grooming' && activeTab === 'history' && renderOrders(filterHistoryOrders(groomingOrders), 'grooming')}
                {activeService === 'vet' && activeTab === 'ongoing' && renderOrders(filterOngoingOrders(vetOrders), 'vet')}
                {activeService === 'vet' && activeTab === 'history' && renderOrders(filterHistoryOrders(vetOrders), 'vet')}
    
                {/* Popup */}
                <Popup
                    message={popupMessage}
                    onConfirm={handleConfirmAction}
                    onCancel={handleCancelAction}
                    isOpen={isPopupOpen}
                />
    
                {/* Toaster */}
                <Toaster />
            </div>
        </div>
    );
    
};

export default OrdersPage;
//part 2 ends here