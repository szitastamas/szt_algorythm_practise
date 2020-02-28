
// Splitting an array into X pieces, creating an array of objects in the meanwhile
const array = [1,2,3,4,5,6,7,8,9];

const splitArray = (arr, size) => {

    const arrCopy = arr.slice(0);
    const arrayOfNumberChunks = [];

    while(arrCopy.length > 0){
        arrayOfNumberChunks.push(arrCopy.splice(0, size));
    }

    // Each "chunk" will be mapped through and for each number an Object will be filled up and returned via forEach
    const arrayOfChunkObjects = arrayOfNumberChunks.map(chunk => {
        let obj = {};
        chunk.forEach((num, index) => (obj[`num_${index+1}`]= num))
        return obj;
    })

    // Alternative way - nested forEach loops
    // const arrayOfChunkObjects = [];
    // arrayOfNumberChunks.forEach((chunk) => {
    //     let objArray = [];
    //     chunk.forEach((num, index) => {
    //         const label = `num_${index+1}`;
    //         objArray.push({
    //             [label]: num
    //         })
    //     })
    //     arrayOfChunkObjects.push(objArray);
    // })

    return arrayOfChunkObjects;
}

const groupOfThree = splitArray(array, 3);
console.log("From: ", array)
console.log("To: ", groupOfThree)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PIZZA ORDERS REACT

const pizzaOffers = [{
    id: 1,
    name: 'Margherita',
    toppings: ['tomatoes', 'mozzarella', 'oregano', 'basil'],
},
{
    id: 2,
    name: 'Aranka',
    toppings: ['tomatoes', 'garlic', 'basil', 'oregano']
}];

const friends = [{
    name: 'Felix',
    noGos: ['tomatoes', 'eggs'],
    preferences: ['basil', 'mozzarella'],
}, {
    name: 'Ilja',
    noGos: ['mushrooms', 'spinach'],
    preferences: ['parmesan', 'eggs', 'oregano'],
}];

const printPizzaFans = (friends, pizzaOffers) => {
    const peopleAndTheirFavs = friends.map(friend => {
        const pizzaNamesForFriend = friend.preferences.map(pref => {
            const potentialPizzas = pizzaOffers.filter(pizza => pizza.toppings.includes(pref));
            console.log(potentialPizzas)
            
        })
        return {
            favouritePizza: Array.from(new Set(pizzaNamesForFriend.flat())).sort().toString(),
            name: friend.name
        }
    })
    return peopleAndTheirFavs;
}

console.log(printPizzaFans(friends, pizzaOffers));