jsselect
========

jsselect.js is a JQuery plugin for creating styleable select elements. Features:

	0. Auto width
	0. Themes
	0. Tabindex and :focus support
	0. Disabled attr support
	0. Cut off long text if width set manualy. And tooltip with full text
	0. Select manualy refresh: $.fn.jsselect.refresh('#sel')
	0. In future: json data source, multiselect, arrow keys navigation etc.

Usage
-------
In html file in <head>:
```html
    <link href="css/jsselect.css" rel="styleSheet">
    <link href="css/jsselect.theme.default.css" rel="styleSheet">
```
In html file before <body> end:
```html
    <script src="js/jquery.min.js"></script>
    <script src="js/jsselect.js"></script>
    <script>
      $('#sel').jsselect({
         debug: false,
         oncreate: function(){ console.log('Create') },
         onfocus: function(){ console.log('Focus') },
         onopen: function(){ console.log('Open') },
         onchange: function(){ console.log('Change') },
         onblur: function(){ console.log('Blur') },
         onclose: function(){ console.log('Close') }
      });
    </script>
```

Example
-------
```html
<!DOCTYPE html>
<html>
  <head>
    <title>jsselect</title>
    <meta charset="utf-8">
    <link href="css/jsselect.css" rel="styleSheet">
    <link href="css/jsselect.theme.default.css" rel="styleSheet">
  </head>
  <body>
    <select id="sel">
      <option>One</option>
      <option selected>Two</option>
      <option>Three</option>
    </select>
    <script src="js/jquery.min.js"></script>
    <script src="js/jsselect.js"></script>
    <script>
      $('#sel').jsselect({
         debug: false,
		 tabindex: 0,
         oncreate: function(){ console.log('Create') },
         onfocus: function(){ console.log('Focus') },
         onopen: function(){ console.log('Open') },
         onchange: function(){ console.log('Change') },
         onblur: function(){ console.log('Blur') },
         onclose: function(){ console.log('Close') }
      });
    </script>
  </body>
</html>
```
	
Options
-------	
* `debug` values: `true|false` -- If `true` display source select element
* `width` values: `pixels|percentage` -- Set jsselect width. If the property is not set then width = auto by default
* `tabindex` values: `number` -- Set tabindex attribute

Events
------
* `oncreate(oldSelect, newSelect, header, list)`
* `onfocus(e)`
* `onopen(e, oldSelect, newSelect, header, list)`
* `onchange(e, elm, ind, oldSelect, newSelect, header, list)` -- `elm` - It's a selected option in old select. And `ind` - index of elm
* `onblur(e)`
* `onclose(oldSelect, newSelect, header, list)`

Methods
-------
* `$.fn.jsselect.refresh(selectorOfOldSelect)` - Refresh header and list in newSelect. May be used after:
```javascript
$($('#sel').children()[0]).prop('selected', true)
```
And etc.
* `$.fn.jsselect.enable(selector)` - Enable newSelect and oldSelect
* `$.fn.jsselect.disable(selector)` - Disable newSelect and oldSelect