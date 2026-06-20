import { useStore } from '../store';
import { Topbar } from './Topbar';
import { ModuleRail } from './ModuleRail';
import M1Viz from '../modules/M1Viz';
import M2Stockpile from '../modules/M2Stockpile';
import M3PitDesign from '../modules/M3PitDesign';
import M4Fleet from '../modules/M4Fleet';
import M5Dashboard from '../modules/M5Dashboard';
import M6DataHub from '../modules/M6DataHub';
import M7Geotech from '../modules/M7Geotech';
import M8Land from '../modules/M8Land';
import type { ModuleId } from '../types';

const MODULES: Record<ModuleId, React.ComponentType> = {
  M1: M1Viz,
  M2: M2Stockpile,
  M3: M3PitDesign,
  M4: M4Fleet,
  M5: M5Dashboard,
  M6: M6DataHub,
  M7: M7Geotech,
  M8: M8Land,
};

export default function AppLayout() {
  const activeModule = useStore(s => s.activeModule);
  const ActiveModule = MODULES[activeModule];
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#FBF7EF', overflow: 'hidden' }}>
      <Topbar />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <ModuleRail />
        <div style={{ flex: 1, position: 'relative', minWidth: 0, overflow: 'hidden' }}>
          <ActiveModule />
        </div>
      </div>
    </div>
  );
}
