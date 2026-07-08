import React from 'react'
import { Link } from 'react-router'

function KatalogSingle({product, klasa = ""}) {



  return (
    <div className={`${klasa} stil-1`}>
        <div className="article">
            <Link to={`/proizvod/${product.id}`} className="image">
                <img src={product.thumbnail} alt={product.title} />
            </Link>
            <p className="subtitle">{product.title}</p>
            <h2>
                <Link to={"/proizvod/" + product.id}>
                    {product.description}
                </Link>
            </h2>
            <a href="#" className="btn btn-default d-block mt-3 mb-5">Dodaj u košaricu</a>
        </div>
    </div>
  )

}

export default KatalogSingle