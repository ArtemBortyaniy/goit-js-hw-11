import axios from "axios";
const BASE_PIXABAY_URL = 'https://pixabay.com/api/';
const saearchParams = new URLSearchParams({
    key : '34616553-8cb9dbb490290e4b0963e806d',
    image_type : 'photo',
    orientation : 'horizontal',
    safesearch : 'true',
    per_page : '40',
});

let page = 1;

async function fetchPixabay(collection) {
    const response = await axios(`${BASE_PIXABAY_URL}?q=${collection}&${saearchParams}&page=${page}`)
    const newCollection = await response.data;

    return newCollection;
}

function updatePage() {
    return page += 1;
}

export { fetchPixabay, updatePage};
