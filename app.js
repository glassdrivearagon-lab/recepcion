// Sistema GlassDrive - Versión Corregida con Cámara Automática
// Acceso por centro: Monzón, Barbastro, Lleida, Fraga

class GlassDriveApp {
    constructor() {
        // Estado de la aplicación
        this.currentTaller = null;
        this.currentStep = 1;
        this.totalSteps = 3;
        this.currentExpedient = this.resetExpedient();

        // Estados de cámara y OCR
        this.cameraStream = null;
        this.tesseractWorker = null;
        this.photoCounter = 1;

        // Centros GlassDrive específicos
        this.talleres = [
            { id: 'monzon', nombre: 'Monzón', direccion: 'Av. Lérida, 45' },
            { id: 'barbastro', nombre: 'Barbastro', direccion: 'C/ Somontano, 23' },
            { id: 'lleida', nombre: 'Lleida', direccion: 'Av. Catalunya, 67' },
            { id: 'fraga', nombre: 'Fraga', direccion: 'C/ Zaragoza, 12' }
        ];

        this.servicios = [
            'Sustitución parabrisas',
            'Reparación impacto',
            'Cambio luna lateral',
            'Sustitución luneta trasera',
            'Calibración sistemas ADAS',
            'Tratamiento hidrofóbico'
        ];

        // Patrones OCR para documentos españoles
        this.ocrPatterns = {
            matricula_espanola: /^[0-9]{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/,
            ficha_tecnica: {
                matricula: /matrícula[:\s]*([A-Z0-9\s-]+)/i,
                bastidor: /bastidor[:\s]*([A-Z0-9]+)/i,
                marca: /(volkswagen|seat|ford|renault|peugeot|citroen|toyota|nissan|bmw|mercedes|audi)/i,
                modelo: /modelo[:\s]*([a-záéíóúñ\s]+)/i,
                potencia: /potencia[:\s]*(\d+[\.,]?\d*)\s*(cv|kw)/i,
                cilindrada: /cilindrada[:\s]*(\d+)\s*cc/i,
                combustible: /combustible[:\s]*(gasolina|diesel|eléctrico|híbrido)/i
            },
            poliza_seguro: {
                numero_poliza: /póliza[:\s#nº]*([A-Z0-9-]+)/i,
                aseguradora: /(mapfre|axa|zurich|línea directa|mutua madrileña|allianz|generali)/i,
                vigencia_desde: /vigencia[:\s]*(\d{2}\/\d{2}\/\d{4})/i,
                vigencia_hasta: /hasta[:\s]*(\d{2}\/\d{2}\/\d{4})/i,
                cobertura: /cobertura[:\s]*(terceros|todo\s*riesgo|terceros\s*ampliado)/i
            }
        };

        this.init();
    }

    init() {
        console.log('🚀 Iniciando GlassDrive App...');
        this.loadStoredData();
        this.setupEventListeners();
        this.initializeTesseract();
        console.log('✅ Centros disponibles: Monzón, Barbastro, Lleida, Fraga');
    }

    resetExpedient() {
        return {
            id: null,
            matricula: null,
            fotos: [],
            foto_frontal_index: 0,
            confidence_ocr: null,
            ficha_tecnica: null,
            poliza_seguro: null,
            datos_extraidos: { ficha: {}, poliza: {} },
            cliente: {},
            vehiculo: {},
            estado: 'recepcion',
            fecha_registro: new Date().toISOString(),
            taller_info: null,
            centro_registro: null
        };
    }

    loadStoredData() {
        try {
            const stored = localStorage.getItem('glassdrive_expedientes_centros');
            this.expedientes = stored ? JSON.parse(stored) : this.getInitialData();
            console.log(`📊 ${this.expedientes.length} expedientes cargados`);
        } catch (error) {
            console.error('❌ Error cargando datos:', error);
            this.expedientes = this.getInitialData();
        }
    }

    getInitialData() {
        return [
            {
                id: '1234ABC',
                matricula: '1234ABC',
                fecha_registro: '2025-10-01',
                taller: { id: 'monzon', nombre: 'Monzón' },
                centro_registro: 'Monzón',
                cliente: { nombre: 'Juan García López', telefono: '645123456' },
                vehiculo: { marca: 'Seat', modelo: 'León', año: 2020 },
                servicio: 'Sustitución parabrisas',
                estado: 'diagnostico',
                fotos: ['frontal.jpg'],
                confidence_ocr: 96.8
            },
            {
                id: '5678DEF',
                matricula: '5678DEF',
                fecha_registro: '2025-10-02',
                taller: { id: 'barbastro', nombre: 'Barbastro' },
                centro_registro: 'Barbastro',
                cliente: { nombre: 'María Pérez Ruiz', telefono: '634567890' },
                vehiculo: { marca: 'Volkswagen', modelo: 'Polo', año: 2019 },
                servicio: 'Reparación impacto',
                estado: 'completado',
                fotos: ['frontal.jpg'],
                confidence_ocr: 94.2
            }
        ];
    }

    saveData() {
        try {
            localStorage.setItem('glassdrive_expedientes_centros', JSON.stringify(this.expedientes));
            console.log('💾 Datos guardados');
        } catch (error) {
            console.error('❌ Error guardando:', error);
        }
    }

    async initializeTesseract() {
        try {
            if (typeof Tesseract !== 'undefined') {
                this.tesseractWorker = await Tesseract.createWorker();
                await this.tesseractWorker.loadLanguage('spa');
                await this.tesseractWorker.initialize('spa');
                console.log('✅ OCR inicializado');
            } else {
                console.warn('⚠️ Tesseract.js no disponible');
            }
        } catch (error) {
            console.error('❌ Error OCR:', error);
        }
    }

    setupEventListeners() {
        // Login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Logout
        const btnLogout = document.getElementById('btnLogout');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => this.handleLogout());
        }

        // Navegación principal
        const btnNuevoRegistro = document.getElementById('btnNuevoRegistro');
        if (btnNuevoRegistro) {
            btnNuevoRegistro.addEventListener('click', () => this.openRegistroModal());
        }

        const btnBusqueda = document.getElementById('btnBusqueda');
        if (btnBusqueda) {
            btnBusqueda.addEventListener('click', () => this.showBusqueda());
        }

        // Modal
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeRegistroModal());
        }

        // Wizard
        const nextStep = document.getElementById('nextStep');
        if (nextStep) {
            nextStep.addEventListener('click', () => this.nextStep());
        }

        const prevStep = document.getElementById('prevStep');
        if (prevStep) {
            prevStep.addEventListener('click', () => this.prevStep());
        }

        const finishRegistro = document.getElementById('finishRegistro');
        if (finishRegistro) {
            finishRegistro.addEventListener('click', () => this.finishRegistro());
        }

        // Cámara y fotos
        const capturePhoto = document.getElementById('capturePhoto');
        if (capturePhoto) {
            capturePhoto.addEventListener('click', () => this.capturePhoto());
        }

        const selectPhoto = document.getElementById('selectPhoto');
        if (selectPhoto) {
            selectPhoto.addEventListener('click', () => {
                document.getElementById('uploadPhoto').click();
            });
        }

        const uploadPhoto = document.getElementById('uploadPhoto');
        if (uploadPhoto) {
            uploadPhoto.addEventListener('change', (e) => this.handlePhotoUpload(e));
        }

        // Documentos
        const selectDocument = document.getElementById('selectDocument');
        if (selectDocument) {
            selectDocument.addEventListener('click', () => {
                document.getElementById('uploadDocument').click();
            });
        }

        const uploadDocument = document.getElementById('uploadDocument');
        if (uploadDocument) {
            uploadDocument.addEventListener('change', (e) => this.handleDocumentUpload(e, 'ficha'));
        }

        const selectPolicy = document.getElementById('selectPolicy');
        if (selectPolicy) {
            selectPolicy.addEventListener('click', () => {
                document.getElementById('uploadPolicy').click();
            });
        }

        const uploadPolicy = document.getElementById('uploadPolicy');
        if (uploadPolicy) {
            uploadPolicy.addEventListener('change', (e) => this.handleDocumentUpload(e, 'poliza'));
        }

        // Búsqueda
        const btnSearch = document.getElementById('btnSearch');
        if (btnSearch) {
            btnSearch.addEventListener('click', () => this.performSearch());
        }

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') this.performSearch();
            });
        }

        const filterTaller = document.getElementById('filterTaller');
        if (filterTaller) {
            filterTaller.addEventListener('change', () => this.performSearch());
        }

        const filterEstado = document.getElementById('filterEstado');
        if (filterEstado) {
            filterEstado.addEventListener('change', () => this.performSearch());
        }
    }

    handleLogin() {
        const tallerSelect = document.getElementById('selectTaller');
        const tallerId = tallerSelect.value;

        if (!tallerId) {
            alert('Por favor, seleccione un centro');
            return;
        }

        this.currentTaller = this.talleres.find(t => t.id === tallerId);

        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('mainApp').classList.add('active');

        this.updateUserInfo();
        this.updateDashboard();
        this.showDashboard();

        console.log(`🏢 Acceso: ${this.currentTaller.nombre}`);
    }

    handleLogout() {
        this.currentTaller = null;
        document.getElementById('mainApp').classList.remove('active');
        document.getElementById('loginScreen').classList.add('active');
        document.getElementById('loginForm').reset();
        console.log('👋 Sesión cerrada');
    }

    updateUserInfo() {
        const userInfo = document.getElementById('userInfo');
        if (userInfo && this.currentTaller) {
            userInfo.textContent = `Centro: ${this.currentTaller.nombre}`;
        }
    }

    showDashboard() {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('dashboard').classList.add('active');
    }

    showBusqueda() {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('busqueda').classList.add('active');
        this.performSearch();
    }

    updateDashboard() {
        const totalVehiculos = document.getElementById('totalVehiculos');
        const registrosHoy = document.getElementById('registrosHoy');
        const enProceso = document.getElementById('enProceso');
        const completados = document.getElementById('completados');

        if (totalVehiculos) totalVehiculos.textContent = this.expedientes.length;

        const hoy = new Date().toISOString().split('T')[0];
        const registrosHoyCount = this.expedientes.filter(exp => 
            exp.fecha_registro && exp.fecha_registro.startsWith(hoy)
        ).length;
        if (registrosHoy) registrosHoy.textContent = registrosHoyCount;

        const enProcesoCount = this.expedientes.filter(exp => 
            exp.estado === 'diagnostico' || exp.estado === 'reparacion'
        ).length;
        if (enProceso) enProceso.textContent = enProcesoCount;

        const completadosCount = this.expedientes.filter(exp => 
            exp.estado === 'completado'
        ).length;
        if (completados) completados.textContent = completadosCount;

        this.updateRecentList();
    }

    updateRecentList() {
        const recentList = document.getElementById('recentList');
        if (!recentList) return;

        const recent = this.expedientes
            .sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro))
            .slice(0, 5);

        recentList.innerHTML = '';

        if (recent.length === 0) {
            recentList.innerHTML = '<p>No hay registros recientes</p>';
            return;
        }

        recent.forEach(exp => {
            const item = document.createElement('div');
            item.className = 'recent-item';
            item.innerHTML = `
                <div>
                    <strong>${exp.matricula}</strong> - ${exp.cliente ? exp.cliente.nombre : 'Cliente N/A'}
                    <br><small>${exp.centro_registro || 'Centro N/A'}</small>
                </div>
                <div class="badge badge-${exp.estado}">${exp.estado}</div>
            `;
            item.addEventListener('click', () => this.showExpediente(exp));
            recentList.appendChild(item);
        });
    }

    // *** FUNCIÓN CORREGIDA: MODAL CON CÁMARA AUTOMÁTICA ***
    openRegistroModal() {
        this.currentExpedient = this.resetExpedient();
        this.currentStep = 1;
        this.updateWizardStep();

        // Mostrar modal
        document.getElementById('registroModal').classList.add('active');

        // Iniciar cámara automáticamente después de 300ms
        setTimeout(() => {
            this.startCamera();
        }, 300);

        console.log('📝 Modal abierto - Cámara iniciando...');
    }

    closeRegistroModal() {
        // Detener cámara si está activa
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
            console.log('📷 Cámara detenida');
        }

        document.getElementById('registroModal').classList.remove('active');
        console.log('❌ Modal cerrado');
    }

    updateWizardStep() {
        document.querySelectorAll('.step').forEach((step, index) => {
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        document.querySelectorAll('.wizard-step').forEach((step, index) => {
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const finishBtn = document.getElementById('finishRegistro');

        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }

        if (nextBtn) {
            nextBtn.style.display = this.currentStep < this.totalSteps ? 'block' : 'none';
        }

        if (finishBtn) {
            finishBtn.style.display = this.currentStep === this.totalSteps ? 'block' : 'none';
        }
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateWizardStep();
            console.log(`➡️ Paso ${this.currentStep}`);
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateWizardStep();
            console.log(`⬅️ Paso ${this.currentStep}`);
        }
    }

    // *** FUNCIÓN CORREGIDA DE CÁMARA ***
    async startCamera() {
        try {
            console.log('📷 Iniciando cámara...');

            // Detener cámara previa si existe
            if (this.cameraStream) {
                this.cameraStream.getTracks().forEach(track => track.stop());
            }

            // Solicitar cámara trasera preferentemente
            this.cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: "environment",
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            const preview = document.getElementById('cameraPreview');
            const captureBtn = document.getElementById('capturePhoto');

            if (preview && captureBtn) {
                preview.srcObject = this.cameraStream;
                preview.style.display = "block";
                captureBtn.style.display = "block";

                // Asegurar que el video se reproduce
                try {
                    await preview.play();
                } catch (playError) {
                    console.warn('Auto-play bloqueado:', playError);
                }

                console.log('✅ Cámara activada exitosamente');
            } else {
                console.error('❌ Elementos de cámara no encontrados');
            }
        } catch (error) {
            console.error('❌ Error accediendo a cámara:', error);
            alert(`No se pudo acceder a la cámara:\n${error.message}\n\nVerifica los permisos y que tengas cámara disponible.`);
        }
    }

    capturePhoto() {
        const preview = document.getElementById('cameraPreview');
        const canvas = document.getElementById('photoCanvas');

        if (!preview || !canvas) {
            console.error('❌ Elementos no encontrados para captura');
            return;
        }

        const ctx = canvas.getContext('2d');
        canvas.width = preview.videoWidth || 640;
        canvas.height = preview.videoHeight || 480;

        ctx.drawImage(preview, 0, 0);

        canvas.toBlob((blob) => {
            const photoUrl = URL.createObjectURL(blob);
            const photoData = {
                id: this.photoCounter++,
                url: photoUrl,
                blob: blob,
                timestamp: new Date().toISOString()
            };

            this.currentExpedient.fotos.push(photoData);
            this.updatePhotosGrid();

            // Procesar primera foto con OCR
            if (this.currentExpedient.fotos.length === 1) {
                this.processMatricula(photoData);
            }

            console.log(`📸 Foto ${this.currentExpedient.fotos.length} capturada`);
        }, 'image/jpeg', 0.8);
    }

    handlePhotoUpload(event) {
        const files = Array.from(event.target.files);

        files.forEach(file => {
            const photoUrl = URL.createObjectURL(file);
            const photoData = {
                id: this.photoCounter++,
                url: photoUrl,
                blob: file,
                timestamp: new Date().toISOString(),
                name: file.name
            };

            this.currentExpedient.fotos.push(photoData);
        });

        this.updatePhotosGrid();

        if (this.currentExpedient.fotos.length > 0) {
            this.processMatricula(this.currentExpedient.fotos[0]);
        }

        console.log(`📸 ${files.length} foto(s) subidas`);
    }

    updatePhotosGrid() {
        const grid = document.getElementById('photosGrid');
        const selector = document.getElementById('frontalSelector');
        const options = document.getElementById('frontalOptions');

        if (!grid) return;

        grid.innerHTML = '';

        this.currentExpedient.fotos.forEach((photo, index) => {
            const photoDiv = document.createElement('div');
            photoDiv.className = `photo-item ${index === this.currentExpedient.foto_frontal_index ? 'frontal' : ''}`;
            photoDiv.innerHTML = `
                <img src="${photo.url}" alt="Foto ${index + 1}">
                <div class="photo-label">Foto ${index + 1}</div>
            `;

            photoDiv.addEventListener('click', () => {
                this.currentExpedient.foto_frontal_index = index;
                this.updatePhotosGrid();
                this.processMatricula(this.currentExpedient.fotos[index]);
            });

            grid.appendChild(photoDiv);
        });

        if (this.currentExpedient.fotos.length > 1 && selector && options) {
            selector.style.display = 'block';
            options.innerHTML = '';

            this.currentExpedient.fotos.forEach((photo, index) => {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="radio" name="frontal" value="${index}" ${index === this.currentExpedient.foto_frontal_index ? 'checked' : ''}>
                    Foto ${index + 1}
                `;

                label.querySelector('input').addEventListener('change', () => {
                    this.currentExpedient.foto_frontal_index = index;
                    this.updatePhotosGrid();
                    this.processMatricula(this.currentExpedient.fotos[index]);
                });

                options.appendChild(label);
            });
        } else if (selector) {
            selector.style.display = 'none';
        }
    }

    async processMatricula(photoData) {
        if (!this.tesseractWorker || !photoData) {
            console.warn('⚠️ OCR no disponible');
            return;
        }

        try {
            console.log('🔍 Procesando matrícula...');

            const ocrResult = document.getElementById('ocrResults');
            const matriculaResult = document.getElementById('matriculaResult');

            if (ocrResult) {
                ocrResult.style.display = 'block';
                ocrResult.innerHTML = '<div class="loading">Analizando imagen...</div>';
            }

            const { data: { text, confidence } } = await this.tesseractWorker.recognize(photoData.blob, {
                tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNPRSTVWXYZ',
                tessedit_pageseg_mode: 8
            });

            const cleanText = text.replace(/\s+/g, ' ').toUpperCase();
            const matriculaMatch = cleanText.match(/[0-9]{4}[BCDFGHJKLMNPRSTVWXYZ]{3}/);

            if (matriculaMatch) {
                const matricula = matriculaMatch[0];
                this.currentExpedient.matricula = matricula;
                this.currentExpedient.confidence_ocr = confidence;

                if (matriculaResult) {
                    matriculaResult.innerHTML = `
                        <div class="matricula-result">${matricula}</div>
                        <div class="confidence-indicator confidence-${confidence > 80 ? 'high' : confidence > 60 ? 'medium' : 'low'}">
                            Confianza: ${confidence.toFixed(1)}%
                        </div>
                    `;
                }

                console.log(`✅ Matrícula: ${matricula} (${confidence.toFixed(1)}%)`);
            } else {
                if (ocrResult) {
                    ocrResult.innerHTML = '<div class="error">No se detectó matrícula válida</div>';
                }
                console.warn('⚠️ Matrícula no detectada');
            }
        } catch (error) {
            console.error('❌ Error OCR:', error);
            const ocrResult = document.getElementById('ocrResults');
            if (ocrResult) {
                ocrResult.innerHTML = '<div class="error">Error procesando imagen</div>';
            }
        }
    }

    async handleDocumentUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        console.log(`📄 Procesando ${type}:`, file.name);

        const previewId = type === 'ficha' ? 'documentPreview' : 'policyPreview';
        const dataId = type === 'ficha' ? 'extractedTechnicalData' : 'extractedPolicyData';
        const gridId = type === 'ficha' ? 'technicalDataGrid' : 'policyDataGrid';

        const preview = document.getElementById(previewId);
        const dataSection = document.getElementById(dataId);

        if (preview) {
            preview.style.display = 'block';

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.innerHTML = `
                        <h4>Vista previa:</h4>
                        <img src="${e.target.result}" alt="Documento">
                        <p><strong>Archivo:</strong> ${file.name}</p>
                    `;
                };
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                preview.innerHTML = `
                    <h4>Documento PDF:</h4>
                    <div class="pdf-info">
                        📄 ${file.name}<br>
                        Tamaño: ${(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                `;
            }
        }

        if (type === 'ficha') {
            this.currentExpedient.ficha_tecnica = file;
        } else {
            this.currentExpedient.poliza_seguro = file;
        }

        setTimeout(() => {
            this.simulateDocumentExtraction(type, dataSection, document.getElementById(gridId));
        }, 1000);
    }

    simulateDocumentExtraction(type, dataSection, grid) {
        if (!dataSection || !grid) return;

        dataSection.style.display = 'block';

        let extractedData = {};

        if (type === 'ficha') {
            extractedData = {
                'Marca': 'Seat',
                'Modelo': 'León',
                'Matrícula': this.currentExpedient.matricula || '1234ABC',
                'Bastidor': 'VSSZZZ5FZ1R123456',
                'Potencia': '110 CV',
                'Cilindrada': '1598 cc',
                'Combustible': 'Gasolina',
                'Año': '2020'
            };
            this.currentExpedient.datos_extraidos.ficha = extractedData;
        } else {
            extractedData = {
                'Aseguradora': 'Mapfre',
                'Número Póliza': 'MAP987654321',
                'Matrícula': this.currentExpedient.matricula || '1234ABC',
                'Vigencia Desde': '15/06/2024',
                'Vigencia Hasta': '15/06/2025',
                'Cobertura': 'Todo riesgo'
            };
            this.currentExpedient.datos_extraidos.poliza = extractedData;
        }

        grid.innerHTML = '';
        Object.entries(extractedData).forEach(([key, value]) => {
            const dataItem = document.createElement('div');
            dataItem.className = 'data-item';
            dataItem.innerHTML = `
                <label>${key}:</label>
                <input type="text" value="${value}" readonly>
            `;
            grid.appendChild(dataItem);
        });

        console.log(`✅ Datos extraídos de ${type}`);
    }

    // *** FUNCIÓN CORREGIDA: MATRÍCULA COMO ID ***
    finishRegistro() {
        if (!this.currentExpedient.matricula) {
            alert('Debe capturar una foto frontal y detectar la matrícula');
            return;
        }

        if (!this.currentExpedient.ficha_tecnica) {
            alert('Debe subir la ficha técnica del vehículo');
            return;
        }

        if (!this.currentExpedient.poliza_seguro) {
            alert('Debe subir la póliza de seguro');
            return;
        }

        // *** USAR MATRÍCULA COMO ID DEL EXPEDIENTE ***
        this.currentExpedient.id = this.currentExpedient.matricula.toUpperCase();
        this.currentExpedient.fecha_registro = new Date().toISOString();
        this.currentExpedient.taller_info = this.currentTaller;
        this.currentExpedient.centro_registro = this.currentTaller.nombre;
        this.currentExpedient.estado = 'recepcion';

        // Datos del cliente y vehículo
        this.currentExpedient.cliente = {
            nombre: this.currentExpedient.datos_extraidos.poliza['Asegurado'] || 'Cliente Nuevo',
            telefono: '600000000',
            email: 'cliente@email.com'
        };

        this.currentExpedient.vehiculo = {
            marca: this.currentExpedient.datos_extraidos.ficha['Marca'] || 'N/A',
            modelo: this.currentExpedient.datos_extraidos.ficha['Modelo'] || 'N/A',
            año: parseInt(this.currentExpedient.datos_extraidos.ficha['Año']) || new Date().getFullYear(),
            color: 'N/A',
            bastidor: this.currentExpedient.datos_extraidos.ficha['Bastidor'] || 'N/A'
        };

        this.expedientes.push(this.currentExpedient);
        this.saveData();

        this.closeRegistroModal();
        this.updateDashboard();
        this.showDashboard();

        alert(`✅ Expediente ${this.currentExpedient.id} creado exitosamente`);

        console.log('✅ Registro completado:', this.currentExpedient);
    }

    performSearch() {
        const searchInput = document.getElementById('searchInput');
        const filterTaller = document.getElementById('filterTaller');
        const filterEstado = document.getElementById('filterEstado');
        const resultsContainer = document.getElementById('searchResults');

        if (!searchInput || !resultsContainer) return;

        const query = searchInput.value.toLowerCase().trim();
        const tallerFilter = filterTaller ? filterTaller.value : '';
        const estadoFilter = filterEstado ? filterEstado.value : '';

        let results = this.expedientes;

        if (query) {
            results = results.filter(exp => 
                (exp.matricula && exp.matricula.toLowerCase().includes(query)) ||
                (exp.cliente && exp.cliente.nombre && exp.cliente.nombre.toLowerCase().includes(query)) ||
                (exp.id && exp.id.toLowerCase().includes(query))
            );
        }

        if (tallerFilter) {
            results = results.filter(exp => exp.taller && exp.taller.id === tallerFilter);
        }

        if (estadoFilter) {
            results = results.filter(exp => exp.estado === estadoFilter);
        }

        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No se encontraron expedientes</p>';
            return;
        }

        results.forEach(exp => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <h4>${exp.matricula || 'Sin matrícula'}</h4>
                <p><strong>Cliente:</strong> ${exp.cliente ? exp.cliente.nombre : 'N/A'}</p>
                <p><strong>Vehículo:</strong> ${exp.vehiculo ? `${exp.vehiculo.marca} ${exp.vehiculo.modelo}` : 'N/A'}</p>
                <p><strong>Centro:</strong> ${exp.centro_registro || 'N/A'}</p>
                <p><strong>Estado:</strong> <span class="badge badge-${exp.estado}">${exp.estado}</span></p>
                <p><strong>Fecha:</strong> ${new Date(exp.fecha_registro).toLocaleDateString('es-ES')}</p>
            `;

            card.addEventListener('click', () => this.showExpediente(exp));
            resultsContainer.appendChild(card);
        });

        console.log(`🔍 ${results.length} resultados`);
    }

    showExpediente(expediente) {
        const modal = document.getElementById('expedienteModal');
        const titulo = document.getElementById('expedienteTitulo');
        const content = document.getElementById('expedienteContent');

        if (!modal || !titulo || !content) return;

        titulo.textContent = `Expediente ${expediente.id}`;

        content.innerHTML = `
            <div class="expediente-info">
                <div class="info-section">
                    <h3>Información del Vehículo</h3>
                    <p><strong>Matrícula:</strong> ${expediente.matricula || 'N/A'}</p>
                    <p><strong>Marca:</strong> ${expediente.vehiculo ? expediente.vehiculo.marca : 'N/A'}</p>
                    <p><strong>Modelo:</strong> ${expediente.vehiculo ? expediente.vehiculo.modelo : 'N/A'}</p>
                    <p><strong>Año:</strong> ${expediente.vehiculo ? expediente.vehiculo.año : 'N/A'}</p>
                </div>

                <div class="info-section">
                    <h3>Información del Cliente</h3>
                    <p><strong>Nombre:</strong> ${expediente.cliente ? expediente.cliente.nombre : 'N/A'}</p>
                    <p><strong>Teléfono:</strong> ${expediente.cliente ? expediente.cliente.telefono : 'N/A'}</p>
                </div>

                <div class="info-section">
                    <h3>Información del Servicio</h3>
                    <p><strong>Centro:</strong> ${expediente.centro_registro || 'N/A'}</p>
                    <p><strong>Fecha:</strong> ${new Date(expediente.fecha_registro).toLocaleString('es-ES')}</p>
                    <p><strong>Estado:</strong> <span class="badge badge-${expediente.estado}">${expediente.estado}</span></p>
                </div>

                <div class="info-section">
                    <h3>Documentos</h3>
                    <p><strong>Fotos:</strong> ${expediente.fotos ? expediente.fotos.length : 0} archivos</p>
                    <p><strong>Ficha Técnica:</strong> ${expediente.ficha_tecnica ? '✅ Disponible' : '❌ No disponible'}</p>
                    <p><strong>Póliza:</strong> ${expediente.poliza_seguro ? '✅ Disponible' : '❌ No disponible'}</p>
                </div>
            </div>
        `;

        modal.classList.add('active');

        const closeBtn = document.getElementById('closeExpedienteModal');
        if (closeBtn) {
            closeBtn.onclick = () => modal.classList.remove('active');
        }

        console.log('👁️ Mostrando:', expediente.id);
    }
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 Iniciando GlassDrive...');
    window.glassDriveApp = new GlassDriveApp();
});

// Manejo de errores
window.addEventListener('error', function(event) {
    console.error('❌ Error:', event.error);
});

// Cerrar modales al clic fuera
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});