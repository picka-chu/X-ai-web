# X AI Telegram Mini App - Frontend

Daily football predictions platform with subscription system for Telegram Mini App.

## Features

- **Landing Page**: Hero section with value proposition and CTA
- **Subscription Plans**: Weekly and monthly plan options
- **Payment Methods**: Chapa, Telegram Payments, Stars, and Wallet
- **Dashboard**: Claim daily predictions with confidence ratings
- **History**: Performance analytics with win rate charts
- **Referrals**: Earn points by referring friends
- **Account**: Profile and subscription management
- **Settings**: Notifications, theme, and app preferences

## Tech Stack

- **HTML5** + **Tailwind CSS** (via CDN)
- **Vanilla JavaScript** (no framework dependencies)
- **Telegram Web App API** for bot integration
- **Chart.js** for analytics visualization (lazy loaded)
- **Firebase Hosting** for deployment

## Project Structure

```
frontend/
├── index.html              # Main SPA entry point
├── css/
│   └── styles.css          # Custom styles (complementing Tailwind)
├── js/
│   ├── app.js              # Main app logic and page renderers
│   ├── router.js           # Client-side routing
│   ├── telegram.js         # Telegram Web App API integration
│   └── utils.js            # Helper functions
├── assets/
│   └── icons/              # Navigation and UI icons
├── firebase.json           # Firebase Hosting configuration
└── README.md               # This file
```

## Setup Instructions

### 1. Prerequisites

- Node.js 16+ and npm/yarn
- Firebase CLI: `npm install -g firebase-tools`
- Telegram Bot (for production integration)

### 2. Configuration

#### Update Bot Webhook URL

Edit `js/telegram.js` line 12:

```javascript
const BOT_WEBHOOK_URL = 'YOUR_BOT_WEBHOOK_URL'; // Replace with actual webhook
```

#### Update Referral Link Base URL

The referral link is auto-generated in `js/app.js` using the Telegram user ID:

```javascript
referralLink: 'https://t.me/YOUR_BOT_USERNAME?start=ref_' + window.TelegramApp?.user?.id
```

Replace `YOUR_BOT_USERNAME` with your actual bot username.

### 3. Local Development

#### Option A: Using Python HTTP Server

```bash
cd frontend
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser.

#### Option B: Using Live Server (VS Code Extension)

1. Install "Live Server" extension in VS Code
2. Right-click `index.html` and select "Open with Live Server"

#### Testing Telegram Integration Locally

Since Telegram Web App API only works within Telegram, for local testing:

1. The app gracefully degrades to browser mode with mock user data
2. All bot communications are logged to console
3. Actions are simulated with timeouts

### 4. Firebase Deployment

#### First-Time Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase init hosting

# Select options:
# - Use an existing project or create a new one
# - Public directory: . (current directory)
# - Single-page app: Yes
# - Set up automatic builds: No
```

#### Deploy

```bash
cd frontend
firebase deploy --only hosting
```

After deployment, you'll get a URL like: `https://your-project.web.app`

#### Set Up Custom Domain (Optional)

```bash
firebase hosting:channel:deploy CHANNEL_NAME
```

### 5. Telegram Bot Integration

#### Configure Bot Menu Button

In your Python bot code, set the menu button to open the Mini App:

```python
await bot.set_chat_menu_button(
    menu_button=MenuButtonWebApp(
        text="Open X AI",
        web_app=WebAppInfo(url="https://your-project.web.app")
    )
)
```

#### Handle Web App Data

In your bot's message handler, listen for `web_app_data`:

```python
@bot.message_handler(content_types=['web_app_data'])
async def handle_web_app_data(message):
    data = json.loads(message.web_app_data.data)
    action = data.get('action')
    
    if action == 'init_payment':
        # Process payment initiation
        plan = data['plan']
        method = data['method']
        # ... payment logic
    
    elif action == 'claim_prediction':
        # Send prediction to user
        prediction_id = data.get('prediction_id')
        # ... claim logic
    
    # ... handle other actions
```

## Development Notes

### Mock Data

The app includes comprehensive mock data for testing without a backend:

- **Predictions**: 5 sample predictions with various statuses (open, win, loss)
- **Analytics**: Win rate trends over 7 days
- **Referrals**: Sample referral stats and recent referrals
- **User**: Fallback test user for browser mode

Location: `js/app.js` - `MOCK_DATA` object

### State Management

The app uses:

