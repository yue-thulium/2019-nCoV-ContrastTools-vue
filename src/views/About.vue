<template>
  <div>
    <input type="file" ref="upload" accept=".xls,.xlsx" class="outputlist_upload">
  </div>
</template>

<script>
  import XLSX from 'xlsx';  // npm导入库，命令：npm i xlsx@^0.14.1 -s
  export default {
    data() {
      return {
        outputs1: []
      }
    },
    mounted() {
      this.$refs.upload.addEventListener('change', e => {//绑定监听表格导入事件
        this.readExcel(e);
      })
    },
    methods: {
      readExcel(e) {//表格导入
        var that = this;
        const files = e.target.files;
        console.log(files);
        if(files.length<=0){//如果没有文件名
          return false;
        }else if(!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())){
          this.$Message.error('上传格式不正确，请上传xls或者xlsx格式');
          return false;
        }

        const fileReader = new FileReader();
        fileReader.onload = (ev) => {
          try {
            const data = ev.target.result;
            const workbook = XLSX.read(data, {
              type: 'binary'
            });
            const wsname = workbook.SheetNames[0];//取第一张表
            const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
            console.log(ws);
            that.outputs1 = [];//清空接收数据
            for(var i= 0;i<ws.length;i++){
              that.outputs1.push(ws[i].姓名);
            }
            console.log(that.outputs1);
            var list = that.outputs1;
            this.postRequest('/chick/template',{list}).then(resp => {
              // if (resp && resp.status == 200)
            });
            this.$refs.upload.value = '';

          } catch (e) {

            return false;
          }
        };
        fileReader.readAsBinaryString(files[0]);
      }
    }
  }
</script>

<style scoped>
</style>
