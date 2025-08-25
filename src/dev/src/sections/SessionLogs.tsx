import React from 'react';
import { 
  HiOutlineDocumentText,
  HiOutlineChartBarSquare,
  HiMagnifyingGlass,
  HiArrowDownTray
} from 'react-icons/hi2';

interface SessionLogsProps {
  isDarkTheme: boolean;
}

const SessionLogs: React.FC<SessionLogsProps> = ({ isDarkTheme }) => {
  return (
    <section className="nordic-section">
      <div className="nordic-container-wide">
        <div className="nordic-grid-magazine">
          <div>
            <div className="nordic-h3" style={{color: 'var(--text-muted)', marginBottom: 'var(--space-sm)'}}>
              Samtalehistorikk
            </div>
            <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
              Sesjonslogger
            </h1>
            <p className="nordic-body-large">
              Komplett loggingssystem som fanger opp alle interaksjoner, 
              beslutninger og systemhendelser for analyse og sporing.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="nordic-card" style={{padding: 'var(--space-lg)'}}>
              <div className="nordic-caption mb-2">Loggstatus</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Totale Oppføringer</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-primary)'}}>1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">I Dag</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Lagringsstørrelse</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>12.4 MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-16" style={{marginTop: 'var(--space-3xl)'}}>
          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiOutlineDocumentText className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Strukturert Logging</h3>
                  <p className="nordic-caption">JSON-basert Format</p>
                </div>
              </div>
              <p className="nordic-body">
                Alle logger lagres i strukturert JSON-format som gjør dem 
                enkle å søke, filtrere og analysere programmatisk.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Loggkategorier</div>
              <div className="space-y-3 text-sm">
                <div>• AI-interaksjoner</div>
                <div>• Filoperasjoner</div>
                <div>• Teamsamarbeid</div>
                <div>• Systemhendelser</div>
              </div>
            </div>
          </div>

          <div className="nordic-grid-feature" style={{gridTemplateColumns: '3fr 5fr'}}>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Søkefunksjoner</div>
              <div className="space-y-3 text-sm">
                <div>• Tidsbasert filtrering</div>
                <div>• Keyword søk</div>
                <div>• Brukerbasert sorting</div>
                <div>• Regex mønster</div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiMagnifyingGlass className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Avansert Søk og Analyse</h3>
                  <p className="nordic-caption">Intelligent Filtrering</p>
                </div>
              </div>
              <p className="nordic-body">
                Kraftige søkeverktøy med regex-støtte og intelligent 
                filtrering for rask oppdagelse av spesifikke hendelser.
              </p>
            </div>
          </div>

          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiArrowDownTray className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Eksport og Rapporter</h3>
                  <p className="nordic-caption">Fleksibel Dataeksport</p>
                </div>
              </div>
              <p className="nordic-body">
                Eksporter logger i flere formater for videre analyse, 
                rapportering eller integrasjon med andre systemer.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Eksportformater</div>
              <div className="space-y-3 text-sm">
                <div>• JSON dump</div>
                <div>• CSV rapport</div>
                <div>• Excel arbeidsbok</div>
                <div>• PDF sammendrag</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SessionLogs;