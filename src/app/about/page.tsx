export default function About() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <section className="relative min-h-screen flex flex-col justify-center items-center px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* About Content */}
          <div className="text-left max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              I am deeply passionate about the crossroads of art and technology, crafting visually stunning interfaces and enhancing the entire digital experience for users.
            </p>
            
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              I hold a Bachelor of Technology in Computer Science from the esteemed Art University and a Master of Fine Arts in Interactive Design. This academic foundation has equipped me with a solid understanding of the principles that underpin effective interaction design, providing me with the knowledge to create designs that seamlessly blend aesthetics and functionality.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 