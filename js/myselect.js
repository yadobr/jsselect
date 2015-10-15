$.fn.myselect = function(prop){
    var self = this,
        source,
        header,
        list,
        isOnRemove = false,
        isOnSelect = false;

    if(this.length != 0){
        source = $(this.attr('data-source'));

        if(source.length != 0){
            header = $('<p>').appendTo(this);
            list = $('<ul>').appendTo(this);

            // BUILD A LIST
            // Find selected by default option in source and add to .myselect
            header.html( findSelected().html() );

            // Find usual options
            findUsual().each(appendUsual);

            // SET PROPERTIES
            // If overwritten
            if(typeof prop == 'object'){

                // Debug
                prop.debug == true ? source.show() : source.hide();

                // Width
                prop.width ? this.css('width', prop.width) : this.css('width', list.width());

                // Oncreate
                typeof prop.oncreate == 'function' && prop.oncreate(source, self, header, list);

                // Onselect
                typeof prop.onselect == 'function' && (isOnSelect = true);

                // Onremove
                typeof prop.onremove == 'function' && (isOnRemove = true);
            }

            // By dedault
            else{

                // Debug
                source.hide();

                // Width
                this.css('width', list.width())
            }

            // SET EVENTS
            header.click(headerClick);
            list.click(listClick);
        }
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

    // Set properties functions implementation

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

        isOnSelect && prop.onselect(e, elm, ind, opt, source, self, header, list);

        // Hide list
        self.removeClass('myselect-opened');
        window.removeEventListener( 'click', hideList, true );
    }
}