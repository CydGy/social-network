(function () {

  var like_button = document.getElementById('js-like-btn')
    , dislike_button = document.getElementById('js-dislike-btn');

  var likes_count = document.getElementById('js-likes-count')
    , dislikes_count = document.getElementById('js-dislikes-count');

  var sparkbar_likes = document.getElementById('photo-sparkbar-likes')
    , sparkbar_dislikes = document.getElementById('photo-sparkbar-dislikes');


  like_button.onclick = function () {

    var photoId = this.getAttribute('photoId');

    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {

        var clikes = parseInt(likes_count.innerHTML, 10);
        var cdislikes = parseInt(dislikes_count.innerHTML, 10);

        likes_count.innerHTML = ++clikes;
        if (dislike_button.classList.contains('active'))
          dislikes_count.innerHTML = --cdislikes;
          
        dislike_button.classList.remove('active');
        like_button.classList.add('active');

        var cjudgments = clikes + cdislikes;
        sparkbar_likes.style.width = (clikes / cjudgments) * 100 + '%';
        sparkbar_dislikes.style.width = (cdislikes / cjudgments) * 100 + '%';
      }
    };

    httpRequest.open('POST', '/like');
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send('photoId=' + photoId);

  };

  dislike_button.onclick = function () {

    var photoId = this.getAttribute('photoId');

    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {

        var clikes = parseInt(likes_count.innerHTML, 10);
        var cdislikes = parseInt(dislikes_count.innerHTML, 10);

        dislikes_count.innerHTML = ++cdislikes;
        if (like_button.classList.contains('active'))
          likes_count.innerHTML = --clikes;

        like_button.classList.remove('active');
        dislike_button.classList.add('active');

        var cjudgments = clikes + cdislikes;
        sparkbar_likes.style.width = (clikes / cjudgments) * 100 + '%';
        sparkbar_dislikes.style.width = (cdislikes / cjudgments) * 100 + '%';

      }
    };

    httpRequest.open('POST', '/dislike');
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send('photoId=' + photoId);

  };

})();
