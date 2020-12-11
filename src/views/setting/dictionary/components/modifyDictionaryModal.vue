<template>
    <el-dialog
        center
        custom-class="modify-dictionary-modal"
        :title="data ? '编辑字典' : '新增字典'"
        :visible="isShow"
        destroy-on-close
        :show-close="false"
    >
        <el-form
            :model="formData"
            :rules="rules"
            ref="formRef"
            class="modify-dictionary-form"
            labelWidth="80px"
        >
            <el-form-item
                label="字典名称"
                prop="name"
            >
                <el-input
                    v-model="formData.name"
                    :maxLength="fieldMaxLength"
                />
            </el-form-item>
            <el-form-item
                label="字典标识"
                prop="sign"
                :maxLength="fieldMaxLength"
            >
                <el-input v-model="formData.sign" />
            </el-form-item>
            <el-form-item
                label="字典描述"
                prop="description"
                :maxLength="remarkMaxLength"
            >
                <el-input v-model="formData.description" />
            </el-form-item>
        </el-form>
        <div
            class="footer flex-content-x-center"
            slot="footer"
        >
            <el-button
                @click="isShow = false"
            >
                取消
            </el-button>
            <el-button
                type="primary"
                @click="validateThenSubmitForm"
            >
                确认
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { createDictionary, updateDictionary } from '@request';

    const initFormData = {
        name: '',                   // 字典名称
        sign: '',                   // 字典标识
        description: ''             // 字典描述
    };

    export default {
        name: 'modify-dictionary-modal',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object,
                default: null
            }
        },
        data () {
            return {
                fieldMaxLength: 30,
                remarkMaxLength: 100,
                isShow: this.visible,           // 是否展示弹窗
                formData: { ...initFormData },  // 表单信息
                rules: {
                    name: [
                        { required: true, message: '请输入字典名称' },
                        { pattern: this.utils.regExp.letterOrChineseAndNotStartWithNumber, message: '字典名称只能使用中文、字母、数字，且不能以数字开头' },
                    ],
                    sign: [
                        { required: true, message: '请输入字典标识' },
                        { pattern: this.utils.regExp.LetterNumberUnderline, message: '字典标识只能使用字母、数字、下划线' },
                    ],
                },
            }
        },
        methods: {
            // 验证后提交表单
            validateThenSubmitForm () {
                this.$refs.formRef.validate()
                    .then(result => {
                        if (this.data) this.requestUpdateDictionary();
                        else this.requestCreateDictionary();
                    });
            },
            requestCreateDictionary () {
                const requestParams = {
                    ...this.formData
                };
                createDictionary(requestParams)
                    .then(result => {
                        this.message.success({ message: '字典新增成功' });
                        this.isShow = false;
                        // 通知父组件修改成功
                        this.$emit('onChange', {
                            type: 'modify',
                            result
                        });
                    });
            },
            requestUpdateDictionary() {
                const { name, sign, description } = this.formData
                const requestParams = this.utils.getExistFieldFromParams({
                    name,
                    sign,
                    description,
                    id: this.data.id
                });
                updateDictionary(requestParams)
                    .then(result => {
                        this.message.success({ message: '字典编辑成功' });
                        this.isShow = false;
                        // 通知父组件修改成功
                        this.$emit('onChange', {
                            type: 'add',
                            result
                        });
                    });
            }
        },
        watch: {
            isShow (newValue) {
                this.$emit('update:visible', newValue);
            },
            visible (newValue) {
                if (newValue && this.data) {
                    this.formData = {
                        ...initFormData,
                        ...this.data
                    }
                } else this.formData = { ...initFormData };
                this.isShow = newValue;
            }
        }
    }
</script>

<style lang="scss">
    .modify-dictionary-modal {
        max-width: 375px;
        .el-dialog__body {
            padding-bottom: 0;
        }
        .modify-dictionary-form {
            padding-right: 5px;
        }
    }
</style>