/**
 * N8N Transformer for ProtoGen Inventory Alerts
 * Converts inventory data to Gmail-ready format matching your exact requirements
 */

const toTitle = (s) => (s == null ? '' : String(s));
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Transform inventory data to n8n format for Gmail
 * This matches your exact format requirements
 */
export const transformInventoryForN8N = (items) => {
  return items.map(item => {
    const body = item.json || {};

    // CASE 1: You already have full HTML in item.json.data -> just use it.
    const prebuilt = typeof body.data === 'string' ? body.data : (typeof body.body?.data === 'string' ? body.body.data : null);
    if (prebuilt && (/<html|<table/i.test(prebuilt))) {
      // count <tr> inside <tbody> (fallback: total <tr> - 1 for header)
      const tbodyMatch = /<tbody[^>]*>([\s\S]*?)<\/tbody>/i.exec(prebuilt);
      const rowCount = (tbodyMatch ? (tbodyMatch[1].match(/<tr\b/gi) || []).length
                                   : Math.max((prebuilt.match(/<tr\b/gi) || []).length - 1, 0));
      const subject = `ProtoGen IMS — Low Stock Alert (${rowCount})`;
      const html = /<!doctype|<html/i.test(prebuilt)
        ? prebuilt
        : `<!doctype html><html><head><meta charset="utf-8"><title>${subject}</title></head><body>${prebuilt}</body></html>`;
      return { json: { subject, html } };
    }

    // CASE 2: You have structured data in body.inventory -> build the table.
    const inventory = Array.isArray(body.inventory) ? body.inventory : (body.body?.inventory || []);
    const rows = inventory.map(inv => {
      const itemId = esc(toTitle(inv.itemId));
      const materialName = esc(toTitle(inv.materialName));
      const brand = esc(toTitle(inv.brand || 'Unknown Brand'));
      const currentStock = esc(toTitle(`${inv.currentStock} ${inv.unit || 'units'}`));
      const minimumStock = esc(toTitle(`${inv.minimumStock} ${inv.unit || 'units'}`));
      const location = esc(toTitle(inv.location || 'Unknown Location'));
      const warningLevel = esc(toTitle(inv.warningLevel || 'WARNING'));
      const statusColor = warningLevel === 'CRITICAL' ? '#dc2626' : '#f59e0b';
      
      return `<tr>
        <td style="padding:8px;border:1px solid #e5e7eb;">${itemId}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold;">${materialName}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${brand}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">${currentStock}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">${minimumStock}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${location}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">
          <span style="background:${statusColor};color:white;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:bold;">
            ${warningLevel}
          </span>
        </td>
      </tr>`;
    }).join('\n');

    const table = `<table style="border-collapse:collapse;width:100%;font-size:14px;">
      <thead>
        <tr style="background:#f9fafb;color:#111827;">
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Item ID</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Material Name</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Brand</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:center;">Current Stock</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:center;">Min Required</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Location</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:center;">Status</th>
        </tr>
      </thead>
      <tbody>
${rows}
      </tbody>
    </table>`;

    const count = inventory.length;
    const criticalCount = inventory.filter(inv => inv.warningLevel === 'CRITICAL').length;
    const h2Text = `ProtoGen IMS — Low Stock Alert (${count} items, ${criticalCount} critical)`;
    const html = `<!doctype html>
    <html><head><meta charset="utf-8"><title>ProtoGen IMS — Low Stock Alert</title></head>
    <body>
      <div style="max-width:900px;margin:0 auto;padding:16px;font-family:Arial,Helvetica,sans-serif;">
        <div style="background:#dc2626;color:white;padding:20px;border-radius:8px;margin-bottom:20px;">
          <h1 style="margin:0;"><span style="font-size:24px;margin-right:10px;">⚠️</span>ProtoGen Inventory Management System</h1>
          <p style="margin:8px 0 0 0;font-size:18px;">Low Stock Alert Notification</p>
        </div>
        
        <div style="background:#fef2f2;border:1px solid #fecaca;padding:16px;border-radius:8px;margin-bottom:20px;">
          <h2 style="color:#dc2626;margin:0 0 12px 0;">${esc(h2Text)}</h2>
          <p style="margin:0;"><strong>Alert Time:</strong> ${new Date().toLocaleString()}</p>
          <p style="margin:8px 0 0 0;"><strong>Action Required:</strong> Please review and reorder the following items immediately.</p>
        </div>
        
        ${table}
        
        <div style="font-size:12px;color:#6b7280;margin-top:20px;padding-top:16px;border-top:1px solid #e5e7eb;">
          <p><strong>Generated by ProtoGen IMS-Gen (Firebase Inventory Manager)</strong></p>
          <p>This is an automated alert. Please check your inventory system for the most up-to-date information.</p>
        </div>
      </div>
    </body></html>`;

    return { json: { subject: h2Text, html } };
  });
};

/**
 * Example usage for your n8n workflow:
 * 
 * const transformedData = transformInventoryForN8N(items);
 * // This will return the exact format you need for Gmail integration
 */
