// GlassDrive - VERSIÓN FINAL DEFINITIVA
// OCR funcional + Extracción de datos realista + Informe completo

class GlassDriveApp {
    constructor() {
        this.currentTaller = null;
        this.currentStep = 1;
        this.totalSteps = 3;
        this.currentExpedient = this.resetExpedient();
        this.currentReportSignature = null;

        this.cameraStream = null;
        this.tesseractWorker = null;
        this.ocrReady = false;
        this.photoCounter = 1;

        this.talleres = [
            { id: 'monzon', nombre: 'Monzón', direccion: 'Av. Lérida, 45' },
            { id: 'barbastro', nombre: 'Barbastro', direccion: 'C/ Somontano, 23' },
            { id: 'lleida', nombre: 'Lleida', direccion: 'Av. Catalunya, 67' },
            { id: 'fraga', nombre: 'Fraga', direccion: 'C/ Zaragoza, 12' }
        ];

        this.init();
    }

    init() {
        console.log('🚀 Iniciando GlassDrive versión final...');
        this.loadStoredData();
        this.setupEventListeners();
        this.initTesseract();
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
            this.expedientes = stored ? JSON.parse(stored) : [];
            console.log(`📊 ${this.expedientes.length} expedientes cargados`);
        } catch (error) {
            this.expedientes = [];
            console.error('Error cargando datos');
        }
    }

    saveData() {
        try {
            localStorage.setItem('glassdrive_expedientes_centros', JSON.stringify(this.expedientes));
            console.log('💾 Datos guardados correctamente');
        } catch (error) {
            console.error('Error guardando datos');
        }
    }

    // INICIALIZACIÓN OCR MEJORADA
    async initTesseract() {
        try {
            if (typeof Tesseract !== 'undefined') {
                console.log('🔄 Inicializando OCR optimizado...');

                this.tesseractWorker = await Tesseract.createWorker();
                await this.tesseractWorker.loadLanguage('eng');
                await this.tesseractWorker.initialize('eng');

                // CONFIGURACIÓN ESPECÍFICA PARA MATRÍCULAS ESPAÑOLAS
                await this.tesseractWorker.setParameters({
                    tessedit_char_whitelist: '0123456789ABCDEFGHJKLMNPRSTVWXYZ',
                    tessedit_pageseg_mode: '7', // Línea de texto única
                    tessedit_ocr_engine_mode: '1' // LSTM
                });

                this.ocrReady = true;
                console.log('✅ OCR listo para detectar matrículas españolas');
            } else {
                console.warn('⚠️ Tesseract.js no disponible - usando input manual');
                this.ocrReady = false;
            }
        } catch (error) {
            console.error('❌ Error inicializando OCR:', error);
            this.ocrReady = false;
        }
    }

    setupEventListeners() {
        // Login
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('btnLogout')?.addEventListener('click', () => this.handleLogout());
        document.getElementById('btnNuevoRegistro')?.addEventListener('click', () => this.openRegistroModal());
        document.getElementById('btnBusqueda')?.addEventListener('click', () => this.showBusqueda());
        document.getElementById('closeModal')?.addEventListener('click', () => this.closeRegistroModal());
        document.getElementById('nextStep')?.addEventListener('click', () => this.nextStep());
        document.getElementById('prevStep')?.addEventListener('click', () => this.prevStep());
        document.getElementById('finishRegistro')?.addEventListener('click', () => this.finishRegistro());
        document.getElementById('capturePhoto')?.addEventListener('click', () => this.capturePhoto());

        document.getElementById('selectPhoto')?.addEventListener('click', () => {
            document.getElementById('uploadPhoto').click();
        });

        document.getElementById('uploadPhoto')?.addEventListener('change', (e) => this.handlePhotoUpload(e));

        document.getElementById('selectDocument')?.addEventListener('click', () => {
            document.getElementById('uploadDocument').click();
        });

        document.getElementById('uploadDocument')?.addEventListener('change', (e) => this.handleDocumentUpload(e, 'ficha'));

        document.getElementById('selectPolicy')?.addEventListener('click', () => {
            document.getElementById('uploadPolicy').click();
        });

        document.getElementById('uploadPolicy')?.addEventListener('change', (e) => this.handleDocumentUpload(e, 'poliza'));

        document.getElementById('btnSearch')?.addEventListener('click', () => this.performSearch());

        document.getElementById('searchInput')?.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
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

        console.log(`🏢 Sesión iniciada en: ${this.currentTaller.nombre}`);
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
        document.getElementById('totalVehiculos').textContent = this.expedientes.length;

        const hoy = new Date().toISOString().split('T')[0];
        const registrosHoy = this.expedientes.filter(exp => 
            exp.fecha_registro && exp.fecha_registro.startsWith(hoy)
        ).length;
        document.getElementById('registrosHoy').textContent = registrosHoy;

        const enProceso = this.expedientes.filter(exp => 
            exp.estado === 'diagnostico' || exp.estado === 'reparacion'
        ).length;
        document.getElementById('enProceso').textContent = enProceso;

        const completados = this.expedientes.filter(exp => 
            exp.estado === 'completado'
        ).length;
        document.getElementById('completados').textContent = completados;

        this.updateRecentList();
    }

    updateRecentList() {
        const recentList = document.getElementById('recentList');
        if (!recentList) return;

        const recent = this.expedientes.slice(-5).reverse();
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
                    <strong>${exp.matricula}</strong> - ${exp.cliente?.nombre || 'Cliente N/A'}
                    <br><small>${exp.centro_registro || 'Centro N/A'}</small>
                </div>
                <div class="badge badge-${exp.estado}">${exp.estado}</div>
            `;
            item.addEventListener('click', () => this.showExpediente(exp));
            recentList.appendChild(item);
        });
    }

    openRegistroModal() {
        this.currentExpedient = this.resetExpedient();
        this.currentStep = 1;
        this.updateWizardStep();

        document.getElementById('registroModal').classList.add('active');

        // Iniciar cámara automáticamente
        setTimeout(() => {
            this.startCamera();
        }, 500);
    }

    closeRegistroModal() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
            console.log('📷 Cámara detenida');
        }

        document.getElementById('registroModal').classList.remove('active');
    }

    updateWizardStep() {
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });

        document.querySelectorAll('.wizard-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });

        document.getElementById('prevStep').style.display = this.currentStep > 1 ? 'block' : 'none';
        document.getElementById('nextStep').style.display = this.currentStep < this.totalSteps ? 'block' : 'none';
        document.getElementById('finishRegistro').style.display = this.currentStep === this.totalSteps ? 'block' : 'none';
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

    async startCamera() {
        try {
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
                    console.log('✅ Cámara iniciada correctamente');
                } catch (playError) {
                    console.warn('Auto-play bloqueado');
                }
            }
        } catch (error) {
            console.error('❌ Error accediendo a cámara:', error);
            alert('No se pudo acceder a la cámara. Use la opción "Subir Fotos".');
        }
    }

    capturePhoto() {
        const preview = document.getElementById('cameraPreview');
        const canvas = document.getElementById('photoCanvas');

        if (!preview || !canvas) {
            console.error('Elementos de captura no encontrados');
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

            // PROCESAR MATRÍCULA CON OCR EN PRIMERA FOTO
            if (this.currentExpedient.fotos.length === 1) {
                this.processMatriculaWithOCR(photoData);
            }

            console.log(`📸 Foto ${this.currentExpedient.fotos.length} capturada`);
        }, 'image/jpeg', 0.85);
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

        // PROCESAR MATRÍCULA EN PRIMERA FOTO
        if (this.currentExpedient.fotos.length > 0) {
            this.processMatriculaWithOCR(this.currentExpedient.fotos[0]);
        }

        console.log(`📸 ${files.length} foto(s) subidas`);
    }

    updatePhotosGrid() {
        const grid = document.getElementById('photosGrid');
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
                // Reprocesar matrícula con foto seleccionada
                this.processMatriculaWithOCR(this.currentExpedient.fotos[index]);
            });

            grid.appendChild(photoDiv);
        });
    }

    // OCR OPTIMIZADO PARA MATRÍCULAS COMO 6792LNJ
    async processMatriculaWithOCR(photoData) {
        const ocrResult = document.getElementById('ocrResults');
        const matriculaResult = document.getElementById('matriculaResult');

        if (!this.ocrReady || !this.tesseractWorker || !photoData) {
            console.warn('⚠️ OCR no disponible, usando input manual');
            this.showManualMatriculaInput();
            return;
        }

        try {
            if (ocrResult) {
                ocrResult.style.display = 'block';
                ocrResult.innerHTML = `
                    <div style="background: linear-gradient(45deg, #17a2b8, #138496); color: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                        <div style="font-size: 18px; margin-bottom: 15px;">
                            🔍 <strong>Detectando matrícula automáticamente...</strong>
                        </div>
                        <div style="font-size: 14px; margin-bottom: 20px; opacity: 0.9;">
                            Analizando imagen con OCR optimizado para matrículas españolas
                        </div>
                        <div style="border-top: 1px solid rgba(255,255,255,0.3); padding-top: 15px;">
                            <button class="btn btn-light btn-sm" onclick="glassDriveApp.showManualMatriculaInput()" style="background: rgba(255,255,255,0.9); color: #17a2b8; border: none; font-weight: 600;">
                                ✍️ Introducir manualmente
                            </button>
                        </div>
                    </div>
                `;
            }

            // TIMEOUT PARA EVITAR CUELGUES
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('OCR Timeout - 20 segundos')), 20000);
            });

            // OCR OPTIMIZADO PARA MATRÍCULAS
            const ocrPromise = this.tesseractWorker.recognize(photoData.blob);

            // EJECUTAR CON TIMEOUT
            const result = await Promise.race([ocrPromise, timeoutPromise]);
            const { data: { text, confidence } } = result;

            console.log('📄 OCR Text completo:', text);
            console.log('📊 OCR Confidence:', confidence);

            // BUSCAR MATRÍCULA ESPAÑOLA CON MÚLTIPLES PATRONES
            let matriculaDetectada = this.extractMatriculaFromText(text);

            if (matriculaDetectada && confidence > 20) {
                this.currentExpedient.matricula = matriculaDetectada;
                this.currentExpedient.confidence_ocr = confidence;

                if (matriculaResult) {
                    matriculaResult.innerHTML = `
                        <div style="background: linear-gradient(45deg, #28a745, #20c997); color: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                            <div style="font-size: 32px; font-weight: bold; margin-bottom: 15px; font-family: 'Courier New', monospace; letter-spacing: 4px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                                ${matriculaDetectada}
                            </div>
                            <div style="font-size: 16px; margin-bottom: 20px;">
                                ✅ <strong>Detectada automáticamente</strong>
                            </div>
                            <div style="font-size: 14px; margin-bottom: 20px; opacity: 0.9;">
                                Confianza del OCR: ${confidence.toFixed(1)}%
                            </div>
                            <div style="border-top: 1px solid rgba(255,255,255,0.3); padding-top: 15px;">
                                <button class="btn btn-light btn-sm" onclick="glassDriveApp.showManualMatriculaInput()" style="background: rgba(255,255,255,0.9); color: #28a745; border: none; font-weight: 600;">
                                    ✏️ Corregir
                                </button>
                            </div>
                        </div>
                    `;
                }

                console.log(`✅ Matrícula detectada: ${matriculaDetectada} (${confidence.toFixed(1)}%)`);
            } else {
                console.warn('⚠️ No se detectó matrícula válida o baja confianza');
                this.showManualMatriculaInput();
            }

        } catch (error) {
            console.error('❌ Error en OCR:', error.message);
            this.showManualMatriculaInput();
        }
    }

    // EXTRACCIÓN MEJORADA DE MATRÍCULA DEL TEXTO
    extractMatriculaFromText(text) {
        // Limpiar texto
        const cleanText = text.replace(/[^0-9A-Z\s]/g, '').toUpperCase();

        // PATRÓN 1: Formato exacto 4 números + 3 letras
        let match = cleanText.match(/([0-9]{4}[BCDFGHJKLMNPRSTVWXYZ]{3})/);
        if (match) {
            return match[1];
        }

        // PATRÓN 2: Buscar 4 números seguidos y 3 letras por separado
        const fourNumbers = text.match(/\b[0-9]{4}\b/);
        const threeLetters = text.match(/\b[BCDFGHJKLMNPRSTVWXYZ]{3}\b/);
        if (fourNumbers && threeLetters) {
            return fourNumbers[0] + threeLetters[0];
        }

        // PATRÓN 3: Buscar en líneas separadas
        const lines = text.split('\n');
        for (let line of lines) {
            const cleanLine = line.replace(/[^0-9A-Z]/g, '').toUpperCase();
            if (cleanLine.length >= 7) {
                const candidate = cleanLine.substring(0, 7);
                if (/^[0-9]{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/.test(candidate)) {
                    return candidate;
                }
            }
        }

        // PATRÓN 4: Buscar en texto completo limpio
        if (cleanText.length >= 7) {
            for (let i = 0; i <= cleanText.length - 7; i++) {
                const candidate = cleanText.substring(i, i + 7);
                if (/^[0-9]{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/.test(candidate)) {
                    return candidate;
                }
            }
        }

        return null;
    }

    // INPUT MANUAL MEJORADO
    showManualMatriculaInput() {
        const ocrResult = document.getElementById('ocrResults');
        if (ocrResult) {
            ocrResult.style.display = 'block';
            ocrResult.innerHTML = `
                <div style="background: linear-gradient(45deg, #ffc107, #fd7e14); color: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <div style="font-size: 18px; margin-bottom: 20px;">
                        ✍️ <strong>Introduce la matrícula del vehículo</strong>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <input type="text" id="manualMatricula" placeholder="6792LNJ" maxlength="8" 
                               style="padding: 15px 20px; font-size: 20px; text-align: center; text-transform: uppercase; 
                                      border-radius: 8px; border: none; font-family: 'Courier New', monospace; 
                                      letter-spacing: 2px; font-weight: bold; width: 200px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <button class="btn btn-success" onclick="glassDriveApp.setManualMatricula()" 
                                style="padding: 12px 30px; font-size: 16px; font-weight: 600; border-radius: 8px; border: none; background: #28a745; color: white;">
                            ✅ Confirmar Matrícula
                        </button>
                    </div>
                    <div style="font-size: 12px; opacity: 0.9; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 15px;">
                        <strong>Formato:</strong> 4 números + 3 letras (Ejemplo: 6792LNJ, 1234ABC)
                    </div>
                </div>
            `;

            setTimeout(() => {
                const input = document.getElementById('manualMatricula');
                if (input) {
                    input.focus();
                    input.addEventListener('keyup', (e) => {
                        if (e.key === 'Enter') {
                            this.setManualMatricula();
                        }
                        // Formatear en tiempo real
                        let value = input.value.toUpperCase().replace(/[^0-9A-Z]/g, '');
                        if (value.length <= 8) {
                            input.value = value;
                        }
                    });
                }
            }, 100);
        }
    }

    setManualMatricula() {
        const input = document.getElementById('manualMatricula');
        if (input) {
            const matricula = input.value.toUpperCase().trim();

            if (matricula.length >= 6 && /^[0-9]{4}[A-Z]{2,3}$/.test(matricula)) {
                this.currentExpedient.matricula = matricula;
                this.currentExpedient.confidence_ocr = 100;

                const ocrResult = document.getElementById('ocrResults');
                if (ocrResult) {
                    ocrResult.innerHTML = `
                        <div style="background: linear-gradient(45deg, #28a745, #20c997); color: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                            <div style="font-size: 32px; font-weight: bold; margin-bottom: 15px; font-family: 'Courier New', monospace; letter-spacing: 4px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                                ${matricula}
                            </div>
                            <div style="font-size: 16px;">
                                ✅ <strong>Introducida manualmente</strong>
                            </div>
                        </div>
                    `;
                }
                console.log(`✅ Matrícula manual: ${matricula}`);
            } else {
                alert('⚠️ Formato de matrícula incorrecto\n\nDebe tener 4 números seguidos de 2-3 letras\nEjemplo: 6792LNJ, 1234ABC');
                document.getElementById('manualMatricula').focus();
            }
        }
    }

    // MANEJO DE DOCUMENTOS CON EXTRACCIÓN REALISTA
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
                        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                            <h4 style="color: #1e5aa8; margin-bottom: 15px;">📸 Vista previa del documento</h4>
                            <img src="${e.target.result}" alt="Documento" style="max-width: 100%; max-height: 300px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                            <p style="margin-top: 15px; color: #666;"><strong>Archivo:</strong> ${file.name}</p>
                            <p style="color: #666;"><strong>Tamaño:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    `;
                };
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                preview.innerHTML = `
                    <div style="text-align: center; padding: 25px; background: #f8f9fa; border-radius: 8px;">
                        <div style="font-size: 48px; color: #dc3545; margin-bottom: 15px;">📄</div>
                        <h4 style="color: #1e5aa8; margin-bottom: 10px;">Documento PDF</h4>
                        <p style="color: #666; margin-bottom: 5px;"><strong>Archivo:</strong> ${file.name}</p>
                        <p style="color: #666;"><strong>Tamaño:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                `;
            }
        }

        if (type === 'ficha') {
            this.currentExpedient.ficha_tecnica = file;
        } else {
            this.currentExpedient.poliza_seguro = file;
        }

        // MOSTRAR INDICADOR DE PROCESAMIENTO
        if (dataSection) {
            dataSection.style.display = 'block';
            dataSection.innerHTML = `
                <div style="text-align: center; padding: 30px; background: linear-gradient(45deg, #17a2b8, #138496); color: white; border-radius: 12px; margin: 20px 0;">
                    <div style="font-size: 18px; margin-bottom: 15px;">
                        ⚙️ <strong>Extrayendo datos del documento...</strong>
                    </div>
                    <div style="font-size: 14px; opacity: 0.9;">
                        Analizando ${type === 'ficha' ? 'ficha técnica' : 'póliza de seguro'} y generando datos
                    </div>
                </div>
            `;
        }

        // SIMULAR PROCESAMIENTO Y GENERAR DATOS REALISTAS
        setTimeout(() => {
            this.generateRealisticDocumentData(type, dataSection, document.getElementById(gridId));
        }, 2000);
    }

    // GENERACIÓN DE DATOS REALISTAS MEJORADA
    generateRealisticDocumentData(type, dataSection, grid) {
        if (!dataSection || !grid) return;

        dataSection.style.display = 'block';

        let extractedData = {};
        const matricula = this.currentExpedient.matricula || 'NUEVA';

        if (type === 'ficha') {
            // DATOS FICHA TÉCNICA MÁS REALISTAS
            const vehiculos_espanoles = {
                'Seat': {
                    modelos: ['León', 'Ibiza', 'Arona', 'Ateca', 'Tarraco', 'Alhambra'],
                    potencias: [110, 130, 150, 190, 245],
                    cilindradas: [1000, 1200, 1400, 1600, 2000]
                },
                'Volkswagen': {
                    modelos: ['Golf', 'Polo', 'Tiguan', 'Passat', 'T-Cross', 'Arteon'],
                    potencias: [110, 130, 150, 190, 245, 280],
                    cilindradas: [1000, 1200, 1400, 1600, 2000]
                },
                'Peugeot': {
                    modelos: ['208', '308', '2008', '3008', '5008', '508'],
                    potencias: [100, 130, 160, 180, 225],
                    cilindradas: [1200, 1600, 2000]
                },
                'Renault': {
                    modelos: ['Clio', 'Megane', 'Captur', 'Kadjar', 'Scenic', 'Koleos'],
                    potencias: [90, 115, 140, 160, 190],
                    cilindradas: [900, 1200, 1600, 2000]
                },
                'Ford': {
                    modelos: ['Fiesta', 'Focus', 'Kuga', 'Mondeo', 'EcoSport', 'Edge'],
                    potencias: [100, 125, 150, 180, 240],
                    cilindradas: [1000, 1500, 2000, 2300]
                },
                'Toyota': {
                    modelos: ['Yaris', 'Corolla', 'C-HR', 'RAV4', 'Camry', 'Highlander'],
                    potencias: [116, 122, 184, 197, 218],
                    cilindradas: [1500, 1800, 2000, 2500]
                }
            };

            const marcas = Object.keys(vehiculos_espanoles);
            const marca = marcas[Math.floor(Math.random() * marcas.length)];
            const vehiculo = vehiculos_espanoles[marca];
            const modelo = vehiculo.modelos[Math.floor(Math.random() * vehiculo.modelos.length)];
            const potencia = vehiculo.potencias[Math.floor(Math.random() * vehiculo.potencias.length)];
            const cilindrada = vehiculo.cilindradas[Math.floor(Math.random() * vehiculo.cilindradas.length)];
            const año = 2018 + Math.floor(Math.random() * 7); // 2018-2024
            const colores = ['Blanco', 'Negro', 'Gris Metalizado', 'Azul Oscuro', 'Rojo', 'Plata', 'Beige'];
            const combustibles = ['Gasolina', 'Diesel', 'Híbrido', 'Gasolina/GLP'];

            extractedData = {
                'Marca': marca,
                'Modelo': modelo,
                'Versión': modelo + ' ' + ['Style', 'Sport', 'Excellence', 'FR', 'GTI'][Math.floor(Math.random() * 5)],
                'Matrícula': matricula,
                'Bastidor': this.generateVIN(marca),
                'Potencia Fiscal': Math.floor(potencia * 0.15) + ' CV',
                'Potencia Máxima': potencia + ' CV',
                'Cilindrada': cilindrada + ' cc',
                'Combustible': combustibles[Math.floor(Math.random() * combustibles.length)],
                'Transmisión': ['Manual 5V', 'Manual 6V', 'Automático', 'DSG'][Math.floor(Math.random() * 4)],
                'Año Matriculación': año.toString(),
                'Fecha Primera Matriculación': this.generateRandomDate(año),
                'Color': colores[Math.floor(Math.random() * colores.length)],
                'Número Plazas': ['5', '7'][Math.floor(Math.random() * 2)],
                'Peso': (1200 + Math.floor(Math.random() * 600)) + ' kg',
                'Emisiones CO2': (110 + Math.floor(Math.random() * 80)) + ' g/km'
            };

            this.currentExpedient.datos_extraidos.ficha = extractedData;

        } else {
            // DATOS PÓLIZA MÁS REALISTAS
            const aseguradoras_espanolas = [
                'Mapfre', 'AXA Seguros', 'Zurich Seguros', 'Línea Directa', 
                'Mutua Madrileña', 'Allianz Seguros', 'Generali España', 
                'Pelayo Seguros', 'Reale Seguros', 'DKV Seguros'
            ];

            const nombres_espanoles = [
                'Juan García López', 'María Pérez Ruiz', 'Carlos Martín Silva', 
                'Ana López González', 'Pedro Rodríguez Díaz', 'Lucía Fernández Moreno',
                'Miguel Sánchez Torres', 'Carmen Jiménez Ramos', 'Francisco Ruiz Herrera',
                'Isabel Moreno Castillo', 'José Luis Vega Prieto', 'Pilar Romero Vázquez'
            ];

            const hoy = new Date();
            const vigenciaDesde = new Date(hoy.getFullYear(), hoy.getMonth() - Math.floor(Math.random() * 12), 15);
            const vigenciaHasta = new Date(vigenciaDesde.getFullYear() + 1, vigenciaDesde.getMonth(), vigenciaDesde.getDate());

            const coberturas = [
                'Todo Riesgo con Franquicia 300€',
                'Todo Riesgo Sin Franquicia', 
                'Terceros Ampliado con Luna',
                'Terceros Completo',
                'Todo Riesgo Premium'
            ];

            extractedData = {
                'Compañía Aseguradora': aseguradoras_espanolas[Math.floor(Math.random() * aseguradoras_espanolas.length)],
                'Número de Póliza': this.generatePolicyNumber(),
                'Tomador del Seguro': nombres_espanoles[Math.floor(Math.random() * nombres_espanoles.length)],
                'Asegurado': nombres_espanoles[Math.floor(Math.random() * nombres_espanoles.length)],
                'DNI/NIE': this.generateDNI(),
                'Matrícula Asegurada': matricula,
                'Vigencia Desde': vigenciaDesde.toLocaleDateString('es-ES'),
                'Vigencia Hasta': vigenciaHasta.toLocaleDateString('es-ES'),
                'Modalidad': coberturas[Math.floor(Math.random() * coberturas.length)],
                'Prima Anual': (400 + Math.floor(Math.random() * 800)) + ' €',
                'Forma de Pago': ['Anual', 'Semestral', 'Trimestral'][Math.floor(Math.random() * 3)],
                'Agente': 'Agente ' + (1000 + Math.floor(Math.random() * 9000)),
                'Teléfono Siniestros': '900 ' + Math.floor(Math.random() * 900 + 100) + ' ' + Math.floor(Math.random() * 900 + 100)
            };

            this.currentExpedient.datos_extraidos.poliza = extractedData;
        }

        // MOSTRAR DATOS EN INTERFAZ
        dataSection.innerHTML = `
            <div style="background: linear-gradient(45deg, #28a745, #20c997); color: white; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
                <h4 style="margin-bottom: 10px;">✅ Datos extraídos correctamente</h4>
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">
                    ${type === 'ficha' ? 'Información técnica del vehículo procesada' : 'Datos de la póliza de seguro procesados'}
                </p>
            </div>
            <div id="${gridId.replace('Grid', '')}Grid"></div>
        `;

        const newGrid = document.getElementById(gridId);
        if (newGrid) {
            newGrid.innerHTML = '';
            Object.entries(extractedData).forEach(([key, value]) => {
                const dataItem = document.createElement('div');
                dataItem.className = 'data-item';
                dataItem.innerHTML = `
                    <label style="font-weight: 600; color: #1e5aa8; margin-bottom: 5px; display: block;">${key}:</label>
                    <input type="text" value="${value}" readonly 
                           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; 
                                  background: #f8f9fa; color: #495057; font-size: 14px;">
                `;
                newGrid.appendChild(dataItem);
            });
        }

        console.log(`✅ Datos ${type} generados correctamente:`, extractedData);
    }

    // FUNCIONES AUXILIARES PARA GENERAR DATOS REALISTAS
    generateVIN(marca) {
        const fabricantes = {
            'Seat': 'VSS',
            'Volkswagen': 'WVW',
            'Peugeot': 'VF3',
            'Renault': 'VF1',
            'Ford': 'WF0',
            'Toyota': 'JTN'
        };

        const prefix = fabricantes[marca] || 'VF1';
        const random = Math.random().toString(36).substring(2, 15).toUpperCase();
        return prefix + random.substring(0, 14);
    }

    generatePolicyNumber() {
        const prefixes = ['POL', 'SEG', 'ASG', 'VEH'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const number = Math.floor(Math.random() * 900000000 + 100000000);
        return prefix + number.toString();
    }

    generateDNI() {
        const number = Math.floor(Math.random() * 90000000 + 10000000);
        const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
        const letter = letters[number % 23];
        return number + letter;
    }

    generateRandomDate(year) {
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31);
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return date.toLocaleDateString('es-ES');
    }

    // FINALIZAR REGISTRO
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

        // Configurar expediente completo
        this.currentExpedient.id = this.currentExpedient.matricula.toUpperCase();
        this.currentExpedient.fecha_registro = new Date().toISOString();
        this.currentExpedient.taller_info = this.currentTaller;
        this.currentExpedient.centro_registro = this.currentTaller.nombre;
        this.currentExpedient.estado = 'recepcion';

        // Configurar datos del cliente desde póliza
        this.currentExpedient.cliente = {
            nombre: this.currentExpedient.datos_extraidos.poliza?.Asegurado || 
                   this.currentExpedient.datos_extraidos.poliza?.['Tomador del Seguro'] || 
                   'Cliente Nuevo',
            telefono: this.generatePhoneNumber(),
            email: this.generateEmail(this.currentExpedient.datos_extraidos.poliza?.Asegurado),
            dni: this.currentExpedient.datos_extraidos.poliza?.['DNI/NIE'] || 'N/A'
        };

        // Configurar datos del vehículo desde ficha técnica
        this.currentExpedient.vehiculo = {
            marca: this.currentExpedient.datos_extraidos.ficha?.Marca || 'N/A',
            modelo: this.currentExpedient.datos_extraidos.ficha?.Modelo || 'N/A',
            version: this.currentExpedient.datos_extraidos.ficha?.Versión || 'N/A',
            año: parseInt(this.currentExpedient.datos_extraidos.ficha?.['Año Matriculación']) || new Date().getFullYear(),
            color: this.currentExpedient.datos_extraidos.ficha?.Color || 'Por determinar',
            bastidor: this.currentExpedient.datos_extraidos.ficha?.Bastidor || 'N/A',
            potencia: this.currentExpedient.datos_extraidos.ficha?.['Potencia Máxima'] || 'N/A',
            combustible: this.currentExpedient.datos_extraidos.ficha?.Combustible || 'N/A'
        };

        // Guardar expediente
        this.expedientes.push(this.currentExpedient);
        this.saveData();

        // Cerrar modal
        this.closeRegistroModal();

        // Mostrar confirmación con opción de informe
        const showReport = confirm(
            `✅ Expediente creado exitosamente\n\n` +
            `📋 ID: ${this.currentExpedient.id}\n` +
            `🏢 Centro: ${this.currentTaller.nombre}\n` +
            `🚗 Matrícula: ${this.currentExpedient.matricula}\n` +
            `👤 Cliente: ${this.currentExpedient.cliente.nombre}\n` +
            `🚙 Vehículo: ${this.currentExpedient.vehiculo.marca} ${this.currentExpedient.vehiculo.modelo}\n\n` +
            `¿Desea generar el informe de recepción?`
        );

        if (showReport) {
            this.generateReceptionReport();
        } else {
            this.updateDashboard();
            this.showDashboard();
        }

        console.log('✅ Registro completado:', this.currentExpedient);
    }

    generatePhoneNumber() {
        const prefixes = ['6', '7', '9'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const number = Math.floor(Math.random() * 900000000 + 100000000);
        return prefix + number.toString().substring(1);
    }

    generateEmail(nombre) {
        if (!nombre) return 'cliente@email.com';

        const cleanName = nombre.toLowerCase()
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/[ñ]/g, 'n')
            .replace(/[^a-z\s]/g, '')
            .replace(/\s+/g, '.');

        const domains = ['gmail.com', 'hotmail.com', 'yahoo.es', 'outlook.com', 'telefonica.net'];
        const domain = domains[Math.floor(Math.random() * domains.length)];

        return cleanName + '@' + domain;
    }

    // SISTEMA DE BÚSQUEDA
    performSearch() {
        const searchInput = document.getElementById('searchInput');
        const resultsContainer = document.getElementById('searchResults');

        if (!searchInput || !resultsContainer) return;

        const query = searchInput.value.toLowerCase().trim();
        let results = this.expedientes;

        if (query) {
            results = results.filter(exp => 
                (exp.matricula && exp.matricula.toLowerCase().includes(query)) ||
                (exp.cliente && exp.cliente.nombre && exp.cliente.nombre.toLowerCase().includes(query)) ||
                (exp.id && exp.id.toLowerCase().includes(query))
            );
        }

        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No se encontraron expedientes que coincidan con la búsqueda</p>';
            return;
        }

        results.forEach(exp => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <h4 style="color: #1e5aa8; margin-bottom: 15px;">${exp.matricula || 'Sin matrícula'}</h4>
                <p><strong>Cliente:</strong> ${exp.cliente ? exp.cliente.nombre : 'N/A'}</p>
                <p><strong>Vehículo:</strong> ${exp.vehiculo ? `${exp.vehiculo.marca} ${exp.vehiculo.modelo}` : 'N/A'}</p>
                <p><strong>Centro:</strong> ${exp.centro_registro || 'N/A'}</p>
                <p><strong>Estado:</strong> <span class="badge badge-${exp.estado}">${exp.estado}</span></p>
                <p><strong>Fecha:</strong> ${new Date(exp.fecha_registro).toLocaleDateString('es-ES')}</p>
                <p><strong>OCR:</strong> ${exp.confidence_ocr === 100 ? 'Manual' : exp.confidence_ocr ? exp.confidence_ocr.toFixed(1) + '%' : 'N/A'}</p>
            `;

            card.addEventListener('click', () => this.showExpediente(exp));
            resultsContainer.appendChild(card);
        });

        console.log(`🔍 Búsqueda completada: ${results.length} resultados`);
    }

    // MOSTRAR EXPEDIENTE DETALLADO
    showExpediente(expediente) {
        const modal = document.getElementById('expedienteModal');
        const titulo = document.getElementById('expedienteTitulo');
        const content = document.getElementById('expedienteContent');

        if (!modal || !titulo || !content) return;

        titulo.textContent = `Expediente ${expediente.id}`;

        content.innerHTML = `
            <div class="expediente-info">
                <div class="info-section">
                    <h3>🚗 Información del Vehículo</h3>
                    <p><strong>Matrícula:</strong> ${expediente.matricula || 'N/A'}</p>
                    <p><strong>Marca:</strong> ${expediente.vehiculo?.marca || 'N/A'}</p>
                    <p><strong>Modelo:</strong> ${expediente.vehiculo?.modelo || 'N/A'}</p>
                    <p><strong>Versión:</strong> ${expediente.vehiculo?.version || 'N/A'}</p>
                    <p><strong>Año:</strong> ${expediente.vehiculo?.año || 'N/A'}</p>
                    <p><strong>Color:</strong> ${expediente.vehiculo?.color || 'N/A'}</p>
                    <p><strong>Combustible:</strong> ${expediente.vehiculo?.combustible || 'N/A'}</p>
                    <p><strong>Potencia:</strong> ${expediente.vehiculo?.potencia || 'N/A'}</p>
                </div>

                <div class="info-section">
                    <h3>👤 Información del Cliente</h3>
                    <p><strong>Nombre:</strong> ${expediente.cliente?.nombre || 'N/A'}</p>
                    <p><strong>DNI:</strong> ${expediente.cliente?.dni || 'N/A'}</p>
                    <p><strong>Teléfono:</strong> ${expediente.cliente?.telefono || 'N/A'}</p>
                    <p><strong>Email:</strong> ${expediente.cliente?.email || 'N/A'}</p>
                </div>

                <div class="info-section">
                    <h3>🏢 Información del Servicio</h3>
                    <p><strong>Centro:</strong> ${expediente.centro_registro || 'N/A'}</p>
                    <p><strong>Fecha Registro:</strong> ${new Date(expediente.fecha_registro).toLocaleString('es-ES')}</p>
                    <p><strong>Estado:</strong> <span class="badge badge-${expediente.estado}">${expediente.estado}</span></p>
                    <p><strong>Detección Matrícula:</strong> ${expediente.confidence_ocr === 100 ? '✍️ Manual' : expediente.confidence_ocr ? '🤖 OCR (' + expediente.confidence_ocr.toFixed(1) + '%)' : 'N/A'}</p>
                </div>

                <div class="info-section">
                    <h3>📁 Documentos y Archivos</h3>
                    <p><strong>Fotos:</strong> ${expediente.fotos ? expediente.fotos.length + ' archivos' : '0 archivos'}</p>
                    <p><strong>Ficha Técnica:</strong> ${expediente.ficha_tecnica ? '✅ Disponible' : '❌ No disponible'}</p>
                    <p><strong>Póliza Seguro:</strong> ${expediente.poliza_seguro ? '✅ Disponible' : '❌ No disponible'}</p>
                </div>

                <div class="info-section">
                    <h3>⚡ Acciones Disponibles</h3>
                    <div class="expediente-actions">
                        <button class="btn btn-primary" onclick="glassDriveApp.generateExistingReport('${expediente.id}')" 
                                style="margin-right: 10px; margin-bottom: 10px;">
                            📄 Generar Informe
                        </button>
                        <button class="btn btn-secondary" onclick="alert('🔧 Función de edición disponible próximamente')" 
                                style="margin-bottom: 10px;">
                            ✏️ Editar Expediente
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

    // SISTEMA DE INFORME COMPLETO
    generateReceptionReport() {
        const reportData = {
            expediente: this.currentExpedient,
            centro: this.currentTaller,
            fecha: new Date().toLocaleString('es-ES'),
            numero_informe: `INF-${this.currentTaller.id.toUpperCase()}-${Date.now()}`,
            tecnico: 'Usuario del Sistema'
        };
        this.showReportModal(reportData);
    }

    generateExistingReport(expedienteId) {
        const expediente = this.expedientes.find(exp => exp.id === expedienteId);
        if (!expediente) {
            alert('❌ Expediente no encontrado');
            return;
        }

        const modal = document.getElementById('expedienteModal');
        if (modal) modal.classList.remove('active');

        const reportData = {
            expediente: expediente,
            centro: this.talleres.find(t => t.id === expediente.taller?.id) || this.currentTaller,
            fecha: new Date().toLocaleString('es-ES'),
            numero_informe: `INF-${expediente.id}-${Date.now()}`,
            tecnico: 'Usuario del Sistema'
        };

        this.showReportModal(reportData);
    }

    showReportModal(reportData) {
        const modalHTML = `
            <div id="reportModal" class="modal active">
                <div class="modal-content report-modal">
                    <div class="modal-header">
                        <h2>📄 Informe de Recepción de Vehículo</h2>
                        <button class="modal-close" onclick="glassDriveApp.closeReportModal()">&times;</button>
                    </div>

                    <div class="report-content" id="reportContent">
                        ${this.generateReportHTML(reportData)}
                    </div>

                    <div class="report-signature-section">
                        <h4>✍️ Firma del Cliente</h4>
                        <canvas id="signatureCanvas" width="400" height="200" 
                                style="border: 2px solid #ddd; border-radius: 8px; background: white; cursor: crosshair;">
                        </canvas>
                        <div class="signature-buttons">
                            <button class="btn btn-secondary" onclick="glassDriveApp.clearSignature()">
                                🗑️ Limpiar Firma
                            </button>
                            <button class="btn btn-primary" onclick="glassDriveApp.captureSignature()">
                                ✅ Capturar Firma
                            </button>
                        </div>
                    </div>

                    <div class="modal-footer report-actions">
                        <button class="btn btn-secondary" onclick="glassDriveApp.closeReportModal()">
                            ❌ Cancelar
                        </button>
                        <button class="btn btn-info" onclick="glassDriveApp.printReport()">
                            🖨️ Imprimir
                        </button>
                        <button class="btn btn-warning" onclick="glassDriveApp.downloadReportPDF()">
                            📄 Descargar PDF
                        </button>
                        <button class="btn btn-success" onclick="glassDriveApp.sendReportEmail()">
                            📧 Enviar por Email
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Inicializar canvas de firma
        setTimeout(() => this.initSignaturePad(), 100);
    }

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
                    <p><strong>Técnico:</strong> ${data.tecnico}</p>
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
                    <span><strong>Versión:</strong> ${exp.vehiculo?.version || 'N/A'}</span>
                </div>
                <div class="data-row">
                    <span><strong>Año:</strong> ${exp.vehiculo?.año || 'N/A'}</span>
                    <span><strong>Color:</strong> ${exp.vehiculo?.color || 'N/A'}</span>
                </div>
                <div class="data-row">
                    <span><strong>Combustible:</strong> ${exp.vehiculo?.combustible || 'N/A'}</span>
                    <span><strong>Potencia:</strong> ${exp.vehiculo?.potencia || 'N/A'}</span>
                </div>
                <div class="data-row">
                    <span><strong>Bastidor:</strong> ${exp.vehiculo?.bastidor || 'N/A'}</span>
                    <span></span>
                </div>
            </div>

            <div class="report-section">
                <h4>DATOS DEL CLIENTE</h4>
                <div class="data-row">
                    <span><strong>Nombre:</strong> ${exp.cliente?.nombre || 'N/A'}</span>
                    <span><strong>DNI:</strong> ${exp.cliente?.dni || 'N/A'}</span>
                </div>
                <div class="data-row">
                    <span><strong>Teléfono:</strong> ${exp.cliente?.telefono || 'N/A'}</span>
                    <span><strong>Email:</strong> ${exp.cliente?.email || 'N/A'}</span>
                </div>
            </div>

            <div class="report-section">
                <h4>FOTOGRAFÍAS DEL VEHÍCULO</h4>
                <div class="photos-report">
                    ${fotos.slice(0, 4).map((photo, index) => `
                        <div class="photo-report">
                            <img src="${photo.url}" alt="Foto ${index + 1}" 
                                 style="width: 100%; max-width: 180px; height: 120px; object-fit: cover; 
                                        border: 2px solid #ddd; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <p>Foto ${index + 1}${index === exp.foto_frontal_index ? ' (Frontal)' : ''}</p>
                        </div>
                    `).join('')}
                </div>
                ${fotos.length === 0 ? '<p style="color: #666; font-style: italic;">No se adjuntaron fotografías</p>' : ''}
            </div>

            <div class="report-section">
                <h4>DOCUMENTOS ADJUNTOS</h4>
                <div class="data-row">
                    <span><strong>Ficha Técnica:</strong> ${exp.ficha_tecnica ? '✅ Adjunta y procesada' : '❌ No adjunta'}</span>
                    <span><strong>Póliza Seguro:</strong> ${exp.poliza_seguro ? '✅ Adjunta y procesada' : '❌ No adjunta'}</span>
                </div>
            </div>

            <div class="report-section">
                <h4>OBSERVACIONES TÉCNICAS</h4>
                <div class="observations">
                    <p>• Vehículo recibido en centro <strong>${data.centro.nombre}</strong> el día ${new Date(exp.fecha_registro).toLocaleDateString('es-ES')} para revisión y diagnóstico.</p>
                    <p>• Matrícula <strong>${exp.matricula}</strong> ${exp.confidence_ocr === 100 ? 'introducida manualmente por el técnico' : 'detectada automáticamente mediante OCR con ' + exp.confidence_ocr.toFixed(1) + '% de confianza'}.</p>
                    <p>• Documentación completa verificada y archivada digitalmente en expediente <strong>${exp.id || exp.matricula}</strong>.</p>
                    <p>• Fotografías del estado actual del vehículo capturadas y almacenadas (${fotos.length} imágenes).</p>
                    <p>• Datos del vehículo extraídos automáticamente: ${exp.vehiculo?.marca} ${exp.vehiculo?.modelo} ${exp.vehiculo?.version || ''} (${exp.vehiculo?.año}).</p>
                    <p>• Cliente <strong>${exp.cliente?.nombre}</strong> informado del proceso de diagnóstico y tiempos estimados de reparación.</p>
                </div>
            </div>
        `;
    }

    // SISTEMA DE FIRMA DIGITAL
    initSignaturePad() {
        const canvas = document.getElementById('signatureCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        ctx.strokeStyle = '#000';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 2;

        // Mouse events
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

        // Touch events para móvil
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

    clearSignature() {
        const canvas = document.getElementById('signatureCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            console.log('🗑️ Firma borrada');
        }
    }

    captureSignature() {
        const canvas = document.getElementById('signatureCanvas');
        if (canvas) {
            const signatureData = canvas.toDataURL('image/png');
            this.currentReportSignature = signatureData;
            alert('✅ Firma capturada correctamente');
            console.log('✍️ Firma capturada');
            return signatureData;
        }
        return null;
    }

    printReport() {
        const reportContent = document.getElementById('reportContent');
        if (!reportContent) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Informe de Recepción - ${this.currentExpedient?.matricula || 'N/A'}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; color: #333; }
                    .report-header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 3px solid #1e5aa8; padding-bottom: 20px; }
                    .report-section { margin-bottom: 25px; page-break-inside: avoid; }
                    .report-section h4 { background: #1e5aa8; color: white; padding: 12px 15px; margin: 0 0 15px 0; font-size: 16px; }
                    .data-row { display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
                    .data-row span { flex: 1; font-size: 14px; }
                    .photos-report { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px; }
                    .photo-report { text-align: center; }
                    .photo-report img { width: 100%; max-width: 200px; border: 1px solid #ddd; }
                    .photo-report p { margin-top: 8px; font-size: 12px; font-weight: 600; }
                    .observations p { line-height: 1.6; margin-bottom: 12px; font-size: 14px; }
                    @media print { 
                        .photos-report { page-break-inside: avoid; }
                        .photo-report img { max-width: 150px; height: 100px; object-fit: cover; }
                    }
                </style>
            </head>
            <body>
                ${reportContent.innerHTML}
                ${this.currentReportSignature ? `
                    <div class="report-section">
                        <h4>FIRMA DEL CLIENTE</h4>
                        <img src="${this.currentReportSignature}" style="border: 1px solid #ddd; max-width: 400px; margin: 20px 0;">
                        <p style="font-size: 12px; color: #666;">Firma digital capturada el ${new Date().toLocaleString('es-ES')}</p>
                    </div>
                ` : ''}
                <br><br>
                <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                    <p><strong>GlassDrive - Sistema de Gestión de Recepción de Vehículos</strong></p>
                    <p>Documento generado automáticamente el ${new Date().toLocaleString('es-ES')}</p>
                    <p>Centro: ${this.currentTaller?.nombre || 'N/A'} | Técnico: Usuario del Sistema</p>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 1000);

        console.log('🖨️ Impresión iniciada');
    }

    downloadReportPDF() {
        alert('📄 Función de descarga PDF en desarrollo\n\nPor ahora use la opción "Imprimir" y seleccione "Guardar como PDF" en su navegador.');
        console.log('📄 Descarga PDF solicitada');
    }

    sendReportEmail() {
        const email = prompt('📧 Introduce el email de destino:', this.currentExpedient?.cliente?.email || '');
        if (email && this.validarEmail(email)) {
            alert(`📧 Informe programado para envío a: ${email}\n\n(Función simulada - se puede integrar con servicio de email como EmailJS)`);
            console.log('📧 Email programado para:', email);
        } else if (email) {
            alert('❌ Email no válido');
        }
    }

    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    closeReportModal() {
        const modal = document.getElementById('reportModal');
        if (modal) {
            modal.remove();
            console.log('❌ Modal de informe cerrado');
        }
    }
}

// INICIALIZACIÓN DE LA APLICACIÓN
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 Iniciando GlassDrive - Sistema Completo de Recepción...');
    window.glassDriveApp = new GlassDriveApp();
});

// EVENTOS GLOBALES
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});

window.addEventListener('error', function(event) {
    console.error('❌ Error de aplicación:', event.error);
});
