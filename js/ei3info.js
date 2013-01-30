$(document).ready(function() {

   /*// ---------------------------------------------------------------------------------
    // Smooth scrolling based on http://css-tricks.com/snippets/jquery/smooth-scrolling/
    // ---------------------------------------------------------------------------------
    function filterPath(string) {
    return string
        .replace(/^\//,'')
        .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
        .replace(/\/$/,'');
    }
    var locationPath = filterPath(location.pathname);
    var scrollElem = scrollableElement('html', 'body');
    $('a[href*=#]').each(function() {
        if (this.hash == "") {
            $(this).click(function(event) {
                event.preventDefault();
                $(scrollElem).animate({
                    scrollTop: 0
                }, 400, function() {
                    location.hash = "#";
                });
            });
        } else {
            var thisPath = filterPath(this.pathname) || locationPath;
            if (locationPath == thisPath && (location.hostname == this.hostname || !this.hostname) && this.hash.replace(/#/, '')) {
                var $target = $(this.hash),
                    target = this.hash;
                if (target) {
                    var targetOffset = $target.offset().top;
                    $(this).click(function(event) {
                        event.preventDefault();
                        $(scrollElem).animate({
                            scrollTop: targetOffset
                        }, 400, function() {
                            location.hash = target;
                        });
                    });
                }
            }
        }
    });
    // use the first element that is "scrollable"
    function scrollableElement(els) {
        for (var i = 0, argLength = arguments.length; i <argLength; i++) {
            var el = arguments[i],
                    $scrollElement = $(el);
            if ($scrollElement.scrollTop()> 0) {
                return el;
            } else {
                $scrollElement.scrollTop(1);
                var isScrollable = $scrollElement.scrollTop()> 0;
                $scrollElement.scrollTop(0);
                if (isScrollable) {
                    return el;
                }
            }
        }
        return [];
    }
    // End of smooth scrolling*/


    // ------------------------------------
    // Now let's fetch alumni from GitHub !
    // ------------------------------------
    (function fetchUsersFromGitHub() {
        var alumniContent = "";
        var usersUrl = [];
        //if (localStorage && localStorage["lastRequest"])
        $.getJSON('https://api.github.com/orgs/ecn-info/members', function(datas) {
            for(var i=0;i<datas.length;i++) {
                alumniContent += '<div class="span4 center">';
                alumniContent += '<a target="_blank" href="https://github.com/'+datas[i].login+'">';
                alumniContent += '<img src="'+datas[i].avatar_url+'" class="img-circle" width="100" alt="Avatar of '+datas[i].login+'"/>';
                alumniContent += '<h3>'+datas[i].login+'</h3></a>';
                alumniContent += '<div class="content '+datas[i].login+'"></div>';
                alumniContent += '</div>';
                if(i%3==2) { alumniContent += '<div class="span12"><hr /></div>';}
                usersUrl.push(datas[i].url);
            }
        })
        .success(function() {
            $("#alumni .row").html(alumniContent);
            for(var i=0;i<usersUrl.length;i++) {
                $.getJSON(usersUrl[i])
                    .success(function(datas) {
                        var alumniDetails = '<ul class="unstyled">';
                        if ("name" in datas) { alumniDetails += '<li>'+datas.name+'</li>'; }
                        if ("blog" in datas) { alumniDetails += '<li><a target="_blank" href="'+datas.blog+'">Website</a></li>'; }
                        if (("company" in datas)&&(datas.company != null)) { alumniDetails += '<li>Works at '+datas.company+'</li>'; }
                        if (("hireable" in datas)&&(datas.hireable)) { alumniDetails += '<li>Is <span class="badge badge-success">hireable!</span></li>'; }
                        if (("location" in datas)&&(datas.location != null)) { alumniDetails += '<li>From '+datas.location+'</li>'; }
                        if ("public_repos" in datas) { alumniDetails += '<li>'+datas.public_repos+' repos</li>'; }
                        if ("followers" in datas) { alumniDetails += '<li>'+datas.followers+' followers</li>'; }
                        alumniDetails += '</ul>';
                        $("#alumni .row .span4 ."+datas.login+"").append(alumniDetails);
                    });
            }
        })
        .error(function() {
            $("#alumni .row").html('<div class="span12 alert alert-error">Error while fetching users from GitHub! Beware of the API rate limit...</div>');
        });
    })();
    // End of GitHub API
});