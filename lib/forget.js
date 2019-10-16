const Gun = require('./require-gun');

;(function(){
	Gun.on('opt', function(root){
		once(root);
		this.to.next(root);
	});

	function once(root){
		if(root.once){ return }
		var forget = root.opt.forget = root.opt.forget || {};
		root.on('put', function(msg){
			Gun.graph.is(msg.put, function(node, soul){
				if(!Gun.obj.has(forget, soul)){ return }
				delete msg.put[soul];
			});
			this.to.next(msg);
		});
	}

}());
