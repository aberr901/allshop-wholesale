// Toast Notification System
// Replaces browser alert() with professional on-page notifications

class NotificationSystem {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create notification container
        this.container = document.createElement('div');
        this.container.id = 'notificationContainer';
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const iconMap = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">${iconMap[type] || iconMap.info}</div>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        this.container.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
        
        return notification;
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    confirm(message, onConfirm, onCancel) {
        const modal = document.createElement('div');
        modal.className = 'notification-modal';
        
        modal.innerHTML = `
            <div class="notification-modal-backdrop"></div>
            <div class="notification-modal-content">
                <div class="notification-modal-header">
                    <h3>Confirm Action</h3>
                </div>
                <div class="notification-modal-body">
                    <p>${message}</p>
                </div>
                <div class="notification-modal-footer">
                    <button class="btn-secondary" data-action="cancel">Cancel</button>
                    <button class="btn-primary" data-action="confirm">Confirm</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
        
        modal.querySelector('[data-action="confirm"]').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
            if (onConfirm) onConfirm();
        });
        
        modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
            if (onCancel) onCancel();
        });
        
        modal.querySelector('.notification-modal-backdrop').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
            if (onCancel) onCancel();
        });
    }
}

// Global instance
const notify = new NotificationSystem();

// Override native alert (optional - for gradual migration)
// window.alert = (msg) => notify.info(msg);
