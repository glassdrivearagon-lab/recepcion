// GLASSDRIVE MVP - CON SISTEMA DE CALIBRACIONES

class GlassDriveMVP {
    constructor() {
        this.currentTaller = null;
        this.currentStep = 1;
        this.maxSteps = 5; // Ahora 5 pasos con calibración
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
                fechaCreacion: new Date(Date.now() - 172800000).toLocaleDateString(), // hace 2 días
                estado: 'pendiente', // pendiente, en_proceso, completada, problema
                tecnico: null,
                fechaCompletado: null,
                observaciones: '',
                resultadoCalibracion: null, // 'ok', 'problema'
                detallesProblema: '',
                accionesRealizadas: ''
            },
            {
                id: 2,
                matricula: '9876XYZ',
                cliente: 'Carlos Martínez Vila',
                vehiculo: 'AUDI A4 2.0 TDI',
                centro: 'Monzón',
                fechaCreacion: new Date(Date.now() - 86400000).toLocaleDateString(), // hace 1 día
                estado: 'completada',
                tecnico: 'José Pérez',
                fechaCompletado: new Date().toLocaleDateString(),
                observaciones: 'Calibración estándar ADAS',
                resultadoCalibracion: 'ok',
                detallesProblema: '',
                accionesRealizadas: 'Calibración completa de cámaras frontales y sensores de aparcamiento'
            },
            {
                id: 3,
                matricula: '5555DEF',
                cliente: 'Ana López García',
                vehiculo: 'MERCEDES C220d',
                centro: 'Monzón',
                fechaCreacion: new Date(Date.now() - 259200000).toLocaleDateString(), // hace 3 días
                estado: 'completada',
                tecnico: 'Miguel Sánchez',
                fechaCompletado: new Date(Date.now() - 86400000).toLocaleDateString(),
                observaciones: 'Calibración con problemas iniciales',
                resultadoCalibracion: 'problema',
                detallesProblema: 'Sensor de lluvia con interferencias, requirió ajuste manual',
                accionesRealizadas: 'Reemplazo de sensor de lluvia, recalibración completa, verificación final OK'
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
        console.log('📡 Configurando event listeners con calibraciones...');

        // LOGIN
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // NAVEGACIÓN (incluye calibraciones)
        this.setupNavigation();

        // MODAL DE REGISTRO
        this.setupModal();

        // CÁMARA Y FOTOS
        this.setupCamera();

        // DOCUMENTOS
        this.setupDocuments();

        // CALIBRACIÓN (NUEVO)
        this.setupCalibracion();

        // FIRMA
        this.setupSignature();

        // BÚSQUEDA
        this.setupSearch();

        // GESTIÓN DE CALIBRACIONES
        this.setupCalibracionManagement();

        console.log('✅ Event listeners con calibraciones configurados');
    }

