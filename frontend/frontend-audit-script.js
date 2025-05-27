#!/usr/bin/env node

/**
 * FRONTEND ELITE AUDIT
 * Script detector de errores para proyectos frontend
 * 
 * Analiza:
 * - React (patrones, optimización, arquitectura)
 * - HTML Semántico
 * - CSS/Tailwind (buenas prácticas, rendimiento)
 * - JavaScript/TypeScript
 * - Accesibilidad (a11y)
 * - Performance
 * - Mejores prácticas UX/UI
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

// Configuración
const CONFIG = {
  // Extensiones a analizar
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.sass'],
  // Directorios a excluir
  excludeDirs: ['node_modules', 'dist', 'build', '.git', '.cache'],
  // Patrones de error por categoría
  patterns: {
    react: {
      missingKeys: {
        pattern: /(\s*<[\w]+.*\s*\{.*\.map\(\([^)]*\)\s*=>\s*<[^>]*(?!\s*key=)[^>]*>\s*)/g,
        severity: 'ERROR',
        message: 'Componente renderizado en map sin prop key'
      },
      useStateInEffect: {
        pattern: /(useEffect\([^)]*=>\s*\{[^}]*setI[^(]*\([^)]*\)[^}]*\})/gs,
        severity: 'WARNING',
        message: 'useState dentro de useEffect sin dependencias adecuadas puede causar bucles infinitos'
      },
      inlineObjectProps: {
        pattern: /(<[A-Z]\w+[^>]*\{\s*\{[^}]+\}\s*\}[^>]*>)/g,
        severity: 'WARNING',
        message: 'Objetos inline en props causan re-renders innecesarios'
      },
      largeComponent: {
        pattern: /(function|const)\s+([A-Z]\w+)\s*=?\s*(\([^)]*\)|[^=]*=>\s*)/g,
        customCheck: (content, match) => {
          const startIndex = match.index + match[0].length;
          let braceCount = 1;
          let endIndex = startIndex;
          
          while (endIndex < content.length && braceCount > 0) {
            const char = content[endIndex];
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
            endIndex++;
          }
          
          const componentBody = content.substring(startIndex, endIndex);
          const lineCount = componentBody.split('\n').length;
          
          return lineCount > 150;
        },
        severity: 'WARNING',
        message: 'Componente demasiado grande (>150 líneas), considere dividirlo'
      },
      contextOveruse: {
        pattern: /(useContext\([^)]+\))/g,
        customCheck: (content) => {
          const matches = content.match(/useContext\([^)]+\)/g) || [];
          return matches.length > 5;
        },
        severity: 'WARNING',
        message: 'Uso excesivo de useContext, considere usar composición o state management más eficiente'
      },
      nonMemoizedCallback: {
        pattern: /(const\s+\w+\s*=\s*\([^)]*\)\s*=>(?!\s*memo|\s*useMemo|\s*useCallback))/g,
        severity: 'INFO',
        message: 'Callback no memoizado puede causar re-renders innecesarios, considere useCallback'
      },
      missingDependencies: {
        pattern: /(useEffect|useCallback|useMemo)\([^,{]+,\s*\[[^\]]*\s*\]/g,
        severity: 'WARNING',
        message: 'Posible dependencia faltante en el array de dependencias'
      },
      directDomManipulation: {
        pattern: /(document\.getElementById|document\.querySelector|innerHTML|innerText|outerHTML|insertAdjacentHTML)/g,
        severity: 'WARNING',
        message: 'Manipulación directa del DOM detectada, use el estado de React en su lugar'
      },
      nonControlledInput: {
        pattern: /<input[^>]*(?<!value=)[^>]*>/g,
        severity: 'WARNING',
        message: 'Input no controlado detectado, use inputs controlados con value y onChange'
      },
      indexAsKey: {
        pattern: /key\s*=\s*\{\s*index\s*\}/g,
        severity: 'WARNING',
        message: 'Uso de índice como key, use un identificador único en su lugar'
      },
      missingPropTypes: {
        pattern: /(const|function)\s+[A-Z]\w*\s*[=({]\s*[^}]*\bprops\b[^}]*[)}]\s*=>?\s*\{/g,
        severity: 'INFO',
        message: 'Componente sin PropTypes o TypeScript interfaces para validación de props'
      },
      inlineStyles: {
        pattern: /style=\{\s*\{/g,
        severity: 'WARNING',
        message: 'Estilos inline detectados, considere usar CSS/SCSS modules o styled-components'
      },
      longFunction: {
        pattern: /(function\s+\w+\s*\([^)]*\)\s*\{)|(const\s+\w+\s*=\s*(?:function\s*\([^)]*\)|[^=]*=>\s*))/g,
        customCheck: (content, match) => {
          const startIndex = match.index + match[0].length;
          let braceCount = 1;
          let endIndex = startIndex;
          
          while (endIndex < content.length && braceCount > 0) {
            const char = content[endIndex];
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
            endIndex++;
          }
          
          const functionBody = content.substring(startIndex, endIndex);
          const lineCount = functionBody.split('\n').length;
          
          return lineCount > 50;
        },
        severity: 'WARNING',
        message: 'Función demasiado larga (>50 líneas), considere dividirla'
      }
    },
    html: {
      nonSemanticElements: {
        pattern: /(<div\s+class(Name)?="[^"]*(?:container|header|footer|nav|main|content)[^"]*"[^>]*>)/gi,
        severity: 'WARNING',
        message: 'Usar div en lugar de elementos semánticos apropiados (header, footer, nav, main, etc.)'
      },
      missingAlt: {
        pattern: /(<img[^>]*(?!alt=)[^>]*>)/g,
        severity: 'ERROR',
        message: 'Imagen sin atributo alt'
      },
      missingLang: {
        pattern: /(<html[^>]*(?!lang=)[^>]*>)/g,
        severity: 'WARNING',
        message: 'Etiqueta HTML sin atributo lang'
      },
      missingLabels: {
        pattern: /(<input[^>]*(?!aria-label|aria-labelledby|id="[^"]+")[^>]*>(?!\s*<label|\s*<\/label))/g,
        severity: 'ERROR',
        message: 'Input sin label asociado'
      }
    },
    css: {
      importantKeyword: {
        pattern: /(!important)/g,
        severity: 'WARNING',
        message: 'Uso de !important indica problemas de especificidad CSS'
      },
      highSpecificity: {
        pattern: /(#[a-zA-Z0-9_-]+\s+#[a-zA-Z0-9_-]+)/g,
        severity: 'WARNING',
        message: 'Selectores CSS con alta especificidad dificultan el mantenimiento'
      },
      hardcodedValues: {
        pattern: /(width|height|margin|padding):\s*\d+px/g,
        severity: 'INFO',
        message: 'Valores hardcodeados pueden afectar la responsividad, considerar unidades relativas (rem, em, %)'
      },
      tailwindUnused: {
        pattern: /className="[^"]*\s*[a-z0-9:-]+\s+[a-z0-9:-]+\s+[a-z0-9:-]+\s+[a-z0-9:-]+\s+[a-z0-9:-]+\s+[a-z0-9:-]+\s+[a-z0-9:-]+/g,
        severity: 'WARNING',
        message: 'Muchas clases de Tailwind en un solo elemento, considere componentizar o crear una clase personalizada'
      },
      mediaQueryMobile: {
        pattern: /@media\s*\([^)]*max-width:/g,
        severity: 'INFO',
        message: 'Considere mobile-first con min-width en lugar de max-width para mejores prácticas responsivas'
      }
    },
    javascript: {
      unusedVars: {
        pattern: /(const|let|var)\s+(\w+)\s*=\s*[^;]*;(?![\s\S]*\2)/g,
        severity: 'WARNING',
        message: 'Variable declarada pero no utilizada'
      },
      consoleLog: {
        pattern: /(console\.log\()/g,
        severity: 'WARNING',
        message: 'console.log dejado en el código'
      },
      nestedPromises: {
        pattern: /\.then\([^)]*=>\s*\{[^}]*\.then\(/g,
        severity: 'WARNING',
        message: 'Promesas anidadas, considere async/await'
      },
      complexCondition: {
        pattern: /if\s*\([^)]{80,}\)/g,
        severity: 'WARNING',
        message: 'Condición demasiado compleja, considere dividirla o crear variables intermedias'
      }
    },
    typescript: {
      anyType: {
        pattern: /(:\s*any\b)/g,
        severity: 'WARNING',
        message: 'Uso de tipo any reduce los beneficios de TypeScript'
      },
      noReturnType: {
        pattern: /(function\s+\w+\s*\([^)]*\)(?!\s*:\s*\w+)|\w+\s*:\s*\([^)]*\)(?!\s*=>\s*\w+))/g,
        severity: 'INFO',
        message: 'Función sin tipo de retorno explícito'
      },
      unnecessaryTypeAssertion: {
        pattern: /(as\s+\w+)/g,
        severity: 'INFO',
        message: 'Aserción de tipo potencialmente innecesaria, revise si se puede mejorar la inferencia'
      }
    },
    accessibility: {
      ariaHidden: {
        pattern: /(aria-hidden=\"true\"[^>]*>(?:[^<]|<(?!\/button|\/a))*<\/(?:button|a)>)/g,
        severity: 'ERROR',
        message: 'Elemento interactivo con aria-hidden="true"'
      },
      lowContrast: {
        pattern: /(color:\s*#[a-fA-F0-9]{3,6}\s*;[^}]*background(?:-color)?:\s*#[a-fA-F0-9]{3,6})/g,
        severity: 'INFO',
        message: 'Verificar contraste de color para accesibilidad'
      },
      missingRoles: {
        pattern: /(<div[^>]*(?:onClick|onKeyDown|onKeyUp|onKeyPress)[^>]*(?!role=)[^>]*>)/g,
        severity: 'WARNING',
        message: 'Elemento div con manejadores de eventos sin role definido'
      },
      tabIndex: {
        pattern: /(tabIndex=[\"-]\d+)/g,
        severity: 'WARNING',
        message: 'Uso potencialmente problemático de tabIndex negativo'
      }
    },
    performance: {
      largeImages: {
        pattern: /(<img[^>]*src=\"[^\"]*\.(?:png|jpg|jpeg|gif)\"[^>]*>)/g,
        severity: 'INFO',
        message: 'Verificar optimización de imagen, considere WebP y atributos width/height'
      },
      inlineStyles: {
        pattern: /(style=\"\s*(?:[^\"]{30,}|[^\"]*:\s*[^\"]*;\s*[^\"]*:\s*[^\"]*;\s*[^\"]*:\s*[^\"]*;))/g,
        severity: 'WARNING',
        message: 'Estilos inline extensos, considere moverlos a un archivo CSS o utilizar clases'
      },
      missingLazy: {
        pattern: /(<img[^>]*(?!loading=)[^>]*>)/g,
        severity: 'INFO',
        message: 'Considerar lazy loading para imágenes (loading="lazy")'
      },
      documentWriteUse: {
        pattern: /(document\\.write\()/g,
        severity: 'ERROR',
        message: 'document.write bloquea el renderizado y puede causar problemas de performance'
      }
    }
  }
};

// Estado global
let results = {
  files: 0,
  errors: 0,
  warnings: 0,
  info: 0,
  issues: []
};

// Colores para severidad
const severityColors = {
  ERROR: chalk.red.bold,
  WARNING: chalk.yellow.bold,
  INFO: chalk.blue.bold
};

// Función principal
async function main() {
  console.log(chalk.cyan.bold('\n🔍 FRONTEND ELITE AUDIT - Detector de Errores\n'));
  
  // Instalación de dependencias si no existen
  await ensureDependencies();
  
  // Obtener directorio a analizar
  const targetDir = process.argv[2] || '.';
  
  const spinner = ora('Analizando estructura de proyecto...').start();
  
  // Analizar estructura de archivos
  await analyzeDirectory(targetDir);
  
  spinner.succeed(chalk.green('Análisis completo'));
  
  // Mostrar resultados
  displayResults();
  
  // Ejecutar herramientas complementarias
  await runAdditionalTools(targetDir);
  
  // Sugerencias finales
  displaySuggestions();
}

// Asegurarse de que las dependencias necesarias estén instaladas
async function ensureDependencies() {
  const requiredPackages = ['chalk', 'ora'];
  for (const pkg of requiredPackages) {
    try {
      require.resolve(pkg);
    } catch (e) {
      const spinner = ora(`Instalando dependencia: ${pkg}...`).start();
      try {
        execSync(`npm install ${pkg} --no-save`, { stdio: 'ignore' });
        spinner.succeed(`Dependencia ${pkg} instalada`);
      } catch (error) {
        spinner.fail(`No se pudo instalar ${pkg}. Intente ejecutar: npm install ${pkg}`);
        process.exit(1);
      }
    }
  }
}

// Analizar un directorio recursivamente
async function analyzeDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      // Saltar directorios excluidos
      if (stats.isDirectory()) {
        if (!CONFIG.excludeDirs.includes(item)) {
          await analyzeDirectory(itemPath);
        }
        continue;
      }
      
      // Analizar solo archivos con extensiones especificadas
      const ext = path.extname(itemPath).toLowerCase();
      if (CONFIG.extensions.includes(ext)) {
        await analyzeFile(itemPath, ext);
      }
    }
  } catch (error) {
    console.error(`Error al analizar el directorio ${dirPath}:`, error);
  }
}

// Analizar un archivo
async function analyzeFile(filePath, extension) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    results.files++;
    
    // Determinar qué patrones aplicar según la extensión
    const patternsToCheck = getPatternsForExtension(extension);
    
    // Verificar cada patrón
    for (const category in patternsToCheck) {
      for (const checkName in patternsToCheck[category]) {
        const check = patternsToCheck[category][checkName];
        const { pattern, severity, message, customCheck } = check;
        
        let matches;
        if (pattern instanceof RegExp) {
          pattern.lastIndex = 0; // Reset regex state
          while ((matches = pattern.exec(content)) !== null) {
            // Si hay una verificación personalizada, aplicarla
            if (customCheck && !customCheck(content, matches)) {
              continue;
            }
            
            // Obtener contexto (línea donde se encontró el problema)
            const lines = content.substring(0, matches.index).split('\n');
            const lineNumber = lines.length;
            const line = content.split('\n')[lineNumber - 1].trim();
            
            // Guardar el problema
            results.issues.push({
              file: filePath,
              line: lineNumber,
              category,
              check: checkName,
              severity,
              message,
              context: line
            });
            
            // Actualizar contadores
            if (severity === 'ERROR') results.errors++;
            if (severity === 'WARNING') results.warnings++;
            if (severity === 'INFO') results.info++;
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error al analizar el archivo ${filePath}:`, error);
  }
}

// Determinar qué patrones aplicar según la extensión del archivo
function getPatternsForExtension(extension) {
  const patterns = {};
  
  // Patrones básicos que se aplican a todas las extensiones
  patterns.javascript = CONFIG.patterns.javascript;
  
  switch (extension) {
    case '.js':
    case '.jsx':
      patterns.react = CONFIG.patterns.react;
      patterns.html = CONFIG.patterns.html;
      patterns.accessibility = CONFIG.patterns.accessibility;
      patterns.performance = CONFIG.patterns.performance;
      break;
    case '.ts':
    case '.tsx':
      patterns.react = CONFIG.patterns.react;
      patterns.html = CONFIG.patterns.html;
      patterns.typescript = CONFIG.patterns.typescript;
      patterns.accessibility = CONFIG.patterns.accessibility;
      patterns.performance = CONFIG.patterns.performance;
      break;
    case '.html':
      patterns.html = CONFIG.patterns.html;
      patterns.accessibility = CONFIG.patterns.accessibility;
      patterns.performance = CONFIG.patterns.performance;
      break;
    case '.css':
    case '.scss':
    case '.sass':
      patterns.css = CONFIG.patterns.css;
      break;
  }
  
  return patterns;
}

// Mostrar resultados
function displayResults() {
  console.log('\n' + chalk.cyan.bold('📊 RESULTADOS DEL ANÁLISIS'));
  console.log(chalk.cyan('========================================='));
  console.log(`📁 Archivos analizados: ${chalk.bold(results.files)}`);
  console.log(`❌ Errores encontrados: ${severityColors.ERROR(results.errors)}`);
  console.log(`⚠️ Advertencias encontradas: ${severityColors.WARNING(results.warnings)}`);
  console.log(`ℹ️ Información: ${severityColors.INFO(results.info)}`);
  console.log(chalk.cyan('=========================================\n'));
  
  // Agrupar por categoría
  const issuesByCategory = {};
  results.issues.forEach(issue => {
    if (!issuesByCategory[issue.category]) {
      issuesByCategory[issue.category] = [];
    }
    issuesByCategory[issue.category].push(issue);
  });
  
  // Mostrar problemas por categoría
  for (const category in issuesByCategory) {
    console.log(chalk.cyan.bold(`\n📌 ${category.toUpperCase()}`));
    
    // Agrupar por severidad dentro de cada categoría
    const bySeverity = {
      ERROR: issuesByCategory[category].filter(i => i.severity === 'ERROR'),
      WARNING: issuesByCategory[category].filter(i => i.severity === 'WARNING'),
      INFO: issuesByCategory[category].filter(i => i.severity === 'INFO')
    };
    
    // Mostrar primero errores, luego advertencias, finalmente información
    ['ERROR', 'WARNING', 'INFO'].forEach(severity => {
      if (bySeverity[severity].length > 0) {
        bySeverity[severity].forEach(issue => {
          console.log(`  ${severityColors[severity](severity)} ${issue.file}:${issue.line}`);
          console.log(`     → ${issue.message}`);
          console.log(`     ${chalk.dim.italic(trimContext(issue.context, 100))}`);
        });
      }
    });
  }
}

// Recortar el contexto para mostrar
function trimContext(context, maxLength = 100) {
  if (context.length <= maxLength) return context;
  return context.substring(0, maxLength - 3) + '...';
}

// Ejecutar herramientas complementarias
async function runAdditionalTools(targetDir) {
  console.log(chalk.cyan.bold('\n🔧 HERRAMIENTAS COMPLEMENTARIAS'));
  
  // Verificar package.json
  await checkPackageJson(targetDir);
  
  // Verificar configuración de linters
  await checkLinters(targetDir);
  
  // Análisis de dependencias
  await analyzeDependencies(targetDir);
}

// Verificar package.json
async function checkPackageJson(targetDir) {
  const packagePath = path.join(targetDir, 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    console.log(`  ${chalk.yellow('⚠️')} No se encontró package.json`);
    return;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Verificar scripts de desarrollo
    if (!packageJson.scripts || !packageJson.scripts.test) {
      console.log(`  ${chalk.yellow('⚠️')} No hay script de pruebas configurado`);
    }
    
    if (!packageJson.scripts || !packageJson.scripts.lint) {
      console.log(`  ${chalk.yellow('⚠️')} No hay script de linting configurado`);
    }
    
    // Verificar dependencias importantes
    const devDeps = packageJson.devDependencies || {};
    const deps = packageJson.dependencies || {};
    const allDeps = { ...devDeps, ...deps };
    
    if (!allDeps['eslint']) {
      console.log(`  ${chalk.yellow('⚠️')} ESLint no está configurado`);
    }
    
    if (!allDeps['prettier']) {
      console.log(`  ${chalk.yellow('⚠️')} Prettier no está configurado`);
    }
    
    if (!allDeps['jest'] && !allDeps['vitest'] && !allDeps['@testing-library/react']) {
      console.log(`  ${chalk.yellow('⚠️')} No se encontraron herramientas para testing`);
    }
  } catch (error) {
    console.error(`Error al analizar package.json:`, error);
  }
}

// Verificar configuración de linters
async function checkLinters(targetDir) {
  const eslintPath = path.join(targetDir, '.eslintrc');
  const eslintJsonPath = path.join(targetDir, '.eslintrc.json');
  const eslintJsPath = path.join(targetDir, '.eslintrc.js');
  
  const hasEslint = fs.existsSync(eslintPath) || fs.existsSync(eslintJsonPath) || fs.existsSync(eslintJsPath);
  
  if (!hasEslint) {
    console.log(`  ${chalk.yellow('⚠️')} No se encontró configuración de ESLint`);
  }
  
  const prettierPath = path.join(targetDir, '.prettierrc');
  const prettierJsonPath = path.join(targetDir, '.prettierrc.json');
  const prettierJsPath = path.join(targetDir, '.prettierrc.js');
  
  const hasPrettier = fs.existsSync(prettierPath) || fs.existsSync(prettierJsonPath) || fs.existsSync(prettierJsPath);
  
  if (!hasPrettier) {
    console.log(`  ${chalk.yellow('⚠️')} No se encontró configuración de Prettier`);
  }
}

// Analizar dependencias
async function analyzeDependencies(targetDir) {
  const packagePath = path.join(targetDir, 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    return;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    
    // Verificar versiones de React
    if (dependencies.react) {
      const version = dependencies.react.replace(/[\^~]/g, '');
      if (version.startsWith('16') || version.startsWith('15')) {
        console.log(`  ${chalk.yellow('⚠️')} Versión antigua de React (${version}). Considere actualizar a 18.x o superior`);
      }
    }
    
    // Verificar dependencias obsoletas o problemas conocidos
    const problematicDeps = {
      'react-redux': (v) => v.startsWith('7.') ? 'Considere @reduxjs/toolkit para mejor experiencia' : null,
      'moment': () => 'date-fns o luxon son alternativas más ligeras y modernas',
      'jquery': () => 'Evite usar jQuery con React, utilice manipulación directa del DOM o useRef'
    };
    
    for (const [dep, checkFunc] of Object.entries(problematicDeps)) {
      if (dependencies[dep]) {
        const version = dependencies[dep].replace(/[\^~]/g, '');
        const message = checkFunc(version);
        if (message) {
          console.log(`  ${chalk.yellow('⚠️')} Dependencia potencialmente problemática: ${dep}. ${message}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error al analizar dependencias:`, error);
  }
}

// Mostrar sugerencias finales
function displaySuggestions() {
  console.log(chalk.cyan.bold('\n💡 SUGERENCIAS PARA MEJORAR EL CÓDIGO'));
  
  const suggestions = [
    'Implementa lazy loading para componentes de React con React.lazy() y Suspense',
    'Utiliza React.memo() para componentes puros que renderizan frecuentemente',
    'Considera Custom Hooks para lógica reutilizable',
    'Implementa estrategias de testing: unit, integration y e2e',
    'Revisa la accesibilidad con herramientas como axe o lighthouse',
    'Optimiza imágenes y recursos estáticos',
    'Configura Code Splitting para mejorar tiempos de carga iniciales',
    'Implementa un Design System para asegurar consistencia en la UI'
  ];
  
  // Mostrar sugerencias según los problemas encontrados
  const categoryCount = {};
  results.issues.forEach(issue => {
    if (!categoryCount[issue.category]) {
      categoryCount[issue.category] = 0;
    }
    categoryCount[issue.category]++;
  });
  
  // Sugerencias específicas según categorías con más problemas
  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0]);
  
  const specificSuggestions = {
    react: [
      'Implementa lazy loading y Code Splitting para mejorar la carga inicial',
      'Utiliza React.memo(), useMemo() y useCallback() para optimizar re-renders',
      'Considera una estrategia de state management apropiada (Context API, Redux, Zustand, Jotai)'
    ],
    html: [
      'Asegura el uso de elementos semánticos para mejorar SEO y accesibilidad',
      'Revisa la estructura de encabezados (h1-h6) para crear una jerarquía correcta',
      'Implementa landmarks (main, nav, aside) para mejorar la navegación por lectores de pantalla'
    ],
    javascript: [
      'Considera TypeScript para mejor detección de errores en tiempo de compilación',
      'Implementa un esquema consistente de manejo de errores',
      'Usa patrones de diseño como Builder, Factory o Command para problemas complejos'
    ],
    css: [
      'Implementa una metodología CSS como BEM o ITCSS',
      'Considera CSS-in-JS o CSS Modules para evitar colisiones de nombres',
      'Optimiza el Critical CSS Path para mejorar First Contentful Paint'
    ],
    performance: [
      'Implementa estrategias de caché para assets y API responses',
      'Optimiza Largest Contentful Paint (LCP) mejorando el tiempo de carga de imágenes principales',
      'Minimiza JavaScript y CSS, considera tree-shaking en tu bundler'
    ],
    accessibility: [
      'Revisa todos los componentes interactivos para navegación por teclado',
      'Implementa una estrategia de gestión de focus para modales y dialogs',
      'Asegura suficiente contraste de color (AA o AAA)'
    ]
  };
  
  // Mostrar sugerencias generales
  console.log(chalk.cyan('Sugerencias generales:'));
  suggestions.forEach(sugg => console.log(`  • ${sugg}`));
  
  // Mostrar sugerencias específicas para top categorías con problemas
  console.log(chalk.cyan('\nSugerencias específicas basadas en problemas detectados:'));
  topCategories.forEach(category => {
    if (specificSuggestions[category]) {
      console.log(chalk.bold(`  ${category.toUpperCase()}:`));
      specificSuggestions[category].forEach(sugg => console.log(`    • ${sugg}`));
    }
  });
  
  console.log(chalk.green.bold('\n✨ ¡Análisis completado! Mejora continua es clave para un código frontend de calidad.\n'));
}

// Ejecutar programa principal
main().catch(error => {
  console.error('Error durante el análisis:', error);
  process.exit(1);
});
