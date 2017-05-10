var AboutTab = {

	template: `
	 <div class="section">
    <div class="container">
      <p class="title is-2">What is HUDX?</p>
      <p>
        HUDX is a tool that can instantly produce HUD noise studies.
        It was born out of the frustrations of an acoustical engineer using the worksheets in the HUD Noise Guidebook.
      </p>
      <br>
      <p>
        This application is our entry in the 2017 <a>GoCode Colorado</a> business and software development contest put on by the Colorado Secretary of State.
      </p>
      <br>
      <p>
        We are one of 10 finalist teams. On May 24th we will present this application to an audience and a panel of judges. 
        If we are chosen as a winning team, we will receive money and resources to help us develop HUDX into an even better tool.
      </p>
      <br>
      <p>
        The best possible evidence we can use to sway the judges to our favor is real-life users. 
        So if you find HUDX handy and think you'll use it, please send a quick note to <a href="mailto:joshua@coloradoanalytics.com">joshua@coloradoanalytics.com</a>.
      </p>
      <br>
      <br>

      <p class="title is-2">How to Use</p>
      <p>
        There are two parts to HUDX: The <strong>Map</strong> and the <strong>Form</strong>.
      </p>
      <br>
      <p class="title is-4">Using the Map</p>
      <p>
        When you click on the map HUDX performs an instant noise analysis using the methods in the HUD Noise Guidebook.
        HUDX queries public data sources to find significant roads and railways along with as much information as it can find
        about those noise sources. A marker will appear on the map and you'll see a summary of the data HUDX found.
      </p>
      <br>
      <p>
        In <strong>most cases</strong>, the data that HUDX automatically collects will be enough to produce a complete Noise Assessment Location (NAL) worksheet.
        When this happens, the map marker will show the calculated Day-Night Level (DNL) for that location and will be color-coded according to its HUD classification.
      </p>
      <br>
      <p>
        You can add multiple markers to the map.
        If you'd like to move a marker, drag it to the new location and HUDX will do a new query and analysis.
      </p>
      <br>
      <p>
        To edit the data at a location or to print out a report, click Send to Form.
      </p>
      <br>
      <p class="title is-4">Using the Form</p>
      <p>
        HUDX's form is a replacement for the <a href="https://www.hudexchange.info/environmental-review/dnl-calculator/">DNL Calculator</a> at the HUD Exchange.
        The calculations on both sites are the same, but we think our form is cleaner and easier to use.
      </p>
      <br>
      <p>
        Using the form should be fairly intuitive.
        You can add or remove roads and railways and edit their details as needed.
        You can either start with a blank form or pre-fill it from a location on the map.
        Click Calculate whenever you want to check the noise levels according to the current state of the form.
      </p>
      <br>
      <p class="title is-5">Traffic Projections</p>
      <p>
        You can edit the growth rate for your site and use that value to project traffic to a future year.
        With a road in edit mode, click the Projection button to reveal the Counted ADT and Traffic Count Year fields.
        After you fill in a counted daily traffic value as well as the year of the traffic count, clicking the Project button will project ADT to your design year and place this value in the Total ADT field.
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
        HUDX's automatic data retrieval currently works only in Colorado.
        We plan to start adding more states soon after the conclusion of the GoCode Colorado contest (sooner if we win!).
      </p>
      <br>
      <p>
        Additionally, we plan to add these features in the months ahead:
      </p>
      <br>
        <p>
          <span class="icon"><i class="fa fa-bolt" aria-hidden="true"></i></span>
          Automatic discovery of airports
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