(function() {
    //链接地址转码
    var strEscape = function(str) {
        str = str.split('');
        var code = '';
        for (var i = 0, l = str.length; i < l; i++) {
            code += str[i].charCodeAt();
        }
        return code;
    }
    var ref = new Wilddog('https://dengrc-blog.wilddogio.com'),
        articleRef = ref.child('articles').child(strEscape(window.location.pathname));
    //评论Li组装
    var GetComment = function(data) {};
    GetComment.prototype = {
        getLi: function(data) {
            var li = document.createElement('li');
            li.appendChild(this.getAvatar());
            li.appendChild(this.getContent(data));
            return li;
        },
        getAvatar: function() {
            var div = document.createElement('div'),
                span = document.createElement('span'),
                svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            div.className = 'avatar hidden-xs';
            span.className = 'icon';
            svg.setAttribute('viewBox', '0 0 16 16');
            path.setAttribute('fill', '#aaa');
            path.setAttribute('d', 'M7.999,0.431c-4.285,0-7.76,3.474-7.76,7.761 c0,3.428,2.223,6.337,5.307,7.363c0.388,0.071,0.53-0.168,0.53-0.374c0-0.184-0.007-0.672-0.01-1.32 c-2.159,0.469-2.614-1.04-2.614-1.04c-0.353-0.896-0.862-1.135-0.862-1.135c-0.705-0.481,0.053-0.472,0.053-0.472 c0.779,0.055,1.189,0.8,1.189,0.8c0.692,1.186,1.816,0.843,2.258,0.645c0.071-0.502,0.271-0.843,0.493-1.037 C4.86,11.425,3.049,10.76,3.049,7.786c0-0.847,0.302-1.54,0.799-2.082C3.768,5.507,3.501,4.718,3.924,3.65 c0,0,0.652-0.209,2.134,0.796C6.677,4.273,7.34,4.187,8,4.184c0.659,0.003,1.323,0.089,1.943,0.261 c1.482-1.004,2.132-0.796,2.132-0.796c0.423,1.068,0.157,1.857,0.077,2.054c0.497,0.542,0.798,1.235,0.798,2.082 c0,2.981-1.814,3.637-3.543,3.829c0.279,0.24,0.527,0.713,0.527,1.437c0,1.037-0.01,1.874-0.01,2.129 c0,0.208,0.14,0.449,0.534,0.373c3.081-1.028,5.302-3.935,5.302-7.362C15.76,3.906,12.285,0.431,7.999,0.431z');
            svg.appendChild(path);
            span.appendChild(svg);
            div.appendChild(span);
            return div;
        },
        getContent: function(data) {
            var div = document.createElement('div'),
                author = document.createElement('p'),
                text = document.createElement('p'),
                time = document.createElement('p');
            div.className = 'comments';
            author.className = 'comment-author';
            author.innerHTML = '匿名用户';
            text.className = 'comment-text';
            text.innerHTML = data.text;
            time.className = 'comment-time';
            time.innerHTML = data.time;
            div.appendChild(author);
            div.appendChild(text);
            div.appendChild(time);
            return div;
        }
    };
    var getComment = new GetComment();
    var isData = false;
    articleRef.once('value', function(result) {
        var data = isData = result.val();
        var comment = document.getElementById('comment')
        var ul = document.createElement('ul');
        ul.className = 'list';
        ul.id = 'commentList';
        if (data) {
            comment.style.display = "block";
            for (i in data) {
                ul.insertBefore(getComment.getLi(data[i]), ul.firstChild);
            }
        }
        comment.appendChild(ul);
    });

    var pushBtn = document.getElementById('commentPush');
    var isFirst = true;

    pushBtn.addEventListener('click', function(e) {
        if (isFirst) {
            isFirst = false;
            articleRef.limitToLast(1).on('child_added', function(result) {
                var data = result.val();
                if (data) {
                    document.getElementById('comment').style.display = "block";
                    var ul = document.getElementById('commentList');
                    ul.insertBefore(getComment.getLi(data), ul.firstChild);
                }
            });
        }
        var timeFc = function(num) {
            var str = "";
            if (num < 10) {
                str += "0" + num;
            } else {
                str += num;
            }
            return str;
        }
        var time = new Date(),
            M = timeFc(time.getMonth() + 1),
            d = timeFc(time.getDate()),
            h = timeFc(time.getHours()),
            m = timeFc(time.getMinutes()),
            timeStr = time.getFullYear() + '-' + M + '-' + d + ' ' + h + ':' + m;
        var data = {
            text: document.getElementById('commentText').value,
            time: timeStr
        }
        document.getElementById('commentText').value = '';
        articleRef.push(data);
    });
})();
