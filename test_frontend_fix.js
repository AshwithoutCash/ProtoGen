// Test script to verify the frontend fix
const fetch = require('node-fetch');

async function testToolGenResponse() {
    console.log('🔧 Testing ToolGen API Response Structure');
    console.log('=' * 50);
    
    try {
        const response = await fetch('http://localhost:8000/api/v1/tools', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_goal: "Design PCR primers for gene amplification",
                technique: "Primer Design", 
                data_type: "DNA sequence (FASTA format)",
                additional_context: "Need free tools only"
            })
        });
        
        const data = await response.json();
        
        console.log('Response structure:');
        console.log('- success:', data.success);
        console.log('- provider_used:', data.provider_used);
        console.log('- Has "tools" field:', !!data.tools);
        console.log('- Has "recommendations" field:', !!data.recommendations);
        console.log('- tools length:', data.tools ? data.tools.length : 'N/A');
        
        if (data.tools) {
            console.log('\n✅ Backend returns "tools" field correctly');
            console.log('Frontend should now display results properly');
        } else {
            console.log('\n❌ Backend not returning "tools" field');
        }
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

testToolGenResponse();
