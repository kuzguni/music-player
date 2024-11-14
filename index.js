const image = document.getElementById("cover"),
    title = document.getElementById("music-title"),
    artist = document.getElementById("music-artist"),
    currentTimeEl = document.getElementById("current-time"),
    durationEl = document.getElementById("duration"),
    progress = document.getElementById("progress"),
    playerProgress = document.getElementById("player-progress"),
    prevBtn = document.getElementById("prev"),
    nextBtn = document.getElementById("next"),
    playBtn = document.getElementById("play"),
    shuffleBtn = document.getElementById("shuffle"),
    repeatBtn = document.getElementById("repeat"),
    background = document.getElementById("bg-img"),
    volumeSlider = document.getElementById("volume-slider"),
    volumeLow = document.getElementById("volume-low"),
    volumeHigh = document.getElementById("volume-high"),
    playlistBtn = document.getElementById("toggle-playlist"),
    lyricBtn = document.getElementById("toggle-lyric"),
    mainPlaylistDiv = document.getElementById("main-playlist-div"),
    togglePlaylistBtn = document.getElementById("toggle-playlist"),
    toggleLyricBtn = document.getElementById("toggle-lyric");


const music = new Audio();

const songs = [
    {
        path: "assets/demo-song1.mp3",
        cover: "assets/no-one-noticed-the-marias.jpg",
        displayName: "No One Noticed",
        artist: "The Marias",
    },
    {
        path: "assets/demo-song2.mp3",
        cover: "assets/tough-lana-quavo.jpg",
        displayName: "Tough",
        artist: "Lana Del Rey, Quavo",
    },
    {
        path: "assets/demo-song3.mp3",
        cover: "assets/skinny-billie.jpg",
        displayName: "Skinny",
        artist: "Billie Eilish",
    },
    {
        path: "assets/demo-song4.mp3",
        cover: "assets/Go-NEFFEX.jpg",
        displayName: "Go!",
        artist: "NEFFEX",
    },
    {
        path: "assets/demo-song5.mp3",
        cover: "assets/somebody-else-1975.jpg",
        displayName: "Somebody Else",
        artist: "The 1975",
    },
    {
        path: "assets/demo-song6.mp3",
        cover: "assets/cigarettes-after-sex-cry.jpg",
        displayName: "Cry",
        artist: "Cigarettes After Sex",
    },
    {
        path: "assets/demo-song7.mp3",
        cover: "assets/cordiseps-veda-mektubu.jpg",
        displayName: "Veda Mektubu",
        artist: "Cordiseps",
    },
    {
        path: "assets/demo-song8.mp3",
        cover: "assets/finneas-for-cryin-out-loud.jpg",
        displayName: "For Cryin Out Loud",
        artist: "Finneas",
    },
    {
        path: "assets/demo-song9.mp3",
        cover: "assets/daftpunk.png",
        displayName: "Veridis Quo",
        artist: "Daft Punk",
    },
    {
        path: "assets/demo-song10.mp3",
        cover: "assets/lastdinnerpart.png",
        displayName: "Beatiful Boy",
        artist: "The Last Dinner Party",
    },
];

let musicIndex = 0;
let isPlaying = false;
let isShuffling = false;
let isRepeating = false;
let favSongs = [];
let shuffledSongs = [];
let currentPlayingIndex = 0;

// play button sorgu ve şekil değişimi
function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}


// durdur başlat sorgu ve şekil değişir
function playMusic() {
    isPlaying = true;
    playBtn.classList.replace("fa-play", "fa-pause");
    playBtn.setAttribute("title", "Pause");
    music.play();

    updatePlaylist();
    updatePlaylistButtons();
    updateFavPlaylistButtons();
}

function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace("fa-pause", "fa-play");
    playBtn.setAttribute("title", "Play");
    music.pause();

    updatePlaylist();
    updatePlaylistButtons();
    updateFavPlaylistButtons();
}

// şarkıyı yükler
function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;

    updateFavoriteIcon();
    updatePlaylistButtons();

    applyColor(song);
}

