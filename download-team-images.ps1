# PowerShell script to download team member images
$teamJson = Get-Content -Path "project/src/content/pages/team.json" | ConvertFrom-Json

# Create the output directory if it doesn't exist
$outputDir = "project/public/images/team"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

# Download each team member image
foreach ($member in $teamJson.teamMembers) {
    $imageUrl = $member.image
    $id = $member.id
    $outputPath = "$outputDir/$id.jpg"
    
    Write-Host "Downloading image for $($member.name) from $imageUrl to $outputPath"
    
    try {
        Invoke-WebRequest -Uri $imageUrl -OutFile $outputPath
        Write-Host "Successfully downloaded image for $($member.name)" -ForegroundColor Green
    } catch {
        Write-Host "Failed to download image for $($member.name): $_" -ForegroundColor Red
    }
}

Write-Host "All images downloaded successfully!" -ForegroundColor Green
