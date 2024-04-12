  import {RandomSeed,WordToSeed} from "./randomseed.js"


  var w=WordToSeed("gruau"); // remplacer par tout autre mot de 30 caractères ou moins
  var s=new RandomSeed(w);
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
  const rseedRoll3 = function () {
    return s.roll3 ()-1;
  }
  const rseedLarge = function () {
    return s.rollLarge()-1;
  }

  const multiWordsTest = function (genWordsNumber, rollsNumber) {
     let wordsToTest = ['a','0','22','ababababababababababababababababababababababab'];
     let word, wlength, charno;
     for (let i=0; i<genWordsNumber;++i) {
        word="";
        wlength=3+ Math.floor (Math.random()*26);
        for (let j=0; j<wlength;++j) {
          word+=String.fromCharCode(33+Math.floor(Math.random()*97));
        }
        wordsToTest.push(word);
     }
    for (let i=0;i<wordsToTest.length;++i) {
     console.log ('***** Test du mot "'+wordsToTest[i]+'" ****** ');
     w= WordToSeed(wordsToTest[i]);
     s=new RandomSeed (w);
     testGeneratedNumbers(rollsNumber)
    }
  }


  //la fonction qui effectuera les tests de répartition des tirages
  //elle prend en paramètre le nombre de tirages à effectuer (rollsNumber)
  const testGeneratedNumbers = function (rollsNumber) {
    const roll1000=rseedLarge;   // la fonction testée est renseignée là
    let rolls = [];
    let repeats = new Array (1000).fill(0);
    let testRoll, mostFirst;
    let prevFirst = -1;
    let totalSameCent =0;
    let maxSameCent =0;
    let numIncluded=new Array(10).fill(0);
    let numFirst=new Array(10).fill(0);
    for (let i=0;i<rollsNumber;++i) {
      let roll = roll1000();
      if (roll==undefined) {
        console.log ("undefined roll!");
      }
      rolls.push(roll);
      repeats[roll]=++repeats[roll];
      testRoll=roll.toString();
      
      if (prevFirst==testRoll[0]) {
        totalSameCent++;
        if (totalSameCent>maxSameCent) {
          maxSameCent=totalSameCent;
          mostFirst=testRoll[0];
        }
      }
      else {
        prevFirst=testRoll[0];
        totalSameCent=1;
      }  
      
      for (let j=0;j<10;j++) {
        if (j==0 && roll<100) {
          numIncluded[j]++;
          numFirst[j]++;
        }
        if (testRoll.includes(j)) {
          numIncluded[j]++;
        }
        if (testRoll[0]==j) {
          numFirst[j]++;
        }
      }
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
                }
              }
            }
          }
        }    
      }
      for (let i=0;i<9;++i) {
        console.log ("Au total "+numberOfSeriesFound[i]+" répétitions de séries de "+(i+2)+" nombres trouvées.");
        if (numberOfSeriesFound[i]==0) {break;}
      }

      //test4 : Répartitions chiffres
      for (let i=0;i<10;++i) {
        // décommenter si détail souhaité
        // console.log ("Nombre de tirages contenant au moins un "+i+" = "+numIncluded[i]);
        // console.log ("Dont "+numFirst[i]+" en première position.");
      }
      //test 5 : série de même centaine
        console.log ("Un nombre de "+maxSameCent+" tirages à la suite ont commencé par "+mostFirst+".");
        console.log (rolls);
    }

    // test séparé de la vitesse pure d'exécution
    // le résultat est automatiquement donné par la durée d'execution du test 
    // (si on utilise comme moi l'extension runcode de vscode 'excited with code 0 in ...' seconds)
    // pour tester normalRoll sans l'initialisation destinée aux autres il faut comment out les constantes w, s et a 
    // pour cryptoroll w et s ; pour les autres a (ça fait en fait très peu de différence par rapport au tirage de 100000 nombres)
    
    const testSpeed = function (rollsNumber) {
      const roll1000=rseedLarge; 
      for (let i=0;i<rollsNumber;++i) {
        roll1000();
      }
    }
    
    // lancement du test individuel (renseigner un mot dans w et exécuter en console)
    //testGeneratedNumbers(100000)

    //lancement d'un test à plusieurs mots (5 = nombre de mots aléatoires à générer en plus de ceux par défaut, 2ème param nombre de tirages)    
    multiWordsTest(2,100000);
    

    // lancement du test de vitesse avec 1000000 (à effectuer séparément)
    //testSpeed(1000000)