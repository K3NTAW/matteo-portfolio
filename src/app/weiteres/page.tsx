export default function Weiteres() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <section className="relative min-h-screen flex flex-col justify-center items-center px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Content */}
          <div className="text-left max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              Hier finden Sie zusätzliche Informationen über meine Arbeit und Interessen.
            </p>
            
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              Weitere Details zu meinen Projekten, Technologien und Erfahrungen werden hier veröffentlicht.
            </p>
            
            <div className="mt-12 p-8 bg-gray-800 rounded-lg border border-gray-600">
              <h2 className="text-2xl font-bold text-white mb-4">Coming Soon</h2>
              <p className="text-gray-300">
                Weitere Inhalte werden in Kürze hinzugefügt.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 