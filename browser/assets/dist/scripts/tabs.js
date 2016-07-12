'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function loadTabs() {
  var tabs = document.querySelectorAll('.tab-btn');

  for (var k = 0; k < tabs.length; k++) {
    tabs[k].addEventListener('click', function (e) {
      var allTabs = document.querySelectorAll('.tab-btn');
      var self = e.target;
      var target = self.dataset.target;


      for (var i = 0; i < allTabs.length; i++) {
        var selfTarget = allTabs[i].dataset.target;

        allTabs[i].classList.remove('tab-btn-active');
        document.getElementById(selfTarget).style.display = 'none';
      }

      self.classList.add('tab-btn-active');
      document.getElementById(target).style.display = 'block';
    });
  }
};

exports.default = loadTabs;