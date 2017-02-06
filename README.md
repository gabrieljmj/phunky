<h1 align="center"><img src="https://cdn.rawgit.com/gabrieljmj/phunky/development/browser/assets/images/phunky-icon.svg" width="100"><br>phunky</h1>
[Spotify does not support anymore MusixMatch lyrics](http://www.billboard.com/articles/news/7392812/lyrics-spotify-musixmatch-gone-for-now). Because of their delay to release a new tool, I've been working on it. Feel free to contribute.

<p align="center"><img src="http://i.imgur.com/PkUycLF.png"></p>
<p align="center"><img src="http://i.imgur.com/jY2aHns.png"></p>

## Running (dev mode)
Be sure to have NodeJS [installed](https://nodejs.org/en/download/).
1. Clone or download the zip of the app, than install all dependencies
```cli
$ npm install
```

2. Create a API key for browser without domain [here](https://console.developers.google.com/apis/credentials).
 1. Go to: [Google's APIs Credential Page](https://console.developers.google.com/apis/credentials)
 2. Click on the 'Create credentials' dropdown and select the 'API key' option
 3. From the popup, click on 'Browser key'
 4. Enter a unique name, leave the 'Accept requests from these HTTP referrers (web site)' field blank and click 'create'
3. Turn on the YouTube Data API [here](https://console.developers.google.com/apis/api/youtube/overview).
4. Create a config file called ```config.json``` in the root:

    ```json
    {
      "clients": {
        "youtube": "[YOUR_KEY_HERE]"
      }
    }
    ```

5. [Install electron](http://electron.atom.io/) and run

    ```cli
    $ npm start
    ```

    or

    ```cli
    $ electron app/main.js
    ```

## License
Under [MIT License](https://github.com/gabrieljmj/phunky/blob/development/LICENSE).
