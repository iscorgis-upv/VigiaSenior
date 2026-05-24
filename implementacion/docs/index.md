# Documentación técnica de VigiaSenior

## Introducción

La presente documentación técnica recoge los elementos principales de la parte de implementación del proyecto **VigiaSenior**, centrado en el desarrollo del backend de un sistema IoT para el seguimiento de la medicación en personas mayores.

Su finalidad es complementar la programación de aula y ofrecer una visión clara de la arquitectura técnica del proyecto, del flujo de trabajo seguido y de los recursos disponibles para su desarrollo, validación y futura reutilización.

## Qué se puede encontrar en esta documentación

Dentro de la carpeta `implementacion/docs/` se recopilan los documentos relacionados con:

- arquitectura general del sistema;
- estructura del backend;
- integración con hardware o simulación;
- decisiones de diseño adoptadas;
- notas técnicas de apoyo;
- recursos de seguimiento y validación.

## Relación con el repositorio

Esta parte del repositorio no sustituye a los materiales curriculares de `profesorado/` y `alumnado/`, sino que los complementa. Mientras que esos materiales responden a la dimensión didáctica del proyecto, la carpeta `implementacion/` recoge la dimensión técnica.

## Puesta en marcha básica

### Backend
```bash
cd implementacion/backend
npm install
npm run build
npm run dev
```

### Documentación técnica
```bash
cd implementacion
mkdocs serve
```

### Simulación
La simulación del proyecto puede explorarse desde la carpeta:

```text
implementacion/simulacion/
```

En ella se incluyen recursos pensados para pruebas locales y para aproximaciones al backend mediante entornos como Wokwi.

## Navegación recomendada

Se recomienda consultar la documentación técnica en este orden:

1. arquitectura general del sistema;
2. estructura del backend;
3. hardware y simulación;
4. pruebas y validación;
5. recursos de apoyo.

## Observación final

La documentación técnica está concebida como apoyo al desarrollo, a la evaluación y a la transferencia del proyecto. Por ello, se prioriza la claridad expositiva, la trazabilidad de decisiones y la utilidad práctica de los contenidos.
