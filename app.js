// GLASSDRIVE MVP - COMPLETO CON TODAS LAS FUNCIONALIDADES

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
        this.searchResults = [];
        this.calibracionSearchResults = [];

        console.log('🚀 GlassDrive MVP COMPLETO iniciando...');
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }

        this.updateStats();
        console.log('✅ MVP COMPLETO listo');
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
                fotos: [
                    { id: 1, url: this.generateDemoImage('Frontal vehículo'), nombre: 'Frontal del vehículo', size: 245000, fecha: new Date() },
                    { id: 2, url: this.generateDemoImage('Lateral izquierdo'), nombre: 'Lateral izquierdo', size: 312000, fecha: new Date() },
                    { id: 3, url: this.generateDemoImage('Parabrisas dañado'), nombre: 'Daño en parabrisas', size: 289000, fecha: new Date() }
                ],
                documentos: {
                    ficha: { presente: true, datos: { marca: 'SEAT', modelo: 'León', año: 2020 }},
                    poliza: { presente: true, datos: { aseguradora: 'MAPFRE', titular: 'Juan García' }}
                },
                firma: this.generateDemoSignature()
            },
            {
                id: 2,
                matricula: '1234ABC',
                cliente: 'María Rodríguez Pérez',
                vehiculo: 'VOLKSWAGEN Golf GTI',
                centro: 'Barbastro',
                fecha: new Date(Date.now() - 86400000).toLocaleDateString(),
                estado: 'completado',
                requiereCalibracion: false,
                fotos: [
                    { id: 4, url: this.generateDemoImage('Vista general Golf'), nombre: 'Vista general', size: 278000, fecha: new Date() },
                    { id: 5, url: this.generateDemoImage('Interior Golf'), nombre: 'Vista interior', size: 195000, fecha: new Date() }
                ],
                documentos: {
                    ficha: { presente: true, datos: { marca: 'VOLKSWAGEN', modelo: 'Golf' }},
                    poliza: { presente: false }
                },
                firma: this.generateDemoSignature()
            },
            {
                id: 3,
                matricula: '5678XYZ',
                cliente: 'Antonio Sánchez Ruiz',
                vehiculo: 'AUDI A4 Avant',
                centro: 'Lleida',
                fecha: new Date(Date.now() - 172800000).toLocaleDateString(),
                estado: 'completado',
                requiereCalibracion: true,
                fotos: [
                    { id: 6, url: this.generateDemoImage('Parabrisas Audi'), nombre: 'Parabrisas frontal', size: 298000, fecha: new Date() },
                    { id: 7, url: this.generateDemoImage('Lateral Audi'), nombre: 'Lateral completo', size: 267000, fecha: new Date() }
                ],
                documentos: {
                    ficha: { presente: true },
                    poliza: { presente: true }
                },
                firma: this.generateDemoSignature()
            },
            {
                id: 4,
                matricula: '9876DEF',
                cliente: 'Carmen López Martín',
                vehiculo: 'BMW Serie 3',
                centro: 'Fraga',
                fecha: new Date(Date.now() - 259200000).toLocaleDateString(),
                estado: 'completado',
                requiereCalibracion: false,
                fotos: [
                    { id: 8, url: this.generateDemoImage('BMW frontal'), nombre: 'Vista frontal BMW', size: 267000, fecha: new Date() }
                ],
                documentos: {
                    ficha: { presente: true },
                    poliza: { presente: true }
                },
                firma: this.generateDemoSignature()
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
                marca: 'SEAT',
                modelo: 'León',
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
                marca: 'AUDI',
                modelo: 'A4',
                centro: 'Monzón',
                fechaCreacion: new Date(Date.now() - 86400000).toLocaleDateString(),
                estado: 'completada',
                tecnico: 'José Pérez',
                fechaCompletado: new Date().toLocaleDateString(),
                observaciones: 'Calibración estándar ADAS',
                resultadoCalibracion: 'ok',
                detallesProblema: '',
                accionesRealizadas: 'Calibración completa de cámaras frontales'
            },
            {
                id: 3,
                matricula: '5678XYZ',
                cliente: 'Antonio Sánchez Ruiz',
                vehiculo: 'AUDI A4 Avant',
                marca: 'AUDI',
                modelo: 'A4',
                centro: 'Lleida',
                fechaCreacion: new Date(Date.now() - 345600000).toLocaleDateString(),
                estado: 'completada',
                tecnico: 'María Sánchez',
                fechaCompletado: new Date(Date.now() - 172800000).toLocaleDateString(),
                observaciones: 'Calibración con dificultades',
                resultadoCalibracion: 'problema',
                detallesProblema: 'Sensor radar desalineado',
                accionesRealizadas: 'Reajuste manual del sensor, calibración múltiple'
            },
            {
                id: 4,
                matricula: '2468BCD',
                cliente: 'Patricia Fernández',
                vehiculo: 'MERCEDES C-Class',
                marca: 'MERCEDES',
                modelo: 'C-Class',
                centro: 'Barbastro',
                fechaCreacion: new Date(Date.now() - 259200000).toLocaleDateString(),
                estado: 'completada',
                tecnico: 'Miguel Rodríguez',
                fechaCompletado: new Date(Date.now() - 86400000).toLocaleDateString(),
                observaciones: 'Calibración Mercedes-Benz ADAS',
                resultadoCalibracion: 'ok',
                detallesProblema: '',
                accionesRealizadas: 'Calibración sistemas Mercedes con software específico'
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
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(text, 200, 150);

            ctx.fillStyle = 'rgba(255, 107, 53, 0.1)';
            ctx.fillRect(50, 50, 300, 200);

            return canvas.toDataURL();
        } catch (error) {
            console.error('Error generando imagen demo:', error);
            return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%231a4d72"/><text x="200" y="150" text-anchor="middle" fill="white">Demo Image</text></svg>';
        }
    }

    generateDemoSignature() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 300, 100);

            ctx.strokeStyle = '#1a4d72';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Simular una firma
            ctx.beginPath();
            ctx.moveTo(50, 70);
            ctx.quadraticCurveTo(100, 30, 150, 50);
            ctx.quadraticCurveTo(200, 80, 250, 40);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(80, 60);
            ctx.lineTo(90, 75);
            ctx.lineTo(110, 45);
            ctx.stroke();

            return canvas.toDataURL();
        } catch (error) {
            console.error('Error generando firma demo:', error);
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
        console.log('📡 Configurando event listeners completos...');

        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        this.setupNavigation();
        this.setupModal();
        this.setupCamera();
        this.setupDocuments();
        this.setupCalibracion();
        this.setupSignature();
        this.setupCalibracionManagement();
        this.setupSearch();
        this.setupPhotoGallery();

        console.log('✅ Event listeners COMPLETOS configurados');
    }

    setupNavigation() {
        const navButtons = {
            'btnLogout': () => this.logout(),
            'btnDashboard': () => this.showDashboard(),
            'btnNuevoRegistro': () => this.openModal(),
            'btnCalibraciones': () => this.showCalibraciones(),
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
            'finishStep': () => this.finishRegistro(),
            'generatePDFBtn': () => this.generateRealPDF()
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

    setupCalibracion() {
        const calibracionNo = document.getElementById('calibracionNo');
        const calibracionSi = document.getElementById('calibracionSi');

        if (calibracionNo) {
            calibracionNo.addEventListener('click', () => {
                calibracionNo.classList.add('selected');
                if (calibracionSi) calibracionSi.classList.remove('selected');
                this.handleCalibracionDecision(false);
                setTimeout(() => {
                    this.nextStep();
                }, 1000);
            });
        }

        if (calibracionSi) {
            calibracionSi.addEventListener('click', () => {
                calibracionSi.classList.add('selected');
                if (calibracionNo) calibracionNo.classList.remove('selected');
                this.handleCalibracionDecision(true);
                setTimeout(() => {
                    this.nextStep();
                }, 1000);
            });
        }
    }

    setupCalibracionManagement() {
        const tabPendientes = document.getElementById('tabPendientes');
        const tabCompletadas = document.getElementById('tabCompletadas');

        if (tabPendientes) {
            tabPendientes.addEventListener('click', () => this.showCalibracionesTab('pendientes'));
        }

        if (tabCompletadas) {
            tabCompletadas.addEventListener('click', () => this.showCalibracionesTab('completadas'));
        }

        const closeCalibracionModal = document.getElementById('closeCalibracionModal');
        const cancelCalibracion = document.getElementById('cancelCalibracion');
        const saveCalibracion = document.getElementById('saveCalibracion');

        // Búsqueda de calibraciones
        const calibracionSearchInput = document.getElementById('calibracionSearchInput');
        const btnSearchCalibracion = document.getElementById('btnSearchCalibracion');

        if (calibracionSearchInput) {
            calibracionSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performCalibracionSearch();
                }
            });

            calibracionSearchInput.addEventListener('input', () => {
                if (calibracionSearchInput.value.length === 0) {
                    this.calibracionSearchResults = [];
                    this.loadCalibracionesList();
                }
            });
        }

        if (btnSearchCalibracion) {
            btnSearchCalibracion.addEventListener('click', () => this.performCalibracionSearch());
        }

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

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const btnSearch = document.getElementById('btnSearch');

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });

            searchInput.addEventListener('input', () => {
                if (searchInput.value.length === 0) {
                    this.clearSearchResults();
                }
            });
        }

        if (btnSearch) {
            btnSearch.addEventListener('click', () => this.performSearch());
        }
    }

    setupPhotoGallery() {
        const closePhotoGallery = document.getElementById('closePhotoGallery');
        const closePhotoGalleryBtn = document.getElementById('closePhotoGalleryBtn');

        if (closePhotoGallery) {
            closePhotoGallery.addEventListener('click', () => this.closePhotoGallery());
        }

        if (closePhotoGalleryBtn) {
            closePhotoGalleryBtn.addEventListener('click', () => this.closePhotoGallery());
        }

        // Event listener para clicks fuera de la imagen
        document.addEventListener('click', (e) => {
            const overlay = document.querySelector('.photo-fullscreen-overlay.active');
            if (overlay && e.target === overlay) {
                this.closeFullscreenPhoto();
            }
        });

        // Event listener para tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const overlay = document.querySelector('.photo-fullscreen-overlay.active');
                if (overlay) {
                    this.closeFullscreenPhoto();
                }

                const photoGallery = document.getElementById('photoGalleryModal');
                if (photoGallery && photoGallery.classList.contains('active')) {
                    this.closePhotoGallery();
                }
            }
        });
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
        this.clearCalibracionSearch();
    }

    showBusqueda() {
        this.hideAllSections();
        this.showSection('busqueda');
        this.updateNavigation('btnBusqueda');
        this.clearSearchResults();
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
            if (exp.fotos) totalFotos += exp.fotos.length;
            if (exp.documentos?.ficha?.presente) totalDocumentos++;
            if (exp.documentos?.poliza?.presente) totalDocumentos++;
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
            const fotosCount = exp.fotos ? exp.fotos.length : 0;

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
                <div class="recent-actions">
                    ${fotosCount > 0 ? 
                        `<button onclick="app.openPhotoGallery(${exp.id})" class="btn btn-info btn-sm">📸 Ver Fotos</button>` : 
                        ''
                    }
                    ${exp.estado === 'completado' ? 
                        `<button onclick="app.generateExpedientPDF(${exp.id})" class="btn btn-success btn-sm">📥 PDF</button>` : 
                        ''
                    }
                </div>
            `;

            list.appendChild(item);
        });
    }

    // ===== BÚSQUEDA DE CALIBRACIONES =====

    performCalibracionSearch() {
        const searchInput = document.getElementById('calibracionSearchInput');
        if (!searchInput) return;

        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            this.showAlert('⚠️ Introduzca un término de búsqueda', 'warning');
            return;
        }

        const filteredByCenter = this.calibraciones.filter(cal => 
            cal.centro === this.getTallerName(this.currentTaller)
        );

        this.calibracionSearchResults = filteredByCenter.filter(cal => {
            return cal.matricula.toLowerCase().includes(query) ||
                   cal.cliente.toLowerCase().includes(query) ||
                   cal.vehiculo.toLowerCase().includes(query) ||
                   cal.marca.toLowerCase().includes(query) ||
                   cal.modelo.toLowerCase().includes(query) ||
                   (cal.tecnico && cal.tecnico.toLowerCase().includes(query));
        });

        this.loadCalibracionesList();

        this.showAlert(`🔍 ${this.calibracionSearchResults.length} calibración(es) encontrada(s)`, 'info');
    }

    clearCalibracionSearch() {
        const searchInput = document.getElementById('calibracionSearchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        this.calibracionSearchResults = [];
    }

    loadCalibracionesList() {
        const container = document.getElementById('calibracionesList');
        if (!container) return;

        container.innerHTML = '';

        // Usar resultados de búsqueda si existen
        let calibracionesToShow = this.calibracionSearchResults.length > 0 ? 
            this.calibracionSearchResults : 
            this.calibraciones.filter(cal => cal.centro === this.getTallerName(this.currentTaller));

        // Filtrar por tab si no hay búsqueda activa
        if (this.calibracionSearchResults.length === 0) {
            if (this.showingCalibracionesTab === 'pendientes') {
                calibracionesToShow = calibracionesToShow.filter(cal => 
                    cal.estado === 'pendiente' || cal.estado === 'en_proceso'
                );
            } else {
                calibracionesToShow = calibracionesToShow.filter(cal => 
                    cal.estado === 'completada'
                );
            }
        }

        this.updateCalibracionCounters();

        if (calibracionesToShow.length === 0) {
            const emptyMessage = this.calibracionSearchResults.length > 0 ? 
                'No hay calibraciones que coincidan con la búsqueda' : 
                `No hay calibraciones ${this.showingCalibracionesTab}`;

            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎯</div>
                    <h3>${emptyMessage}</h3>
                    <p>Las calibraciones aparecerán aquí cuando se generen</p>
                </div>
            `;
            return;
        }

        calibracionesToShow.forEach(calibracion => {
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
                            <span class="calibracion-info-value">${calibracion.marca} ${calibracion.modelo}</span>
                        </div>
                        <div class="calibracion-info-item">
                            <span class="calibracion-info-label">Fecha:</span>
                            <span class="calibracion-info-value">${calibracion.fechaCreacion}</span>
                        </div>
                        ${calibracion.tecnico ? `
                        <div class="calibracion-info-item">
                            <span class="calibracion-info-label">Técnico:</span>
                            <span class="calibracion-info-value">${calibracion.tecnico}</span>
                        </div>
                        ` : ''}
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

    // ===== BÚSQUEDA DE EXPEDIENTES =====

    performSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            this.showAlert('⚠️ Introduzca un término de búsqueda', 'warning');
            return;
        }

        this.searchResults = this.expedientes.filter(exp => {
            return exp.matricula.toLowerCase().includes(query) ||
                   exp.cliente.toLowerCase().includes(query) ||
                   exp.vehiculo.toLowerCase().includes(query) ||
                   exp.centro.toLowerCase().includes(query);
        });

        this.displaySearchResults();

        this.showAlert(`🔍 ${this.searchResults.length} resultado(s) encontrado(s)`, 'info');
    }

    displaySearchResults() {
        const container = document.getElementById('searchResults');
        if (!container) return;

        container.innerHTML = '';

        if (this.searchResults.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>No se encontraron resultados</h3>
                    <p>Intente con otro término de búsqueda</p>
                </div>
            `;
            return;
        }

        this.searchResults.forEach(exp => {
            const fotosCount = exp.fotos ? exp.fotos.length : 0;
            const docsCount = (exp.documentos?.ficha?.presente ? 1 : 0) + 
                            (exp.documentos?.poliza?.presente ? 1 : 0);

            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <div class="result-header">
                    <div class="result-matricula">${exp.matricula}</div>
                    <div class="result-status">${exp.estado === 'completado' ? '✅' : '⚙️'}</div>
                </div>
                <div class="result-info">
                    <h4>${exp.cliente}</h4>
                    <p><strong>Vehículo:</strong> ${exp.vehiculo}</p>
                    <p><strong>Centro:</strong> ${exp.centro}</p>
                    <p><strong>Fecha:</strong> ${exp.fecha}</p>
                    <p><strong>Fotos:</strong> ${fotosCount} | <strong>Documentos:</strong> ${docsCount} | <strong>Calibración:</strong> ${exp.requiereCalibracion ? 'Sí' : 'No'}</p>
                </div>
                <div class="result-actions">
                    <button onclick="app.viewExpedientDetails(${exp.id})" class="btn btn-info btn-sm">👁️ Ver Detalles</button>
                    ${fotosCount > 0 ? 
                        `<button onclick="app.openPhotoGallery(${exp.id})" class="btn btn-secondary btn-sm">📸 Ver Fotos</button>` : 
                        ''
                    }
                    ${exp.estado === 'completado' ? 
                        `<button onclick="app.generateExpedientPDF(${exp.id})" class="btn btn-success btn-sm">📥 Descargar PDF</button>` : 
                        ''
                    }
                </div>
            `;

            container.appendChild(card);
        });
    }

    clearSearchResults() {
        const container = document.getElementById('searchResults');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>Búsqueda de Expedientes</h3>
                    <p>Use el campo de búsqueda para localizar expedientes</p>
                </div>
            `;
        }

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
    }

    viewExpedientDetails(expId) {
        const expediente = this.expedientes.find(e => e.id === expId);
        if (!expediente) return;

        this.showAlert(
            `📋 DETALLES DEL EXPEDIENTE\n\n` +
            `🚗 Matrícula: ${expediente.matricula}\n` +
            `👤 Cliente: ${expediente.cliente}\n` +
            `🚙 Vehículo: ${expediente.vehiculo}\n` +
            `🏢 Centro: ${expediente.centro}\n` +
            `📅 Fecha: ${expediente.fecha}\n` +
            `📸 Fotos: ${expediente.fotos ? expediente.fotos.length : 0}\n` +
            `📄 Documentos: ${(expediente.documentos?.ficha?.presente ? 1 : 0) + (expediente.documentos?.poliza?.presente ? 1 : 0)}\n` +
            `🎯 Calibración: ${expediente.requiereCalibracion ? 'Requerida' : 'No necesaria'}\n` +
            `✍️ Firma: ${expediente.firma ? 'Sí' : 'No'}\n` +
            `📊 Estado: ${expediente.estado}`,
            'info'
        );
    }

    generateExpedientPDF(expId) {
        const expediente = this.expedientes.find(e => e.id === expId);
        if (!expediente) return;

        this.generatePDFForExpedient(expediente);
    }    
    // ===== GALERÍA DE FOTOS COMPLETA =====

    openPhotoGallery(expedienteId) {
        const expediente = this.expedientes.find(e => e.id === expedienteId);
        if (!expediente || !expediente.fotos || expediente.fotos.length === 0) {
            this.showAlert('❌ No hay fotos para mostrar', 'warning');
            return;
        }

        const modal = document.getElementById('photoGalleryModal');
        const title = document.getElementById('galleryTitle');
        const content = document.getElementById('photoGalleryContent');

        if (!modal || !title || !content) return;

        title.textContent = `Fotos de ${expediente.matricula} - ${expediente.cliente}`;

        content.innerHTML = '';

        expediente.fotos.forEach((foto, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'gallery-photo-item';
            photoItem.innerHTML = `
                <div class="gallery-photo-header">
                    <h4>${foto.nombre}</h4>
                    <div class="gallery-photo-meta">
                        <span>📷 ${index + 1}/${expediente.fotos.length}</span>
                        <span>📏 ${(foto.size / 1024).toFixed(1)} KB</span>
                    </div>
                </div>
                <div class="gallery-photo-image-container">
                    <img src="${foto.url}" alt="${foto.nombre}" class="gallery-photo-image" onclick="app.openFullscreenPhoto('${foto.url}', '${foto.nombre}')">
                </div>
                <div class="gallery-photo-actions">
                    <button onclick="app.openFullscreenPhoto('${foto.url}', '${foto.nombre}')" class="btn btn-info btn-sm">🔍 Ampliar</button>
                    <button onclick="app.downloadPhoto('${foto.url}', '${foto.nombre}')" class="btn btn-success btn-sm">📥 Descargar</button>
                </div>
            `;

            content.appendChild(photoItem);
        });

        modal.classList.add('active');

        this.showAlert(`📸 Mostrando ${expediente.fotos.length} foto(s) de ${expediente.matricula}`, 'info');
    }

    closePhotoGallery() {
        const modal = document.getElementById('photoGalleryModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    openFullscreenPhoto(photoUrl, photoName) {
        // Remover overlay existente si lo hay
        const existingOverlay = document.querySelector('.photo-fullscreen-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Crear nuevo overlay
        const overlay = document.createElement('div');
        overlay.className = 'photo-fullscreen-overlay';
        overlay.innerHTML = `
            <div class="photo-fullscreen-container">
                <button class="photo-fullscreen-close" onclick="app.closeFullscreenPhoto()">&times;</button>
                <img src="${photoUrl}" alt="${photoName}" class="photo-fullscreen-image">
                <div class="photo-fullscreen-info">
                    📷 ${photoName}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Activar overlay con un pequeño delay para la animación
        setTimeout(() => {
            overlay.classList.add('active');
        }, 50);

        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    }

    closeFullscreenPhoto() {
        const overlay = document.querySelector('.photo-fullscreen-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    }

    downloadPhoto(photoUrl, photoName) {
        try {
            const link = document.createElement('a');
            link.href = photoUrl;
            link.download = photoName || 'foto-glassdrive.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.showAlert(`📥 Descargando: ${photoName}`, 'success');
        } catch (error) {
            console.error('Error descargando foto:', error);
            this.showAlert('❌ Error al descargar la foto', 'warning');
        }
    }

    // ===== GENERACIÓN PDF CON FOTOS SIN DEFORMACIÓN =====

    generateRealPDF() {
        this.generatePDFForExpedient(this.currentExpedient, true);
    }

    async generatePDFForExpedient(expedient, isNew = false) {
        try {
            const btn = document.getElementById('generatePDFBtn');
            if (btn) {
                btn.innerHTML = '⏳ Generando PDF...';
                btn.disabled = true;
            }

            // Verificar si jsPDF está disponible
            if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
                console.error('jsPDF no está cargado');
                this.showAlert('❌ Error: librería PDF no disponible', 'danger');
                if (btn) {
                    btn.innerHTML = '📥 Generar y Descargar PDF';
                    btn.disabled = false;
                }
                return;
            }

            setTimeout(async () => {
                try {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF();

                    let currentY = 20;

                    // HEADER CON LOGO LARGO
                    try {
                        // Cargar logo largo desde el elemento de la página
                        const logoImg = document.querySelector('.login-logo, .header-logo');
                        if (logoImg && logoImg.src) {
                            const imgData = await this.getImageDataFromImg(logoImg);
                            if (imgData) {
                                // Logo largo centrado, respetando proporciones
                                const logoWidth = 60;
                                const logoHeight = (logoWidth * imgData.height) / imgData.width;
                                doc.addImage(imgData.data, 'PNG', (210 - logoWidth) / 2, currentY, logoWidth, logoHeight);
                                currentY += logoHeight + 10;
                            }
                        }
                    } catch (logoError) {
                        console.log('Logo no disponible, usando texto:', logoError);
                        // Fallback: texto
                        doc.setFont('helvetica', 'bold');
                        doc.setFontSize(20);
                        doc.setTextColor(26, 77, 114);
                        doc.text('GLASSDRIVE', 105, currentY, { align: 'center' });
                        currentY += 15;
                    }

                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(12);
                    doc.setTextColor(46, 107, 153);
                    doc.text('Informe de Recepción de Vehículo', 105, currentY, { align: 'center' });
                    currentY += 20;

                    // INFORMACIÓN DEL CENTRO
                    const centerName = expedient.centro || this.getTallerName(this.currentTaller);
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    doc.setTextColor(0, 0, 0);
                    doc.text(`Centro: ${centerName}`, 20, currentY);
                    currentY += 7;
                    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, currentY);
                    currentY += 7;
                    doc.text(`Hora: ${new Date().toLocaleTimeString()}`, 20, currentY);
                    currentY += 15;

                    // LÍNEA SEPARADORA
                    doc.setDrawColor(255, 107, 53);
                    doc.setLineWidth(1);
                    doc.line(20, currentY, 190, currentY);
                    currentY += 20;

                    // INFORMACIÓN DEL VEHÍCULO
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(14);
                    doc.setTextColor(26, 77, 114);
                    doc.text('INFORMACIÓN DEL VEHÍCULO', 20, currentY);
                    currentY += 15;

                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(11);
                    doc.setTextColor(0, 0, 0);
                    doc.text(`Matrícula: ${expedient.matricula || 'No detectada'}`, 20, currentY);
                    currentY += 8;
                    doc.text(`Cliente: ${expedient.cliente || 'Cliente MVP Demo'}`, 20, currentY);
                    currentY += 8;
                    doc.text(`Vehículo: ${expedient.vehiculo || 'Vehículo Demo'}`, 20, currentY);
                    currentY += 20;

                    // DOCUMENTACIÓN
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(14);
                    doc.setTextColor(26, 77, 114);
                    doc.text('DOCUMENTACIÓN', 20, currentY);
                    currentY += 15;

                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(11);
                    doc.setTextColor(0, 0, 0);
                    const fotosCount = expedient.fotos ? expedient.fotos.length : 0;
                    const fichaPresente = expedient.documentos?.ficha ? 'Sí' : 'No';
                    const polizaPresente = expedient.documentos?.poliza ? 'Sí' : 'No';

                    doc.text(`Fotografías: ${fotosCount} archivos`, 20, currentY);
                    currentY += 8;
                    doc.text(`Ficha técnica: ${fichaPresente}`, 20, currentY);
                    currentY += 8;
                    doc.text(`Póliza de seguro: ${polizaPresente}`, 20, currentY);
                    currentY += 20;

                    // CALIBRACIÓN
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(14);
                    doc.setTextColor(26, 77, 114);
                    doc.text('CALIBRACIÓN', 20, currentY);
                    currentY += 15;

                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(11);
                    doc.setTextColor(0, 0, 0);

                    if (expedient.requiereCalibracion) {
                        doc.text('Requiere calibración: SÍ', 20, currentY);
                        currentY += 8;
                        doc.text('Estado: Registrado como pendiente', 20, currentY);
                        currentY += 8;
                        doc.text(`Fecha registro calibración: ${new Date().toLocaleDateString()}`, 20, currentY);
                        currentY += 20;
                    } else {
                        doc.text('Requiere calibración: NO', 20, currentY);
                        currentY += 8;
                        doc.text('Estado: No aplicable', 20, currentY);
                        currentY += 20;
                    }

                    // FIRMA DIGITAL CON IMAGEN
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(14);
                    doc.setTextColor(26, 77, 114);
                    doc.text('FIRMA DIGITAL', 20, currentY);
                    currentY += 15;

                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(11);
                    doc.setTextColor(0, 0, 0);

                    if (expedient.firma) {
                        doc.text('Firma del cliente: Capturada digitalmente', 20, currentY);
                        currentY += 8;
                        doc.text(`Fecha firma: ${new Date().toLocaleDateString()}`, 20, currentY);
                        currentY += 10;

                        // INSERTAR IMAGEN DE FIRMA CON PROPORCIONES CORRECTAS
                        try {
                            doc.setDrawColor(26, 77, 114);
                            doc.setLineWidth(0.5);
                            doc.rect(20, currentY, 80, 30);

                            // Insertar firma manteniendo proporciones
                            doc.addImage(expedient.firma, 'PNG', 21, currentY + 1, 78, 28);
                            currentY += 35;
                        } catch (firmaError) {
                            console.error('Error añadiendo firma:', firmaError);
                            doc.text('(Firma no disponible en PDF)', 20, currentY);
                            currentY += 15;
                        }
                    } else {
                        doc.text('Firma del cliente: No capturada', 20, currentY);
                        currentY += 20;
                    }

                    // FOTOGRAFÍAS DEL VEHÍCULO CON PROPORCIONES CORRECTAS
                    if (expedient.fotos && expedient.fotos.length > 0) {
                        // Verificar si hay espacio o crear nueva página
                        if (currentY > 220) {
                            doc.addPage();
                            currentY = 20;
                        }

                        doc.setFont('helvetica', 'bold');
                        doc.setFontSize(14);
                        doc.setTextColor(26, 77, 114);
                        doc.text('FOTOGRAFÍAS DEL VEHÍCULO', 20, currentY);
                        currentY += 15;

                        // Añadir fotos respetando proporciones
                        for (let i = 0; i < expedient.fotos.length; i++) {
                            const foto = expedient.fotos[i];

                            // Verificar espacio disponible para foto
                            if (currentY > 200) {
                                doc.addPage();
                                currentY = 20;
                                doc.setFont('helvetica', 'bold');
                                doc.setFontSize(14);
                                doc.setTextColor(26, 77, 114);
                                doc.text('FOTOGRAFÍAS (continuación)', 20, currentY);
                                currentY += 15;
                            }

                            try {
                                // Título de la foto
                                doc.setFont('helvetica', 'normal');
                                doc.setFontSize(10);
                                doc.setTextColor(0, 0, 0);
                                doc.text(`${i + 1}. ${foto.nombre}`, 20, currentY);
                                currentY += 8;

                                // Calcular dimensiones manteniendo proporciones
                                const maxWidth = 170;
                                const maxHeight = 60;

                                // Crear imagen temporal para obtener dimensiones
                                const tempImg = new Image();
                                tempImg.src = foto.url;

                                await new Promise((resolve, reject) => {
                                    tempImg.onload = () => {
                                        try {
                                            const aspectRatio = tempImg.width / tempImg.height;
                                            let finalWidth = maxWidth;
                                            let finalHeight = maxWidth / aspectRatio;

                                            // Si la altura calculada es mayor que el máximo, ajustar por altura
                                            if (finalHeight > maxHeight) {
                                                finalHeight = maxHeight;
                                                finalWidth = maxHeight * aspectRatio;
                                            }

                                            // Dibujar borde
                                            doc.setDrawColor(26, 77, 114);
                                            doc.setLineWidth(0.5);
                                            const borderX = 20;
                                            const borderY = currentY;
                                            const borderWidth = maxWidth;
                                            const borderHeight = maxHeight;
                                            doc.rect(borderX, borderY, borderWidth, borderHeight);

                                            // Centrar imagen en el borde
                                            const imageX = borderX + (borderWidth - finalWidth) / 2;
                                            const imageY = borderY + (borderHeight - finalHeight) / 2;

                                            // Insertar foto manteniendo proporciones
                                            doc.addImage(foto.url, 'JPEG', imageX, imageY, finalWidth, finalHeight);

                                            resolve();
                                        } catch (error) {
                                            reject(error);
                                        }
                                    };
                                    tempImg.onerror = reject;
                                });

                                currentY += maxHeight + 10;

                            } catch (fotoError) {
                                console.error(`Error añadiendo foto ${i}:`, fotoError);
                                doc.text(`Foto ${i + 1}: No disponible`, 20, currentY);
                                currentY += 15;
                            }
                        }
                    }

                    // FOOTER
                    const totalPages = doc.internal.getNumberOfPages();
                    for (let i = 1; i <= totalPages; i++) {
                        doc.setPage(i);
                        doc.setFontSize(8);
                        doc.setTextColor(100, 100, 100);
                        doc.text('Documento generado automáticamente por GlassDrive MVP', 105, 280, { align: 'center' });
                        doc.text(`Generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}`, 105, 285, { align: 'center' });
                        doc.text(`Página ${i} de ${totalPages}`, 105, 290, { align: 'center' });
                    }

                    // NOMBRE DEL ARCHIVO
                    const fileName = `GlassDrive-${expedient.matricula || 'MVP'}-${centerName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

                    // DETECCIÓN DE DISPOSITIVO MÓVIL
                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

                    if (isMobile) {
                        // MÉTODO PARA MÓVILES: Abrir en nueva ventana
                        console.log('📱 Detectado móvil - Método alternativo PDF');

                        try {
                            const pdfBlob = doc.output('blob');
                            const pdfUrl = URL.createObjectURL(pdfBlob);

                            const newWindow = window.open(pdfUrl, '_blank');

                            if (newWindow) {
                                setTimeout(() => {
                                    URL.revokeObjectURL(pdfUrl);
                                }, 60000);

                                this.showAlert(
                                    `✅ PDF GENERADO EXITOSAMENTE\n\n` +
                                    `📱 El PDF se ha abierto en una nueva ventana\n` +
                                    `📄 Puede descargarlo desde el navegador\n\n` +
                                    `🏢 Centro: ${centerName}\n` +
                                    `🚗 Matrícula: ${expedient.matricula || 'MVP Demo'}\n` +
                                    `📸 Fotos: ${fotosCount} incluidas (sin deformación)\n` +
                                    `✍️ Firma: ${expedient.firma ? 'Incluida' : 'No'}\n` +
                                    `🎯 Calibración: ${expedient.requiereCalibracion ? 'Requerida' : 'No'}`,
                                    'success'
                                );
                            } else {
                                doc.save(fileName);
                                this.showAlert(
                                    `✅ PDF descargado: ${fileName}\n\n` +
                                    `Si no se descarga, verifique los permisos del navegador`,
                                    'success'
                                );
                            }
                        } catch (mobileError) {
                            console.error('Error método móvil:', mobileError);
                            doc.save(fileName);
                            this.showAlert(`✅ PDF generado: ${fileName}`, 'success');
                        }
                    } else {
                        // MÉTODO PARA PC: Descarga directa
                        console.log('💻 Detectado PC - Descarga directa');
                        doc.save(fileName);

                        this.showAlert(
                            `✅ PDF GENERADO EXITOSAMENTE\n\n` +
                            `📄 ${fileName}\n` +
                            `🏢 Centro: ${centerName}\n` +
                            `🚗 Matrícula: ${expedient.matricula || 'MVP Demo'}\n` +
                            `📸 Fotos: ${fotosCount} incluidas con proporciones correctas\n` +
                            `✍️ Firma: ${expedient.firma ? 'Incluida' : 'No'}\n` +
                            `🎯 Calibración: ${expedient.requiereCalibracion ? 'Requerida' : 'No'}\n` +
                            `🆕 Logo largo incluido en header`,
                            'success'
                        );
                    }

                    if (isNew) {
                        setTimeout(() => {
                            this.finishRegistro();
                        }, 2000);
                    }

                    if (btn) {
                        btn.innerHTML = '📥 Generar y Descargar PDF';
                        btn.disabled = false;
                    }

                } catch (pdfError) {
                    console.error('Error generando PDF:', pdfError);
                    this.showAlert(`❌ Error al generar PDF: ${pdfError.message}`, 'danger');

                    if (btn) {
                        btn.innerHTML = '📥 Generar y Descargar PDF';
                        btn.disabled = false;
                    }
                }

            }, 1500);

        } catch (error) {
            console.error('Error en generatePDFForExpedient:', error);
            this.showAlert(`❌ Error al generar PDF: ${error.message}`, 'danger');

            const btn = document.getElementById('generatePDFBtn');
            if (btn) {
                btn.innerHTML = '📥 Generar y Descargar PDF';
                btn.disabled = false;
            }
        }
    }

    // Función auxiliar para obtener datos de imagen
    async getImageDataFromImg(imgElement) {
        return new Promise((resolve) => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = imgElement.naturalWidth || imgElement.width || 300;
                canvas.height = imgElement.naturalHeight || imgElement.height || 80;

                ctx.drawImage(imgElement, 0, 0);

                resolve({
                    data: canvas.toDataURL('image/png'),
                    width: canvas.width,
                    height: canvas.height
                });
            } catch (error) {
                console.error('Error obteniendo datos de imagen:', error);
                resolve(null);
            }
        });
    }    
    // ===== MODAL Y STEPS =====

    openModal() {
        this.currentExpedient = this.resetExpedient();
        this.currentStep = 1;
        this.updateStepUI();

        const modal = document.getElementById('registroModal');
        if (modal) {
            modal.classList.add('active');
            this.setupSignatureCanvas();
        }

        this.showAlert('📝 Nuevo expediente iniciado', 'info');
    }

    closeModal() {
        const modal = document.getElementById('registroModal');
        if (modal) {
            modal.classList.remove('active');
        }

        if (this.cameraStream) {
            this.stopCamera();
        }

        this.currentStep = 1;
        this.currentExpedient = this.resetExpedient();
    }

    nextStep() {
        if (this.currentStep < this.maxSteps) {
            this.currentStep++;
            this.updateStepUI();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepUI();
        }
    }

    updateStepUI() {
        // Actualizar steps visuales
        for (let i = 1; i <= this.maxSteps; i++) {
            const step = document.querySelector(`.step[data-step="${i}"]`);
            const panel = document.getElementById(`step${i}`);

            if (step) {
                step.classList.toggle('active', i === this.currentStep);
            }

            if (panel) {
                panel.classList.toggle('active', i === this.currentStep);
            }
        }

        // Actualizar botones
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const finishBtn = document.getElementById('finishStep');

        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }

        if (nextBtn) {
            nextBtn.style.display = this.currentStep < this.maxSteps ? 'block' : 'none';
        }

        if (finishBtn) {
            finishBtn.style.display = this.currentStep === this.maxSteps ? 'block' : 'none';
        }

        // Actualizar barra de progreso
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const progress = (this.currentStep / this.maxSteps) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Actualizar resumen en el último paso
        if (this.currentStep === this.maxSteps) {
            this.updateSummary();
        }
    }

    // ===== CÁMARA =====

    async startCamera() {
        try {
            const video = document.getElementById('cameraPreview');
            const captureBtn = document.getElementById('capturePhoto');

            if (!video || !captureBtn) return;

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            this.cameraStream = stream;
            video.srcObject = stream;
            video.style.display = 'block';
            captureBtn.style.display = 'block';

            this.showAlert('📷 Cámara iniciada', 'success');
        } catch (error) {
            console.error('Error iniciando cámara:', error);
            this.showAlert('❌ No se puede acceder a la cámara', 'danger');
        }
    }

    capturePhoto() {
        const video = document.getElementById('cameraPreview');
        const canvas = document.getElementById('photoCanvas');

        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        const photoName = `Foto_${Date.now()}.jpg`;

        this.addPhotoToExpedient(imageData, photoName, 'foto_capturada');

        this.showAlert('📸 Foto capturada exitosamente', 'success');
    }

    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;

            const video = document.getElementById('cameraPreview');
            const captureBtn = document.getElementById('capturePhoto');

            if (video) video.style.display = 'none';
            if (captureBtn) captureBtn.style.display = 'none';
        }
    }

    handlePhotoUpload(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.addPhotoToExpedient(e.target.result, file.name, 'foto_subida', file.size);
                };
                reader.readAsDataURL(file);
            }
        });

        this.showAlert(`📁 ${files.length} foto(s) cargada(s)`, 'success');
    }

    addPhotoToExpedient(imageData, nombre, tipo, size = null) {
        const photo = {
            id: Date.now() + Math.random(),
            url: imageData,
            nombre: nombre,
            tipo: tipo,
            size: size || this.estimateImageSize(imageData),
            fecha: new Date()
        };

        this.currentExpedient.fotos.push(photo);
        this.updatePhotosGrid();
        this.simulateOCR(imageData);
    }

    estimateImageSize(dataUrl) {
        return Math.floor(dataUrl.length * 0.75);
    }

    updatePhotosGrid() {
        const grid = document.getElementById('photosGrid');
        if (!grid) return;

        grid.innerHTML = '';

        this.currentExpedient.fotos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.innerHTML = `
                <div class="photo-thumbnail">
                    <img src="${photo.url}" alt="${photo.nombre}">
                </div>
                <div class="photo-info">
                    <div class="photo-name">${photo.nombre}</div>
                    <div class="photo-meta">${(photo.size / 1024).toFixed(1)} KB</div>
                </div>
                <button onclick="app.removePhoto(${index})" class="btn btn-sm" style="position: absolute; top: 5px; right: 5px; background: rgba(220,53,69,0.8); color: white; border: none; border-radius: 50%; width: 30px; height: 30px;">×</button>
            `;

            photoItem.style.position = 'relative';
            grid.appendChild(photoItem);
        });
    }

    removePhoto(index) {
        if (index >= 0 && index < this.currentExpedient.fotos.length) {
            this.currentExpedient.fotos.splice(index, 1);
            this.updatePhotosGrid();
            this.showAlert('🗑️ Foto eliminada', 'warning');
        }
    }

    simulateOCR(imageData) {
        const result = document.getElementById('ocrResult');
        if (!result) return;

        // Simulación de procesamiento OCR
        result.innerHTML = `
            <div class="ocr-processing">
                <div class="processing-spinner"></div>
                <h5>🔍 Procesando Imagen con OCR...</h5>
                <p>Detectando matrícula automáticamente</p>
            </div>
        `;

        setTimeout(() => {
            const matriculaDetectada = this.generateRandomMatricula();
            this.currentExpedient.matricula = matriculaDetectada;

            result.innerHTML = `
                <div class="ocr-success">
                    <div class="success-icon">✅</div>
                    <h5>Matrícula Detectada</h5>
                    <div class="matricula-display">${matriculaDetectada}</div>
                    <button onclick="app.editMatricula()" class="btn btn-warning btn-sm">✏️ Editar</button>
                </div>
            `;
        }, 2000);
    }

    generateRandomMatricula() {
        const nums = Math.floor(Math.random() * 9000) + 1000;
        const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                        String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                        String.fromCharCode(65 + Math.floor(Math.random() * 26));
        return `${nums}${letters}`;
    }

    editMatricula() {
        const nuevaMatricula = prompt('Editar matrícula:', this.currentExpedient.matricula);
        if (nuevaMatricula && nuevaMatricula.trim()) {
            this.currentExpedient.matricula = nuevaMatricula.trim().toUpperCase();
            this.simulateOCR(); // Actualizar display
            this.showAlert('✏️ Matrícula actualizada', 'success');
        }
    }

    // ===== DOCUMENTOS =====

    handleDocumentUpload(file, tipo) {
        const preview = document.getElementById(`${tipo}Preview`);
        if (!preview) return;

        this.currentExpedient.documentos[tipo] = {
            presente: true,
            file: file,
            nombre: file.name,
            size: file.size,
            fecha: new Date()
        };

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `
                    <div class="document-preview-mvp">
                        <div class="preview-header">
                            <div class="file-icon">📄</div>
                            <div class="file-info">
                                <h5>${file.name}</h5>
                                <p>${(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>
                        <div class="preview-image">
                            <img src="${e.target.result}" alt="${file.name}">
                        </div>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            preview.innerHTML = `
                <div class="document-preview-mvp">
                    <div class="preview-header">
                        <div class="file-icon">📄</div>
                        <div class="file-info">
                            <h5>${file.name}</h5>
                            <p>${(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                    </div>
                    <div class="preview-pdf">
                        <div class="pdf-icon-large">📄</div>
                        <p>Documento PDF cargado</p>
                    </div>
                </div>
            `;
        }

        this.showAlert(`📄 ${tipo === 'ficha' ? 'Ficha técnica' : 'Póliza'} cargada`, 'success');
    }

    // ===== CALIBRACIÓN =====

    handleCalibracionDecision(requiere) {
        this.currentExpedient.requiereCalibracion = requiere;

        const info = document.getElementById('calibracionInfo');
        if (info) {
            if (requiere) {
                info.innerHTML = `
                    <div class="info-card">
                        <div class="info-icon">📋</div>
                        <h6>Registro de Calibración Creado</h6>
                        <p>Se ha creado un registro pendiente que podrá gestionar desde la sección Calibraciones</p>
                    </div>
                `;
                info.style.display = 'block';

                // Crear registro de calibración
                const nuevaCalibracion = {
                    id: Date.now(),
                    matricula: this.currentExpedient.matricula || 'NUEVA',
                    cliente: 'Cliente MVP',
                    vehiculo: 'Vehículo MVP',
                    marca: 'MARCA',
                    modelo: 'MODELO',
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
                this.updateStats();

                this.showAlert('🎯 Calibración registrada como pendiente', 'warning');
            } else {
                info.style.display = 'none';
                this.showAlert('✅ Vehículo sin calibración requerida', 'success');
            }
        }
    }

    // ===== FIRMA DIGITAL =====

    setupSignatureCanvas() {
        const canvas = document.getElementById('signatureCanvas');
        const placeholder = document.getElementById('signaturePlaceholder');

        if (!canvas) return;

        this.signatureCanvas = canvas;
        this.signatureCtx = canvas.getContext('2d');

        // Configurar canvas
        canvas.width = 600;
        canvas.height = 300;

        // Configurar contexto
        this.signatureCtx.strokeStyle = '#1a4d72';
        this.signatureCtx.lineWidth = 3;
        this.signatureCtx.lineCap = 'round';
        this.signatureCtx.lineJoin = 'round';

        // Fondo blanco
        this.signatureCtx.fillStyle = 'white';
        this.signatureCtx.fillRect(0, 0, canvas.width, canvas.height);

        // Event listeners para firma
        this.setupSignatureEvents();
    }

    setupSignatureEvents() {
        if (!this.signatureCanvas) return;

        // Mouse events
        this.signatureCanvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.signatureCanvas.addEventListener('mousemove', (e) => this.draw(e));
        this.signatureCanvas.addEventListener('mouseup', () => this.stopDrawing());

        // Touch events para móviles
        this.signatureCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });

        this.signatureCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });

        this.signatureCanvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.signatureCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

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
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.signatureCtx.lineTo(x, y);
        this.signatureCtx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    clearSignature() {
        if (!this.signatureCtx) return;

        this.signatureCtx.fillStyle = 'white';
        this.signatureCtx.fillRect(0, 0, this.signatureCanvas.width, this.signatureCanvas.height);

        const placeholder = document.getElementById('signaturePlaceholder');
        if (placeholder) {
            placeholder.style.display = 'flex';
        }

        this.currentExpedient.firma = null;
        this.showAlert('🗑️ Firma borrada', 'warning');
    }

    saveSignature() {
        if (!this.signatureCanvas) return;

        const imageData = this.signatureCanvas.toDataURL('image/png');
        this.currentExpedient.firma = imageData;

        this.showAlert('✍️ Firma guardada exitosamente', 'success');
        setTimeout(() => this.nextStep(), 1000);
    }

    // ===== RESUMEN =====

    updateSummary() {
        const summaryContent = document.getElementById('summaryContent');
        if (!summaryContent) return;

        const fotosCount = this.currentExpedient.fotos ? this.currentExpedient.fotos.length : 0;
        const docsCount = (this.currentExpedient.documentos.ficha ? 1 : 0) + 
                         (this.currentExpedient.documentos.poliza ? 1 : 0);

        // Actualizar vista previa PDF
        const pdfElements = {
            'pdfMatricula': this.currentExpedient.matricula || 'No detectada',
            'pdfFotos': fotosCount,
            'pdfDocs': docsCount,
            'pdfCalibracion': this.currentExpedient.requiereCalibracion ? 'Requerida' : 'No requerida',
            'pdfFirma': this.currentExpedient.firma ? 'Sí' : 'No'
        };

        Object.entries(pdfElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        summaryContent.innerHTML = `
            <div class="summary-item">
                <label>🚗 Matrícula:</label>
                <span class="${this.currentExpedient.matricula ? 'detected' : 'missing'}">
                    ${this.currentExpedient.matricula || 'No detectada'}
                </span>
            </div>
            <div class="summary-item">
                <label>📸 Fotografías:</label>
                <span class="${fotosCount > 0 ? 'detected' : 'missing'}">${fotosCount} fotos</span>
            </div>
            <div class="summary-item">
                <label>📄 Documentos:</label>
                <span class="${docsCount > 0 ? 'detected' : 'missing'}">${docsCount} documentos</span>
            </div>
            <div class="summary-item">
                <label>🎯 Calibración:</label>
                <span class="${this.currentExpedient.requiereCalibracion ? 'calibracion-required' : 'detected'}">
                    ${this.currentExpedient.requiereCalibracion ? 'Requerida' : 'No necesaria'}
                </span>
            </div>
            <div class="summary-item">
                <label>✍️ Firma:</label>
                <span class="${this.currentExpedient.firma ? 'detected' : 'missing'}">
                    ${this.currentExpedient.firma ? 'Capturada' : 'No capturada'}
                </span>
            </div>
        `;
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
                fotos: this.currentExpedient.fotos,
                documentos: {
                    ficha: { presente: !!this.currentExpedient.documentos.ficha },
                    poliza: { presente: !!this.currentExpedient.documentos.poliza }
                },
                firma: this.currentExpedient.firma
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

    // ===== GESTIÓN DE CALIBRACIONES =====

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
            setTimeout(() => this.setupCalibracionResultButtons(), 100);
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
                    <div class="form-group">
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
                if (resultadoProblema) resultadoProblema.classList.remove('active');
                if (problemasSection) problemasSection.style.display = 'none';
            });
        }

        if (resultadoProblema) {
            resultadoProblema.addEventListener('click', () => {
                resultadoProblema.classList.add('active');
                if (resultadoOk) resultadoOk.classList.remove('active');
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

    // ===== ALERTAS =====

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

const alertStyles = document.createElement('style');
alertStyles.textContent = `
@keyframes slideInAlert {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
`;
document.head.appendChild(alertStyles);

function initializeApp() {
    try {
        console.log('🚀 Inicializando GlassDrive MVP COMPLETO...');

        if (typeof window.app === 'undefined') {
            window.app = new GlassDriveMVP();
        }

        console.log('✅ App COMPLETA inicializada correctamente');
    } catch (error) {
        console.error('❌ Error inicializando app:', error);
        alert('Error inicializando la aplicación.');
    }
}

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
