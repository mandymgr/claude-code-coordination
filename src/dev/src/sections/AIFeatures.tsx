import React from 'react';
import { 
  HiCpuChip,
  HiLightBulb,
  HiShieldCheck,
  HiSparkles
} from 'react-icons/hi2';

interface AIFeaturesProps {
  isDarkTheme: boolean;
}

const AIFeatures: React.FC<AIFeaturesProps> = ({ isDarkTheme }) => {
  return (
    <section className="nordic-section">
      <div className="nordic-container-wide">
        <div className="nordic-grid-magazine">
          <div>
            <div className="nordic-h3" style={{color: 'var(--text-muted)', marginBottom: 'var(--space-sm)'}}>
              Intelligente Funksjoner
            </div>
            <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
              AI-Funksjoner
            </h1>
            <p className="nordic-body-large">
              Avansert kunstig intelligens som analyserer kode, foreslår oppgaver 
              og optimaliserer utviklingsarbeidsflyt i sanntid.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="nordic-card" style={{padding: 'var(--space-lg)'}}>
              <div className="nordic-caption mb-2">AI-Status</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Kodeanalyse</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>Aktiv</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Oppgaveforslag</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>Lærer</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Konfliktprediksjon</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-primary)'}}>Overvåker</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-16" style={{marginTop: 'var(--space-3xl)'}}>
          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiLightBulb className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Intelligente Oppgaveforslag</h3>
                  <p className="nordic-caption">Kontekstbevisst Analyse</p>
                </div>
              </div>
              <p className="nordic-body">
                AI analyserer kodebasen din og foreslår relevante oppgaver basert på 
                mønstre, kompleksitet og prosjektkontekst.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Funksjoner</div>
              <div className="space-y-3 text-sm">
                <div>• Kodekompleksitetsanalyse</div>
                <div>• Mønstergjenkjenning</div>
                <div>• Kontekstbevisste forslag</div>
                <div>• Læring fra ferdigstillingshistorikk</div>
              </div>
            </div>
          </div>

          <div className="nordic-grid-feature" style={{gridTemplateColumns: '3fr 5fr'}}>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Konfliktforebygging</div>
              <div className="space-y-3 text-sm">
                <div>• Prediktiv analyse</div>
                <div>• Avhengighetssporing</div>
                <div>• Automatisk løsning</div>
                <div>• Proaktive advarsler</div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiShieldCheck className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Intelligent Konfliktløsning</h3>
                  <p className="nordic-caption">Proaktiv Beskyttelse</p>
                </div>
              </div>
              <p className="nordic-body">
                Forutser potensielle konflikter før de oppstår og foreslår automatiske 
                løsninger for å opprettholde smooth utviklingsflyt.
              </p>
            </div>
          </div>

          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiSparkles className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Adaptiv Læring</h3>
                  <p className="nordic-caption">Kontinuerlig Forbedring</p>
                </div>
              </div>
              <p className="nordic-body">
                AI-systemet lærer fra dine arbeidssvaner og forbedrer forslagene sine 
                over tid for å matche din utviklingsstil perfekt.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Læringsområder</div>
              <div className="space-y-3 text-sm">
                <div>• Kodestil og preferanser</div>
                <div>• Prosjektspesifikke mønstre</div>
                <div>• Tidsmessige arbeidsvaner</div>
                <div>• Samarbeidsmønstre</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;