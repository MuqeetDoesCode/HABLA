import { Volume2 } from "lucide-react";

const alphabet = [
  { letter: "A", name: "a", ipa: "/a/", example: "Agua", en: "Water" },
  { letter: "B", name: "be", ipa: "/b/", example: "Bueno", en: "Good" },
  { letter: "C", name: "ce", ipa: "/s/ or /k/", example: "Cielo, Casa", en: "Sky, House" },
  { letter: "D", name: "de", ipa: "/d/", example: "Día", en: "Day" },
  { letter: "E", name: "e", ipa: "/e/", example: "Elefante", en: "Elephant" },
  { letter: "F", name: "efe", ipa: "/f/", example: "Fuego", en: "Fire" },
  { letter: "G", name: "ge", ipa: "/x/ or /g/", example: "Gente, Gato", en: "People, Cat" },
  { letter: "H", name: "hache", ipa: "silent", example: "Hola", en: "Hello" },
  { letter: "I", name: "i", ipa: "/i/", example: "Isla", en: "Island" },
  { letter: "J", name: "jota", ipa: "/x/", example: "Juego", en: "Game" },
  { letter: "K", name: "ka", ipa: "/k/", example: "Kilo", en: "Kilo" },
  { letter: "L", name: "ele", ipa: "/l/", example: "Luna", en: "Moon" },
  { letter: "M", name: "eme", ipa: "/m/", example: "Madre", en: "Mother" },
  { letter: "N", name: "ene", ipa: "/n/", example: "Noche", en: "Night" },
  { letter: "Ñ", name: "eñe", ipa: "/ɲ/", example: "Niño", en: "Child" },
  { letter: "O", name: "o", ipa: "/o/", example: "Oso", en: "Bear" },
  { letter: "P", name: "pe", ipa: "/p/", example: "Padre", en: "Father" },
  { letter: "Q", name: "cu", ipa: "/k/", example: "Queso", en: "Cheese" },
  { letter: "R", name: "ere", ipa: "/ɾ/", example: "Rojo", en: "Red" },
  { letter: "S", name: "ese", ipa: "/s/", example: "Sol", en: "Sun" },
  { letter: "T", name: "te", ipa: "/t/", example: "Tiempo", en: "Time" },
  { letter: "U", name: "u", ipa: "/u/", example: "Uvas", en: "Grapes" },
  { letter: "V", name: "uve", ipa: "/b/", example: "Vaca", en: "Cow" },
  { letter: "W", name: "uve doble", ipa: "/w/ or /b/", example: "Wifi", en: "Wifi" },
  { letter: "X", name: "equis", ipa: "/ks/ or /s/", example: "Examen", en: "Exam" },
  { letter: "Y", name: "ye", ipa: "/ʝ/ or /i/", example: "Yo, Rey", en: "I, King" },
  { letter: "Z", name: "zeta", ipa: "/s/ or /θ/", example: "Zapato", en: "Shoe" }
];

export default function Alphabet() {
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FBFBF9]">
      <header className="px-10 py-8 border-b border-[#E5E5E1] bg-white sticky top-0 z-10">
        <h1 className="text-4xl font-black tracking-tight">The Spanish Alphabet</h1>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-2">El abecedario - Master pronunciation fundamentals</p>
      </header>

      <div className="flex-1 p-10 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {alphabet.map(item => (
            <div 
              key={item.letter}
              onClick={() => speak(item.letter)}
              className="bg-white border-2 border-black rounded-[32px] p-6 flex flex-col items-center justify-center text-center hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
            >
              <h2 className="text-7xl font-black text-black mb-2 group-hover:text-[#F97316] transition-colors">{item.letter}</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-black text-[#F97316] uppercase tracking-wider">{item.name}</span>
                <Volume2 className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[10px] font-black text-gray-500 bg-[#F0F0EE] px-3 py-1.5 rounded-lg mb-4">{item.ipa}</p>
              
              <div className="border-t-2 border-[#E5E5E1] w-full pt-4 mt-auto">
                <p className="font-black text-lg text-black">{item.example}</p>
                <p className="text-xs font-bold text-gray-500 mt-1">{item.en}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
