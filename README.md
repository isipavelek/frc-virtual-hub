# 🤖 FRC Virtual Hub - Sistema Integral de Gestión, Diseño y Simulación

Plataforma integral diseñada especialmente para equipos escolares y colegios que participan en la **FIRST® Robotics Competition (FRC)**. Centraliza la administración del equipo, auditoría del robot bajo reglamentos oficiales de FIRST, catálogo de materiales (BOM) y un simulador interactivo de arena en 2D a 60 FPS con física de Swerve Drive y modos de match oficial.

---

## 🚀 Acceso Rápido y Ejecución

El servidor de desarrollo ya se encuentra ejecutándose localmente:
- **URL Local**: [http://127.0.0.1:3000/](http://127.0.0.1:3000/)

Para iniciarlo manualmente en cualquier momento desde la terminal:
```bash
npm.cmd run dev
```
Para generar la versión de producción optimizada:
```bash
npm.cmd run build
```

---

## 🌟 Módulos Incluidos

### 1. 📊 Dashboard Central & Cronograma de Temporada
- **Build Season Timeline (6 Semanas)**: Seguimiento de las etapas oficiales de construcción desde el Kickoff hasta el Regional (Estrategia, CAD, Mecanizado, Ensamble, Pruebas y Competición).
- **Auditoría de Peso (Regla R103)**: Alerta automática en tiempo real si el robot excede el límite reglamentario de **125.0 lbs (56.7 kg)**. 
  - *Cumplimiento de reglas R103 y R406*: Los bumpers y la batería SLA de 12V están legalmente excluidos del cómputo oficial.
- **Control de Presupuesto**: Monitoreo de inversión en piezas montadas en el robot frente a repuestos en pit.
- **Checklist Oficial de Inspección**: Inspección de bumpers de 3/4", interruptor principal de 120A, resistencia de terminación de 120Ω y perfiles de extensión.

---

### 2. 👥 Gestión de Recursos Humanos & Subequipos
- **Organización por Subequipos FRC**:
  - 🔧 **Mecánica & Chasis**: Estructura, reductores, transmisiones, mecanizado CNC e impresión 3D.
  - ⚡ **Electrónica & Control**: Cableado de roboRIO, Power Distribution Hub (PDH), sensores y reguladores.
  - 💻 **Software & Visión**: Cinemática de Swerve, AprilTags con Limelight 3A, control PID y odometría WPILib.
  - 📊 **Estrategia & Scouting**: Análisis de rivales, playbooks y selección de alianzas.
  - 📢 **Impacto, Media & Safety**: FIRST Impact Award, bitácoras y normas de seguridad en taller.
- **Tablero Kanban Interactivo**: Tareas distribuidas en 4 columnas (*Por Iniciar*, *En Taller*, *Revisión Mentor*, *Completado*) con avance rápido y filtro por subequipo.
- **Directorio de Estudiantes y Mentores**: Registro de horas de taller presencial, roles, habilidades y certificación de seguridad FIRST.

---

### 3. 📦 Inventario & Materiales (BOM - Bill of Materials)
- Catálogo precargado con componentes reales de los proveedores oficiales de FIRST (**REV Robotics, AndyMark, WestCoast Products, CTRE**):
  - Motores: **REV NEO Brushless, Kraken X60, NEO 550**.
  - Controladores: **Spark MAX, Spark Flex, Talon FX**.
  - Cerebro y sensores: **NI roboRIO 2.0, Limelight 3A, Pigeon 2.0 IMU, radio WiFi 6E VH-109**.
  - Transmisión: **Módulos Swerve SDS MK4i, ruedas Colson 4", perfiles MaxTube**.
- Modificación dinámica de piezas montadas en el robot con actualización inmediata de peso y costo.
- Buscador por texto y filtro por categoría.
- **Exportación de la Hoja Oficial BOM a CSV** lista para presentar ante los inspectores de FIRST.

---

### 4. 🛠️ Robot Builder & Arquitectura CAN
- **Calculador Cinemático de Chasis**:
  - Selección de tipo de chasis (*Swerve Drive MK4i*, *REV MAXSwerve*, *Tank 6WD Drop Center*, *Mecanum*).
  - Cálculo automático de la velocidad máxima teórica en **m/s** y **ft/s** según reducción (L1, L2, L3) y diámetro de rueda.
  - Esquema visual 2D del robot con estimación de altura del Centro de Masa (CoM).
- **Inspector de Bus CAN y Prevención de Colisiones (Regla R714)**:
  - Diagrama de flujo en cadena (Daisy Chain) desde el roboRIO 2.0 hasta la resistencia de terminación de 120Ω en el REV PDH.
  - **Detector de Colisiones en Tiempo Real**: Alerta roja instantánea si dos dispositivos comparten el mismo CAN ID (causa #1 de fallas en cancha).
- **Presupuesto de Corriente y Potencia**:
  - Asignación de canales de 40A, 20A y 10A en el PDH frente a la curva de disparo del Breaker principal de 120A.

---

### 5. 🎮 Simulador de Arena FRC & Pruebas en Vivo
- **Motor Físico 2D en Canvas a 60 FPS**:
  - Arena reglamentaria a escala con alfombra FRC, líneas de zona de alianzas, zonas de Speaker, Amp y Stage de escalada.
  - Controles de conducción realistas:
    - **Modo Swerve Holonómico**: Desplazamiento en cualquier dirección sin importar el ángulo de orientación del chasis.
    - **Modo Tank / Arcade**: Tracción diferencial clásica.
  - **Mecanismo de Intake Activo**: Absorbe piezas de juego (anillos / notas FRC) del suelo mediante detección de proximidad.
  - **Mecanismo de Disparo Flywheel**: Lanza proyectiles parabólicos al Speaker superior con efectos de impacto (+5 puntos).
  - **Escalada en el Escenario (Stage / Climb)** en los 20 segundos finales de Endgame.
- **Modos de Prueba**:
  - 🕹️ **Práctica Libre**: Manejo continuo y familiarización para los conductores.
  - ⏱️ **Periodo Autónomo (15 segundos)**: Editor y ejecutor de Waypoints con algoritmo de control PID en lazo cerrado.
  - 🏆 **Match Oficial Completo**: Conteo oficial de 2m 30s (15s auto + 2m 15s teleop) con efectos sonoros sintetizados nativamente (sin archivos externos) y lluvia de confeti en victoria.
- **Panel de Telemetría & Calibración PID**:
  - Velocímetro en m/s, lectura de giroscopio en grados (°), corriente total en Amperios y caída de voltaje de batería (Voltage Sag) bajo aceleración.
  - Sliders para calibrar **Kp, Ki, Kd** (útil para enseñar control automático a los alumnos).

---

### 6. 📋 Estrategia, Alianzas 3v3 & Pit Scouting
- **Simulador Predictivo de Alianzas 3 vs 3**:
  - Combina 3 robots para la Alianza Azul y 3 robots para la Alianza Roja.
  - Simula puntuaciones estimadas de Autónomo, Teleoperado, Escalada y probabilidad porcentual de victoria con Ranking Points (RPs).
- **Libreta de Pit Scouting**:
  - Formulario para registrar datos de robots rivales en los boxes (tipo de chasis, ciclos por minuto, fiabilidad de escalada y métrica EPA - *Expected Points Added*).
  - Generación de Picklist para las rondas de selección de alianzas en playoffs.

---

## ⌨️ Controles del Simulador

| Tecla / Control | Acción |
| :--- | :--- |
| **W / A / S / D** o **Flechas** | Conducir el robot (Traslación Swerve o Avance/Retroceso) |
| **Q / E** o **Flecha Izq / Der** | Rotar el robot sobre su propio eje |
| **Barra Espaciadora** | Activar Intake para absorber notas/piezas de juego |
| **F** | Disparar pieza hacia el Speaker (+5 puntos) |
| **Botón de Modo** | Alternar entre Práctica Libre, Prueba Autónomo 15s y Match Oficial |
| **Volumen** | Activar o silenciar bocinas oficiales y chimes de puntuación |

---

¡Mucho éxito al colegio en la FIRST Robotics Competition! Si desean personalizar algún subsistema adicional o agregar reglas específicas de un año en particular, la plataforma está 100% modularizada y lista para adaptarse.
