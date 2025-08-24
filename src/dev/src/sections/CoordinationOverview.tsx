import React from 'react';
import { 
  HiOutlineCube,
  HiCpuChip,
  HiGlobeAlt
} from 'react-icons/hi2';

interface CoordinationOverviewProps {
  isDarkTheme: boolean;
}

const CoordinationOverview: React.FC<CoordinationOverviewProps> = ({ isDarkTheme }) => {
  return (
    <section className="nordic-section">
      <div className="nordic-container-wide">
        <div className="nordic-grid-magazine">
          <div>
            <div className="nordic-h3" style={{color: 'var(--text-muted)', marginBottom: 'var(--space-sm)'}}>
              Utviklingssystem
            </div>
            <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
              Koordinasjonsoversikt
            </h1>
            <p className="nordic-body-large">
              Avansert multi-terminal AI-system for intelligent filkoordinering, 
              sanntidssamarbeid og AI-drevet utviklingsoptimalisering.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="nordic-card" style={{padding: 'var(--space-lg)'}}>
              <div className="nordic-caption mb-2">Systemstatus</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">AI-Motor</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>Aktiv</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">WebSocket Hub</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>Tilkoblet</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Fillåser</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-primary)'}}>3 Aktive</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-16" style={{marginTop: 'var(--space-3xl)'}}>
          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiCpuChip className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">AI-Funksjoner</h3>
                  <p className="nordic-caption">Avansert Intelligens</p>
                </div>
              </div>
              <p className="nordic-body">
                AI-drevne oppgaveforslag, intelligent konfliktløsning 
                og automatisert optimalisering for utviklingsarbeidsflyt.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Muligheter</div>
              <div className="space-y-3 text-sm">
                <div>• Smart filkoordinering</div>
                <div>• Konfliktforebygging</div>
                <div>• Oppgaveautomatisering</div>
                <div>• Ytelsesoptimalisering</div>
              </div>
            </div>
          </div>

          <div className="nordic-grid-feature" style={{gridTemplateColumns: '3fr 5fr'}}>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Sanntidsstatus</div>
              <div className="space-y-3 text-sm">
                <div>• Direktesamarbeid</div>
                <div>• WebSocket-koordinering</div>
                <div>• Sesjonsadministrasjon</div>
                <div>• Multi-terminal synkronisering</div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiGlobeAlt className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Sanntidshub</h3>
                  <p className="nordic-caption">Direktesamarbeid</p>
                </div>
              </div>
              <p className="nordic-body">
                WebSocket-basert sanntidskoordinering som muliggjør sømløst samarbeid 
                på tvers av flere terminalinstanser med øyeblikkelig synkronisering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoordinationOverview;