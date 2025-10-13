import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Bot, GitMerge, PiggyBank, TrendingUp, Settings } from "lucide-react";

export default function ReadmeTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Tervetuloa hinnoittelutyökaluun!</h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Tämä työkalu auttaa sinua laskemaan ja vertailemaan kuluttajapalvelun kustannuksia eri tilanteissa.
        </p>
      </div>

      <Card className="shadow-elegant border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Mitä tämä työkalu tekee?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Tämä työkalu laskee automaattisesti, <strong>paljonko asiakaskyselyiden käsittely maksaa</strong> kolmessa eri tilanteessa:
          </p>
          <div className="space-y-3 pl-4">
            <div className="flex gap-3">
              <span className="font-bold text-destructive">1.</span>
              <p><strong>Pelkkä ihmistyö:</strong> Kaikki kyselyt käsitellään ihmisten toimesta</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <p><strong>Pelkkä botti:</strong> Kaikki kyselyt käsitellään botin toimesta</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-success">3.</span>
              <p><strong>Hybridi:</strong> Osa kyselyistä menee botille, osa ihmisille</p>
            </div>
          </div>
          <p className="pt-4 border-t">
            Työkalun avulla näet <strong>kuinka paljon rahaa säästyy</strong>, kun botti hoitaa osan tai kaikki kyselyt ihmisten sijaan.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Välilehtien selitykset</h3>
        <p className="text-muted-foreground">
          Alla on yksityiskohtainen kuvaus jokaisesta välilehdestä ja siitä, mitä niissä voi tehdä.
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-destructive" />
            Ihmistyö
          </CardTitle>
          <CardDescription>Pelkän ihmistyön kustannuslaskenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Mitä tämä välilehti näyttää?</strong></p>
          <p>
            Tämä välilehti laskee, paljonko maksaa, jos <strong>kaikki asiakaskyselyt käsitellään ihmisten toimesta</strong>.
          </p>
          <p><strong>Mitä lukuja näet?</strong></p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Kyselymäärä kuukaudessa (esim. 100 kyselyä/kk)</li>
            <li>Työaika per vastaus (esim. 20 minuuttia/kysely)</li>
            <li>Kokonaistyöaika (esim. 33,33 tuntia/kk)</li>
            <li>Tuntiveloitus (esim. 20 €/tunti)</li>
            <li>Työvoimakustannus (tunnit × tuntiveloitus)</li>
            <li>Peruskuukausihinta (kiinteä kuukausikustannus kyselymäärästä riippuen)</li>
            <li><strong>Kokonaiskustannus</strong> (työvoimakustannus + peruskuukausihinta)</li>
          </ul>
          <p className="pt-2 border-t"><strong>Miksi tämä on hyödyllistä?</strong></p>
          <p>
            Näet selkeästi, paljonko pelkkä ihmistyö maksaa. Tätä lukua verrataan muihin vaihtoehtoihin (botti, hybridi) säästöjen laskemiseksi.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Botti
          </CardTitle>
          <CardDescription>Pelkän botin kustannuslaskenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Mitä tämä välilehti näyttää?</strong></p>
          <p>
            Tämä välilehti laskee, paljonko maksaa, jos <strong>kaikki asiakaskyselyt käsitellään botin toimesta</strong>.
          </p>
          <p><strong>Mitä lukuja näet?</strong></p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Kyselymäärä kuukaudessa</li>
            <li>Portaistettu hinta (hinta vaihtelee kyselymäärän mukaan - mitä enemmän kyselyjä, sitä korkeampi hinta)</li>
            <li>Järjestelmäkulut (kiinteät kuukausittaiset kulut)</li>
            <li><strong>Kuukausihinta (kk 2 alkaen)</strong> = Portaistettu hinta + Järjestelmäkulut</li>
            <li>Aloitusmaksu (maksetaan vain kerran ensimmäisellä kuukaudella)</li>
          </ul>
          <p className="pt-2 border-t"><strong>TÄRKEÄÄ ymmärtää:</strong></p>
          <p>
            <strong>Ensimmäinen kuukausi:</strong> Maksat vain aloitusmaksun (kertaluonteinen).<br/>
            <strong>Toisesta kuukaudesta eteenpäin:</strong> Maksat kuukausittain portaistetun hinnan + järjestelmäkulut.
          </p>
          <p className="pt-2"><strong>Miksi portaistettu hinnoittelu?</strong></p>
          <p>
            Mitä enemmän kyselyjä botti käsittelee, sitä enemmän se maksaa - mutta ei suoraan suhteessa. Esimerkiksi 100 kyselyä voi maksaa 400 €, mutta 500 kyselyä ei maksa 2000 € vaan ehkä vain 800 €.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitMerge className="h-5 w-5 text-primary" />
            Hybridi
          </CardTitle>
          <CardDescription>Yhdistelmämalli: botti + ihminen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Mitä tämä välilehti näyttää?</strong></p>
          <p>
            Tämä välilehti laskee kustannukset, kun <strong>osa kyselyistä menee botille ja osa ihmisille</strong>.
          </p>
          <p><strong>Miten hybridi toimii?</strong></p>
          <p>
            Ajatus on, että botin osuus <strong>kasvaa vähitellen</strong>. Esimerkiksi:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Kuukausi 1: Botti hoitaa 10% kyselyistä, ihminen 90%</li>
            <li>Kuukausi 6: Botti hoitaa 25% kyselyistä, ihminen 75%</li>
            <li>Kuukausi 12: Botti hoitaa 40% kyselyistä, ihminen 60%</li>
          </ul>
          <p><strong>Mitä lukuja näet?</strong></p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Keskittämisalennus:</strong> Kun hoidat sekä botin että ihmisen saman järjestelmän kautta, saat alennuksen (synergiahyöty)</li>
            <li><strong>Kuukausittainen taulukko:</strong> Näyttää joka kuukaudelle erikseen, paljonko botti hoitaa, paljonko ihminen hoitaa, ja mitä se maksaa</li>
            <li><strong>Vuosilaskuri:</strong> Laskee kustannukset 0-3 vuoden ajalta</li>
            <li><strong>Säästö vuodessa:</strong> Näyttää, paljonko säästät ensimmäisen vuoden aikana verrattuna pelkkään ihmistyöhön</li>
          </ul>
          <p className="pt-2 border-t"><strong>Miksi hybridimalli?</strong></p>
          <p>
            Harvoin kannattaa siirtyä suoraan 100% bottiin. Hybridimallissa botti oppii vähitellen ja hoitaa ensin helpommat kyselyt, kun taas monimutkaiset kyselyt menevät edelleen ihmisille.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-success" />
            Säästöt
          </CardTitle>
          <CardDescription>Vertaile säästöjä ja kokeile eri skenaarioita</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Mitä tämä välilehti näyttää?</strong></p>
          <p>
            Tämä välilehti <strong>vertailee pelkän ihmistyön ja pelkän botin kustannuksia</strong> ja näyttää, paljonko säästät.
          </p>
          <p><strong>Kaksi osaa:</strong></p>
          <div className="space-y-3 pl-4">
            <div>
              <p className="font-semibold">1. Perusvertailu (ylhäällä)</p>
              <ul className="list-disc list-inside space-y-1 pl-4 mt-1">
                <li>Ihmistyön kustannus (punainen)</li>
                <li>Botin kustannus (sininen)</li>
                <li>Kuukausisäästö (vihreä)</li>
                <li>Säästöprosentti (%)</li>
                <li>Pitkän aikavälin säästöt (3, 6, 12 kuukautta)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">2. Interaktiivinen laskuri (alhaalla)</p>
              <p className="mt-1">
                Täällä voit <strong>itse kokeilla eri lukuja</strong>:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4 mt-1">
                <li>Syötä kyselymäärä (esim. 200 kyselyä/kk)</li>
                <li>Säädä botin osuutta (esim. 50% botti, 50% ihminen)</li>
                <li>Näet heti graafin ja laskelmat</li>
              </ul>
            </div>
          </div>
          <p className="pt-2 border-t"><strong>Miksi tämä on hyödyllistä?</strong></p>
          <p>
            Voit nopeasti testata: "Entä jos meillä on 300 kyselyä kuukaudessa ja botti hoitaa 60% niistä - paljonko säästän?"
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Skenaariot
          </CardTitle>
          <CardDescription>Miten botin osuus vaikuttaa kustannuksiin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Mitä tämä välilehti näyttää?</strong></p>
          <p>
            Tämä välilehti näyttää <strong>miten kustannukset muuttuvat, kun botin osuus kasvaa</strong>.
          </p>
          <p><strong>Miten se toimii?</strong></p>
          <ol className="list-decimal list-inside space-y-1 pl-4">
            <li>Syötä kyselymäärä (esim. 200 kyselyä/kk)</li>
            <li>Työkalu laskee automaattisesti kustannukset, kun:
              <ul className="list-disc list-inside pl-6 mt-1">
                <li>0% botti (= pelkkä ihminen)</li>
                <li>25% botti, 75% ihminen</li>
                <li>50% botti, 50% ihminen</li>
                <li>75% botti, 25% ihminen</li>
                <li>100% botti (= pelkkä botti)</li>
              </ul>
            </li>
            <li>Näet graafin ja taulukon, jossa vertaillaan kaikkia näitä</li>
          </ol>
          <p className="pt-2 border-t"><strong>Mitä opin tästä?</strong></p>
          <p>
            Näet selkeästi: <strong>"Jos botti hoitaa enemmän kyselyjä, kustannukset laskevat."</strong> Mutta näet myös tarkat euromäärät jokaiselle osuudelle.
          </p>
          <p className="pt-2"><strong>Esimerkki:</strong></p>
          <p className="italic">
            "200 kyselyllä pelkkä ihminen maksaa 700 €/kk, mutta jos botti hoitaa 50% kyselyistä, hinta laskee 450 €/kk. Säästö = 250 €/kk!"
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            Asetukset
          </CardTitle>
          <CardDescription>Muokkaa kaikkia laskentaan vaikuttavia arvoja</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong>Mitä tämä välilehti tekee?</strong></p>
          <p>
            Täällä voit <strong>muuttaa kaikkia lukuja, joita laskennassa käytetään</strong>. Kun muutat arvoja täällä, kaikki muut välilehdet päivittyvät automaattisesti.
          </p>
          <p><strong>Mitä voit muuttaa?</strong></p>
          <div className="space-y-3 pl-4">
            <div>
              <p className="font-semibold">1. Kyselymäärät:</p>
              <ul className="list-disc list-inside pl-4">
                <li>Kyselymäärä / kk (esim. 100, 200, 500...)</li>
                <li>Työaika / vastaus minuutteina (esim. 20 min)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">2. Ihmistyön kustannukset:</p>
              <ul className="list-disc list-inside pl-4">
                <li>Tuntiveloitus (€/h)</li>
                <li>Portaistettu peruskuukausihinta (kiinteä kulu eri kyselymäärille)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">3. Botin kiinteät kulut:</p>
              <ul className="list-disc list-inside pl-4">
                <li>Aloitusmaksu (maksetaan kerran)</li>
                <li>Järjestelmäkulut (joka kuukausi)</li>
                <li>Laskuri: Kokeile eri kyselymäärillä</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">4. Botin portaistettu hinnoittelu:</p>
              <ul className="list-disc list-inside pl-4">
                <li>Määritä, paljonko botti maksaa eri kyselymäärillä</li>
                <li>Esim: 100 kyselyä = 400 €, 200 kyselyä = 600 €, jne.</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">5. Botin osuuden kehitys:</p>
              <ul className="list-disc list-inside pl-4">
                <li>Kuukausitaso (1-12 kk): Paljonko botti hoitaa joka kuukausi</li>
                <li>Vuositaso (0-3 vuotta): Botin osuus pidemmällä aikavälillä</li>
              </ul>
            </div>
          </div>
          <p className="pt-2 border-t"><strong>Milloin muutan asetuksia?</strong></p>
          <p>
            Muuta asetuksia, kun haluat laskea kustannukset <strong>omilla luvuillasi</strong>. Esimerkiksi jos tiedät, että tuntiveloitus on 25 € (ei 20 €), tai aloitusmaksu on 1000 € (ei 500 €), muuta ne täällä.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-elegant border-success/20 bg-success/5">
        <CardHeader>
          <CardTitle>Yhteenveto: Miten käytän tätä työkalua?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Suositeltava järjestys:</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>
                <strong>Aloita Asetuksista:</strong> Syötä omat lukusi (kyselymäärät, hinnat, jne.)
              </li>
              <li>
                <strong>Katso Ihmistyö:</strong> Näet, paljonko pelkkä ihmistyö maksaa
              </li>
              <li>
                <strong>Katso Botti:</strong> Näet, paljonko pelkkä botti maksaa
              </li>
              <li>
                <strong>Katso Säästöt:</strong> Vertaile ja kokeile laskurilla eri vaihtoehtoja
              </li>
              <li>
                <strong>Katso Hybridi:</strong> Jos haluat yhdistelmämallin, näet sen kehityksen täällä
              </li>
              <li>
                <strong>Katso Skenaariot:</strong> Kokeile, miten eri botin osuudet vaikuttavat
              </li>
            </ol>
          </div>
          <p className="pt-4 border-t text-foreground">
            💡 <strong>Vinkki:</strong> Voit milloin tahansa palata Asetuksiin ja muuttaa lukuja. Kaikki laskelmat päivittyvät automaattisesti!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
