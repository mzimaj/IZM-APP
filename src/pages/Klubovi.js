import { useEffect, useState } from "react";
import { Link } from "react-router";

const API_URL =
  "https://front3.edukacija.online/backend/wp-json/wp/v2";

function Klubovi() {
  const [klubovi, setKlubovi] = useState([]);
  const [igraci, setIgraci] = useState([]);
  const [logoMap, setLogoMap] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [greska, setGreska] = useState("");

  useEffect(() => {
    const dohvatiPodatke = async () => {
      try {
        const [kluboviOdgovor, igraciOdgovor] = await Promise.all([
          fetch(`${API_URL}/klubovi?per_page=100`),
          fetch(`${API_URL}/igraci?per_page=100`),
        ]);

        if (!kluboviOdgovor.ok) {
          throw new Error("Nije moguće dohvatiti klubove.");
        }

        if (!igraciOdgovor.ok) {
          throw new Error("Nije moguće dohvatiti igrače.");
        }

        const kluboviData = await kluboviOdgovor.json();
        const igraciData = await igraciOdgovor.json();

        if (!Array.isArray(kluboviData)) {
          throw new Error("Podaci o klubovima nisu ispravni.");
        }

        setKlubovi(kluboviData);
        setIgraci(Array.isArray(igraciData) ? igraciData : []);

        const logoIds = [
          ...new Set(
            kluboviData
              .map((klub) => klub.acf?.logo)
              .filter(Boolean)
              .map(Number)
          ),
        ];

        const logoRezultati = await Promise.all(
          logoIds.map(async (logoId) => {
            try {
              const odgovor = await fetch(
                `${API_URL}/media/${logoId}`
              );

              if (!odgovor.ok) {
                return [logoId, null];
              }

              const logoData = await odgovor.json();

              const logoUrl =
                logoData.media_details?.sizes?.medium?.source_url ||
                logoData.source_url ||
                null;

              return [logoId, logoUrl];
            } catch {
              return [logoId, null];
            }
          })
        );

        setLogoMap(Object.fromEntries(logoRezultati));
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka:", error);
        setGreska(error.message);
      } finally {
        setLoading(false);
      }
    };

    dohvatiPodatke();
  }, []);

  const izvuciKlubId = (vrijednost) => {
    if (Array.isArray(vrijednost)) {
      return Number(vrijednost[0]);
    }

    if (typeof vrijednost === "object" && vrijednost !== null) {
      return Number(vrijednost.ID || vrijednost.id);
    }

    return Number(vrijednost);
  };

  const brojIgracaUKlubu = (klubId) => {
    return igraci.filter((igrac) => {
      const igracKlubId = izvuciKlubId(igrac.acf?.klub);

      return igracKlubId === Number(klubId);
    }).length;
  };

  const tekstBrojaIgraca = (broj) => {
    if (broj === 1) return "1 hrvatski igrač";

    return `${broj} hrvatskih igrača`;
  };

  const filtriraniKlubovi = klubovi.filter((klub) =>
    klub.title?.rendered
      ?.toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  if (loading) {
    return <p className="container py-5">Učitavanje...</p>;
  }

  if (greska) {
    return (
      <main className="container py-5">
        <h1 className="fw-bold mb-3">Došlo je do pogreške</h1>
        <p>{greska}</p>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold mb-2">Klubovi</h1>

        <p className="text-muted mb-0">
          Pregled inozemnih klubova u kojima igraju hrvatski nogometaši.
        </p>
      </div>

      <input
        type="text"
        className="form-control mb-5"
        placeholder="Pretraži klubove..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtriraniKlubovi.length === 0 ? (
        <p>Nema pronađenih klubova.</p>
      ) : (
        <div className="row g-4">
          {filtriraniKlubovi.map((klub) => {
            const logoId = Number(klub.acf?.logo);
            const logoUrl = logoMap[logoId];
            const brojIgraca = brojIgracaUKlubu(klub.id);

            return (
              <div
                className="col-6 col-md-4 col-lg-3"
                key={klub.id}
              >
                <article className="card h-100 shadow-sm border-0 text-center">
                  <div
                    className="d-flex align-items-center justify-content-center p-4"
                    style={{ height: "210px" }}
                  >
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={`Logo kluba ${klub.title.rendered}`}
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <div className="text-muted">
                        Logo nije unesen
                      </div>
                    )}
                  </div>

                  <div className="card-body d-flex flex-column pt-0">
                    <h2 className="h5 fw-bold mb-2">
                      {klub.title.rendered}
                    </h2>

                    <p className="text-muted mb-4">
                      👥 {tekstBrojaIgraca(brojIgraca)}
                    </p>

                    <Link
                      to={`/klubovi/${klub.slug}`}
                      className="btn btn-danger w-100 mt-auto"
                    >
                      Više o klubu
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

export default Klubovi;