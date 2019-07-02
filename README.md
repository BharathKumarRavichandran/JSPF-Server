# JSPF-Server
Backend for Jitheshraj Scholarship Portal Form.

### Prerequisites
* Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* Install [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)
* Install [redis](https://redis.io/) :
    ```
    sudo apt-get install redis-server
    ```

### Project Installation
1. Clone the repository - `git clone <remote-url>`
2. Go to the project directory - `cd <cloned-repo>`
3. Install dependencies - `npm install`
4. Copy contents of `.env.example` to a new file `.env`
    * Configure `PORT`, `environment` and `SECRET` variables
    * Set `DB_USERNAME`, `DB_PASSWORD` and `DB_URI` to your localhost mongodb credentials
    * Get and set `SENDGRID_API_KEY` to access application mailing routes
    * `API_BASE_URL = 'http://localhost:8000'`
    * `CLIENT_BASE_URL = 'http://localhost:3000'`
    * `CORS_ORIGIN = 'http://localhost:3000'`
    * Set `BASE_DIR` and `CLIENT_BASE_DIR` to your appropriate directories path to configure file uploads.
    * Set the `DATE` and `YEAR` variables in their respective formats. You won't be able to access certain routes without this.
5. Copy contents of `src/config/google_auth_credentials.example.json` to a new file `src/config/google_auth_credentials.json` and set all the parameters and configure accordingly in Google developer console to give Google Drive API upload/write access.
6. Start `MongoDB` service - `sudo service mongod start` 
7. Start application and kue server - `node index`
8. Open a new terminal and start kue workers - `node /src/workers`
9. Instead, to start both servers and workers - `./run_server.sh`
10. Access kue API and dashboard from http://localhost at its configured _port_ number. Or at http://localhost:5000/api and http://localhost:5000/kue respectively, by default.
11. Install _JSPF-Web_ if needed, from [BharathKumarRavichandran/JSPF-Web](https://github.com/BharathKumarRavichandran/JSPF-Web)

#### Troubleshooting
* If you face some version incompatability issues while installing/running, check your `node` and `npm` versions and ensure it is compatible with the project. (Tip: Use nvm :p)
* If you face any mongo error, check whether `MongoDB` service (_mongod_ daemon) is running.
* If you're unable to generate PDFs, make sure your [wkhtmltopdf](https://www.npmjs.com/package/wkhtmltopdf) rendering engine(_QT_) path is configured properly.