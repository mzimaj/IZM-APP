import React, { useEffect, useState } from "react";
import { useParams } from "react-router";


function ProductTest() {
  
    const { id } = useParams();
    const [proizvod, setProizvod] = useState(null);

    useEffect(() => {
        fetch("https://dummyjson.com/products/" + id)
        .then(rezultat => rezultat.json())
        .then(podaci => setProizvod(podaci))
    }, [id])
    
    if(!proizvod) {
        return(
            <p></p>
        )
    }

  return (
    <section className="single-product">
      <div className="container py-5">
        <div className="row g-5 align-items-start">
          <div className="col-lg-6">
            <div className="position-relative">
              <img
                src={proizvod?.images?.[0] || "https://placehold.co/600x600" }
                className="img-fluid"
                alt="White Printed Shirt"
              />
            </div>

            <div className="row row-cols-4 g-3 mt-1">
              <div className="col">
                <img
                  src="https://placehold.co/160x160"
                  className="img-fluid"
                  alt="Product thumbnail 1"
                />
              </div>
              <div className="col">
                <img
                  src="https://placehold.co/160x160"
                  className="img-fluid"
                  alt="Product thumbnail 2"
                />
              </div>
              <div className="col">
                <img
                  src="https://placehold.co/160x160"
                  className="img-fluid"
                  alt="Product thumbnail 3"
                />
              </div>
              <div className="col">
                <img
                  src="https://placehold.co/160x160"
                  className="img-fluid"
                  alt="Product thumbnail 4"
                />
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h1 className="h3 mb-0">{proizvod.title}</h1>
              <span className="badge rounded-pill text-bg-danger px-3 py-2">
                SALE
              </span>
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="display-6 fw-semibold mb-0 lh-1">
                €{proizvod.price}
              </span>
              <del className="text-muted">€{proizvod.price}</del>
            </div>

            <div className="d-flex align-items-center gap-2 mb-4">
              <span className="text-warning small">
                {proizvod.rating}
              </span>
              <small className="text-muted">
                (length reviews)
              </small>
            </div>

            <p className="text-muted mb-4">description</p>

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
           
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center"
                  value="number"
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                >
                  +
                </button>
              </div>

              <button className="btn btn-dark px-4 text-uppercase">
                Add to cart
              </button>
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
                <span className="text-muted">category</span>
              </p>

              <p className="mb-0">
                <span className="fw-semibold d-block mb-1">Tags</span>
                <span className="text-muted">
                  tags
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <ul className="nav nav-tabs" id="productTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
        
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
                className="nav-link"
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
                className="nav-link"
                id="reviews-tab"
                data-bs-toggle="tab"
                data-bs-target="#reviews"
                type="button"
                role="tab"
              >
                Reviews (length)
              </button>
            </li>
          </ul>

          <div
            className="tab-content border border-top-0 p-4"
            id="productTabsContent"
          >
            <div
              className="tab-pane fade show active"
              id="description"
              role="tabpanel"
              aria-labelledby="description-tab"
            >
              <p className="text-muted mb-0 small">description</p>
            </div>

            <div
              className="tab-pane fade"
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
              className="tab-pane fade"
              id="reviews"
              role="tabpanel"
              aria-labelledby="reviews-tab"
            >
            
                  <div className="card p-3 mb-2">
                    <h4 className="card-title">name</h4>
                    <p className="card-text">comment</p>
                    <span className="text-warning">
                      Rating: rating
                    </span>
                    <span className="text-muted">
                      date
                    </span>
                  </div>
             
         
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="h4 mb-4">Related Products</h2>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            {/* <KatalogSingle />
            <KatalogSingle />
            <KatalogSingle />
            <KatalogSingle /> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductTest;