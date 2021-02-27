<template>
  <router-view />
</template>
<script>
export default {
data() {
  return {
    count:0
  }
},
beforeCreate(){
    let imgs = [
    //用require的方式添加图片地址，直接添加图片地址的话，在build打包之后会查找不到图片，因为打包之后的图片名称会有一个加密的字符串
        require('./components/img/back.png'),
        require('./views/bigScreen/img/bg.jpg')
    ]
    for (let img of imgs) {
        let image = new Image();
        image.src = img;
        image.onload = () => {
            this.count++;
        };
    }
}
  
}
</script>

<style>
/* 解决表格使用过程中body与header不对齐的问题 */
	body .el-table th.gutter{
		display:table-cell !important;
	}
</style>
