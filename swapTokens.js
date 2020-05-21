const request = require('request');
const uuid = require('uuid');
const oauthSignature = require('oauth-signature');

const refreshToken = require('./refreshToken');

async function swapTokens({oauth_token, oauth_token_secret, oauth_session_handle, scopes}) {

    try {

        const consumerKey = process.env.XERO_PARTNER_CONSUMER_KEY;
        const consumerSecret = process.env.XERO_PARTNER_CONSUMER_SECRET;
        const tokenSecret = oauth_token_secret;

        const url = 'https://api.xero.com/oauth/migrate';
        const httpMethod = 'POST';
        const oauth_timestamp = Math.floor((new Date()).getTime() / 1000);
        const oauth_nonce = uuid.v1();
        const oauth_signature_method = 'HMAC-SHA1';
        const parameters = {
            oauth_consumer_key : consumerKey,
            oauth_nonce,
            oauth_signature_method,
            oauth_timestamp,
            oauth_token,
            oauth_version : '1.0'
        };

        const options = {
            encodeSignature: false
        };
        const signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, options);

        const authorizationHeader =  `OAuth oauth_consumer_key="${consumerKey}", oauth_token="${oauth_token}", ` +
                                     `oauth_signature_method="${oauth_signature_method}", oauth_signature="${signature}", ` +
                                     `oauth_timestamp="${oauth_timestamp}", oauth_nonce="${oauth_nonce}", oauth_version="1.0"`;

        const payload = {
            url,
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorizationHeader
            },
            body: {
                scope: scopes.join(' '),
                client_id: process.env.XERO_CLIENT_ID,
                client_secret: process.env.XERO_CLIENT_SECRET
            },
            json: true
        }

        const result = await new Promise((resolve, reject) => {

            request.post(payload, function (error, responseOne, body) {

                if (error) {
                    return reject(error);
                }

                if (body.errors) {
                    return reject(body);
                }

                return resolve(body);

            });

        })

        return result;

    } catch (error) {

        if (error && error.errors[0] === 'The access token has expired') {

            const oauth1UpdatedTokens = await refreshToken({
                oauth_token,
                oauth_token_secret,
                oauth_session_handle,
                scopes
            });

            return swapTokens(oauth1UpdatedTokens);

         }

        throw error;

    }

}

module.exports = swapTokens;
