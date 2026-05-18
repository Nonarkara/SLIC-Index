import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

interface EssayPhoto {
  src: string;
  alt: string;
  caption: string;
  credit?: string;
}

const PHOTOS: Record<string, EssayPhoto> = {
  hero: {
    src: "/photos/city-taipei.jpg",
    alt: "Taipei cityscape at dusk",
    caption: "Taipei — ranked #1 by SLIC when equal weight is applied across all five pillars. It does not rank in any established livability index.",
    credit: "SLIC Index archive",
  },
  melbourne: {
    src: "/photos/report-city-night.jpg",
    alt: "City at night — urban architecture",
    caption: "A city that ranks well and a city where people can afford to live are not always the same city.",
    credit: "SLIC Index archive",
  },
  singapore: {
    src: "/launch-photos/gitex-singapore-2026-02.jpg",
    alt: "Singapore — GITEX Asia 2026",
    caption: "Singapore at GITEX Asia 2026. The city ranks exceptionally by conventional measures. The SLIC civic freedom composite gives it 39 out of 100.",
    credit: "Non Arkara / SLIC Index",
  },
  governance: {
    src: "/photos/profile-roundtable.jpg",
    alt: "City officials in roundtable discussion",
    caption: "Citizen-centric governance is not a technology choice. It is a decision about whose problems the city is trying to solve.",
    credit: "SLIC Index archive",
  },
  transit: {
    src: "/photos/report-city-transit.jpg",
    alt: "Urban transit infrastructure",
    caption: "Transit quality is one of five pillars in the SLIC framework — scored on reach, frequency, and commute burden, not on the age of the rolling stock.",
    credit: "SLIC Index archive",
  },
  london: {
    src: "/photos/city-london.jpg",
    alt: "London streetscape",
    caption: "London — £270–340 per square foot at the £350,000 price point. Ranked among the world's most livable cities. Ranked among the world's least affordable.",
    credit: "SLIC Index archive",
  },
};

const REFS = [
  { id: 1, text: "Economist Intelligence Unit (2024). Global Liveability Index 2024. Economist Intelligence Unit.", url: "https://www.eiu.com/n/campaigns/global-liveability-index-2024/" },
  { id: 2, text: "Porter, T.M. (1995). Trust in Numbers: The Pursuit of Objectivity in Science and Public Life. Princeton University Press." },
  { id: 3, text: "Espeland, W.N. & Stevens, M.L. (1998). Commensuration as a Social Process. Annual Review of Sociology, 24, 313–343." },
  { id: 4, text: "Demographia (2024). 20th Annual Demographia International Housing Affordability Survey. demographia.com." },
  { id: 5, text: "Holt-Lunstad, J., Smith, T.B., Baker, M., Harris, T. & Stephenson, D. (2015). Loneliness and Social Isolation as Risk Factors for Mortality: A Meta-Analytic Review. Perspectives on Psychological Science, 10(2), 227–237." },
  { id: 6, text: "Putnam, R.D. (2000). Bowling Alone: The Collapse and Revival of American Community. Simon & Schuster." },
  { id: 7, text: "World Health Organization (2022). World Mental Health Report: Transforming Mental Health for All. WHO." },
  { id: 8, text: "Kahneman, D. & Deaton, A. (2010). High income improves evaluation of life but not emotional well-being. Proceedings of the National Academy of Sciences, 107(38), 16489–16493." },
  { id: 9, text: "Sen, A. (1999). Development as Freedom. Oxford University Press." },
  { id: 10, text: "Stiglitz, J., Sen, A. & Fitoussi, J.P. (2009). Report by the Commission on the Measurement of Economic Performance and Social Progress. INSEE." },
  { id: 11, text: "Jacobs, J. (1961). The Death and Life of Great American Cities. Random House." },
  { id: 12, text: "Lefebvre, H. (1968). Le Droit à la Ville. Anthropos. [English: The Right to the City, Blackwell, 1996.]" },
  { id: 13, text: "Harvey, D. (2008). The Right to the City. New Left Review, 53, 23–40." },
  { id: 14, text: "Townsend, A.M. (2013). Smart Cities: Big Data, Civic Hackers, and the Quest for a New Utopia. W.W. Norton." },
  { id: 15, text: "Meijer, A. & Bolívar, M.P.R. (2016). Governing the Smart City: A Review of the Literature on Smart Urban Governance. International Review of Administrative Sciences, 82(2), 392–408." },
  { id: 16, text: "Human Rights Measurement Initiative (2024). HRMI Rights Tracker. humanrightsmeasurement.org." },
  { id: 17, text: "Freedom House (2024). Freedom in the World 2024. freedomhouse.org." },
  { id: 18, text: "V-Dem Institute (2024). Democracy Report 2024: Democracy Winning and Losing at the Ballot. University of Gothenburg." },
  { id: 19, text: "Peen, J., Schoevers, R.A., Beekman, A.T. & Dekker, J. (2010). The current status of urban-rural differences in psychiatric disorders. Acta Psychiatrica Scandinavica, 121(2), 84–93." },
  { id: 20, text: "UN-Habitat (2022). World Cities Report 2022: Envisaging the Future of Cities. United Nations Human Settlements Programme." },
];

