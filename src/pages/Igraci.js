import { useEffect, useState } from "react";
import { Link } from "react-router";

function Igraci() {
  const [igraci, setIgraci] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
      fetch("https://front3.edukacija.online/backend/wp-json/wp/v2/igraci?_embed")
      .then((res) => res.json())
      .then((data) => setIgraci(data));
  }, []);

  if (igraci.length === 0) {
    return <p className="container py-5">Učitavanje...</p>;
  }

  return (
    <main className="container py-5">
      <h1>Igrači</h1>
      <input
  type="text"
  className="form-control my-4"
  placeholder="Pretraži igrače..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>      

      <div className="row g-4 mt-2">
        {igraci
        .filter((igrac) =>
          igrac.title.rendered
        .toLowerCase()
        .includes(search.toLowerCase())
      )
      .map((igrac) => (
          <div className="col-md-4" key={igrac.id}>
            <div className="card h-100 shadow-sm border-0">
              
              {igrac._embedded?.["wp:featuredmedia"] && (
              <img
                src={igrac._embedded["wp:featuredmedia"][0].source_url}
                alt={igrac.title.rendered}
                className="card-img-top"
                style={{ height: "320px", objectFit: "cover", objectPosition: "top" }} />
                )}
                
                <div className="card-body">
                <h2 className="h4">{igrac.title.rendered}</h2>
                <p className="mb-1">
                  <strong>🏟 Klub:</strong> {igrac.acf.klub}
                  </p>
                  <p className="mb-1">
                    <strong>🏆 Liga:</strong> {igrac.acf.liga}
                  </p>
                  <p className="mb-1">
                    <strong>🌍 Država:</strong> {igrac.acf.drzava}
                  </p>
                  <p className="mb-1">
                    <strong>⚽ Pozicija:</strong> {igrac.acf.pozicija}
                  </p>
                  <p className="mb-3">
                    <strong>👕 Broj:</strong> {igrac.acf.broj_dresa}
                  </p>
                  <p className="text-muted"> {igrac.acf.opis}

                  </p>
                  <Link to={`/igraci/${igrac.slug}`} className="btn btn-danger mt-2">
                  Više o igraču
                  </Link>
              
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Igraci;