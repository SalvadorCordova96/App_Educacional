// frontend/src/components/layout/SineWaveDisplay.jsx
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useWaveAnimation } from '../../hooks/useWaveAnimation';

/**
 * @file SineWaveDisplay.jsx
 * @description Componente React para renderizar una animación de onda sinusoidal
 * dinámica utilizando HTML Canvas API. La animación y apariencia
 * de la onda cambian en respuesta a las props recibidas, indicando
 * diferentes estados de una IA (inactiva, escuchando, hablando).
 */

/**
 * SineWaveDisplay Component
 *
 * Renderiza una o varias ondas sinusoidales animadas en un elemento <canvas>.
 * La animación se ajusta dinámicamente según las props `isListening`, `isSpeaking`,
 * y `amplitudeMultiplier` para reflejar el estado de una IA.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {boolean} [props.isListening=false] - Indica si la IA está "escuchando". Aumenta la actividad de la onda.
 * @param {boolean} [props.isSpeaking=false] - Indica si la IA está "hablando". Modifica la onda a un patrón más dinámico y rítmico.
 * @param {number} [props.amplitudeMultiplier=1] - Multiplicador para la amplitud base de la onda. Permite un control general de la "altura".
 * @param {string} [props.className] - Clases CSS adicionales para el contenedor del canvas (p.ej. para márgenes, posicionamiento).
 * @param {number} [props.width=600] - Ancho del canvas en píxeles lógicos.
 * @param {number} [props.height=150] - Alto del canvas en píxeles lógicos.
 * @param {string} [props.waveColor='rgba(139, 92, 246, 0.7)'] - Color base de la onda. Por defecto: un violeta (equivalente a Tailwind's purple-500 con opacidad).
 * @param {string} [props.listeningColor='rgba(59, 130, 246, 0.8)'] - Color de la onda cuando escucha. Por defecto: un azul (equivalente a Tailwind's blue-500 con opacidad).
 * @param {string} [props.speakingColor='rgba(236, 72, 153, 0.8)'] - Color de la onda cuando habla. Por defecto: un rosa (equivalente a Tailwind's pink-500 con opacidad).
 * @param {string} [props.ariaLabel] - Etiqueta opcional para accesibilidad del canvas.
 * @param {boolean} [props.showState=true] - Muestra el estado actual de la IA (escuchando/hablando) en el aria-live.
 */
const SineWaveDisplay = ({
  isListening = false,
  isSpeaking = false,
  amplitudeMultiplier = 1,
  className = '',
  width = 600,
  height = 150,
  waveColor = 'rgba(139, 92, 246, 0.7)',
  listeningColor = 'rgba(59, 130, 246, 0.8)',
  speakingColor = 'rgba(236, 72, 153, 0.8)',
  ariaLabel = '',
  showState = true,
}) => {
  const canvasRef = useRef(null);

  useWaveAnimation({
    canvasRef,
    isListening,
    isSpeaking,
    amplitudeMultiplier,
    width,
    height,
    waveColor,
    listeningColor,
    speakingColor,
  });

  const getStateLabel = () => {
    if (isListening) return 'La IA está escuchando';
    if (isSpeaking) return 'La IA está hablando';
    return 'La IA está inactiva';
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="sine-wave-canvas"
        aria-hidden={!ariaLabel}
        aria-label={ariaLabel}
        role="img"
        aria-roledescription="indicador de estado de IA"
      />
      {showState && (
        <div
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        >
          {getStateLabel()}
        </div>
      )}
    </div>
  );
};

SineWaveDisplay.propTypes = {
  isListening: PropTypes.bool,
  isSpeaking: PropTypes.bool,
  amplitudeMultiplier: PropTypes.number,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  waveColor: PropTypes.string,
  listeningColor: PropTypes.string,
  speakingColor: PropTypes.string,
  ariaLabel: PropTypes.string,
  showState: PropTypes.bool,
};

export default SineWaveDisplay;