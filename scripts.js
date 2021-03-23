const searchButton = document.querySelector('.searchButton');
const searchBox = document.querySelector('.searchBox');
const contentBlock = document.querySelector('.contentBlock');
const warningText = document.querySelector('.warningText');
const pagination = document.querySelector('.pagination');
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
const lyricsBlock = document.querySelector('.lyricsBlock');
const lyricsCloseBtn = document.querySelector('.lyricsCloseBtn');
const lyricsCard = document.querySelector('.lyricsCard');
let nextUrl;
let prevUrl;
const corsUrl = 'https://cors-anywhere.herokuapp.com';

lyricsCloseBtn.addEventListener('click', () => {
  lyricsBlock.style.display = 'none';
  lyricsCloseBtn.style.display = 'none';
  lyricsCard.style.display = 'none';
  contentBlock.style.display = 'block';
});

function showWarning() {
  warningText.style.display = 'block';
}

function hideWarning() {
  warningText.style.display = 'none';
}
// eslint-disable-next-line no-unused-vars
async function showLyrics(artist, title) {
  // console.log(artist, title);
  pagination.style.display = 'none';
  fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`).then((response) => response.json()).then((data) => {
    // console.log(data);
    lyricsBlock.style.display = 'block';
    lyricsCloseBtn.style.display = 'block';
    lyricsCard.style.display = 'block';
    contentBlock.style.display = 'none';
    lyricsCard.innerHTML = (data.lyrics) ? data.lyrics : 'Lyrics Not Available';
    // if (data.lyrics !== '') {
    //   lyricsBlock.style.display = 'block';
    //   lyricsCloseBtn.style.display = 'block';
    //   lyricsCard.style.display = 'block';
    //   contentBlock.style.display = 'none';
    //   lyricsCard.innerHTML = data.lyrics;
    // } else {
    //   lyricsBlock.style.display = 'block';
    //   lyricsCloseBtn.style.display = 'block';
    //   lyricsCard.style.display = 'block';
    //   contentBlock.style.display = 'none';
    //   lyricsCard.innerHTML = 'Lyrics Not Available';
    // }
  });
}

async function showLyricsAlbums(response) {
  const albumsData = response.data;
  // const albumsTotal = response.total;
  // const nextUrl = response.next;
  // const prevUrl = response.prev;
  // console.log(albumData);
  // console.log(albumsTotal);
  // console.log(nextUrl);
  albumsData.forEach((details) => {
    contentBlock.innerHTML += `<div class="card">
          <img id='coverPage' src="${details.album.cover}" alt="Avatar">
          <div class='dataBlock'>
            <div class='metadata' id='songTitle' ><b>Song Title: ${details.title}</b></div> 
            <div class='metadata' id='artistName'>Artist: ${details.artist.name}</div><br/>
            <button class='showLyricsBtn' id="${details.id}" artist="${details.artist.name}" title="${details.title}" onClick='showLyrics("${details.artist.name}", "${details.title}")'>Show Lyrics</button></div>
          </div>
        `;
  });
  if (response.next || response.prev) {
    pagination.style.display = 'block';
  } else {
    pagination.style.display = 'none';
  }
  if (response.next) {
    // console.log(response.next);
    nextUrl = response.next;
    nextBtn.disabled = false;
  } else {
    nextBtn.disabled = true;
  }
  if (response.prev) {
    // console.log(response.prev);
    prevUrl = response.prev;
    prevBtn.disabled = false;
  } else {
    prevBtn.disabled = true;
  }
}

searchButton.addEventListener('click', () => {
  const searchString = searchBox.value;
  if (!searchString) {
    showWarning();
  } else {
    hideWarning();
    contentBlock.innerHTML = '';
    lyricsBlock.style.display = 'none';
    lyricsCloseBtn.style.display = 'none';
    lyricsCard.style.display = 'none';
    contentBlock.style.display = 'block';
    fetch(`https://api.lyrics.ovh/suggest/${searchString}`).then((response) => response.json()).then((data) => {
      showLyricsAlbums(data);
    });
  }
});

nextBtn.addEventListener('click', () => {
  const getRedirectUrl = nextUrl;
  const apiHeaders = { 'Accept-Charset': 'utf-8', 'Content-Type': 'application/json', 'X-Requested-With': 'xhr' };
  fetch(`${corsUrl}/${getRedirectUrl}`, apiHeaders).then((response) => response.json()).then((data) => {
    // console.log(data);
    contentBlock.innerHTML = '';
    showLyricsAlbums(data);
  });
});

prevBtn.addEventListener('click', () => {
  const getRedirectUrl = prevUrl;
  const apiHeaders = { 'Accept-Charset': 'utf-8', 'Content-Type': 'application/json', 'X-Requested-With': 'xhr' };
  fetch(`${corsUrl}/${getRedirectUrl}`, apiHeaders).then((response) => response.json()).then((data) => {
    // console.log(data);
    contentBlock.innerHTML = '';
    showLyricsAlbums(data);
  });
});

window.addEventListener('load', () => {
  hideWarning();
  lyricsBlock.style.display = 'none';
  pagination.style.display = 'none';
  // eslint-disable-next-line quotes
  contentBlock.innerHTML = `<div class='titleBlock'>Search Your Favorite song lyrics from here</div>`;
});
