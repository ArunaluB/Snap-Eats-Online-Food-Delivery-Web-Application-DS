
interface NotificationOptionsExtended extends NotificationOptions {
    onClick?: () => void;
    tag?: string;
    renotify?: boolean;
  }
  
  class NotificationService {
    private audioElement: HTMLAudioElement | null = null;
  
    /**
     * Initialize the notification system
     * @param audioSrc Path to notification sound
     * @returns Current permission status
     */
    public init(audioSrc: string = '/sweet_but_psycho.mp3'): NotificationPermission | 'unsupported' {
      console.log('Initializing notification system for', this.getBrowserInfo());
  
      this.setupAudio(audioSrc);
  
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          this.registerServiceWorker();
        });
      }
  
      return this.getPermissionStatus();
    }
  
    private setupAudio(audioSrc: string): void {
      const audio = new Audio(audioSrc);
      audio.preload = 'auto';
      this.audioElement = audio;
  
      audio.onerror = () => {
        console.warn('Primary audio failed. Using fallback audio.');
        const fallbackAudio = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgA...');
        this.audioElement = fallbackAudio;
      };
  
      const unlockAudio = () => {
        if (this.audioElement) {
          const silentPlay = this.audioElement.play();
          if (silentPlay) {
            silentPlay.catch(() => {
              console.log('Audio context not yet unlocked');
            });
          }
        }
      };
  
      document.addEventListener('click', unlockAudio, { once: true });
      document.addEventListener('touchstart', unlockAudio, { once: true });
    }
  
    public playSound(): void {
      if (this.audioElement) {
        this.audioElement.currentTime = 0;
        this.audioElement.play().catch(err => {
          console.error('Error playing notification sound:', err);
        });
      }
    }
  
    public isSupported(): boolean {
      return 'Notification' in window;
    }
  
    public getPermissionStatus(): NotificationPermission | 'unsupported' {
      return this.isSupported() ? Notification.permission : 'unsupported';
    }
  
    public async requestPermission(): Promise<boolean> {
      if (!this.isSupported()) {
        console.warn('Notifications not supported in this browser');
        return false;
      }
  
      try {
        const permission = await Notification.requestPermission();
        console.log(`Notification permission response: ${permission}`);
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    }
  
    public async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/notification-sw.js');
          console.log('ServiceWorker registration successful with scope:', registration.scope);
          return registration;
        } catch (error) {
          console.error('ServiceWorker registration failed:', error);
          return null;
        }
      }
      return null;
    }
  
    public show(
      title: string,
      message: string,
      options: NotificationOptionsExtended = {}
    ): Notification | null {
      this.playSound();
  
      if (!this.isSupported()) {
        console.warn('Notifications not supported');
        this.showFallback(title, message);
        return null;
      }
  
      if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        this.showFallback(title, message);
  
        if (Notification.permission !== 'denied') {
          this.requestPermission();
        }
  
        return null;
      }
  
      try {
        const notificationOptions: NotificationOptions = {
          body: message,
          icon: '/active.png',
          badge: '/active.png',
          tag: options.tag || 'default-notification',
          requireInteraction: true,
          renotify: options.renotify || false,
          silent: false,
          ...options,
        };
  
        console.log('Creating notification with options:', notificationOptions);
  
        const notification = new Notification(title, notificationOptions);
  
        notification.onshow = () => console.log('Notification shown successfully');
        notification.onclick = options.onClick || (() => {
          console.log('Notification clicked');
          window.focus();
          notification.close();
        });
  
        notification.onerror = (err: Event) => {
          console.error('Notification error:', err);
          this.showFallback(title, message);
        };
  
        return notification;
      } catch (error) {
        console.error('Failed to create notification:', error);
        this.showFallback(title, message);
        return null;
      }
    }
  
    private showFallback(title: string, message: string): void {
      console.log('Using fallback notification method');
      this.showInAppNotification(title, message);
    }
  
    public showInAppNotification(title: string, message: string, duration: number = 7000): void {
      let container = document.getElementById('in-app-notification-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'in-app-notification-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
      }
  
      const notification = document.createElement('div');
      notification.style.backgroundColor = '#333';
      notification.style.color = 'white';
      notification.style.padding = '15px';
      notification.style.borderRadius = '5px';
      notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      notification.style.marginBottom = '10px';
      notification.style.width = '300px';
      notification.style.position = 'relative';
      notification.style.animation = 'slideIn 0.3s forwards';
  
      if (!document.getElementById('notification-animation-style')) {
        const style = document.createElement('style');
        style.id = 'notification-animation-style';
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
  
      const titleEl = document.createElement('h4');
      titleEl.textContent = title;
      titleEl.style.margin = '0 0 5px 0';
      titleEl.style.fontWeight = 'bold';
      notification.appendChild(titleEl);
  
      const messageEl = document.createElement('p');
      messageEl.textContent = message;
      messageEl.style.margin = '0';
      notification.appendChild(messageEl);
  
      const closeButton = document.createElement('button');
      closeButton.textContent = '×';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '5px';
      closeButton.style.right = '5px';
      closeButton.style.background = 'none';
      closeButton.style.border = 'none';
      closeButton.style.color = 'white';
      closeButton.style.fontSize = '20px';
      closeButton.style.cursor = 'pointer';
      closeButton.onclick = () => {
        notification.style.animation = 'slideOut 0.3s forwards';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      };
      notification.appendChild(closeButton);
  
      container.appendChild(notification);
  
      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.animation = 'slideOut 0.3s forwards';
          setTimeout(() => {
            if (notification.parentNode) {
              notification.remove();
            }
          }, 300);
        }
      }, duration);
    }
  
    public async test(): Promise<boolean> {
      console.log('Testing notification system...');
      console.log('Browser:', this.getBrowserInfo());
      console.log('Notification supported:', this.isSupported());
      console.log('Current permission:', this.getPermissionStatus());
  
      if (!this.isSupported()) {
        alert('Your browser does not support notifications. Using in-app notifications instead.');
        this.showFallback('Test Notification', 'This is a fallback notification');
        return false;
      }
  
      if (Notification.permission === 'denied') {
        alert('Notifications are blocked in your browser settings. Please enable them to receive order alerts.');
        this.showFallback('Test Notification', 'This is a fallback because notifications are blocked');
        return false;
      }
  
      if (Notification.permission === 'default') {
        const granted = await this.requestPermission();
        if (!granted) {
          alert('Notification permission was not granted. Using in-app notifications instead.');
          this.showFallback('Test Notification', 'This is a fallback notification');
          return false;
        }
      }
  
      await this.registerServiceWorker();
      this.playSound();
  
      const notification = this.show(
        'Test Notification',
        'If you can see this, notifications are working properly!',
        {
          tag: 'test-notification',
          renotify: true,
        }
      );
  
      return notification !== null;
    }
  
    public getBrowserInfo(): string {
      const userAgent = navigator.userAgent;
      if (/chrome|chromium|crios/i.test(userAgent)) return 'Chrome';
      if (/firefox|fxios/i.test(userAgent)) return 'Firefox';
      if (/safari/i.test(userAgent)) return 'Safari';
      if (/opr\//i.test(userAgent)) return 'Opera';
      if (/edg/i.test(userAgent)) return 'Edge';
      return 'Unknown';
    }
  }
  
  // Export singleton instance
  export const notificationService = new NotificationService();
  export default notificationService;
  