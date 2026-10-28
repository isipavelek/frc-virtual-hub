// Datos iniciales auténticos para la plataforma FRC Virtual

export const INITIAL_TEAM_INFO = {
  teamNumber: "9482",
  teamName: "CyberRobotics College",
  rookieYear: 2024,
  school: "Colegio Técnico de Innovación",
  location: "Argentina / LATAM",
  seasonName: "FIRST CRESCENDO / REEFSCAPE",
  seasonWeek: 4, // Semana 4 de 6 en la Build Season
  budgetLimit: 7500, // USD
  weightLimitLbs: 125.0, // Regla oficial FRC: 125 lbs máx sin batería ni bumpers
};

export const INITIAL_SUBTEAMS = [
  { id: "mech", name: "Mecánica & Chasis", icon: "Wrench", color: "#3b82f6", lead: "Ignacio Vega", count: 8 },
  { id: "elec", name: "Electrónica & Control", icon: "Zap", color: "#f59e0b", lead: "Sofía Méndez", count: 5 },
  { id: "soft", name: "Software & Visión", icon: "Code", color: "#10b981", lead: "Mateo Rivas", count: 6 },
  { id: "scout", name: "Estrategia & Scouting", icon: "BarChart3", color: "#8b5cf6", lead: "Valentina Paz", count: 4 },
  { id: "impact", name: "Impacto, Media & Safety", icon: "Shield", color: "#ec4899", lead: "Camila Torres", count: 5 },
];

export const INITIAL_MEMBERS = [
  {
    id: "m-1",
    name: "Ignacio Vega",
    role: "Capitán Mecánico",
    subteam: "mech",
    type: "Estudiante (Senior)",
    hours: 54,
    safetyCertified: true,
    skills: ["CAD Onshape", "Torno CNC", "Soldadura TIG", "Ensamblaje"]
  },
  {
    id: "m-2",
    name: "Sofía Méndez",
    role: "Líder de Cableado y Potencia",
    subteam: "elec",
    type: "Estudiante (Senior)",
    hours: 48,
    safetyCertified: true,
    skills: ["roboRIO 2.0", "CAN Bus Wiring", "Crimping Anderson", "PDH REV"]
  },
  {
    id: "m-3",
    name: "Mateo Rivas",
    role: "Líder de Programación",
    subteam: "soft",
    type: "Estudiante (Junior)",
    hours: 62,
    safetyCertified: true,
    skills: ["WPILib Java", "Swerve Kinematics", "Limelight 3", "PathPlanner"]
  },
  {
    id: "m-4",
    name: "Valentina Paz",
    role: "Estratega Principal",
    subteam: "scout",
    type: "Estudiante (Junior)",
    hours: 36,
    safetyCertified: true,
    skills: ["Análisis de Datos", "Pit Scouting", "Tableau", "Estrategia Match"]
  },
  {
    id: "m-5",
    name: "Prof. Alberto Conti",
    role: "Mentor Principal de Ingeniería",
    subteam: "mech",
    type: "Mentor Docente",
    hours: 80,
    safetyCertified: true,
    skills: ["Física Aplicada", "Mecánica", "Seguridad Taller FIRST"]
  },
  {
    id: "m-6",
    name: "Ing. Lucía Aranda",
    role: "Mentora de Software & Control",
    subteam: "soft",
    type: "Mentora Externa / Alum",
    hours: 45,
    safetyCertified: true,
    skills: ["Control PID", "Filtrado Kalman", "Odometría", "Java"]
  },
  {
    id: "m-7",
    name: "Tomás Giménez",
    role: "Técnico Mecanizado",
    subteam: "mech",
    type: "Estudiante (Sophomore)",
    hours: 32,
    safetyCertified: true,
    skills: ["Sierra de cinta", "Impresión 3D PETG", "Taladro de banco"]
  },
  {
    id: "m-8",
    name: "Camila Torres",
    role: "Safety Captain & Media",
    subteam: "impact",
    type: "Estudiante (Junior)",
    hours: 40,
    safetyCertified: true,
    skills: ["Primeros Auxilios", "Normativa Safety FRC", "Edición Video"]
  }
];

