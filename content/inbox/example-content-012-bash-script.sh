#!/bin/bash

# Automated Backup Script
# This script creates incremental backups of specified directories

set -e  # Exit on error

# Configuration
BACKUP_SOURCE="/home/user/documents"
BACKUP_DEST="/mnt/backup"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${DATE}"
LOG_FILE="/var/log/backup.log"

# Functions
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

check_disk_space() {
    local required_space=$1
    local available_space=$(df "$BACKUP_DEST" | awk 'NR==2 {print $4}')
    
    if [ "$available_space" -lt "$required_space" ]; then
        log_message "ERROR: Not enough disk space. Required: $required_space, Available: $available_space"
        exit 1
    fi
}

create_backup() {
    log_message "Starting backup of $BACKUP_SOURCE"
    
    # Estimate required space
    local size=$(du -s "$BACKUP_SOURCE" | awk '{print $1}')
    check_disk_space $((size * 2))  # 2x safety margin
    
    # Create backup using rsync
    rsync -avz --progress \
        --exclude="*.tmp" \
        --exclude="*.cache" \
        --exclude=".git/" \
        "$BACKUP_SOURCE/" "$BACKUP_DEST/$BACKUP_NAME/"
    
    if [ $? -eq 0 ]; then
        log_message "Backup completed successfully: $BACKUP_NAME"
        
        # Create a symlink to the latest backup
        ln -sfn "$BACKUP_DEST/$BACKUP_NAME" "$BACKUP_DEST/latest"
        
        # Clean up old backups (keep only last 7)
        cleanup_old_backups
    else
        log_message "ERROR: Backup failed"
        exit 1
    fi
}

cleanup_old_backups() {
    log_message "Cleaning up old backups..."
    cd "$BACKUP_DEST"
    ls -t | grep -E '^backup_[0-9]{8}_[0-9]{6}$' | tail -n +8 | xargs -r rm -rf
}

# Main execution
main() {
    log_message "=== Backup script started ==="
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then 
        log_message "WARNING: Running as root"
    fi
    
    # Verify directories exist
    if [ ! -d "$BACKUP_SOURCE" ]; then
        log_message "ERROR: Source directory does not exist: $BACKUP_SOURCE"
        exit 1
    fi
    
    if [ ! -d "$BACKUP_DEST" ]; then
        log_message "Creating backup destination: $BACKUP_DEST"
        mkdir -p "$BACKUP_DEST"
    fi
    
    # Perform backup
    create_backup
    
    # Send notification (optional)
    if command -v mail &> /dev/null; then
        echo "Backup completed: $BACKUP_NAME" | mail -s "Backup Success" admin@example.com
    fi
    
    log_message "=== Backup script completed ==="
}

# Run main function
main "$@"