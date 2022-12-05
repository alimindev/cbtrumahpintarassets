var _csrfKey;
var _csrfVal;

function setCsrf(val) {
	_csrfVal = val;
}

// datatable
var dataTable, dt_url, dt_extra;
var dt_init = document.getElementById("dt-init");

jQuery(function ($) {
	if(dt_init){
		const dt_default = {
			"processing": true,
			"serverSide": true,
			"scrollX": true,
			"ajax": {
				"url": dt_url,
				"type": "POST",
				'data': function (d) {
					d[_csrfKey] = _csrfVal;
				}
			},
			"order": [[ 0, "desc" ]],
		};
		const dt_config = Object.assign(dt_default, dt_extra);
		dataTable = $('#dt-init').DataTable(dt_config);
		dataTable.on('xhr.dt', function ( e, settings, json, xhr ) {
			if (!json) return;
			_csrfVal = json[_csrfKey];
		});
	}

	// jquery ajax global event handler
	$.ajaxSetup({
		beforeSend: (xhr, settings) => {
			let obj = Object.fromEntries(new URLSearchParams(settings.data));
			const cek_csrf = obj[_csrfKey] ?? false;
			if (!cek_csrf) {
				if (settings.data) {
					settings.data += `&${_csrfKey}=${_csrfVal}`;
				} else {
					settings.data = `${_csrfKey}=${_csrfVal}`;
				}
			}
		}
	});
	$(document).ajaxSuccess(function(event, xhr, settings) {
		if (xhr.getResponseHeader(_csrfKey)) {
			setCsrf(xhr.getResponseHeader(_csrfKey));
		}
		// loading(false);
	});
	// $(document).ajaxSend(function() {
	// 	loading();
	// });
	$( document ).ajaxError(function() {
		// getCsrf();
	});

	$('.number-only').on('input', function(e) {
		this.value = this.value.replace(/[^0-9\.]/g,'');
  })

});

function getCsrf() {
	let csrf = '';
	$.ajax({
		url: `${base_url}/get-csrf`,
		type: 'GET',
		async: false,
		dataType: 'json',
		success: function(res) {
			setCsrf(res.csrf);
			csrf = res.csrf;
		}
	});
	return csrf;
}

function reload_table(){
	setTimeout(function() {
		dataTable.ajax.reload(null,false);
	}, 50);
	return true;
}

function loading(status=true) {
	if (status) $(".load-screen").fadeIn("fast");
	else $(".load-screen").fadeOut("slow");
}

function logout() {
	localStorage.clear();
}

// image resize
function resizeImage (files, _width = 200, _height = 100, uploadHandler) {
  const uploadFile = files[0];
  const img = document.createElement('img');
  const canvas = document.createElement('canvas');
  const reader = new FileReader();

  reader.onload = function (e) {
    img.src = e.target.result
    img.onload = function () {
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const MAX_WIDTH = _width;
      const MAX_HEIGHT = _height;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(function (blob) {
        uploadHandler([new File([blob], uploadFile.name)])
      }, uploadFile.type, 1);
    }
  }

  reader.readAsDataURL(uploadFile);
}

// declare a request interceptor
// if (typeof axios !== 'undefined') {
//   const CancelToken = axios.CancelToken;
	
//   axios.interceptors.request.use(config => {
//     // perform a task before the request is sent
//     if ($('div').hasClass('init-modal-login')) {
//       return {
//         ...config,
//         cancelToken: new CancelToken((cancel) => {
//           $('#staticBackdrop').modal('show');
//           return cancel('relogin');
//         })
//       };
//     }

//     if (config.method === 'post') {
//       if (typeof config.data === 'undefined') config.data = {};
//       config.data[_csrfKey] = _csrfVal;
//     }
//     return config;
//   }, error => {
//     // handle the error
//     return Promise.reject(error);
//   });

//   axios.interceptors.response.use((response) => {
//     // do something with the response data
//     _csrfVal = response.data.csrf;
//     $('[name="'+_csrfKey+'"]').val(response.data.csrf);
//     return response;
//   }, error => {
//     // handle the response error
//     return Promise.reject(error);
//   });
// }

// // preview image
// function previewImages() {
//   var preview = document.querySelector('#preview');
//   preview.innerHTML = '';
//   if (this.files) {
//     [].forEach.call(this.files, readAndPreview);
//   }
//   function readAndPreview(file) {
//     // Make sure `file.name` matches our extensions criteria
//     if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
//       return alert(file.name + " is not an image");
//     } // else...
//     var reader = new FileReader();
//     reader.addEventListener("load", function () {
//       var image = new Image();
//       image.height = 100;
//       image.title = file.name;
//       image.src = this.result;
//       preview.appendChild(image);
//     });
//     reader.readAsDataURL(file);
//   }
// }
// var _fileInput = document.querySelector('#file-input');
// if (_fileInput) _fileInput.addEventListener("change", previewImages);

// function formatRupiah(angka, prefix){
// 	var number_string = angka.replace(/[^,\d]/g, '').toString(),
// 	split   		= number_string.split(','),
// 	sisa     		= split[0].length % 3,
// 	rupiah     		= split[0].substr(0, sisa),
// 	ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);
 
// 	// tambahkan titik jika yang di input sudah menjadi angka ribuan
// 	if(ribuan){
// 		separator = sisa ? '.' : '';
// 		rupiah += separator + ribuan.join('.');
// 	}
 
// 	rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
// 	return prefix == undefined ? rupiah : (rupiah ? 'Rp ' + rupiah : '');
// }

// // definition (untuk load js setelah src loaded)
// function loadScript(scriptUrl) {
//   const script = document.createElement('script');
//   script.src = scriptUrl;
//   document.body.appendChild(script);
//   return new Promise((res, rej) => {
//     script.onload = function () {
//       res();
//     }
//     script.onerror = function () {
//       rej();
//     }
//   });
// }
// // use
// loadScript("link js 1")
//   .then(() => {
//     loadScript("link js 2")
//     console.log('Script loaded!');
//   })
//   .catch(() => {
//     console.error('Script loading failed! Handle this error');
//   });