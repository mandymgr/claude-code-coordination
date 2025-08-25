import React from 'react';
import { 
  HiOutlineShieldCheck,
  HiCommandLine,
  HiUsers,
  HiCog6Tooth
} from 'react-icons/hi2';

interface SessionCoordinationProps {
  isDarkTheme: boolean;
}

const SessionCoordination: React.FC<SessionCoordinationProps> = ({ isDarkTheme }) => {
  return (
    <section className="nordic-section">
      <div className="nordic-container-wide">
        <div className="nordic-grid-magazine">
          <div>
            <div className="nordic-h3" style={{color: 'var(--text-muted)', marginBottom: 'var(--space-sm)'}}>
              Terminal Koordinering
            </div>
            <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
              Sesjonskoordinering
            </h1>
            <p className="nordic-body-large">
              Intelligent administrasjon av multi-terminal sesjoner som sikrer 
              sømløs koordinering og automatisk tilstandssynkronisering.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="nordic-card" style={{padding: 'var(--space-lg)'}}>
              <div className="nordic-caption mb-2">Sesjonsstatus</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Aktive Sesjoner</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-primary)'}}>3 Terminaler</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Synkroniserte Kommandoer</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>127 I Dag</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Uptime</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>5h 23m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-16" style={{marginTop: 'var(--space-3xl)'}}>
          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiCommandLine className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Multi-Terminal Synkronisering</h3>
                  <p className="nordic-caption">Intelligent Kommandokoordinering</p>
                </div>
              </div>
              <p className="nordic-body">
                Automatisk synkronisering av kommandoer, miljøvariabler og 
                arbeidskataloger på tvers av alle Claude Code instanser.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Synkroniserte Elementer</div>
              <div className="space-y-3 text-sm">
                <div>• Kommandohistorikk</div>
                <div>• Miljøvariabler</div>
                <div>• Arbeidskataloger</div>
                <div>• Terminal tilstand</div>
              </div>
            </div>
          </div>

          <div className="nordic-grid-feature" style={{gridTemplateColumns: '3fr 5fr'}}>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Sesjonsadministrasjon</div>
              <div className="space-y-3 text-sm">
                <div>• Automatisk gjenoppretting</div>
                <div>• Sesjon persistering</div>
                <div>• Tilstandsbackup</div>
                <div>• Feilhåndtering</div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiOutlineShieldCheck className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Robust Sesjonshåndtering</h3>
                  <p className="nordic-caption">Automatisk Recovery</p>
                </div>
              </div>
              <p className="nordic-body">
                Intelligente backup- og gjenopprettingsmekanismer som sikrer 
                kontinuitet selv ved uventede avbrudd eller systemfeil.
              </p>
            </div>
          </div>

          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiCog6Tooth className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Adaptive Konfigurering</h3>
                  <p className="nordic-caption">Personaliserte Arbeidsflyter</p>
                </div>
              </div>
              <p className="nordic-body">
                Lærende konfigurasjoner som tilpasser seg din arbeidsflyt 
                og optimaliserer sesjonsoppsettet basert på bruksmønstre.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Tilpasningsmuligheter</div>
              <div className="space-y-3 text-sm">
                <div>• Prosjektspesifikke profiler</div>
                <div>• Kommandoaliaser</div>
                <div>• Terminal preferanser</div>
                <div>• Workflow automatisering</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SessionCoordination;