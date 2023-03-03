try {
    $pythonVersion = (Get-Command -ErrorAction Stop python).Version.Major

    Write-Output "Starting web server on port 8080"
    Write-Output "You can visit the website at http://localhost:8080/index.html"
    Write-Output ""
        python -m http.server 8080
} catch {
    Write-Warning $Error[0]
    Write-Output "Python 3 must be installed to run the webserver - could not find python.exe in your PATH."
    exit
}