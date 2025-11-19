/**
 * X AI Telegram Mini App - Telegram Web App API Integration
 * Handles all interactions with Telegram Web App API
 */

// ===== Telegram Web App Instance =====
const tg = window.Telegram?.WebApp;

// ===== Configuration =====
const BOT_WEBHOOK_URL = 'https://x-ai-v9cy.onrender.com/webhook'; // TODO: Replace with actual webhook URL

// ===== Telegram App Manager =====
const TelegramApp = {
    
    // Initialize Telegram Web App
    init() {
        console.log('Initializing Telegram Web App...');
        
        if (!tg) {
            console.warn('Telegram Web App API not available. Running in browser mode.');
            this.isInTelegram = false;
            return;
        }
        
        this.isInTelegram = true;
        
        // Expand to full height
        tg.expand();
        
        // Enable closing confirmation
        tg.enableClosingConfirmation();
        
        // Set header color
        tg.setHeaderColor('#000000');
        
        // Set background color
        tg.setBackgroundColor('#0A0A0A');
        
        // Get user data
        this.user = this.getUserData();
        
        console.log('Telegram Web App initialized', this.user);
        
        // Setup main button
        this.setupMainButton();
        
        // Listen for theme changes
        tg.onEvent('themeChanged', () => {
            console.log('Theme changed:', tg.colorScheme);
        });
        
        // Haptic feedback on ready
        this.hapticFeedback('impact', 'light');
    },
    
    // Get user data from Telegram
    getUserData() {
        if (!tg || !tg.initDataUnsafe) {
            // Fallback for browser testing
            return {
                id: 123456789,
                first_name: 'Test',
                last_name: 'User',
                username: 'testuser',
                language_code: 'en',
                photo_url: null
            };
        }
        
        const user = tg.initDataUnsafe.user || {};
        return {
            id: user.id,
            first_name: user.first_name || 'User',
            last_name: user.last_name || '',
            username: user.username || '',
            language_code: user.language_code || 'en',
            photo_url: user.photo_url || null
        };
    },
    
    // Send data to bot
    sendDataToBot(data) {
        console.log('Sending data to bot:', data);
        
        if (!this.isInTelegram) {
            console.warn('Not in Telegram context. Data:', data);
            // Simulate bot response for testing
            setTimeout(() => {
                window.utils.showToast('Action simulated (browser mode)');
            }, 500);
            return;
        }
        
        try {
            // Send data via Telegram Web App API
            tg.sendData(JSON.stringify(data));
            
            // Also log for debugging
            this.logBotCommunication('send', data);
        } catch (error) {
            console.error('Error sending data to bot:', error);
            window.utils.showToast('Failed to communicate with bot');
        }
    },
    
    // Setup Main Button
    setupMainButton() {
        if (!tg) return;
        
        // Hide by default
        tg.MainButton.hide();
        
        // Set default properties
        tg.MainButton.setParams({
            color: '#8B5CF6',
            text_color: '#FFFFFF',
            is_active: true,
            is_visible: false
        });
        
        // Click handler
        tg.MainButton.onClick(() => {
            console.log('Main button clicked');
            this.hapticFeedback('impact', 'medium');
        });
    },
    
    // Show Main Button
    showMainButton(text, onClick) {
        if (!tg) return;
        
        tg.MainButton.setText(text);
        tg.MainButton.show();
        
        // Remove previous listeners and add new one
        tg.MainButton.offClick();
        tg.MainButton.onClick(() => {
            this.hapticFeedback('impact', 'medium');
            onClick();
        });
    },
    
    // Hide Main Button
    hideMainButton() {
        if (!tg) return;
        tg.MainButton.hide();
    },
    
    // Setup Back Button
    showBackButton(onClick) {
        if (!tg) return;
        
        tg.BackButton.show();
        tg.BackButton.onClick(() => {
            this.hapticFeedback('impact', 'light');
            onClick();
        });
    },
    
    hideBackButton() {
        if (!tg) return;
        tg.BackButton.hide();
        tg.BackButton.offClick();
    },
    
    // Haptic Feedback
    hapticFeedback(type = 'impact', style = 'medium') {
        if (!tg || !tg.HapticFeedback) return;
        
        try {
            if (type === 'impact') {
                tg.HapticFeedback.impactOccurred(style); // light, medium, heavy, rigid, soft
            } else if (type === 'notification') {
                tg.HapticFeedback.notificationOccurred(style); // error, success, warning
            } else if (type === 'selection') {
                tg.HapticFeedback.selectionChanged();
            }
        } catch (error) {
            console.error('Haptic feedback error:', error);
        }
    },
    
    // Close the Mini App
    close() {
        if (!tg) return;
        tg.close();
    },
    
    // Open link in browser
    openLink(url, options = {}) {
        if (!tg) {
            window.open(url, '_blank');
            return;
        }
        
        try {
            tg.openLink(url, options);
        } catch (error) {
            console.error('Error opening link:', error);
            window.open(url, '_blank');
        }
    },
    
    // Open Telegram link
    openTelegramLink(url) {
        if (!tg) {
            window.open(url, '_blank');
            return;
        }
        
        try {
            tg.openTelegramLink(url);
        } catch (error) {
            console.error('Error opening Telegram link:', error);
            window.open(url, '_blank');
        }
    },
    
    // Show popup
    showPopup(params) {
        if (!tg || !tg.showPopup) {
            alert(params.message);
            return;
        }
        
        tg.showPopup(params, (buttonId) => {
            console.log('Popup button clicked:', buttonId);
        });
    },
    
    // Show confirm dialog
    showConfirm(message, callback) {
        if (!tg || !tg.showConfirm) {
            const result = confirm(message);
            callback(result);
            return;
        }
        
        tg.showConfirm(message, callback);
    },
    
    // Show alert
    showAlert(message, callback) {
        if (!tg || !tg.showAlert) {
            alert(message);
            if (callback) callback();
            return;
        }
        
        tg.showAlert(message, callback);
    },
    
    // Log bot communication for debugging
    logBotCommunication(direction, data) {
        console.log(`[BOT ${direction.toUpperCase()}]`, {
            timestamp: new Date().toISOString(),
            direction,
            data,
            user: this.user
        });
    },
    
    // Bot Communication Actions
    actions: {
        // Initialize payment
        initPayment(plan, method) {
            const data = {
                action: 'init_payment',
                plan: plan, // 'weekly' or 'monthly'
                method: method, // 'chapa', 'telegram', 'stars', 'wallet'
                user_id: TelegramApp.user.id
            };
            TelegramApp.sendDataToBot(data);
        },
        
        // Claim prediction
        claimPrediction(predictionId = null) {
            const data = {
                action: 'claim_prediction',
                prediction_id: predictionId,
                user_id: TelegramApp.user.id
            };
            TelegramApp.sendDataToBot(data);
        },
        
        // Get referral link
        getReferralLink() {
            const data = {
                action: 'get_referral_link',
                user_id: TelegramApp.user.id
            };
            TelegramApp.sendDataToBot(data);
        },
        
        // Update settings
        updateSettings(settings) {
            const data = {
                action: 'update_settings',
                settings: settings,
                user_id: TelegramApp.user.id
            };
            TelegramApp.sendDataToBot(data);
        },
        
        // Check subscription status
        checkSubscription() {
            const data = {
                action: 'check_subscription',
                user_id: TelegramApp.user.id
            };
            TelegramApp.sendDataToBot(data);
        },
        
        // Get prediction history
        getHistory(filter = 'all') {
            const data = {
                action: 'get_history',
                filter: filter, // 'all', 'won', 'lost', 'open'
                user_id: TelegramApp.user.id
            };
            TelegramApp.sendDataToBot(data);
        },
        
        // Get referral stats
        getReferralStats() {
            const data = {
                action: 'get_referral_stats',
                user_id: TelegramApp.user.id
            };
            TelegramApp.sendDataToBot(data);
        }
    }
};

// ===== Export for global use =====
window.TelegramApp = TelegramApp;
