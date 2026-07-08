import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import "./sign.css";
import { Link, useNavigate } from "react-router";

function SignUp() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [success, setSuccess] = useState("");

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  };


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch(
      "https://front3.edukacija.online/backend/wp-json/custom/v1/users/register",
      options,
    );

    if(!response.ok) {
      setError("Something went wrong");
      setLoading(false);
      return;
    } else {
      setSuccess("Korisnik uspješno kreiran")
      setLoading(false)
    }

    // navigate("/");
    // window.location.reload();
  };

  return (
    <div id="auth" className="container-fluid">
      <div className="row">
        <div className="d-none d-md-flex col-md-7 auth-left">
          <h1>GoFinance</h1>
          <p>The most popular peer to peer lending at SEA</p>
          <button>Read More</button>
        </div>
        <div className="col-md-5 auth-right">
          <div className="d-flex flex-column">
            <h2>Hello Again!</h2>
            <p>Welcome back</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faUser} />
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
              />
            </div>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faEnvelope} />
              <input
                name="email"
                type="text"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faLock} />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            {error ? (<p className="text-center text-danger">Wrong email or password</p>) : ""}
            {success ? (<p className="text-center text-success">{success}</p>) : ""}
            <button disabled={loading} type="submit">
              Register
            </button>
          </form>
          <p className="signin text-center">Already have an account? <Link to="/sign-in">Sign in!</Link> </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;