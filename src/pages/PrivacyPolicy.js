import { useEffect, useState } from "react";

function Naslovnica() {
  const [page, setPage] = useState(null);

  useEffect(() => {
    fetch("https://front3.edukacija.online/backend/wp-json/wp/v2/pages/458")
      .then((res) => res.json())
      .then((data) => setPage(data));
  }, []);

  if (!page) return <p>Učitavanje</p>;

  return (
    <>
      <div className="page-header container py-5">
        <h1>{page.title.rendered}</h1>
      </div>
      <div className="container mb-5 pb-5" dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
    </>
  );
}

export default Naslovnica;