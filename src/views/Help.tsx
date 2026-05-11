import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: 18px;
`;

const Help: React.FC = () => {
  return (
    <Container>
      <h1>Käyttöohje</h1>
      <Section>
        <h2>Yleistä</h2>
        <p>
          Tämä sovellus näyttää ja hallinnoi projekteja taulukkomuodossa,
          kartalla ja päivitysnäkymissä.
        </p>
      </Section>

      <Section>
        <h2>Navigointi</h2>
        <p>
          Käytä yläpalkin linkkejä siirtyäksesi eri näkymiin: Home, Updates,
          Else, Map ja Help.
        </p>
      </Section>

      <Section>
        <h2>Projects (Home)</h2>
        <ul>
          <li>Hae projekteja hakukentillä.</li>
          <li>Suodata tuloksia suodattimilla.</li>
          <li>Avaa projektin tietoruudun klikkaamalla riviä tai painiketta.</li>
          <li>
            Modaalista voit katsoa tietoja, muokata tai tarkastella JSON:ia.
          </li>
        </ul>
      </Section>

      <Section>
        <h2>Map</h2>
        <p>
          Kartan markkerit näyttävät projektit rakennustyypin mukaan. Klikkaa
          markkeria nähdäksesi projektin tiedot ja avaa tarvittaessa modal.
        </p>
      </Section>

      <Section>
        <h2>Updates</h2>
        <p>
          Täällä voit vaihtaa metroalue- ja maa-näkymien välillä ja käyttää
          JSON-syöttöjä päivitysten tukena.
        </p>
      </Section>

      <Section>
        <h2>Vinkkejä</h2>
        <ul>
          <li>
            Jos et löydä projektia, kokeile hakua tai suodattimia uudelleen.
          </li>
          <li>Varmista tallennus muokkauksen jälkeen.</li>
          <li>Kopioi JSON helposti "View JSON" -näkymästä.</li>
        </ul>
      </Section>

      <Section>
        <h2>Ongelmatilanteet</h2>
        <p>
          Jos jokin ei toimi odotetusti, katso selaimen konsolista
          virheilmoituksia tai ota yhteyttä sovelluksen ylläpitoon.
        </p>
      </Section>
    </Container>
  );
};

export default Help;
