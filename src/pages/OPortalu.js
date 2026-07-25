import { useEffect, useState } from "react";

function OPortalu() {
  const [page, setPage] = useState(null);

  useEffect(() => {
    fetch(
      "https://front3.edukacija.online/backend/wp-json/wp/v2/pages/55"
    )
      .then((res) => res.json())
      .then((data) => {
        setPage(data);
      });
  }, []);

  if (!page) return <p>Učitavanje...</p>;

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: page.content.rendered,
      }}
    />
  );
}

export default OPortalu;