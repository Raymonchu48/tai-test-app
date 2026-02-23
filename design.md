# TAI Test Oposiciones - Diseño de Interfaz Móvil

## Visión General

Aplicación móvil profesional para preparación de la oposición TAI (Técnico Auxiliar de Informática) de la Administración General del Estado. La app permite realizar test por bloques temáticos y exámenes generales de 20 preguntas cada uno, con seguimiento de progreso y análisis de resultados.

## Pantallas Principales

### 1. **Pantalla de Inicio (Home)**
- **Contenido Principal:**
  - Bienvenida y nombre del usuario (si está registrado)
  - Resumen de estadísticas: Total de preguntas respondidas, Porcentaje de aciertos, Racha actual
  - Botones de acceso rápido a dos opciones principales
  
- **Acciones:**
  - "Iniciar Test por Bloques" → Navega a selección de bloques
  - "Examen General" → Inicia test de 20 preguntas aleatorias
  - "Historial" → Accede a resultados anteriores
  - "Configuración" → Ajustes de la app

### 2. **Pantalla de Selección de Bloques**
- **Contenido Principal:**
  - Lista de 4 bloques temáticos con tarjetas interactivas
  - Cada tarjeta muestra:
    - Nombre del bloque (ej: "Organización del Estado")
    - Número de temas (ej: "9 temas")
    - Número de preguntas disponibles (ej: "45 preguntas")
    - Progreso visual (barra de progreso)
    - Porcentaje de aciertos en ese bloque
  
- **Acciones:**
  - Tocar tarjeta → Inicia test del bloque seleccionado
  - Ícono de información → Muestra detalles del bloque

### 3. **Pantalla de Test (Pregunta)**
- **Contenido Principal:**
  - Encabezado con:
    - Número de pregunta actual (ej: "Pregunta 5 de 20")
    - Barra de progreso visual
    - Contador de tiempo (opcional, para exámenes)
  - Cuerpo con:
    - Texto de la pregunta (scrollable si es muy largo)
    - 4 opciones de respuesta (A, B, C, D) como botones seleccionables
    - Indicador visual de opción seleccionada
  
- **Acciones:**
  - Seleccionar opción → Resalta la opción
  - "Siguiente" → Avanza a la siguiente pregunta
  - "Anterior" → Retrocede a la pregunta anterior
  - "Saltar" → Marca para revisar después
  - "Finalizar Test" → Termina el test (con confirmación)

### 4. **Pantalla de Resultados**
- **Contenido Principal:**
  - Resumen general:
    - Puntuación final (ej: "16 de 20 aciertos - 80%")
    - Indicador visual circular con porcentaje
    - Tiempo total empleado
  - Desglose por tipo de pregunta:
    - Preguntas correctas (verde)
    - Preguntas incorrectas (rojo)
    - Preguntas sin responder (gris)
  - Botón "Ver Detalle" para revisar respuestas

- **Acciones:**
  - "Revisar Respuestas" → Navega a pantalla de revisión
  - "Nuevo Test" → Vuelve a la selección de bloques
  - "Compartir Resultado" → Opción de compartir puntuación
  - "Volver a Inicio" → Regresa al home

### 5. **Pantalla de Revisión de Respuestas**
- **Contenido Principal:**
  - Lista scrollable de todas las preguntas del test
  - Cada pregunta muestra:
    - Número y texto de la pregunta
    - Opción seleccionada por el usuario (con color)
    - Respuesta correcta (si fue incorrecta)
    - Explicación o referencia al tema (si está disponible)
    - Indicador de correcto/incorrecto

- **Acciones:**
  - Desplazarse por las preguntas
  - Tocar pregunta → Expande detalles
  - "Volver" → Regresa a resultados

### 6. **Pantalla de Historial**
- **Contenido Principal:**
  - Lista de tests realizados, ordenados por fecha (más recientes primero)
  - Cada entrada muestra:
    - Tipo de test (Bloque I, Examen General, etc.)
    - Fecha y hora
    - Puntuación (ej: "18/20 - 90%")
    - Tiempo empleado
  
- **Acciones:**
  - Tocar entrada → Muestra resultados de ese test
  - Deslizar para eliminar (opcional)
  - Filtro por tipo de test (opcional)

### 7. **Pantalla de Configuración**
- **Contenido Principal:**
  - Opciones de personalización:
    - Modo oscuro/claro
    - Sonidos y vibraciones
    - Mostrar/ocultar temporizador
    - Reiniciar progreso (con confirmación)
  - Información de la app:
    - Versión
    - Créditos
    - Enlace a términos y privacidad

## Flujos de Usuario Principales

### Flujo 1: Realizar Test por Bloques
1. Inicio → "Iniciar Test por Bloques"
2. Seleccionar bloque
3. Test de preguntas (20 preguntas del bloque)
4. Resultados
5. Revisar respuestas (opcional)
6. Volver a inicio

### Flujo 2: Examen General
1. Inicio → "Examen General"
2. Test de 20 preguntas aleatorias
3. Resultados
4. Revisar respuestas (opcional)
5. Volver a inicio

### Flujo 3: Consultar Historial
1. Inicio → "Historial"
2. Seleccionar test anterior
3. Ver resultados
4. Revisar respuestas (opcional)
5. Volver a historial

## Colores y Branding

- **Color Primario:** Azul profesional (#0a7ea4) - Confianza y autoridad
- **Color de Éxito:** Verde (#22C55E) - Respuestas correctas
- **Color de Error:** Rojo (#EF4444) - Respuestas incorrectas
- **Color de Advertencia:** Naranja (#F59E0B) - Preguntas sin responder
- **Fondo:** Blanco/Gris claro (light mode) o Gris oscuro (dark mode)
- **Texto Principal:** Gris oscuro (#11181C)
- **Texto Secundario:** Gris medio (#687076)

## Consideraciones de Diseño

- **Orientación:** Retrato (9:16) - Optimizado para una mano
- **Seguridad:** Las respuestas se guardan localmente en AsyncStorage
- **Accesibilidad:** Textos legibles, contrastes adecuados, botones de tamaño suficiente
- **Responsividad:** Adaptable a diferentes tamaños de pantalla
- **Interacción:** Feedback inmediato (haptics, cambios visuales)
- **Rendimiento:** Carga rápida de preguntas, sin lag en navegación

## Estructura de Datos

```typescript
interface Question {
  id: string;
  block: 'block1' | 'block2' | 'block3' | 'block4';
  theme: number;
  text: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: 'a' | 'b' | 'c' | 'd';
  explanation?: string;
}

interface TestResult {
  id: string;
  type: 'block' | 'general';
  blockId?: string;
  startTime: number;
  endTime: number;
  questions: Question[];
  userAnswers: Record<string, 'a' | 'b' | 'c' | 'd' | null>;
  score: number;
  totalQuestions: number;
}

interface UserStats {
  totalTests: number;
  totalCorrect: number;
  totalAttempted: number;
  blockStats: Record<string, {
    attempts: number;
    correct: number;
  }>;
}
```

## Próximos Pasos

1. Implementar estructura de navegación con Expo Router
2. Crear componentes reutilizables (QuestionCard, ResultCard, etc.)
3. Integrar banco de preguntas TAI
4. Implementar lógica de almacenamiento local
5. Agregar estadísticas y análisis
6. Pulir diseño visual y animaciones
