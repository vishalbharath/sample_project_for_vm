import React, { useState, useEffect } from 'react';
import './index.css';

const BASE = 'http://localhost:5000';

const ENDPOINTS = [
  { method: 'GET',    path: '/api/health',          label: 'Health Check',        hasBody: false, hasParam: false },
  { method: 'GET',    path: '/api/users',            label: 'Get All Users',       hasBody: false, hasParam: false },
  { method: 'GET',    path: '/api/users/:id',        label: 'Get User by ID',      hasBody: false, hasParam: true  },
  { method: 'POST',   path: '/api/users',            label: 'Create User',         hasBody: true,  hasParam: false,
    defaultBody: JSON.stringify({ name: 'John Doe', email: 'john@example.com', role: 'user' }, null, 2) },
  { method: 'PUT',    path: '/api/users/:id',        label: 'Update User',         hasBody: true,  hasParam: true,
    defaultBody: JSON.stringify({ name: 'Updated Name', email: 'updated@example.com', role: 'admin' }, null, 2) },
  { method: 'PATCH',  path: '/api/users/:id',        label: 'Partial Update User', hasBody: true,  hasParam: true,
    defaultBody: JSON.stringify({ role: 'moderator' }, null, 2) },
  { method: 'DELETE', path: '/api/users/:id',        label: 'Delete User',         hasBody: false, hasParam: true  },
  { method: 'GET',    path: '/api/products',         label: 'Get All Products',    hasBody: false, hasParam: false },
  { method: 'GET',    path: '/api/products/:id',     label: 'Get Product by ID',   hasBody: false, hasParam: true  },
  { method: 'POST',   path: '/api/products',         label: 'Create Product',      hasBody: true,  hasParam: false,
    defaultBody: JSON.stringify({ name: 'Keyboard', price: 79.99, category: 'Electronics', stock: 50 }, null, 2) },
  { method: 'PUT',    path: '/api/products/:id',     label: 'Update Product',      hasBody: true,  hasParam: true,
    defaultBody: JSON.stringify({ name: 'Keyboard Pro', price: 99.99, category: 'Electronics', stock: 30 }, null, 2) },
  { method: 'DELETE', path: '/api/products/:id',     label: 'Delete Product',      hasBody: false, hasParam: true  },
  { method: 'POST',   path: '/api/echo',             label: 'Echo Request',        hasBody: true,  hasParam: false,
    defaultBody: JSON.stringify({ message: 'Hello API!' }, null, 2) },
];

function methodClass(method) { return `method-${method}`; }

function statusClass(code) {
  if (!code) return '';
  if (code >= 200 && code < 300) return 'status-2xx';
  if (code >= 400 && code < 500) return 'status-4xx';
  return 'status-5xx';
}

export default function App() {
  const [selected, setSelected] = useState(0);
  const [body, setBody] = useState('');
  const [param, setParam] = useState('1');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverUp, setServerUp] = useState(null);

  const ep = ENDPOINTS[selected];

  // Ping health on load
  useEffect(() => {
    fetch(`${BASE}/api/health`)
      .then(r => r.ok ? setServerUp(true) : setServerUp(false))
      .catch(() => setServerUp(false));
  }, []);

  // Reset body when switching endpoints
  useEffect(() => {
    setBody(ep.defaultBody || '');
    setResponse(null);
    setError('');
  }, [selected]);

  const resolvedUrl = `${BASE}${ep.path.replace(':id', param || ':id')}`;

  async function sendRequest() {
    setLoading(true);
    setResponse(null);
    setError('');
    const t0 = Date.now();
    try {
      const opts = {
        method: ep.method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (ep.hasBody && body.trim()) {
        opts.body = body;
      }
      const res = await fetch(resolvedUrl, opts);
      const data = await res.json();
      setResponse({ status: res.status, data, time: Date.now() - t0 });
    } catch (e) {
      setError(`Request failed: ${e.message}. Is the server running on port 5000?`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <div className="logo">⚡</div>
        <div>
          <h1>API Tester</h1>
          <p>Test your REST endpoints — mirrors Postman behaviour</p>
        </div>
      </header>

      <main className="main">
        {/* Server status */}
        <div className="status-bar">
          <div className={`dot ${serverUp === null ? 'grey' : serverUp ? 'green' : 'red'}`} />
          <span>
            {serverUp === null ? 'Checking server…' : serverUp
              ? `Server online · ${BASE}`
              : `Server offline — run: cd server && npm install && npm start`}
          </span>
        </div>

        <div className="grid">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-title">Endpoints</div>
            {ENDPOINTS.map((e, i) => (
              <button
                key={i}
                className={`endpoint-btn ${selected === i ? 'active' : ''}`}
                onClick={() => setSelected(i)}
              >
                <span className={`method-badge ${methodClass(e.method)}`}>{e.method}</span>
                {e.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="panel">
            {/* URL bar */}
            <div className="panel-header">
              <span className={`method-badge ${methodClass(ep.method)}`}>{ep.method}</span>
              <span className="url-display">
                <span>{BASE}</span>
                {ep.path.replace(':id', param || ':id')}
              </span>
              <button className="send-btn" onClick={sendRequest} disabled={loading}>
                {loading ? 'Sending…' : '▶ Send'}
              </button>
            </div>

            {/* ID param */}
            {ep.hasParam && (
              <div className="params-section">
                <label>:id param</label>
                <input
                  type="text"
                  value={param}
                  onChange={e => setParam(e.target.value)}
                  placeholder="e.g. 1"
                />
              </div>
            )}

            {/* Body */}
            {ep.hasBody && (
              <div className="body-section">
                <label>Request Body (JSON)</label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  spellCheck={false}
                />
              </div>
            )}

            {/* Response */}
            <div className="response-section">
              {loading && <div className="spinner" />}
              {error && <p className="error-msg">{error}</p>}
              {!loading && !error && response && (
                <>
                  <div className="response-meta">
                    <span className={`status-code ${statusClass(response.status)}`}>
                      {response.status}
                    </span>
                    <span className="response-time">{response.time} ms</span>
                  </div>
                  <pre>{JSON.stringify(response.data, null, 2)}</pre>
                </>
              )}
              {!loading && !error && !response && (
                <div className="placeholder">
                  Hit <strong>▶ Send</strong> to call the API and see the response here.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
