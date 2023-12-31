import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/manageTours.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SideNav from "../header/SideNav";

function ManageBookings() {
  const user = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(false);
  const [userName, setUserName] = useState("");
  const base_url = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${base_url}/api/v1/booking`);
        setBookings(response.data.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTourNames = async () => {
      try {
        if (bookings.length === 0) {
          // No reviews available, return early
          return;
        }

        const userIds = bookings.map((booking) => booking.userId);
        const requests = userIds.map((userId) =>
          fetch(`${base_url}/api/v1/users/${userId}`)
        );
        const responses = await Promise.all(requests);

        const users = await Promise.all(
          responses.map((response) => response.json())
        );
        console.log(users);

        const userNames = users.map((user) => user?.data?.data?.name);
        console.log("userNames", userNames);
        setUserName(userNames);
      } catch (error) {
        console.error(error);
        // Handle error case
      }
    };

    fetchTourNames();
  }, [bookings]);

  const handleDeleteBooking = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this booking? This action cannot be undone."
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`${base_url}/api/v1/booking/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Booking has been canceled");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="main1">
      <div className="user-view">
        <SideNav
          isAdmin={user.role === "admin" || user.role === "lead-guide"}
        />
        <div className="user-view__content">
          <div className="event-schedule-area-two bg-color pad100">
            <div className="container">
              <h1 className="h1-title">Tour Bookings</h1>
              <div className="row">
                <div className="col-lg-12">
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade active show"
                      id="home"
                      role="tabpanel"
                    >
                      {bookings.length > 0 && (
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  User Name
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Tour Name
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Start Date
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Members
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Total Price
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Cancel Booking
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {bookings.map((booking, index) => (
                                <tr key={booking._id} className="inner-box">
                                  <td>
                                    <div className="text-user">
                                      {userName[index]}
                                    </div>
                                  </td>
                                  <th scope="row">
                                    <div className="text-user">
                                      {booking.tourName}
                                    </div>
                                  </th>
                                  <td>
                                    <div className="text-user">
                                      {new Date(
                                        booking.startDate
                                      ).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-user">
                                      {booking.members}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-user">
                                      {booking.totalPrice}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="event-wrap">
                                      <button
                                        className="btn btn--small btn--red "
                                        type="button"
                                        onClick={() =>
                                          handleDeleteBooking(booking._id)
                                        }
                                      >
                                        Cancel Booking
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {bookings.length === 0 && (
                        <p className="no-data">There are no tour bookings.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ManageBookings;
