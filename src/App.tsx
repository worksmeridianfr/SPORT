import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  ShoppingBag, 
  Play, 
  Check,
  Timer,
  TrendingUp,
  Activity,
  Battery,
  BatteryMedium,
  BatteryFull,
  ShoppingBasket,
  Shirt,
  Plane,
  Pizza
} from 'lucide-react';

// --- TYPES ---
type Tab = 'workout' | 'shop';

interface Exercise {
  id: string;
  name: string;
  mpReward: number;
  completed: boolean;
  duration?: number;
  weight?: number;
  feeling?: string;
}

interface ShopItem {
  id: string;
  name: string;
  cost: number;
  icon: React.ReactNode;
}

// --- CONSTANTS ---
// Total MP available = 13 000 MP.
const INITIAL_EXERCISES: Exercise[] = [
  { id: '1', name: 'Presse à cuisses (Machine)', mpReward: 2600, completed: false },
  { id: '2', name: 'Tirage vertical', mpReward: 2600, completed: false },
  { id: '3', name: 'Peck Deck (Machine)', mpReward: 2600, completed: false },
  { id: '4', name: 'Leg Extension', mpReward: 2600, completed: false },
  { id: '5', name: 'Tirage horizontal (Poulie)', mpReward: 2600, completed: false },
];

