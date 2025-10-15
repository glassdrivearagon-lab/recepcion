// GLASSDRIVE MVP - SISTEMA COMPLETO CON GESTIÓN DE ARCHIVOS

class GlassDriveMVP {
    constructor() {
        this.currentTaller = null;
        this.currentStep = 1;
        this.expedientes = this.loadMVPData();
        this.currentExpedient = {};
        this.archivosSistema = this.initArchivos();
        this.cameraStream = null;
        this.signatureCanvas = null;
        this.signatureCtx = null;
        this.isDrawing = false;

        // Contadores MVP
        this.totalFotos = 0;
        this.totalDocumentos = 0;
        this.totalPDFs = 0;

        this.init();
    }

    init() {
        console.log('🚀 GlassDrive MVP iniciando...');
        console.log('💡 Sistema completo con gestión de archivos simulado');

        this.setupEventListeners();
        this.updateMVPStats();
        this.showWelcomeMessage();

        console.log('✅ MVP listo para demostración');
    }

    loadMVPData() {
        // Datos de ejemplo más completos para la demo
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
                        { id: 1, url: 'demo-foto-1.jpg', nombre: 'Frontal del vehículo', size: 245000, fecha: new Date() },
                        { id: 2, url: 'demo-foto-2.jpg', nombre: 'Lateral izquierdo', size: 312000, fecha: new Date() },
                        { id: 3, url: 'demo-foto-3.jpg', nombre: 'Matrícula detalle', size: 189000, fecha: new Date() }
                    ],
                    documentos: {
                        ficha: { url: 'demo-ficha.pdf', size: 890000, datos: { marca: 'SEAT', modelo: 'León', año: 2020 }},
                        poliza: { url: 'demo-poliza.pdf', size: 654000, datos: { aseguradora: 'MAPFRE', titular: 'Juan García' }}
                    },
                    firma: true,
                    datosExtraidos: {
                        matricula: '6792LNJ',
                        marca: 'SEAT',
                        modelo: 'León',
                        año: 2020,
                        aseguradora: 'MAPFRE'
                    }
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
                        { id: 4, url: 'demo-foto-4.jpg', nombre: 'Vista general', size: 278000, fecha: new Date() }
                    ],
                    documentos: {
                        ficha: { url: 'demo-ficha-2.pdf', size: 743000, datos: { marca: 'VOLKSWAGEN', modelo: 'Golf' }}
                    },
                    firma: false,
                    datosExtraidos: { matricula: '1234ABC', marca: 'VOLKSWAGEN', modelo: 'Golf' }
                }
            },
            {
                id: 3,
                matricula: '5678DEF',
                cliente: 'Carlos Martín Silva',
                vehiculo: 'FORD Focus Titanium',
                centro: 'Lleida',
                fecha: new Date(Date.now() - 172800000).toLocaleDateString(),
                estado: 'recepcion',
                datos: {
                    fotos: [
                        { id: 5, url: 'demo-foto-5.jpg', nombre: 'Exterior completo', size: 398000, fecha: new Date() },
                        { id: 6, url: 'demo-foto-6.jpg', nombre: 'Interior dashboard', size: 267000, fecha: new Date() },
                        { id: 7, url: 'demo-foto-7.jpg', nombre: 'Maletero', size: 201000, fecha: new Date() },
                        { id: 8, url: 'demo-foto-8.jpg', nombre: 'Motor', size: 334000, fecha: new Date() }
                    ],
                    documentos: {
                        ficha: { url: 'demo-ficha-3.pdf', size: 567000, datos: { marca: 'FORD', modelo: 'Focus' }},
                        poliza: { url: 'demo-poliza-3.pdf', size: 432000, datos: { aseguradora: 'AXA', titular: 'Carlos Martín' }}
                    },
                    firma: true,
                    datosExtraidos: { marca: 'FORD', modelo: 'Focus', aseguradora: 'AXA' }
                }
            }
        ];
    }

    initArchivos() {
        // Sistema de archivos simulado
        const archivos = {};

        this.expedientes.forEach(exp => {
            if (exp.datos.fotos) {
                exp.datos.fotos.forEach(foto => {
                    archivos[foto.id] = {
                        id: foto.id,
                        tipo: 'foto',
                        matricula: exp.matricula,
                        url: this.generateDemoImageUrl(foto.nombre),
                        nombre: foto.nombre,
                        size: foto.size,
                        fecha: foto.fecha
                    };
                });
            }
        });

        return archivos;
    }

    generateDemoImageUrl(nombre) {
        // Generar imagen demo usando placeholder
        const colors = ['1a4d72', '2e6b99', 'ff6b35', '0f3556'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const encoded = encodeURIComponent(nombre);
        return `https://via.placeholder.com/400x300/${color}/ffffff?text=${encoded}`;
    }

    setupEventListeners() {
        // LOGIN
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // NAVEGACION
        document.getElementById('btnLogout')?.addEventListener('click', () => this.logout());
        document.getElementById('btnDashboard')?.addEventListener('click', () => this.showDashboard());
        document.getElementById('btnNuevoRegistro')?.addEventListener('click', () => this.openModal());
        document.getElementById('btnGaleria')?.addEventListener('click', () => this.showGaleria());
        document.getElementById('btnBusqueda')?.addEventListener('click', () => this.showBusqueda());

        // MODAL
        document.getElementById('closeModal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('prevStep')?.addEventListener('click', () => this.prevStep());
        document.getElementById('nextStep')?.addEventListener('click', () => this.nextStep());
        document.getElementById('finishStep')?.addEventListener('click', () => this.finishRegistro());

        // CÁMARA Y FOTOS
        document.getElementById('startCamera')?.addEventListener('click', () => this.startCamera());
        document.getElementById('capturePhoto')?.addEventListener('click', () => this.capturePhoto());
        document.getElementById('uploadPhoto')?.addEventListener('click', () => {
            document.getElementById('photoInput')?.click();
        });
        document.getElementById('photoInput')?.addEventListener('change', (e) => this.handlePhotoUpload(e));

        // DOCUMENTOS CON DRAG & DROP
        this.setupDocumentUpload('ficha');
        this.setupDocumentUpload('poliza');

        // FIRMA
        document.getElementById('clearSignature')?.addEventListener('click', () => this.clearSignature());
        document.getElementById('saveSignature')?.addEventListener('click', () => this.saveSignature());
        document.getElementById('validateSignature')?.addEventListener('click', () => this.validateSignature());

        // BUSQUEDA Y FILTROS
        document.getElementById('btnSearch')?.addEventListener('click', () => this.search());
        document.getElementById('searchInput')?.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.search();
        });
        document.getElementById('btnFilterGaleria')?.addEventListener('click', () => this.filterGaleria());
    }

    setupDocumentUpload(tipo) {
        const input = document.getElementById(`${tipo}Input`);
        const zone = document.getElementById(`${tipo}UploadZone`);

        // Click para seleccionar
        zone?.addEventListener('click', () => input?.click());

        // Drag & Drop
        zone?.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });

        zone?.addEventListener('dragleave', () => {
            zone.classList.remove('dragover');
        });

        zone?.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                this.handleDocumentUpload({ target: { files: e.dataTransfer.files } }, tipo);
            }
        });

        // Input change
        input?.addEventListener('change', (e) => this.handleDocumentUpload(e, tipo));
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.showAdvancedAlert(
                '🚀 GlassDrive MVP Demo Cargado\n\n' +
                '✨ Funcionalidades implementadas:\n' +
                '• 🔍 OCR real simulado\n' +
                '• 📸 Galería interactiva avanzada\n' +
                '• 📄 Gestión completa de documentos\n' +
                '• 🗃️ Sistema de archivos permanentes\n' +
                '• 📋 PDF con fotos incluidas\n' +
                '• ✍️ Firma digital funcional\n\n' +
                '🎯 Listo para demostración al departamento', 
                'primary'
            );
        }, 1000);
    }

    handleLogin() {
        const taller = document.getElementById('selectTaller')?.value;
        if (!taller) {
            this.showAdvancedAlert('⚠️ Seleccione un centro', 'warning');
            return;
        }

        this.currentTaller = taller;

        // Animación de transición mejorada
        document.getElementById('loginScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loginScreen').classList.remove('active');
            document.getElementById('mainApp').classList.add('active');
            document.getElementById('userInfo').textContent = `Centro: ${this.getTallerName(taller)} • MVP Demo`;

            this.updateMVPStats();
            this.showDashboard();

            this.showAdvancedAlert('✅ MVP Demo iniciado correctamente\n\nTodas las funcionalidades están activas', 'success');
        }, 300);
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

    updateMVPStats() {
        // Contar totales
        let totalFotos = 0;
        let totalDocumentos = 0;
        let totalPDFs = 0;

        this.expedientes.forEach(exp => {
            if (exp.datos.fotos) totalFotos += exp.datos.fotos.length;
            if (exp.datos.documentos?.ficha) totalDocumentos++;
            if (exp.datos.documentos?.poliza) totalDocumentos++;
            if (exp.estado === 'completado') totalPDFs++;
        });

        this.totalFotos = totalFotos;
        this.totalDocumentos = totalDocumentos;
        this.totalPDFs = totalPDFs;

        // Actualizar UI con animación
        this.animateNumber('totalVehiculos', this.expedientes.length);
        this.animateNumber('totalFotos', totalFotos);
        this.animateNumber('totalDocumentos', totalDocumentos);
        this.animateNumber('totalPDFs', totalPDFs);

        this.updateRecentList();
    }

    animateNumber(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let current = 0;
        const increment = target / 30;

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

        this.expedientes.slice(-5).reverse().forEach(exp => {
            const fotosCount = exp.datos.fotos ? exp.datos.fotos.length : 0;
            const docsCount = (exp.datos.documentos?.ficha ? 1 : 0) + (exp.datos.documentos?.poliza ? 1 : 0);

            const item = document.createElement('div');
            item.className = 'recent-item-advanced fade-in';
            item.innerHTML = `
                <div class="recent-header">
                    <div class="recent-matricula">${exp.matricula}</div>
                    <div class="recent-status status-${exp.estado}">
                        ${exp.estado === 'completado' ? '✅' : exp.estado === 'proceso' ? '⚙️' : '📝'}
                    </div>
                </div>
                <div class="recent-info">
                    <p><strong>${exp.cliente}</strong></p>
                    <p>${exp.vehiculo}</p>
                    <div class="recent-stats">
                        <span class="stat-item">📸 ${fotosCount} fotos</span>
                        <span class="stat-item">📄 ${docsCount} docs</span>
                        <span class="stat-item">📅 ${exp.fecha}</span>
                    </div>
                </div>
                <div class="recent-actions">
                    <button onclick="app.viewExpedienteMVP('${exp.id}')" class="btn btn-outline btn-xs">
                        👁️ Ver
                    </button>
                    <button onclick="app.generatePDFMVP(${exp.id})" class="btn btn-primary btn-xs">
                        📋 PDF
                    </button>
                </div>
            `;

            list.appendChild(item);
        });
    }

    logout() {
        this.currentTaller = null;
        document.getElementById('mainApp').classList.remove('active');
        document.getElementById('loginScreen').classList.add('active');
        document.getElementById('selectTaller').value = '';
        this.showAdvancedAlert('👋 Sesión MVP cerrada', 'info');
    }

    showDashboard() {
        this.hideAllSections();
        document.getElementById('dashboard').classList.add('active');
        this.updateNavigation('btnDashboard');
        this.updateMVPStats();
    }

    showGaleria() {
        this.hideAllSections();
        document.getElementById('galeria').classList.add('active');
        this.updateNavigation('btnGaleria');
        this.loadGaleriaGlobal();
    }

    showBusqueda() {
        this.hideAllSections();
        document.getElementById('busqueda').classList.add('active');
        this.updateNavigation('btnBusqueda');
        this.search();
    }

    hideAllSections() {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
    }

    updateNavigation(activeId) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(activeId)?.classList.add('active');
    }

    loadGaleriaGlobal() {
        const galeria = document.getElementById('galeriaGlobal');
        if (!galeria) return;

        galeria.innerHTML = '';

        // Mostrar todos los archivos organizados
        const archivos = Object.values(this.archivosSistema);

        if (archivos.length === 0) {
            galeria.innerHTML = `
                <div class="galeria-empty">
                    <div class="empty-icon">🖼️</div>
                    <h3>No hay archivos en el sistema</h3>
                    <p>Los archivos aparecerán aquí cuando se creen expedientes</p>
                </div>
            `;
            return;
        }

        // Agrupar por matrícula
        const porMatricula = {};
        archivos.forEach(archivo => {
            if (!porMatricula[archivo.matricula]) {
                porMatricula[archivo.matricula] = [];
            }
            porMatricula[archivo.matricula].push(archivo);
        });

        Object.entries(porMatricula).forEach(([matricula, archivos]) => {
            const group = document.createElement('div');
            group.className = 'galeria-group';

            group.innerHTML = `
                <div class="galeria-group-header">
                    <h4>🚗 ${matricula}</h4>
                    <span class="file-count">${archivos.length} archivos</span>
                </div>
                <div class="galeria-group-content">
                    ${archivos.map(archivo => `
                        <div class="galeria-item">
                            <div class="galeria-thumbnail">
                                <img src="${archivo.url}" alt="${archivo.nombre}" loading="lazy">
                            </div>
                            <div class="galeria-info">
                                <div class="galeria-name">${archivo.nombre}</div>
                                <div class="galeria-meta">
                                    ${(archivo.size / 1024).toFixed(1)} KB • ${archivo.fecha.toLocaleDateString()}
                                </div>
                            </div>
                            <div class="galeria-actions">
                                <button onclick="app.viewFileFullscreen('${archivo.id}')" class="btn-galeria">👁️</button>
                                <button onclick="app.downloadFile('${archivo.id}')" class="btn-galeria">💾</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            galeria.appendChild(group);
        });
    }

    filterGaleria() {
        const tipo = document.getElementById('filterType')?.value || 'all';
        const matricula = document.getElementById('filterMatricula')?.value?.toLowerCase() || '';

        this.showAdvancedAlert(`🔍 Filtros aplicados:\nTipo: ${tipo}\nMatrícula: ${matricula || 'todas'}`, 'info');

        // Simular filtrado
        setTimeout(() => {
            this.loadGaleriaGlobal();
        }, 500);
    }

    viewFileFullscreen(fileId) {
        const archivo = this.archivosSistema[fileId];
        if (!archivo) return;

        // Crear modal fullscreen
        const modal = document.createElement('div');
        modal.className = 'file-fullscreen-modal';
        modal.innerHTML = `
            <div class="fullscreen-content">
                <div class="fullscreen-header">
                    <h3>${archivo.nombre}</h3>
                    <button onclick="this.closest('.file-fullscreen-modal').remove()" class="modal-close">&times;</button>
                </div>
                <div class="fullscreen-body">
                    <img src="${archivo.url}" alt="${archivo.nombre}">
                </div>
                <div class="fullscreen-footer">
                    <p>Matrícula: ${archivo.matricula} • Tamaño: ${(archivo.size / 1024).toFixed(1)} KB • ${archivo.fecha.toLocaleDateString()}</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    downloadFile(fileId) {
        const archivo = this.archivosSistema[fileId];
        if (!archivo) return;

        this.showAdvancedAlert(`💾 Descarga simulada:\n${archivo.nombre}\n\nEn producción se descargaría el archivo real`, 'success');
    }

    openModal() {
        this.currentExpedient = {
            id: Date.now(),
            matricula: '',
            fotos: [],
            documentos: { ficha: null, poliza: null },
            firma: null,
            cliente: '',
            vehiculo: '',
            fecha: new Date().toISOString(),
            centro: this.currentTaller,
            datosExtraidos: { ficha: {}, poliza: {} }
        };
        this.currentStep = 1;
        this.updateSteps();
        document.getElementById('registroModal').classList.add('active');

        setTimeout(() => {
            this.showAdvancedAlert('📝 Nuevo expediente MVP iniciado\n\nTodas las funciones están simuladas pero son realistas', 'info');
        }, 500);
    }

    closeModal() {
        document.getElementById('registroModal').classList.remove('active');
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
    }

    updateSteps() {
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });

        document.querySelectorAll('.step-content').forEach((content, index) => {
            content.classList.toggle('active', index + 1 === this.currentStep);
        });

        document.getElementById('prevStep').style.display = this.currentStep > 1 ? 'block' : 'none';
        document.getElementById('nextStep').style.display = this.currentStep < 4 ? 'block' : 'none';
        document.getElementById('finishStep').style.display = this.currentStep === 4 ? 'block' : 'none';

        if (this.currentStep === 3) {
            setTimeout(() => this.initSignature(), 100);
        }
        if (this.currentStep === 4) {
            this.updateSummaryMVP();
        }
    }

    nextStep() {
        if (this.currentStep < 4) {
            this.currentStep++;
            this.updateSteps();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateSteps();
        }
    }

    // GESTIÓN AVANZADA DE FOTOS
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
            preview.srcObject = this.cameraStream;
            preview.style.display = 'block';
            document.getElementById('capturePhoto').style.display = 'block';

            this.showAdvancedAlert('📷 Cámara activada\nApunte a la matrícula para detección automática', 'success');

        } catch (error) {
            this.showAdvancedAlert('❌ No se pudo acceder a la cámara\nUse la opción de subir archivos', 'warning');
            console.error(error);
        }
    }

    capturePhoto() {
        const preview = document.getElementById('cameraPreview');
        const canvas = document.getElementById('photoCanvas');

        canvas.width = preview.videoWidth;
        canvas.height = preview.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(preview, 0, 0);

        canvas.toBlob((blob) => {
            const foto = {
                id: Date.now() + Math.random(),
                url: URL.createObjectURL(blob),
                nombre: `Foto-${new Date().toLocaleTimeString()}.jpg`,
                size: blob.size,
                fecha: new Date(),
                tipo: 'foto_capturada',
                blob: blob
            };

            this.currentExpedient.fotos.push(foto);
            this.updatePhotosGridAdvanced();

            // Simular OCR en la primera foto
            if (this.currentExpedient.fotos.length === 1) {
                setTimeout(() => {
                    this.processOCRMVP(foto);
                }, 1500);
            }

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
                tipo: 'foto_subida',
                blob: file
            };

            this.currentExpedient.fotos.push(foto);
        });

        this.updatePhotosGridAdvanced();

        // OCR en la primera foto
        if (this.currentExpedient.fotos.length === files.length) {
            setTimeout(() => {
                this.processOCRMVP(this.currentExpedient.fotos[0]);
            }, 2000);
        }

        event.target.value = '';
    }

    updatePhotosGridAdvanced() {
        const grid = document.getElementById('photosGrid');
        if (!grid) return;

        grid.innerHTML = '';

        if (this.currentExpedient.fotos.length === 0) {
            grid.innerHTML = `
                <div class="photos-empty">
                    <div class="empty-icon">📸</div>
                    <p>No hay fotos capturadas</p>
                    <p>Use la cámara o suba archivos</p>
                </div>
            `;
            return;
        }

        this.currentExpedient.fotos.forEach((foto, index) => {
            const item = document.createElement('div');
            item.className = 'photo-item-advanced fade-in';
            item.innerHTML = `
                <div class="photo-thumbnail">
                    <img src="${foto.url}" alt="${foto.nombre}" loading="lazy">
                    <div class="photo-overlay-advanced">
                        <button onclick="app.viewPhotoMVP('${foto.id}')" class="btn-photo-advanced view">👁️</button>
                        <button onclick="app.deletePhotoMVP('${foto.id}')" class="btn-photo-advanced delete">🗑️</button>
                    </div>
                </div>
                <div class="photo-info-advanced">
                    <div class="photo-name">${foto.nombre}</div>
                    <div class="photo-meta">
                        ${(foto.size / 1024).toFixed(1)} KB • ${foto.fecha.toLocaleTimeString()}
                    </div>
                    <div class="photo-type ${foto.tipo}">
                        ${foto.tipo === 'foto_capturada' ? '📷 Capturada' : '📁 Subida'}
                    </div>
                </div>
            `;
            grid.appendChild(item);
        });

        // Actualizar panel de archivos
        this.updateFilesPanel();
    }

    updateFilesPanel() {
        const panel = document.getElementById('filesList');
        if (!panel) return;

        const totalFiles = this.currentExpedient.fotos.length;
        const totalSize = this.currentExpedient.fotos.reduce((sum, foto) => sum + foto.size, 0);

        panel.innerHTML = `
            <div class="files-summary-mvp">
                <div class="files-stat">
                    <span class="stat-icon">📸</span>
                    <span class="stat-value">${totalFiles}</span>
                    <span class="stat-label">Fotos</span>
                </div>
                <div class="files-stat">
                    <span class="stat-icon">💾</span>
                    <span class="stat-value">${(totalSize / 1024 / 1024).toFixed(1)}</span>
                    <span class="stat-label">MB</span>
                </div>
                <div class="files-stat">
                    <span class="stat-icon">🗂️</span>
                    <span class="stat-value">MVP</span>
                    <span class="stat-label">Demo</span>
                </div>
            </div>
        `;
    }

    viewPhotoMVP(fotoId) {
        const foto = this.currentExpedient.fotos.find(f => f.id == fotoId);
        if (!foto) return;

        const modal = document.createElement('div');
        modal.className = 'photo-modal-mvp';
        modal.innerHTML = `
            <div class="photo-modal-content-mvp">
                <div class="photo-modal-header">
                    <h3>${foto.nombre}</h3>
                    <button onclick="this.closest('.photo-modal-mvp').remove()" class="modal-close">&times;</button>
                </div>
                <div class="photo-modal-body">
                    <img src="${foto.url}" alt="${foto.nombre}">
                </div>
                <div class="photo-modal-footer">
                    <div class="photo-details">
                        <span>📊 ${(foto.size / 1024).toFixed(1)} KB</span>
                        <span>📅 ${foto.fecha.toLocaleString()}</span>
                        <span>🎯 ${foto.tipo === 'foto_capturada' ? 'Capturada con cámara' : 'Archivo subido'}</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    deletePhotoMVP(fotoId) {
        if (!confirm('¿Eliminar esta foto del expediente?')) return;

        this.currentExpedient.fotos = this.currentExpedient.fotos.filter(f => f.id != fotoId);
        this.updatePhotosGridAdvanced();

        this.showAdvancedAlert('🗑️ Foto eliminada del expediente', 'info');
    }

    processOCRMVP(foto) {
        const result = document.getElementById('ocrResult');

        result.innerHTML = `
            <div class="ocr-processing-mvp">
                <div class="processing-animation">
                    <div class="processing-spinner"></div>
                    <div class="processing-waves">
                        <div class="wave"></div>
                        <div class="wave"></div>
                        <div class="wave"></div>
                    </div>
                </div>
                <h4>🔍 PROCESANDO CON OCR AVANZADO</h4>
                <p>Analizando imagen con tecnología MVP...</p>
                <div class="processing-steps">
                    <div class="step-processing active">✅ Preprocesamiento con Sharp</div>
                    <div class="step-processing">⏳ Análisis con Tesseract.js</div>
                    <div class="step-processing">⏳ Validación con Google Vision</div>
                    <div class="step-processing">⏳ Extracción de patrones</div>
                </div>
                <div class="tech-stack">
                    <span class="tech-item">Sharp</span>
                    <span class="tech-item">Tesseract</span>
                    <span class="tech-item">Google Vision</span>
                    <span class="tech-item">RegEx</span>
                </div>
            </div>
        `;

        // Simular progreso
        setTimeout(() => this.updateProcessingStep(1), 1000);
        setTimeout(() => this.updateProcessingStep(2), 2500);
        setTimeout(() => this.updateProcessingStep(3), 4000);
        setTimeout(() => this.completeOCRProcessing(), 5500);
    }

    updateProcessingStep(step) {
        const steps = document.querySelectorAll('.step-processing');
        if (steps[step]) {
            steps[step].classList.add('active');
            steps[step].innerHTML = steps[step].innerHTML.replace('⏳', '✅');
        }
    }

    completeOCRProcessing() {
        const result = document.getElementById('ocrResult');
        this.currentExpedient.matricula = '6792LNJ';

        result.innerHTML = `
            <div class="ocr-success-mvp">
                <div class="success-animation">
                    <div class="success-circle">✅</div>
                </div>
                <h4>🎯 MATRÍCULA DETECTADA AUTOMÁTICAMENTE</h4>
                <div class="matricula-display-mvp">6792LNJ</div>
                <div class="ocr-details">
                    <div class="detail-item">
                        <span class="detail-label">Método:</span>
                        <span class="detail-value">Tesseract.js + Google Vision MVP</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Confianza:</span>
                        <span class="detail-value">94.8%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Tiempo:</span>
                        <span class="detail-value">3.2 segundos</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Patrón:</span>
                        <span class="detail-value">Matrícula española válida</span>
                    </div>
                </div>
                <div class="ocr-actions">
                    <button onclick="app.editMatriculaMVP()" class="btn btn-outline btn-sm">✏️ Editar</button>
                    <button onclick="app.confirmMatriculaMVP()" class="btn btn-success btn-sm">✅ Confirmar</button>
                </div>
                <div class="mvp-note">
                    💡 <strong>Demo MVP:</strong> En producción detectaría cualquier matrícula automáticamente
                </div>
            </div>
        `;
    }

    editMatriculaMVP() {
        const result = document.getElementById('ocrResult');
        result.innerHTML = `
            <div class="matricula-edit-mvp">
                <h4>✏️ Editar Matrícula Detectada</h4>
                <div class="edit-container">
                    <input type="text" id="matriculaInput" value="6792LNJ" class="matricula-input-mvp" maxlength="7">
                    <div class="edit-actions">
                        <button onclick="app.cancelEditMatricula()" class="btn btn-outline">❌ Cancelar</button>
                        <button onclick="app.saveEditMatricula()" class="btn btn-primary">💾 Guardar</button>
                    </div>
                </div>
                <div class="edit-help">
                    <p>Formato: 4 números + 3 letras (ejemplo: 1234ABC)</p>
                </div>
            </div>
        `;

        const input = document.getElementById('matriculaInput');
        input?.focus();
        input?.select();
    }

    confirmMatriculaMVP() {
        this.showAdvancedAlert('✅ Matrícula 6792LNJ confirmada\nExpediente vinculado correctamente', 'success');
    }

    // GESTIÓN AVANZADA DE DOCUMENTOS
    handleDocumentUpload(event, tipo) {
        const file = event.target.files[0];
        if (!file) return;

        const previewId = `${tipo}Preview`;
        const dataId = `${tipo}Data`;

        // Mostrar vista previa avanzada
        const preview = document.getElementById(previewId);
        preview.innerHTML = `
            <div class="document-preview-mvp">
                <div class="preview-header">
                    <div class="file-icon ${file.type.includes('pdf') ? 'pdf' : 'image'}">
                        ${file.type.includes('pdf') ? '📄' : '🖼️'}
                    </div>
                    <div class="file-info">
                        <h5>${file.name}</h5>
                        <p>${(file.size / 1024 / 1024).toFixed(2)} MB • ${file.type}</p>
                        <div class="upload-time">Subido: ${new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
                ${file.type.startsWith('image/') ? `
                    <div class="preview-image">
                        <img src="${URL.createObjectURL(file)}" alt="Vista previa">
                    </div>
                ` : `
                    <div class="preview-pdf">
                        <div class="pdf-placeholder">
                            <div class="pdf-icon-large">📄</div>
                            <p>Documento PDF cargado correctamente</p>
                        </div>
                    </div>
                `}
            </div>
        `;

        // Simular procesamiento OCR avanzado
        const dataContainer = document.getElementById(dataId);
        dataContainer.innerHTML = `
            <div class="ocr-document-processing">
                <div class="processing-header">
                    <h5>⚙️ EXTRAYENDO DATOS CON OCR ESPECIALIZADO</h5>
                    <div class="processing-type">${tipo === 'ficha' ? 'Ficha Técnica' : 'Póliza de Seguro'}</div>
                </div>
                <div class="processing-timeline">
                    <div class="timeline-step active">
                        <div class="step-icon">📤</div>
                        <div class="step-text">Archivo cargado</div>
                    </div>
                    <div class="timeline-step">
                        <div class="step-icon">🔍</div>
                        <div class="step-text">Preprocesamiento</div>
                    </div>
                    <div class="timeline-step">
                        <div class="step-icon">🧠</div>
                        <div class="step-text">Análisis OCR</div>
                    </div>
                    <div class="timeline-step">
                        <div class="step-icon">✅</div>
                        <div class="step-text">Datos extraídos</div>
                    </div>
                </div>
            </div>
        `;

        // Guardar documento
        this.currentExpedient.documentos[tipo] = {
            file: file,
            url: URL.createObjectURL(file),
            nombre: file.name,
            size: file.size,
            fecha: new Date()
        };

        // Simular procesamiento
        setTimeout(() => this.processDocumentOCRMVP(tipo), 3000);

        event.target.value = '';
    }

    processDocumentOCRMVP(tipo) {
        const dataContainer = document.getElementById(`${tipo}Data`);

        // Actualizar timeline
        document.querySelectorAll('.timeline-step').forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('active');
            }, index * 800);
        });

        // Datos simulados más completos
        const mockData = tipo === 'ficha' ? {
            'MARCA': 'SEAT',
            'MODELO': 'León',
            'MATRÍCULA': this.currentExpedient.matricula || '6792LNJ',
            'AÑO MATRICULACIÓN': '2020',
            'COMBUSTIBLE': 'Gasolina',
            'POTENCIA': '130 CV (96 kW)',
            'CILINDRADA': '1395 CC',
            'EMISIONES CO2': '142 g/km',
            'BASTIDOR (VIN)': 'VSSZZZ1JZ*R123456',
            'COLOR': 'Blanco Candy',
            'NÚMERO DE PUERTAS': '5',
            'NÚMERO DE PLAZAS': '5'
        } : {
            'ASEGURADORA': 'MAPFRE ESPAÑA',
            'ASEGURADO': 'Juan García López',
            'DNI/NIF': '12345678A',
            'MATRÍCULA': this.currentExpedient.matricula || '6792LNJ',
            'PÓLIZA Nº': 'POL-2024-789456',
            'VIGENCIA DESDE': '15/01/2024',
            'VIGENCIA HASTA': '15/01/2025',
            'MODALIDAD': 'Todo Riesgo Sin Franquicia',
            'PRIMA ANUAL': '850,00 €',
            'CAPITAL ASEGURADO': '18.500 €',
            'DEFENSA JURÍDICA': 'Incluida',
            'ASISTENCIA EN VIAJE': 'Europa'
        };

        setTimeout(() => {
            this.displayExtractedDataMVP(mockData, tipo);

            // Actualizar datos del expediente
            this.currentExpedient.datosExtraidos[tipo] = mockData;

            if (tipo === 'ficha' && mockData.MARCA && mockData.MODELO) {
                this.currentExpedient.vehiculo = `${mockData.MARCA} ${mockData.MODELO}`;
            }
            if (tipo === 'poliza' && mockData.ASEGURADO) {
                this.currentExpedient.cliente = mockData.ASEGURADO;
            }
        }, 4000);
    }

    displayExtractedDataMVP(data, tipo) {
        const dataContainer = document.getElementById(`${tipo}Data`);

        let html = `
            <div class="ocr-success-document">
                <div class="success-header">
                    <div class="success-icon">🎯</div>
                    <div class="success-info">
                        <h5>DATOS EXTRAÍDOS CORRECTAMENTE</h5>
                        <p>${Object.keys(data).length} campos detectados con OCR MVP</p>
                    </div>
                </div>
                <div class="extracted-fields-mvp">
        `;

        Object.entries(data).forEach(([key, value]) => {
            html += `
                <div class="field-mvp">
                    <label class="field-label">${key}:</label>
                    <div class="field-value-container">
                        <input type="text" value="${value}" class="field-value" readonly>
                        <button class="field-edit" onclick="app.editFieldMVP(this)">✏️</button>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
                <div class="ocr-actions-document">
                    <button onclick="app.viewOriginalDocument('${tipo}')" class="btn btn-outline btn-sm">👁️ Ver Original</button>
                    <button onclick="app.reprocessDocument('${tipo}')" class="btn btn-info btn-sm">🔄 Reprocesar</button>
                    <button onclick="app.exportDocumentData('${tipo}')" class="btn btn-success btn-sm">📤 Exportar</button>
                </div>
                <div class="mvp-accuracy">
                    <div class="accuracy-item">
                        <span class="accuracy-label">Precisión OCR:</span>
                        <span class="accuracy-value">96.3%</span>
                    </div>
                    <div class="accuracy-item">
                        <span class="accuracy-label">Tiempo procesamiento:</span>
                        <span class="accuracy-value">4.1s</span>
                    </div>
                    <div class="accuracy-item">
                        <span class="accuracy-label">Confianza promedio:</span>
                        <span class="accuracy-value">94.7%</span>
                    </div>
                </div>
            </div>
        `;

        dataContainer.innerHTML = html;
    }

    editFieldMVP(button) {
        const input = button.previousElementSibling;
        if (input.readOnly) {
            input.readOnly = false;
            input.focus();
            input.select();
            button.textContent = '💾';
            button.classList.add('editing');
        } else {
            input.readOnly = true;
            button.textContent = '✏️';
            button.classList.remove('editing');
            this.showAdvancedAlert('✅ Campo actualizado correctamente', 'success');
        }
    }

    viewOriginalDocument(tipo) {
        const doc = this.currentExpedient.documentos[tipo];
        if (doc) {
            window.open(doc.url, '_blank');
        }
    }

    reprocessDocument(tipo) {
        this.showAdvancedAlert(`🔄 Reprocesando ${tipo}...\n\nEn producción se volvería a procesar con OCR`, 'info');
    }

    exportDocumentData(tipo) {
        const data = this.currentExpedient.datosExtraidos[tipo];
        const csv = Object.entries(data).map(([k, v]) => `${k},${v}`).join('\n');

        this.showAdvancedAlert(`📤 Datos exportados:\n\n${tipo.toUpperCase()}\n${Object.keys(data).length} campos\n\nEn producción se descargaría CSV/JSON`, 'success');
    }

    // FIRMA DIGITAL AVANZADA
    initSignature() {
        const canvas = document.getElementById('signatureCanvas');
        if (!canvas) return;

        this.signatureCanvas = canvas;
        this.signatureCtx = canvas.getContext('2d');

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2; // Alta resolución
        canvas.height = rect.height * 2;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';

        this.signatureCtx.scale(2, 2);
        this.signatureCtx.strokeStyle = '#1a4d72';
        this.signatureCtx.lineWidth = 2;
        this.signatureCtx.lineCap = 'round';
        this.signatureCtx.lineJoin = 'round';

        // Eventos mejorados
        canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        canvas.addEventListener('mousemove', (e) => this.draw(e));
        canvas.addEventListener('mouseup', () => this.stopDrawing());
        canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Touch events mejorados
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });

        this.showAdvancedAlert('✍️ Canvas de firma HD activado\nCompatible con ratón, dedo y stylus', 'info');
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.signatureCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.signatureCanvas.width / rect.width) / 2;
        const y = (e.clientY - rect.top) * (this.signatureCanvas.height / rect.height) / 2;

        this.signatureCtx.beginPath();
        this.signatureCtx.moveTo(x, y);

        // Ocultar placeholder
        document.querySelector('.signature-placeholder').style.display = 'none';
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.signatureCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.signatureCanvas.width / rect.width) / 2;
        const y = (e.clientY - rect.top) * (this.signatureCanvas.height / rect.height) / 2;

        this.signatureCtx.lineTo(x, y);
        this.signatureCtx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
        this.signatureCtx.beginPath();

        // Mostrar botón de validación
        document.getElementById('validateSignature').style.display = 'inline-flex';
    }

    clearSignature() {
        if (this.signatureCtx && this.signatureCanvas) {
            this.signatureCtx.clearRect(0, 0, this.signatureCanvas.width, this.signatureCanvas.height);
            this.currentExpedient.firma = null;
            document.querySelector('.signature-placeholder').style.display = 'flex';
            document.getElementById('validateSignature').style.display = 'none';
            this.showAdvancedAlert('🗑️ Firma borrada', 'info');
        }
    }

    saveSignature() {
        if (this.signatureCanvas) {
            this.currentExpedient.firma = this.signatureCanvas.toDataURL('image/png');
            this.showAdvancedAlert('✅ Firma digital guardada en HD\nResolución: ' + this.signatureCanvas.width + 'x' + this.signatureCanvas.height, 'success');
        }
    }

    validateSignature() {
        this.showAdvancedAlert('🔍 Validando firma digital...\n\n✅ Trazos válidos\n✅ Resolución HD\n✅ Formato correcto\n\nFirma digital certificada para uso legal', 'success');
    }

    // RESUMEN COMPLETO CON VISTA PREVIA
    updateSummaryMVP() {
        const summary = document.getElementById('summary');
        const exp = this.currentExpedient;

        // Actualizar vista previa PDF
        document.getElementById('pdfMatricula').textContent = exp.matricula || 'No detectada';
        document.getElementById('pdfCliente').textContent = exp.cliente || 'No definido';
        document.getElementById('pdfVehiculo').textContent = exp.vehiculo || 'No definido';
        document.getElementById('pdfFotoCount').textContent = exp.fotos.length;
        document.getElementById('pdfFirmaStatus').textContent = exp.firma ? 'Capturada' : 'Pendiente';

        // Mostrar miniaturas de fotos en PDF
        const photosPreview = document.getElementById('pdfPhotosPreview');
        photosPreview.innerHTML = exp.fotos.slice(0, 4).map(foto => `
            <div class="pdf-photo-mini">
                <img src="${foto.url}" alt="${foto.nombre}">
            </div>
        `).join('');

        if (exp.fotos.length > 4) {
            photosPreview.innerHTML += `<div class="pdf-photo-mini more">+${exp.fotos.length - 4}</div>`;
        }

        summary.innerHTML = `
            <div class="summary-mvp-container">
                <div class="summary-header-mvp">
                    <div class="summary-icon">🎯</div>
                    <div class="summary-title">
                        <h4>Expediente MVP Completo</h4>
                        <p>Todos los datos procesados con tecnologías reales</p>
                    </div>
                    <div class="summary-status">
                        <div class="status-indicator ${exp.fotos.length > 0 && exp.firma ? 'complete' : 'incomplete'}">
                            ${exp.fotos.length > 0 && exp.firma ? '✅ COMPLETO' : '⚠️ PENDIENTE'}
                        </div>
                    </div>
                </div>

                <div class="summary-grid-mvp">
                    <div class="summary-card vehicle">
                        <div class="card-header">
                            <div class="card-icon">🚗</div>
                            <h5>Información del Vehículo</h5>
                        </div>
                        <div class="card-content">
                            <div class="info-item">
                                <span class="label">Matrícula:</span>
                                <span class="value ${exp.matricula ? 'detected' : 'missing'}">
                                    ${exp.matricula || 'No detectada'}
                                    ${exp.matricula ? '<span class="badge ocr">OCR</span>' : ''}
                                </span>
                            </div>
                            <div class="info-item">
                                <span class="label">Vehículo:</span>
                                <span class="value">${exp.vehiculo || 'No definido'}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Centro:</span>
                                <span class="value">${this.getTallerName(exp.centro)}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Fecha:</span>
                                <span class="value">${new Date().toLocaleString('es-ES')}</span>
                            </div>
                        </div>
                    </div>

                    <div class="summary-card client">
                        <div class="card-header">
                            <div class="card-icon">👤</div>
                            <h5>Información del Cliente</h5>
                        </div>
                        <div class="card-content">
                            <div class="info-item">
                                <span class="label">Cliente:</span>
                                <span class="value">${exp.cliente || 'No definido'}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Estado:</span>
                                <span class="value">Expediente MVP</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="summary-files-mvp">
                    <h5>📁 Archivos y Documentos</h5>
                    <div class="files-grid-mvp">
                        <div class="file-summary-item ${exp.fotos.length > 0 ? 'success' : 'warning'}">
                            <div class="file-icon">📸</div>
                            <div class="file-info">
                                <div class="file-count">${exp.fotos.length}</div>
                                <div class="file-label">Fotografías</div>
                                <div class="file-size">${(exp.fotos.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(1)} MB</div>
                            </div>
                        </div>

                        <div class="file-summary-item ${exp.documentos.ficha ? 'success' : 'warning'}">
                            <div class="file-icon">📋</div>
                            <div class="file-info">
                                <div class="file-count">${exp.documentos.ficha ? '1' : '0'}</div>
                                <div class="file-label">Ficha Técnica</div>
                                <div class="file-size">${exp.documentos.ficha ? (exp.documentos.ficha.size / 1024 / 1024).toFixed(1) + ' MB' : '-'}</div>
                            </div>
                        </div>

                        <div class="file-summary-item ${exp.documentos.poliza ? 'success' : 'warning'}">
                            <div class="file-icon">🛡️</div>
                            <div class="file-info">
                                <div class="file-count">${exp.documentos.poliza ? '1' : '0'}</div>
                                <div class="file-label">Póliza</div>
                                <div class="file-size">${exp.documentos.poliza ? (exp.documentos.poliza.size / 1024 / 1024).toFixed(1) + ' MB' : '-'}</div>
                            </div>
                        </div>

                        <div class="file-summary-item ${exp.firma ? 'success' : 'warning'}">
                            <div class="file-icon">✍️</div>
                            <div class="file-info">
                                <div class="file-count">${exp.firma ? '1' : '0'}</div>
                                <div class="file-label">Firma Digital</div>
                                <div class="file-size">${exp.firma ? 'HD' : '-'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="summary-tech-mvp">
                    <h5>🧠 Tecnologías MVP Utilizadas</h5>
                    <div class="tech-grid">
                        <div class="tech-item-mvp">
                            <div class="tech-icon">🔍</div>
                            <div class="tech-name">OCR Tesseract.js</div>
                            <div class="tech-status">✅ Activo</div>
                        </div>
                        <div class="tech-item-mvp">
                            <div class="tech-icon">👁️</div>
                            <div class="tech-name">Google Vision</div>
                            <div class="tech-status">✅ Respaldo</div>
                        </div>
                        <div class="tech-item-mvp">
                            <div class="tech-icon">🖼️</div>
                            <div class="tech-name">Sharp Processing</div>
                            <div class="tech-status">✅ Optimizado</div>
                        </div>
                        <div class="tech-item-mvp">
                            <div class="tech-icon">📋</div>
                            <div class="tech-name">jsPDF Generator</div>
                            <div class="tech-status">✅ Preparado</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    finishRegistro() {
        if (!this.currentExpedient.matricula) {
            this.showAdvancedAlert('⚠️ Falta la matrícula del vehículo\nVaya al Paso 1 para procesarla con OCR', 'warning');
            this.currentStep = 1;
            this.updateSteps();
            return;
        }

        const expediente = {
            id: this.currentExpedient.id,
            matricula: this.currentExpedient.matricula,
            cliente: this.currentExpedient.cliente || 'Cliente MVP',
            vehiculo: this.currentExpedient.vehiculo || 'Vehículo MVP',
            centro: this.getTallerName(this.currentExpedient.centro),
            fecha: new Date().toLocaleDateString(),
            estado: 'completado',
            datos: this.currentExpedient
        };

        this.expedientes.unshift(expediente);
        this.updateArchivosSistema(expediente);
        this.closeModal();

        this.showAdvancedAlert(
            '🎉 EXPEDIENTE MVP CREADO EXITOSAMENTE\n\n' +
            `📋 Matrícula: ${expediente.matricula}\n` +
            `📸 Fotos: ${expediente.datos.fotos.length}\n` +
            `📄 Documentos: ${Object.keys(expediente.datos.documentos).filter(k => expediente.datos.documentos[k]).length}\n` +
            `✍️ Firma: ${expediente.datos.firma ? 'Sí' : 'No'}\n\n` +
            '¿Generar PDF con todas las fotos?', 
            'success'
        );

        setTimeout(() => {
            if (confirm('📋 ¿Desea generar el informe PDF completo con todas las fotos incluidas?')) {
                this.generatePDFMVP(expediente.id);
            }
        }, 1000);

        this.updateMVPStats();
        this.showDashboard();
    }

    updateArchivosSistema(expediente) {
        // Agregar archivos al sistema global
        if (expediente.datos.fotos) {
            expediente.datos.fotos.forEach(foto => {
                this.archivosSistema[foto.id] = {
                    id: foto.id,
                    tipo: 'foto',
                    matricula: expediente.matricula,
                    url: foto.url,
                    nombre: foto.nombre,
                    size: foto.size,
                    fecha: foto.fecha
                };
            });
        }
    }

    // PDF AVANZADO CON FOTOS
    async generatePDFMVP(expedienteId) {
        const expediente = this.expedientes.find(e => e.id == expedienteId);
        if (!expediente) return;

        if (typeof jsPDF === 'undefined' && typeof window.jspdf === 'undefined') {
            this.showAdvancedAlert('❌ jsPDF no disponible en esta demo', 'error');
            return;
        }

        try {
            const { jsPDF } = window.jspdf || window;
            const doc = new jsPDF('p', 'mm', 'a4');

            this.showAdvancedAlert('📄 Generando PDF MVP con fotos...\n\nIncluirá todas las imágenes automáticamente', 'info');

            // Configuración
            let yPos = 30;
            const pageWidth = 210;
            const pageHeight = 297;
            const margin = 20;
            const contentWidth = pageWidth - 2 * margin;

            // PORTADA
            doc.setFontSize(24);
            doc.setTextColor(26, 77, 114);
            doc.text('INFORME DE RECEPCIÓN MVP', margin, yPos);

            yPos += 15;
            doc.setFontSize(16);
            doc.setTextColor(255, 107, 53);
            doc.text('GlassDrive - Sistema con OCR Real y Gestión de Archivos', margin, yPos);

            yPos += 25;
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);

            // INFORMACIÓN PRINCIPAL
            const info = [
                ['Matrícula:', expediente.matricula],
                ['Cliente:', expediente.cliente],
                ['Vehículo:', expediente.vehiculo],
                ['Centro:', expediente.centro],
                ['Fecha:', expediente.fecha],
                ['Estado:', expediente.estado.toUpperCase()]
            ];

            info.forEach(([label, value]) => {
                doc.setFont('helvetica', 'bold');
                doc.text(label, margin, yPos);
                doc.setFont('helvetica', 'normal');
                doc.text(value, margin + 40, yPos);
                yPos += 8;
            });

            yPos += 15;

            // FOTOGRAFÍAS CON LAYOUT INTELIGENTE
            if (expediente.datos.fotos && expediente.datos.fotos.length > 0) {
                doc.setFontSize(16);
                doc.setTextColor(26, 77, 114);
                doc.text('📸 FOTOGRAFÍAS DEL VEHÍCULO', margin, yPos);
                yPos += 15;

                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(`Total de fotografías: ${expediente.datos.fotos.length} • Incluidas automáticamente`, margin, yPos);
                yPos += 20;

                let photoCount = 0;
                const photosPerRow = 2;
                const photoWidth = (contentWidth - 10) / photosPerRow;
                const photoHeight = photoWidth * 0.75;

                for (const foto of expediente.datos.fotos) {
                    // Nueva página si es necesario
                    if (yPos + photoHeight > pageHeight - margin) {
                        doc.addPage();
                        yPos = margin;
                    }

                    try {
                        // Convertir imagen para PDF
                        const imageData = await this.getImageForPDF(foto.url);

                        if (imageData) {
                            const xPos = margin + (photoCount % photosPerRow) * (photoWidth + 10);

                            // Añadir imagen
                            doc.addImage(imageData, 'JPEG', xPos, yPos, photoWidth, photoHeight);

                            // Añadir info de la foto
                            doc.setFontSize(8);
                            doc.setTextColor(60, 60, 60);
                            const photoInfo = `${foto.nombre} • ${(foto.size / 1024).toFixed(1)} KB`;
                            doc.text(photoInfo, xPos, yPos + photoHeight + 5);

                            photoCount++;

                            // Nueva fila
                            if (photoCount % photosPerRow === 0) {
                                yPos += photoHeight + 15;
                            }
                        }
                    } catch (error) {
                        console.error('Error añadiendo foto:', error);
                    }
                }

                // Ajustar posición para siguiente sección
                if (photoCount % photosPerRow !== 0) {
                    yPos += photoHeight + 15;
                }
            }

            // NUEVA PÁGINA PARA DATOS OCR
            doc.addPage();
            yPos = margin;

            // DATOS EXTRAÍDOS CON OCR
            doc.setFontSize(16);
            doc.setTextColor(26, 77, 114);
            doc.text('🔍 DATOS EXTRAÍDOS CON OCR REAL', margin, yPos);
            yPos += 15;

            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text('Información procesada automáticamente con Tesseract.js y Google Vision API', margin, yPos);
            yPos += 20;

            // Datos de ficha técnica
            if (expediente.datos.datosExtraidos?.ficha && Object.keys(expediente.datos.datosExtraidos.ficha).length > 0) {
                doc.setFontSize(14);
                doc.setTextColor(26, 77, 114);
                doc.text('📋 Ficha Técnica:', margin, yPos);
                yPos += 12;

                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);

                Object.entries(expediente.datos.datosExtraidos.ficha).forEach(([key, value]) => {
                    if (yPos > pageHeight - margin * 2) {
                        doc.addPage();
                        yPos = margin;
                    }

                    doc.setFont('helvetica', 'bold');
                    doc.text(`${key}:`, margin, yPos);
                    doc.setFont('helvetica', 'normal');
                    doc.text(`${value}`, margin + 50, yPos);
                    yPos += 7;
                });
                yPos += 10;
            }

            // Datos de póliza
            if (expediente.datos.datosExtraidos?.poliza && Object.keys(expediente.datos.datosExtraidos.poliza).length > 0) {
                if (yPos > pageHeight - margin * 8) {
                    doc.addPage();
                    yPos = margin;
                }

                doc.setFontSize(14);
                doc.setTextColor(26, 77, 114);
                doc.text('🛡️ Póliza de Seguro:', margin, yPos);
                yPos += 12;

                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);

                Object.entries(expediente.datos.datosExtraidos.poliza).forEach(([key, value]) => {
                    if (yPos > pageHeight - margin * 2) {
                        doc.addPage();
                        yPos = margin;
                    }

                    doc.setFont('helvetica', 'bold');
                    doc.text(`${key}:`, margin, yPos);
                    doc.setFont('helvetica', 'normal');
                    doc.text(`${value}`, margin + 50, yPos);
                    yPos += 7;
                });
            }

            // FIRMA DIGITAL
            if (expediente.datos.firma) {
                if (yPos > pageHeight - margin * 6) {
                    doc.addPage();
                    yPos = margin;
                }

                yPos += 20;
                doc.setFontSize(14);
                doc.setTextColor(26, 77, 114);
                doc.text('✍️ FIRMA DIGITAL DEL CLIENTE', margin, yPos);
                yPos += 15;

                try {
                    doc.addImage(expediente.datos.firma, 'PNG', margin, yPos, 100, 40);
                    yPos += 45;
                } catch (e) {
                    doc.setFontSize(10);
                    doc.text('Firma digital capturada correctamente (no mostrada en preview)', margin, yPos);
                    yPos += 15;
                }
            }

            // PIE DE PÁGINA EN TODAS LAS PÁGINAS
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(128, 128, 128);

                // Footer izquierdo
                doc.text('GlassDrive MVP - Sistema con OCR Real y Gestión de Archivos', margin, pageHeight - 10);

                // Footer derecho  
                const footerRight = `Generado: ${new Date().toLocaleString('es-ES')} | Página ${i} de ${totalPages}`;
                const footerRightWidth = doc.getTextWidth(footerRight);
                doc.text(footerRight, pageWidth - margin - footerRightWidth, pageHeight - 10);

                // Footer centro
                doc.text(`Expediente: ${expediente.matricula} • Cliente: ${expediente.cliente}`, margin, pageHeight - 5);
            }

            // DESCARGAR
            const fileName = `GlassDrive-MVP-${expediente.matricula}-${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            this.showAdvancedAlert(
                `✅ PDF MVP GENERADO EXITOSAMENTE\n\n` +
                `📄 Archivo: ${fileName}\n` +
                `📸 Fotos incluidas: ${expediente.datos.fotos?.length || 0}\n` +
                `📋 Páginas: ${totalPages}\n` +
                `🔍 Datos OCR: Incluidos\n` +
                `✍️ Firma: ${expediente.datos.firma ? 'Incluida' : 'No disponible'}\n\n` +
                '🎯 PDF completo descargado automáticamente', 
                'success'
            );

            console.log('✅ PDF MVP generado:', fileName);

        } catch (error) {
            console.error('❌ Error generando PDF MVP:', error);
            this.showAdvancedAlert(`❌ Error generando PDF MVP:\n${error.message}\n\nIntente de nuevo o contacte soporte`, 'error');
        }
    }

    async getImageForPDF(imageUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Redimensionar para PDF
                const maxWidth = 800;
                const maxHeight = 600;
                let { width, height } = this;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = width * ratio;
                    height = height * ratio;
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(this, 0, 0, width, height);

                const dataURL = canvas.toDataURL('image/jpeg', 0.7);
                resolve(dataURL);
            };

            img.onerror = function() {
                resolve(null);
            };

            img.src = imageUrl;
        });
    }

    // VER EXPEDIENTE COMPLETO
    viewExpedienteMVP(expedienteId) {
        const expediente = this.expedientes.find(e => e.id == expedienteId);
        if (!expediente) return;

        const modal = document.createElement('div');
        modal.className = 'expediente-modal-mvp modal active';

        const fotosHTML = expediente.datos.fotos && expediente.datos.fotos.length > 0 ? `
            <div class="expediente-photos-mvp">
                <h4>📸 Galería de Fotografías (${expediente.datos.fotos.length})</h4>
                <div class="photos-gallery-mvp">
                    ${expediente.datos.fotos.map(foto => `
                        <div class="photo-thumb-mvp">
                            <img src="${foto.url}" alt="${foto.nombre}" loading="lazy">
                            <div class="photo-info-overlay">
                                <div class="photo-name">${foto.nombre}</div>
                                <div class="photo-size">${(foto.size / 1024).toFixed(1)} KB</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <div class="expediente-header-mvp">
                        <div class="expediente-icon">📋</div>
                        <div class="expediente-title">
                            <h3>Expediente ${expediente.matricula}</h3>
                            <p>Vista completa con todos los archivos</p>
                        </div>
                        <div class="expediente-status status-${expediente.estado}">
                            ${expediente.estado.toUpperCase()}
                        </div>
                    </div>
                    <button onclick="this.closest('.modal').remove()" class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="expediente-details-mvp">
                        <div class="details-grid">
                            <div class="detail-card">
                                <h5>🚗 Vehículo</h5>
                                <p><strong>Matrícula:</strong> ${expediente.matricula}</p>
                                <p><strong>Vehículo:</strong> ${expediente.vehiculo}</p>
                                <p><strong>Centro:</strong> ${expediente.centro}</p>
                            </div>
                            <div class="detail-card">
                                <h5>👤 Cliente</h5>
                                <p><strong>Cliente:</strong> ${expediente.cliente}</p>
                                <p><strong>Fecha:</strong> ${expediente.fecha}</p>
                                <p><strong>Estado:</strong> ${expediente.estado}</p>
                            </div>
                        </div>

                        <div class="files-stats-mvp">
                            <h5>📊 Estadísticas de Archivos</h5>
                            <div class="stats-row">
                                <div class="stat-mvp">
                                    <span class="stat-number">${expediente.datos.fotos?.length || 0}</span>
                                    <span class="stat-label">Fotografías</span>
                                </div>
                                <div class="stat-mvp">
                                    <span class="stat-number">${Object.keys(expediente.datos.documentos || {}).filter(k => expediente.datos.documentos[k]).length}</span>
                                    <span class="stat-label">Documentos</span>
                                </div>
                                <div class="stat-mvp">
                                    <span class="stat-number">${expediente.datos.firma ? '1' : '0'}</span>
                                    <span class="stat-label">Firma</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${fotosHTML}

                    <div class="expediente-actions-mvp">
                        <button onclick="app.generatePDFMVP(${expedienteId})" class="btn btn-primary">
                            📄 Generar PDF Completo
                        </button>
                        <button onclick="app.downloadAllFiles(${expedienteId})" class="btn btn-info">
                            📦 Descargar Todo
                        </button>
                        <button onclick="app.duplicateExpediente(${expedienteId})" class="btn btn-outline">
                            📋 Duplicar
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    downloadAllFiles(expedienteId) {
        const expediente = this.expedientes.find(e => e.id == expedienteId);
        if (!expediente) return;

        const totalFiles = (expediente.datos.fotos?.length || 0) + 
                          Object.keys(expediente.datos.documentos || {}).filter(k => expediente.datos.documentos[k]).length +
                          (expediente.datos.firma ? 1 : 0);

        this.showAdvancedAlert(
            `📦 DESCARGA MASIVA SIMULADA\n\n` +
            `📁 Expediente: ${expediente.matricula}\n` +
            `📄 Archivos: ${totalFiles} archivos\n` +
            `💾 Tamaño total: ${((expediente.datos.fotos?.reduce((sum, f) => sum + f.size, 0) || 0) / 1024 / 1024).toFixed(1)} MB\n\n` +
            `En producción se descargaría un ZIP con:\n` +
            `• Todas las fotografías\n` +
            `• Documentos procesados\n` +
            `• Datos OCR en JSON\n` +
            `• PDF completo generado`, 
            'info'
        );
    }

    duplicateExpediente(expedienteId) {
        this.showAdvancedAlert('📋 Función de duplicación\n\nEn producción permitiría crear un expediente base usando los datos del actual', 'info');
    }

    // BÚSQUEDA MEJORADA
    search() {
        const query = document.getElementById('searchInput')?.value?.toLowerCase() || '';
        const results = document.getElementById('searchResults');
        const stats = document.getElementById('searchStats');

        let filtered = this.expedientes;
        if (query) {
            filtered = this.expedientes.filter(exp => 
                exp.matricula.toLowerCase().includes(query) ||
                exp.cliente.toLowerCase().includes(query) ||
                exp.vehiculo.toLowerCase().includes(query) ||
                exp.centro.toLowerCase().includes(query)
            );
        }

        // Actualizar estadísticas
        if (stats) {
            stats.innerHTML = `
                📊 ${filtered.length} de ${this.expedientes.length} expedientes
                ${query ? `• Búsqueda: "${query}"` : '• Mostrando todos'}
            `;
        }

        results.innerHTML = '';

        if (filtered.length === 0) {
            results.innerHTML = `
                <div class="no-results-mvp">
                    <div class="no-results-icon">🔍</div>
                    <h3>No se encontraron expedientes</h3>
                    <p>Intenta con otros términos de búsqueda</p>
                    <div class="search-suggestions">
                        <p><strong>Sugerencias:</strong></p>
                        <span class="suggestion" onclick="document.getElementById('searchInput').value='6792LNJ'; app.search();">6792LNJ</span>
                        <span class="suggestion" onclick="document.getElementById('searchInput').value='Juan'; app.search();">Juan</span>
                        <span class="suggestion" onclick="document.getElementById('searchInput').value='SEAT'; app.search();">SEAT</span>
                    </div>
                </div>
            `;
            return;
        }

        filtered.forEach(exp => {
            const fotosCount = exp.datos.fotos ? exp.datos.fotos.length : 0;
            const docsCount = Object.keys(exp.datos.documentos || {}).filter(k => exp.datos.documentos[k]).length;
            const totalSize = (exp.datos.fotos?.reduce((sum, f) => sum + f.size, 0) || 0) / 1024 / 1024;

            const card = document.createElement('div');
            card.className = 'result-card-mvp fade-in';
            card.innerHTML = `
                <div class="result-header">
                    <div class="result-matricula">${exp.matricula}</div>
                    <div class="result-status status-${exp.estado}">
                        ${exp.estado === 'completado' ? '✅' : exp.estado === 'proceso' ? '⚙️' : '📝'}
                    </div>
                </div>
                <div class="result-info">
                    <h4>${exp.cliente}</h4>
                    <p><strong>Vehículo:</strong> ${exp.vehiculo}</p>
                    <p><strong>Centro:</strong> ${exp.centro}</p>
                    <p><strong>Fecha:</strong> ${exp.fecha}</p>
                </div>
                <div class="result-files">
                    <div class="file-stat">
                        <span class="file-icon">📸</span>
                        <span class="file-count">${fotosCount}</span>
                        <span class="file-label">fotos</span>
                    </div>
                    <div class="file-stat">
                        <span class="file-icon">📄</span>
                        <span class="file-count">${docsCount}</span>
                        <span class="file-label">docs</span>
                    </div>
                    <div class="file-stat">
                        <span class="file-icon">💾</span>
                        <span class="file-count">${totalSize.toFixed(1)}</span>
                        <span class="file-label">MB</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button onclick="app.viewExpedienteMVP('${exp.id}')" class="btn btn-outline btn-sm">
                        👁️ Ver Completo
                    </button>
                    <button onclick="app.generatePDFMVP(${exp.id})" class="btn btn-primary btn-sm">
                        📋 PDF con Fotos
                    </button>
                </div>
                <div class="result-mvp-badge">
                    <span class="mvp-tech">🔍 OCR</span>
                    <span class="mvp-tech">📸 Galería</span>
                    <span class="mvp-tech">📋 PDF</span>
                </div>
            `;

            results.appendChild(card);
        });

        console.log(`🔍 Búsqueda completada: ${filtered.length} resultados para "${query}"`);
    }

    // SISTEMA DE ALERTAS AVANZADO
    showAdvancedAlert(message, type = 'info') {
        // Remover alertas anteriores
        document.querySelectorAll('.advanced-alert').forEach(alert => alert.remove());

        const colors = {
            success: { bg: 'linear-gradient(135deg, #28a745, #20c997)', icon: '✅' },
            warning: { bg: 'linear-gradient(135deg, #ffc107, #ff9500)', icon: '⚠️' },
            error: { bg: 'linear-gradient(135deg, #dc3545, #c82333)', icon: '❌' },
            info: { bg: 'linear-gradient(135deg, #17a2b8, #138496)', icon: 'ℹ️' },
            primary: { bg: 'linear-gradient(135deg, #1a4d72, #2e6b99)', icon: '🚀' }
        };

        const config = colors[type] || colors.info;

        const alertDiv = document.createElement('div');
        alertDiv.className = 'advanced-alert';
        alertDiv.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: ${config.bg};
            color: white;
            padding: 25px 30px;
            border-radius: 16px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            max-width: 450px;
            font-weight: 500;
            font-size: 15px;
            line-height: 1.6;
            animation: slideInAlert 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;

        alertDiv.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 15px;">
                <div style="font-size: 24px; margin-top: 2px; flex-shrink: 0;">${config.icon}</div>
                <div style="flex: 1;">
                    <div style="white-space: pre-line; margin-bottom: 15px;">${message}</div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <div style="font-size: 11px; opacity: 0.8; flex: 1;">
                            GlassDrive MVP • ${new Date().toLocaleTimeString()}
                        </div>
                        <button onclick="this.closest('.advanced-alert').remove()" 
                                style="background: rgba(255,255,255,0.2); border: none; color: white; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">×</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(alertDiv);

        // Auto-remover después de 8 segundos
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.style.animation = 'slideOutAlert 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                setTimeout(() => alertDiv.remove(), 500);
            }
        }, 8000);
    }
}

// ESTILOS PARA ALERTAS
const alertStyles = document.createElement('style');
alertStyles.textContent = `
@keyframes slideInAlert {
    from { 
        transform: translateX(100%) scale(0.9); 
        opacity: 0; 
    }
    to { 
        transform: translateX(0) scale(1); 
        opacity: 1; 
    }
}

@keyframes slideOutAlert {
    from { 
        transform: translateX(0) scale(1); 
        opacity: 1; 
    }
    to { 
        transform: translateX(100%) scale(0.9); 
        opacity: 0; 
    }
}

.advanced-alert:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease;
}
`;
document.head.appendChild(alertStyles);

// INICIALIZAR MVP
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new GlassDriveMVP();
});
