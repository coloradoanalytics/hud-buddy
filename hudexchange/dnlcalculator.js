/* ROAD - This function clears form fields specific
to Cars, the Road DNL value, and the Site DNL value.*/
function clear_cars_fields(form)
{
  form.distance.value="";
  form.dts.value="";
  form.speed.value="";
  form.trips.value="";
  form.nightFraction.value="";
  form.roadGradient.value="";
  form.CARDNLVALUE.value="";
  form.RDNLVALUE.value="";
  document.formall.sitednl.value=0; 
  
}
/* ROAD - This function clears form fields specific
to Medium Trucks, the Road DNL value, and the Site
DNL value. */
function clear_mediumTrucks_fields(form)
{
 //form.mtANLS.valu="";
 form.mtdistance.value="";
  form.mtdts.value="";
  form.mtspeed.value="";
  form.mttrips.value="";
  form.mtnightFraction.value="";
  form.mtRoadGradient.value="";
  form.MTDNLVALUE.value="";
  form.RDNLVALUE.value="";
  document.formall.sitednl.value=0;
}
/* ROAD - This function clears form fields specific to
Heavy Trucks, the Road DNL value, and the Site DNL value.*/
function clear_heavyTrucks_fields(form)
{
 //form.htANLS.valu="";
 form.htdistance.value="";
  form.htdts.value="";
  form.htspeed.value="";
  form.httrips.value="";
  form.htnightFraction.value="";
  form.htRoadGradient.value="";
  form.HTDNLVALUE.value="";
  form.RDNLVALUE.value="";
  document.formall.sitednl.value=0;
}
// ROAD - This function disables form fields specific to Cars. 
function disable_cars_fields(form)
{
  //form.ANLS.disabled=true;
  form.distance.disabled=true;
  form.dts.disabled=true;
  form.speed.disabled=true;
  form.trips.disabled=true;
  form.nightFraction.disabled=true;
}
// ROAD - This function disables form fields specific to Medium Trucks. 
function disable_mediumTrucks_fields(form)
{
  //form.mtANLS.disabled=true;
  form.mtdistance.disabled=true;
  form.mtdts.disabled=true;
  form.mtspeed.disabled=true;
  form.mttrips.disabled=true;
  form.mtnightFraction.disabled=true;
}
// ROAD - This function disables form fields specific to Heavy Trucks.
function disable_heavyTrucks_fields(form)
{
  //form.htANLS.disabled=true;
  form.htdistance.disabled=true;
  form.htdts.disabled=true;
  form.htspeed.disabled=true;
  form.httrips.disabled=true;
  form.htnightFraction.disabled=true;
  form.htRoadGradient.disabled=true;
}
// ROAD - This function enables form fields specific to Cars.
function enable_cars_fields(form)
{
  //form.ANLS.disabled=false;
  form.distance.disabled=false;
  form.dts.disabled=false;
  form.speed.disabled=false;
  form.trips.disabled=false;
  form.nightFraction.disabled=false;
  
}
// ROAD - This function enables form fields specific to Medium Trucks.
function enable_mediumTrucks_fields(form)
{
  //form.mtANLS.disabled=false;
  form.mtdistance.disabled=false;
  form.mtdts.disabled=false;
  form.mtspeed.disabled=false;
  form.mttrips.disabled=false;
  form.mtnightFraction.disabled=false;
}
// ROAD - This function enables form fields specific to Medium Trucks.
function enable_heavyTrucks_fields(form)
{
  //form.htANLS.disabled=false;
  form.htdistance.disabled=false;
  form.htdts.disabled=false;
  form.htspeed.disabled=false;
  form.httrips.disabled=false;
  form.htnightFraction.disabled=false;
  form.htRoadGradient.disabled=false;  
}
/* ROAD - This function resets and disables text fields on the road form.
In addition, it resets the value of the site dnl to 0. */
function reset_Road(form)
{
  form.reset();
  disable_cars_fields(form);
  disable_mediumTrucks_fields(form);
  disable_heavyTrucks_fields(form);
  document.formall.sitednl.value=0;  
}
/* ROAD - This function copies the Cars' Distance value into the Medium
and Heavy Trucks distance fields, if they're selected. */ 
function copyDistanceRoad(form)
{
 if(form.mtCK.checked==true)
 {
  form.mtdistance.value=form.distance.value;
 }
 if(form.htCK.checked==true)
 {
  form.htdistance.value=form.distance.value;
 }
}
/* PAGE - This function reloads the page, and resets the value of the
site dnl to zero (to prepare for a new calculation). */
function refreshPage()
{
 window.location.reload(false);
  document.formall.sitednl.value=0;
}
/* ROAD - This function contains the logic for enabling and disabling
specific form fields depending on which vehicles are selected. */
function vehicle_check(form)
{
  //Check Cars checkbox
  if(form.carCK.checked==true)
  {
    enable_cars_fields(form);
  }
  else if(form.carCK.checked==false)
  {
   clear_cars_fields(form);
   disable_cars_fields(form);
  }
  
  //Check Medium Trucks checkbox
  if(form.mtCK.checked==true)
  {
    enable_mediumTrucks_fields(form);
    if(form.distance.value>=0)
    {
      form.mtdistance.value=form.distance.value;
    }
  }
  else if(form.mtCK.checked==false)
  {
    clear_mediumTrucks_fields(form);
    disable_mediumTrucks_fields(form);
  }
  
  //Check Heavy Trucks checkbox
  if(form.htCK.checked==true)
  {
    enable_heavyTrucks_fields(form);
    if(form.distance.value>=0)
    {
      form.htdistance.value=form.distance.value;
    }
  }
  else if(form.htCK.checked==false)
  {
    clear_heavyTrucks_fields(form);
    disable_heavyTrucks_fields(form);
  }
}

