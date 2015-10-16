$.fn.jsselect = function(prop){
    //region VARIABLES
    var newSelect = $('<div class="jsselect">'),
        oldSelect = this,
        header = $('<p>'),
        list = $('<ul>'),
        cb = $('<input type="checkbox">'),
        isOnCreate = false,
        isOnFocus  = false,
        isOnOpen   = false,
        isOnChange = false,
        isOnBlur   = false,
        isOnClose  = false;
    //endregion

    if(oldSelect.length != 0){

        //region CREATE NEW SELECT
        // Append container
        newSelect.insertAfter(oldSelect);

        // Append elements
        cb.appendTo(newSelect);
        header.appendTo(newSelect);
        list.appendTo(newSelect);

        // If oldSelect was disabled
        oldSelect.prop('disabled') && newSelect.addClass('jsselect-disabled')

        // Find selected by default option in oldSelect and add to newSelect
        setHeader();

        // Find other <option> and add to list
        setList();
        //endregion

        //region SET PROPERTIES
        // If overwritten
        if(typeof prop == 'object'){

            // Debug
            prop.debug == true ? oldSelect.show() : oldSelect.hide();

            // Width
            prop.width ? (newSelect.css('width', prop.width) && list.css('width', prop.width) ) : newSelect.css('width', list.width());

            // Debug
            typeof prop.tabIndex == 'number' && cb.attr('tabindex', prop.tabIndex);

            // oncreate
            typeof prop.oncreate == 'function' && (isOnCreate = true);

            // onfocus
            typeof prop.onfocus == 'function' && (isOnFocus = true);

            // onopen
            typeof prop.onopen == 'function' && (isOnOpen = true);

            // onchange
            typeof prop.onchange == 'function' && (isOnChange = true);

            // onblur
            typeof prop.onblur == 'function' && (isOnBlur = true);

            // Onremove
            typeof prop.onclose == 'function' && (isOnClose = true);
        }

        // By dedault
        else{

            // Debug
            oldSelect.hide();

            // Width
            newSelect.css('width', list.width())
        }
        //endregion

        //region PRIVATE EVENTS
        // Set newSelect events
        header.click(open);
        list.click(change);

        // Set checkbox events
        cb.focus(cbFocus);
        cb.change(cbChange);
        cb.blur(cbBlur);

        // Set oldSelect events
        oldSelect.change(onOldSelectChange);
        //endregion

        isOnCreate && prop.oncreate(oldSelect, newSelect, header, list);
    }

    function setHeader(){
        var html = oldSelect.find('> option:selected').html()
        header
            .html( html )
            .attr('title', html);
    }
    function setList(){
        oldSelect.find('option').each(function(){
            $('<li>')
                .html( $(this).html())
                .attr('title', $(this).html())
                .appendTo( list );
        });
    }

    function open(e){
        var x,
            y;

        if(!newSelect.hasClass('jsselect-disabled')) {
            if (!newSelect.hasClass('jsselect-opened')) {
                newSelect
                    .addClass('jsselect-opened')
                    .addClass('jsselect-focused');

                x = newSelect.offset().left;
                y = newSelect.position().top + newSelect.outerHeight() - parseInt(newSelect.css('border-top-width'), 10);

                list.css({'left': x, 'top': y});

                isOnOpen && prop.onopen(e, oldSelect, newSelect, header, list);

                window.addEventListener('click', close, true);
            } else {
                newSelect.removeClass('jsselect-opened');
                window.removeEventListener('click', close, true);
            }
        }
    }
    function change(e){
        var elm = $(e.target), // Clicked li
            ind = elm.index(), // Clicked li position in ul
            opt = $(oldSelect.children()[ind]); // select option

        // li text to header
        header.html( elm.html() );

        // Add selected attribute to option in select
        opt.prop('selected', true);

        oldSelect.change();
        isOnClose && prop.onclose(oldSelect, newSelect, header, list);

        // Hide list
        newSelect.removeClass('jsselect-opened');
        window.removeEventListener( 'click', close, true );
        window.addEventListener( 'click', removeFocus, true );
    }
    function close(e){
        var child = false;

        list.find('*').each(function(){
            if(this == e.target){
                child = true;
                return false;
            }
        });

        if( !child ){
            newSelect
                .removeClass('jsselect-opened')
                .removeClass('jsselect-focused');

            window.removeEventListener( 'click', close, true );
            isOnClose && prop.onclose(oldSelect, newSelect, header, list);

            e.stopPropagation();
            return false;
        }
    }
    function removeFocus(e){
        newSelect.removeClass('jsselect-focused');
        window.removeEventListener( 'click', removeFocus, true );
    }

    function cbFocus(e){
        newSelect.addClass('jsselect-focused');
        isOnFocus && prop.onfocus(e);
    }
    function cbChange(e){
        if(this.checked)
            open();
    }
    function cbBlur(e){
        newSelect.removeClass('jsselect-focused');
        cb.prop('checked', false);
        isOnBlur && prop.onblur(e);
    }

    function onOldSelectChange(e){
        var elm = oldSelect.find(':selected'), // Selected option in select
            ind = elm.index();                 // Position of selected option in select

        header.html( $(list.children()[ind]).html() );
        isOnChange && prop.onchange(e, elm, ind, oldSelect, newSelect, header, list);
    }
}

$.fn.jsselect.refresh = function(selector){
    var oldSelect = $(selector),
        newSelect = oldSelect.next(),
        header,
        list;

    if(oldSelect.length != 0 && newSelect.length != 0){
        var html;

        // Refresh header
        header = newSelect.find('> p');
        html = oldSelect.find('> option:selected').html()
        header
            .html( html )
            .attr('title', html);

        // Refresh list
        list = newSelect.find('> ul');
        list.html('');
        oldSelect.find('option').each(function(){
            $('<li>')
                .html( $(this).html())
                .attr('title', $(this).html())
                .appendTo( list );
        });
    }
}
$.fn.jsselect.enable = function(selector){
    var oldSelect = $(selector);
        newSelect = oldSelect.next();
    oldSelect.prop('disabled', false);
    newSelect.removeClass('jsselect-disabled');
}
$.fn.jsselect.disable = function(selector){
    var oldSelect = $(selector);
    newSelect = oldSelect.next();
    oldSelect.prop('disabled', true);
    newSelect.addClass('jsselect-disabled');
}