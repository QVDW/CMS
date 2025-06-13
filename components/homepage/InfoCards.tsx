import { FaCheckCircle } from "react-icons/fa";
export default function InfoCards() {

  return (
    <section className="info-cards-section">
      <h1>Alles wat uw website nodig heeft</h1>
      <div className="info-cards-container">
        <div className="info-card">
          <h2>Website</h2>
          <ul>
            <li><FaCheckCircle />Professioneel webdesign</li>
            <li><FaCheckCircle />Mobielvriendelijk (responsive)</li>
            <li><FaCheckCircle />Snel & gebruiksvriendelijk</li>
            <li><FaCheckCircle />Gebruiksvriendelijk Admin Dashboard</li>
          </ul>
        </div>
        <div className="info-card">
          <h2>Hosting</h2>
          <ul>
            <li><FaCheckCircle />Website onderhoud</li>
            <li><FaCheckCircle />Regelmatige updates</li>
            <li><FaCheckCircle />Beveiliging & back-ups</li>
            <li><FaCheckCircle />Kleine aanpassingen</li>
            <li><FaCheckCircle />Technische support</li>
            <li><FaCheckCircle />Snelle & veilige hosting</li>
            <li><FaCheckCircle />Domein registratie</li>
            <li><FaCheckCircle />Email accounts met domein naam</li>
          </ul>
        </div>
        <div className="info-card">
          <h2>SEO</h2>
          <ul>
            <li><FaCheckCircle />Technische SEO-audit</li>
            <li><FaCheckCircle />Zoekwoordenonderzoek</li>
            <li><FaCheckCircle />Optimalisatie van pagina’s & content</li>
            <li><FaCheckCircle />Meta titles & descriptions</li>
            <li><FaCheckCircle />Google Search Console integratie</li>
          </ul>
        </div>
      </div>
    </section>
  );
} 