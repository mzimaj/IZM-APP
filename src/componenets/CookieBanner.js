import CookieConsent from "react-cookie-consent";
import { Link } from "react-router";

function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Prihvaćam"
      declineButtonText="Ne prihvaćam"
      enableDeclineButton
      cookieName="cfaCookieConsent"
      style={{ background: "#081426" }}
      buttonStyle={{
        background: "#e31b23",
        color: "#ffffff",
        fontSize: "14px",
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "#ffffff",
        border: "1px solid #ffffff",
      }}
      expires={150}
    >
      Ova stranica koristi kolačiće radi boljeg korisničkog iskustva.{" "}
      <Link to="/cookie-policy" style={{ color: "#ffffff" }}>
        Politika kolačića
      </Link>
    </CookieConsent>
  );
}

export default CookieBanner;