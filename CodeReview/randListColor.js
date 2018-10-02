function randLstColor(count){
    var bgc=[];
    var hbgc=[];
    var rtn=[];
    for(var i=0;i<count;i++){
      var base=85+Math.floor(Math.random() * 85)
      var randomNumber1 = base -80 + Math.floor(Math.random() * 160);
      var randomNumber2 = base -80 + Math.floor(Math.random() * 160);
      var randomNumber3 = base -80 + Math.floor(Math.random() * 160);
      var bgcstring="#"+randomNumber1.toString(16).toUpperCase()+randomNumber2.toString(16).toUpperCase()+randomNumber3.toString(16).toUpperCase();
      randomNumber1=randomNumber1+9;
      randomNumber2=randomNumber2+9;
      randomNumber3=randomNumber3+9;
      var hbgcstring="#"+randomNumber1.toString(16).toUpperCase()+randomNumber2.toString(16).toUpperCase()+randomNumber3.toString(16).toUpperCase();
      bgc.push(bgcstring);
      hbgc.push(hbgcstring);
    }
    rtn.push(bgc);
    rtn.push(hbgc);
    return rtn;
  }