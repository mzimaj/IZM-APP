import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

function Kontakt() {
  const form = useRef();
  const [poruka, setPoruka] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    setPoruka("Slanje poruke...");

    emailjs
      .sendForm("service_v5pajo9", "template_42d6cri", form.current, {
        publicKey: "UKqp4t_tLqtN7nuwN",
      })
      .then(() => {
        setPoruka("Poruka je uspješno poslana.");
        form.current.reset();
      })
      .catch(() => {
        setPoruka("Poruka nije poslana. Pokušajte ponovno.");
      });
  };

  return (
    <main className="container py-5">
      <h1 className="fw-bold mb-2">Kontakt</h1>

      <p className="text-muted mb-5">
        Imate pitanje, prijedlog ili ispravak? Pošaljite nam poruku.
      </p>

      <div className="row g-4">
        <div className="col-lg-4">
          <section className="card h-100 p-4">
            <h2 className="h4 mb-3">Kontakt informacije</h2>

            <p className="text-muted mb-4">
              Javite nam se putem telefona, e-maila ili kontakt obrasca.
            </p>

            <a
              href="tel:+38512345678"
              className="d-flex align-items-center gap-3 mb-3"
            >
              <FontAwesomeIcon icon={faPhone} />
              <span>+385 1 234 5678</span>
            </a>

            <a
              href="mailto:dominik.galjar@gmail.com"
              className="d-flex align-items-center gap-3 mb-3"
            >
              <FontAwesomeIcon icon={faEnvelope} />
              <span>zimaj.marko@gmail.com</span>
            </a>

            <div className="d-flex align-items-start gap-3">
              <FontAwesomeIcon icon={faLocationDot} className="mt-1" />
              <span>Zagreb, Hrvatska</span>
            </div>
          </section>
        </div>

        <div className="col-lg-8">
          <section className="card p-4">
            <h2 className="h4 mb-4">Pošaljite poruku</h2>

            <form ref={form} onSubmit={sendEmail}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="first_name">
                    Ime
                  </label>
                  <input
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="last_name">
                    Prezime
                  </label>
                  <input
                    className="form-control"
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="email">
                    E-mail
                  </label>
                  <input
                    className="form-control"
                    id="email"
                    name="email"
                    type="email"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="phone_number">
                    Broj telefona
                  </label>
                  <input
                    className="form-control"
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="message">
                    Poruka
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="6"
                    required
                  />
                </div>

                <div className="col-12 d-flex align-items-center gap-3">
                  <button className="btn btn-danger" type="submit">
                    Pošalji poruku
                  </button>

                  {poruka && <span>{poruka}</span>}
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Kontakt;