(() => {
  const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : {postMessage:message => window.dispatchEvent(new CustomEvent('ikun-command',{detail:message}))};
  const form = document.querySelector('#colors');
  const dirty = {};
  function send(message) {
    vscode.postMessage(message);
    document.querySelector('#message').textContent = '正在应用…';
  }
  document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click',() => {
    send({command:button.dataset.command,mode:button.dataset.mode,theme:form.dataset.theme});
  }));
  for (const input of document.querySelectorAll('[data-color]')) {
    const hex = document.querySelector(`[data-hex="${input.dataset.color}"]`);
    input.addEventListener('input', () => {hex.value=input.value.toUpperCase();dirty[input.dataset.color]=hex.value;});
    hex.addEventListener('input', () => {if(hex.validity.valid){input.value=hex.value;dirty[input.dataset.color]=hex.value.toUpperCase();}});
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (form.reportValidity()) send({command:'saveColors',theme:form.dataset.theme,colors:dirty});
  });
  window.addEventListener('message',event=>{
    if(event.data?.type==='result')document.querySelector('#message').textContent=event.data.ok?'外观已更新。':event.data.message;
  });
})();