// shuffle sorgular ve müzik değiştirir
function changeMusic(direction) {
    if (isShuffling) {
        currentPlayingIndex = (currentPlayingIndex + direction + shuffledSongs.length) % shuffledSongs.length;
        musicIndex = songs.findIndex(song => song.path === shuffledSongs[currentPlayingIndex].path);
        loadMusic(shuffledSongs[currentPlayingIndex]);
    } else {
        musicIndex = (musicIndex + direction + songs.length) % songs.length;
        currentPlayingIndex = musicIndex;
        loadMusic(songs[musicIndex]);
    }
    playMusic();
}

function toggleShuffle() {
    isShuffling = !isShuffling;
    shuffleBtn.classList.toggle("active", isShuffling);
    shuffleBtn.setAttribute("title", isShuffling ? "Shuffle On" : "Shuffle Off");

    if (isShuffling) {
        shuffledSongs = [...songs];
        const currentSong = shuffledSongs.splice(musicIndex, 1)[0];
        shuffleArray(shuffledSongs);
        shuffledSongs.unshift(currentSong);
        currentPlayingIndex = 0;
    } else {
        currentPlayingIndex = musicIndex;
    }
    updatePlaylist();
    updatePlaylistButtons();
    updateFavPlaylistButtons();
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i],
            array[j]] = [array[j], array[i]];
    }
}

// Update
function updatePlaylist() {
    const playlist = document.getElementById("playlist");
    playlist.innerHTML = "";

    const displayedSongs = isShuffling ? shuffledSongs : songs;

    displayedSongs.forEach((song, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <img src="${song.cover}" alt="${song.displayName} cover" class="playlist-cover">
          <div class="song-info">
              <strong class="playlist-title">${song.displayName}</strong><br>
              <p class="playlist-artist">${song.artist}</p>
          </div>
          <i class="fa-solid fa-play play-button control-icons-playlist" title="Play" id="play"></i>
      `;
        playlist.appendChild(li);

        li.addEventListener("click", () => {
            const clickedSong = displayedSongs[index];
            if (clickedSong.path === songs[musicIndex].path) {
                togglePlay();
            } else {
                musicIndex = songs.findIndex((s) => s.path === clickedSong.path);
                loadMusic(songs[musicIndex]);
                playMusic();
                updatePlaylistButtons();
                updateFavPlaylistButtons();
            }
        });
    });
}

// repeat sorgular ve class değiştirir
function toggleRepeat() {
    isRepeating = !isRepeating;
    repeatBtn.classList.toggle("active", isRepeating);
    repeatBtn.setAttribute("title", isRepeating ? "Repeat On" : "Repeat Off");
}

// şarkı repeatde değilse sonrakine geçer, //
// repeat aktif ise aynı şarkı devam //
music.addEventListener("ended", () => {
    if (isRepeating) {
        playMusic();
    } else {
        changeMusic(1);
    }
});

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    const duration = music.duration;
    music.currentTime = (clickX / width) * duration;
}

function updateProgressBar() {
    const {duration, currentTime} = music;

    // İlerleme çubuğunu günceller
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Zamanı formatlama
    const formatTime = (time, isRemaining = false) => {
        if (isNaN(time) || time < 0) time = 0;
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${isRemaining ? "-" : ""}${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    // Kalan süreyi ve geçerli süreyi günceller
    durationEl.textContent = formatTime(duration - currentTime, true);
    currentTimeEl.textContent = formatTime(currentTime);
}

// ses ayarı ve güncellenmesi
function updateVolume() {
    music.volume = volumeSlider.value / 100;
    const value = volumeSlider.value;
    const percent = (value / 100) * 100;

    if (window.getComputedStyle(volumeSlider).background.includes("#212121")) {
        let averageColor;
        volumeSlider.style.background = `linear-gradient(to right, ${averageColor} ${percent}%, #fff ${percent}%)`;
    }
}

// +5 -5 ses azalımı
function adjustVolume(amount) {
    let newVolume = music.volume + amount;
    if (newVolume < 0) newVolume = 0;
    if (newVolume > 1) newVolume = 1;
    music.volume = newVolume;
    volumeSlider.value = newVolume * 100;

    volumeSlider.dispatchEvent(new Event("input"));
}

// Average color hesaplar
function calculateAverageColor(imageSrc, iconClasses) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;

    img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let r = 0,
            g = 0,
            b = 0;
        const totalPixels = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
        }

        r = Math.round(r / totalPixels);
        g = Math.round(g / totalPixels);
        b = Math.round(b / totalPixels);

        /** light, dark yüzdelik ayarı **/
        const averageColor = `rgb(${r}, ${g}, ${b})`;
        const lighterColor = lightenColor(averageColor, 30);
        const darkerColor = darkenColor(averageColor, 20);

        /** Apply multi-layer shadow to playlist-cover images **/
        const playlistCovers = document.querySelectorAll(".playlist-cover");
        playlistCovers.forEach((cover) => {
            cover.style.boxShadow = `
              rgba(${r}, ${g}, ${b}, 0.9) 0px 4px 8px,                
              rgba(${r}, ${g}, ${b}, 0.6) 10px 10px 30px,            
              rgba(${r}, ${g}, ${b}, 0.48) 10px 10px 20px,             
              rgba(${r}, ${g}, ${b}, 0.48) 5px 5px 10px,              
              rgba(${r}, ${g}, ${b}, 0.32) 0px 0px 2px                
            `;
        });

        /** Playlist, fav playlist border styles **/
        const playlistItems = document.querySelectorAll("#playlist li");
        playlistItems.forEach((item) => {
            item.style.borderImage = `radial-gradient(circle, ${darkerColor}, ${lighterColor}) 1`;
        });

        const favPlaylistItems = document.querySelectorAll("#favPlaylist li");
        favPlaylistItems.forEach((item) => {
            item.style.borderImage = `radial-gradient(circle, ${darkerColor}, ${lighterColor}) 1`;
        });

        /** Iconlar renk **/
        iconClasses.forEach((iconClass) => {
            const icons = document.querySelectorAll(`.${iconClass}`);
            icons.forEach((icon) => {
                icon.style.color = darkerColor;
            });
        });

        /** Volume slider renk **/
        volumeSlider.addEventListener("input", function () {
            const volumePercent = (this.value / this.max) * 100;
            this.style.background = `linear-gradient(to right, ${darkerColor} ${volumePercent}%, #fff ${volumePercent}%)`;
        });
        volumeSlider.dispatchEvent(new Event("input"));

        /** ProgressBar renk **/
        progress.style.backgroundColor = darkerColor;

        /** Renk tanımlama **/
        document.documentElement.style.setProperty('--td-main-darker', darkerColor);
        document.documentElement.style.setProperty('--td-main-lighter', lighterColor);
    };
}

