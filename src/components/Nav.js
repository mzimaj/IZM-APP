import { useEffect, useState } from "react";

import {
  faSignIn,
  faSignOut,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthProvider";

function Nav() {
  const { user, validateToken } = useAuth();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (location.pathname === "/sign-in" || location.pathname === "/sign-up") {
    return null;
  }

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    validateToken();
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark cfa-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          CFA
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Otvori navigaciju"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="cfa-hamburger">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div
          className={`navbar-collapse justify-content-end ${
            menuOpen ? "show" : "collapse"
          }`}
          id="navbarNav"
        >
          <ul className="navbar-nav py-3">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Naslovnica
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/igraci">
                Igrači
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/klubovi">
                Klubovi
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/o-portalu">
                O portalu
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/kontakt">
                Kontakt
              </Link>
            </li>

            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex gap-3 ms-md-4">
            {!user ? (
              <Link to="/sign-in">
                Login <FontAwesomeIcon icon={faSignIn} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={signOut}
                className="btn btn-link p-0 text-dark text-decoration-none"
              >
                Logout <FontAwesomeIcon icon={faSignOut} />
              </button>
            )}

            <Link to="/sign-up">
              Register <FontAwesomeIcon icon={faUserPlus} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;