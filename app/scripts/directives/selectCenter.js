angular.module("app")
    .directive("selectCenter", function() {
        return {
            scope: { date: "=" },
            link: function (scope, element) {
                function getTextWidth(txt) {
                    var $elm = $('<span style="opacity: 0;">'+txt+'</span>').prependTo("body");
                    var elmWidth = $elm.width();
                    $elm.remove();
                    return elmWidth;
                }
                function centerSelect($elm) {
                    if(!$elm.children.length) {
                        return;
                    }

                    var optionWidth = getTextWidth($elm.children(":selected").html());
                    var emptySpace =   $elm.width()- optionWidth;
                    $elm.css("text-indent", (emptySpace/2) - 10);// -10 for some browers to remove the right toggle control width
                }
                // on start
                function update(container) {
                    $(container).find("select").each(function(ind, elem) {centerSelect(elem)});
                }

                update($(element));

                $(element).find("select").on('change', function() {
                    centerSelect($(this));
                });
            }
        }
    });