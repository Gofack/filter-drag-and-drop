'use strict';

document.addEventListener('DOMContentLoaded', function () {
	calendarInit()
	initQtyBtns();
}); // ready

window.addEventListener('resize', function () {}); // resize

window.addEventListener('load', function () {

}); // load

function calendarInit() {
	$('.datepicker').datepicker({
		dateFormat: "dd MM",
		monthNames: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
		dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
	});
}


function initQtyBtns() {
	var btnRemove = document.getElementsByClassName('qty-btn-remove');
	var btnAdd = document.getElementsByClassName('qty-btn-add');
	for (var i = 0; i < btnRemove.length; i++) {
		btnRemove[i].addEventListener('click', function (e) {
			e.preventDefault();
			var qtyParent = this.closest('.qty-wr');
			var input = qtyParent.children[1];
			var val = parseInt(input.value);

			if (val > 0) {
				val--;
				input.value = val;
				$(input).trigger('change');
			}

			if (val == 0) {
				this.classList.add('disabled');
			}
			qtyParent.children[2].classList.remove('disabled');
		});
	}

	for (var i = 0; i < btnAdd.length; i++) {
		var $inp = $(btnAdd[i]).closest('.qty-wr').find('input');
		var max = parseInt($inp.attr('max')) ? parseInt($inp.attr('max')) : 9999;
		var valinp = parseInt($inp.val());
		if (valinp === max) {
			btnAdd[i].classList.add('disabled');
		};
		btnAdd[i].addEventListener('click', function (e) {
			e.preventDefault();
			var qtyParent = this.closest('.qty-wr');
			var input = qtyParent.children[1];
			var val = parseInt(input.value);
			var max = parseInt($(input).attr('max')) ? parseInt($(input).attr('max')) : 9999;

			if (val < max) {
				val++;
				input.value = val;
				$(input).trigger('change');
			};

			if (val > 0) {
				qtyParent.children[0].classList.remove('disabled');
			}

			if (val === max) {
				qtyParent.children[2].classList.add('disabled');
			}

		});
	}
}