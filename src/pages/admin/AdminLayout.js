import React from "react";
import { Link, Outlet } from "react-router";
import "./admin.css";

function AdminLayout() {
  return (
    <>
      <div className="container">
        <div className="background"></div>
        <div className="row">
          <div className="col-md-6 admin-header">
            <div className="admin-image-wrapper">
              <img src="https://placehold.co/600x400" alt="" />
            </div>
            <h1>My profile</h1>
          </div>
        </div>

        <ul className="d-flex gap-5 mb-4">
          <li>
            <Link to="user-details">My details</Link>
          </li>
          <li>
            <Link to="user-posts">My Posts</Link>
          </li>
          <li>
            <Link to="user-settings">My settings</Link>
          </li>
        </ul>

        <main>
            <Outlet />
        </main>
      </div>

  
    </>
  );
}

export default AdminLayout;