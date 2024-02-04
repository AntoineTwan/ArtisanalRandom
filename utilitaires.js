
 
/* ************************************************************************************************************************** */
/* ********** Fonctions Utilitaires   *************************************************************************************** */
/* ************************************************************************************************************************** */

 // recupération xml ************************************************************************

// chargement fichier 
function chargementSync(nomfichier) {
    creerRequete();
    xhr.open("GET", nomfichier, false);
    xhr.send(null);
	if (xhr.responseXML != undefined) {
    return xhr.responseXML; }
	else {
	 alert ("Problème de chargement, quelque soit la méthode.");
	 }
}

function chargement (fichier, nomFichier) {
    if (!xhr || xhr==undefined) {
     if (!creerRequete()) {
	   return 0;
    } 
    xhr.onreadystatechange  = function()  { 
       if(xhr.readyState  == 4)  {
        if (xhr.status  == 200 || xhr.status == 0)  {
            nomFichier = xhr.responseXML;
            }				
    } 
	}
   try {
   xhr.open("GET", fichier,  true); 
   xhr.send(null); }
   catch (e) {
     alert (lang=="Fr"?"Chargement xml impossible, changez de navigateur ou de paramètres.":"Impossible to load xml files check your browser parameters");
	 }
}
} 

function creerRequete() {
     if (window.XMLHttpRequest) {
	   xhr = new XMLHttpRequest(); 
	 }  
     else if (window.ActiveXObject) {
	   try {
	   alert (lang=="Fr"?"Vous utilisez IE ou autre navigateur obsolète. Ce jeu ne peut pas fonctionner correctement.":"You're using IE or other obsolete browser, this game is likely not to work correctly.");
	    xhr = new ActiveXObject("Microsoft.XMLHTTP");
	   }
	   catch (e) {
	     alert (lang=="Fr"?"Création de requête xml impossible, changez de navigateur ou paramètres de sécurité.":"Impossible to load xml change your browser or security settings.");
		 return 0;
	   }
	   }
	else {
	     alert (lang=="Fr"?"Création de requête xml impossible, changez de navigateur.":"Impossible to load xml change your browser.");
		 return 0;	
          }		 
	  }

function chargerTout () {
   // loadingState++;
   // if (!loadingState) {
      // chargement ("./xmlfiles/buildings.xml", buildingsDoc);
      // chargement ("./xmlfiles/cards.xml", cardsDoc);
      // chargement ("./xmlfiles/buildingCat.xml", buildingCatDoc);
	  // chargement ("./xmlfiles/terrains.xml", terrainsDoc);	  
 // }
   // alert (buildingsDoc);
   
  // if (loadingState ==999) {
    //alert ("chargement sync");
     buildingsDoc = chargementSync ("./xmlfiles/buildings.xml");
	 cardsDoc = chargementSync ("./xmlfiles/cards.xml");
	 buildingCatDoc = chargementSync ("./xmlfiles/buildingCat.xml");
	 terrainsDoc = chargementSync ("./xmlfiles/terrains.xml");
//	 }
   
 //  if (buildingsDoc != undefined && buildingsDoc) {
       //alert ("trouvé "+buildingsDoc);
       loadingState = 1001;
   //     }
   	
	  }


// chargement tous les fichiers en une requête
// function chargertout() {
		// if (astresdoc== undefined) { astresdoc = chargement("astres.xml", req); }
		// if (peuplesdoc== undefined) { peuplesdoc = chargement ("peuples.xml", req); }	
		// if (armesmeldoc== undefined) { armesmeldoc = chargement ("armesmel.xml", req); }
		// if (armesdistdoc== undefined) { armesdistdoc = chargement ("armesdist.xml", req); }	
		// if (monturesdoc== undefined) { monturesdoc = chargement ("montures.xml", req) ;}
		// if (unitsdoc== undefined) { unitsdoc = chargement ("units.xml", req); }	
	    // if (diversdoc== undefined) { diversdoc = chargement ("divers.xml", req); }
		// if (typesdoc== undefined) { typesdoc = chargement ("types.xml", req); }	
	    // if (terrainsdoc== undefined) { terrainsdoc = chargement ("terrains.xml", req); }
		// if (tactiquesdoc== undefined) { tactiquesdoc = chargement ("tactiques.xml", req); }			
    // }
	
