const dotenvObj = require('dotenv');
dotenvObj.config();
const swapTokens = require('./swapTokens');

(async function index() {

    try {

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

    } catch (error) {

        console.error(`migration failed.`);
        console.log(error);

    }

})();
