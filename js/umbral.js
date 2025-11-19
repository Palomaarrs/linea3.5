// ----------------------------------------------------
// --- ⚙️ CLASE UMBRAL EFFECT (ES5) ---
// ----------------------------------------------------

function UmbralEffect(selector, options) {
	options = options || {};
	
	// Selector del elemento contenedor (ej: "#umbral-img")
	this.selector = selector;
	this.container = document.querySelector(selector);

	if (!this.container) {
		console.error('No se encontró el elemento con selector: ' + selector);
		return;
	}

	// Obtener ruta de imagen
	var imgElement = this.container.querySelector('img');
	var defaultImagePath = imgElement && imgElement.src ? imgElement.src : './img/indsvrds2.png alt="';

	// Opciones de configuración
	this.options = {
		imagePath: options.imagePath || defaultImagePath,
		usePixelatedRendering: options.usePixelatedRendering !== undefined ? options.usePixelatedRendering : true,
		scrollContainer: options.scrollContainer || document.body
	};
	
	// Aplicar opciones adicionales
	if (options) {
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				this.options[key] = options[key];
			}
		}
	}

	// Variables de p5.js
	this.p5Instance = null;
	this.img = null;
	this.originalImgBuffer = null;
	this.processedImg = null;

	// Variables para el cálculo de cover
	this.imgDisplayWidth = 0;
	this.imgDisplayHeight = 0;
	this.imgDisplayX = 0;
	this.imgDisplayY = 0;

	// Referencia a la imagen original
	this.originalImg = this.container.querySelector('img');

	// Inicializa el efecto
	this.init();
}

UmbralEffect.prototype.init = function() {
	var self = this;
	
	// Hace la imagen original invisible pero mantiene pointer-events
	if (this.originalImg) {
		this.originalImg.style.opacity = '0';
		this.originalImg.style.visibility = 'hidden';
		this.originalImg.style.pointerEvents = 'none';
	}

	// Asegura que el contenedor tenga posición relativa
	var containerStyle = window.getComputedStyle(this.container);
	if (containerStyle.position === 'static') {
		this.container.style.position = 'relative';
	}

	// Crea la instancia de p5.js
	this.p5Instance = new p5(function(p) {
		self.createSketch(p);
	}, this.container);
};

UmbralEffect.prototype.createSketch = function(p) {
	var self = this;
	
	// Guarda referencia a p5
	this.p = p;

	// Preload
	p.preload = function() {
		self.img = p.loadImage(
			self.options.imagePath,
			function() {
				console.log("Imagen cargada con éxito.");
				if (self.p && self.p.width > 0) {
					self.createCoverBuffer();
					self.drawInternal();
				}
			},
			function(event) {
				console.error("Error al cargar la imagen:", event);
			}
		);
	};

	// Setup
	p.setup = function() {
		// Obtiene las dimensiones del contenedor
		var rect = self.container.getBoundingClientRect();
		var canvasWidth = rect.width;
		var canvasHeight = rect.height;

		// Crea el canvas con las dimensiones del contenedor
		var canvas = p.createCanvas(canvasWidth, canvasHeight);
		canvas.parent(self.container);

		// Posiciona el canvas de forma absoluta sobre la imagen
		canvas.elt.style.position = 'absolute';
		canvas.elt.style.top = '0';
		canvas.elt.style.left = '0';
		canvas.elt.style.width = '100%';
		canvas.elt.style.height = '100%';
		canvas.elt.style.zIndex = '1';

		// Configura el canvas para lectura frecuente
		canvas.elt.getContext('2d').willReadFrequently = true;

		// Aplica renderizado pixelizado si está activado
		if (self.options.usePixelatedRendering) {
			p.noSmooth();
			var ctx = canvas.elt.getContext('2d');
			ctx.imageSmoothingEnabled = false;
			ctx.mozImageSmoothingEnabled = false;
			ctx.webkitImageSmoothingEnabled = false;
			ctx.msImageSmoothingEnabled = false;

			canvas.elt.style.imageRendering = 'pixelated';
			canvas.elt.style.setProperty('image-rendering', '-moz-crisp-edges', 'important');
			canvas.elt.style.setProperty('image-rendering', '-webkit-crisp-edges', 'important');
			canvas.elt.style.setProperty('image-rendering', 'crisp-edges', 'important');
		}

		// Espera a que la imagen se cargue
		if (self.img && self.img.width > 0) {
			self.createCoverBuffer();
		}

		p.noLoop();
	};

	// Draw - guarda referencia para poder llamarlo desde fuera
	p.draw = function() {
		self.drawInternal();
	};

	// Window resized
	p.windowResized = function() {
		var rect = self.container.getBoundingClientRect();
		p.resizeCanvas(rect.width, rect.height);

		// Reaplica configuración de renderizado pixelizado
		if (self.options.usePixelatedRendering) {
			p.noSmooth();
			var canvas = self.container.querySelector('canvas');
			if (canvas) {
				var ctx = canvas.getContext('2d');
				ctx.imageSmoothingEnabled = false;
				ctx.mozImageSmoothingEnabled = false;
				ctx.webkitImageSmoothingEnabled = false;
				ctx.msImageSmoothingEnabled = false;
				canvas.style.imageRendering = 'pixelated';
				canvas.style.setProperty('image-rendering', '-moz-crisp-edges', 'important');
				canvas.style.setProperty('image-rendering', '-webkit-crisp-edges', 'important');
				canvas.style.setProperty('image-rendering', 'crisp-edges', 'important');
			}
		}

		// Recrea el buffer con las nuevas dimensiones
		if (self.img && self.img.width > 0) {
			self.createCoverBuffer();
		}

		self.drawInternal();
	};
};

UmbralEffect.prototype.calculateCoverDimensions = function() {
	if (!this.img || this.img.width === 0 || this.img.height === 0 || !this.p) {
		return;
	}

	var canvasAspect = this.p.width / this.p.height;
	var imgAspect = this.img.width / this.img.height;

	if (imgAspect > canvasAspect) {
		this.imgDisplayHeight = this.p.height;
		this.imgDisplayWidth = this.p.height * imgAspect;
		this.imgDisplayX = (this.p.width - this.imgDisplayWidth) / 2;
		this.imgDisplayY = 0;
	} else {
		this.imgDisplayWidth = this.p.width;
		this.imgDisplayHeight = this.p.width / imgAspect;
		this.imgDisplayX = 0;
		this.imgDisplayY = (this.p.height - this.imgDisplayHeight) / 2;
	}
};

UmbralEffect.prototype.createCoverBuffer = function() {
	if (!this.img || this.img.width === 0 || this.img.height === 0 || !this.p) {
		return;
	}

	this.calculateCoverDimensions();

	var tempCanvas = this.p.createGraphics(this.p.width, this.p.height);
	tempCanvas.image(this.img, this.imgDisplayX, this.imgDisplayY, this.imgDisplayWidth, this.imgDisplayHeight);

	this.originalImgBuffer = this.p.createImage(this.p.width, this.p.height);
	this.originalImgBuffer.copy(tempCanvas, 0, 0, this.p.width, this.p.height, 0, 0, this.p.width, this.p.height);
};

UmbralEffect.prototype.drawInternal = function() {
	if (!this.p || !this.originalImgBuffer || this.originalImgBuffer.width === 0) {
		return;
	}

	this.p.clear();

	// Calcula el umbral basado en el scroll (INVERTIDO)
	// scroll = 0 -> threshold = 0 (imagen opaca)
	// scroll = max -> threshold = 255 (umbral al máximo)
	var scrollPos = window.scrollY;
	var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
	var normalizedScroll = maxScroll > 0 ? this.p.constrain(scrollPos / maxScroll, 0, 1) : 0;
	var threshold = 255 - this.p.floor(normalizedScroll * 255);

	// Actualiza el valor del umbral en el HTML
	var thresholdElement = document.getElementById('threshold-value');
	if (thresholdElement) {
		thresholdElement.textContent = threshold;
	}

	// Crea una copia fresca del buffer original
	this.processedImg = this.p.createImage(this.originalImgBuffer.width, this.originalImgBuffer.height);
	this.processedImg.copy(
		this.originalImgBuffer,
		0, 0,
		this.originalImgBuffer.width, this.originalImgBuffer.height,
		0, 0,
		this.originalImgBuffer.width, this.originalImgBuffer.height
	);

	// Procesa los píxeles
	this.processedImg.loadPixels();

	for (var i = 0; i < this.processedImg.pixels.length; i += 4) {
		var r = this.processedImg.pixels[i];
		var g = this.processedImg.pixels[i + 1];
		var b = this.processedImg.pixels[i + 2];
		var brightness = (r + g + b) / 3;

		// Si el brillo es mayor que el umbral, se hace transparente
		if (brightness > threshold) {
			this.processedImg.pixels[i + 3] = 0;
		} else {
			this.processedImg.pixels[i + 3] = 255;
		}
	}

	this.processedImg.updatePixels();

	// Dibuja la imagen procesada
	this.p.image(this.processedImg, 0, 0, this.p.width, this.p.height);
};

// Método para actualizar el efecto en el scroll
UmbralEffect.prototype.update = function() {
	if (this.p) {
		this.drawInternal();
	}
};

// Método para destruir la instancia
UmbralEffect.prototype.destroy = function() {
	if (this.p5Instance) {
		this.p5Instance.remove();
	}
	if (this.originalImg) {
		this.originalImg.style.opacity = '';
		this.originalImg.style.visibility = '';
		this.originalImg.style.pointerEvents = '';
	}
};

// Evento de scroll global para actualizar todas las instancias
var umbralInstances = [];

window.addEventListener('scroll', function() {
	for (var i = 0; i < umbralInstances.length; i++) {
		umbralInstances[i].update();
	}
});
