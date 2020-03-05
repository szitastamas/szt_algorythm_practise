
// Splitting an array into X pieces, creating an array of objects in the meanwhile
const array = [1,2,3,4,5,6,7,8,9];

const splitArray = (arr, size) => {

    const arrCopy = [...arr];
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

const friends =[
    {
        name: 'Felix',
        noGos: ['tomatoes', 'eggs'],
        preferences: ['basil', 'mozzarella'],
    }, 
    {
        name: 'Ilja',
        noGos: ['mushrooms', 'spinach'],
        preferences: ['parmesan', 'eggs'],
    },
    {
        name: 'Norma',
        noGos: ['bacon', 'salami'],
        preferences: ['garlic', 'parmesan'],
    }, 
    {
        name: 'Philipp',
        noGos: ['spinach', 'parmesan'],
        preferences: ['garlic', 'basil'],
    }
];


// First approach - Does not work properly
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
        const noGoPizzas = [...new Set(
            friend.noGos.map(nogo => {
                return pizzaOffers.filter(pizza => pizza.toppings.includes(nogo));
            })
            .flat()
            .map(pizza => pizza.name)
        )];

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

// console.log(printPizzaFans(friends, pizzaOffers));

// Second approach - Works as intended - Refactoring necessary
const printPizzaFansVTwo = (friends, pizzaOffers) => {

    return friends.map(friend => {

        const preferredPizzas = pizzaOffers.filter(pizza => {
            if(
                friend.preferences.some(pref => pizza.toppings.includes(pref)) === true && 
                friend.noGos.some(nogo => pizza.toppings.includes(nogo)) === false
            ){
                return pizza;
            }
        });

        const pizzaArray = [];
        friend.preferences.forEach(pref => {

            preferredPizzas.forEach(pizza => {
                if(pizza.toppings.includes(pref)){
                    
                    if(pizzaArray.filter(p => p.name == pizza.name).length > 0){
                        pizzaArray.find(p => p.name == pizza.name).matchCounter++;
                    }else{
                        pizzaArray.push({name: pizza.name, matchCounter: 1});
                    }
                }
            })
        });

        const mostlyMatchedPrefCounter = pizzaArray.reduce((acc, val) => {
            return [...acc, val.matchCounter]
        }, []).sort((a,b) => b-a)[0]
        
        const mostlyMatchedPizzas = pizzaArray.filter(pizza => pizza.matchCounter == mostlyMatchedPrefCounter).map(pizza => pizza.name).sort();
        let pizzaNameStringArray = '';

        mostlyMatchedPizzas.forEach((pizzaName, index, mostlyMatchedPizzas) => {
            if(mostlyMatchedPizzas.length > 1){
                if(index < mostlyMatchedPizzas.length - 1){
                    pizzaNameStringArray += `${pizzaName}, `
                }else{
                    pizzaNameStringArray += `${pizzaName}`
                }
            }else{
                pizzaNameStringArray = pizzaName;
            }
        })

        return{
            favouritePizza: pizzaNameStringArray,
            name: friend.name
        }

    })

}

// console.log(printPizzaFansVTwo(friends, pizzaOffers))

// Third approach - Works as intended - Refactoring done
const printPizzaFansVThree = (friends, pizzaOffers) => {

    return friends.map(friend => {

        const preferredPizzas = pizzaOffers.filter(pizza => {
            if(
                friend.preferences.some(pref => pizza.toppings.includes(pref)) === true && 
                friend.noGos.some(nogo => pizza.toppings.includes(nogo)) === false
            ){
                return pizza;
            }
        }).map(pizza => {
            return {
                ...pizza,
                matchCounter: pizza.toppings.reduce((acc, topping) => { return friend.preferences.includes(topping) ?  acc += 1 : acc }, 0)
            }
        });

        const mostlyMatchedPrefCounter = preferredPizzas.map(pizza => +pizza.matchCounter).sort((a,b) => b-a)[0];
        
        const mostlyMatchedPizzas = preferredPizzas.filter(pizza => pizza.matchCounter == mostlyMatchedPrefCounter).map(pizza => pizza.name).sort();

        const pizzaNameStringArray = mostlyMatchedPizzas.length > 1 ? mostlyMatchedPizzas.toString().replace(/,/g, ", ") : mostlyMatchedPizzas.toString();

        return{
            favouritePizza: pizzaNameStringArray,
            name: friend.name
        }

    })
}

// console.log(printPizzaFansVThree(friends, pizzaOffers))

// First approach - Works as intended - Refactoring needed
const printFriendsForAPizza = (pizza, friends) => {
    const friendPizzaDictionary = {};

    pizza.toppings.forEach(topping => {
        friends.forEach(friend => {
            if(!friend.noGos.some(nogo => pizza.toppings.includes(nogo))){
                if(friend.preferences.includes(topping)){
                    if(friendPizzaDictionary[friend.name]){
                        friendPizzaDictionary[friend.name]++;
                    }else{
                        friendPizzaDictionary[friend.name] = 1;
                    }
                }
            }
        })
    });

    const highestFriendPrefMatches = Object.values(friendPizzaDictionary).sort((a,b) => b-a)[0];


    const friendsToGetThePizza = Object.entries(friendPizzaDictionary).filter(entry => {
        if(entry[1] == highestFriendPrefMatches){
            return entry[0];
        }
    }).map(entry => entry[0])
    .sort();

    let friendNameStrings = '';

    if(friendsToGetThePizza.length > 0){
        friendsToGetThePizza.forEach((friend, index) => {
            if(index < friendsToGetThePizza.length - 1){
                friendNameStrings += `${friend}, `
            }else{
                friendNameStrings += friend
            }
        })
    }else{
        friendNameStrings = friendsToGetThePizza;
    }


    return friendNameStrings;
}

console.log(printFriendsForAPizza(pizzaOffers[1], friends));


// Second approach - Works as intended - Refactoring done
const printFriendsForAPizzaVersionTwo = (pizza, friends) => {

    // Creating an object with friends and matchCounter for the pizzas that they would eat excluding all pizzas that contain a noGo topping
    const friendPizzaObject = friends.filter(friend => !friend.noGos.some(nogo => pizza.toppings.includes(nogo)))
        .map(friend => {
            return{
                name: friend.name,
                matchCounter: pizza.toppings.reduce((acc, topping) => {return friend.preferences.includes(topping) ? acc += 1 : acc}, 0)
            }
    });

    console.log(friendPizzaObject)
    // Finding out the highest matchCounter which will indicate which friend likes the particular pizza the most
    const highestFriendPrefMatches = +friendPizzaObject.map(obj => obj.matchCounter).sort((a,b) => b-a)[0];
    
    // Filtering out the friends whose matchCounter is the highest
    const friendsToGetThePizza = friendPizzaObject.filter(friendPizza => +friendPizza.matchCounter === +highestFriendPrefMatches).map(friendPizza => friendPizza.name);

    // Creating the string that contains the friends names separated by a comma and witch a space after the comma
    const friendNameStrings = friendsToGetThePizza.length > 1 ? friendsToGetThePizza.toString().replace(/,/g, ", ") : friendsToGetThePizza.toString();

    return friendNameStrings;
}

console.log(printFriendsForAPizzaVersionTwo(pizzaOffers[1], friends));


const checkPinCodeValidity = (pin) => {
    const regexForFour = new RegExp("^[0-9]{4}$")
    const regexForSix = new RegExp("^[0-9]{6}$")

    if(regexForFour.test(pin) === false && regexForSix.test(pin) === false){
        return false;
    }

    return true;
}

const str1 = "asdgasa";
const str2 = "asdfasgh";
const longest = (s1, s2) => {

    const combination = [...(s1+s2)].sort();
    return [...new Set(combination)].join("");
}

console.log(longest(str1, str2))