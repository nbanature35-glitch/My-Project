$base = 'C:\Users\Nbana\Desktop\Html\The Story Painter'
$expected = @('hero.jpg','index-bg.jpg') + (1..10 | ForEach-Object { "painting$_.jpg" })
foreach($name in $expected){
    $matches = Get-ChildItem -Path $base | Where-Object { $_.Name -like "$name*" }
    if($matches.Count -eq 0){ continue }
    # prefer exact name if present
    $exact = $matches | Where-Object { $_.Name -eq $name } | Select-Object -First 1
    if($exact){
        $others = $matches | Where-Object { $_.Name -ne $name }
        $i=1
        foreach($o in $others){
            $new = Join-Path $base ("$($name).old$i")
            Rename-Item -Path $o.FullName -NewName ([IO.Path]::GetFileName($new)) -Force
            $i++
        }
    } else {
        # rename first match to exact, others to .old
        $first = $matches[0]
        Rename-Item -Path $first.FullName -NewName $name -Force
        $others = $matches | Where-Object { $_.FullName -ne (Join-Path $base $name) }
        $i=1
        foreach($o in $others){
            $new = Join-Path $base ("$($name).old$i")
            Rename-Item -Path $o.FullName -NewName ([IO.Path]::GetFileName($new)) -Force
            $i++
        }
    }
}
# show final listing
Get-ChildItem -Path $base | Sort-Object Name | ForEach-Object { Write-Host $_.Name $_.Length }
Write-Host 'sanitize done'