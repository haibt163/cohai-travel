# Script to create a zip of cohai-travel project excluding unnecessary folders
# Run this in the project root directory: powershell -ExecutionPolicy Bypass -File create-project-zip.ps1

# Define folders and files to EXCLUDE
$excludeFolders = @(
    '.grok',
    '.omp',
    '.tanstack',
    '.artifacts',
    'node_modules',
    '.git',
    '.github',
    '.claude',
    'dist',
    'build',
    '.next',
    '.venv',
    'venv'
)

$excludeFiles = @(
    '.env',
    '.env.local',
    '.env.*.local',
    '*.lock',
    'node_modules.lock',
    '.DS_Store',
    'Thumbs.db'
)

# Get current directory
$projectRoot = Get-Location
$projectName = Split-Path -Leaf $projectRoot
$outputZip = "$projectRoot/../${projectName}-review.zip"

Write-Host "Creating zip file: $outputZip" -ForegroundColor Green
Write-Host "Project root: $projectRoot" -ForegroundColor Cyan

# Create a temporary folder to stage files
$tempFolder = Join-Path $env:TEMP "cohai-travel-temp"
if (Test-Path $tempFolder) {
    Remove-Item $tempFolder -Recurse -Force
}
New-Item -ItemType Directory -Path $tempFolder | Out-Null

Write-Host "Copying files..." -ForegroundColor Yellow

# Copy all files from project root, excluding what we don't want
Get-ChildItem -Path $projectRoot -File | ForEach-Object {
    $shouldExclude = $false
    foreach ($pattern in $excludeFiles) {
        if ($_.Name -like $pattern) {
            $shouldExclude = $true
            break
        }
    }
    
    if (-not $shouldExclude) {
        Copy-Item $_.FullName -Destination $tempFolder
        Write-Host "  ✓ $($_.Name)"
    }
}

# Copy folders recursively, excluding unwanted ones
Get-ChildItem -Path $projectRoot -Directory | ForEach-Object {
    if ($excludeFolders -notcontains $_.Name) {
        $destPath = Join-Path $tempFolder $_.Name
        Copy-Item $_.FullName -Destination $destPath -Recurse -Force
        Write-Host "  ✓ $($_.Name)/" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $($_.Name)/ (excluded)" -ForegroundColor Gray
    }
}

# Create the zip file
Write-Host "Compressing to zip..." -ForegroundColor Yellow
Compress-Archive -Path "$tempFolder/*" -DestinationPath $outputZip -Force

# Cleanup temp folder
Remove-Item $tempFolder -Recurse -Force

$zipSize = (Get-Item $outputZip).Length / 1MB
Write-Host "`n✅ Done! Created: $outputZip" -ForegroundColor Green
Write-Host "Size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Cyan

Write-Host "`nIncluded folders:" -ForegroundColor Yellow
Get-ChildItem -Path $projectRoot -Directory | Where-Object { $excludeFolders -notcontains $_.Name } | ForEach-Object {
    Write-Host "  • $($_.Name)"
}

Write-Host "`nExcluded folders:" -ForegroundColor Gray
$excludeFolders | ForEach-Object {
    Write-Host "  • $_"
}
