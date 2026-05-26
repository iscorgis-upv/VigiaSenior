# VigiaSenior · Carpeta de profesorado en HTML

Este paquete convierte la documentación principal de profesorado en una versión HTML más navegable y más cómoda de revisar.

## Qué incluye
- `index.html` como punto de entrada
- `styles.css`
- 9 documentos HTML enlazados entre sí

## Enfoque
La intención no ha sido únicamente “pasar de Markdown a HTML”, sino mejorar la lectura global del bloque:
- reorganizando documentos;
- enlazando secciones relacionadas;
- incorporando tablas y materiales de evaluación con más claridad;
- y reforzando la sensación de conjunto transferible.

## Ubicación recomendada
Hay dos opciones razonables:

### Opción A
Sustituir la navegación principal de la carpeta `profesorado/` por esta versión HTML:

```text
profesorado/
├── index.html
├── styles.css
└── resto de páginas HTML
```

### Opción B
Conservar los `.md` como fuente de trabajo y dejar esta versión en una subcarpeta:

```text
profesorado/
├── fuentes_md/
└── html/
    ├── index.html
    ├── styles.css
    └── resto de páginas HTML
```

## Recomendación práctica
La opción B suele ser la más cómoda:
- los `.md` siguen sirviendo como fuente editable;
- el HTML queda como versión de lectura, defensa y transferencia.
