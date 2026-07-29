import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const API = "https://front3.edukacija.online/backend/wp-json/wp/v2";

const MJESECI = [
  "siječnja", "veljače", "ožujka", "travnja", "svibnja", "lipnja",
  "srpnja", "kolovoza", "rujna", "listopada", "studenoga", "prosinca",
];

function formatirajDatum(datum) {
  if (!datum) return "Nije uneseno";

  const vrijednost = String(datum);
  if (vrijednost.length !== 8) return datum;

  const godina = vrijednost.substring(0, 4);
  const mjesec = parseInt(vrijednost.substring(4, 6), 10);
  const dan = parseInt(vrijednost.substring(6, 8), 10);

  return `${dan}. ${MJESECI[mjesec - 1]} ${godina}.`;
}

function prikaziVrijednost(vrijednost, nastavak = "") {
  return vrijednost ? `${vrijednost}${nastavak}` : "Nije uneseno";
}

function prviId(vrijednost) {
  return Array.isArray(vrijednost) ? vrijednost[0] : vrijednost;
}

function InfoBox({ label, icon, value }) {
  return (
    <div className="col-md-6">
      <div className="border rounded p-3 h-100">
        <small className="text-muted d-block mb-1">{label}</small>
        <strong>{icon} {value}</strong>
      </div>
    </div>
  );
}

function IgracDetalji() {
  const { slug } = useParams();

  const [igrac, setIgrac] = useState(null);
  const [klubovi, setKlubovi] = useState([]);
  const [lige, setLige] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/igraci?slug=${slug}&_embed`).then((res) => res.json()),
      fetch(`${API}/klubovi?per_page=100`).then((res) => res.json()),
      fetch(`${API}/lige?per_page=100`).then((res) => res.json()),
    ])
      .then(([igraciData, kluboviData, ligeData]) => {
        setIgrac(igraciData[0] || null);
        setKlubovi(Array.isArray(kluboviData) ? kluboviData : []);
        setLige(Array.isArray(ligeData) ? ligeData : []);
      })
      .catch((error) => console.error("Greška pri dohvaćanju igrača:", error))
      .finally(() => setLoading(false));
  }, [slug]);

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
  const fotografija = igrac._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  const klub = klubovi.find((k) => k.id === Number(prviId(acf.klub)));
  const liga = lige.find((l) => l.id === Number(prviId(acf.liga)));

  const stavke = [
    { label: "Klub", icon: "🏟", value: klub ? klub.title.rendered : "Nije uneseno" },
    { label: "Liga", icon: "🏆", value: liga ? liga.title.rendered : "Nije uneseno" },
    { label: "Nastupi za Hrvatsku", icon: "🇭🇷", value: acf.nastupi_za_hrvatsku ?? 0 },
    { label: "Pozicija", icon: "⚽", value: prikaziVrijednost(acf.pozicija) },
    { label: "Broj dresa", icon: "👕", value: prikaziVrijednost(acf.broj_dresa) },
    { label: "Datum rođenja", icon: "📅", value: formatirajDatum(acf.datum_rodenja) },
    { label: "Visina", icon: "📏", value: prikaziVrijednost(acf.visina, " cm") },
    { label: "Jača noga", icon: "🦶", value: prikaziVrijednost(acf.jaca_noga) },
    { label: "Tržišna vrijednost", icon: "💶", value: prikaziVrijednost(acf.trzisna_vrijednost) },
    { label: "Ugovor do", icon: "📄", value: formatirajDatum(acf.ugovor_do) },
  ];

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
                style={{ minHeight: "540px", objectFit: "cover", objectPosition: "top" }}
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
              <p className="text-danger fw-bold text-uppercase mb-2">Profil igrača</p>
              <h1 className="display-5 fw-bold mb-4">{igrac.title.rendered}</h1>

              <div className="row g-3">
                {stavke.map((stavka) => (
                  <InfoBox key={stavka.label} {...stavka} />
                ))}
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