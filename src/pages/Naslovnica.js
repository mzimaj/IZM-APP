import { useEffect, useState } from "react";
import { Link } from "react-router";

function Naslovnica() {
  const [page, setPage] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(
      "https://front3.edukacija.online/backend/wp-json/wp/v2/pages?slug=naslovnica-3"
    )
      .then((res) => res.json())
      .then((data) => setPage(data[0]));
  }, []);

  useEffect(() => {
    fetch(
      "https://front3.edukacija.online/backend/wp-json/wp/v2/categories?slug=cfa-vijesti"
    )
      .then((res) => res.json())
      .then((categories) => {
        if (categories.length === 0) return;

        const categoryId = categories[0].id;

        fetch(
          `https://front3.edukacija.online/backend/wp-json/wp/v2/posts?_embed&categories=${categoryId}&per_page=5`
        )
          .then((res) => res.json())
          .then((data) => setPosts(data));
      });
  }, []);

  if (!page) return <p>Učitavanje</p>;

const pageParts = page.content.rendered.split(
  "<!-- CFA_REACT_VIJESTI -->"
);

return (
  <>
    <div
      dangerouslySetInnerHTML={{
        __html: pageParts[0],
      }}
    />

    <section className="container py-5" id="cfa-react-vijesti">
        <h2 className="mb-4">Najnovije CFA vijesti</h2>

        <div className="row g-4">
          {posts.map((post) => {
            const image =
              post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

            return (
              <div className="col-md-6 col-lg-4" key={post.id}>
                <article className="card h-100">
                  {image && (
                    <img
                      src={image}
                      className="card-img-top"
                      alt={post.title.rendered}
                    />
                  )}

                  <div className="card-body">
                    <small className="text-muted">
                      {new Date(post.date).toLocaleDateString("hr-HR")}
                    </small>

                    <h3
                      className="h5 mt-2"
                      dangerouslySetInnerHTML={{
                        __html: post.title.rendered,
                      }}
                    />

                    <div
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt.rendered,
                      }}
                    />

                    <Link
                      to={`/blog/${post.slug}`}
                      className="btn btn-dark"
                    >
                      Pročitaj više
                    </Link>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
          </section>

      <div
        dangerouslySetInnerHTML={{
          __html: pageParts[1] || "",
        }}
      />
    </>
  );
}

export default Naslovnica;