/* ROAD & RAIL - This function rounds a value to a specific number of
decimal places.
Input: number to be rounded, and number of decimal spaces 
Output: rounded number */ 
function roundNumber(num, powerOf)
{
 	var result = Math.round(num*Math.pow(10,powerOf))/(1 * Math.pow(10,powerOf));
 	return result;
}
/* ROAD & RAIL - This function finds the greater of two numbers.
Input: two numbers
Output: greater number */
function largerNum(num1, num2)
{
 	if(num1>num2)
 	{
  		return num1;
 	}
 	else
 	{
  		return num2;
 	}
}
/* ROAD & RAIL & Airplane - This function combines any two given sound levels.
Input: two noise levels Output: combined noise level 
*/
function Combine_Sound_Levels(noise1, noise2)
{
	//Declare vars
	var noise_dif = new Number(0);
	var combined_sound = new Number(0);
	var noise_factor = new Number(0);

	noise_dif = Math.abs(noise1-noise2);
	
		/////////////// Start of interpolation function /////////////
		// Create Array to handle the variables for the interpolation equations
		// The values of each element correspond to the combination of Sound Levels table
		var cslA = new Array();
		cslA[0] = 3.0;
		cslA[1] = 2.5;
		cslA[2] = 2.1;
		cslA[3] = 1.8;
		cslA[4] = 1.5;
		cslA[5] = 1.2;
		cslA[6] = 1.0;
		cslA[7] = .8;
		cslA[8] = .6;
		cslA[9] = .5;
		cslA[10] = .4;
		cslA[11] = null;
		cslA[12] = .3;
		cslA[13] = null;
		cslA[14] = .2;
		cslA[15] = null;
		cslA[16] = .1;
		var varInter = new Number(0);//Clear var value
		var varLoopStop = new Number(0);//Clear var value
		varLoopStop = cslA.length - 1;//set value that loop will stop for
		
		//Determines if the difference in the two noises are under 
		//the maximum value lised in "The Noise Guidebook" chart
		//If not, the larger number of the two noises is returned
		if  (noise_dif <= varLoopStop) 
		{
			//Loops to check the difference in noise levels against the array 
			//of values to determine the correct one to use base on chart in "The Noise Guidebook"
			while (varInter <= varLoopStop) 
			{
				varInterNext = varInter + 1;
				//Skips array value if no preset value for the Noise Difference level
				while (cslA[varInterNext] == null) 
				{
					varInterNext = varInterNext + 1;
				}
				//If correct noise difference level is found, completes equation
				if (noise_dif >= varInter && noise_dif <= varInterNext) 
				{
					var varX1 = new Number(varInter);
					var varX2 = new Number(noise_dif);
					var varX3 = new Number(varInterNext);
					var varY1 = new Number(cslA[varInter]);
					var varY3 = new Number(cslA[varInterNext]);
					var varXNum = new Number((varX2 - varX1));
					var varYNum = new Number((varY3 - varY1));
					var varNum = new Number(varXNum * varYNum);
					var varDen = new Number(varX3 - varX1); 
					var varDiv = new Number(varNum / varDen);
					noise_factor = (varDiv + varY1);
					var largeNum = new Number(largerNum(noise1,noise2));
					var varNewSiteDNL = new Number(largeNum + noise_factor);
					varInter = varLoopStop + 2;
				} 
				else 
				{
					varInter = varInterNext;
				}
			}
		} 
		else 
		{
			noise_factor = 0;
			varNewSiteDNL = noise_factor + largerNum(noise1,noise2);		
		}
		/////////////// End of interpolation function/////////////
  	combined_sound = varNewSiteDNL;
	return combined_sound;
}
/* ROAD - This function determines which vehicles are selected,
then calculates the noise level for each selected vehicle,
and finally combines all vehicles noise levels. */
function CalculateRoadSources(form)
{
 var x0,x1;
 var carerror;
 var mterror;
 var hterror;
  
 // Case 1: All Vehicles Selected
 if (form.carCK.checked==true && form.mtCK.checked==true && form.htCK.checked==true)
 {
  carerror = CalculateCars(form);
  if(carerror=="0")
  {
   mterror = CalculateMT(form);
      if(mterror=="0")
      {
        hterror = CalculateHT(form);
        if(hterror=="0")
        {
          x0 = Combine_Sound_Levels(parseFloat(form.CARDNLVALUE.value), parseFloat(form.MTDNLVALUE.value));
          x1 = Combine_Sound_Levels(x0, parseFloat(form.HTDNLVALUE.value));
          form.RDNLVALUE.value=roundNumber(x1,1);
        }
      }
   }
  }
  // Case 2: Cars AND MediumTrucks Selected
  else if (form.carCK.checked==true && form.mtCK.checked==true && form.htCK.checked==false)
  {
    carerror = CalculateCars(form);
    if(carerror=="0")
    {
      mterror=CalculateMT(form);
      if(mterror=="0")
      {
        x1 = Combine_Sound_Levels(parseFloat(form.CARDNLVALUE.value), parseFloat(form.MTDNLVALUE.value));
        form.RDNLVALUE.value=roundNumber(x1,1);
      }
    }
  }
  // Case 3: Cars AND HeavyTrucks Selected
  else if(form.carCK.checked==true && form.mtCK.checked==false && form.htCK.checked==true)
  {
    carerror = CalculateCars(form);
   if(carerror=="0")
   {
      hterror=CalculateHT(form);
      if(hterror=="0")
      {
        x1 = Combine_Sound_Levels(parseFloat(form.CARDNLVALUE.value), parseFloat(form.HTDNLVALUE.value));
        form.RDNLVALUE.value=roundNumber(x1,1);
		
      }
    }
  }
  // Case 4: MediumTrucks AND HeavyTrucks Selected
  else if(form.carCK.checked==false && form.mtCK.checked==true && form.htCK.checked==true)
  {
    mterror = CalculateMT(form);
   if(mterror=="0")
   {
      hterror=CalculateHT(form);
      if(hterror=="0")
      {
        x1 = Combine_Sound_Levels(parseFloat(form.MTDNLVALUE.value), parseFloat(form.HTDNLVALUE.value));
        form.RDNLVALUE.value=roundNumber(x1,1);
		
      }
    }
  }
  // Case 5: Cars Only Selected
  else if(form.carCK.checked==true && form.mtCK.checked==false && form.htCK.checked==false)
  {
    carerror = CalculateCars(form);
    if(carerror=="0")
    {
      x1 = parseFloat(form.CARDNLVALUE.value);
      form.RDNLVALUE.value=roundNumber(x1,1); 
	  
    }
  }
  // Case 6: MediumTrucks Only Selected
 else if(form.carCK.checked==false && form.mtCK.checked==true && form.htCK.checked==false)
  {
    mterror = CalculateMT(form);
    if(mterror=="0")
    {
      x1 = parseFloat(form.MTDNLVALUE.value);
      form.RDNLVALUE.value=roundNumber(x1,1);
	  
    } 
  }
  // Case 7: HeavyTrucks Only Selected
  else if(form.carCK.checked==false && form.mtCK.checked==false && form.htCK.checked==true)
  {
    hterror = CalculateHT(form);
    if(hterror=="0")
    {
      x1 = parseFloat(form.HTDNLVALUE.value);
      form.RDNLVALUE.value=roundNumber(x1,1);
	  
    }    
  }
  // Case 8: No Vehicles Selected
  else if(form.carCK.checked==false && form.mtCK.checked==false && form.htCK.checked==false)
  {
    alert("Please select at least one Vehicle Type.");
  }
  
}
/* ROAD - This function first validates all text fields specific
to Cars. If all fields contain valid values, the function
proceeds to calculate the Cars Noise level (Cars DNL) */
function CalculateCars(form)
{
 if (form.distance.value == "")
 {
    alert("Effective Distance must contain a value.");
    form.distance.focus();
  }
  else if(isNaN(form.distance.value))
  {
    alert("Effective Distance value must be numeric.");
    form.distance.focus();
  }
  else if(form.distance.value<=0)
  {
    alert("Effective Distance value must be a positive number.");
    form.distance.focus();
  }
  else if (form.distance.value!=Math.round(form.distance.value))
  {
    alert("Effective Distance value must be a non-decimal number.");
    form.distance.focus();
  }
  else if (isNaN(form.dts.value))
  {
   alert("Distance to Stop Sign value, if available, must be numeric.");
    form.dts.focus();
  }
  else if (form.dts.value < 0)
  {
   alert("Distance to Stop Sign value must be a positive number.");
   form.dts.focus();
  }
  else if (form.dts.value > 600)
  {
    alert("Distance to Stop Sign value must be a less than or equal to 600, or left blank.");
    form.dts.focus();
  }
  else if (form.dts.value != Math.round(form.dts.value))
  {
    alert("Distance to Stop Sign value must be non-decimal.");
    form.dts.focus();
  }
 else if (form.speed.value == "")
  {
    alert("Average Speed value must contain a value.");
    form.speed.focus();
  }
  else if(isNaN(form.speed.value))
  {
   alert("Average Speed value must be numeric.");
   form.speed.focus();
  }
  else if (form.speed.value<=0)
  {
   alert("Average Speed value must be a positive number.");
   form.speed.focus();
  }
  else if (form.speed.value != Math.round(form.speed.value))
  {
   alert("Average Speed value must be a non-decimal number.");
    form.speed.focus();
  }
  else if (form.trips.value == "")
  {
   alert("Average Daily Trips value must contain a value.");
   form.trips.focus();
  }
  else if(isNaN(form.trips.value))
  {
   alert("Average Daily Trips value must be numeric.");
   form.trips.focus();
  }
  else if (form.trips.value != Math.round(form.trips.value))
  {
   alert("Average Daily Trips value must be a non-decimal number.");
    form.trips.focus();
  }
  else if (form.nightFraction.value == "")
  {
   alert("Night Fraction of ADT value must contain a value.");
   form.nightFraction.focus();
  }
  else if(isNaN(form.nightFraction.value))
  {
   alert("Night Fraction of ADT value must be numeric.");
   form.nightFraction.focus();
  }
  else if(form.nightFraction.value<0)
  {
   alert("Night Fraction of ADT value must be a positive number.");
    form.nightFraction.focus();
  }
  else if (form.nightFraction.value != Math.round(form.nightFraction.value))
  {
   alert("Night Fraction of ADT value must be a non-decimal number.");
    form.nightFraction.focus();
  }
  else
  {
   	num1=parseFloat(form.speed.value);
    num2=parseFloat(form.distance.value);
    numAdt=parseFloat(form.trips.value);
    numNight=parseFloat(form.nightFraction.value)/100;
    numDay=1-numNight;
    if (form.dts.value>0)
    {
      	eadt=numAdt*(.1+(.9*(parseFloat(form.dts.value)/600)));
    }
    else if (form.dts.value=="")
    {
     	eadt=numAdt;
    }
    else if (form.dts.value==0)
    {
     	eadt=numAdt*.1;
    }
	//Calculations for cars
    dnlSub=eadt*(numDay+(10*numNight));
    logNum1=Math.LOG10E*Math.log(num1);
    logNum2=Math.LOG10E*Math.log(num2);
    logDnlSub=Math.LOG10E*Math.log(dnlSub);
    aeResult=64.6+20*logNum1-15*logNum2;
    dnlResult=aeResult+10*logDnlSub-49.4;

      form.CARDNLVALUE.value=roundNumber(parseFloat(dnlResult),1);
    return "0";
 }
 return "1";
}
/* ROAD - This function first validates all text fields specific
to Medium Trucks. If all fields contain valid values, the
function proceeds to calculate the Medium Trucks 
Noise level (Medium Trucks DNL) */
function CalculateMT(form)
{
  if (form.mtdistance.value == "")
  {
    alert("Effective Distance must contain a value.");
    form.mtdistance.focus();
  }
  else if(isNaN(form.mtdistance.value))
  {
    alert("Effective Distance value must be numeric.");
    form.mtdistance.focus();
  }
  else if(form.mtdistance.value<=0)
  {
    alert("Effective Distance value must be a positive number.");
    form.mtdistance.focus();
  }
  else if (form.mtdistance.value != Math.round(form.mtdistance.value))
  {
    alert("Effective Distance value must be a non-decimal number.");
    form.mtdistance.focus();
  }
  else if(isNaN(form.mtdts.value))
  {
    alert("Distance to Stop Sign value, if available, must be numeric.");
    form.mtdts.focus();
  }
  else if (form.mtdts.value < 0)
  {
    alert("Distance to Stop Sign value must be a positive number.");
    form.mtdts.focus();
  }
  else if (form.mtdts.value > 600)
  {
    alert("Distance to Stop Sign value must be a less than or equal to 600, or left blank.");
    form.mtdts.focus();
  }
  else if (form.mtdts.value != Math.round(form.mtdts.value))
  {
    alert("Distance to Stop Sign value must be a non-decimal number.");
    form.mtdts.focus();
  }
  else if (form.mtspeed.value == "")
  {
    alert("Average Speed must contain a value.");
    form.mtspeed.focus();
  }
  else if(isNaN(form.mtspeed.value))
  {
    alert("Average Speed value must be numeric.");
    form.mtspeed.focus();
  }
  else if(form.mtspeed.value<=0)
  {
    alert("Average Speed value must be greater a positive number.");
    form.mtspeed.focus();
  }
  else if (form.mtspeed.value != Math.round(form.mtspeed.value))
  {
    alert("Average Speed value must be a non-decimal number.");
    form.mtspeed.focus();
  }
  else if (form.mttrips.value == "")
  {
   alert("Average Daily Trips value must contain a value.");
   form.mttrips.focus();
  }
  else if(isNaN(form.mttrips.value))
  {
    alert("Average Daily Trips value must be numeric.");
   form.mttrips.focus();
  }
  else if (form.mttrips.value != Math.round(form.mttrips.value))
  {
    alert("Average Daily Trips value must be a non-decimal number.");
    form.mttrips.focus();
  }
  else if(form.mtnightFraction.value == "")
  {
    alert("Night Fraction of ADT must contain a value.");
   form.mtnightFraction.focus();
  }
  else if(isNaN(form.mtnightFraction.value))
  {
   alert("Night Fraction of ADT value must be numeric.");
   form.mtnightFraction.focus();
  }
  else if(form.mtnightFraction.value<0)
  {
   alert("Night Fraction of ADT value must be a positive number.");
   form.mtnightFraction.focus();
  }
  else if (form.mtnightFraction.value != Math.round(form.mtnightFraction.value))
  {
    alert("Night Fraction of ADT value must be a non-decimal number.");
   form.mtnightFraction.focus();
  }
  else
  {
   num1=parseFloat(form.mtspeed.value);
   num2=parseFloat(form.mtdistance.value);
   numAdt=parseFloat(form.mttrips.value);
   numNight=parseFloat(form.mtnightFraction.value)/100;
   numDay=1-numNight;
    if (form.mtdts.value>0)
    {
      eadt=numAdt*(.1+(.9*(parseFloat(form.mtdts.value)/600)))*10;
    }
    else if (form.mtdts.value==0 || form.mtdts.value=="")
   {
    eadt=numAdt;
   }

    
    //Calculations for Medium trucks
   	dnlSub=eadt*(numDay+(10*numNight));
    logNum1=Math.LOG10E*Math.log(num1);
    logNum2=Math.LOG10E*Math.log(num2);
    logDnlSub=Math.LOG10E*Math.log(dnlSub);
//Changed by Sage
//Following line has been changed due to wrong number 74.6, it should be 64.6 same as for cars
//    aeResult=74.6+20*logNum1-15*logNum2;
	var midTruckVal = 64.6;
    aeResult = midTruckVal + 20 * logNum1 - 15 * logNum2;
    dnlResult = aeResult + 10 * logDnlSub - 49.4;


      form.MTDNLVALUE.value=roundNumber(dnlResult,1);
    return "0";
  }
  return "1";
}
/* ROAD - This function first validates all text fields specific
to Heavy Trucks. If all fields contain valid values, the
function proceeds to calculate the Heavy Trucks Noise level
(Heavy Trucks DNL) */
function CalculateHT (form)
{
  if (form.htdistance.value == "")
 {
    alert("Effective Distance must contain a value.");
    form.htdistance.focus();
  }
  else if(isNaN(form.htdistance.value))
  {
    alert("Effective Distance value must be numeric.");
    form.htdistance.focus();
  }
  else if(form.htdistance.value<=0)
  {
    alert("Effective Distance value must be a positive number.");
    form.htdistance.focus();
  }
  else if (form.htdistance.value != Math.round(form.htdistance.value))
 {
    alert("Effective Distance value must be a non-decimal number.");
  form.htdistance.focus();
  }
  else if(isNaN(form.htdts.value))
  {
    alert("Distance to Stop Sign value, if available, must be numeric.");
    form.htdts.focus();
  }
  else if (form.htdts.value < 0)
  {
   alert("Distance to Stop Sign value must be a positive number.");
   form.htdts.focus();
  }
  else if (form.htdts.value > 600)
  {
    alert("Distance to Stop Sign value must be a less than or equal to 600, or leave field blank.");
    form.htdts.focus();
  }
  else if (form.htdts.value != Math.round(form.htdts.value))
  {
    alert("Distance to Stop Sign value must be a non-decimal number.");
    form.htdts.focus();
  }
  else if (form.htspeed.value == "")
  {
    alert("Average Speed must contain a value.");
    form.htspeed.focus();
  }
  else if(isNaN(form.htspeed.value))
  {
    alert("Average Speed value must be numeric.");
    form.htspeed.focus();
  }
  else if (form.htspeed.value<=0)
  {
    alert("Average Speed value must be a positive number.");
    form.htspeed.focus();
  }
  else if (form.htspeed.value != Math.round(form.htspeed.value))
 {
    alert("Average Speed value must be a non-decimal number.");
  form.htspeed.focus();
  }
  else if (form.httrips.value == "")
  {
    alert("Average Daily Trips must contain a value.");
    form.httrips.focus();
  }
  else if(isNaN(form.httrips.value))
  {
    alert("Average Daily Trips value must be numeric.");
    form.httrips.focus();
  }
  else if (form.httrips.value != Math.round(form.httrips.value))
  {
    alert("Average Daily Trips value must be a non-decimal number.");
    form.httrips.focus();
  }
  else if (form.htnightFraction.value == "")
  {
    alert("Night Fraction of ADT must contain a value.");
    form.htnightFraction.focus();
  }
  else if(isNaN(form.htnightFraction.value))
  {
    alert("Night Fraction of ADT value must be numeric.");
    form.htnightFraction.focus();
  }
  else if(form.htnightFraction.value<0)
  {
    alert("Night Fraction value must be a positive number.");
    form.htnightFraction.focus();
  }
  else if (form.htnightFraction.value != Math.round(form.htnightFraction.value))
 {
    alert("Night Fraction value must be a non-decimal number.");
    form.htnightFraction.focus();
  }
  else if (form.htRoadGradient.value == "")
  {
    alert("Road Gradient must contain a value.");
    form.htRoadGradient.focus();
  }
  else if(isNaN(form.htRoadGradient.value))
  {
    alert("Road Gradient value must be numeric.");
    form.htRoadGradient.focus();
  }
  else if(form.htRoadGradient.value<0)
  {
    alert("Road Gradient value must be a positive number.");
    form.htnightFraction.focus();
  }
  else if (form.htRoadGradient.value != Math.round(form.htRoadGradient.value))
  {
    alert("Road Gradient value must be a non-decimal number.");
    form.htRoadGradient.focus();
  }
  else
  {
    num1=parseFloat(form.htspeed.value);
    num2=parseFloat(form.htdistance.value);
    numAdt=parseFloat(form.httrips.value);
    numNight=parseFloat(form.htnightFraction.value)/100;
    numRG=parseFloat(form.htRoadGradient.value);
    numDay=1-numNight;
    numGAF = Math.pow(numRG,.5);
    if (form.htdts.value=="")
    {
      eadt=numAdt;
    }
    else if (form.htdts.value>0 || form.htdts.value==0)
    {
      if (numAdt<=1200)
      {
        eadt=numAdt*1.8;
      }
     else if (numAdt>1200 && numAdt<=2400)
     {
        eadt=numAdt*2.0;
     }
     else if (numAdt>2400 && numAdt<=4800)
     {
        eadt=numAdt*2.3;
     }
     else if (numAdt>4800 && numAdt<=9600)
     {
        eadt=numAdt*2.8;
     }
     else if (numAdt>9600 && numAdt<=19200)
     {
        eadt=numAdt*3.8;
     }
     else if (numAdt>19200)
     {
        eadt=numAdt*4.5;
      }
    }
	//Calculations for Heavy trucks	
/*
      dnlSub=eadt*(numDay+(10*numNight));
      logNum1=Math.LOG10E*Math.log(num1);
      logNum2=Math.LOG10E*Math.log(num2);
      logDnlSub=(Math.log(dnlSub)/Math.LN10);
*/
    dnlSub=eadt*(numDay+(10*numNight));
    logNum1=Math.LOG10E*Math.log(num1);
    logNum2=Math.LOG10E*Math.log(num2);
    logDnlSub=Math.LOG10E*Math.log(dnlSub);


 if (num1<=50.0)
 {
      aeResult=114.5-15*logNum2;
 }
 else
 {
     aeResult=80.5+20*logNum1-15*logNum2;
 }

      //console.log('aeResult after math: ' + aeResult);
      
if (numRG>0)
{
    dnlResult=(aeResult + 10*logDnlSub -49.4 + numGAF);
}
else
{
    dnlResult=aeResult+10*logDnlSub-49.4;
}
      
      form.HTDNLVALUE.value=roundNumber(dnlResult,1);
    return 0;
  }
  return 1;
}
/* ROAD & RAIL - This function calculates the Site DNL. It first
calculates the combined Road DNLs for all Roads, if
any.  Then it calculates the combined Rail DNLs for
all Rails, if any. Finally, it calculates the Site DNL
by combining the Roads DNL, if any, with the Rails DNL,
if any. This function is called with an onclick event 
associated with the "Calculate Site DNL" button from the
main page, dnlcalculator.cfm */
function calculateSDNL()
{
 document.formall.sitednl.value=0;
 var sitednlV=0;
 var sitednlT=0;
 //var sitednlF=0;
 //var numRd1=0;
 //var numRd2=0;
 //var numRw1=0;
 //var numRw2=0;
 var roadArray=[];
 var railArray=[];
  
  
  // 1 road only      
 if (sitednlincr==2 && roaddnlincr==2)
 {
    document.formall.sitednl.value=parseFloat(document.getElementById("roadform1").RDNLVALUE.value);
	document.cookie = "SiteDNL=" + parseFloat(document.getElementById("roadform1").RDNLVALUE.value);
 }
 // 1 rail only
 else if (sitednlincr==2 && raildnlincr==2)
 {
    document.formall.sitednl.value=parseFloat(document.getElementById("railform1").RWDNLVALUE.value);
	document.cookie = "SiteDNL=" + parseFloat(document.getElementById("railform1").RWDNLVALUE.value);
 }
 else
 { // 1 or more roads 
    if(roaddnlincr>1)
    {
      for(i=1; i<roaddnlincr; i++)
      {
        var roadForm="roadform"+i;
        roadArray[i-1]=parseFloat(document.getElementById(roadForm).RDNLVALUE.value);
       }
      sitednlV=roadArray[0];
      for(i=1; i<roadArray.length; i++)
      {
        sitednlV= Combine_Sound_Levels(sitednlV,roadArray[i]);     
      }
    }
    // 1 or more rails
    if(raildnlincr>1)
    {
      for(j=1; j<raildnlincr; j++)
      {
        var railForm="railform"+j;
        railArray[j-1]=parseFloat(document.getElementById(railForm).RWDNLVALUE.value);
      }
      sitednlT=railArray[0];
      for(j=1; j<railArray.length; j++)
      {
        sitednlT= Combine_Sound_Levels(sitednlT,railArray[j]);     
      }
    }
  }
  
  // 1 or more roads AND 1 or more rails
  if (roaddnlincr>1 && raildnlincr>1)
  {
    document.formall.sitednl.value= roundNumber(Combine_Sound_Levels(sitednlV,sitednlT),1);
	document.cookie = "SiteDNL=" + roundNumber(Combine_Sound_Levels(sitednlV,sitednlT),1);
	//alert("test");
	//alert(sitednlV);
	//alert(sitednlT);
  }
  
  // 0 rails AND 2+ roads
  else if(raildnlincr==1 && roaddnlincr>2)
  {
    document.formall.sitednl.value=roundNumber(sitednlV,1);
	document.cookie = "SiteDNL=" + roundNumber(sitednlV,1);
  }
  
  // 0 roads AND 2+ rails
  else if(raildnlincr>2 && roaddnlincr==1)
  {
    document.formall.sitednl.value=roundNumber(sitednlT,1);
	document.cookie = "SiteDNL=" + roundNumber(sitednlT,1);
  }
}

