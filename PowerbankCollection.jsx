import React, { useState, useEffect, useCallback } from 'react';

// Конфігурація павербанків - додавай нові кожного року!
const POWERBANKS = [
  {
    year: 2025,
    name: "Перший Іскр",
    rarity: "legendary",
    description: "Той самий перший. Початок традиції!",
    funFact: "Павербанк середньої ємності може зарядити смартфон 3-4 рази",
    image: "./images/powerbank-2025.png",  // Шлях до картинки
    unlocked: true,
    color: "#FFD700"
  },
  {
    year: 2026,
    name: "???",
    rarity: "mythic",
    description: "Що ж це буде цього року?",
    funFact: "Найбільший павербанк у світі має ємність 1,200,000 mAh!",
    image: "./images/powerbank-2026.png",  // Додай картинку сюди
    unlocked: false,
    color: "#FF6B9D"
  }
];

// Майбутні павербанки (заблоковані, для прев'ю)
const FUTURE_POWERBANKS = [
  {
    year: 2027,
    name: "Темна Енергія",
    rarity: "epic",
    teaser: "Щось потужне наближається..."
  },
  {
    year: 2028,
    name: "Квантовий Заряд",
    rarity: "mythic",
    teaser: "За межами розуміння"
  },
  {
    year: 2029,
    name: "Нескінченність",
    rarity: "legendary",
    teaser: "П'ять років традиції"
  }
];

// Дата народження - 7 січня о 12:00
const BIRTHDAY_MONTH = 1;
const BIRTHDAY_DAY = 7;
const UNLOCK_HOUR = 12;

const RARITY_CONFIG = {
  common: { label: "Звичайний", gradient: "linear-gradient(135deg, #8B8B8B 0%, #C0C0C0 50%, #8B8B8B 100%)", glow: "#C0C0C0" },
  rare: { label: "Рідкісний", gradient: "linear-gradient(135deg, #1E88E5 0%, #64B5F6 50%, #1E88E5 100%)", glow: "#64B5F6" },
  epic: { label: "Епічний", gradient: "linear-gradient(135deg, #7B1FA2 0%, #CE93D8 50%, #7B1FA2 100%)", glow: "#CE93D8" },
  legendary: { label: "Легендарний", gradient: "linear-gradient(135deg, #FF6F00 0%, #FFD54F 50%, #FF6F00 100%)", glow: "#FFD54F" },
  mythic: { label: "Міфічний", gradient: "linear-gradient(135deg, #FF1744 0%, #FF80AB 30%, #E040FB 70%, #7C4DFF 100%)", glow: "#FF80AB" }
};

// Повідомлення очікування
const WAITING_MESSAGES = {
  months: [
    "Січень вже був, чекаємо наступного! 🎯",
    "Лютий - найкоротший місяць, але очікування довге! 📅",
    "Березень - весна починається, заряд росте! 🌱",
    "Квітень - час квітнути і чекати! 🌸",
    "Травень - половина року до наступного! ⏳",
    "Червень - літо, відпочивай, але пам'ятай! ☀️",
    "Липень - спека, але терпіння ще більше! 🔥",
    "Серпень - останній місяць літа, скоро осінь! 🍂",
    "Вересень - новий сезон, нові сили! 💪",
    "Жовтень - три місяці залишилось! 🎃",
    "Листопад - фінішна пряма наближається! 🏃",
    "Грудень - останній місяць очікування! Майже там! 🎄"
  ],
  days: [
    "День 30: Відлік пішов серйозно! 📅",
    "День 29: Менше місяця! 🎯",
    "День 28: Готуйся до чогось класного! 💫",
    "День 27: Час летить! ⏰",
    "День 26: Енергія накопичується... ⚡",
    "День 25: Чверть місяця позаду! 📊",
    "День 24: Keep going! 🚀",
    "День 23: Ти на правильному шляху! 🛤️",
    "День 22: Майже три тижні! 📆",
    "День 21: Три тижні - це вже серйозно! 🎯",
    "День 20: Двадцятка! Круглі числа - це знак! 🔢",
    "День 19: Менше трьох тижнів! ⏳",
    "День 18: Countdown continues... 📡",
    "День 17: Щось наближається! 🌟",
    "День 16: Більше половини місяця! 📈",
    "День 15: Екватор пройдено! 🏔️",
    "День 14: Рівно два тижні! 🎖️",
    "День 13: Тринадцять і counting! 🔋",
    "День 12: Дванадцять днів енергії! ⚡",
    "День 11: Одинадцять і counting! 🔋",
    "День 10: Десятка! Фінальний відлік! 🔟",
    "День 9: Однозначні числа! 9️⃣",
    "День 8: Тиждень і один день! 📅",
    "День 7: Рівно тиждень! 🗓️",
    "День 6: Менше тижня! Let's go! 🚀",
    "День 5: П'ять днів - можна порахувати на одній руці! ✋",
    "День 4: Чотири дні! Напруга зростає! ⚡",
    "День 3: Три дні! Almost there! 🎯",
    "День 2: Післязавтра! Вже так близько! 🔥",
    "День 1: ЗАВТРА! Готуйся! 🏁"
  ],
  hours: [
    "00:00 - Півночі! День настав, але ще зарано! 🌙",
    "01:00 - Терпіння, ще спи! 😴",
    "02:00 - Ніч триває... ⭐",
    "03:00 - Ще занадто рано! 🌃",
    "04:00 - Світанок наближається! 🌅",
    "05:00 - Рання пташка? Ще трохи почекай! 🐦",
    "06:00 - Ранок! Але ще не час! ☕",
    "07:00 - Сім годин пройшло! ⏰",
    "08:00 - Ранкова зарядка? А павербанк ще заряджається! 💪",
    "09:00 - Три години залишилось! 🎯",
    "10:00 - Дві години! Майже! ⚡",
    "11:00 - ОДНА ГОДИНА! Тримайся! 🔥",
    "12:00+ - ЧАС ПРИЙШОВ! 🎉"
  ]
};

