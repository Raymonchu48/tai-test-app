# TAI Test - Aplicación de Preparación para la Oposición TAI 2025

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Raymonchu48/tai-test-app)](https://github.com/Raymonchu48/tai-test-app)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-blue.svg)](https://expo.dev/)

Una aplicación móvil y web profesional para preparar la oposición de **Técnico Auxiliar de Informática (TAI)** de la Administración General del Estado. Incluye 100 preguntas reales organizadas por bloques temáticos, sincronización en la nube, y análisis detallado de resultados.

## 🎯 Características Principales

### 📱 Multiplataforma
- **iOS y Android** - App nativa con Expo
- **Windows, Mac, Linux** - Versión web responsive
- **Sincronización en la nube** - Accede desde cualquier dispositivo

### 📚 Contenido Educativo
- **100 preguntas reales** de la oposición TAI 2025
- **4 bloques temáticos**:
  - Bloque I: Organización del Estado y Administración Electrónica
  - Bloque II: Tecnología Básica
  - Bloque III: Desarrollo de Sistemas
  - Bloque IV: Sistemas y Comunicaciones
- **20 preguntas por bloque** + **20 preguntas generales**

### 🔄 Sincronización en la Nube
- Autenticación segura con OAuth
- Base de datos MySQL para almacenar resultados
- Sincronización bidireccional entre dispositivos
- Historial completo de tests

### 📊 Análisis y Estadísticas
- Puntuación y porcentaje de aciertos
- Desglose por bloque temático
- Historial completo de intentos
- Revisión detallada de respuestas

### 🎨 Diseño Profesional
- Interfaz moderna con Tailwind CSS
- Modo oscuro/claro automático
- Diseño responsive para todos los tamaños de pantalla
- Logo personalizado

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+
- pnpm (recomendado) o npm
- Git

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Raymonchu48/tai-test-app.git
cd tai-test-app

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
pnpm dev
```

### Acceso a la Aplicación

**Web:** http://localhost:8081

**Móvil (Expo Go):**
1. Descarga la app Expo Go en tu dispositivo
2. Escanea el código QR que aparece en la terminal
3. ¡Listo!

## 📁 Estructura del Proyecto

```
tai-test-app/
├── app/                      # Pantallas de la aplicación
│   ├── (tabs)/              # Navegación con tabs
│   ├── login.tsx            # Pantalla de autenticación
│   ├── test-blocks.tsx      # Selección de bloques
│   ├── test-question.tsx    # Interfaz de preguntas
│   ├── test-results.tsx     # Resultados y análisis
│   └── ...
├── components/              # Componentes reutilizables
├── hooks/                   # Custom hooks
│   ├── use-auth.ts         # Autenticación
│   ├── use-test-session.ts # Gestión de tests
│   └── use-cloud-sync.ts   # Sincronización en la nube
├── lib/                     # Utilidades y tipos
│   ├── types.ts            # Tipos TypeScript
│   ├── questions-bank.ts   # Banco de preguntas
│   └── storage.ts          # Almacenamiento local
├── server/                  # Backend con tRPC
│   ├── routers.ts          # APIs REST
│   ├── db.ts               # Funciones de base de datos
│   └── _core/              # Configuración del servidor
├── drizzle/                # Esquema de base de datos
│   ├── schema.ts           # Definición de tablas
│   └── migrations/         # Migraciones SQL
└── package.json            # Dependencias del proyecto
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL=mysql://usuario:contraseña@localhost:3306/tai_test

# OAuth
OAUTH_CLIENT_ID=tu_client_id
OAUTH_CLIENT_SECRET=tu_client_secret

# API
API_URL=http://localhost:3000
```

### Base de Datos

```bash
# Crear y migrar la base de datos
pnpm db:push

# Ver estado de migraciones
pnpm db:status
```

## 📱 Uso de la Aplicación

### Flujo Principal

1. **Autenticación** - Inicia sesión con tu cuenta Manus
2. **Selecciona un test** - Elige entre bloques temáticos o examen general
3. **Responde preguntas** - 20 preguntas por test
4. **Revisa resultados** - Análisis detallado de tu desempeño
5. **Sincroniza** - Tu progreso se guarda automáticamente en la nube

### Funcionalidades Principales

- **Test por bloques**: Practica temas específicos
- **Examen general**: Simula el examen real con 20 preguntas aleatorias
- **Historial**: Revisa todos tus intentos anteriores
- **Estadísticas**: Visualiza tu progreso en el tiempo

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor de desarrollo
pnpm dev:server      # Solo backend
pnpm dev:metro       # Solo frontend

# Testing
pnpm test            # Ejecutar tests
pnpm test:watch      # Tests en modo watch

# Compilación
pnpm build           # Compilar para producción
pnpm check           # Verificar tipos TypeScript
pnpm lint            # Linting con ESLint
pnpm format          # Formatear código

# Base de datos
pnpm db:push         # Crear/migrar tablas
pnpm db:studio       # Abrir Drizzle Studio
```

### Stack Tecnológico

**Frontend:**
- React Native 0.81
- Expo 54
- Expo Router 6 (navegación)
- NativeWind 4 (Tailwind CSS)
- TypeScript 5.9
- React 19

**Backend:**
- Node.js + Express
- tRPC 11 (API type-safe)
- Drizzle ORM (base de datos)
- MySQL 8+
- OAuth 2.0

**Herramientas:**
- Vitest (testing)
- ESLint + Prettier (linting/formatting)
- Tailwind CSS 3

## 🔐 Seguridad

- Autenticación OAuth 2.0
- Tokens seguros en SecureStore (nativo) / Cookies HTTP-only (web)
- Base de datos encriptada
- Validación de entrada con Zod
- CORS configurado

## 📊 Estadísticas del Proyecto

- **100+ preguntas** de la oposición TAI
- **4 bloques temáticos** cubiertos
- **Multiplataforma** (iOS, Android, Web)
- **Sincronización en la nube** bidireccional
- **Código abierto** bajo licencia MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Ray** - Técnico Superior en Informática y Redes

- GitHub: [@Raymonchu48](https://github.com/Raymonchu48)
- Email: [tu-email@ejemplo.com]

## 🙏 Agradecimientos

- Expo por el excelente framework
- Manus por la plataforma de desarrollo
- Comunidad de React Native

## 📞 Soporte

Si tienes preguntas o encuentras problemas:

1. Revisa las [Issues](https://github.com/Raymonchu48/tai-test-app/issues) existentes
2. Crea una nueva Issue con detalles del problema
3. Incluye logs y pasos para reproducir el error

## 🗺️ Roadmap

- [ ] Gráficos de progreso avanzados
- [ ] Modo offline mejorado
- [ ] Notificaciones de recordatorio
- [ ] Exportar resultados a PDF
- [ ] Integración con redes sociales
- [ ] Modo competitivo multijugador
- [ ] Análisis de debilidades con IA

---

**¡Buena suerte en tu preparación para la oposición TAI!** 🎓
