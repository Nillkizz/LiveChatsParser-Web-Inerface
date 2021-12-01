import { addStylesheet, parseMsg } from '@/helpers';

export class Youtube {
  constructor() {
    const pathNames = ["/live_chat",]
    if (!pathNames.includes(window.location.pathname)) return

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
                        bottom: 6rem;
                        right: 1rem;
                        padding: 1rem;
                        background-color: #000A;
                        color: white;
                        border-radius: .3rem;
                        min-width: 200px;
                        text-align: center;
                        z-index: 1000;`,
        '.pcontrols__title': `
                        margin-bottom: 1rem;
                        color: var(--yt-spec-text-primary);
                        font-size: 14px;
                        `,
        '.pcontrols__buttons': `display: flex; justify-content: center;`,
        '.pcontrols__yt-start': `
                        background-color: var(--yt-spec-brand-button-background);
                        border-radius: 2px;
                        color: var(--yt-spec-static-brand-white);
                        padding: var(--yt-button-padding);
                        margin: auto var(--ytd-subscribe-button-margin, 4px);
                        white-space: nowrap;
                        font-size: var(--ytd-tab-system_-_font-size);
                        font-weight: var(--ytd-tab-system_-_font-weight);
                        letter-spacing: var(--ytd-tab-system_-_letter-spacing);
                        text-transform: var(--ytd-tab-system_-_text-transform);
                        display: flex;
                        flex-direction: row;
                        border: none;
                        cursor: pointer;
                    `,
        '.pcontrols__yt-start[disabled]': `
                        pointer-events: none;
                        background-color: var(--yt-spec-badge-chip-background);
                        color: var(--yt-spec-text-secondary);`
      },
      title: 'Парсер чата для Youtube',
      inputs: [],
      buttons: {
        start: {
          inner: { start: 'Запустить', started: 'Запущен' },
          class: 'pcontrols__yt-start',
          selector: '.pcontrols__yt-start',
          cb: this.start.bind(this),
        }
      }
    }
  }
  _cb(mutations, observer) {
    mutations.forEach(m => {
      if (m.type == 'childList') {
        m.addedNodes.forEach(node => {
          if (node.nodeType == 1 && node.tagName == "YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER") {
            const msg = {
              social: 'yt',
              author: node.querySelector('yt-live-chat-author-chip').innerText,
              text: parseMsg(node.querySelector('#message').textContent),
              datetime: (new Date).toJSON()
            }
            if (msg.text.length > 0) document.dispatchEvent(new CustomEvent('nillkizz_parser_message', { detail: { msg } }))
          }
        })
      }
    })
  }
  start() {
    this.node = document.getElementById('chat')
    this.observer.observe(this.node, this.config);
    const btn = document.querySelector(this.controls.buttons.start.selector)
    btn.disabled = true
    btn.innerText = this.controls.buttons.start.inner.started
    addStylesheet('#chat{border: .4rem dashed red;}')
  }
}