// Splitting an array into X pieces, creating an array of objects in the meanwhile
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const splitArray = (arr, size) => {
	const arrCopy = [...arr];
	const arrayOfNumberChunks = [];

	while (arrCopy.length > 0) {
		arrayOfNumberChunks.push(arrCopy.splice(0, size));
	}

	// Each "chunk" will be mapped through and for each number an Object will be filled up and returned via forEach
	const arrayOfChunkObjects = arrayOfNumberChunks.map((chunk) => {
		let obj = {};
		chunk.forEach((num, index) => (obj[`num_${index + 1}`] = num));
		return obj;
	});

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
};

const groupOfThree = splitArray(array, 3);
console.log('From: ', array);
console.log('To: ', groupOfThree);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PIZZA ORDERS REACT

const pizzaOffers = [
	{
		id: 1,
		name: 'Margherita',
		toppings: ['tomatoes', 'mozzarella', 'oregano', 'basil']
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
	}
];

const friends = [
	{
		name: 'Felix',
		noGos: ['tomatoes', 'eggs'],
		preferences: ['basil', 'mozzarella']
	},
	{
		name: 'Ilja',
		noGos: ['mushrooms', 'spinach'],
		preferences: ['parmesan', 'eggs']
	},
	{
		name: 'Norma',
		noGos: ['bacon', 'salami'],
		preferences: ['garlic', 'parmesan']
	},
	{
		name: 'Philipp',
		noGos: ['spinach', 'parmesan'],
		preferences: ['garlic', 'basil']
	}
];

// First approach - Does not work properly
const printPizzaFans = (friends, pizzaOffers) => {
	const peopleAndTheirFavs = friends.map((friend) => {
		const pizzaArray = [];
		friend.preferences.forEach((pref) => {
			pizzaOffers.forEach((pizza) => {
				if (pizza.toppings.includes(pref)) {
					if (pizzaArray.filter((p) => p.name == pizza.name).length > 0) {
						pizzaArray.find((p) => p.name == pizza.name).matchCounter++;
					} else {
						pizzaArray.push({ name: pizza.name, matchCounter: 1 });
					}
				}
			});
		});
		const noGoPizzas = [
			...new Set(
				friend.noGos
					.map((nogo) => {
						return pizzaOffers.filter((pizza) => pizza.toppings.includes(nogo));
					})
					.flat()
					.map((pizza) => pizza.name)
			)
		];

		const filteredPizzaArray = pizzaArray
			.filter((pizza) => !noGoPizzas.includes(pizza.name))
			.sort((a, b) => {
				return a.matchCounter > b.matchCounter;
			});

		const favPizzas = filteredPizzaArray
			.filter((favP) => favP.matchCounter === filteredPizzaArray[0].matchCounter)
			.map((p) => p.name)
			.sort();

		let pizzaNamesString = '';

		favPizzas.forEach((pizzaName, index) => {
			if (favPizzas.length > 1) {
				if (index < favPizzas.length - 1) {
					pizzaNamesString += `${pizzaName}, `;
				} else {
					pizzaNamesString += pizzaName;
				}
			} else {
				pizzaNamesString = pizzaName;
			}
		});

		return {
			favouritePizza: pizzaNamesString,
			name: friend.name
		};
	});

	return peopleAndTheirFavs;
};

// console.log(printPizzaFans(friends, pizzaOffers));

// Second approach - Works as intended - Refactoring necessary
const printPizzaFansVTwo = (friends, pizzaOffers) => {
	return friends.map((friend) => {
		const preferredPizzas = pizzaOffers.filter((pizza) => {
			if (
				friend.preferences.some((pref) => pizza.toppings.includes(pref)) === true &&
				friend.noGos.some((nogo) => pizza.toppings.includes(nogo)) === false
			) {
				return pizza;
			}
		});

		const pizzaArray = [];
		friend.preferences.forEach((pref) => {
			preferredPizzas.forEach((pizza) => {
				if (pizza.toppings.includes(pref)) {
					if (pizzaArray.filter((p) => p.name == pizza.name).length > 0) {
						pizzaArray.find((p) => p.name == pizza.name).matchCounter++;
					} else {
						pizzaArray.push({ name: pizza.name, matchCounter: 1 });
					}
				}
			});
		});

		const mostlyMatchedPrefCounter = pizzaArray
			.reduce((acc, val) => {
				return [...acc, val.matchCounter];
			}, [])
			.sort((a, b) => b - a)[0];

		const mostlyMatchedPizzas = pizzaArray
			.filter((pizza) => pizza.matchCounter == mostlyMatchedPrefCounter)
			.map((pizza) => pizza.name)
			.sort();
		let pizzaNameStringArray = '';

		mostlyMatchedPizzas.forEach((pizzaName, index, mostlyMatchedPizzas) => {
			if (mostlyMatchedPizzas.length > 1) {
				if (index < mostlyMatchedPizzas.length - 1) {
					pizzaNameStringArray += `${pizzaName}, `;
				} else {
					pizzaNameStringArray += `${pizzaName}`;
				}
			} else {
				pizzaNameStringArray = pizzaName;
			}
		});

		return {
			favouritePizza: pizzaNameStringArray,
			name: friend.name
		};
	});
};

