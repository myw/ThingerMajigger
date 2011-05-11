$(function () {// Package scope
    // Crockford-style object creation for older JS versions
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }
    

    var things_data$,
        todos = [],
        filters,
        lists$ = {},
        foci = {},
        DEBUG = true;

    // Debug utilities
    dbg = (function () {
        function _mk_dbg(mode) {
            return (function (msg) { if (DEBUG) { console[mode](msg); } });
        }

        var the_dbg = {},
            dbg_types = ['log', 'warn', 'error'],
            ix, dt;

        for (ix = 0; ix < dbg_types.length; ix++) {
            dt = dbg_types[ix];
            the_dbg[dt] = _mk_dbg(dt);
        }

        return the_dbg;
    })();

    /* Generic Thing Class: extends jQuery object */
    function Thing(jQnode) { 
        var the_thing = Object.create($(jQnode));


        // Return a specific attribute value from a todo object
        the_thing.db_attr = function (attr_name) {
            var attr;

            attr = this.find('attribute[name="'+attr_name+'"]');
            if (attr.attr('type') && attr.attr('type').match(/int/)) {
                attr = parseInt(attr.text(), 10);
            } else {
                attr = attr.text();
            }

            return attr;
        };

        the_thing.db_relationship = function (rel_name) {
            var rel,
                refs = [],
                idrefs_list,
                idx;

            rel = this.find('relationship[name="'+rel_name+'"]');
            if (rel.attr('idrefs')) {
                idrefs_list = rel.attr('idrefs').split(/[ ]+/);
                for (idx = 0; idx < idrefs_list.length; idx++) {
                    refs.push(parseInt(idrefs_list[idx].replace('z', ''), 10));
                }
            }

            return refs;
        };

        return the_thing;
    }

    function ToDo(thing) {
        var the_todo;

        // Appropriately extend, based on what was given as a starter
        if ('focus_filter' in thing) { // Already a ToDo
            return thing;
        } else if('db_attr' in thing) { // Already a Thing, extend only once
            the_todo = Object.create(thing);
        } else { // Build it up from a scratch jQuery object
            thing = Thing(thing); // First, extend to a Thing
            the_todo = Object.create(thing); // Then extend to a ToDo
        }

        the_todo.make_dom = function () {
            var checkbox$, item$;

            checkbox$ = $('<input type="checkbox" />');

            checkbox$.attr('name', this.attr('id'));
            checkbox$.attr('value', 'completed');
            if (this.db_attr('status') === 3) {
                checkbox$.attr('checked', 'checked');
            }

            item$ = $('<li></li>')
                .append(checkbox$)
                .append(this.db_attr('title'));

            if (foci.today.filter(this)) {
                item$.addClass('today');
            }

            return item$;
        };

        return the_todo;
    }

    // Focus types

    function Focus() {
        var the_focus = {};
        
        the_focus.filter = function (todo) {
            return true;
        };

        return the_focus;
    }

    function CategoryFocus(key) {
        var the_category_focus = Object.create(Focus()),
            _constant;
        
        _constant = parseInt(things_data$.find('object[type="FOCUS"] ' +
                                  'attribute[name="identifier"]:contains(' +
                                  key + ')')
                            .parent()
                            .attr('id')
                            .replace('z', ''), 10);

        the_category_focus.filter = function (todo) {
            return todo.db_relationship('focus').indexOf(_constant) >=0;
        };

        return the_category_focus;
    }

    function TodayFocus() {
        var the_today_focus = Object.create(Focus());

        the_today_focus.filter = function (todo) {
            return todo.db_attr('focustype') === 65536;
        };

        return the_today_focus;
    }

    function make_list(focus_name) {
        var focus = foci[focus_name],
            list$ = $('<ul id="' + focus_name + '-list" class="todo-list"></ul>')
                     .hide();

        $.each(todos, function () {
            if (focus.filter(this)) {
                list$.append(this.make_dom());
            }
        });

        return list$;
    }

    function hide_lists() {
        for (var lx in lists$) {
            if ('hide' in list$[lx]) {
                lists$[lx].hide();
            }
        }
    }

    function load_db() {

        // Create the focus objects
        foci.next    = CategoryFocus('FocusNextActions');
        foci.inbox   = CategoryFocus('FocusInbox');
        foci.someday = CategoryFocus('FocusMaybe');
        foci.today   = TodayFocus();

        // Load the todos 
        things_data$.find('object[type="TODO"]').each(function () {
            todos.push(ToDo(this));
        });
    }

    function make_lists() {
        $('#lists-list a').each(function () {
            var name,
                list$;

            name = $(this).parent().attr('id').replace(/show-/, '');
            list$ = make_list(name);
            $('#content-pane').append(list$);
            lists$[name] = list$;

            $(this).click(function (event) {
                event.preventDefault();
                // Hide other lists, remove "selected" marker from list names
                $('#lists-list li').each(function () {
                    var name;

                    name = $(this).attr('id').replace(/show-/, '');
                    lists$[name].hide();
                    $(this).removeClass('selected');
                });

                $(this).parents('li').addClass('selected');
                list$.show();
            });
        });
        $('#show-today a').click();
    }

    function create_content(data) {
        dbg.log('creating content');
        things_data$ = $(data);
        load_db();
        make_lists();
    }

    function main() {
        // Allow Firefox et al to access files elsewhere on the filesystem
        if (typeof(netscape) !== 'undefined' && netscape.security.PrivilegeManager.enablePrivilege) {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
        }

        // Pull the database file
        $.ajax('../Database.xml', {
            success: create_content,
            error: function (jqXHR, textStatus, errorThrown) {
                dbg.error(errorThrown);
            },
            dataType: 'xml'
        });
        dbg.log('done');
    }

    main();
});
