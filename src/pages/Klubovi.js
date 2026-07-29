import { useEffect, useState } from "react";
import { Link } from "react-router";

const API = "https://front3.edukacija.online/backend/wp-json/wp/v2";

const izvuciId = (vrijednost) => {
  if (!vrijednost) return null;
  if (Array.isArray(vrijednost)) return Number(vrijednost[0]);
  if (typeof vrijednost === "object") return Number(vrijednost.ID || vrijednost.id);
  return Number(vrijednost);
};

const dohvatiSliku = async (vrijednost) => {
  if (!vrijednost) return "";

  if (typeof vrijednost === "string" && vrijednost.startsWith("http")) {
    return vrijednost;
  }

  if (typeof vrijednost === "object" && !Array.isArray(vrijednost)) {
    return (
      vrijednost.sizes?.medium ||
      vrijednost.sizes?.thumbnail ||
      vrijednost.url ||
      vrijednost.source_url ||
      ""
    );
  }

  const slikaId = izvuciId(vrijednost);
  if (!slikaId) return "";

  try {
    const odgovor = await fetch(`${API}/media/${slikaId}`);
    if (!odgovor.ok) return "";
    const slika = await odgovor.json();
    return slika.source_url || "";
  } catch (error) {
    console.error("Greška pri dohvaćanju slike:", error);
    return "";
  }
};

const sortirajHr = (a, b) =>
  a.title.rendered.localeCompare(b.title.rendered, "hr", { sensitivity: "base" });

async function ucitajLogotipe(stavke) {
  const rezultati = await Promise.all(
    stavke.map(async (stavka) => ({
      id: stavka.id,
      url: await dohvatiSliku(stavka.acf?.logo),
    }))
  );

  return Object.fromEntries(rezultati.map((r) => [r.id, r.url]));
}

function Logo({ src, alt, size, placeholder = "🏟️", className = "", title }) {
  const stil = { width: size, height: size, objectFit: "contain" };

  if (src) {
    return <img src={src} alt={alt} title={title} className={className} style={stil} />;
  }

  return (
    <div
      className={`bg-light rounded d-flex align-items-center justify-content-center ${className}`}
      style={stil}
      title={title}
    >
      {placeholder}
    </div>
  );
}

function KlubKartica({ klub, liga, logoKluba, logoLige }) {
  return (
    <div className="col-sm-6 col-lg-3">
      <Link to={`/klubovi/${klub.slug}`} className="text-decoration-none text-dark">
        <article className="card h-100 border-0 shadow-sm text-center">
          <div className="card-body d-flex flex-column align-items-center p-4">
            <Logo
              src={logoKluba}
              alt={`Logo kluba ${klub.title.rendered}`}
              size="90px"
              className="mb-3"
            />

            <h2 className="h6 fw-bold mb-3">{klub.title.rendered}</h2>

            {liga && (
              <div className="mt-auto">
                {logoLige ? (
                  <img
                    src={logoLige}
                    alt={`Logo lige ${liga.title.rendered}`}
                    title={liga.title.rendered}
                    style={{ width: "45px", height: "45px", objectFit: "contain" }}
                  />
                ) : (
                  <span title={liga.title.rendered}>🏆</span>
                )}
              </div>
            )}
          </div>
        </article>
      </Link>
    </div>
  );
}

function LigaDugme({ liga, logo, aktivna, onClick }) {
  return (
    <div className="col-6 col-sm-4 col-md-3 col-lg">
      <button
        type="button"
        className={`card w-100 h-100 border-0 shadow-sm ${aktivna ? "border border-danger" : ""}`}
        onClick={onClick}
        title={`Prikaži klubove iz lige ${liga.title.rendered}`}
      >
        <div
          className="card-body d-flex align-items-center justify-content-center p-3"
          style={{ minHeight: "110px" }}
        >
          {logo ? (
            <img
              src={logo}
              alt={`Logo lige ${liga.title.rendered}`}
              style={{ width: "70px", height: "70px", objectFit: "contain" }}
            />
          ) : (
            <span className="fs-2">🏆</span>
          )}
        </div>
      </button>
    </div>
  );
}