- **localStorage**: Persistent data (subscription status, settings, last route)
- **sessionStorage**: Temporary data (selected plan during checkout)

Key localStorage items:

- `isSubscribed`: Boolean - subscription status
- `subscriptionPlan`: String - 'weekly' or 'monthly'
- `subscriptionExpiry`: ISO date string
- `settings`: Object - user preferences
- `lastRoute`: String - last visited route

### Telegram Web App API Usage

The app integrates with Telegram through `TelegramApp` object:

```javascript
// Initialize (auto-called on load)
TelegramApp.init();

// Send data to bot
TelegramApp.actions.initPayment('weekly', 'chapa');
TelegramApp.actions.claimPrediction('pred_001');

// Haptic feedback
TelegramApp.hapticFeedback('impact', 'medium');

// Show confirm dialog
TelegramApp.showConfirm('Are you sure?', (result) => {
    if (result) { /* confirmed */ }
});

// Main Button
TelegramApp.showMainButton('Continue', () => { /* action */ });
TelegramApp.hideMainButton();

// Back Button
TelegramApp.showBackButton(() => { /* go back */ });
```

### Adding New Routes

1. Register route in `js/router.js`:

```javascript
routes: {
    'my-page': {
        render: this.renderMyPage,
        requiresAuth: true,
        showBottomNav: true
    }
}
```

2. Create renderer function:

```javascript
renderMyPage(container) {
    container.innerHTML = `...`;
}
```

3. Navigate programmatically:

```javascript
Router.navigate('my-page');
```

## Customization

### Changing Colors

Edit Tailwind config in `index.html` (line 30-60) or CSS variables in `css/styles.css`.

Primary purple gradient can be changed:

```javascript
'purple': {
    500: '#8B5CF6',  // Main purple
    400: '#A78BFA',  // Light purple
    300: '#C084FC',  // Lighter purple
}
```

### Adding Animations

Use existing animation classes:

- `.pulse-glow`: Pulsing glow effect (for CTAs)
- `.slide-in`: Slide in from right
- `.fade-in`: Simple fade in
- `.skeleton`: Loading shimmer effect

Or add custom animations in `css/styles.css`.

### Chart Customization

Charts are rendered using Chart.js. Modify appearance in `js/app.js` function `renderChart()`:

```javascript
borderColor: '#8B5CF6',           // Line color
backgroundColor: 'rgba(...)',     // Fill color
tension: 0.4,                     // Line smoothness (0-1)
```

## Browser Compatibility

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS 14+, Android 8+
- **Telegram**: Telegram Desktop, Telegram iOS/Android latest versions

## Performance Optimization

- **Tailwind CSS**: Loaded via CDN (consider building for production)
- **Chart.js**: Lazy loaded only on History page
- **Images**: Use WebP format for better compression
- **Caching**: Firebase Hosting configured with appropriate cache headers

## Security Considerations

- **API Keys**: Never commit real API keys. Use environment variables.
- **Bot Token**: Keep bot token secure on backend only.
- **User Data**: Validate all user input on backend before processing.
- **HTTPS**: Always use HTTPS in production (Firebase Hosting enforces this).

## Troubleshooting

### App doesn't load in Telegram

- Ensure bot menu button is configured correctly
- Check that Firebase Hosting URL is accessible
- Verify Telegram Web App script is loaded

### Charts not rendering

- Check browser console for Chart.js loading errors
- Ensure CDN is accessible
- Verify canvas element exists with correct ID

### Bot not receiving data

- Check `TelegramApp.sendDataToBot()` console logs
- Verify bot webhook is set up correctly
- Ensure bot has `web_app_data` message handler

### localStorage not persisting

- Check browser settings (some modes block localStorage)
- Verify no localStorage.clear() calls on critical paths
- Test in private/incognito mode

## Production Checklist

- [ ] Replace `BOT_WEBHOOK_URL` with actual webhook
- [ ] Update referral link with real bot username
- [ ] Remove or minimize console.log statements
- [ ] Test all payment methods with real credentials
- [ ] Verify subscription expiry logic
- [ ] Test on actual Telegram clients (iOS, Android, Desktop)
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure Firebase security rules
- [ ] Enable CORS on backend if needed
- [ ] Test with slow network conditions
- [ ] Verify responsive design on various screen sizes
- [ ] Run accessibility audit (WCAG AA minimum)

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact: [Your contact info]

---

**Built with focus on performance, user experience, and Telegram integration.**
