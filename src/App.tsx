import React, { useState } from 'react';
import { Copy, FileCode, Wand2 } from 'lucide-react';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const obfuscateScript = () => {
    if (!input.trim()) return;

    // Basic obfuscation techniques
    let obfuscated = input
      // Variable name obfuscation
      .replace(/local\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, name) => {
        const obfName = '_' + Buffer.from(name).toString('base64');
        return `local ${obfName}`;
      })
      // String obfuscation
      .replace(/"([^"]+)"/g, (_, str) => {
        const bytes = Array.from(Buffer.from(str)).map(b => '\\' + b.toString(8));
        return `(""..${bytes.join('..')})`;
      })
      // Number obfuscation
      .replace(/\b(\d+)\b/g, (_, num) => {
        const n = parseInt(num);
        return `(${n + 1}-1)`;
      });

    // Add some random garbage collection calls to confuse decompilers
    obfuscated = `
local _G = getfenv(0)
local collectgarbage = collectgarbage
collectgarbage()
${obfuscated}
collectgarbage()
    `.trim();

    setOutput(obfuscated);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FileCode className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Roblox Script Obfuscator</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-400">Input Script</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your Roblox Lua script here..."
              className="w-full h-96 bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-400">Obfuscated Output</h2>
            <textarea
              value={output}
              readOnly
              placeholder="Obfuscated code will appear here..."
              className="w-full h-96 bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={obfuscateScript}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Wand2 className="w-5 h-5" />
            Obfuscate
          </button>

          {output && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Copy className="w-5 h-5" />
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          )}
        </div>

        <div className="mt-8 text-center text-gray-400">
          <p>This tool helps protect your Roblox scripts from being easily readable or copied.</p>
          <p className="text-sm mt-2">Note: Obfuscation is not perfect security. Critical code should always have additional protection measures.</p>
        </div>
      </div>
    </div>
  );
}

export default App;