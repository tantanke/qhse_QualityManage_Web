import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default{
  // install (Vue, options) {
  install (Vue) {
    Vue.prototype.getPdf = function () {
      var title = this.htmlTitle
      html2Canvas(document.querySelector('#pdfDom'), {
        allowTaint: true,
        //scale可调清晰度
        scale:5
      }).then(function (canvas) {
        //网页宽度
        let contentWidth = canvas.width/10
        //div 高度
        let contentHeight = canvas.height/10
        let pageHeight = contentWidth / 841.89 *  592.28
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 841.89
        let imgHeight = 841.89 / contentWidth * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        //l表示横向，p表示纵向
        let PDF = new JsPDF('l', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 592.28
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
      }
      )
    }
  }
}