export const INITIAL_TASKS = [
  {
    id: "t-1",
    title: "Diseño y cálculo de reducción de Swerve Drive en CAD",
    subteam: "mech",
    assignee: "Ignacio Vega",
    status: "done", // todo, in-progress, review, done
    priority: "high",
    week: 1,
    description: "Definir relación de transmisión L2 (6.75:1) para SDS MK4i con motores NEO."
  },
  {
    id: "t-2",
    title: "Mapeo de CAN IDs y cableado de Power Distribution Hub",
    subteam: "elec",
    assignee: "Sofía Méndez",
    status: "done",
    priority: "high",
    week: 2,
    description: "Asignar IDs únicos a los 8 Spark MAX y terminar bus con resistencia de 120 ohms."
  },
  {
    id: "t-3",
    title: "Implementación de odometría Swerve con Pigeon 2.0 en WPILib",
    subteam: "soft",
    assignee: "Mateo Rivas",
    status: "in-progress",
    priority: "high",
    week: 3,
    description: "Configurar Kinematics, Feedforward y Odometry con encoders CANcoder de CTRE."
  },
  {
    id: "t-4",
    title: "Mecanizado de placas de aluminio 1/4\" para el Brazo/Intake",
    subteam: "mech",
    assignee: "Tomás Giménez",
    status: "in-progress",
    priority: "medium",
    week: 4,
    description: "Corte CNC de placas laterales y montaje de rodamientos hexagonales de 1/2 pulgada."
  },
  {
    id: "t-5",
    title: "Afinación de lazo de control PID para el Shooter (RPM objetivo)",
    subteam: "soft",
    assignee: "Mateo Rivas",
    status: "review",
    priority: "high",
    week: 4,
    description: "Calibrar Kp, Ki, Kd y Kv para mantener 5500 RPM estables en los Kraken X60."
  },
  {
    id: "t-6",
    title: "Inspección de Baterías 12V 18Ah y pruebas con Beak Tester",
    subteam: "elec",
    assignee: "Sofía Méndez",
    status: "todo",
    priority: "medium",
    week: 5,
    description: "Medir resistencia interna (Rint < 0.018 ohms) y etiquetar ciclo de carga."
  },
  {
    id: "t-7",
    title: "Rutas del Periodo Autónomo (15 segundos) con PathPlanner",
    subteam: "soft",
    assignee: "Mateo Rivas",
    status: "todo",
    priority: "high",
    week: 5,
    description: "Crear trayectorias de 3 y 4 notas/piezas saliendo desde la posición Subwoofer."
  },
  {
    id: "t-8",
    title: "Auditoría de Peso y Hoja de Inspección Oficial FRC",
    subteam: "impact",
    assignee: "Camila Torres",
    status: "todo",
    priority: "high",
    week: 6,
    description: "Verificar límites de 125 lbs (56.7 kg), radio de bumpers de 3/4\" y extintores."
  }
];

