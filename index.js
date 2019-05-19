(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER = BASE_URL + '/posters/'
  const data = []
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []
  const data_panel = document.getElementById('data-panel')
  const movie = document.getElementById('movies')
  const genres = document.getElementById('genres')
  const genreslist = document.getElementById('genres-list')
  const genres_list = {
    "1": "Action",
    "2": "Adventure",
    "3": "Animation",
    "4": "Comedy",
    "5": "Crime",
    "6": "Documentary",
    "7": "Drama",
    "8": "Family",
    "9": "Fantasy",
    "10": "History",
    "11": "Horror",
    "12": "Music",
    "13": "Mystery",
    "14": "Romance",
    "15": "Science Fiction",
    "16": "TV Movie",
    "17": "Thriller",
    "18": "War",
    "19": "Western"
  }

  axios.get(`https://movie-list.alphacamp.io/api/v1/movies/`)
    .then((response) => {
      data.push(...response.data.results)
      displayDataList(data)
      getTotalPages(data)
      getPageData(1, data)
      displaygenres(genres_list)
    })
    .catch((err) => console.log(err))


  data_panel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
      console.log(event.target.dataset.id)
    }
  })

  genreslist.addEventListener('click', (event) => {
    console.log(event.target.dataset.genres)
    console.log(data)
    let results = []
    results = data.filter(movie => movie.genres.includes(parseInt(event.target.dataset.genres)))
    console.log(results)
    getTotalPages(results)
    getPageData(1, results)
  })

  function displaygenres(list) {
    for (i in list) {
      genres.innerHTML += `
          <button type="button" class="btn btn-secondary" data-genres=${i} >${list[i]}</button>
      `
    }
  }

  function displayDataList(data) {
    let htmlcontent = ''

    data.forEach((item, index) => {
      genres_info = ''
      for (i of item.genres) {
        genres_info += `
         <div class = 'd-inline  bg-dark text-white'> ${genres_list[i]} </div>
        `
      }
      htmlcontent += `
      <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body" style = 'height:71.2px;'>
              <h6 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              ${genres_info}
            </div>
          </div>
      </div>
      `
    })
    movie.innerHTML = htmlcontent
  }
  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  // 下方分頁列
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }
  //分頁列事件
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })
  //取得分頁資料
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }
})()


