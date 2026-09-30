(() => {
  const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : {postMessage:message => window.dispatchEvent(new CustomEvent('ikun-command',{detail:message}))};
  document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click',() => vscode.postMessage({command:button.dataset.command})));
  const sticker=document.querySelector('#sticker'), message=document.querySelector('#message'), sound=document.querySelector('#sound'), audio=document.querySelector('#audio');
  let timer, context, beat, playing=false;
  const volume=Math.max(0,Math.min(1,Number(document.body.dataset.volume)||0));
  audio.volume=volume;
  if(audio.getAttribute('src')) { audio.hidden=false; sound.textContent='播放音频'; }
  document.querySelector('#bounce').addEventListener('click',() => {
    clearTimeout(timer); sticker.classList.remove('bounce'); void sticker.offsetWidth; sticker.classList.add('bounce');
    message.textContent=['球可以不进，代码不能不存。','今天也是认真练习的一天。','唱、跳、RAP，然后继续写代码。'][Math.floor(Math.random()*3)];
    timer=setTimeout(() => sticker.classList.remove('bounce'),1700);
  });
  function stop(){clearInterval(beat);audio.pause();if(context){context.close().catch(()=>{});context=undefined;}playing=false;sound.setAttribute('aria-pressed','false');sound.textContent=audio.getAttribute('src')?'播放音频':'播放节拍';}
  sound.addEventListener('click',async()=>{
    if(playing)return stop();
    try{
      if(audio.getAttribute('src'))await audio.play();
      else{
        context=new AudioContext();await context.resume();
        const tick=()=>{if(!context)return;const o=context.createOscillator(),g=context.createGain(),t=context.currentTime;o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(45,t+.12);g.gain.setValueAtTime(Math.max(.0001,volume*.4),t);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g);g.connect(context.destination);o.start(t);o.stop(t+.17);};
        tick();beat=setInterval(tick,600);
      }
      playing=true;sound.textContent='停止播放';sound.setAttribute('aria-pressed','true');
    }catch{stop();message.textContent='音频无法播放，请尝试 MP3 或 WAV 文件。';}
  });
  audio.addEventListener('ended',stop);
  audio.addEventListener('error',()=>{stop();message.textContent='当前音频格式无法播放，请重新导入。';});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  window.addEventListener('pagehide',()=>{stop();clearTimeout(timer);});
})();
