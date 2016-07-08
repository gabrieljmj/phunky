const Scripts = './assets/dist/scripts',
  musixmatch = require(Scripts + '/musixmatch.js'),
  youtube = require(Scripts + '/youtube.js'),
  nodeSpotifyWebHelper = require('node-spotify-webhelper'),
  spotify = new nodeSpotifyWebHelper.SpotifyWebHelper(),
  warn = require(Scripts + '/warn.js'),
  setLyrics = require(Scripts + '/setlyrics.js'),
  loadTabs = require(Scripts + '/tabs.js');

window.onload = function() {
  /**
   * Tabs
   */
  (() => {
    loadTabs();
  })();

  /**
   * Lyrics
   */
  (() => {
    let spotifyData;

    localStorage.setItem('lIndex', '0');
    localStorage.setItem('has-lyrics', '0');

    /**
     * Returns the song lyrics
     *
     * @return {Array}
     */
    const getLyrics = () => {
      let parser = new DOMParser(),
        doc = parser.parseFromString(localStorage.getItem('lyrics'), 'text/xml'),
        verses = doc.querySelectorAll('text');

      return verses;
    };

    /**
     * Sync current song time with lyrics, updating the index of lyrics list
     */
    const setCurrentVerse = () => {
      let lyrics = getLyrics(),
        curr = (Math.round(parseFloat(localStorage.getItem('curr')) * 100) / 100),
        index = 0;

      for (let k = 0; k < lyrics.length; k++) {
        let el = lyrics[k];

        if ((parseFloat(el.attributes.start.value) + parseFloat(el.attributes.dur.value)) <= curr) {
          index = k;
        }
      }

      localStorage.setItem('lIndex', '' + index);
    };

    setInterval(() => {
      spotify.getStatus(function (err, res) {
        // Check if there's a communication error with spotifywebhelper
        if (err) {
          warn.add('communication-error', 'Communication error with Spotify! Restart it!');

          throw err;
        }

        warn.remove('communication-error');

        localStorage.setItem('curr', '' + res.playing_position);

        // Check if song has changed
        if (spotifyData && spotifyData.track.track_resource.uri === res.track.track_resource.uri) {
          if (localStorage.getItem('has-lyrics') === '1') {
            setCurrentVerse();

            let lyrics = getLyrics(),
              lIndex = parseInt(localStorage.getItem('lIndex'));

            // If is in the start of the song, show 2 verses
            if (lIndex === 0) {
              setLyrics(document.createElement('text'), lyrics[lIndex], lyrics[lIndex + 1]);
              document.getElementById(lyrics[lIndex].attributes.start.value.replace('.', 'p')).classList.add('featured-verse');
            } else {
              let allVerses = document.querySelectorAll('.verse'),
                verseId = lyrics[lIndex + 1].attributes.start.value.replace('.', 'p');

              for(let k = 0; k < allVerses.length; k++) {
                if (allVerses[k].parentNode.parentNode === document.getElementById('lyrics-pos')) {
                  allVerses[k].classList.remove('featured-verse');
                }
              }

              document.getElementById(verseId).classList.add('featured-verse');

              // Adds a verse with 'END' in the end
              let nextText = document.createElement('text');
              nextText.innerHTML = 'END';

              let next = lyrics[lIndex + 2] || nextText;

              setLyrics(lyrics[lIndex], lyrics[lIndex + 1], next);
            }
          }
        } else {
          warn.removeAll();

          document.getElementById('song-name').innerHTML = res.track.track_resource.name;
          document.getElementById('artist-name').innerHTML = res.track.artist_resource.name;
          document.title = '♫ ' + res.track.track_resource.name + ' - ' + res.track.artist_resource.name + ' - phunky';

          // Searches on YouTube for a video regisred on musixmatch
          youtube(res.track.artist_resource.name, res.track.track_resource.name)
            .then(videos => {
              catchLyrics(0);

              function catchLyrics(video) {
                musixmatch(videos[video].id.videoId)
                  .then(mxmRes => {

                    // If there's no lyrics, check for the next
                    if (mxmRes.data === '' || mxmRes.data === null) {
                      // but if nothing is found, tell user
                      if ((videos.length - 1) === video) {
                        warn.add('no-lyrics', 'No lyrics found for this song :(').then(() => {
                          document.getElementById('lyrics-container').classList.add('invisible');
                        });

                        localStorage.setItem('has-lyrics', '0');

                        return;
                      }

                      catchLyrics(video + 1);
                    }

                    warn.remove('no-lyrics');
                    localStorage.setItem('has-lyrics', '1');

                    document.getElementById('lyrics-container').style.display = 'block';
                    localStorage.setItem('lyrics', mxmRes.data);

                    // Change the 'all-verses' section
                    document.getElementById('lyrics-pos').innerHTML = '';

                    let lyrics = getLyrics();

                    for (let k = 0; k < lyrics.length; k++) {
                      let verse = lyrics[k];

                      let verseDiv = document.createElement('div'),
                        verseSpan = document.createElement('span');

                      verseSpan.setAttribute('id', verse.attributes.start.value.replace('.', 'p'));
                      verseSpan.innerHTML = verse.innerHTML;
                      verseSpan.className = 'verse';

                      verseDiv.appendChild(verseSpan);

                      document.getElementById('lyrics-pos').appendChild(verseDiv);
                    }
                  });
              }
          });

          setCurrentVerse();
        }

        spotifyData = res;
      });
    }, 500);
  })();
};
