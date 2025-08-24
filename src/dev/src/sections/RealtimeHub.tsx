import React from 'react';
import { 
  HiGlobeAlt,
  HiUsers,
  HiChatBubbleLeftRight,
  HiSignal
} from 'react-icons/hi2';

interface RealtimeHubProps {
  isDarkTheme: boolean;
}

const RealtimeHub: React.FC<RealtimeHubProps> = ({ isDarkTheme }) => {
  return (
    <section className="nordic-section">
      <div className="nordic-container-wide">
        <div className="nordic-grid-magazine">
          <div>
            <div className="nordic-h3" style={{color: 'var(--text-muted)', marginBottom: 'var(--space-sm)'}}>
              Sanntidssamarbeid
            </div>
            <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
              Sanntidshub
            </h1>
            <p className="nordic-body-large">
              WebSocket-basert direktesamarbeid som muliggjør sømløs koordinering 
              og øyeblikkelig synkronisering mellom teammedlemmer.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="nordic-card" style={{padding: 'var(--space-lg)'}}>
              <div className="nordic-caption mb-2">Tilkoblingsstatus</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">WebSocket Hub</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>Tilkoblet</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Aktive Brukere</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>4 Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Synkronisering</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-primary)'}}>Sanntid</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-16" style={{marginTop: 'var(--space-3xl)'}}>
          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiSignal className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Øyeblikkelig Synkronisering</h3>
                  <p className="nordic-caption">Sub-sekund Responstid</p>
                </div>
              </div>
              <p className="nordic-body">
                Alle endringer propagerer øyeblikkelig til alle tilkoblede instanser 
                med optimalisert WebSocket-arkitektur for minimal latens.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Synkroniserte Elementer</div>
              <div className="space-y-3 text-sm">
                <div>• Fillåser og releases</div>
                <div>• Aktive sesjoner</div>
                <div>• Prosjektstatus</div>
                <div>• Teammedlemaktivitet</div>
              </div>
            </div>
          </div>

          <div className="nordic-grid-feature" style={{gridTemplateColumns: '3fr 5fr'}}>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Samarbeidsverktøy</div>
              <div className="space-y-3 text-sm">
                <div>• Live kursorposisjonering</div>
                <div>• Samtidige redigeringer</div>
                <div>• Delt terminal sessioner</div>
                <div>• Integrert chat</div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiChatBubbleLeftRight className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Integrert Kommunikasjon</h3>
                  <p className="nordic-caption">Sømløs Teamkoordinering</p>
                </div>
              </div>
              <p className="nordic-body">
                Innebygd chat og kommentarsystem som holder kommunikasjonen 
                kontekstuel og direkte knyttet til kodeendringer.
              </p>
            </div>
          </div>

          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiUsers className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Smart Romadministrasjon</h3>
                  <p className="nordic-caption">Automatisk Organisering</p>
                </div>
              </div>
              <p className="nordic-body">
                Intelligente samarbeidsrom som automatisk grupperer teammedlemmer 
                basert på prosjekt, oppgave eller kodeavsnitt.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Romfunksjoner</div>
              <div className="space-y-3 text-sm">
                <div>• Prosjektbaserte rom</div>
                <div>• Oppgavespesifikke kanaler</div>
                <div>• Privat pair programming</div>
                <div>• Team brainstorming</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealtimeHub;