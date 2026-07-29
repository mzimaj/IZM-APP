import { useEffect, useState } from "react";
import { Link } from "react-router";

const API = "https://front3.edukacija.online/backend/wp-json/wp/v2";

function Vijesti() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API}/categories?slug=cfa-vijesti`)
      .then((res) => res.json())
      .then((category) => {
        if (!category.length) return;

        fetch(
          `${API}/posts?_embed&categories=${category[0].id}&per_page=100`
        )
          .then((res) => res.json())
          .then(setPosts);
      });
  }, []);

  return (
    <main className="container py-5">
      <h1 className="fw-bold mb-2">Vijesti</h1>

      <p className="text-muted mb-5">
        Najnovije vijesti o hrvatskim nogometašima u inozemstvu.
      </p>

      {posts.map((post) => {
        const image =
          post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

        return (
          <article className="card mb-4" key={post.id}>
            <div className="row g-0">

              {image && (
                <div className="col-md-3">
                  <img
                    src={image}
                    alt={post.title.rendered}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      minHeight: "220px",
                    }}
                  />
                </div>
              )}

              <div className={image ? "col-md-9" : "col-12"}>
                <div className="card-body d-flex flex-column h-100">

                  <small className="text-muted">
                    {new Date(post.date).toLocaleDateString("hr-HR")}
                  </small>

                  <h2
                    className="h4 my-2"
                    dangerouslySetInnerHTML={{
                      __html: post.title.rendered,
                    }}
                  />

                  <div
                    className="mb-3"
                    dangerouslySetInnerHTML={{
                      __html: post.excerpt.rendered,
                    }}
                  />

                  <Link
                    to={`/blog/${post.slug}`}
                    className="btn btn-danger align-self-start mt-auto"
                  >
                    Pročitaj više
                  </Link>

                </div>
              </div>

            </div>
          </article>
        );
      })}

      {posts.length === 0 && <p>Nema objavljenih vijesti.</p>}
    </main>
  );
}

export default Vijesti;