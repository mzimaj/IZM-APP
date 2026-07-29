import { useEffect, useState } from "react";
import { Link } from "react-router";

const API = "https://front3.edukacija.online/backend/wp-json/wp/v2";

function IgracCard({ igrac, klub, logoUrl }) {
  const fotografija = igrac._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return (
    <div className="col-12 col-lg-6 d-flex">
      <article
  className="card shadow-sm border-0 overflow-hidden d-flex flex-row w-100"
  style={{ height: "240px" }}
>
        {fotografija ? (
          <div className="cfa-player-photo">
            <img
              src={fotografija}
              alt={igrac.title.rendered}
            />
          </div>
        ) : (
          <div className="cfa-player-photo-empty bg-light d-flex align-items-center justify-content-center text-muted text-center p-3">
            Fotografija nije unesena
          </div>
        )}

        <div className="card-body cfa-player-body d-flex flex-column align-items-center justify-content-center text-center flex-grow-1">
          <h2 className="h5 fw-bold">{igrac.title.rendered}</h2>

          {klub && (
            <Link
              to={`/klubovi/${klub.slug}`}
              className="cfa-player-club-link d-flex align-items-center justify-content-center"
              title={`Otvori klub ${klub.title.rendered}`}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`Logo kluba ${klub.title.rendered}`}
                />
              ) : (
                <span className="fs-4">🏟️</span>
              )}
            </Link>
          )}

          <Link
            to={`/igraci/${igrac.slug}`}
            className="btn btn-danger btn-sm w-100 mt-auto"
          >
            Više o igraču
          </Link>
        </div>
      </article>
    </div>
  );
}

function Igraci() {
  const [igraci, setIgraci] = useState([]);
  const [klubovi, setKlubovi] = useState([]);
  const [logotipi, setLogotipi] = useState({});
  const [search, setSearch] = useState("");
  const [prikaziSve, setPrikaziSve] = useState(false);
  const [status, setStatus] = useState({ loading: true, greska: "" });

  useEffect(() => {
    const dohvatiJson = (url, poruka) =>
      fetch(url).then((res) => {
        if (!res.ok) {
          throw new Error(poruka);
        }

        return res.json();
      });

    Promise.all([
      dohvatiJson(
        `${API}/igraci?_embed&per_page=100`,
        "Greška pri dohvaćanju igrača."
      ),
      dohvatiJson(
        `${API}/klubovi?per_page=100`,
        "Greška pri dohvaćanju klubova."
      ),
    ])
      .then(async ([igraciData, kluboviData]) => {
        igraciData.sort((a, b) =>
          a.title.rendered.localeCompare(b.title.rendered, "hr")
        );

        const logoIds = [
          ...new Set(
            kluboviData
              .map((klub) => Number(klub.acf?.logo))
              .filter(Boolean)
          ),
        ];

        const logoZapisi = await Promise.all(
          logoIds.map((id) =>
            fetch(`${API}/media/${id}`)
              .then((res) => (res.ok ? res.json() : null))
              .then((media) => (media ? [id, media.source_url] : null))
          )
        );

        setIgraci(igraciData);
        setKlubovi(kluboviData);
        setLogotipi(Object.fromEntries(logoZapisi.filter(Boolean)));
      })
      .catch((error) => {
        console.error("Greška pri dohvaćanju podataka:", error);
        setStatus({
          loading: false,
          greska: "Podatke trenutno nije moguće učitati.",
        });
      })
      .finally(() => {
        setStatus((stariStatus) => ({
          ...stariStatus,
          loading: false,
        }));
      });
  }, []);

  if (status.loading) {
    return (
      <main className="container py-5">
        <p>Učitavanje igrača...</p>
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

  const filtrirani = igraci.filter((igrac) =>
    igrac.title.rendered
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const prikazani =
    prikaziSve || search
      ? filtrirani
      : filtrirani.slice(0, 6);

  return (
    <main className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold mb-2">Igrači</h1>
        <p className="text-muted mb-0">
          Pregled hrvatskih nogometaša koji igraju u inozemstvu.
        </p>
      </div>

      <input
        type="search"
        className="form-control mb-3"
        placeholder="Pretraži igrače..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="d-flex justify-content-end mb-4">
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => setPrikaziSve(!prikaziSve)}
        >
          {prikaziSve ? "Prikaži manje" : "Prikaži sve igrače"}
        </button>
      </div>

      {prikazani.length === 0 ? (
        <div className="alert alert-light border">
          Nema pronađenih igrača.
        </div>
      ) : (
        <div className="row g-4 align-items-stretch">
          {prikazani.map((igrac) => {
            const klub = klubovi.find(
              (stavka) => stavka.id === Number(igrac.acf?.klub)
            );

            const logoUrl = logotipi[Number(klub?.acf?.logo)];

            return (
              <IgracCard
                key={igrac.id}
                igrac={igrac}
                klub={klub}
                logoUrl={logoUrl}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Igraci;