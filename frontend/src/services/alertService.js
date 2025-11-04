/**
 * Alert Service for Low Stock Inventory Notifications
 * Generates HTML tables and sends to n8n webhook for Gmail integration
 */

// Use our backend proxy to avoid CORS issues
const WEBHOOK_PROXY_URL = 'http://localhost:8001/api/v1/webhook-proxy';

// Utility functions
const toTitle = (s) => (s == null ? '' : String(s));
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Check if item is in warning condition
 */
const isLowStock = (item) => {
  const currentStock = parseFloat(item.CurrentStock || 0);
  const minStock = parseFloat(item.MinimumStock || 0);
  return currentStock <= minStock;
};

/**
 * Get warning level for item
 */
const getWarningLevel = (item) => {
  const currentStock = parseFloat(item.CurrentStock || 0);
  const minStock = parseFloat(item.MinimumStock || 0);
  
  if (currentStock <= minStock) {
    return 'CRITICAL';
  } else if (currentStock <= minStock * 1.5) {
    return 'WARNING';
  }
  return 'OK';
};

/**
 * Generate HTML table for low stock items
 */
const generateLowStockHTML = (lowStockItems) => {
  const rows = lowStockItems.map(item => {
    const itemId = esc(toTitle(item.ItemID));
    const materialName = esc(toTitle(item.MaterialName));
    const brand = esc(toTitle(item.Brand || 'Unknown'));
    const currentStock = esc(toTitle(`${item.CurrentStock} ${item.Unit || 'units'}`));
    const minStock = esc(toTitle(`${item.MinimumStock} ${item.Unit || 'units'}`));
    const location = esc(toTitle(item.Location || 'Unknown'));
    const warningLevel = getWarningLevel(item);
    const statusColor = warningLevel === 'CRITICAL' ? '#dc2626' : '#f59e0b';
    
    return `<tr>
      <td style="padding:8px;border:1px solid #e5e7eb;">${itemId}</td>
      <td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold;">${materialName}</td>
      <td style="padding:8px;border:1px solid #e5e7eb;">${brand}</td>
      <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">${currentStock}</td>
      <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">${minStock}</td>
      <td style="padding:8px;border:1px solid #e5e7eb;">${location}</td>
      <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">
        <span style="background:${statusColor};color:white;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:bold;">
          ${warningLevel}
        </span>
      </td>
    </tr>`;
  }).join('\n');

  const table = `<table style="border-collapse:collapse;width:100%;font-size:14px;margin:16px 0;">
    <thead>
      <tr style="background:#f9fafb;color:#111827;">
        <th style="padding:12px 8px;border:1px solid #e5e7eb;text-align:left;font-weight:bold;">Item ID</th>
        <th style="padding:12px 8px;border:1px solid #e5e7eb;text-align:left;font-weight:bold;">Material Name</th>
        <th style="padding:12px 8px;border:1px solid #e5e7eb;text-align:left;font-weight:bold;">Brand</th>
        <th style="padding:12px 8px;border:1px solid #e5e7eb;text-align:center;font-weight:bold;">Current Stock</th>
        <th style="padding:12px 8px;border:1px solid #e5e7eb;text-align:center;font-weight:bold;">Min Required</th>
        <th style="padding:12px 8px;border:1px solid #e5e7eb;text-align:left;font-weight:bold;">Location</th>
        <th style="padding:12px 8px;border:1px solid #e5e7eb;text-align:center;font-weight:bold;">Status</th>
      </tr>
    </thead>
    <tbody>
${rows}
    </tbody>
  </table>`;

  const count = lowStockItems.length;
  const criticalCount = lowStockItems.filter(item => getWarningLevel(item) === 'CRITICAL').length;
  const h2Text = `ProtoGen IMS — Low Stock Alert (${count} items, ${criticalCount} critical)`;
  
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>ProtoGen IMS — Low Stock Alert</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 900px; margin: 0 auto; padding: 20px; }
    .header { background: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .alert-icon { font-size: 24px; margin-right: 10px; }
    .summary { background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 8px; margin-bottom: 20px; }
    .footer { font-size: 12px; color: #6b7280; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0;"><span class="alert-icon">⚠️</span>ProtoGen Inventory Management System</h1>
      <p style="margin:8px 0 0 0;font-size:18px;">Low Stock Alert Notification</p>
    </div>
    
    <div class="summary">
      <h2 style="color:#dc2626;margin:0 0 12px 0;">${esc(h2Text)}</h2>
      <p style="margin:0;"><strong>Alert Time:</strong> ${new Date().toLocaleString()}</p>
      <p style="margin:8px 0 0 0;"><strong>Action Required:</strong> Please review and reorder the following items immediately.</p>
    </div>
    
    ${table}
    
    <div class="footer">
      <p><strong>Generated by ProtoGen IMS-Gen (Firebase Inventory Manager)</strong></p>
      <p>This is an automated alert. Please check your inventory system for the most up-to-date information.</p>
      <p>For support, contact your system administrator.</p>
    </div>
  </div>
</body>
</html>`;

  return { subject: h2Text, html, count, criticalCount };
};

/**
 * Send low stock alert to n8n webhook
 */
const sendLowStockAlert = async (inventoryData) => {
  try {
    // Filter items that are in warning condition
    const lowStockItems = inventoryData.filter(isLowStock);
    
    if (lowStockItems.length === 0) {
      console.log('No low stock items found');
      return { success: true, message: 'No alerts needed' };
    }

    // Generate HTML
    const alertData = generateLowStockHTML(lowStockItems);
    
    // Prepare payload for n8n webhook
    // Map ProtoGen inventory data to format expected by n8n code
    const mappedItems = lowStockItems.map(item => ({
      // n8n code looks for these fields:
      sku: item.ItemID,                    // sku || id || code
      id: item.ItemID,
      name: item.MaterialName,             // name || title
      title: item.MaterialName,
      category: item.Category || item.Brand, // category || group
      group: item.Category || item.Brand,
      stock: parseFloat(item.CurrentStock || 0),     // stock || quantity
      quantity: parseFloat(item.CurrentStock || 0),
      threshold: parseFloat(item.MinimumStock || 0), // threshold || min
      min: parseFloat(item.MinimumStock || 0),
      status: getWarningLevel(item),       // status || severity
      severity: getWarningLevel(item),
      // Additional ProtoGen fields
      brand: item.Brand,
      unit: item.Unit,
      location: item.Location,
      supplier: item.Supplier,
      notes: item.Notes
    }));

    const payload = {
      type: 'low_stock_alert',
      timestamp: new Date().toISOString(),
      subject: `ProtoGen IMS — Low Stock Alert (${alertData.count} items, ${alertData.criticalCount} critical)`,
      items_count: alertData.count.toString(),
      critical_count: alertData.criticalCount.toString(),
      html_data: alertData.html,
      // Provide both structured items AND HTML for maximum compatibility
      items: mappedItems,
      summary: {
        totalItems: alertData.count,
        criticalItems: alertData.criticalCount,
        warningItems: alertData.count - alertData.criticalCount
      }
    };

    // Debug logging
    console.log('🚀 Sending to webhook proxy:', WEBHOOK_PROXY_URL);
    console.log('📦 Payload:', payload);
    console.log('📊 Low stock items:', lowStockItems.length);

    // Try direct GET request to webhook first (since it expects GET)
    const directWebhookUrl = 'https://8e6063fc884a.ngrok-free.app/webhook-test/af763685-3b6e-4405-b4f5-3f78b1a2f93f';
    
    try {
      console.log('🔄 Trying direct GET request to webhook...');
      
      // Create URL with query parameters for GET request (matching your n8n input format)
      const params = new URLSearchParams({
        type: payload.type,
        timestamp: payload.timestamp,
        subject: payload.subject,
        items_count: payload.items_count,
        critical_count: payload.critical_count,
        html_data: payload.html_data,
        // Also send structured items as JSON string for CASE 2 fallback
        items: JSON.stringify(payload.items)
      });
      
      const getResponse = await fetch(`${directWebhookUrl}?${params}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'ProtoGen-IMS/1.0'
        }
      });
      
      console.log('📡 Direct GET response status:', getResponse.status);
      
      if (getResponse.ok) {
        const result = await getResponse.json();
        console.log('✅ Direct webhook success:', result);
        
        return {
          success: true,
          message: `Low stock alert sent successfully via GET`,
          data: {
            itemsAlerted: alertData.count,
            criticalItems: alertData.criticalCount,
            webhookResponse: result
          }
        };
      } else {
        console.log('⚠️ Direct GET failed, trying proxy...');
      }
    } catch (directError) {
      console.log('⚠️ Direct webhook failed:', directError.message);
    }

    // Fallback to backend proxy
    console.log('🔄 Using backend proxy as fallback...');
    const response = await fetch(WEBHOOK_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ProtoGen-IMS/1.0',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('📡 Webhook response status:', response.status);
    console.log('📡 Webhook response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Webhook error response:', errorText);
      throw new Error(`Webhook failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Webhook success response:', result);
    
    return {
      success: true,
      message: `Low stock alert sent successfully`,
      data: {
        itemsAlerted: alertData.count,
        criticalItems: alertData.criticalCount,
        webhookResponse: result
      }
    };

  } catch (error) {
    console.error('Failed to send low stock alert:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send low stock alert'
    };
  }
};

/**
 * Check and send alerts for current inventory
 */
const checkAndSendAlerts = async (inventoryData) => {
  const lowStockItems = inventoryData.filter(isLowStock);
  
  if (lowStockItems.length > 0) {
    console.log(`Found ${lowStockItems.length} low stock items, sending alert...`);
    return await sendLowStockAlert(inventoryData);
  } else {
    return { success: true, message: 'All items are adequately stocked' };
  }
};

/**
 * Generate preview HTML for testing
 */
const generatePreviewHTML = (inventoryData) => {
  const lowStockItems = inventoryData.filter(isLowStock);
  if (lowStockItems.length === 0) {
    return '<p>No low stock items found.</p>';
  }
  return generateLowStockHTML(lowStockItems).html;
};

export const alertService = {
  sendLowStockAlert,
  checkAndSendAlerts,
  generatePreviewHTML,
  isLowStock,
  getWarningLevel
};
