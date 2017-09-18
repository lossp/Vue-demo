import Vue from 'vue';
import AV from 'leancloud-storage'
let APP_ID = '{{appid}}';
let APP_KEY = '{{appkey}}';

AV.init({
  appId: 'Dcb3bYP5lI1MAg38kp68pJij-9Nh9j0Va',
  appKey: 'CrEeVYrvduiiAJjkHpA4mNSQ'
});

var app = new Vue({
    el:'#app',
    data:{
        actionType:'signUp',
        newTodo:'',
        todoList:[],
        currentUser:null,
        formData:{
            username:'',
            password:''
        }
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
        },
        signUp:function(){
            let user = new AV.User();
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then((loginedUser)=>{
                this.currentUser = this.getCurrentUser()
            },(error)=>{
                alert('Signing Up failed')
            })
        },
        signIn:function(){
            AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser)=>{
                this.currentUser = this.getCurrentUser()
            },(error)=>{
                alert('Signing Up failed')
            })
        },
        getCurrentUser:function(){
            let{id, createdAt, attributes:{username}} = AV.User.current();
            return {id, username, createdAt}
        },
        signOut: function(){
            AV.User.logOut();
            // 现在的 currentUser 是 null 了
            this.currentUser = null;
            window.location.reload();
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
