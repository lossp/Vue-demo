import Vue from 'vue';
import AV from 'leancloud-storage'
var APP_ID = '{{appid}}';
var APP_KEY = '{{appkey}}';

AV.init({
  appId: 'Dcb3bYP5lI1MAg38kp68pJij-9Nh9j0Va',
  appKey: 'CrEeVYrvduiiAJjkHpA4mNSQ'
});

var app = new Vue({
    el:'#app',
    data:{
        newTodo:'',
        todoList:[]
    },
    methods:{
        addTodo:function(){
            this.todoList.push({
                title: this.newTodo,
                createdAt: new Date(),
                done: false
            })
            console.log(this.todoList);
            this.newTodo = '';
        },
        deleteTodo:function(todo){
            let index = this.todoList.indexOf(todo);
            this.todoList.splice(index,1);
        }
    },
    created:function(){
        window.onbeforeunload=()=>{
            let dataString = JSON.stringify(this.todoList);
            window.localStorage.setItem('myTodos', dataString)
        }
        let oldDataString = window.localStorage.getItem('myTodos')
        let oldData = JSON.parse(oldDataString)
        this.todoList = oldData || []
    }
})