    setupNavigation() {
        const navButtons = {
            'btnLogout': () => this.logout(),
            'btnDashboard': () => this.showDashboard(),
            'btnNuevoRegistro': () => this.openModal(),
            'btnCalibraciones': () => this.showCalibraciones(),
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

    // ===== NUEVO: SETUP CALIBRACIÓN =====
    setupCalibracion() {
        const calibracionNo = document.getElementById('calibracionNo');
        const calibracionSi = document.getElementById('calibracionSi');

        if (calibracionNo) {
            calibracionNo.addEventListener('click', () => this.handleCalibracionDecision(false));
        }

        if (calibracionSi) {
            calibracionSi.addEventListener('click', () => this.handleCalibracionDecision(true));
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
                    userInfo.textContent = `Centro: ${this.getTallerName(taller)} • MVP Demo`;
                }

                this.updateStats();
                this.updateCalibracionesBadge();
                this.showDashboard();

                this.showAlert('✅ MVP con Calibraciones iniciado correctamente', 'success');
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

    // ===== NUEVA SECCIÓN: CALIBRACIONES =====
    showCalibraciones() {
        this.hideAllSections();
        this.showSection('calibraciones');
        this.updateNavigation('btnCalibraciones');
        this.loadCalibracionesList();
    }

    showCalibracionesTab(tab) {
        this.showingCalibracionesTab = tab;

        // Actualizar pestañas
        const tabPendientes = document.getElementById('tabPendientes');
        const tabCompletadas = document.getElementById('tabCompletadas');

        if (tabPendientes && tabCompletadas) {
            tabPendientes.classList.toggle('active', tab === 'pendientes');
            tabCompletadas.classList.toggle('active', tab === 'completadas');
        }

        this.loadCalibracionesList();
    }

    loadCalibracionesList() {
        const container = document.getElementById('calibracionesList');
        if (!container) return;

        container.innerHTML = '';

        // Filtrar calibraciones según pestaña activa y centro actual
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

        // Actualizar contadores
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

        // Mostrar calibraciones
        filteredCalibraciones.forEach(calibracion => {
            const card = document.createElement('div');
            card.className = 'calibracion-card';

            const statusClass = calibracion.estado === 'completada' ? 
                (calibracion.resultadoCalibracion === 'ok' ? 'completada' : 'problema') : 
                '';

            const statusText = {
                'pendiente': '🔄 Pendiente',
                'en_proceso': '⚙️ En Proceso',
                'completada': calibracion.resultadoCalibracion === 'ok' ? '✅ Completada OK' : '⚠️ Completada con Problemas'
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
                            <span class="calibracion-info-label">Fecha creación:</span>
                            <span class="calibracion-info-value">${calibracion.fechaCreacion}</span>
                        </div>
                        ${calibracion.tecnico ? `
                            <div class="calibracion-info-item">
                                <span class="calibracion-info-label">Técnico:</span>
                                <span class="calibracion-info-value">${calibracion.tecnico}</span>
                            </div>
                        ` : ''}
                        ${calibracion.fechaCompletado ? `
                            <div class="calibracion-info-item">
                                <span class="calibracion-info-label">Fecha completado:</span>
                                <span class="calibracion-info-value">${calibracion.fechaCompletado}</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="calibracion-actions">
                        ${calibracion.estado === 'pendiente' || calibracion.estado === 'en_proceso' ? 
                            `<button onclick="app.startCalibracionProcess(${calibracion.id})" class="btn btn-warning btn-sm">🎯 Procesar Calibración</button>` :
                            `<button onclick="app.viewCalibracionDetails(${calibracion.id})" class="btn btn-info btn-sm">👁️ Ver Detalles</button>`
                        }
                        <button onclick="app.generateCalibracionPDF(${calibracion.id})" class="btn btn-primary btn-sm">📋 Generar PDF</button>
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

    updateCalibracionesBadge() {
        const badge = document.getElementById('calibracionesBadge');
        if (!badge || !this.currentTaller) return;

        const pendientes = this.calibraciones.filter(cal => 
            cal.centro === this.getTallerName(this.currentTaller) && 
            (cal.estado === 'pendiente' || cal.estado === 'en_proceso')
        ).length;

        badge.textContent = pendientes;
        badge.style.display = pendientes > 0 ? 'block' : 'none';
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

    // ===== ESTADÍSTICAS ACTUALIZADAS =====
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

        // Contar calibraciones del centro actual
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
                        <span class="stat-item">🎯 ${exp.requiereCalibracion ? 'Sí' : 'No'}</span>
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
        grid.className = 'photos-grid-mobile';

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
                    <p>Intenta con otros términos</p>
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
                    <p><strong>Fotos:</strong> ${fotosCount}</p>
                    <p><strong>Calibración:</strong> ${exp.requiereCalibracion ? 'Requerida' : 'No necesaria'}</p>
                </div>
                <div class="result-actions">
                    <button onclick="app.viewExpediente('${exp.id}')" class="btn btn-outline btn-sm">👁️ Ver</button>
                    <button onclick="app.generatePDF(${exp.id})" class="btn btn-primary btn-sm">📋 PDF</button>
                </div>
            `;

            results.appendChild(card);
        });
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

        // Actualizar fecha en vista previa
        const currentDate = document.getElementById('currentDate');
        if (currentDate) {
            currentDate.textContent = new Date().toLocaleDateString();
        }

        // Actualizar centro en vista previa
        const centerInfo = document.getElementById('centerInfoPDF');
        if (centerInfo) {
            const h4Element = centerInfo.querySelector('h4');
            if (h4Element) {
                h4Element.textContent = `Centro: ${this.getTallerName(this.currentTaller)}`;
            }
        }

        const modal = document.getElementById('registroModal');
        if (modal) {
            modal.classList.add('active');
            console.log('✅ Modal abierto - Proceso con 5 pasos y calibración');
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

                const preview = document.getElementById('cameraPreview');
                const captureBtn = document.getElementById('capturePhoto');
                if (preview) preview.style.display = 'none';
                if (captureBtn) captureBtn.style.display = 'none';
            } catch (error) {
                console.error('Error cerrando cámara:', error);
            }
        }

        console.log('👋 Modal cerrado');
    }

    updateSteps() {
        // Actualizar indicadores de pasos (ahora 5)
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
        const finishBtn = document.getElementById('finishStep');

        if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        if (nextBtn) nextBtn.style.display = this.currentStep < this.maxSteps ? 'block' : 'none';
        if (finishBtn) finishBtn.style.display = this.currentStep === this.maxSteps ? 'block' : 'none';

        // Configurar funcionalidades específicas del paso
        if (this.currentStep === 3) {
            this.updateCalibracionInfo();
        } else if (this.currentStep === 4) {
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

    // ===== PASO 1: CÁMARA (igual que antes) =====

    async startCamera() {
        try {
            this.cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            const preview = document.getElementById('cameraPreview');
            const captureBtn = document.getElementById('capturePhoto');

            if (preview && captureBtn) {
                preview.srcObject = this.cameraStream;
                preview.style.display = 'block';
                captureBtn.style.display = 'block';

                this.showAlert('📷 Cámara activada. Pulse "Capturar Foto"', 'success');
            }
        } catch (error) {
            console.error('Error accediendo a la cámara:', error);
            this.showAlert('❌ No se pudo acceder a la cámara. Use "Subir Foto".', 'warning');
        }
    }

    capturePhoto() {
        try {
            const preview = document.getElementById('cameraPreview');
            const canvas = document.getElementById('photoCanvas');

            if (!preview || !canvas || !this.cameraStream) return;

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

                    // Simular OCR si es la primera foto
                    if (this.currentExpedient.fotos.length === 1) {
                        setTimeout(() => this.processOCR(), 1500);
                    }

                    this.showAlert('📸 Foto capturada correctamente', 'success');
                }
            }, 'image/jpeg', 0.8);
        } catch (error) {
            console.error('Error capturando foto:', error);
            this.showAlert('❌ Error al capturar foto. Intente de nuevo.', 'warning');
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

            // OCR en la primera foto
            if (files.length > 0 && this.currentExpedient.fotos.filter(f => f.blob).length === 1) {
                setTimeout(() => this.processOCR(), 1000);
            }

            this.showAlert(`📁 ${files.length} foto(s) subida(s)`, 'success');
            event.target.value = '';
        } catch (error) {
            console.error('Error subiendo fotos:', error);
            this.showAlert('❌ Error al subir fotos. Intente de nuevo.', 'warning');
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
                    <p>Use la cámara o suba archivos</p>
                </div>
            `;
            return;
        }

        this.currentExpedient.fotos.forEach((foto, index) => {
            const item = document.createElement('div');
            item.className = 'photo-item';
            item.innerHTML = `
                <div class="photo-thumbnail">
                    <img src="${foto.url}" alt="${foto.nombre}" loading="lazy">
                </div>
                <div class="photo-info">
                    <div class="photo-name">${foto.nombre}</div>
                    <div class="photo-meta">
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
                <p>Analizando imagen con IA...</p>
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
                            <span class="detail-value">Tesseract OCR</span>
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
                    <button onclick="app.confirmMatricula()" class="btn btn-success btn-mobile">✅ Confirmar Matrícula</button>
                </div>
            `;

            this.updatePDFPreview();
        }, 3000);
    }

    confirmMatricula() {
        this.showAlert('✅ Matrícula 6792LNJ confirmada', 'success');
        this.updatePDFPreview();
    }

    // ===== PASO 2: DOCUMENTOS (igual que antes) =====

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
                        <div class="processing">⏳ Procesando con OCR...</div>
                    </div>
                </div>
            `;

            this.currentExpedient.documentos[tipo] = {
                file: file,
                url: URL.createObjectURL(file),
                nombre: file.name,
                size: file.size
            };

            // Simular procesamiento OCR
            setTimeout(() => {
                const processingDiv = preview.querySelector('.processing');
                if (processingDiv) {
                    processingDiv.innerHTML = '✅ Datos extraídos correctamente';
                    processingDiv.style.color = '#28a745';
                }

                this.showAlert(`✅ ${tipo === 'ficha' ? 'Ficha técnica' : 'Póliza'} procesada`, 'success');
                this.updatePDFPreview();
            }, 2000);
        } catch (error) {
            console.error(`Error subiendo ${tipo}:`, error);
            this.showAlert(`❌ Error al subir ${tipo}. Intente de nuevo.`, 'warning');
        }
    }

    // ===== PASO 3: CALIBRACIÓN (NUEVO) =====

    updateCalibracionInfo() {
        const calibracionCentro = document.getElementById('calibracionCentro');
        const calibracionMatricula = document.getElementById('calibracionMatricula');

        if (calibracionCentro && this.currentTaller) {
            calibracionCentro.textContent = this.getTallerName(this.currentTaller);
        }

        if (calibracionMatricula && this.currentExpedient.matricula) {
            calibracionMatricula.textContent = this.currentExpedient.matricula;
        }
    }

    handleCalibracionDecision(requiere) {
        this.currentExpedient.requiereCalibracion = requiere;

        const calibracionInfo = document.getElementById('calibracionInfo');

        if (requiere) {
            // Crear registro de calibración
            const nuevaCalibracion = {
                id: Date.now(),
                matricula: this.currentExpedient.matricula,
                cliente: this.currentExpedient.cliente || 'Cliente MVP Demo',
                vehiculo: this.currentExpedient.vehiculo || 'Vehículo Demo',
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
            this.updateCalibracionesBadge();

            // Mostrar información de calibración creada
            if (calibracionInfo) {
                calibracionInfo.style.display = 'block';
                this.updateCalibracionInfo();
            }

            this.showAlert(
                '🎯 Calibración requerida\n\n' +
                'Se ha creado un registro de calibración pendiente.\n' +
                'Podrá gestionarlo desde la sección "Calibraciones".',
                'warning'
            );
        } else {
            // No requiere calibración
            if (calibracionInfo) {
                calibracionInfo.style.display = 'none';
            }

            this.showAlert('✅ El vehículo no requiere calibración', 'success');
        }

        this.updatePDFPreview();

        // Auto-avanzar al siguiente paso después de 2 segundos
        setTimeout(() => {
            this.nextStep();
        }, 2000);
    }

    // ===== PASO 4: FIRMA DIGITAL (igual que antes) =====

    initSignature() {
        try {
            const canvas = document.getElementById('signatureCanvas');
            if (!canvas) return;

            this.signatureCanvas = canvas;
            this.signatureCtx = canvas.getContext('2d');

            // Configurar canvas responsive
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
            canvas.addEventListener('mouseout', () => this.stopDrawing());

            // Events para touch (móvil)
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
            this.showAlert('❌ Error al inicializar la firma. Use la opción de completar sin firma.', 'warning');
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

            // Ocultar placeholder
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
                this.updatePDFPreview();
            }
        } catch (error) {
            console.error('Error limpiando firma:', error);
        }
    }

    saveSignature() {
        try {
            if (this.signatureCanvas) {
                this.currentExpedient.firma = this.signatureCanvas.toDataURL('image/png');
                this.showAlert('✅ Firma guardada correctamente', 'success');
                this.updatePDFPreview();
            }
        } catch (error) {
            console.error('Error guardando firma:', error);
            this.showAlert('❌ Error al guardar la firma. Intente de nuevo.', 'warning');
        }
    }

    // ===== PASO 5: RESUMEN Y PDF CON CALIBRACIÓN =====

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

        this.updatePDFPreview();
    }

    updatePDFPreview() {
        try {
            const exp = this.currentExpedient;

            // Actualizar elementos de vista previa
            const elements = {
                'pdfMatricula': exp.matricula || 'No detectada',
                'pdfFotos': exp.fotos.length.toString(),
                'pdfDocs': Object.keys(exp.documentos).filter(k => exp.documentos[k]).length.toString(),
                'pdfCalibracion': exp.requiereCalibracion ? 'Requerida' : 'No requerida',
                'pdfFirma': exp.firma ? 'Sí' : 'No'
            };

            Object.entries(elements).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            });
        } catch (error) {
            console.error('Error actualizando vista previa PDF:', error);
        }
    }

