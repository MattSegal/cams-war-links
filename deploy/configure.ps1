<#
Uses Ansible to configure the target webserver for deployment
#>

# Test that Ansible is installed in the Unix Subsystem
bash -c "ansible-playbook --help" *> $null
if ($LastExitCode -ne 0) {
    Write-Host "Ansible not installed in Unix Subsystem - you gotta fix that"
    exit 0
}

bash -c "ansible-playbook -i ./ansible/hosts ./ansible/site.yml"
