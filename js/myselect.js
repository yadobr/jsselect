$.fn.myselect = function(prop){
    var self = $('<div class="myselect">'),
        source,
        header,
        list,
        isOnRemove = false,
        isOnChange = false;

    if(this.length != 0){
        source = this;
        header = $('<p>').appendTo(self);
        list = $('<ul>').appendTo(self);

        // BUILD A LIST
        // Append container
        source.after(self);

        // Find selected by default option in source and add to .myselect
        header
            .html( findSelected().html() )
            .attr('title', findSelected().html());

        // Find usual options
        findUsual().each(appendUsual);

        // SET PROPERTIES
        // If overwritten
        if(typeof prop == 'object'){

            // Debug
            prop.debug == true ? source.show() : source.hide();

            // Width
            prop.width ? self.css('width', prop.width) : self.css('width', list.width());

            // Oncreate
            typeof prop.oncreate == 'function' && prop.oncreate(source, self, header, list);

            // onchange
            typeof prop.onchange == 'function' && (isOnChange = true);

            // Onremove
            typeof prop.onremove == 'function' && (isOnRemove = true);
        }

        // By dedault
        else{

            // Debug
            source.hide();

            // Width
            self.css('width', list.width())
        }

        // SET EVENTS
        // Set .myselect events
        header.click(headerClick);
        list.click(listClick);

        // Set source select events
        source.change(onSourceChange);
        source.focus(onSourceFocus);
        source.blur(onSourceBlur);
    }

    // Build a list functions implementation
    function findSelected(){
        return source.find('> option:selected');
    }
    function findUsual(){
        return source.find('option');
    }
    function appendUsual(i, elem){
        $('<li>').html( $(elem).html()).appendTo( list );
    }

    // Set events functions implementation
    function headerClick(e){
        var x,
            y;

        if(!self.hasClass('myselect-opened')) {
            self.addClass('myselect-opened');
            x = self.offset().left;
            y = self.position().top + self.outerHeight() - parseInt(self.css('border-top-width'), 10);

            list.css({'left': x, 'top': y});

            window.addEventListener('click', hideList, true);
        } else{
            self.removeClass('myselect-opened');
            window.removeEventListener( 'click', hideList, true );
        }
    }
    function hideList(e){
        var child = false;

        list.find('*').each(function(){
            if(this == e.target){
                child = true;
                return false;
            }
        });

        if( !child ){
            self.removeClass('myselect-opened');
            window.removeEventListener( 'click', hideList, true );
            isOnRemove && prop.onremove(source, self, header, list);

            e.stopPropagation();
            return false;
        }
    }
    function listClick(e){
        var elm = $(e.target), // Clicked li
            ind = elm.index(), // Clicked li position in ul
            opt = $(source.children()[ind]); // Source select option

        // li text to header
        header.html( elm.html() );

        // Add selected attribute to option in source select
        opt.prop('selected', true);

        isOnChange && prop.onchange(e, elm, ind, opt, source, self, header, list);
        source.change();

        // Hide list
        self.removeClass('myselect-opened');
        window.removeEventListener( 'click', hideList, true );
    }
    function onSourceChange(e){
        var elm = source.find(':selected'), // Selected option in source select
            ind = elm.index();              // Position of selected option in source select

        header.html( $(list.children()[ind]).html() );
    }
    function onSourceFocus(e){
        self.addClass('myselect-focused');
    }
    function onSourceBlur(e){
        self.removeClass('myselect-focused');
    }
}