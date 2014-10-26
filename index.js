var apps = []

function dispatchAll(event) {
  for (var i = 0, len = apps.length; i < len; i++) {
    var app = apps[i]
    // blur events fire during render if the focused
    // element is removed from the DOM
    if (app.isRendering) continue
    dispatch(app.dom, app.vdom, event)
  }
  event.stopPropagation()
}

function dispatch(dom, vdom, event) {
  var target = event.target
  if (target === window) return
  var path = []
  while (target !== dom) {
    // event not within dom
    if (target === document) return
    path.push(indexOf(target))
    target = target.parentNode
  }
  var i = path.length
  while (i--) {
    vdom = vdom.children[path[i]]
    if (vdom.type == 'Thunk') vdom = vdom.call()
    path[i] = vdom
  }
  propagate(path, event, event.type)
}

function propagate(nodes, event, type) {
  for (var i = 0, len = nodes.length; i < len; i++) {
    var node = nodes[i]
    var fn = node.events[type]
    if (fn) fn.call(node, event)
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
