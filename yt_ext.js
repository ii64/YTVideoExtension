/**
 * YTVideoExtension
 * ---------
 *   Chrome Youtube Extension
 *   Maintainer: https://github.com/ii64
 *   Just some random project
 */
var _patch = function(){
	var vid = document.getElementsByTagName("video");
	if (vid.length > 0) {
		var playerVid = vid[0];
		function dummyDuration() {
			return null;
		}
		function play() {
			playerVid.play();
		}
		function toEnd() {
			playerVid.currentTime = playerVid.duration;
		}
		function toStart() {
			playerVid.currentTime = 0;
		}
		function skipForward(p=5) {
			playerVid.currentTime += p;
		}
		function skipBackward(p=5) {
			playerVid.currentTime -= p;
		}
		function pause() {
			playerVid.pause();
		}
		function speedReset() {
			playerVid.playbackRate = 1;
		}
		function speedIncr(p=0.01) {
			playerVid.playbackRate += p;
		}
		function speedDecr(p=0.01) {
			playerVid.playbackRate -= p
		}
		function failedAction() {
			console.log("video is not playing.")
		}
		function IsPlayingVideo(callb, fail) {
			if(!playerVid.paused) {callb()}else{fail()}
		}
		// getting video container
		console.log("checking player container...");
		if (player) {
			var targ = player; var found = false;
			if (player.length) {
				console.log("player is more than one...");
				for (var ix_=0; ix_<player.length; ix_++) {
					if (player[ix_].classList.value == "style-scope ytd-watch-flexy") {
						targ = player[ix_];
						found = true;
						break
					}
				}
				if (!found) {
					console.log("not found any player container.");
					targ = null;
				}
			}

			if (targ) {
				console.log("mounting debug element...");
				var dbgContainer = document.createElement("p");
				console.log(dbgContainer);
				dbgContainer.style.color = "green";
				dbgContainer.style.fontSize = "10px";
				targ.appendChild(dbgContainer);
				setInterval(function() {
					dbgContainer.innerHTML = `YTVideoExtension [(Shift + |) Help] PlaybackRate: ${playerVid.playbackRate} | Progress: ${playerVid.currentTime}/${playerVid.duration}`;
				}, 200);
			}
		}
		console.log("done checking.");

		var winHelp = null;

		document.addEventListener("keyup", function(ev){
			console.log("getUp", ev)
		})
		document.addEventListener("keydown", function(ev){
			console.log("holdin", ev)
			if (ev.key == "E") {
				IsPlayingVideo(toEnd, failedAction)
			}else if(ev.key == "S") {
				IsPlayingVideo(toStart, failedAction)
			}else if(ev.key == "{") {
				IsPlayingVideo(function() {
					skipBackward(5)
				}, failedAction)
			}else if(ev.key == "}") {
				IsPlayingVideo(function() {
					skipForward(5)
				}, failedAction)
			}else if(ev.key == "+") {
				IsPlayingVideo(function() {
					speedIncr(0.1);
				}, failedAction);
			}else if(ev.key == "_") {
				IsPlayingVideo(function() {
					speedDecr(0.1);
				}, failedAction);
			}else if(ev.key == "|") {
				if (!winHelp) {
					winHelp = window.open("", "YT Extension Help", "location=1,status=1,scrollbars=1,resizable=no,width=200,height=200,menubar=no,toolbar=no");
					winHelp.document.write(`<body style="background-color: light-blue">
						Shift + S   Go to start video<br />
						Shift + E   Go to end video<br />
						Shift + [   Back 5 seconds<br />
						Shift + ]   Forward 5 seconds<br />
						Shift + =   Speed up 0.1<br />
						Shift + -   Speed down 0.1<br />
						Shift + |   Show help<br />
						<a href="https://github.com/ii64" ref="_blank">https://github.com/ii64</a><br />
					</body>`)
					function endWindow() {
						winHelp.close();
						winHelp = null;
					}
					winHelp.document.addEventListener("keydown", function() {
						endWindow();
					})
				}else{
					winHelp.close();
					winHelp = null;
				}
			}
		})
		return true;
	}
	return false;
}
// patch on load or it'll execute scheduler
if(!_patch()){
	// scheduler
	var scheduler = setInterval(function() {
		if(window.location.href.indexOf("watch") != -1) {
			if(_patch()) {
				clearInterval(scheduler);
			}
		}
	}, 500);
}