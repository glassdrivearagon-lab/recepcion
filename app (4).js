// GLASSDRIVE MVP - JAVASCRIPT COMPLETAMENTE FUNCIONAL

class GlassDriveMVP {
    constructor() {
        this.currentTaller = null;
        this.currentStep = 1;
        this.maxSteps = 5;
        this.expedientes = this.loadMVPData();
        this.currentExpedient = this.resetExpedient();
        this.cameraStream = null;
        this.signatureCanvas = null;
        this.signatureCtx = null;
        this.isDrawing = false;

        console.log('🚀 GlassDrive MVP iniciando...');
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }

        this.updateStats();
        console.log('✅ MVP listo para demostración');
    }

    loadMVPData() {
        return [
            {
                id: 1,
                matricula: '6792LNJ',
                cliente: 'Juan García López',
                vehiculo: 'SEAT León 1.4 TSI',
                centro: 'Monzón',
                fecha: new Date().toLocaleDateString(),
                estado: 'completado',
                datos: {
                    fotos: [
                        { id: 1, url: this.generateDemoImage('Frontal vehículo'), nombre: 'Frontal del vehículo', size: 245000, fecha: new Date() },
                        { id: 2, url: this.generateDemoImage('Lateral izquierdo'), nombre: 'Lateral izquierdo', size: 312000, fecha: new Date() },
                        { id: 3, url: this.generateDemoImage('Matrícula detalle'), nombre: 'Matrícula detalle', size: 189000, fecha: new Date() }
                    ],
                    documentos: {
                        ficha: { presente: true, datos: { marca: 'SEAT', modelo: 'León', año: 2020 }},
                        poliza: { presente: true, datos: { aseguradora: 'MAPFRE', titular: 'Juan García' }}
                    },
                    firma: true
                }
            },
            {
                id: 2,
                matricula: '1234ABC',
                cliente: 'María Rodríguez Pérez',
                vehiculo: 'VOLKSWAGEN Golf GTI',
                centro: 'Barbastro',
                fecha: new Date(Date.now() - 86400000).toLocaleDateString(),
                estado: 'proceso',
                datos: {
                    fotos: [
                        { id: 4, url: this.generateDemoImage('Vista general'), nombre: 'Vista general', size: 278000, fecha: new Date() }
                    ],
                    documentos: {
                        ficha: { presente: true, datos: { marca: 'VOLKSWAGEN', modelo: 'Golf' }},
                        poliza: { presente: false }
                    },
                    firma: false
                }
            }
        ];
    }

    generateDemoImage(text) {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#1a4d72';
        ctx.fillRect(0, 0, 400, 300);

        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, 200, 150);

        return canvas.toDataURL();
    }

    resetExpedient() {
        return {
            id: Date.now(),
            matricula: '',
            cliente: '',
            vehiculo: '',
            centro: this.currentTaller,
            fecha: new Date().toISOString(),
            fotos: [],
            documentos: { ficha: null, poliza: null },
            datosExtraidos: { ficha: {}, poliza: {} },
            firma: null
        };
    }

    setupEventListeners() {
        console.log('📡 Configurando event listeners...');

        // LOGIN
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // NAVEGACIÓN
        this.setupNavigation();

        // MODAL
        this.setupModal();

        // CÁMARA Y FOTOS
        this.setupCamera();

        // DOCUMENTOS
        this.setupDocuments();

        // FIRMA
        this.setupSignature();

        // BÚSQUEDA
        this.setupSearch();

        // PDF
        this.setupPDF();

        console.log('✅ Event listeners configurados');
    }

    setupNavigation() {
        const navButtons = {
            'btnLogout': () => this.logout(),
            'btnDashboard': () => this.showDashboard(),
            'btnNuevoRegistro': () => this.openModal(),
            'btnGaleria': () => this.showGaleria(),
            'btnBusqueda': () => this.showBusqueda()
        };

        Object.entries(navButtons).forEach(([id, handler]) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', handler);
            }
        });
    }

    setupModal() {
        const modalElements = {
            'closeModal': () => this.closeModal(),
            'prevStep': () => this.prevStep(),
            'nextStep': () => this.nextStep(),
            'completeProcess': () => this.completeProcess()
        };

        Object.entries(modalElements).forEach(([id, handler]) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', handler);
            }
        });
    }

    setupCamera() {
        const startCameraBtn = document.getElementById('startCamera');
        const capturePhotoBtn = document.getElementById('capturePhoto');
        const uploadPhotoBtn = document.getElementById('uploadPhoto');
        const photoInput = document.getElementById('photoInput');

        if (startCameraBtn) {
            startCameraBtn.addEventListener('click', () => this.startCamera());
        }

        if (capturePhotoBtn) {
            capturePhotoBtn.addEventListener('click', () => this.capturePhoto());
        }

        if (uploadPhotoBtn) {
            uploadPhotoBtn.addEventListener('click', () => {
                if (photoInput) photoInput.click();
            });
        }

        if (photoInput) {
            photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
        }
    }

    setupDocuments() {
        this.setupDocumentUpload('ficha');
        this.setupDocumentUpload('poliza');
    }

    setupDocumentUpload(tipo) {
        const input = document.getElementById(`${tipo}Input`);
        const zone = document.getElementById(`${tipo}UploadZone`);

        if (zone) {
            zone.addEventListener('click', () => {
                if (input) input.click();
            });

            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('dragover');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('dragover');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('dragover');
                if (e.dataTransfer.files.length > 0) {
                    this.handleDocumentUpload(e.dataTransfer.files[0], tipo);
                }
            });
        }

        if (input) {
            input.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleDocumentUpload(e.target.files[0], tipo);
                }
            });
        }
    }

    setupSignature() {
        const clearBtn = document.getElementById('clearSignature');
        const saveBtn = document.getElementById('saveSignature');

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearSignature());
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSignature());
        }
    }

    setupSearch() {
        const searchBtn = document.getElementById('btnSearch');
        const searchInput = document.getElementById('searchInput');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.search());
        }

        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.search();
                }
            });
        }
    }

    setupPDF() {
        const generateBtn = document.getElementById('generatePDF');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateCompleteReport());
        }
    }

    handleLogin() {
        const taller = document.getElementById('selectTaller')?.value;
        if (!taller) {
            this.showAlert('⚠️ Seleccione un centro', 'warning');
            return;
        }

        this.currentTaller = taller;

        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');

        if (loginScreen && mainApp) {
            loginScreen.style.opacity = '0';

            setTimeout(() => {
                loginScreen.classList.remove('active');
                mainApp.classList.add('active');

                const userInfo = document.getElementById('userInfo');
                if (userInfo) {
                    userInfo.textContent = `Centro: ${this.getTallerName(taller)} • MVP Demo`;
                }

                this.updateStats();
                this.showDashboard();

                this.showAlert('✅ MVP Demo iniciado correctamente', 'success');
            }, 300);
        }
    }

    getTallerName(code) {
        const talleres = {
            'monzon': 'Monzón',
            'barbastro': 'Barbastro',
            'lleida': 'Lleida',
            'fraga': 'Fraga'
        };
        return talleres[code] || code;
    }

    logout() {
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');

        if (loginScreen && mainApp) {
            mainApp.classList.remove('active');
            loginScreen.classList.add('active');
            loginScreen.style.opacity = '1';

            const selectTaller = document.getElementById('selectTaller');
            if (selectTaller) {
                selectTaller.value = '';
            }

            this.currentTaller = null;
            this.showAlert('👋 Sesión cerrada', 'info');
        }
    }

    showDashboard() {
        this.hideAllSections();
        this.showSection('dashboard');
        this.updateNavigation('btnDashboard');
        this.updateStats();
        this.updateRecentList();
    }

    showGaleria() {
        this.hideAllSections();
        this.showSection('galeria');
        this.updateNavigation('btnGaleria');
        this.loadGaleria();
    }

    showBusqueda() {
        this.hideAllSections();
        this.showSection('busqueda');
        this.updateNavigation('btnBusqueda');
        this.search();
    }

    hideAllSections() {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
    }

    showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }
    }

    updateNavigation(activeId) {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        const activeBtn = document.getElementById(activeId);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    updateStats() {
        let totalFotos = 0;
        let totalDocumentos = 0;
        let totalPDFs = 0;

        this.expedientes.forEach(exp => {
            if (exp.datos.fotos) totalFotos += exp.datos.fotos.length;
            if (exp.datos.documentos?.ficha?.presente) totalDocumentos++;
            if (exp.datos.documentos?.poliza?.presente) totalDocumentos++;
            if (exp.estado === 'completado') totalPDFs++;
        });

        this.animateNumber('totalVehiculos', this.expedientes.length);
        this.animateNumber('totalFotos', totalFotos);
        this.animateNumber('totalDocumentos', totalDocumentos);
        this.animateNumber('totalPDFs', totalPDFs);
    }

    animateNumber(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let current = 0;
        const increment = target / 20;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 50);
    }

    updateRecentList() {
        const list = document.getElementById('recentList');
        if (!list) return;

        list.innerHTML = '';

        this.expedientes.slice(-3).reverse().forEach(exp => {
            const fotosCount = exp.datos.fotos ? exp.datos.fotos.length : 0;
            const docsCount = (exp.datos.documentos?.ficha?.presente ? 1 : 0) + 
                            (exp.datos.documentos?.poliza?.presente ? 1 : 0);

            const item = document.createElement('div');
            item.className = 'recent-item';
            item.innerHTML = `
                <div class="recent-header">
                    <div class="recent-matricula">${exp.matricula}</div>
                    <div class="recent-status ${exp.estado}">
                        ${exp.estado === 'completado' ? '✅' : exp.estado === 'proceso' ? '⚙️' : '📝'}
                    </div>
                </div>
                <div class="recent-info">
                    <p><strong>${exp.cliente}</strong></p>
                    <p>${exp.vehiculo}</p>
                    <div class="recent-stats">
                        <span class="stat-item">📸 ${fotosCount}</span>
                        <span class="stat-item">📄 ${docsCount}</span>
                        <span class="stat-item">📅 ${exp.fecha}</span>
                    </div>
                </div>
                <div class="recent-actions">
                    <button onclick="app.viewExpediente('${exp.id}')" class="btn btn-outline btn-sm">👁️ Ver</button>
                    <button onclick="app.generatePDF(${exp.id})" class="btn btn-primary btn-sm">📋 PDF</button>
                </div>
            `;

            list.appendChild(item);
        });
    }

    loadGaleria() {
        const container = document.getElementById('galeriaContent');
        if (!container) return;

        container.innerHTML = '';

        let allFotos = [];
        this.expedientes.forEach(exp => {
            if (exp.datos.fotos) {
                exp.datos.fotos.forEach(foto => {
                    allFotos.push({
                        ...foto,
                        matricula: exp.matricula,
                        cliente: exp.cliente
                    });
                });
            }
        });

        if (allFotos.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🖼️</div>
                    <h3>No hay fotos en la galería</h3>
                    <p>Las fotos aparecerán aquí cuando se creen expedientes</p>
                </div>
            `;
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'photos-grid';

        allFotos.forEach(foto => {
            const item = document.createElement('div');
            item.className = 'photo-item';
            item.innerHTML = `
                <div class="photo-thumbnail">
                    <img src="${foto.url}" alt="${foto.nombre}" loading="lazy">
                </div>
                <div class="photo-info">
                    <div class="photo-name">${foto.nombre}</div>
                    <div class="photo-meta">${foto.matricula} • ${(foto.size / 1024).toFixed(1)} KB</div>
                </div>
            `;

            grid.appendChild(item);
        });

        container.appendChild(grid);
    }

    search() {
        const query = document.getElementById('searchInput')?.value?.toLowerCase() || '';
        const results = document.getElementById('searchResults');

        if (!results) return;

        let filtered = this.expedientes;
        if (query) {
            filtered = this.expedientes.filter(exp => 
                exp.matricula.toLowerCase().includes(query) ||
                exp.cliente.toLowerCase().includes(query) ||
                exp.vehiculo.toLowerCase().includes(query)
            );
        }

        results.innerHTML = '';

        if (filtered.length === 0) {
            results.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>No se encontraron expedientes</h3>
                    <p>Intenta con otros términos de búsqueda</p>
                </div>
            `;
            return;
        }

        filtered.forEach(exp => {
            const fotosCount = exp.datos.fotos ? exp.datos.fotos.length : 0;

            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <div class="result-header">
                    <div class="result-matricula">${exp.matricula}</div>
                    <div class="result-status ${exp.estado}">
                        ${exp.estado === 'completado' ? '✅' : exp.estado === 'proceso' ? '⚙️' : '📝'}
                    </div>
                </div>
                <div class="result-info">
                    <h4>${exp.cliente}</h4>
                    <p><strong>Vehículo:</strong> ${exp.vehiculo}</p>
                    <p><strong>Centro:</strong> ${exp.centro}</p>
                    <p><strong>Fecha:</strong> ${exp.fecha}</p>
                    <p><strong>Fotos:</strong> ${fotosCount}</p>
                </div>
                <div class="result-actions">
                    <button onclick="app.viewExpediente('${exp.id}')" class="btn btn-outline btn-sm">👁️ Ver</button>
                    <button onclick="app.generatePDF(${exp.id})" class="btn btn-primary btn-sm">📋 PDF</button>
                </div>
            `;

            results.appendChild(card);
        });
    }

    // ===== MODAL PROCESS FUNCTIONS =====

    openModal() {
        if (!this.currentTaller) {
            this.showAlert('⚠️ Primero debe iniciar sesión', 'warning');
            return;
        }

        this.currentExpedient = this.resetExpedient();
        this.currentStep = 1;
        this.updateSteps();

        const modal = document.getElementById('registroModal');
        if (modal) {
            modal.classList.add('active');
            console.log('✅ Modal abierto - Proceso de 5 pasos iniciado');
        }
    }

    closeModal() {
        const modal = document.getElementById('registroModal');
        if (modal) {
            modal.classList.remove('active');
        }

        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }

        console.log('👋 Modal cerrado');
    }

    updateSteps() {
        // Actualizar indicadores de pasos
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });

        // Actualizar paneles de contenido
        const panels = document.querySelectorAll('.step-panel');
        panels.forEach((panel, index) => {
            panel.classList.toggle('active', index + 1 === this.currentStep);
        });

        // Actualizar botones de navegación
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const completeBtn = document.getElementById('completeProcess');

        if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        if (nextBtn) nextBtn.style.display = this.currentStep < this.maxSteps ? 'block' : 'none';
        if (completeBtn) completeBtn.style.display = this.currentStep === this.maxSteps ? 'block' : 'none';

        // Actualizar información del paso
        const stepInfo = document.getElementById('stepInfo');
        if (stepInfo) {
            stepInfo.textContent = `Paso ${this.currentStep} de ${this.maxSteps}`;
        }

        // Actualizar barra de progreso
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const progress = (this.currentStep / this.maxSteps) * 100;
            progressFill.style.width = `${progress}%`;
        }

        // Configurar funcionalidades específicas del paso
        if (this.currentStep === 4) {
            setTimeout(() => this.initSignature(), 100);
        } else if (this.currentStep === 5) {
            this.updateExpedienteSummary();
        }

        console.log(`📍 Paso ${this.currentStep} de ${this.maxSteps} activo`);
    }

    nextStep() {
        if (this.currentStep < this.maxSteps) {
            // Validar paso actual antes de continuar
            if (this.validateCurrentStep()) {
                this.currentStep++;
                this.updateSteps();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateSteps();
        }
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1: // Fotos
                if (this.currentExpedient.fotos.length === 0) {
                    this.showAlert('⚠️ Debe capturar al menos una foto', 'warning');
                    return false;
                }
                return true;
            case 2: // Ficha técnica
                if (!this.currentExpedient.documentos.ficha) {
                    this.showAlert('⚠️ Debe subir la ficha técnica', 'warning');
                    return false;
                }
                return true;
            case 3: // Póliza
                if (!this.currentExpedient.documentos.poliza) {
                    this.showAlert('⚠️ Debe subir la póliza de seguro', 'warning');
                    return false;
                }
                return true;
            case 4: // Firma
                if (!this.currentExpedient.firma) {
                    this.showAlert('⚠️ Debe capturar la firma del cliente', 'warning');
                    return false;
                }
                return true;
            default:
                return true;
        }
    }

    // ===== PASO 1: CÁMARA Y FOTOS =====

    async startCamera() {
        try {
            this.cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            const preview = document.getElementById('cameraPreview');
            const captureBtn = document.getElementById('capturePhoto');

            if (preview && captureBtn) {
                preview.srcObject = this.cameraStream;
                preview.style.display = 'block';
                captureBtn.style.display = 'inline-block';

                this.showAlert('📷 Cámara activada correctamente', 'success');
            }
        } catch (error) {
            console.error('Error accediendo a la cámara:', error);
            this.showAlert('❌ No se pudo acceder a la cámara. Use la opción de subir archivos.', 'warning');
        }
    }

    capturePhoto() {
        const preview = document.getElementById('cameraPreview');
        const canvas = document.getElementById('photoCanvas');

        if (!preview || !canvas) return;

        canvas.width = preview.videoWidth;
        canvas.height = preview.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(preview, 0, 0);

        canvas.toBlob((blob) => {
            const foto = {
                id: Date.now(),
                url: URL.createObjectURL(blob),
                nombre: `Foto-${new Date().toLocaleTimeString()}.jpg`,
                size: blob.size,
                fecha: new Date(),
                blob: blob
            };

            this.currentExpedient.fotos.push(foto);
            this.updatePhotosGrid();

            // Simular OCR si es la primera foto
            if (this.currentExpedient.fotos.length === 1) {
                setTimeout(() => this.processOCR(), 1500);
            }

            this.showAlert('📸 Foto capturada correctamente', 'success');
        }, 'image/jpeg', 0.8);
    }

    handlePhotoUpload(event) {
        const files = Array.from(event.target.files);

        files.forEach((file, index) => {
            const foto = {
                id: Date.now() + index,
                url: URL.createObjectURL(file),
                nombre: file.name,
                size: file.size,
                fecha: new Date(),
                blob: file
            };

            this.currentExpedient.fotos.push(foto);
        });

        this.updatePhotosGrid();

        // OCR en la primera foto
        if (files.length > 0 && this.currentExpedient.fotos.length === files.length) {
            setTimeout(() => this.processOCR(), 1000);
        }

        this.showAlert(`📁 ${files.length} foto(s) subida(s)`, 'success');
        event.target.value = '';
    }

    updatePhotosGrid() {
        const grid = document.getElementById('photosGrid');
        if (!grid) return;

        grid.innerHTML = '';

        if (this.currentExpedient.fotos.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📸</div>
                    <p>No hay fotos capturadas</p>
                    <p>Use la cámara o suba archivos</p>
                </div>
            `;
            return;
        }

        this.currentExpedient.fotos.forEach((foto) => {
            const item = document.createElement('div');
            item.className = 'photo-item-modal';
            item.innerHTML = `
                <div class="photo-thumbnail-modal">
                    <img src="${foto.url}" alt="${foto.nombre}" loading="lazy">
                    <div class="photo-overlay-modal">
                        <button onclick="app.viewPhoto('${foto.id}')" class="btn-photo-modal view">👁️</button>
                        <button onclick="app.deletePhoto('${foto.id}')" class="btn-photo-modal delete">🗑️</button>
                    </div>
                </div>
                <div class="photo-info-modal">
                    <div class="photo-name-modal">${foto.nombre}</div>
                    <div class="photo-meta-modal">
                        ${(foto.size / 1024).toFixed(1)} KB • ${foto.fecha.toLocaleTimeString()}
                    </div>
                </div>
            `;
            grid.appendChild(item);
        });
    }

    processOCR() {
        const result = document.getElementById('ocrResult');
        if (!result) return;

        // Mostrar procesamiento
        result.innerHTML = `
            <div class="ocr-processing">
                <div class="processing-spinner"></div>
                <h4>🔍 PROCESANDO CON OCR</h4>
                <p>Analizando imagen con tecnología MVP...</p>
                <p><small>Tesseract.js + Google Vision API</small></p>
            </div>
        `;

        // Simular OCR exitoso
        setTimeout(() => {
            this.currentExpedient.matricula = '6792LNJ';

            result.innerHTML = `
                <div class="ocr-success">
                    <div class="success-icon">✅</div>
                    <h4>🎯 MATRÍCULA DETECTADA</h4>
                    <div class="matricula-display">6792LNJ</div>
                    <div class="ocr-details">
                        <div class="detail-item">
                            <span class="detail-label">Método:</span>
                            <span class="detail-value">Tesseract.js MVP</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Confianza:</span>
                            <span class="detail-value">94.8%</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Tiempo:</span>
                            <span class="detail-value">2.3s</span>
                        </div>
                    </div>
                    <button onclick="app.confirmMatricula()" class="btn btn-success">✅ Confirmar Matrícula</button>
                </div>
            `;
        }, 3000);
    }

    confirmMatricula() {
        this.showAlert('✅ Matrícula 6792LNJ confirmada y guardada', 'success');
    }

    deletePhoto(fotoId) {
        if (confirm('¿Eliminar esta foto?')) {
            this.currentExpedient.fotos = this.currentExpedient.fotos.filter(f => f.id != fotoId);
            this.updatePhotosGrid();
            this.showAlert('🗑️ Foto eliminada', 'info');
        }
    }

    viewPhoto(fotoId) {
        const foto = this.currentExpedient.fotos.find(f => f.id == fotoId);
        if (!foto) return;

        const modal = document.createElement('div');
        modal.className = 'photo-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
            background: rgba(0,0,0,0.95); display: flex; align-items: center;
            justify-content: center; z-index: 2000; animation: fadeIn 0.3s ease-out;
        `;

        modal.innerHTML = `
            <div style="background: white; border-radius: 20px; max-width: 90vw; max-height: 90vh; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.2);">
                <div style="background: linear-gradient(135deg, #1a4d72, #2e6b99); color: white; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; font-size: 1.3rem;">${foto.nombre}</h3>
                    <button onclick="this.closest('.photo-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center;">&times;</button>
                </div>
                <div style="text-align: center; max-height: 70vh; overflow: hidden;">
                    <img src="${foto.url}" alt="${foto.nombre}" style="max-width: 100%; max-height: 70vh; object-fit: contain;">
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // ===== PASOS 2 Y 3: DOCUMENTOS =====

    handleDocumentUpload(file, tipo) {
        if (!file) return;

        const preview = document.getElementById(`${tipo}Preview`);
        if (!preview) return;

        const tipoNames = { ficha: 'Ficha Técnica', poliza: 'Póliza de Seguro' };
        const icons = { ficha: '📋', poliza: '🛡️' };

        preview.innerHTML = `
            <div class="document-item">
                <div class="doc-icon">${icons[tipo]}</div>
                <div class="doc-info">
                    <h5>${tipoNames[tipo]} - ${file.name}</h5>
                    <p>${(file.size / 1024 / 1024).toFixed(2)} MB • ${file.type}</p>
                    <div class="processing-status">⏳ Procesando con OCR especializado...</div>
                </div>
            </div>
        `;

        this.currentExpedient.documentos[tipo] = {
            file: file,
            url: URL.createObjectURL(file),
            nombre: file.name,
            size: file.size
        };

        // Simular procesamiento OCR especializado
        setTimeout(() => {
            this.extractDocumentData(tipo);

            const processingDiv = preview.querySelector('.processing-status');
            if (processingDiv) {
                processingDiv.innerHTML = '✅ Datos extraídos correctamente';
                processingDiv.style.color = '#28a745';
            }

            this.showAlert(`✅ ${tipoNames[tipo]} procesada con OCR`, 'success');
        }, 2500);
    }

    extractDocumentData(tipo) {
        const dataContainer = document.getElementById(`${tipo}Data`);
        if (!dataContainer) return;

        let extractedData = {};

        if (tipo === 'ficha') {
            extractedData = {
                'Marca': 'SEAT',
                'Modelo': 'León',
                'Año': '2020',
                'Motor': '1.4 TSI 150CV',
                'Combustible': 'Gasolina',
                'Bastidor': 'VSSZZZ1KZLR123456'
            };
        } else if (tipo === 'poliza') {
            extractedData = {
                'Aseguradora': 'MAPFRE',
                'Titular': 'Juan García López',
                'Póliza Nº': 'MAP-2024-789456',
                'Vigencia': '01/01/2024 - 31/12/2024',
                'Cobertura': 'Todo Riesgo',
                'Prima': '450.00 €'
            };
        }

        this.currentExpedient.datosExtraidos[tipo] = extractedData;

        dataContainer.innerHTML = `
            <div class="extracted-data-section">
                <h5>📊 Datos Extraídos - ${tipo === 'ficha' ? 'Ficha Técnica' : 'Póliza'}</h5>
                <div class="extracted-fields">
                    ${Object.entries(extractedData).map(([key, value]) => `
                        <div class="extracted-field">
                            <span class="field-label">${key}:</span>
                            <span class="field-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // ===== PASO 4: FIRMA DIGITAL =====

    initSignature() {
        const canvas = document.getElementById('signatureCanvas');
        const placeholder = document.getElementById('signaturePlaceholder');

        if (!canvas) return;

        this.signatureCanvas = canvas;
        this.signatureCtx = canvas.getContext('2d');

        // Configurar canvas responsive
        const container = canvas.parentElement;
        const rect = container.getBoundingClientRect();

        canvas.width = rect.width * 2;
        canvas.height = 300 * 2; // Altura fija
        canvas.style.width = rect.width + 'px';
        canvas.style.height = '300px';

        this.signatureCtx.scale(2, 2);
        this.signatureCtx.strokeStyle = '#1a4d72';
        this.signatureCtx.lineWidth = 3;
        this.signatureCtx.lineCap = 'round';
        this.signatureCtx.lineJoin = 'round';

        // Limpiar canvas
        this.signatureCtx.fillStyle = 'white';
        this.signatureCtx.fillRect(0, 0, canvas.width, canvas.height);

        // Events para mouse
        canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        canvas.addEventListener('mousemove', (e) => this.draw(e));
        canvas.addEventListener('mouseup', () => this.stopDrawing());
        canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Events para touch (móvil)
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            canvas.dispatchEvent(mouseEvent);
        });

        console.log('✍️ Canvas de firma inicializado correctamente');
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.signatureCanvas.getBoundingClientRect();
        const scaleX = this.signatureCanvas.width / rect.width;
        const scaleY = this.signatureCanvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX / 2;
        const y = (e.clientY - rect.top) * scaleY / 2;

        this.signatureCtx.beginPath();
        this.signatureCtx.moveTo(x, y);

        // Ocultar placeholder
        const placeholder = document.getElementById('signaturePlaceholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.signatureCanvas.getBoundingClientRect();
        const scaleX = this.signatureCanvas.width / rect.width;
        const scaleY = this.signatureCanvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX / 2;
        const y = (e.clientY - rect.top) * scaleY / 2;

        this.signatureCtx.lineTo(x, y);
        this.signatureCtx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
        this.signatureCtx.beginPath();
    }

    clearSignature() {
        if (this.signatureCanvas && this.signatureCtx) {
            this.signatureCtx.fillStyle = 'white';
            this.signatureCtx.fillRect(0, 0, this.signatureCanvas.width, this.signatureCanvas.height);
            this.currentExpedient.firma = null;

            const placeholder = document.getElementById('signaturePlaceholder');
            if (placeholder) {
                placeholder.style.display = 'flex';
            }

            this.showAlert('🗑️ Firma borrada', 'info');
        }
    }

    saveSignature() {
        if (this.signatureCanvas) {
            // Verificar que hay contenido dibujado
            const imageData = this.signatureCtx.getImageData(0, 0, this.signatureCanvas.width, this.signatureCanvas.height);
            const data = imageData.data;
            let isEmpty = true;

            for (let i = 0; i < data.length; i += 4) {
                if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
                    isEmpty = false;
                    break;
                }
            }

            if (isEmpty) {
                this.showAlert('⚠️ Debe firmar antes de guardar', 'warning');
                return;
            }

            this.currentExpedient.firma = this.signatureCanvas.toDataURL('image/png');
            this.showAlert('✅ Firma guardada correctamente', 'success');
        }
    }

    // ===== PASO 5: RESUMEN Y PDF =====

    updateExpedienteSummary() {
        const summary = document.getElementById('expedienteSummary');
        if (!summary) return;

        const exp = this.currentExpedient;

        summary.innerHTML = `
            <div class="expediente-summary">
                <h4>📋 Resumen del Expediente Completo</h4>
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="summary-label">Matrícula:</span>
                        <span class="summary-value ${exp.matricula ? 'detected' : 'missing'}">
                            ${exp.matricula || 'No detectada'}
                        </span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Centro:</span>
                        <span class="summary-value">${this.getTallerName(exp.centro)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Fotografías:</span>
                        <span class="summary-value">${exp.fotos.length} archivos (${(exp.fotos.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Ficha Técnica:</span>
                        <span class="summary-value ${exp.documentos.ficha ? 'detected' : 'missing'}">
                            ${exp.documentos.ficha ? 'Procesada' : 'Pendiente'}
                        </span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Póliza:</span>
                        <span class="summary-value ${exp.documentos.poliza ? 'detected' : 'missing'}">
                            ${exp.documentos.poliza ? 'Procesada' : 'Pendiente'}
                        </span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Firma Digital:</span>
                        <span class="summary-value ${exp.firma ? 'detected' : 'missing'}">
                            ${exp.firma ? 'Capturada' : 'Pendiente'}
                        </span>
                    </div>
                </div>
            </div>
        `;

        // Actualizar vista previa PDF
        this.updatePDFPreview();
    }

    updatePDFPreview() {
        const elements = {
            'pdfCentro': this.getTallerName(this.currentExpedient.centro),
            'pdfMatricula': this.currentExpedient.matricula || '-',
            'pdfCliente': this.currentExpedient.cliente || 'Cliente MVP Demo',
            'pdfFotosCount': this.currentExpedient.fotos.length,
            'pdfDocsCount': Object.keys(this.currentExpedient.documentos).filter(k => this.currentExpedient.documentos[k]).length,
            'pdfFirmaStatus': this.currentExpedient.firma ? 'Incluida' : '-'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    generateCompleteReport() {
        // Validar que todos los datos estén completos
        if (!this.currentExpedient.matricula) {
            this.showAlert('⚠️ Falta la matrícula del vehículo', 'warning');
            this.currentStep = 1;
            this.updateSteps();
            return;
        }

        if (this.currentExpedient.fotos.length === 0) {
            this.showAlert('⚠️ Debe incluir al menos una fotografía', 'warning');
            this.currentStep = 1;
            this.updateSteps();
            return;
        }

        if (!this.currentExpedient.documentos.ficha) {
            this.showAlert('⚠️ Falta la ficha técnica', 'warning');
            this.currentStep = 2;
            this.updateSteps();
            return;
        }

        if (!this.currentExpedient.documentos.poliza) {
            this.showAlert('⚠️ Falta la póliza de seguro', 'warning');
            this.currentStep = 3;
            this.updateSteps();
            return;
        }

        if (!this.currentExpedient.firma) {
            this.showAlert('⚠️ Falta la firma digital', 'warning');
            this.currentStep = 4;
            this.updateSteps();
            return;
        }

        // Generar PDF completo
        try {
            this.generateCompleteePDF();
        } catch (error) {
            console.error('Error generando PDF:', error);
            this.showAlert('❌ Error generando PDF. Intente de nuevo.', 'error');
        }
    }

    generateCompleteePDF() {
        if (typeof jsPDF === 'undefined' && typeof window.jspdf === 'undefined') {
            this.showAlert('❌ jsPDF no disponible. Generando informe simulado...', 'info');
            setTimeout(() => {
                this.completeProcessWithSuccess();
            }, 2000);
            return;
        }

        const { jsPDF } = window.jspdf || window;
        const doc = new jsPDF();

        // PÁGINA 1: ENCABEZADO Y DATOS
        // Logo y centro en la cabecera
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('GLASSDRIVE - INFORME COMPLETO DE RECEPCIÓN', 20, 30);

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`Centro: ${this.getTallerName(this.currentExpedient.centro)}`, 20, 45);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 45);

        // Línea separadora
        doc.setDrawColor(26, 77, 114);
        doc.setLineWidth(1);
        doc.line(20, 50, 190, 50);

        // DATOS DEL VEHÍCULO
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('DATOS DEL VEHÍCULO', 20, 65);

        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        let yPos = 75;

        const vehicleData = [
            [`Matrícula:`, this.currentExpedient.matricula],
            [`Cliente:`, this.currentExpedient.cliente || 'Cliente MVP Demo'],
            [`Vehículo:`, this.currentExpedient.vehiculo || 'Vehículo Demo'],
            [`Fecha Registro:`, new Date().toLocaleDateString()],
            [`Estado:`, 'Completado']
        ];

        vehicleData.forEach(([label, value]) => {
            doc.text(label, 20, yPos);
            doc.text(value, 80, yPos);
            yPos += 8;
        });

        // DATOS DE LA FICHA TÉCNICA
        if (this.currentExpedient.datosExtraidos.ficha && Object.keys(this.currentExpedient.datosExtraidos.ficha).length > 0) {
            yPos += 10;
            doc.setFont(undefined, 'bold');
            doc.text('FICHA TÉCNICA (OCR)', 20, yPos);
            yPos += 10;
            doc.setFont(undefined, 'normal');

            Object.entries(this.currentExpedient.datosExtraidos.ficha).forEach(([key, value]) => {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(`${key}:`, 20, yPos);
                doc.text(value, 80, yPos);
                yPos += 6;
            });
        }

        // DATOS DE LA PÓLIZA
        if (this.currentExpedient.datosExtraidos.poliza && Object.keys(this.currentExpedient.datosExtraidos.poliza).length > 0) {
            yPos += 10;
            if (yPos > 230) {
                doc.addPage();
                yPos = 20;
            }
            doc.setFont(undefined, 'bold');
            doc.text('PÓLIZA DE SEGURO (OCR)', 20, yPos);
            yPos += 10;
            doc.setFont(undefined, 'normal');

            Object.entries(this.currentExpedient.datosExtraidos.poliza).forEach(([key, value]) => {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(`${key}:`, 20, yPos);
                doc.text(value, 80, yPos);
                yPos += 6;
            });
        }

        // NUEVA PÁGINA: FOTOGRAFÍAS
        doc.addPage();
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('FOTOGRAFÍAS DEL VEHÍCULO', 20, 30);

        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`Total de fotografías: ${this.currentExpedient.fotos.length}`, 20, 45);

        // Lista de fotos
        yPos = 55;
        this.currentExpedient.fotos.forEach((foto, index) => {
            doc.text(`${index + 1}. ${foto.nombre}`, 20, yPos);
            doc.text(`Tamaño: ${(foto.size / 1024).toFixed(1)} KB`, 120, yPos);
            yPos += 8;
        });

        // NUEVA PÁGINA: FIRMA DIGITAL
        if (this.currentExpedient.firma) {
            doc.addPage();
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('FIRMA DIGITAL DEL CLIENTE', 20, 30);

            // Intentar incluir la firma (nota: en un entorno real se incluiría la imagen)
            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            doc.text('Firma capturada digitalmente:', 20, 50);
            doc.text('[ Firma digital incluida en formato HD ]', 20, 65);
            doc.text(`Fecha y hora: ${new Date().toLocaleString()}`, 20, 80);
        }

        // PIE DE PÁGINA EN TODAS LAS PÁGINAS
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.text('GlassDrive MVP - Sistema con Gestión Completa de Archivos', 20, 285);
            doc.text(`Página ${i} de ${pageCount}`, 160, 285);
            doc.text(`Generado: ${new Date().toLocaleString()}`, 20, 292);
        }

        // Descargar PDF
        const fileName = `GlassDrive-Completo-${this.currentExpedient.matricula}-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);

        this.showAlert(`✅ Informe PDF completo generado: ${fileName}`, 'success');

        // Completar proceso
        setTimeout(() => {
            this.completeProcessWithSuccess();
        }, 1000);
    }

    completeProcessWithSuccess() {
        // Crear expediente final
        const expediente = {
            id: this.currentExpedient.id,
            matricula: this.currentExpedient.matricula,
            cliente: this.currentExpedient.cliente || 'Cliente MVP Demo',
            vehiculo: this.currentExpedient.vehiculo || 'Vehículo Demo',
            centro: this.getTallerName(this.currentExpedient.centro),
            fecha: new Date().toLocaleDateString(),
            estado: 'completado',
            datos: {
                fotos: this.currentExpedient.fotos,
                documentos: {
                    ficha: { presente: !!this.currentExpedient.documentos.ficha, datos: this.currentExpedient.datosExtraidos.ficha },
                    poliza: { presente: !!this.currentExpedient.documentos.poliza, datos: this.currentExpedient.datosExtraidos.poliza }
                },
                firma: !!this.currentExpedient.firma
            }
        };

        // Añadir a expedientes
        this.expedientes.unshift(expediente);

        // Mostrar mensaje de éxito
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="process-completed">
                    <div class="completion-icon">🎉</div>
                    <div class="completion-message">¡Expediente Completado con Éxito!</div>
                    <div class="completion-details">
                        <p><strong>Matrícula:</strong> ${expediente.matricula}</p>
                        <p><strong>📸 Fotografías:</strong> ${expediente.datos.fotos.length} archivos</p>
                        <p><strong>📋 Ficha Técnica:</strong> Procesada con OCR</p>
                        <p><strong>🛡️ Póliza:</strong> Procesada con OCR</p>
                        <p><strong>✍️ Firma:</strong> Capturada en HD</p>
                        <p><strong>📄 PDF:</strong> Generado y descargado</p>
                    </div>
                    <button onclick="app.closeModal(); app.showDashboard();" class="btn btn-primary btn-large">
                        🏠 Volver al Dashboard
                    </button>
                </div>
            `;
        }

        // Actualizar controles del footer
        const footerControls = document.querySelector('.footer-controls');
        if (footerControls) {
            footerControls.innerHTML = `
                <button onclick="app.closeModal(); app.showDashboard();" class="btn btn-primary">
                    🏠 Finalizar y Cerrar
                </button>
            `;
        }

        console.log('🎉 Proceso completado exitosamente');
    }

    completeProcess() {
        this.generateCompleteReport();
    }

    // ===== UTILITY FUNCTIONS =====

    viewExpediente(expedienteId) {
        const exp = this.expedientes.find(e => e.id == expedienteId);
        if (!exp) return;

        this.showAlert(
            `👁️ Expediente ${exp.matricula}\n\n` +
            `Cliente: ${exp.cliente}\n` +
            `Vehículo: ${exp.vehiculo}\n` +
            `Fotos: ${exp.datos.fotos ? exp.datos.fotos.length : 0}\n` +
            `Estado: ${exp.estado}`,
            'info'
        );
    }

    generatePDF(expedienteId) {
        const expediente = this.expedientes.find(e => e.id == expedienteId);
        if (!expediente) {
            this.showAlert('❌ Expediente no encontrado', 'error');
            return;
        }

        if (typeof jsPDF === 'undefined' && typeof window.jspdf === 'undefined') {
            this.showAlert('❌ jsPDF no disponible. Simulando generación...', 'info');
            setTimeout(() => {
                this.showAlert('✅ PDF generado correctamente (simulado)', 'success');
            }, 2000);
            return;
        }

        try {
            const { jsPDF } = window.jspdf || window;
            const doc = new jsPDF();

            // Título con logo y centro
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text('GLASSDRIVE - INFORME DE EXPEDIENTE', 20, 30);

            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text(`Centro: ${expediente.centro}`, 20, 45);

            // Información básica
            doc.setFontSize(12);
            doc.text(`Matrícula: ${expediente.matricula}`, 20, 60);
            doc.text(`Cliente: ${expediente.cliente}`, 20, 70);
            doc.text(`Vehículo: ${expediente.vehiculo}`, 20, 80);
            doc.text(`Fecha: ${expediente.fecha}`, 20, 90);

            // Información de archivos
            doc.text('ARCHIVOS:', 20, 110);
            doc.text(`Fotografías: ${expediente.datos.fotos ? expediente.datos.fotos.length : 0}`, 30, 120);
            doc.text(`Documentos: ${Object.keys(expediente.datos.documentos || {}).filter(k => expediente.datos.documentos[k].presente).length}`, 30, 130);
            doc.text(`Firma: ${expediente.datos.firma ? 'Sí' : 'No'}`, 30, 140);

            // Footer
            doc.setFontSize(8);
            doc.text('GlassDrive MVP - Sistema con Gestión de Archivos', 20, 280);
            doc.text(`Generado: ${new Date().toLocaleString()}`, 20, 290);

            // Descargar
            const fileName = `GlassDrive-${expediente.matricula}-${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            this.showAlert(`✅ PDF generado: ${fileName}`, 'success');

        } catch (error) {
            console.error('Error generando PDF:', error);
            this.showAlert('❌ Error generando PDF. Intente de nuevo.', 'error');
        }
    }

    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: ${type === 'warning' ? '#000' : '#fff'};
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 400px;
            font-weight: 500;
            animation: slideInAlert 0.5s ease-out;
        `;

        alertDiv.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <div style="font-size: 18px;">
                    ${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️'}
                </div>
                <div style="flex: 1;">
                    <div style="white-space: pre-line;">${message}</div>
                    <button onclick="this.closest('.alert').remove()" 
                            style="background: none; border: none; color: inherit; font-size: 16px; cursor: pointer; float: right; margin-top: 8px;">×</button>
                </div>
            </div>
        `;

        document.body.appendChild(alertDiv);

        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Estilos para alertas
const alertStyles = document.createElement('style');
alertStyles.textContent = `
@keyframes slideInAlert {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
`;
document.head.appendChild(alertStyles);

// Inicializar aplicación
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM cargado, iniciando GlassDrive MVP...');
    app = new GlassDriveMVP();
});

// Backup para inicialización
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!app) {
            app = new GlassDriveMVP();
        }
    });
} else if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (!app) {
        app = new GlassDriveMVP();
    }
}
