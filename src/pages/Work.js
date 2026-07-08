import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router";

function Work() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("https://front3.edukacija.online/backend/wp-json/wp/v2/work")
            .then((res) => res.json())
            .then((data) => setPosts(data));
    }, []);

    if (!posts) return <p>Učitavanje</p>;

  return (
    <div className="container pt-5">
      <h1>Works</h1>
    <div className="articles pt-4 pb-5 mb-4">
                {posts.map((post) => {
                    return(
                <div className="work">
                    <div className="row">
                        <div className="col-md-3">
                            <Link to="/blogSingle"><img src="https://front3.edukacija.online/tsuk/img/work1.png" alt="work1" /></Link>
                        </div>
                        <div className="col-md-9">
                            <h2><Link to="/blogSingle">{post.title.rendered}</Link></h2>
                            <p className="meta">
                                <span className="year">{new Date(post.date).toLocaleDateString("hr-HR")}</span>
                                <span className="categories">Design, Pattern</span>
                            </p>
                            <div dangerouslySetInnerHTML={{__html: post.excerpt.rendered}} />
                        </div>
                    </div>
                </div>
                );})}
            </div>
            
    </div>
  )
}

export default Work