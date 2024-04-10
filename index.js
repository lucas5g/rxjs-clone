import { fromEvent, interval, map } from "./operator.js"

const canvas = document.getElementById('canvas')
const clearBtn = document.getElementById('clearBtn')
const ctx = canvas.getContext('2d')

const resetCanvas = (width, height) => {
  const parent = canvas.parentElement 
  canvas.width = width || parent.clientWidth * 0.9
  canvas.height = height || parent.clientHeight * 1.5

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = 'green'
  ctx.lineWidth = 4

}

resetCanvas()

const touchToMouse = (touchEvent, mouseEvent ) => {
  const [touch] = touchEvent.touches.length ?
    touchEvent.touches : 
    touchEvent.changedTouches 

    return new MouseEvent(mouseEvent, {
      clientX: touch.clientX
    })
}
// interval(200)
fromEvent(canvas, 'mousedown')
  .pipeThrough(map(e => {
    return JSON.stringify(e, null, 2)
  }))
  .pipeTo(new WritableStream({
    write(chunk){
      console.log('chunk', chunk)
    }
  }))