const FUN_FACTS = [
  "Перший павербанк з'явився у 2001 році в Китаї 🇨🇳",
  "Середня людина перевіряє телефон 96 разів на день 📱",
  "Літій-іонні батареї були винайдені в 1991 році 🔬",
  "Найшвидша зарядка може дати 50% за 15 хвилин ⚡",
  "Tesla Powerwall може живити будинок 2 дні 🏠",
  "Сонячні павербанки можуть заряджатись навіть у похмуру погоду ☁️",
  "Перший мобільний телефон важив 1.1 кг 📞",
  "Батарея MacBook може витримати 1000 циклів зарядки 💻",
  "Найдорожчий павербанк коштує $1,000,000 (із золота) 🥇",
  "Середній павербанк 10000mAh важить близько 200 грам ⚖️",
  "Перша літій-іонна батарея була створена Sony 🎮",
  "Швидка зарядка була винайдена Qualcomm у 2013 році ⚡"
];

const getMessageForDate = (totalDays, hours) => {
  const now = new Date();
  
  if (totalDays <= 0) {
    const hour = now.getHours();
    if (hour >= UNLOCK_HOUR) {
      return WAITING_MESSAGES.hours[12];
    }
    return WAITING_MESSAGES.hours[Math.min(hour, 11)];
  } else if (totalDays <= 30) {
    const dayIndex = 30 - totalDays;
    return WAITING_MESSAGES.days[Math.min(dayIndex, WAITING_MESSAGES.days.length - 1)];
  } else {
    const month = now.getMonth();
    return WAITING_MESSAGES.months[month];
  }
};

const getFactForDate = () => {
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return FUN_FACTS[dayOfYear % FUN_FACTS.length];
};

const Particles = ({ active, color }) => {
  if (!active) return null;
  
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 100
    }}>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: `${Math.random() * 12 + 4}px`,
            height: `${Math.random() * 12 + 4}px`,
            background: i % 3 === 0 ? color : i % 3 === 1 ? '#FFD700' : '#FFFFFF',
            borderRadius: i % 2 === 0 ? '50%' : '2px',
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `particle-explode ${1.5 + Math.random()}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.3}s`,
            '--angle': `${Math.random() * 360}deg`,
            '--distance': `${150 + Math.random() * 200}px`,
            boxShadow: `0 0 ${6 + Math.random() * 10}px ${color}`
          }}
        />
      ))}
    </div>
  );
};

