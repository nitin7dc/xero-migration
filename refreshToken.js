const xero = require('xero-node');
const fs = require('fs');
const path = require('path');

/**
 * Refresh oauth1.0 token.
 * @param {*} xeroAccessToken 
 */
async function refreshToken(xeroAccessToken) {

    const xeroPrivateKeyPath = path.resolve(__dirname + '/' + process.env.XERO_PARTNER_PRIVATE_KEY_PATH);
    const privateKey = fs.readFileSync(xeroPrivateKeyPath);    
    
    const config = {
        authorizeCallbackUrl: process.env.XERO_CALLBACK_URL,
        consumerKey: process.env.XERO_PARTNER_CONSUMER_KEY,
        consumerSecret: process.env.XERO_PARTNER_CONSUMER_SECRET,
        userAgent: process.env.XERO_PARTNER_USER_AGENT,
        privateKey,
        accessToken: xeroAccessToken.oauth_token,
        accessSecret: xeroAccessToken.oauth_token_secret,
        sessionHandle: xeroAccessToken.oauth_session_handle,
    };

    const xeroClient = new xero.PartnerApplication(config);
    const response = await xeroClient.refreshAccessToken();
    const {oauth_token, oauth_token_secret, oauth_session_handle} = response.results;

    return {
        oauth_token, 
        oauth_token_secret, 
        oauth_session_handle
    };

}

module.exports = refreshToken;