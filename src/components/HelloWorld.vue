<template>
    <div>
        <el-row>
            <el-col :span="12"><div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="签到对比" name="first">
                        <h3>签到对比</h3>
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
                        <br>
                        <br>
                        <template v-if="namelist.length == 0">
                            <h5>当前无班级名单 <i class="el-icon-edit" @click="activeName = 'third'">点击添加</i></h5>
                        </template>
                        <template v-if="namelist.length != 0">
                            <h5>当前存在班级名单： <el-button type="success" icon="el-icon-search" @click="dialogVisible = true" circle></el-button></h5>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane label="作业对比" name="second">
                        <h3>作业对比:
                            <el-select v-model="classnumber" placeholder="请选择班级">
                                <el-option
                                        v-for="item in classlist"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </h3>
                        <br>
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
                        <br>
                        <template v-if="namelist.length == 0">
                            <h5>当前无班级名单  <i class="el-icon-edit" @click="activeName = 'third'">点击添加</i></h5>
                        </template>
                        <template v-if="namelist.length != 0">
                            <h5>当前存在班级名单： <el-button type="success" icon="el-icon-search" @click="dialogVisible = true" circle></el-button></h5>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane label="导入班级名单" name="third">
                        <h3>导入班级名单</h3>
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
                        <br>
                        <br>
                        <template v-if="namelist.length == 0">
                            <h5>当前无班级名单</h5>
                        </template>
                        <template v-if="namelist.length != 0">
                            <h5>当前存在班级名单： <el-button type="success" icon="el-icon-search" @click="dialogVisible = true" circle></el-button></h5>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane label="*导入及注意事项*" name="fourth">
                        导入时请保证姓名学生表格中姓名列的第一行为“姓名”
                        <br>

                    </el-tab-pane>
                </el-tabs>
            </div></el-col>
            <el-col :span="12"><div>
                <h3>对比结果</h3>
                总计：{{showlist.length}}
                <br>
                <h4>未签到/未完成</h4>
                <li v-for="(value, key) in showlist">
                    {{value}}
                </li>
                <li v-if="showlist.length == 0">
                    全员完成
                </li>
            </div></el-col>
        </el-row>



        <el-dialog
                title="当前班级名单"
                :visible.sync="dialogVisible"
                width="30%">
            {{namelist}}
        </el-dialog>
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
                outputs2 : [],
                namelist : [],
                classlist : [
                    {
                        value : ' 1828',
                        label : '1828班'
                    },
                    {
                        value : ' 1827',
                        label : '1827班'
                    },
                    {
                        value : ' 1826',
                        label : '1826班'
                    },
                    {
                        value : ' 1825',
                        label : '1825班'
                    },
                    {
                        value : ' 1824',
                        label : '1824班'
                    },
                    {
                        value : ' 1823',
                        label : '1823班'
                    },
                    {
                        value : ' 1822',
                        label : '1822班'
                    },
                    {
                        value : ' 1821',
                        label : '1821班'
                    },
                    {
                        value : ' 1820',
                        label : '1820班'
                    },
                    {
                        value : ' 1819',
                        label : '1819班'
                    },
                    {
                        value : ' 1818',
                        label : '1818班'
                    },
                    {
                        value : ' 1817',
                        label : '1817班'
                    },
                    {
                        value : ' 1816',
                        label : '1816班'
                    },
                    {
                        value : ' 1815',
                        label : '1815班'
                    },
                    {
                        value : ' 1814',
                        label : '1814班'
                    },
                    {
                        value : ' 1813',
                        label : '1813班'
                    },
                    {
                        value : ' 1812',
                        label : '1812班'
                    },
                    {
                        value : ' 1811',
                        label : '1811班'
                    },
                    {
                        value : ' 1810',
                        label : '1810班'
                    },
                    {
                        value : ' 1809',
                        label : '1809班'
                    },
                    {
                        value : ' 1808',
                        label : '1808班'
                    },
                    {
                        value : ' 1807',
                        label : '1807班'
                    },
                    {
                        value : ' 1806',
                        label : '1806班'
                    },
                    {
                        value : ' 1805',
                        label : '1805班'
                    },
                    {
                        value : ' 1804',
                        label : '1804班'
                    },
                    {
                        value : ' 1803',
                        label : '1803班'
                    },
                    {
                        value : ' 1802',
                        label : '1802班'
                    },
                    {
                        value : ' 1801',
                        label : '1801班'
                    }
                ],
                classnumber : ' 1815',
                dialogVisible : false
            }
        },
        mounted: function () {
            this.init();
        },
        methods: {
            init(){
                if (Cookies.get("template").split("-") != null){
                    this.namelist = Cookies.get("template").split("-");
                }
            },
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
                        this.init();
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
                            if (ws[i][" 班级（如1801）"] == this.classnumber){
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
