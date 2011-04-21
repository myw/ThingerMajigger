$(function () {
    var main_list$,
        things_data$,
        filters,
        NEXT_FOCUS = 128;

    // Return a specific attribute value from a todo object
    function get_attr(thing_todo$, attr_name) {
        var attr;

        attr = thing_todo$.find('attribute[name="'+attr_name+'"]');
        if (attr.attr('type').match(/int/)) {
            attr = parseInt(attr.text());
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
                refs.push(parseInt(idrefs_list[idx].replace('z', '')));
            }
        }

        return refs;
    }

    function main_list_show(filter) {
        main_list$.empty();
        things_data$.find('object[type="TODO"]').each(function () {
            var checkbox$;

            if (filter($(this))) {
                checkbox$ = $('<input type="checkbox" />')
                    .appendTo('<form></form>');

                checkbox$.attr('name', $(this).attr('id'));
                checkbox$.attr('value', 'completed');
                if (get_attr($(this), 'status') === 3) {
                    checkbox$.attr('checked', 'checked');
                }

                $('<li></li>')
                    .append(checkbox$)
                    .append(get_attr($(this), 'title'))
                    .appendTo(main_list$);
            }
        });
    };

    filters = {
        today: function (thing_todo$) {
            return get_attr(thing_todo$, 'focustype') === 65536;
        },
        next: function (thing_todo$) {
            return get_relationship(thing_todo$, 'focus').indexOf(NEXT_FOCUS) >=0;
        }
    }

    function create_content(data) {
        main_list$ = $('#main-list');
        things_data$ = $(data);
        main_list_show(filters.today);
        main_list_show(filters.next);
    };

    function main() {
        $.get('Database.xml',
            function(data) {
                create_content(data);
            });
    };

    main();
});
