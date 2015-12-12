define(["mvc/list/list-item","mvc/dataset/states","ui/fa-icon-button","mvc/base-mvc","utils/localization"],function(a,b,c,d,e){var f="dataset",g=a.ListItemView,h=g.extend({_logNamespace:f,className:g.prototype.className+" dataset",id:function(){return["dataset",this.model.get("id")].join("-")},initialize:function(a){a.logger&&(this.logger=this.model.logger=a.logger),this.log(this+".initialize:",a),g.prototype.initialize.call(this,a),this.linkTarget=a.linkTarget||"_blank"},_setUpListeners:function(){g.prototype._setUpListeners.call(this),this.model.on("change",function(){this.model.changedAttributes().state&&this.model.inReadyState()&&this.expanded&&!this.model.hasDetails()?this.model.fetch():this.render()},this)},_fetchModelDetails:function(){var a=this;return a.model.inReadyState()&&!a.model.hasDetails()?a.model.fetch({silent:!0}):jQuery.when()},remove:function(a,b){var c=this;a=a||this.fxSpeed,this.$el.fadeOut(a,function(){Backbone.View.prototype.remove.call(c),b&&b.call(c)})},render:function(a){return g.prototype.render.call(this,a)},_swapNewRender:function(a){return g.prototype._swapNewRender.call(this,a),this.model.has("state")&&this.$el.addClass("state-"+this.model.get("state")),this.$el},_renderPrimaryActions:function(){return[this._renderDisplayButton()]},_renderDisplayButton:function(){var a=this.model.get("state");if(a===b.NOT_VIEWABLE||a===b.DISCARDED||!this.model.get("accessible"))return null;var d={target:this.linkTarget,classes:"display-btn"};if(this.model.get("purged"))d.disabled=!0,d.title=e("Cannot display datasets removed from disk");else if(a===b.UPLOAD)d.disabled=!0,d.title=e("This dataset must finish uploading before it can be viewed");else if(a===b.NEW)d.disabled=!0,d.title=e("This dataset is not yet viewable");else{d.title=e("View data"),d.href=this.model.urls.display;var f=this;d.onclick=function(a){Galaxy.frame&&Galaxy.frame.active&&(Galaxy.frame.add_dataset(f.model.get("id")),a.preventDefault())}}return d.faIcon="fa-eye",c(d)},_renderDetails:function(){if(this.model.get("state")===b.NOT_VIEWABLE)return $(this.templates.noAccess(this.model.toJSON(),this));var a=g.prototype._renderDetails.call(this);return a.find(".actions .left").empty().append(this._renderSecondaryActions()),a.find(".summary").html(this._renderSummary()).prepend(this._renderDetailMessages()),a.find(".display-applications").html(this._renderDisplayApplications()),this._setUpBehaviors(a),a},_renderSummary:function(){var a=this.model.toJSON(),b=this.templates.summaries[a.state];return(b=b||this.templates.summaries.unknown)(a,this)},_renderDetailMessages:function(){var a=this,b=$('<div class="detail-messages"></div>'),c=a.model.toJSON();return _.each(a.templates.detailMessages,function(d){b.append($(d(c,a)))}),b},_renderDisplayApplications:function(){return this.model.isDeletedOrPurged()?"":[this.templates.displayApplications(this.model.get("display_apps"),this),this.templates.displayApplications(this.model.get("display_types"),this)].join("")},_renderSecondaryActions:function(){switch(this.debug("_renderSecondaryActions"),this.model.get("state")){case b.NOT_VIEWABLE:return[];case b.OK:case b.FAILED_METADATA:case b.ERROR:return[this._renderDownloadButton(),this._renderShowParamsButton()]}return[this._renderShowParamsButton()]},_renderShowParamsButton:function(){return c({title:e("View details"),classes:"params-btn",href:this.model.urls.show_params,target:this.linkTarget,faIcon:"fa-info-circle"})},_renderDownloadButton:function(){return this.model.get("purged")||!this.model.hasData()?null:_.isEmpty(this.model.get("meta_files"))?$(['<a class="download-btn icon-btn" href="',this.model.urls.download,'" title="'+e("Download")+'" download>','<span class="fa fa-floppy-o"></span>',"</a>"].join("")):this._renderMetaFileDownloadButton()},_renderMetaFileDownloadButton:function(){var a=this.model.urls;return $(['<div class="metafile-dropdown dropdown">','<a class="download-btn icon-btn" href="javascript:void(0)" data-toggle="dropdown"',' title="'+e("Download")+'">','<span class="fa fa-floppy-o"></span>',"</a>",'<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">','<li><a href="'+a.download+'" download>',e("Download dataset"),"</a></li>",_.map(this.model.get("meta_files"),function(b){return['<li><a href="',a.meta_download+b.file_type,'">',e("Download")," ",b.file_type,"</a></li>"].join("")}).join("\n"),"</ul>","</div>"].join("\n"))},events:_.extend(_.clone(g.prototype.events),{"click .display-btn":function(a){this.trigger("display",this,a)},"click .params-btn":function(a){this.trigger("params",this,a)},"click .download-btn":function(a){this.trigger("download",this,a)}}),toString:function(){var a=this.model?this.model+"":"(no model)";return"DatasetListItemView("+a+")"}});return h.prototype.templates=function(){var a=_.extend({},g.prototype.templates.warnings,{failed_metadata:d.wrapTemplate(['<% if( model.state === "failed_metadata" ){ %>','<div class="warningmessagesmall">',e("An error occurred setting the metadata for this dataset"),"</div>","<% } %>"]),error:d.wrapTemplate(["<% if( model.error ){ %>",'<div class="errormessagesmall">',e("There was an error getting the data for this dataset"),": <%- model.error %>","</div>","<% } %>"]),purged:d.wrapTemplate(["<% if( model.purged ){ %>",'<div class="purged-msg warningmessagesmall">',e("This dataset has been deleted and removed from disk"),"</div>","<% } %>"]),deleted:d.wrapTemplate(["<% if( model.deleted && !model.purged ){ %>",'<div class="deleted-msg warningmessagesmall">',e("This dataset has been deleted"),"</div>","<% } %>"])}),c=d.wrapTemplate(['<div class="details">','<div class="summary"></div>','<div class="actions clear">','<div class="left"></div>','<div class="right"></div>',"</div>","<% if( !dataset.deleted && !dataset.purged ){ %>",'<div class="tags-display"></div>','<div class="annotation-display"></div>','<div class="display-applications"></div>',"<% if( dataset.peek ){ %>",'<pre class="dataset-peek"><%= dataset.peek %></pre>',"<% } %>","<% } %>","</div>"],"dataset"),f=d.wrapTemplate(['<div class="details">','<div class="summary">',e("You do not have permission to view this dataset"),"</div>","</div>"],"dataset"),h={};h[b.OK]=h[b.FAILED_METADATA]=d.wrapTemplate(["<% if( dataset.misc_blurb ){ %>",'<div class="blurb">','<span class="value"><%- dataset.misc_blurb %></span>',"</div>","<% } %>","<% if( dataset.file_ext ){ %>",'<div class="datatype">','<label class="prompt">',e("format"),"</label>",'<span class="value"><%- dataset.file_ext %></span>',"</div>","<% } %>","<% if( dataset.metadata_dbkey ){ %>",'<div class="dbkey">','<label class="prompt">',e("database"),"</label>",'<span class="value">',"<%- dataset.metadata_dbkey %>","</span>","</div>","<% } %>","<% if( dataset.misc_info ){ %>",'<div class="info">','<span class="value"><%- dataset.misc_info %></span>',"</div>","<% } %>"],"dataset"),h[b.NEW]=d.wrapTemplate(["<div>",e("This is a new dataset and not all of its data are available yet"),"</div>"],"dataset"),h[b.NOT_VIEWABLE]=d.wrapTemplate(["<div>",e("You do not have permission to view this dataset"),"</div>"],"dataset"),h[b.DISCARDED]=d.wrapTemplate(["<div>",e("The job creating this dataset was cancelled before completion"),"</div>"],"dataset"),h[b.QUEUED]=d.wrapTemplate(["<div>",e("This job is waiting to run"),"</div>"],"dataset"),h[b.RUNNING]=d.wrapTemplate(["<div>",e("This job is currently running"),"</div>"],"dataset"),h[b.UPLOAD]=d.wrapTemplate(["<div>",e("This dataset is currently uploading"),"</div>"],"dataset"),h[b.SETTING_METADATA]=d.wrapTemplate(["<div>",e("Metadata is being auto-detected"),"</div>"],"dataset"),h[b.PAUSED]=d.wrapTemplate(["<div>",e('This job is paused. Use the "Resume Paused Jobs" in the history menu to resume'),"</div>"],"dataset"),h[b.ERROR]=d.wrapTemplate(["<% if( !dataset.purged ){ %>","<div><%- dataset.misc_blurb %></div>","<% } %>",'<span class="help-text">',e("An error occurred with this dataset"),":</span>",'<div class="job-error-text"><%- dataset.misc_info %></div>'],"dataset"),h[b.EMPTY]=d.wrapTemplate(["<div>",e("No data"),": <i><%- dataset.misc_blurb %></i></div>"],"dataset"),h.unknown=d.wrapTemplate(['<div>Error: unknown dataset state: "<%- dataset.state %>"</div>'],"dataset");var i={resubmitted:d.wrapTemplate(["<% if( model.resubmitted ){ %>",'<div class="resubmitted-msg infomessagesmall">',e("The job creating this dataset has been resubmitted"),"</div>","<% } %>"])},j=d.wrapTemplate(["<% _.each( apps, function( app ){ %>",'<div class="display-application">','<span class="display-application-location"><%- app.label %></span> ','<span class="display-application-links">',"<% _.each( app.links, function( link ){ %>",'<a target="<%- link.target %>" href="<%- link.href %>">',"<% print( _l( link.text ) ); %>","</a> ","<% }); %>","</span>","</div>","<% }); %>"],"apps");return _.extend({},g.prototype.templates,{warnings:a,details:c,noAccess:f,summaries:h,detailMessages:i,displayApplications:j})}(),{DatasetListItemView:h}});
//# sourceMappingURL=../../../maps/mvc/dataset/dataset-li.js.map