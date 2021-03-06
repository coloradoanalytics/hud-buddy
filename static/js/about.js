//Vue component that populates the application when the "about" tab is selected.

var AboutTab = {

	template: `
	 <div class="section">
    <div class="container">
      <p class="title is-2">What is HUD Buddy?</p>
      <p>
        HUD Buddy is a tool that can instantly produce HUD noise studies.
        It was born out of the frustrations of an acoustical engineer using the worksheets in the HUD Noise Guidebook.
      </p>
      <br>
      <p>
        This application was one of three winning entries in the 2017 <a href="http://gocode.colorado.gov/2017-go-code-winners/" target="_blank">GoCode Colorado</a> business and software development contest put on by the Colorado Secretary of State.
      </p>
      <br>
      <br>

      <p class="title is-2">How to Use</p>
      <p>
        There are two parts to HUD Buddy: The <strong>Map</strong> and the <strong>Form</strong>.
      </p>
      <br>
      <p class="title is-4">Using the Map</p>
      <p>
        When you click on the map, HUD Buddy performs an instant noise analysis using the methods in the HUD Noise Guidebook.
        HUD Buddy queries public data sources to find significant roads and railways along with as much information as it can find
        about those noise sources. A marker will appear on the map and you'll see a summary of the data HUD Buddy found.
        (Note: automatic data retrieval currently works only for sites in Colorado)
      </p>
      <br>
      <p>
        In <strong>most cases</strong>, the data that HUD Buddy automatically collects will be enough to produce a complete Noise Assessment Location (NAL) worksheet.
        When this happens, the map marker will show the calculated Day-Night Level (DNL) for that location and will be color-coded according to its HUD classification.
      </p>
      <br>
      <p>
        You can add multiple markers to the map.
        If you'd like to move a marker, drag it to the new location and HUD Buddy will do a new query and calculation.
      </p>
      <br>
      <p>
        To edit the data at a location or to print out a report, click Send to Form.
      </p>
      <br>
      <p class="title is-5">Railroads</p>
      <p>
        The Colorado datasets provide meta information about railways, but no details about train operations.
        HUD Buddy fills in all of the default values specified by HUD. This covers everything but operations per day.
        The number of train operations per day that is automatically filled in is just a guess.
        Eventually we hope to have this information filled in automatically but, for now, you'll have to get it from the FRA.
      </p>
      <br>
      <p class="title is-5">Airports</p>
      <p>
        HUD Buddy finds all "CS" and "Military" airports within 15 miles of the NAL.
        Although we would like to automatcally calculate Airport DNL, for now you'll have to enter airport DNL manually on the form.
      </p>
      <br>
      <p class="title is-4">Using the Form</p>
      <p>
        HUD Buddy's form is a replacement for the <a href="https://www.hudexchange.info/environmental-review/dnl-calculator/">DNL Calculator</a> at the HUD Exchange.
        The calculations on both websites are the same, but we think ours is cleaner and easier to use.
      </p>
      <br>
      <p>
        Using the form should be fairly intuitive.
        You can add or remove roads, railways, and airports and edit their details as needed.
        You can either start with a blank form or pre-fill it from a location on the map.
        Click Calculate whenever you want to check the noise levels according to the current state of the form.
      </p>
      <br>
      <p class="title is-5">Traffic Projections</p>
      <p>
        You can edit the growth rate for your site and use that value to project traffic to a future year for any of your roads.
        With a road in edit mode, click the Projection button to reveal the Counted ADT and Traffic Count Year fields.
        After you've filled in a counted daily traffic value and the year of the traffic count, clicking the Project button will project ADT to your design year and place this value in the Total ADT field.
      </p>
      <br>
      <p class="title is-5">Producing a Report</p>
      <p>
        When your form is ready, click Generate Report to download a clean, printable report in .pdf format.
      </p>
      <br>
      <br>
      <p class="title is-2">Road Map</p>
      <p>
        HUD Buddy's automatic data retrieval currently works only in Colorado.
      </p>
      <br>
      <p>
        Additional features on our roadmap include:
      </p>
      <br>
        <p>
          <span class="icon"><i class="fa fa-bolt" aria-hidden="true"></i></span>
          Automatic discovery of airport DNL and rail traffic
        </p>
        <p>
          <span class="icon"><i class="fa fa-bolt" aria-hidden="true"></i></span>
          Composite building-envelope STC calculation and report to replace HUD Figure 19
        </p>
        <p>
          <span class="icon"><i class="fa fa-bolt" aria-hidden="true"></i></span>
          Noise barrier calculation and report to replace the HUD Barrier Performance Module
        </p>
        <p>
          <span class="icon"><i class="fa fa-bolt" aria-hidden="true"></i></span>
          Building component STC prediction to replace the HUD STraCAT tool
        </p>
        <p>
          <span class="icon"><i class="fa fa-bolt" aria-hidden="true"></i></span>
          Automatic building element selection tool to optimize window and door STC values
        </p>
    </div>
  </div>
  `
} 