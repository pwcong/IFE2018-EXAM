# 3.3 表单验证封装

## 任务目的
* 学习如何用San来封装支持自定义验证的表单

## 任务描述
* 根据给出的设计稿实现支持自定义验证的表单组件，并满足给定的API
* 学习如何利用开源社区中比较成熟的库
* 可以自己扩展实现更复杂的表单组件，尝试将日历组件、下拉组件集成到表单组件中

## Form

props

|名称	|类型	|必须	|默认值	|描述|
|-----|-----|----|-------|----|
|labelWidth	|String	|false	|100px	|标签宽度，带单位的宽度值，如100px，影响这个表单|
|rules	|Object	|false	|[]	|验证规则|
|labelPosition	|String	|false	|left	|标签位置，影响整个表单，可选值为top,right,left。|

event

|方法	|说明	|返回值|
|-----|-----|-----|
|validate	|对表单执行验证	|-|
|validateField	|对单一的表单控件执行验证	|-|
|resetFields	|重置所有表单	|-|

## FormItem

props

|名称	|类型	|必须	|默认值	|描述|
|-----|-----|----|-------|----|
|require	|Boolean	|false	|false	|是否必填项|
|label	|String	|false	|-	|标签名称|
|labelWidth	|String	|false	|100px	|标签宽度，带单位的宽度值，如100px|
|prop	|String	|false	|-	|formModel中的字段|
|rules	|Array	|false	|[]	|验证规则|
|error	|String	|false	|-	|错误信息，外部传入，改变组件的验证状态，仅做提示|
|helpText	|String	|false	|-	|帮助信息|
|labelPosition	|String	|false	|left	|标签位置，可选值为top,right,left。|

## 使用形式

```html
<template>
    <div class="demo-section">
        <ui-form
            formModel="{=formModel=}"
            san-ref="formModel">
            <ui-form-item
                rules="{{ruleMobile}}"
                prop="mobile"
                helpText="请输入手机号码"
                label="手机号码">
                <ui-input
                    value="{=formModel.mobile=}"
                ></ui-input>
            </ui-form-item>
            <ui-form-item
                rules="{{ruleAddress}}"
                prop="address"
                helpText="请输入地址"
                label="地址">
                <ui-input
                    value="{=formModel.address=}"
                ></ui-input>
            </ui-form-item>
            <ui-form-item
                prop="userName"
                require="{{true}}"
                helpText="输入姓名与身份证保持一致"
                label="姓名">
                <ui-input
                    value="{=formModel.userName=}"
                ></ui-input>
            </ui-form-item>
            <ui-form-item
                rules="{{ruleIdCard}}"
                prop="idCard"
                helpText="根据国家相关规定，需要您输入身份证号码"
                label="身份证号码">
                <ui-input
                    value="{=formModel.idCard=}"
                ></ui-input>
            </ui-form-item>
            <ui-form-item>
                <ui-button class="submit-button" on-click="submitForm('formModel')" ui="primary small">提交</ui-button>
                <ui-button class="submit-button" on-click="resetForm('formModel')" ui="primary small">重置</ui-button>
            </ui-form-item>
        </ui-form>
    </div>
</template>

<script>
import Form from '../../../src/components/Form';
import FormItem from '../../../src/components/FormItem';
import Input from '../../../src/components/Input';
import Button from '../../../src/components/Button';
export default {
    components:{
        'ui-button': Button,
        'ui-form': Form,
        'ui-form-item': FormItem,
        'ui-input': Input
    },
    initData() {
        const idCardValidate = (rule, value, callback) => {
            if (value) {
                // 异步、远程验证
                let userName = this.data.get('formModel.userName');
                console.log({
                    userName,
                    idCard: value
                });
                // 将用户名和身份证号码作为参数发送异步请求，到服务端验证
                setTimeout(function() {
                    callback([new Error('您输入的身份信息不匹配')]);
                }, 1000);
            }
            else {
                setTimeout(function() {
                    callback(['请输入身份证号码']);
                }, 1000);
            }
        };

        return {
            formModel: {
                mobile: '',
                userName: '',
                idCard: '',
                address: ''
            },
            ruleMobile: [
                {
                    type: 'string',
                    required: true,
                    message: '请输入手机号码'
                },
                {
                    validator(rule, value, callback) {
                        if (value) {
                            if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(value)) {
                                callback([new Error('请输入正确的手机号码!')]);
                            }
                            else {
                                callback([]);
                            }
                        }
                        else {
                            callback([new Error('请输入手机号码!')]);
                        }
                    }
                }
            ],
            ruleAddress: [
                {
                    required: true,
                    message: '必选',
                    type: 'string'
                },
                {

                    min: 6,
                    message: '用户名需不少于6个字符'
                },
                                {
                    max: 20,
                    message: '用户名需不超过20个字符'
                }
            ],
            ruleIdCard: [
                {
                    type: 'string',
                    require: true
                },
                {
                    validator: idCardValidate
                }
            ]
        };
    },
    submitForm(formName) {
        let formModel = this.data.get(formName);
        if (formName === 'formModel') {
            this.data.set('formStatus', 'validating');
        }
        this.ref(formName).validate((valid) => {
            this.data.set('formStatus', 'validateEnd');
            if (valid) {
                // 验证成功 do someThing
                console.log(formModel);
            } else {
                // 验证失败 do someThing
                console.log(valid)
            }
        });
    },
    resetForm(formName) {
        this.ref(formName).resetFields();
    }
}
</script>
```

## 参考资料
* [数据验证工具](https://github.com/yiminghe/async-validator)
* [箭头函数](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001438565969057627e5435793645b7acaee3b6869d1374000)

## 设计稿

![图片](http://bos.nj.bpc.baidu.com/v1/agroup/2b9d9e8053a3a54aab3e2e7c6770671217787fc8)

