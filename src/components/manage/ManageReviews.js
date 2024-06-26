import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/manageTours.css";
import { useSelector } from "react-redux";
import SideNav from "../header/SideNav";

function ManageReviews() {
  const user = useSelector((state) => state.user);
  const [reviewData, setReviewData] = useState([]);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const base_url = process.env.REACT_APP_BASE_URL;

  // Define the number of reviews per page
  const reviewsPerPage = 6;

  // Calculate the index of the last review and the index of the first review on the current page
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;

  // Get the reviews to display on the current page
  const currentReviews = reviewData.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  // Handle page navigation
  const goToPreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${base_url}/api/v1/reviews`);
      console.log("response: ", response);
      setReviewData(response.data.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete review? This action cannot be undone."
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`${base_url}/api/v1/reviews/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Review has been deleted");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (error) {
    return (
      <div className="text-center" style={{ margin: "5rem", fontSize: "2rem" }}>
        Error loading tour data. Please try again later.
      </div>
    );
  }

  return (
    <main className="main1">
      <div className="user-view">
        <SideNav
          isAdmin={user.role === "admin" || user.role === "lead-guide"}
        />
        <div className="user-view__content">
          <div className="event-schedule-area-two bg-color pad100">
            <div className="container">
              <h1 className="h1-title">Manage Reviews</h1>
              <div className="row">
                <div className="col-lg-12">
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade active show"
                      id="home"
                      role="tabpanel"
                    >
                      {reviewData.length > 0 && (
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Name
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Tour
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Review
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Ratings
                                </th>
                                <th
                                  className="text-center title-list"
                                  scope="col"
                                >
                                  Delete Review
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentReviews.map((review, index) => (
                                <tr key={review._id} className="inner-box">
                                  <td scope="row">
                                    <div className="text-user">
                                      {review.user.name}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-user">
                                      {review.tour.name}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-user">
                                      {review.review}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-user">
                                      {review.rating}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="event-wrap">
                                      <button
                                        className="btn btn--small btn--red "
                                        type="button"
                                        onClick={() =>
                                          handleDeleteUser(review._id)
                                        }
                                      >
                                        Delete Review
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <br />
                          <div className="pagination">
                            <button
                              className="btn btn--small"
                              onClick={goToPreviousPage}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </button>
                            <button
                              className="btn btn--small"
                              onClick={goToNextPage}
                              disabled={indexOfLastReview >= reviewData.length}
                            >
                              Next
                            </button>
                          </div>
                          <div className="btn btn--small disabled">
                            Total Reviews: {reviewData.length}
                          </div>
                        </div>
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

export default ManageReviews;
