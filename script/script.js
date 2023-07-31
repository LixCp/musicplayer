const wrraper = document.querySelector('.wrapper'),
musicImg = wrraper.querySelector('.img-area img'),
musicName = wrraper.querySelector('.song-details .name'),
musicArtist = wrraper.querySelector(".song-details .artist"),
mainAudio = wrraper.querySelector('#main-audio'),
playPauseBtn = wrraper.querySelector('.play-pause'),
nextBtn = wrraper.querySelector('#next'),
prevBtn = wrraper.querySelector('#prev'),
progressBar = wrraper.querySelector('.progress-bar'),
progressArea = wrraper.querySelector('.progress-area'),
repeatBtn = wrraper.querySelector('#repeat-pilst'),
musicList = wrraper.querySelector('.music-list'),
showMoreBtn = wrraper.querySelector('#more-music'),
hideMusicBtn = musicList.querySelector('#close')

let musicIndex = Math.floor((Math.random() * allMusic.length) +1)

window.addEventListener('load', ()=>{
    loadMusic(musicIndex)
    nowPlaying()
})

function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb -1].name;
    musicArtist.innerText = allMusic[indexNumb -1].artist;
    musicImg.src = `img/${allMusic[indexNumb -1].img}.jpg`
    mainAudio.src = `songs/${allMusic[indexNumb -1].src}.mp3`
}
function playMusic(){
    wrraper.classList.add('paused')
    playPauseBtn.querySelector('i').innerText = "pause"
    mainAudio.play();
    nowPlaying()
}
function pauseMusic(){
    wrraper.classList.remove('paused')
    playPauseBtn.querySelector('i').innerText = "play_arrow"
    mainAudio.pause();
    nowPlaying()
}
function nextMusic(){
    musicIndex ++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex
    loadMusic(musicIndex)
    playMusic()
    nowPlaying()

}
function prevMusic(){
    musicIndex --;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex
    loadMusic(musicIndex)
    playMusic()
    nowPlaying()

}
// console.log(wrraper.classList.contains)
playPauseBtn.addEventListener('click', ()=>{
    const isMusicPlaused = wrraper.classList.contains('paused');
    isMusicPlaused ? pauseMusic() : playMusic() ;
})
nextBtn.addEventListener('click', ()=>{
    nextMusic();
})
prevBtn.addEventListener('click', ()=>{
    prevMusic();
})
mainAudio.addEventListener('timeupdate',(e)=>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWhidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWhidth}%`;

    mainAudio.addEventListener('loadeddata' , () =>{
        musicDuration = wrraper.querySelector('.duration')

        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10){
            totalSec = `0${totalSec}`
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`

    });
    let musicCurrentTime = wrraper.querySelector('.current')
    let currentMin = Math.floor(currentTime / 60)
    let currentSec = Math.floor(currentTime % 60)
    if (currentSec < 10){
        currentSec = `0${currentSec}`
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`
})
progressArea.addEventListener('click',(e)=>{
    const currentTime = e.target.currentTime;
    let progresswidthvl = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;
    mainAudio.currentTime = (clickedOffsetX / progresswidthvl) * songDuration;
    console.log(progresswidthvl)
    playMusic()
})
repeatBtn.addEventListener('click', ()=>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case'repeat':
            repeatBtn.innerText = 'repeat_one'
            repeatBtn.setAttribute('title', 'Song Looped')
            break;
        case'repeat_one':
            repeatBtn.innerText = 'shuffle'
            repeatBtn.setAttribute('title', 'Playback Shuffle')
            break;
        case'shuffle':
            repeatBtn.innerText = 'repeat'
            repeatBtn.setAttribute('title', 'PlayList Looped')
            break;
    }
})
mainAudio.addEventListener('ended', ()=>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case'repeat':
            nextMusic();
            break;
        case'repeat_one':
            mainAudio.currentTime = 0;
            loadMusic(musicIndex)
            playMusic();
            break;
        case'shuffle':
            let randIndex= Math.floor((Math.random() * allMusic.length) +1)
            do {
                let randIndex= Math.floor((Math.random() * allMusic.length) +1)
            } while (musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex)
            playMusic()
            break;
    }

})

showMoreBtn.addEventListener('click',()=>{
    musicList.classList.toggle('showmusicList')
});
hideMusicBtn.addEventListener('click', ()=>{
    showMoreBtn.click()
})
const ulTag = wrraper.querySelector('ul')
for (let i = 0; i < allMusic.length; i++) {
    let liTag = `
        <li li-index="${i + 1}">
        <div class="row">
        <span>${allMusic[i].name}</span>
        <p>${allMusic[i].artist}</p>
          </div>
          <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
         <span id="${allMusic[i].src}">3:40</span>
        </li>
    `
    ulTag.insertAdjacentHTML('beforeend', liTag)

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`)
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`)

    liAudioTag.addEventListener('loadeddata', ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10){
            totalSec = `0${totalSec}`
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`

    })

}
const allLiTags = ulTag.querySelectorAll('li')
function nowPlaying(){
    for (let j = 0; j < allLiTags.length; j++) {

        if(allLiTags[j].classList.contains('playing')){
            allLiTags[j].classList.remove('playing')
        }
        if(allLiTags[j].getAttribute('li-index') == musicIndex){
            allLiTags[j].classList.add('playing')
        }

        allLiTags[j].setAttribute('onclick','clicked(this)')
    }
}

function clicked(element){
    let getLiIndex = element.getAttribute('li-index')
    musicIndex = getLiIndex
    loadMusic(musicIndex)
    playMusic()
    nowPlaying()
}