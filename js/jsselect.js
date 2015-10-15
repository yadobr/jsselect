var jsselectInstanceCount = 0; // Count of jsselect instance

$.fn.jsselect = function(){

    //region Init
    var src,
        inp,
        lbl,
        ul;

    jsselectInstanceCount++;
    src = this;
    inp = $('<input id="jsselect'+jsselectInstanceCount+'" class="jsselect" type="checkbox">');
    lbl = $('<label for="jsselect'+jsselectInstanceCount+'">');

    src
        .after(lbl)
        .after(inp);

    src.css({
        'font-family': lbl.css('font-family'),
        'font-size': lbl.css('font-size')
    });

    inp.css({'left': lbl.position().left, 'top': lbl.position().top});

    lbl.width(src.outerWidth());
    lbl.html(src.find(':selected').html());
    //endregion

    // Open created select
    lbl.click(open);

    function open(e){
        var x,
            y;

        inp.addClass('jsselect-focused');

        ul = $('<ul class="jsselect-ul">');

        src.find('option').each(function(){
            $('<li>')
                .html( $(this).html() )
                .appendTo(ul)
                .click(select)
        });

        x = lbl.offset().left;
        y = lbl.position().top + lbl.outerHeight() - parseInt(lbl.css('border-top-width'), 10);

        ul.css({'left': x, 'top': y});

        ul.width( lbl.css('width') );

        $('body').append(ul);
        ul.show();

        ul.mouseout(function(){
            window.addEventListener('click', close, true);
        });
    }

    function select(e){
        var li  = $(e.target), // Clicked li
            ind = li.index(),  // Clicked li position in ul
            opt = $(src.children()[ind]); // Source select option

        // li text to header
        lbl.html( li.html() );

        // Add selected attribute to option in source select
        opt.prop('selected', true);

        // Broadcast source event
        src.change();

        // Remove ul
        ul.remove();

        // Set focus to label
        lbl.focus();
    }

    function close(e){
        var child = false;

        ul.find('*').each(function(){
            if(this == e.target){
                child = true;
                return false;
            }
        });

        if( !child ){

            // Remove class
            inp.removeClass('jsselect-focused');

            // Remove ul
            ul.remove();

            window.removeEventListener( 'click', close, true );

            e.stopPropagation();
            return false;
        }
    }
}