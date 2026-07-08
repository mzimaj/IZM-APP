import React, { useEffect, useState } from "react";

function TecajnaLista() {
  const [tecajnaLista, setTecajnaLista] = useState([]);

  useEffect(() => {
    fetch("https://corsproxy.io/?https://api.hnb.hr/tecajn-eur/v3")
      .then((res) => res.json())
      .then((data) => setTecajnaLista(data));
  }, []);

  console.log(tecajnaLista);

  return (
    <div className="container">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">broj_tecajnice</th>
            <th scope="col">datum_primjene</th>
            <th scope="col">drzava</th>
            <th scope="col">drzava_iso</th>
            <th scope="col">kupovni_tecaj</th>
            <th scope="col">prodajni_tecaj</th>
            <th scope="col">sifra_valute</th>
            <th scope="col">srednji_tecaj</th>
            <th scope="col">valuta</th>
          </tr>
        </thead>
        <tbody>
          {tecajnaLista.map((tecaj) => {
            return (
              <tr>
                <td>{tecaj.broj_tecajnice}</td>
                <td>{tecaj.datum_primjene}</td>
                <td>{tecaj.drzava}</td>
                <td>{tecaj.drzava_iso}</td>
                <td>{tecaj.kupovni_tecaj}</td>
                <td>{tecaj.prodajni_tecaj}</td>
                <td>{tecaj.sifra_valute}</td>
                <td>{tecaj.srednji_tecaj}</td>
                <td>{tecaj.valuta}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TecajnaLista;
