/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Heart, Zap, Trophy, MapPin, Diamond, Rocket, ArrowUpCircle, Shield, Activity, PlusCircle, Play } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus, RUNNER_COLORS, ShopItem, RUN_SPEED_BASE } from '../../types';
import { audio } from '../System/Audio';

const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'DOUBLE_JUMP',
        name: 'DOUBLE JUMP',
        description: 'Jump again in mid-air. Essential for high obstacles.',
        cost: 1000,
        icon: ArrowUpCircle,
        oneTime: true
    },
    {
        id: 'MAX_LIFE',
        name: 'MAX LIFE UP',
        description: 'Permanently adds a heart slot and heals you.',
        cost: 1500,
        icon: Activity
    },
    {
        id: 'HEAL',
        name: 'REPAIR KIT',
        description: 'Restores 1 Life point instantly.',
        cost: 1000,
        icon: PlusCircle
    },
    {
        id: 'IMMORTAL',
        name: 'IMMORTALITY',
        description: 'Unlock Ability: Press Shift/Enter to be invincible for 5s.',
        cost: 3000,
        icon: Shield,
        oneTime: true
    }
];

const ShopScreen: React.FC = () => {
    const { score, buyItem, closeShop, hasDoubleJump, hasImmortality } = useStore();
    const [items, setItems] = useState<ShopItem[]>([]);

    useEffect(() => {
        let pool = SHOP_ITEMS.filter(item => {
            if (item.id === 'DOUBLE_JUMP' && hasDoubleJump) return false;
            if (item.id === 'IMMORTAL' && hasImmortality) return false;
            return true;
        });

        pool = pool.sort(() => 0.5 - Math.random());
        setItems(pool.slice(0, 3));
    }, [hasDoubleJump, hasImmortality]);

    return (
        <div className="absolute inset-0 bg-black/90 z-[100] text-white pointer-events-auto backdrop-blur-md overflow-y-auto">
             <div className="flex flex-col items-center justify-center min-h-full py-12 px-6">
                 <h2 className="text-4xl lg:text-5xl font-black text-cyan-400 mb-2 font-cyber tracking-widest text-center drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]">UPGRADE BAY</h2>
                 <div className="flex items-center text-yellow-400 mb-8 md:mb-12">
                     <span className="text-lg lg:text-xl mr-3 font-mono">AVAILABLE CREDITS:</span>
                     <span className="text-2xl lg:text-3xl font-bold">{score.toLocaleString()}</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl w-full mb-12">
                     {items.map(item => {
                         const Icon = item.icon;
                         const canAfford = score >= item.cost;
                         return (
                             <div key={item.id} className="bg-gray-900/60 border border-gray-700 p-6 lg:p-8 rounded-2xl flex flex-col items-center text-center hover:border-cyan-500 hover:bg-gray-800/80 transition-all duration-300 transform hover:-translate-y-1">
                                 <div className="bg-cyan-500/10 p-4 rounded-full mb-4 border border-cyan-500/20">
                                     <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-cyan-400" />
                                 </div>
                                 <h3 className="text-xl lg:text-2xl font-bold mb-3">{item.name}</h3>
                                 <p className="text-gray-400 text-sm lg:text-base mb-6 h-12 flex items-center justify-center leading-tight">{item.description}</p>
                                 <button 
                                    onClick={() => buyItem(item.id as any, item.cost)}
                                    disabled={!canAfford}
                                    className={`px-6 py-3 rounded-lg font-bold w-full text-base lg:text-lg transition-all ${canAfford ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-125 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]' : 'bg-gray-700 cursor-not-allowed opacity-50'}`}
                                 >
                                     {item.cost} GEMS
                                 </button>
                             </div>
                         );
                     })}
                 </div>

                 <button 
                    onClick={closeShop}
                    className="group flex items-center px-10 lg:px-14 py-4 lg:py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xl lg:text-2xl rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,0,255,0.3)] hover:shadow-[0_0_40px_rgba(255,0,255,0.5)] active:scale-95"
                 >
                     RESUME MISSION <Play className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="white" />
                 </button>
             </div>
        </div>
    );
};

