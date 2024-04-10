
/**
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
    cancel(){
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
    start(controller){
      intervalId = setInterval(() => {
        controller.enqueue(Date.now())
      }, ms)
    },
    cancel(){
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
    transform(chunk, controller){
      controller.enqueue(fn(chunk))
    }
  })
}

export {
  fromEvent,
  interval,
  map
}