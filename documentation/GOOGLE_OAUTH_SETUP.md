# Google OAuth Setup Guide

## Current Credentials
- **Client ID**: `YOUR_GOOGLE_CLIENT_ID` (from Google Cloud Console)
- **Client Secret**: `YOUR_GOOGLE_CLIENT_SECRET` (from Google Cloud Console)

> **Note**: Keep your actual credentials in the `.env` file only. Never commit them to git.

## Required Configuration in Google Cloud Console

### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one

### Step 2: Enable Required APIs
1. Go to **APIs & Services** > **Library**
2. Enable the following APIs:
   - **Google Drive API** (Required for file uploads)
   - **Google Picker API** (Required for folder selection)

### Step 3: Configure OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (or Internal if using Google Workspace)
3. Fill in the required information:
   - **App name**: File Form Uploader
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Add the following scopes:
   - `openid`
   - `email`
   - `profile`
   - `https://www.googleapis.com/auth/drive.file`
5. Add test users (your email address) if in testing mode
6. Save and continue

### Step 4: Configure Authorized Redirect URIs
1. Go to **APIs & Services** > **Credentials**
2. Click on your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. If you have a production URL, also add:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
5. Click **Save**

### Step 5: Configure Authorized JavaScript Origins
1. In the same OAuth client settings
2. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:3000
   ```
3. If you have a production URL, also add:
   ```
   https://yourdomain.com
   ```
4. Click **Save**

## Environment Variables

Make sure your `.env` file contains:

```env
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL="file:./dev.db"
```

## Testing the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/admin/login`

3. Click "Sign in with Google"

4. You should be redirected to Google's consent screen

5. After authorization, you should be redirected back to your app

## Troubleshooting

### 403 Error: "access_denied"
- **Cause**: Redirect URI mismatch or OAuth consent screen not configured
- **Solution**: Double-check redirect URIs match exactly (including http/https)

### 400 Error: "redirect_uri_mismatch"
- **Cause**: The redirect URI in your request doesn't match what's configured
- **Solution**: Ensure `http://localhost:3000/api/auth/callback/google` is added

### "App is not verified"
- **Cause**: OAuth consent screen is in testing mode
- **Solution**: Add your email as a test user, or submit for verification

### "Access blocked: This app's request is invalid"
- **Cause**: Missing scopes or invalid OAuth configuration
- **Solution**: Re-check OAuth consent screen scopes

## Next Steps

After successful authentication:
1. Test Google Drive file upload
2. Test Google Picker for folder selection
3. Verify file permissions and access
