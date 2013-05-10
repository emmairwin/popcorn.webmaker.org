/* This Source Code Form is subject to the terms of the MIT license
 * If a copy of the MIT license was not distributed with this file, you can
 * obtain one at http://www.mozillapopcorn.org/butter-license.txt */

define( [
          "core/logger",
          "./media"
        ],
        function(
          Logger,
          Media
        ){

  var Timeline = function( butter, options ){

    var _media = {},
        _currentMedia,
        _parentElement = document.createElement( "div" );

    _parentElement.id = "butter-timeline";

    _parentElement.classList.add( "fadable" );

    this._start = function( onModuleReady ){
      onModuleReady();
    };

    if( butter.ui ){
      butter.ui.listen( "uivisibilitychanged", function( e ){
        for( var m in _media ){
          if( _media.hasOwnProperty( m ) ){
            _media[ m ].shrunken = !e.data;
          } //if
        } //for
      });
    } //if

    this.getCurrentTrackWidth = function() {
      return _currentMedia.trackContainer.getTrackWidth();
    };

    butter.listen( "mediaadded", function( event ){
      var mediaObject = event.data,
          media = new Media( butter, mediaObject );

      _media[ mediaObject.id ] = media;
      _parentElement.appendChild( media.element );

      function mediaChanged( event ){
        if ( _currentMedia !== _media[ event.data.id ] ){
          if ( _currentMedia ) {
            _currentMedia.hide();
          }
          _currentMedia = _media[ event.data.id ];
          if ( _currentMedia ) {
            _currentMedia.show();
          }
          butter.dispatch( "timelineready" );
        }
      }

      function mediaRemoved( event ){
        var mediaObject = event.data;
        if( _media[ mediaObject.id ] ){
          _media[ mediaObject.id ].destroy();
        }
        delete _media[ mediaObject.id ];
        if( _currentMedia && ( mediaObject.id === _currentMedia.media.id ) ){
          _currentMedia = undefined;
        }
        butter.unlisten( "mediachanged", mediaChanged );
        butter.unlisten( "mediaremoved", mediaRemoved );
      } //mediaRemoved

      butter.listen( "mediachanged", mediaChanged );
      butter.listen( "mediaremoved", mediaRemoved );
    });

  }; //Timeline

  Timeline.__moduleName = "timeline";

  return Timeline;
}); //define
