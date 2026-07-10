$base = 'C:\Users\Nbana\Desktop\Html\The Story Painter'
for ($i = 1; $i -le 10; $i++) {
    $src = Join-Path $base ("painting$($i).jpg")
    $dst = Join-Path $base ("painting$($i+10).jpg")
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dst -Force
        Write-Host "Copied: $dst"
    } else {
        Write-Host "Missing source: $src"
    }
}