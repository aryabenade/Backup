// //app/profile/orders/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { fetchGroomingBookingsForUser, updateGroomingBookingStatus, deleteGroomingBooking } from "@/app/services/grooming/groomingBooking";
import { fetchVetBookingsForUser, updateVetBookingStatus, deleteVetBooking } from "@/app/services/vet/vetBooking";
import { fetchTrainingBookingsForUser, updateTrainingBookingStatus, deleteTrainingBooking } from "@/app/services/training/trainingBooking";
import { fetchWalkingBookingsForUser, updateWalkingBookingStatus, deleteWalkingBooking } from "@/app/services/walking/walkingBooking"; // Add walking imports
import { GroomingBookingData, VetBookingData, TrainingBookingData, WalkingBookingData } from "@/app/types";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Popup from "@/app/components/Popup";
import { toast, Toaster } from "react-hot-toast";
import { FaTimes, FaRedoAlt, FaTrashAlt } from "react-icons/fa";

const OrdersPage: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [groomingOrders, setGroomingOrders] = useState<GroomingBookingData[]>([]);
  const [vetOrders, setVetOrders] = useState<VetBookingData[]>([]);
  const [trainingOrders, setTrainingOrders] = useState<TrainingBookingData[]>([]);
  const [walkingOrders, setWalkingOrders] = useState<WalkingBookingData[]>([]); // Add walking state
  const [activeService, setActiveService] = useState("grooming");
  const [activeTab, setActiveTab] = useState("ongoing");
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupAction, setPopupAction] = useState<() => void>(() => {});
  const [loading, setLoading] = useState(true);

  const handleConfirmAction = () => {
    popupAction();
    setIsPopupOpen(false);
  };

  const handleCancelAction = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const loadOrders = async () => {
      try {
        if (activeService === "grooming") {
          const orders = await fetchGroomingBookingsForUser(user.id);
          setGroomingOrders(orders);
        } else if (activeService === "vet") {
          const orders = await fetchVetBookingsForUser(user.id);
          setVetOrders(orders);
        } else if (activeService === "training") {
          const orders = await fetchTrainingBookingsForUser(user.id);
          setTrainingOrders(orders);
        } else if (activeService === "walking") {
          const orders = await fetchWalkingBookingsForUser(user.id);
          setWalkingOrders(orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isLoaded, isSignedIn, user, activeService, router]);

  const handleCancelBooking = async (bookingId: number, service: string) => {
    setPopupMessage("Are you sure you want to cancel this booking?");
    setPopupAction(() => async () => {
      try {
        if (service === "grooming") {
          await updateGroomingBookingStatus(bookingId, "Cancelled");
          setGroomingOrders((prev) => prev.map((o) => (o.id === bookingId ? { ...o, status: "Cancelled" } : o)));
        } else if (service === "vet") {
          await updateVetBookingStatus(bookingId, "Cancelled");
          setVetOrders((prev) => prev.map((o) => (o.id === bookingId ? { ...o, status: "Cancelled" } : o)));
        } else if (service === "training") {
          await updateTrainingBookingStatus(bookingId, "Cancelled");
          setTrainingOrders((prev) => prev.map((o) => (o.id === bookingId ? { ...o, status: "Cancelled" } : o)));
        } else if (service === "walking") {
          await updateWalkingBookingStatus(bookingId, "Cancelled");
          setWalkingOrders((prev) => prev.map((o) => (o.id === bookingId ? { ...o, status: "Cancelled" } : o)));
        }
        toast.success("Booking cancelled successfully!", { position: "bottom-center" });
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error("Failed to cancel booking!", { position: "bottom-center" });
      }
    });
    setIsPopupOpen(true);
  };

  const handleDeleteBooking = async (bookingId: number, service: string) => {
    setPopupMessage("Are you sure you want to delete this booking?");
    setPopupAction(() => async () => {
      try {
        if (service === "grooming") {
          await deleteGroomingBooking(bookingId);
          setGroomingOrders((prev) => prev.filter((o) => o.id !== bookingId));
        } else if (service === "vet") {
          await deleteVetBooking(bookingId);
          setVetOrders((prev) => prev.filter((o) => o.id !== bookingId));
        } else if (service === "training") {
          await deleteTrainingBooking(bookingId);
          setTrainingOrders((prev) => prev.filter((o) => o.id !== bookingId));
        } else if (service === "walking") {
          await deleteWalkingBooking(bookingId);
          setWalkingOrders((prev) => prev.filter((o) => o.id !== bookingId));
        }
        toast.success("Booking deleted successfully!", { position: "bottom-center" });
      } catch (error) {
        console.error("Error deleting booking:", error);
        toast.error("Failed to delete booking!", { position: "bottom-center" });
      }
    });
    setIsPopupOpen(true);
  };

  const handleRepeatOrder = (order: GroomingBookingData | VetBookingData | TrainingBookingData | WalkingBookingData, service: string) => {
    sessionStorage.setItem("repeatOrder", JSON.stringify(order));
    if (service === "grooming") {
      router.push("/services/grooming/form");
    } else if (service === "vet") {
      router.push("/services/vet/form");
    } else if (service === "training") {
      router.push("/services/training/form");
    } else if (service === "walking") {
      router.push("/services/walking/form");
    }
  };

  const renderOrders = (orders: (GroomingBookingData | VetBookingData | TrainingBookingData | WalkingBookingData)[], service: string) => {
    if (orders.length === 0) {
      return (
        <div className="text-center font-semibold mt-10 text-xl text-gray-800">
          No orders found.
        </div>
      );
    }
    return (
      <ul className="space-y-4">
        {orders.map((order) => {
          if (service === "training") {
            const trainingOrder = order as TrainingBookingData;
            const endDate = new Date(trainingOrder.startDate);
            endDate.setMonth(endDate.getMonth() + 1);
            const totalSessions = trainingOrder.sessionsPerWeek * 4;
            const sessionsLeft = totalSessions - trainingOrder.sessionsCompleted;

            return (
              <li key={order.id} className="border p-4 rounded-lg shadow bg-white">
                <p><strong>Package:</strong> {trainingOrder.packageTitle}</p>
                <p><strong>Start Date:</strong> {new Date(trainingOrder.startDate).toDateString()}</p>
                <p><strong>End Date:</strong> {endDate.toDateString()}</p>
                <p><strong>Preferred Days:</strong> {trainingOrder.preferredDays.join(", ")}</p>
                <p><strong>Sessions:</strong> {trainingOrder.sessionsCompleted}/{totalSessions} done, {sessionsLeft} left</p>
                <p><strong>Price:</strong> {trainingOrder.packagePrice}</p>
                <p><strong>Status:</strong> {trainingOrder.status}</p>
                {trainingOrder.status === "Scheduled" || trainingOrder.status === "In Progress" ? (
                  <button
                    onClick={() => handleCancelBooking(trainingOrder.id, service)}
                    className="flex items-center px-4 py-2 bg-red-600 mt-3 text-white rounded-md hover:bg-red-700 transition"
                  >
                    <FaTimes className="mr-2" />
                    Cancel Booking
                  </button>
                ) : (
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => handleRepeatOrder(trainingOrder, service)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      <FaRedoAlt className="mr-2" />
                      Repeat Order
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(trainingOrder.id, service)}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      <FaTrashAlt className="mr-2" />
                      Delete Booking
                    </button>
                  </div>
                )}
              </li>
            );
          } else if (service === "walking") {
            const walkingOrder = order as WalkingBookingData;
            const walksLeft = walkingOrder.totalWalks - walkingOrder.walksCompleted;

            return (
              <li key={order.id} className="border p-4 rounded-lg shadow bg-white">
                <p><strong>Package:</strong> {walkingOrder.packageTitle}</p>
                <p><strong>Start Date:</strong> {new Date(walkingOrder.startDate).toDateString()}</p>
                <p><strong>End Date:</strong> {new Date(walkingOrder.endDate).toDateString()}</p>
                <p><strong>Days of Week:</strong> {walkingOrder.daysOfWeek.join(", ")}</p>
                <p><strong>Walk Duration:</strong> {walkingOrder.walkDuration}</p>
                <p><strong>Walks:</strong> {walkingOrder.walksCompleted}/{walkingOrder.totalWalks} done, {walksLeft} left</p>
                <p><strong>Total Cost:</strong> {walkingOrder.totalCost}</p>
                <p><strong>Status:</strong> {walkingOrder.status}</p>
                {walkingOrder.status === "Scheduled" || walkingOrder.status === "In Progress" ? (
                  <button
                    onClick={() => handleCancelBooking(walkingOrder.id, service)}
                    className="flex items-center px-4 py-2 bg-red-600 mt-3 text-white rounded-md hover:bg-red-700 transition"
                  >
                    <FaTimes className="mr-2" />
                    Cancel Booking
                  </button>
                ) : (
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => handleRepeatOrder(walkingOrder, service)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      <FaRedoAlt className="mr-2" />
                      Repeat Order
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(walkingOrder.id, service)}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      <FaTrashAlt className="mr-2" />
                      Delete Booking
                    </button>
                  </div>
                )}
              </li>
            );
          }
          const nonTrainingOrder = order as GroomingBookingData | VetBookingData;
          return (
            <li key={order.id} className="border p-4 rounded-lg shadow bg-white">
              <p><strong>Package:</strong> {nonTrainingOrder.packageTitle}</p>
              <p><strong>Date:</strong> {new Date(nonTrainingOrder.date).toDateString()}</p>
              <p><strong>Time:</strong> {nonTrainingOrder.timeSlot}</p>
              <p><strong>Price:</strong> {nonTrainingOrder.packagePrice}</p>
              <p><strong>Status:</strong> {nonTrainingOrder.status}</p>
              {nonTrainingOrder.status === "Scheduled" || nonTrainingOrder.status === "In Progress" ? (
                <button
                  onClick={() => handleCancelBooking(nonTrainingOrder.id, service)}
                  className="flex items-center px-4 py-2 bg-red-600 mt-3 text-white rounded-md hover:bg-red-700 transition"
                >
                  <FaTimes className="mr-2" />
                  Cancel Booking
                </button>
              ) : (
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => handleRepeatOrder(nonTrainingOrder, service)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    <FaRedoAlt className="mr-2" />
                    Repeat Order
                  </button>
                  <button
                    onClick={() => handleDeleteBooking(nonTrainingOrder.id, service)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    <FaTrashAlt className="mr-2" />
                    Delete Booking
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const filterOngoingOrders = (orders: (GroomingBookingData | VetBookingData | TrainingBookingData | WalkingBookingData)[]) => {
    return orders.filter((order) => order.status === "Scheduled" || order.status === "In Progress");
  };

  const filterHistoryOrders = (orders: (GroomingBookingData | VetBookingData | TrainingBookingData | WalkingBookingData)[]) => {
    return orders.filter((order) => order.status === "Completed" || order.status === "Cancelled");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Orders</h2>
        <div className="flex space-x-4 border-b mb-4">
          <button
            className={`py-2 px-4 text-xl font-semibold text-gray-800 ${
              activeService === "grooming" ? "border-b-2 border-orange-500 text-orange-500" : ""
            }`}
            onClick={() => setActiveService("grooming")}
          >
            Grooming
          </button>
          <button
            className={`py-2 px-4 text-xl font-semibold text-gray-800 ${
              activeService === "vet" ? "border-b-2 border-orange-500 text-orange-500" : ""
            }`}
            onClick={() => setActiveService("vet")}
          >
            Vet Consultation
          </button>
          <button
            className={`py-2 px-4 text-xl font-semibold text-gray-800 ${
              activeService === "training" ? "border-b-2 border-orange-500 text-orange-500" : ""
            }`}
            onClick={() => setActiveService("training")}
          >
            Training
          </button>
          <button
            className={`py-2 px-4 text-xl font-semibold text-gray-800 ${
              activeService === "walking" ? "border-b-2 border-orange-500 text-orange-500" : ""
            }`}
            onClick={() => setActiveService("walking")}
          >
            Walking
          </button>
        </div>
        <div className="flex space-x-4 border-b mb-4">
          <button
            className={`py-2 px-4 text-lg font-semibold text-gray-800 ${
              activeTab === "ongoing" ? "border-b-2 border-orange-500 text-orange-500" : ""
            }`}
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing
          </button>
          <button
            className={`py-2 px-4 text-lg font-semibold text-gray-800 ${
              activeTab === "history" ? "border-b-2 border-orange-500 text-orange-500" : ""
            }`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>
        {loading || !isLoaded ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <p className="text-2xl font-bold text-gray-800">Loading...</p>
          </div>
        ) : (
          <>
            {activeService === "grooming" && activeTab === "ongoing" && renderOrders(filterOngoingOrders(groomingOrders), "grooming")}
            {activeService === "grooming" && activeTab === "history" && renderOrders(filterHistoryOrders(groomingOrders), "grooming")}
            {activeService === "vet" && activeTab === "ongoing" && renderOrders(filterOngoingOrders(vetOrders), "vet")}
            {activeService === "vet" && activeTab === "history" && renderOrders(filterHistoryOrders(vetOrders), "vet")}
            {activeService === "training" && activeTab === "ongoing" && renderOrders(filterOngoingOrders(trainingOrders), "training")}
            {activeService === "training" && activeTab === "history" && renderOrders(filterHistoryOrders(trainingOrders), "training")}
            {activeService === "walking" && activeTab === "ongoing" && renderOrders(filterOngoingOrders(walkingOrders), "walking")}
            {activeService === "walking" && activeTab === "history" && renderOrders(filterHistoryOrders(walkingOrders), "walking")}
          </>
        )}
        <Popup
          message={popupMessage}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
          isOpen={isPopupOpen}
        />
        <Toaster />
      </div>
    </div>
  );
};

export default OrdersPage;