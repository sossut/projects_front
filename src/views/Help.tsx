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
        heading: 'Filters',
        body: (
          <div>
            <p>
              Use the filter panel to narrow results by building type, country,
              metro area, status and other fields.
            </p>
            <ol>
              <li>Open the filter panel above the table.</li>
              <li>
                Select one or more filters (e.g. Building Type = High-rise).
              </li>
              <li>Combine filters to refine results (they are ANDed).</li>
              <li>
                Clear a filter by removing its value or using the clear/reset
                control.
              </li>
            </ol>
            <p>
              Search and filters work together; filters are applied immediately.
            </p>
          </div>
        )
      },
      {
        heading: 'Map',
        body: 'Map markers show projects by building type. Click a marker to open project details.'
      },
      {
        heading: 'Enrichment',
        body: (
          <div>
            <h4>Area enrichment</h4>
            <ol>
              <li>
                Open <strong>Updates</strong> and choose metro-area or country
                mode.
              </li>
              <li>Select the target areas from the list or table.</li>
              <li>
                Click the action to start enrichment for selected areas — this
                enqueues background jobs.
              </li>
              <li>
                Monitor progress in the UI; results will be merged when jobs
                complete.
              </li>
            </ol>
            <h4>Single-project enrichment</h4>
            <ol>
              <li>Open a project (from table or map).</li>
              <li>
                In the project modal click the <em>Enrich</em> (or similar)
                button.
              </li>
              <li>
                Confirm the action if prompted. The job will run and update the
                project when finished.
              </li>
            </ol>
            <p>
              Enrichment can take time; you can continue working while processes
              run in background.
            </p>
          </div>
        )
      },
      {
        heading: 'Updates',
        body: 'Switch between metro-area and country update views and use JSON input for enrichment tasks.'
      },
      {
        heading: 'JSON & ChatGPT',
        body: (
          <div>
            <h4>Copying JSON</h4>
            <ol>
              <li>
                Open the project's <em>View JSON</em> view.
              </li>
              <li>
                Click "Copy JSON & Instructions" or select and copy the JSON
                text.
              </li>
            </ol>
            <h4>Pasting ChatGPT responses</h4>
            <ol>
              <li>
                Paste ChatGPT's suggested fields or structured data into the
                project's edit form or response box.
              </li>
              <li>
                Validate and clean the content — do not blindly accept generated
                data.
              </li>
              <li>
                Save changes; if you paste large JSON blocks, ensure they are
                well-formed.
              </li>
            </ol>
            <p>
              Avoid pasting confidential data from external tools without proper
              review.
            </p>
          </div>
        )
      },
      {
        heading: 'Tips',
        body: (
          <ul>
            <li>Not finding a project? Try adjusting search or filters.</li>
            <li>Ensure you save changes after editing.</li>
            <li>Copy JSON from "View JSON" for ChatGPT prompts.</li>
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
        heading: 'Rikastus',
        body: (
          <div>
            <h4>Alueellinen rikastus</h4>
            <ol>
              <li>
                Mene <strong>Updates</strong>-näkymään ja valitse metroalue- tai
                maatila.
              </li>
              <li>Valitse alueet, joille haluat käynnistää rikastuksen.</li>
              <li>
                Käynnistä rikastus; tehtävät jonotetaan ja suoritetaan
                taustalla.
              </li>
              <li>Seuraa edistymistä käyttöliittymästä tai ilmoituksista.</li>
            </ol>
            <h4>Yksittäisen projektin rikastus</h4>
            <ol>
              <li>Avaa projekti taulukosta tai kartalta.</li>
              <li>
                Projektin modaalissa paina <em>Enrich</em>-painiketta.
              </li>
              <li>
                Vahvista toiminto tarvittaessa; päivitys suoritetaan taustalla.
              </li>
            </ol>
            <p>
              Rikastus saattaa kestää; voit jatkaa työskentelyä samalla kun
              tehtävät suoritetaan.
            </p>
          </div>
        )
      },
      {
        heading: 'Updates',
        body: 'Vaihda metroalue- ja maa-näkymien välillä ja käytä JSON-syöttöjä rikastuksen tukena.'
      },
      {
        heading: 'JSON & ChatGPT',
        body: (
          <div>
            <h4>JSONin kopiointi</h4>
            <ol>
              <li>
                Avaa projektin <em>View JSON</em> -näkymä.
              </li>
              <li>
                Käytä "Copy JSON & Instructions" -painiketta tai valitse ja
                kopioi JSON.
              </li>
            </ol>
            <h4>ChatGPT-vastauksen liittäminen</h4>
            <ol>
              <li>
                Liitä ChatGPT:ltä saamasi ehdotukset muokkauslomakkeeseen tai
                vastauskenttään.
              </li>
              <li>Tarkista ja muokkaa kenttiä ennen tallentamista.</li>
              <li>
                Suuret JSON-kappaleet kannattaa validoida ennen tallentamista.
              </li>
            </ol>
            <p>
              Älä liitä luottamuksellisia tietoja ulkoisista palveluista ilman
              lupaa.
            </p>
          </div>
        )
      },
      {
        heading: 'Vinkkejä',
        body: (
          <ul>
            <li>Kokeile hakua tai suodattimia, jos et löydä projektia.</li>
            <li>Tallenna muutokset muokkauksen jälkeen.</li>
            <li>Kopioi JSON "View JSON" -näkymästä ChatGPT-käyttöä varten.</li>
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