// console.log(printPizzaFansVTwo(friends, pizzaOffers))

// Third approach - Works as intended - Refactoring done
const printPizzaFansVThree = (friends, pizzaOffers) => {
	return friends.map((friend) => {
		const preferredPizzas = pizzaOffers
			.filter((pizza) => {
				if (
					friend.preferences.some((pref) => pizza.toppings.includes(pref)) === true &&
					friend.noGos.some((nogo) => pizza.toppings.includes(nogo)) === false
				) {
					return pizza;
				}
			})
			.map((pizza) => {
				return {
					...pizza,
					matchCounter: pizza.toppings.reduce((acc, topping) => {
						return friend.preferences.includes(topping) ? (acc += 1) : acc;
					}, 0)
				};
			});

		const mostlyMatchedPrefCounter = preferredPizzas.map((pizza) => +pizza.matchCounter).sort((a, b) => b - a)[0];

		const mostlyMatchedPizzas = preferredPizzas
			.filter((pizza) => pizza.matchCounter == mostlyMatchedPrefCounter)
			.map((pizza) => pizza.name)
			.sort();

		const pizzaNameStringArray =
			mostlyMatchedPizzas.length > 1
				? mostlyMatchedPizzas.toString().replace(/,/g, ', ')
				: mostlyMatchedPizzas.toString();

		return {
			favouritePizza: pizzaNameStringArray,
			name: friend.name
		};
	});
};

// console.log(printPizzaFansVThree(friends, pizzaOffers))

// First approach - Works as intended - Refactoring needed
const printFriendsForAPizza = (pizza, friends) => {
	const friendPizzaDictionary = {};

	pizza.toppings.forEach((topping) => {
		friends.forEach((friend) => {
			if (!friend.noGos.some((nogo) => pizza.toppings.includes(nogo))) {
				if (friend.preferences.includes(topping)) {
					if (friendPizzaDictionary[friend.name]) {
						friendPizzaDictionary[friend.name]++;
					} else {
						friendPizzaDictionary[friend.name] = 1;
					}
				}
			}
		});
	});

	const highestFriendPrefMatches = Object.values(friendPizzaDictionary).sort((a, b) => b - a)[0];

	const friendsToGetThePizza = Object.entries(friendPizzaDictionary)
		.filter((entry) => {
			if (entry[1] == highestFriendPrefMatches) {
				return entry[0];
			}
		})
		.map((entry) => entry[0])
		.sort();

	let friendNameStrings = '';

	if (friendsToGetThePizza.length > 0) {
		friendsToGetThePizza.forEach((friend, index) => {
			if (index < friendsToGetThePizza.length - 1) {
				friendNameStrings += `${friend}, `;
			} else {
				friendNameStrings += friend;
			}
		});
	} else {
		friendNameStrings = friendsToGetThePizza;
	}

	return friendNameStrings;
};

console.log(printFriendsForAPizza(pizzaOffers[1], friends));

// Second approach - Works as intended - Refactoring done
const printFriendsForAPizzaVersionTwo = (pizza, friends) => {
	// Creating an object with friends and matchCounter for the pizzas that they would eat excluding all pizzas that contain a noGo topping
	const friendPizzaObject = friends
		.filter((friend) => !friend.noGos.some((nogo) => pizza.toppings.includes(nogo)))
		.map((friend) => {
			return {
				name: friend.name,
				matchCounter: pizza.toppings.reduce((acc, topping) => {
					return friend.preferences.includes(topping) ? (acc += 1) : acc;
				}, 0)
			};
		});

	console.log(friendPizzaObject);
	// Finding out the highest matchCounter which will indicate which friend likes the particular pizza the most
	const highestFriendPrefMatches = +friendPizzaObject.map((obj) => obj.matchCounter).sort((a, b) => b - a)[0];

	// Filtering out the friends whose matchCounter is the highest
	const friendsToGetThePizza = friendPizzaObject
		.filter((friendPizza) => +friendPizza.matchCounter === +highestFriendPrefMatches)
		.map((friendPizza) => friendPizza.name);

	// Creating the string that contains the friends names separated by a comma and witch a space after the comma
	const friendNameStrings =
		friendsToGetThePizza.length > 1
			? friendsToGetThePizza.toString().replace(/,/g, ', ')
			: friendsToGetThePizza.toString();

	return friendNameStrings;
};

