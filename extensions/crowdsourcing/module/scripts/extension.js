var ZemantaCrowdSourcingExtension = {handlers: {}, util: {}};


ZemantaCrowdSourcingExtension.handlers.storeCrowdFlowerSettings = function() {
	
	new ZemantaSettingsDialog(function(newSettings) {
		$.post(
	          "/command/core/set-preference",
	          {
	            name : "crowdflower.apikey",
	            value : JSON.stringify(newSettings.apiKey)
	          },
	          function(o) {
	            if (o.code == "error") {
	            	alert(o.message);
	            }
	          },
	          "json"
		);
		$.post(
		          "/command/core/set-preference",
		          {
		            name : "crowdflower.defaultTimeout",
		            value : JSON.stringify(newSettings.defaultTimeout)
		          },
		          function(o) {
		            if (o.code == "error") {
		            	alert(o.message);
		            }
		          },
		          "json"
			);
	});
};


ZemantaCrowdSourcingExtension.handlers.doNothing = function() {
	alert("Crowdsourcing extension active...");
};


ZemantaCrowdSourcingExtension.handlers.openJobSettingsDialog = function()  {
	
	new ZemantaCrowdFlowerDialog(function(extension) {
		
	      $.post(
	    		  "command/crowdsourcing/create-crowdflower-job",
	    		  { "project" : theProject.id, 
	    			"extension": JSON.stringify(extension),
	    			"engine" : JSON.stringify(ui.browsingEngine.getJSON())
	    		  },
	    		  function(o)
	    		  {
	    			  if(o.status != "ERROR") {
	    				  if(extension.new_job === true) {
	    					  alert("New job was created successfully.\nYou can see it on your CrowdFlower account."); 
	    				  } else {  
	    					  alert("Data was uploaded successfully.\nYou can see it on your CrowdFlower account.");  
	    				  }
	    			  } else {
	    				  alert("An error occured that prevented creating the job. \n" + o.message);
	    			  }
	    		  },
	    		  "json"
	      );     

	});
};

ZemantaCrowdSourcingExtension.handlers.evaluateReconDialog = function()  {
	
	new ZemantaCFEvaluateReconDialog(function(extension) {
		
	      $.post(
	    		  "command/crowdsourcing/evaluate-recon-job",
	    		  { "project" : theProject.id, 
	    			"extension": JSON.stringify(extension),
	    			"engine" : JSON.stringify(ui.browsingEngine.getJSON())
	    		  },
	    		  function(o)
	    		  {
	    			  if(o === null) {
	    				  alert("There is something wrong with your data. It was not uploaded to CrowdFlower Service.");
	    			  }
	    			  else {
		    			  if(o.status == "ok" || o.status == 200) {
		    				  alert("Data successfully uploaded. Check your CrowdFlower account.");
		    			  } else {
		    				  alert("Something went wrong while uploading. \n" + o.status);
		    			  }
	    			  }
	    		  },
	    		  "json"
	      );     

	});
};



ZemantaCrowdSourcingExtension.handlers.getApiKey =  function() {
	console.log("Getting API key...");
	ZemantaCrowdSourcingExtension.util.loadCrowdFlowerApiKeyFromSettings(function(apiKey) {
		console.log("Read API key: " + apiKey);
		return apiKey;
	});
};


ExtensionBar.addExtensionMenu({
	"id": "crowdsourcing-ext",
	"label": "Crowdsourcing",
	"submenu": [
	    		 {
	    			 "id": "crowdsourcing-ext/create-crowdflower-job",
	    			 label: "Create new job / upload data",
	    			 click: ZemantaCrowdSourcingExtension.handlers.openJobSettingsDialog
	    		 },
	    		 {},
	    		 {
	    			 "id":"crowdsourcing-ext/templates",
	    			 "label": "Templates",
	    			 "submenu": [
	    			             {
	    			            	 "id": "crowdsourcing-ext/templates/eval-recon-data",
	    			            	 "label": "Evaluate reconciled data",
	    			            	 click: ZemantaCrowdSourcingExtension.handlers.evaluateReconDialog	 
	    			             },
	    			             ]
	    		 },
	    		 {},
	     		 {
	    			 "id": "crowdsourcing-ext/settings",
	    			 "label": "CrowdFlower settings",
	    			  click: ZemantaCrowdSourcingExtension.handlers.storeCrowdFlowerSettings
	    		 }
              ]
		 });
