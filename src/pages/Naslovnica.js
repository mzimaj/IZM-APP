import { useEffect, useState } from "react";

function Naslovnica() {
  const api =
    "https://front3.edukacija.online/backend/wp-json/wp/v2";

  const [page, setPage] = useState(null);
  const [players, setPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(api + "/pages?slug=naslovnica-3")
      .then((res) => res.json())
      .then((data) => setPage(data[0]));

    loadPlayers();
    loadClubs();
    loadLeagues();
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function cleanText(value) {
    const element = document.createElement("div");
    element.innerHTML = value || "";
    return element.textContent || "";
  }

  async function getMediaUrl(mediaId) {
    if (!mediaId) return "";

    try {
      const response = await fetch(api + "/media/" + mediaId);
      const media = await response.json();

      return media.source_url || "";
    } catch {
      return "";
    }
  }

  async function getImage(item) {
    const featured =
      item?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

    if (featured) {
      return featured;
    }

    const fields = [
      item?.acf?.logo,
      item?.acf?.logotip,
      item?.acf?.logo_kluba,
      item?.acf?.logo_lige,
      item?.acf?.slika,
      item?.acf?.fotografija,
      item?.acf?.slika_igraca,
    ];

    for (const field of fields) {
      if (!field) continue;

      if (
        typeof field === "string" &&
        field.startsWith("http")
      ) {
        return field;
      }

      if (field?.url) {
        return field.url;
      }

      if (field?.source_url) {
        return field.source_url;
      }

      if (typeof field === "number") {
        const url = await getMediaUrl(field);

        if (url) return url;
      }

      if (
        typeof field === "string" &&
        !isNaN(Number(field))
      ) {
        const url = await getMediaUrl(Number(field));

        if (url) return url;
      }

      if (field?.ID || field?.id) {
        const url = await getMediaUrl(
          field.ID || field.id
        );

        if (url) return url;
      }
    }

    return "";
  }

  async function addImages(items) {
    return Promise.all(
      items.map(async (item) => {
        return {
          ...item,
          cfaImage: await getImage(item),
        };
      })
    );
  }

  function loadPlayers() {
    fetch(api + "/igraci?_embed&per_page=8")
      .then((res) => res.json())
      .then((data) => addImages(data))
      .then((data) => setPlayers(data))
      .catch(() => setPlayers([]));
  }

  function loadClubs() {
    fetch(api + "/klubovi?_embed&per_page=4")
      .then((res) => res.json())
      .then((data) => addImages(data))
      .then((data) => setClubs(data))
      .catch(() => setClubs([]));
  }

  function loadLeagues() {
    fetch(api + "/lige?_embed&per_page=4")
      .then((res) => res.json())
      .then((data) => addImages(data))
      .then((data) => setLeagues(data))
      .catch(() => setLeagues([]));
  }

  function loadPosts() {
    fetch(api + "/categories?slug=cfa-vijesti")
      .then((res) => res.json())
      .then((categories) => {
        if (!categories.length) {
          return [];
        }

        return fetch(
          api +
            "/posts?_embed&per_page=4&categories=" +
            categories[0].id
        ).then((res) => res.json());
      })
      .then((data) => addImages(data || []))
      .then((data) => setPosts(data))
      .catch(() => setPosts([]));
  }

  useEffect(() => {
    if (!page) return;

    const playersBox = document.getElementById(
      "cfa-home3-players"
    );

    const clubsBox = document.getElementById(
      "cfa-home3-clubs"
    );

    const leaguesBox = document.getElementById(
      "cfa-home3-leagues"
    );

    const newsBox = document.getElementById(
      "cfa-home3-news"
    );

    if (playersBox) {
      playersBox.innerHTML = players
        .map((player) => {
          const name = cleanText(
            player.title.rendered
          );

          return `
            <a
              class="cfa-home3-player"
              href="/igraci/${player.slug}"
            >
              ${
                player.cfaImage
                  ? `
                    <img
                      src="${player.cfaImage}"
                      alt="${name}"
                    >
                  `
                  : `
                    <div class="cfa-home3-no-image">
                      CFA
                    </div>
                  `
              }

              <span>${name}</span>
            </a>
          `;
        })
        .join("");
    }

    if (clubsBox) {
      clubsBox.innerHTML = clubs
        .map((club) => {
          const name = cleanText(
            club.title.rendered
          );

          return `
            <a
              class="cfa-home3-logo"
              href="/klubovi/${club.slug}"
            >
              ${
                club.cfaImage
                  ? `
                    <img
                      src="${club.cfaImage}"
                      alt="${name}"
                    >
                  `
                  : `
                    <div class="cfa-home3-logo-empty">
                      CFA
                    </div>
                  `
              }

              <span>${name}</span>
            </a>
          `;
        })
        .join("");
    }

    if (leaguesBox) {
      leaguesBox.innerHTML = leagues
        .map((league) => {
          const name = cleanText(
            league.title.rendered
          );

          return `
            <div class="cfa-home3-logo">
              ${
                league.cfaImage
                  ? `
                    <img
                      src="${league.cfaImage}"
                      alt="${name}"
                    >
                  `
                  : `
                    <div class="cfa-home3-logo-empty">
                      CFA
                    </div>
                  `
              }

              <span>${name}</span>
            </div>
          `;
        })
        .join("");
    }

    if (newsBox) {
      newsBox.innerHTML = posts
        .map((post) => {
          const title = cleanText(
            post.title.rendered
          );

          return `
           <a
    class="cfa-home3-news-item"
    href="/blog/${post.slug}"
>
              ${
                post.cfaImage
                  ? `
                    <img
                      src="${post.cfaImage}"
                      alt="${title}"
                    >
                  `
                  : ""
              }

              <span>
                <small>
                  ${new Date(
                    post.date
                  ).toLocaleDateString("hr-HR")}
                </small>

                <strong>${title}</strong>
              </span>
            </a>
          `;
        })
        .join("");
    }
  }, [page, players, clubs, leagues, posts]);

  if (!page) {
    return <p>Učitavanje...</p>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: page.content.rendered,
      }}
    />
  );
}

export default Naslovnica;