$(function () {// Package scope

    var things_data$,
        filters,
        lists$ = {}, 
        NEXT_FOCUS,
        INBOX_FOCUS,
        SOMEDAY_FOCUS,
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


    // Return a specific attribute value from a todo object
    function get_attr(thing_todo$, attr_name) {
        var attr;

        attr = thing_todo$.find('attribute[name="'+attr_name+'"]');
        if (attr.attr('type') && attr.attr('type').match(/int/)) {
            attr = parseInt(attr.text(), 10);
        } else {
            attr = attr.text();
        }

        return attr;
    }

    function get_relationship(thing_todo$, rel_name) {
        var rel,
            refs = [],
            idrefs_list,
            idx;

        rel = thing_todo$.find('relationship[name="'+rel_name+'"]');
        if (rel.attr('idrefs')) {
            idrefs_list = rel.attr('idrefs').split(/[ ]+/);
            for (idx = 0; idx < idrefs_list.length; idx++) {
                refs.push(parseInt(idrefs_list[idx].replace('z', ''), 10));
            }
        }

        return refs;
    }

    function make_list(filter_name) {
        var filter = filters[filter_name],
            list$ = $('<ul id="' +filter_name +'-list" class="todo-list hidden"></ul>');

        things_data$.find('object[type="TODO"]').each(function () {
            var checkbox$;
            var item$;

            if (filter($(this))) {
                checkbox$ = $('<input type="checkbox" />')
                    .appendTo('<form></form>');

                checkbox$.attr('name', $(this).attr('id'));
                checkbox$.attr('value', 'completed');
                if (get_attr($(this), 'status') === 3) {
                    checkbox$.attr('checked', 'checked');
                }

                item = $('<li></li>')
                    .append(checkbox$)
                    .append(get_attr($(this), 'title'))
                    .appendTo(list$);
                if (filters.today($(this))) {
                    item.addClass('today');
                }
            }
        });

        return list$;
    }

    filters = {
        inbox: function (thing_todo$) {
            return get_relationship(thing_todo$, 'focus').indexOf(INBOX_FOCUS) >=0;
        },
        today: function (thing_todo$) {
            return get_attr(thing_todo$, 'focustype') === 65536;
        },
        next: function (thing_todo$) {
            return get_relationship(thing_todo$, 'focus').indexOf(NEXT_FOCUS) >=0;
        },
        someday: function (thing_todo$) {
            return get_relationship(thing_todo$, 'focus').indexOf(SOMEDAY_FOCUS) >=0;
        }
    }

    function hide_lists() {
        for (lx in lists$) {
            lists$[lx].hide();
        }
    }

    function load_constants() {
        function load_constant(key) {
            return parseInt(
                things_data$.find('object[type="FOCUS"] ' +
                                  'attribute[name="identifier"]:contains(' +
                                  key + ')')
                            .parent()
                            .attr('id')
                            .replace('z', ''), 10);
        }

        NEXT_FOCUS = load_constant('FocusNextActions');
        INBOX_FOCUS = load_constant('FocusInbox');
        SOMEDAY_FOCUS = load_constant('FocusMaybe'); 
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
        load_constants();
        make_lists();
    }

    function main() {
        // Allow Firefox et al to access files elsewhere on the filesystem
        if (typeof(netscape) !== 'undefined' && netscape.security.PrivilegeManager.enablePrivilege) {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
        }

        // Pull the database file
        $.ajax('../Database.xml', {
            success: function (data) {
                dbg.log('success');
                create_content(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                dbg.error(errorThrown);
            },
            dataType: 'xml'
        });
        dbg.log('done');
    }

    main();
});
