/* PATCH JavaScript para:
1. Botones de calibración seleccionables
2. Avanzar después de elegir SÍ/NO
3. Dropdown de técnicos en modal de calibración
*/

// Añadir lista de técnicos demo
const TECNICOS_DEMO = [
    'José Pérez',
    'María Sánchez',
    'Miguel Ángel',
    'Laura Gómez',
    'Ana López'
];

// Sobrescribir función setupCalibracion() para marcar botones y avanzar
GlassDriveMVP.prototype.setupCalibracion = function() {
    const calibracionNo = document.getElementById('calibracionNo');
    const calibracionSi = document.getElementById('calibracionSi');

    if (calibracionNo) {
        calibracionNo.addEventListener('click', () => {
            calibracionNo.classList.add('selected');
            calibracionSi.classList.remove('selected');
            this.handleCalibracionDecision(false);
            // Avanzar automáticamente al paso Firma
            setTimeout(() => {
                this.currentStep = 4;
                this.updateSteps();
                this.updateProgress();
            }, 600);
        });
    }
    if (calibracionSi) {
        calibracionSi.addEventListener('click', () => {
            calibracionSi.classList.add('selected');
            calibracionNo.classList.remove('selected');
            this.handleCalibracionDecision(true);
            // Avanzar automáticamente al paso Firma
            setTimeout(() => {
                this.currentStep = 4;
                this.updateSteps();
                this.updateProgress();
            }, 600);
        });
    }
};

// Parchar getCalibracionProcessHTML para usar dropdown
GlassDriveMVP.prototype.getCalibracionProcessHTML = function() {
    const options = TECNICOS_DEMO.map(t => `<option value="${t}">${t}</option>`).join('');
    return `
        <div class="calibracion-process-form">
            <div class="calibracion-vehicle-info">
                <h4>🚗 Información del Vehículo</h4>
                <div class="vehicle-details">
                    <div class="detail-row"><span class="detail-label">Matrícula:</span><span class="detail-value">${this.currentCalibracion.matricula}</span></div>
                    <div class="detail-row"><span class="detail-label">Cliente:</span><span class="detail-value">${this.currentCalibracion.cliente}</span></div>
                    <div class="detail-row"><span class="detail-label">Vehículo:</span><span class="detail-value">${this.currentCalibracion.vehiculo}</span></div>
                    <div class="detail-row"><span class="detail-label">Fecha creación:</span><span class="detail-value">${this.currentCalibracion.fechaCreacion}</span></div>
                </div>
            </div>
            <div class="calibracion-form-section">
                <h4>👨‍🔧 Datos del Técnico</h4>
                <div class="form-group custom-select">
                    <label for="tecnicoNombre">Seleccione Técnico:</label>
                    <select id="tecnicoNombre" required>
                        <option value="" disabled selected>-- Seleccionar técnico --</option>
                        ${options}
                    </select>
                </div>
            </div>
            <div class="calibracion-form-section">
                <h4>🎯 Resultado de la Calibración</h4>
                <div class="calibracion-result-options">
                    <button id="resultadoOk" class="btn btn-success calibracion-result-btn">✅ Calibración OK</button>
                    <button id="resultadoProblema" class="btn btn-warning calibracion-result-btn">⚠️ Calibración con Problemas</button>
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
                    <label for="detallesProblema">Problemas encontrados:</label>
                    <textarea id="detallesProblema" placeholder="Describa los problemas encontrados..." rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="accionesRealizadas">Acciones realizadas:</label>
                    <textarea id="accionesRealizadas" placeholder="Describa las acciones realizadas..." rows="3"></textarea>
                </div>
            </div>
        </div>
    `;
};

console.log('🛠️ Patch aplicado: botones, avance y dropdown de técnicos');
