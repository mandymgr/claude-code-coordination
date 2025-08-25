import React from 'react';
import { 
  HiRocketLaunch,
  HiChartBarSquare,
  HiCpuChip,
  HiClockIcon
} from 'react-icons/hi2';

interface PerformanceMetricsProps {
  isDarkTheme: boolean;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ isDarkTheme }) => {
  return (
    <section className="nordic-section">
      <div className="nordic-container-wide">
        <div className="nordic-grid-magazine">
          <div>
            <div className="nordic-h3" style={{color: 'var(--text-muted)', marginBottom: 'var(--space-sm)'}}>
              Optimalisering
            </div>
            <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
              Ytelse
            </h1>
            <p className="nordic-body-large">
              Avansert ytelsesovervåking og optimalisering med intelligent 
              hurtigbuffering og benchmarking for maksimal produktivitet.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="nordic-card" style={{padding: 'var(--space-lg)'}}>
              <div className="nordic-caption mb-2">Ytelsesoversikt</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">CPU Bruk</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Minne</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>234 MB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body text-sm">Cache Hit Rate</span>
                  <span className="text-xs font-medium" style={{color: 'var(--accent-primary)'}}>94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-16" style={{marginTop: 'var(--space-3xl)'}}>
          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiRocketLaunch className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Intelligent Hurtigbuffer</h3>
                  <p className="nordic-caption">Adaptiv Optimalisering</p>
                </div>
              </div>
              <p className="nordic-body">
                Smart caching-system som lærer fra bruksmønstre og 
                optimaliserer automatisk for raskere responstider.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Cache Strategier</div>
              <div className="space-y-3 text-sm">
                <div>• Kode parsing cache</div>
                <div>• AI modell cache</div>
                <div>• Fil metadata cache</div>
                <div>• Sesjonsstatus cache</div>
              </div>
            </div>
          </div>

          <div className="nordic-grid-feature" style={{gridTemplateColumns: '3fr 5fr'}}>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Benchmark Resultater</div>
              <div className="space-y-3 text-sm">
                <div>• Startoppstid: <strong>1.2s</strong></div>
                <div>• AI responstid: <strong>150ms</strong></div>
                <div>• Filsynkronisering: <strong>50ms</strong></div>
                <div>• WebSocket latens: <strong>12ms</strong></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiChartBarSquare className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Kontinuerlig Benchmarking</h3>
                  <p className="nordic-caption">Automatisk Overvåking</p>
                </div>
              </div>
              <p className="nordic-body">
                Kontinuerlig ytelsesmåling og sammenligning som identifiserer 
                flaskehalser og foreslår optimaliseringstiltak.
              </p>
            </div>
          </div>

          <div className="nordic-grid-feature">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <HiCpuChip className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                <div>
                  <h3 className="nordic-h4">Ressursoptimalisering</h3>
                  <p className="nordic-caption">Intelligent Forvaltning</p>
                </div>
              </div>
              <p className="nordic-body">
                Dynamisk ressursallokering som balanserer ytelse mot 
                systembelastning for optimal brukeropplevelse.
              </p>
            </div>
            <div className="nordic-card">
              <div className="nordic-caption mb-4">Optimaliserte Områder</div>
              <div className="space-y-3 text-sm">
                <div>• Minne allokering</div>
                <div>• Thread pooling</div>
                <div>• Nettverksbuffering</div>
                <div>• Disk I/O optimalisering</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceMetrics;