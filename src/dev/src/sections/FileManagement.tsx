import React from 'react';
import { 
  HiOutlineArchiveBox,
  HiLockClosed,
  HiShieldCheck,
  HiArrowPath
} from 'react-icons/hi2';

interface FileManagementProps {
  isDarkTheme: boolean;
}

const FileManagement: React.FC<FileManagementProps> = ({ isDarkTheme }) => {
  return (
    <section className="nordic-section">
      <div className="nordic-container-wide">
        <div className="nordic-grid-magazine">
          <div>
            <div className="nordic-h3" style={{color: 'var(--text-muted)', marginBottom: 'var(--space-sm)'}}>
              Intelligent Fillåsing
            </div>
            <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
              Filhåndtering
            </h1>
            <p className="nordic-body-large">
              Avansert låsesystem som forhindrer konflikter og muliggjør 
              sømløs samarbeid med automatisk konfliktløsning.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="nordic-card" style={{padding: 'var(--space-lg)'}}>
              <div className="nordic-caption mb-2">Låsestatus</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Aktive Låser</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-primary)'}}>5 Filer</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Ventende Operasjoner</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>2 I Kø</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Løste Konflikter</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>12 I Dag</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-16" style={{marginTop: 'var(--space-3xl)'}}>
          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiLockClosed className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Intelligent Fillåsing</h3>
                  <p className="nordic-caption">Automatisk Konfliktforebygging</p>
                </div>
              </div>
              <p className="nordic-body">
                Prediktivt låsesystem som forhindrer konflikter før de oppstår 
                ved å analysere arbeidsmønstre og avhengigheter.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Låsefunksjoner</div>
              <div className="space-y-3 text-sm">
                <div>• Granulære tilgangskontroller</div>
                <div>• Automatisk utløp av låser</div>
                <div>• Prioriteringsbasert kø</div>
                <div>• Avhengighetssporing</div>
              </div>
            </div>
          </div>

          <div className="nordic-grid-feature" style={{gridTemplateColumns: '3fr 5fr'}}>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Konfliktløsning</div>
              <div className="space-y-3 text-sm">
                <div>• Automatisk merge strategi</div>
                <div>• Semantisk endring analyse</div>
                <div>• Manuel review assistanse</div>
                <div>• Backup og recovery</div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiShieldCheck className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Automatisk Konfliktløsning</h3>
                  <p className="nordic-caption">AI-Assistert Merge</p>
                </div>
              </div>
              <p className="nordic-body">
                Intelligent konfliktløsning som analyserer kodeendringer 
                og foreslår optimale merge-strategier for hver situasjon.
              </p>
            </div>
          </div>

          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiArrowPath className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Versjonskontroll Integrasjon</h3>
                  <p className="nordic-caption">Git Workflow Optimalisering</p>
                </div>
              </div>
              <p className="nordic-body">
                Sømløs integrasjon med Git som optimaliserer branching-strategier 
                og forenkler komplekse merge-scenarioer.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Git Funksjoner</div>
              <div className="space-y-3 text-sm">
                <div>• Smart branching forslag</div>
                <div>• Automatisk commit meldinger</div>
                <div>• PR/MR optimalisering</div>
                <div>• Konflikt visualisering</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FileManagement;