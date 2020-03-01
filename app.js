
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
        chunk.forEach((num, index) => (obj[`num_${index+1}`] = num))
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
    toppings: ['garlic', 'basil', 'oregano', 'mushrooms', 'mozzarella']
},
{
    id: 3,
    name: 'Diavolo',
    toppings: ['tomatoes', 'parmesan', 'salami', 'pepperoni']
}];

const friends = [{
    name: 'Felix',
    noGos: ['tomatoes', 'eggs'],
    preferences: ['basil', 'mozzarella', 'salami', 'garlic'],
}, {
    name: 'Ilja',
    noGos: ['spinach'],
    preferences: ['parmesan', 'eggs', 'oregano', 'salami', 'garlic'],
}];



const printPizzaFans = (friends, pizzaOffers) => {
    const peopleAndTheirFavs = friends.map(friend => {

        const pizzaArray = [];
        friend.preferences.forEach(pref => {

            pizzaOffers.forEach(pizza => {
                if(pizza.toppings.includes(pref)){
                    
                    if(pizzaArray.filter(p => p.name == pizza.name).length > 0){
                        pizzaArray.find(p => p.name == pizza.name).matchCounter++;
                    }else{
                        pizzaArray.push({name: pizza.name, matchCounter: 1});
                    }
                }
            })
        });
        const noGoPizzas = [...new Set(friend.noGos.map(nogo => {
            return pizzaOffers.filter(pizza => pizza.toppings.includes(nogo));
        }).flat().map(pizza => pizza.name))];

        const filteredPizzaArray = pizzaArray.filter(pizza => !noGoPizzas.includes(pizza.name)).sort((a, b) => {
            return a.matchCounter > b.matchCounter;
        })
        
        const favPizzas = filteredPizzaArray.filter(favP => favP.matchCounter === filteredPizzaArray[0].matchCounter).map(p => p.name).sort();

        let pizzaNamesString = '';

        favPizzas.forEach((pizzaName, index) => {
            if(favPizzas.length > 1 ){
                if(index < favPizzas.length - 1){
                    pizzaNamesString += `${pizzaName}, `;
                }else {
                    pizzaNamesString += pizzaName;
                }
            }else{
                pizzaNamesString = pizzaName;
            }
        })


        return {
            favouritePizza: pizzaNamesString,
            name: friend.name
        }
    })

    return peopleAndTheirFavs;
}

console.log(printPizzaFans(friends, pizzaOffers));