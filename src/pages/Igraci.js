import { useEffect, useState } from "react";
import { Link } from "react-router";

function Igraci() {
  const [igraci, setIgraci] = useState([]);
  const [klubovi, setKlubovi] = useState([]);
  const [lige, setLige] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(
        "https://front3.edukacija.online/backend/wp-json/wp/v2/igraci?_embed&per_page=100"
      ).then((res) => res.json()),

      fetch(
        "https://front3.edukacija.online/backend/wp-json/wp/v2/klubovi?per_page=100"
      ).then((res) => res.json()),

      fetch(
        "https://front3.edukacija.online/backend/wp-json/wp/v2/lige?per_page=100"
      ).then((res) => res.json()),
    ])
      .then(([igraciData, kluboviData, ligeData]) => {
        setIgraci(Array.isArray(igraciData) ? igraciData : []);
        setKlubovi(Array.isArray(kluboviData) ? kluboviData : []);
        setLige(Array.isArray(ligeData) ? ligeData : []);
      })
      .catch((error) => {
        console.error("Greška pri dohvaćanju podataka:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const dohvatiKlub = (klubVrijednost) => {
    const klubId = Array.isArray(klubVrijednost)
      ? klubVrijednost[0]
      : klubVrijednost;

    const klub = klubovi.find((k) => k.id === Number(klubId));

    return klub ? klub.title.rendered : "Nije uneseno";
  };

  const dohvatiLigu = (ligaVrijednost) => {
    const ligaId = Array.isArray(ligaVrijednost)
      ? ligaVrijednost[0]
      : ligaVrijednost;

    const liga = lige.find((l) => l.id === Number(ligaId));

    return liga ? liga.title.rendered : "Nije uneseno";
  };

  const prikaziVrijednost = (vrijednost) => {
    return vrijednost || "Nije uneseno";
  };

  const filtriraniIgraci = igraci.filter((igrac) =>
    igrac.title?.rendered
      ?.toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  if (loading) {
    return <p className="container py-5">Učitavanje...</p>;
  }

  return (
    <main className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold mb-2">Igrači</h1>
        <p className="text-muted mb-0">
          Pregled hrvatskih nogometaša koji igraju u inozemstvu.
        </p>
      </div>

      <input
        type="text"
        className="form-control mb-5"
        placeholder="Pretraži igrače..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtriraniIgraci.length === 0 ? (
        <p>Nema pronađenih igrača.</p>
      ) : (
        <div className="row g-4">
          {filtriraniIgraci.map((igrac) => {
            const acf = igrac.acf || {};

            const fotografija =
              igrac._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

            return (
              <div
                className="col-md-6 col-lg-4"
                key={igrac.id}
              >
                <article className="card h-100 shadow-sm border-0 overflow-hidden">
                  {fotografija ? (
                    <img
                      src={fotografija}
                      alt={igrac.title.rendered}
                      className="card-img-top"
                      style={{
                        height: "360px",
                        objectFit: "cover",
                        objectPosition: "top",
                      }}
                    />
                  ) : (
                    <div
                      className="bg-light d-flex align-items-center justify-content-center text-muted"
                      style={{ height: "360px" }}
                    >
                      Fotografija nije unesena
                    </div>
                  )}

                  <div className="card-body d-flex flex-column p-4">
                    <h2 className="h4 fw-bold mb-3">
                      {igrac.title.rendered}
                    </h2>

                    <p className="mb-2">
                      <strong>🏟 Klub:</strong>{" "}
                      {dohvatiKlub(acf.klub)}
                    </p>

                    <p className="mb-2">
                      <strong>🏆 Liga:</strong>{" "}
                      {dohvatiLigu(acf.liga)}
                    </p>

                    <p className="mb-2">
                      <strong>🌍 Država:</strong>{" "}
                      {prikaziVrijednost(acf.drzava)}
                    </p>

                    <p className="mb-2">
                      <strong>⚽ Pozicija:</strong>{" "}
                      {prikaziVrijednost(acf.pozicija)}
                    </p>

                    <p className="mb-4">
                      <strong>👕 Broj dresa:</strong>{" "}
                      {prikaziVrijednost(acf.broj_dresa)}
                    </p>

                    <Link
                      to={`/igraci/${igrac.slug}`}
                      className="btn btn-danger w-100 mt-auto"
                    >
                      Više o igraču
                    </Link>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Igraci;