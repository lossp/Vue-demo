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
        updateTodos:function(){
            let dataString = JSON.stringify(this.todoList)
            console.log(dataString)
            let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id);
            // 修改属性
            avTodos.set('content', dataString);
            // 保存到云端
            avTodos.save().then(()=>{
                console.log('Updated')
            });
        },
        addTodo:function(){
            this.todoList.push({
                title: this.newTodo,
                createdAt: new Date(),
                done: false
            })
            console.log(this.todoList);
            this.newTodo = '';
            this.saveOrUpdateTodos();
        },
        deleteTodo:function(todo){
            let index = this.todoList.indexOf(todo);
            this.todoList.splice(index,1);
            this.saveOrUpdateTodos();
            console.log('delete')
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
                console.log(this.currentUser)
                this.fetchTodos()
            },(error)=>{
                alert('Signing Up failed')
            })
        },
        getCurrentUser:function(){
            let currentUser = AV.User.current()
            if(currentUser){
                let {id,createdAt,attributes:{username}} = currentUser
                return {id,username,createdAt}
            }else{
                return null
            }
        },
        signOut: function(){
            AV.User.logOut();
            // 现在的 currentUser 是 null 了
            this.currentUser = null;
            window.location.reload();
        },
        saveTodos:function(){
            let dataString = JSON.stringify(this.todoList);
            // 声明一个 Todo 类型
            var AVTodos = AV.Object.extend('AllTodos');
            // 新建一个 Todo 对象
            var avTodos = new AVTodos();
            var acl = new AV.ACL();
            acl.setReadAccess(AV.User.current(),true);
            acl.setWriteAccess(AV.User.current(),true);
            avTodos.set('content', dataString);
            avTodos.setACL(acl);//important!!!
            avTodos.save().then((todo)=>{
                this.todoList.id = todo.id;
                alert('Saved')
                console.log(this.todoList.id)
            }, function(error){
                alert('Failed')
            });
        },
        saveOrUpdateTodos: function(){
            if(this.todoList.id){
                console.log(this.todoList.id)
                this.updateTodos()
            }else{
                this.saveTodos()
            }
        },
        fetchTodos:function(){
            if(this.currentUser){
				// 查询某个 AV.Object 实例，之后进行修改
				var query = new AV.Query('AllTodos');
				// find 方法是一个异步方法，会返回一个 Promise，之后可以使用 then 方法
				query.find()
				.then((todo)=>{
                    let allTodos = todo[0];
                    let id = allTodos.id;
                    this.todoList = JSON.parse(allTodos.attributes.content);
                    this.todoList.id = id
                },function(error){
                    console.log(error)
                })
            }
  
        }
    },
    created:function(){
        this.currentUser = this.getCurrentUser();
        console.log(this.currentUser)
        this.fetchTodos();
    }
})
