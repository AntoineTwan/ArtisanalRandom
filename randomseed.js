

var tirage = 0;
var seedtable;

export function lancerD(d, openroll) {
  if (openroll == undefined) {
     openroll = 0;
   }
 var inverser =0;  
 if (!d) {
   return 0;
 }
 else if (d<0) {
   d=d*-1;
   inverser = 1;
 }
  // alert ("d "+d);
   var de = Math.random() * d ;
 de = Math.floor (de) +1;
   var seuil = -1;
   if (openroll) {
       seuil = Math.ceil(d / 20);
   }
   if (de > d - seuil) {
       de = de + lancerD(d, openroll - 1);
   }
 if (inverser) {
   de*=-1;
 }
   return de;
}

export const RandomSeed = function (seed) {
  if (seed == undefined && seedtable==undefined) {
  seedtable = new Array (30).fill(-1);
	var place;
	//alert ("Place "+place);
	var valeur = 0;
    for (var i=0; i<30;++i) {
		if (i<10) {
			valeur=i ;
		}
		else if (i<20) {
			valeur = i-10;
		}
    else {
      valeur = i-20;
    }
		place = lancerD(10)-1+valeur;
		while (seedtable[place]>-1) {
			if (place<29) {
			  ++place;
			  }
			else {
				place = 0;
			}
		}
			seedtable [place] = valeur ;
			//alert ("Valeur :"+valeur+"  Place : "+place);
		}
	this.seed = seedtable ;	
  console.log (seedtable);
	}
  else {
   this.seed = seed;
   } 
 let tt = "100" + this.seed [this.seed[11]] + this.seed [5]+ this.seed[7] +this.seed[this.seed[14]];
  this.premierTirage = parseInt (tt);  
 // alert ("PremierTirage :"+tt);  
}  
  	
  
RandomSeed.prototype.roll = function (de, tirageNo) {
   if (tirageNo==undefined) {
	   tirageNo=tirage; 
	   ++ tirage ; 
	   }
	else {
       tirageNo = parseInt (tirageNo);
	}	   
	
    tirageNo += this.premierTirage ;
	
   let noDe1, noDe2, noDe3, de1, de2, de3, step, result,tiragestring ;
  step = nextS(Math.ceil(tirageNo/119));
  
  let t = tirageNo+step;

  if (tirageNo%2) {
    t+=step;
  }

   noDe1 = nextS ((t/43)*11);
   noDe2 = nextS ((t/47)*17);
   noDe3 = nextS ((t/59)*23);
   
   if (tirageNo%3) {
     de1 = this.seed [noDe2];
     de2 = this.seed [noDe1];
   }
   else {
     de1 = this.seed [noDe1];
     de2 = this.seed [noDe2];	   
   }

   de3 = this.seed [noDe3];
   
   if (tirageNo%5) {
     de3=de1;
	   de1 = this.seed [noDe3];
   }
   else if (tirageNo%7) {
     de3=de2;
	   de2 = this.seed [noDe3];
   }

  //  if (t%3) {
  //   de1=9-de1;
  //  }
  //  if (t%4) {
  //   de2=9-de2;
  //  }
  //  if (t%5) {
  //   de3=9-de3;
  //  }

   //console.log ("de1 "+de1);
   tiragestring = ""+de1+de2+de3;
   //console.log ("tirage:"+tiragestring);
   
    if (!tirageNo%2) {
	    result = parseInt (tiragestring);
    }
    else {
	    result = 999 - parseInt (tiragestring);
    }
 
   
   if (de !=undefined) {
     result = Math.floor((result*de)/1000) +1;  
   }
   else {
     result = Math.floor((result*de)/10);  
   }	   
    //  alert ("Tirage n° :"+tirageNo+" result "+ result);
   
   return parseInt(result);
  
   function nextS (v) {
      v=Math.floor(v);
		   if (v>-1 && v<30) return v;
       else return v- (Math.floor(v/30)*30);
   }

   
}

function testSeed () {
  s = new RandomSeed () ;
  var txt = "Randomseed :"+ display (s.seed) + "Premier tirage "+ s.premierTirage ;
  for (var i=0;i<1000;++i) {
     txt += + "-";
  }
  document.write (txt);
}  

function convertNumber(number) {

}

	   
   
 
 