import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";
import icons from "../images/icons.svg";
import { useSelector } from "react-redux";

// Import the entire 'tours' folder using require.context
function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const tourImages = importAll(require.context("../images/tours"));

function Home() {
  const base_url = process.env.REACT_APP_BASE_URL;
  const userData = useSelector((state) => state.user);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `${base_url}/api/v1/tours`;

        // Check if the URL should be changed to "top-6-cheap"
        if (window.location.href.includes("top-6-cheap")) {
          url = `${base_url}/api/v1/tours/top-6-cheap`;
        }
        const response = await axios.get(url);
        setTours(response.data.data.data);
        // Set loading to false when data is fetched
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="text-center" style={{ margin: "5rem" }}>
          <h1 className="sr-only">
            Please wait tours are loading &nbsp;
            <div
              className="spinner-border text-success"
              style={{ height: "3rem", width: "3rem" }}
              role="status"
            ></div>
          </h1>
          <p style={{ fontSize: "2rem" }}>
            Your patience is greatly appreciated as we initiate our backend
            server on the render.com platform. <br /> It might take a brief
            moment for it to be up and running. Thank you for your
            understanding.
          </p>
        </div>
      ) : (
        <main className="main">
          <div className="card-container">
            {tours.map((tour) => (
              <div key={tour.id} className="card">
                <div className="card__header">
                  <div className="card__picture">
                    <div className="card__picture-overlay">&nbsp;</div>
                    <img
                      className="card__picture-img-cover"
                      key={tour.id}
                      src={tourImages[`${tour.imageCover}`]}
                      alt={`${tour.name}`}
                    />
                  </div>
                  <h3 className="card__title heading-tertirary">
                    <span>{tour.name}</span>
                  </h3>
                </div>
                <div className="card__details">
                  <h4 className="card__sub-heading">{`Travel ${tour.duration} days | ${tour.locations.length}-cites`}</h4>
                  <p className="card__text">{tour.summary}</p>
                  <div className="card__data">
                    <svg className="card__icon">
                      <use xlinkHref={`${icons}#icon-map-pin`}></use>
                    </svg>
                    <span>{tour.startLocation.description}</span>
                  </div>
                  <div className="card__data">
                    <svg className="card__icon">
                      <use xlinkHref={`${icons}#icon-calendar`}></use>
                    </svg>
                    <span>
                      {tour && tour.startDates && (
                        <span>
                          {tour.startDates
                            .map((startDate) => new Date(startDate))
                            .filter((date) => date >= new Date())
                            .sort((a, b) => a - b)
                            .map((date) =>
                              date.toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                              })
                            )[0] || "Dates Not Available"}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="card__data">
                    <svg className="card__icon">
                      <use xlinkHref={`${icons}#icon-flag`}></use>
                    </svg>
                    <span>{`${tour.locations.length} stops`}</span>
                  </div>
                  <div className="card__data">
                    <svg className="card__icon">
                      <use xlinkHref={`${icons}#icon-user`}></use>
                    </svg>
                    <span>{`${tour.maxGroupSize} people`}</span>
                  </div>
                </div>
                {userData &&
                (userData.role === "admin" ||
                  userData.role === "lead-guide") ? (
                  <div className="card__footer">
                    <div className="row">
                      <div className="col-md-12">
                        <span className="card__footer-value">{`₹${tour.price}`}</span>
                        <span className="card__footer-text"> per person</span>
                      </div>
                      <div className="col-md-12 card__ratings">
                        <span className="card__footer-value">
                          {tour.ratingsAverage}
                        </span>
                        <span className="card__footer-text">{` rating (${tour.ratingsQuantity})`}</span>
                      </div>
                    </div>
                    <div className="row" style={{ alignItems: "center" }}>
                      <div className="col-md-12">
                        <a
                          className="btn btn--green btn--small"
                          // href={`/tour/${tour.slug}`}
                          href={`/tour-details/${tour.id}`}
                        >
                          Details
                        </a>
                      </div>
                      <div className="col-md-12">
                        {((userData && userData.role === "admin") ||
                          "lead-guide") && (
                          <div className="vertical-button">
                            <a
                              className="btn btn--yellow btn--small"
                              // href={`/tour/${tour.slug}`}
                              href={`/tour-update/${tour.id}`}
                            >
                              Update
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card__footer">
                    <p>
                      <span className="card__footer-value">{`₹${tour.price}`}</span>
                      <span className="card__footer-text"> per person</span>
                    </p>
                    <p className="card__ratings">
                      <span className="card__footer-value">
                        {tour.ratingsAverage}
                      </span>
                      <span className="card__footer-text">{` rating (${tour.ratingsQuantity})`}</span>
                    </p>
                    <a
                      className="btn btn--green btn--small"
                      // href={`/tour/${tour.slug}`}
                      href={`/tour-details/${tour.id}`}
                    >
                      Details
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      )}
    </>
  );
}

export default Home;
