import { API, subscribeToStopWords } from './api';
import { addStylesheet, parseMsg } from './helpers';

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
        console.log('getUrl', token, vid, this.pathMatch)
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
        console.log('start', this.getUrl(token), token)
        const source = new EventSource(this.getUrl(token))
        console.log('start', source)
        source.onmessage = this._cb.bind(this)
        const btn = document.querySelector(this.controls.buttons.start.selector)
        btn.disabled = true
        btn.innerText = this.controls.buttons.start.inner.started
        addStylesheet('.mv_chat_messages_wrap{border: .2rem dashed red;}')
    }
}
export class Instagram {
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
                '.pcontrols__inst-start': `
                        background: #0095f6;
                        border: transparent;
                        padding: .4rem;
                        color: white;
                        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
                        font-weight: 600;
                        border-radius: 3px;`,
                '.pcontrols__inst-start[disabled]': `
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
                    class: 'pcontrols__inst-start',
                    selector: '.pcontrols__inst-start',
                    cb: this.start.bind(this),
                }
            }
        }
        this.api = new API()
    }
    _cb(mutations, observer) {
        mutations.forEach(m => {
            if (m.type == 'childList') {
                m.addedNodes.forEach(node => {
                    const _msg = node.querySelector('span~span')
                    if (!!_msg) {
                        const _msgNode = _msg.parentElement.children
                        const msg = {
                            social: 'inst',
                            author: _msgNode[0].textContent,
                            text: parseMsg(_msgNode[1]),
                            datetime: (new Date).toJSON()
                        }
                        if (msg.text.length > 0) this.api.sendMessage(msg)
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
}
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
            title: 'Парсер чата для VK',
            inputs: [],
            buttons: {
                start: {
                    inner: { start: 'Запустить', started: 'Запущен' },
                    class: 'pcontrols__vk-start flat_button',
                    selector: '.pcontrols__vk-start',
                    cb: this.start.bind(this),
                }
            }
        }
        this.api = new API()
    }
    _cb(mutations, observer) {
        mutations.forEach(m => {
            if (m.type == 'childList') {
                m.addedNodes.forEach(node => {
                    if (node.classList.contains('mv_chat_message')) {
                        const msg = {
                            social: 'vk',
                            author: node.querySelector('.mv_chat_message_author_name').innerText,
                            text: parseMsg(node.querySelector('.mv_chat_message_text')),
                            datetime: (new Date).toJSON()
                        }
                        if (msg.text.length > 0) this.api.sendMessage(msg)
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
        this.api = new API()
    }
    _cb(mutations, observer) {
        mutations.forEach(m => {
            if (m.type == 'childList') {
                m.addedNodes.forEach(node => {
                    if (node.classList.contains('vp-chat_i')) {
                        const msg = {
                            social: 'ok',
                            author: node.querySelector('.o').innerText,
                            text: parseMsg(node.querySelector('.textWrap')),
                            datetime: (new Date).toJSON()
                        }
                        if (msg.text.length > 0) this.api.sendMessage(msg)
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
        this.api = new API()
    }
    _cb(mutations, observer) {
        mutations.forEach(m => {
            if (m.type == 'childList') {
                m.addedNodes.forEach(node => {
                    if (node.nodeType == 1 && node.tagName == "YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER") {
                        const msg = {
                            social: 'yt',
                            author: node.querySelector('yt-live-chat-author-chip').innerText,
                            text: parseMsg(node.querySelector('#message')),
                            datetime: (new Date).toJSON()
                        }
                        if (msg.text.length > 0) this.api.sendMessage(msg)
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