import { FaceBook, Instagram, Vk, Ok, Youtube } from './parsers'
import { addStylesheet } from './helpers';

class Controls {
  constructor() {
    this.rendered = false
    this.parsers = {
      'vk.com': Vk,
      'ok.ru': Ok,
      'www.youtube.com': Youtube,
      'www.facebook.com': FaceBook,
      'www.instagram.com': Instagram,
    }
  }
  init(href = window.location.href) {
    this.host = window.location.host
    this.parser = this.parsers[this.host]
    if (typeof this.parser === 'undefined') return;
    this.parser = new this.parser(href)
    if (!!this.parser.disabled) return
    const controlsDOMElement = new DOMParser().parseFromString(this.html, 'text/html').body.firstChild
    addStylesheet(this.parser.controls.css)
    document.body.appendChild(controlsDOMElement)
    this.parser.controls.init()
    this.rendered = true
  }
  get html() {
    let buttons = Object.values(this.parser.controls.buttons)
      .map(btn => `<button class="${btn.class}">${btn.inner.start}</button>`)
      .join('')
    let inputs = this.parser.controls.inputs
      .map(input => `<input class="${input}" name="${input}" placeholder="${input}"></input>`)
      .join('')
    return `
                <div class="pcontrols">
                    <div class="pcontrols__title">${this.parser.controls.title}</div>
                    <div class="pcontrols__inputs">${inputs}</div>
                    <div class="pcontrols__buttons">${buttons}</div>
                </div>
            `
  }
  destroy() {
    if (this.rendered && !this.parser.disabled) document.querySelector('.pcontrols').remove()
  }
}
let controls = new Controls()
controls.init()

watchLocation()
function watchLocation() {
  window.history.pushState = new Proxy(window.history.pushState, {
    apply: (target, thisArg, argArray) => {
      controls.destroy()
      controls.init(argArray[2])
      return target.apply(thisArg, argArray);
    },
  });
}




