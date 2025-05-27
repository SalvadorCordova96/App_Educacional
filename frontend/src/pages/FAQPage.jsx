function FAQPage() {
  const faqs = [
    { pregunta: '¿Cómo me registro en la plataforma?', respuesta: 'Haz clic en “Registrarse” y completa el formulario con tus datos.' },
    { pregunta: '¿Cómo recupero mi contraseña?', respuesta: 'Haz clic en “¿Olvidaste tu contraseña?” en la página de inicio de sesión y sigue las instrucciones.' },
    { pregunta: '¿Dónde encuentro los recursos de mis cursos?', respuesta: 'En la sección “Recursos y Materiales” dentro de tu panel principal.' },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-full max-w-2xl p-8 bg-black shadow-2xl bg-opacity-70 rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-400">Preguntas Frecuentes (FAQ)</h2>
        <div className="flex flex-col gap-4 text-left">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-lg shadow-md bg-blue-950 bg-opacity-80">
              <div className="mb-1 text-lg font-semibold text-white">{faq.pregunta}</div>
              <div className="text-blue-300">{faq.respuesta}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQPage;