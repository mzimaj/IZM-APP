import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

function IgracDetalji() {
  const { slug } = useParams();

  const [igrac, setIgrac] = useState(null);
  const [klubovi, setKlubovi] = useState([]);
  const [lige, setLige] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(
        `https://front3.edukacija.online/backend/wp-json/wp/v2/igraci?slug=${slug}&_embed`
      ).then((res) => res.json()),

      fetch(
        "https://front3.edukacija.online/backend/wp-json/wp/v2/klubovi?per_page=100"
      ).then((res) => res.json()),

      fetch(
        "https://front3.edukacija.online/backend/wp-json/wp/v2/lige?per_page=100"
      ).then((res) => res.json()),
    ])
      .then(([igraciData, kluboviData, ligeData]) => {
        setIgrac(igraciData[0] || null);
        setKlubovi(Array.isArray(kluboviData) ? kluboviData : []);
        setLige(Array.isArray(ligeData) ? ligeData : []);
      })
      .catch((error) => {
        console.error("Greška pri dohvaćanju igrača:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

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

  const prikaziVrijednost = (vrijednost, nastavak = "") => {
    return vrijednost ? `${vrijednost}${nastavak}` : "Nije uneseno";
  };

  const formatirajDatum = (datum) => {
  if (!datum) return "Nije uneseno";

  const mjeseci = [
    "siječnja",
    "veljače",
    "ožujka",
    "travnja",
    "svibnja",
    "lipnja",
    "srpnja",
    "kolovoza",
    "rujna",
    "listopada",
    "studenoga",
    "prosinca",
  ];

  const vrijednost = String(datum);

  if (vrijednost.length !== 8) return datum;

  const godina = vrijednost.substring(0, 4);
  const mjesec = parseInt(vrijednost.substring(4, 6), 10);
  const dan = parseInt(vrijednost.substring(6, 8), 10);

  return `${dan}. ${mjeseci[mjesec - 1]} ${godina}.`;
};

  if (loading) {
    return <p className="container py-5">Učitavanje...</p>;
  }

  if (!igrac) {
    return (
      <main className="container py-5">
        <p>Igrač nije pronađen.</p>

        <Link to="/igraci" className="btn btn-outline-secondary">
          ← Natrag na igrače
        </Link>
      </main>
    );
  }

  const acf = igrac.acf || {};

  const fotografija =
    igrac._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return (
    <main className="container py-5">
      <Link to="/igraci" className="btn btn-outline-secondary mb-4">
        ← Natrag na igrače
      </Link>

      <article className="card border-0 shadow overflow-hidden">
        <div className="row g-0">
          <div className="col-lg-5">
            {fotografija ? (
              <img
                src={fotografija}
                alt={igrac.title.rendered}
                className="w-100 h-100"
                style={{
                  minHeight: "540px",
                  objectFit: "cover",
                  objectPosition: "top",
                }}
              />
            ) : (
              <div
                className="bg-light d-flex align-items-center justify-content-center text-muted h-100"
                style={{ minHeight: "540px" }}
              >
                Fotografija nije unesena
              </div>
            )}
          </div>

          <div className="col-lg-7">
            <div className="p-4 p-lg-5">
              <p className="text-danger fw-bold text-uppercase mb-2">
                Profil igrača
              </p>

              <h1 className="display-5 fw-bold mb-4">
                {igrac.title.rendered}
              </h1>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">Klub</small>
                    <strong>🏟 {dohvatiKlub(acf.klub)}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">Liga</small>
                    <strong>🏆 {dohvatiLigu(acf.liga)}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">Država</small>
                    <strong>🌍 {prikaziVrijednost(acf.drzava)}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">Pozicija</small>
                    <strong>⚽ {prikaziVrijednost(acf.pozicija)}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Broj dresa
                    </small>
                    <strong>👕 {prikaziVrijednost(acf.broj_dresa)}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Datum rođenja
                    </small>
                    <strong>📅 {formatirajDatum(acf.datum_rodenja)}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">Visina</small>
                    <strong>
                      📏 {prikaziVrijednost(acf.visina, " cm")}
                    </strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Jača noga
                    </small>
                    <strong>🦶 {prikaziVrijednost(acf.jaca_noga)}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Tržišna vrijednost
                    </small>
                    <strong>
                      💶 {prikaziVrijednost(acf.trzisna_vrijednost)}
                    </strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Ugovor do
                    </small>
                    <strong>📄 {formatirajDatum(acf.ugovor_do)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {acf.biografija && (
        <section className="card border-0 shadow-sm mt-4">
          <div className="card-body p-4 p-lg-5">
            <h2 className="fw-bold mb-3">O igraču</h2>
            <p className="lead mb-0">{acf.biografija}</p>
          </div>
        </section>
      )}
    </main>
  );
}

export default IgracDetalji;