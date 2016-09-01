---
layout: post
title: 《javascript设计模式与开发实践》中的收获
category: 学习
---

## call和apply的用途

`call`和`apply`的区别仅在于传入参数形式不同而已，它们的第一个参数都是指定函数体内的`this`指向。

* 改变`this`指向

        var obj0 = {
                name:'obj0'
            },
            obj1 = {
                name:'obj1'
            },
            name = 'window',
            getName = function(){
                console.log(this.name);
            };

        getName(); //运行环境在window 输出window
        getName.call(obj0); //把getName的this指向obj0 输出：obj0
        getName.call(obj1); //把getName的this指向obj1 输出：obj1

* 实现`Function.prototype.bind`方法

        Function.prototype.bind = function(){
            var self = this, //保存原函数(如：下例的func)
                args = [].slice.call(arguments),//把arguments对象转换成数组
                context = args.shift();
            return function(){ //返回一个新函数
                return self.apply(context,args.concat([].slice.call(arguments)));
                    //执行bind方法时，把传入的第一个参数指定为原函数的上下文，其他参数通过闭包保存在args里面
                    //新函数运行时，会把接收到的参数转化成数组与args合并，并调用原函数改变其this指向且传入合并后的参数
            }
        }

        var obj = {
                name:'obj'
            },
            func = function(a,b,c,d){
                console.log(a,b,c,d)
            }.bind(obj,1,2);

        func(); //输出1 2 undefined undefined
        func(3); //输出1 2 3 undefined
        func(3,4); //输出1 2 3 4

* 借用其他对象的方法

    调用Math对象求最大值的方法

        Math.max.call(null,1,10,2,8); //输出10
        Math.max.apply(null,[1,10,2,8]); //输出10

    诠释了上面说的`call`与`apply`的区别，除了传参形式外没有任何不同

---

## 闭包

闭包主要用于**变量封装**及**延长局部变量的生命周期**

下面的代码是一个自执行函数中返回一个新函数，新函数被赋值到`func`，此时`func`可以访问自执行函数里面的局部变量`sum`。

**由于`GC`(JavaScript的垃圾回收机制)是使用引用计数策略，如果没有引用指向某个对象(引用数为0时)则被`GC`回收，否则该对象将一直存在。**

自执行函数中的`sum`被`func`引用，所以没有被`GC`回收，从而产生了一个闭包的结构

    var func = (function(){
            var sum = 0;
            return function(i){
                sum +=i;
                console.log(sum);
            }
        })();

---

## 高阶函数

* AOP(面向切面编程)

    `AOP`的主要作用是把一些与核心业务无关的功能抽离出来，再通过**动态织入**的方式掺入业务逻辑模块中。

        Function.prototype.before = function(fn){
            var self = this;
            return function(){
                fn.apply(this,arguments);
                return self.apply(this,arguments);
            }
        };

        Function.prototype.after = function(fn){
            var self = this;
            return function(){
                var ref = self.apply(this,arguments);
                fn.apply(this,arguments);
                return ref;
            }
        };

        var func = ()=>{ //某个功能的核心业务
            console.log('核心业务');
        }

        //计算这个功能的运行时间
        func = func.before(()=>{
                this.startTime = new Date().getTime();
                console.log(this.startTime);
            })
            .after(()=>{
                this.endTime = new Date().getTime();
                console.log(this.endTime);
                console.log(this.endTime-this.startTime);
            });

        func();  //输出 开始运行的时间戳 核心业务 结束运行的时间戳 运行了多少毫秒

* Currying(函数柯里化)

    `currying`又称部分求值。一个`currying`函数首先会接收一些参数，接收了这些参数后，不会立即求值，而是用闭包把这些参数缓存起来，并返回一个新的函数。待函数被真正需要求值的时候，之前传入的所有参数都会被一次性用于求值。

    实现思路:

    * 使用`arguments`来判断是否传入参数
    * 有参数传入时，把参数转成数组后`push`到闭包的`args`变量中
    * 没参数传入时则调用被`curry`的函数处理`args`中的参数
    * ES6中可以使用`(...rest)=>{console.log(rest)}`获取传入的参数

            var currying = function(fn){  //把一个函数currying
                    var args = [];        //用来缓存传入的参数
                    return function(){    //返回一个被currying的新函数
                        if(arguments.length>0){
                            [].push.apply(args,arguments); //因为arguments是伪数组对象，所以用apply方法接收参数后再进行push
                            return arguments.callee; //返回当前函数
                        }else{
                            return fn.apply(this,args) //不带参数时，执行被currying的函数进行求值计算
                        }
                    }
                }

            var cost = (function(){ //将被currying的自执行函数
                    var money = 0; //被闭包缓存的变量
                    return function(){ //返回一个新的函数对money进行计算
                        for(var i=0,l=arguments.length;i<l;i++){
                            money +=arguments[i];
                        }
                        return money;
                    }
                })();

            var cost = currying(cost); //将cost柯里化
            cost(1); //接收参数
            cost(1); //接收参数
            cost(1); //接收参数
            console.log(cost()); //不带参数时，进行求值计算 输出 3

* 函数节流

    应用在调用频繁却又不需要那么频繁的执行某个函数时的场景，如(`mousemove`,`window.onresize`等会高频触发的事件)

    实现思路：

    * 使用闭包延长`timer`的生命周期,缓存传入的函数
    * 闭包返回的函数中使用`apply`调用传入的`fn`函数，并把自身传入的参数代入
    * 根据`timer`是否存在`setTimeout`的实例来判断上一次的延迟执行是否未完成
    * 函数执行完毕后清除`timer`

            var throttle = function(fn,interval){
                var self = fn, //保存需要执行的函数
                    timer, //存放定时器
                    firstRun = true; //判断是否第一次执行
                return function(){
                    var args = arguments,
                        me  = this;
                    if(firstRun){ //如果是第一次执行不延迟
                        self.apply(me,args); //return出去的函数调用传入的函数
                        firstRun = false;   
                        return false;
                    }
                    if(!timer){
                        timer = setTimeout(function(){
                            clearInterval(timer); //清除定时器
                            timer = null;
                            self.apply(me,args);
                        },interval||500); //如果interval存在则使用interval，否则用500
                    }
                };
            };
            window.onresize = throttle(()=>{console.log('throttle')},1000);