const CollectionStats = ({ powerbanks, revealedCards }) => {
  const unlockedCount = powerbanks.filter((p, i) => p.unlocked || revealedCards[i]).length;
  const totalCount = powerbanks.length + FUTURE_POWERBANKS.length;
  
  const rarityCount = {};
  powerbanks.forEach((p, i) => {
    if (p.unlocked || revealedCards[i]) {
      rarityCount[p.rarity] = (rarityCount[p.rarity] || 0) + 1;
    }
  });

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
      borderRadius: '20px',
      padding: '25px 30px',
      border: '1px solid rgba(255,255,255,0.1)',
      maxWidth: '400px',
      margin: '0 auto 40px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #FFD700, #FF6F00)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          🔋
        </div>
        <div>
          <div style={{
            fontSize: '14px',
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Твоя колекція
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#fff'
          }}>
            {unlockedCount} / {totalCount}
          </div>
        </div>
      </div>
      
      <div style={{
        height: '8px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        <div style={{
          height: '100%',
          width: `${(unlockedCount / totalCount) * 100}%`,
          background: 'linear-gradient(90deg, #FFD700, #FF6F00)',
          borderRadius: '4px',
          transition: 'width 0.5s ease'
        }} />
      </div>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {Object.entries(RARITY_CONFIG).map(([key, config]) => (
          <div key={key} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '20px',
            background: rarityCount[key] ? config.gradient : 'rgba(255,255,255,0.05)',
            opacity: rarityCount[key] ? 1 : 0.4,
            fontSize: '12px',
            fontWeight: '600'
          }}>
            <span>{rarityCount[key] || 0}</span>
            <span style={{ opacity: 0.8 }}>{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PowerbankCard = ({ powerbank, onClick, isRevealing, canUnlock }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const rarityConfig = RARITY_CONFIG[powerbank.rarity];
  
  const isLocked = !powerbank.unlocked && !canUnlock;
  const showMystery = !powerbank.unlocked;
  
  return (
    <div
      onClick={() => !isLocked && onClick()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        perspective: '1000px',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        opacity: isLocked ? 0.6 : 1,
        transition: 'opacity 0.3s ease'
      }}
    >
      <div style={{
        width: '280px',
        height: '380px',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isRevealing 
          ? 'rotateY(1080deg) scale(1.1)' 
          : isHovered && !isLocked 
            ? 'rotateY(15deg) translateY(-10px)' 
            : 'rotateY(0deg)',
        animation: !isLocked && canUnlock && showMystery ? 'card-pulse 2s ease-in-out infinite' : 'none'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: '20px',
          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
          border: '3px solid #2a2a4a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontSize: '80px', opacity: 0.3 }}>🔋</div>
        </div>
        
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          borderRadius: '20px',
          background: showMystery 
            ? 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
            : 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
          border: `3px solid ${showMystery ? '#4a4a6a' : rarityConfig.glow}`,
          overflow: 'hidden',
          boxShadow: showMystery 
            ? '0 20px 60px rgba(0,0,0,0.5)'
            : `0 0 30px ${rarityConfig.glow}40, 0 20px 60px rgba(0,0,0,0.5)`,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: showMystery ? '#4a4a6a' : rarityConfig.gradient,
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#fff',
            boxShadow: showMystery ? 'none' : `0 0 20px ${rarityConfig.glow}60`
          }}>
            {showMystery ? '???' : rarityConfig.label}
          </div>
          
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            fontSize: '24px',
            fontWeight: '900',
            color: showMystery ? '#4a4a6a' : rarityConfig.glow,
            textShadow: showMystery ? 'none' : `0 0 20px ${rarityConfig.glow}`
          }}>
            {powerbank.year}
          </div>
          
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px 20px'
          }}>
            {showMystery ? (
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(145deg, #2a2a4a, #1a1a2e)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
                animation: canUnlock ? 'mystery-glow 2s ease-in-out infinite' : 'none',
                boxShadow: canUnlock 
                  ? `0 0 40px ${rarityConfig.glow}60, inset 0 0 30px rgba(255,255,255,0.1)`
                  : 'inset 0 0 30px rgba(0,0,0,0.5)'
              }}>
                {canUnlock ? '🎁' : '🔒'}
              </div>
            ) : powerbank.image && !imgError ? (
              <img 
                src={powerbank.image} 
                alt={powerbank.name}
                onError={() => setImgError(true)}
                style={{
                  maxWidth: '90%',
                  maxHeight: '180px',
                  objectFit: 'contain',
                  filter: `drop-shadow(0 0 20px ${rarityConfig.glow}60)`
                }}
              />
            ) : (
              <div style={{
                fontSize: '100px',
                filter: `drop-shadow(0 0 30px ${rarityConfig.glow})`
              }}>
                🔋
              </div>
            )}
          </div>
          
          <div style={{
            padding: '20px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            marginTop: 'auto'
          }}>
            <div style={{
              fontSize: '22px',
              fontWeight: '800',
              color: '#fff',
              marginBottom: '8px',
              textShadow: showMystery ? 'none' : `0 0 10px ${rarityConfig.glow}60`
            }}>
              {showMystery ? '???' : powerbank.name}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#aaa',
              lineHeight: '1.5'
            }}>
              {showMystery 
                ? (canUnlock ? 'Натисни, щоб відкрити!' : 'Ще не час...')
                : powerbank.description
              }
            </div>
          </div>
          
          {!showMystery && (
            <>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                background: `linear-gradient(135deg, ${rarityConfig.glow}10 0%, transparent 50%)`,
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-50%',
                left: '-50%',
                width: '200%',
                height: '100%',
                background: `radial-gradient(ellipse at center, ${rarityConfig.glow}15 0%, transparent 70%)`,
                pointerEvents: 'none'
              }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const FutureCard = ({ powerbank }) => {
  const rarityConfig = RARITY_CONFIG[powerbank.rarity];
  
  return (
    <div style={{
      width: '180px',
      height: '240px',
      borderRadius: '16px',
      background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f23 100%)',
      border: '2px solid #2a2a4a',
      overflow: 'hidden',
      opacity: 0.5,
      position: 'relative',
      flexShrink: 0
    }}>
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        fontSize: '18px',
        fontWeight: '900',
        color: '#3a3a5a'
      }}>
        {powerbank.year}
      </div>
      
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        padding: '4px 10px',
        borderRadius: '12px',
        background: '#2a2a4a',
        fontSize: '9px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: '#5a5a7a'
      }}>
        {rarityConfig.label}
      </div>
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '50px',
        opacity: 0.3
      }}>
        🔒
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '15px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '700',
          color: '#5a5a7a',
          marginBottom: '4px'
        }}>
          {powerbank.name}
        </div>
        <div style={{
          fontSize: '11px',
          color: '#4a4a6a'
        }}>
          {powerbank.teaser}
        </div>
      </div>
    </div>
  );
};

