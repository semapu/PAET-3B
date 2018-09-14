function getDomain() {
var lstr = location.hostname.split(".");
var d="";
for(var i=1;i<=2&&lstr.length-i>=0;i++) d="."+lstr[lstr.length-i]+d;
return(d);}
function SetCookie(na, va, da, d, pa){ document.cookie = na + "=" + escape(va) + (da?";expires=" + da.toGMTString(da.getTime()):"") + ";Domain=" + (d?d:getDomain()) +";Path="+(pa?pa:"/") + ";secure";}
function GetCookie(na) {
fo=new RegExp(na+"=([^;]*)").exec(document.cookie);
if(na=="sipublic") fo=new RegExp(na+"=([^!]*)").exec(document.cookie);
if(fo) return unescape(fo[1])
return null; }
function getRandom() {
var raR = "R" + Math.random();
var ra = raR.substring(3,7);
return(ra);}
function getTimestamp() {
var nw = new Date();
var y = "" + nw.getYear();
var m = 1 + nw.getUTCMonth();
var d = nw.getUTCDate();
var H = nw.getUTCHours();
var M = nw.getUTCMinutes();
var S = nw.getUTCSeconds();
m=(m>9?""+m:"0"+m);d=(d>9?""+d:"0"+d);H=(H>9?""+H:"0"+H);M=(M>9?""+M:"0"+M);S=(S>9?""+S:"0"+S);return(y + m + d + H + M + S);}
function writit(id,text) {
if (document.getElementById) { x = document.getElementById(id); x.innerHTML = ''; x.innerHTML = text;} 
else if (document.all) { x = document.all[id]; x.innerHTML = text; }
}
function PopIt(u,H,W){
var options='width=400,height=400,toolbar=0,directories=0,status=0,location=0, menubar=0, scrollbars=1, resizable=1';
if (H&&W) {options='toolbar=0,directories=0,status=0,location=0, menubar=0, scrollbars=0 resizable=1, width='+parseInt(W)+', height='+parseInt(H);}
window.open(u,'',options);
return false
}
function pops(u,fi,no){
if (fi==undefined) return PopIt(u,390,610);
if ((fi == "tipoA") || (fi == "tipoB") || (fi == "tipoC") || (fi == "tipoF")){
window.open(u)
}
if (fi=="tipoD"){ 
window.open(u,"","toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,height=470,width=770")
}
if (fi =="tipoE"){ 
window.open(u,"Servicaixa","toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,height=390,width=610")
}
if (fi =="condi"){ 
window.open(u,no,"toolbar=yes,width=758,height=500,left=0,top=0,scrollbars=yes")
}
if (fi =="tipoG"){    
remoto=window.open(u,"","toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,height=460,width=460");
if (remoto.opener == null) remoto.opener = window;    
remoto.opener.parent.name = "frameprin";
}
}
function MM_openBrWindow(u,n,f) {window.open(u,n,f);}
function getparam(nom) {
var params=(location.search.substring(1,location.search.length)).split('&');
for (var i=0 ; i<params.length ; i++){
var pos = params[i].indexOf("=");
var name = params[i].substring(0, pos);
var value = params[i].substring(pos + 1);
if (nom==name) return value;
}
return false;
}
var m_es=new Array("de enero","de febrero","de marzo","de abril","de mayo","de junio","de julio","de agosto","de septiembre","de octubre","de noviembre","de diciembre");
var m_ca=new Array("de gener","de febrer","de mar\u00E7","d'abril","de maig","de juny","de juliol","d'agost","de setembre","d'octubre","de novembre","de desembre");
var m_en=new Array("January","February","March","April","May","June","July","August","September","October","November","December");
var m_fr=new Array("janvier","f\u00E9vrier","mars","avril","mai","juin","juillet","ao\u00FBt","septembre","octobre","novembre","d\u00E9cembre");
var m_de=new Array("Januar","Februar","M\u00E4rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember");
var m_pt=new Array("Janeiro","Fevereiro","Mar\u00E7o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro");
var m_it=new Array("Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre");
var m_gl=new Array("Xeneiro","Febreiro","Marzo","Abril","Maio","Xu\u00F1o","Xullo","Agosto","Setembro","Octubro","Novembro","Decembro");
var m_eu=new Array("Urtarila","Otsaila","Martxoa","Apirila","Maiatza","Ekaina","Uztaila","Abuztua","Iraila","Urria","Azaroa","Abendua");
var s_es=new Array("Domingo","Lunes","Martes","Mi\u00E9rcoles","Jueves","Viernes","S\u00E1bado");
var s_ca=new Array("Diumenge","Dilluns","Dimarts","Dimecres","Dijous","Divendres","Dissabte");
var s_en=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
var s_fr=new Array("Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi");
var s_de=new Array("Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag");
var s_pt=new Array("Domingo","Segunda-feira","Ter\u00E7a-feira","Quarta-feira","Quinta-feira","Sexta-feira","S\u00E1bado");
var s_it=new Array("Domenica","Luned\u00EC","Marted\u00EC","Mercoled\u00EC","Gioved\u00EC","Venerd\u00EC","Sabato");
var s_gl=new Array("Domingo","Luns","Martes","Mercores","Xoves","Venres","S\u00E1bato");
var s_eu=new Array("Igandea","Astelehena","Asteartea","Asteazkena","Osteguna","Ostirala","Larunbata");

