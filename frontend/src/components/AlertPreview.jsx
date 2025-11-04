import { useState } from 'react';
import { Eye, Code, Mail, Download } from 'lucide-react';
import { alertService } from '../services/alertService';

const AlertPreview = ({ inventoryData }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewHTML, setPreviewHTML] = useState('');
  const [showCode, setShowCode] = useState(false);

  const generatePreview = () => {
    const html = alertService.generatePreviewHTML(inventoryData);
    setPreviewHTML(html);
    setShowPreview(true);
  };

  const downloadHTML = () => {
    const html = alertService.generatePreviewHTML(inventoryData);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protogen-low-stock-alert-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lowStockItems = inventoryData.filter(item => item.CurrentStock <= item.MinimumStock);

  if (lowStockItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-blue-900">Email Alert Preview</h3>
        <div className="flex space-x-2">
          <button
            onClick={generatePreview}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={downloadHTML}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
      
      <p className="text-sm text-blue-800 mb-3">
        Preview the HTML email that will be sent to Gmail via n8n webhook.
      </p>

      {showPreview && (
        <div className="mt-4">
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={() => setShowCode(!showCode)}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors flex items-center space-x-1"
            >
              <Code className="w-4 h-4" />
              <span>{showCode ? 'Hide Code' : 'Show HTML'}</span>
            </button>
          </div>

          {showCode ? (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
              <pre>{previewHTML}</pre>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-3 py-2 text-sm text-gray-600 border-b">
                Email Preview (Gmail Format)
              </div>
              <div 
                className="p-4 bg-white max-h-96 overflow-auto"
                dangerouslySetInnerHTML={{ __html: previewHTML }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertPreview;
