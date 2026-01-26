# Firebase Phone Authentication Setup Guide

## 🔥 Firebase Console Setup

### Step 1: Enable Phone Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **smarth-ride-c146e**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Phone** provider
5. Click **Enable**
6. Save

### Step 2: Add Authorized Domains
1. In Authentication settings, go to **Settings** tab
2. Scroll to **Authorized domains**
3. Add your domains:
   - `localhost` (for development)
   - `smarth-rides-app.vercel.app` (or your Vercel domain)
   - Any custom domains you use

### Step 3: Configure reCAPTCHA
Firebase automatically handles reCAPTCHA for phone auth. No additional setup needed!

## 🔧 Code Implementation (Already Done)

### Files Created:
1. **`src/lib/services/otpAuthService.ts`** - OTP authentication service
2. **`src/components/screens/OTPLoginScreen.tsx`** - OTP login UI
3. **`src/app/page.tsx`** - Updated to use OTP flow

### How It Works:

#### 1. Initialize reCAPTCHA (Invisible)
```typescript
const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    'size': 'invisible',
    'callback': () => console.log('reCAPTCHA solved'),
});
```

#### 2. Send OTP
```typescript
const confirmationResult = await signInWithPhoneNumber(
    auth, 
    '+91' + phoneNumber, 
    recaptchaVerifier
);
```

#### 3. Verify OTP
```typescript
const result = await confirmationResult.confirm(otp);
const user = result.user;
```

## 🧪 Testing Phone Authentication

### Test Phone Numbers (Firebase Test Mode)
You can add test phone numbers in Firebase Console for testing without SMS:

1. Go to **Authentication** → **Sign-in method** → **Phone**
2. Scroll to **Phone numbers for testing**
3. Add test numbers with test codes:
   - Phone: `+91 9999999999`
   - Code: `123456`

### Testing Flow:
1. Open app: `http://localhost:3000`
2. Enter test phone number: `9999999999`
3. Click "SEND OTP"
4. Enter test code: `123456`
5. Click "VERIFY OTP"

## 🚨 Common Issues & Solutions

### Issue 1: "reCAPTCHA has already been rendered"
**Solution**: Clear reCAPTCHA before re-initializing
```typescript
if ((window as any).recaptchaVerifier) {
    (window as any).recaptchaVerifier.clear();
}
```
✅ Already implemented in `otpAuthService.ts`

### Issue 2: "auth/invalid-phone-number"
**Solution**: Ensure phone number has country code
```typescript
const formattedPhone = phoneNumber.startsWith('+91') 
    ? phoneNumber 
    : `+91${phoneNumber}`;
```
✅ Already implemented

### Issue 3: "auth/too-many-requests"
**Solution**: 
- Use test phone numbers during development
- Implement rate limiting on production
- Add CAPTCHA verification

### Issue 4: OTP not received
**Possible causes**:
- Phone number not valid
- SMS quota exceeded (Firebase free tier: 10 SMS/day)
- Country not supported
- Carrier blocking

**Solutions**:
- Use test phone numbers for development
- Upgrade Firebase plan for production
- Check Firebase Console → Authentication → Usage

## 📱 Production Deployment

### Before Going Live:

1. **Upgrade Firebase Plan**
   - Free tier: 10 SMS verifications/day
   - Blaze (Pay as you go): Unlimited (charged per SMS)

2. **Enable App Verification** (Optional but recommended)
   - Prevents abuse
   - Reduces SMS costs
   - Go to Authentication → Settings → App verification

3. **Set Up SMS Quota Alerts**
   - Firebase Console → Billing
   - Set budget alerts

4. **Monitor Usage**
   - Firebase Console → Authentication → Usage
   - Track daily/monthly SMS sent

## 💰 Cost Estimation

### Firebase Authentication Pricing (Phone)
- **India**: ~₹0.50 per SMS
- **USA**: ~$0.01 per SMS

### Example Monthly Cost:
- 1000 new users/month = ₹500
- 100 new users/day = ₹1,500/month

**Note**: Existing users don't need OTP every time (use session persistence)

## 🔐 Security Best Practices

### 1. Rate Limiting
```typescript
// Limit OTP requests per phone number
// Implement in Firebase Functions or backend
```

### 2. OTP Expiration
Firebase OTPs expire automatically after a few minutes.

### 3. Session Management
```typescript
// Use Zustand persist to keep user logged in
// Already implemented in useUserStore.ts
```

### 4. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /passengers/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /drivers/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🧪 Testing Checklist

- [ ] OTP sent successfully to real phone number
- [ ] OTP received within 30 seconds
- [ ] OTP verification works
- [ ] Invalid OTP shows error
- [ ] Expired OTP shows error
- [ ] User created in Firestore
- [ ] User logged in successfully
- [ ] Session persists after page refresh
- [ ] Logout works correctly
- [ ] reCAPTCHA doesn't block legitimate users

## 📊 Monitoring

### Firebase Console Dashboards
1. **Authentication → Users**: See all registered users
2. **Authentication → Usage**: Track SMS sent
3. **Firestore → Data**: View user documents
4. **Firestore → Usage**: Monitor read/write operations

### Recommended Monitoring
- Daily SMS count
- Failed OTP attempts
- User registration rate
- Session duration

## 🆘 Troubleshooting

### Check Firebase Logs
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# View logs
firebase functions:log
```

### Debug Mode
Enable debug logging in browser console:
```typescript
// Add to firebase.ts
import { setLogLevel } from '@firebase/app';
setLogLevel('debug');
```

## 📞 Support

If you encounter issues:
1. Check Firebase Console → Authentication → Usage
2. Check browser console for errors
3. Verify phone number format
4. Try test phone numbers first
5. Check Firebase status: https://status.firebase.google.com/

---

## ✅ Quick Start

1. Enable Phone Auth in Firebase Console
2. Add authorized domains
3. (Optional) Add test phone numbers
4. Run the app: `npm run dev`
5. Test with test phone number or real number
6. Monitor usage in Firebase Console

**That's it! Your OTP authentication is ready to use.** 🎉