/* ROAD & RAIL - The following variables are used to keep track of 
the count of roads, count of rails, and count of
sources per site */
var roadsources=1;
var roaddnlincr=1;
var railsources=1;
var raildnlincr=1;
var sitednlincr=1;
/* ROAD - The following function creates a Road Form, and
increments the global variables (roadsources, roaddnlincr,
and sitednlicr) by 1.  This function is called from the
main page with the onClick event associated with the
"addroadsources" button. */ 
function AddRoadSource()
{
 div=document.getElementById("roadsources");
  newitem= "<form align=\"left\" id=\"roadform"+ roadsources +"\" + name=\"form"+roadsources+"\">";
  newitem+="<table class='calculator-head'><tr><td onMouseover=\"ddrivetip('Name of the Road being Assessed \&mdash; Must be Unique.','white', 400)\" onMouseout=\"hideddrivetip()\" align=\"left\" ><div class=\"Form\">Road # "+ roadsources+" Name:  "+"</div></td>";
  newitem+="<td><div class=\"Form\" Style=\"margin-bottom: 5px;\"><input class='form-control' type=\"text\" size=\"40\" id=\"roadName\" align=\"left\"></td></div></tr></table>";
  newitem+= "<table class='calculator-data' >";
  newitem+="<TR>";
  newitem+="<TH colspan=\"4\" scope=\"colgroup\" class=\"roadformId\">Road #"+ roadsources+"</TH>";
  newitem+="</TR>"

   newitem+="<TR>";
  
  
  //    **** HEADERS ****
  newitem+="<TH scope=\"col\" abbr=\"Type\" class=\"Form\" onMouseover=\"ddrivetip('Vehicle types to select for the noise assessment. Input by performing a \&ldquo;checkmark\&rdquo; in the box next to the vehicles (Cars, Medium Truck or Heavy Trucks) involved in the road being assessed.','white', 400)\" onMouseout=\"hideddrivetip()\">Vehicle Type</TH>";
  newitem+="<TH scope=\"col\" abbr=\"Type\" class=\"Form car\" onMouseover=\"ddrivetip('Vehicles with a Gross Vehicle Weight (GVW) of less than 10,000 pounds. Light trucks follow under this category. This definition includes domestic and commercial vehicles within the GVW category. Examples of these vehicles include: passenger cars, sport utility vehicles, minivans and full size vans, and light duty trucks up to 10,000 pounds GVW.','white', 400)\" onMouseout=\"hideddrivetip()\">Cars<input id=\"carCK\" type=\"checkbox\" name=\"carCK\" title=\"Select Car\" onclick=\"vehicle_check(this.form);\" ></TH>";
  newitem+="<TH scope=\"col\" abbr=\"Type\" class=\"Form midtruck\" onMouseover=\"ddrivetip('Vehicles with a Gross Vehicle Weight (GVW) of greater than 10,000 pounds but less than 26,000 pounds. This definition include vehicles like straight (no semi-trucks), 2-axle, 24 to 26 foot long cargo trucks.','white', 400)\" onMouseout=\"hideddrivetip()\">Medium Trucks<input id=\"mtCK\" type=\"checkbox\" name=\"mtCK\" title=\"Select Medium Truck\" onclick=\"vehicle_check(this.form);\"></TH>";
  newitem+="<TH scope=\"col\" abbr=\"Type\" class=\"Form heavytrunk\" onMouseover=\"ddrivetip('Vehicles with a Gross Vehicle Weight (GVW) of more than 26,000 pounds and three or more axles. Buses that can carry more than 15 seated passengers count as heavy trucks, as well as semi-trucks (18 wheelers), Class A recreational vehicles, dump trucks, and heavy duty commercial vehicles following the definition previously stated.','white', 400)\" onMouseout=\"hideddrivetip()\">Heavy Trucks<input id=\"htCK\" type=\"checkbox\" name=\"htCK\" title=\"Select Heavy Truck\" onclick=\"vehicle_check(this.form);\"></TH>";
   newitem+= "</tr>";



 
//Row 1  **** EFFECTIVE DISTANCE ROW ****
  newitem+= "<tr>";
  
//    **** 1st COLUMN, TYPE **** 
  newitem+= "<td class=\"color\" onMouseover=\"ddrivetip('Distance (input value must be in units of feet (ft)) from the Noise Assessment Location (NAL) to the center of all travel lanes.','white', 400)\" onMouseout=\"hideddrivetip()\">Effective Distance</td>";

//    **** 2nd COLUMN, CAR w/ INPUT ****
  newitem+= "<td class=\"car\">";
  newitem+= "<input class='form-control' size=\"12\" id=\"distance\" type=\"text\" name=\"distance\" title=\"Car Distance\" OnChange=\"copyDistanceRoad(this.form)\" disabled></td>";

//    **** 3rd COLUMN, MD TRUCK w/ INPUT  ****  
  newitem+= "<td class=\"midtruck\">";
  newitem+= "<input class='form-control' size=\"14\" id=\"mtdistance\" type=\"text\" name=\"mtdistance\" title=\"Medium Truck Distance\" disabled></td>";
  
//    ****  4th COLUMN, HV TRUCK w/ INPUT ****  
  newitem+= "<td class=\"heavytruck\">";
  newitem+= "<input class='form-control' size=\"14\" id=\"htdistance\" type=\"text\" name=\"htdistance\" title=\"Heavy Truck Distance\"  disabled></td>";
  newitem+= "</tr>";
  
//Row 2  **** Distance to Stop Sign ROW ****
  newitem+= "<tr>";

//    **** 1st COLUMN, TYPE **** 
  newitem+= "<td class=\"color\" onMouseover=\"ddrivetip('Note: If the Distance to Stop Sign is greater than 600 ft or is not applicable, please leave this field blank.<br> This is the distance (input value must be between 0 and 600 and in units of feet (ft)) from the assessed road to the stop sign (no traffic light).<br> ','white', 400)\" onMouseout=\"hideddrivetip()\">Distance to Stop Sign</td>";

//    **** 2nd COLUMN, CAR w/ INPUT ****
  newitem+= "<td class=\"car\">";
  newitem+= "<input class='form-control' size=\"12\" id=\"dts\" type=\"text\" name=\"dts\" title=\"Car DTS\" value=\"\" disabled></td>";
  
//    **** 3rd COLUMN, MD TRUCK w/ INPUT  ****  
  newitem+= "<td class=\"midtruck\">";
  newitem+= "<input class='form-control' size=\"14\" id=\"mtdts\" type=\"text\" name=\"mtdts\" title=\"Medium Truck DTS\" disabled></td>";
  
//    ****  4th COLUMN, HV TRUCK w/ INPUT ****
  newitem+= "<td class=\"heavytruck\">";
  newitem+= "<input class='form-control' size=\"14\" id=\"htdts\" type=\"text\" name=\"htdts\" title=\"Heavy Truck DTS\" disabled></td>";
  newitem+= "</tr>";
  
//Row 3  **** Average Speed ROW ****  
  newitem+= "<tr>";
  
//    **** 1st COLUMN, TYPE **** 
  newitem+= "<td class=\"color\" onMouseover=\"ddrivetip('Road speed limit (input value must be in units of miles per hour (mph)) on the road being assessed. Default value for Heavy Trucks is 50 mph.','white', 400)\" onMouseout=\"hideddrivetip()\">Average Speed</td>";
  
//    **** 2nd COLUMN, CAR w/ INPUT ****
  newitem+= "<td class=\"car\">";
  newitem+= "<input class='form-control' size=\"12\" id=\"speed\" type=\"text\" name=\"speed\" title=\"Car Speed\"  disabled></td>";
  
//    **** 3rd COLUMN, MD TRUCK w/ INPUT  ****
  newitem+= "<td class=\"midtruck\">";
  newitem+= "<input class='form-control' size=\"14\" id=\"mtspeed\" type=\"text\" name=\"mtspeed\" title=\"Medium Truck Speed\"  disabled></td>";
  
//    **** 4th COLUMN, HV TRUCK w/ INPUT ****
  newitem+= "<td class=\"heavytruck\">";
  newitem+= "<input class='form-control' size=\"14\" id=\"htspeed\" type=\"text\" name=\"htspeed\" title=\"Heavy Truck Speed\"  disabled></td>";
  newitem+= "</tr>";
  
//Row 4  **** Average Daily Trips (ADT) ROW ****   
  newitem+="<tr>";
  
//    **** 1st COLUMN, TYPE **** 
  newitem+= "<td class=\"color\" onMouseover=\"ddrivetip('Total yearly traffic volume for each vehicle type in both directions divided by 365.','white', 400)\" onMouseout=\"hideddrivetip()\">Average Daily Trips (ADT)</td>";

//    **** 2nd COLUMN, CAR w/ INPUT ****
  newitem+= "<td class=\"car\">";
  newitem+= "<input class='form-control' size=\"12\" id=\"trips\" type=\"text\" name=\"trips\" title=\"Car ADT\"  disabled></td>";
  
//    **** 3rd COLUMN, MD TRUCK w/ INPUT  ****
  newitem+= "<td class=\"midtruck\">";
  newitem+= "<input class='form-control' size=\"14\" id=\"mttrips\" name=\"mttrips\" type=\"text\" title=\"Medium Truck ADT\"  disabled></td>";
  
//    **** 4th COLUMN, HV TRUCK w/ INPUT ****
  newitem+= "<td class=\"heavytruck\">";
  newitem+= "<input class='form-control' size=\"14\" id=\"httrips\" name=\"httrips\" type=\"text\" title=\"Heavy Truck ADT\"   disabled></td>";
  newitem+= "</tr>";

//Row 4  **** Night Fraction of ADT ROW **** 
  newitem+= "<tr>";

//    **** 1st COLUMN, TYPE **** 
  newitem+= "<td class=\"color\" onMouseover=\"ddrivetip('Night fraction of the average daily trips per vehicle type.  Default value is 15.','white', 400)\" onMouseout=\"hideddrivetip()\">Night Fraction of ADT</td>";

//    **** 2nd COLUMN, CAR w/ INPUT ****
  newitem+= "<td class=\"car\">";
  newitem+= "<input class='form-control' size=\"12\" id=\"nightFraction\" type=\"text\" name=\"nightFraction\" title=\"Car Night Fraction\"  disabled></td>";

//    **** 3rd COLUMN, MD TRUCK w/ INPUT  ****
  newitem+= "<td class=\"midtruck\">";
  newitem+= "<input class='form-control' size=\"14\" id=\"mtnightFraction\" type=\"text\" name=\"mtnightFraction\" title=\"Medium Truck Night Fraction\"  disabled></td>";

//    **** 4th COLUMN, HV TRUCK w/ INPUT ****
  newitem+= "<td class=\"heavytruck\">";
  newitem+= "<input class='form-control' size=\"14\" id=\"htnightFraction\" type=\"text\" name=\"htnightFraction\" title=\"Heavy Truck Night Fraction\"  disabled></td>";
  newitem+= "</tr>";

//Row 5  **** Road Gradient (%) ROW ****   
  newitem+="<tr>";
  
//    **** 1st COLUMN, TYPE ****
  newitem+= "<td class=\"color\" onMouseover=\"ddrivetip('Uphill road gradient.  Input value must be a percent grade. Default value is 2.','white', 400)\" onMouseout=\"hideddrivetip()\">Road Gradient (%)</td>";

//    **** 2nd COLUMN, CAR w/ INPUT ****  
  newitem+= "<td class=\"car\">";
  newitem+= "<input class='form-control' size=\"12\" id=\"roadGradient\" type=\"text\" name=\"roadGradient\" title=\"Car Road Gradient %\" disabled></td>";

//    **** 3rd COLUMN, MD TRUCK w/ INPUT  ****
  newitem+= "<td class=\"midtruck\">";
  newitem+= "<input class='form-control' size=\"14\" id=\"mtRoadGradient\" type=\"text\" name=\"mtRoadGradient\" title=\"Medium Truck Road Gradient %\" disabled></td>";
  
//    **** 4th COLUMN, HV TRUCK w/ INPUT ****
  newitem+= "<td  align=center>";
  newitem+= "<input class='form-control' size=\"14\" id=\"htRoadGradient\" type=\"text\" name=\"htRoadGradient\" title=\"Heavy Truck Road Gradient %\"  disabled></td>";
  newitem+= "</tr>";
  
//Row 6  **** Vehicle DNL ROW ****
  newitem+= "<tr>";
  
//    **** 1st COLUMN ****
  newitem+= "<td class=\"color\" onMouseover=\"ddrivetip('Vehicle noise level in units of decibel (dB) measured in a timeframe of 24 hours.','white', 400)\" onMouseout=\"hideddrivetip()\" align=\"center\">Vehicle DNL</td>";
  
//    **** 2nd COLUMN, CAR w/ INPUT ****
  newitem+= "<td class=\"car\">";
  newitem+= "<input class='form-control' size=\"12\" id=\"CARDNLVALUE\" type=\"text\" name=\"CARDNLVALUE\" title=\"Car DNL\" ReadOnly=true></td>";
  
//    **** 3rd COLUMN, MD TRUCK w/ INPUT  ****  
  newitem+= "<td class=\"midtruck\">";
  newitem+= "<input class='form-control' size=\"14\" id=\"MTDNLVALUE\" type=\"text\" name=\"MTDNLVALUE\" title=\"Medium Truck DNL\" ReadOnly=true></td>";
  
//    **** 4th COLUMN, HV TRUCK w/ INPUT ****  
  newitem+= "<td class=\"heavytruck\">";
  newitem+= "<input class='form-control' size=\"14\" id=\"HTDNLVALUE\" type=\"text\" name=\"HTDNLVALUE\" title=\"Heavy Truck DNL\" ReadOnly=true></td>";
  newitem+= "</tr>";
  
//Row 7  **** Calculate DNL ROW ****  
  newitem+= "<tr class='last-row'>";
  
//    **** 1st COLUMN, TYPE w/ INPUT BUTTON  ****
  newitem+= "<td align=center >";
  newitem+= "<input class='button-calculate btn btn-primary' type=\"button\" value=\"Calculate Road #" + roadsources + " DNL\" name=\"calculateRoadDNL\" onclick=\"CalculateRoadSources(this.form)\" onMouseover=\"ddrivetip('Click on this button to determine the Day-Night Noise Level (DNL) for the road and vehicles being assessed in units of decibel (dB).','white', 400)\" onMouseout=\"hideddrivetip()\"></td>";
 
//    **** 2nd COLUMN, VALUE w/ INPUT ****  
  newitem+= "<td colspan =\"1\" align = center>";
  newitem+= "<input class='form-control' size=\"12\" id=\"RDNLVALUE\" type=\"text\" name=\"RDNLVALUE\" title=\"Road DNL VALUE\" ReadOnly=true>";
  
//    **** 3rd COLUMN, RESET SPAN 3 COLS w/ INPUT **** 
  newitem+= "<td colspan =\"3\" align = left>";
  newitem+= "<input class='button-gray-gradient btn btn-default' colspan =\"1\"id=\"roadreset\" type=\"button\" value=\"Reset\" onclick=\"reset_Road(this.form)\" onMouseover=\"ddrivetip('Click on this button to clear the data from the vehicle assessment data fields.','white', 400)\" onMouseout=\"hideddrivetip()\">";
  newitem+= "</td>";
  newitem+= "</tr>";
  newitem+= "</table>";
  newitem+= "</table>";
  newitem+= "</form>";
  newnode=document.createElement("span");
  newnode.innerHTML=newitem;
  div.appendChild(newnode);
  roadsources++;
  roaddnlincr++;
  sitednlincr++;
} 
/* RAIL - This function clears form fields specific
to Electric Trains, the Railway DNL value, and the Site
DNL value. */
function clearElecFields(formt)
{
 formt.elcDistance.value="";
 formt.elcSpeed.value="";
 formt.elcEngines.value="";
 formt.elcCars.value="";
 formt.elcATO.value="";
 formt.elcNightFraction.value="";
 formt.yesHornsElc.checked=false;
 formt.noHornsElc.checked=false;
 formt.yesBoltedElc.checked=false;
 formt.noBoltedElc.checked=false;
 formt.ELCDNLVALUE.value="";
 formt.RWDNLVALUE.value="";
 document.formall.sitednl.value=0; 
}
/* RAIL - This function clears form fields specific
to Diesel Trains, the Railway DNL value, and the Site
DNL value. */
function clearDslFields(formt)
{
 formt.dslDistance.value="";
  formt.dslSpeed.value="";
  formt.dslEngines.value="";
  formt.dslCars.value="";
  formt.dslATO.value="";
  formt.dslNightFraction.value="";
  formt.yesHornsDsl.checked=false;
  formt.noHornsDsl.checked=false;
  formt.yesBoltedDsl.checked=false;
 formt.noBoltedDsl.checked=false;
 formt.DSLDNLVALUE.value="";
 formt.RWDNLVALUE.value="";
 document.formall.sitednl.value=0; 
}
/* RAIL - This function disables form fields specific to
Electric Trains. */
function disable_electric_fields(formt)
{
  formt.elcDistance.disabled=true;
  formt.elcSpeed.disabled=true;
  formt.elcEngines.disabled=true;
  formt.elcCars.disabled=true;
  formt.elcATO.disabled=true;
  formt.elcNightFraction.disabled=true;
  formt.yesHornsElc.disabled=true;
  formt.noHornsElc.disabled=true;
  formt.yesBoltedElc.disabled=true;
  formt.noBoltedElc.disabled=true;
}
/* RAIL - This function disables form fields specific to
Diesel Trains. */
function disable_diesel_fields(formt)
{
  formt.dslDistance.disabled=true;
  formt.dslSpeed.disabled=true;
  formt.dslEngines.disabled=true;
  formt.dslCars.disabled=true;
  formt.dslATO.disabled=true;
  formt.dslNightFraction.disabled=true;
  formt.yesHornsDsl.disabled=true;
  formt.noHornsDsl.disabled=true;
  formt.yesBoltedDsl.disabled=true;
  formt.noBoltedDsl.disabled=true;
}
/* RAIL - This function enables form fields specific to
Electric Trains. */
function enable_electric_fields(formt)
{
  formt.elcDistance.disabled=false;
  formt.elcSpeed.disabled=false;
  formt.elcEngines.disabled=false;
  formt.elcCars.disabled=false;
  formt.elcATO.disabled=false;
  formt.elcNightFraction.disabled=false;
  formt.yesHornsElc.disabled=false;
  formt.noHornsElc.disabled=false;
  formt.yesBoltedElc.disabled=false;
  formt.noBoltedElc.disabled=false;    
}
/* RAIL - This function enables form fields specific to
Diesel Trains. */
function enable_diesel_fields(formt)
{
  formt.dslDistance.disabled=false;
  formt.dslSpeed.disabled=false;
  formt.dslEngines.disabled=false;
  formt.dslCars.disabled=false;
  formt.dslATO.disabled=false;
  formt.dslNightFraction.disabled=false;
  formt.yesHornsDsl.disabled=false;
  formt.noHornsDsl.disabled=false;
  formt.yesBoltedDsl.disabled=false;
  formt.noBoltedDsl.disabled=false;
}
/* RAIL - This function contains the logic for enabling and disabling
specific form fields depending on which trains are selected. */
function train_check(form)
{
  //Check Electric checkbox
  if(form.elcCK.checked==true)
  {
    enable_electric_fields(form);
  }
  else if (form.elcCK.checked==false)
  {
    clearElecFields(form);
    disable_electric_fields(form);
  }
  
  //Check Diesel checkbox
  if(form.dslCK.checked==true)
  {
    enable_diesel_fields(form);
    if(form.elcDistance.value>=0)
    {
      form.dslDistance.value=form.elcDistance.value;
    }
  }
  else if(form.dslCK.checked==false)
  {
    clearDslFields(form);
    disable_diesel_fields(form);
  }
}
/* RAIL - This function resets and disables text fields on the road form.
In addition, it resets the value of the site dnl to 0. */
function reset_Rail(form)
{
  form.reset();
  disable_electric_fields(form);
  disable_diesel_fields(form);
  document.formall.sitednl.value=0;  
}
/* RAIL - This function copies the Electric Train Distance
value into the Diesel Trucks Distance field, if it's
selected. */ 
function copyDistanceRail(form)
{
 if(form.dslCK.checked==true)
 {
  form.dslDistance.value=form.elcDistance.value;
 }
}
/* RAIL - The following function doesn't allow the user
to select both 'Yes' and 'No' for Electric Horns. */
function logicHornsElc(form)
{
 if(form.yesHornsElc.checked==true && form.noHornsElc.checked==true)

 {
  form.yesHornsElc.checked=false;
  form.noHornsElc.checked=false;
  alert("Please select either 'Yes' or 'No'.");
 }
}
/* RAIL - The following function doesn't allow the user
to select both 'Yes' and 'No' for Diesel Horns. */
function logicHornsDsl(form)
{
 if(form.yesHornsDsl.checked==true && form.noHornsDsl.checked==true)
 {
  form.yesHornsDsl.checked=false;
    form.noHornsDsl.checked=false;
    alert("Please select either 'Yes' or 'No'.");
  }
}
/* RAIL - The following function doesn't allow the user
to select both 'Yes' and 'No' for Electric Bolted. */
function logicBoltedElc(form)
{
 if(form.yesBoltedElc.checked==true && form.noBoltedElc.checked==true)
 {
  form.yesBoltedElc.checked=false;
    form.noBoltedElc.checked=false;
    alert("Please select either 'Yes' or 'No'.");
  }
}
/* RAIL - The following function doesn't allow the user
to select both 'Yes' and 'No' for Diesel Bolted. */
function logicBoltedDsl(form)
{
 if(form.yesBoltedDsl.checked==true && form.noBoltedDsl.checked==true)
 {
  form.yesBoltedDsl.checked=false;
    form.noBoltedDsl.checked=false;
    alert("Please select either 'Yes' or 'No'.");
  }
}
/* RAIL - This function determines which trains are selected,
then calculates the noise level for each selested train,
and finally combines all trains noise levels. */
function CalculateRailSources(form)
{
  var x1;
  var elecerror;
 var dslerror;
 
 // Case 1: All Trains Selected 
 if (form.elcCK.checked==true && form.dslCK.checked==true)
  {
    elecerror = CalculateElectric(form);
  if(elecerror=="0")
  {
   dslerror = CalculateDiesel(form);
   if(dslerror=="0")
   {
        x1 = Combine_Sound_Levels(parseFloat(form.ELCDNLVALUE.value), parseFloat(form.DSLDNLVALUE.value));
        form.RWDNLVALUE.value=roundNumber(x1,1);
   }
  }
 }
  // Case 2: Electric Only Selected
  else if(form.elcCK.checked==true && form.dslCK.checked==false)
  {
    elecerror = CalculateElectric(form);
    if(elecerror=="0")
    {
      x1 = parseFloat(form.ELCDNLVALUE.value);
      form.RWDNLVALUE.value=roundNumber(x1,1);
    }
  }
  // Case 3: Diesel Only Selected
  else if(form.elcCK.checked==false && form.dslCK.checked==true)
  {
   dslerror = CalculateDiesel(form);
   if(dslerror=="0")
    {
      x1 = parseFloat(form.DSLDNLVALUE.value);
      form.RWDNLVALUE.value=roundNumber(x1,1);
    }
  }
  // Case 4: None Selected
  else if(form.elcCK.checked==false && form.dslCK.checked==false)
  {
   alert("Please select at least one Train Type.");
  }
}
/* RAIL - This function first validates all text fields specific
to Electric Trains. If all fields contain valid values, the function
proceeds to calculate the Electric Trains Noise level (Electric DNL) */
function CalculateElectric(form)
{
  if (form.elcDistance.value == "")
 {
    alert("Effective Distance must contain a value.");
   form.elcDistance.focus();
 }
 else if(isNaN(form.elcDistance.value))
 {
  alert("Effective Distance value must be numeric.");
   form.elcDistance.focus();
 }
 else if(form.elcDistance.value<=0)
 {
  alert("Effective Distance value must be a positive number.");
  form.elcDistance.focus();
 }
 else if (form.elcDistance.value != Math.round(form.elcDistance.value))
 {
    alert("Effective Distance value must be a non-decimal number.");
  form.elcDistance.focus();
  }
 else if (form.elcSpeed.value == "")
 {
  alert("Average Speed must contain a value.");
  form.elcSpeed.focus();
 }
 else if(isNaN(form.elcSpeed.value))
 {
  alert("Average Speed value must be numeric.");
  form.elcSpeed.focus();
 }
 else if (form.elcSpeed.value<=0)
 {
  alert("Average Speed value must be a positive number.");
  form.elcSpeed.focus();
 }
 else if (form.elcSpeed.value != Math.round(form.elcSpeed.value))
 {
    alert("Average Speed value must be a non-decimal number.");
  form.elcSpeed.focus();
  }
  else if (form.elcEngines.value == "")
 {
  alert("The number of Engines per Train must contain a value.");
  form.elcEngines.focus();
 }
 else if(isNaN(form.elcEngines.value))
 {
  alert("The number of Engines per Train value must be numeric.");
  form.elcEngines.focus();
 }
 else if (form.elcEngines.value<0)
 {
  alert("The number of Engines per Train value must be positive.");
  form.elcEngines.focus();
 }
 else if (form.elcEngines.value != Math.round(form.elcEngines.value))
 {
    alert("The number of Engines per Train value must be a non-decimal number.");
  form.elcEngines.focus();
  }
  else if (form.elcCars.value == "")
 {
  alert("The number of Cars per Train must contain a value.");
  form.elcCars.focus();
 }
 else if(isNaN(form.elcCars.value))
 {
  alert("The number of Cars per Train value must be numeric.");
  form.elcCars.focus();
 }
 else if (form.elcCars.value<0)
 {
  alert("The number of Cars per Train value must be positive.");
  form.elcCars.focus();
 }
 else if (form.elcCars.value != Math.round(form.elcCars.value))
 {
    alert("The number of Cars per Train value must be a non-decimal number.");
  form.elcCars.focus();
  }
 else if (form.elcATO.value =="")
 {
  alert("Average Train Operations must contain a value.");
  form.elcATO.focus();
 }
 else if(isNaN(form.elcATO.value))
 {
  alert("Average Train Operations value must be numeric.");
  form.elcATO.focus();
 }
 else if (form.elcATO.value<0)
 {
  alert("Average Train Operations value must be positive.");
  form.elcATO.focus();
 }
 else if (form.elcATO.value != Math.round(form.elcATO.value))
 {
    alert("Average Train Operations value must be a non-decimal number.");
  form.elcATO.focus();
  }
 else if (form.elcNightFraction.value == "")
 {
  alert("Night Fraction of ATO must contain a value.");
   form.elcNightFraction.focus();
 }
 else if(isNaN(form.elcNightFraction.value))
 {
  alert("Night Fraction value must be numeric.");
  form.elcNightFraction.focus();
 }
 else if(form.elcNightFraction.value<0)
 {
   alert("Night Fraction value must be positive.");
   form.elcNightFraction.focus();
 }
 else if (form.elcNightFraction.value != Math.round(form.elcNightFraction.value))
 {
    alert("Night Fraction value must be a non-decimal number.");
  form.elcNightFraction.focus();
  }
 else if(form.yesHornsElc.checked==false && form.noHornsElc.checked==false)
 {
  alert("Please indicate whether the railway has horns/whistles or not by selecting either 'Yes' or 'No'.");
  form.noHornsElc.focus();
 }
 else if(form.yesBoltedElc.checked==false && form.noBoltedElc.checked==false)
 {
  alert("Please indicate whether the tracks are bolted or not by selecting either 'Yes' or 'No'.");
   form.noBoltedElc.focus();
 }
 else
 {
  num1=parseFloat(form.elcSpeed.value);
  num2=parseFloat(form.elcDistance.value);
  numATO=parseFloat(form.elcATO.value);
  numNight=parseFloat(form.elcNightFraction.value)/100;
  numDay=1-numNight;
  numEngines=parseFloat(form.elcEngines.value);
  numCars=parseFloat(form.elcCars.value);
  numEngCars=numEngines+numCars+1;
  if(form.yesHornsElc.checked==true && form.yesBoltedElc.checked==true)
  {
   AATOr=numATO*100;
   AATOtot=AATOr+(4*numATO);
  }
  else if(form.yesHornsElc.checked==true && form.noBoltedElc.checked==true)
  {
   AATOr=numATO*100;
   AATOtot=2*numATO;
  }
  else if(form.noHornsElc.checked==true && form.yesBoltedElc.checked==true)
  {
   AATOr=numATO;
   AATOtot=AATOr+(4*numATO);
  }
  else if(form.noHornsElc.checked==true && form.noBoltedElc.checked==true)
  {
   AATOr=numATO;
   AATOtot=2*numATO;
  }
  dnlSub=AATOtot*(numDay+(10*numNight));
  logNum1=Math.LOG10E*Math.log(num1);
  logNum2=Math.LOG10E*Math.log(num2);
  logNum3=Math.LOG10E*Math.log(numEngCars);
  logDnlSub=Math.LOG10E*Math.log(dnlSub);
 
  aeResult=71.4+(20*logNum1)+(10*logNum3)-(15*logNum2);
     
    dnlResult=aeResult+10*logDnlSub-49.4;
     
    form.ELCDNLVALUE.value=roundNumber(parseFloat(dnlResult),1);
     
    return "0";
    }
  return "1";
}
/* RAIL - This function first validates all text fields specific
to Diesel Trains. If all fields contain valid values, the function
proceeds to calculate the Diesel Trains Noise level (Diesel DNL) */
function CalculateDiesel(form)
{
 if (form.dslDistance.value == "")
 {
  alert("Effective Distance must contain a value.");
   form.dslDistance.focus();
 }
 else if(isNaN(form.dslDistance.value))
 {
  alert("Effective Distance must be numeric.");
  form.dslDistance.focus();
 }
 else if(form.dslDistance.value<=0)
 {
  alert("Effective Distance value must be a positive number.");
  form.dslDistance.focus();
 }
 else if (form.dslSpeed.value == "")
 {
  alert("Average speed must contain a value.");
  form.dslSpeed.focus();
 }
 else if(isNaN(form.dslSpeed.value))
 {
  alert("Average Speed value must be numeric.");
  form.dslSpeed.focus();
 }
 else if (form.dslSpeed.value<=0)
 {
  alert("Average Speed value must be a positive number.");
  form.dslSpeed.focus();
 }
 else if (form.dslSpeed.value != Math.round(form.dslSpeed.value))
 {
    alert("Average Speed value must be a non-decimal number.");
  form.dslSpeed.focus();
  }
  else if (form.dslEngines.value == "")
 {
  alert("The number of Engines per Train must contain a value.");
  form.dslEngines.focus();
 }
 else if(isNaN(form.dslEngines.value))
 {
  alert("The number of Engines per Train value must be numeric.");
  form.dslEngines.focus();
 }
 else if (form.dslEngines.value<0)
 {
  alert("The number of Engines per Train value must be positive.");
  form.dslEngines.focus();
 }
 else if (form.dslEngines.value != Math.round(form.dslEngines.value))
 {
    alert("The number of Engines per Train value must be a non-decimal number.");
  form.dslEngines.focus();
  }
  else if (form.dslCars.value == "")
 {
  alert("The number of Cars per Train must contain a value.");
  form.dslCars.focus();
 }
 else if(isNaN(form.dslCars.value))
 {
  alert("The number of Cars per Train value must be numeric.");
  form.dslCars.focus();
 }
 else if (form.dslCars.value<0)
 {
  alert("The number of Cars per Train value must be positive.");
  form.dslCars.focus();
 }
 else if (form.dslCars.value != Math.round(form.dslCars.value))
 {
    alert("The number of Cars per Train value must be a non-decimal number.");
  form.dslCars.focus();
  }
 else if (form.dslATO.value =="")
 {
  alert("Average Train Operations must contain a value.");
  form.dslATO.focus();
 }
 else if(isNaN(form.dslATO.value))
 {
  alert("Average Train Operations value must be numeric.");
  form.dslATO.focus();
 }
 else if (form.dslATO.value<0)
 {
  alert("Average Train Operations value must be positive.");
  form.dslATO.focus();
 }
 else if (form.dslATO.value != Math.round(form.dslATO.value))
 {
    alert("Average Train Operations value must be a non-decimal number.");
  form.dslATO.focus();
  }
 else if (form.dslNightFraction.value == "")
 {
  alert("Night Fraction of ATO must contain a value.");
  form.dslNightFraction.focus();
 }
 else if(isNaN(form.dslNightFraction.value))
 {
  alert("Night Fraction value must be numeric.");
  form.dslNightFraction.focus();
 }
 else if(form.dslNightFraction.value<0)
 {
  alert("Night Fraction value must be positive.");
  form.dslNightFraction.focus();
 }
 else if (form.dslNightFraction.value != Math.round(form.dslNightFraction.value))
 {
    alert("Night Fraction value must be a non-decimal number.");
  form.dslNightFraction.focus();
  }
 else if(form.yesHornsDsl.checked==false && form.noHornsDsl.checked==false)
 {
  alert("Please indicate whether the railway has horns/whistles or not by selecting either 'Yes' or 'No'.");
   form.noHornsDsl.focus();
 }
 else if(form.yesBoltedDsl.checked==false && form.noBoltedDsl.checked==false)
 {
  alert("Please indicate whether the tracks are bolted or not by selecting either 'Yes' or 'No'.");
   form.noBoltedDsl.focus();
 }
 else
 { 
  num1=parseFloat(form.dslSpeed.value);
   num2=parseFloat(form.dslDistance.value);
   numATO=parseFloat(form.dslATO.value);
   numNight=parseFloat(form.dslNightFraction.value)/100;
   numDay=1-numNight;
   numEngines=parseFloat(form.dslEngines.value);
   numCars=parseFloat(form.dslCars.value);
  if(form.yesHornsDsl.checked==true)
  {
   AATOe=numATO*10;
  }
  else
  {
   AATOe=numATO;
  }
  if(form.yesBoltedDsl.checked==true)
  {
   AATOc=numATO*4;
  }
  else
  {
   AATOc=numATO;
  }
  dnlSubE=AATOe*(numDay+(10*numNight));
  dnlSubC=AATOc*(numDay+(10*numNight));
    logNum1=Math.LOG10E*Math.log(num1);
    logNum2=Math.LOG10E*Math.log(num2);
    logNum3=Math.LOG10E*Math.log(numEngines);
    logNum4=Math.LOG10E*Math.log(numCars);
    logDnlSubE=Math.LOG10E*Math.log(dnlSubE);
    logDnlSubC=Math.LOG10E*Math.log(dnlSubC);
  aeResulte=141.7-(10*logNum1)+(10*logNum3)-(15*logNum2);
  aeResultc=71.4+(20*logNum1)+(10*logNum4)-(15*logNum2);
     
    dnlResultE=aeResulte+10*logDnlSubE-49.4;
    dnlResultC=aeResultc+10*logDnlSubC-49.4;
    dnlResult=Combine_Sound_Levels(dnlResultE,dnlResultC);
     
    form.DSLDNLVALUE.value=roundNumber(dnlResult,1);
    return "0";
  }
  return "1";
}
/* RAIL - The following function creates a Road Form, and
increments the global variables (railsources, raildnlincr,
and sitednlicr) by 1.  This function is called from the
main page with the onClick event associated with the
"addrailsources" button. */ 
  

