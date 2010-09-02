(function($) {
	/**
	 * @class elRTE command fullscreen
	 *
	 * Toggle editor between normal/fullscreen view
	 * @author Dmitry (dio) Levashov, dio@std42.ru
	 **/
	elRTE.prototype.commands.fullscreen = function(n) {
		var self   = this;
		this.name  = n;
		this.title = 'Full screen';
		/* view object */
		this.view = this.rte.view;
		/* editor node */
		this.editor = this.rte.view.editor;
		/* workzone node */
		this.wz = this.rte.view.workzone;
		/* workzone height */
		this.height = 0;
		/* difference between editor and workzone heights */
		this.delta = 0;
		/* editor fullscreen css class */
		this._class = 'elrte-fullscreen';
		
		/**
		 * remember height, delta and parents with position=relative 
		 *
		 **/
		this.bind = function() {
			var self = this, e = self.editor;
			
			this.rte.bind('load', function() {
				self._setState(self.STATE_ENABLE);
				self.height  = self.wz.height();
				self.delta   = e.outerHeight()-self.height;
			});
		}
		
		/**
		 * Update editor height on window resize in fullscreen view
		 *
		 **/
		function resize() {
			self.wz.height($(window).height()-self.delta);
			self.view.updateHeight();
		}

		/**
		 * Toggle between normal/fullscreen view
		 *
		 **/
		this._exec = function() {
			var w = $(window),
				e = this.editor,
				p = e.parents().filter(function(i, n) { return  !/^(html|body)$/i.test(n.nodeName) && $(n).css('position') == 'relative'; }),
				wz = this.wz,
				v = this.view,
				c = this._class,
				f = e.hasClass(c),
				rte = this.rte,
				s = this.rte.selection,
				a = $.browser.mozilla && this.rte.isWysiwyg() ? this.rte.active : false,
				b, h;
				
			function save() {
				if (a) {
					b = s.bookmark();
					h = a.get();
				}
			}
			
			function restore() {
				if (a) {
					// a.toggle().toggle().set(h, 'wysiwyg');
					a.editor.add(a.source).toggle();
					a.source[0].focus();
					a.editor.add(a.source).toggle();
					// a.set(h, 'wysiwyg')
					s.toBookmark([b[0].id, b[1].id]);
				}
			}
			
			save();	
			p.css('position', f ? 'relative' : 'static');
				
			if (f) {
				e.removeClass(c);
				wz.height(this.height)//.css('width', ''); //???
				w.unbind('resize', resize);
			} else {
				e.addClass(c).removeAttr('style');
				wz.height(w.height() - this.delta).css('width', '100%');
				w.bind('resize', resize);
			}
			
			v.updateHeight();
			v.resizable(f);
			restore();
			this._setState();
		}
		
		/**
		 * Return command state
		 *
		 * @return Number
		 **/
		this._getState = function() {
			return this.rte.view.editor.hasClass(this._class) ? this.STATE_ACTIVE : this.STATE_ENABLE;
		}
	}

})(jQuery);