export const HUD: React.FC = () => {
  const { score, lives, maxLives, collectedLetters, status, level, restartGame, startGame, gemsCollected, distance, isImmortalityActive, speed } = useStore();
  const target = ['R', 'U', 'N', 'N', 'E', 'R'];

  const containerClass = "absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-10 lg:p-14 z-50";

  if (status === GameStatus.SHOP) {
      return <ShopScreen />;
  }

  if (status === GameStatus.MENU) {
      return (
          <div className="absolute inset-0 flex items-center justify-center z-[100] bg-black/80 backdrop-blur-md p-6 pointer-events-auto">
              <div className="relative w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-[0_0_70px_rgba(0,255,255,0.25)] border border-white/10 animate-in zoom-in-95 duration-500">
                <div className="relative w-full bg-slate-950 overflow-hidden">
                     <div className="relative w-full aspect-video lg:aspect-[16/10] bg-[#050011] flex flex-col items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#8800ff_1px,transparent_1px),linear-gradient(to_bottom,#8800ff_1px,transparent_1px)] bg-[size:50px_50px] [transform:perspective(500px)_rotateX(60deg)]"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050011]"></div>
                        
                        <div className="relative z-10 flex flex-col items-center group cursor-default">
                            <div className="text-7xl md:text-8xl lg:text-9xl font-black italic tracking-tighter text-white font-cyber select-none flex items-center transition-transform group-hover:scale-105 duration-500">
                                <span className="drop-shadow-[0_0_20px_rgba(0,255,255,0.8)]">RUN</span>
                                <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(0,255,255,0.8)]">NER</span>
                            </div>
                            <div className="mt-[-15px] lg:mt-[-25px] bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-1.5 lg:px-8 lg:py-2 rounded-sm skew-x-[-12deg] font-black text-2xl lg:text-3xl shadow-[0_0_20px_rgba(255,0,119,0.5)] border border-white/20">
                                V2
                            </div>
                        </div>
                     </div>

                     <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050011] to-transparent"></div>
                     
                     <div className="relative flex flex-col justify-end items-center p-8 lg:p-12 pb-10 lg:pb-14 text-center z-10 bg-[#050011]">
                        <button 
                          onClick={() => { audio.init(); startGame(); }}
                          className="w-full group relative px-8 py-5 lg:py-6 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-xl lg:text-2xl rounded-2xl hover:bg-white/20 transition-all shadow-[0_0_30px_rgba(0,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,255,255,0.4)] hover:border-cyan-400 overflow-hidden active:scale-95"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-pink-500/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <span className="relative z-10 tracking-widest flex items-center justify-center">
                                INITIALIZE RUN <Play className="ml-3 w-6 h-6 lg:w-7 lg:h-7 fill-white" />
                            </span>
                        </button>
                        <p className="text-cyan-400/50 text-xs lg:text-sm font-mono mt-5 tracking-[0.2em] uppercase">
                            [ SPACE / ARROWS / WASD / SWIPE ]
                        </p>
                     </div>
                </div>
              </div>
          </div>
      );
  }

  if (status === GameStatus.GAME_OVER) {
      return (
          <div className="absolute inset-0 bg-black/95 z-[100] text-white pointer-events-auto backdrop-blur-md overflow-y-auto">
              <div className="flex flex-col items-center justify-center min-h-full py-12 px-6">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-10 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)] font-cyber text-center uppercase tracking-widest animate-pulse">GAME OVER</h1>
                <div className="grid grid-cols-1 gap-4 lg:gap-6 text-center mb-12 w-full max-w-2xl">
                    <div className="bg-gray-900/60 p-5 lg:p-6 rounded-2xl border border-gray-700 flex items-center justify-between group hover:border-yellow-500 transition-colors">
                        <div className="flex items-center text-yellow-400 text-lg lg:text-xl font-mono uppercase tracking-wider"><Trophy className="mr-3 w-6 h-6"/> LEVEL REACHED</div>
                        <div className="text-2xl lg:text-4xl font-bold font-cyber text-yellow-500">{level} / 3</div>
                    </div>
                    <div className="bg-gray-900/60 p-5 lg:p-6 rounded-2xl border border-gray-700 flex items-center justify-between group hover:border-cyan-500 transition-colors">
                        <div className="flex items-center text-cyan-400 text-lg lg:text-xl font-mono uppercase tracking-wider"><Diamond className="mr-3 w-6 h-6"/> BLUE CRYSTALS</div>
                        <div className="text-2xl lg:text-4xl font-bold font-cyber text-cyan-400">{gemsCollected}</div>
                    </div>
                    <div className="bg-gray-900/60 p-5 lg:p-6 rounded-2xl border border-gray-700 flex items-center justify-between group hover:border-purple-500 transition-colors">
                        <div className="flex items-center text-purple-400 text-lg lg:text-xl font-mono uppercase tracking-wider"><MapPin className="mr-3 w-6 h-6"/> RANGE</div>
                        <div className="text-2xl lg:text-4xl font-bold font-cyber text-purple-400">{Math.floor(distance)} LY</div>
                    </div>
                     <div className="bg-white/5 p-6 lg:p-8 rounded-2xl flex items-center justify-between mt-4 border border-white/10">
                        <div className="flex items-center text-white/80 text-xl lg:text-2xl font-cyber uppercase tracking-widest">TOTAL SCORE</div>
                        <div className="text-4xl lg:text-6xl font-black font-cyber text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 drop-shadow-[0_0_15px_rgba(255,165,0,0.4)]">{score.toLocaleString()}</div>
                    </div>
                </div>
                <button 
                  onClick={() => { audio.init(); restartGame(); }}
                  className="px-12 lg:px-16 py-5 lg:py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xl lg:text-2xl rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:shadow-[0_0_50px_rgba(0,255,255,0.6)] active:scale-95 uppercase tracking-widest"
                >
                    TRY AGAIN
                </button>
              </div>
          </div>
      );
  }

  if (status === GameStatus.VICTORY) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 to-black/95 z-[100] text-white pointer-events-auto backdrop-blur-xl overflow-y-auto">
            <div className="flex flex-col items-center justify-center min-h-full py-12 px-6">
                <Rocket className="w-20 h-20 lg:w-32 lg:h-32 text-yellow-400 mb-6 animate-bounce drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]" />
                <h1 className="text-4xl md:text-7xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-500 to-pink-500 mb-4 drop-shadow-[0_0_30px_rgba(255,165,0,0.5)] font-cyber text-center leading-tight tracking-tighter uppercase">
                    MISSION ACCOMPLISHED
                </h1>
                <p className="text-cyan-300 text-lg md:text-3xl font-mono mb-12 tracking-[0.5em] text-center uppercase font-bold drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                    Champion of the Void
                </p>
                
                <div className="grid grid-cols-1 gap-6 text-center mb-12 w-full max-w-2xl">
                    <div className="bg-black/60 p-8 lg:p-10 rounded-3xl border border-yellow-500/40 shadow-[0_0_30px_rgba(255,215,0,0.15)] transform hover:scale-[1.02] transition-transform">
                        <div className="text-sm lg:text-lg text-gray-400 mb-2 tracking-[0.3em] font-mono uppercase">FINAL DATA SCORE</div>
                        <div className="text-5xl lg:text-7xl font-black font-cyber text-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">{score.toLocaleString()}</div>
                    </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="bg-black/60 p-6 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-colors">
                            <div className="text-xs lg:text-sm text-gray-400 font-mono tracking-widest mb-1">BLUE CRYSTALS</div>
                            <div className="text-2xl lg:text-4xl font-bold text-cyan-400 font-cyber">{gemsCollected}</div>
                        </div>
                        <div className="bg-black/60 p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-colors">
                             <div className="text-xs lg:text-sm text-gray-400 font-mono tracking-widest mb-1">TRAVEL DISTANCE</div>
                            <div className="text-2xl lg:text-4xl font-bold text-purple-400 font-cyber">{Math.floor(distance)} LY</div>
                        </div>
                     </div>
                </div>

                <button 
                  onClick={() => { audio.init(); restartGame(); }}
                  className="px-12 lg:px-20 py-5 lg:py-6 bg-white text-black font-black text-xl lg:text-3xl rounded-2xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)] tracking-[0.2em] hover:shadow-[0_0_70px_rgba(255,255,255,0.5)] active:scale-95 uppercase"
                >
                    NEW EXPEDITION
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className={containerClass}>
        <div className="flex justify-between items-start w-full">
            <div className="flex flex-col">
                <div className="text-4xl md:text-5xl lg:text-7xl font-bold text-cyan-400 drop-shadow-[0_0_15px_#00ffff] font-cyber tracking-tighter">
                    {score.toLocaleString()}
                </div>
                <div className="text-xs md:text-sm lg:text-lg text-cyan-500/60 font-mono tracking-[0.3em] uppercase mt-1">
                    CREDITS EARNED
                </div>
            </div>
            
            <div className="flex space-x-2 md:space-x-3 lg:space-x-4">
                {[...Array(maxLives)].map((_, i) => (
                    <Heart 
                        key={i} 
                        className={`w-7 h-7 md:w-9 md:h-9 lg:w-12 lg:h-12 ${i < lives ? 'text-pink-500 fill-pink-500' : 'text-gray-800 fill-gray-800'} drop-shadow-[0_0_8px_#ff0054] transition-colors duration-500`} 
                    />
                ))}
            </div>
        </div>
        
        <div className="absolute top-6 lg:top-10 left-1/2 transform -translate-x-1/2 text-sm md:text-lg lg:text-2xl text-purple-300 font-bold tracking-[0.4em] font-mono bg-black/60 px-6 py-2 lg:px-10 lg:py-3 rounded-full border border-purple-500/40 backdrop-blur-md z-50 uppercase shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            SECTOR {level} <span className="text-gray-500 text-xs md:text-sm lg:text-lg">/ 3</span>
        </div>

        {isImmortalityActive && (
             <div className="absolute top-28 lg:top-36 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-2xl lg:text-4xl animate-pulse flex items-center drop-shadow-[0_0_15px_gold] font-cyber tracking-widest uppercase">
                 <Shield className="mr-3 w-8 h-8 lg:w-10 lg:h-10 fill-yellow-400" /> SHIELD ACTIVE
             </div>
        )}

        <div className="absolute top-20 md:top-28 lg:top-36 left-1/2 transform -translate-x-1/2 flex space-x-3 md:space-x-4 lg:space-x-6">
            {target.map((char, idx) => {
                const isCollected = collectedLetters.includes(idx);
                const color = RUNNER_COLORS[idx];

                return (
                    <div 
                        key={idx}
                        style={{
                            borderColor: isCollected ? color : 'rgba(55, 65, 81, 0.5)',
                            color: isCollected ? 'rgba(0, 0, 0, 0.9)' : 'rgba(55, 65, 81, 0.8)',
                            boxShadow: isCollected ? `0 0 25px ${color}` : 'none',
                            backgroundColor: isCollected ? color : 'rgba(0, 0, 0, 0.6)'
                        }}
                        className={`w-9 h-12 md:w-12 md:h-16 lg:w-16 lg:h-20 flex items-center justify-center border-2 lg:border-3 font-black text-xl md:text-2xl lg:text-4xl font-cyber rounded-xl transform transition-all duration-500 hover:scale-105`}
                    >
                        {char}
                    </div>
                );
            })}
        </div>

        <div className="w-full flex justify-between items-end">
             <div className="flex flex-col">
                  <span className="font-mono text-[10px] lg:text-xs text-purple-500 tracking-[0.4em] uppercase mb-1">MISSION LOG: STABLE</span>
                  <div className="flex items-center space-x-3 text-cyan-500 opacity-80">
                      <Zap className="w-5 h-5 lg:w-8 lg:h-8 animate-pulse" />
                      <span className="font-mono text-lg lg:text-2xl font-bold tracking-widest uppercase">THRUSTERS {Math.round((speed / RUN_SPEED_BASE) * 100)}%</span>
                  </div>
             </div>
             
             <div className="hidden md:flex flex-col items-end text-white/40 font-mono text-[10px] lg:text-xs tracking-[0.2em]">
                <div>OS: RUNNER_V2.0.4</div>
                <div>GRID_STATUS: ENHANCED</div>
             </div>
        </div>
    </div>
  );
};