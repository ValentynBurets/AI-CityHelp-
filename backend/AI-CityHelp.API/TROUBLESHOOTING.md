# Troubleshooting Guide

## "Failed to generate embedding" Error

If you encounter this error when submitting a classification request, follow these steps:

### 1. Verify API Key Configuration

Check if the OpenAI API key is properly set:

**PowerShell:**
```powershell
$env:OpenAI__ApiKey
```

**CMD:**
```cmd
echo %OpenAI__ApiKey%
```

**Or check if .env file exists:**
The API will automatically load a `.env` file from the `AI-CityHelp.API` directory if it exists.

### 2. Set the API Key

If the key is not set, use one of these methods:

**Option A: Environment Variable (Current Session)**
```powershell
$env:OpenAI__ApiKey="your-api-key-here"
```

**Option B: Create .env File**
Create a file named `.env` in the `AI-CityHelp.API` directory:
```
OpenAI__ApiKey=your-api-key-here
```

**Option C: Use Setup Scripts**
- PowerShell: `.\set-env-vars.ps1`
- CMD: `set-env-vars.bat`

### 3. Check the Logs

After restarting the API, check the console output or log files in `logs/` directory. You should see:

- **On startup:** "OpenAI API key is configured (length: XX)" or a warning if not configured
- **On error:** Detailed error message including:
  - Error message from OpenAI API
  - Error code
  - Whether the request was successful
  - Whether data was returned

### 4. Common Issues

**Issue: "OpenAI:ApiKey is not configured"**
- **Solution:** Set the `OpenAI__ApiKey` environment variable (note the double underscore)

**Issue: "Invalid API key" or "Unauthorized"**
- **Solution:** Verify your API key is correct and has not expired
- Check your OpenAI account for API key status

**Issue: "Rate limit exceeded"**
- **Solution:** Wait a few minutes and try again, or upgrade your OpenAI plan

**Issue: "Network error" or "Connection timeout"**
- **Solution:** Check your internet connection and firewall settings

**Issue: "Model not found"**
- **Solution:** The embedding model `text-embedding-3-small` should be available. If not, check OpenAI API status.

### 5. Verify Knowledge Base is Loaded

Before classifying requests, ensure the knowledge base is loaded:

1. Navigate to the Knowledge Base page in the frontend
2. Click "Reload KB" button
3. Wait for success message

### 6. Test the API Key

You can test if your API key works by making a direct API call or checking the startup logs. The API will log whether the key is configured when it starts.

## Additional Debugging

### Enable Detailed Logging

The application uses Serilog for logging. Logs are written to:
- Console output
- `logs/cityhelp-YYYY-MM-DD.txt` files

Check these logs for detailed error information.

### Check API Response

The improved error handling now includes:
- Exact error message from OpenAI
- Error codes
- Request status information

All this information is logged and included in error responses.

