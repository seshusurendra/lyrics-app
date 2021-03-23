const searchButton = document.querySelector('.searchButton');
const searchBox = document.querySelector('.searchBox');
const contentBlock = document.querySelector('.contentBlock');
const warningText = document.querySelector('.warningText');
const pagination = document.querySelector('.pagination');
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');

pagination.style.display = 'none';

function showWarning() {
  warningText.style.display = 'block';
}

function hideWarning() {
  warningText.style.display = 'none';
}

searchButton.addEventListener('click', () => {
  const inputValue = searchBox.value;
  // contentBlock.innerHTML = '';
  if (!inputValue) {
    showWarning();
  } else {
    hideWarning();
    fetch(`https://api.lyrics.ovh/suggest/${inputValue}`).then((response) => response.json()).then((response) => {
      // console.log(response)
      // response = JSON.parse(response);
      const albumsData = response.data;
      // const albumsTotal = response.total;
      // const nextUrl = response.next;
      // const prevUrl = response.prev;
      contentBlock.innerHTML = '';
      // console.log(albumData);
      // console.log(albumsTotal);
      // console.log(nextUrl);

      albumsData.forEach((details) => {
        contentBlock.innerHTML += `<div class="card">
          <img class='coverPage' src="${details.album.cover}" alt="Avatar">
            <div class='titles' id='songTitle' ><b>Song Title: ${details.title}</b></div> 
            <div class='titles' id='artistName'>Artist: ${details.artist.name}</div><br/>
            <button class='showLyricsBtn' id="${details.id}" artist="${details.artist.name}" title="${details.title}">Show Lyrics</button></div>
        `;
      });
      // console.log(response.next)
      if (response.next) {
        pagination.style.display = 'block';

        // nextBtn.addEventListener('click', () => {
        //   fetch()
        // });
        if (!response.prev) {
          prevBtn.disabled = true;
        } else {
          prevBtn.disabled = false;
        }
      } else {
        pagination.style.display = 'none';
      }
    });
  }
});

contentBlock.addEventListener('click', (event) => {
  if (event.target.id.length !== 0 && document.getElementById(event.target.id).hasAttribute('artist')) {
    const artist = document.getElementById(event.target.id).getAttribute('artist');
    const songTitle = document.getElementById(event.target.id).getAttribute('title');
    const lyricsurl = `https://api.lyrics.ovh/v1/${artist}/${songTitle}`;
    fetch(lyricsurl).then((response) => response.json()).then((resp) => {
      if (resp.lyrics.length === 0) {
        // console.log('No lyrics available');
        contentBlock.innerHTML = '';
        // eslint-disable-next-line quotes
        contentBlock.innerHTML = `<h2 style="text-align: center">Lyrics not Available</h2>`;
        pagination.style.display = 'none';
      } else {
        // console.log(resp);
        // console.log(resp.lyrics.length);
        // pagination.style.display = 'none';
        contentBlock.innerHTML = '';
        contentBlock.innerHTML += `<div class='cardLyrics'>
        <p id='songTitle' class='title'>${songTitle}</p>
        <p id='artistTitle' class='title'>By ${artist}</p>
        <p class='lyrics'>${resp.lyrics}</div>`;
      }
    });
  }
});

window.addEventListener('load', () => {
  contentBlock.innerHTML = 'Get Lyrics of your favorite Songs';
  pagination.style.display = 'none';
  hideWarning();
});
