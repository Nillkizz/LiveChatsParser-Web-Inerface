import { API } from '@/api';
import { addStylesheet } from '@/helpers';

export class FaceBook {
  constructor(href) {
    this.pathMatch = href.match(/\/videos\/(\d+)/) ?? href.match(/\/watch\/live\/\?v=(\d+)/);
    if (this.pathMatch == null) {
      this.disabled = true
      return
    }

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
        '.pcontrols__inputs': `
                        margin-bottom: .7rem;`,
        '.pcontrols__fb-start[disabled]': `
                        pointer-events: none;`
      },
      title: 'Парсер чата для FaceBook',
      inputs: ['token'],
      buttons: {
        start: {
          inner: { start: 'Запустить', started: 'Запущен' },
          class: 'pcontrols__fb-start',
          selector: '.pcontrols__fb-start',
          cb: this.start.bind(this),
        }
      }
    }
    this.api = new API()
  }
  getUrl(token) {
    // const token = 'EAANd50iL9ZCkBAPnMWMvp2jXqDNcUyMlbEohIrAiDn52hbYuuiepxcLtFmowVREmyn3O7DiHsIEKZCBAxTn7i5FsEmA6EM76xB0ZB9i95P5W4R2ZAvZAvj2mQPRHxiRuXNQuCmw1KTLKIFazKX74g4IRlMo6ocP79obiSTg0NiDVwsQ9YI5UkNZCzs0rVGpv4ZD'
    // https://developers.facebook.com/tools/explorer
    // https://developers.facebook.com/tools/debug/accesstoken/
    const vid = this.pathMatch[1]
    const url = `https://streaming-graph.facebook.com/${vid}/live_comments?access_token=${token}&comment_rate=one_hundred_per_second&fields=from{name},message`
    return url
  }
  _cb(event) {
    const data = JSON.parse(event.data)
    const msg = {
      social: 'fb',
      author: data.from ? data.from.name : 'Facebook User',
      text: data.message,
      datetime: (new Date).toJSON()
    }
    this.api.sendMessage(msg)
  }
  start() {
    const token = document.querySelector('.pcontrols__inputs input').value
    const source = new EventSource(this.getUrl(token))
    source.onmessage = this._cb.bind(this)
    const btn = document.querySelector(this.controls.buttons.start.selector)
    btn.disabled = true
    btn.innerText = this.controls.buttons.start.inner.started
    addStylesheet('.mv_chat_messages_wrap{border: .2rem dashed red;}')
  }
}