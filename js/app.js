/**
 * X AI Telegram Mini App - Main Application Logic
 * Contains page renderers, mock data, and app initialization
 */

// ===== Mock Data =====
const MOCK_DATA = {
    // Mock predictions
    predictions: [
        {
            id: 'pred_001',
            homeTeam: 'Liverpool',
            awayTeam: 'Manchester United',
            league: 'Premier League',
            date: '2025-11-20T19:00:00Z',
            market: 'Over 2.5 Goals',
            odds: '2.45',
            confidence: 85,
            status: 'open',
            analysis: 'Both teams have strong attacking records this season. Liverpool averaging 2.8 goals per game at home, while Man United has conceded in their last 5 matches. Expect a high-scoring encounter.',
            claimed: false
        },
        {
            id: 'pred_002',
            homeTeam: 'Barcelona',
            awayTeam: 'Real Madrid',
            league: 'La Liga',
            date: '2025-11-19T20:00:00Z',
            market: 'Both Teams To Score',
            odds: '2.10',
            confidence: 78,
            status: 'win',
            claimed: true
        },
        {
            id: 'pred_003',
            homeTeam: 'Bayern Munich',
            awayTeam: 'Borussia Dortmund',
            league: 'Bundesliga',
            date: '2025-11-18T17:30:00Z',
            market: 'Bayern Win',
            odds: '2.25',
            confidence: 82,
            status: 'win',
            claimed: true
        },
        {
            id: 'pred_004',
            homeTeam: 'PSG',
            awayTeam: 'Lyon',
            league: 'Ligue 1',
            date: '2025-11-17T19:00:00Z',
            market: 'Over 3.5 Goals',
            odds: '2.60',
            confidence: 72,
            status: 'loss',
            claimed: true
        },
        {
            id: 'pred_005',
            homeTeam: 'Inter Milan',
            awayTeam: 'AC Milan',
            league: 'Serie A',
            date: '2025-11-16T20:45:00Z',
            market: 'Draw',
            odds: '3.20',
            confidence: 68,
            status: 'win',
            claimed: true
        }
    ],
    
    // Mock analytics data for charts
    analytics: {
        totalPredictions: 45,
        wins: 34,
        losses: 11,
        winRate: 76,
        trendData: [
            { date: '2025-11-12', winRate: 72 },
            { date: '2025-11-13', winRate: 75 },
            { date: '2025-11-14', winRate: 74 },
            { date: '2025-11-15', winRate: 76 },
            { date: '2025-11-16', winRate: 77 },
            { date: '2025-11-17', winRate: 75 },
            { date: '2025-11-18', winRate: 76 }
        ]
    },
    
    // Mock referral data
    referrals: {
        points: 450,
        totalReferrals: 15,
        pendingRewards: 3,
        referralLink: 'https://t.me/YOUR_BOT_USERNAME?start=ref_' + userId ,
        recentReferrals: [
            { name: 'John D.', date: '2025-11-18T10:00:00Z', status: 'active' },
            { name: 'Sarah M.', date: '2025-11-17T14:30:00Z', status: 'active' },
            { name: 'Mike R.', date: '2025-11-16T09:15:00Z', status: 'pending' }
        ]
    }
};