    generateCompletePDF() {
        try {
            // Mostrar loading
            const btn = document.getElementById('generatePDFBtn');
            if (btn) {
                btn.innerHTML = '⏳ Generando PDF...';
                btn.disabled = true;
            }

            // Verificar datos mínimos
            if (!this.currentExpedient.fotos.length) {
                this.showAlert('⚠️ Necesita al menos una foto para generar el PDF', 'warning');
                if (btn) {
                    btn.innerHTML = '📥 Descargar Informe PDF';
                    btn.disabled = false;
                }
                return;
            }

            // Intentar usar jsPDF si está disponible
            if (typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF) {
                this.generateRealPDF();
            } else {
                // Fallback: simulación exitosa
                this.generateSimulatedPDF();
            }

        } catch (error) {
            console.error('Error en generateCompletePDF:', error);
            // En caso de error, usar simulación
            this.generateSimulatedPDF();
        }
    }

    generateRealPDF() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const exp = this.currentExpedient;
            const centerName = this.getTallerName(this.currentTaller);

            // HEADER CON LOGO Y CENTRO
            doc.setFillColor(26, 77, 114);
            doc.rect(20, 10, 40, 15, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.text('GLASSDRIVE', 25, 20);

            // Centro de trabajo
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text(`Centro: ${centerName}`, 70, 20);

            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 70, 28);

