import { addStylesheet, parseMsg } from '@/helpers';

export class Instagram {
  constructor() {
    this.config = { childList: true, subtree: true }
    this.observer = new MutationObserver(this._cb.bind(this))
    this.controls = {
      init() {
        Object.values(this.buttons).forEach(button => {
          const btnEl = document.querySelector(button.selector)
          btnEl.addEventListener('click', button.cb, button.eConf)
        })
      },
      css: {
        '.pcontrols': `
                        position: fixed;
                        bottom: 2rem;
                        left: 1rem;
                        padding: .5rem;
                        background-color: #000A;
                        color: white;
                        border-radius: .3rem;
                        min-width: 200px;
                        text-align: center;
                        z-index: 1000;`,
        '.pcontrols__title': `
                        margin-bottom: .7rem;`,
        '.pcontrols__buttons': `
                        display: flex;
                        flex-direction: column;
                        gap: .5rem;`,
        '.pcontrols .btn': `
                        background: #0095f6;
                        border: transparent;
                        padding: .4rem;
                        color: white;
                        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
                        font-weight: 600;
                        border-radius: 3px;`,
        '.pcontrols .btn[disabled]': `
                        cursor-events: none;
                        filter: grayscale(.7);
                        color: lightgray;
                    `
      },
      title: 'Парсер чата для Instagram',
      inputs: [],
      buttons: {
        start: {
          inner: { start: 'Запустить', started: 'Запущен' },
          class: 'pcontrols__inst-start btn',
          selector: '.pcontrols__inst-start',
          cb: this.start.bind(this),
          eConf: { once: true }
        },
        playPause: {
          'inner': { start: "Pause", started: "Play" },
          class: "pcontrols__playpause btn",
          selector: ".pcontrols__playpause",
          cb: this.playpause.bind(this),
          eConf: {}
        }
      }
    }
  }
  _cb(mutations) {
    mutations.forEach(m => {
      if (m.type == 'childList') {
        m.addedNodes.forEach(node => {
          const _msg = node.querySelector('span~span')
          if (!!_msg) {
            const _msgNode = _msg.parentElement.children
            const msg = {
              social: 'inst',
              author: _msgNode[0].textContent,
              text: parseMsg(_msgNode[1].textContent),
              datetime: (new Date).toJSON()
            }
            if (msg.text.length > 0) document.dispatchEvent(new CustomEvent('nillkizz_parser_message', { detail: { msg } }))
          }
        })
      }
    })
  }
  start() {
    this.node = document.querySelector('div>header~section')
    this.observer.observe(this.node, this.config);
    const btn = document.querySelector(this.controls.buttons.start.selector)
    btn.disabled = true
    btn.innerText = this.controls.buttons.start.inner.started
    addStylesheet('div>header~section{border: .2rem dashed red;}')
  }
  playpause() {
    const btn = this.controls.buttons.playPause;
    const btnEl = document.querySelector(btn.selector);
    const video = document.querySelector('video');
    video.paused ? video.play() : video.pause();
    btnEl.innerText = video.paused ? btn.inner.started : btn.inner.start;
  }
}