// ===== Dashboard Page Renderer =====
window.renderDashboardPage = function(container) {
    const user = window.TelegramApp.user;
    const todayPrediction = MOCK_DATA.predictions[0];
    const recentPredictions = MOCK_DATA.predictions.slice(1, 4);
    
    container.innerHTML = `
        <div class="px-4 py-6 max-w-md mx-auto">
            <!-- Top Bar -->
            <div class="flex items-center justify-between mb-8">
                <div>
                    <p class="text-sm text-text-secondary">Welcome back,</p>
                    <p class="text-lg font-semibold">${user.first_name}</p>
                </div>
                <svg class="w-12 h-12 text-purple-400" viewBox="0 0 100 100" fill="currentColor">
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
            
            <!-- Claim Prediction Section -->
            <div class="card mb-8 bg-purple-500 bg-opacity-10 border-purple-500 pulse-glow" style="min-height: 300px;">
                <div class="text-center">
                    <h2 class="text-2xl font-display font-bold mb-3">Today's Prediction</h2>
                    <p class="text-text-secondary mb-6">Your daily sure 2.0+ odds pick is ready!</p>
                    
                    ${todayPrediction.claimed ? `
                        <!-- Prediction Details -->
                        <div class="mb-6">
                            <div class="text-xl font-semibold mb-2">${todayPrediction.homeTeam} vs ${todayPrediction.awayTeam}</div>
                            <div class="text-sm text-text-secondary mb-4">${todayPrediction.league} • ${window.utils.formatDate(todayPrediction.date)}</div>
                            <div class="inline-block bg-bg-elevated px-6 py-3 rounded-xl border border-white border-opacity-10 mb-4">
                                <div class="text-xs text-text-secondary mb-1">Market</div>
                                <div class="text-lg font-semibold">${todayPrediction.market}</div>
                            </div>
                            <div class="text-4xl font-mono font-bold text-purple-400 mb-4">${todayPrediction.odds}</div>
                            
                            <!-- Confidence Bar -->
                            <div class="mb-4">
                                <div class="flex items-center justify-between text-sm mb-2">
                                    <span class="text-text-secondary">Confidence</span>
                                    <span class="text-purple-400 font-semibold">${todayPrediction.confidence}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${todayPrediction.confidence}%"></div>
                                </div>
                            </div>
                            
                            <!-- Status -->
                            <div class="mb-4">${window.utils.getStatusBadge(todayPrediction.status)}</div>
                            
                            <!-- Analysis -->
                            <div class="text-left bg-bg-elevated p-4 rounded-xl border border-white border-opacity-5">
                                <div class="text-xs text-text-secondary uppercase tracking-wide mb-2">Analysis</div>
                                <p class="text-sm text-text-secondary leading-relaxed">${todayPrediction.analysis}</p>
                            </div>
                        </div>
                    ` : `
                        <!-- Claim Button -->
                        <button onclick="claimPrediction()" class="btn-primary text-lg px-16 h-14 mb-4">
                            Claim Prediction
                        </button>
                        <p class="text-xs text-text-tertiary">Tap to reveal today's pick</p>
                    `}
                </div>
            </div>
            
            <!-- Recent Predictions -->
            <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold">Recent Predictions</h3>
                    <button onclick="Router.navigate('history')" class="text-sm text-purple-400 font-medium">View All</button>
                </div>
                
                <div class="space-y-3">
                    ${recentPredictions.map(pred => `
                        <div class="card p-4">
                            <div class="flex items-start justify-between mb-2">
                                <div class="flex-1">
                                    <div class="font-semibold mb-1">${pred.homeTeam} vs ${pred.awayTeam}</div>
                                    <div class="text-xs text-text-secondary">${pred.league} • ${window.utils.formatDate(pred.date)}</div>
                                </div>
                                ${window.utils.getStatusBadge(pred.status)}
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="text-sm text-text-secondary">${pred.market}</div>
                                <div class="text-lg font-mono font-semibold text-purple-400">${pred.odds}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
};

// ===== History Page Renderer =====
window.renderHistoryPage = function(container) {
    const analytics = MOCK_DATA.analytics;
    const predictions = MOCK_DATA.predictions.filter(p => p.claimed);
    let currentFilter = 'all';
    
    container.innerHTML = `
        <div class="px-4 py-6 max-w-md mx-auto">
            <!-- Header -->
            <div class="text-center mb-6">
                <svg class="w-12 h-12 text-purple-400 mx-auto mb-3" viewBox="0 0 100 100" fill="currentColor">
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
                <h1 class="text-3xl font-display font-bold">Prediction History</h1>
            </div>
            
            <!-- Analytics Cards -->
            <div class="grid grid-cols-3 gap-3 mb-6">
                <div class="card p-4 text-center">
                    <div class="text-3xl font-bold text-purple-400 mb-1">${analytics.totalPredictions}</div>
                    <div class="text-xs text-text-secondary">Total</div>
                </div>
                <div class="card p-4 text-center">
                    <div class="text-3xl font-bold text-purple-400 mb-1">${analytics.winRate}%</div>
                    <div class="text-xs text-text-secondary">Win Rate</div>
                </div>
                <div class="card p-4 text-center">
                    <div class="text-3xl font-bold text-success mb-1">${analytics.wins}</div>
                    <div class="text-xs text-text-secondary">Wins</div>
                </div>
            </div>
            
            <!-- Performance Chart -->
            <div class="card mb-6">
                <h3 class="text-lg font-semibold mb-4">Performance Trend</h3>
                <canvas id="performanceChart" height="200"></canvas>
            </div>
            
            <!-- Filter Tabs -->
            <div class="flex gap-2 mb-4">
                <button onclick="filterHistory('all')" class="filter-tab px-4 py-2 rounded-lg text-sm font-medium transition-all active" data-filter="all">
                    All
                </button>
                <button onclick="filterHistory('won')" class="filter-tab px-4 py-2 rounded-lg text-sm font-medium transition-all" data-filter="won">
                    Won
                </button>
                <button onclick="filterHistory('lost')" class="filter-tab px-4 py-2 rounded-lg text-sm font-medium transition-all" data-filter="lost">
                    Lost
                </button>
                <button onclick="filterHistory('open')" class="filter-tab px-4 py-2 rounded-lg text-sm font-medium transition-all" data-filter="open">
                    Open
                </button>
            </div>
            
            <!-- Predictions List -->
            <div id="predictions-list" class="space-y-3">
                ${predictions.map(pred => `
                    <div class="card p-4 prediction-item" data-status="${pred.status}">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex-1">
                                <div class="font-semibold mb-1">${pred.homeTeam} vs ${pred.awayTeam}</div>
                                <div class="text-xs text-text-secondary mb-2">${pred.league} • ${window.utils.formatDate(pred.date)}</div>
                                <div class="text-sm text-text-secondary">${pred.market}</div>
                            </div>
                            ${window.utils.getStatusBadge(pred.status)}
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="text-sm text-text-tertiary">Odds</div>
                            <div class="text-xl font-mono font-bold text-purple-400">${pred.odds}</div>
                        </div>
                        <div class="mt-3">
                            <div class="flex items-center justify-between text-xs mb-1">
                                <span class="text-text-secondary">Confidence</span>
                                <span class="text-purple-400">${pred.confidence}%</span>
                            </div>
                            <div class="progress-bar h-1.5">
                                <div class="progress-fill" style="width: ${pred.confidence}%"></div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Load Chart.js and render chart
    loadChartAndRender(analytics.trendData);
};

