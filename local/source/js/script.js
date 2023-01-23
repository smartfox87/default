// полифилл для получения свойства name у функции в старых браузерах < IE11
if ('name' in Function.prototype === false) {
	Object.defineProperty(Function.prototype, 'name', {
		get: function () {
			var matches = this.toString().match(/^\s*function\s*(\S[^\(]*)\s*\(/);
			var name = matches && matches.length > 1 ? matches[1] : '';
			Object.defineProperty(this, 'name', {value: name});
			return name;
		}
	});
}
if (window.jQuery) {
	const View = new (function () {
		// внутренние переменные
		const body = $(document.body);
		const htmlbody = $([document.documentElement, document.body]);
		const win = $(window);
		const doc = $(document)

		// внешние переменные
		// проверка на мобильное устройство (true/false)
		this.checkAdaptiveBrowser = (function () {
			let check = false;
			(function (a) {
				if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
			})(navigator.userAgent || navigator.vendor || window.opera);
			return check;
		})();
		this.isIE = (function detectIE() {
			var ua = window.navigator.userAgent;

			var msie = ua.indexOf('MSIE ');
			if (msie > 0) return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);

			var trident = ua.indexOf('Trident/');
			if (trident > 0) {
				var rv = ua.indexOf('rv:');
				return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
			}

			var edge = ua.indexOf('Edge/');
			if (edge > 0) return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);

			return false;
		})();
		this.isIOS = parseInt(('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ''])[1]).replace('undefined', '3_2').replace('_', '.').replace('_', '')) || false;

		this.screenSizeIsAdaptive = null;
		// проверка устройства десктоп или адатив
		this.mobileAndTabletCheck = null;
		// проверка наличия скроллбара у окна браузера
		this.winHaveScroll = null;
		// ширина скроллбара у окна браузера
		this.scrollBarWidth = null;
		// длительность анимации эффектов переключения всех переключающихся блоков
		this.animateDuration = 200
		// breakpoints
		this.breakpoints = {
			'lgMax': 1400,
			'lgMin': 1367,
			'mdMax': 1366,
			'mdMin': 1025,
			'smMax': 1024,
			'smMin': 768,
			'xsMax': 767,
			'xsMin': 320,
		}
		// спиннер при ожидании загрузки контента
		this.imageLoaderBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTBweCIgaGVpZ2h0PSI1MHB4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCIgY2xhc3M9Imxkcy1kb3VibGUtcmluZyIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDApIG5vbmUgcmVwZWF0IHNjcm9sbCAwJSAwJTsiPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIG5nLWF0dHItcj0ie3tjb25maWcucmFkaXVzfX0iIG5nLWF0dHItc3Ryb2tlLXdpZHRoPSJ7e2NvbmZpZy53aWR0aH19IiBuZy1hdHRyLXN0cm9rZT0ie3tjb25maWcuYzF9fSIgbmctYXR0ci1zdHJva2UtZGFzaGFycmF5PSJ7e2NvbmZpZy5kYXNoYXJyYXl9fSIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiByPSI0MCIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2U9IiM5M2RiZTkiIHN0cm9rZS1kYXNoYXJyYXk9IjYyLjgzMTg1MzA3MTc5NTg2IDYyLjgzMTg1MzA3MTc5NTg2IiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgY2FsY01vZGU9ImxpbmVhciIgdmFsdWVzPSIwIDUwIDUwOzM2MCA1MCA1MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49IjBzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PC9hbmltYXRlVHJhbnNmb3JtPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIG5nLWF0dHItcj0ie3tjb25maWcucmFkaXVzMn19IiBuZy1hdHRyLXN0cm9rZS13aWR0aD0ie3tjb25maWcud2lkdGh9fSIgbmctYXR0ci1zdHJva2U9Int7Y29uZmlnLmMyfX0iIG5nLWF0dHItc3Ryb2tlLWRhc2hhcnJheT0ie3tjb25maWcuZGFzaGFycmF5Mn19IiBuZy1hdHRyLXN0cm9rZS1kYXNob2Zmc2V0PSJ7e2NvbmZpZy5kYXNob2Zmc2V0Mn19IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHI9IjMzIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZT0iIzY4OWNjNSIgc3Ryb2tlLWRhc2hhcnJheT0iNTEuODM2Mjc4Nzg0MjMxNTkgNTEuODM2Mjc4Nzg0MjMxNTkiIHN0cm9rZS1kYXNob2Zmc2V0PSI1MS44MzYyNzg3ODQyMzE1OSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGNhbGNNb2RlPSJsaW5lYXIiIHZhbHVlcz0iMCA1MCA1MDstMzYwIDUwIDUwIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGVUcmFuc2Zvcm0+PC9jaXJjbGU+PC9zdmc+'
		this.setCookie = function (name, value, options) {
			options = options || {};

			var expires = options.expires;

			if (typeof expires == 'number' && expires) {
				var d = new Date();
				d.setTime(d.getTime() + expires * 1000);
				expires = options.expires = d;
			}
			if (expires && expires.toUTCString) {
				options.expires = expires.toUTCString();
			}

			value = encodeURIComponent(value);

			var updatedCookie = name + '=' + value;

			for (var propName in options) {
				updatedCookie += '; ' + propName;
				var propValue = options[propName];
				if (propValue !== true) {
					updatedCookie += '=' + propValue;
				}
			}

			document.cookie = updatedCookie;
		};
		// добавление на страницу отложенной загрузки внешнего скрипта
		this.loadDelayScript = function (url) {
			const script = $(document.createElement('script'))
			script.attr({src: url, type: 'text/javascript'})
			body.append(script)
		}
		// проверка расстояние до видимости блока больше или меншье указнного (при скролле страницы)
		this.getVisibleElemOnScroll = (elemJQ, reserveHeight) => {
			if (elemJQ.length > 0) {
				return elemJQ.offset().top - (doc.scrollTop() + win.height() + reserveHeight) < 0
			}
			return false
		}
		// инициализация всех яндекс карт на сайте
		this.initMaps = function () {
			ymaps.ready(function () {
				const mapSingleAuthorsSelector = document.getElementById('ymaps-single-author')
				if (mapSingleAuthorsSelector != null) {
					const mapAuthor = new ymaps.Map(mapSingleAuthorsSelector, {
						center: [38.563013, 68.810380],
						controls: ['geolocationControl', 'fullscreenControl'],
						zoom: 14,
					}, {
						searchControlProvider: 'yandex#search'
					})
					const dushanbeAini = new ymaps.Placemark([38.563013, 68.810380], {
						balloonContentBody: 'Эдуард',
						balloonContentFooter: 'г. Душанбе, ул. Айни',
						hintContent: 'г. Душанбе, ул. Айни'
					}, {  // Опции.
						preset: 'islands#circleDotIcon',
					})
					mapAuthor.geoObjects.add(dushanbeAini)
				}
				const mapAllAuthorsSelector = document.getElementById('ymaps-all-authors')
				if (mapAllAuthorsSelector != null) {
					const mapAllAuthors = new ymaps.Map(mapAllAuthorsSelector, {
						center: [55.79, 37.64],
						controls: ['geolocationControl', 'fullscreenControl'],
						zoom: 10,
					}, {
						searchControlProvider: 'yandex#search'
					})
					const objectManager = new ymaps.ObjectManager({
						// Чтобы метки начали кластеризоваться, выставляем опцию.
						clusterize: true,
						// ObjectManager принимает те же опции, что и кластеризатор.
						gridSize: 32,
						clusterDisableClickZoom: true
					})
					// Чтобы задать опции одиночным объектам и кластерам,
					// обратимся к дочерним коллекциям ObjectManager.
					objectManager.objects.options.set('preset', 'islands#blueDotIcon');
					objectManager.clusters.options.set('preset', 'islands#blueClusterIcons');
					// Загружаем GeoJSON файл с описанием объектов.
					$.getJSON('ajax/data.json')
						.done(function (geoJson) {
							// Добавляем описание объектов в формате JSON в менеджер объектов.
							objectManager.add(geoJson);
							// Добавляем объекты на карту.
							mapAllAuthors.geoObjects.add(objectManager);
						});
				}
				const mapAllTerminal = document.getElementById('ymaps-all-terminal')
				if (mapAllTerminal != null) {
					const mapAllAuthors = new ymaps.Map(mapAllTerminal, {
						center: [55.79, 37.64],
						controls: ['geolocationControl', 'fullscreenControl'],
						zoom: 11,
					}, {
						searchControlProvider: 'yandex#search'
					})
					const objectManager = new ymaps.ObjectManager({
						// Чтобы метки начали кластеризоваться, выставляем опцию.
						clusterize: true,
						// ObjectManager принимает те же опции, что и кластеризатор.
						gridSize: 32,
						clusterDisableClickZoom: true
					})
					// Чтобы задать опции одиночным объектам и кластерам,
					// обратимся к дочерним коллекциям ObjectManager.
					objectManager.objects.options.set('preset', 'islands#blueDotIcon');
					objectManager.clusters.options.set('preset', 'islands#blueClusterIcons');
					// Загружаем GeoJSON файл с описанием объектов.
					$.getJSON('ajax/data.json')
						.done(function (geoJson) {
							// Добавляем описание объектов в формате JSON в менеджер объектов.
							objectManager.add(geoJson);
							// Добавляем объекты на карту.
							mapAllAuthors.geoObjects.add(objectManager);
						});
				}
			})
		}
		// ajax подгрузка при наличии параметра data-ajax с адресом файла блоков, параметры - (url, контейнер для выгрузки данных, контейнер локальной переинициализации, callback)
		this.ajaxLoad = function (ajaxUrl, ajaxContainerForData, containerForReInit, callback) {
			if (!ajaxContainerForData.prop('ajaxLoaded')) {
				$.get(ajaxUrl, function (data, status) {
					ajaxContainerForData.append(data)
					if (containerForReInit) View.initAllLocal(containerForReInit)
					if (status === 'success') {
						ajaxContainerForData.prop('ajaxLoaded', true)
						if (typeof callback === 'function') callback()
					}
				})
			} else {
				if (typeof callback === 'function') callback()
			}
		}

		// инициализация основных параметров класса View
		this.initView = function () {
			this.scrollBarWidth = (function () {
				const outer = document.createElement('div');
				outer.style.visibility = 'hidden';
				outer.style.width = '100px';
				outer.style.msOverflowStyle = 'scrollbar';

				document.body.appendChild(outer);
				const widthNoScroll = outer.offsetWidth;
				// force scrollbars
				outer.style.overflow = 'scroll';
				// add innerdiv
				const inner = document.createElement('div');
				inner.style.width = '100%';
				outer.appendChild(inner);
				const widthWithScroll = inner.offsetWidth;
				// remove divs
				outer.parentNode.removeChild(outer);
				return widthNoScroll - widthWithScroll;
			})();
			(function haveScroll() {
				let timeout = null

				function winHaveScroll() {
					View.winHaveScroll = win.height() < doc.height()
				}

				win.off('resize.winHaveScroll').on('resize.winHaveScroll', function () {
					clearTimeout(timeout)
					timeout = setTimeout(winHaveScroll, 300)
				})
				win.trigger('resize.winHaveScroll');
			})();
			(function screenWidthIsAdaptive() {
				let timeout = null

				function getScreenWidth() {
					if (View.winHaveScroll) {
						View.screenSizeIsAdaptive = (win.width() + View.scrollBarWidth) <= 1024
					} else {
						View.screenSizeIsAdaptive = win.width() <= 1024
					}
				}

				win.off('resize.getScreenWidth').on('resize.getScreenWidth', function () {
					clearTimeout(timeout)
					timeout = setTimeout(getScreenWidth, 300)
				})
				getScreenWidth()
			})();
			(function setMobileAndTabletCheck() {
				let timeout = null

				function setAdaptiveCheck() {
					View.mobileAndTabletCheck = View.checkAdaptiveBrowser || View.screenSizeIsAdaptive
				}

				win.off('resize.setAdaptiveCheck').on('resize.setAdaptiveCheck', function () {
					clearTimeout(timeout)
					timeout = setTimeout(setAdaptiveCheck, 300)
				})
				setAdaptiveCheck()
			})();
		}
		// управление открытием/закрытием всех переключающихся блоков и состояний
		this.control = {
			closeAllDropdowns() {
				const allParents = $('.js-dropdown')
				const allContents = allParents.find('.js-dropdown__content')
				allParents.removeClass('active')
				allContents.hide()
			},
			closeAllFocusBlocks() {
				$('.js-class-focus').removeClass('focus')
			},
			closeAllSingleSelect() {
				const allParents = $('.js-dropdown--select')
				const allContents = allParents.find('.js-dropdown__content')
				if (View.mobileAndTabletCheck) {
					allParents.removeClass('active  open')
					allContents.fadeOut(0)
				}
			},
			closeVariablesSearch() {
				$('.js-search__wrapper').fadeOut(0)
				$('.js-search__content').fadeOut(0)
			},
			closeAllFadeBlocks() {
				const allParents = $('.js-fade')
				const allContents = allParents.find('.js-fade__content')
				allParents.removeClass('active-fade')
				allContents.fadeOut(0)
			},
			closeAllPopups() {
				const allParents = $('.js-popup')
				const allContents = allParents.find('.js-popup__content')
				allParents.removeClass('active-fade')
				allContents.fadeOut(0)
			},
			closeAllClassBlocks() {
				const allParents = $('.js-class').removeClass('active-class')
				allParents.find('.js-class__target').removeClass('active-class scroll-disabled')
			},
			closeAllAccordions() {
				const allParents = $('.js-accordion').removeClass('open')
				allParents.find('.js-accordion__content').slideUp(View.animateDuration)
			},
			closeOverlayPage() {
				body.removeClass('overlay  fixed-scroll').css({'padding-right': 0})
				$('.js-overlay').removeClass('overlay').find('.js-overlay__content').hide()
				// кастомизации отдельных элементов
				$('.js-fixed').css({right: 0})
			},
			// закрыть всё что открывается, за исключением переданного списка параметров указанных имен закрывашек
			closeAll(...arrExcludeFuncName) {
				const arrFunctions = [
					this.closeAllDropdowns,
					this.closeAllFadeBlocks,
					this.closeVariablesSearch,
					this.closeOverlayPage,
					this.closeAllSingleSelect,
					this.closeAllClassBlocks,
					this.closeAllAccordions,
				]
				// console.log(arrExcludeFuncName)
				const arrLog = []
				// перебор массива со всеми имеющимися функциями для управлени
				$.each(arrFunctions, function (index, fn) {
					// наполнение массива для отладки функциями и их состояниями запуска
					arrLog.push(arrExcludeFuncName.every((excludeFuncName) => fn.name !== excludeFuncName) + ' = ' + fn.name)

					// если в массиве полученных имен функций для исключения есть текущая функция из общего массива функций
					if (arrExcludeFuncName.every((excludeFuncName) => fn.name != excludeFuncName)) fn();
				});
				// console.log(arrLog)
				console.log('close all')
			},
		}

		// инициализация
		this.init = {
			// global - инициализируется 1 раз
			global: {
				// инициализация слайдеров
				initSliders() {
					if ($.fn.slick) {
						let timeout = null;
						const btnPrev = '<div class="slick-prev"><svg class="symbol  symbol-arrow-right--mid"><use xlink:href="img/sprite/sprite.svg#arrow-right--mid"></use></svg></div>'
						const btnNext = '<div class="slick-next"><svg class="symbol  symbol-arrow-right--mid"><use xlink:href="img/sprite/sprite.svg#arrow-right--mid"></use></svg></div>'

						function initSliders() {
							// карусели только для десктопа
							if (!View.mobileAndTabletCheck) {
								// карусель новых обЪявлений главной страницы на десктопе
								$('.js-carousel--1').not('.slick-initialized').each(function (ind) {
									const slider_1 = $(this)

									// настройки инициализации экземпляра слайдера
									function initSlider_1(slider_1) {
										if (!slider_1.hasClass('slick-initialized')) slider_1.slick({
											// swipeToSlide: true,
											waitForAnimate: false,
											infinite: true,
											variableWidth: true,
											// adaptiveHeight: true,
											slidesToShow: 6,
											slidesToScroll: 5,
											prevArrow: btnPrev,
											nextArrow: btnNext,
											responsive: [
												{breakpoint: 1235, settings: {slidesToShow: 5, slidesToScroll: 4,}},
												{breakpoint: 1025, settings: 'unslick',},
											],
										})
									}

									// инициализация экземпляра слайдера если он в пределах указанного растояния от видимой области
									if (View.getVisibleElemOnScroll(slider_1, 500)) initSlider_1(slider_1)
									win.off(`scroll.initSlider_1_${ind}`).on(`scroll.initSlider_1_${ind}`, function () {
										if (View.getVisibleElemOnScroll(slider_1, 500)) initSlider_1(slider_1)
									})
								})
							}
							// карусели только для адаптива
							else {
							}

							// мини карусель страницы карточки товара, увеличивающаяся на мобилке с засветленным слайдом
							const slider_4 = $('.js-carousel--4').not('.slick-initialized')

							// настройки инициализации экземпляра слайдера
							function initSlider_4(slider_4) {
								if (!slider_4.hasClass('slick-initialized')) slider_4.slick({
									swipeToSlide: true,
									waitForAnimate: false,
									infinite: true,
									variableWidth: true,
									adaptiveHeight: true,
									slidesToShow: 7,
									slidesToScroll: 6,
									prevArrow: btnPrev,
									nextArrow: btnNext,
									responsive: [
										{breakpoint: 1220, settings: {slidesToShow: 6, slidesToScroll: 5,}},
										{breakpoint: 1060, settings: {slidesToShow: 5, slidesToScroll: 4,}},
										{breakpoint: 1025, settings: {slidesToShow: 4, slidesToScroll: 3,}},
										{breakpoint: 900, settings: {slidesToShow: 3, slidesToScroll: 2,}},
										{breakpoint: 601, settings: {slidesToShow: 2, slidesToScroll: 1,}},
										{breakpoint: 591, settings: {slidesToShow: 2, arrows: false,}},
									],
								})
							}

							// мини карусель страницы карточки и списка товаров, на мобилке с засветленным слайдом
							const slider_5 = $('.js-carousel--5').not('.slick-initialized')
							// светлый оверлей на правом обрезанном слайде
							if (win.width() <= View.breakpoints.xsMax) {
								slider_5.off('init reInit swipe').on('init reInit swipe', function (event, slick) {
									slick.$slideTrack.children('.slick-active').removeClass('slick-slide--transparent').last().addClass('slick-slide--transparent')
								});
							}

							// настройки инициализации экземпляра слайдера
							function initSlider_5(slider_5) {
								if (!slider_5.hasClass('slick-initialized')) slider_5.slick({
									swipeToSlide: true,
									waitForAnimate: false,
									infinite: true,
									variableWidth: true,
									adaptiveHeight: true,
									slidesToShow: 7,
									slidesToScroll: 6,
									prevArrow: btnPrev,
									nextArrow: btnNext,
									responsive: [
										{breakpoint: 1220, settings: {slidesToShow: 6, slidesToScroll: 5,}},
										{breakpoint: 1060, settings: {slidesToShow: 5, slidesToScroll: 4,}},
										{breakpoint: 1025, settings: {slidesToShow: 4, slidesToScroll: 3,}},
										{breakpoint: 900, settings: {slidesToShow: 3, slidesToScroll: 2,}},
										{breakpoint: 768, settings: {slidesToShow: 6, slidesToScroll: 5, arrows: false,}},
										{breakpoint: 691, settings: {slidesToShow: 5, slidesToScroll: 4, arrows: false,}},
										{breakpoint: 557, settings: {slidesToShow: 4, slidesToScroll: 3, arrows: false,}},
										{breakpoint: 424, settings: {slidesToShow: 3, slidesToScroll: 2, arrows: false,}},
									],
								})
							}

							// инициализация экземпляра слайдера если он в пределах указанного растояния от видимой области
							if (View.getVisibleElemOnScroll(slider_4, 500)) initSlider_4(slider_4)
							if (View.getVisibleElemOnScroll(slider_5, 500)) initSlider_5(slider_5)
							win.off('scroll.initSliders').on('scroll.initSliders', function () {
								if (View.getVisibleElemOnScroll(slider_4, 500)) initSlider_4(slider_4)
								if (View.getVisibleElemOnScroll(slider_5, 500)) initSlider_5(slider_5)
							})
						}

						win.off('resize.initSliders').on('resize.initSliders', function () {
							clearTimeout(timeout);
							timeout = setTimeout(initSliders, 300);
						})

						win.trigger('resize.initSliders');
					}
					if (Swiper) {
						if (View.mobileAndTabletCheck) {
							// объект опций для мини-слайдеров категорий на адаптиве главной страницы
							const settingSlider_6 = {
								freeMode: true,
								freeModeSticky: true,
								slidesPerView: 'auto',
								on: {
									init: function () {
										// добаления класса для проверки инициализации
										$(this.$el).addClass('swiper-init')
										// подгрузка изображений в слайдах
										$(this.slides).find('.js-lazy--swiper').each(function () {
											$(this).attr('src', $(this).data('src'))
										})
									},
									slidePrevTransitionEnd: function () {
										// добаления класса когда слайдер дошел до конца
										$(this.$el).removeClass('swiper-end')
									},
									reachEnd: function () {
										// удаление класса когда возврат на спредыдусчий слайд
										$(this.$el).addClass('swiper-end')
									},
								}
							}

							// инициализация слайдера если он в зоне видимости или приближается к ней (ближе 500рх) и до сих пор не инициализирован
							function initSwiper(selector) {
								if (View.getVisibleElemOnScroll($(selector), 500) && !$(selector).hasClass('swiper-init')) new Swiper(selector, settingSlider_6)
							}

							initSwiper('.js-carousel--6_1')
							initSwiper('.js-carousel--6_2')
							initSwiper('.js-carousel--6_3')
							initSwiper('.js-carousel--6_4')

							win.off('scroll.initSwiper').on('scroll.initSwiper', function () {
								initSwiper('.js-carousel--6_1')
								initSwiper('.js-carousel--6_2')
								initSwiper('.js-carousel--6_3')
								initSwiper('.js-carousel--6_4')
							})
						}
					}
				},
				// отложенная загрузка изображений
				initLazyLoad() {
					let timeout = null;

					function initLazyLoad() {
						if ($.fn.Lazy) {
							const lazyImages = $('.js-lazy')
							lazyImages.Lazy({
								visibleOnly: true,
								effect: 'fadeIn',
								threshold: 250,
								placeholder: View.imageLoaderBase64,
								beforeLoad: (element) => {
									element.css({backgroundPosition: 'center', backgroundRepeat: 'no-repeat'})
									if (View.isIE && element[0].tagName === 'PICTURE') {
										setTimeout(function () {
											picturefill({elements: lazyImages.find('img')})
										}, 50)
									}
								},
							})
							const lazyImagesNoBg = $('.js-lazy--nobg')
							lazyImagesNoBg.Lazy({
								visibleOnly: true,
								effect: 'fadeIn',
								threshold: 250,
								placeholder: View.imageLoaderBase64,
								beforeLoad: (element) => {
									element.css({backgroundPosition: 'center', backgroundRepeat: 'no-repeat'})
									if (View.isIE && element[0].tagName === 'PICTURE') {
										setTimeout(function () {
											picturefill({elements: lazyImagesNoBg.find('img')})
										}, 50)
									}
								},
								afterLoad: (element) => {
									element.css({backgroundImage: 'none'})
								},
							})
						}
					}

					win.off('resize.initLazyLoad').on('resize.initLazyLoad', function () {
						clearTimeout(timeout);
						timeout = setTimeout(initLazyLoad, 300);
					})

					win.trigger('resize.initLazyLoad');
				},
				// фиксация блока при скролле страницы
				fixElemForScroll() {
					$('.js-fixed').each(function (index) {
						const elem = $(this)
						const elemPosTopStart = elem.offset().top - 15
						const elemPosTopEnd = elem.offset().top + elem.outerHeight()

						function fixElemForScroll() {
							if (!View.mobileAndTabletCheck) {
								const docScroll = doc.scrollTop()
								if (elemPosTopEnd < docScroll) {
									elem.addClass('fixed')
									body.css('padding-top', elem.outerHeight())
								} else if (elemPosTopStart > docScroll) {
									elem.removeClass('fixed')
									body.css('padding-top', 0)
								}
							}
						}

						win.off(`scroll.fixElemForScroll_${index}`).on(`scroll.fixElemForScroll_${index}`, fixElemForScroll)

						win.on('load', function () {
							win.trigger(`scroll.fixElemForScroll_${index}`);
						})
					})
				},
				// показать варианты поиска при вводе запроса в строку поиска в шапке
				showVariablesSearch() {
					let timeout = null;

					function showVariablesSearch() {
						$('.js-search').each(function () {
							const parent = $(this)
							const parentPosLeft = parent.offset().left
							const parentPosRight = $(document).width() - parentPosLeft - parent.outerWidth()
							const content = parent.find('.js-search__content')
							const bg = parent.find('.js-search__bg')
							const wrapper = parent.find('.js-search__wrapper')
							// параметры ajax подгрузки
							const ajaxUrl = parent.data('ajax') || false
							parent.off('keyup.showVariablesSearch').on('keyup.showVariablesSearch', '.js-search__input', function (event) {
								let inputValLength = $(this).val().length

								function showVariablesSearch() {
									if (event.keyCode === 27) {
										$(this).val('')
										content.fadeOut(0)
										wrapper.fadeOut(0)
										View.control.closeAllFocusBlocks()
									} else if (inputValLength > 5) {
										wrapper.css({left: -parentPosLeft, right: -parentPosRight}).fadeIn(0)
										content.css({marginLeft: parentPosLeft, marginRight: parentPosRight}).fadeIn(View.animateDuration)
										// кастомизации отдельных элементов
										if (win.width() < 600) body.addClass('overlay  fixed-scroll')
									} else if (inputValLength <= 5) {
										content.fadeOut(0)
										wrapper.fadeOut(0)
									}
								}

								// ajax подгрузка при наличии параметра data-ajax с адресом файла
								if (ajaxUrl) {
									View.ajaxLoad(ajaxUrl, content, content, showVariablesSearch)
								} else {
									showVariablesSearch()
								}
							})
							parent.on('click.showVariablesSearch', '.js-search__input', function (event) {
								event.stopPropagation()
							})
							content.click((event) => event.stopPropagation())
						})
					}

					win.off('resize.showVariablesSearch').on('resize.showVariablesSearch', function () {
						clearTimeout(timeout);
						timeout = setTimeout(showVariablesSearch, 300);
					})

					win.trigger('resize.showVariablesSearch');
				},
				// перключение класса по фокусу
				toggleClassBlockInFocus() {
					$('.js-class-focus').each(function () {
						const parent = $(this)
						parent.click((event) => event.stopPropagation())
						parent.find('.js-class-focus__link').off('focus.toggleClassFocus').on('focus.toggleClassFocus', function (event) {
							View.control.closeAll('closeAllClassBlocks');
							parent.addClass('focus')
						})
					})
				},
				// задать ширину блока с учетом ширины скролла десктопа
				setWidthWithoutScroll() {
					let timeout = null

					function setWidthWithoutScroll() {
						if (!View.mobileAndTabletCheck) {
							$('.js-width-without-scroll').width(doc.width() - View.scrollBarWidth)
						}
					}

					win.off('resize.setWidthWithoutScroll').on('resize.setWidthWithoutScroll', function () {
						clearTimeout(timeout)
						timeout = setTimeout(setWidthWithoutScroll, 300)
					})
					win.trigger('resize.setWidthWithoutScroll');
				},
				// отложенная инициализация яндекс карт по скроллу
				initMapsDelayScroll() {
					const maps = $('.js-map')
					let checkInitedMaps = false

					if (maps.length > 0) {
						if (View.getVisibleElemOnScroll(maps, 500)) {
							initMaps()
						}

						function initMaps() {
							if (!checkInitedMaps) {
								View.loadDelayScript('https://api-maps.yandex.ru/2.1/?lang=ru_RU&onLoad=View.initMaps')
								checkInitedMaps = true
							}
						}

						win.off('scroll.initMapsScroll').on('scroll.initMapsScroll', function () {
							if (View.getVisibleElemOnScroll(maps, 500)) {
								initMaps()
							}
						})
					}
				},
				// фильтрация элементов по тексту из строки поиска
				liveSearchFilter() {
					// ввод в поле поиска
					doc.off('keyup.liveSearchFilter').on('keyup.liveSearchFilter', '.js-search-filter__input', function (event) {
						let searchText = $.trim($(this).val()).toLowerCase()
						// элементы для фильтрации
						$(this).closest('.js-search-filter').find('.js-search-filter__item').each(function () {
							// если подстрока из поиска не найдена в элементе прячем его
							if (~$(this).text().toLowerCase().indexOf(searchText)) {
								$(this).show()
							} else {
								$(this).hide()
							}
						})
					})
				},
				// закрыть все что открывается по клику на странице и при ее ресайзе
				closeAll() {
					body.off('click.closeAll').on('click.closeAll', function (e) {
						console.log(e.target)
						View.control.closeAll('closeOverlayPage');
					});
					win.off('resize.closeAll').on('resize.closeAll', function () {
						if (!View.mobileAndTabletCheck) View.control.closeAll();
					});
				},
			},
			// local - требует переинициализации после перезагрузки DOM
			local: {
				// toggleViewport() {
				//   // переключение с мобильной на десктопную версию по клюку на кнопку
				//   $('.js-viewport-toggle').off('click.viewportToggle').on('click.viewportToggle', function () {
				//     const btn = $(this);
				//     const viewport = $('#viewport');
				//     let dataViewport = btn.attr('data-viewport');
				//
				//     if (dataViewport === 'mobile') {
				//       viewport.attr('content', 'width=1024,user-scalable=yes');
				//       btn.attr('data-viewport', 'desktop');
				//       View.setCookie('viewport', 'width=1024,user-scalable=yes');
				//       View.setCookie('is-desktop', false);
				//     }
				//     else {
				//       viewport.attr('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
				//       btn.attr('data-viewport', 'mobile');
				//       View.setCookie('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
				//       View.setCookie('is-desktop', true);
				//     }
				//   })
				// },
				// инициализация слайдеров
				initSliders(scope) {
					if ($.fn.slick) {
						let timeout = null;
						const btnPrev = '<div class="slick-prev"><svg class="symbol  symbol-arrow-right--mid"><use xlink:href="img/sprite/sprite.svg#arrow-right--mid"></use></svg></div>'
						const btnNext = '<div class="slick-next"><svg class="symbol  symbol-arrow-right--mid"><use xlink:href="img/sprite/sprite.svg#arrow-right--mid"></use></svg></div>'

						function initSliders() {
							// карусели только для десктопа
							if (!View.mobileAndTabletCheck) {
								// карусель вертикальной навигации главного слайдера карточки товара на десктопе
								scope.find('.js-carousel--2').not('.slick-initialized').slick({
									swipeToSlide: true,
									waitForAnimate: false,
									infinite: false,
									vertical: true,
									verticalSwiping: true,
									slidesToShow: 4,
									asNavFor: '.js-carousel--3',
									focusOnSelect: true,
									prevArrow: btnPrev,
									nextArrow: btnNext,
									responsive: [
										{
											breakpoint: View.breakpoints.smMax + 1,
											settings: 'unslick'
										}
									],
								})
							}

							// главный слайдер на детальной товара
							scope.find('.js-carousel--3').not('.slick-initialized').slick({
								swipeToSlide: true,
								waitForAnimate: false,
								infinite: false,
								arrows: false,
								fade: true,
								asNavFor: '.js-carousel--2',
								responsive: [
									{
										breakpoint: View.breakpoints.smMax + 1,
										settings: {
											asNavFor: '',
											arrows: true,
											dots: true,
											fade: false,
											prevArrow: btnPrev,
											nextArrow: btnNext,
										}
									}
								],
							})

							// слайдер страницы списков товаров на десктопе
							scope.find('.js-carousel--7').not('.slick-initialized').each(function (ind) {
								const slider_7 = $(this)

								// настройки инициализации экземпляра слайдера
								function initSlider_7(slider_7) {
									if (!slider_7.hasClass('slick-initialized')) slider_7.slick({
										swipeToSlide: true,
										waitForAnimate: false,
										infinite: false,
										prevArrow: btnPrev,
										nextArrow: btnNext,
									})
								}

								// инициализация экземпляра слайдера если он в пределах указанного растояния от видимой области
								if (View.getVisibleElemOnScroll(slider_7, 500)) initSlider_7(slider_7)
								win.off(`scroll.initSlider_7_${ind}`).on(`scroll.initSlider_7_${ind}`, function () {
									if (View.getVisibleElemOnScroll(slider_7, 500)) initSlider_7(slider_7)
								})
							})
						}

						win.off('resize.initSliders').on('resize.initSliders', function () {
							clearTimeout(timeout);
							timeout = setTimeout(initSliders, 300);
						})

						win.trigger('resize.initSliders');
					}
				},
				// переключение скрытого блока по кнопке
				toggleFadeBlock(scope) {
					scope.find('.js-fade').each(function () {
						const parent = $(this)
						// id родителя для связи с элементами при наличии вложенности нескольких идентичных конструкций
						const parentId = parent.data('fadeId')
						let link = null
						let content = null
						// установа перемнных в зависимости от наличия id родителя для связи с элементами
						if (parentId) {
							link = parent.find(`.js-fade__link[data-fade-id="${parentId}"]`)
							content = parent.find(`.js-fade__content[data-fade-id="${parentId}"]`)
						} else {
							link = parent.find('.js-fade__link')
							content = parent.find('.js-fade__content')
						}
						content.fadeOut(0).click((e) => e.stopPropagation())
						// параметр указывающий на наличие яндекс карты внутри блока
						const innerMap = link.data('map')
						let checkInitedMaps = false

						function initMaps() {
							if (!checkInitedMaps) {
								View.loadDelayScript('https://api-maps.yandex.ru/2.1/?lang=ru_RU&onLoad=View.initMaps')
								checkInitedMaps = true
							}
						}

						// параметры ajax подгрузки
						const ajaxUrl = parent.data('ajax') || false
						link.off('click.toggleFadeContent').on('click.toggleFadeContent', function (event) {
							event.stopPropagation()
							event.preventDefault()
							const link = $(this)
							// инициализация яндекс карты по открытию блока
							if (innerMap) initMaps()
							// исключает указанные на линке в атрибуте data-exclude типы элементов из закрытия
							const excludeCloseAll = (typeof link.data('exclude') === 'string') ? link.data('exclude').split(',') : ''

							function toggleFade() {
								if (!parent.hasClass('active-fade')) {
									View.control.closeAll(...excludeCloseAll);
									parent.addClass('active-fade')
									content.fadeIn(View.animateDuration)
								} else {
									parent.removeClass('active-fade')
									content.fadeOut(View.animateDuration)
								}
							}

							// ajax подгрузка при наличии параметра data-ajax с адресом файла
							if (ajaxUrl) {
								View.ajaxLoad(ajaxUrl, content, content, toggleFade)
							} else {
								toggleFade()
							}

							// кастомизации отдельных элементов
							if (View.mobileAndTabletCheck && parent.hasClass('menu-product')) {
								if (parent.hasClass('active-fade')) {
									body.addClass('fixed-scroll')
									parent.find('.menu-product__content').removeClass('scroll-disabled')
								}
							}
						})
					})
				},
				// одноуровневые выпадающие селекты
				toggleSelect(scope) {
					const allParents = scope.find('.js-dropdown--select')
					let timeout = null

					function toggleSelect() {
						if (!View.mobileAndTabletCheck) {
							allParents.each(function () {
								const parent = $(this)
								const link = parent.find('.js-dropdown__link')
								const input = parent.find('.js-dropdown__value')
								const content = parent.find('.js-dropdown__content')
								const listItems = parent.find('li')

								content.fadeOut(0).css({visibility: 'visible'})
								// открытие по ховеру
								parent.off('mouseenter.toggleSelect').on('mouseenter.toggleSelect', function () {
									if (!parent.hasClass('active')) View.control.closeAll();
									content.fadeIn(View.animateDuration)
									parent.addClass('active')
								})
								parent.off('mouseleave.toggleSelect').on('mouseleave.toggleSelect', function () {
									content.fadeOut(View.animateDuration)
									parent.removeClass('active')
								})
								// клик для выбора елемента
								listItems.children('span').off('click.setSelectOption').on('click.setSelectOption', function () {
									const listItem = $(this)
									content.fadeOut(View.animateDuration)
									parent.removeClass('active')
									link.addClass('selected').find('.js-dropdown__icon').html(listItem.find('.js-dropdown__icon').html())
									link.children('span:visible').text(listItem.text())
									parent.attr('data-value', $(this).attr('data-value'))
									input.val($(this).attr('data-value'))
									input.attr('value', $(this).html())
								})

							})
						} else {
							allParents.each(function () {
								const parent = $(this)
								const link = parent.find('.js-dropdown__link')
								const input = parent.find('.js-dropdown__value')
								const content = parent.find('.js-dropdown__content')
								const listItems = parent.find('li')
								content.fadeOut(0).css({visibility: 'visible'})
								// открытие по клику
								link.off('click.toggleSelect').on('click.toggleSelect', function (event) {
									event.stopPropagation()
									if (!parent.hasClass('active')) {
										View.control.closeAll()
										content.fadeIn(View.animateDuration)
										parent.addClass('active')
									} else {
										content.fadeOut(View.animateDuration)
										parent.removeClass('active')
									}
								})
								// клик для выбора елемента
								listItems.children('span').off('click.setSelectOption').on('click.setSelectOption', function (event) {
									event.stopPropagation()
									const listItem = $(this)
									content.fadeOut(View.animateDuration)
									parent.removeClass('active')
									link.addClass('selected').find('.js-dropdown__icon').html(listItem.find('.js-dropdown__icon').html())
									link.children('span:visible').text(listItem.text())
									parent.attr('data-value', $(this).attr('data-value'))
									input.val($(this).attr('data-value'))
									input.attr('value', $(this).html())
								})
							})
						}
					}

					win.off('resize.toggleSelect').on('resize.toggleSelect', function () {
						clearTimeout(timeout);
						timeout = setTimeout(toggleSelect, 300);
					})

					win.trigger('resize.toggleSelect');
				},
				// переключение попапа
				togglePopup(scope) {
					scope.find('.js-popup').each(function () {
						const parent = $(this)
						const content = parent.find('.js-popup__content')
						content.fadeOut(0)

						// параметры ajax подгрузки
						const ajaxUrl = parent.data('ajax') || false
						parent.find('.js-popup__toggler').off('click.togglePopup').on('click.togglePopup', function (event) {
							event.preventDefault()
							const toggler = $(this)
							// исключает указанные на линке в атрибуте data-exclude типы элементов из закрытия
							const excludeCloseAll = (typeof toggler.data('exclude') === 'string') ? toggler.data('exclude').split(',') : ''

							function togglePopup() {
								if (parent.hasClass('active-fade')) {
									parent.removeClass('active-fade')
									content.fadeOut(View.animateDuration)
								} else {
									View.control.closeAll('closeOverlayPage');
									parent.addClass('active-fade')
									content.fadeIn(View.animateDuration)
								}
							}

							// ajax подгрузка при наличии параметра data-ajax с адресом файла
							if (ajaxUrl) {
								View.ajaxLoad(ajaxUrl, content, parent, togglePopup)
							} else {
								togglePopup()
							}
						})
					})
				},
				// переключение класса по клику
				toggleClassBlock(scope) {
					let timeout = null;

					function toggleClassBlock() {
						scope.find('.js-class').each(function () {
							const parent = $(this)
							// id родителя для связи с элементами при наличии вложенности нескольких идентичных конструкций
							const parentId = parent.data('classId')
							let targetForClass = null
							let link = null
							// установа перемнных в зависимости от наличия id родителя для связи с элементами
							if (parentId) {
								targetForClass = parent.find(`.js-class__target[data-class-id="${parentId}"]`)
								link = parent.find(`.js-class__link[data-class-id="${parentId}"]`)
							} else {
								targetForClass = parent.find('.js-class__target')
								link = parent.find('.js-class__link')
							}
							parent.click((e) => e.stopPropagation())
							link.off('click.toggleClass').on('click.toggleClass', function (event) {
								event.stopPropagation()
								event.preventDefault()
								const link = $(this)
								// исключает указанные на линке в атрибуте data-exclude типы элементов из закрытия
								const excludeCloseAll = (typeof link.data('exclude') === 'string') ? link.data('exclude').split(',') : ''
								// параметры ajax подгрузки при наличии атрибута ajax
								const ajaxUrl = link.data('ajax') || false
								const ajaxContainerForData = parent.find('.js-ajax__content')
								if (!parent.hasClass('active-class')) {
									View.control.closeAll(...excludeCloseAll);
									parent.addClass('active-class')
									targetForClass.addClass('active-class')
									// ajax подгрузка при наличии параметра data-ajax с адресом файла
									if (ajaxUrl) View.ajaxLoad(ajaxUrl, ajaxContainerForData, parent)
									// кастомизации отдельных элементов
									if (View.mobileAndTabletCheck && link.hasClass('icon-nav__item')) {
										// lazyload
										setTimeout(function () {
											parent.find('.js-lazy--fade').Lazy({
												bind: 'event',
												effect: 'fadeIn',
												appendScroll: parent.find('.menu-product__category'),
												placeholder: View.imageLoaderBase64,
											})
										}, 100)
									}
									if (View.mobileAndTabletCheck && link.hasClass('hover-menu__link')) {
										parent.parents('.menu-product__category').addClass('scroll-disabled')
									}
								} else {
									parent.removeClass('active-class')
									targetForClass.removeClass('active-class')
									// кастомизации отдельных элементов
									if (View.mobileAndTabletCheck && link.hasClass('hover-menu__link')) {
										parent.parents('.menu-product__category').removeClass('scroll-disabled')
									}
								}
							})
						})
					}

					win.off('resize.toggleClassBlock').on('resize.toggleClassBlock', function () {
						clearTimeout(timeout);
						timeout = setTimeout(toggleClassBlock, 300);
					})

					win.trigger('resize.toggleClassBlock');
				},
				// меню с ховером на сабменю
				delayHoverMenu(scope) {
					let timeout = null;

					function delayHoverMenu() {
						const allParents = scope.find('.js-hover-menu')
						if (!View.mobileAndTabletCheck) {
							allParents.each(function () {
								const menu = $(this)
								const itemsParent = menu.children('.js-hover-menu__item')
								let nCurPosX; // текущее положение курсора
								menu.mousemove((event) => nCurPosX = event.clientX);
								itemsParent.each(function () {
									const curItem = $(this)
									curItem.children('span').click((e) => e.stopPropagation())
									const innerBlock = curItem.find('.js-hover-menu-child-wrap')
									// параметры ajax подгрузки при наличии атрибута ajax
									const ajaxUrl = curItem.data('ajax') || false
									const ajaxContainerForData = curItem.find('.js-ajax__content')
									curItem.off('mouseover.showInnerMenu').on('mouseover.showInnerMenu', function () {
										curItem.addClass('hover');
										// ajax подгрузка при наличии параметра data-ajax с адресом файла
										if (ajaxUrl) View.ajaxLoad(ajaxUrl, ajaxContainerForData, curItem)
										/* делаем задержку чтобы при случайном наведении на пункт подменю не показывалось */
										setTimeout(function () {
											/* если по истечению задержки мы все еще на том же пункт меню, значит показываем подменю */
											if (curItem.hasClass('hover')) {
												// инициализация картинок во внутреннем блоке
												innerBlock.find('.js-lazy--hover').each(function () {
													$(this).attr('src', $(this).data('src'))
												})
												curItem.addClass('active')
											}
										}, 300);
									});
									curItem.off('mouseout.hideInnerMenu').on('mouseout.hideInnerMenu', function () {
										let nPosXStart = nCurPosX
										curItem.removeClass('hover');
										/* делаем небольшую задержку чтобы определить направление движение курсора */
										setTimeout(function () {
											// если в сторону подменю, значит делаем большую задержку для возможности движения по диагонали
											if (nCurPosX - nPosXStart > 0) {
												setTimeout(function () {
													/* если по истечению задержки курсор находится на подменю или текущем пункте меню тогда не прячем подменю */
													if (!curItem.hasClass('hover')) {
														setTimeout(function () {
															curItem.removeClass('active');
														}, 300)
													}
												}, 300);
											} else if (!curItem.hasClass('hover')) {
												// если нет и мы ушли с текущего пункта меню, моментально скрываем подменю
												// innerBlock.fadeOut(0)
												setTimeout(function () {
													curItem.removeClass('active');
												}, 300)
											}
										}, 10);
									})
								})
							})
						} else {
							allParents.each(function () {
								const itemsParent = $(this).children('.js-hover-menu__item')
								itemsParent.each(function () {
									const curItem = $(this)
									curItem.off('mouseover.showInnerMenu')
									curItem.off('mouseout.hideInnerMenu')
								})
							})
						}
					}

					win.off('resize.delayHoverMenu').on('resize.delayHoverMenu', function () {
						clearTimeout(timeout);
						timeout = setTimeout(delayHoverMenu, 300);
					})

					win.trigger('resize.delayHoverMenu');
				},
				// переключение контента по табам
				toggleTabs(scope) {
					scope.find('.js-tabs').each(function () {
						const parent = $(this)
						// id родителя для связи с элементами при наличии вложенности нескольких идентичных конструкций
						const parentId = parent.data('tabsId')
						let links = null
						let tabs = null
						// установа перемнных в зависимости от наличия id родителя для связи с элементами
						if (parentId) {
							links = parent.find(`.js-tabs__link[data-tabs-id="${parentId}"]`)
							tabs = parent.find(`.js-tabs__tab[data-tabs-id="${parentId}"]`)
						} else {
							links = parent.find('.js-tabs__link')
							tabs = parent.find('.js-tabs__tab')
						}
						// активация предустановленной вкладки
						tabs.each(function () {
							if ($(this).hasClass('active-tab')) {
								$(this).fadeIn(View.animateDuration)
							} else {
								$(this).fadeOut(0)
							}
						})
						links.each(function (index) {
							const link = $(this)
							// параметры ajax подгрузки
							const ajaxUrl = tabs.eq(index).data('ajax') || false

							link.off('click.toggleTabs').on('click.toggleTabs', function (event) {
								event.stopPropagation()
								event.preventDefault()

								function toggleTabs() {
									links.not(link).removeClass('active-tab')
									const indexTab = link.addClass('active-tab').data('tabsItem')
									tabs.each(function () {
										if ($(this).data('tabsItem') != indexTab) {
											$(this).fadeOut(0).removeClass('active-tab')
										} else {
											$(this).fadeIn(View.animateDuration).addClass('active-tab')
										}
									})
									View.init.global.initLazyLoad()
								}

								// ajax подгрузка при наличии параметра data-ajax с адресом файла
								if (ajaxUrl) {
									View.ajaxLoad(ajaxUrl, tabs.eq(index), tabs.eq(index), toggleTabs)
								} else {
									toggleTabs()
								}
							})
						})
					})
				},
				toggleTabs2(scope) {
					scope.find('.js-tabs').each(function () {
						const parent = $(this)
						let togglers = parent.find('.js-tabs__toggler')
						let tabs = parent.find('.js-tabs__tab')
						tabs.each(function () {
							if ($(this).hasClass('active-tab')) {
								$(this).fadeIn(View.animateDuration)
							} else {
								$(this).fadeOut(0)
							}
						})
						togglers.each(function (index) {
							const toggler = $(this)
							// параметры ajax подгрузки
							const ajaxUrl = (tabs.eq(index).data('ajax') !== undefined) ? `ajax/${tabs.eq(index).data('ajax')}` : false
							toggler.off('click.toggleTabs').on('click.toggleTabs', function (event) {
								event.stopPropagation()
								event.preventDefault()

								function toggleTabs() {
									if (toggler.hasClass('js-inactive active-tab')) {
										togglers.removeClass('active-tab')
										tabs.fadeOut(0).removeClass('active-tab')
										return
									}
									togglers.not(toggler).removeClass('active-tab')
									const indexTab = toggler.addClass('active-tab').data('tabsItem')
									tabs.each(function () {
										if ($(this).data('tabsItem') != indexTab) {
											$(this).fadeOut(0).removeClass('active-tab')
										} else {
											$(this).fadeIn(View.animateDuration).addClass('active-tab')
											// инициализация lazyload картинок внутри таба
											View.init.local.initLazyLoad($(this))
										}
									})
								}

								// ajax подгрузка при наличии параметра data-ajax с адресом файла и локальная переинициализация скриптов
								if (ajaxUrl) {
									View.ajaxLoad(ajaxUrl, tabs.eq(index), tabs.eq(index), toggleTabs)
								} else {
									toggleTabs()
								}
							})
						})
					})
				},
				// accordion
				toggleAccordion(scope) {
					scope.find('.js-accordion').each(function () {
						const parent = $(this)
						const content = parent.find('.js-accordion__content')
						content.slideUp(0)
						// параметры ajax подгрузки
						const ajaxUrl = parent.data('ajax') || false
						parent.find('.js-accordion__btn').off('click.toggleAccordion').on('click.toggleAccordion', function (event) {
							event.stopPropagation()
							event.preventDefault()

							function toggleAccordion() {
								parent.toggleClass('open')
								content.slideToggle(View.animateDuration)
							}

							// ajax подгрузка при наличии параметра data-ajax с адресом файла
							if (ajaxUrl) {
								View.ajaxLoad(ajaxUrl, content, false, toggleAccordion)
							} else {
								toggleAccordion()
							}
						})
					})
				},
				// показ оверлея страницы
				toggleOverlayPage(scope) {
					let timeout = null

					function toggleOverlayPage() {
						scope.find('.js-overlay').each(function (ind, elem) {
							const parent = $(this)
							const overlay = parent.find('.js-overlay__content')
							overlay.off('click.closePageOverlay').on('click.closePageOverlay', function () {
								View.control.closeAll()
								View.control.closeAllPopups()
							}).scrollLock()
							parent.find('.js-overlay__link').off('click.showPageOverlay').on('click.showPageOverlay', function (event) {
								event.stopPropagation()
								// проверка окна браузера на наличие скролла
								View.winHaveScroll = win.height() < doc.height()
								if (!parent.hasClass('overlay')) {
									if (!View.mobileAndTabletCheck && View.winHaveScroll) {
										body.css({'padding-right': View.scrollBarWidth})
										// кастомизации отдельных элементов
										$('.js-fixed.fixed').css({right: View.scrollBarWidth})
									}
									body.addClass('overlay  fixed-scroll')
									overlay.show()
									parent.addClass('overlay')
								} else {
									View.control.closeAll()
								}
							})
						})
					}

					win.off('resize.toggleOverlayPage').on('resize.toggleOverlayPage', function () {
						clearTimeout(timeout);
						timeout = setTimeout(toggleOverlayPage, 300);
					})

					win.trigger('resize.toggleOverlayPage');
				},
				// переключения статуса избранного товара
				toggleFavorite(scope) {
					scope.find('.js-favorite').each(function () {
						const parent = $(this)
						parent.find('.js-favorite__toggler').off('click.toggleFavorite').on('click.toggleFavorite', function (event) {
							event.stopPropagation()
							event.preventDefault()
							$(this).toggleClass('active-favorite')
						})
					})
				},
				// видимость элементов зависящая от включенного чекбокса или текстового поля
				toggleDependence(scope) {
					scope.find('.js-dependence').each(function () {
						const parent = $(this)
						// id родителя для связи с элементами при наличии вложенности нескольких идентичных конструкций
						const parentId = parent.data('dependenceId')
						let togglers = null
						parent.click((e) => e.stopPropagation())
						// установа перемнных в зависимости от наличия id родителя для связи с элементами
						if (parentId) {
							togglers = parent.find(`.js-dependence__input[data-dependence-id="${parentId}"]`)
						} else {
							togglers = parent.find('.js-dependence__input:not([data-dependence-id])')
						}
						togglers.off('change.toggleDependence').on('change.toggleDependence', toggleDependence)
						togglers.off('blur.toggleDependence').on('blur.toggleDependence', toggleDependence)
						togglers.off('input.toggleDependence').on('input.toggleDependence', toggleDependence)

						function toggleDependence() {
							// переменная принимающая состояние поля
							let state = false
							// проверка типа инпута
							// console.log($(this).prop('type'))
							if ($(this).prop('type') === 'checkbox') {
								if ($(this).prop('checked')) {
									$(this).addClass('active-dependence')
									state = $(this).prop('checked')
								} else {
									$(this).removeClass('active-dependence')
								}
							} else if ($(this).prop('type') === 'radio') {
								if ($(this).prop('checked')) {
									$(this).addClass('active-dependence')
									state = $(this).val()
								} else {
									$(this).removeClass('active-dependence')
								}
							} else if ($(this).prop('type') === 'text' || $(this).prop('type') === 'tel') {
								if ($(this).val().length) {
									$(this).addClass('active-dependence')
									state = $(this).val()
								} else {
									$(this).removeClass('active-dependence')
								}
							}
							// если значение поля пустое, класс не снимается
							if ($.trim(state) != 'false') {
								parent.addClass('active-dependence')
							} else {
								parent.removeClass('active-dependence')
							}
						}
					})
				},
				// очистить (text,checkbox,radio) input
				clearInputValue() {
					$('.js-clear-value').each(function () {
						const parent = $(this)
						const input = parent.find('.js-clear-value__input')
						const btn = parent.find('.js-clear-value__btn')
						input.off('keyup.showShowClear').on('keyup.showShowClear', function (event) {
							let inputValLength = $(this).val().length
							if (inputValLength >= 1) {
								btn.css({display: 'flex'})
							} else {
								btn.css({display: 'none'})
							}
						})
						btn.off('click.clearInputValue').on('click.clearInputValue', function () {
							input.val('').blur()
							input.prop('checked', false).change()
							input.prop('selected', false).change()
							btn.css({display: 'none'})
						})
					})
				},
				// записать значение поля в другой элемент разметки
				saveInputValue(scope) {
					scope.find('.js-set-val').each(function () {
						const parent = $(this)
						const output = parent.find('.js-set-val__output')
						const postfix = output.data('postfix') || ''
						// при потере фокуса сохранение имени в выводе
						parent.off('blur.saveInputValue').on('blur.saveInputValue', '.js-set-val__input', function () {
							setValue($(this).val())
						})
						parent.off('keydown.saveInputValue').on('keydown.saveInputValue', '.js-set-val__input', function (e) {
							e.stopPropagation()
							// при нажатии ввода (ентер) сохранение имени в выводе
							if (e.keyCode === 13) {
								e.preventDefault()
								$(this).trigger('blur.saveInputValue')
								View.control.closeAllClassBlocks()
							}
						})

						// сохранение введенно результата в выводе
						function setValue(currentValue) {
							const value = $.trim(currentValue)
							if (value.length > 0) {
								parent.addClass('active-set')
								output.addClass('active-set').html(value + postfix)
							} else {
								parent.removeClass('active-set')
							}
						}
					})
				},
				// выпадающие многоуровневые меню с селектом
				toggleDropdownMulti(scope) {
					let timeout = null;
					const allParents = scope.find('.js-dropdown')
					const allContents = allParents.find('.js-dropdown__content')
					allParents.click((event) => event.stopPropagation())

					function toggleDropDown() {
						allParents.each(function () {
							const parent = $(this)
							const link = parent.find('.js-dropdown__link')
							const input = parent.find('.js-dropdown__value')
							const textInput = parent.find('.js-dropdown__text-input')
							const content = parent.find('.js-dropdown__content')
							const wrapper = content.children('.js-dropdown__wrapper')
							const innerLists = content.find('.js-dropdown__list-wrap')
							const listItems = parent.find('li')
							const listItemsParent = listItems.has('.js-dropdown__list-wrap')
							const innerBackLink = listItemsParent.find('.js-dropdown__back')
							// параметры ajax подгрузки
							const ajaxUrl = parent.data('ajax') || false
							// content.fadeOut(0)
							//чистка всех внутренних полей
							parent.find('.js-clear-inputs').off('click.clearInputs').on('click.clearInputs', function () {
								parent.find('input').val('');
								parent.find('.dropdown__current-name').html(parent.find('.dropdown__current-name').data('placeholder'));
							})
							//чистка всех внутренних полей
							parent.find('.js-clear-checkboxes').off('click.clearCheckboxes').on('click.clearCheckboxes', function () {
								parent.find('.checkbox').prop('checked', false);
								parent.find('.radiotab').prop('checked', false);
								parent.find('.radiotab:first-child').prop('checked', true);
								parent.find('input').val('');
							})
							//чистка набора цветов
							parent.find('.js-clear-colors').off('click.clearColors').on('click.clearColors', function () {
								$(this).closest('.js-colors-line').find('.checkbox').prop('checked', false);

							})
							//закрыть дроп
							parent.find('.js-close-dropdown').off('click.closeDropdown').on('click.closeDropdiwn', function () {
								View.control.closeAll()
							})
							// клик по текущему варианту слекта
							link.off('click.openSelect').on('click.openSelect', function () {

								// ajax подгрузка при наличии параметра data-ajax с адресом файла
								if (ajaxUrl) {
									View.ajaxLoad(ajaxUrl, content, parent.parent(), openDropDown)
								} else {
									openDropDown()
								}

								function openDropDown() {
									if (!parent.hasClass('active') && !View.mobileAndTabletCheck) View.control.closeAll('closeAllDropdowns', 'closeOverlayPage');
									else if (!parent.hasClass('active') && View.mobileAndTabletCheck) View.control.closeAll('closeAllDropdowns', 'closeAllClassBlocks');
									if (parent.hasClass('active')) {
										content.fadeOut(View.animateDuration)
										parent.removeClass('active')
									} else {
										content.fadeIn(View.animateDuration)
										parent.addClass('active')
									}
									allParents.not(parent).removeClass('active')
									allContents.not(content).fadeOut(0)
									innerLists.removeClass('active')
									// кастомизации отдельных элементов
									if (doc.width() < 600 && parent.hasClass('js-dropdown-full')) {
										doc.scrollTop(0)
										body.toggleClass('fixed-scroll')
									}
								}
							})
							// клик по названию элемента в меню (выбор опции)
							listItems.children('span').off('click.selectOption').on('click.selectOption', function () {
								const listItem = $(this)
								link.addClass('selected').find('.js-dropdown__icon').html(listItem.find('.js-dropdown__icon').html())
								link.children('span:visible').text(listItem.text())
								parent.attr('data-value', $(this).attr('data-value'))
								input.val($(this).attr('data-value'))
								View.control.closeAll('closeAllClassBlocks')
								if (textInput.length > 0) {
									textInput.val($(this).html())
								}
							})
							//клик с выбором бэкграунда
							listItems.children('.js-set-select-bg').off('click.setSelectOption').on('click.setSelectOption', function () {
								const listItem = $(this)
								content.fadeOut(View.animateDuration)
								parent.removeClass('active')
								link.addClass('selected').find('.js-dropdown__icon').html(listItem.find('.js-dropdown__icon').html())
								link.children('span:visible').text(listItem.text())
								parent.attr('data-value', $(this).attr('data-value'))
								input.val($(this).attr('data-value'))
								input.attr('value', $(this).html())
								const iconSvg = $(this).data('bg')
								parent.find('.js-dropdown__icon').html('<svg class="symbol  symbol-bg"><use xlink:href="img/sprite/sprite.svg#' + iconSvg + '"></use></svg>');
							})

							if (!View.mobileAndTabletCheck) {
								let nCurPosX = 0; // текущее положение курсора
								allParents.mousemove((event) => nCurPosX = event.clientX);
								// хавер по элементу для показа внутреннего подменю
								listItemsParent.each(function () {
									const curItem = $(this)
									let wrapperWidthDefault = 0
									let wrapperWidthNew = 0
									const childList = curItem.children('.js-dropdown__list-wrap')
									curItem.off('mouseover.showInnerMenu').on('mouseover.showInnerMenu', function () {
										const childListLeft = curItem.position().left + Math.ceil(curItem.outerWidth())
										if (wrapperWidthDefault === 0) wrapperWidthDefault = content.outerWidth() + 41
										if (wrapperWidthNew < wrapperWidthDefault) wrapperWidthNew = wrapperWidthDefault + childList.outerWidth()
										curItem.addClass('hover');
										/* делаем задержку чтобы при случайном наведении на пункт под меню не показывалось */
										setTimeout(function () {
											/* если по истечению задержки мы все еще на том же пункт меню, значит показываем подменю */
											if (curItem.hasClass('hover')) {
												curItem.addClass('active')
												wrapper.outerWidth(wrapperWidthNew)
												childList.css({display: 'block', left: childListLeft})
											}
										}, 300);
									})
									curItem.off('mouseout.hideInnerMenu').on('mouseout.hideInnerMenu', function (event) {
										let nPosXStart = nCurPosX
										curItem.removeClass('hover');
										/* делаем небольшую задержку чтобы определить направление движение курсора */
										setTimeout(function () {
											// если в сторону подменю, значит делаем большую задержку для возможности движения по диагонали
											if (nCurPosX - nPosXStart > 0) {
												setTimeout(function () {
													/* если по истечению задержки курсор находится на подменю или текущем пункте меню тогда не прячем подменю */
													if (!childList.hasClass('hover') && !curItem.hasClass('hover')) {
														wrapper.outerWidth(wrapperWidthDefault)
														childList.css({display: 'none'}).removeClass('hover');
														curItem.removeClass('active')
													}
												}, 300);
											} else if (!childList.hasClass('hover') && !curItem.hasClass('hover')) {
												// если нет и мы ушли с текущего пункта меню, моментально скрываем подменю
												wrapper.outerWidth(wrapperWidthDefault)
												childList.css({display: 'none'}).removeClass('hover');
												curItem.removeClass('active')
											}
										}, 10);
									})
								})
							} else {
								listItems.children('i').off('click.showInnerMenu').on('click.showInnerMenu', function (event) {
									$(this).next('.js-dropdown__list-wrap').addClass('active')
								})
								innerBackLink.off('click.hideInnerMenu').on('click.hideInnerMenu', function (event) {
									$(this).parents('.js-dropdown__list-wrap').removeClass('active')
								})
								listItemsParent.each(function () {
									const curItem = $(this)
									curItem.off('mouseover.showInnerMenu')
									curItem.off('mouseout.hideInnerMenu')
								})
							}
						})
					}

					win.off('resize.toggleDropDown').on('resize.toggleDropDown', function () {
						clearTimeout(timeout);
						timeout = setTimeout(toggleDropDown, 300);
					})

					win.trigger('resize.toggleDropDown');
				},
				// кастомный скролл
				initScrollBar(scope) {
					if ($.fn.scrollbar) {
						const scrollItem = scope.find('.js-scroll')
						let timeout = null

						function initScrollBar() {
							if (View.mobileAndTabletCheck) {
								scrollItem.scrollbar('destroy')
							} else {
								scrollItem.scrollbar({
									disableBodyScroll: true,
								})
							}
						}

						win.off('resize.initScrollBar').on('resize.initScrollBar', function () {
							clearTimeout(timeout)
							timeout = setTimeout(initScrollBar, 300)
						})
						win.trigger('resize.initScrollBar');
					}
				},
				// интернациональный номер телефона (инпут и селект с флагами)
				initPhoneInternational(scope) {
					if ($.fn.intlTelInput) {
						scope.find('.js-input-phone').each(function () {
							const telInput = $(this)
							if (telInput.data('disableInit') !== 'phone') {
								telInput.intlTelInput({
									initialCountry: 'auto',
									geoIpLookup: function (callback) {
										jQuery.get('https://ipinfo.io', function () {
										}, 'jsonp').always(function (resp) {
											var countryCode = (resp && resp.country) ? resp.country : '';
											callback(countryCode);
										});
									},
									nationalMode: false,
									autoPlaceholder: 'aggressive',
									onlyCountries: ['az', 'am', 'by', 'ee', 'ge', 'kg', 'kz', 'lv', 'lt', 'md', 'ru', 'tj', 'tm', 'ua', 'uz'],
									preferredCountries: ['ru', 'tj'],
									utilsScript: '../ajax/phoneInternationalUtils.js'
								});
								validatePhoneInternational(telInput)
							}

							// дополнение для телефона - валидация
							function validatePhoneInternational(telInput) {

								// фильтрация ввода разрешенных символов
								telInput.on('keypress.enabledCharCode', function (event) {
									if (event.charCode == 32 || event.charCode == 45) {
										return true;
									} else if (event.charCode < 48 || event.charCode > 57) {
										event.preventDefault()
									}
								});

								// валидация номера по маске
								telInput.on('keypress.validateTelInput', function (event) {
									// атрибут placeholder2 переименован вместо placeholder в плагине
									// ести по регулярке цифр в инпуте больше чем в шаблоне номера страны - отмена символа
									if (telInput.attr('placeholder2')) {
										if (telInput.val().match(/\d/g).length >= telInput.attr('placeholder2').match(/\d/g).length) {
											event.preventDefault()
										}
									}
								});

								// очищение значения поля, если оно не прошло валидацию по маске
								telInput.blur(function () {
									if ($.trim(telInput.val())) {
										if (!telInput.intlTelInput('isValidNumber')) {
											telInput.val('')
										}
									}
								});
							}
						})
					}
				},
				// дублировать блок кода по клику на кнопку
				dublicateBlock(scope) {
					scope.find('.js-duplicate').each(function () {
						const parent = $(this)
						const btn = parent.find('.js-duplicate__link')
						const content = parent.find('.js-duplicate__content')
						btn.off('click.dublicateBlock').on('click.dublicateBlock', function () {
							// клонирование блока и вставка после оригинала с присваиванием класса "cloned"
							const clone = content.clone().removeClass('hide').addClass('cloned')
							// кастомизации отдельных элементов
							if (clone.hasClass('profile__row')) clone.find('.js-input-phone').removeAttr('data-disable-init')
							content.after(clone)
							View.initAllLocal(parent)
						})
					})
				},
				// триггер клика по другому элементу
				triggerClick(scope) {
					const allSenders = $('.js-trigger-click__sender')
					const allRecipients = $('.js-trigger-click__recipient')
					allSenders.each(function () {
						const sender = $(this)
						// массив из ID отправителя для связывания триггеров со своими примещиками
						const triggerIdArr = (typeof sender.data('triggerId') !== undefined) ? String(sender.data('triggerId')).split(',') : false
						// атрибут в которым указаны типы блоков, которые нужно закрыть при клике
						const closeOnlyBlocks = (typeof sender.data('include') === 'string') ? String(sender.data('include')).split(',') : false
						// обработка клика отправителя триггера
						sender.off('click.triggerClick').on('click.triggerClick', function (event) {
							event.stopPropagation()
							event.preventDefault()
							// закрытие указаных типов блоков
							if (closeOnlyBlocks) for (let nameFunc of closeOnlyBlocks) {
								View.control[nameFunc]()
							}
							if (triggerIdArr) {
								// перебор маасива приемщиков триггеров
								allRecipients.each(function () {
									// инициализация клика при совпадении ID отправителя и приемщика
									if (~triggerIdArr.indexOf(String($(this).data('triggerId')))) $(this).trigger('click')
								})
							}
						})
					})
				},
				// переключение класса на пустых текстовых полях
				hideEmptyInputs(scope) {
					scope.find('.js-empty-input').off('blur.hideEmptyInputs').on('blur.hideEmptyInputs', function () {
						if ($(this).val().length > 0) {
							$(this).addClass('no-empty')
						} else {
							$(this).removeClass('no-empty')
						}
					})
				},
				// триггер клика по другому элементу
				lockScroll(scope) {
					if ($.fn.scrollLock) {
						scope.find('.js-lock-scroll').scrollLock()
					}
				},
				//маски форм
				inputMasks() {
					$('.js-mask-input-year').inputmask({'mask': '9999', clearMaskOnLostFocus: true});
					$('.js-mask-input--number').inputmask({'mask': '9{0,9}.{0,1}9{0,2}', clearMaskOnLostFocus: true});
				},
				// переключение категорий разделов в создании объявления для публикации
				selectCategories(scope) {
					scope.find('.js-categories').each(function () {
						const parent = $(this)

						// обработка клика по элементу
						parent.off('click.selectCategories').on('click.selectCategories', '.js-categories__item', function (event) {
							event.stopPropagation()

							// переключени состояния элемента для выбранной категории
							$(this).siblings('.js-categories__item').removeClass('active  final')
							$(this).addClass('active')

							// колонка родитель выбранного элемента
							const parentColumn = $(this).closest('.js-categories__column')
							// очистка уровней ниже выбранного
							parentColumn.nextAll('.js-categories__column').find('.js-categories__item').removeClass('visible  active  final')

							// родитительский атрибут выбранной категории
							const attrChildren = $(this).attr('data-childrens') || false
							// элементы потомки для выбранной категории
							const childrenItems = parentColumn.next('.js-categories__column').find('.js-categories__item')
							// переключени состояния элементов потомков для выбранной категории, если они указаны в атрибуте
							if (attrChildren) {
								childrenItems.removeClass('visible final').filter(`[data-parent=${attrChildren}]`).addClass('visible')
							} else {
								childrenItems.removeClass('visible')
								$(this).addClass('final')
							}
						})
					})
				},
				// показ и ограничение длинны значени введного в поле
				countLettersInput(scope) {
					scope.find('.js-letters').each(function () {
						const output = $(this).find('.js-letters__output')
						$(this).find('.js-letters__input').off('keyup.countLettersInput').on('keyup.countLettersInput', countLettersInput)
						$(this).find('.js-letters__input').off('keypress.countLettersInput').on('keypress.countLettersInput', countLettersInput)

						// сравнение количества символом в поле и в атрибуте указанном на элементе вывода
						function countLettersInput(event) {
							if (output.data('maxLetters') >= $(this).val().length) {
								output.text(output.data('maxLetters') - $(this).val().length)
							} else {
								event.preventDefault()
								return false
							}
						}
					})
				},
				// переключение класса по таймеру
				toggleClassByTimer(scope) {
					scope.find('.js-timer').each(function () {
						const parent = $(this)
						const output = parent.find('.js-timer__output')
						let time = parseInt(parent.data('time'))

						// вывод таймера в элемент разметки и навешивание класа родителю по окончанию
						let timeout = setTimeout(function tick() {
							if (time > 0) {
								output.html(--time)
								timeout = setTimeout(tick, 1000)
							} else {
								clearTimeout(timeout)
								parent.addClass('time-over')
							}
						}, 1000)
					})
				},
				// кастомные инпуты с наползающими на пустое поле label вместо placeholder
				toggleLabel(scope) {
					scope.find('.js-label').each(function () {
						const parent = $(this)
						const input = parent.find('.js-label__input')

						if (input.val().length) parent.addClass('active-label')

						// активация label при фокусе в поле
						input.off('focus.toggleLabel').on('focus.toggleLabel', function () {
							parent.addClass('active-label')
						})

						// деактивация label при потере фокуса если поле пустое
						input.off('blur.toggleLabel').on('blur.toggleLabel', function () {
							if (!input.val().length) {
								parent.removeClass('active-label')
							}
						})
					})
				},
			},
		};
		this.initAllGlobal = function () {
			$.each(this.init.global, function (index, fn) {
				if (typeof fn === 'function') fn();
			});
		};
		this.initAllLocal = function (scope) {
			$.each(this.init.local, function (index, fn) {
				if (typeof fn === 'function') fn(scope);
			});
		};
	})()
	jQuery(document).ready(function ($) {
		const body = $(document.body);
		// body.removeClass('loading-page');

		body.addClass(View.isIOS ? ('ios ios-' + View.isIOS) : 'no-ios');
		body.addClass(View.checkAdaptiveBrowser ? 'touch' : 'no-touch');
		body.addClass(View.isIE ? 'ie' : 'no-ie');
		if (View.isIE) svg4everybody();

		View.initView();
		View.initAllGlobal();
		View.initAllLocal(body);

		// переинициализация функций посля аякс подгрузки блоков
		body.on('onAjaxReload', (e, scope) => {
			View.initAllLocal(scope);
		});
	})
}