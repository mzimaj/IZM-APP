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
          CFA
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