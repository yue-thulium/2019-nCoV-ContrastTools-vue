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
                        <el-upload
                                :multiple='false'
                                :auto-upload='false'
                                :show-file-list='true'
                                :on-change="elInFile3"
                                :drag='true'
                                :file-list="fileList2"
                                action=''
                                accept=".xls,.xlsx">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击选择</em></div>
                            <div class="el-upload__tip" slot="tip">一次只能选择一个文件，仅限Excel格式，单文件不超过1MB</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="导入班级名单" name="third">
                        <el-upload
                                :multiple='false'
                                :auto-upload='false'
                                :show-file-list='true'
                                :on-change="elInFile2"
                                :drag='true'
                                :file-list="fileList"
                                action=''
                                accept=".xls,.xlsx">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击选择</em></div>
                            <div class="el-upload__tip" slot="tip">一次只能选择一个文件，仅限Excel格式，单文件不超过1MB</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="导入及注意事项" name="fourth">
                        导入时请保证姓名学生表格中姓名列的第一行为“姓名”
                        <br>

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
                        <li v-if="showlist.length == 0">
                            全员完成
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
    import Cookies from 'js-cookie'

    export default {
        data() {
            return {
                outputs: [],
                files: null, //文件列表
                fileList: null,
                activeName: 'first',
                showlist : [],
                fileList2 : null,
                outputs2 : []
            }
        },
        mounted() {
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
            elInFile2(f, fs) {
                this.readExcel(f.raw);
            },
            elInFile3(f, fs) {
                this.readExcel2(f.raw);
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
                        that.outputs = [];//清空接收数据
                        for(var i= 0;i<ws.length;i++){
                            that.outputs.push(ws[i].__EMPTY);
                        }
                        var list = that.outputs;
                        list.splice(0,4);
                        var template = Cookies.get('template');
                        template = template.split("-");
                        this.postRequest('/chick/template',{template}).then(resp => {
                        });
                        this.postRequest('/chick/daychick',{list}).then(resp => {
                            if (resp && resp.status == 200){
                                var data = resp.data;
                                this.showlist = data.list;
                                this.$message({
                                    message: '对比完成',
                                    type: 'success'
                                });
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
            },
            readExcel(e) {
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
                        that.outputs1 = [];//清空接收数据
                        for(var i= 0;i<ws.length;i++){
                            that.outputs1.push(ws[i].姓名);
                        }
                        var list = that.outputs1;
                        list = list.join("-");
                        Cookies.set("template",list,{expires:40});
                        this.$message({
                            message: '添加学生名单成功！',
                            type: 'success'
                        });
                        this.$refs.upload.value = '';
                    } catch (e) {
                        return false;
                    }
                };
                fileReader.readAsBinaryString(e);
            },
            readExcel2(e) {//表格导入
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
                        that.outputs2 = [];//清空接收数据
                        for(var i= 0;i<ws.length;i++){
                            if (ws[i][" 班级（如1801）"] == ' 1815'){
                                that.outputs2.push(ws[i][" 学生姓名"]);
                            }
                        }
                        var list = that.outputs2;
                        var template = Cookies.get('template');
                        template = template.split("-");
                        this.postRequest('/chick/template',{template}).then(resp => {
                            // if (resp && resp.status == 200)
                        });
                        this.postRequest('/chick/daychick',{list}).then(resp => {
                            if (resp && resp.status == 200){
                                var data = resp.data;
                                this.showlist = data.list;
                                this.$message({
                                    message: '对比完成',
                                    type: 'success'
                                });
                            }
                        });
                        this.$refs.upload.value = '';
                    } catch (e) {
                        return false;
                    }
                };
                fileReader.readAsBinaryString(e);
            }
        }
    }
</script>

<style scoped>

</style>
