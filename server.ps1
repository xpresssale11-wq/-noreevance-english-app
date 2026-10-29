param(
    [int]$Port = 3080,
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
$PublicDir = Join-Path $PSScriptRoot "public"
$StudioHtmlPath = Join-Path $PublicDir "studio.html"

if (-not (Test-Path $StudioHtmlPath)) {
    Write-Host "Could not find $StudioHtmlPath" -ForegroundColor Red
    exit 1
}

$Endpoint = New-Object System.Net.IPEndPoint([System.Net.IPAddress]::Loopback, $Port)
$Listener = New-Object System.Net.Sockets.TcpListener($Endpoint)
$Listener.Start()

$Url = "http://localhost:$Port/"
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "  Noree Vance - Gentle Framework English Studio" -ForegroundColor Green
Write-Host "  Listening at: $Url" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop the studio server." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host ""

if (-not $NoBrowser) {
    Start-Process $Url
}

$CrLf = [char]13 + [char]10

try {
    while ($true) {
        $Client = $Listener.AcceptTcpClient()
        try {
            $Stream = $Client.GetStream()
            $Reader = New-Object System.IO.StreamReader($Stream)
            $RequestLine = $Reader.ReadLine()
            while ($Reader.Peek() -ge 0) {
                $Line = $Reader.ReadLine()
                if ([string]::IsNullOrEmpty($Line)) { break }
            }

            $ReqPath = "/"
            if ($RequestLine -match "^[A-Z]+\s+([^\s\?]+)") {
                $ReqPath = [System.Uri]::UnescapeDataString($Matches[1])
            }

            $TargetFile = $StudioHtmlPath
            $MimeType = "text/html; charset=utf-8"

            if ($ReqPath -ne "/" -and $ReqPath -ne "/index.html") {
                $SafeRel = $ReqPath.TrimStart('/').Replace('/', '\')
                $Candidate = Join-Path $PublicDir $SafeRel
                if (Test-Path $Candidate -PathType Leaf) {
                    $TargetFile = $Candidate
                    $Ext = [System.IO.Path]::GetExtension($TargetFile).ToLowerInvariant()
                    switch ($Ext) {
                        ".png"  { $MimeType = "image/png" }
                        ".jpg"  { $MimeType = "image/jpeg" }
                        ".jpeg" { $MimeType = "image/jpeg" }
                        ".webp" { $MimeType = "image/webp" }
                        ".svg"  { $MimeType = "image/svg+xml" }
                        ".ico"  { $MimeType = "image/x-icon" }
                        ".wav"  { $MimeType = "audio/wav" }
                        ".mp3"  { $MimeType = "audio/mpeg" }
                        ".ogg"  { $MimeType = "audio/ogg" }
                        ".css"  { $MimeType = "text/css; charset=utf-8" }
                        ".js"   { $MimeType = "application/javascript; charset=utf-8" }
                        default { $MimeType = "application/octet-stream" }
                    }
                }
            }

            $BodyBytes = [System.IO.File]::ReadAllBytes($TargetFile)
            $HeaderLines = @(
                "HTTP/1.1 200 OK",
                "Content-Type: $MimeType",
                "Content-Length: $($BodyBytes.Length)",
                "Cache-Control: no-cache",
                "Connection: close",
                "",
                ""
            ) -join $CrLf
            $HeaderBytes = [System.Text.Encoding]::ASCII.GetBytes($HeaderLines)

            $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
            $Stream.Write($BodyBytes, 0, $BodyBytes.Length)
            $Stream.Flush()
        } catch {
            # Ignore client disconnect errors
        } finally {
            $Client.Close()
        }
    }
} finally {
    $Listener.Stop()
}