var ladata=new Date();
var mes=ladata.getMonth();
var dia=ladata.getDay();
var numero=ladata.getDate();
var any=ladata.getYear();
if (any < 1000) any = any + 1900;

date_es=s_es[dia] + ", " + numero +" "+ m_es[mes];
date_ca=s_ca[dia] + ", " + numero +" "+ m_ca[mes];
date_en=s_en[dia] + ", " + numero +" "+ m_en[mes];
date_fr=s_fr[dia] + ", " + numero +" "+ m_fr[mes];
date_de=s_de[dia] + ", " + numero +" "+ m_de[mes];
date_pt=s_pt[dia] + ", " + numero +" "+ m_pt[mes];
date_it=s_it[dia] + ", " + numero +" "+ m_it[mes];
date_gl=s_gl[dia] + ", " + numero +" "+ m_gl[mes];
date_eu=s_eu[dia] + ", " + numero +" "+ m_eu[mes];
var random = getRandom();
var timestamp = getTimestamp();
var timestampCode = timestamp + random;
var valorAnonim=GetCookie("anonid");
var valorRegistrat=GetCookie("ssuid");
var valorSipublic=GetCookie("sipublic");
dataExp = new Date(3000,1,1);
if (valorSipublic==null) {
if (valorRegistrat==null) {
if (valorAnonim==null) {
SetCookie("anonid","A" + timestampCode,dataExp);
SetCookie("real","A" + timestampCode);
} else {
SetCookie("real",valorAnonim);
}
} else {
if (valorAnonim==null) SetCookie("anonid","A" + timestampCode,dataExp);
SetCookie("real","R" + valorRegistrat);
}
} else {
if (valorAnonim==null) SetCookie("anonid","A" + timestampCode,dataExp);
}
function url_modificada()
{
if ( window.location.protocol == "http:" ) window.location=location.href.replace(/^http:/,'https:');
}
function digestText (tin, ml)
{ var t=tin.toUpperCase();
var o='';
for(var i=0; (i<t.length)&&(ml>0);i++) {
var a=t.charAt(i);
if ((a<='Z')&&(a>='A')) {o+=a; ml--;}
}
return o;
}


function doSILO() {	if (GetCookie('refSTC')) {writit('header', '<iframe src="https://lo.lacaixa.es/GPeticiones?PN=SEI&PE=4&DEMO=0&CANAL=I&IDIOMA=02&SESION=0" id="cabLO" name="cabLO" frameborder="0" marginheight="0" marginwidth="0" scrolling="no" style="width:100%;height:59px;top:0;left:0;margin:0;padding:0;overflow:hidden; border:0px;"></iframe>'); document.getElementById('header').className += " lo";};}
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {window.onload = func;}
	else {	window.onload = function() { oldonload(); func();} }
}

addLoadEvent(doSILO);


function parsea_url()
{
var as=document.getElementsByTagName('A');
for (var i=0; i<as.length;i++){
var loce=as[i].getAttribute('loce');
var rel=as[i].getAttribute('rel');
if (rel>'') loce=rel;
if (loce>'') {
var talt=(as[i].getAttribute('title'));
if (talt) { loce=loce+'-'+digestText(talt,15);}
var link=(as[i].getAttribute('href'));
if (link.indexOf('?')>0) link+='&loce='+loce;
else link+='?loce='+loce;
as[i].setAttribute('href',link);
}
}
}

/* NEOJs Resource Library
Author: VILT
*/
var NEO = function() {
	// Private variables here, don't forget to declare them with var

	// Private methods go here, don't use "this". Use semantic names.
	function getDomain() {
		var index = location.hostname.indexOf(".");
		if (index == -1)
			return location.hostname;
		return location.hostname.substring(index, location.hostname.length);
	}
	
	// Public methods go here, use "this". Use semantic names.
	this.getVariableFromURL = function(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);
		if (results == null)
			return "";
		else
			return results[1];
	}
	this.setCookie = function(name, value, date) {
		document.cookie = name + "=" + escape(value)
				+ (date ? "; expires=" + date.toGMTString(date.getTime()) : "")
				+ "; domain=" + getDomain() + "; path=/";
	}	
	this.getCookie = function(name) {
		var begin = document.cookie.indexOf(name + "=");
		if (begin == -1)
			return null;
		var end = document.cookie.indexOf(";", begin);
		if (end == -1)
			end = document.cookie.length;
		return document.cookie.substring(
				document.cookie.indexOf("=", begin) + 1, end);
	}
}
