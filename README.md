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
