import axios from "axios";
const BASE_PIXABAY_URL = 'https://pixabay.com/api/';
const saearchParams = new URLSearchParams({
    key : '34616553-8cb9dbb490290e4b0963e806d',
    image_type : 'photo',
    orientation : 'horizontal',
    safesearch : 'true',
});

async function fetchPixabay(collection) {
    const response = await axios(`${BASE_PIXABAY_URL}?q=${collection}&${saearchParams}&page=${page}&per_page=40`)
    const newCollection = await response.data;

    return newCollection;
}

export { fetchPixabay };
