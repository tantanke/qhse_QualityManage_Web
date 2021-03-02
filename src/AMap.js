export default function MapLoader () {   // <-- 原作者这里使用的是module.exports
    return new Promise((resolve, reject) => {
      if (window.AMap) {
        resolve(window.AMap)
      } else {
        var script = document.createElement('script')
        script.src = 'http://webapi.amap.com/maps?v=1.3&callback=initAMap&key=5dc6159f1085fd4c66dcb2672a61706e'
        script.onerror = reject
        script.type = 'text/javascript'
        script.async = true
        // script.src = 'http://webapi.amap.com/maps?v=1.3&callback=initAMap&key=5dc6159f1085fd4c66dcb2672a61706e'
        script.onerror = reject
        document.head.appendChild(script)
      }
      window.initAMap = () => {
        resolve(window.AMap)
      }
    })
  }
  