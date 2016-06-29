'use strict';

function getRegularVerse(verse) {
    return '<span class="regular-verse">' + verse + '</span>';
}

function getFeaturedVerse(verse) {
    return '<span class="featured">' + verse + '</span>';
}

module.exports = function setLyrics(past, curr, next) {
    var pastDiv = document.getElementById('past'),
        currDiv = document.getElementById('curr'),
        nextDiv = document.getElementById('next');

    pastDiv.innerHTML = getRegularVerse(past.innerHTML);
    currDiv.innerHTML = getFeaturedVerse(curr.innerHTML);
    nextDiv.innerHTML = getRegularVerse(next.innerHTML);
};