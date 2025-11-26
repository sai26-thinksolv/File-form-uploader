# Google Drive Folder Picker Setup

## Required Environment Variables

Add the following to your `.env` file:

```bash
# Google API Key for Picker API
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
```

## How to Get a Google API Key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **API Key**
5. Copy the API key
6. **Restrict the API key** (Recommended):
   - Click on the API key to edit it
   - Under "API restrictions", select "Restrict key"
   - Enable only: **Google Picker API**
   - Under "Website restrictions", add your domain (e.g., `localhost:3000` for dev)
7. Add the key to your `.env` file as `NEXT_PUBLIC_GOOGLE_API_KEY`

## Enable Google Picker API:

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Picker API"
3. Click on it and click **Enable**

## Test the Integration:

1. Sign in to your app using Google OAuth
2. Go to the editor page
3. Enable "Google Drive Integration"
4. Click "Select Folder"
5. You should see the native Google Drive folder picker interface
6. Select a folder - it will be saved to the form configuration

The picker will show all your Google Drive folders with the native Google interface!
