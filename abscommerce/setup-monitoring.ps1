# setup-monitoring.ps1
# Script to configure Cloud Monitoring after deployment

$SERVICE_NAME = "sampada"
$REGION = "us-central1"

Write-Host "1. Updating Cloud Run Service with Health Check..."
gcloud run services update $SERVICE_NAME --region=$REGION --health-check-path=/api/health --health-check-initial-delay=15s --health-check-timeout=5s --health-check-failure-threshold=3

Write-Host "2. Verifying Dashboard Creation..."
# Already created in previous step, but useful to list
gcloud monitoring dashboards list --filter="displayName:Sampada"

Write-Host "3. Instructions for Alerts:"
Write-Host "   - Go to Google Cloud Console > Monitoring > Alerting"
Write-Host "   - Click 'Create Policy'"
Write-Host "   - Import the JSON from monitoring/alert-policy.json if supported, or create manually."
Write-Host "   - Add your Email to Notification Channels."

Write-Host "✅ Monitoring Setup Complete!"