function Klubovi() {
  const [klubovi, setKlubovi] = useState([]);
  const [lige, setLige] = useState([]);
  const [logotipiKlubova, setLogotipiKlubova] = useState({});
  const [logotipiLiga, setLogotipiLiga] = useState({});
  const [search, setSearch] = useState("");
  const [odabranaLiga, setOdabranaLiga] = useState(null);
  const [prikaziSve, setPrikaziSve] = useState(false);
  const [status, setStatus] = useState({ loading: true, greska: "" });

  useEffect(() => {
    const dohvatiJson = (url, poruka) =>
      fetch(url).then((res) => {
        if (!res.ok) throw new Error(poruka);
        return res.json();
      });

    Promise.all([
      dohvatiJson(`${API}/klubovi?per_page=100`, "Nije moguće dohvatiti klubove."),
      dohvatiJson(`${API}/lige?per_page=100`, "Nije moguće dohvatiti lige."),
    ])
      .then(async ([kluboviData, ligeData]) => {
        const sigurniKlubovi = (Array.isArray(kluboviData) ? kluboviData : []).sort(sortirajHr);
        const sigurneLige = (Array.isArray(ligeData) ? ligeData : []).sort(sortirajHr);

        setKlubovi(sigurniKlubovi);
        setLige(sigurneLige);

        const [logotipiK, logotipiL] = await Promise.all([
          ucitajLogotipe(sigurniKlubovi),
          ucitajLogotipe(sigurneLige),
        ]);

        setLogotipiKlubova(logotipiK);
        setLogotipiLiga(logotipiL);
      })
      .catch((error) => {
        console.error("Greška pri dohvaćanju podataka:", error);
        setStatus({ loading: false, greska: "Podatke trenutno nije moguće učitati." });
        return;
      })
      .finally(() => setStatus((s) => ({ ...s, loading: false })));
  }, []);

  const dohvatiLigu = (ligaId) => lige.find((liga) => liga.id === ligaId);

  const filtriraniKlubovi = klubovi.filter((klub) => {
    const ligaId = izvuciId(klub.acf?.liga);
    const liga = dohvatiLigu(ligaId);
    const pojam = search.trim().toLowerCase();

    const odgovaraPretrazi =
      (klub.title?.rendered || "").toLowerCase().includes(pojam) ||
      (liga?.title?.rendered || "").toLowerCase().includes(pojam) ||
      String(klub.acf?.drzava || "").toLowerCase().includes(pojam);

    const odgovaraLigi = odabranaLiga === null || ligaId === odabranaLiga;

    return odgovaraPretrazi && odgovaraLigi;
  });

  const prikazaniKlubovi =
    prikaziSve || search || odabranaLiga ? filtriraniKlubovi : filtriraniKlubovi.slice(0, 4);

  const odaberiLigu = (ligaId) => {
    if (odabranaLiga === ligaId) {
      setOdabranaLiga(null);
      setPrikaziSve(false);
    } else {
      setOdabranaLiga(ligaId);
      setPrikaziSve(true);
      setSearch("");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prikaziSveKlubove = () => {
    setPrikaziSve(!prikaziSve);
    setOdabranaLiga(null);
  };

  if (status.loading) {
    return (
      <main className="container py-5">
        <p>Učitavanje klubova...</p>
      </main>
    );
  }

  if (status.greska) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger">{status.greska}</div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold mb-2">Klubovi</h1>
        <p className="text-muted mb-0">
          Pregled klubova u kojima nastupaju hrvatski nogometaši. Odaberite klub za više informacija.
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="pretraga-klubova" className="form-label fw-semibold">
          Pretraži klubove
        </label>

        <input
          id="pretraga-klubova"
          type="search"
          className="form-control"
          placeholder="Pretraži klub, ligu ili državu..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setOdabranaLiga(null);
          }}
        />
      </div>

      <div className="d-flex justify-content-end mb-3">
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={prikaziSveKlubove}>
          {prikaziSve ? "Prikaži manje" : "Prikaži sve klubove"}
        </button>
      </div>

      {odabranaLiga && (
        <div className="alert alert-light border d-flex align-items-center justify-content-between">
          <span>
            Prikaz klubova iz lige: <strong>{dohvatiLigu(odabranaLiga)?.title?.rendered}</strong>
          </span>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              setOdabranaLiga(null);
              setPrikaziSve(false);
            }}
          >
            Poništi
          </button>
        </div>
      )}

      {prikazaniKlubovi.length === 0 ? (
        <div className="alert alert-light border">Nema pronađenih klubova.</div>
      ) : (
        <div className="row g-4">
          {prikazaniKlubovi.map((klub) => {
            const ligaId = izvuciId(klub.acf?.liga);
            const liga = dohvatiLigu(ligaId);

            return (
              <KlubKartica
                key={klub.id}
                klub={klub}
                liga={liga}
                logoKluba={logotipiKlubova[klub.id]}
                logoLige={liga ? logotipiLiga[liga.id] : null}
              />
            );
          })}
        </div>
      )}

      <section className="mt-5 pt-2">
        <h2 className="h4 fw-bold mb-4">Lige</h2>

        <div className="row g-3">
          {lige.slice(0, 8).map((liga) => (
            <LigaDugme
              key={liga.id}
              liga={liga}
              logo={logotipiLiga[liga.id]}
              aktivna={odabranaLiga === liga.id}
              onClick={() => odaberiLigu(liga.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Klubovi;