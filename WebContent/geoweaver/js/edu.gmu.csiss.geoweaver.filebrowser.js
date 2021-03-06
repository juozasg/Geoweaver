/**
 * 
 * author: Ziheng Sun
 * 
 */

edu.gmu.csiss.geoweaver.filebrowser = {
		
		current_path: null,
		
		current_hid: null,
		
		editor: null,
		
		edit_file: 0,
		
		openFileEditor: function(file_name){
			
			$.ajax({
				
				url: "retrievefile",
				
				method: "POST",
				
				data: { "filepath" : edu.gmu.csiss.geoweaver.filebrowser.current_path + file_name}
				
			}).done(function(msg){
				
				msg = $.parseJSON(msg);
				
				if(msg.ret == "success"){
					
					edu.gmu.csiss.geoweaver.filebrowser.edit_file = 1;

					var width = 800; var height = 640;
					
					const frame = edu.gmu.csiss.geoweaver.workspace.jsFrame.create({
				    		title: 'File Editor',
				    	    left: 0, 
				    	    top: 0, 
				    	    width: width, 
				    	    height: height,
				    	    appearanceName: 'yosemite',
				    	    style: {
			                    backgroundColor: 'rgb(255,255,255)',
					    	    fontSize: 12,
			                    overflow:'auto'
			                },
				    	    html: "<div class=\"modal-body\" style=\"font-size:12px;\" ><div id=\"codearea\" class=\"form-group row required\" ></div>"+
							"<button id=\"loading_btn\" class=\"btn btn-sm btn-warning\"><span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\"></span> Loading...</button></div>" + 
							'<div class="modal-footer">' +
							"	<button type=\"button\" id=\"browser-save\" class=\"btn btn-outline-primary\">Save</button> "+
							"	<button type=\"button\" id=\"browser-run\" class=\"btn btn-outline-primary\">Run</button> "+
							'</div>'
				    	    
			    	});
			    	
					frame.setControl({
			            styleDisplay:'inline',
			            maximizeButton: 'zoomButton',
			            demaximizeButton: 'dezoomButton',
			            minimizeButton: 'minimizeButton',
			            deminimizeButton: 'deminimizeButton',
			            hideButton: 'closeButton',
			            animation: true,
			            animationDuration: 150,
			
			        });
			    	
			    	frame.show();
			    	
			    	frame.setPosition((window.innerWidth - width) / 2, (window.innerHeight -height) / 2, 'LEFT_TOP');
			    	
					$("#codearea").append('<textarea id="code_editor" placeholder=""></textarea>');
	            	
					edu.gmu.csiss.geoweaver.filebrowser.editor = CodeMirror.fromTextArea(document.getElementById("code_editor"), {
		        		
		        		lineNumbers: true,
		        		lineWrapping: true
		        	});
					
					var url_path = msg.path;
					
					//prevent it loading from cache
					$.ajaxSetup ({
					    // Disable caching of AJAX responses
					    cache: false
					});
					
					$.get( "../" + url_path, function( data ) {
						
						edu.gmu.csiss.geoweaver.filebrowser.editor.setValue(data);
						
						$("#loading_btn").hide();
						
					});
					
					$.ajaxSetup ({
					    // Enable caching of AJAX responses
					    cache: true
					});
					
					frame.on('closeButton', 'click', (_frame, evt) => {
						
	                	$.ajax({
		            		
		            		url: "closefilebrowser",
		            		
		            		method: "POST"
		            		
		            	}).done(function(msg){
		            		
		            		console.log(msg);
		            		
		            	});
	                	
		                _frame.closeFrame();
		                
		            });
					
					$("#browser-save").click(function(){
						
						$.ajax({
	                		
	                		url: "updatefile",
	                		
	                		method: "POST",
	                		
	                		data: { filepath: edu.gmu.csiss.geoweaver.filebrowser.current_path + file_name, 
	                			content: edu.gmu.csiss.geoweaver.filebrowser.editor.getValue()}
	                		
	                	}).done(function(msg){
	                		
	                		msg = $.parseJSON(msg);
	                		
	                		if(msg.ret == "success"){
	                			
		                		console.log("file updated");
	                			
		                		alert("Saved!!");
		                		
	                		}else{
	                			
	                			alert("Failed!!" + msg.reason);
	                		}
	                		
	                	});
	                	
						
					});
					
					$("#browser-run").click(function(){

	                	var patt1 = /\.([0-9a-z]+)(?:[\?#]|$)/i;
	        			
	        			var suffix = file_name.match(patt1);
	                	
	                	if(edu.gmu.csiss.geoweaver.filebrowser.isIn(suffix[1],["py", "sh"])){
	                		
	                		//step 1: add the file as a new process
	                		
	                		//step 2: pop-up the run dialog of the process
	                		
	                		var type = "shell";
	                		
	                		if("py"==suffix[1]){
	                			
	                			type = "python";
	                			
	                		}
	                		
		                	var req = {
		                			
		                			name: file_name,
		                			
		                			filepath: edu.gmu.csiss.geoweaver.filebrowser.current_path + file_name,
		                			
		                			hid: edu.gmu.csiss.geoweaver.filebrowser.current_hid,
		                			
		                			type: type,
		                			
		                			content: edu.gmu.csiss.geoweaver.filebrowser.editor.getValue()
		                			
		                	};
		                	
		                	$.ajax({
		                		
		                		url: "addLocalFile",
		                		
		                		method: "POST",
		                		
		                		data: req
		                		
		                	}).done(function(msg){
		                		
		                		msg = $.parseJSON(msg);
		                		
		                		var pid = msg.id;
		                		
		                		edu.gmu.csiss.geoweaver.process.addMenuItem(msg, type);
		                		
		                		edu.gmu.csiss.geoweaver.process.executeProcess(pid, edu.gmu.csiss.geoweaver.filebrowser.current_hid, type);
		                		
		                		edu.gmu.csiss.geoweaver.ssh.addlog("The process " + msg.name + " is added to the process list.");
		                		edu.gmu.csiss.geoweaver.ssh.addlog("Pop up authorization dialog to initiate the run of the process : " + pid);
		                		
		                	});
		                	
	                	}else{
	                		
	                		alert("Only Python and Shell script can run!");
	                		
	                	}
						
						
					});
					
					
					
//					BootstrapDialog.closeAll();
//					
//					BootstrapDialog.show({
//						
//						title: "File Editor",
//						
//						closable: false,
//						
//						size: BootstrapDialog.SIZE_WIDE,
//						
//						message: "<div id=\"codearea\" class=\"form-group row required\" ></div>"+
//						
//						"<button id=\"loading_btn\" class=\"btn btn-sm btn-warning\"><span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\"></span> Loading...</button>",
//						
//						onshown: function(){
//							
//							$("#codearea").append('<textarea id="code_editor" placeholder=""></textarea>');
//			            	
//							edu.gmu.csiss.geoweaver.filebrowser.editor = CodeMirror.fromTextArea(document.getElementById("code_editor"), {
//				        		
//				        		lineNumbers: true,
//				        		lineWrapping: true
//				        	});
//							
//							var url_path = msg.path;
//							
//							//prevent it loading from cache
//							$.ajaxSetup ({
//							    // Disable caching of AJAX responses
//							    cache: false
//							});
//							
//							$.get( "../" + url_path, function( data ) {
//								
//								edu.gmu.csiss.geoweaver.filebrowser.editor.setValue(data);
//								
//								$("#loading_btn").hide();
//								
//							});
//							
//							$.ajaxSetup ({
//							    // Enable caching of AJAX responses
//							    cache: true
//							});
//							
//			            },
//			            
//			            onhide: function(dialogRef){
//
//		                	$.ajax({
//		                		
//		                		url: "closefilebrowser",
//		                		
//		                		method: "POST"
//		                		
//		                	}).done(function(msg){
//		                		
//		                		console.log(msg);
//		                		
//		                	});
//		                	
//			            },
//			            
//			            buttons: [{
//			            	
//			                label: 'Save',
//			                
//			                action: function(dialog) {
//			                	
//			                	$.ajax({
//			                		
//			                		url: "updatefile",
//			                		
//			                		method: "POST",
//			                		
//			                		data: { filepath: edu.gmu.csiss.geoweaver.filebrowser.current_path + file_name, 
//			                			content: edu.gmu.csiss.geoweaver.filebrowser.editor.getValue()}
//			                		
//			                	}).done(function(msg){
//			                		
//			                		msg = $.parseJSON(msg);
//			                		
//			                		if(msg.ret == "success"){
//			                			
//				                		console.log("file updated");
//			                			
//				                		alert("Saved!!");
//				                		
//			                		}else{
//			                			
//			                			alert("Failed!!" + msg.reason);
//			                		}
//			                		
//			                	});
//			                	
//			                }
//			            
//			            },{
//			            	
//			                label: 'Run',
//			                
//			                action: function(dialog) {
//			                	
//			                	var patt1 = /\.([0-9a-z]+)(?:[\?#]|$)/i;
//			        			
//			        			var suffix = file_name.match(patt1);
//			                	
//			                	if(edu.gmu.csiss.geoweaver.filebrowser.isIn(suffix[1],["py", "sh"])){
//			                		
//			                		//step 1: add the file as a new process
//			                		
//			                		//step 2: pop-up the run dialog of the process
//			                		
//			                		var type = "shell";
//			                		
//			                		if("py"==suffix[1]){
//			                			
//			                			type = "python";
//			                			
//			                		}
//			                		
//				                	var req = {
//				                			
//				                			name: file_name,
//				                			
//				                			filepath: edu.gmu.csiss.geoweaver.filebrowser.current_path + file_name,
//				                			
//				                			hid: edu.gmu.csiss.geoweaver.filebrowser.current_hid,
//				                			
//				                			type: type,
//				                			
//				                			content: edu.gmu.csiss.geoweaver.filebrowser.editor.getValue()
//				                			
//				                	};
//				                	
//				                	$.ajax({
//				                		
//				                		url: "addLocalFile",
//				                		
//				                		method: "POST",
//				                		
//				                		data: req
//				                		
//				                	}).done(function(msg){
//				                		
//				                		msg = $.parseJSON(msg);
//				                		
//				                		var pid = msg.id;
//				                		
//				                		edu.gmu.csiss.geoweaver.process.addMenuItem(msg, type);
//				                		
//				                		edu.gmu.csiss.geoweaver.process.executeProcess(pid, edu.gmu.csiss.geoweaver.filebrowser.current_hid, type);
//				                		
//				                		edu.gmu.csiss.geoweaver.ssh.addlog("The process " + msg.name + " is added to the process list.");
//				                		edu.gmu.csiss.geoweaver.ssh.addlog("Pop up authorization dialog to initiate the run of the process : " + pid);
//				                		
//				                	});
//				                	
//			                	}else{
//			                		
//			                		alert("Only Python and Shell script can run!");
//			                		
//			                	}
//			                	
//			                	dialog.close();
//			                
//			                }
//			            
//			            },{
//			            	
//			                label: 'Close',
//			                
//			                action: function(dialog) {
//			                	
//			                	dialog.close();
//			                
//			                }
//			            
//			            }]
//						
//					});
					

					
					
				}else{
					
					alert("Fail to retrieve file: " + msg.reason);
					
				}
				
			});
			
		},
		
		downloadFile: function(file_name){
			
			var path = edu.gmu.csiss.geoweaver.filebrowser.current_path + file_name;
			
			var req = {filepath : path};
			
			$.ajax({
				
				url: "retrievefile",
				
				data: req,
				
				method: "POST"
					
			}).done(function(msg){
				
				msg = $.parseJSON(msg);
				
				if(msg.ret == "success"){
					
					var fileurl = msg.path;
					
					edu.gmu.csiss.geoweaver.result.download_path("../" + fileurl, file_name); //remove web from Geoweaver/web
					
				}else{
					
					alert("Fail to download!");
					
				}
				
			}).fail(function(jqXHR, textStatus, errorThrown){
				
				console.error(textStatus + errorThrown);
				
			});
			
		},
		
		isIn: function(target, array) {
		    for(var i=0; i<array.length; i++){
			   if(array[i] == target) 
			      return true;
		    }
		    return false;
		},
		
		operatefile: function(file_name, file_size){
			
			var patt1 = /\.([0-9a-z]+)(?:[\?#]|$)/i;
			
			var suffix = file_name.match(patt1);
			
			if(Number(file_size) < 10*1024*1024 && edu.gmu.csiss.geoweaver.filebrowser.isIn(suffix[1],["txt", "py", "sh", "java", "log", "js", "r", "c", "cpp", "f", "go", "sql", "php", "perl", "js"]) ){
				
				//edit the file
				edu.gmu.csiss.geoweaver.filebrowser.openFileEditor(file_name);
				
			}else{
				
				//directly download the file
				edu.gmu.csiss.geoweaver.filebrowser.downloadFile(file_name);
				
			}
			
		},
		
		continuebrowser: function(file_name){
			
			$.ajax({
				
				url: "openfilebrowser",
				
				data: {"init_path": edu.gmu.csiss.geoweaver.filebrowser.current_path + file_name + "/"},
			
				method: "POST"
				
			}).done(function(msg){
				
				msg = $.parseJSON(msg);
				
				if(msg.ret!="failure")
				
					edu.gmu.csiss.geoweaver.filebrowser.updateBrowser(msg);
				
				else
					
					alert("Fail to open the directory: " + msg.msg);
				
			}).fail(function(error){
				
				alert("Fail to send request to continue file browser" + error);
				
			});
			
		},
		
		s2Date: function(seconds){
			
			var m = new Date(Number(seconds)*1000);
			
			var dateString =
			    m.getUTCFullYear() + "/" +
			    ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
			    ("0" + m.getUTCDate()).slice(-2) + " " +
			    ("0" + m.getUTCHours()).slice(-2) + ":" +
			    ("0" + m.getUTCMinutes()).slice(-2) + ":" +
			    ("0" + m.getUTCSeconds()).slice(-2);
			
			return dateString;
			
		},
		
		updateBrowser: function(msg){
			
			edu.gmu.csiss.geoweaver.filebrowser.current_path = msg.current;
			
			var parentfolder = "..";
			
			if(edu.gmu.csiss.geoweaver.filebrowser.current_path == "/")
				
				parentfolder = ".";
			
			var cont = '<tr>'+
			  '    <td class="col-md-6" style="word-wrap:break-word;"><span><i class="pull-left fa fa-folder"></i><a style="word-wrap:break-word;" href="javascript:edu.gmu.csiss.geoweaver.filebrowser.continuebrowser(\''+
			  parentfolder+'\')" >'+parentfolder+'</a></span></td>'+
			  '    <td> </td>'+
			  '    <td> </td>'+
			  '    <td> </td>'+
			  '  </tr>';
			
			for(var i=0;i<msg.array.length;i++){
				
				cont += '<tr>';
				
				if(msg.array[i].isdirectory){
					
					cont += '    <td class="col-md-6 word-wrap" ><span><i class="pull-left fa fa-folder"></i><a class="word-wrap" href="javascript:edu.gmu.csiss.geoweaver.filebrowser.continuebrowser(\'' + 
			  			msg.array[i].name + '\')" >' +msg.array[i].name+'</a></span></td>';
						
				}else{
					
					cont += '    <td class="col-md-5 word-wrap"><span><i class="pull-left fa fa-file"></i><a  class="word-wrap" href="javascript:edu.gmu.csiss.geoweaver.filebrowser.operatefile(\'' + 
			  			msg.array[i].name + '\', \'' + msg.array[i].size + '\')" >' +msg.array[i].name+'</a></span></td>';
					
				}
				
				cont +=  '    <td>'+edu.gmu.csiss.geoweaver.filebrowser.s2Date(msg.array[i].mtime)+'</td>'+
				  '    <td>'+msg.array[i].size+'</td>'+
				  '    <td>'+msg.array[i].mode+'</td>'+
				  '  </tr>';
				
			}
			
			$("#directory_table > tbody").html(cont);
			
		},
		
		sortTable: function (n) {
			
			  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
			  table = document.getElementById("directory_table");
			  switching = true;
			  // Set the sorting direction to ascending:
			  dir = "asc";
			  /* Make a loop that will continue until
			  no switching has been done: */
			  while (switching) {
			    // Start by saying: no switching is done:
			    switching = false;
			    rows = table.rows;
			    /* Loop through all table rows (except the
			    first, which contains table headers): */
			    for (i = 1; i < (rows.length - 1); i++) {
			      // Start by saying there should be no switching:
			      shouldSwitch = false;
			      /* Get the two elements you want to compare,
			      one from current row and one from the next: */
			      x = rows[i].getElementsByTagName("TD")[n];
			      y = rows[i + 1].getElementsByTagName("TD")[n];
			      /* Check if the two rows should switch place,
			      based on the direction, asc or desc: */
			      if (dir == "asc") {
			        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
			          // If so, mark as a switch and break the loop:
			          shouldSwitch = true;
			          break;
			        }
			      } else if (dir == "desc") {
			        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
			          // If so, mark as a switch and break the loop:
			          shouldSwitch = true;
			          break;
			        }
			      }
			    }
			    if (shouldSwitch) {
			      /* If a switch has been marked, make the switch
			      and mark that a switch has been done: */
			      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			      switching = true;
			      // Each time a switch is done, increase this count by 1:
			      switchcount ++;
			    } else {
			      /* If no switching has been done AND the direction is "asc",
			      set the direction to "desc" and run the while loop again. */
			      if (switchcount == 0 && dir == "asc") {
			        dir = "desc";
			        switching = true;
			      }
			    }
			  }
		},
		
		showFolderBrowserDialog: function(msg){
			
			var cont = '<div class="modal-body" style=\"font-size: 12px;\"><div class=\"row\"  style="padding:10px;">';
			
			cont += '<table class="table table-sm table-dark col-md-12" id="directory_table"> '+
				'  <thead> '+
				'    <tr> '+
				'      <th class="col-md-5 word-wrap"  onclick="edu.gmu.csiss.geoweaver.filebrowser.sortTable(0)" >Name</th> '+
				'      <th  onclick="edu.gmu.csiss.geoweaver.filebrowser.sortTable(1)" >Last Modified</th> '+
				'      <th  onclick="edu.gmu.csiss.geoweaver.filebrowser.sortTable(2)" >Size</th> '+
				'      <th  onclick="edu.gmu.csiss.geoweaver.filebrowser.sortTable(3)" >Mode</th> '+
				'    </tr> '+
				'  </thead> '+
				'  <tbody>'+ 
				'  </tbody></table></div></div>';
			
			var width = 800; var height = 640;
			
			const frame = edu.gmu.csiss.geoweaver.workspace.jsFrame.create({
		    		title: 'File Browser',
		    	    left: 0, 
		    	    top: 0, 
		    	    width: width, 
		    	    height: height,
		    	    appearanceName: 'yosemite',
		    	    style: {
	                    backgroundColor: 'rgb(255,255,255)',
			    	    fontSize: 12,
	                    overflow:'auto'
	                },
		    	    html: cont
	    	});
	    	
			frame.setControl({
	            styleDisplay:'inline',
	            maximizeButton: 'zoomButton',
	            demaximizeButton: 'dezoomButton',
	            minimizeButton: 'minimizeButton',
	            deminimizeButton: 'deminimizeButton',
	            hideButton: 'closeButton',
	            animation: true,
	            animationDuration: 150,
	
	        });
	    	
	    	frame.show();
	    	
	    	frame.setPosition((window.innerWidth - width) / 2, (window.innerHeight -height) / 2, 'LEFT_TOP');
	    	
	    	edu.gmu.csiss.geoweaver.filebrowser.updateBrowser(msg);
        	
        	edu.gmu.csiss.geoweaver.filebrowser.edit_file = 0;
        	
        	frame.on('closeButton', 'click', (_frame, evt) => {
        		
            	if(edu.gmu.csiss.geoweaver.filebrowser.edit_file==0){
	        		
	        		//only close connection when the file editor is not present
	        		$.ajax({
	            		
	            		url: "closefilebrowser",
	            		
	            		method: "POST"
	            		
	            	}).done(function(msg){
	            		
	            		console.log(msg);
	            		
	            	});
	            	
	        	}
            	
                _frame.closeFrame();
                
            });
			
//			BootstrapDialog.show({
//				
//				title: 'File Browser',
//	            
//	            message: cont,
//	            
//	            size: BootstrapDialog.SIZE_WIDE,
//	            
//	            closable: true,
//	            
//	            onshown: function(){
//	            	
//	            	edu.gmu.csiss.geoweaver.filebrowser.updateBrowser(msg);
//	            	
//	            	edu.gmu.csiss.geoweaver.filebrowser.edit_file = 0;
//	            	
//	            },
//	            
//	            onhide: function(){
//	            	
//	            	if(edu.gmu.csiss.geoweaver.filebrowser.edit_file==0){
//	            		
//	            		//only close connection when the file editor is not present
//	            		$.ajax({
//	                		
//	                		url: "closefilebrowser",
//	                		
//	                		method: "POST"
//	                		
//	                	}).done(function(msg){
//	                		
//	                		console.log(msg);
//	                		
//	                	});
//	                	
//	            	}
//	            	
//	            },
//	            
//	            buttons: [{
//	            	
//	                label: 'Close',
//	                
//	                action: function(dialog) {
//	                	
//	                	dialog.close();
//	                
//	                }
//	            
//	            }]
//				
//			});
			
		},
		
		connect_folder: function(encrypt, req, dialog, button){
			
			req.pswd = encrypt;
			
			$.ajax({
				
				url: "openfilebrowser",
				
				data: req,
				
				method: "POST"
				
			}).done(function(msg){
				
				msg = $.parseJSON(msg);
				
				if(msg.current.length){
					
					edu.gmu.csiss.geoweaver.filebrowser.showFolderBrowserDialog(msg);
					
				}else{
					
					alert("Fail to open file browser");
					
				}

				dialog.close();
				
			}).fail(function(error){
				
				alert("Fail to send folder open request");
				
				button.enable();
				
				button.stopSpin();
				
			});
			
		},
		
		start: function(hid){
			
			var req = { hid: hid, init_path: "/home/"}
			
			if(this.current_hid == hid){
				
				req.init_path = this.current_path;
				
			}
			
			this.current_hid = hid;
			
			edu.gmu.csiss.geoweaver.host.start_auth_single(hid, req, edu.gmu.csiss.geoweaver.filebrowser.connect_folder);
			
		}
		
}
