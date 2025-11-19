/**
 * X AI Telegram Mini App - Client-Side Router
 * Handles navigation between different views/screens
 */

const Router = {
    currentRoute: null,
    routes: {},
    
    // Initialize router
    init() {
        console.log('Initializing router...');
        
        // Register routes
        this.registerRoutes();
        
        // Handle navigation
        this.setupNavigation();
        
        // Load initial route
        const initialRoute = this.getInitialRoute();
        this.navigate(initialRoute);
    },
    
    // Register all routes
    registerRoutes() {
        this.routes = {
            'landing': {
                render: this.renderLanding,
                requiresAuth: false,
                showBottomNav: false
            },
            'subscribe': {
                render: this.renderSubscribe,
                requiresAuth: false,
                showBottomNav: false
            },
            'payment': {
                render: this.renderPayment,
                requiresAuth: false,
                showBottomNav: false
            },
            'dashboard': {
                render: this.renderDashboard,
                requiresAuth: true,
                showBottomNav: true
            },
            'history': {
                render: this.renderHistory,
                requiresAuth: true,
                showBottomNav: true
            },
            'referrals': {
                render: this.renderReferrals,
                requiresAuth: true,
                showBottomNav: true
            },
            'account': {
                render: this.renderAccount,
                requiresAuth: true,
                showBottomNav: true
            },
            'settings': {
                render: this.renderSettings,
                requiresAuth: true,
                showBottomNav: false
            }
        };
    },
    
    // Setup navigation event listeners
    setupNavigation() {
        // Bottom navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const route = e.currentTarget.dataset.tab;
                this.navigate(route);
                window.TelegramApp.hapticFeedback('selection');
            });
        });
    },
    
    // Get initial route based on subscription status
    getInitialRoute() {
        // Check if user is subscribed (from localStorage)
        const isSubscribed = window.utils.storage.get('isSubscribed', false);
        return isSubscribed ? 'dashboard' : 'landing';
    },
    
    // Navigate to a route
    navigate(routeName, params = {}) {
        console.log('Navigating to:', routeName, params);
        
        const route = this.routes[routeName];
        
        if (!route) {
            console.error('Route not found:', routeName);
            return;
        }
        
        // Update current route
        this.currentRoute = routeName;
        
        // Update bottom navigation visibility and active state
        this.updateBottomNav(route.showBottomNav, routeName);
        
        // Render the route
        const app = document.getElementById('app');
        app.innerHTML = '';
        app.className = 'min-h-screen pb-20 fade-in';
        
        route.render.call(this, app, params);
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Save current route
        window.utils.storage.set('lastRoute', routeName);
    },
    
    // Update bottom navigation
    updateBottomNav(show, activeTab) {
        const bottomNav = document.getElementById('bottom-nav');
        
        if (show) {
            bottomNav.classList.remove('hidden');
            
            // Update active tab
            document.querySelectorAll('.nav-tab').forEach(tab => {
                if (tab.dataset.tab === activeTab) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        } else {
            bottomNav.classList.add('hidden');
        }
    },
    
    // ===== ROUTE RENDERERS =====
    
    // Landing Page
    renderLanding(container) {
        container.innerHTML = `
            <div class="min-h-screen flex flex-col items-center justify-center px-4 hero-glow">
                <!-- Logo -->
                <div class="mb-8">
                    <svg class="w-20 h-20 text-purple-400" viewBox="0 0 100 100" fill="currentColor">
                        <text x="50" y="65" font-family="Outfit, sans-serif" font-size="60" font-weight="700" text-anchor="middle" fill="url(#gradient)">
                            X
                        </text>
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#C084FC;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                
                <!-- Hero Text -->
                <h1 class="text-4xl font-display font-bold text-center mb-4 leading-tight" style="letter-spacing: -0.02em;">
                    Daily Sure 2.0+ Odds
                </h1>
                <p class="text-lg text-text-secondary text-center mb-12 max-w-md leading-relaxed">
                    Expert football predictions delivered daily. Join thousands of winners.
                </p>
                
                <!-- CTA Button -->
                <button onclick="Router.navigate('subscribe')" class="btn-primary text-base px-12 h-14 mb-16 pulse-glow">
                    Get Started
                </button>
                
                <!-- Stats Bar -->
                <div class="grid grid-cols-3 gap-6 w-full max-w-md">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-400 mb-1">87%</div>
                        <div class="text-xs text-text-tertiary uppercase tracking-wide">Win Rate</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-400 mb-1">5K+</div>
                        <div class="text-xs text-text-tertiary uppercase tracking-wide">Users</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-400 mb-1">2.0+</div>
                        <div class="text-xs text-text-tertiary uppercase tracking-wide">Odds</div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Subscription Plans Page
    renderSubscribe(container) {
        const selectedPlan = window.utils.sessionStorage.get('selectedPlan', null);
        
        container.innerHTML = `
            <div class="px-4 py-8 max-w-md mx-auto">
                <!-- Header -->
                <div class="text-center mb-8">
                    <svg class="w-16 h-16 text-purple-400 mx-auto mb-4" viewBox="0 0 100 100" fill="currentColor">
                        <text x="50" y="65" font-family="Outfit, sans-serif" font-size="60" font-weight="700" text-anchor="middle" fill="url(#gradient)">
                            X
                        </text>
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#C084FC;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <h1 class="text-3xl font-display font-bold mb-2">Choose Your Plan</h1>
                    <p class="text-text-secondary">Select a plan to get started</p>
                </div>
                
                <!-- Plan Cards -->
                <div class="space-y-4 mb-8">
                    <!-- Weekly Plan -->
                    <div class="card card-interactive hover:border-purple-500" onclick="selectPlan('weekly')">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <h3 class="text-xl font-semibold mb-1">Weekly Plan</h3>
                                <p class="text-sm text-text-secondary">7 days of predictions</p>
                            </div>
                            <div class="badge badge-warning">Popular</div>
                        </div>
                        <div class="text-3xl font-mono font-bold text-purple-400 mb-4">$9.99</div>
                        <ul class="space-y-2 text-sm text-text-secondary mb-6">
                            <li class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                Daily 2.0+ odds predictions
                            </li>
                            <li class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                Expert analysis included
                            </li>
                            <li class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                Performance tracking
                            </li>
                        </ul>
                        <button class="btn-primary w-full">Select Weekly</button>
                    </div>
                    
                    <!-- Monthly Plan -->
                    <div class="card card-interactive hover:border-purple-500 relative" onclick="selectPlan('monthly')">
                        <div class="absolute -top-3 right-4">
                            <div class="badge badge-success">Best Value</div>
                        </div>
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <h3 class="text-xl font-semibold mb-1">Monthly Plan</h3>
                                <p class="text-sm text-text-secondary">30 days of predictions</p>
                            </div>
                        </div>
                        <div class="text-3xl font-mono font-bold text-purple-400 mb-1">$29.99</div>
                        <div class="text-sm text-success mb-4">Save $10 vs weekly</div>
                        <ul class="space-y-2 text-sm text-text-secondary mb-6">
                            <li class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                All weekly plan features
                            </li>
                            <li class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                Priority support
                            </li>
                            <li class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                Exclusive insights
                            </li>
                        </ul>
                        <button class="btn-primary w-full">Select Monthly</button>
                    </div>
                </div>
                
                <!-- Back to Landing -->
                <button onclick="Router.navigate('landing')" class="btn-ghost w-full">
                    Back
                </button>
            </div>
        `;
    },
    
    // Payment Method Selection Page
    renderPayment(container) {
        const selectedPlan = window.utils.sessionStorage.get('selectedPlan', 'weekly');
        const planPrices = { weekly: '$9.99', monthly: '$29.99' };
        const planNames = { weekly: 'Weekly Plan', monthly: 'Monthly Plan' };
        
        container.innerHTML = `
            <div class="px-4 py-8 max-w-md mx-auto">
                <!-- Header -->
                <div class="text-center mb-6">
                    <svg class="w-16 h-16 text-purple-400 mx-auto mb-4" viewBox="0 0 100 100" fill="currentColor">
                        <text x="50" y="65" font-family="Outfit, sans-serif" font-size="60" font-weight="700" text-anchor="middle" fill="url(#gradient)">
                            X
                        </text>
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#C084FC;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <h1 class="text-3xl font-display font-bold mb-2">Payment Method</h1>
                    <p class="text-text-secondary">Choose how you'd like to pay</p>
                </div>
                
                <!-- Selected Plan Summary -->
                <div class="card mb-6 bg-purple-500 bg-opacity-10 border-purple-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm text-text-secondary mb-1">Selected Plan</div>
                            <div class="text-lg font-semibold">${planNames[selectedPlan]}</div>
                        </div>
                        <div class="text-2xl font-mono font-bold text-purple-400">${planPrices[selectedPlan]}</div>
                    </div>
                </div>
                
                <!-- Payment Methods Grid -->
                <div class="grid grid-cols-2 gap-3 mb-6">
                    <!-- Chapa Payment -->
                    <div class="card card-interactive p-6 hover:border-purple-500" onclick="processPayment('chapa')">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                </svg>
                            </div>
                            <div class="font-semibold text-sm">Chapa</div>
                        </div>
                    </div>
                    
                    <!-- Telegram Payments -->
                    <div class="card card-interactive p-6 hover:border-purple-500" onclick="processPayment('telegram')">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg class="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.154.232.17.326.016.094.036.306.02.472z"/>
                                </svg>
                            </div>
                            <div class="font-semibold text-sm">Telegram</div>
                        </div>
                    </div>
                    
                    <!-- Telegram Stars -->
                    <div class="card card-interactive p-6 hover:border-purple-500" onclick="processPayment('stars')">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                                </svg>
                            </div>
                            <div class="font-semibold text-sm">Stars</div>
                        </div>
                    </div>
                    
                    <!-- Telegram Wallet -->
                    <div class="card card-interactive p-6 hover:border-purple-500" onclick="processPayment('wallet')">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                </svg>
                            </div>
                            <div class="font-semibold text-sm">Wallet</div>
                        </div>
                    </div>
                </div>
                
                <!-- Back Button -->
                <button onclick="Router.navigate('subscribe')" class="btn-ghost w-full">
                    Back to Plans
                </button>
            </div>
        `;
    },
    
    // Dashboard (Home Tab) - Will be implemented in app.js
    renderDashboard(container) {
        // Implemented in app.js
        window.renderDashboardPage(container);
    },
    
    // History Page - Will be implemented in app.js
    renderHistory(container) {
        // Implemented in app.js
        window.renderHistoryPage(container);
    },
    
    // Referrals Page - Will be implemented in app.js
    renderReferrals(container) {
        // Implemented in app.js
        window.renderReferralsPage(container);
    },
    
    // Account Page - Will be implemented in app.js
    renderAccount(container) {
        // Implemented in app.js
        window.renderAccountPage(container);
    },
    
    // Settings Page - Will be implemented in app.js
    renderSettings(container) {
        // Implemented in app.js
        window.renderSettingsPage(container);
    }
};

// ===== Global Functions for Button Handlers =====

function selectPlan(plan) {
    console.log('Plan selected:', plan);
    window.utils.sessionStorage.set('selectedPlan', plan);
    window.TelegramApp.hapticFeedback('impact', 'light');
    Router.navigate('payment');
}

function processPayment(method) {
    console.log('Payment method selected:', method);
    const plan = window.utils.sessionStorage.get('selectedPlan', 'weekly');
    
    window.utils.showLoading();
    window.TelegramApp.hapticFeedback('impact', 'medium');
    
    // Send payment initiation to bot
    window.TelegramApp.actions.initPayment(plan, method);
    
    // Simulate payment processing (in real app, wait for bot response)
    setTimeout(() => {
        window.utils.hideLoading();
        
        // For demo: mark as subscribed and navigate to dashboard
        window.utils.storage.set('isSubscribed', true);
        window.utils.storage.set('subscriptionPlan', plan);
        window.utils.storage.set('subscriptionExpiry', new Date(Date.now() + (plan === 'weekly' ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString());
        
        window.utils.showToast('Payment successful! Welcome to X AI');
        Router.navigate('dashboard');
    }, 2000);
}

// ===== Export Router =====
window.Router = Router;
