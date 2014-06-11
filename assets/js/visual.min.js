function Visual(opts) {
	this.opts = opts == null ?  opts : {};
	this.visualizer = new Visualizer(null, '#displayopts', ',').onPageLoad();
}

var visual = new Visual();

$(function(){
	visual.onMenuItemClick();
	if (document.location.hash != '') {
		visual.loadByHash(document.location.hash.split('#').pop());
	} else {
		$('._nv_graphs').first().trigger('click');
	}
});

Visual.prototype.onMenuItemClick = function() {
	var me = this;
	$(document).on('click', '._nv_graphs', function(ev){
		ev.preventDefault();
		var hash = this.href.split('#').pop();
		document.location.hash = hash;
		me.loadByHash(hash);
	});
}

Visual.prototype.loadByHash = function(hash) {
	var s = hash.split(this.visualizer.sepchar);
	var filename = 'data/' + s[0] + '.json';
	this.visualizer.loadData(filename);
};

