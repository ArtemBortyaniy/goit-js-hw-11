const BASE_PIXABAY_URL = 'https://pixabay.com/api/';
const saearchParams = new URLSearchParams({
    key : '34616553-8cb9dbb490290e4b0963e806d',
    image_type : 'photo',
    orientation : 'horizontal',
    safesearch : 'true',
});

function fetchPixabay(collection) {
    return fetch(`${BASE_PIXABAY_URL}?q=${collection}&${saearchParams}&page=${page}&per_page=40`)
    .then(response => {
        if(!response.ok) {
            throw new Error(response.status);
        }

        return response.json();
    });
}

export { fetchPixabay };
