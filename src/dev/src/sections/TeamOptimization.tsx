import React from 'react';
import { 
  HiUsers,
  HiAcademicCap,
  HiChartBarSquare,
  HiCog6Tooth
} from 'react-icons/hi2';

interface TeamOptimizationProps {
  isDarkTheme: boolean;
}

const TeamOptimization: React.FC<TeamOptimizationProps> = ({ isDarkTheme }) => {
  return (
    <section className="nordic-section">
      <div className="nordic-container-wide">
        <div className="nordic-grid-magazine">
          <div>
            <div className="nordic-h3" style={{color: 'var(--text-muted)', marginBottom: 'var(--space-sm)'}}>
              Intelligent Organisering
            </div>
            <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
              Teamoptimalisering
            </h1>
            <p className="nordic-body-large">
              AI-drevet teamsammensetning og prosjektanalyse som optimaliserer 
              produktivitet og balanserer arbeidsbelastning automatisk.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="nordic-card" style={{padding: 'var(--space-lg)'}}>
              <div className="nordic-caption mb-2">Teamstatus</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Aktive Medlemmer</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>6 Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Arbeidsbalanse</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>Optimalisert</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Produktivitet</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-primary)'}}>+18%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-16" style={{marginTop: 'var(--space-3xl)'}}>
          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiAcademicCap className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Kompetansematching</h3>
                  <p className="nordic-caption">Intelligent Rolletildeling</p>
                </div>
              </div>
              <p className="nordic-body">
                Analyserer utvikleres ekspertise og matcher dem med oppgaver 
                som maksimerer både læring og produktivitet.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Matchingkriterier</div>
              <div className="space-y-3 text-sm">
                <div>• Teknisk ekspertise</div>
                <div>• Tidligere prosjekterfaring</div>
                <div>• Læringspreferanser</div>
                <div>• Tidssonepåvirkning</div>
              </div>
            </div>
          </div>

          <div className="nordic-grid-feature" style={{gridTemplateColumns: '3fr 5fr'}}>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Ytelsesmålinger</div>
              <div className="space-y-3 text-sm">
                <div>• Kodegjennomgang hastighet</div>
                <div>• Feilrate reduksjon</div>
                <div>• Samarbeidsscore</div>
                <div>• Mentoring aktivitet</div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiChartBarSquare className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Produktivitetsanalyse</h3>
                  <p className="nordic-caption">Databaserte Innsikter</p>
                </div>
              </div>
              <p className="nordic-body">
                Dyptgående analyse av teamdynamikk og individuelle bidrag 
                for kontinuerlig forbedring av arbeidsflyt.
              </p>
            </div>
          </div>

          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiCog6Tooth className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Automatisk Arbeidsbalansering</h3>
                  <p className="nordic-caption">Adaptiv Oppgavedistribusjon</p>
                </div>
              </div>
              <p className="nordic-body">
                Intelligent fordeling av oppgaver som tar hensyn til 
                arbeidsbelastning, ferdigheter og personlige preferanser.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Balanseringsfaktorer</div>
              <div className="space-y-3 text-sm">
                <div>• Gjeldende arbeidsbelastning</div>
                <div>• Oppgavekompleksitet</div>
                <div>• Tidsfrister og prioritet</div>
                <div>• Personlig utvikling mål</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamOptimization;