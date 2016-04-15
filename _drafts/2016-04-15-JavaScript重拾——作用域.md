---
layout: post
title: JavaScript梳理
category: 学习
---
### 作用域

* **全局作用域**

        var globalX = "全局作用域";
        //全局作用域会被挂载到window对象上面
        console.log(window.globalX); //全局作用域

* **函数级作用域**

        function fc(){
            var fcX = "函数级作用域";
            console.log(fcX); //函数级作用域
        }
