$(document).ready(function() {
    $('a[href="#typeform-section"]').on('click', function(e) {
        e.preventDefault(); // Prevent default anchor click behavior
        $('html, body').animate({
            scrollTop: $('#typeform-section').offset().top
        }, 500); // Adjust the duration as needed
    });

    $('.nav-link').each(function() {
        if (this.href === window.location.href) {
            $('.nav-link').removeClass('active-link');
            $(this).addClass('active-link');
            $(this).css('pointer-events', 'none');
        }
    });
    $(window).scroll(function() {
        var statsTop = $('.stats').offset().top - window.innerHeight;
        if ($(window).scrollTop() > statsTop) {
            startCount();
        }
    });
    function startCount() {
        $('.counter').each(function() {
            $(this).prop('Counter', 0).animate({
                Counter: $(this).data('target')
            }, {
                duration: 3000,
                easing: 'swing',
                step: function(now) {
                    if ($(this).data('target') % 1 === 0) {
                        $(this).text(Math.floor(now));
                    } else {
                        $(this).text(now.toFixed(1));
                    }
                }
            });
        });
    }

    const current_year = new Date().getFullYear();
    console.log({current_year});
    $('#current_year').html(current_year)
});