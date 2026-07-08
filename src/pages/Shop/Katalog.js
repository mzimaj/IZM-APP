import React, { useEffect, useState } from 'react'
import KatalogSingle from './KatalogSingle'

function Katalog() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
    .then(res => res.json())
    .then(data => setProducts(data.products))
  }, [])

  console.log(products)

  return (
    <section className="katalog container py-5">
        <div className="row">
          {
            products.map(product => {
              return (
                <KatalogSingle key={product.id} product={product} klasa={"col-md-3"}/>
              )
            })
          }
        </div>
    </section>
  )

}

export default Katalog