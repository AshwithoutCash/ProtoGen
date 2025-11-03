$body = @{
    experimental_goal = "Amplify a target gene for cloning into expression vector"
    technique = "PCR"
    reagents = "Q5 High-Fidelity DNA Polymerase, dNTPs, primers"
    template_details = "Human genomic DNA, 100 ng/µL"
    primer_details = "Forward: ATGCGATCGATCG, Reverse: CGATCGATCGCAT"
    amplicon_size = "1200 bp"
    reaction_volume = "25"
    num_reactions = "1"
    other_params = "High GC content region"
    llm_provider = "gemini"
} | ConvertTo-Json

Write-Host "Testing Protocol Generation with Local AI Stack..."
Write-Host "Request body:"
Write-Host $body

$response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/generate" -Method POST -ContentType "application/json" -Body $body

Write-Host "`nResponse:"
Write-Host "Success: $($response.success)"
Write-Host "Provider: $($response.provider_used)"
Write-Host "Protocol (first 500 chars):"
Write-Host $response.protocol.Substring(0, [Math]::Min(500, $response.protocol.Length))
