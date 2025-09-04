# PowerShell script to remove all comments from JavaScript and JSX files

function Remove-Comments {
    param([string]$filePath)
    
    try {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        if (-not $content) { return }
        
        # Remove single-line comments (// comment) at the beginning of lines
        $content = $content -replace '(?m)^\s*//.*$', ''
        
        # Remove inline comments (code // comment) but preserve URLs
        $content = $content -replace '([^"\''`:`/])\s*//[^\r\n]*$', '$1'
        
        # Remove multi-line comments (/* comment */) - be careful with regex patterns
        $content = $content -replace '/\*[\s\S]*?\*/', ''
        
        # Remove empty lines that were left after removing comments (but keep some structure)
        $content = $content -replace '(?m)^\s*$(\r?\n)', ''
        
        # Remove multiple consecutive empty lines (more than 2)
        $content = $content -replace '(\r?\n){3,}', "`n`n"
        
        # Write back to file
        [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Processed: $filePath" -ForegroundColor Green
    }
    catch {
        Write-Host "Error processing $filePath : $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Process-Directory {
    param([string]$directory)
    
    Get-ChildItem -Path $directory -Recurse -Include "*.js", "*.jsx" | ForEach-Object {
        Remove-Comments -filePath $_.FullName
    }
}

# Main execution
Write-Host "Starting comment removal process..." -ForegroundColor Yellow
Write-Host "Processing backend files..." -ForegroundColor Cyan
Process-Directory -directory ".\backend\src"

Write-Host "Processing frontend files..." -ForegroundColor Cyan  
Process-Directory -directory ".\frontend\src"

Write-Host "Comment removal completed!" -ForegroundColor Green
