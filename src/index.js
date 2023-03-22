import { refs } from './services/refs';
import { fetchPixabay} from './services/fetchPixabay';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let categorySearch = '';
let totalHits = 40;

refs.formEl.addEventListener('submit', seachElements);
refs.loadBtnEl.addEventListener('click', paginatePixabay);

const gallery = new SimpleLightbox('.gallery a');

function seachElements(event) {
    event.preventDefault();
    page = 1;
    updateGallery();
    categorySearch = event.target.searchQuery.value;

    fetchPixabay(categorySearch).then(data => {
        if(data.hits.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        }
        
        refs.cardsEl.insertAdjacentHTML('beforeend', generateMarkapCard(data.hits));
        refs.loadBtnEl.classList = 'btn-block';
        gallery.refresh();
    });
}

function paginatePixabay () {
    page = 1 + page;
    totalHits += 40;
    
    fetchPixabay(categorySearch).then(data => {
        if(totalHits === 520) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            return
        }
        refs.cardsEl.insertAdjacentHTML('beforeend', generateMarkapCard(data.hits));
        gallery.refresh();
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    });
}

function generateMarkapCard (data) {
    return [...data].map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => { 
        return `
        <div class="photo-card">
        <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" title="${tags} "loading="lazy" />
        </a>
            <div class="info">
            <p class="info-item">
                <b>Likes</b>
                ${likes}
            </p>
            <p class="info-item">
                <b>Views</b>
                ${views}
            </p>
            <p class="info-item">
                <b>Comments</b>
                ${comments}
            </p>
            <p class="info-item">
                <b>Downloads</b>
                ${downloads}
            </p>
            </div>
        </div>`
    }).join('');
}

function updateGallery () {
    refs.cardsEl.innerHTML = ''
}




