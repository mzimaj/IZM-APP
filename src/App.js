import { BrowserRouter, Routes, Route } from "react-router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import '@wordpress/block-library/build-style/style.css';
import '@wordpress/block-library/build-style/theme.css';

import "./App.css";

import Footer from "./componenets/Footer";
import Nav from "./componenets/Nav";

import Naslovnica from "./pages/Naslovnica";
import Kontakt from "./pages/Kontakt";
import BlogSingle from "./componenets/BlogSingle";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./componenets/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDetials from "./pages/admin/AdminDetails";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminSettings from "./pages/admin/AdminSettings";


import Igraci from "./pages/Igraci";
import IgracDetalji from "./pages/IgracDetalji";
import Klubovi from "./pages/Klubovi";
import OPortalu from "./pages/OPortalu";
import CookieBanner from "./componenets/CookieBanner";
import PrivacyPolicy from "./pages/PrivacyPolicy";





function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path="/" element={<Naslovnica />} />
            <Route path="/blog/:slug" element={<BlogSingle />} />
            <Route path="/kontakt" element={<Kontakt />} />

            <Route path="/igraci" element={<Igraci />} />
            <Route path="/igraci/:slug" element={<IgracDetalji />} />
            <Route path="/klubovi" element={<Klubovi />} />
            <Route path="/o-portalu" element={<OPortalu />} />


            <Route path="/privacy" element={<PrivacyPolicy />} />




            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            <Route element={<ProtectedRoute />}>
              <Route path="admin" element={<AdminLayout />}>
                <Route path="user-details" element={<AdminDetials />} />
                <Route path="user-posts" element={<AdminPosts />} />
                <Route path="user-settings" element={<AdminSettings />} />
              </Route>
            </Route>




          </Routes>
          <Footer />
          <CookieBanner />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;