// average color açık tonu hesaplar
function lightenColor(color, percent) {
    const [r, g, b] = color.match(/\d+/g).map(Number);
    const adjust = (value, percent) =>
        Math.min(
            255,
            Math.max(0, Math.round(value + ((255 - value) * percent) / 100))
        );
    return `rgb(${adjust(r, percent)}, ${adjust(g, percent)}, ${adjust(
        b,
        percent
    )})`;
}

// average color koyu tonu hesaplar
function darkenColor(color, percent) {
    const [r, g, b] = color.match(/\d+/g).map(Number);
    const adjust = (value, percent) =>
        Math.max(0, Math.round(value * (1 - percent / 100)));
    return `rgb(${adjust(r, percent)}, ${adjust(g, percent)}, ${adjust(
        b,
        percent
    )})`;
}

function applyColor(song) {
    calculateAverageColor(song.cover, [
        "title",
        "artist",
        "playlist-title",
        "playlist-artist",
        "volume-icons",
        "control-icons",
        "control-icons-playlist",
        "playlist-lyric-icons",
        "fav-triple-icon",
        "tab-link",
        "tab-link.active",
        "music-duration",
    ]);
}

// Playlist oluşturma //
function createPlaylist() {
    const playlist = document.getElementById("playlist");

    songs.forEach((song) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <img src="${song.cover}" alt="${song.displayName} cover" class="playlist-cover">
          <div class="song-info">
              <strong class="playlist-title">${song.displayName}</strong><br>
              <p class="playlist-artist">${song.artist}</p>
          </div>
          <i class="fa-solid fa-play play-button control-icons-playlist" title="Play" id="play"></i>
      `;
        playlist.appendChild(li);
    })
}

// Play/Pause Playlist fonksiyonu //
function playPauseOnPlaylist() {
    const playlistButtons = document.querySelectorAll("#playlist .play-button");
    const favPlaylistButtons = document.querySelectorAll("#favPlaylist .play-button");

    playlistButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const song = songs[index];
            if (song.path === songs[musicIndex].path) {
                togglePlay();
            } else {
                musicIndex = index;
                loadMusic(song);
                playMusic();
                updatePlaylistButtons(); // Güncelle
                updateFavPlaylistButtons(); // Güncelle
            }
        });
    });

    favPlaylistButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const song = favSongs[index];
            if (song.path === songs[musicIndex].path) {
                togglePlay();
            } else {
                musicIndex = songs.findIndex((s) => s.path === song.path);
                loadMusic(songs[musicIndex]);
                playMusic();
                updatePlaylistButtons(); // Güncelle
                updateFavPlaylistButtons(); // Güncelle
            }
        });
    });
}



// Favorilere ekler veya çıkarır
function toggleFavorite(song) {
    const popupMessage = document.getElementById('popup-message');

    /** Favorilerde olup olmadığını kontrol et **/
    const isFavorite = favSongs.some((fav) => fav.path === song.path);

    if (!isFavorite) {
        /** Favorilere ekle **/
        favSongs.push(song);
        addSongToPlaylist(song);
        saveFavorites();
        popupMessage.textContent = `Added to your favorites.`;
    } else {
        /** Favorilerden çıkar **/
        favSongs = favSongs.filter((fav) => fav.path !== song.path);
        removeSongFromPlaylist(song);
        saveFavorites();
        popupMessage.textContent = `${song.displayName} by ${song.artist} removed from your favorites.`;
    }

    updateFavoriteIcon();

    /** popup göster 2sn sonra gizle **/
    popupMessage.classList.add('show');
    setTimeout(() => {
        popupMessage.classList.remove('show');
    }, 2000);
}

// Favori ikonuna basınca favori durumunu değiştirir
document.getElementById("fav-icon").addEventListener("click", function () {
    const currentSong = songs[musicIndex];
    toggleFavorite(currentSong);
});

// favorileri playliste ekler
function addSongToPlaylist(song) {
    const favPlaylist = document.getElementById("favPlaylist");

    /** Playlistte şarkının zaten olup olmadığını kontrol et **/
    if (![...favPlaylist.children].some(li => li.dataset.path === song.path)) {
        const li = document.createElement("li");
        li.dataset.path = song.path;
        li.innerHTML = `
            <img src="${song.cover}" alt="${song.displayName} cover" class="playlist-cover">
            <div class="song-info">
                <strong class="playlist-title">${song.displayName}</strong><br>
                <p class="playlist-artist">${song.artist}</p>
            </div>
            <i class="fa-solid fa-play play-button control-icons-playlist" title="Play"></i>
        `;
        favPlaylist.appendChild(li);
    }
}

// Favorilerden şarkıyı siler
function removeSongFromPlaylist(song) {
    const favPlaylist = document.getElementById("favPlaylist");
    const songElement = [...favPlaylist.children].find(li => li.dataset.path === song.path);

    if (songElement) {
        favPlaylist.removeChild(songElement);
    }
}

// Şarkı değiştiğinde favori ikonunu günceller
function updateFavoriteIcon() {
    const currentSong = songs[musicIndex];
    const favIcon = document.getElementById("fav-icon");

    /** Sadece şu anki şarkıya göre ikon durumu güncellenir **/
    if (favSongs.some((fav) => fav.path === currentSong.path)) {
        favIcon.classList.remove("fa-regular");
        favIcon.classList.add("fa-solid");
    } else {
        favIcon.classList.remove("fa-solid");
        favIcon.classList.add("fa-regular");
    }
}

// localStorage'a favları kaydeder.
function saveFavorites() {
    localStorage.setItem("favSongs", JSON.stringify(favSongs));
}

// localStorage'dan kayıtlı favorileri yükler
function loadFavorites() {
    const savedFavorites = localStorage.getItem("favSongs");
    if (savedFavorites) {
        favSongs = JSON.parse(savedFavorites);
        favSongs.forEach((song) => {
            addSongToPlaylist(song);
        });
    }
}

// Play/Pause synchronization //
function updatePlaylistButtons() {
    const buttons = document.querySelectorAll("#playlist .play-button");
    const displayedSongs = isShuffling ? shuffledSongs : songs;

    buttons.forEach((btn, index) => {
        const isCurrentSong = displayedSongs[index].path === songs[musicIndex].path;
        if (isCurrentSong && isPlaying) {
            btn.classList.replace("fa-play", "fa-pause");
        } else {
            btn.classList.replace("fa-pause", "fa-play");
        }
    });
}

// Play/Pause synchronization //
function updateFavPlaylistButtons() {
    const buttons = document.querySelectorAll("#favPlaylist .play-button");
    buttons.forEach((btn, index) => {
        const favSong = favSongs[index];
        const isCurrentSong = favSong ? favSong.path === songs[musicIndex]?.path : false;
        if (isCurrentSong && isPlaying) {
            btn.classList.replace("fa-play", "fa-pause");
        } else {
            btn.classList.replace("fa-pause", "fa-play");
        }
    });
}

// fav ve all arası menü geçişleri //
function openTab(tabId) {
    const tabPanes = document.querySelectorAll(".tab-pane");
    tabPanes.forEach((pane) => {
        pane.classList.remove("active");
    });

    const tabLinks = document.querySelectorAll(".tab-link");
    tabLinks.forEach((link) => {
        link.classList.remove("active");
    });

    document.getElementById(tabId).classList.add("active");
    document
        .querySelector(`.tab-link[onclick="openTab('${tabId}')"]`)
        .classList.add("active");
}


// Cihazın mobil olup olmadığını kontrol eden fonksiyon //
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Volume slider'ı gizleyen fonksiyon //
function hideVolumeSlider() {
    if (isMobileDevice()) {
        const volumeSlider = document.getElementById('volume-slider');
        const volumeControl = document.querySelector('.volume-control');
        if (volumeSlider) {
            volumeSlider.style.display = 'none';
        }
        if (volumeControl) {
            volumeControl.style.display = 'none';
        }
    }
}


// Event Listeners //
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", () => {
    if (music.currentTime < 10) {
        changeMusic(-1);
    } else {
        music.currentTime = 0;
        if (!isPlaying) {
            music.play();
            isPlaying = true;
            playBtn.classList.replace("fa-play", "fa-pause");
            playBtn.setAttribute("title", "Pause");
        }
    }
});
shuffleBtn.addEventListener("click", toggleShuffle);
nextBtn.addEventListener("click", () => changeMusic(1));
repeatBtn.addEventListener("click", toggleRepeat);
music.addEventListener("timeupdate", updateProgressBar);
playerProgress.addEventListener("click", setProgressBar);
volumeSlider.addEventListener("input", updateVolume);
volumeHigh.addEventListener("click", () => adjustVolume(0.05));
volumeLow.addEventListener("click", () => adjustVolume(-0.05));
togglePlaylistBtn.addEventListener("click", () => {
    togglePlaylistBtn.classList.toggle("active");
    mainPlaylistDiv.classList.toggle("hide");
    mainPlaylistDiv.classList.toggle("show");
});
toggleLyricBtn.addEventListener("click", () => {
    toggleLyricBtn.classList.toggle("active");
});
document.addEventListener('DOMContentLoaded', hideVolumeSlider);

// Media Player Shortcuts //
document.addEventListener('keydown', function(event) {
    if (event.key === 'w') {
        if (music.currentTime < 10) {
            music.currentTime = 0;
            if (!isPlaying) {
                music.play();
                isPlaying = true;
                playBtn.classList.replace("fa-play", "fa-pause");
                playBtn.setAttribute("title", "Pause");
            }
        } else {
            changeMusic(-1);
        }
    } else if (event.code === 'Space' || event.key === 'MediaPlayPause') {
        togglePlay();
    } else if (event.code === 'ArrowRight' || event.key === 'MediaTrackNext') {
        changeMusic(1);
    } else if (event.code === 'ArrowLeft' || event.key === 'MediaTrackPrevious') {
        changeMusic(-1);
    } else if (event.code === 'ArrowUp') {
        adjustVolume(0.05);
    } else if (event.code === 'ArrowDown') {
        adjustVolume(-0.05);
    }
});


loadMusic(songs[musicIndex]);
createPlaylist();
loadFavorites();
updateFavoriteIcon();
playPauseOnPlaylist();
