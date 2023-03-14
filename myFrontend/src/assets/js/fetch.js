const url = "http://localhost:3000/api/pricemax";

export async function getMaxPrice() {
    fetch(url)
    .then((res) => res.json() )
    .then((data) => {
        return data.maxPrice;
    })
}