// recherches dans XML **********************************************************************	

// recherche de node
function getElementByXmlId(xml, element, id) {	
    if (xml == undefined || id == undefined || !xml) {
        alert("erreur pour " + id + " xml "+ xml + " element "+ element) ;
    } else {
        var elementsList = xml.getElementsByTagName(element);
        var currentId;

        for (var i = 0; i < elementsList.length; i++) {
            currentId = elementsList[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
            if (currentId == id) {
                return elementsList[i];
            }
        }
    }
    return false;
}


// recherche de texte	
function getNom(node) {
    if (node != undefined && node != false) {
        if (node.getElementsByTagName("Nom")[0] != undefined) {
            // alert (node.getElementsByTagName("Nom") [0].getElementsByTagName(langue) [0].childNodes[0].nodeValue);
            result = node.getElementsByTagName("Nom")[0].getElementsByTagName(lang)[0].childNodes[0].nodeValue;
            return result;
        }
    }
    return false;
}

function getDesc(node) {
    if (node != undefined && node != false) {
        if (node.getElementsByTagName("Desc")[0] != undefined) {
            result = node.getElementsByTagName("Desc")[0].getElementsByTagName(lang)[0].childNodes[0].nodeValue;
            return result;
        }
    }
    return false;
}

function getShortDesc(node) {
    if (node != undefined && node != false) {
        if (node.getElementsByTagName("ShortDesc")[0] != undefined) {
            result = node.getElementsByTagName("ShortDesc")[0].getElementsByTagName(lang)[0].childNodes[0].nodeValue;
            return result;
        }
    }
    return false;
}

// recherche de nom d'Astre
function getAstre(id) {
    var astreNode = getElementByXmlId(astresdoc, "Astre", id);
    if (!astreNode) {
        alert("Astre non trouvé pour id " + id + " !");
    } else {
        return getNom(astreNode);
    }
    return false;
}

// recherche autres valeurs uniques, retourne 0 (false) si non trouvé
function getValue(node, nomAttribut) {
    if (node != undefined && node != false) {
        if (node.getElementsByTagName(nomAttribut)[0] != undefined) {
            // alert (node.getElementsByTagName("Nom") [0].getElementsByTagName(langue) [0].childNodes[0].nodeValue);
            result = node.getElementsByTagName(nomAttribut)[0].childNodes[0].nodeValue;
            return result;
        }
    }
    return 0;
}

 // recherche un peu plus complexe pour les noms d'armures (un peu de variété purement pour le fluff)
function nomArmure(arm, peupleNode) {
    var armur = Math.min(arm, 8);
	var armureNode;
	var armureTag =  "Arm"+armur;
    if (peupleNode.getElementsByTagName(armureTag)[0]!= undefined) {
	    var armurP = peupleNode.getElementsByTagName(armureTag)[0].childNodes[0].nodeValue ;	
	    armureNode = getElementByXmlId (diversdoc, "Armure", armurP);
    }
	else   {
	armureNode = getElementByXmlId (diversdoc, "Armure", armur); }
	return getNom (armureNode);
	}

// lister éléments par id dans node/fichier xml
function getIdList(node) {
    if (node) {
        var liste = [];
        for (var i = 0; i < node.length; i++) {
            currentId = elementsList[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
            liste.push(currentId);
        }
        return liste;
    }
    return false;
}

// lister les unités d'un peuple
function listeUnitsPeuple(peupleid) {
    var listunit = unitsdoc.getElementsByTagName("Unit");
    var listunitpeuple = [];
    var id, idpeuple;
    for (var i = 0; i < listunit.length; ++i) {
        id = listunit[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
        idpeuple = listunit[i].getElementsByTagName("Peuple")[0].childNodes[0].nodeValue;
        // alert (id+ "-->"+ idpeuple);
        if (idpeuple == peupleid) {
            listunitpeuple.push(id);
            //     alert ("+"+id) ;
        }
    }
    return listunitpeuple;
}

//enlever un élément d'une liste d'objets
function enlever (liste, elem) {
   var tempListe = [];
   for (var i =0; i<liste.length;i++) {
     if (liste[i] != elem) {
	   tempListe.push (liste[i]);
	  }
	  }
     return tempListe ;
}

// enlève l'élément no x
function enleverNo (liste, no) {
   var tempListe = [];
   for (var i =0; i<liste.length;i++) {
     if (i != no) {
	   tempListe.push (liste[i]);
	  }
	  }
     return tempListe ;
}	 


// tirages aléatoires ********************************************************

// lancer de dé avec openroll vers le haut possible	
//(openroll = nombre max d'openrolls, seuil : 5% avec d100, 1 si d en dessous de 20)
function lancerD(d, openroll) {
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

// élément aléatoire dans une liste
function randomListe(liste) {
	if (!liste.length) {
		return 0;
	}
    var d = lancerD (liste.length,0);
	// alert ("tirage "+d);
    return liste[d-1];
}

// élément aléatoire dans une liste avec fréquence
function randomListeFreq(liste, listefreq) {
    if (liste.length != listefreq.length) {
        alert("Problème dans la création des listes.")
    } else
        var totalChances = 0;
    for (var i = 0; i < liste.length; ++i) {
        totalChances = parseInt (totalChances + listefreq[i]);
    }
    var de = lancerD(totalChances, 0);
	// alert ("tirage : "+de);
    for (var i = 0; i < liste.length; ++i) {
        de = de - listefreq[i];
        if (de < 1) {
		   // alert (liste[i]);
            return liste[i] ;
        }
    }
}

// numero dans une liste de fréquence
function randomFreq(listefreq) {
var totalChances = 0;
    for (var i = 0; i < listefreq.length; ++i) {
        totalChances = parseInt (totalChances + listefreq[i]);
    }
    var de = lancerD(totalChances, 0);
	// alert ("tirage : "+de);
    for (var i = 0; i < listefreq.length; ++i) {
        de = de - listefreq[i];
        if (de < 1) {
		   // alert (liste[i]);
            return i ;
        }
    }
}

function randomJoueur () {
	var listeActifs = [];
	for (var i=0;i<nbreJoueurs;++i) {
		if (!joueurs[i].elimine) {
			listeActifs.push (joueurs[i]);
		}
	}
	return randomListe (listeActifs);
}

// censé renvoyer la position d'un element marche pas avec spans

function getPosition(el) {
  var xPos = 0;
  var yPos = 0;
 
  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return [xPos,yPos];
}

// vérification strings	**************************************************
function isEmpty(str) {
    return (!str || 0 === str.length);
}
String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
}	

// affichage tooltips ***************************************************
function showbox(x){
document.getElementById(x).style.display = 'block';
var pos = getPosition (document.getElementById(x));
var larg = document.getElementById(x).offsetWidth;
var largeurJeu = Math.round (window.innerWidth *97 /100);
var posRel;
if (pos[0]<5) {
	var posRel = document.getElementById(x).offsetLeft;
	posRel -= pos[0];
	posRel +=5;
	//log ("element depassait à gauche");
    document.getElementById(x).style.left=posRel+"px";
}
if (pos[0] > largeurJeu-larg) {
	var posRel = document.getElementById(x).offsetLeft;
	posRel -= pos[0]-(largeurJeu-larg);
   // log ("element dépassait à droite");	
    document.getElementById(x).style.left=posRel+"px";	
}
//displayLog();
} 			
			
function hidebox(x)
{
document.getElementById(x).style.display = 'none';
}

// listes ***************************************************************
function display (liste, tableImbric) {
   if (tableImbric==undefined) {
	   tableImbric =0;
   }	
   var str = "";
   if (tableImbric >4) {
	   return str;
   } 
   if (!liste) {
	   return "false";
   }
   for (var i=0;i<liste.length;++i) {
	 if (liste[i][0]!=undefined && typeof liste[i][0] !="string") {
		 tableImbric ++;
		 str+="TABLE :"+display(liste[i], tableImbric);	      		 
	 }  
     str += liste[i] ;
	 if (i<liste.length-1) {
		 str += "/";
	 }
	 else {
		 str += ".";
	 }
   }
  return str ;
}

function phraserListe (liste, listeNombres) {
   listeNombresSpace = [];
	for (var i=0;i<liste.length;++i) {
			if (listeNombres == undefined) {
			listeNombresSpace.push ("");
		}
		   else {
			   listeNombresSpace.push (listeNombres[i]+"&nbsp");
		   }
	}
	if (liste.length ==0) {
		return "";
	}
	else if (liste.length ==1) {
		return listeNombresSpace[0]+"&nbsp"+liste[0]+".";
	}
	else {
		var et =0;
		var txt;
		for (var i=liste.length-1;i>-1;--i) {
			if (et ==0) {
				txt = listeNombresSpace[i]+liste[i]+".";
				et = 1;
			}
			else if (et==1) {
				txt = listeNombresSpace[i]+liste[i]+" et "+txt;
				et =2;
			}
			else {
				txt = listeNombresSpace[i]+liste[i]+", "+txt;
				et =2;
			}
		}
	}
	return txt;
}
      
function copier (liste) {
  var newliste=[] ;
  for (var i=0;i<liste.length;i++) {
    newliste.push (liste[i]);
	}
  return newliste;	
}	 
  
 function mergeSansDoublon (listeA,listeB) {
       var liste = [];
	   for (var i=0;i<Math.max(listeA.length, listeBlength);++i) {
	     if (!liste.includes (listeA[i])) {
		   liste.push (listeA[i]);
		   }
		 if (!liste.includes (listeB[i])) {
		   liste.push (listeB[i]);
		   }
        }		   
	   return liste ;
	   }

function numberToRomain(x) {
	 str = "";
	 switch(parseInt((x % 10000) / 1000)) {
	  case 4: str+="MMMM";break;
	  case 3: str+="MMM";break;
	  case 2: str+="MM";break;
	  case 1: str+="M";break;
	 } 
	 switch(parseInt((x % 1000) / 100)) {
	  case 9: str+="CM";break;
	  case 8: str+="DCCC";break;
	  case 7: str+="DCC";break;
	  case 6: str+="DC";break;
	  case 5: str+="D";break;
	  case 4: str+="CD";break;
	  case 3: str+="CCC";break;
	  case 2: str+="CC";break;
	  case 1: str+="C";break;
	 }
	 switch(parseInt((x % 100) / 10)) {
	  case 9: str+="xC";break;
	  case 8: str+="LXXX";break;
	  case 7: str+="LXX";break;
	  case 6: str+="LX";break;
	  case 5: str+="L";break;
	  case 4: str+="XL";break;
	  case 3: str+="XXX";break;
	  case 2: str+="XX";break;
	  case 1: str+="X";break;
	 }
	 switch(x % 10) {
	  case 9: str+="IX";break;
	  case 8: str+="VIII";break;
	  case 7: str+="VII";break;
	  case 6: str+="VI";break;
	  case 5: str+="V";break;
	  case 4: str+="IV";break;
	  case 3: str+="III";break;
	  case 2: str+="II";break;
	  case 1: str+="I";break;
	 }
	 return str;
}     

//**********************************************************************************
//**************** génération code html ********************************************
//**********************************************************************************

	 // génere texte avec tooltip d'aide 
	 function genHelpTxt (id, texte, helptxt) {
	  var i=0;
	  var decalage =200; 
	  // if (texte.length>30 || texte.length==undefined) {
		  // decalage = 260;
	   // }
	  // else if (texte.length>8) {
		  // decalage = parseInt(texte.length)*8;
	  // }
	  // else {
		  // decalage=50;
	  // }
	  var htext ="";
	  htext += "<span onmouseover='showbox(";
	  htext += '"'+id+'help")';
	  htext += "' onmouseout = 'hidebox (";
	  htext += '"'+id+'help")';	  
	  htext +=" '>"+texte+"  </span><span class='anchor' style='position:relative ; top :30px ; left: -"+decalage+"px;'><span id='"+id+"help' class='hide'>"+helptxt+"</span></span>"; 
	  return htext ; }
	  
	  	 // génere texte avec tooltip d'aide version étroite
	 function genHelpTxtEtroit (id, texte, helptxt) {
	  var htext = "<span onmouseover='showbox(";
	  htext += '"'+id+'help")';
	  htext += "' onmouseout = 'hidebox (";
	  htext += '"'+id+'help")';	  
	  htext +=" '>"+texte+"  </span><span class='anchor'><span id='"+id+"help' class='hideEtroit'>"+helptxt+"</span></span>";  
	  return htext ; }

   // genere select avec aide sur texte avant
   // arg = argument à passer à la fonction
	function genMenu (id, nbreOptions, selected, fonction, texte, options, helptxt, arg) {
	  if (arg==undefined) {
		  arg ="";
	  }	
	  else {
		  arg = ","+arg;
	  }
	  var menutext ="";
	  if (helptxt) {
	  	  menutext = genHelpTxt (id, texte+"&nbsp&nbsp", helptxt);
	  }
	  else {
	  menutext = texte +"&nbsp&nbsp"; }
	  menutext += "<select id = '"+id+"' onchange ='"+fonction+"(this.value"+arg+")'>"; 
	  for (var i=0;i<nbreOptions;++i) {
	   menutext += "<option value='"+i+"'";
	   if (i==selected) {
	    menutext += " selected >";
		}
	   menutext += "> "+options[i]+"</option>";
	   }
	  menutext += "</select>";
	  //alert (menutext);
	  return menutext;
      }	 
	  
   // genere select avec aide sur texte avant
   // arg = argument à passer à la fonction
	function genMenuLarge (id, nbreOptions, selected, fonction, texte, options, helptxt, arg) {
	  if (arg==undefined) {
		  arg ="";
	  }	
	  else {
		  arg = ","+arg;
	  }
	  var menutext ="";
	  if (helptxt) {
	  	  menutext = genHelpTxt (id, texte+"&nbsp&nbsp", helptxt);
	  }
	  else {
	  menutext = texte +"&nbsp&nbsp"; }
	  menutext += "<select id = '"+id+"' class='large' onchange ='"+fonction+"(this.value"+arg+")'>"; 
	  for (var i=0;i<nbreOptions;++i) {
	   menutext += "<option value='"+i+"'";
	   if (i==selected) {
	    menutext += " selected >";
		}
	   menutext += "> "+options[i]+"</option>";
	   }
	  menutext += "</select>";
	  //alert (menutext);
	  return menutext;
      }	  

    // generere input type number + aide
	function genMenuNum (id, min, max, step, selected, fonction, texte, helptxt, arg) {
	  if (arg==undefined) {
		  arg ="";
	  }	
	  else {
		  arg = ","+arg;
	  }		
	  var menutext ="";
	  if (helptxt) {
	  	  menutext = genHelpTxt (id, texte+"&nbsp&nbsp", helptxt);
	  }
	  else {
	  menutext = texte +"&nbsp&nbsp"; }
	  menutext += "<input type = 'number' value='"+selected+"' class = 'askNumber' min='"+min+"' max='"+max+"' step='"+step+"' id = '"+id+"' onchange ='"+fonction+"(this.value"+arg+")'/>"; 
	  //alert (menutext);
	  return menutext;
      }	   
	
	// genere input type checkbox + aide
	function genCheckBox (id, fonction, texte, helptxt, checked, arg) {
	  if (arg==undefined) {
		  arg ="";
	  }		
	  if (helptxt) {
	  	  menutext = "<label>"+genHelpTxt (id, texte+"&nbsp&nbsp", helptxt);
	  }
	  else {
	  menutext = "<label>"+texte +"&nbsp&nbsp"; }
	  menutext +="  <input type ='checkbox' value ='check' id='"+id+"' onchange ='"+fonction+"("+arg+")'";
	  if (checked) { 
	  menutext +=" checked ";
	  }
	  return menutext + "'/></label>"; 
	  }
	  
	//log

    function log (txt) {
	  try {
	  	  if (txt != undefined) {
          logTxt.push (txt) ;
	  }
	  }
	  catch (e) {
	  // alert (txt);
        displayLog();
		}
	  if (logTxt.length >100) {
		  displayLog();
	  }	
	  }
	  

    function displayLog () {
	  //alert ("displaylog");
	  var txt = "";
	  for (var i=0; i<logTxt.length;++i) {
	  txt += logTxt[i];
		}
	  document.getElementById ("bloc-log").innerHTML += txt;
	  logTxt = [];
	  }
	  
	  function ecrireBonus (bonus) {
	if (bonus>2) {
		return "<font color = '#04B45F'><b>+"+bonus+"</b></font>";
	}	  
	else if (bonus>0) {
		return "<font color = 'green'>+"+bonus+"</font>";
	}
	else if (bonus<0) {
		return "<font color = 'red'>"+bonus+"</font>";		
	}
	return "+0";
}	

function ecrireSur100 (valeur) {
	if (valeur>=70)  {
		return "<font color = '#04B45F'><b>"+valeur+"</b></font>";			
	}
	else if (valeur>55) {
		return "<font color = 'green'>"+valeur+"</font>";		
	}
	else if (valeur<41) {
		return "<font color = 'red'>"+valeur+"</font>";		
	}		
	return valeur;
}

function ecrireBonus100 (valeur) {
	if (valeur>=50)  {
		return "<font color = '#04B45F'><b>"+valeur+"%</b></font>";			
	}
	else if (valeur>24 && valeur<50) {
		return "<font color = 'green'>"+valeur+"%</font>";		
	}
	else if (valeur<=5) {
		return "<font color = 'red'>"+valeur+"%</font>";		
	}		
	return valeur+"%";
}

function ecrireSur10 (valeur) {
	if (valeur>7)  {
      return "<font color = '#04B45F'><b>"+valeur+"</b></font>";				
	}
	else if (valeur>5) {
		return "<font color = 'green'>"+valeur+"</font>";		
	}
	else if (valeur<4) {
		return "<font color = 'red'>"+valeur+"</font>";		
	}	
	return valeur;
}

function ecrireRichesse (territoire) {
	if (territoire.richesse>=baseRevenu[territoire.type]*15 && territoire.richesse >80)  {
      return "<font color = '#04B45F'><b>"+territoire.richesse+"</b></font>";				
	}
	else if (territoire.richesse>=baseRevenu[territoire.type]*10 && territoire.richesse >40) {
		return "<font color = 'green'>"+territoire.richesse+"</font>";		
	}
	else if (territoire.richesse>0 && territoire.richesse<baseRevenu[territoire.type]*5) {
		return "<font color = 'red'>"+territoire.richesse+"</font>";		
	}
	else if (territoire.richesse<=0) {
		return "<font color = 'red'><b>"+territoire.richesse+"</b></font>";		
	}	
	return territoire.richesse;
}

function ecrireRevenu (territoire) {
	if (territoire.revenu()>baseRevenu[territoire.type]+9 || territoire.revenu()>16)  {
      return "<font color = '#04B45F'><b>"+territoire.revenu()+"</b></font>";				
	}
	else if (territoire.revenu()>baseRevenu[territoire.type]+5 || territoire.revenu()>7) {
		return "<font color = 'green'>"+territoire.revenu()+"</font>";		
	}
	else if (territoire.revenu()<3) {
		return "<font color = 'red'>"+territoire.revenu()+"</font>";		
	}	
	return territoire.revenu();
}

function ecrireXp (valeur) {
	var tourFacteur = tour/5;
	if (valeur>8+tourFacteur || valeur >19)  {
      return "<font color = '#04B45F'><b>"+valeur+"</b></font>";				
	}
	else if (valeur>4+tourFacteur || valeur >9) {
		return "<font color = 'green'>"+valeur+"</font>";		
	}
	else if (valeur<2+tourFacteur && valeur <5) {
		return "<font color = 'red'>"+valeur+"</font>";		
	}	
	return valeur;
}

	function Xeme (x) {
		if (!x) {
			return "1ère";
		}
		else {
			return (x+1)+"ème";
		}
	}
	
	function arrondir (x, ax) {
		if (ax==undefined) {
			ax=10;
		}
		var result = x/ax;
		return Math.round(result)*ax;
	}

	export * as utilitaires from "utilitaires.js";
	