            // TÍTULO
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text('INFORME DE RECEPCIÓN DE VEHÍCULO', 20, 45);

            // INFORMACIÓN DEL VEHÍCULO
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('DATOS DEL VEHÍCULO:', 20, 65);

            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            let yPos = 75;

            doc.text(`Matrícula: ${exp.matricula}`, 25, yPos);
            yPos += 8;
            doc.text(`Cliente: ${exp.cliente || 'Cliente MVP Demo'}`, 25, yPos);
            yPos += 8;
            doc.text(`Centro: ${centerName}`, 25, yPos);
            yPos += 8;
            doc.text(`Fecha registro: ${new Date().toLocaleDateString()}`, 25, yPos);

            // CALIBRACIÓN (NUEVO)
            yPos += 20;
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('CALIBRACIÓN:', 20, yPos);

            yPos += 10;
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text(`Requiere calibración: ${exp.requiereCalibracion ? 'SÍ' : 'NO'}`, 25, yPos);

            if (exp.requiereCalibracion) {
                yPos += 8;
                doc.text(`Estado: Registrado como pendiente de calibrar`, 25, yPos);
                yPos += 8;
                doc.text(`Fecha registro calibración: ${new Date().toLocaleDateString()}`, 25, yPos);
            }

            // ARCHIVOS Y DOCUMENTACIÓN
            yPos += 20;
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('DOCUMENTACIÓN ADJUNTA:', 20, yPos);

