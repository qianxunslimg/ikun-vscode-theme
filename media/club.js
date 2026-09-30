(() => {
  const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : {postMessage:message => window.dispatchEvent(new CustomEvent('ikun-command',{detail:message}))};
  document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click',() => {
    vscode.postMessage({command:button.dataset.command});
    document.querySelector('#message').textContent='正在应用…';
  }));
  window.addEventListener('message',event=>{
    if(event.data?.type==='result')document.querySelector('#message').textContent=event.data.ok?'外观已更新。':event.data.message;
  });
})();