// ===== Referrals Page Renderer =====
window.renderReferralsPage = function(container) {
    const referrals = MOCK_DATA.referrals;
    
    container.innerHTML = `
        <div class="px-4 py-6 max-w-md mx-auto">
            <!-- Header -->
            <div class="text-center mb-6">
                <svg class="w-12 h-12 text-purple-400 mx-auto mb-3" viewBox="0 0 100 100" fill="currentColor">
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
                <h1 class="text-3xl font-display font-bold">Referral & Earn</h1>
            </div>
            
            <!-- Points Display -->
            <div class="card mb-6 text-center bg-warning bg-opacity-10 border-warning">
                <div class="text-5xl font-bold text-warning mb-2">${referrals.points}</div>
                <div class="text-text-secondary mb-1">Referral Points</div>
                <div class="text-sm text-text-tertiary">= $${(referrals.points * 0.01).toFixed(2)} value</div>
            </div>
            
            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="card p-4 text-center">
                    <div class="text-3xl font-bold text-purple-400 mb-1">${referrals.totalReferrals}</div>
                    <div class="text-sm text-text-secondary">Total Referrals</div>
                </div>
                <div class="card p-4 text-center">
                    <div class="text-3xl font-bold text-purple-400 mb-1">${referrals.pendingRewards}</div>
                    <div class="text-sm text-text-secondary">Pending Rewards</div>
                </div>
            </div>
            
            <!-- How It Works -->
            <div class="card mb-6">
                <h3 class="text-lg font-semibold mb-3">How It Works</h3>
                <ul class="space-y-2 text-sm text-text-secondary">
                    <li class="flex items-start gap-2">
                        <span class="text-purple-400 font-bold">1.</span>
                        <span>Share your unique referral link with friends</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-purple-400 font-bold">2.</span>
                        <span>Earn 30 points when they subscribe</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-purple-400 font-bold">3.</span>
                        <span>Redeem points for free subscription days</span>
                    </li>
                </ul>
            </div>
            
            <!-- Referral Link -->
            <div class="mb-6">
                <label class="text-sm text-text-secondary mb-2 block">Your Referral Link</label>
                <div class="flex gap-2">
                    <input 
                        type="text" 
                        class="input-field flex-1 text-sm" 
                        value="${referrals.referralLink}" 
                        readonly 
                        id="referral-link"
                    />
                    <button onclick="copyReferralLink()" class="btn-secondary px-4">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <!-- Share Button -->
            <button onclick="shareReferralLink()" class="btn-primary w-full h-14 text-lg mb-6">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
                Share Link
            </button>
            
            <!-- Recent Referrals -->
            ${referrals.recentReferrals.length > 0 ? `
                <div>
                    <h3 class="text-lg font-semibold mb-4">Recent Referrals</h3>
                    <div class="space-y-3">
                        ${referrals.recentReferrals.map(ref => `
                            <div class="card p-4">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="font-semibold mb-1">${ref.name}</div>
                                        <div class="text-xs text-text-secondary">${window.utils.formatDate(ref.date)}</div>
                                    </div>
                                    <div class="badge ${ref.status === 'active' ? 'badge-success' : 'badge-neutral'} text-xs">
                                        ${ref.status.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
};

// ===== Account Page Renderer =====
window.renderAccountPage = function(container) {
    const user = window.TelegramApp.user;
    const subscriptionPlan = window.utils.storage.get('subscriptionPlan', 'monthly');
    const subscriptionExpiry = window.utils.storage.get('subscriptionExpiry', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
    const daysRemaining = window.utils.calculateDaysRemaining(subscriptionExpiry);
    
    container.innerHTML = `
        <div class="px-4 py-6 max-w-md mx-auto">
            <!-- Header -->
            <div class="text-center mb-6">
                <svg class="w-12 h-12 text-purple-400 mx-auto mb-3" viewBox="0 0 100 100" fill="currentColor">
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
                <h1 class="text-3xl font-display font-bold">Account</h1>
            </div>
            
            <!-- Profile Card -->
            <div class="card mb-6">
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center text-2xl font-bold text-purple-400">
                        ${user.first_name.charAt(0)}
                    </div>
                    <div class="flex-1">
                        <div class="text-lg font-semibold mb-1">${user.first_name} ${user.last_name}</div>
                        <div class="text-sm text-text-secondary">@${user.username || 'user' + user.id}</div>
                        <div class="text-xs text-text-tertiary mt-1">ID: ${user.id}</div>
                    </div>
                </div>
            </div>
            
            <!-- Subscription Card -->
            <div class="card mb-6 bg-purple-500 bg-opacity-10 border-purple-500">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <div class="text-sm text-text-secondary mb-1">Current Plan</div>
                        <div class="text-xl font-semibold capitalize">${subscriptionPlan} Plan</div>
                    </div>
                    <div class="badge badge-success">Active</div>
                </div>
                <div class="text-sm text-text-secondary mb-2">
                    Expires: ${window.utils.formatDate(subscriptionExpiry)}
                </div>
                <div class="text-sm text-purple-400 font-medium">
                    ${daysRemaining} days remaining
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="grid grid-cols-2 gap-3 mb-6">
                <button onclick="Router.navigate('subscribe')" class="card card-interactive p-6 text-center">
                    <div class="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                    </div>
                    <div class="text-sm font-semibold">Manage Plan</div>
                </button>
                
                <button onclick="Router.navigate('settings')" class="card card-interactive p-6 text-center">
                    <div class="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    </div>
                    <div class="text-sm font-semibold">Settings</div>
                </button>
            </div>
            
            <!-- App Info -->
            <div class="card">
                <h3 class="text-lg font-semibold mb-4">App Information</h3>
                <div class="space-y-3 text-sm">
                    <div class="flex items-center justify-between">
                        <span class="text-text-secondary">Version</span>
                        <span class="font-medium">1.0.0</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-text-secondary">Language</span>
                        <span class="font-medium capitalize">${user.language_code || 'en'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// ===== Settings Page Renderer =====
window.renderSettingsPage = function(container) {
    const settings = window.utils.storage.get('settings', {
        notifications: true,
        darkMode: true,
        language: 'en'
    });
    
    container.innerHTML = `
        <div class="px-4 py-6 max-w-md mx-auto">
            <!-- Header with Back Button -->
            <div class="flex items-center mb-8">
                <button onclick="Router.navigate('account')" class="mr-4">
                    <svg class="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
                <h1 class="text-3xl font-display font-bold">Settings</h1>
            </div>
            
            <!-- Notifications Section -->
            <div class="card mb-6">
                <h3 class="text-lg font-semibold mb-4">Notifications</h3>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="font-medium mb-1">Prediction Alerts</div>
                            <div class="text-sm text-text-secondary">Get notified when new predictions arrive</div>
                        </div>
                        <div onclick="toggleSetting('notifications')" class="toggle-switch ${settings.notifications ? 'active' : ''}">
                            <div class="toggle-knob"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Appearance Section -->
            <div class="card mb-6">
                <h3 class="text-lg font-semibold mb-4">Appearance</h3>
                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-medium mb-1">Dark Mode</div>
                        <div class="text-sm text-text-secondary">Always enabled for optimal viewing</div>
                    </div>
                    <div class="toggle-switch active">
                        <div class="toggle-knob"></div>
                    </div>
                </div>
            </div>
            
            <!-- About Section -->
            <div class="card mb-6">
                <h3 class="text-lg font-semibold mb-4">About</h3>
                <div class="space-y-3">
                    <button onclick="openLink('privacy')" class="w-full flex items-center justify-between py-3 border-b border-white border-opacity-5">
                        <span class="text-text-secondary">Privacy Policy</span>
                        <svg class="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                    <button onclick="openLink('terms')" class="w-full flex items-center justify-between py-3 border-b border-white border-opacity-5">
                        <span class="text-text-secondary">Terms of Service</span>
                        <svg class="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                    <button onclick="openLink('support')" class="w-full flex items-center justify-between py-3">
                        <span class="text-text-secondary">Contact Support</span>
                        <svg class="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <!-- Danger Zone -->
            <div class="card border-danger border-opacity-30">
                <h3 class="text-lg font-semibold text-danger mb-4">Danger Zone</h3>
                <button onclick="logout()" class="btn-secondary w-full border-danger text-danger hover:bg-danger hover:text-white">
                    Logout
                </button>
            </div>
        </div>
    `;
};

// ===== Global Action Functions =====

window.claimPrediction = function() {
    window.utils.showLoading();
    window.TelegramApp.hapticFeedback('impact', 'medium');
    window.TelegramApp.actions.claimPrediction(MOCK_DATA.predictions[0].id);
    
    setTimeout(() => {
        MOCK_DATA.predictions[0].claimed = true;
        window.utils.hideLoading();
        window.utils.showToast('Prediction claimed successfully!');
        Router.navigate('dashboard');
    }, 1500);
};

window.filterHistory = function(filter) {
    const items = document.querySelectorAll('.prediction-item');
    const tabs = document.querySelectorAll('.filter-tab');
    
    // Update active tab
    tabs.forEach(tab => {
        if (tab.dataset.filter === filter) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Filter items
    items.forEach(item => {
        if (filter === 'all' || item.dataset.status === filter.replace('won', 'win').replace('lost', 'loss')) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    window.TelegramApp.hapticFeedback('selection');
};

window.copyReferralLink = function() {
    const link = document.getElementById('referral-link').value;
    window.utils.copyToClipboard(link);
    window.TelegramApp.hapticFeedback('notification', 'success');
};

window.shareReferralLink = function() {
    const link = MOCK_DATA.referrals.referralLink;
    const text = `Join X AI and get daily sure 2.0+ odds football predictions! Use my referral link: ${link}`;
    
    if (window.TelegramApp.isInTelegram) {
        window.TelegramApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`);
    } else {
        window.utils.copyToClipboard(link);
    }
    
    window.TelegramApp.hapticFeedback('impact', 'medium');
};

window.toggleSetting = function(setting) {
    const settings = window.utils.storage.get('settings', {});
    settings[setting] = !settings[setting];
    window.utils.storage.set('settings', settings);
    
    window.TelegramApp.actions.updateSettings(settings);
    window.TelegramApp.hapticFeedback('impact', 'light');
    
    // Re-render settings page
    const container = document.getElementById('app');
    window.renderSettingsPage(container);
};

window.openLink = function(type) {
    const links = {
        privacy: 'https://example.com/privacy',
        terms: 'https://example.com/terms',
        support: 'https://t.me/xai_support'
    };
    
    window.TelegramApp.openLink(links[type]);
    window.TelegramApp.hapticFeedback('impact', 'light');
};

window.logout = function() {
    window.TelegramApp.showConfirm('Are you sure you want to logout?', (confirmed) => {
        if (confirmed) {
            window.utils.storage.clear();
            window.utils.showToast('Logged out successfully');
            setTimeout(() => {
                Router.navigate('landing');
            }, 1000);
        }
    });
};

// ===== Chart.js Loader and Renderer =====
function loadChartAndRender(trendData) {
    // Check if Chart.js is already loaded
    if (window.Chart) {
        renderChart(trendData);
        return;
    }
    
    // Dynamically load Chart.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.onload = () => {
        console.log('Chart.js loaded');
        renderChart(trendData);
    };
    document.head.appendChild(script);
}

function renderChart(trendData) {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: trendData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Win Rate %',
                data: trendData.map(d => d.winRate),
                borderColor: '#8B5CF6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#8B5CF6',
                pointBorderColor: '#C084FC',
                pointHoverBackgroundColor: '#C084FC',
                pointHoverBorderColor: '#fff',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#141414',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    titleColor: '#E4E4E7',
                    bodyColor: '#A1A1AA',
                    padding: 12,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#71717A',
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#71717A',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    min: 60,
                    max: 100
                }
            }
        }
    });
}

// ===== App Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('X AI Telegram Mini App starting...');
    
    // Initialize Telegram Web App
    window.TelegramApp.init();
    
    // Initialize Router
    window.Router.init();
    
    console.log('App initialized successfully!');
});
