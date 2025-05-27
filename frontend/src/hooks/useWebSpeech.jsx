// frontend/src/hooks/useWebSpeech.jsx
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * @typedef {Object} SpeechRecognitionErrorPayload
 * @property {string} error - El tipo de error (e.g., 'no-speech', 'audio-capture', 'not-allowed', 'network', 'not-supported', 'start-failed').
 * @property {string} message - Un mensaje descriptivo del error.
 */

/**
 * @typedef {Object} UseWebSpeechReturn
 * @property {string} transcript - El texto final transcrito del último fragmento de habla. Es importante resetearlo o manejarlo adecuadamente en el componente consumidor entre diferentes sesiones de escucha.
 * @property {string} interimTranscript - El texto transcrito provisional mientras el usuario habla.
 * @property {boolean} isListening - Indica si el micrófono está activo y escuchando.
 * @property {() => Promise<void>} startListening - Función para solicitar permiso al micrófono e iniciar el reconocimiento de voz.
 * @property {() => void} stopListening - Función para detener manualmente el reconocimiento de voz.
 * @property {SpeechRecognitionErrorPayload | null} speechError - Objeto de error si ocurre algún problema durante el reconocimiento. El componente que utiliza este hook debe monitorizar este estado y reaccionar apropiadamente (e.g., mostrando un mensaje al usuario).
 * @property {(payload: { text: string; lang?: string; voice?: SpeechSynthesisVoice; pitch?: number; rate?: number; volume?: number; onEnd?: () => void }) => void} speak - Función para reproducir texto como voz.
 * @property {boolean} isSpeaking - Indica si el sintetizador está actualmente hablando.
 * @property {() => void} cancelSpeech - Función para detener la reproducción de voz actual.
 * @property {SpeechSynthesisVoice[]} supportedVoices - Array con las voces de síntesis disponibles. Puede estar vacío inicialmente y poblarse después de un breve instante.
 * @property {boolean} browserSupportsSpeechRecognition - Indica si el navegador soporta la API SpeechRecognition.
 * @property {boolean} browserSupportsSpeechSynthesis - Indica si el navegador soporta la API SpeechSynthesis.
 * @property {string | null} permissionStatus - Estado del permiso del micrófono ('granted', 'denied', 'prompt', o null si aún no se ha solicitado o no se pudo consultar).
 * @property {(lang: string) => void} setRecognitionLanguage - Función para establecer el idioma del reconocimiento de voz.
 * @property {(voice: SpeechSynthesisVoice) => void} setSynthesisVoice - Función para establecer la voz de síntesis.
 */

/**
 * Hook personalizado `useWebSpeech` para encapsular la Web Speech API (SpeechRecognition y SpeechSynthesis).
 * Proporciona funcionalidades para el reconocimiento de voz (voz a texto) y síntesis de voz (texto a voz).
 * Es crucial que el componente que utiliza este hook maneje el estado `speechError` para informar al usuario sobre problemas.
 *
 * @returns {UseWebSpeechReturn} Un objeto con estados y funciones para interactuar con la Web Speech API.
 */
