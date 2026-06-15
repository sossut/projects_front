# Projects Front

Käyttöohje tälle sovellukselle.

## Yleiskuva

Sovellus on projektien hallinta- ja selaustyökalu. Siinä voi tarkastella projekteja taulukkona, avata yksittäisen projektin tiedot, muokata tietoja, tarkastella JSON-dataa, käyttää päivitysnäkymiä ja katsoa projekteja kartalla.

## Kirjautuminen

1. Avaa sovellus.
2. Kirjaudu sisään omilla tunnuksillasi.
3. Ilman kirjautumista et pääse pääsivuille, kuten Projects, Updates tai Map.

## Navigointi

Yläpalkissa on pääreitit:

- Home: projektitaulukko
- Updates: päivitystyökalut metroalueille ja maille
- Else: lisänäkymä / sivu
- Map: karttanäkymä

## Projects-näkymä

Home-sivulla näkyy projektitaulukko.

Taulukossa voit yleensä:

- hakea projekteja hakukentillä
- rajata tuloksia suodattimilla
- avata projektin lisätiedot
- muokata projektin tietoja
- tarkastella projektin JSON-dataa
- käynnistää enrichment-toimintoja, jos ne ovat käytössä

Projektin avaamisen jälkeen modaalissa on tyypillisesti seuraavat toiminnot:

- Details: projektin perustiedot
- Edit: tietojen muokkaus
- View JSON: koko projektin JSON ja kopiointitoiminto

Muokkauksessa voi olla myös poisto- tai vahvistustoimintoja. Poisto vaatii yleensä erillisen varmistuksen.

## Updates-näkymä

Updates-sivulla voit vaihtaa kahden näkymän välillä:

- Show Metro Areas for Auto Updates
- Show Countries for Updates

Sivulla on myös JSON-syöttöön liittyvä alue, jota käytetään päivitys- tai enrich-toimintojen tukena.

Uuden metroalueen etsiminen ja lisääminen:

1. Avaa Show Metro Areas for Auto Updates -näkymä.
2. Käytä hakukenttää olemassa olevan alueen tai maan löytämiseen.
3. Jos alue puuttuu, valitse maa, kirjoita metroalueen nimi ja paina Add.

Rikastus onnistuu kahdella tavalla:

1. Automaatio: valitse alueet ja käynnistä Start Update, jolloin tehtävät ajetaan taustalla.
2. Käsin ChatGPT:llä: avaa kohdealue, valitse Get Json For ChatGPT, kopioi JSON ChatGPT:hen, pyydä strukturoitu vastaus ja liitä se takaisin JSON-syöttöön ennen tallennusta.

## Map-näkymä

Map-sivulla näkyvät projektit kartalla.

Kartalla voit:

- tarkastella projekteja värillisinä markkereina
- lukea legendan rakennustyypin mukaan
- klikata markkeria ja avata projektin lisätiedot

Markkerien koko muuttuu zoomauksen mukaan.

## Käytännön vinkit

- Jos et näe projektia heti, kokeile hakea tai rajata tuloksia uudelleen.
- Jos modaalissa on paljon sisältöä, vieritä sisältöä sisäisesti alaspäin.
- Kartalla tarkemmat tiedot löytyvät markkeria klikkaamalla.
- Jos muokkaat tietoja, varmista lopuksi että tallennus onnistui ennen kuin suljet näkymän.

## Kehitysajo

Jos haluat ajaa sovelluksen paikallisesti:

```bash
npm install
npm run dev
```

## Huomio

Sovelluksen tarkat painikkeet ja kentät voivat muuttua sen mukaan, mitä dataa projektilla on ja mitä ominaisuuksia on käytössä.
