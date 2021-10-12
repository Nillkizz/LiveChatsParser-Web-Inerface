import { API } from '@/api';
import { addStylesheet, parseMsg } from '@/helpers';

export class TikTok {
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
        '.pcontrols__buttons': `
                        display: flex; 
                        flex-direction: column;
                        justify-content: center;`,
        '.pcontrols__tt-start[disabled]': `
                        pointer-events: none;
                        background: var(--light_blue_300);`
      },
      title: 'Парсер чата для TikTok',
      inputs: [],
      buttons: {
        start: {
          inner: { start: 'Запустить', started: 'Запущен' },
          class: 'pcontrols__tt-start tiktok-btn-pc tiktok-btn-pc-medium tiktok-btn-pc-primary',
          selector: '.pcontrols__tt-start',
          cb: this.start.bind(this),
        }
      }
    }
    this.api = new API()
  }
  _cb(e) {
    if (e.method == 'WebcastChatMessage') {
      const msg = {
        social: 'tt',
        author: e.payload.user.nickname,
        text: (e.payload.content),
        datetime: (new Date).toJSON()
      }
      if (msg.text.length > 0) this.api.sendMessage(msg)
    }
  }
  start() {
    const btn = document.querySelector(this.controls.buttons.start.selector)

    window.__RoomMessage.watchAllEvents.push(this._cb.bind(this))
    btn.disabled = true
    btn.innerText = this.controls.buttons.start.inner.started
    addStylesheet('.webcast-chatroom-messages-list{border: .25rem dashed red;}')
  }
}