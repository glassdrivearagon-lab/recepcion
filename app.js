// GLASSDRIVE MVP - SISTEMA CALIBRACIONES FUNCIONAL

const TECNICOS_DEMO = [
    'José Pérez',
    'María Sánchez', 
    'Miguel Rodríguez',
    'Laura Gómez',
    'Carlos Martínez',
    'Ana López'
];

class GlassDriveMVP {
    constructor() {
        this.currentTaller = null;
        this.currentStep = 1;
        this.maxSteps = 5;
        this.expedientes = this.loadMVPData();
        this.calibraciones = this.loadCalibracionesData();
        this.currentExpedient = this.resetExpedient();
        this.currentCalibracion = null;
        this.cameraStream = null;
        this.signatureCanvas = null;
        this.signatureCtx = null;
        this.isDrawing = false;
        this.showingCalibracionesTab = 'pendientes';

        console.log('🚀 GlassDrive MVP con Calibraciones iniciando...');
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }

        this.updateStats();
        console.log('✅ MVP con calibraciones listo');
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
                requiereCalibracion: true,
                datos: {
                    fotos: [
                        { id: 1, url: this.generateDemoImage('Frontal vehículo'), nombre: 'Frontal del vehículo', size: 245000, fecha: new Date() },
                        { id: 2, url: this.generateDemoImage('Lateral izquierdo'), nombre: 'Lateral izquierdo', size: 312000, fecha: new Date() }
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
                requiereCalibracion: false,
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

    loadCalibracionesData() {
        return [
            {
                id: 1,
                matricula: '6792LNJ',
                cliente: 'Juan García López',
                vehiculo: 'SEAT León 1.4 TSI',
                centro: 'Monzón',
                fechaCreacion: new Date(Date.now() - 172800000).toLocaleDateString(),
                estado: 'pendiente',
                tecnico: null,
                fechaCompletado: null,
                observaciones: '',
                resultadoCalibracion: null,
                detallesProblema: '',
                accionesRealizadas: ''
            },
            {
                id: 2,
                matricula: '9876XYZ',
                cliente: 'Carlos Martínez Vila',
                vehiculo: 'AUDI A4 2.0 TDI',
                centro: 'Monzón',
                fechaCreacion: new Date(Date.now() - 86400000).toLocaleDateString(),
                estado: 'completada',
                tecnico: 'José Pérez',
                fechaCompletado: new Date().toLocaleDateString(),
                observaciones: 'Calibración estándar ADAS',
                resultadoCalibracion: 'ok',
                detallesProblema: '',
                accionesRealizadas: 'Calibración completa de cámaras frontales'
            }
        ];
    }

    generateDemoImage(text) {
        try {
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
        } catch (error) {
            console.error('Error generando imagen demo:', error);
            return '';
        }
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
            firma: null,
            requiereCalibracion: false
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

        // MODAL DE REGISTRO
        this.setupModal();

        // CÁMARA Y FOTOS
        this.setupCamera();

        // DOCUMENTOS
        this.setupDocuments();

        // CALIBRACIÓN - FUNCIONAL
        this.setupCalibracion();

        // FIRMA
        this.setupSignature();

        // GESTIÓN DE CALIBRACIONES
        this.setupCalibracionManagement();

        console.log('✅ Event listeners configurados');
    }

    setupNavigation() {
        const navButtons = {
            'btnLogout': () => this.logout(),
            'btnDashboard': () => this.showDashboard(),
            'btnNuevoRegistro': () => this.openModal(),
            'btnCalibraciones': () => this.showCalibraciones()
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
            'finishStep': () => this.finishRegistro(),
            'generatePDFBtn': () => this.generateCompletePDF()
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
        }

        if (input) {
            input.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleDocumentUpload(e.target.files[0], tipo);
                }
            });
        }
    }

    // ===== CALIBRACIÓN FUNCIONAL =====
    setupCalibracion() {
        const calibracionNo = document.getElementById('calibracionNo');
        const calibracionSi = document.getElementById('calibracionSi');

        if (calibracionNo) {
            calibracionNo.addEventListener('click', () => {
                // Marcar como seleccionado
                calibracionNo.classList.add('selected');
                calibracionSi.classList.remove('selected');

                // Procesar decisión
                this.handleCalibracionDecision(false);

                // CRÍTICO: Avanzar automáticamente
                setTimeout(() => {
                    this.nextStep();
                }, 1000);
            });
        }

        if (calibracionSi) {
            calibracionSi.addEventListener('click', () => {
                // Marcar como seleccionado
                calibracionSi.classList.add('selected');
                calibracionNo.classList.remove('selected');

                // Procesar decisión
                this.handleCalibracionDecision(true);

                // CRÍTICO: Avanzar automáticamente  
                setTimeout(() => {
                    this.nextStep();
                }, 1000);
            });
        }
    }

    setupCalibracionManagement() {
        // Pestañas de calibraciones
        const tabPendientes = document.getElementById('tabPendientes');
        const tabCompletadas = document.getElementById('tabCompletadas');

        if (tabPendientes) {
            tabPendientes.addEventListener('click', () => this.showCalibracionesTab('pendientes'));
        }

        if (tabCompletadas) {
            tabCompletadas.addEventListener('click', () => this.showCalibracionesTab('completadas'));
        }

        // Modal de calibración
        const closeCalibracionModal = document.getElementById('closeCalibracionModal');
        const cancelCalibracion = document.getElementById('cancelCalibracion');
        const saveCalibracion = document.getElementById('saveCalibracion');

        if (closeCalibracionModal) {
            closeCalibracionModal.addEventListener('click', () => this.closeCalibracionModal());
        }

        if (cancelCalibracion) {
            cancelCalibracion.addEventListener('click', () => this.closeCalibracionModal());
        }

        if (saveCalibracion) {
            saveCalibracion.addEventListener('click', () => this.saveCalibracionProcess());
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

    // ===== GESTIÓN DE NAVEGACIÓN =====

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
                    userInfo.textContent = `Centro: ${this.getTallerName(taller)}`;
                }

                this.updateStats();
                this.showDashboard();

                this.showAlert('✅ MVP iniciado correctamente', 'success');
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

    showCalibraciones() {
        this.hideAllSections();
        this.showSection('calibraciones');
        this.updateNavigation('btnCalibraciones');
        this.loadCalibracionesList();
    }

    showCalibracionesTab(tab) {
        this.showingCalibracionesTab = tab;

        const tabPendientes = document.getElementById('tabPendientes');
        const tabCompletadas = document.getElementById('tabCompletadas');

        if (tabPendientes && tabCompletadas) {
            tabPendientes.classList.toggle('active', tab === 'pendientes');
            tabCompletadas.classList.toggle('active', tab === 'completadas');
        }

        this.loadCalibracionesList();
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
        let totalCalibraciones = 0;

        this.expedientes.forEach(exp => {
            if (exp.datos.fotos) totalFotos += exp.datos.fotos.length;
            if (exp.datos.documentos?.ficha?.presente) totalDocumentos++;
            if (exp.datos.documentos?.poliza?.presente) totalDocumentos++;
            if (exp.estado === 'completado') totalPDFs++;
        });

        if (this.currentTaller) {
            totalCalibraciones = this.calibraciones.filter(cal => 
                cal.centro === this.getTallerName(this.currentTaller)
            ).length;
        }

        this.animateNumber('totalVehiculos', this.expedientes.length);
        this.animateNumber('totalFotos', totalFotos);
        this.animateNumber('totalCalibraciones', totalCalibraciones);
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

            const item = document.createElement('div');
            item.className = 'recent-item';
            item.innerHTML = `
                <div class="recent-header">
                    <div class="recent-matricula">${exp.matricula}</div>
                    <div class="recent-status">${exp.estado === 'completado' ? '✅' : '⚙️'}</div>
                </div>
                <div class="recent-info">
                    <p><strong>${exp.cliente}</strong></p>
                    <p>${exp.vehiculo}</p>
                    <div class="recent-stats">
                        <span class="stat-item">📸 ${fotosCount}</span>
                        <span class="stat-item">🎯 ${exp.requiereCalibracion ? 'Sí' : 'No'}</span>
                        <span class="stat-item">📅 ${exp.fecha}</span>
                    </div>
                </div>
            `;

            list.appendChild(item);
        });
    }

    loadCalibracionesList() {
        const container = document.getElementById('calibracionesList');
        if (!container) return;

        container.innerHTML = '';

        let filteredCalibraciones = this.calibraciones.filter(cal => 
            cal.centro === this.getTallerName(this.currentTaller)
        );

        if (this.showingCalibracionesTab === 'pendientes') {
            filteredCalibraciones = filteredCalibraciones.filter(cal => 
                cal.estado === 'pendiente' || cal.estado === 'en_proceso'
            );
        } else {
            filteredCalibraciones = filteredCalibraciones.filter(cal => 
                cal.estado === 'completada'
            );
        }

        this.updateCalibracionCounters();

        if (filteredCalibraciones.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎯</div>
                    <h3>No hay calibraciones ${this.showingCalibracionesTab}</h3>
                    <p>Las calibraciones aparecerán aquí cuando se generen</p>
                </div>
            `;
            return;
        }

        filteredCalibraciones.forEach(calibracion => {
            const card = document.createElement('div');
            card.className = 'calibracion-card';

            const statusClass = calibracion.estado === 'completada' ? 
                (calibracion.resultadoCalibracion === 'ok' ? 'completada' : 'problema') : 
                '';

            const statusText = {
                'pendiente': '🔄 Pendiente',
                'en_proceso': '⚙️ En Proceso',
                'completada': calibracion.resultadoCalibracion === 'ok' ? '✅ Completada OK' : '⚠️ Con Problemas'
            };

            card.innerHTML = `
                <div class="calibracion-header ${statusClass}">
                    <div class="calibracion-matricula">${calibracion.matricula}</div>
                    <div class="calibracion-status">${statusText[calibracion.estado]}</div>
                </div>
                <div class="calibracion-body">
                    <div class="calibracion-info">
                        <div class="calibracion-info-item">
                            <span class="calibracion-info-label">Cliente:</span>
                            <span class="calibracion-info-value">${calibracion.cliente}</span>
                        </div>
                        <div class="calibracion-info-item">
                            <span class="calibracion-info-label">Vehículo:</span>
                            <span class="calibracion-info-value">${calibracion.vehiculo}</span>
                        </div>
                        <div class="calibracion-info-item">
                            <span class="calibracion-info-label">Fecha:</span>
                            <span class="calibracion-info-value">${calibracion.fechaCreacion}</span>
                        </div>
                    </div>
                    <div class="calibracion-actions">
                        ${calibracion.estado === 'pendiente' ? 
                            `<button onclick="app.startCalibracionProcess(${calibracion.id})" class="btn btn-warning btn-sm">🎯 Procesar</button>` :
                            `<button onclick="app.viewCalibracionDetails(${calibracion.id})" class="btn btn-info btn-sm">👁️ Ver</button>`
                        }
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    }

    updateCalibracionCounters() {
        const pendientesCount = this.calibraciones.filter(cal => 
            cal.centro === this.getTallerName(this.currentTaller) && 
            (cal.estado === 'pendiente' || cal.estado === 'en_proceso')
        ).length;

        const completadasCount = this.calibraciones.filter(cal => 
            cal.centro === this.getTallerName(this.currentTaller) && 
            cal.estado === 'completada'
        ).length;

        const pendientesElement = document.getElementById('pendientesCount');
        const completadasElement = document.getElementById('completadasCount');

        if (pendientesElement) pendientesElement.textContent = pendientesCount;
        if (completadasElement) completadasElement.textContent = completadasCount;
    }

    // ===== MODAL DE REGISTRO CON 5 PASOS =====

    openModal() {
        if (!this.currentTaller) {
            this.showAlert('⚠️ Primero debe iniciar sesión', 'warning');
            return;
        }

        this.currentExpedient = this.resetExpedient();
        this.currentStep = 1;
        this.updateSteps();
        this.updateProgress();

        const modal = document.getElementById('registroModal');
        if (modal) {
            modal.classList.add('active');
            console.log('✅ Modal abierto - 5 pasos con calibración');
        }
    }

    closeModal() {
        const modal = document.getElementById('registroModal');
        if (modal) {
            modal.classList.remove('active');
        }

        if (this.cameraStream) {
            try {
                this.cameraStream.getTracks().forEach(track => track.stop());
                this.cameraStream = null;
            } catch (error) {
                console.error('Error cerrando cámara:', error);
            }
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

        // Actualizar botones de navegación - CRÍTICO
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const finishBtn = document.getElementById('finishStep');

        if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        if (nextBtn) nextBtn.style.display = this.currentStep < this.maxSteps ? 'block' : 'none';
        if (finishBtn) finishBtn.style.display = this.currentStep === this.maxSteps ? 'block' : 'none';

        // Configurar funcionalidades específicas del paso
        if (this.currentStep === 4) {
            setTimeout(() => this.initSignature(), 200);
        } else if (this.currentStep === 5) {
            this.updateSummary();
        }

        console.log(`📍 Paso ${this.currentStep} de ${this.maxSteps} activo`);
    }

    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const percentage = (this.currentStep / this.maxSteps) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }

    nextStep() {
        if (this.currentStep < this.maxSteps) {
            this.currentStep++;
            this.updateSteps();
            this.updateProgress();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateSteps();
            this.updateProgress();
        }
    }

    // ===== PASO 1: CÁMARA =====

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
                captureBtn.style.display = 'block';

                this.showAlert('📷 Cámara activada', 'success');
            }
        } catch (error) {
            console.error('Error accediendo a la cámara:', error);
            this.showAlert('❌ No se pudo acceder a la cámara', 'warning');
        }
    }

    capturePhoto() {
        try {
            const preview = document.getElementById('cameraPreview');
            const canvas = document.getElementById('photoCanvas');

            if (!preview || !canvas) return;

            canvas.width = preview.videoWidth || 640;
            canvas.height = preview.videoHeight || 480;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(preview, 0, 0);

            canvas.toBlob((blob) => {
                if (blob) {
                    const foto = {
                        id: Date.now(),
                        url: URL.createObjectURL(blob),
                        nombre: `Captura-${new Date().toLocaleTimeString()}.jpg`,
                        size: blob.size,
                        fecha: new Date(),
                        blob: blob
                    };

                    this.currentExpedient.fotos.push(foto);
                    this.updatePhotosGrid();

                    if (this.currentExpedient.fotos.length === 1) {
                        setTimeout(() => this.processOCR(), 1500);
                    }

                    this.showAlert('📸 Foto capturada', 'success');
                }
            }, 'image/jpeg', 0.8);
        } catch (error) {
            console.error('Error capturando foto:', error);
            this.showAlert('❌ Error al capturar foto', 'warning');
        }
    }

    handlePhotoUpload(event) {
        try {
            const files = Array.from(event.target.files);

            files.forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const foto = {
                        id: Date.now() + index,
                        url: URL.createObjectURL(file),
                        nombre: file.name,
                        size: file.size,
                        fecha: new Date(),
                        blob: file
                    };

                    this.currentExpedient.fotos.push(foto);
                }
            });

            this.updatePhotosGrid();

            if (files.length > 0 && this.currentExpedient.fotos.length === files.length) {
                setTimeout(() => this.processOCR(), 1000);
            }

            this.showAlert(`📁 ${files.length} foto(s) subida(s)`, 'success');
            event.target.value = '';
        } catch (error) {
            console.error('Error subiendo fotos:', error);
            this.showAlert('❌ Error al subir fotos', 'warning');
        }
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
                </div>
            `;
            return;
        }

        this.currentExpedient.fotos.forEach((foto) => {
            const item = document.createElement('div');
            item.className = 'photo-item';
            item.innerHTML = `
                <div class="photo-thumbnail">
                    <img src="${foto.url}" alt="${foto.nombre}" loading="lazy">
                </div>
                <div class="photo-info">
                    <div class="photo-name">${foto.nombre}</div>
                    <div class="photo-meta">${(foto.size / 1024).toFixed(1)} KB</div>
                </div>
            `;
            grid.appendChild(item);
        });
    }

    processOCR() {
        const result = document.getElementById('ocrResult');
        if (!result) return;

        result.innerHTML = `
            <div class="ocr-processing">
                <div class="processing-spinner"></div>
                <h4>🔍 PROCESANDO CON OCR</h4>
                <p>Analizando imagen...</p>
            </div>
        `;

        setTimeout(() => {
            this.currentExpedient.matricula = '6792LNJ';

            result.innerHTML = `
                <div class="ocr-success">
                    <div class="success-icon">✅</div>
                    <h4>🎯 MATRÍCULA DETECTADA</h4>
                    <div class="matricula-display">6792LNJ</div>
                    <button onclick="app.confirmMatricula()" class="btn btn-success btn-mobile">✅ Confirmar</button>
                </div>
            `;
        }, 3000);
    }

    confirmMatricula() {
        this.showAlert('✅ Matrícula 6792LNJ confirmada', 'success');
    }

    // ===== PASO 2: DOCUMENTOS =====

    handleDocumentUpload(file, tipo) {
        try {
            if (!file) return;

            const preview = document.getElementById(`${tipo}Preview`);
            if (!preview) return;

            preview.innerHTML = `
                <div class="document-item">
                    <div class="doc-icon">${tipo === 'ficha' ? '📋' : '🛡️'}</div>
                    <div class="doc-info">
                        <h5>${file.name}</h5>
                        <p>${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <div class="processing">⏳ Procesando...</div>
                    </div>
                </div>
            `;

            this.currentExpedient.documentos[tipo] = {
                file: file,
                url: URL.createObjectURL(file),
                nombre: file.name,
                size: file.size
            };

            setTimeout(() => {
                const processingDiv = preview.querySelector('.processing');
                if (processingDiv) {
                    processingDiv.innerHTML = '✅ Procesado correctamente';
                    processingDiv.style.color = '#28a745';
                }

                this.showAlert(`✅ ${tipo === 'ficha' ? 'Ficha' : 'Póliza'} procesada`, 'success');
            }, 2000);
        } catch (error) {
            console.error(`Error subiendo ${tipo}:`, error);
            this.showAlert(`❌ Error al subir ${tipo}`, 'warning');
        }
    }

    // ===== PASO 3: CALIBRACIÓN FUNCIONAL =====

    handleCalibracionDecision(requiere) {
        this.currentExpedient.requiereCalibracion = requiere;

        const calibracionInfo = document.getElementById('calibracionInfo');

        if (requiere) {
            // Crear registro de calibración
            const nuevaCalibracion = {
                id: Date.now(),
                matricula: this.currentExpedient.matricula || '6792LNJ',
                cliente: 'Cliente MVP Demo',
                vehiculo: 'Vehículo Demo',
                centro: this.getTallerName(this.currentTaller),
                fechaCreacion: new Date().toLocaleDateString(),
                estado: 'pendiente',
                tecnico: null,
                fechaCompletado: null,
                observaciones: '',
                resultadoCalibracion: null,
                detallesProblema: '',
                accionesRealizadas: ''
            };

            this.calibraciones.unshift(nuevaCalibracion);

            if (calibracionInfo) {
                calibracionInfo.style.display = 'block';
            }

            this.showAlert('🎯 Calibración requerida\n\nSe ha creado un registro pendiente', 'warning');
        } else {
            if (calibracionInfo) {
                calibracionInfo.style.display = 'none';
            }

            this.showAlert('✅ No requiere calibración', 'success');
        }

        console.log(`📝 Calibración: ${requiere ? 'SÍ' : 'NO'}`);
    }

    // ===== PASO 4: FIRMA =====

    initSignature() {
        try {
            const canvas = document.getElementById('signatureCanvas');
            if (!canvas) return;

            this.signatureCanvas = canvas;
            this.signatureCtx = canvas.getContext('2d');

            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';

            this.signatureCtx.scale(dpr, dpr);
            this.signatureCtx.strokeStyle = '#1a4d72';
            this.signatureCtx.lineWidth = 3;
            this.signatureCtx.lineCap = 'round';
            this.signatureCtx.lineJoin = 'round';

            // Events para mouse
            canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
            canvas.addEventListener('mousemove', (e) => this.draw(e));
            canvas.addEventListener('mouseup', () => this.stopDrawing());

            // Events para touch
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                this.startDrawing(touch);
            });
            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                this.draw(touch);
            });
            canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.stopDrawing();
            });

            console.log('✍️ Canvas de firma inicializado');
        } catch (error) {
            console.error('Error inicializando firma:', error);
        }
    }

    startDrawing(e) {
        try {
            this.isDrawing = true;
            const rect = this.signatureCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.signatureCtx.beginPath();
            this.signatureCtx.moveTo(x, y);

            const placeholder = document.getElementById('signaturePlaceholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        } catch (error) {
            console.error('Error iniciando dibujo:', error);
        }
    }

    draw(e) {
        try {
            if (!this.isDrawing) return;

            const rect = this.signatureCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.signatureCtx.lineTo(x, y);
            this.signatureCtx.stroke();
        } catch (error) {
            console.error('Error dibujando:', error);
        }
    }

    stopDrawing() {
        this.isDrawing = false;
        if (this.signatureCtx) {
            this.signatureCtx.beginPath();
        }
    }

    clearSignature() {
        try {
            if (this.signatureCanvas && this.signatureCtx) {
                this.signatureCtx.clearRect(0, 0, this.signatureCanvas.width, this.signatureCanvas.height);
                this.currentExpedient.firma = null;

                const placeholder = document.getElementById('signaturePlaceholder');
                if (placeholder) {
                    placeholder.style.display = 'flex';
                }

                this.showAlert('🗑️ Firma borrada', 'info');
            }
        } catch (error) {
            console.error('Error limpiando firma:', error);
        }
    }

    saveSignature() {
        try {
            if (this.signatureCanvas) {
                this.currentExpedient.firma = this.signatureCanvas.toDataURL('image/png');
                this.showAlert('✅ Firma guardada', 'success');
            }
        } catch (error) {
            console.error('Error guardando firma:', error);
        }
    }

    // ===== PASO 5: RESUMEN Y PDF =====

    updateSummary() {
        const summaryContent = document.getElementById('summaryContent');
        if (!summaryContent) return;

        const exp = this.currentExpedient;

        summaryContent.innerHTML = `
            <div class="summary-item">
                <label>Matrícula:</label>
                <span class="${exp.matricula ? 'detected' : 'missing'}">
                    ${exp.matricula || 'No detectada'}
                </span>
            </div>
            <div class="summary-item">
                <label>Centro:</label>
                <span>${this.getTallerName(exp.centro)}</span>
            </div>
            <div class="summary-item">
                <label>Fotos:</label>
                <span>${exp.fotos.length} archivos</span>
            </div>
            <div class="summary-item">
                <label>Ficha Técnica:</label>
                <span class="${exp.documentos.ficha ? 'detected' : 'missing'}">
                    ${exp.documentos.ficha ? 'Subida' : 'Pendiente'}
                </span>
            </div>
            <div class="summary-item">
                <label>Póliza:</label>
                <span class="${exp.documentos.poliza ? 'detected' : 'missing'}">
                    ${exp.documentos.poliza ? 'Subida' : 'Pendiente'}
                </span>
            </div>
            <div class="summary-item">
                <label>Calibración:</label>
                <span class="${exp.requiereCalibracion ? 'calibracion-required' : 'detected'}">
                    ${exp.requiereCalibracion ? 'Requerida' : 'No necesaria'}
                </span>
            </div>
            <div class="summary-item">
                <label>Firma:</label>
                <span class="${exp.firma ? 'detected' : 'missing'}">
                    ${exp.firma ? 'Capturada' : 'Pendiente'}
                </span>
            </div>
        `;
    }

    generateCompletePDF() {
        try {
            const btn = document.getElementById('generatePDFBtn');
            if (btn) {
                btn.innerHTML = '⏳ Generando PDF...';
                btn.disabled = true;
            }

            if (!this.currentExpedient.fotos.length) {
                this.showAlert('⚠️ Necesita al menos una foto', 'warning');
                if (btn) {
                    btn.innerHTML = '📥 Descargar Informe PDF';
                    btn.disabled = false;
                }
                return;
            }

            // Simular generación de PDF
            setTimeout(() => {
                const exp = this.currentExpedient;
                const centerName = this.getTallerName(this.currentTaller);
                const fileName = `GlassDrive-${exp.matricula || 'MVP'}-${centerName}-${new Date().toISOString().split('T')[0]}.pdf`;

                this.showAlert(
                    `✅ PDF GENERADO EXITOSAMENTE\n\n` +
                    `📄 ${fileName}\n` +
                    `🏢 Centro: ${centerName}\n` +
                    `🚗 Matrícula: ${exp.matricula || 'MVP Demo'}\n` +
                    `📸 Fotos: ${exp.fotos.length}\n` +
                    `🎯 Calibración: ${exp.requiereCalibracion ? 'Requerida' : 'No'}\n` +
                    `✍️ Firma: ${exp.firma ? 'Incluida' : 'No'}`,
                    'success'
                );

                setTimeout(() => {
                    this.finishRegistro();
                }, 2000);

            }, 1500);

        } catch (error) {
            console.error('Error generando PDF:', error);
            this.showAlert('❌ Error al generar PDF', 'danger');
        }
    }

    finishRegistro() {
        try {
            const expediente = {
                id: this.currentExpedient.id,
                matricula: this.currentExpedient.matricula || 'MVP-Demo',
                cliente: 'Cliente MVP',
                vehiculo: 'Vehículo MVP',
                centro: this.getTallerName(this.currentExpedient.centro),
                fecha: new Date().toLocaleDateString(),
                estado: 'completado',
                requiereCalibracion: this.currentExpedient.requiereCalibracion,
                datos: {
                    fotos: this.currentExpedient.fotos,
                    documentos: {
                        ficha: { presente: !!this.currentExpedient.documentos.ficha },
                        poliza: { presente: !!this.currentExpedient.documentos.poliza }
                    },
                    firma: !!this.currentExpedient.firma
                }
            };

            this.expedientes.unshift(expediente);
            this.closeModal();
            this.showDashboard();

            this.showAlert(
                `🎉 PROCESO COMPLETADO EXITOSAMENTE\n\n` +
                `📋 Expediente: ${expediente.matricula}\n` +
                `🎯 Calibración: ${expediente.requiereCalibracion ? 'Requerida' : 'No'}\n` +
                `✅ PDF generado y expediente guardado`,
                'success'
            );

        } catch (error) {
            console.error('Error finalizando registro:', error);
            this.showAlert('❌ Error al finalizar registro', 'danger');
        }
    }

    // ===== GESTIÓN DE CALIBRACIONES CON DROPDOWN =====

    startCalibracionProcess(calibracionId) {
        const calibracion = this.calibraciones.find(c => c.id === calibracionId);
        if (!calibracion) return;

        this.currentCalibracion = calibracion;
        this.openCalibracionModal('process');
    }

    viewCalibracionDetails(calibracionId) {
        const calibracion = this.calibraciones.find(c => c.id === calibracionId);
        if (!calibracion) return;

        this.currentCalibracion = calibracion;
        this.openCalibracionModal('view');
    }

    openCalibracionModal(mode) {
        const modal = document.getElementById('calibracionModal');
        const content = document.getElementById('calibracionContent');

        if (!modal || !content || !this.currentCalibracion) return;

        if (mode === 'process') {
            content.innerHTML = this.getCalibracionProcessHTML();

            // Configurar event listeners para botones de resultado
            setTimeout(() => {
                this.setupCalibracionResultButtons();
            }, 100);
        } else {
            content.innerHTML = this.getCalibracionViewHTML();
        }

        modal.classList.add('active');
    }

    getCalibracionProcessHTML() {
        const options = TECNICOS_DEMO.map(t => `<option value="${t}">${t}</option>`).join('');
        return `
            <div class="calibracion-process-form">
                <div class="calibracion-vehicle-info">
                    <h4>🚗 Información del Vehículo</h4>
                    <div class="vehicle-details">
                        <div class="detail-row">
                            <span class="detail-label">Matrícula:</span>
                            <span class="detail-value">${this.currentCalibracion.matricula}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Cliente:</span>
                            <span class="detail-value">${this.currentCalibracion.cliente}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Vehículo:</span>
                            <span class="detail-value">${this.currentCalibracion.vehiculo}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Fecha:</span>
                            <span class="detail-value">${this.currentCalibracion.fechaCreacion}</span>
                        </div>
                    </div>
                </div>

                <div class="calibracion-form-section">
                    <h4>👨‍🔧 Seleccionar Técnico</h4>
                    <div class="form-group custom-select">
                        <label for="tecnicoNombre">Técnico responsable:</label>
                        <select id="tecnicoNombre" required>
                            <option value="" disabled selected>-- Seleccionar técnico --</option>
                            ${options}
                        </select>
                    </div>
                </div>

                <div class="calibracion-form-section">
                    <h4>🎯 Resultado de la Calibración</h4>
                    <div class="calibracion-result-options">
                        <button id="resultadoOk" class="btn btn-success calibracion-result-btn">
                            ✅ Calibración OK
                        </button>
                        <button id="resultadoProblema" class="btn btn-warning calibracion-result-btn">
                            ⚠️ Calibración con Problemas
                        </button>
                    </div>
                </div>

                <div class="calibracion-form-section">
                    <h4>📝 Observaciones</h4>
                    <div class="form-group">
                        <textarea id="observaciones" placeholder="Observaciones generales..." rows="3"></textarea>
                    </div>
                </div>

                <div class="calibracion-form-section" id="problemasSection" style="display: none;">
                    <h4>🔧 Detalles de Problemas</h4>
                    <div class="form-group">
                        <label for="detallesProblema">Problemas encontrados:</label>
                        <textarea id="detallesProblema" placeholder="Describa los problemas..." rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="accionesRealizadas">Acciones realizadas:</label>
                        <textarea id="accionesRealizadas" placeholder="Describa las acciones..." rows="3"></textarea>
                    </div>
                </div>
            </div>
        `;
    }

    setupCalibracionResultButtons() {
        const resultadoOk = document.getElementById('resultadoOk');
        const resultadoProblema = document.getElementById('resultadoProblema');
        const problemasSection = document.getElementById('problemasSection');

        if (resultadoOk) {
            resultadoOk.addEventListener('click', () => {
                resultadoOk.classList.add('active');
                resultadoProblema.classList.remove('active');
                if (problemasSection) problemasSection.style.display = 'none';
            });
        }

        if (resultadoProblema) {
            resultadoProblema.addEventListener('click', () => {
                resultadoProblema.classList.add('active');
                resultadoOk.classList.remove('active');
                if (problemasSection) problemasSection.style.display = 'block';
            });
        }
    }

    getCalibracionViewHTML() {
        const cal = this.currentCalibracion;
        return `
            <div class="calibracion-details">
                <div class="calibracion-vehicle-info">
                    <h4>🚗 Información del Vehículo</h4>
                    <div class="vehicle-details">
                        <div class="detail-row">
                            <span class="detail-label">Matrícula:</span>
                            <span class="detail-value">${cal.matricula}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Cliente:</span>
                            <span class="detail-value">${cal.cliente}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Estado:</span>
                            <span class="detail-value">${cal.estado === 'completada' ? 'Completada' : 'Pendiente'}</span>
                        </div>
                        ${cal.tecnico ? `
                            <div class="detail-row">
                                <span class="detail-label">Técnico:</span>
                                <span class="detail-value">${cal.tecnico}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    closeCalibracionModal() {
        const modal = document.getElementById('calibracionModal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.currentCalibracion = null;
    }

    saveCalibracionProcess() {
        if (!this.currentCalibracion) return;

        const tecnico = document.getElementById('tecnicoNombre')?.value;
        const observaciones = document.getElementById('observaciones')?.value || '';

        if (!tecnico) {
            this.showAlert('⚠️ Seleccione un técnico', 'warning');
            return;
        }

        const resultadoOkPressed = document.getElementById('resultadoOk')?.classList.contains('active');
        const resultadoProblemaPressed = document.getElementById('resultadoProblema')?.classList.contains('active');

        if (!resultadoOkPressed && !resultadoProblemaPressed) {
            this.showAlert('⚠️ Seleccione el resultado', 'warning');
            return;
        }

        const resultado = resultadoOkPressed ? 'ok' : 'problema';

        // Actualizar calibración
        this.currentCalibracion.estado = 'completada';
        this.currentCalibracion.tecnico = tecnico;
        this.currentCalibracion.fechaCompletado = new Date().toLocaleDateString();
        this.currentCalibracion.observaciones = observaciones;
        this.currentCalibracion.resultadoCalibracion = resultado;

        if (resultado === 'problema') {
            this.currentCalibracion.detallesProblema = document.getElementById('detallesProblema')?.value || '';
            this.currentCalibracion.accionesRealizadas = document.getElementById('accionesRealizadas')?.value || '';
        }

        this.closeCalibracionModal();
        this.loadCalibracionesList();
        this.updateStats();

        this.showAlert(
            `✅ Calibración completada\n\n` +
            `🚗 ${this.currentCalibracion.matricula}\n` +
            `👨‍🔧 ${tecnico}\n` +
            `🎯 ${resultado === 'ok' ? 'OK' : 'Con problemas'}`,
            'success'
        );
    }

    // ===== UTILIDADES =====

    showAlert(message, type = 'info') {
        try {
            const existingAlerts = document.querySelectorAll(`.alert.alert-${type}`);
            existingAlerts.forEach(alert => {
                if (alert.parentElement) {
                    alert.remove();
                }
            });

            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type}`;
            alertDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                left: 20px;
                background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : type === 'danger' ? '#dc3545' : '#17a2b8'};
                color: ${type === 'warning' ? '#000' : '#fff'};
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                z-index: 10000;
                font-weight: 500;
                animation: slideInAlert 0.5s ease-out;
                max-width: calc(100vw - 40px);
                word-wrap: break-word;
            `;

            alertDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div style="font-size: 18px; flex-shrink: 0;">
                        ${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'danger' ? '❌' : 'ℹ️'}
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="white-space: pre-line; word-wrap: break-word;">${message}</div>
                        <button onclick="this.closest('.alert').remove()" 
                                style="background: none; border: none; color: inherit; font-size: 18px; cursor: pointer; float: right; margin-top: 8px; padding: 4px; border-radius: 4px;">×</button>
                    </div>
                </div>
            `;

            document.body.appendChild(alertDiv);

            const timeout = type === 'success' ? 5000 : type === 'danger' ? 8000 : 4000;
            setTimeout(() => {
                if (alertDiv.parentElement) {
                    alertDiv.remove();
                }
            }, timeout);

        } catch (error) {
            console.error('Error mostrando alerta:', error);
            alert(message);
        }
    }
}

// Estilos para alertas
const alertStyles = document.createElement('style');
alertStyles.textContent = `
@keyframes slideInAlert {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
`;
document.head.appendChild(alertStyles);

// Función de inicialización
function initializeApp() {
    try {
        console.log('🚀 Inicializando GlassDrive MVP...');

        if (typeof window.app === 'undefined') {
            window.app = new GlassDriveMVP();
        }

        console.log('✅ App inicializada correctamente');
    } catch (error) {
        console.error('❌ Error inicializando app:', error);
        alert('Error inicializando la aplicación.');
    }
}

// Múltiples métodos de inicialización
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

setTimeout(() => {
    if (typeof window.app === 'undefined') {
        console.warn('⚠️ App no inicializada, reintentando...');
        initializeApp();
    }
}, 1000);

window.addEventListener('error', (event) => {
    console.error('❌ Error global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promise rechazada:', event.reason);
});