console.log(printFriendsForAPizzaVersionTwo(pizzaOffers[1], friends));

const checkPinCodeValidity = (pin) => {
	const regexForFour = new RegExp('^[0-9]{4}$');
	const regexForSix = new RegExp('^[0-9]{6}$');

	if (regexForFour.test(pin) === false && regexForSix.test(pin) === false) {
		return false;
	}

	return true;
};

// Longest combination of two strings with unique values
const str1 = 'asdgasa';
const str2 = 'asdfasgh';
const longest = (s1, s2) => {
	const combination = [...(s1 + s2)].sort();
	return [...new Set(combination)].join('');
};

//console.log(longest(str1, str2))

// Sorting only ODD numbers in a number array with the EVEN numbers staying in place
function sortArray(array) {
	if (array.length === 0) return array;

	const indexOfEvenNumbers = array.reduce(
		(acc, num, index) => (num % 2 === 0 ? [...acc, { [num]: index }] : acc),
		[]
	);

	const oddNumbersArray = array.filter((num) => num % 2 !== 0).sort((a, b) => a - b);

	indexOfEvenNumbers.forEach((numObject) => {
		const key = Object.keys(numObject);
		const value = Object.values(numObject);

		oddNumbersArray.splice(value, 0, +key);
	});

	return oddNumbersArray;
}

//console.log(sortArray([1,5,2,3,9,4]));

// Create a phone number from an array of 10 integers
function createPhoneNumber(numbers) {
	const firstThree = numbers.splice(0, 3).join('');
	const secondThree = numbers.splice(0, 3).join('');

	return `(${firstThree}) ${secondThree}-${numbers.join('')}`;
}

console.log(createPhoneNumber([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]));

// Finding the digital root of a number
function digital_root(n) {
	return n > 9 ? digital_root([...n.toString()].reduce((acc, num) => (acc += +num), 0)) : n;
}

//console.log(digital_root(132189))

// Counting how many characters occur more than once in a string
function duplicateCount(text) {
	const toBeCheckedText = [...text.toLowerCase()];

	const counterObject = toBeCheckedText
		.map((letter) => {
			return {
				...letter,
				counter: toBeCheckedText.filter((l) => l === letter).length
			};
		})
		.filter((obj) => obj.counter !== 1);

	return new Set(counterObject.map((count) => count[0])).size;
}

//console.log(duplicateCount("AbBaac"))

// Return the position (NOT THE INDEX) of the only odd / even number in the array
function iqTest(numbers) {
	const dictionary = {
		odd: [],
		even: []
	};
	numbers
		.split(' ')
		.forEach((elem, index) =>
			+elem % 2 !== 0 ? dictionary.odd.push({ elem, index }) : dictionary.even.push({ elem, index })
		);
	return dictionary.odd.length === 1 ? dictionary.odd[0].index + 1 : dictionary.even[0].index + 1;
}

//   console.log(iqTest("1 3 2 5"))
//   console.log(iqTest("2 4 8 1"))

// Move all the 0s to the end of the array
const moveZeros = function(arr) {
	const arrayOfZeros = arr.reduce((acc, elem) => (elem === 0 ? [...acc, elem] : acc), []);
	const arrayWithoutZeros = arr.filter((elem) => elem !== 0);

	return [...arrayWithoutZeros, ...arrayOfZeros];
};

//console.log(moveZeros([false,1,0,1,2,0,1,3,"a"]))

// Validate SUDOKU Solutions

