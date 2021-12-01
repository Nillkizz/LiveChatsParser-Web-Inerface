import { addStylesheet, parseMsg } from '@/helpers';

export class Vk {
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
                        padding: .5rem;
                        background-color: #000A;
                        color: white;
                        border-radius: .3rem;
                        min-width: 200px;
                        text-align: center;
                        z-index: 1000;`,
        '.pcontrols__title': `
                        margin-bottom: .7rem;`,
        '.pcontrols__vk-start.flat_button[disabled]': `
                        pointer-events: none;
                        background: var(--light_blue_300);`
      },
      title: 'Parser VK',
      inputs: [],
      buttons: {
        start: {
          inner: { start: 'Start', started: 'Has been started' },
          class: 'pcontrols__vk-start flat_button',
          selector: '.pcontrols__vk-start',
          cb: this.start.bind(this),
        }
      }
    }
  }
  _cb(mutations, observer) {
    mutations.forEach(m => {
      if (m.type == 'childList') {
        m.addedNodes.forEach(node => {
          if (node.classList.contains('mv_chat_message')) {
            const msg = {
              social: 'vk',
              author: node.querySelector('.mv_chat_message_author_name').innerText,
              text: parseMsg(node.querySelector('.mv_chat_message_text').textContent),
              datetime: (new Date).toJSON()
            }
            if (msg.text.length > 0) document.dispatchEvent(new CustomEvent('nillkizz_parser_message', { detail: { msg } }))
          }
        })
      }
    })
  }
  start() {
    this.node = document.querySelector('.mv_chat_messages_wrap')
    this.observer.observe(this.node, this.config);
    const btn = document.querySelector(this.controls.buttons.start.selector)
    btn.disabled = true
    btn.innerText = this.controls.buttons.start.inner.started
    addStylesheet('.mv_chat_messages_wrap{border: .2rem dashed red;}')
  }
}