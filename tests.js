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
    // let currentSerie, compareToSerie, serieRepeats;
    // for (let i=6; i>1;i-=2) { // testera les séries de 6, 4 et 2 tirages
    //     console.log ("Cherche les séries de "+i+" tirages.");
    //     maxRepeats = 0;
    //     mostRepeated=[];
    //     for (let j=0;j<1000;++j) {  // examinera les séries commençant par chaque nombre
    //         for (let k=0;k<rolls.length-i;++k) {
    //             if (rolls[k]==j) {
    //                 currentSerie = rolls.slice (k, k+i);
    //                 //console.log ("Cherche "+currentSerie+"...");
    //                 serieRepeats=0;
    //                 for (l=0;l<rolls.length-i;++l) {
    //                     if (rolls[l]==j) {
    //                         compareToSerie = rolls.slice (l, l+i);
    //                         if (JSON.stringify(currentSerie)== JSON.stringify (compareToSerie)) {
    //                             serieRepeats++;
    //                             if (serieRepeats>maxRepeats) {
    //                                 maxRepeats=serieRepeats;
    //                                 mostRepeated=currentSerie;
    //                                 if (maxRepeats>1) {
    //                                     console.log ("Trouvé une répétition de "+currentSerie+".");
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     console.log("La série de "+i+" nombres la plus répétée l'a été "+maxRepeats+" fois, c'était "+mostRepeated+".");

    let seriesToTest = [];
    let seriesToTestLastIndex = [];
    let seriesToTestIgnore=[];
    let serieCurrentSize = 2;
    let totalFoundRepetitions, currentRepetitions, serieTested, serieTestedLastIndex, serieMostRepeated;
    let foundRepetitions=2;

    
    for (let i=0; i<rolls.length;++i) {
        if (i+serieCurrentSize <rolls.length) {
            serieTested = rolls.slice (i,i+serieCurrentSize);
            serieTestedLastIndex = i+serieCurrentSize;
            seriesToTest.push (serieTested);
            seriesToTestLastIndex.push (serieTestedLastIndex);
            seriesToTestIgnore.push (0);
        }
    }    
            
    let i =0;
    while (i<seriesToTest.length) {
        while (serieTested.length==serieCurrentSize) { // passage à la taille suivante si la condition n'est pas satisfaite
                currentRepetitions = 0;
                if (!seriesToTestIgnore[i]) {
                    serieTested = seriesToTest[i];
                    serieTestedLastIndex = seriesToTestLastIndex[i];
                // console.log ("Série testée n°"+i+" = "+serieTested);
                    for (let j=i+1;j<seriesToTest.length;++j) {
                        if (!seriesToTestIgnore[j]) {
                            if (JSON.stringify(serieTested)==JSON.stringify(seriesToTest[j]) && serieTestedLastIndex!=seriesToTestLastIndex[j]) {
                                // a trouvé une répétition
                                console.log ("Série testée n°"+i+" répétition de la série "+serieTested+" trouvée.");
                                currentRepetitions ++;
                                // ajoute aux séries à tester celles de taille supérieure commençant pareil
                                if (serieTestedLastIndex+1<rolls.length && currentRepetitions==2) { 
                                    seriesToTest.push (rolls.slice (i,i+serieCurrentSize+1));
                                    seriesToTestLastIndex.push (serieTestedLastIndex)
                                }
                                if (seriesToTestLastIndex[j]+1 <rolls.length) {
                                    seriesToTest.push (rolls.slice(seriesToTestLastIndex[j]-serieCurrentSize,seriesToTestLastIndex[j]+1));
                                }
                                seriesToTestIgnore [j]=1; // évite que la répétition soit recomptée pour chaque série similaire
                            }
                            if (currentRepetitions>foundRepetitions) {
                                    foundRepetitions=currentRepetitions;
                                    serieMostRepeated = serieTested;
                            }
                            }
                        }
                totalFoundRepetitions+=currentRepetitions-1;  
                seriesToTestIgnore[i]=1; 
                }
            i++;     
            } 
            console.log ("La série de "+serieCurrentSize+" nombres la plus répétée l'a été "+foundRepetitions+" fois, c'était : "+serieMostRepeated+".");
            console.log ("Le nombre total de répétitions de séries de "+serieCurrentSize+" nombres est de "+totalFoundRepetitions+".");    
            serieCurrentSize++;
            foundRepetitions=0;
            totalFoundRepetitions;
            serieMostRepeated = [];
    }
}



testGeneratedNumbers(50000)