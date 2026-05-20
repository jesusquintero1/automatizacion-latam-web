# deploy.ps1 — deploy manual seguro a Cloudflare Workers.
#
# Carga el .env, valida que las env vars criticas esten presentes, builda
# Astro con esas vars en scope, verifica que el dist/ tenga AdSense, y
# solo entonces hace wrangler deploy. Imposible romper monetizacion sin
# darse cuenta.
#
# Uso desde la raiz del proyecto:
#   .\deploy.ps1

$ErrorActionPreference = 'Stop'

Write-Host "==> Cargando .env..." -ForegroundColor Cyan

if (-not (Test-Path '.env')) {
    Write-Host "ERROR: No existe .env en la carpeta actual." -ForegroundColor Red
    exit 1
}

# Cargar .env como env vars del proceso (sobreescribiendo si ya estan)
Get-Content '.env' | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith('#') -and $line.Contains('=')) {
        $key, $value = $line -split '=', 2
        $key = $key.Trim()
        $value = $value.Trim()
        Set-Item -Path "env:$key" -Value $value
    }
}

# Validaciones obligatorias
$criticas = @{
    'SITE_URL'              = 'https://automatizacionslatam.com'
    'PUBLIC_ADSENSE_CLIENT' = 'ca-pub-'
}

foreach ($var in $criticas.Keys) {
    $valor = [System.Environment]::GetEnvironmentVariable($var, 'Process')
    if (-not $valor) {
        Write-Host "ERROR: $var no esta definida en .env. Abortando." -ForegroundColor Red
        exit 1
    }
    $esperado = $criticas[$var]
    if (-not $valor.Contains($esperado)) {
        Write-Host "ERROR: $var = '$valor' no contiene '$esperado'. Abortando." -ForegroundColor Red
        exit 1
    }
    Write-Host "  OK $var = $valor" -ForegroundColor Green
}

Write-Host ""
Write-Host "==> Building con Astro..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm run build fallo. Abortando." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==> Validando que dist/index.html contiene ca-pub-..." -ForegroundColor Cyan
$indexHtml = Get-Content 'dist/index.html' -Raw
if (-not ($indexHtml -match 'ca-pub-')) {
    Write-Host "ERROR: dist/index.html NO contiene ca-pub-. Algo fallo durante el build." -ForegroundColor Red
    Write-Host "       Revisa Base.astro y el valor de PUBLIC_ADSENSE_CLIENT." -ForegroundColor Red
    exit 1
}
Write-Host "  OK dist/index.html contiene AdSense." -ForegroundColor Green

if (-not ($indexHtml -match 'pagead2\.googlesyndication\.com')) {
    Write-Host "ERROR: dist/index.html NO contiene el script async de AdSense." -ForegroundColor Red
    exit 1
}
Write-Host "  OK dist/index.html contiene el script async de AdSense." -ForegroundColor Green

Write-Host ""
Write-Host "==> Deploy a Cloudflare Workers..." -ForegroundColor Cyan
npx wrangler deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: wrangler deploy fallo." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==> Healthcheck post-deploy (esperando 10s para propagar)..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

$bust = [int][double]::Parse((Get-Date -UFormat %s))
$resp = Invoke-WebRequest -Uri "https://automatizacionslatam.com/?v=$bust" `
                          -Headers @{'Cache-Control' = 'no-cache'; 'Pragma' = 'no-cache'} `
                          -UseBasicParsing

if ($resp.Content -match 'ca-pub-') {
    Write-Host "  OK Produccion sirve AdSense correctamente." -ForegroundColor Green
} else {
    Write-Host "ERROR: Produccion NO sirve AdSense despues del deploy." -ForegroundColor Red
    Write-Host "       Puede ser cache de Cloudflare. Espera 1-2 min y vuelve a verificar manualmente." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "==> DEPLOY COMPLETADO con exito." -ForegroundColor Green
Write-Host "    https://automatizacionslatam.com/" -ForegroundColor Cyan
