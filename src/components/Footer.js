import { Link, useLocation } from "react-router";

function Footer() {
  const location = useLocation();

  if (
    location.pathname === "/sign-in" ||
    location.pathname === "/sign-up"
  ) {
    return null;
  }

  return (
    <footer className="cfa-footer">
      <div className="cfa-footer-line"></div>

      <div className="container">
        <div className="row align-items-center gy-4">

          <div className="col-12 col-md-4 text-center text-md-start">
            <h2 className="cfa-footer-logo">
              CFA
            </h2>
            <h2 className="cfa-footer-logo1">
              Croatian Footballers Abroad
            </h2>

          </div>

         <div className="col-12 col-md-4 text-center">
            <div className="cfa-footer-contact">
              <a
                href="mailto:info@cfa.hr"
                className="cfa-footer-card"
                aria-label="Pošalji e-mail"
                title="Pošalji e-mail"
              >
                ✉
              </a>

              <a
                href="tel:+385991234567"
                className="cfa-footer-card"
                aria-label="Nazovi"
                title="Nazovi"
              >
                ☎
              </a>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="cfa-footer-links">
              <Link to="/kontakt">
                Kontakt
              </Link>

              <Link to="/privacy">
                Pravila privatnosti
              </Link>

              <Link to="/cookie-policy">
                Politika kolačića
              </Link>
            </div>
          </div>

        </div>

        <div className="cfa-footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} CFA – Croatian Footballers Abroad.
            Sva prava pridržana.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;