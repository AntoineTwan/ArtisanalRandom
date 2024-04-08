import {RandomSeed,WordToSeed} from "./randomseed.js"


const w=WordToSeed("githubtesttest");
const s=new RandomSeed(w);
const a = new Uint16Array(1);

// les fonctions témoin et les différentes fonctions à tester
// toutes correspondent à des tirages de 0 à 999
const normalRoll = function () {
  return Math.floor(Math.random()*1000);
}

const cryptoRoll = function () {
    const randomValue = crypto.getRandomValues(a)[0];
    const randomFloat = randomValue / Math.pow(2, 16);
    return Math.floor(randomFloat*1000);
}


const rseedRoll0 = function () {
  return s.roll0 (1000)-1;
}
const rseedRoll1 = function () {
  return s.roll1 (1000)-1;
}
const rseedRoll2 = function () {
  return s.roll2 ()-1;
}


//la fonction qui effectuera les tests de répartition des tirages
//elle prend en paramètre le nombre de tirages à effectuer (rollsNumber)
const testGeneratedNumbers = function (rollsNumber) {
  const roll1000=rseedRoll2;   // la fonction testée est renseignée là
  let rolls = [];
  let repeats = new Array (1000).fill(0);
  for (let i=0;i<rollsNumber;++i) {
    let roll = roll1000();
    if (roll==undefined) {
      console.log ("undefined roll!");
    }
    rolls.push(roll);
    repeats[roll]=++repeats[roll];
  }
  
  //tests 1 et 2 : Nombre max et min de répétitions d'un nombre 
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
      console.log ("Au total "+numberOfSeriesFound[i]+" répétitions de séries de "+(i+2)+" nombres trouvées.");
    }
    console.log (rolls);
  }

  // test séparé de la vitesse pure d'exécution
  // le résultat est automatiquement donné par la durée d'execution du test 
  // (si on utilise comme moi l'extension runcode de vscode 'excited with code 0 in ...' seconds)
  // pour tester normalRoll sans l'initialisation destinée aux autres il faut comment out les constantes w, s et a 
  // pour cryptoroll w et s ; pour les autres a (ça fait en fait très peu de différence par rapport au tirage de 100000 nombres)
  const testSpeed = function (rollsNumber) {
    const roll1000=rseedRoll1; 
    for (let i=0;i<rollsNumber;++i) {
      roll1000();
    }
  }
  // ** résultats pour 1,000,000 de tirages **
  // normalRoll 0.135 seconds
  // cryptoRoll 2.7 seconds
  // roll0 0.267 seconds
  // roll1 0.31 seconds
  // roll2 1.4 seconds 
  // des artisanales,  roll1 est la solution la plus satisfaisante pour une combinaison vitesse / relativement faible nombre de répétitions
  // roll2 sacrifie pas mal de vitesse pour réduire d'avantage les anomalies mais demeure nettement plus rapide que la solution crypto
  // la solution crypto prend un temps exponentiellement plus long si on augmente le nombre de tirages (par exemple 24 secondes pour 10 millions)
  // quand normalroll est à peine affecté (0.2s) et roll1 entre les deux (2,1 secondes)
  
  // lancement du test de répartition avec le paramètre 100000
  // j'utilise l'extension Runcode pour l'activer d'un clic droit dans vscode
  testGeneratedNumbers(100000)
  
  // lancement du test de vitesse avec 1000000 (à effectuer séparément)
  //testSpeed(10000000)