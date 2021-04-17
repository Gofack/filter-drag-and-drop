'use strict';

document.addEventListener('DOMContentLoaded', function () {
	var dropInput = new DropInput(5000000);
	dropInput.init();
});

class DropInput {
	constructor(fileSize, inputId, inputClass, inputPlaceholder) {
		this.fileSize = fileSize ? fileSize : 10000000;
		this.inputId = inputId ? inputId : '';
		this.inputClass = inputClass ? inputClass : '';
		this.inputPlaceholder = inputPlaceholder ? inputPlaceholder : '';
	}
	init() {
		this.inputId ? dropContainer.children[1].setAttribute('id', this.inputId) : '';
		this.inputClass ? dropContainer.children[1].setAttribute('class', this.inputClass) : '';
		this.inputPlaceholder ? dropContainer.children[1].setAttribute('placeholder', this.inputPlaceholder) : '';

		var that = this;
		var messageField = document.querySelector('.message');
		this.inputPlaceholder ? messageField.innerText = this.inputPlaceholder : '';

		var dropContainer = document.getElementById('dropContainer');
		if (dropContainer) {
			var fileInput = dropContainer.children[1];
			var customSize = this.fileSize;

			dropContainer.ondragover = dropContainer.ondragenter = function (evt) {
				evt.preventDefault();
			};

			dropContainer.addEventListener('click', function () {
				fileInput.click();
			});

			fileInput.addEventListener('change', function (evt) {
				var size = evt.target.files[0].size;
				var type = evt.target.files[0].type;
				var filename = evt.target.files[0].name;
				var sizeCheck = that.checker(customSize, size, type, filename);
				var messageField = document.querySelector('.message');
				if (messageField) {
					messageField.innerText = sizeCheck;
				}

				that.handleDrop(evt);
			});

			dropContainer.addEventListener('drop', function (evt) {
				fileInput.files = evt.dataTransfer.files;

				const dT = new DataTransfer();
				dT.items.add(evt.dataTransfer.files[0]);
				fileInput.files = dT.files;

				var size = evt.dataTransfer.files[0].size;
				var type = evt.dataTransfer.files[0].type;
				var filename = evt.dataTransfer.files[0].name;
				var sizeCheck = that.checker(customSize, size, type, filename);

				if (messageField) {
					messageField.innerText = sizeCheck;
				}

				that.handleDrop(evt);

				evt.preventDefault();
			}, false);
		}
	}
	checker(customSize, size, format, filename) {
		dropContainer.classList = '';
		var message;
		if (size > 5000000) {
			message = 'Допустимый размер файла ' + customSize / 1000000 + 'Мб, выберите другой файл';
		} else if (format != 'application/vnd.ms-excel' && format != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
			message = 'Недопустимый тип файла ' + format + ', выберите другой файл';
			dropContainer.classList.add('darken');
		} else {
			message = 'Файл - ' + filename;
		}
		return message;
	}
	handleDrop(e) {
		e.stopPropagation();
		e.preventDefault();

		if(e.type == 'change') {
			var files = e.target.files,
			f = files[0];
		}
		else {
			var files = e.dataTransfer.files,
			f = files[0];
		}

		var reader = new FileReader();
		reader.onload = function (e) {
			var data = new Uint8Array(e.target.result);
			var workbook = XLSX.read(data, {
				type: 'array'
			});

			var strings = workbook.Strings;

			const request = new XMLHttpRequest();
			const url = "http://193.243.158.230:4500/api/import";
			var body = JSON.stringify({
				resultArray: strings
			});

			request.open("POST", url, true);
			request.setRequestHeader("Content-type", "application/json; charset=utf-8");
			request.setRequestHeader("Authorization", "test-task");

			request.addEventListener("readystatechange", function () {

				if (request.readyState === 4 && request.status === 200) {
					dropContainer.parentNode.setAttribute('data-array', body);
				}

			});
			request.send(body);
		};
		reader.readAsArrayBuffer(f);
	}
}