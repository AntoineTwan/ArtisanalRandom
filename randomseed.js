
// fonction essentielle à toutes les autres qui va ramener tout nombre (numéros de caractères ou issus des calculs) 
// en un entier de 0 à 29 correspondant aux indexs la seedtable
// (ou autre en paramétrant cette limite)
function rebaseNumber(number, limit) {
  if (!limit) {
    limit=30 ;}
  number=Math.round (number);
  if (number>-1 && number<limit) return number;
  else return number- (Math.floor(number/limit)*limit);
}

//le constructeur de l'objet RandomSeed
//tous ses paramètres sont optionnels (il dispose de méthodes pour les générer)
//il peut prendre en paramètre une seed, un numéro de tirage et un nombre à ajouter à ceux-ci mais dispose de méthodes pour les générer
export const RandomSeed = function (seed, rollNo, addToRollNo) {
  if (seed==undefined) {
    // ma première méthode de renseignement de la seedtable (avant la création de WordToSeed)
    // qui utilisait des tirages 'aléatoires' pour placer les chiffres
    // je l'ai gardée pour générer une seed aléatoire si le mot n'est pas renseigné

    let seedtable = new Array (30).fill(-1); 
    let place, value;                            
      for (var i=0; i<30;++i) {
        value=parseInt (i.toString().slice(-1));
        place = Math.floor(Math.random()*10)+value;
        while (seedtable[place]>-1) {
          if (place<29) {
            ++place;
          }
          else {
            place = 0;
          }
      }
        seedtable [place] = value ;
      }
    seed = seedtable ;	
	}
  this.seed = seed;
  console.log (seed); // console.log pour vérifier que la seedtable est bien renseignée

  // si le rollNo n'est pas renseigné on l'initialise à 0
  if (rollNo==undefined) {
    rollNo=0;
  }
  this.rollNo=rollNo;

  // plutôt que d'utiliser un numéro de tirage partant de 0 on génère à partir de la seed un grand nombre qui s'ajoutera à celui ci 
  // suite aux tests il est déterminé qu'un commençant nombre commençant '10' et suivi de 5 chiffres est optimum (ne me demandez pas pourquoi)
  // tout ce que je peux en dire c'est qu'enlever le "0" ou en ajouter un passé le 2ème chiffre augmente le nombre de répétitions de séries,
  // tandis qu'ajouter plus de chiffres issus de la seed ne les diminue pas d'avantage (en utilisant la méthode roll2)
  if (addToRollNo==undefined) {
    let tt = "10"+ this.seed[21]+ this.seed [this.seed[11]] + this.seed [15]+ this.seed[27] +this.seed[this.seed[14]];
    addToRollNo = parseInt (tt);
  }  
  this.addToRollNo=addToRollNo;
}  

// ma toute première méthode qui faisait illusion sur un petit nombre de tirages mais s'est avérée très mauvaise au niveau des tests
// certains résultats possibles ont tendance à apparaitre seulement moins d'une vingtaine de fois en 100000 tirages
// et le nombre de répétitions de séries est énorme
RandomSeed.prototype.roll0 = function (dice, rollNo) {
  if (rollNo==undefined) {
    rollNo=this.rollNo; 
    this.rollNo++ ; 
    }   

  let noDe1, noDe2, noDe3, de1, de2, de3, step, result,rollstring ;

  step = Math.ceil(rollNo/30+rollNo/this.addToRollNo);

  rollNo += this.addToRollNo ;

  noDe1 = rebaseNumber(rollNo);
  noDe2 = rebaseNumber(rollNo+step);
  noDe3 = rebaseNumber(rollNo+2*step);

  if (rollNo%3) {
    de1 = this.seed [noDe2];
    de2 = this.seed [noDe1];
  }
  else {
    de1 = this.seed [noDe1];
    de2 = this.seed [noDe2];	   
  }
  if (rollNo%2) {
  de3 = this.seed [noDe1];
  de1 = this.seed [noDe3];
  }

  rollstring = ""+de1+de2+de3;

  result = parseInt (rollstring);

  if (isNaN(result)) {
    console.log ("rollNo "+ rollNo+ " noDe1 "+noDe1+ " de1 "+de1+ " rollstring "+ rollstring);
    throw new Error();
  }

  if (dice==undefined) {
    dice=1000;
  }

  result = Math.floor((result*dice)/1000) +1;  	   

  return parseInt(result);
}

//une méthode intermédiaire produisant déjà beaucoup moins d'anomalies (pas de nombre absent ou sur-répété)
//mais toujours un peu trop de répétitions de séries de nombres
RandomSeed.prototype.roll1 = function (dice, rollNo) {
  if (rollNo==undefined) {
    rollNo=this.rollNo; 
    ++ rollNo ; 
    }	   
 
   rollNo += this.addToRollNo ;
 
  let noDe1, noDe2, noDe3, de1, de2, de3, step, result,rollNostring ;
 step = rebaseNumber(Math.ceil((rollNo/119)*7));
 
 let t = rollNo+step;

 if (rollNo%6) {
   t-=57;
 }
 else if (rollNo%2) {
   t+=step;
 }
 else if (rollNo%3) {
   t-=(step+1);
 }

if (t%35) {
 t+=13;
}
else if  (t%5) {
   t+=Math.ceil(step/2);
 }
else if (t%7) {
   t-=Math.ceil(step/2);
 }
else if (t%15) {
   t+=3;
}  

  noDe1 = rebaseNumber ((t*Math.PI)/4);
  noDe2 = rebaseNumber ((t/47)*17);
  noDe3 = rebaseNumber ((t/59)*23);
  
  if (rollNo%3) {
    de1 = this.seed [noDe2];
    de2 = this.seed [noDe1];
  }
  else {
    de1 = this.seed [noDe1];
    de2 = this.seed [noDe2];	   
  }

  de3 = this.seed [noDe3];
  
  if (rollNo%5) {
    de3=de1;
    de1 = this.seed [noDe3];
  }
  else if (rollNo%7) {
    de3=de2;
    de2 = this.seed [noDe3];
  }
  rollNostring = ""+de1+de2+de3;
  
   if (!rollNo%2) {
     result = parseInt (rollNostring);
   }
   else {
     result = 999 - parseInt (rollNostring);
   }
  
   if (dice==undefined) {
    dice=1000;
  }

  result = Math.floor((result*dice)/1000) +1;  	   
  
  return parseInt(result); 
 }	

RandomSeed.prototype.roll2 = function (dice, rollNo) {
  if (rollNo==undefined) {
    rollNo=this.rollNo; 
    ++ this.rollNo ; 
    }
 else {
      rollNo = parseInt (rollNo);
 }	   
 
   rollNo += this.addToRollNo ;

  // à partir du numéro de tirage on génère 3 valeurs
  // peu importe la méthode exacte, le tout est ce qu'elles aient beaucoup de chiffres après la virgule
  // des multiplications par des fractions nombre premier / nombre premier ou utilisant des constantes comme Math.PI marchent très bien pour ça 
   let v1= ((Math.PI/1.23337)*rollNo);
   let v2= (rollNo*(241/617));
   let v3= (rollNo*(827/1877));

   // on garde de ces valeurs les 5 derniers chiffres en éliminant le tout dernier
   // les tests ayant montré que l'inclure crée des déséquilibres (tirages qui reviennent plus que d'autres) 
   let strv1 = v1.toString().slice(-5,-1);
   let strv2 = v2.toString().slice(-5,-1);
   let strv3 = v3.toString().slice(-5,-1);
   v1= parseInt(strv1);
   v2= parseInt (strv2);
   v3= parseInt(strv3);

  // pour ajouter à l'irrégularité des séries on échange les valeurs si le numéro de tirage est pair ou un multiple 3  
  let temp;
  if (rollNo%2) {
    temp = v1;
    v1=v2;
    v2=v3;
    v3=temp;
  }
  else if (rollNo%3) {
    temp = v2;
    v2=v1;
    v1=v3;
    v3=temp;
  }

  // enfin on utilise rebaseNumber pour aboutir à des numéros de dés de 0 à 29 
  let noDe1 = rebaseNumber (v1);
  let noDe2 = rebaseNumber (v2);
  let noDe3 = rebaseNumber (v3);

  let rollNoStr = ""+this.seed[noDe1]+this.seed[noDe2]+this.seed[noDe3];
  let result=parseInt(rollNoStr);

  //et pour limiter encore les répétions de séries on inverse les résultats 1 fois sur 4
  if (rollNo%4) {
    result = 999 - result;
  }

  if (dice==undefined) {
    dice=1000;
  }

  result = Math.floor((result*dice)/1000) +1;  	   
return parseInt(result);
}
  

// la fonction générant la seedtable à partir d'un mot (qui peut être toute autre combinaison de caractères ASCII)
// elle est exportée pour pouvoir changer le mot dans les texts
export const WordToSeed = function (word) {
  // si le mot est absent (ou une chaine vide) elle ne retourne rien/undefined (ce qui active l'autre méthode de génération de seedtable)
  if (word)  {  
    let seed = new Array (30).fill(-1);
  // sinon on met le mot à la longueur minimum (et seule utile) de 30 caractères
    while (word.length<30) {   // s'il est plus court on le répète en ajoutant (arbitrairement) 'gk' entre deux répétitions
      word=word+'gk'+word;     // celà évite que les mots de moins de 3 lettres génèrent des tables trop régulières
    }                          
    let charNo, rebasedNo, direction;
    let chiffre;
    for (let i=0;i<30;++i) {
      chiffre=parseInt (i.toString().slice(-1));
      charNo=word.charCodeAt(i);
      rebasedNo = rebaseNumber(charNo, 30);
      if ((i+charNo)%2) {
        direction =1;
      }
      else {
        direction=-1;
      }
      while (seed[rebasedNo]!=-1) {
        rebasedNo+=direction;

        if (rebasedNo>29) {
          rebasedNo=0;
        }
        if (rebasedNo<0) {
          rebasedNo=29;
        } 
      }
      seed[rebasedNo]=chiffre; 
    }
    console.log(seed);
    return seed;
  }
  console.log("pas de mot");
}



 
 