const SHOP_ITEMS: ShopItem[] = [
  { id: 's1', name: 'Commande Shein', cost: 2000, icon: <ShoppingBasket size={24} /> },
  { id: 's2', name: 'Maillot de Foot + Baskets', cost: 3500, icon: <Shirt size={24} /> },
  { id: 's3', name: 'Journée à Paris', cost: 5000, icon: <Plane size={24} /> },
  { id: 's4', name: 'Menu Snack 1', cost: 500, icon: <Pizza size={24} /> },
  { id: 's5', name: 'Menu Snack 2', cost: 500, icon: <Pizza size={24} /> },
  { id: 's6', name: 'Menu Snack 3', cost: 500, icon: <Pizza size={24} /> },
  { id: 's7', name: 'Menu Snack 4', cost: 500, icon: <Pizza size={24} /> },
  { id: 's8', name: 'Menu Snack 5', cost: 500, icon: <Pizza size={24} /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('workout');
  const [mp, setMp] = useState<number>(0);
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  
  // Active Exercise State
  const [activeEx, setActiveEx] = useState<Exercise | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  
  // Completion Sheet State
  const [showCompletion, setShowCompletion] = useState<boolean>(false);
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [currentFeeling, setCurrentFeeling] = useState<string>('');

  // Timer Effect
useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartExercise = (ex: Exercise) => {
    setActiveEx(ex);
    setTimer(0);
    setIsTimerRunning(true);
  };

  const handleStopExercise = () => {
    setIsTimerRunning(false);
    setShowCompletion(true);
  };

  const handleValidateExercise = () => {
    if (!activeEx) return;

    setExercises((prev) =>
      prev.map((e) =>
        e.id === activeEx.id
          ? { ...e, completed: true, duration: timer, weight: Number(currentWeight), feeling: currentFeeling }
          : e
      )
    );
    
    // Add reward with a slight visual delay for gamification
    setTimeout(() => {
      setMp((prev) => prev + activeEx.mpReward);
    }, 300);

    // Reset states
    setShowCompletion(false);
    setActiveEx(null);
    setCurrentWeight('');
    setCurrentFeeling('');
  };

  const handleBuy = (cost: number) => {
    if (mp >= cost) {
      setMp((prev) => prev - cost);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans overflow-hidden flex flex-col selection:bg-indigo-500/30">
      
      {/* HEADER */}
      <header className="pt-12 pb-4 px-6 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800/50">
        <h1 className="text-xl font-bold tracking-tight text-white">MERIDIAN</h1>
        <motion.div 
          key={mp}
          initial={{ scale: 1.2, color: '#818cf8' }}
          animate={{ scale: 1, color: '#f8fafc' }}
          className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700/50 shadow-inner"
        >
          <Activity size={18} className="text-indigo-400" />
          <span className="font-semibold">{mp.toLocaleString()} MP</span>
        </motion.div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-6 no-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'workout' ? (
            <motion.div
              key="workout"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4"
            >
              <div className="mb-2">
                <h2 className="text-2xl font-bold mb-1">Programme du jour</h2>
                <p className="text-slate-400 text-sm">Machines uniquement. Focus et intensité.</p>
              </div>

              {exercises.map((ex) => (
                <div 
                  key={ex.id} 
                  className={`p-5 rounded-3xl border transition-all ${
                    ex.completed 
                      ? 'bg-slate-900/40 border-slate-800/50 opacity-60' 
                      : 'bg-slate-900 border-slate-800 shadow-lg shadow-black/20'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">{ex.name}</h3>
                    <div className="flex items-center gap-1 text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full text-xs font-medium">
                      <TrendingUp size={14} />
                      {ex.mpReward} MP
                    </div>
                  </div>

                  {ex.completed ? (
                    <div className="flex items-center justify-between text-sm text-slate-400 bg-slate-950/50 p-3 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Check size={16} className="text-emerald-400" />
                        <span>Validé en {formatTime(ex.duration || 0)}</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="bg-slate-800 px-2 py-1 rounded-lg">{ex.weight} kg</span>
                      </div>
                    </div>
                  ) : activeEx?.id === ex.id ? (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }}
                      className="flex flex-col gap-4 overflow-hidden"
                    >
                      <div className="flex items-center justify-center py-6 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                        <Timer size={24} className="text-indigo-400 mr-3 animate-pulse" />
                        <span className="text-4xl font-light tabular-nums tracking-wider">{formatTime(timer)}</span>
                      </div>
                      <button 
                        onClick={handleStopExercise}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-4 rounded-2xl transition-colors active:scale-[0.98]"
                      >
                        Terminer la série
                      </button>
                    </motion.div>
                  ) : (
                    <button 
                      disabled={!!activeEx}
                      onClick={() => handleStartExercise(ex)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 active:scale-[0.98]"
                    >
                      <Play size={18} />
                      Commencer
                    </button>
                  )}
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="shop"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-4"
            >
              <div className="mb-2">
                <h2 className="text-2xl font-bold mb-1">Boutique</h2>
                <p className="text-slate-400 text-sm">Vos efforts méritent une récompense.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {SHOP_ITEMS.map((item) => {
                  const canAfford = mp >= item.cost;
                  return (
                    <div 
                      key={item.id} 
                      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col items-center text-center gap-3 shadow-lg shadow-black/20"
                    >
                      <div className="h-14 w-14 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mb-2">
                        {item.icon}
                      </div>
                      <h3 className="font-medium text-sm leading-tight h-10 flex items-center">{item.name}</h3>
                      <button 
                        onClick={() => handleBuy(item.cost)}
                        disabled={!canAfford}
                        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                          canAfford 
                            ? 'bg-slate-100 text-slate-900 hover:bg-white shadow-md' 
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {item.cost.toLocaleString()} MP
                      </button>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* BOTTOM NAVIGATION (Instagram style) */}
      <nav className="fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/60 pb-safe pt-2 px-6 pb-6 flex justify-around items-center z-40">
        <button 
          onClick={() => setActiveTab('workout')}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors ${activeTab === 'workout' ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <Dumbbell size={24} strokeWidth={activeTab === 'workout' ? 2.5 : 2} />
          <span className="text-[10px] font-medium tracking-wide">Workout</span>
        </button>
        <button 
          onClick={() => setActiveTab('shop')}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors ${activeTab === 'shop' ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <ShoppingBag size={24} strokeWidth={activeTab === 'shop' ? 2.5 : 2} />
          <span className="text-[10px] font-medium tracking-wide">Boutique</span>
        </button>
      </nav>

      {/* COMPLETION SHEET (Overlay) */}
      <AnimatePresence>
        {showCompletion && activeEx && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowCompletion(false)}
            />
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 rounded-t-[2.5rem] p-6 pb-12 z-50 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6" />
              
              <h3 className="text-xl font-bold text-center mb-6">Bilan de la série</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3 ml-1">Poids utilisé (kg)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      placeholder="Ex: 65"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-medium">KG</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3 ml-1">Ressenti de l'effort</label>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setCurrentFeeling('facile')}
                      className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${currentFeeling === 'facile' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                      <BatteryFull size={24} />
                      <span className="text-xs font-medium">Facile</span>
                    </button>
                    <button 
                      onClick={() => setCurrentFeeling('moyen')}
                      className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${currentFeeling === 'moyen' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                      <BatteryMedium size={24} />
                      <span className="text-xs font-medium">Bon</span>
                    </button>
                    <button 
                      onClick={() => setCurrentFeeling('difficile')}
                      className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${currentFeeling === 'difficile' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                      <Battery size={24} />
                      <span className="text-xs font-medium">Échec</span>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleValidateExercise}
                  disabled={!currentWeight || !currentFeeling}
                  className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg py-5 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:shadow-none active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Valider et encaisser
                  <TrendingUp size={20} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
