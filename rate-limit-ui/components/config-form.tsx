'use client';

import { useState } from 'react';
import { sendConfig } from '@/lib/api';

export default function ConfigForm() {
  const [apiKey, setApiKey] = useState('');
  const [limit, setLimit] = useState('');
  const [window, setWindow] = useState('');
  const [strategy, setStrategy] = useState('sliding_window');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await sendConfig({
        api_key: apiKey,
        limit: Number(limit),
        window: Number(window),
        strategy,
      });
      setMessage('✓ ' + (result.message || 'Configuration saved successfully'));
    } catch (error) {
      setMessage('✗ ' + (error instanceof Error ? error.message : 'Error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card h-full flex flex-col gap-3"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Send Configuration</h2>

      <div className="mb-4 flex flex-col">
        <label className="text-sm font-semibold mb-1">API Key</label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
          className="input-field"
        />
      </div>

      <div className="mb-4 flex flex-col">
        <label className="text-sm font-semibold mb-1">Limit</label>
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          min="1"
          className="input-field"
        />
      </div>

      <div className="mb-4 flex flex-col">
        <label className="text-sm font-semibold mb-1">Window (seconds)</label>
        <input
          type="number"
          value={window}
          onChange={(e) => setWindow(e.target.value)}
          min="1"
          className="input-field"
        />
      </div>

      <div className="mb-4 flex flex-col">
        <label className="text-sm font-semibold mb-1">Strategy</label>
        <select
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          className="input-field"
        >
          <option value="sliding_window">Sliding Window</option>
          <option value="token_bucket">Token Bucket</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-secondary"
      >
        {loading ? 'Sending...' : 'Send Configuration'}
      </button>

      {message && (
        <p className={message.startsWith('✓') ? 'message-success' : 'message-error'}>
          {message}
        </p>
      )}
    </form>
  );
}
