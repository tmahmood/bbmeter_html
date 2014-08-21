function Visual(opts) {
	this.opts = opts == null ?  opts : {};
	this.visualizer = new Visualizer(null, '#displayopts', ',').onPageLoad();
}

var visual = new Visual();

$(function(){
	var me = this;
	visual.onMenuItemClick();

	if (document.location.hash != '') {

		var hash = document.location.hash.split('#').pop();
		var broken = hash.split('$');

		if (broken.length > 1) {
			visual.loadTextData(hash);
		} else {
			visual.loadGraphByHash(hash);
		}

	} else {
		$('._txt_').first().trigger('click');
	}
});

Visual.prototype.onMenuItemClick = function() {
	var me = this;

	$(document).on('click', '._nv_archive', function(ev){
		ev.preventDefault();
		me.loadArchieves();
	});

	$(document).on('click', '._nv_graphs', function(ev){

		ev.preventDefault();

		if (me.visualizer.loading) {
			return;
		}

		me.visualizer.loading = true;

		var hash = this.href.split('#').pop();
		document.location.hash = hash;

		me.loadGraphByHash(hash);
		$('._nv_graphs').removeClass('active');
		$(this).addClass('active');

	});

	$(document).on('click', '._txt_', function(ev){
		ev.preventDefault();

		var hash = this.href.split('#').pop();
		document.location.hash = hash;

		if (me.textdata == undefined) {
			me.loadTextData(hash);
		} else {
			me.showTextDocument(hash);
		}
	});
}


Visual.prototype.loadArchieves = function(hash) {
	$('#frontend').hide();
	$('#graphcontent').show();
	if (this.archive == undefined) {
		this.archive = new Archieve(this)
							.loadArchieve()
							.onSelectChange();
	}
	$('#surveymenu').show();
};


Visual.prototype.loadTextData = function(hash) {
	var me = this;
	d3.json('assets/data/texts.json', function(res){
		me.textdata = res;
		me.showTextDocument(hash);
	});
};

Visual.prototype.showTextDocument = function(hash) {

	$('._nv_graphs').removeClass('active');
	$('#graphcontent').hide();
	$('#surveymenu').hide();
	$('#frontend').show();
	this.loadContentByHash(hash)
};

Visual.prototype.loadContentByHash = function(chash) {

	var hash = chash.split('$').pop();

	$('#graphcontent').hide();
	$('#surveymenu').hide();
	$('#frontend').show();

	var divheight = $(window).height();
	$('#textcontainer').height(divheight);

	var hdata = this.textdata[hash];

	if (hdata.length == undefined) {

		if (this.presenter != undefined) {
			$('#' + this.presenter.id).hide();
		}

		if ($('#textcontainer div').length == 0) {

			var h1 = createElement({ element: 'h1' });
			var p = createElement({ element: 'p' });
			var dv = createElement({ element: 'div' });

			$(dv).append(h1).append(p);
			$('#textcontainer').append(dv);
		}

		$('#textcontainer').show();
		$('#textcontainer div h1').text(hdata['title']);
		$('#textcontainer div p').html(hdata['content']);

		if (hdata['img'] != undefined) {
			$('#textcontainer').css({ background: 'url(assets/imgs/' + hdata['img'] + ')' });
		}

	} else {

		$('#textcontainer').hide();
		if (this.presenter == undefined) {
			this.presenter = new Presenter(hdata, '#frontend');
			this.presenter.prepearePresentation();
		} else {
			$('#' + this.presenter.id).show();
		}

	}
};

Visual.prototype.loadGraphByHash = function(hash) {
	$('#frontend').hide();
	$('#textcontainer').hide();
	$('#surveymenu').hide();
	$('#graphcontent').show();

	var s = hash.split(this.visualizer.sepchar);
	var filename = 'assets/data/' + s[0] + '.json';
	this.visualizer.loadData(filename, s[1]);

};