const useWebSpeech = () => {
  // --- Estados para SpeechRecognition (Voz a Texto) ---
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null); // 'granted', 'denied', 'prompt'
  const [recognitionLanguage, setRecognitionLanguage] = useState('es-MX'); // Idioma por defecto

  // Referencia para la instancia de SpeechRecognition
  const recognitionRef = useRef(null);

  // --- Estados para SpeechSynthesis (Texto a Voz) ---
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supportedVoices, setSupportedVoices] = useState([]);
  const [synthesisVoice, setSynthesisVoice] = useState(null); // Voz por defecto
  const utteranceRef = useRef(null);

  // --- Detección de soporte de API del navegador ---
  const browserSupportsSpeechRecognition =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  const browserSupportsSpeechSynthesis =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  // --- Lógica de SpeechRecognition ---

  /**
   * Inicializa la instancia de SpeechRecognition.
   * Se llama internamente. Define los manejadores de eventos para el ciclo de vida del reconocimiento.
   */
  const initializeRecognition = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      console.warn(
        'Web Speech API (SpeechRecognition) no es soportada por este navegador.'
      );
      setSpeechError({
        error: 'not-supported',
        message: 'El reconocimiento de voz no es soportado por este navegador.',
      });
      return null;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = false; // Ideal para interacciones de pregunta-respuesta.
    recognition.interimResults = true; // Permite obtener resultados provisionales.
    recognition.lang = recognitionLanguage; // Usar el estado de idioma

    // Evento: Inicio del reconocimiento.
    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
      setTranscript('');
      setInterimTranscript('');
    };

    // Evento: Resultado del reconocimiento.
    recognition.onresult = (event) => {
      let finalTranscriptFromResult = '';
      let currentInterimFromResult = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptFromResult += event.results[i][0].transcript;
        } else {
          currentInterimFromResult += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscriptFromResult);
      setInterimTranscript(currentInterimFromResult);
    };

    // Evento: Error en el reconocimiento.
    recognition.onerror = (event) => {
      console.error('SpeechRecognition error:', event); // Estandarizado
      setSpeechError({
        error: event.error,
        message: event.message || 'Ocurrió un error durante el reconocimiento de voz.',
      });
      setIsListening(false);
    };

    // Evento: Fin del reconocimiento (automático o por stop()).
    recognition.onend = () => {
      setIsListening(false);
      // Implementar reconexión automática si es necesario
      if (!speechError || speechError.error !== 'aborted') {
        console.warn('Reconexión automática activada.');
        startListening(recognitionLanguage);
      }
    };
    return recognition;
  }, [browserSupportsSpeechRecognition, recognitionLanguage]);

  /**
   * Solicita permiso para el micrófono (si es necesario) e inicia el reconocimiento de voz.
   * @param {string} [lang='es-MX'] - Código de idioma BCP 47 para el reconocimiento (e.g., 'en-US', 'es-ES').
   */
  const startListening = useCallback(async (lang = recognitionLanguage) => {
    if (isListening) {
      console.warn('El reconocimiento de voz ya está activo.');
      return;
    }

    if (!browserSupportsSpeechRecognition) {
      setSpeechError({
        error: 'not-supported',
        message: 'El reconocimiento de voz no es soportado por este navegador.',
      });
      return;
    }

    // Verificar y solicitar permiso del micrófono.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop()); // Detener el stream, solo era para el permiso.
      setPermissionStatus('granted');
    } catch (err) {
      console.error('Error al solicitar permiso del micrófono:', err); // Estandarizado
      const errorMessage = err.name === 'NotAllowedError' ?
        'Permiso del micrófono denegado por el usuario.' :
        'No se pudo acceder al micrófono.';
      setSpeechError({
        error: 'not-allowed',
        message: errorMessage,
      });
      setPermissionStatus('denied');
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition();
    }

    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
      try {
        setTranscript('');
        setInterimTranscript('');
        setSpeechError(null);
        recognitionRef.current.start();
      } catch (e) {
        console.error('Error al intentar iniciar SpeechRecognition:', e); // Estandarizado
        setSpeechError({
          error: 'start-failed',
          message: 'No se pudo iniciar el reconocimiento de voz.',
        });
        setIsListening(false);
      }
    }
  }, [isListening, browserSupportsSpeechRecognition, initializeRecognition, recognitionLanguage]);

  /**
   * Detiene manualmente el reconocimiento de voz en curso.
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // --- Lógica de SpeechSynthesis ---

  /**
   * Carga y actualiza la lista de voces de síntesis disponibles en el navegador.
   */
  const loadVoices = useCallback(() => {
    if (browserSupportsSpeechSynthesis) {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setSupportedVoices(voices);
      }
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          setSupportedVoices(window.speechSynthesis.getVoices());
        };
      }
    }
  }, [browserSupportsSpeechSynthesis]);

  useEffect(() => {
    loadVoices();
    return () => {
      if (browserSupportsSpeechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [loadVoices, browserSupportsSpeechSynthesis]);

  /**
   * Reproduce un texto como voz utilizando la API SpeechSynthesis.
   * @param {object} payload - Objeto de configuración para la síntesis.
   * @param {string} payload.text - El texto a reproducir.
   * @param {string} [payload.lang='es-MX'] - Código de idioma BCP 47 (e.g., 'en-US', 'es-ES').
   * @param {SpeechSynthesisVoice} [payload.voice] - Objeto SpeechSynthesisVoice específico a usar.
   * @param {number} [payload.pitch=1] - Tono de la voz (0 a 2).
   * @param {number} [payload.rate=1] - Velocidad de la voz (0.1 a 10).
   * @param {number} [payload.volume=1] - Volumen de la voz (0 a 1).
   * @param {() => void} [payload.onEnd] - Callback que se ejecuta cuando la síntesis termina.
   */
  const speak = useCallback(
    ({
      text,
      lang = 'es-MX',
      voice = synthesisVoice,
      pitch = 1,
      rate = 1,
      volume = 1,
      onEnd,
    }) => {
      if (!browserSupportsSpeechSynthesis) {
        console.warn(
          'Web Speech API (SpeechSynthesis) no es soportada por este navegador.'
        );
        return;
      }
      if (isSpeaking) {
        console.warn(
          'SpeechSynthesis ya está hablando. La nueva solicitud será ignorada o puedes optar por cancelarla.'
        );
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      utterance.lang = lang;
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = volume;

      if (voice) {
        utterance.voice = voice;
      } else if (supportedVoices.length > 0) {
        let foundVoice = supportedVoices.find(v => v.lang === lang && v.localService);
        if (!foundVoice) foundVoice = supportedVoices.find(v => v.lang === lang);
        if (!foundVoice) foundVoice = supportedVoices.find(v => v.lang.startsWith(lang.substring(0, 2)) && v.default);
        if (!foundVoice) foundVoice = supportedVoices.find(v => v.lang.startsWith(lang.substring(0, 2)) && v.localService);
        if (!foundVoice) foundVoice = supportedVoices.find(v => v.lang.startsWith(lang.substring(0, 2)));

        if (foundVoice) {
          utterance.voice = foundVoice;
        } else {
          console.warn(`No se encontró una voz para el idioma ${lang}. Se usará la voz por defecto del navegador.`);
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd && typeof onEnd === 'function') {
          onEnd();
        }
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error('SpeechSynthesis error:', event); // Estandarizado
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      window.speechSynthesis.speak(utterance);
    },
    [browserSupportsSpeechSynthesis, supportedVoices, isSpeaking, synthesisVoice]
  );

  /**
   * Cancela la reproducción de voz (síntesis) que esté actualmente en curso.
   */
  const cancelSpeech = useCallback(() => {
    if (browserSupportsSpeechSynthesis && isSpeaking) {
      window.speechSynthesis.cancel();
    }
  }, [browserSupportsSpeechSynthesis, isSpeaking]);

  // --- Efecto de limpieza general del Hook ---
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        if (isListening) {
          recognitionRef.current.abort();
        }
        recognitionRef.current = null;
      }

      if (browserSupportsSpeechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (utteranceRef.current) {
        utteranceRef.current.onstart = null;
        utteranceRef.current.onend = null;
        utteranceRef.current.onerror = null;
        utteranceRef.current = null;
      }
    };
  }, [isListening, browserSupportsSpeechSynthesis]);

  // --- Comprobación inicial y monitoreo de permisos del micrófono ---
  useEffect(() => {
    if (navigator.permissions && typeof navigator.permissions.query === 'function') {
      navigator.permissions.query({ name: 'microphone' })
        .then((permissionState) => {
          setPermissionStatus(permissionState.state);
          permissionState.onchange = () => {
            setPermissionStatus(permissionState.state);
          };
        })
        .catch((err) => {
          console.warn('No se pudo consultar el estado del permiso del micrófono:', err); // Estandarizado
        });
    } else {
        console.warn('La API de consulta de permisos (navigator.permissions.query) no está disponible en este navegador.');
    }
  }, []);

  return {
    // SpeechRecognition
    transcript,
    interimTranscript,
    isListening,
    startListening,
    stopListening,
    speechError,
    permissionStatus,
    browserSupportsSpeechRecognition,
    setRecognitionLanguage,

    // SpeechSynthesis
    speak,
    isSpeaking,
    cancelSpeech,
    supportedVoices,
    browserSupportsSpeechSynthesis,
    setSynthesisVoice,
  };
};

export default useWebSpeech;