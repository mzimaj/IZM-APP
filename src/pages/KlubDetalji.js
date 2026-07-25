import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const API_URL =
  "https://front3.edukacija.online/backend/wp-json/wp/v2";

function KlubDetalji() {
  const { slug } = useParams();

  const [klub, setKlub] = useState(null);
  const [liga, setLiga] = useState(null);
  const [igraci, setIgraci] = useState([]);
  const [logoKluba, setLogoKluba] = useState("");
  const [logoLige, setLogoLige] = useState("");
  const [loading, setLoading] = useState(true);
  const [greska, setGreska] = useState("");

  useEffect(() => {
    const dohvatiPodatke = async () => {
      try {
        setLoading(true);
        setGreska("");

        const [klubOdgovor, ligeOdgovor, igraciOdgovor] =
          await Promise.all([
            fetch(`${API_URL}/klubovi?slug=${slug}`),
            fetch(`${API_URL}/lige?per_page=100`),
            fetch(`${API_URL}/igraci?_embed&per_page=100`)
          ]);

        if (!klubOdgovor.ok) {
          throw new Error("Nije moguće dohvatiti klub.");
        }

        if (!ligeOdgovor.ok) {
          throw new Error("Nije moguće dohvatiti ligu.");
        }

        if (!igraciOdgovor.ok) {
          throw new Error("Nije moguće dohvatiti igrače.");
        }

        const kluboviData = await klubOdgovor.json();
        const ligeData = await ligeOdgovor.json();
        const igraciData = await igraciOdgovor.json();

        const pronadeniKlub = Array.isArray(kluboviData)
          ? kluboviData[0]
          : null;

        if (!pronadeniKlub) {
          setKlub(null);
          return;
        }

        setKlub(pronadeniKlub);

        const klubAcf = pronadeniKlub.acf || {};

        const ligaId = izvuciId(klubAcf.liga);

        const pronadenaLiga = Array.isArray(ligeData)
          ? ligeData.find((ligaStavka) => ligaStavka.id === ligaId)
          : null;

        setLiga(pronadenaLiga || null);

        const igraciKluba = Array.isArray(igraciData)
          ? igraciData.filter((igrac) => {
              const igracKlubId = izvuciId(igrac.acf?.klub);

              return igracKlubId === pronadeniKlub.id;
            })
          : [];

        setIgraci(igraciKluba);

        const klubLogoVrijednost = klubAcf.logo;

        const ligaLogoVrijednost =
          pronadenaLiga?.acf?.logo ||
          pronadenaLiga?.acf?.logo_lige ||
          pronadenaLiga?.acf?.grb;

        const [klubLogoUrl, ligaLogoUrl] = await Promise.all([
          dohvatiSliku(klubLogoVrijednost),
          dohvatiSliku(ligaLogoVrijednost),
        ]);

        setLogoKluba(klubLogoUrl);
        setLogoLige(ligaLogoUrl);
      } catch (error) {
        console.error("Greška pri dohvaćanju kluba:", error);
        setGreska(error.message);
      } finally {
        setLoading(false);
      }
    };

    dohvatiPodatke();
  }, [slug]);

  const izvuciId = (vrijednost) => {
    if (!vrijednost) return null;

    if (Array.isArray(vrijednost)) {
      return izvuciId(vrijednost[0]);
    }

    if (typeof vrijednost === "object") {
      return Number(
        vrijednost.ID ||
          vrijednost.id ||
          vrijednost.value ||
          vrijednost.databaseId
      );
    }

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
        vrijednost.sizes?.large ||
        vrijednost.url ||
        vrijednost.source_url ||
        ""
      );
    }

    const mediaId = izvuciId(vrijednost);

    if (!mediaId) return "";

    try {
      const odgovor = await fetch(`${API_URL}/media/${mediaId}`);

      if (!odgovor.ok) return "";

      const media = await odgovor.json();

      return (
        media.media_details?.sizes?.medium?.source_url ||
        media.media_details?.sizes?.large?.source_url ||
        media.source_url ||
        ""
      );
    } catch (error) {
      console.error("Greška pri dohvaćanju slike:", error);
      return "";
    }
  };

  const prikaziVrijednost = (vrijednost) => {
    return vrijednost || vrijednost === 0
      ? vrijednost
      : "Nije uneseno";
  };

  const tekstBrojaIgraca = (broj) => {
    if (broj === 1) return "1 hrvatski igrač";

    return `${broj} hrvatskih igrača`;
  };

  if (loading) {
    return <p className="container py-5">Učitavanje...</p>;
  }

  if (greska) {
    return (
      <main className="container py-5">
        <h1 className="fw-bold mb-3">Došlo je do pogreške</h1>
        <p>{greska}</p>

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
                  style={{
                    width: "100%",
                    maxWidth: "330px",
                    maxHeight: "330px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <p className="text-muted mb-0">Logo nije unesen</p>
              )}
            </div>
          </div>

          <div className="col-lg-7">
            <div className="p-4 p-lg-5">
              <p className="text-danger fw-bold text-uppercase mb-2">
                Profil kluba
              </p>

              <h1 className="display-5 fw-bold mb-4">
                {klub.title.rendered}
              </h1>

              <div className="border rounded p-3 mb-3">
                <small className="text-muted d-block mb-2">Liga</small>

                <div className="d-flex align-items-center gap-3">
                  {logoLige ? (
                    <img
                      src={logoLige}
                      alt={
                        liga
                          ? `Logo lige ${liga.title.rendered}`
                          : "Logo lige"
                      }
                      style={{
                        width: "65px",
                        height: "65px",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <div
                      className="bg-light rounded d-flex align-items-center justify-content-center text-muted"
                      style={{
                        width: "65px",
                        height: "65px",
                        flexShrink: 0,
                      }}
                    >
                      🏆
                    </div>
                  )}

                  <strong className="fs-5">
                    {liga?.title?.rendered || "Nije uneseno"}
                  </strong>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Država
                    </small>

                    <strong>
                      🌍 {prikaziVrijednost(acf.drzava)}
                    </strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Grad
                    </small>

                    <strong>🏙️ {prikaziVrijednost(acf.grad)}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Stadion
                    </small>

                    <strong>
                      🏟️ {prikaziVrijednost(acf.stadion)}
                    </strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Godina osnutka
                    </small>

                    <strong>
                      📅 {prikaziVrijednost(acf.godina_osnutka)}
                    </strong>
                  </div>
                </div>

                <div className="col-12">
                  <div className="border rounded p-3">
                    <small className="text-muted d-block mb-1">
                      Hrvatski igrači u klubu
                    </small>

                    <strong>
                      👥 {tekstBrojaIgraca(igraci.length)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
      <section className="mt-5">
  <div className="mb-4">
    <h2 className="fw-bold mb-2">
      Hrvatski igrači u ovom klubu
    </h2>

    <p className="text-muted mb-0">
      Igrači iz Hrvatske koji trenutačno nastupaju za ovaj klub.
    </p>
  </div>

  {igraci.length === 0 ? (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <p className="mb-0">
          Trenutačno nema unesenih hrvatskih igrača za ovaj klub.
        </p>
      </div>
    </div>
  ) : (
    <div className="row g-4">
      {igraci.map((igrac) => {
        const acfIgraca = igrac.acf || {};

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
                    height: "320px",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
              ) : (
                <div
                  className="bg-light d-flex align-items-center justify-content-center text-muted"
                  style={{ height: "320px" }}
                >
                  Fotografija nije unesena
                </div>
              )}

              <div className="card-body d-flex flex-column p-4">
                <h3 className="h4 fw-bold mb-3">
                  {igrac.title.rendered}
                </h3>

                <p className="mb-2">
                  <strong>⚽ Pozicija:</strong>{" "}
                  {acfIgraca.pozicija || "Nije uneseno"}
                </p>

                <p className="mb-4">
                  <strong>👕 Broj dresa:</strong>{" "}
                  {acfIgraca.broj_dresa || "Nije uneseno"}
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
</section>
    </main>
  );
}

export default KlubDetalji;