export const INITIAL_PARTS = [
  // Cerebro y Control
  {
    id: "p-1",
    name: "NI roboRIO 2.0",
    category: "Control",
    supplier: "National Instruments / AndyMark",
    cost: 599.0,
    weightLbs: 0.92,
    quantity: 1,
    inRobot: 1,
    status: "En Robot",
    specs: "Procesador Dual-Core ARM Cortex-A9, Puertos CAN, DIO, PWM, Analógicos, USB"
  },
  {
    id: "p-2",
    name: "REV Power Distribution Hub (PDH)",
    category: "Electrónica",
    supplier: "REV Robotics",
    cost: 240.0,
    weightLbs: 1.35,
    quantity: 2,
    inRobot: 1,
    status: "En Robot",
    specs: "20 canales con fusibles de hasta 40A, monitoreo de corriente por CAN"
  },
  {
    id: "p-3",
    name: "REV Radio Power Module (RPM)",
    category: "Electrónica",
    supplier: "REV Robotics",
    cost: 45.0,
    weightLbs: 0.25,
    quantity: 2,
    inRobot: 1,
    status: "En Robot",
    specs: "Regulador 12V aislado especial para Radio FRC"
  },
  {
    id: "p-4",
    name: "Radio de Comunicación Open-Mesh / VH-109",
    category: "Comunicaciones",
    supplier: "AndyMark",
    cost: 85.0,
    weightLbs: 0.40,
    quantity: 2,
    inRobot: 1,
    status: "En Robot",
    specs: "WiFi 6E oficial FIRST FRC"
  },
  {
    id: "p-5",
    name: "Giroscopio / IMU Pigeon 2.0",
    category: "Sensores",
    supplier: "CTRE",
    cost: 199.0,
    weightLbs: 0.15,
    quantity: 2,
    inRobot: 1,
    status: "En Robot",
    specs: "Giroscopio de 9 ejes con fusión de sensor en hardware sin deriva"
  },
  {
    id: "p-6",
    name: "Cámara Inteligente Limelight 3A",
    category: "Visión & Sensores",
    supplier: "Limelight Robotics",
    cost: 400.0,
    weightLbs: 0.55,
    quantity: 1,
    inRobot: 1,
    status: "En Robot",
    specs: "Procesamiento de AprilTags a 90 FPS y redes neuronales"
  },

  // Motores y Controladores
  {
    id: "p-7",
    name: "Motor Brushless REV NEO 1.1 (x4 Chasis)",
    category: "Motores",
    supplier: "REV Robotics",
    cost: 190.0, // lote
    weightLbs: 3.80, // peso total
    quantity: 6,
    inRobot: 4,
    status: "En Robot",
    specs: "5676 RPM libres, 2.6 Nm torque de bloqueo"
  },
  {
    id: "p-8",
    name: "Controlador REV Spark MAX (x4 Chasis)",
    category: "Controladores",
    supplier: "REV Robotics",
    cost: 360.0,
    weightLbs: 0.96,
    quantity: 8,
    inRobot: 4,
    status: "En Robot",
    specs: "60A continuos, bus CAN nativo"
  },
  {
    id: "p-9",
    name: "Motor Brushless Kraken X60 by CTRE (x2 Shooter)",
    category: "Motores",
    supplier: "WestCoast Products",
    cost: 440.0,
    weightLbs: 3.52,
    quantity: 3,
    inRobot: 2,
    status: "En Robot",
    specs: "7.09 Nm stall torque, 6000 RPM, Talon FX integrado"
  },
  {
    id: "p-10",
    name: "Motor NEO 550 con Caja Planetaria UltraPlanetary (Intake)",
    category: "Motores",
    supplier: "REV Robotics",
    cost: 95.0,
    weightLbs: 1.10,
    quantity: 2,
    inRobot: 1,
    status: "En Robot",
    specs: "Compacto y veloz para rodillos de alimentación"
  },
  {
    id: "p-11",
    name: "Motor REV NEO con reductor MAXPlanetary (Brazo)",
    category: "Motores",
    supplier: "REV Robotics",
    cost: 140.0,
    weightLbs: 2.10,
    quantity: 2,
    inRobot: 1,
    status: "En Robot",
    specs: "Reducción 45:1 para elevación precisa de brazo"
  },

  // Mecánica & Chasis
  {
    id: "p-12",
    name: "Módulos Swerve SDS MK4i (x4)",
    category: "Chasis & Mecánica",
    supplier: "Swerve Drive Specialties",
    cost: 1400.0,
    weightLbs: 22.4,
    quantity: 4,
    inRobot: 4,
    status: "En Robot",
    specs: "Módulos invertidos de tracción y giro independiente"
  },
  {
    id: "p-13",
    name: "Estructura Perfil de Aluminio MaxTube 2x1 y 1x1",
    category: "Chasis & Mecánica",
    supplier: "REV Robotics",
    cost: 210.0,
    weightLbs: 16.5,
    quantity: 1,
    inRobot: 1,
    status: "En Robot",
    specs: "Aleación 6061-T6 con patrón de agujeros 0.5\""
  },
  {
    id: "p-14",
    name: "Ruedas de Uretano Colson 4\" x 1.5\" (x4)",
    category: "Chasis & Mecánica",
    supplier: "AndyMark",
    cost: 64.0,
    weightLbs: 1.8,
    quantity: 8,
    inRobot: 4,
    status: "En Robot",
    specs: "Alto agarre en alfombra FRC reglamentaria"
  },
  {
    id: "p-15",
    name: "Ruedas Flywheels de Inercia de Silicona Fairing (Shooter)",
    category: "Mecanismo Disparo",
    supplier: "AndyMark",
    cost: 72.0,
    weightLbs: 2.2,
    quantity: 4,
    inRobot: 2,
    status: "En Robot",
    specs: "Durómetro 45A para compresión óptima de la nota"
  },
  {
    id: "p-16",
    name: "Batería Interstate 12V 18Ah SLA (No cuenta para peso límite)",
    category: "Energía",
    supplier: "AndyMark",
    cost: 65.0,
    weightLbs: 12.8,
    quantity: 4,
    inRobot: 1,
    status: "En Stock / Pit",
    specs: "Exenta de la regla de 125 lbs (regla oficial R103)"
  },
  {
    id: "p-17",
    name: "Set de Bumpers Perimetrales Azul y Rojo con Madera y Fideos de Pileta",
    category: "Seguridad / Bumpers",
    supplier: "Fabricación Propia",
    cost: 90.0,
    weightLbs: 14.5,
    quantity: 2,
    inRobot: 1,
    status: "En Robot (Exento)",
    specs: "Regla R406: Los bumpers no cuentan en el límite de peso de 125 lbs"
  }
];

