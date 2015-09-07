$(document).ready(function() {
  var switched = false;
  var updateTables = function() {
    if (($(window).width() < 767) && !switched ){
      switched = true;
      $("table.responsive").each(function(i, element) {
        splitTable($(element));
      });
      return true;
    }
    else if (switched && ($(window).width() > 767)) {
      switched = false;
      $("table.responsive").each(function(i, element) {
        unsplitTable($(element));
      });
    }
  };

  $(window).load(updateTables);
  $(window).bind("resize", updateTables);

  var screenWidth = 0,
  pinnedTableWidth = 0;

  function checkForButtons( table, currentColumn, numberOfColumns ) {
    table.siblings('.move-table-icon').removeClass('disabled');

    /** Disable next button */
    if( currentColumn === numberOfColumns ) {
      table.siblings('.move-table-right').addClass('disabled');
    }

    /** Disable previous button */
    if( currentColumn === 1 ) {
      table.siblings('.move-table-left').addClass('disabled');
    }
  }

  function splitTable(original) {
    original.wrap("<div class='table-wrapper' />");

    var copy = original.clone();
    copy.find("td:not(:first-child), th:not(:first-child)").css("display", "none");
    copy.removeClass("responsive");

    original.closest(".table-wrapper").append(copy);
    copy.wrap("<div class='pinned' />");
    original.wrap("<div class='scrollable' />");
    original.attr('data-current-column', 1);
    original.attr('number-of-columns', original.find('tbody tr:first-child td').length - 1);
    original.attr('current-translate-x', 0);
    original.attr('is-animated', false);

    var tableHeights = [],
        tableI = 0;
    /** Calculate maximum height for each tr */
    original.find('tbody > tr').each(function(){
      tableHeights[tableI] = 0;

      $(this).find('td').each(function(){
        if( $(this).outerHeight() > tableHeights[tableI] ) {
          tableHeights[tableI] = $(this).outerHeight();
        }
      });

      tableI++;

    });

    var copyTableI = 0;
    /** If pinned table td is higher, assign the value to */
    copy.find('tbody > tr').each(function(){

      $(this).find('td').each(function(){
        if( $(this).outerHeight() > tableHeights[copyTableI] ) {
          tableHeights[copyTableI] = $(this).outerHeight();
        }
      });

      copyTableI++;

    });

    /** Assign the height to both tables */
    var i = 0;
    copy.find('tbody > tr').each(function(){
      $(this).children('td').css('height', tableHeights[i]);
      i++;
    });

    var j = 0;
    original.find('tbody > tr').each(function(){
      $(this).children('td').css('height', tableHeights[j]);
      j++;
    });

    screenWidth = $(window).width();
    pinnedTableWidth = $('.pinned').width();
    original.find('th').css('width', screenWidth - pinnedTableWidth);
    original.find('td').css('width', screenWidth - pinnedTableWidth);

    original.before( $('<i>', { 'class' : 'ico-arrow-right-brown ico-medium move-table-icon move-table-right' }));
    original.before( $('<i>', { 'class' : 'ico-arrow-left-brown ico-medium move-table-icon move-table-left' }));
    $('.scrollable').find('.move-table-right').attr('data-direction', 'right');
    $('.scrollable').find('.move-table-left').attr('data-direction', 'left').addClass('disabled');

    /** @type {hammer.js} */
    var hammerTable = new Hammer( original.parents('.table-wrapper')[0] );

    hammerTable.on('panright panleft swiperight swipeleft', function(event){
      var type = event.type,
          table = $(event.target).parents('table.responsive') || $(event.target).parents('.table-wrapper').find('.scrollable > table'),
          tdColumnWidth = table.find('tbody tr:first-child td').outerWidth(),
          currentColumn = parseInt( table.attr('data-current-column') ),
          leftOffset = 0,
          currentTranslateX = parseInt( table.attr('current-translate-x') ),
          numberOfColumns = parseInt( table.attr('number-of-columns') );

      if( table.attr('is-animated') === "false" ) {
        table.attr('is-animated', true);

        if( type === 'panleft' || type === 'swipeleft' ) {
          currentColumn < numberOfColumns ? table.attr('data-current-column', currentColumn+1) : removeBumpClassesFromTable( table, 'right' );
          currentColumn < numberOfColumns ? table.attr('current-translate-x', currentTranslateX - tdColumnWidth) : '';
          currentColumn = parseInt( table.attr('data-current-column') );
        } else {
          currentColumn > 1 ? table.attr('data-current-column', currentColumn-1) : removeBumpClassesFromTable( table, 'left' );
          currentColumn > 1 ? table.attr('current-translate-x', currentTranslateX + tdColumnWidth) : '';
          currentColumn = parseInt( table.attr('data-current-column') );
        }

        leftOffset = parseInt( table.attr('current-translate-x') );

        /** Disable, enable right and left buttons */
        checkForButtons( table, currentColumn, numberOfColumns );

        /** Move the table */
        setTablePosition( table, leftOffset, true );

      }

      table.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', function(){
        $(this).removeClass('right-bump left-bump').attr('is-animated', false);
      });

    });

  }

  function removeBumpClassesFromTable( element, direction ) {
    element.addClass( direction + '-bump' );
    setTimeout(function(){
      element.removeClass( direction + '-bump' ).attr('is-animated', "false");
    }, 300);
  }

  var clickHandler = ("ontouchstart" in window ? "touchend" : "click");

  $('body').on(clickHandler, '.move-table-icon', function(e){
    var that = $(this),
    direction = that.attr('data-direction'),
    currentTable = that.siblings('table'),
    currentColumn = parseInt( currentTable.attr('data-current-column') ),
    numberOfColumns = parseInt( currentTable.attr('number-of-columns') ),
    leftOffset = 0,
    nextColumnWidth = currentTable.find('tbody tr:first-child td').outerWidth(),
    currentTranslateX = parseInt( currentTable.attr('current-translate-x') );

    if( !currentTable.is(':animated') ) {

      if( direction === 'right' ) {
        /** Set current column */
        currentColumn < numberOfColumns ? currentTable.attr('data-current-column', currentColumn+1) : removeBumpClassesFromTable( currentTable, 'right' );
        currentColumn < numberOfColumns ? currentTable.attr('current-translate-x', currentTranslateX - nextColumnWidth) : '';
        currentColumn = parseInt( currentTable.attr('data-current-column') );

      } else {
        /** Set current column */
        currentColumn > 1 ? currentTable.attr('data-current-column', currentColumn-1) : removeBumpClassesFromTable( currentTable, 'left' );
        currentColumn > 1 ? currentTable.attr('current-translate-x', currentTranslateX + nextColumnWidth) : '';
        currentColumn = parseInt( currentTable.attr('data-current-column') );

      }

      currentTable.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
        $(this).removeClass('right-bump left-bump');
      });

      leftOffset = parseInt( currentTable.attr('current-translate-x') );

      /** Disable, enable right and left buttons */
      checkForButtons( currentTable, currentColumn, numberOfColumns );

      /** Move the table */
      setTablePosition( currentTable, leftOffset, true );
    }

  });

  /** Set table X position */
  function setTablePosition( element, leftOffset, transition ) {
    if( transition ) {
      element.css({
        '-webkit-transform' : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + leftOffset + ',0,0,1)',
        '-moz-transform' : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + leftOffset + ',0,0,1)',
        '-ms-transform' : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + leftOffset + ',0,0,1)',
        '-o-transform' : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + leftOffset + ',0,0,1)',
        'transform' : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + leftOffset + ',0,0,1)',
        '-webkit-transition' : 'all .5s ease',
        '-moz-transition' : 'all .5s ease',
        '-ms-transition' : 'all .5s ease',
        '-o-transition' : 'all .5s ease',
        'transition' : 'all .5s ease'
      });
    } else {
      element.css({
        '-webkit-transform' : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + leftOffset + ',0,0,1)',
        '-moz-transform' : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + leftOffset + ',0,0,1)',
        '-ms-transform' : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + leftOffset + ',0,0,1)',
        '-o-transform' : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + leftOffset + ',0,0,1)',
        'transform' : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + leftOffset + ',0,0,1)',
        '-webkit-transition' : 'none',
        '-moz-transition' : 'none',
        '-ms-transition' : 'none',
        '-o-transition' : 'none',
        'transition' : 'none'
      });
    }
  }

  function unsplitTable(original) {
    original.closest(".table-wrapper").find(".pinned").remove();
    $('.scrollable').find('.move-table-icon').remove();
    original.css({
      '-webkit-transform' : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1)',
      '-moz-transform' : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1)',
      '-ms-transform' : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1)',
      '-o-transform' : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1)',
      'transform' : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1)'
    });
    original.unwrap();
    original.unwrap();

    original.find('tbody > tr').each(function(){
      $(this).children('td').css('height', 'auto');
    });
  }

});

