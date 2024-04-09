ArtisanalRandom is a seed based (not really) "random" number generator (PRNG) in vanilla javascript. Given a done seed (an up to 30 letters word) it will always produce the same (infinite) serie of "rolls".

My goal here was to developp an artisanal one, not using hashes nor any other already made crypto function, but as close as I can of those doing so when it comes to generating a large number of unpredictible by human mind numbers from a seed with as little sequence repetitions possible. 

This project used test driven developpment, I've used a test making 100000 rolls of a 1000 sided dice and analyzing results repartition, to be able to compare my method with standard Math.random() results, and slowly improved it to reduce the number of repetitions it was producing (which was insane at start).

Finally after several attempts I ended with a version giving an as low number of repetitions as the default random function for 100,000 rolls (if likely a bit worse for millions).

That best method are the roll2 and roll3 ones (roll0 has just been kept as example of a non efficient one, as I'm going to use this mini project for a blog post on test driven developpment, roll1 is decent for its speed but produce more repetitions of series than math.Random(), roll2 is as efficient up to 200,000 rolls, roll3 is as or more efficient up to 500,000+ but not really needed if you don't plan to make that many rolls).

(time per roll calculated after making a million : 310k ns for roll1, 1410k ns for roll2, 1670k ns for roll3, all are slower than Math.random() (135k) but faster than Cryto.getRandomValues() - 2710k)

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
 - import RandomSeed and WordToSeed from randomseed.js
 - if you want to use a word as seed, call WordToSeed giving it an up to 30 letters seed word as parameter and create a new RandomSeed with the return of WordToSeed as parameter (store it in a global variable to continue using the same seed)
 - it's also possible to create the Randomseed with no paramater in which case it will generate a random seedtable itself 
 - then use the .roll2 or .roll3 methods (optionnal parameters : dice, roll number) to generate numbers in the 1 to dice* range (by default will generate numbers from 1 to 1000)
 - given the same seed, dice and roll number the method will always give the same result
 - if no roll number is given as parameter to the roll2 method, it uses the rollNumber attribute of the RandomSeed object, and increments it

 (* note that the method as implemented was not made for dice values > to 1000, if a superior value is given it will just multiply its result to have the same maximum, so some numbers would never appear, but same approach can be easily adapted to generate far larger numbers, or it can be done by combining several rolls)

--

ps : code is commented, but in french (as are the tests results) :p