export const INITIAL_ROBOT_CONFIG = {
  name: "CYBER-VIPER V1",
  driveType: "Swerve Drive MK4i", // Swerve Drive MK4i, Tank 6WD, Mecanum
  wheelDiameterInches: 4.0,
  gearRatio: 6.75, // L2
  maxSpeedMetersPerSec: 4.5,
  trackWidthMeters: 0.65, // 25.6 inches
  wheelBaseMeters: 0.65,
  bumperLengthMeters: 0.85,
  shooterAngleDeg: 42,
  shooterRpmGoal: 5400,
  intakeSpeedPercent: 85,
  armMaxAngleDeg: 110,
  canDevices: [
    { id: 1, name: "Drive Front-Left (NEO)", type: "Spark MAX", bus: "CAN Bus 1", currentAmp: 35 },
    { id: 2, name: "Steer Front-Left (NEO)", type: "Spark MAX", bus: "CAN Bus 1", currentAmp: 20 },
    { id: 3, name: "Drive Front-Right (NEO)", type: "Spark MAX", bus: "CAN Bus 1", currentAmp: 35 },
    { id: 4, name: "Steer Front-Right (NEO)", type: "Spark MAX", bus: "CAN Bus 1", currentAmp: 20 },
    { id: 5, name: "Drive Back-Left (NEO)", type: "Spark MAX", bus: "CAN Bus 1", currentAmp: 35 },
    { id: 6, name: "Steer Back-Left (NEO)", type: "Spark MAX", bus: "CAN Bus 1", currentAmp: 20 },
    { id: 7, name: "Drive Back-Right (NEO)", type: "Spark MAX", bus: "CAN Bus 1", currentAmp: 35 },
    { id: 8, name: "Steer Back-Right (NEO)", type: "Spark MAX", bus: "CAN Bus 1", currentAmp: 20 },
    { id: 9, name: "Shooter Left (Kraken)", type: "Talon FX", bus: "CANivore", currentAmp: 40 },
    { id: 10, name: "Shooter Right (Kraken)", type: "Talon FX", bus: "CANivore", currentAmp: 40 },
    { id: 11, name: "Intake Roller (NEO 550)", type: "Spark MAX", bus: "CAN Bus 1", currentAmp: 25 },
    { id: 12, name: "Arm Pivot (NEO MAXPlanetary)", type: "Spark MAX", bus: "CAN Bus 1", currentAmp: 30 },
    { id: 13, name: "Pigeon 2.0 Gyro", type: "IMU Gyro", bus: "CANivore", currentAmp: 1 },
    { id: 14, name: "Power Distribution Hub", type: "REV PDH", bus: "CAN Bus 1", currentAmp: 5 }
  ],
  subsystems: [
    {
      id: "chassis",
      name: "Chasis Swerve Drive",
      description: "4 módulos independientes SDS MK4i invertidos. Maniobrabilidad holonómica 360°.",
      motors: 8,
      status: "Calibrado",
      weightLbs: 48.5,
      currentDrawMax: 160
    },
    {
      id: "intake",
      name: "Intake Flotante Over-the-Bumper",
      description: "Rodillos activos de uretano con centrado de pieza hacia el alimentador.",
      motors: 1,
      status: "En Ensamble",
      weightLbs: 11.2,
      currentDrawMax: 25
    },
    {
      id: "shooter",
      name: "Shooter Flywheel de Doble Rotor",
      description: "Dos Kraken X60 contra-rotantes para tiro curvo de alta precisión a 5.5 metros.",
      motors: 2,
      status: "Pruebas PID",
      weightLbs: 14.8,
      currentDrawMax: 80
    },
    {
      id: "arm",
      name: "Brazo Articulado Pivotante",
      description: "Posicionamiento angular del lanzador para variar el ángulo de tiro entre Amp y Speaker.",
      motors: 1,
      status: "Pruebas Mecánicas",
      weightLbs: 9.6,
      currentDrawMax: 30
    },
    {
      id: "climber",
      name: "Escalador Telescópico",
      description: "Ganchos pasivos con trinquete antireversa para suspensión en el escenario al final del match.",
      motors: 0,
      status: "Diseño CAD",
      weightLbs: 6.2,
      currentDrawMax: 0
    }
  ]
};

export const FIELD_SPECS = {
  widthMeters: 16.54, // Oficial FRC Field
  heightMeters: 8.21,
  speakerBluePos: { x: 0.2, y: 5.55 },
  speakerRedPos: { x: 16.34, y: 5.55 },
  ampBluePos: { x: 1.84, y: 8.0 },
  ampRedPos: { x: 14.7, y: 8.0 },
  stageBluePos: { x: 4.8, y: 4.1 },
  stageRedPos: { x: 11.7, y: 4.1 },
};