function AddRailSource()
{
 div=document.getElementById("railsources");
 newitem= "<form align=\"left\" id=\"railform"+ railsources +"\" + name=\"form"+railsources+"\">";
 newitem+= "<table class='calculator-head'>";
 newitem+= "<tr>";
 newitem+= "<td onMouseover=\"ddrivetip('Route name or destination.','white', 400)\" onMouseout=\"hidetip()\" align=\"left\" >";
 newitem+= "<div class=\"Form\">Railroad #"+ railsources+" Track Identifier:           ";
 newitem+= "</div>";
 newitem+= "</td>";
 newitem+= "<td>";
 newitem+= "<div class=\"Form\" style=\"margin-bottom: 5px;\">";
 newitem+= "<input class='form-control' type=\"text\" size=\"40\" id=\"railName\" align=\"left\">";
 newitem+= "</div>";
 newitem+= "</td>";
 newitem+= "</tr>";
 newitem+= "</table>";
 newitem+= "<table class='calculator-data' border=\"0\">";
 newitem+="<TR>";
 newitem+="<TH  colspan=\"4\" scope=\"colgroup\">Rail # "+ railsources;
 newitem+= "</TH>";
 newitem+= "</TR>";
 newitem+= "<tr>";
 newitem+= "<th class=\"Form\" onMouseover=\"ddrivetip('Train types to select for the noise assessment. Input by performing a \&ldquo;checkmark\&rdquo; in the box next to the trains (Electric and/or Diesel) involved in the railway being assessed.','white', 400)\" onMouseout=\"hideddrivetip()\">Train Type";
 newitem+= "</th>";
 newitem+= "<th class=\"Form electric\" onMouseover=\"ddrivetip('Type of train powered by electricity from an external source (sources include overhead lines, third rail, or an on board electricity storage device as a battery or flywheel system).','white', 400)\" onMouseout=\"hideddrivetip()\">Electric";
 newitem+= "<input id=\"elcCK\" type=\"checkbox\" name=\"elcCK\" title=\"Select Electric\" onclick=\"train_check(this.form);\">";
 newitem+= "</th>";
 newitem+= "<th class=\"Form diesel\" onMouseover=\"ddrivetip('Type of train in which the prime mover is a Diesel engine.','white', 400)\" onMouseout=\"hideddrivetip()\">Diesel";
 newitem+= "<input id=\"dslCK\" type=\"checkbox\" name=\"dslCK\" title=\"Select Diesel\" onclick=\"train_check(this.form);\">";
 newitem+= "</th>";
 newitem+= "</tr>";

//Row 1 
 newitem+= "<tr>";
// *** COLUMN 1 *** 
 newitem+= "<td class=\"color\" onMouseover=\"ddrivetip('Distance (input must be in units of feet (ft)) from the Noise Assessment Location (NAL) to the center of all railways being assessed.','white', 400)\" onMouseout=\"hideddrivetip()\">Effective Distance";
 newitem+= "</td>";

// *** COLUMN 2 ***
 newitem+= "<td class=\"electric\"><input class='form-control' size=\"17\" id=\"elcDistance\" type=\"text\" name=\"elcDistance\" title=\"Electric Distance\" OnChange=\"copyDistanceRail(this.form)\" disabled></td>";

// *** COLUMN 3 ***
 newitem+= "<td align=center><input class='form-control' size=\"17\" id=\"dslDistance\" type=\"text\" name=\"dslDistance\" title=\"Diesel Distance\"disabled></td>"
 newitem+= "</tr>";
 
//ROW 2 
 newitem+= "<tr>";
//  *** COLUMN 1 ***
 newitem+= "<td class=\"color\" onMouseover=\"ddrivetip('Railway speed limit (input value must be in units of miles per hour (mph)) on the railway being assessed. Default value for diesel or electric trains is 30 mph.','white', 400)\" onMouseout=\"hideddrivetip()\">Average Train Speed</td>";
 
//  *** COLUMN 2 ***
 newitem+= "<td class=\"electric\">";
 newitem+= "<input class='form-control' size=\"17\" id=\"elcSpeed\" type=\"text\" name=\"elcSpeed\" title=\"Electric Speed\" disabled>";
 newitem+= "</td>";
 
//  *** COLUMN 3 ***
 newitem+= "<td class=\"diesel\">";
 newitem+= "<input class='form-control' size=\"17\" id=\"dslSpeed\" type=\"text\" name=\"dslSpeed\" title=\"Diesel Speed\" disabled>";
 newitem+= "</td>";
 newitem+= "</tr>";
 
//Row 3
newitem+= "<tr>";
//  *** COLUMN 1 ***
  newitem+= "<td class=\"color\" onMouseover=\"ddrivetip('Average number of diesel or electric locomotives per train. Default value for diesel locomotives is 2 and for electric locomotives is 1.','white', 400)\" onMouseout=\"hideddrivetip()\">Engines per Train";
 newitem+= "</td>";
 
//  *** COLUMN 2 ***
newitem+= "<td class=\"electric\">";
newitem+= "<input class='form-control' size=\"17\" id=\"elcEngines\" type=\"text\" name=\"elcEngines\" title=\"Engines (electric)\" disabled>";
newitem+= "</td>";

//  *** COLUMN 3 ***
 newitem+= "<td class=\"diesel\">";
 newitem+= "<input class='form-control' size=\"17\" id=\"dslEngines\" type=\"text\" name=\"dslEngines\" title=\"Engines (diesel)\" disabled>";
 newitem+= "</td>";
 newitem+= "</tr>";

//Row 4
//  *** COLUMN 1 *** 
 newitem+= "<tr>";
 newitem+= "<td class=\"color\" onMouseover=\"ddrivetip('Average number of railway cars per train. Default value for diesel trains is 50 and for electric trains is 8.','white', 400)\" onMouseout=\"hideddrivetip()\">Railway cars per Train";
 newitem+= "</td>";

//  *** COLUMN 2 ***
 newitem+= "<td class=\"electric\">";
 newitem+= "<input class='form-control' size=\"17\" id=\"elcCars\" type=\"text\" name=\"elcCars\" title=\"Cars (electric)\" disabled>";
 newitem+= "</td>";
 
//  *** COLUMN 3 ***
 newitem+= "<td class=\"diesel\">";
 newitem+= "<input class='form-control' size=\"17\" id=\"dslCars\" type=\"text\" name=\"dslCars\" title=\"Cars (diesel)\" disabled>";
 newitem+= "</td>";
 newitem+= "</tr>";
 
//Row 5
 newitem+= "<tr>";
//  *** COLUMN 1 ***
 newitem+= "<td class=\"color\" onMouseover=\"ddrivetip('Total yearly railway traffic volume for each train type in both directions divided by 365.','white', 400)\" onMouseout=\"hideddrivetip()\">Average Train Operations (ATO)";
 newitem+= "</td>";
 
//  *** COLUMN 2 *** 
 newitem+= "<td class=\"electric\">";
 newitem+= "<input class='form-control' size=\"17\" id=\"elcATO\" type=\"text\" name=\"elcATO\" title=\"Electric ATO\" disabled>";
 newitem+="</td>";
 
//  *** COLUMN 3 ***
 newitem+= "<td class=\"diesel\"><input class='form-control' size=\"17\" id=\"dslATO\" type=\"text\" name=\"dslATO\" title=\"Diesel ATO\" disabled>";
 newitem+="</td>";
 newitem+= "</tr>";

//Row 6
 newitem+= "<tr>";
//  *** COLUMN 1 ***
 newitem+= "<td class=\"color\" onMouseover=\"ddrivetip('Night fraction of the average train operations per train type. Default value is 15.','white', 400)\" onMouseout=\"hideddrivetip()\">Night Fraction of ATO";
 newitem+="</td>";

//  *** COLUMN 2 ***
 newitem+= "<td class=\"electric\"><input class='form-control' size=\"17\" id=\"elcNightFraction\" type=\"text\" name=\"elcNightFraction\" title=\"Electric Night Fraction\" disabled>";
 newitem+="</td>";
 
//  *** COLUMN 3 ***
 newitem+= "<td class=\"diesel\"><input class='form-control' size=\"17\" id=\"dslNightFraction\" type=\"text\" name=\"dslNightFraction\" title=\"Diesel Night Fraction\" disabled>";
 newitem+="</td>";
 newitem+= "</tr>";
  
//Row 7
newitem+= "<tr>";
//  *** COLUMN 1 ***
 newitem+= "<td class=\"color\" onMouseover=\"ddrivetip('Click in the appropriate box (yes or no) per train type, if whistles or horns were used.','white', 400)\" onMouseout=\"hideddrivetip()\">Railway whistles or horns?";
 newitem+= "</td>";
 
//  *** COLUMN 2 ***
 newitem+= "<td class=\"electric\">";
 newitem+= "<table align=center border=\"0\" cellspacing=\"0\" cellpadding=\"2\">";
 newitem+= "<tr>";
 newitem+= "<td align=right>Yes:<input id=\"yesHornsElc\" type=\"checkbox\" name=\"yesHornsElc\" title=\"Horns/whistles\" onclick=\"logicHornsElc(this.form);\" disabled>";
 newitem+= "</td>";
 newitem+= "<td align=right>No:<input id=\"noHornsElc\" type=\"checkbox\" name=\"noHornsElc\" title=\"No Horns/whistles\"  onclick=\"logicHornsElc(this.form);\" disabled>";
 newitem+= "</td>";
 newitem+= "</tr>";
 newitem+= "</table>";
 newitem+= "</td>";
 
//  *** COLUMN 3 ***
 newitem+= "<td class=\"diesel\">";
 newitem+= "<table align=center border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
 newitem+= "<tr>";
 newitem+= "<td align=center>Yes: <input id=\"yesHornsDsl\" type=\"checkbox\" name=\"yesHornsDsl\" title=\"Horns/whistles\" onclick=\"logicHornsDsl(this.form);\" disabled>";
 newitem+="</td>";
 newitem+= "<td align=center>No:  <input id=\"noHornsDsl\" type=\"checkbox\" name=\"noHornsDsl\" title=\"No Horns/whistles\" onclick=\"logicHornsDsl(this.form);\" disabled>";
 newitem+= "</td>";
 newitem+= "</tr>";
 newitem+= "</table>";
 newitem+= "</td>";
 newitem+= "</tr>";
  
//Row 8
newitem+="<tr>";
//  *** COLUMN 1 ***
 newitem+= "<td class=\"color\" onMouseover=\"ddrivetip('Click in the appropriate box (yes or no) per train type, if the railway tracks are bolted.  If the tracks are bolted, click the box identified as \&ldquo;Yes\&rdquo;, if they are not bolted (welded), click the box labeled \&ldquo;No\&rdquo;.','white', 400)\" onMouseout=\"hideddrivetip()\">Bolted Tracks?"
 newitem+="</td>";
 
//  *** COLUMN 2 ***
 newitem+= "<td class=\"electric\">";
 newitem+= "<table align=center border=\"0\" cellspacing=\"0\" cellpadding=\"2\">";
 newitem+= "<tr>";
 newitem+= "<td align=right>Yes:<input id=\"yesBoltedElc\" type=\"checkbox\" name=\"yesBoltedElc\" title=\"Horns/whistles\" onclick=\"logicBoltedElc(this.form);\" disabled>";
 newitem+="</td>";
 newitem+= "<td align=right>No:<input id=\"noBoltedElc\" type=\"checkbox\" name=\"noBoltedElc\" title=\"No Horns/whistles\"  onclick=\"logicBoltedElc(this.form);\" disabled>";
 newitem+= "</td>";
 newitem+= "</tr>";
 newitem+= "</table>";
 newitem+= "</td>";

//  *** COLUMN 3 ***
 newitem+= "<td class=\"diesel\">";
 newitem+= "<table align=center border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
 newitem+= "<tr>";
 newitem+= "<td align=center>Yes: <input id=\"yesBoltedDsl\" type=\"checkbox\" name=\"yesBoltedDsl\" title=\"Horns/whistles\" onclick=\"logicBoltedDsl(this.form);\" disabled>";
 newitem+="</td>";
 newitem+= "<td align=center>No:  <input id=\"noBoltedDsl\" type=\"checkbox\" name=\"noBoltedDsl\" title=\"No Horns/whistles\" onclick=\"logicBoltedDsl(this.form);\" disabled>";
 newitem+= "</td>";
 newitem+= "</tr>";
 newitem+= "</table>";
 newitem+= "</td>";
 newitem+= "</tr>";
 
//Row 9
 newitem+= "<tr>";
//  *** COLUMN 1 ***
 newitem+= "<td class=\"color\" align=\"center\" onMouseover=\"ddrivetip('Train noise level in units of decibel (dB) measured in a timeframe of 24 hours.','white', 400)\" onMouseout=\"hideddrivetip()\" style=\"font-weight:bolder\">Train DNL";
 newitem+="</td>";
 
//  *** COLUMN 2 *** 
 newitem+= "<td class=\"electric\"><input class='form-control' size=\"17\" id=\"ELCDNLVALUE\"  type=\"text\" name=\"ELCDNLVALUE\" title=\"Electric DNL\" ReadOnly=true>";
 newitem+="</td>";

//  *** COLUMN 3 ***
 newitem+= "<td class=\"diesel\"><input class='form-control' size=\"17\" id=\"DSLDNLVALUE\" type=\"text\" name=\"DSLDNLVALUE\" title=\"Diesel DNL\" ReadOnly=true>";
 newitem+="</td>";
 newitem+= "</tr>";
 
//Row 10
 newitem+= "<tr class='last-row'>";
 
//  *** COLUMN 1 ***
 newitem+= "<td>";
 newitem+= "<input class='button-calculate btn btn-primary' type=\"button\" onMouseover=\"ddrivetip('Click on this button to determine the Day-Night Noise Level (DNL) for the railway and trains being assessed in units of decibel (dB).','white', 400)\" onMouseout=\"hideddrivetip()\" value=\"Calculate Rail #" + railsources + " DNL\" name=\"calculateRailDNL\" onclick=\"CalculateRailSources(this.form)\">";
 newitem+= "</td>";
 
//  *** COLUMN 2 ***
 newitem+= "<td class=\"electric\" colspan =\"1\" align = left>";
 newitem+= "<input class='form-control' id=\"RWDNLVALUE\" size=\"17\" type=\"text\" name=\"RWDNLVALUE\" title=\"Rail DNL\" ReadOnly=true>";
 newitem+= "</td>";
 
//  *** COLUMN 3 ***
 newitem+= "<td>";
 newitem+= "<input class='button-gray-gradient btn btn-default' id=\"railreset\" type=\"button\" onMouseover=\"ddrivetip('Click on this button to clear the data from the railway assessment data fields.','white', 400)\" onMouseout=\"hideddrivetip()\" value=\"Reset\" onclick=\'reset_Rail(this.form)\'>";
 newitem+= "</td>";
 newitem+= "</tr>";
 newitem+="</table>";
 newitem+="</form>";
 newnode=document.createElement("span");
 newnode.innerHTML=newitem;
 div.appendChild(newnode);
 railsources++;
 raildnlincr++;
 sitednlincr++;
}

