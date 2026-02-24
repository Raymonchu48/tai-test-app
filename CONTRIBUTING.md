# Guía de Contribución - TAI Test

¡Gracias por tu interés en contribuir a TAI Test! Este documento proporciona directrices y instrucciones para contribuir al proyecto.

## Código de Conducta

Nos comprometemos a proporcionar un ambiente acogedor y respetuoso para todos. Por favor, lee y respeta nuestro código de conducta.

## ¿Cómo Puedo Contribuir?

### Reportar Bugs

Antes de crear un reporte de bug, por favor verifica la lista de issues para asegurarte de que el problema no haya sido reportado ya.

**Cuando reportes un bug, incluye:**
- Título claro y descriptivo
- Descripción detallada del comportamiento observado
- Pasos específicos para reproducir el problema
- Comportamiento esperado vs. comportamiento actual
- Screenshots o videos si es aplicable
- Tu entorno (OS, navegador, versión de la app)

### Sugerir Mejoras

Las sugerencias de mejoras son siempre bienvenidas. Para sugerir una mejora:

1. Usa un título claro y descriptivo
2. Proporciona una descripción detallada de la mejora sugerida
3. Lista algunos ejemplos de cómo esta mejora sería útil
4. Menciona otras aplicaciones similares que implementan esta característica

### Pull Requests

1. **Fork el repositorio** y crea tu rama desde `main`
2. **Clona el repositorio** localmente
3. **Crea una rama** para tu feature: `git checkout -b feature/AmazingFeature`
4. **Realiza tus cambios** siguiendo el estilo de código del proyecto
5. **Escribe o actualiza tests** según sea necesario
6. **Asegúrate de que los tests pasen**: `pnpm test`
7. **Verifica el linting**: `pnpm lint`
8. **Formatea el código**: `pnpm format`
9. **Commit tus cambios**: `git commit -m 'Add some AmazingFeature'`
10. **Push a tu rama**: `git push origin feature/AmazingFeature`
11. **Abre un Pull Request** con una descripción clara

## Estándares de Desarrollo

### Estilo de Código

- Usamos **TypeScript** para type safety
- Seguimos **ESLint** y **Prettier** para consistencia
- Usamos **Tailwind CSS** para estilos
- Componentes en **React** con hooks

### Convenciones de Nombres

- **Componentes**: PascalCase (e.g., `TestQuestion.tsx`)
- **Funciones**: camelCase (e.g., `calculateScore()`)
- **Constantes**: UPPER_SNAKE_CASE (e.g., `MAX_QUESTIONS`)
- **Archivos**: kebab-case (e.g., `test-question.tsx`)

### Estructura de Componentes

```tsx
import { View, Text } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export function MyComponent({ title, onPress }: MyComponentProps) {
  return (
    <ScreenContainer className="p-4">
      <Text className="text-lg font-bold">{title}</Text>
    </ScreenContainer>
  );
}
```

### Commits

- Usa mensajes de commit descriptivos
- Usa el presente imperativo ("Add feature" no "Added feature")
- Limita la primera línea a 72 caracteres
- Referencia issues y pull requests relevantes

Ejemplos:
- `Add cloud sync functionality`
- `Fix login button styling on mobile`
- `Update test question validation`

## Proceso de Review

1. Un mantenedor revisará tu PR
2. Se pueden solicitar cambios o mejoras
3. Una vez aprobado, tu PR será mergeado a `main`
4. Tu contribución será incluida en el siguiente release

## Configuración Local

### Requisitos
- Node.js 18+
- pnpm
- Git

### Setup

```bash
# Clonar tu fork
git clone https://github.com/tu-usuario/tai-test-app.git
cd tai-test-app

# Instalar dependencias
pnpm install

# Crear rama de feature
git checkout -b feature/tu-feature

# Iniciar desarrollo
pnpm dev
```

### Testing

```bash
# Ejecutar tests
pnpm test

# Tests en modo watch
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Linting y Formatting

```bash
# Verificar linting
pnpm lint

# Formatear código
pnpm format

# Verificar tipos
pnpm check
```

## Preguntas o Necesitas Ayuda?

- Abre una **Discussion** en GitHub
- Revisa la documentación en el README
- Crea un **Issue** si encuentras un problema

## Licencia

Al contribuir a este proyecto, aceptas que tus contribuciones serán licenciadas bajo la licencia MIT del proyecto.

---

¡Gracias por contribuir a TAI Test! 🎉
