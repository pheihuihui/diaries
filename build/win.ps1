$pathArr = Get-ChildItem .\src\content\ | Select-Object -expand Name
$paths = $pathArr -join ","
webpack --env paths=$paths