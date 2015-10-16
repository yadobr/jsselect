$.fn.myselect = function(prop){
    //region VARIABLES
    var newSelect = $('<div class="myselect">'),
        oldSelect = this,
        header = $('<p>'),
        list = $('<ul>'),
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
        header.appendTo(newSelect);
        list.appendTo(newSelect);

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

        // Set select events
        oldSelect.change(onOldSelectChange);
        //oldSelect.focus(onselectFocus);
        //oldSelect.blur(onselectBlur);
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

        if(!newSelect.hasClass('myselect-opened')) {
            newSelect
                .addClass('myselect-opened')
                .addClass('myselect-focused');

            x = newSelect.offset().left;
            y = newSelect.position().top + newSelect.outerHeight() - parseInt(newSelect.css('border-top-width'), 10);

            list.css({'left': x, 'top': y});

            isOnOpen && prop.onopen(e, oldSelect, newSelect, header, list);

            window.addEventListener('click', close, true);
        } else{
            newSelect.removeClass('myselect-opened');
            window.removeEventListener( 'click', close, true );
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
        newSelect.removeClass('myselect-opened');
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
                .removeClass('myselect-opened')
                .removeClass('myselect-focused');

            window.removeEventListener( 'click', close, true );
            isOnClose && prop.onclose(oldSelect, newSelect, header, list);

            e.stopPropagation();
            return false;
        }
    }
    function removeFocus(e){
        newSelect.removeClass('myselect-focused');
        window.removeEventListener( 'click', removeFocus, true );
    }

    function onOldSelectChange(e){
        var elm = oldSelect.find(':selected'), // Selected option in select
            ind = elm.index();                 // Position of selected option in select

        header.html( $(list.children()[ind]).html() );
        isOnChange && prop.onchange(e, elm, ind, oldSelect, newSelect, header, list);
    }
    function onselectFocus(e){
        newSelect.addClass('myselect-focused');
        isOnFocus && prop.onfocus(e);
    }
    function onselectBlur(e){
        newSelect.removeClass('myselect-focused');
        isOnBlur && prop.onblur(e);
    }
}

$.fn.myselect.refresh = function(selector){
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