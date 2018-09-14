(function (window, $, notDefined) {
            var apiKey      = 'AIzaSyDa0lXUIWQC0o3biQGqyAKRPzHYM87xuQA';
            var channelID   = 'UCSehFH-n8YQFcnaZ92066Qw';
            var widgetID    = 'videos';
            var playlists   = [];
            var restrictedPlaylists = [];//["productos y servicios", "obra social", "tecnología e innovación"];
            var playlistItems = {};
            var featuredVideoID = '';
            var _containerCache = null;
            var playlistIDs = [
              "PLB5112FF613DA4AA0", //corporativo
              "PL02C7283DDB67B83B",
              "PL0DCF0A070B20DA33",
              "PL87CB78C8B6DF06CB"              
            ];
            
            var getContainer = function(){
                if(_containerCache === null){
                    _containerCache =  $('#'+widgetID);
                }
                return _containerCache;
            };
            
            var getAPIURL = function(resource, parts, fields, maxResults){
                var channelIDParam = 'id';
                if(maxResults == notDefined){
                    maxResults = 50;
                }

                maxResults = 50;
                switch(resource){
                    case 'playlists':
                        channelIDParam = 'channelId';
                        break;

                    case 'playlistItems':
                        channelIDParam = 'ignorethis';
                        break;
                }

                var apiBaseURL  = 'https://www.googleapis.com/youtube/v3/' + resource + '?key=' +
                               apiKey + '&'+channelIDParam+'=' + channelID;  
                return apiBaseURL + '&part=' + parts + '&fields=' + fields + '&maxResults='+maxResults;
            }
            
            var loadAPI = function(url, success){                                
                $.ajax(url, {
                        success: function(data){
                            success(data);
                        },
                        dataType: 'jsonp'
                    }).error(function(jqXHR, textStatus, errorThrown){
                    alert(errorThrown);
                });
            }
            
            var loadChannelData = function(success){
                var parts = 'brandingSettings,contentDetails';
                var fields = 'items';                
                var apiURL = getAPIURL('channels', parts, fields);
                
                loadAPI(apiURL, function(response){
                    featuredVideoID = response.items[0].brandingSettings.channel.unsubscribedTrailer;
                    success(response);
                });
            }
            
            var loadPlaylists = function(success, maxItems){                
                var parts = 'id,snippet,status';
                var fields = 'items';
                var apiURL = getAPIURL('playlists', parts, fields, maxItems);
                
                loadAPI(apiURL, function(response){
                    playlists = response.items;
                    success(response);                    
                });
            }
            
            var loadPlaylistItems = function(success){
                playlistItems = {};
                var parts = 'id,snippet,contentDetails,status';
                var fields = 'items';
                var ids = getPlaylistIDs();
                var loadCount = 0;
                
                for(var i = 0; i < ids.length; i++){                    
                    var apiURL = getAPIURL('playlistItems', parts, fields);
                    var currentID = ids[i];
                    apiURL += '&playlistId='+currentID;
                    loadAPI(apiURL, function(response){
                        var firstItem = response.items[0];
                        playlistItems[firstItem.snippet.playlistId] = response.items;                        
                        loadCount++;
                        
                        if(loadCount == ids.length){
                            success();
                        }
                    });
                }
            }
            
            var getPlaylistItems = function(playlistId){
                return playlistItems[playlistId];
            }            
            
            var getRestrictedID = function(playlistName){
                var ret = null;
                var restrictedName = '';
                playlistName = playlistName.toLowerCase();
                
                for(var i = 0; ret == null && i < restrictedPlaylists.length; i++){
                    restrictedName = restrictedPlaylists[i].toLowerCase();
                    if(playlistName.indexOf(restrictedName) == 0){
                        ret = restrictedName;
                    }
                }
                
                return ret;
            }

            var getPlaylist = function(playlistID){
                var playlists = getPlaylists();
                for(var i = 0; i < playlists.length; i++){
                    if(playlists[i].id == playlistID){
                        return playlists[i];
                    }
                }
                return null;
            }
                        
            var getPlaylists = function(){
                var results = [];
                var restrictedResults = {};
                
                for(var i = 0; i < playlists.length; i++){
                    var playlist = playlists[i];
                    var restrictedID = getRestrictedID(playlist.snippet.title);
                    if(restrictedID != null){
                        if(!restrictedResults[restrictedID]){
                            restrictedResults[restrictedID] = true;
                            results.push(playlist);
                        }
                    } else {
                        results.push(playlist);
                    }
                }
                
                return results;
            }
            
            var getPlaylistIDs = function(){
                
                return playlistIDs;
                
                var results = [];
                var playlists = getPlaylists();
                console.log(playlists.length);
                
                for(var i = 0; i < playlists.length; i++){
                    results.push(playlists[i].id);
                }            
                return results;
                
            }                        
            
            var setWidgetID = function(newID){
                if(newID != notDefined){
                    widgetID = newID;
                }
            }
            
            var loadVideo = function(videoID, autoPlay){
              if(autoPlay == notDefined){
                autoPlay = 0;
              }
              
              var container = getContainer(); 
              var iframeHTML = '<div class="yw_container"><iframe class="youtube-player" type="text/html" ' +
                'width="100%" height="100%" src="https://www.youtube.com/embed/'+videoID+'?autoplay='+autoPlay+
                '&theme=light&color=red" frameborder="0" allowfullscreen></iframe></div>';

              container.find('.yw_player').html(iframeHTML);
            }
            
            var playVideo = function(videoID){
                loadVideo(videoID, 1);
            }
            
            
            var clearRows = function(){
                getContainer().find('.yw_list').html('<div class="yw_container"></div>');
            }
            
            var addRow = function(itemList, maxItems){
                if(!itemList) return;
                
                if(maxItems == null){
                    maxItems = 3;
                }

                var container = getContainer();
                if(container.find('.yw_list .yw_container').length == 0){
                    container.find('.yw_list').html('<div class="yw_container"></div>');
                }
                
                var rowsContainer = container.find('.yw_list .yw_container');
                var list = getPlaylist(itemList[0].snippet.playlistId);
                var listTitle = list.snippet.title;     
                
                $('<div class="yw_row"><h4>'+listTitle+'</h4><ul></ul></div>').appendTo(rowsContainer);                
                var listContainer = rowsContainer.find('.yw_row').last().find('ul');
                
                var n = itemList.length;//Math.min(itemList.length, maxItems);
                var nCount = 0;
                
                for(var i = 0; i < n; i++){
                    
                    var item = itemList[i];
                    if(item.status.privacyStatus != 'public') continue;

                    var thumbnail = item.snippet.thumbnails['default'].url;
                    var title = item.snippet.title;
                    var videoID = item.snippet.resourceId.videoId;
                    var itemURL = '';
                    var itemHTML = '<li><a href="'+itemURL+'" title="'+title+'" data-video-id="'+videoID+'">'+
                                    '<img src="'+thumbnail+'"><div class="yw_title"><span>'+title+'</span></div></a></li>';
                                  $(itemHTML).appendTo(listContainer).find('a').click(function(e){
                                    e.preventDefault();
                                    playVideo($(this).data('video-id'));
                                    return false;
                                  });
                    nCount++;
                    if(nCount >= maxItems) break;
                }
            }
            
            
            var run = function(widgetID, maxPlaylists, callback){
                setWidgetID(widgetID);
                
                loadChannelData(function(){
                    
                    loadPlaylists(function(){
                        
                        loadPlaylistItems(function(){       
                            //eliminar contenido antes
                            var playlistIds = getPlaylistIDs();
                            clearRows();
                            for(var i = 0; i < playlistIds.length; i++){
                                var items = getPlaylistItems(playlistIds[i]);
                                if(items.length >= 4){
                                  addRow(items.reverse());
                                }
                            }
                            loadVideo(featuredVideoID);
                            removePreload();
							if(callback && typeof(callback) === "function"){
								callback();
							}
                        });
                    }, maxPlaylists);
                });
				
				
				
            }
            
            var removePreload = function(){
                getContainer().find('.yw_preload').slideUp('normal');
            }
            
            //cargar primer video de cada playlist
            
            var externalAPI = {
                run: function(widgetID, maxPlaylists, callback){
                    run(widgetID, maxPlaylists, callback);
                }
            }
            window.youtubeWidget = externalAPI;
        })(window, jQuery);

