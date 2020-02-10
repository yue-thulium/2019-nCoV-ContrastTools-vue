<template>
    <div>
        <el-row>
            <el-col :span="12"><div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="签到对比" name="first">
                        <el-upload
                                :multiple='false'
                                :auto-upload='false'
                                :show-file-list='true'
                                :on-change="elInFile"
                                :drag='true'
                                action=''
                                accept=".xls,.xlsx">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击选择</em></div>
                            <div class="el-upload__tip" slot="tip">一次只能选择一个文件，仅限Excel格式，单文件不超过1MB</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="作业对比" name="second">
                        配置管理
                    </el-tab-pane>
                    <el-tab-pane label="导入班级名单" name="third">
                        <input type="file" ref="upload" accept=".xls,.xlsx" class="outputlist_upload">
                    </el-tab-pane>
                </el-tabs>
            </div></el-col>
            <el-col :span="12"><div>
                对比结果
                <el-row :gutter="20">
                    <el-col :span="12"  style="margin-top: 15%"><div>
                        未签到/未完成
                        <li v-for="(value, key) in showlist">
                            {{value}}
                        </li>
                    </div></el-col>
                    <el-col :span="12" style="margin-top: 35%"><div>
                        总计：{{showlist.length}}
                    </div></el-col>
                </el-row>
            </div></el-col>
        </el-row>
    </div>
</template>

<script>
    import XLSX from "xlsx";

    export default {
        data() {
            return {
                outputs: [],
                files: null, //文件列表
                activeName: 'first',
                showlist : []
            }
        },
        mounted() {
            this.$refs.upload.addEventListener('change', e => {//绑定监听表格导入事件
                this.readExcel(e);
            })
        },
        methods: {
            /**
             * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用。
             * @param f {@link Object}：当前上传的文件；
             * @param fs {@link Array}：当前文件列表；
             */
            elInFile(f, fs) {
                this.read(f.raw);
            },
            read(f) {
                var that = this;
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
                        that.outputs = [];//清空接收数据
                        for(var i= 0;i<ws.length;i++){
                            that.outputs.push(ws[i].__EMPTY);
                        }
                        console.log(that.outputs);
                        var list = that.outputs;
                        list.splice(0,4);
                        this.postRequest('/chick/daychick',{list}).then(resp => {
                            if (resp && resp.status == 200){
                                var data = resp.data;
                                this.showlist = data.list;
                                console.log(this.showlist);
                            }
                        });
                        this.$refs.upload.value = '';

                    } catch (e) {

                        return false;
                    }
                };
                fileReader.readAsBinaryString(f);
            },
            handleClick(tab, event) {
                //console.log(tab, event);
            },
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
