// frontend/src/components/layout/Footer.jsx

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600 mt-auto">
      © {year} CogniSpark. Todos los derechos reservados. | Hecho con IA para la Educación.
    </footer>
  );
}

export default Footer;