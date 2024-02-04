import {RandomSeed} from "./randomseed.js"

var s=new RandomSeed()

const normalRoll1000 = function () {
  return Math.floor(Math.random()*1000);
}


const rseedRoll1000 = function () {
  return s.roll (1000)-1;
}

const testGeneratedNumbers = function (rollno) {
  const roll1000=rseedRoll1000;
  let rolls = [];
  let repeats = new Array (1000).fill(0);
  for (let i=0;i<rollno;++i) {
    let roll = roll1000();
    if (roll==undefined) {
      console.log ("undefined roll!");
    }
    rolls.push(roll);
    repeats[roll]=++repeats[roll];
  }
  
  //test 1 et 2 : Nombre max et min de répétitions d'un nombre 
  let maxRepeats = 0;
  let minRepeats = 1000000;
  let maxRepeated = -1;
  let minRepeated = -1;
  for (let i=0;i<1000;++i) {
    if (repeats[i]>maxRepeats) {
      maxRepeats = repeats[i];
      maxRepeated = i;
    }
    if (repeats[i]<minRepeats) {
      minRepeats = repeats[i];
      minRepeated = i;
    }
  }
  console.log ("Test n°1 : Le nombre le plus répété l'a été "+maxRepeats+" fois. C'était "+maxRepeated+".");
  console.log ("Test n°2 : Le nombre le moins répété l'a été "+minRepeats+" fois. C'était "+minRepeated+".");
  
  //test 3 : Répétition de séries
  console.log ("Test n°3 : Nombre de répétitions de séries de nombres (ça peut être long)...");
  let numberOfSeriesFound = [0,0,0,0,0,0,0,0,0,0];
  let seriesFound = [];
  let reducedRolls, startIndex, serieToTest, seriesToTest, ignoreSerie;
  
  
  
  for (let i=0;i<1000;++i) { //Teste les séries commençant par i
    reducedRolls= rolls;
    seriesToTest = [];
    
    while (reducedRolls.indexOf(i)!=-1) {  // liste les séries commençant par i
      startIndex = reducedRolls.indexOf(i);
      serieToTest=[];
      for (let a=0;a<10;a++) {
        serieToTest.push (reducedRolls[startIndex+a]);
      }
      seriesToTest.push (serieToTest);
      reducedRolls=reducedRolls.slice (startIndex+1);
    }
    ignoreSerie=new Array(seriesToTest.length).fill(false);
    
    for (let j=0; j<seriesToTest.length;++j) {
      if (!ignoreSerie[j]) {
        for (let k=j+1; k<seriesToTest.length;++k) {
          for (let l=1;l<10;l++) {
            if (seriesToTest[j][l]!=seriesToTest[k][l]) {
              break; }
              
              if (l>1) {
                const serieFound = seriesToTest[j].slice(0,l);
                seriesFound.push (serieFound);
                numberOfSeriesFound[l-2]++;
                ignoreSerie[k]=true;
                //console.log ("Trouvé répétition de "+(l)+" nombres.");
              }
            }
          }
        }
      }    
    }
    for (let i=0;i<10;++i) {
      //       //  if (numberOfSeriesFound[i]==0) {break;}
      console.log ("Au total "+numberOfSeriesFound[i]+" répétitions de séries de "+(i+2)+" nombres trouvées.");
    }
    // for (let i=0;i<seriesFound.length;++i) {
    //   console.log ("Série trouvée :"+seriesFound[i]);
    // }
    console.log (rolls);
  }
  
  
  
  
  
  testGeneratedNumbers(100000)