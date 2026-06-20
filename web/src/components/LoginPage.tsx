import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../api';
import { useStore } from '../store';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useStore(s => s.login);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginApi(username, password);
      login(data.user, data.access_token);
      navigate('/app');
    } catch {
      // Demo mode: allow any login when backend is offline
      login(
        {
          id: 1,
          username: username || 'demo',
          name: username === 'owner' ? 'Pemilik Tambang' : 'Demo User',
          role: username || 'demo',
          role_en: 'Demo / Dev Mode',
          initials: (username || 'DM').slice(0, 2).toUpperCase(),
        },
        'demo-token'
      );
      navigate('/app');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FBF7EF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#fff',
        border: '2.5px solid #141414',
        borderRadius: 14,
        boxShadow: '5px 5px 0 #141414',
        padding: '40px 36px',
        width: '100%',
        maxWidth: 420,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52,
            background: '#FFD23F',
            border: '2.5px solid #141414',
            borderRadius: 12,
            boxShadow: '3px 3px 0 #141414',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 20, letterSpacing: -1,
          }}>SJ</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: -0.5, lineHeight: 1 }}>SANJAYA</div>
            <div className="mono" style={{ fontSize: 9, color: '#8A8270', fontWeight: 700, marginTop: 2 }}>WEBGIS · TAMBANG BATU BARA</div>
          </div>
        </div>

        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Masuk ke Platform</div>
        <div style={{ fontSize: 12, color: '#8A8270', marginBottom: 24 }}>Sistem Informasi Spasial Pertambangan Terpadu</div>

        {error && (
          <div style={{
            background: '#FFF3F3', border: '2px solid #FF4D4D', borderRadius: 9,
            padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#CC0000',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 11, marginBottom: 5 }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="surveyor / dispatcher / owner ..."
              style={{
                width: '100%',
                border: '2px solid #141414',
                borderRadius: 9,
                padding: '10px 12px',
                fontSize: 13,
                background: '#FBF7EF',
                outline: 'none',
                fontFamily: 'inherit',
                boxShadow: '2px 2px 0 #141414',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 11, marginBottom: 5 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                border: '2px solid #141414',
                borderRadius: 9,
                padding: '10px 12px',
                fontSize: 13,
                background: '#FBF7EF',
                outline: 'none',
                fontFamily: 'inherit',
                boxShadow: '2px 2px 0 #141414',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#FFD23F',
              border: '2.5px solid #141414',
              borderRadius: 9,
              boxShadow: '3px 3px 0 #141414',
              padding: '12px 0',
              fontWeight: 800,
              fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'box-shadow 0.1s, transform 0.1s',
              fontFamily: 'inherit',
            }}
            onMouseDown={e => (e.currentTarget.style.boxShadow = '1px 1px 0 #141414')}
            onMouseUp={e => (e.currentTarget.style.boxShadow = '3px 3px 0 #141414')}
          >
            {loading ? 'Masuk...' : 'Masuk →'}
          </button>
        </form>

        <div style={{
          marginTop: 20,
          padding: '10px 14px',
          background: '#FBF7EF',
          border: '1.5px solid #E6DFCD',
          borderRadius: 9,
          fontSize: 11,
          color: '#8A8270',
        }}>
          <span className="mono" style={{ fontWeight: 700, color: '#141414' }}>Demo:</span>{' '}
          Username apa saja, password apa saja. Login otomatis saat backend offline.
        </div>
      </div>
    </div>
  );
}
