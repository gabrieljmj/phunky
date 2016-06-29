'use strict';

var musixmatch = require('./assets/dist/js/musixmatch.js'),
    youtube = require('./assets/dist/js/youtube.js'),
    nodeSpotifyWebHelper = require('node-spotify-webhelper'),
    spotify = new nodeSpotifyWebHelper.SpotifyWebHelper(),
    warn = require('./assets/dist/js/warn.js'),
    setLyrics = require('./assets/dist/js/setlyrics.js'),
    loadTabs = require('./assets/dist/js/tabs.js');

window.onload = function () {
  /**
   * Tabs
   */
  (function () {
    loadTabs();
  })();

  (function () {
    var spotifyData = void 0;

    localStorage.setItem('lIndex', '0');

    var cleanWarn = function cleanWarn() {
      document.getElementById('warning').innerHTML = '';
    };

    var getLyrics = function getLyrics() {
      var parser = new DOMParser(),
          doc = parser.parseFromString(localStorage.getItem('lyrics'), 'text/xml'),
          verses = doc.querySelectorAll('text');

      return verses;
    };

    var setCurrentVerse = function setCurrentVerse() {
      var lyrics = getLyrics(),
          curr = Math.round(parseFloat(localStorage.getItem('curr')) * 100) / 100,
          index = 0;

      for (var k = 0; k < lyrics.length; k++) {
        var el = lyrics[k];

        if (parseFloat(el.attributes.start.value) + parseFloat(el.attributes.dur.value) <= curr) {
          index = k;
        }
      }

      localStorage.setItem('lIndex', '' + index);
    };

    setInterval(function () {
      spotify.getStatus(function (err, res) {
        if (err) {
          warn('Communication error with Spotify! Restart it!');

          throw err;
        } else {
          cleanWarn();
        }

        localStorage.setItem('curr', '' + res.playing_position);

        if (spotifyData && spotifyData.track.track_resource.uri === res.track.track_resource.uri) {
          setCurrentVerse();

          var lyrics = getLyrics(),
              lIndex = parseInt(localStorage.getItem('lIndex'));

          if (lIndex === 0) {
            setLyrics(document.createElement('text'), lyrics[lIndex], lyrics[lIndex + 1]);
          } else {
            var allVerses = document.querySelectorAll('.verse'),
                verseId = lyrics[lIndex + 1].attributes.start.value.replace('.', 'p');

            for (var k = 0; k < allVerses.length; k++) {
              if (allVerses[k].parentNode.parentNode === document.getElementById('lyrics-pos')) {
                allVerses[k].classList.remove('featured-verse');
              }
            }

            document.getElementById(verseId).classList.add('featured-verse');

            var nextText = document.createElement('text');
            nextText.innerHTML = 'END';

            var next = lyrics[lIndex + 2] || nextText;

            setLyrics(lyrics[lIndex], lyrics[lIndex + 1], next);
          }
        } else {
          document.getElementById('song-name').innerHTML = res.track.track_resource.name;
          document.getElementById('artist-name').innerHTML = res.track.artist_resource.name;
          document.title = '♫ ' + res.track.track_resource.name + ' - ' + res.track.artist_resource.name + ' - phunky';

          /**
           * Searches on YouTube for a video regisred on musixmatch
           */
          youtube(res.track.artist_resource.name, res.track.track_resource.name).then(function (videos) {
            catchLyrics(0);

            function catchLyrics(video) {
              musixmatch(videos[video].id.videoId).then(function (mxmRes) {
                /**
                 * If there's no lyrics, check for the next
                 */
                if (mxmRes.data === '' || mxmRes.data === null) {
                  if (videos.length - 1 === video) {
                    warn('No lyrics found for this song :(').then(function () {
                      document.getElementById('lyrics-container').classList.add('invisible');
                    });

                    return;
                  }

                  catchLyrics(video + 1);
                }

                cleanWarn();

                document.getElementById('lyrics-container').style.display = 'block';
                localStorage.setItem('lyrics', mxmRes.data);

                document.getElementById('lyrics-pos').innerHTML = '';

                var lyrics = getLyrics();

                for (var _k = 0; _k < lyrics.length; _k++) {
                  var verse = lyrics[_k];

                  var verseDiv = document.createElement('div'),
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