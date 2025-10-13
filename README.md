# Hinnoittelulaskuri - Pricing Calculator

Tämä sovellus on suunniteltu vertailemaan ihmistyön, botin ja hybridimallin kustannuksia asiakaspalvelukyselyiden käsittelyssä.

## Ominaisuudet

### 📊 Viisi välilehteä

1. **Ihminen** - Pelkän ihmistyön kustannuslaskenta
   - Kuukausittaiset kyselyt ja niiden käsittelyaika
   - Portaistettu hinnoittelu kyselymäärän mukaan
   - Tuntityön ja peruskuukausimaksun laskenta
   - Muokattava kyselymäärä suoraan välilehdellä

2. **Botti** - Täysautomaation kustannuslaskenta
   - Kertaluonteinen aloitusmaksu ensimmäisenä kuukautena
   - Portaistettu kuukausiveloitus + järjestelmäkulut
   - Eri hinnoittelu eri kyselymäärille
   - Muokattava kyselymäärä suoraan välilehdellä

3. **Hybridi** - Yhdistelmämalli botin ja ihmistyön välillä
   - Botin osuus kasvaa asteittain kuukausittain
   - Keskittämisalennuksen huomiointi
   - Kuukausittainen kehitysnäkymä
   - Vuosilaskuri (vuodet 0-3)
   - Säästölaskuri verrattuna pelkkään ihmistyöhön
   - Muokattava kyselymäärä ja keskittämisalennus suoraan välilehdellä

4. **Säästöt** - Kustannusvertailu ja ROI-analyysi
   - Vertailu: Pelkkä ihminen vs. Pelkkä botti
   - Vertailu: Pelkkä ihminen vs. Hybridimalli
   - Säästöjen visualisointi ja prosenttilaskelmat

5. **Skenaariot** - Eri kyselymäärien vertailu
   - Vertaile eri skenaarioita rinnakkain
   - Muokattavat kyselymäärät ja botin osuudet
   - Nopea kustannusvertailu eri tilanteissa

6. **Esimerkki** - Käytännön esimerkkitapaus
   - Konkreettinen laskentaesimerkki
   - Yksityiskohtainen kustannuserittely

7. **Asetukset** - Konfigurointi
   - Perusasetukset (kyselymäärä, käsittelyaika, tuntihinta)
   - Ihmistyön portaistettu hinnoittelu
   - Botin kiinteät kulut ja portaistettu hinnoittelu
   - Botin osuuden kehitys (kuukausittain ja vuosittain)

8. **README** - Ohjeet ja dokumentaatio

## Teknologiat

- **Vite** - Kehitysympäristö
- **TypeScript** - Tyyppiturvallinen JavaScript
- **React** - UI-kirjasto
- **shadcn-ui** - Komponenttikirjasto
- **Tailwind CSS** - Tyylittely
- **Recharts** - Kaaviot ja visualisoinnit

## Asennus ja käyttö

```sh
# Kloonaa repositorio
git clone <YOUR_GIT_URL>

# Siirry projektin hakemistoon
cd <YOUR_PROJECT_NAME>

# Asenna riippuvuudet
npm i

# Käynnistä kehityspalvelin
npm run dev
```

## Projektin rakenne

- `/src/components/tabs/` - Välilehtien komponentit
- `/src/contexts/` - React Context hinnoitteluasetuksille
- `/src/lib/pricingCalculations.ts` - Kaikki laskentalogiikka
- `/src/types/pricing.ts` - TypeScript-tyyppimäärittelyt

## Muokkaus

**Lovablessa:**
[Avaa projekti Lovablessa](https://lovable.dev/projects/1f276537-0829-4e38-a9af-a913ffafcfa8)

**Paikallisesti:**
Muokkaa tiedostoja haluamallasi IDE:llä ja pushaa muutokset GitHubiin.

## Julkaisu

Avaa [Lovable](https://lovable.dev/projects/1f276537-0829-4e38-a9af-a913ffafcfa8) ja klikkaa Share -> Publish.

## Custom domain

Voit yhdistää oman domainin projektiisi: Project > Settings > Domains > Connect Domain

[Lue lisää](https://docs.lovable.dev/features/custom-domain#custom-domain)