/* function to calculate aiport noise level - DKB */
function calculateAPNLSDNL()
{
	calculateSDNL();
	//Import variables from form on dnlcalculatortool.cfm
  	imprtAirplaneDNL = document.formall.txtAirPortNoiseLevelSource.value;
  	imprtSiteDNL = document.formall.sitednl.value;
	//If information imported from form is vaild combine the sound levels
  	if (imprtAirplaneDNL == 0)
  	{
    	//alert("there is no aiport noise level value");
    	document.formall.nsitednl.value="N/A";
 	}
  	else
	{
		newSiteDNL = Combine_Sound_Levels(imprtAirplaneDNL, imprtSiteDNL);
  		document.formall.nsitednl.value = roundNumber(newSiteDNL,1);
		document.cookie = "SiteDNL=" + roundNumber(newSiteDNL,1);
	}
}
// Function to calculate Loud Impulse Sound
function calculateLoudImpulseSound()
{
	calculateAPNLSDNL();
	varNewSiteDNL = 0;
  	txtSiteDNLValue = document.formall.sitednl.value;
	newSiteDNL = document.formall.nsitednl.value;
	lisRadio = document.formall.LIS

	if(lisRadio[0].checked==true)
	{
		if (isNaN(newSiteDNL)|| newSiteDNL=="")
		{
			txtSiteDNLValue = parseFloat(txtSiteDNLValue);
        	varNewSiteDNLwLIS = (txtSiteDNLValue + 8);
        	varNewSiteDNLwLIS = Math.round(varNewSiteDNLwLIS*10000)/10000;
        	document.formall.lis.value=varNewSiteDNLwLIS;
        	document.cookie = "SiteDNL=" + varNewSiteDNLwLIS;  
		}
		else
		{
			newSiteDNL = parseFloat(newSiteDNL);
        	varNewSiteDNLwLIS = (newSiteDNL + 8);
        	varNewSiteDNLwLIS = Math.round(varNewSiteDNLwLIS*10000)/10000;
        	document.formall.lis.value=varNewSiteDNLwLIS;
        	document.cookie = "SiteDNL=" + varNewSiteDNLwLIS;  
		}
	}
	else
	{
		clearLoudImpulseSound();
	}
  	
}


// function to hide airport noise level and loud impulse
function toggle() 
{
	var ele = document.getElementById("toggleText");
	var text = document.getElementById("displayText");
	//if(ele.style.display == "block") {
  //  		ele.style.display = "none";
	//	text.innerHTML = "show";
  //	}
	//else {
		ele.style.display = "block";
		text.innerHTML = "hide";
	//}
} 

//  function to remove loud impulse sound
function clearLoudImpulseSound()
{
document.formall.lis.value="";
}
