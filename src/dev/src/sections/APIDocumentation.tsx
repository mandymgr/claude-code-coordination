import React from 'react';
import { 
  HiCommandLine,
  HiCodeBracket,
  HiBookOpen,
  HiCog6Tooth
} from 'react-icons/hi2';

interface APIDocumentationProps {
  isDarkTheme: boolean;
}

const APIDocumentation: React.FC<APIDocumentationProps> = ({ isDarkTheme }) => {
  return (
    <section className="nordic-section">
      <div className="nordic-container-wide">
        <div className="nordic-grid-magazine">
          <div>
            <div className="nordic-h3" style={{color: 'var(--text-muted)', marginBottom: 'var(--space-sm)'}}>
              Utvikler Referanse
            </div>
            <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
              API-Referanse
            </h1>
            <p className="nordic-body-large">
              Komplett API-dokumentasjon og kommandoreferanse for integrasjon 
              og utvidelse av Claude Code Coordination systemet.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="nordic-card" style={{padding: 'var(--space-lg)'}}>
              <div className="nordic-caption mb-2">API Status</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Endepunkter</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-primary)'}}>24 Aktive</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Autentisering</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>JWT Token</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Rate Limit</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>1000/time</span>
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
                  <h3 className="nordic-h4">REST API Endepunkter</h3>
                  <p className="nordic-caption">RESTful Arkitektur</p>
                </div>
              </div>
              <p className="nordic-body">
                Komplett REST API med konsistente endepunkter for alle 
                koordineringsfunksjoner og systemadministrasjon.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Hovedkategorier</div>
              <div className="space-y-3 text-sm">
                <div>• <code>/sessions</code> - Sesjonshåndtering</div>
                <div>• <code>/locks</code> - Fil låsing</div>
                <div>• <code>/ai</code> - AI tjenester</div>
                <div>• <code>/teams</code> - Teamkoordinering</div>
              </div>
            </div>
          </div>

          <div className="nordic-grid-feature" style={{gridTemplateColumns: '3fr 5fr'}}>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Kode Eksempler</div>
              <div className="space-y-3 text-sm">
                <div>• JavaScript/Node.js</div>
                <div>• Python</div>
                <div>• Bash/Shell</div>
                <div>• cURL kommandoer</div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiCodeBracket className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Kodeeksempler</h3>
                  <p className="nordic-caption">Praktiske Implementasjoner</p>
                </div>
              </div>
              <p className="nordic-body">
                Detaljerte kodeeksempler og implementasjonsguider for 
                alle støttede programmeringsspråk og miljøer.
              </p>
            </div>
          </div>

          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiBookOpen className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Integrasjonsguider</h3>
                  <p className="nordic-caption">Steg-for-Steg Oppsett</p>
                </div>
              </div>
              <p className="nordic-body">
                Detaljerte guider for integrering med populære 
                utviklingsverktøy og CI/CD pipelines.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Integrasjoner</div>
              <div className="space-y-3 text-sm">
                <div>• VS Code extension</div>
                <div>• GitHub Actions</div>
                <div>• Jenkins pipeline</div>
                <div>• Docker containere</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default APIDocumentation;