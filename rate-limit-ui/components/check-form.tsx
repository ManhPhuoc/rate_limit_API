'use client';

import { useState } from 'react';
import { checkLimit } from '@/lib/api';

interface RequestRecord {
  id: number;
  timestamp: string;
  allow: boolean;
  remaining: number;
  responseTime: number;
}

export default function CheckForm() {
  const [apiKey, setApiKey] = useState('');
  const [result, setResult] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestHistory, setRequestHistory] = useState<RequestRecord[]>([]);
  const [stats, setStats] = useState({ total: 0, allowed: 0, blocked: 0 });

  const updateStats = (history: RequestRecord[]) => {
    const total = history.length;
    const allowed = history.filter(r => r.allow).length;
    const blocked = total - allowed;
    setStats({ total, allowed, blocked });
  };

  const handleCheck = async () => {
    if (!apiKey.trim()) {
      setMessage('Please enter API Key');
      return;
    }

    setLoading(true);
    setMessage('');
    setResult(null);

    try {
      const start = performance.now();
      const data = await checkLimit(apiKey);
      const end = performance.now();
      const responseTime = Math.round(end - start);

      setResult(data);
      
      const newRecord: RequestRecord = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        allow: data.data?.allow ?? false,
        remaining: data.data?.remaining ?? 0,
        responseTime: responseTime,
      };
      const newHistory = [newRecord, ...requestHistory];
      setRequestHistory(newHistory);
      updateStats(newHistory);
    } catch (error) {
      setMessage('✗ ' + (error instanceof Error ? error.message : 'Error'));
    } finally {
      setLoading(false);
    }
  };

  const allow = result?.data?.allow;

  return (
    <div className="card h-full flex flex-col gap-3">
      <h2 className="text-xl font-bold mb-2 text-center">Check Request</h2>

      <div className="mb-4 flex flex-col">
        <label className="text-sm font-semibold mb-1">API Key</label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="input-field"
        />
      </div>
      <button
        onClick={handleCheck}
        disabled={loading}
        className="btn-primary mx-auto block"
      >
        {loading ? 'Checking...' : 'Check'}
      </button>

      {message && (
        <p className="message-error">
          {message}
        </p>
      )}

      {result && (
        <div className="card mt-4">
          <p className="text-small">
            <strong>Status:</strong>{' '}
            <span className={allow ? 'status-allowed' : 'status-blocked'}>
              {allow ? 'Allowed' : 'Blocked'}
            </span>
          </p>
          <p className="text-small mt-2">
            <strong>Remaining Requests:</strong> {result.data?.remaining ?? 0}
          </p>
        </div>
      )}

      {stats.total > 0 && (
        <div className="card mt-4 max-h-48 overflow-y-auto">
          <h3 className="font-bold text-sm mb-2">Request History</h3>
          <div className="space-y-1">
            {requestHistory.map((record) => (
              <div key={record.id} className="flex justify-between text-xs p-1 bg-gray-50 rounded">
                <span className="text-muted">{record.timestamp}</span>
                <span className={record.allow ? 'status-allowed' : 'status-blocked'}>
                  {record.allow ? '✓ Allowed' : '✗ Blocked'} (Rem: {record.remaining})
                </span>
                <span className="text-muted">
                  {record.responseTime}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}