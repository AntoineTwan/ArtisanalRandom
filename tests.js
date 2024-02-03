const normalRoll1000 = function () {
    return Math.floor(Math.random()*1000);
}

const testGeneratedNumbers = function (rollno) {
    const roll1000=normalRoll1000;
    let rolls = [];
    let repeats = new Array (1000).fill(0);
    for (let i=0;i<rollno;++i) {
        let roll = roll1000();
        rolls.push(roll);
        repeats[roll]=++repeats[roll];
    }

    //test 1 : Nombre max de répétitions (établi en même temps que les tirages)
    let maxRepeats = 0;
    let minRepeats = 1000000;
    let maxRepeated = -1;
    let minRepeated = -1;
    for (let i=0;i<rolls.length;++i) {
        if (repeats[rolls[i]]>maxRepeats) {
            maxRepeats = repeats[rolls[i]];
            maxRepeated = rolls[i];
        }
    }
    console.log ("Test n°1 : Le nombre le plus répété l'a été "+maxRepeats+" fois. C'était "+maxRepeated+".");
    
    //test 2 : Nombre min de répétitions
    for (let i=0; i<1000; ++i) {
        if (repeats[i]<minRepeats) {
            minRepeats = repeats[i];
            minRepeated = i;
        }
    }
    console.log ("Test n°2 : Le nombre le moins répété l'a été "+minRepeats+" fois. C'était "+minRepeated+".");

    //test 3 : Répétition de séries
    console.log ("Test n°3 : Nombre de répétitions de séries de nombres (ça peut être long)...")

    let reducedRolls, startIndex, serieToTest, seriesToTest, reducedSeriesToTest, elementNumber, serieSize ;
    let numberOfSeriesFound = [0,0,0,0,0,0,0,0,0,0];

    for (let i=0;i<1000;++i) {
        reducedRolls= rolls;
        seriesToTest = [];
        //console.log ("Teste les séries commençant par "+i);

        while (reducedRolls.indexOf(i)!=-1) {
            startIndex = reducedRolls.indexOf(i);
            serieToTest=[];
            for (let a=1;a<10;a++) {
                serieToTest.push (reducedRolls[startIndex+a]);
            }
            seriesToTest.push (serieToTest);
            reducedRolls=reducedRolls.slice (startIndex+1);
        }

        for (let j=0; j<seriesToTest.length;++j) {
                reducedSeriesToTest=seriesToTest.slice(j+1);
                //console.log ('Cherche série '+seriesToTest[j]);
                for (let k=0; k<reducedSeriesToTest.length;++k) {
                  //  console.log ("Compare avec "+reducedSeriesToTest[k]);
                    for (let l=0;l<10;l++) {
                        if (seriesToTest[j][l]!=reducedSeriesToTest[k][l]) {
                            break; }
                        else {
                         numberOfSeriesFound[l]++;
                         //console.log ("Trouvé répétition de "+(l+2)+" nombres.");
                        }
                    }

                }
            }
        }
        for (let i=0;i<10;++i) {
            if (numberOfSeriesFound[i]==0) {break;}
            console.log ("Au total "+numberOfSeriesFound[i]+" répétitions de séries de "+(i+2)+" nombres trouvées.");
        }
    }





testGeneratedNumbers(100000)