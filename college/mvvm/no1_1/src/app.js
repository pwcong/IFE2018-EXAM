import san from 'san';

// 定义san组件
const MyApp = san.defineComponent({
  template: `
    <div>
      <input type="text" value="{=name=}" />
      <p>Hello {{name}}</p>
    </div>
  `
});

// 实例化san对象并初始化数据
let myApp = new MyApp({
  data: {
    name: 'World'
  }
});

// 绑定DOM节点
myApp.attach(document.getElementById('app'));