export default function PowerbankCollection() {
  const [timeLeft, setTimeLeft] = useState({});
  const [canUnlock, setCanUnlock] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentFact, setCurrentFact] = useState('');
  const [revealingCard, setRevealingCard] = useState(null);
  const [showParticles, setShowParticles] = useState(false);
  const [revealedCards, setRevealedCards] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    let birthdayDate = new Date(currentYear, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, UNLOCK_HOUR, 0, 0);
    
    if (now > birthdayDate) {
      birthdayDate = new Date(currentYear + 1, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, UNLOCK_HOUR, 0, 0);
    }
    
    const diff = birthdayDate - now;
    
    const isBirthdayToday = now.getMonth() === (BIRTHDAY_MONTH - 1) && now.getDate() === BIRTHDAY_DAY;
    const isAfterNoon = now.getHours() >= UNLOCK_HOUR;
    const unlock = isBirthdayToday && isAfterNoon;
    
    setCanUnlock(unlock);
    
    if (diff <= 0) {
      return { months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0 };
    }
    
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;
    const months = Math.floor(totalDays / 30);
    
    return { months, weeks, days, hours, minutes, seconds, totalDays };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      setTimeLeft(time);
      setCurrentMessage(getMessageForDate(time.totalDays, time.hours));
      setCurrentFact(getFactForDate());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const handleCardClick = (index, powerbank) => {
    if (powerbank.unlocked || revealedCards[index]) {
      setSelectedCard({ ...powerbank, index });
      setShowModal(true);
      return;
    }
    
    if (!canUnlock) return;
    
    setRevealingCard(index);
    
    setTimeout(() => {
      setShowParticles(true);
    }, 600);
    
    setTimeout(() => {
      setRevealedCards(prev => ({ ...prev, [index]: true }));
      setRevealingCard(null);
      setShowParticles(false);
      setSelectedCard({ ...powerbank, index });
      setShowModal(true);
    }, 2000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%)',
      fontFamily: "'Montserrat', 'Segoe UI', sans-serif",
      color: '#fff',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `radial-gradient(2px 2px at 20px 30px, #fff, transparent),
                     radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                     radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                     radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.6), transparent),
                     radial-gradient(1px 1px at 160px 120px, #fff, transparent)`,
        backgroundSize: '200px 200px',
        animation: 'twinkle 4s ease-in-out infinite',
        opacity: 0.5,
        pointerEvents: 'none'
      }} />

      <header style={{
        textAlign: 'center',
        padding: '60px 20px 40px',
        position: 'relative'
      }}>
        <div style={{
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '6px',
          color: '#888',
          marginBottom: '15px'
        }}>
          Ексклюзивна колекція
        </div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          fontWeight: '900',
          margin: 0,
          background: 'linear-gradient(135deg, #FFD700 0%, #FF6F00 50%, #7C4DFF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 60px rgba(255,111,0,0.3)',
          letterSpacing: '-2px'
        }}>
          Power Collection
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#aaa',
          marginTop: '15px',
          maxWidth: '500px',
          margin: '15px auto 0'
        }}>
          🔋 Щорічна традиція енергії ⚡
        </p>
      </header>

      <CollectionStats powerbanks={POWERBANKS} revealedCards={revealedCards} />

      {!canUnlock && (
        <div style={{
          maxWidth: '800px',
          margin: '0 auto 50px',
          padding: '30px',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          borderRadius: '30px',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '25px'
          }}>
            <div style={{
              fontSize: '16px',
              color: '#FF6F00',
              fontWeight: '600',
              marginBottom: '5px'
            }}>
              ⏳ До наступного подарунка
            </div>
            <div style={{
              fontSize: '14px',
              color: '#888'
            }}>
              7 січня о 12:00
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            flexWrap: 'wrap',
            marginBottom: '30px'
          }}>
            {[
              { value: timeLeft.months || 0, label: 'міс' },
              { value: timeLeft.weeks || 0, label: 'тиж' },
              { value: timeLeft.days || 0, label: 'дн' },
              { value: timeLeft.hours || 0, label: 'год' },
              { value: timeLeft.minutes || 0, label: 'хв' },
              { value: timeLeft.seconds || 0, label: 'сек' }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'linear-gradient(145deg, #1a1a3a, #0a0a1a)',
                borderRadius: '15px',
                padding: '15px 20px',
                minWidth: '70px',
                textAlign: 'center',
                border: '1px solid rgba(255,111,0,0.2)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#fff',
                  fontFamily: 'monospace'
                }}>
                  {String(item.value).padStart(2, '0')}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#888',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: 'rgba(255,111,0,0.1)',
            borderRadius: '15px',
            border: '1px solid rgba(255,111,0,0.2)'
          }}>
            <div style={{
              fontSize: '18px',
              color: '#fff',
              marginBottom: '10px',
              fontWeight: '600'
            }}>
              {currentMessage}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#aaa',
              fontStyle: 'italic'
            }}>
              💡 {currentFact}
            </div>
          </div>
        </div>
      )}

      {canUnlock && (
        <div style={{
          textAlign: 'center',
          margin: '0 auto 50px',
          padding: '30px',
          maxWidth: '600px'
        }}>
          <div style={{
            fontSize: '60px',
            marginBottom: '20px',
            animation: 'bounce 1s ease-in-out infinite'
          }}>
            🎉🎂🎁
          </div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #FFD700, #FF6F00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '15px'
          }}>
            З Днем Народження!
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#aaa'
          }}>
            Твій новий павербанк чекає! Натисни на картку, щоб відкрити 🎁
          </p>
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        flexWrap: 'wrap',
        padding: '20px 40px 60px',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {POWERBANKS.map((powerbank, index) => (
          <div key={powerbank.year} style={{ position: 'relative' }}>
            <PowerbankCard
              powerbank={{
                ...powerbank,
                unlocked: powerbank.unlocked || revealedCards[index]
              }}
              onClick={() => handleCardClick(index, powerbank)}
              isRevealing={revealingCard === index}
              canUnlock={canUnlock && powerbank.year === currentYear}
            />
            {revealingCard === index && (
              <Particles 
                active={showParticles} 
                color={RARITY_CONFIG[powerbank.rarity].glow} 
              />
            )}
          </div>
        ))}
      </div>

      <div style={{
        padding: '40px 20px 80px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '4px',
            color: '#555',
            marginBottom: '8px'
          }}>
            Coming Soon
          </div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#666',
            margin: 0
          }}>
            Майбутні поповнення 🔮
          </h3>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          overflowX: 'auto',
          padding: '10px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#333 #111'
        }}>
          {FUTURE_POWERBANKS.map((powerbank) => (
            <FutureCard key={powerbank.year} powerbank={powerbank} />
          ))}
        </div>
      </div>

      {showModal && selectedCard && (
        <div 
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease',
            padding: '20px'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(145deg, #1a1a3a, #0a0a1a)',
              borderRadius: '30px',
              padding: '40px',
              maxWidth: '500px',
              width: '100%',
              border: `2px solid ${RARITY_CONFIG[selectedCard.rarity].glow}`,
              boxShadow: `0 0 60px ${RARITY_CONFIG[selectedCard.rarity].glow}40`,
              animation: 'modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                display: 'inline-block',
                padding: '8px 20px',
                borderRadius: '20px',
                background: RARITY_CONFIG[selectedCard.rarity].gradient,
                fontSize: '12px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '20px'
              }}>
                {RARITY_CONFIG[selectedCard.rarity].label}
              </div>
              
              <div style={{
                fontSize: '100px',
                marginBottom: '20px',
                filter: `drop-shadow(0 0 40px ${RARITY_CONFIG[selectedCard.rarity].glow})`
              }}>
                {selectedCard.image ? (
                  <img 
                    src={selectedCard.image} 
                    alt={selectedCard.name}
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      objectFit: 'contain'
                    }}
                  />
                ) : '🔋'}
              </div>
              
              <h3 style={{
                fontSize: '28px',
                fontWeight: '800',
                margin: '0 0 10px',
                color: RARITY_CONFIG[selectedCard.rarity].glow
              }}>
                {selectedCard.name}
              </h3>
              
              <div style={{
                fontSize: '48px',
                fontWeight: '900',
                color: '#fff',
                opacity: 0.3
              }}>
                {selectedCard.year}
              </div>
            </div>
            
            <p style={{
              fontSize: '16px',
              color: '#ccc',
              lineHeight: '1.8',
              textAlign: 'center',
              marginBottom: '25px'
            }}>
              {selectedCard.description}
            </p>
            
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '25px'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                💡 Цікавий факт
              </div>
              <div style={{
                fontSize: '14px',
                color: '#aaa',
                lineHeight: '1.6'
              }}>
                {selectedCard.funFact}
              </div>
            </div>
            
            <button
              onClick={() => setShowModal(false)}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '15px',
                border: 'none',
                background: RARITY_CONFIG[selectedCard.rarity].gradient,
                color: '#fff',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: `0 10px 30px ${RARITY_CONFIG[selectedCard.rarity].glow}40`
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = `0 15px 40px ${RARITY_CONFIG[selectedCard.rarity].glow}60`;
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `0 10px 30px ${RARITY_CONFIG[selectedCard.rarity].glow}40`;
              }}
            >
              Круто! ⚡
            </button>
          </div>
        </div>
      )}

      <footer style={{
        textAlign: 'center',
        padding: '40px 20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        color: '#666'
      }}>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
          🔋 Power Collection • Est. 2025
        </div>
        <div style={{ fontSize: '12px' }}>
          Колекція поповнюється щороку 7 січня
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap');
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        @keyframes card-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(255,111,0,0.3); }
          50% { transform: scale(1.02); box-shadow: 0 0 50px rgba(255,111,0,0.5); }
        }
        
        @keyframes mystery-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(255,111,0,0.3), inset 0 0 30px rgba(255,255,255,0.1); }
          50% { box-shadow: 0 0 60px rgba(255,111,0,0.6), inset 0 0 40px rgba(255,255,255,0.2); }
        }
        
        @keyframes particle-explode {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(cos(var(--angle)) * var(--distance)),
              calc(sin(var(--angle)) * var(--distance))
            ) rotate(720deg) scale(0);
            opacity: 0;
          }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalPop {
          from { transform: scale(0.8) translateY(50px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
        }
        
        ::-webkit-scrollbar {
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #111;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