const validSolution = (board) => {
	let isValid = true;

	for (let [index, row] of board.entries()) {
		if (row.includes(0)) {
			isValid = false;
			break;
		}

		if (new Set(row).size !== row.length) {
			isValid = false;
			break;
		}

		const column = board.map((row) => row[index]);
		if (new Set(column).size !== column.length) {
			isValid = false;
			break;
		}
	}

	const blockOfNine = [];
	let startIndex = 0;
	let endIndex = 3;

	const checkBlockValidity = (block) => {
		return new Set(block).size === 9;
	};

	for (let i = startIndex; i < endIndex; i++) {
		for (let x = 0; x < 3; x++) {
			blockOfNine.push(board[i][x]);
		}

		if (i === endIndex - 1) {
			if (checkBlockValidity(blockOfNine) === true && endIndex >= board[0].length == false) {
				startIndex += 3;
				endIndex += 3;
			} else if (checkBlockValidity(blockOfNine) === true && endIndex >= board[0].length == true) {
				isValid = true;
			} else {
				isValid = false;
				break;
			}
		}
	}

	return isValid;
};

console.log(
	validSolution([
		[5, 3, 4, 6, 7, 8, 9, 1, 2],
		[6, 7, 2, 1, 9, 0, 3, 4, 8],
		[1, 0, 0, 3, 4, 2, 5, 6, 0],
		[8, 5, 9, 7, 6, 1, 0, 2, 0],
		[4, 2, 6, 8, 5, 3, 7, 9, 1],
		[7, 1, 3, 9, 2, 4, 8, 5, 6],
		[9, 0, 1, 5, 3, 7, 2, 1, 4],
		[2, 8, 7, 4, 1, 9, 6, 3, 5],
		[3, 0, 0, 4, 8, 1, 1, 7, 9]
	])
);

//   Given an array of integers, find the first missing positive integer in linear time and constant space.
//   In other words, find the lowest positive integer that does not exist in the array.
//   The array can contain duplicates and negative numbers as well.

// For example, the input [3, 4, -1, 1] should give 2. The input [1, 2, 0] should give 3.

const findTheFirstSmallestPositiveNumber = (arr) => {
	const firstPositiveNumberWithoutNeighbour = arr
		.filter((num) => num > 0 && !arr.includes(num + 1))
		.sort((a, b) => a - b)[0];

	return firstPositiveNumberWithoutNeighbour + 1;
};

console.log(findTheFirstSmallestPositiveNumber([3, 4, -1, 1]));

// Implement the function unique_in_order which takes as argument a sequence and returns
// a list of items without any elements with the same value next to each other and preserving the original order of elements.

// For example:
// uniqueInOrder('AAAABBBCCDAABBB') == ['A', 'B', 'C', 'D', 'A', 'B']
// uniqueInOrder('ABBCcAD')         == ['A', 'B', 'C', 'c', 'A', 'D']
// uniqueInOrder([1,2,2,3,3])       == [1,2,3]

const uniqueInOrder = (iterable) => {
	if (Array.isArray(iterable)) return [...new Set(iterable)];

	const filteredIterable = iterable.split('').reduce((acc, letter, index, arr) => {
		return letter !== arr[index + 1] ? [...acc, letter] : acc;
	}, []);

	return filteredIterable;
};

console.log(uniqueInOrder('AAAABBBCCDAABBB'));
console.log(uniqueInOrder([1, 2, 2, 3, 3]));

// For example 99 will have "weight" 18, 100 will have "weight" 1 so in the list 100 will come before 99.
// Given a string with the weights of FFC members in normal order can you give this string ordered by "weights" of these numbers?

// Example:
// "56 65 74 100 99 68 86 180 90" ordered by numbers weights becomes: "100 180 90 56 65 74 68 86 99"

// When two numbers have the same "weight", let us class them as if they were strings (alphabetical ordering) and not numbers:
// 100 is before 180 because its "weight" (1) is less than the one of 180 (9) and 180 is before 90 since, having the same "weight" (9), it comes before as a string.

// All numbers in the list are positive numbers and the list can be empty.

function orderWeight(strng) {
	const noIdea = strng
		.trim()
		.split(' ')
		.reduce((acc, num) => {
			return [
				...acc,
				{
					num: num,
					weight: num.split('').reduce((acc, singleNum) => (acc += +singleNum), 0)
				}
			];
		}, [])
		.sort((a, b) => a.weight - b.weight);

	return noIdea
		.map((obj) => obj.num)
		.sort()
		.join(' ');
}

console.log(orderWeight('56 65 74 100 99 68 86 180 90'));



// Complete the solution so that it strips all text that follows any of a set of comment markers passed in. 
// Any whitespace at the end of the line should also be stripped out.
// Example:

// Given an input string of:
// apples, pears # and bananas
// grapes
// bananas !apples

// The output expected would be:
// apples, pears
// grapes
// bananas
// The code would be called like so:

