import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(
        `https://front3.edukacija.online/backend/wp-json/wp/v2/posts?_embed&per_page=2&page=${currentPage}`,
      ).then((response) => {
        const totalPages = response.headers.get("X-WP-TotalPages")
        setPageCount(totalPages)
        return response.json()
      }),
      fetch(
        "https://front3.edukacija.online/backend/wp-json/wp/v2/categories",
      ).then((response) => response.json()),
    ]).then(([postData, categoryData]) => {
      setPosts(postData);

      const categories = {};

      categoryData.forEach((category) => {
        categories[category.id] = category.name;
      });

      setCategories(categories);
    });
  }, [currentPage]);

  
  return (
    <div class="container blog pt-5">
      <h1>Blog</h1>
      <div class="articles pt-4 pb-5 mb-4">
        {posts.map((post) => {
          return (
            <div class="box row" key={post.id}>
              <div className="col-lg-3 col-md-5">
                <img
                  src={
                    post?._embedded?.["wp:featuredmedia"]?.[0]?.media_details
                      ?.sizes?.full?.source_url ||
                    "https://placehold.co/600x400/EEE/31343C"
                  }
                  alt=""
                />
              </div>
              <div className="col-lg-9 col-md-7">
                <h2>
                  <Link to={`/blog/${post.slug}`}>{post.title.rendered}</Link>
                </h2>
                <p class="meta">
                  <span class="date">
                    {new Date(post.date).toLocaleDateString("hr-HR")}
                  </span>
                  <span class="categories">
                    {post.categories.map((id) => categories[id])}
                  </span>
                </p>
                <p
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
              </div>
            </div>
          );
        })}
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          nextClassName="page-link"
          onPageChange={(e) => {
            setCurrentPage(e.selected+1)
          }}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          previousClassName="page-link"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          activeLinkClassName="active"
        />
      </div>
    </div>
  );
}

export default Blog;