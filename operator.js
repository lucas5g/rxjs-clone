
/**
 * 
 * @param {EventTarget} target
 * @param {string} eventName 
 * @returns {ReadableStream}
 */
const fromEvent = (target, eventName) => {
  let listener
  return new ReadableStream({
    start(controller) {
      listener = (e) => controller.enqueue(e)
      target.addEventListener(eventName, listener)
    },
    cancel() {
      target.removeEventListener(eventName, listener)
    }
  })
}

/**
 * 
 * @param {Number} ms 
 * @returns {ReadableStream}
 */
const interval = ms => {
  let intervalId
  return new ReadableStream({
    start(controller) {
      intervalId = setInterval(() => {
        controller.enqueue(Date.now())
      }, ms)
    },
    cancel() {
      clearInterval(intervalId)
    }
  })
}

/**
 * 
 * @param {Function} fn 
 * @returns {TransformStream}
 */
const map = fn => {
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(fn(chunk))
    }
  })
}

/**
 * @typedef {ReadableStream | TransformStream} Stream
 * @param {Stream[]} streams 
 * @returns {ReadableStream}
 */

const merge = (streams) => {
  return new ReadableStream({
    async start(controller) {
      for (const stream of streams) {
        const reader = (stream.readable || stream).getReader()
        async function read() {
          const { value, done } = await reader.read()
          if (done) return
          controller.enqueue(value)

          return read()
        }

        return read()
      }
    }
  })
}

/**
 * @typedef {function(): ReadableStream | TransformStream} StreamFunction
 * 
 * @param {StreamFunction} fn 
 * @param {object} options
 * @param {boolean} options.pairwise
 */

const switchMap = (fn, options = { pairwise: true }) => {
  return TransformStream({
    transform(chunk, controller) {
      const stream = fn(chunk)
      const reader = (stream.readable || stream).getReader()
      async function read() {

        const { value, done } = await reader.read()

        if (done) return
        const result = options.pairwise ? [chunk, value] : value
        controller.enqueue(result)

        return read()
      }
      return read()
    }
  })
}
export {
  fromEvent,
  interval,
  map,
  merge,
  switchMap
}