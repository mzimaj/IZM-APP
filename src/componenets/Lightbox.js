import React, { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function Lightbox1() {
  const [page, setPage] = useState(null);
  const [slides, setSlides] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(
      "https://front3.edukacija.online/backend/wp-json/wp/v2/pages/636"
    )
      .then((res) => res.json())
      .then((data) => setPage(data));
  }, []);

  useEffect(() => {
    if (!page?.acf?.gallery) return;

    setSlides([]);

    page.acf.gallery.forEach((item) => {
      fetch(
        "https://front3.edukacija.online/backend/wp-json/wp/v2/media/" +
          item.image
      )
        .then((res) => res.json())
        .then((media) => {
          setSlides((prevSlides) => [
            ...prevSlides,
            {
              src: media.source_url,
            },
          ]);
        });
    });
  }, [page]);

  if (!page) {
    return <p>Učitavanje...</p>;
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open Lightbox
      </button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
      />
    </>
  );
}