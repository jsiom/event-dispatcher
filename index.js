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
  var l = path.push(dom)
  var vpath = new Array(l)
  for (var i = l - 1; true;) {
    if (vdom instanceof Node) { dom=path[++i]; vdom=vpath[i]; break } // real DOMNode
    if (vdom.type == 'Thunk') vdom = vdom.call()
    vpath[i] = vdom
    if (i == 0) { event.stopPropagation(); break } // no need to bubble into the real DOM
    dom = path[--i]
    vdom = vdom.children[indexOf(dom)]
  }
  while (i < l) {
    var fn = vdom.events[event.type]
    if (fn && fn.call(vdom, event, dom)) return // stopPropagation
    dom = path[++i]
    vdom = vpath[i]
  }
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
