// Sistema GlassDrive - Versión Final con OCR Mejorado e Informe de Recepción
// Centros: Monzón, Barbastro, Lleida, Fraga

class GlassDriveApp {
    constructor() {
        // Estado de la aplicación
        this.currentTaller = null;
        this.currentStep = 1;
        this.totalSteps = 3;
        this.currentExpedient = this.resetExpedient();
        this.currentReportSignature = null;

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

        this.init();
    }

    init() {
        console.log('🚀 Iniciando GlassDrive App...');
        this.loadStoredData();
        this.setupEventListeners();
        this.initializeTesseract();
        console.log('✅ Sistema iniciado con OCR mejorado e informe de recepción');
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
                fecha_registro: '2025-10-07',
                taller: { id: 'monzon', nombre: 'Monzón' },
                centro_registro: 'Monzón',
                cliente: { nombre: 'Juan García López', telefono: '645123456', email: 'juan@email.com' },
                vehiculo: { marca: 'Seat', modelo: 'León', año: 2020, color: 'Blanco' },
                servicio: 'Sustitución parabrisas',
                estado: 'diagnostico',
                fotos: [],
                confidence_ocr: 96.8
            },
            {
                id: '5678DEF',
                matricula: '5678DEF',
                fecha_registro: '2025-10-06',
                taller: { id: 'barbastro', nombre: 'Barbastro' },
                centro_registro: 'Barbastro',
                cliente: { nombre: 'María Pérez Ruiz', telefono: '634567890', email: 'maria@email.com' },
                vehiculo: { marca: 'Volkswagen', modelo: 'Polo', año: 2019, color: 'Azul' },
                servicio: 'Reparación impacto',
                estado: 'completado',
                fotos: [],
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
                console.log('✅ OCR mejorado inicializado');
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

    // MODAL DE REGISTRO CON CÁMARA AUTOMÁTICA
    openRegistroModal() {
        this.currentExpedient = this.resetExpedient();
        this.currentStep = 1;
        this.updateWizardStep();

        document.getElementById('registroModal').classList.add('active');

        // Iniciar cámara automáticamente
        setTimeout(() => {
            this.startCamera();
        }, 300);

        console.log('📝 Modal abierto - Cámara iniciando...');
    }

    closeRegistroModal() {
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

    // CÁMARA MEJORADA
    async startCamera() {
        try {
            console.log('📷 Iniciando cámara...');

            if (this.cameraStream) {
                this.cameraStream.getTracks().forEach(track => track.stop());
            }

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
            alert(`No se pudo acceder a la cámara: ${error.message}. Verifique los permisos y que tenga cámara disponible.`);
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

    // OCR MEJORADO PARA MATRÍCULA
    async processMatricula(photoData) {
        if (!this.tesseractWorker || !photoData) {
            console.warn('⚠️ OCR no disponible');
            this.showManualMatriculaInput();
            return;
        }

        try {
            console.log('🔍 Procesando matrícula con OCR mejorado...');

            const ocrResult = document.getElementById('ocrResults');
            const matriculaResult = document.getElementById('matriculaResult');

            if (ocrResult) {
                ocrResult.style.display = 'block';
                ocrResult.innerHTML = '<div class="loading">🔍 Analizando matrícula...</div>';
            }

            // CONFIGURACIÓN OPTIMIZADA PARA MATRÍCULAS
            const { data: { text, confidence } } = await this.tesseractWorker.recognize(photoData.blob, {
                tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNPRSTVWXYZ',
                tessedit_pageseg_mode: 7, // Línea de texto única
                tessedit_ocr_engine_mode: 1, // Motor LSTM
                preserve_interword_spaces: 0
            });

            console.log('OCR Text completo:', text);
            console.log('OCR Confidence:', confidence);

            // PATRONES MEJORADOS PARA MATRÍCULAS ESPAÑOLAS
            const cleanText = text.replace(/[^0-9A-Z]/g, '').toUpperCase();

            // Intentar múltiples patrones
            const patterns = [
                /([0-9]{4}[BCDFGHJKLMNPRSTVWXYZ]{3})/g,  // Formato estándar
                /([0-9]{4}\s*[BCDFGHJKLMNPRSTVWXYZ]{3})/g, // Con espacios
                /([0-9]{4}[-]*[BCDFGHJKLMNPRSTVWXYZ]{3})/g // Con guión
            ];

            let matriculaDetectada = null;
            let bestMatch = null;

            for (const pattern of patterns) {
                const matches = text.match(pattern);
                if (matches) {
                    bestMatch = matches[0].replace(/[^0-9A-Z]/g, '');
                    if (this.validarMatriculaEspanola(bestMatch)) {
                        matriculaDetectada = bestMatch;
                        break;
                    }
                }
            }

            // Si no se detecta automáticamente, buscar en texto limpio
            if (!matriculaDetectada && cleanText.length >= 7) {
                for (let i = 0; i <= cleanText.length - 7; i++) {
                    const candidate = cleanText.substring(i, i + 7);
                    if (this.validarMatriculaEspanola(candidate)) {
                        matriculaDetectada = candidate;
                        break;
                    }
                }
            }

            if (matriculaDetectada) {
                this.currentExpedient.matricula = matriculaDetectada;
                this.currentExpedient.confidence_ocr = confidence;

                if (matriculaResult) {
                    matriculaResult.innerHTML = `
                        <div class="matricula-result">${matriculaDetectada}</div>
                        <div class="confidence-indicator confidence-${confidence > 70 ? 'high' : confidence > 50 ? 'medium' : 'low'}">
                            Confianza: ${confidence.toFixed(1)}%
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="glassDriveApp.showManualMatriculaInput()" style="margin-top: 10px;">
                            <i class="fas fa-edit"></i> Corregir Manualmente
                        </button>
                    `;
                }

                console.log(`✅ Matrícula detectada: ${matriculaDetectada} (${confidence.toFixed(1)}%)`);
            } else {
                console.warn('⚠️ No se pudo detectar matrícula automáticamente');
                this.showManualMatriculaInput();
            }
        } catch (error) {
            console.error('❌ Error en OCR:', error);
            this.showManualMatriculaInput();
        }
    }

    // Validar formato de matrícula española
    validarMatriculaEspanola(matricula) {
        if (!matricula || matricula.length !== 7) return false;

        // Formato: 4 números + 3 letras (sin vocales ni Ñ, Q)
        const patron = /^[0-9]{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/;
        return patron.test(matricula);
    }

    // Mostrar input manual para matrícula
    showManualMatriculaInput() {
        const ocrResult = document.getElementById('ocrResults');
        if (ocrResult) {
            ocrResult.style.display = 'block';
            ocrResult.innerHTML = `
                <div class="manual-input">
                    <h4>⚠️ Introduce la matrícula manualmente:</h4>
                    <div class="matricula-input-group">
                        <input type="text" id="manualMatricula" placeholder="Ej: 1234ABC" maxlength="7" 
                               style="padding: 15px; font-size: 18px; letter-spacing: 2px; text-align: center; text-transform: uppercase;">
                        <button class="btn btn-success" onclick="glassDriveApp.setManualMatricula()">
                            <i class="fas fa-check"></i> Confirmar
                        </button>
                    </div>
                    <p style="font-size: 12px; color: #666; margin-top: 10px;">
                        Formato: 4 números + 3 letras (Ej: 1234ABC)
                    </p>
                </div>
            `;

            // Enfocar el input
            setTimeout(() => {
                const input = document.getElementById('manualMatricula');
                if (input) {
                    input.focus();
                    input.addEventListener('keyup', (e) => {
                        if (e.key === 'Enter') {
                            this.setManualMatricula();
                        }
                    });
                }
            }, 100);
        }
    }

    // Confirmar matrícula manual
    setManualMatricula() {
        const input = document.getElementById('manualMatricula');
        if (input) {
            const matricula = input.value.toUpperCase().trim();

            if (this.validarMatriculaEspanola(matricula)) {
                this.currentExpedient.matricula = matricula;
                this.currentExpedient.confidence_ocr = 100; // Manual = 100%

                const matriculaResult = document.getElementById('matriculaResult');
                if (matriculaResult) {
                    matriculaResult.innerHTML = `
                        <div class="matricula-result">${matricula}</div>
                        <div class="confidence-indicator confidence-high">
                            <i class="fas fa-user"></i> Introducida manualmente
                        </div>
                    `;
                }

                console.log(`✅ Matrícula manual: ${matricula}`);
            } else {
                alert('⚠️ Formato de matrícula incorrecto\nDebe ser: 4 números + 3 letras (Ej: 1234ABC)');
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
                'Asegurado': 'Cliente Titular',
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

    // FINALIZAR REGISTRO CON INFORME
    finishRegistro() {
        // Validaciones
        if (!this.currentExpedient.matricula) {
            alert('⚠️ Debe detectar o introducir la matrícula del vehículo');
            return;
        }

        if (!this.currentExpedient.ficha_tecnica) {
            alert('⚠️ Debe subir la ficha técnica del vehículo');
            return;
        }

        if (!this.currentExpedient.poliza_seguro) {
            alert('⚠️ Debe subir la póliza de seguro');
            return;
        }

        // Configurar expediente
        this.currentExpedient.id = this.currentExpedient.matricula.toUpperCase();
        this.currentExpedient.fecha_registro = new Date().toISOString();
        this.currentExpedient.taller_info = this.currentTaller;
        this.currentExpedient.centro_registro = this.currentTaller.nombre;
        this.currentExpedient.estado = 'recepcion';

        // Datos del cliente y vehículo
        this.currentExpedient.cliente = {
            nombre: this.currentExpedient.datos_extraidos.poliza?.Asegurado || 'Cliente Nuevo',
            telefono: '600000000',
            email: 'cliente@email.com'
        };

        this.currentExpedient.vehiculo = {
            marca: this.currentExpedient.datos_extraidos.ficha?.Marca || 'N/A',
            modelo: this.currentExpedient.datos_extraidos.ficha?.Modelo || 'N/A',
            año: parseInt(this.currentExpedient.datos_extraidos.ficha?.Año) || new Date().getFullYear(),
            color: 'Por determinar',
            bastidor: this.currentExpedient.datos_extraidos.ficha?.Bastidor || 'N/A'
        };

        // Guardar expediente
        this.expedientes.push(this.currentExpedient);
        this.saveData();

        // Cerrar modal de registro
        this.closeRegistroModal();

        // Mostrar diálogo de confirmación con opciones
        const showReport = confirm(
            `✅ Expediente ${this.currentExpedient.id} creado exitosamente\n\n` +
            `Centro: ${this.currentTaller.nombre}\n` +
            `Matrícula: ${this.currentExpedient.matricula}\n\n` +
            `¿Desea generar el informe de recepción ahora?`
        );

        if (showReport) {
            // Generar informe de recepción
            this.generateReceptionReport();
        } else {
            // Volver al dashboard
            this.updateDashboard();
            this.showDashboard();
        }

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

    // MOSTRAR EXPEDIENTE CON OPCIÓN DE INFORME
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
                    <p><strong>Color:</strong> ${expediente.vehiculo ? expediente.vehiculo.color : 'N/A'}</p>
                </div>

                <div class="info-section">
                    <h3>Información del Cliente</h3>
                    <p><strong>Nombre:</strong> ${expediente.cliente ? expediente.cliente.nombre : 'N/A'}</p>
                    <p><strong>Teléfono:</strong> ${expediente.cliente ? expediente.cliente.telefono : 'N/A'}</p>
                    <p><strong>Email:</strong> ${expediente.cliente ? expediente.cliente.email : 'N/A'}</p>
                </div>

                <div class="info-section">
                    <h3>Información del Servicio</h3>
                    <p><strong>Centro:</strong> ${expediente.centro_registro || 'N/A'}</p>
                    <p><strong>Fecha:</strong> ${new Date(expediente.fecha_registro).toLocaleString('es-ES')}</p>
                    <p><strong>Estado:</strong> <span class="badge badge-${expediente.estado}">${expediente.estado}</span></p>
                    <p><strong>Confianza OCR:</strong> ${expediente.confidence_ocr ? expediente.confidence_ocr.toFixed(1) + '%' : 'Manual'}</p>
                </div>

                <div class="info-section">
                    <h3>Documentos y Archivos</h3>
                    <p><strong>Fotos:</strong> ${expediente.fotos ? expediente.fotos.length : 0} archivos</p>
                    <p><strong>Ficha Técnica:</strong> ${expediente.ficha_tecnica ? '✅ Disponible' : '❌ No disponible'}</p>
                    <p><strong>Póliza:</strong> ${expediente.poliza_seguro ? '✅ Disponible' : '❌ No disponible'}</p>
                </div>

                <div class="info-section">
                    <h3>Acciones Disponibles</h3>
                    <div class="expediente-actions">
                        <button class="btn btn-primary" onclick="glassDriveApp.generateExistingReport('${expediente.id}')">
                            <i class="fas fa-file-alt"></i> Generar Informe
                        </button>
                        <button class="btn btn-secondary" onclick="glassDriveApp.editExpediente('${expediente.id}')">
                            <i class="fas fa-edit"></i> Editar (Próximamente)
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');

        const closeBtn = document.getElementById('closeExpedienteModal');
        if (closeBtn) {
            closeBtn.onclick = () => modal.classList.remove('active');
        }

        console.log('👁️ Mostrando expediente:', expediente.id);
    }

    // SISTEMA DE INFORME DE RECEPCIÓN

    // Generar informe de recepción
    generateReceptionReport() {
        if (!this.currentExpedient.matricula) {
            alert('⚠️ Falta la matrícula del vehículo');
            return;
        }

        const reportData = {
            expediente: this.currentExpedient,
            centro: this.currentTaller,
            fecha: new Date().toLocaleString('es-ES'),
            numero_informe: `INF-${this.currentTaller.id.toUpperCase()}-${Date.now()}`,
            tecnico: 'Usuario del Sistema'
        };

        this.showReportModal(reportData);
    }

    // Generar informe para expediente existente
    generateExistingReport(expedienteId) {
        const expediente = this.expedientes.find(exp => exp.id === expedienteId);
        if (!expediente) {
            alert('❌ Expediente no encontrado');
            return;
        }

        // Cerrar modal de expediente
        const modal = document.getElementById('expedienteModal');
        if (modal) modal.classList.remove('active');

        // Configurar datos del informe
        const reportData = {
            expediente: expediente,
            centro: this.talleres.find(t => t.id === expediente.taller?.id) || this.currentTaller,
            fecha: new Date().toLocaleString('es-ES'),
            numero_informe: `INF-${expediente.id}-${Date.now()}`,
            tecnico: 'Usuario del Sistema'
        };

        // Mostrar informe
        this.showReportModal(reportData);
    }

    // Mostrar modal del informe
    showReportModal(reportData) {
        // Crear modal dinámicamente
        const modalHTML = `
            <div id="reportModal" class="modal active">
                <div class="modal-content report-modal">
                    <div class="modal-header">
                        <h2><i class="fas fa-file-alt"></i> Informe de Recepción</h2>
                        <button class="modal-close" onclick="glassDriveApp.closeReportModal()">&times;</button>
                    </div>

                    <div class="report-content" id="reportContent">
                        ${this.generateReportHTML(reportData)}
                    </div>

                    <div class="report-signature-section">
                        <h4>Firma del Cliente</h4>
                        <canvas id="signatureCanvas" width="400" height="200" 
                                style="border: 2px solid #ddd; border-radius: 8px; background: white;"></canvas>
                        <div class="signature-buttons">
                            <button class="btn btn-secondary" onclick="glassDriveApp.clearSignature()">
                                <i class="fas fa-eraser"></i> Limpiar
                            </button>
                            <button class="btn btn-primary" onclick="glassDriveApp.captureSignature()">
                                <i class="fas fa-signature"></i> Capturar Firma
                            </button>
                        </div>
                    </div>

                    <div class="modal-footer report-actions">
                        <button class="btn btn-secondary" onclick="glassDriveApp.closeReportModal()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button class="btn btn-info" onclick="glassDriveApp.printReport()">
                            <i class="fas fa-print"></i> Imprimir
                        </button>
                        <button class="btn btn-warning" onclick="glassDriveApp.downloadReportPDF()">
                            <i class="fas fa-file-pdf"></i> Descargar PDF
                        </button>
                        <button class="btn btn-success" onclick="glassDriveApp.sendReportEmail()">
                            <i class="fas fa-envelope"></i> Enviar por Email
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Insertar modal en el DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Inicializar firma
        setTimeout(() => this.initSignaturePad(), 100);
    }

    // Generar HTML del informe
    generateReportHTML(data) {
        const exp = data.expediente;
        const fotos = exp.fotos || [];

        return `
            <div class="report-header">
                <div class="report-logo">
                    <img src="logolargo.jpg" alt="GlassDrive" style="max-height: 60px;">
                </div>
                <div class="report-info">
                    <h3>INFORME DE RECEPCIÓN DE VEHÍCULO</h3>
                    <p><strong>Nº Informe:</strong> ${data.numero_informe}</p>
                    <p><strong>Centro:</strong> ${data.centro.nombre}</p>
                    <p><strong>Fecha:</strong> ${data.fecha}</p>
                </div>
            </div>

            <div class="report-section">
                <h4>DATOS DEL VEHÍCULO</h4>
                <div class="data-row">
                    <span><strong>Matrícula:</strong> ${exp.matricula}</span>
                    <span><strong>Marca:</strong> ${exp.vehiculo?.marca || 'N/A'}</span>
                </div>
                <div class="data-row">
                    <span><strong>Modelo:</strong> ${exp.vehiculo?.modelo || 'N/A'}</span>
                    <span><strong>Año:</strong> ${exp.vehiculo?.año || 'N/A'}</span>
                </div>
                <div class="data-row">
                    <span><strong>Color:</strong> ${exp.vehiculo?.color || 'N/A'}</span>
                    <span><strong>Bastidor:</strong> ${exp.vehiculo?.bastidor || 'N/A'}</span>
                </div>
            </div>

            <div class="report-section">
                <h4>DATOS DEL CLIENTE</h4>
                <div class="data-row">
                    <span><strong>Nombre:</strong> ${exp.cliente?.nombre || 'N/A'}</span>
                    <span><strong>Teléfono:</strong> ${exp.cliente?.telefono || 'N/A'}</span>
                </div>
                <div class="data-row">
                    <span><strong>Email:</strong> ${exp.cliente?.email || 'N/A'}</span>
                    <span><strong>Estado:</strong> ${exp.estado}</span>
                </div>
            </div>

            <div class="report-section">
                <h4>FOTOGRAFÍAS DEL VEHÍCULO</h4>
                <div class="photos-report">
                    ${fotos.slice(0, 4).map((photo, index) => `
                        <div class="photo-report">
                            <img src="${photo.url}" alt="Foto ${index + 1}">
                            <p>Foto ${index + 1}${index === exp.foto_frontal_index ? ' (Frontal)' : ''}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="report-section">
                <h4>DOCUMENTOS ADJUNTOS</h4>
                <div class="data-row">
                    <span><strong>Ficha Técnica:</strong> ${exp.ficha_tecnica ? '✅ Adjunta' : '❌ No adjunta'}</span>
                    <span><strong>Póliza Seguro:</strong> ${exp.poliza_seguro ? '✅ Adjunta' : '❌ No adjunta'}</span>
                </div>
            </div>

            <div class="report-section">
                <h4>OBSERVACIONES</h4>
                <div class="observations">
                    <p>Vehículo recibido en centro ${data.centro.nombre} para revisión y diagnóstico.</p>
                    <p>Matrícula detectada ${exp.confidence_ocr ? `con ${exp.confidence_ocr.toFixed(1)}% de confianza` : 'manualmente'}.</p>
                    <p>Documentación completa verificada y archivada en expediente ${exp.id || exp.matricula}.</p>
                </div>
            </div>
        `;
    }

    // Inicializar canvas de firma
    initSignaturePad() {
        const canvas = document.getElementById('signatureCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // Configurar estilos del canvas
        ctx.strokeStyle = '#000';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 2;

        // Event listeners para mouse
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });

        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseout', () => isDrawing = false);

        // Event listeners para touch (móvil)
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            isDrawing = true;
            lastX = touch.clientX - rect.left;
            lastY = touch.clientY - rect.top;
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            [lastX, lastY] = [x, y];
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            isDrawing = false;
        });

        console.log('✅ Canvas de firma inicializado');
    }

    // Limpiar firma
    clearSignature() {
        const canvas = document.getElementById('signatureCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Capturar firma como imagen
    captureSignature() {
        const canvas = document.getElementById('signatureCanvas');
        if (canvas) {
            const signatureData = canvas.toDataURL('image/png');
            this.currentReportSignature = signatureData;
            alert('✅ Firma capturada correctamente');
            return signatureData;
        }
        return null;
    }

    // Imprimir informe
    printReport() {
        const reportContent = document.getElementById('reportContent');
        if (!reportContent) return;

        // Crear ventana de impresión
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Informe de Recepción - ${this.currentExpedient.matricula || 'N/A'}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .report-header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #1e5aa8; padding-bottom: 20px; }
                    .report-section { margin-bottom: 25px; }
                    .report-section h4 { background: #1e5aa8; color: white; padding: 10px; margin-bottom: 15px; }
                    .data-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                    .photos-report { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
                    .photo-report img { width: 100%; max-width: 200px; border: 1px solid #ddd; }
                    .observations p { line-height: 1.6; margin-bottom: 10px; }
                    @media print { 
                        .photos-report { page-break-inside: avoid; }
                        .photo-report img { max-width: 150px; }
                    }
                </style>
            </head>
            <body>
                ${reportContent.innerHTML}
                ${this.currentReportSignature ? `
                    <div class="report-section">
                        <h4>FIRMA DEL CLIENTE</h4>
                        <img src="${this.currentReportSignature}" style="border: 1px solid #ddd; max-width: 400px;">
                    </div>
                ` : ''}
            </body>
            </html>
        `);

        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }

    // Descargar como PDF (simulado)
    downloadReportPDF() {
        alert('📄 Función de descarga PDF en desarrollo\n\nPor ahora use la opción "Imprimir" y seleccione "Guardar como PDF" en su navegador.');
    }

    // Enviar por email (simulado)
    sendReportEmail() {
        const email = prompt('📧 Introduce el email de destino:', this.currentExpedient.cliente?.email || '');
        if (email && this.validarEmail(email)) {
            alert(`📧 Informe enviado a: ${email}\n\n(Función simulada - se puede integrar con servicio de email)`);
        }
    }

    // Validar email
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Cerrar modal de informe
    closeReportModal() {
        const modal = document.getElementById('reportModal');
        if (modal) {
            modal.remove();
        }
    }

    // Función placeholder para editar expediente
    editExpediente(expedienteId) {
        alert(`🔧 Función de edición en desarrollo\n\nExpediente: ${expedienteId}\n\nPróximamente podrá modificar los datos del expediente.`);
    }
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 Iniciando GlassDrive con OCR mejorado e informe...');
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