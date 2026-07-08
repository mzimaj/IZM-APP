import React, { useEffect, useState } from "react";
import { data, useParams } from "react-router";
import KatalogSingle from "./KatalogSingle";

import { ToastContainer, toast, Zoom } from "react-toastify";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import "swiper/css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

library.add(fas, far);

function Product() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [productNumber, setProductNumber] = useState(1);
  const [active, setActive] = useState("description");
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setActiveImage(data.images[0]);
      });
  }, [id]);

  useEffect(() => {
    if (!product) return;

    fetch(`https://dummyjson.com/products/category/${product.category}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, [product]);

  console.log(products);

  if (!product) {
    return <p>Loading...</p>;
  }

  const discountedPrice = (
    product.price -
    product.price * (product.discountPercentage / 100)
  ).toFixed(2);

  const renderStars = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FontAwesomeIcon icon="fa-solid fa-star" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FontAwesomeIcon icon="fa-solid fa-star-half-stroke" />);
      } else {
        stars.push(<FontAwesomeIcon icon="fa-regular fa-star" />);
      }
    }

    return stars;
  };

  const notify = () => {
    toast.success("Product added to cart!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Zoom,
    });
    setProductNumber(1);
  };

  return (
    <section className="single-product">
      <div className="container py-5">
        <div className="row g-5 align-items-start">
          <div className="col-lg-6">
            <div className="position-relative">
              <img
                src={activeImage}
                className="img-fluid"
                alt="White Printed Shirt"
              />
            </div>

            <div className="row row-cols-4 g-3 mt-1">
              {product.images.map((image) => {
                return (
                  <div className="col">
                    <img
                      src={image}
                      onClick={() => setActiveImage(image)}
                      className="img-fluid"
                      alt="Product thumbnail 1"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h1 className="h3 mb-0">{product.title}</h1>
              <span className="badge rounded-pill text-bg-danger px-3 py-2">
                SALE
              </span>
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="display-6 fw-semibold mb-0 lh-1">
                €{discountedPrice}
              </span>
              <del className="text-muted">€{product.price}</del>
            </div>

            <div className="d-flex align-items-center gap-2 mb-4">
              <span className="text-warning small">
                {renderStars(product.rating)}
                {product.rating}
              </span>
              <small className="text-muted">
                ({product.reviews.length} reviews)
              </small>
            </div>

            <p className="text-muted mb-4">{product.description}</p>

            <div className="row g-3 mb-3">
              <div className="col-sm-5">
                <select className="form-select">
                  <option selected>Blue</option>
                  <option>White</option>
                  <option>Black</option>
                </select>
              </div>
            </div>

            <div className="d-flex gap-2 align-items-stretch mb-4">
              <div className="input-group">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setProductNumber(productNumber - 1)}
                  disabled={productNumber === 1}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center"
                  value={productNumber}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setProductNumber(productNumber + 1)}
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-dark px-4 text-uppercase"
                onClick={notify}
              >
                Add to cart
              </button>
              <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Zoom}
              />
            </div>

            <hr className="my-4" />

            <div className="d-flex gap-4 small mb-4">
              <a href="#" className="text-decoration-none text-dark">
                ❤ Add to wishlist
              </a>
              <a href="#" className="text-decoration-none text-dark">
                ↗ Share
              </a>
            </div>

            <hr className="my-4" />

            <div className="small">
              <p className="mb-3">
                <span className="fw-semibold d-block mb-1">Category</span>
                <span className="text-muted">{product.category}</span>
              </p>

              <p className="mb-0">
                <span className="fw-semibold d-block mb-1">Tags</span>
                <span className="text-muted">
                  {product.tags.map((tag) => (
                    <span key={tag}>{tag} </span>
                  ))}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <ul className="nav nav-tabs" id="productTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${active === "description" ? "active" : ""}`}
                onClick={() => setActive("description")}
                id="description-tab"
                data-bs-toggle="tab"
                data-bs-target="#description"
                type="button"
                role="tab"
              >
                Description
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${active === "additional" ? "active" : ""}`}
                onClick={() => setActive("additional")}
                id="additional-tab"
                data-bs-toggle="tab"
                data-bs-target="#additional"
                type="button"
                role="tab"
              >
                Additional Information
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${active === "reviews" ? "active" : ""}`}
                onClick={() => setActive("reviews")}
                id="reviews-tab"
                data-bs-toggle="tab"
                data-bs-target="#reviews"
                type="button"
                role="tab"
              >
                Reviews ({product.reviews.length})
              </button>
            </li>
          </ul>

          <div
            className="tab-content border border-top-0 p-4"
            id="productTabsContent"
          >
            <div
              className={`tab-pane fade show ${active === "description" ? "active" : ""}`}
              id="description"
              role="tabpanel"
              aria-labelledby="description-tab"
            >
              <p className="text-muted mb-0 small">{product.description}</p>
            </div>

            <div
              className={`tab-pane fade show ${active === "additional" ? "active" : ""}`}
              id="additional"
              role="tabpanel"
              aria-labelledby="additional-tab"
            >
              <p className="text-muted mb-0 small">
                Material: Cotton. Fit: Regular. Collection: Summer collection.
                Available sizes: S, M, L, XL.
              </p>
            </div>

            <div
              className={`tab-pane fade show ${active === "reviews" ? "active" : ""}`}
              id="reviews"
              role="tabpanel"
              aria-labelledby="reviews-tab"
            >
              {product.reviews.map((review) => {
                return (
                  <div className="card p-3 mb-2" key={review.date}>
                    <h4 className="card-title">{review.reviewerName}</h4>
                    <p className="card-text">{review.comment}</p>
                    <span className="text-warning">
                      Rating: {review.rating}
                    </span>
                    <span className="text-muted">
                      {new Date(review.date).toLocaleString("hr-HR")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="h4 mb-4">Related Products</h2>

          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={50}
            slidesPerView={1}
            breakpoints={{
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              992: { slidesPerView: 4 },
            }}
            loop={true}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {products.map((product) => {
              return (
                <SwiperSlide key={product.id}>
                  <KatalogSingle product={product} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default Product;