module.exports = function loadTabs() {
  let tabs = document.querySelectorAll('.tab-btn');

  for (let k = 0; k < tabs.length; k++) {
    tabs[k].addEventListener('click', (e) => {
      let allTabs = document.querySelectorAll('.tab-btn'),
        self = e.target,
        target = self.dataset.target;

      for (let i = 0; i < allTabs.length; i++) {
        let selfTarget = allTabs[i].dataset.target;

        allTabs[i].classList.remove('tab-btn-active');
        document.getElementById(selfTarget).style.display = 'none';
      }

      self.classList.add('tab-btn-active');
      document.getElementById(target).style.display = 'block';
    });
  }
};
