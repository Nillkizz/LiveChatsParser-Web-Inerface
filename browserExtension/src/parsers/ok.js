import { addStylesheet, parseMsg } from '@/helpers';

export class Ok {
  constructor() {
    this.config = { childList: true, subtree: true }
    this.observer = new MutationObserver(this._cb.bind(this))
    this.controls = {
      init() {
        Object.values(this.buttons).forEach(button => {
          const btnEl = document.querySelector(button.selector)
          btnEl.addEventListener('click', button.cb, { once: true })
        })
      },
      css: {
        '.pcontrols': `
                        position: fixed;
                        bottom: 1rem;
                        left: 1rem;
                        padding: .8rem;
                        background-color: #000A;
                        color: white;
                        border-radius: .3rem;
                        min-width: 200px;
                        text-align: center;
                        z-index: 10000;`,
        '.pcontrols__title': `
                        margin-bottom: .7rem;`,
        '.pcontrols__ok-start.button-pro[disabled]': `
                        pointer-events: none;
                        background: var(--light_blue_300);`
      },
      title: 'Парсер чата для Ok',
      inputs: [],
      buttons: {
        start: {
          inner: { start: 'Запустить', started: 'Запущен' },
          class: 'pcontrols__ok-start button-pro',
          selector: '.pcontrols__ok-start',
          cb: this.start.bind(this),
        }
      }
    }
  }
  _cb(mutations, observer) {
    mutations.forEach(m => {
      if (m.type == 'childList') {
        m.addedNodes.forEach(node => {
          if (node.classList.contains('vp-chat_i')) {
            const msg = {
              social: 'ok',
              author: node.querySelector('.o').innerText,
              text: parseMsg(node.querySelector('.textWrap').textContent),
              datetime: (new Date).toJSON()
            }
            if (msg.text.length > 0) document.dispatchEvent(new CustomEvent('nillkizz_parser_message', { detail: { msg } }))
          }
        })
      }
    })
  }
  start() {
    this.node = document.querySelector('.vp-chat_cnt')
    this.observer.observe(this.node, this.config);
    const btn = document.querySelector(this.controls.buttons.start.selector)
    btn.disabled = true
    btn.innerText = this.controls.buttons.start.inner.started
    addStylesheet('.vp-chat_cnt{border: .25rem dashed red;}')
  }
}