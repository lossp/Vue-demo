import Vue from 'vue';
import AV from 'leancloud-storage'
var APP_ID = '{{appid}}';
var APP_KEY = '{{appkey}}';

AV.init({
  appId: 'Dcb3bYP5lI1MAg38kp68pJij-9Nh9j0Va',
  appKey: 'CrEeVYrvduiiAJjkHpA4mNSQ'
});

var app = new Vue({
  el: '#app',
  data: {
    newTodo: '',
    todoList: [],
    actionType: 'signUp',
    formData:{
      username:'',
      password:''
    },
    currentUser:null
  },
  created: function(){
    this.currentUser = this.getCurrentUser()
  },
  methods:{
    saveTodos:function(){
      let dataString = JSON.stringify(this.todoList) 
      var AVTodos = AV.Object.extend('AllTodos');
      var avTodos = new AVTodos();
      avTodos.set('content', dataString);
      avTodos.save().then(function (todo) {
        // 成功保存之后，执行其他逻辑.
        console.log('保存成功');
      }, function (error) {
        // 异常处理
        console.error('保存失败');
      })
     },
    addTodo: function(){
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false
      })
      this.newTodo='';
      console.log(123)
      this.saveTodos()
    },
    removeTodo: function(todo){
      let index = this.todoList.indexOf(todo);
      this.todoList.splice(index, 1);
      this.saveTodos();
    },
    signUp: function(){
      console.log(213)
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
      }, (error) => {
        alert('注册失败')
      });
    },
    login:function(){
      AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
      },function(err){
        alert('登陆失败')
      })
    },
    getCurrentUser: function(){
      let current = AV.User.current();
      if(current){
        let{id, createdAt, attributes:{username}} = AV.User.current();
        return{id, createdAt, username};
      }else{
        return null;
      }
    },
    logout: function(){
      AV.User.logOut();
      this.currentUser = null;
      window.location.reload();
    }
  },
})   
