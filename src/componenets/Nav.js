import {
  faSignIn,
  faSignOut,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthProvider";

function Nav() {
  const { user, authenticated, validateToken } = useAuth();
  const location = useLocation();

  if (location.pathname === "/sign-in" || location.pathname === "/sign-up") {
    return;
  }

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    validateToken();
    window.location.reload()
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Navbar
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav py-3">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/work">
                Work
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/usluge">
                Usluge
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blog">
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/kontakt">
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/katalog">
                Katalog
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tecajnaLista">
                Tečajna Lista
              </Link>
            </li>
            {user ? (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin
                </Link>
              </li>
            ) : (
              ""
            )}
          </ul>

          <div className="d-flex gap-3 ms-md-4">
            {!user ? (
              <Link to="/sign-in">
                Login <FontAwesomeIcon icon={faSignIn} />
              </Link>
            ) : (
              <Link onClick={signOut}>
                Logout <FontAwesomeIcon icon={faSignOut} />
              </Link>
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