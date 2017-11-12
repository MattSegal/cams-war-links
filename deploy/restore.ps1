<#
Restore database from S3 backups
#>
param(
    [Parameter(Mandatory=$true)]
    [String]$Server
)

$APP_NAME = "links"

$choice = ""
while ($choice -NotMatch "[y|n]") {
    $choice = Read-Host "Do you want to restore ${Server}? (y/n)"
}

if ($choice -eq "y") {
    Write-Host "Fetching latest backup from S3..."
    ./env/Scripts/activate
    $backup = python ./scripts/backup_file.py download
    deactivate
    Write-Host "Fetched $backup"

    Write-Host "Restoring backups to $Server"
    bash ./scripts/restore_db_backups.sh $APP_NAME $Server $backup

    Remove-Item $backup
} else {
    Write-Host "Aborting backup to $Server"
}
