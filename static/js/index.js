document.addEventListener('DOMContentLoaded', function() {
    (function() {
        var navBtnEvent = function() {
            var navBtn = document.getElementById('navBtn'),
                nav = document.getElementById('bs-example-navbar-collapse-1');
            navBtn.addEventListener('click', function() {
                if (nav.className.indexOf(' in') > -1) {
                    nav.className = nav.className.substring(0, nav.className.indexOf(' in'));
                    nav.style.height = '1px';
                } else {
                    nav.className += ' in';
                    nav.style.height = nav.children[0].offsetHeight + 16 + 'px';
                }
            });
        }
        hljs.initHighlightingOnLoad();
        var initFooter = function() {
                var topHeight = 132 + document.getElementById('main').offsetHeight,
                    winHeight = window.innerHeight,
                    poor = winHeight - topHeight,
                    footer = document.getElementsByTagName('footer')[0];
                if (poor > 20) {
                    footer.style.marginTop = poor + 10 + 'px';
                } else {
                    footer.style.marginTop = 80 + 'px';
                }
            }
            /**
             * 分类展示
             * 点击右侧的分类展示时
             * 左侧的相关裂变展开或者收起
             * @return {[type]} [description]
             */
        var categoryDisplay = function() {
            var postListBody = document.getElementsByClassName('post-list-body')[0];
            if (!postListBody) {
                return;
            }
            var getPostCate = function(attr, type, trueCallback, falseCallback) {
                var postCates = postListBody.children;
                for (var i = 0, l = postCates.length; i < l; i++) {
                    if (postCates[i].getAttribute(attr) == type) {
                        trueCallback(postCates[i], postCates[i].parentElement);
                    } else {
                        falseCallback(postCates[i], postCates[i].parentElement);
                    }
                }
                return postCates;
            };
            getPostCate('post-cate', 'All', function(element, box) {
                box.style.height = element.offsetHeight + 'px';
            }, function(element) {
                element.style.display = 'none';
            });
            document.getElementsByClassName('shadow-corner-curl')[0].addEventListener('click', function(e) {
                if (e.target.className === 'categories-list-item') {
                    var cate = e.target.getAttribute('cate');
                    var elementList = getPostCate('post-cate', cate, function(element, box) {
                        element.style.display = 'block';
                    }, function(element, box) {
                        element.style.display = 'none';
                    });
                    for (var i = 0, l = elementList.length; i < l; i++) {
                        if (elementList[i].style.display === 'block') {
                            document.getElementById('main').style.height = 187 + elementList[i].offsetHeight + 'px';
                            elementList[i].parentElement.style.height = elementList[i].offsetHeight + 'px';
                            break;
                        }
                    }
                    initFooter();
                }
            });
        }

        /**
         * 回到顶部
         */
        var backToTop = function() {
            //滚页面才显示返回顶部
            var topBtn = document.getElementById('top'),
                body = document.getElementsByTagName('body')[0];
            window.onscroll = (function(fn, interval) {
                var _self = fn,
                    timer,
                    isFirst = true;
                return function() {
                    var args = arguments,
                        _me = this;
                    if (isFirst) {
                        _self.apply(_me, args);
                        return isFirst = false;
                    }
                    if (timer) {
                        return false;
                    }
                    timer = setTimeout(function() {
                        clearTimeout(timer);
                        timer = null;
                        _self.apply(_me, args);
                    }, interval || 2000);
                }
            })(function() {
                var scrollTop = body.scrollTop;
                if (scrollTop > 100) {
                    topBtn.style.display = 'block';
                } else {
                    topBtn.style.display = 'none';
                }
            }, 1000);
            var flag = true;
            topBtn.addEventListener('click', function() {
                if (flag) {
                    flag = false;
                    var scrollTop = body.scrollTop,
                        linear = (scrollTop / 30),
                        timer = setInterval(function() {
                            body.scrollTop -= linear;
                            if (body.scrollTop == 0) {
                                clearInterval(timer);
                                flag = true;
                            }
                        }, 15);
                }
            });
        }
        categoryDisplay();
        backToTop();
        initFooter();
        navBtnEvent();
    })();
    document.removeEventListener('DOMContentLoaded', arguments.callee, false);
}, false);
