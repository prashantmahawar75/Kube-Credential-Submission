# Screenshots Directory

Place your demonstration screenshots here before submission.

## Required Screenshots

1. **issuance-new-credential.png**
   - New credential being issued
   - Shows worker ID
   - Shows `alreadyIssued: false`

2. **issuance-duplicate-detection.png**
   - Same credential submitted again
   - Shows `alreadyIssued: true`
   - Shows original worker ID

3. **verification-valid.png**
   - Valid credential verification
   - Shows `isValid: true`
   - Shows worker ID and timestamp

4. **verification-invalid.png**
   - Invalid credential verification
   - Shows `isValid: false`

5. **test-results.png**
   - Output of `npm test`
   - Shows all 11 tests passing

6. **deployed-application.png**
   - Screenshot of deployed application
   - Shows the live URL

## Optional Screenshots

7. **kubernetes-pods.png** - `kubectl get pods` output
8. **docker-build.png** - Docker build success
9. **api-health-check.png** - Health endpoint response
10. **mobile-view.png** - Responsive design on mobile

## How to Take Screenshots

### Windows
- Press `Win + Shift + S` for Snipping Tool
- Or use `Win + PrtScn` for full screen

### Mac
- Press `Cmd + Shift + 4` for selection
- Or `Cmd + Shift + 3` for full screen

### Linux
- Use `gnome-screenshot` or `flameshot`

## Screen Recording (Optional)

If you want to create a screen recording:

### Windows
- Use Xbox Game Bar (`Win + G`)
- Or OBS Studio (free)

### Mac
- Use QuickTime Player (built-in)
- Or use `Cmd + Shift + 5`

### Linux
- Use SimpleScreenRecorder
- Or OBS Studio

**Recommended length**: 2-3 minutes showing:
1. Issuing a credential
2. Attempting to issue duplicate
3. Verifying valid credential
4. Verifying invalid credential
5. Showing worker IDs in responses
