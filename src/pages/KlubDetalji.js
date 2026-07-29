import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const API = "https://front3.edukacija.online/backend/wp-json/wp/v2";

const izvuciId = (vrijednost) => {
  if (Array.isArray(vrijednost)) return Number(vrijednost[0]);
  return Number(vrijednost);
};

const dohvatiSliku = async (vrijednost) => {
  if (!vrijednost) return "";

  if (typeof vrijednost === "string" && vrijednost.startsWith("http")) {
    return vrijednost;
  }

  if (typeof vrijednost === "object") {
    return vrijednost.sizes?.medium || vrijednost.sizes?.large || vrijednost.url || "";
  }

  try {
    const odgovor = await fetch(`${API}/media/${izvuciId(vrijednost)}`);
    if (!odgovor.ok) return "";
    const slika = await odgovor.json();
    return slika.source_url || "";
  } catch (error) {
    console.error("Greška pri dohvaćanju slike:", error);
    return "";
  }
};

const prikaziVrijednost = (vrijednost) =>
  vrijednost || vrijednost === 0 ? vrijednost : "Nije uneseno";

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

function IgracKartica({ igrac }) {
  const fotografija = igrac._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return (
    <div className="col-md-6 col-lg-4">
      <article className="card h-100 shadow-sm border-0 overflow-hidden">
        {fotografija ? (
          <img
            src={fotografija}
            alt={igrac.title.rendered}
            className="card-img-top"
            style={{ height: "320px", objectFit: "cover", objectPosition: "top" }}
          />
        ) : (
          <div
            className="bg-light d-flex align-items-center justify-content-center text-muted"
            style={{ height: "320px" }}
          >
            Fotografija nije unesena
          </div>
        )}

        <div className="card-body d-flex flex-column text-center p-4">
          <h3 className="h4 fw-bold mb-4">{igrac.title.rendered}</h3>

          <Link to={`/igraci/${igrac.slug}`} className="btn btn-danger w-100 mt-auto">
            Više o igraču
          </Link>
        </div>
      </article>
    </div>
  );
}

function KlubDetalji() {
  const { slug } = useParams();

  const [klub, setKlub] = useState(null);
  const [liga, setLiga] = useState(null);
  const [igraci, setIgraci] = useState([]);
  const [logoKluba, setLogoKluba] = useState("");
  const [logoLige, setLogoLige] = useState("");
  const [status, setStatus] = useState({ loading: true, greska: "" });

  useEffect(() => {
    const dohvatiJson = (url, poruka) =>
      fetch(url).then((res) => {
        if (!res.ok) throw new Error(poruka);
        return res.json();
      });

    Promise.all([
      dohvatiJson(`${API}/klubovi?slug=${slug}`, "Nije moguće dohvatiti klub."),
      dohvatiJson(`${API}/lige?per_page=100`, "Nije moguće dohvatiti lige."),
      dohvatiJson(`${API}/igraci?_embed&per_page=100`, "Nije moguće dohvatiti igrače."),
    ])
      .then(async ([kluboviData, ligeData, igraciData]) => {
        const pronadeniKlub = kluboviData[0] || null;
        setKlub(pronadeniKlub);

        if (!pronadeniKlub) return;

        const klubAcf = pronadeniKlub.acf || {};
        const ligaId = izvuciId(klubAcf.liga);

        const pronadenaLiga = Array.isArray(ligeData)
          ? ligeData.find((l) => l.id === ligaId)
          : null;

        setLiga(pronadenaLiga || null);

        const igraciKluba = Array.isArray(igraciData)
          ? igraciData.filter((igrac) => izvuciId(igrac.acf?.klub) === pronadeniKlub.id)
          : [];

        setIgraci(igraciKluba);

        const [klubLogoUrl, ligaLogoUrl] = await Promise.all([
          dohvatiSliku(klubAcf.logo),
          dohvatiSliku(pronadenaLiga?.acf?.logo),
        ]);

        setLogoKluba(klubLogoUrl);
        setLogoLige(ligaLogoUrl);
      })
      .catch((error) => {
        console.error("Greška pri dohvaćanju kluba:", error);
        setStatus({ loading: false, greska: error.message });
        return;
      })
      .finally(() => setStatus((s) => ({ ...s, loading: false })));
  }, [slug]);

  if (status.loading) {
    return <p className="container py-5">Učitavanje...</p>;
  }

  if (status.greska) {
    return (
      <main className="container py-5">
        <h1 className="fw-bold mb-3">Došlo je do pogreške</h1>
        <p>{status.greska}</p>
        <Link to="/klubovi" className="btn btn-outline-secondary">
          ← Natrag na klubove
        </Link>
      </main>
    );
  }

  if (!klub) {
    return (
      <main className="container py-5">
        <p>Klub nije pronađen.</p>
        <Link to="/klubovi" className="btn btn-outline-secondary">
          ← Natrag na klubove
        </Link>
      </main>
    );
  }

  const acf = klub.acf || {};

  const stavke = [
    { label: "Država", icon: "🌍", value: prikaziVrijednost(acf.drzava) },
    { label: "Grad", icon: "🏙️", value: prikaziVrijednost(acf.grad) },
    { label: "Stadion", icon: "🏟️", value: prikaziVrijednost(acf.stadion) },
    { label: "Godina osnutka", icon: "📅", value: prikaziVrijednost(acf.godina_osnutka) },
  ];

  return (
    <main className="container py-5">
      <Link to="/klubovi" className="btn btn-outline-secondary mb-4">
        ← Natrag na klubove
      </Link>

      <article className="card border-0 shadow overflow-hidden">
        <div className="row g-0">
          <div className="col-lg-5">
            <div
              className="bg-light d-flex align-items-center justify-content-center p-5 h-100"
              style={{ minHeight: "520px" }}
            >
              {logoKluba ? (
                <img
                  src={logoKluba}
                  alt={`Logo kluba ${klub.title.rendered}`}
                  style={{ width: "100%", maxWidth: "330px", maxHeight: "330px", objectFit: "contain" }}
                />
              ) : (
                <p className="text-muted mb-0">Logo nije unesen</p>
              )}
            </div>
          </div>

          <div className="col-lg-7">
            <div className="p-4 p-lg-5">
              <p className="text-danger fw-bold text-uppercase mb-2">Profil kluba</p>
              <h1 className="display-5 fw-bold mb-4">{klub.title.rendered}</h1>

              <div className="border rounded p-3 mb-3">
                <small className="text-muted d-block mb-2">Liga</small>

                <div className="d-flex align-items-center gap-3">
                  {logoLige ? (
                    <img
                      src={logoLige}
                      alt={`Logo lige ${liga?.title?.rendered || ""}`}
                      style={{ width: "65px", height: "65px", objectFit: "contain" }}
                    />
                  ) : (
                    <div
                      className="bg-light rounded d-flex align-items-center justify-content-center"
                      style={{ width: "65px", height: "65px" }}
                    >
                      🏆
                    </div>
                  )}

                  <strong className="fs-5">{liga?.title?.rendered || "Nije uneseno"}</strong>
                </div>
              </div>

              <div className="row g-3">
                {stavke.map((stavka) => (
                  <InfoBox key={stavka.label} {...stavka} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      <section className="mt-5">
        <h2 className="fw-bold mb-4">
          Hrvatski igrači koji trenutačno nastupaju za ovaj klub
        </h2>

        {igraci.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <p className="mb-0">Trenutačno nema unesenih hrvatskih igrača za ovaj klub.</p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {igraci.map((igrac) => (
              <IgracKartica key={igrac.id} igrac={igrac} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default KlubDetalji;