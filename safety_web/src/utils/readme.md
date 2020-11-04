### doloadFile用于下载二进制流文件

```JS

export const downloadfile = (filename,blob) => { // 文件名 返回的blob对象
                const fileName = filename + ".xls";
                const elink = document.createElement("a"); // 创建的标签
                elink.download = fileName;
                elink.style.display = "none";
                elink.href = URL.createObjectURL(blob); // 创建url
                document.body.appendChild(elink); // 把 创建的标签追加到body里
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink); // 移除标签
}
```