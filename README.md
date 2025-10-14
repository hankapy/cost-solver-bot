# Hinnoittelulaskuri - Pricing Calculator

Tämä sovellus on suunniteltu vertailemaan ihmistyön, botin ja hybridimallin kustannuksia asiakaspalvelukyselyiden käsittelyssä. Sovellus tarjoaa kattavan näkymän sekä asiakashintoihin että palveluntarjoajan todellisiin kustannuksiin.

## Ominaisuudet

### 📊 Yhdeksän välilehteä

1. **Asetukset** - Perusasetukset ja konfigurointi
   - Perusasetukset (kyselymäärä, käsittelyaika, tuntihinta)
   - Ihmistyön portaistettu hinnoittelu
   - Botin kiinteät kulut ja portaistettu hinnoittelu
   - Botin osuuden kehitys (kuukausittain ja vuosittain)
   - Järjestelmäkustannusten määrittely

2. **Ihminen** - Pelkän ihmistyön kustannuslaskenta (asiakkaan näkökulma)
   - Kuukausittaiset kyselyt ja niiden käsittelyaika
   - Portaistettu hinnoittelu kyselymäärän mukaan
   - Tuntityön ja peruskuukausimaksun laskenta
   - Muokattava kyselymäärä suoraan välilehdellä

3. **Botti** - Täysautomaation kustannuslaskenta (asiakkaan näkökulma)
   - Kertaluonteinen aloitusmaksu ensimmäisenä kuukautena
   - Portaistettu kuukausiveloitus + järjestelmäkulut
   - Eri hinnoittelu eri kyselymäärille
   - Muokattava kyselymäärä suoraan välilehdellä

4. **Hybridi** - Yhdistelmämalli botin ja ihmistyön välillä (asiakkaan näkökulma)
   - Botin osuus kasvaa asteittain kuukausittain
   - Keskittämisalennuksen huomiointi
   - Kuukausittainen kehitysnäkymä
   - Vuosilaskuri (vuodet 0-3)
   - Säästölaskuri verrattuna pelkkään ihmistyöhön
   - Muokattava kyselymäärä ja keskittämisalennus suoraan välilehdellä

5. **Palveluntarjoaja** - Palveluntarjoajan todelliset kustannukset (Akvamariini)
   - Perusasetukset (kyselymäärä, peruskulut)
   - Palveluntarjoajan porrastettu hinnoittelu (ihmisvetoinen malli)
   - Porrastetut ylläpitotunnit kyselymäärän mukaan (bottivetinen malli)
   - Täysin ihmisvetoinen malli - kustannuserittely
   - Täysin bottivetonen malli - kustannuserittely
   - Kateprosentti (%) ja asiakashintojen laskenta
   - Hybridimallin kuukausittaiset kustannukset
   - Ohitusmahdollisuudet peruskuluille ja porrastetulle hinnoittelulle

6. **Vertailu** - Asiakkaan maksut vs. palveluntarjoajan kustannukset
   - Täysin ihmisvetoinen malli: Asiakashinta vs. kustannus vs. kate
   - Täysin bottivetonen malli: Asiakashinta vs. kustannus vs. kate
   - Hybridimalli: Asiakashinta vs. kustannus vs. kate (kuukausittain)
   - Katteiden ja kate-% näyttö

7. **Säästöt** - Kustannusvertailu ja ROI-analyysi
   - Vertailu: Pelkkä ihminen vs. Pelkkä botti
   - Vertailu: Pelkkä ihminen vs. Hybridimalli
   - Säästöjen visualisointi ja prosenttilaskelmat

8. **Skenaariot** - Eri kyselymäärien vertailu
   - Vertaile eri skenaarioita rinnakkain
   - Muokattavat kyselymäärät ja botin osuudet
   - Nopea kustannusvertailu eri tilanteissa

9. **Esimerkki** - Käytännön esimerkkitapaus
   - Konkreettinen laskentaesimerkki
   - Yksityiskohtainen kustannuserittely

10. **README** - Ohjeet ja dokumentaatio

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

- `/src/components/tabs/` - Välilehtien komponentit (SettingsTab, HumanTab, BotTab, HybridTab, ProviderTab, ComparisonTab, SavingsTab, ScenariosTab, ExampleTab, ReadmeTab)
- `/src/contexts/PricingContext.tsx` - React Context hinnoitteluasetuksille
- `/src/lib/pricingCalculations.ts` - Asiakashintojen laskentalogiikka
- `/src/lib/providerCalculations.ts` - Palveluntarjoajan kustannuslaskenta
- `/src/types/pricing.ts` - TypeScript-tyyppimäärittelyt
- `/src/types/providerPricing.ts` - Palveluntarjoajan hinnoittelun tyyppimäärittelyt

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
