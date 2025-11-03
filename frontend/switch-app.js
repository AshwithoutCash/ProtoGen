// Quick script to switch between different App versions
// Run: node switch-app.js emergency
// Run: node switch-app.js normal

const fs = require('fs');
const path = require('path');

const mode = process.argv[2];

if (mode === 'emergency') {
  // Copy emergency app to main App.jsx
  const emergencyApp = fs.readFileSync(path.join(__dirname, 'src/App.emergency.jsx'), 'utf8');
  fs.writeFileSync(path.join(__dirname, 'src/App.jsx'), emergencyApp);
  console.log('✅ Switched to EMERGENCY mode - No authentication required');
  console.log('🚀 All features accessible directly at:');
  console.log('   - http://localhost:5173/ (Dashboard)');
  console.log('   - http://localhost:5173/inventory (IMS-Gen)');
  console.log('   - http://localhost:5173/procure (Procurement)');
  console.log('   - http://localhost:5173/generate (Protocol Generation)');
} else if (mode === 'normal') {
  console.log('❌ Normal mode requires fixing the AuthContext first');
  console.log('🔧 Use emergency mode for now: node switch-app.js emergency');
} else {
  console.log('Usage:');
  console.log('  node switch-app.js emergency  - Skip all auth, direct access');
  console.log('  node switch-app.js normal     - Use Firebase auth (currently broken)');
}
