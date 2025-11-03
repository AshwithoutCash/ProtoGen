import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import SaveButton from './SaveButton';

const ProtocolDisplay = ({ protocol, title = "Generated Protocol", showSave = true, type = "protocol" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(protocol);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([protocol], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protocol-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex space-x-2">
          {showSave && protocol && (
            <SaveButton 
              data={protocol}
              type={type}
              title={title}
              variant="save"
            />
          )}
          <button
            onClick={handleCopy}
            className="btn btn-secondary flex items-center space-x-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="markdown-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {protocol}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ProtocolDisplay;
