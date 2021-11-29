import React, { createRef, useCallback, useEffect, useRef, useState } from "react";
import { findDOMNode } from "react-dom";
import ReactPlayer from "react-player";
import { Link, useHistory } from "react-router-dom";
import { Progress, Tooltip } from "reactstrap";
import screenfull from "screenfull";
import { IconBackArrow, IconFullScreen, IconLayer, IconNext10s, IconPause, IconPauseCircle, IconPlay, IconPlayCircle, IconRewind10s, IconSetting, IconSkip, IconVolume, IconVolumeMute } from "../../assets/Icon";
import { Duration, Format } from "../../services/function/Duration";
import './style.scss'
import * as Icon from 'react-feather';

let count = 0;
//https://www.example.com/url_to_video.mp4
///https://player.vimeo.com/external/194837908.sd.mp4?s=c350076905b78c67f74d7ee39fdb4fef01d12420&profile_id=164
// http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
//https://drive.google.com/uc?export=download&id=1Cvk2XhYdSKAST4ecGQ6s1ra4MilvXuLC
const VideoPlayer = ({socket, roomnum, videoURL}) => {
    const history = useHistory(); // Navigate back to the previous state
    const [played, setPlayed] = useState(0);
    const [loaded, setLoaded] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [focusing, setFocusing] = useState(false);

    const [muted, setMuted] = useState(false);
    const [seeking, setSeeking] = useState(false);
    // const [url, setUrl] = useState('https://drive.google.com/uc?export=download&id=1Cvk2XhYdSKAST4ecGQ6s1ra4MilvXuLC');
    // const [url, setUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    const [url, setUrl] = useState(videoURL);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const controlRef = useRef(null);
    const volumeRef = useRef(null);
    const playedRef = useRef(null);
    const titlePlayedRef = useRef(null);
    const [iconRewind, setIconRewind] = useState(false);
    const [iconNext, setIconNext] = useState(false);
    const [isShown, setIsShown] = useState(false);
    const textInput = React.createRef(null);

    let valueHover = 0;

    const onBlurSearchInput = () => {
        textInput.current.blur()
        setIsShown(false)
    }

    
    const btnSearchClicked = () => {
        if (!isShown) {
            textInput.current.focus()
        }
        setIsShown(!isShown)
    }

    const toggleRewind = () => setIconRewind(!iconRewind);
    const toggleNext = () => setIconNext(!iconNext);
    const handleStop = () => {
        setUrl(null);
        setPlaying(false);
    }
    const [searchText, setSearchText] = useState('');
    const onSearchKeyPress = (e) => {

        if (e.key === "Enter") {

            history.push({
                pathname: '/search',
                search: `value=${searchText}`,

            })
            setSearchText('')
        }

    }

    const handleVideoOnReady = () => {
        // console.log('loading')
    }

    const handleVolumeChange = () => {
        let target = volumeRef.current

        const min = target.min
        const max = target.max
        const val = target.value

        target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'

        setVolume(volumeRef.current.value)
    }

    const handleVolumeMute = () => {
        setMuted(!muted)
    }

    const handleVolumeUp = () => { }

    const handlePlayedChange = (e) => {
        setPlayed(e.target.value);
    }

    const handlePlayPause = useCallback(() => {
        controlRef.current.style.opacity = '1'
        setPlaying(!playing)
    }, [playing])

    const handleVideoPlay = () => {
        setPlaying(true)
    }

    const handleVideoPause = () => {
        setPlaying(false)
    }

    const handleVideoProgress = (state) => {
        if (count > 3 && !seeking) {

            controlRef.current.style.opacity = '0'
            count = 0;
        }
        else if (controlRef.current.style.opacity == '1' && playing) {
            count += 1;
        }
        if (!seeking) {
            setPlayed(state.played);
            setLoaded(state.loaded)
        }


    }

    const handleVideoEnded = () => {

    }

    const handleVideoDuration = (duration) => {
        if (typeof(url) != 'undefined'){
            setDuration(duration);
        }
    }

    const handlePlayedDown = () => {
    }

    const handlePlayedUp = (e) => {
        playerRef.current.seekTo(parseFloat(e.target.value))
        // socket.emit('get host data', {
        //     room: roomnum,
        //     currTime: e.target.value,
        //     state: playing,
        //     caller: socket.id
        // });
    }

    const handleRewind = useCallback(() => {
        playerRef.current.seekTo((played * duration) - 10, 'seconds')
    }, [played, duration]
    )
    const handleNext = useCallback(() => {
        playerRef.current.seekTo((played * duration) + 10, 'seconds')
    }, [played, duration]
    )

    const handleClickFullscreen = () => {
        screenfull.toggle(playerContainerRef.current)
    }

    const handleMouseMove = () => {
        // console.log('move')
        controlRef.current.style.opacity = '1'
    }

    const handleMouseEnter = () => {
        setFocusing(true)
    }

    const handleMouseLeave = () => {
        setFocusing(false)
    }

    const calcSliderPos = (e) => {
        return (e.nativeEvent.offsetX / e.target.clientWidth) * parseInt(e.target.getAttribute('max'), 10);
    }

    //attach to slider and fire on mousemove
    const handlePlayedMouseMove = (e) => {
        valueHover = calcSliderPos(e).toFixed(4);

        titlePlayedRef.current.textContent = Format((valueHover * duration).toFixed(0));
        titlePlayedRef.current.style.left = e.nativeEvent.offsetX + 'px';
    }



    const handleKeyDown = useCallback((e) => {
        if (focusing) {
            if (e.key === 'ArrowDown') {
                if (volume <= 0.1) {
                    setVolume(0)
                }

                else
                    setVolume(parseFloat(volume) - 0.1);
                handleVolumeChange()
            }
            else if (e.key === 'ArrowUp') {

                if (volume >= 0.9) {
                    setVolume(1);
                }
                else {

                    setVolume(parseFloat(volume) + 0.1);
                }
                handleVolumeChange()
            }
            else if (e.key === 'ArrowLeft') {
                setSeeking(true);
                if (played < (10 / duration))
                    setPlayed(0)
                else
                    setPlayed(played - (10 / duration))
            }
            else if (e.key === 'ArrowRight') {
                setSeeking(true);
                if (played + (10 / duration) > 1)
                    setPlayed(1)
                else
                    setPlayed(played + (10 / duration))
            }
            else if (e.keyCode === 32) {

                handlePlayPause();
            }
        }
    }, [setVolume, volume, handlePlayPause, played, duration, focusing])

    const handleKeyUp = useCallback((e) => {
        if (focusing) {
            if (e.key === 'ArrowLeft') {
                playerRef.current.seekTo(played, 'fraction')
                setSeeking(false)
            }
            else if (e.key === 'ArrowRight') {
                playerRef.current.seekTo(played, 'fraction')
                setSeeking(false)
            }
        }
    }, [played,focusing])

    useEffect(() => {

        document.addEventListener("keydown", handleKeyDown)
        document.addEventListener("keyup", handleKeyUp)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.removeEventListener("keyup", handleKeyUp)
        }
    }, [handleKeyDown, handleKeyUp]);
    
    useEffect(() => {
        socket.emit('get host data', {
            room: roomnum,
            currTime: played,
            state: playing,
            caller: socket.id
        });
    }, [seeking, playing])
    // })
    

    // const syncHost = () => {
        // socket.emit('get host data', {
        //     room: roomnum,
        //     currTime: played,
        //     state: playing,
        //     caller: socket.id
        // });
    // }

    // Uses the host data to compare
    socket.on('compareHost', function(data) {
        console.log("compareHost");
        // // The host data
        var hostTime = data.currTime
        var hostState = data.state

        var clientTime = played
        var clientState = playing

        var isHost = data.host == socket.id

        if (data.currVideo != url){
            setUrl(data.currVideo)
        }

        // // If out of sync
        // console.log("currTime != hostTime", clientTime != hostTime);
        // console.log("state != hostState", clientState != hostState);
        // console.log("isHost", isHost);
        // console.log("CURRENT curr: " + clientTime + " State: " + clientState)
        // console.log("HOST curr: " + hostTime + " State: " + hostState)
        if (clientTime != hostTime || clientState != hostState) {
            if (!isHost) {
                // disconnected()
                console.log("playerRef", playerRef);
                console.log("duration", duration);
                if (playerRef.current !== null && duration !== undefined){
                    console.log("played", played);
                    console.log("hostTime", hostTime);
                    setPlayed(hostTime);
                    playerRef.current.seekTo(hostTime, 'fraction')
                    setPlaying(hostState);
                }
                // console.log("AFTER CHANGE curr: " + played + " State: " + playing)
            }
        }
    });

    // useEffect(() => {
    //     socket.on('getPlayerData', function(data) {
    //         console.log("getPlayerData");
    //         var roomnum = data.room
    //         var caller = data.caller
        
    //         var currTime = played
    //         var state = playing
    //         console.log("currTime", currTime);
    //         console.log("state", state);
    //         socket.emit('get host data', {
    //             room: roomnum,
    //             currTime: currTime,
    //             state: state,
    //             caller: caller
    //         });
    //     });
    // })




    return (
        <div id={`videoPlayer`} onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  style={{position: 'absolute', width: '100%', height: '100%'}}>
            <div ref={playerContainerRef} className={`video-player`} >
                <div className={'video-container'} onClick={handlePlayPause}>
                    <ReactPlayer
                        ref={playerRef}
                        className={`video-container`}
                        width='100%'
                        height='100%'
                        url={url}
                        onReady={handleVideoOnReady}
                        playing={playing}
                        controls={false}

                        volume={volume}
                        muted={muted}

                        onPlay={handleVideoPlay}
                        onEnded={handleVideoEnded}
                        onPause={handleVideoPause}
                        onProgress={handleVideoProgress}
                        onDuration={handleVideoDuration}
                    />
                </div>
                <div className={`video-player__icon-container`} onClick={handlePlayPause}>
                    {!playing ?
                        <IconPlayCircle className={`video-player__icon-container__icon`} />
                        :
                        <IconPauseCircle className={`video-player__icon-container__icon`} />
                    }


                </div>
                <div ref={controlRef} style={{
                    transition: 'all 0.5s'
                }}>

                    <div className={`video-player__top`} style={{zIndex: '4', justifyContent: "space-between"}}>
                        <div className={`video-player__top__icon-container`} onClick={() => history.goBack()}>
                            <IconBackArrow className={'video-player__top__icon-back'} />
                            <span>Back to Browse</span>
                        </div>
                        <div className={`search-box ${isShown && 'input-search'}`} style={{marginRight: "4rem"}}>
                            <div>
                                <Icon.Search className='icon-style' size='16px' strokeWidth='4' color='white' onClick={btnSearchClicked} style={{cursor: 'pointer', marginRight: "1rem"}} />
                            </div>
                            <React.Fragment>
                                <input
                                    onKeyPress={onSearchKeyPress}
                                    onBlur={onBlurSearchInput}
                                    ref={textInput} value={searchText}
                                    type={'text'}
                                    name="search"
                                    placeholder="Search.."
                                    onChange={(e) => setSearchText(e.target.value)} >
                                </input>
                            </React.Fragment>
                        </div>
                    </div>


                    <div className={`video-player__bottom`}>
                        <div className={`video-player__bottom__bar-container`}>
                            <div className={`video-player__bottom__bar-container__bar`}>
                                <input type='range' min={0} max={1} step='any' ref={playedRef} id='playedInput'
                                    value={played}
                                    onMouseMove={handlePlayedMouseMove}
                                    onMouseDown={handlePlayedDown}
                                    onChange={handlePlayedChange}
                                    onMouseUp={handlePlayedUp} />
                                <span className={`tool-tip`} ref={titlePlayedRef}  >

                                </span>
                                <div className={`video-player__bottom__bar-container__bar--played`}>
                                    <progress min={0}
                                        max={1} value={played} >
                                    </progress>
                                </div>
                                <div className={`video-player__bottom__bar-container__bar--loaded`}>
                                    <progress min={0}
                                        max={1} value={loaded} >
                                    </progress>
                                </div>


                            </div>
                            <p className={`video-player__bottom__bar-container__remain-time`}>
                                <Duration seconds={duration * (1 - played)} />
                            </p>
                            <div className={'video-player__bottom__bar-container__player-container'}>
                                <div className={`video-player__bottom__bar-container__player-container__left`} >
                                    <div onClick={handlePlayPause}>
                                        {!playing ? <IconPlay className={'icon--color'} />
                                            :
                                            <IconPause className={'icon--color'} />
                                        }
                                    </div>


                                    <div id='iconRewind' onClick={handleRewind}>
                                        <IconRewind10s className={'icon--fill'} />
                                        <Tooltip placement="top" isOpen={iconRewind} target="iconRewind" toggle={toggleRewind}>
                                            10s
                                        </Tooltip>
                                    </div>
                                    <div id='iconNext' onClick={handleNext}>
                                        <IconNext10s className={'icon--fill'} />
                                        <Tooltip placement="top" isOpen={iconNext} target="iconNext" toggle={toggleNext}>
                                            10s
                                        </Tooltip>
                                    </div>


                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {volume > 0 && !muted ?
                                            <div onClick={handleVolumeMute}>
                                                <IconVolume className={'icon--color'} />
                                            </div>
                                            :
                                            <div>
                                                <div onClick={handleVolumeMute}>
                                                    <IconVolumeMute className={'icon--color'} />
                                                </div>
                                            </div>
                                        }
                                        <input type='range' min={0} max={1} step='any' ref={volumeRef}
                                            value={volume} className={`volume ${!muted && 'open'}`}
                                            onChange={handleVolumeChange}
                                            onMouseUp={handleVolumeUp} />
                                    </div>
                                    {/* <div style={{padding: '6px 6px'}}>
                                        <button
                                            style={{ fontSize: "1rem",fontWeight: "bold",paddingRight: "0.5rem", float: "right", borderRadius: "8px", backgroundColor: "rgb(183, 7, 16)", padding: "12px 12px", border: "none", color: 'white' }}
                                            onClick={syncHost}>
                                            Sync
                                        </button>
                                    </div> */}


                                </div>
                                <div className="video-player__bottom__bar-container__player-container__right">
                                    <IconSkip className={'icon--color'} />
                                    <IconLayer className={'icon--fill'} />
                                    <IconSetting className={'icon--color'} />
                                    <div onClick={handleClickFullscreen} >
                                        <IconFullScreen className={'icon--color'} />
                                    </div>

                                </div>

                            </div>


                        </div>
                    </div>
                </div>

            </div>


        </div >
    )
}
export default VideoPlayer;