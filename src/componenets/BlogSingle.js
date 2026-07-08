import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

function BlogSingle() {

  const { slug } = useParams();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`https://front3.edukacija.online/backend/wp-json/wp/v2/posts?_embed&slug=${slug}`)
    .then(response => response.json())
    .then(data => {
      setPost(data[0])
      
    }).finally(() => setLoading(false)) //finnaly ocekuje funkciju u suprotnom se izvrsi prije no ste se data seta
    
    
  },[slug])

  if(loading) {
    return (
      <p>Loading....</p>
    )
  }


  return (
    <div className="container post pt-5">
      <div className="work row">
        <div className="col-lg-8 m-auto">
          <h2>{post.title.rendered}</h2>
          <p className="meta">
            <span className="year">{new Date(post.date).getFullYear()}</span>
            <span className="categories">{post._embedded["wp:term"][0].map((cat) => cat.name).join(", ")}</span>
          </p>
          <div className="full-width">
            <img src={post?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.full?.source_url || "https://placehold.co/600x400/EEE/31343C"} alt=""/>
          </div>
          <div dangerouslySetInnerHTML={{__html: post.content.rendered}} />
        </div>
      </div>
    </div>
  );
}

export default BlogSingle;