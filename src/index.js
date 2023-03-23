import { refs } from './services/refs';
import { fetchPixabay, updatePage} from './services/fetchPixabay';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from 'lodash.throttle';
import { generateMarkapCard } from './services/generateMarkapCard';

let categorySearch = '';

const DEBOUNCE_DELAY = 1500;
const gallery = new SimpleLightbox('.gallery a');

refs.formEl.addEventListener('submit', seachElements);
refs.loadBtnEl.addEventListener('click', paginatePixabay);
// window.addEventListener('scroll', throttle(endlessScroll, DEBOUNCE_DELAY));
// refs.loaderEl.classList.remove('loader-flex');

async function seachElements(event) { 
    event.preventDefault();
    updateGallery();
    categorySearch = event.target.searchQuery.value;

    try {
        const collection = await fetchPixabay(categorySearch);
        
        if(collection.hits.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");

            return;
        }   
        
        refs.cardsEl.insertAdjacentHTML('beforeend', generateMarkapCard(collection.hits));

        refs.loadBtnEl.classList.remove('hidden');
        refs.loadBtnEl.classList.add('load-more');

        Notiflix.Notify.success(`Hooray! We found ${collection.hits.length} images.`);

        gallery.refresh();

    } catch (error){
        console.log(error);
    }
}

async function paginatePixabay () {
    updatePage();
    
    try {
        const collection = await fetchPixabay(categorySearch);
        
        if(collection.hits.length === 0) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");

            refs.loadBtnEl.classList.add('hidden');
            refs.loadBtnEl.classList.remove('load-more');

            return;
        }
    
        refs.cardsEl.insertAdjacentHTML('beforeend', generateMarkapCard(collection.hits));
        gallery.refresh();

        // refs.loaderEl.classList.add('loader-flex');
        
    } catch (error){
        console.log(error);
    }
}

// function endlessScroll () {
//     const documentRect = document.documentElement.getBoundingClientRect();
    
//     if(documentRect.bottom < document.documentElement.clientHeight + 100) {
//         paginatePixabay();
//     }
// }

function updateGallery () {
    refs.cardsEl.innerHTML = '';
}



