$(document).ready(function() {
    // ---------------------------------------------------------------------------------
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
    // End of smooth scrolling

    // ------------------------------------
    // Now let's fetch alumni from GitHub !
    // ------------------------------------
    (function fetchUsersFromGitHub() {
        var alumniContent = "";
        $.getJSON('https://api.github.com/orgs/ecn-info/members', function(datas) {
            for(var i=0;i<datas.length;i++) {
                var githubPage;
                $.getJSON(datas[i].url, function(datasUser) {
                    githubPage = datasUser.url;
                })
                .success(function(datasUser) {githubPage = datasUser.url;});
                console.log(githubPage);
                alumniContent += '<div class="span4">';
                alumniContent += '<img src="'+datas[i].avatar_url+'" width="100" alt="Avatar of '+datas[i].login+'"/>';
                alumniContent += '<h4><a target="_blank" href="'+githubPage+'">'+datas[i].login+'</a></h4>';
                alumniContent += '</div>';
                alumniContent += '</div>';
            }
        })
        .success(function() {$("#alumni .row").html(alumniContent)});
    })()
    // End of GitHub API
});