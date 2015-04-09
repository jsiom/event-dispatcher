var apps = []

function dispatchAll(event) {
  for (var i = 0, len = apps.length; i < len; i++) {
    var app = apps[i]
    // Ignore events which fire during render
    if (app.isRendering) continue
    dispatch(app.dom, app.vdom, event)
  }
}

function dispatch(dom, vdom, event) {
  var target = event.target
  if (target === document) return
  if (target === window) return
  var path = [target]
  while (true) {
    target = target.parentNode
    if (target === document) return // event not within the app
    if (target === dom) break
    path.push(target)
  }
  var i = path.length
  while (true) {
    if (vdom.type == 'Thunk') vdom = vdom.call()
    if (vdom.type == null) return // a real DOM node inside the virtual DOM
    var fn = vdom.events[event.type]
    if (fn) fn.call(vdom, event, dom)
    if (i === 0) break
    dom = path[--i]
    vdom = vdom.children[indexOf(dom)]
    if (vdom == null) return
  }
  event.stopPropagation() // no need to bubble into the real DOM
}

function indexOf(el) {
  var index = 0
  while (el.previousSibling) {
    el = el.previousSibling
    index++
  }
  return index
}

[
  'click',
  'mousedown',
  'mouseup',
  'dblclick',
  'mousedown',
  'mouseup',
  'mouseover',
  'mousemove',
  'mouseout',
  'dragstart',
  'drag',
  'dragenter',
  'dragleave',
  'dragover',
  'drop',
  'dragend',
  'keydown',
  'keypress',
  'keyup',
  'resize',
  'scroll',
  'select',
  'change',
  'submit',
  'reset',
  'focus',
  'blur',
  'focusin',
  'focusout'
].forEach(function(event){
  window.addEventListener(event, dispatchAll, true)
})

module.exports = apps.push.bind(apps)
