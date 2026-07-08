import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import "./kontakt.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);

function Kontakt() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_v5pajo9", "template_42d6cri", form.current, {
        publicKey: "UKqp4t_tLqtN7nuwN",
      })
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        },
      );
  };

  return (
    <div className="container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-subtitle">
        Any questions or remarks? Just write us a message!
      </p>

      <div className="row">
        <div className="col-md-5 form-left">
          <div className="form-left-header">
            <h2>Contact information</h2>
            <p>Say something to start a live chat!</p>
          </div>

          <div className="form-left-info">
            <a href="tel:+191234567879">
              <FontAwesomeIcon icon="fa-solid fa-phone-volume" />
              <span>+1012 3456 789</span>
            </a>
            <a href="mailto: dominik.galjar@gmail.com">
              <FontAwesomeIcon icon="fa-solid fa-envelope" />
              <span>dominik.galjar@gmail.com</span>
            </a>
            <a href="https://share.google/1bJ02PGvKy2IndmfY">
              <FontAwesomeIcon icon="fa-solid fa-location-dot" />
              <address>
                <span>132 Dartmouth Street Boston,</span>
                <span>Massachusetts 02156 United States</span>
              </address>
            </a>
          </div>

          <div className="form-left-socials">
            <FontAwesomeIcon icon="fa-solid fa-x" />
            <FontAwesomeIcon icon="fa-brands fa-instagram" />
            <FontAwesomeIcon icon="fa-brands fa-discord" />
          </div>
        </div>

        <div className="col-md-7 form-right">
          {/*
          name prebacen sa labela na input.
          content email templatea mozemo uređivati html-om i inline css-om, a varijable dodajemo kao {{first_name}}
          primjer:
          <div>{{first_name}} {{last_name}}</div>
          <div>{{email}}</div>
          <div>{{time}}</div>
          <p>{{message}}</p>
          <p>{{phone_number}}</p> 
          */}

          <form ref={form} onSubmit={sendEmail}>
            <div className="row g-5">
              <div className="col-md-6">
                <label htmlFor="">FirstName</label>
                <input type="text" name="first_name" />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="">Last Name</label>
                <input type="text" name="last_name" />
              </div>

              <div className="col-md-6">
                <label htmlFor="">Email</label>
                <input type="email" name="email" />
              </div>

              <div className="col-md-6">
                <label htmlFor="">Phone Number</label>
                <input type="text" name="phone_number" />
              </div>

              <div className="col-md-12">
                <label htmlFor="">Message</label>
                <input type="text" name="message" />
              </div>
              <button className="form-button ms-auto" type="submit">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Kontakt;