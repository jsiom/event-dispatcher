
# Event-Dispatcher

  Dispatch events from the real DOM on the virtual DOM

## Installation

With [packin](//github.com/jkroso/packin): `packin add jsiom/event-dispatcher`

then in your app:

```js
var dispatch = require('event-dispatcher')
```

## API

### `dispatch(app)`

Start dispatching events from `app.dom` to `app.vdom`. See this [example](example.html)
