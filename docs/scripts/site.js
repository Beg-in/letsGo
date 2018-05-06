let getURLParameter = (name) => {
  return (
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [
        null,
        '',
      ])[1].replace(/\+/g, '%20'),
    ) || null
  );
};

let replaceQueryParam = (param, newval, search) => {
  let regex = new RegExp('([?;&])' + param + '[^&;]*[;&]?');
  let query = search.replace(regex, '$1').replace(/&$/, '');
  
  return (query.length > 2 ? query + '&' : '?') + (newval ? param + '=' + newval : '');
};

let setURLParameter = (tabName) => {
  window.history.pushState(null, null, tabName ? replaceQueryParam('tab', tabName, window.location.search) : '/');
};

let setActiveTab = () => {
  let tab = getURLParameter('tab');
  if (tab) {
    window.letsGo.remove('.main-tab', 'disabled').add(`#main-tab-${tab}`, 'disabled=disabled');
    window.letsGo.hide('.main-section').show(`#${tab}`);
  }
};

window.onload = () => {
  setActiveTab();
  document
    .getElementById('header-logo')
    .addEventListener('click', () => setURLParameter());
  document
    .getElementById('main-tab-about')
    .addEventListener('click', () => setURLParameter());
  document
    .getElementById('main-tab-setup')
    .addEventListener('click', () => setURLParameter('setup'));
  document
    .getElementById('main-tab-commands')
    .addEventListener('click', () => setURLParameter('commands'));
  document
    .getElementById('main-tab-animations')
    .addEventListener('click', () => setURLParameter('animations'));
};

window.onpopstate = (e) => {
  setActiveTab();
};
