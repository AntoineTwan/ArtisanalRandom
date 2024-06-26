ArtisanalRandom is a seed based (not really) "random" number generator (PRNG) in vanilla javascript. Given a done seed (an up to 30 letters word) it will always produce the same (infinite) serie of "rolls".

My goal here was to developp an artisanal one, not using hashes nor any other already made crypto function, but as close as I can of those doing so when it comes to generating a large number of unpredictible by human mind numbers from a seed with as little sequence repetitions possible. 

This project used performance test driven developpment, I've used a test making 100,000 rolls of a 1000 sided dice and analyzing results repartition, to be able to compare my method with standard Math.random() results, and slowly improved it to reduce the number of repetitions it was producing (which was insane at start).

Finally after several attempts I ended with a version giving an as low number of repetitions as the default random function for 100,000 rolls (if likely worse for millions).

That best methods are the roll2, roll3 and rollLarge ones (roll0 has just been kept as example of a non efficient one, as I'm going to use this mini project for a blog post on test driven developpment, roll1 is decent for its speed but produce more repetitions of series than math.Random(), roll2 is as efficient up to 200,000 rolls, roll3 is more efficient for avoiding repetitions up to 500,000+ rolls but not really needed if you don't plan to make that many, rollLarge allows rolling dices with up to 1,000,000,000 sides with similar efficiency as roll3, but is not needed for dices smaller than a d1000).

(time per roll calculated after executing a test for a million : 310k ns for roll1, 1410k ns for roll2, 1670k ns for roll3, 2820k for rollLarge, to compare a roll 1000 with Math.random() takes 135k and with Cryto.getRandomValues() 2710k)

Technically it uses a seed table of numbers from 0 to 9 (3 of each) put in an order determined by the word, and when it makes "rolls" use obscure mathematics formulas (don't ask me to explain why/how they work) to convert the roll number into the adresses of 3 of these 10 sided dices in the table, then assembles the result as a string and converts it back to an integer.

For example the word 'github' entered as parameter of WordToSeed generates a seedtable of 
[  2, 4, 7, 8, 9, 6, 5, 3, 5,
  3, 7, 5, 9, 0, 3, 1, 6, 7,
  8, 1, 4, 6, 9, 1, 8, 0, 2,
  4, 2, 0
]
Then when the roll method is used it will calculate from the rollNumber that it should, for example, use the values at indexes 4, 13 and 3 of this table, ending with the result 907.
The rollNumber being an attribute of the RandomSeed object, incremented after each roll.

--

how to use : 
 - import RandomSeed and WordToSeed from randomseed.js (or copy them with only the needed methods into your code)
 - if you want to use a word as seed, call WordToSeed giving it an up to 30 letters seed word as parameter and create a new RandomSeed with the return of WordToSeed as parameter (store it in a global variable to continue using the same seed)
 - it's also possible to create the Randomseed with no paramater in which case it will generate a random seedtable itself 
 - then use the .roll2, .roll3 or rollLarge methods of the RandomSeed (optionnal parameters : dice, roll number) to generate numbers in the 1 to dice* range (by default will generate numbers from 1 to 1000)
 - given the same seed, dice and roll number the method will always give the same result
 - if no roll number is given as parameter to a roll method, it uses the rollNumber attribute of the RandomSeed object, and increments it

 (* note that the .roll2 and .roll3 method were not made for dice values > to 1000, if a superior value is given they would just multiply their result to have the same maximum, so some numbers would never appear,  .rollLarge only allows dice values up to a billion)

 (ps : package.json and jsconfig are only needed to test the code with vsCode RunCode extension or in node environnment)

--

ps : code is commented, but in french (as are the tests results) :p