function Cite({ ids }: { ids: number[] }) {
  return (
    <sup className="essay-cite">
      [{ids.join(", ")}]
    </sup>
  );
}

function Pull({ children }: { children: React.ReactNode }) {
  return <blockquote className="essay-pull">{children}</blockquote>;
}

function Photo({ photo }: { photo: EssayPhoto }) {
  return (
    <figure className="essay-photo">
      <img src={photo.src} alt={photo.alt} loading="lazy" />
      <figcaption>
        <span className="essay-photo-caption">{photo.caption}</span>
        {photo.credit && <span className="essay-photo-credit">{photo.credit}</span>}
      </figcaption>
    </figure>
  );
}

function SectionHead({ number, title }: { number: string; title: string }) {
  return (
    <div className="essay-section-head">
      <span className="essay-section-number">{number}</span>
      <h2 className="essay-section-title">{title}</h2>
    </div>
  );
}

export default function EssayPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath | string) => void;
  locale: Locale;
}) {
  return (
    <div className="essay-page">
      {/* ── Hero ── */}
      <header className="essay-hero">
        <div className="essay-hero-image-wrap">
          <img
            src={PHOTOS.hero.src}
            alt={PHOTOS.hero.alt}
            className="essay-hero-image"
          />
          <div className="essay-hero-overlay" />
        </div>
        <div className="essay-hero-text">
          <p className="essay-eyebrow">SLIC INDEX — LONG READ</p>
          <h1 className="essay-title">The City Is Not a Spreadsheet</h1>
          <p className="essay-subtitle">
            On the politics of urban measurement, the silence beneath prestige,
            and what a better instrument might look like
          </p>
          <p className="essay-byline">Non Arkara &nbsp;·&nbsp; 2026</p>
        </div>
      </header>

      {/* ── Body ── */}
      <article className="essay-body">

        {/* Opening */}
        <div className="essay-prose">
          <p>
            In November 2025, a flood warning reached Nakhon Si Thammarat with a ten-hour lead time. What
            happened next would not make any major city ranking. It will not appear in the EIU Global
            Liveability Index, which charges $935 for a single PDF and has been measuring urban quality
            since 1990 with a methodology it has never fully disclosed.<Cite ids={[1]} /> It will not appear in
            the Mercer Quality of Living Survey, which was designed in the 1980s to calculate hardship
            allowances for multinational executives transferred between cities. And it will certainly not
            appear in the IMD Smart City Index, which surveys 120 residents per city and reports the
            results to four decimal places.
          </p>
          <p>
            What happened in Nakhon Si Thammarat was this: city officials activated 70 CCTV-monitored
            pumping stations, the mayor stood in floodwater directing operations in person, and 40,000
            residents received alerts and shelter information within hours. The system worked not because
            the city had invested in expensive enterprise software, but because it had spent years building
            something that no index has ever figured out how to score: trust.
          </p>
          <p>
            The mayor had a phrase for what he was trying to build. He called solutions{" "}
            <em>edible</em> — so simple and direct in their benefit that an elderly street vendor
            who had never owned a smartphone could understand why she needed one. His deputy told me
            about a woman who sold grilled corn near the old market. She did not know what a QR code was.
            She did know that since she started using it, she had stopped losing money when customers
            claimed not to have cash. The technology was invisible. The benefit was not.
          </p>
          <p>
            This essay is about that gap. Between what cities measure about themselves and what it
            actually costs to live in them.
          </p>
        </div>

        <Photo photo={PHOTOS.melbourne} />

        {/* Section I */}
        <SectionHead number="I." title="The Archaeology of a Score" />
        <div className="essay-prose">
          <p>
            The EIU Global Liveability Index began as a tool for corporate actuaries — specifically,
            to calculate whether an expatriate executive transferred from London to Lagos should receive a
            hardship supplement, and if so, how much. The index's five categories — stability, healthcare,
            culture and environment, infrastructure, education — were chosen because they were legible to
            the actuarial imagination. They were not chosen because they had any particular relationship
            to whether people could afford to live, whether they felt they belonged, or whether their
            children could breathe the air.
          </p>
          <p>
            The index has since been repurposed as a general liveability ranking, reported annually in
            newspapers across every one of its measured cities. Vienna wins most years. Melbourne wins
            some years. The methodology costs $935 to read.<Cite ids={[1]} /> The data behind it is largely
            self-reported by city governments.
          </p>
          <p>
            This is not a minor methodological footnote. Theodore Porter, in{" "}
            <em>Trust in Numbers</em>, argues that quantification earns legitimacy partly through the
            obscuration of its own construction — that a number, once produced, tends to be treated as
            if the choices that produced it were either absent or inevitable.<Cite ids={[2]} /> The EIU
            ranking is a particularly elegant example of this. The choices were neither absent nor
            inevitable: they were made by insurance companies and corporate relocation consultants in
            the late twentieth century and have been inherited, with minor modification, by a system that
            now claims to tell 170 cities and their residents how well their lives are going.
          </p>

          <Pull>
            The ranking rewards the city's ability to represent itself well to outside judges.
            The judges are not residents. The documentation is not cheap to produce.
          </Pull>

          <p>
            The circularity is also worth naming. John, a former senior official in Melbourne's city
            government — Melbourne has ranked in the EIU top ten consistently for over a decade —
            described to me how a significant portion of his team's time was allocated, each year, to
            preparing documentation intended to influence the assessment. The ranking rewards the city's
            ability to represent itself well to outside judges. The judges are not residents. The
            documentation is not cheap to produce. The housing median in Melbourne, meanwhile, reached
            AU$953,000 in 2024, with rents rising 43 percent in five years.<Cite ids={[4]} />
          </p>
          <p>
            Wendy Espeland and Mitchell Stevens, in their landmark account of commensuration as a social
            process, observe that ranking systems do not merely measure the world — they reorganise
            it.<Cite ids={[3]} /> Cities that rank well attract the capital that makes them rank better.
            Cities that rank poorly lose the investment that might have helped them improve. The index
            does not describe an equilibrium; it enforces one.
          </p>
        </div>

        {/* Section II */}
        <SectionHead number="II." title="The Silence Beneath the Score" />
        <div className="essay-prose">
          <p>
            I have a friend — I will call him Kenny — who is a senior executive in Singapore. By every
            available index, Singapore is an exceptional city: world-class infrastructure, among the
            lowest crime rates in Asia, one of the most efficient public transit systems on earth, and
            an education system that consistently outperforms every OECD comparison. Kenny is good at his
            job and he is paid well. He is also gay, in a country that criminalised male homosexuality
            until 2022 and still does not recognise same-sex partnerships or permit gay couples to adopt.
          </p>
          <p>
            Kenny has been with his partner for eleven years. His company knows he is gay. He told me
            once, very carefully, that he believes his last two promotion cycles were affected by this.
            He cannot prove it. He does not intend to try. He will probably leave Singapore in the next
            three years — not because the food is bad or the trains are late, but because the city has
            communicated to him, repeatedly and structurally, that his life is tolerated rather than
            valued.
          </p>
          <p>
            This is not in any index.
          </p>
        </div>

        <Photo photo={PHOTOS.singapore} />

        <div className="essay-prose">
          <p>
            There is another person I want to tell you about. I will call her Chen. She moved from
            Shenzhen to Brussels eight years ago for her husband's work. She speaks excellent French and
            reasonable Dutch. She has a son who plays football with Belgian children and a daughter who
            reads in three languages. She told me, when I met her at a conference in Taipei, that she
            does not have a single Belgian friend. Not because Belgians are unkind — she insisted on
            this — but because the city has no infrastructure for the kind of belonging she is trying to
            build. Her network is Chinese expats, her husband's colleagues, her children's school parents.
            She feels, she said, like a guest in a very well-organised apartment.
          </p>
          <p>
            Brussels scores well on most liveability indices. Reasonable healthcare, solid transit,
            acceptable air quality, cultural institutions. The indices have no way to ask whether a woman
            from Shenzhen has been able, after eight years, to feel at home.
          </p>
          <p>
            The research literature has been building, slowly and somewhat grimly, toward a reckoning
            with this gap. Julianne Holt-Lunstad and her colleagues published, in 2015, a meta-analysis
            of 70 studies covering 3.4 million participants, finding that social isolation and loneliness
            increase mortality risk by roughly 29 and 26 percent respectively — effects comparable to
            smoking fifteen cigarettes a day.<Cite ids={[5]} /> The same year, Robert Putnam's work on
            social capital had already been warning for two decades that the erosion of civic
            connectedness was producing measurable damage to human health, political participation, and
            institutional trust.<Cite ids={[6]} /> None of this is captured by a ranking system that
            measures "culture and environment" by counting opera houses.
          </p>
          <p>
            Vienna, to its credit, has beautiful opera houses. It also has one of the higher suicide
            rates among developed-world capital cities — a statistic that did not prevent it from
            ranking first, second, or third on the EIU index for most years between 2009 and
            2024.<Cite ids={[7, 19]} /> I am not suggesting that Vienna is a miserable city. I am
            suggesting that a ranking system which cannot see its suicide rate while awarding it first
            place is measuring something other than what it claims to measure.
          </p>

          <Pull>
            A ranking system which cannot see Vienna's suicide rate while awarding it first place
            is measuring something other than what it claims to measure.
          </Pull>

          <p>
            Daniel Kahneman and Angus Deaton, in their widely cited 2010 study of income and wellbeing,
            found that emotional wellbeing — how people actually feel day to day — plateaus at around
            $75,000 annual income, while life satisfaction (the evaluative judgment of whether one's life
            is going well) continues to rise with income.<Cite ids={[8]} /> What this means for city
            ranking is underappreciated: most of the indicators that conventional indices use —
            infrastructure quality, institutional density, economic output — track life satisfaction as
            evaluated by external experts, not emotional wellbeing as experienced by residents. These
            are related but not identical, and the gap between them is exactly where Kenny lives.
          </p>
        </div>

        {/* Section III */}
        <SectionHead number="III." title="What a Different Instrument Would Look Like" />

        <Photo photo={PHOTOS.governance} />

        <div className="essay-prose">
          <p>
            Amartya Sen spent a career arguing, in{" "}
            <em>Development as Freedom</em> and elsewhere, that the right question is not what people
            have but what they are able to do and to be — what he called capabilities.<Cite ids={[9]} /> The
            capability approach begins not with income or institutional counts but with the actual
            freedoms people can exercise: the freedom to live a long and healthy life, to receive an
            education, to participate in political life, to move through a city without fear, to love who
            you love without professional consequence. A city ranking built on Sen's framework would look
            very different from what currently exists.
          </p>
          <p>
            It would also be harder to sell to institutional investors.
          </p>
          <p>
            The Stiglitz-Sen-Fitoussi commission, convened by the French government in 2008 and reporting
            in 2009, concluded that GDP and related productivity measures systematically fail to capture
            what actually matters to people's lives — sustainability, distribution, the quality of work,
            the security of the future.<Cite ids={[10]} /> The commission's report ran to 291 pages and
            was widely praised. Most city rankings continued unchanged.
          </p>
          <p>
            The SLIC Index — Smart and Liveable Cities Index — is an attempt to build something closer
            to what Sen and Stiglitz describe, with the significant constraint that I am not an economist,
            not a government, and not a research institution with a budget. I am a person with a laptop,
            a methodology that is published in full and free to read, and a persistent objection to the
            idea that Melbourne is the most livable city on earth for a family earning a median income.
          </p>
          <p>
            The five pillars of SLIC correspond to five questions a person building a life in a city
            would actually need answered. Can I afford to live here after rent? (<em>Growth.</em>) Is it
            safe and clean and connected? (<em>Viability.</em>) Can my children get good healthcare and
            education? (<em>Capability.</em>) Will I be welcome, or merely tolerated?{" "}
            (<em>Community.</em>) Is the city generating the kind of economic energy that creates
            opportunity over time? (<em>Creative.</em>) These are weighted by the evidence rather than by
            what is convenient to measure, and the data sources are cited, every one of them, so that
            any reader who doubts a number can go and look at where it came from.
          </p>

          <Pull>
            Kaohsiung — a port city in southern Taiwan — ranks first when equal weight is applied
            across all five pillars. It does not appear on any established liveability list.
          </Pull>

          <p>
            The results are uncomfortable for anyone who has been reading the EIU index as a proxy for
            where to live. By the SLIC scoring, Kaohsiung — a port city in southern Taiwan that does
            not appear in any established liveability list — ranks near the top. Vienna ranks in the
            mid-thirties. The difference is not aesthetic. Vienna is unquestionably more beautiful. It
            is also, for a person earning a local salary, significantly harder to afford, less tolerant
            of LGBTQ+ residents than the indices suggest, and carries a mental-health burden that no
            conventional ranking currently penalises.
          </p>
          <p>
            Jane Jacobs, who understood cities better than most people who have been paid to study them,
            wrote in <em>The Death and Life of Great American Cities</em> that the fundamental problem
            with urban planning was its tendency to substitute abstract categories for specific,
            observable human behaviours.<Cite ids={[11]} /> The planners she was criticising built
            highways through neighbourhoods because their models said the neighbourhood had too low a
            density — without observing that the neighbourhood was, by every measure visible to its
            residents, thriving. The ranking industry has a version of the same problem. It measures
            what is legible to its methodology and reports the results as if legibility were a property
            of the city rather than of the instrument.
          </p>
        </div>

        <Photo photo={PHOTOS.transit} />

        {/* Section IV */}
        <SectionHead number="IV." title="The Four Principles, Applied Imperfectly" />
        <div className="essay-prose">
          <p>
            What I have learned, from trying to build a better instrument and from watching what works in
            cities like Nakhon Si Thammarat, can be compressed — imperfectly — into four things.
          </p>
          <p>
            The first is <strong>purpose</strong>. The question is not "does this city have smart city
            technology?" but "does this city solve the actual problems of the people who live in it?"
            These questions have different answers. Songdo, in South Korea, was built as a showcase of
            intelligent urban infrastructure and was for years one of the least inhabited cities of its
            size in the developed world. Nakhon Si Thammarat, with a fraction of the technology budget,
            deployed a citizen-reporting system via LINE — a messaging app most residents already used —
            and reduced average problem-resolution time from two weeks to 42 hours. The purpose was to
            serve residents. The technology was incidental.<Cite ids={[14, 15]} />
          </p>
          <p>
            The second is <strong>practicality</strong>. I am suspicious of any urban intervention that
            cannot be explained to the street vendor selling grilled corn. This is not anti-intellectualism.
            It is a recognition that the gap between a system's technical sophistication and a resident's
            ability to use it is itself a cost — one that is rarely counted in the index of what was
            spent.
          </p>
          <p>
            The third is <strong>proof</strong>. The riskiest moment in any urban innovation is the
            transition from "this worked for ten people" to "therefore we should implement it
            city-wide." Anthony Townsend, in <em>Smart Cities</em>, documents the wreckage of urban
            technology projects that skipped the intermediate steps: pilot, evaluate, revise,
            scale.<Cite ids={[14]} /> A telemedicine programme in Rayong province worked because the city
            tested devices with 40 residents, measured the results, and only then made a recommendation.
            Eighty-five percent reduction in hospital visits. That is a number I trust because I know how
            it was counted.
          </p>
          <p>
            The fourth is <strong>people</strong>. Not people as abstract beneficiaries, but people as
            the thing a city is actually for — their time, their belonging, their freedom to live a life
            that feels like their own rather than like a compromise with a system designed for someone
            else. Robert Putnam's term for this is social capital.<Cite ids={[6]} /> Henri Lefebvre's
            term is the right to the city.<Cite ids={[12]} /> David Harvey's term is the collective power
            to reshape the processes of urbanisation.<Cite ids={[13]} /> I am not sure any of these fully
            captures what Kenny described to me when he said that the city communicates, structurally,
            whether your life is valued or merely tolerated. But I think they are all pointing at the
            same thing.
          </p>
        </div>

        {/* Section V */}
        <SectionHead number="V." title="What This Instrument Cannot Do" />

        <Photo photo={PHOTOS.london} />

        <div className="essay-prose">
          <p>
            I want to be honest about the limits of SLIC, because I am suspicious of indices that are not.
          </p>
          <p>
            SLIC cannot measure what Kenny feels when he understands that his career has been quietly
            managed around him. It can measure the legal status of same-sex relationships in Singapore,
            the Freedom House score, the HRMI Empowerment rating, the V-Dem Liberal Democracy
            Index.<Cite ids={[16, 17, 18]} /> It cannot measure the particular texture of a conversation
            Kenny had with his manager two years ago, in which nothing was said that could be quoted in
            any complaint, and everything was understood.
          </p>
          <p>
            SLIC cannot measure what Chen has not been able to build in eight years in Brussels. It can
            measure net migration rates, multilingual service availability, social trust indices. It
            cannot measure the specific weight of sitting alone at a school event while other parents
            talk in clusters that do not open.
          </p>
          <p>
            What SLIC can do — and I think this matters — is name these absences. The civic freedom and
            dignity metric added to the index in 2026 gives Singapore a score of 39 out of 100. The
            methodology is transparent: it is a composite of the Human Rights Measurement Initiative's
            Empowerment score, the Freedom House index, and the V-Dem Liberal Democracy Index.<Cite ids={[16, 17, 18]} />{" "}
            You can disagree with the weights. You can disagree with the sources. You cannot, looking at
            that score, pretend that the index does not know Kenny exists.
          </p>
          <p>
            Whether that is enough is a question I am still sitting with.
          </p>
          <p>
            The street vendor in Nakhon Si Thammarat did not ask for a QR code. She asked, at some
            point, for a way to get paid reliably. The technology that gave her that was invisible.
            The benefit was not. I keep coming back to this as the measure of what any city instrument
            should eventually be able to say: not "this city has 47 data governance initiatives" but
            "this woman can now get paid reliably."
          </p>
          <p>
            Most liveability rankings cannot say the second thing. They can say the first, at length,
            for $935 a year.
          </p>
          <p>
            This essay is free. The data behind it is free. The methodology is published. And I am still,
            genuinely, not certain I have got it right. But I am certain that the alternative — treating
            the EIU index as a proxy for where human lives go well — is a choice with consequences, and
            not a neutral one. Kenny, Chen, and the woman with the QR code are all paying some version
            of that tab.
          </p>

          <Pull>
            I am still, genuinely, not certain I have got it right. But I am certain that the
            alternative is a choice with consequences, and not a neutral one.
          </Pull>

          <p>
            Henri Lefebvre argued, in 1968, that the city is not a consumer good or a technical
            achievement — it is a collective work, produced by the labour and imagination of its
            inhabitants, and the right to the city is therefore the right to participate in that
            production.<Cite ids={[12]} /> Most of what we call urban measurement today does not measure
            this participation. It measures what the city looks like from the outside, to someone who
            is not staying.
          </p>
          <p>
            The question I would want any city ranking to answer — the question I am still trying to
            build SLIC toward answering — is simpler than all of this. It is the question the grilled-
            corn vendor was implicitly asking when she adopted a QR code she did not understand: does
            this place work for me?
          </p>
          <p>
            That question does not have a tidy answer. But it is, I think, the right one to be asking.
          </p>
        </div>

        {/* References */}
        <section className="essay-references">
          <h3 className="essay-references-head">References</h3>
          <ol className="essay-references-list">
            {REFS.map((ref) => (
              <li key={ref.id} id={`ref-${ref.id}`} className="essay-reference-item">
                <span className="essay-reference-number">{ref.id}.</span>
                {ref.url ? (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="essay-reference-text">
                    {ref.text}
                  </a>
                ) : (
                  <span className="essay-reference-text">{ref.text}</span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Medium links */}
        <section className="essay-further">
          <p className="essay-further-head">RELATED WRITING</p>
          <div className="essay-further-links">
            <a
              href="https://medium.com/design-bootcamp/your-city-won-most-livable-your-therapist-disagrees-f2f782859c8e"
              target="_blank"
              rel="noopener noreferrer"
              className="essay-further-item"
            >
              <span className="essay-further-label">Medium — Design Bootcamp</span>
              <span className="essay-further-title">Your City Won 'Most Livable.' Your Therapist Disagrees.</span>
            </a>
            <a
              href="https://nonsmartcity.medium.com/every-city-ranking-is-a-lie-heres-ours-80f95411731a"
              target="_blank"
              rel="noopener noreferrer"
              className="essay-further-item"
            >
              <span className="essay-further-label">Medium</span>
              <span className="essay-further-title">Every City Ranking is a Lie. Here's Ours.</span>
            </a>
            <a
              href="https://nonsmartcity.medium.com/smart-and-livable-cities-manifesto-slic-manifesto-249074cdb122"
              target="_blank"
              rel="noopener noreferrer"
              className="essay-further-item"
            >
              <span className="essay-further-label">Medium</span>
              <span className="essay-further-title">Smart and Livable Cities Manifesto</span>
            </a>
            <a
              href="https://nonsmartcity.medium.com/citizen-centric-smart-city-an-ultimate-handbook-1c07f1b7256a"
              target="_blank"
              rel="noopener noreferrer"
              className="essay-further-item"
            >
              <span className="essay-further-label">Medium</span>
              <span className="essay-further-title">Citizen-Centric Smart City: An Ultimate Handbook</span>
            </a>
          </div>
        </section>

      </article>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </div>
  );
}
