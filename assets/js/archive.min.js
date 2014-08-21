function Archieve(parent) {
	this.visualizer = parent.visualizer;
}


Archieve.prototype.loadArchieve = function() {
	var filename = 'assets/data/listing.json';

	d3.json(filename, function(data) {

		var selectbox = createElement({ element: 'select', id: 'selectfile' });

		for (var ky in data) {
			var lst = data[ky];
			var optgroup = createElement({ element: 'optgroup', attr: { label: ky }});

			for (var k in lst) {
				var file = lst[k]
				var opt = createElement( {
					element: 'option', text: file[0],
					attr: { value: 'assets/data/' + file[1] + '.json' },
				});
				$(optgroup).append(opt)
			}
			$(selectbox).append(optgroup);
		}
		$('#surveymenu').append(selectbox);
		$(selectbox).select2();
	});
	return this;
};

Archieve.prototype.onSelectChange = function() {
	var me = this;
	$(document).on('change', '#selectfile', function(ev){
		ev.preventDefault();
		me.visualizer.loadData($('#selectfile option:selected').val());
	});
	return this;
};