// var result = solution("apples, pears # and bananas\ngrapes\nbananas !apples", ["#", "!"])
// result should == "apples, pears\ngrapes\nbananas"

function solution(input, markers) {
  
	const lines = input.split("\n");

	const clearedUpInput = lines.reduce((acc, line) => {
		const markerInLine = markers.filter(marker => line.includes(marker));
		if(markerInLine.length > 0){
			return [...acc, line.slice(0, line.indexOf(markerInLine)).trim()]
		}else{
			return [...acc, line]
		}
	}, []);

	return clearedUpInput.join("\n")

};

console.log(solution("apples, pears # and bananas\ngrapes\nbananas !apples", ["#", "!"]));


// You have to create a function that takes a positive integer number 
// and returns the next bigger number formed by the same digits:

// 12 ==> 21
// 513 ==> 531
// 2017 ==> 2071
// If no bigger number can be composed using those digits, return -1:

// 9 ==> -1
// 111 ==> -1
// 531 ==> -1

// function nextBigger(n){
	
// 	if(n < 10) return -1;

// 	if(new Set([...n.toString()]).size === 1) return -1

// 	if(parseInt([...n.toString()].sort((a,b) => +b-(+a)).join(""),10) === n) return - 1

// 	const startNumUnits = [...n.toString()].sort();
// 	let incrementNumber = n;
// 	let isFound = false;
// 	while(isFound === false){
// 		let areMatching = true;
// 		++incrementNumber;

// 		const incrementUnits = [...incrementNumber.toString()].sort();

// 		for(let i = 0; i < incrementUnits.length; i++){
// 			if(startNumUnits[i] !== incrementUnits[i]){
// 				areMatching = false;
// 				break;
// 			}
// 		}

// 		if(areMatching) isFound = true;

// 	}

// 	return incrementNumber;
// }

// console.log(nextBigger(513));


// Write a function that, given a string of text (possibly with punctuation and line-breaks),
// returns an array of the top-3 most occurring words, in descending order of the number of occurrences.

// Assumptions:
// A word is a string of letters (A to Z) optionally containing one or more apostrophes (') in ASCII. 
// (No need to handle fancy punctuation.)

// Matches should be case-insensitive, and the words in the result should be lowercased.
// Ties may be broken arbitrarily.
// If a text contains fewer than three unique words, then either the top-2 or top-1 words should be returned, 
// or an empty array if a text contains no words.

// Examples:
// top_3_words("In a village of La Mancha, the name of which I have no desire to call to
// mind, there lived not long since one of those gentlemen that keep a lance
// in the lance-rack, an old buckler, a lean hack, and a greyhound for
// coursing. An olla of rather more beef than mutton, a salad on most
// nights, scraps on Saturdays, lentils on Fridays, and a pigeon or so extra
// on Sundays, made away with three-quarters of his income.")
// # => ["a", "of", "on"]

// top_3_words("e e e e DDD ddd DdD: ddd ddd aa aA Aa, bb cc cC e e e")
// # => ["e", "ddd", "aa"]

// top_3_words("  //wont won't won't")
// # => ["won't", "wont"]

function topThreeWords(text) {

	if(text.length === 0) return [];

	const dictionary = {};

	text.toLowerCase().replace("\n", " ").split(" ").forEach(word => {
		if(!dictionary[word]){
			dictionary[word] = 1;
		}else{
			dictionary[word]++;
		}
	});

	const counterArray = Object.values(dictionary).sort((a,b) => b-a);

	const threeBiggest = counterArray.length > 3 ? counterArray.slice(0,3) : counterArray;

	const threeMostOftenElements = threeBiggest.map(num => {
		return Object.keys(dictionary).filter(item => dictionary[item] === num);
	}).flat()

	// const threeMostOftenElements = Object.keys(dictionary).reduce((acc,elem) => {

	// 	return threeBiggest.filter(num => num == (dictionary[elem])).length === 1 ? [...acc, elem] : acc;

	// },[])

	return threeMostOftenElements;

}
console.log(topThreeWords(" , e  .. "))
// console.log(topThreeWords("In a village of La Mancha, the name of which I have no desire to call to\nmind, there lived not long since one of those gentlemen that keep a lance\nin the lance-rack, an old buckler, a lean hack, and a greyhound for\ncoursing. An olla of rather more beef than mutton, a salad on most\nnights, scraps on Saturdays, lentils on Fridays, and a pigeon or so extra\non Sundays, made away with three-quarters of his income."));