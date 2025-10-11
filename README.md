# GlassDrive - Sistema de Recepción

Sistema completo de recepción de vehículos con OCR automático y generación de PDF.

## Características

✅ **OCR Automático** - Detecta matrículas como 6792LNJ automáticamente
✅ **Input Manual** - Alternativa siempre disponible
✅ **Extracción de Datos** - Procesa ficha técnica y póliza
✅ **Generación PDF** - PDF real descargable con jsPDF
✅ **Envío Email** - Integración con EmailJS
✅ **Dashboard** - Estadísticas en tiempo real
✅ **Búsqueda** - Multi-criterio avanzada
✅ **Responsive** - Funciona en móvil y desktop

## Archivos Incluidos

1. **index.html** - Página principal
2. **style.css** - Estilos completos
3. **app.js** - JavaScript con todas las funciones
4. **logolargo.jpg** - Logo de GlassDrive

## Dependencias CDN

El sistema incluye automáticamente:

```html
<!-- OCR para detectar matrículas -->
<script src="https://unpkg.com/tesseract.js@4.1.1/dist/tesseract.min.js"></script>

<!-- PDF real -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<!-- Email real -->
<script src="https://cdn.emailjs.com/npm/emailjs-com@3/dist/email.min.js"></script>
```

## Instalación

1. Sube todos los archivos a tu servidor web
2. Asegúrate de que `logolargo.jpg` esté en el mismo directorio
3. Abre `index.html` en tu navegador
4. ¡Listo para usar!

## Configuración Email (Opcional)

Para envío real de emails:

1. Regístrate en [EmailJS.com](https://emailjs.com)
2. Crea un template de email
3. Edita `app.js` línea ~980:
   ```javascript
   emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', templateParams)
   ```

## Uso

1. **Login** - Selecciona tu centro
2. **Nuevo Registro**:
   - Captura/sube fotos del vehículo
   - OCR detecta matrícula automáticamente
   - Sube ficha técnica y póliza
   - Sistema extrae datos automáticamente
   - Finaliza registro
3. **Generar Informe**:
   - Informe completo con todos los datos
   - Impresión optimizada
   - Descarga PDF real
   - Envío por email

## Funciones Avanzadas

### OCR Automático
- Detecta matrículas españolas (formato 1234ABC)
- Timeout de 20 segundos
- Input manual como alternativa

### PDF Real
- Generado con jsPDF
- Formato profesional
- Logo incluido
- Descarga automática

### Base de Datos
- localStorage para datos locales
- Integrable con Firebase/Supabase
- Backup automático

## Soporte

Sistema probado en:
- Chrome/Edge/Firefox (desktop)
- Safari/Chrome (móvil)
- Tablets y dispositivos táctiles

## Centros Configurados

- Monzón
- Barbastro  
- Lleida
- Fraga

Para agregar más centros, edita el array `talleres` en `app.js`.
