# xero OAuth1.0a Token Migrator
xero partner app swap oauth1.0 token to oauth2.0 token.

Update environment based on .sample.env file.


        // your oauth1.0 tokens.
        const oauth_token = '';
        const oauth_token_secret = '';
        const oauth_session_handle = '';

        // add all scopes you need here (https://developer.xero.com/documentation/oauth2/scopes)
        const scopes = [
            'offline_access',
            'accounting.settings'
        ];

        const result = await swapTokens({oauth_token, oauth_token_secret, oauth_session_handle, scopes});
        console.log('oauth2.0 token swapped.');
        console.log(result);
