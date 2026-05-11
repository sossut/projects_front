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

const LangSwitch = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const SwitchButton = styled.button<{ $active?: boolean }>`
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: ${({ $active }) => ($active ? '#2563eb' : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : 'inherit')};
  cursor: pointer;
`;

const texts: Record<
  string,
  {
    title: string;
    sections: { heading: string; body: React.ReactNode }[];
  }
> = {
  en: {
    title: 'Help',
    sections: [
      {
        heading: 'Overview',
        body: 'This app displays and manages projects in a table view, on a map and via update views.'
      },
      {
        heading: 'Navigation',
        body: 'Use the top navigation links to go to Home, Updates, Else, Map and Help.'
      },
      {
        heading: 'Projects (Home)',
        body: (
          <ul>
            <li>Search projects using the search fields.</li>
            <li>Filter results with the filter panel.</li>
            <li>Open a project to view details, edit or view JSON.</li>
          </ul>
        )
      },
      {
        heading: 'Map',
        body: 'Map markers show projects by building type. Click a marker to open project details.'
      },
      {
        heading: 'Updates',
        body: 'Switch between metro-area and country update views and use JSON input for enrichment tasks.'
      },
      {
        heading: 'Tips',
        body: (
          <ul>
            <li>Not finding a project? Try adjusting search or filters.</li>
            <li>Ensure you save changes after editing.</li>
            <li>Copy JSON from "View JSON" for offline use.</li>
          </ul>
        )
      }
    ]
  },
  fi: {
    title: 'Käyttöohje',
    sections: [
      {
        heading: 'Yleistä',
        body: 'Sovellus näyttää ja hallinnoi projekteja taulukkona, kartalla ja päivitysnäkymissä.'
      },
      {
        heading: 'Navigointi',
        body: 'Käytä yläpalkin linkkejä: Home, Updates, Else, Map ja Help.'
      },
      {
        heading: 'Projects (Home)',
        body: (
          <ul>
            <li>Hae projekteja hakukentillä.</li>
            <li>Suodata tuloksia suodattimilla.</li>
            <li>
              Avaa projekti nähdäksesi tiedot, muokkaa tai tarkastele JSON:ia.
            </li>
          </ul>
        )
      },
      {
        heading: 'Map',
        body: 'Kartan markkerit näyttävät projektit rakennustyypin mukaan. Klikkaa markkeria nähdäksesi tiedot.'
      },
      {
        heading: 'Updates',
        body: 'Vaihda metroalue- ja maa-näkymien välillä ja käytä JSON-syöttöjä.'
      },
      {
        heading: 'Vinkkejä',
        body: (
          <ul>
            <li>Kokeile hakua tai suodattimia, jos et löydä projektia.</li>
            <li>Tallenna muutokset muokkauksen jälkeen.</li>
            <li>Kopioi JSON "View JSON" -näkymästä.</li>
          </ul>
        )
      }
    ]
  }
};

const Help: React.FC = () => {
  const [lang, setLang] = React.useState<'en' | 'fi'>('en');
  const t = texts[lang];

  return (
    <Container>
      <LangSwitch role="tablist" aria-label="Language switch">
        <SwitchButton $active={lang === 'en'} onClick={() => setLang('en')}>
          English
        </SwitchButton>
        <SwitchButton $active={lang === 'fi'} onClick={() => setLang('fi')}>
          Suomi
        </SwitchButton>
      </LangSwitch>

      <h1>{t.title}</h1>
      {t.sections.map((s) => (
        <Section key={s.heading}>
          <h2>{s.heading}</h2>
          <div>{s.body}</div>
        </Section>
      ))}
    </Container>
  );
};

export default Help;