            yPos += 10;
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text(`• Fotografías del vehículo: ${exp.fotos.length} archivos`, 25, yPos);
            yPos += 8;
            doc.text(`• Ficha técnica: ${exp.documentos.ficha ? 'SÍ' : 'NO'}`, 25, yPos);
            yPos += 8;
            doc.text(`• Póliza de seguro: ${exp.documentos.poliza ? 'SÍ' : 'NO'}`, 25, yPos);
            yPos += 8;
            doc.text(`• Firma digital: ${exp.firma ? 'SÍ' : 'NO'}`, 25, yPos);

            // DETALLES DE FOTOS
            if (exp.fotos.length > 0) {
                yPos += 20;
                if (yPos > 240) {
                    doc.addPage();
                    yPos = 30;
                }
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text('DETALLES DE FOTOGRAFÍAS:', 20, yPos);

                yPos += 10;
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');

                exp.fotos.forEach((foto, index) => {
                    if (yPos > 250) {
                        doc.addPage();
                        yPos = 30;
                    }
                    doc.text(`${index + 1}. ${foto.nombre} - ${(foto.size / 1024).toFixed(1)} KB`, 25, yPos);
                    yPos += 6;
                });
            }

            // FOOTER
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text('GlassDrive MVP - Sistema con Gestión de Calibraciones', 20, 285);
                doc.text(`Página ${i} de ${pageCount} - Generado: ${new Date().toLocaleString()}`, 20, 290);
            }

            // DESCARGAR
            const fileName = `GlassDrive-${exp.matricula || 'MVP'}-${centerName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            this.showAlert(`📥 PDF descargado: ${fileName}`, 'success');

            // Finalizar registro después de generar PDF
            setTimeout(() => {
                this.finishRegistro();
            }, 1000);

        } catch (error) {
            console.error('Error generando PDF real:', error);
            this.generateSimulatedPDF();
        }
    }

    generateSimulatedPDF() {
        try {
            const exp = this.currentExpedient;
            const centerName = this.getTallerName(this.currentTaller);

            // Simular tiempo de generación
            setTimeout(() => {
                const fileName = `GlassDrive-${exp.matricula || 'MVP'}-${centerName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

                this.showAlert(
                    `✅ PDF GENERADO EXITOSAMENTE\n\n` +
                    `📄 Archivo: ${fileName}\n` +
                    `🏢 Centro: ${centerName}\n` +
                    `🚗 Matrícula: ${exp.matricula || 'MVP Demo'}\n` +
                    `📸 Fotos: ${exp.fotos.length}\n` +
                    `📋 Documentos: ${Object.keys(exp.documentos).filter(k => exp.documentos[k]).length}\n` +
                    `🎯 Calibración: ${exp.requiereCalibracion ? 'Requerida' : 'No'}\n` +
                    `✍️ Firma: ${exp.firma ? 'Incluida' : 'No'}`,
                    'success'
                );

                // Finalizar registro
                setTimeout(() => {
                    this.finishRegistro();
                }, 2000);

            }, 1500);

        } catch (error) {
            console.error('Error en simulación PDF:', error);
            this.showAlert('❌ Error al generar PDF. Intente de nuevo.', 'danger');

            const btn = document.getElementById('generatePDFBtn');
            if (btn) {
                btn.innerHTML = '📥 Descargar Informe PDF';
                btn.disabled = false;
            }
        }
    }

    finishRegistro() {
        try {
            // Crear expediente final
            const expediente = {
                id: this.currentExpedient.id,
                matricula: this.currentExpedient.matricula || 'MVP-Demo',
                cliente: this.currentExpedient.cliente || 'Cliente MVP',
                vehiculo: this.currentExpedient.vehiculo || 'Vehículo MVP',
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
                `🏢 Centro: ${expediente.centro}\n` +
                `📸 Fotos: ${expediente.datos.fotos.length}\n` +
                `📄 Documentos: ${Object.keys(expediente.datos.documentos).filter(k => expediente.datos.documentos[k].presente).length}\n` +
                `🎯 Calibración: ${expediente.requiereCalibracion ? 'Requerida' : 'No'}\n` +
                `✍️ Firma: ${expediente.datos.firma ? 'Sí' : 'No'}\n\n` +
                `✅ PDF generado y expediente guardado`,
                'success'
            );

        } catch (error) {
            console.error('Error finalizando registro:', error);
            this.showAlert('❌ Error al finalizar el registro. Intente de nuevo.', 'danger');
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
        } else {
            content.innerHTML = this.getCalibracionViewHTML();
        }

        modal.classList.add('active');
    }

    getCalibracionProcessHTML() {
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
                            <span class="detail-label">Fecha creación:</span>
                            <span class="detail-value">${this.currentCalibracion.fechaCreacion}</span>
                        </div>
                    </div>
                </div>

                <div class="calibracion-form-section">
                    <h4>👨‍🔧 Datos del Técnico</h4>
                    <div class="form-group">
                        <label for="tecnicoNombre">Nombre del Técnico:</label>
                        <input type="text" id="tecnicoNombre" placeholder="Ingrese nombre del técnico" required>
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

                <div class="calibracion-form-section" id="observacionesSection">
                    <h4>📝 Observaciones</h4>
                    <div class="form-group">
                        <textarea id="observaciones" placeholder="Observaciones generales de la calibración..." rows="3"></textarea>
                    </div>
                </div>

                <div class="calibracion-form-section" id="problemasSection" style="display: none;">
                    <h4>🔧 Detalles de Problemas</h4>
                    <div class="form-group">
                        <label for="detallesProblema">¿Qué problemas encontró?</label>
                        <textarea id="detallesProblema" placeholder="Describa los problemas encontrados durante la calibración..." rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="accionesRealizadas">¿Qué acciones realizó para solucionarlos?</label>
                        <textarea id="accionesRealizadas" placeholder="Describa las acciones realizadas para finalizar la calibración..." rows="3"></textarea>
                    </div>
                </div>
            </div>
        `;
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
                            <span class="detail-label">Vehículo:</span>
                            <span class="detail-value">${cal.vehiculo}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Centro:</span>
                            <span class="detail-value">${cal.centro}</span>
                        </div>
                    </div>
                </div>

                <div class="calibracion-process-info">
                    <h4>⚙️ Información del Proceso</h4>
                    <div class="process-details">
                        <div class="detail-row">
                            <span class="detail-label">Fecha creación:</span>
                            <span class="detail-value">${cal.fechaCreacion}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Estado:</span>
                            <span class="detail-value detail-value-${cal.estado === 'completada' ? 
                                (cal.resultadoCalibracion === 'ok' ? 'calibracion-ok' : 'calibracion-problem') : 
                                'calibracion-pending'}">
                                ${cal.estado === 'completada' ? 
                                    (cal.resultadoCalibracion === 'ok' ? 'Completada OK' : 'Completada con Problemas') : 
                                    'Pendiente'}
                            </span>
                        </div>
                        ${cal.tecnico ? `
                            <div class="detail-row">
                                <span class="detail-label">Técnico:</span>
                                <span class="detail-value">${cal.tecnico}</span>
                            </div>
                        ` : ''}
                        ${cal.fechaCompletado ? `
                            <div class="detail-row">
                                <span class="detail-label">Fecha completado:</span>
                                <span class="detail-value">${cal.fechaCompletado}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                ${cal.observaciones ? `
                    <div class="calibracion-observations">
                        <h4>📝 Observaciones</h4>
                        <div class="observation-text">${cal.observaciones}</div>
                    </div>
                ` : ''}

                ${cal.resultadoCalibracion === 'problema' ? `
                    <div class="calibracion-problems">
                        <h4>⚠️ Detalles de Problemas</h4>
                        ${cal.detallesProblema ? `
                            <div class="problem-section">
                                <h5>🔧 Problemas encontrados:</h5>
                                <div class="problem-text">${cal.detallesProblema}</div>
                            </div>
                        ` : ''}
                        ${cal.accionesRealizadas ? `
                            <div class="problem-section">
                                <h5>✅ Acciones realizadas:</h5>
                                <div class="problem-text">${cal.accionesRealizadas}</div>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
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

        const tecnico = document.getElementById('tecnicoNombre')?.value.trim();
        const observaciones = document.getElementById('observaciones')?.value.trim() || '';

        if (!tecnico) {
            this.showAlert('⚠️ Ingrese el nombre del técnico', 'warning');
            return;
        }

        // Determinar resultado según botones presionados
        const resultadoOkPressed = document.getElementById('resultadoOk')?.classList.contains('active');
        const resultadoProblemaPressed = document.getElementById('resultadoProblema')?.classList.contains('active');

        if (!resultadoOkPressed && !resultadoProblemaPressed) {
            this.showAlert('⚠️ Seleccione el resultado de la calibración', 'warning');
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
            this.currentCalibracion.detallesProblema = document.getElementById('detallesProblema')?.value.trim() || '';
            this.currentCalibracion.accionesRealizadas = document.getElementById('accionesRealizadas')?.value.trim() || '';
        }

        // Cerrar modal y actualizar vista
        this.closeCalibracionModal();
        this.loadCalibracionesList();
        this.updateCalibracionesBadge();
        this.updateStats();

        this.showAlert(
            `✅ Calibración completada exitosamente\n\n` +
            `🚗 Matrícula: ${this.currentCalibracion.matricula}\n` +
            `👨‍🔧 Técnico: ${tecnico}\n` +
            `🎯 Resultado: ${resultado === 'ok' ? 'OK' : 'Con problemas'}\n` +
            `📅 Fecha: ${new Date().toLocaleDateString()}`,
            'success'
        );
    }

    generateCalibracionPDF(calibracionId) {
        const calibracion = this.calibraciones.find(c => c.id === calibracionId);
        if (!calibracion) {
            this.showAlert('❌ Calibración no encontrada', 'danger');
            return;
        }

        // Simular generación de PDF de calibración
        this.showAlert(`⏳ Generando PDF de calibración para ${calibracion.matricula}...`, 'info');

        setTimeout(() => {
            this.showAlert(`📥 PDF de calibración generado: Calibracion-${calibracion.matricula}.pdf`, 'success');
        }, 1500);
    }

    // ===== UTILIDADES =====

    generatePDF(expedienteId) {
        try {
            const expediente = this.expedientes.find(e => e.id == expedienteId);
            if (!expediente) {
                this.showAlert('❌ Expediente no encontrado', 'danger');
                return;
            }

            // Simular generación de PDF para expedientes existentes
            this.showAlert(`⏳ Generando PDF para ${expediente.matricula}...`, 'info');

            setTimeout(() => {
                this.showAlert(`📥 PDF generado: ${expediente.matricula}.pdf`, 'success');
            }, 1500);

        } catch (error) {
            console.error('Error generando PDF expediente:', error);
            this.showAlert('❌ Error al generar PDF. Intente de nuevo.', 'danger');
        }
    }

    viewExpediente(expedienteId) {
        try {
            const exp = this.expedientes.find(e => e.id == expedienteId);
            if (!exp) return;

            this.showAlert(
                `👁️ Expediente ${exp.matricula}\n\n` +
                `Cliente: ${exp.cliente}\n` +
                `Vehículo: ${exp.vehiculo}\n` +
                `Centro: ${exp.centro}\n` +
                `Fotos: ${exp.datos.fotos ? exp.datos.fotos.length : 0}\n` +
                `Calibración: ${exp.requiereCalibracion ? 'Requerida' : 'No'}\n` +
                `Estado: ${exp.estado}`,
                'info'
            );
        } catch (error) {
            console.error('Error viendo expediente:', error);
        }
    }

    showAlert(message, type = 'info') {
        try {
            // Remover alertas anteriores del mismo tipo
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

            // Auto-remover después de tiempo basado en tipo
            const timeout = type === 'success' ? 8000 : type === 'danger' ? 10000 : 5000;
            setTimeout(() => {
                if (alertDiv.parentElement) {
                    alertDiv.remove();
                }
            }, timeout);

        } catch (error) {
            console.error('Error mostrando alerta:', error);
            // Fallback: usar alert nativo
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

/* Event listeners para botones de calibración en modal */
document.addEventListener('click', function(e) {
    if (e.target.id === 'resultadoOk') {
        e.target.classList.add('active');
        document.getElementById('resultadoProblema')?.classList.remove('active');
        document.getElementById('problemasSection').style.display = 'none';
    } else if (e.target.id === 'resultadoProblema') {
        e.target.classList.add('active');
        document.getElementById('resultadoOk')?.classList.remove('active');
        document.getElementById('problemasSection').style.display = 'block';
    }
});
`;
document.head.appendChild(alertStyles);

// Función de inicialización robusta
function initializeApp() {
    try {
        console.log('🚀 Inicializando GlassDrive MVP con Calibraciones...');

        if (typeof window.app === 'undefined') {
            window.app = new GlassDriveMVP();
        }

        console.log('✅ App con calibraciones inicializada correctamente');
    } catch (error) {
        console.error('❌ Error inicializando app:', error);
        alert('Error inicializando la aplicación. Recargue la página.');
    }
}

// Múltiples métodos de inicialización para máxima compatibilidad
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Backup adicional
setTimeout(() => {
    if (typeof window.app === 'undefined') {
        console.warn('⚠️ App no inicializada, intentando inicialización de respaldo...');
        initializeApp();
    }
}, 1000);

// Manejo global de errores
window.addEventListener('error', (event) => {
    console.error('❌ Error global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promise rechazada:', event.reason);
});
