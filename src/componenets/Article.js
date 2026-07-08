import { Link } from "react-router";


function Article({src, title, subtitle}) {



  return (
    <div className="article">
     <a href="#" className="image">
        <img src={`${src}`} />
      </a>
      <p className="subtitle">{subtitle}</p>
      <h2>
        <Link to="/">
          {title}
        </Link>
      </h2>
    </div>
  );

  
}

export default Article;