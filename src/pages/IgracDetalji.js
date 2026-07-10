import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

function IgracDetalji() {
  const { slug } = useParams();

  const [igrac, setIgrac] = useState(null);

  useEffect(() => {
    fetch(
      `https://front3.edukacija.online/backend/wp-json/wp/v2/igraci?slug=${slug}&_embed`
    )
      .then((res) => res.json())
      .then((data) => setIgrac(data[0]));
  }, [slug]);

  if (!igrac) {
    return <p className="container py-5">Učitavanje...</p>;
  }

return (
  <div className="container py-5">
    <Link to="/igraci" className="btn btn-outline-secondary mb-4">
     ← Natrag na igrače
     </Link>
    
    <div className="row align-items-start g-4">
      <div className="col-md-4">
        {igrac._embedded?.["wp:featuredmedia"] && (
          <img
            src={igrac._embedded["wp:featuredmedia"][0].source_url}
            alt={igrac.title.rendered}
            className="img-fluid rounded shadow-sm"
            style={{
              width: "100%",
              maxHeight: "420px",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        )}
      </div>

      <div className="col-md-8">
        <h1 className="mb-4">{igrac.title.rendered}</h1>

        <p>
          <strong>Klub:</strong> {igrac.acf.klub}
        </p>

        <p>
          <strong>Liga:</strong> {igrac.acf.liga}
        </p>

        <p>
          <strong>Država:</strong> {igrac.acf.drzava}
        </p>

        <p>
          <strong>Pozicija:</strong> {igrac.acf.pozicija}
        </p>

        <p>
          <strong>Broj dresa:</strong> {igrac.acf.broj_dresa}
        </p>
      </div>
    </div>

    <div className="mt-5">
      <h2>O igraču</h2>
      <p>{igrac.acf.opis}</p>
    </div>
  </div>
);
}

export default IgracDetalji;