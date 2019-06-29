const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');
const readline = require('readline');

// Importing configuration/env variables
const config = require('../config/config');
const logger = require('../config/winston');

// Global variables
const TOKEN_PATH = config.key.google_auth.TOKEN_PATH;
const SCOPES = ['https://www.googleapis.com/auth/drive'];


const authorize = async (credentials) => {
    try{
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        let OAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        if(!fs.existsSync(TOKEN_PATH)) {
            let accessResponse = await getAccessToken(OAuth2Client);
            if(accessResponse.status_code!=200){
                throw (accessResponse.message);
            }
            logger.info(`Retrieving token from OAuth2Client.`);
            OAuth2Client = accessResponse.data.OAuth2Client;
        }
        else{
            // Check if we have previously stored a token.
            const tokenContent = await fs.readFileSync(TOKEN_PATH,'utf8');
            OAuth2Client.setCredentials(JSON.parse(tokenContent));
            logger.info(`Retrieved token from stored token.`);

        }
        
        return {
            status_code: 200,
            message: 'Success',
            data: OAuth2Client
        }

    } catch(error){
        logger.error(error.toString());
        return {
            status_code: 400,
            message: error.toString(),
            data: {}
        }
    }
}

const promptCode = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(function(resolve, reject) {
      var ask = function() {
        rl.question('Enter the code from that page here: ', function(code) {
            rl.close();
            resolve(code);
        });
      };
      ask();
    });
}

const getAccessToken = async (OAuth2Client) => {
    try {
        const authUrl = OAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });

        logger.info(`Authorize this app by visiting this url: ${authUrl}`);

        if(config.environment=='production'){
            logger.info('Authorization required in production');
            return {
                status_code: 400,
                message: 'Authorization required in production',
                data: {}
            };
        }
        else{
            console.log(`Authorize this app by visiting this url: `,authUrl);
        }

        let code = await promptCode();
        const token = await OAuth2Client.getToken(code);
        OAuth2Client.setCredentials(token);

        // Store the token to disk for later program executions
        await fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        logger.info(`OAuth2Client token stored to ${TOKEN_PATH}`);

        return {
            status_code: 200,
            message: 'Success',
            data: {
                OAuth2Client: OAuth2Client
            }
        };
    } catch(error) {
        logger.error(error.toString());
        return {
            status_code: 400,
            message: error.toString(),
            data: {}
        };
    }
        
}

const useJWTAuthClient = async () => {
    try{
        // configure a JWT auth client
        let service_jwt = await fs.readFileSync(config.key.google_auth.service_jwt,'utf8');
        service_jwt = JSON.parse(service_jwt);
        let jwtClient = new google.auth.JWT(
            service_jwt.client_email,
            null,
            service_jwt.private_key,
            ['https://www.googleapis.com/auth/drive'],
            null
        );

        //authenticate request
        await jwtClient.authorize();
        
        logger.info(`Successfully authorized by jwtClient`);
        return {
            status_code: 200,
            message: 'Successfully connected',
            data: {
                client: jwtClient
            }
        }

    } catch(error) {
        logger.error(error.toString());
        return {
            status_code: 400,
            message: error.toString(),
            data: {}
        }
    }
}

const useOAuth2Client = async () => {
    try {
        let credentialsContent = await fs.readFileSync(config.key.google_auth.credentials,'utf8');
        let authResponse = await authorize(JSON.parse(credentialsContent));
        if(authResponse.status_code!=200 || !authResponse.data){
            throw (authResponse.message=='Success'? 'Failure in OAuth2Client': authResponse.message);
        }

        logger.info(`Successfully retrieved token by OAuth2Client`);
        return {
            status_code: 200,
            message: 'Successfully retrieved token',
            data: {
                client: authResponse.data.OAuth2Client
            }
        }

    } catch (error) {
        logger.error(error.toString());
        return {
            status_code: 400,
            message: error.toString(),
            data: {}
        }
    }
}


exports.uploadFinalApplication = async (finalArchivePath) => {
    try {    
        const authClientResponse = await useOAuth2Client();
        if(authClientResponse.status_code!=200){
            throw (authClientResponse.message);
        }

        let authClient = authClientResponse.data.client;

        let drive = await google.drive({
            version: 'v3',
            auth: authClient
        });

        if(!fs.existsSync(finalArchivePath)){
            logger.error(`Final archive file doesn't exists`);
            return {
                status_code: 400,
                message: `Final archive file doesn't exists`,
                data: {}
            }
        }

        let driveResponse = await drive.files.create({
            resourse: {
                name: path.basename(finalArchivePath),
                mimeType: `${config.files.archive.mimeType}`
            },
            requestBody: {
                name: path.basename(finalArchivePath),
                mimeType: `${config.files.archive.mimeType}`
            },
            media: {
                mimeType: `${config.files.archive.mimeType}`,
                body: fs.createReadStream(finalArchivePath)
            },
            fields: 'id'
        });

        logger.info(`File successfully uploaded to google drive.`);
        return {
            status_code: driveResponse.status,
            message: driveResponse.statusText
        }
        
    } catch (error) {
        logger.error(error.toString());
        return {
            status_code: 400,
            message: error.toString(),
            data: {}
        }
    }

}