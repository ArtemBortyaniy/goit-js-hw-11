import { refs } from './services/refs';
import { fetchPixabay, updatePage} from './services/fetchPixabay';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from 'lodash.throttle';

let categorySearch = '';
let totalHits = 40;

const DEBOUNCE_DELAY = 1500;
const gallery = new SimpleLightbox('.gallery a');

refs.formEl.addEventListener('submit', seachElements);
refs.loadBtnEl.addEventListener('click', paginatePixabay);
window.addEventListener('scroll', throttle(endlessScroll, DEBOUNCE_DELAY));
refs.loaderEl.classList.remove('loader-flex');

async function seachElements(event) { 
    event.preventDefault();
    updateGallery();
    categorySearch = event.target.searchQuery.value;

    try {
        const collection = await fetchPixabay(categorySearch);
        
        if(collection.hits.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        }
        
        refs.cardsEl.insertAdjacentHTML('beforeend', generateMarkapCard(collection.hits));
        refs.loadBtnEl.classList = 'btn-block';
        gallery.refresh();

    } catch (error){
        console.log(error);
    }
}

async function paginatePixabay () {
    updatePage();
    totalHits += 40;
    
    try {
        const collection = await fetchPixabay(categorySearch);
        
        if(totalHits === 520) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            return;
        }
    
        refs.cardsEl.insertAdjacentHTML('beforeend', generateMarkapCard(collection.hits));
        gallery.refresh();
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

        refs.loaderEl.classList.add('loader-flex');
        
    } catch (error){
        console.log(error);
    }
}

function endlessScroll () {
    const documentRect = document.documentElement.getBoundingClientRect();
    
    if(documentRect.bottom < document.documentElement.clientHeight + 100) {
        paginatePixabay();
    }
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
    refs.cardsEl.innerHTML = '';
}



