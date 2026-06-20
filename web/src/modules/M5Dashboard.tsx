import { useDashboard, useAlerts, useRecommendations, useEpochs } from '../api';
import { useStore } from '../store';
import { KpiCard } from '../components/ui/KpiCard';
import { AlertItem } from '../components/ui/AlertItem';
import { ProgressBar } from '../components/ui/ProgressBar';
import type { KpiCard as KpiCardType, Alert, Recommendation } from '../types';

export default function M5Dashboard() {
  const { data: dashboard, isLoading: loadingDash, isError: errorDash } = useDashboard();
  const { data: alerts = [], isLoading: loadingAlerts } = useAlerts();
  const { data: recs = [], isLoading: loadingRecs } = useRecommendations();
  const { data: epochs = [] } = useEpochs();
  const epochIndex = useStore(s => s.epochIndex);
  const currentEpoch = epochs[epochIndex];

  if (loadingDash) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#8A8270' }} className="mono">Memuat data...</div>
  );
  if (errorDash) return (
    <div style={{ margin: 24, padding: 16, background: '#FFFBEE', border: '2px solid #FFD23F', borderRadius: 11 }}>
      <div style={{ fontWeight: 800, fontSize: 13 }}>Gagal memuat data</div>
      <div className="mono" style={{ fontSize: 10, color: '#8A8270', marginTop: 4 }}>
        Pastikan backend berjalan: <code>docker compose up -d</code>
      </div>
    </div>
  );

  const kpis: KpiCardType[] = dashboard?.kpis ?? [];
  const prodBars: any[] = dashboard?.prod_bars ?? [];
  const landStatus: any = dashboard?.land_status ?? {};

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '22px 26px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
        <h1 style={{ fontWeight: 900, fontSize: 24, letterSpacing: -0.6, margin: 0 }}>Dashboard Produksi</h1>
        <div className="mono" style={{
          fontSize: 11, fontWeight: 700,
          background: '#FBF7EF', border: '2.5px solid #141414',
          borderRadius: 8, padding: '5px 11px',
          boxShadow: '2px 2px 0 #141414',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#52B788', display: 'inline-block' }} />
          {currentEpoch?.label ?? "Jan '26"}
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 14,
        marginBottom: 20,
      }}>
        {kpis.map((kpi: KpiCardType) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            en={kpi.en}
            val={kpi.val}
            unit={kpi.unit}
            trend={kpi.trend}
            trendBg={kpi.trend_bg}
            sub={kpi.sub}
            color={kpi.color}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Production Chart */}
        <div style={{
          background: '#fff', border: '2.5px solid #141414', borderRadius: 13,
          boxShadow: '4px 4px 0 #141414', padding: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontWeight: 800, fontSize: 13 }}>Produksi Batubara · Plan vs Aktual</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{
                  display: 'inline-block', width: 14, height: 14,
                  background: 'repeating-linear-gradient(-45deg, #141414 0 2px, #FBF7EF 2px 5px)',
                  border: '1.5px solid #141414', borderRadius: 3,
                }} />
                <span className="mono" style={{ fontSize: 9 }}>Plan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ display: 'inline-block', width: 14, height: 14, background: '#FFD23F', border: '1.5px solid #141414', borderRadius: 3 }} />
                <span className="mono" style={{ fontSize: 9 }}>Aktual</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
            {prodBars.map((b: any, i: number) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 140 }}>
                  {/* Plan bar */}
                  <div style={{
                    width: '45%',
                    height: `${(b.plan_pct / 100) * 140}px`,
                    background: 'repeating-linear-gradient(-45deg, #141414 0 2px, #FBF7EF 2px 5px)',
                    border: '1.5px solid #141414',
                    borderRadius: '3px 3px 0 0',
                    alignSelf: 'flex-end',
                  }} />
                  {/* Actual bar */}
                  <div style={{
                    width: '45%',
                    height: `${(b.act_pct / 100) * 140}px`,
                    background: '#FFD23F',
                    border: '1.5px solid #141414',
                    borderRadius: '3px 3px 0 0',
                    alignSelf: 'flex-end',
                  }} />
                </div>
                <span className="mono" style={{ fontSize: 8, fontWeight: 700, color: '#8A8270', marginTop: 4 }}>{b.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Land Status */}
        <div style={{
          background: '#fff', border: '2.5px solid #141414', borderRadius: 13,
          boxShadow: '4px 4px 0 #141414', padding: 18,
        }}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 14 }}>Status Lahan · Land Acquisition</div>
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 900, fontSize: 52, letterSpacing: -2, lineHeight: 1 }}>
              {landStatus.pct ?? '78'}<span style={{ fontSize: 24, fontWeight: 700, color: '#8A8270' }}>%</span>
            </div>
            <div className="mono" style={{ fontSize: 10, color: '#8A8270', marginTop: 4 }}>
              Area Terbebas dari Target WIUP
            </div>
          </div>
          <ProgressBar value={landStatus.pct ?? 78} color="#52B788" height={13} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
            <div style={{ background: '#FBF7EF', border: '2px solid #141414', borderRadius: 9, padding: '10px 12px', boxShadow: '2px 2px 0 #141414' }}>
              <div className="mono" style={{ fontSize: 8, color: '#8A8270', marginBottom: 3 }}>BEBAS</div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>{landStatus.bebas ?? '1.847'}</div>
              <div className="mono" style={{ fontSize: 8, color: '#8A8270' }}>ha</div>
            </div>
            <div style={{ background: '#FBF7EF', border: '2px solid #141414', borderRadius: 9, padding: '10px 12px', boxShadow: '2px 2px 0 #141414' }}>
              <div className="mono" style={{ fontSize: 8, color: '#FF4D4D', marginBottom: 3 }}>KONFLIK</div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>{landStatus.konflik ?? '12'}</div>
              <div className="mono" style={{ fontSize: 8, color: '#8A8270' }}>bidang</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts + Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Early Warning */}
        <div style={{ background: '#fff', border: '2.5px solid #141414', borderRadius: 13, boxShadow: '4px 4px 0 #141414', padding: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 12 }}>
            Peringatan Dini · Early Warning
          </div>
          {loadingAlerts ? (
            <div className="mono" style={{ fontSize: 10, color: '#8A8270' }}>Memuat...</div>
          ) : (
            (alerts as Alert[]).map((a: Alert) => (
              <AlertItem key={a.id} alert={a} />
            ))
          )}
        </div>

        {/* Recommendations */}
        <div style={{ background: '#fff', border: '2.5px solid #141414', borderRadius: 13, boxShadow: '4px 4px 0 #141414', padding: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 12 }}>
            Rekomendasi · Decision Support
          </div>
          {loadingRecs ? (
            <div className="mono" style={{ fontSize: 10, color: '#8A8270' }}>Memuat...</div>
          ) : (
            (recs as Recommendation[]).map((r: Recommendation) => (
              <div key={r.id} style={{
                border: '2px solid #141414', borderRadius: 10,
                padding: '12px 14px', marginBottom: 10,
                boxShadow: '2px 2px 0 #141414',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, fontSize: 12, flex: 1 }}>{r.title}</span>
                  <span className="mono" style={{
                    fontSize: 8, fontWeight: 700, color: '#fff',
                    background: r.chip_color || '#141414',
                    border: '1.5px solid #141414', borderRadius: 4,
                    padding: '2px 6px', flexShrink: 0,
                  }}>{r.impact}</span>
                </div>
                <div style={{ fontSize: 11, color: '#555', marginBottom: 10, lineHeight: 1.4 }}>{r.description}</div>
                <button style={{
                  border: '2px solid #141414', borderRadius: 7,
                  background: '#FFD23F', boxShadow: '2px 2px 0 #141414',
                  padding: '5px 12px', fontWeight: 800, fontSize: 11,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>Terapkan →</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
