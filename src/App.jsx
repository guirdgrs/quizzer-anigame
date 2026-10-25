import React, { useState, useEffect, useRef } from "react";
import { database } from "./firebase";
import { ref, onValue, set, push, remove } from "firebase/database";
import {
  Trophy,
  Users,
  Settings,
  Play,
  Check,
  X,
  RotateCcw,
  Edit3,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Gamepad2,
  Volume2,
  Image as ImageIcon,
  Download,
  Upload,
  Radio,
  Crown,
  Zap,
  HelpCircle,
  ArrowLeft,
  RefreshCw,
  PlusCircle,
  AlertCircle,
  Music,
  Tv,
  Dices,
  PenTool,
  Hash,
  UserPlus,
  Lock,
  Unlock,
  KeyRound,
  Video,
  Sliders,
  PanelsTopLeft,
  Wand2,
} from "lucide-react";

// --- GERADORES DE EFEITOS SONOROS (WEB AUDIO API) ---
const playSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === "buzzer") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === "correct") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === "wrong") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(140, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    console.error("Audio error:", e);
  }
};

// --- IMAGEM ILUSTRATIVA DO NARUTO NO PAINT ---
const NarutoPaintSVG = () => (
  <svg
    viewBox="0 0 400 400"
    className="w-full h-full max-h-[300px] object-contain mx-auto"
  >
    <rect width="400" height="400" fill="#ffffff" />
    <path
      d="M110 180 L130 90 L160 140 L190 70 L220 130 L250 80 L280 140 L310 90 L300 190 Z"
      fill="#FFE600"
      stroke="#000000"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <ellipse
      cx="205"
      cy="220"
      rx="75"
      ry="65"
      fill="#FFE0BD"
      stroke="#000000"
      strokeWidth="5"
    />
    <path
      d="M135 180 Q205 170 275 180 L275 205 Q205 195 135 205 Z"
      fill="#1D4ED8"
      stroke="#000000"
      strokeWidth="4"
    />
    <rect
      x="175"
      y="183"
      width="60"
      height="18"
      rx="4"
      fill="#9CA3AF"
      stroke="#000000"
      strokeWidth="3"
    />
    <path
      d="M200 188 Q210 190 205 196 Q195 194 200 188"
      fill="none"
      stroke="#000000"
      strokeWidth="3"
    />
    <ellipse
      cx="175"
      cy="225"
      rx="12"
      ry="10"
      fill="#00A3FF"
      stroke="#000000"
      strokeWidth="4"
    />
    <ellipse
      cx="235"
      cy="225"
      rx="12"
      ry="10"
      fill="#00A3FF"
      stroke="#000000"
      strokeWidth="4"
    />
    <circle cx="175" cy="225" r="4" fill="#000000" />
    <circle cx="235" cy="225" r="4" fill="#000000" />
    <path
      d="M160 210 L190 215"
      stroke="#FFE600"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M220 215 L250 210"
      stroke="#FFE600"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M180 255 Q205 270 230 255"
      fill="none"
      stroke="#000000"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <line x1="145" y1="225" x2="162" y2="228" stroke="#000000" strokeWidth="3" />
    <line x1="143" y1="235" x2="160" y2="236" stroke="#000000" strokeWidth="3" />
    <line x1="146" y1="245" x2="163" y2="242" stroke="#000000" strokeWidth="3" />
    <line x1="248" y1="228" x2="265" y2="225" stroke="#000000" strokeWidth="3" />
    <line x1="250" y1="236" x2="267" y2="235" stroke="#000000" strokeWidth="3" />
    <line x1="247" y1="242" x2="264" y2="245" stroke="#000000" strokeWidth="3" />
    <path
      d="M140 280 L120 370 L290 370 L270 280 Q205 310 140 280 Z"
      fill="#1E40AF"
      stroke="#000000"
      strokeWidth="5"
    />
    <path
      d="M165 295 L150 370 L260 370 L245 295 Q205 320 165 295 Z"
      fill="#EA580C"
      stroke="#000000"
      strokeWidth="4"
    />
  </svg>
);

// --- DADOS INICIAIS DO QUIZ COM MÍDIAS E EFEITOS ---
const INITIAL_QUIZ_DATA = {
  title: "Animes & Jogos",
  categories: [
    {
      id: "picasso",
      name: "Picasso",
      description:
        "Adivinhe o personagem com base na arte conceitual em baixíssima qualidade!",
      questions: [
        {
          level: 1,
          value: 100,
          mediaType: "image",
          isCustomSvg: true,
          content: "Quem é esse ninja clássico do anime?",
          answer: "Naruto Uzumaki (Naruto Shippuden)",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 2,
          value: 200,
          mediaType: "image",
          imageUrl:
            "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500",
          content: "Qual é esse lendário Sayajin? (Imagem borrada)",
          answer: "Goku / Son Goku (Dragon Ball Z)",
          blurLevel: 12,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 3,
          value: 300,
          mediaType: "image",
          imageUrl:
            "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500",
          content: "Futuro Rei dos Piratas!",
          answer: "Monkey D. Luffy (One Piece)",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "bottom",
        },
        {
          level: 4,
          value: 400,
          mediaType: "text",
          content:
            "Desenho minimalista: Rato amarelo com bochechas vermelhas que solta trovões.",
          answer: "Pikachu (Pokémon)",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 5,
          value: 500,
          mediaType: "text",
          content:
            "Desenho minimalista: Robô gigante bio-mecânico roxo e verde gritando descontrolado.",
          answer: "EVA-01 (Neon Genesis Evangelion)",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 6,
          value: 600,
          mediaType: "text",
          content:
            "Desenho minimalista: Um garoto com caderno preto sorrindo enquanto come batatas fritas.",
          answer: "Light Yagami / Kira (Death Note)",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
      ],
    },
    {
      id: "babel",
      name: "Babel",
      description:
        "Desafios de áudio! Reconheça vozes, aberturas invertidas ou aceleradas.",
      questions: [
        {
          level: 1,
          value: 100,
          mediaType: "audio",
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          content: "Qual anime tem essa música tema? (Acelerada 1.35x)",
          answer: "Attack on Titan (Shingeki no Kyojin)",
          blurLevel: 0,
          audioEffect: "fast",
          textPosition: "top",
        },
        {
          level: 2,
          value: 200,
          mediaType: "text",
          content:
            "Quem diz a frase famosa: 'O de cima sobe e o de baixo desce'?",
          answer: "Yusuke Urameshi (Yu Yu Hakusho)",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 3,
          value: 300,
          mediaType: "text",
          content: "Qual bordão pertence a este personagem: 'Dattebayo!'",
          answer: "Naruto Uzumaki",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 4,
          value: 400,
          mediaType: "text",
          content: "Qual dublador oficial dá a voz ao Goku no Brasil?",
          answer: "Wendel Bezerra",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 5,
          value: 500,
          mediaType: "text",
          content: "Identifique o jogo pela música da fase do vulcão/fogo.",
          answer: "Super Mario 64",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 6,
          value: 600,
          mediaType: "text",
          content: "Qual o idioma original da música 'Brave Heart' de Digimon?",
          answer: "Japonês",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
      ],
    },
    {
      id: "guilhotina",
      name: "Guilhotina",
      description:
        "Perguntas de eliminação rápida e alto risco!",
      questions: [
        {
          level: 1,
          value: 100,
          mediaType: "text",
          content: "Qual o nome da espada de Ichigo Kurosaki em Bleach?",
          answer: "Zangetsu",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 2,
          value: 200,
          mediaType: "text",
          content: "Quantas Esferas do Dragão existem na Terra em Dragon Ball?",
          answer: "7 Esferas",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 3,
          value: 300,
          mediaType: "text",
          content: "Quem é o irmão mais velho de Sasuke Uchiha?",
          answer: "Itachi Uchiha",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 4,
          value: 400,
          mediaType: "text",
          content: "Qual é o objeto que concede poderes em JoJo Part 1?",
          answer: "A Máscara de Pedra",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 5,
          value: 500,
          mediaType: "text",
          content: "Qual o verdadeiro nome do L em Death Note?",
          answer: "L Lawliet",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 6,
          value: 600,
          mediaType: "text",
          content: "Qual a altura do Titã Colossal?",
          answer: "60 metros",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
      ],
    },
    {
      id: "erro",
      name: "Erro",
      description: "Encontre a gafe ou o erro na declaração!",
      questions: [
        {
          level: 1,
          value: 100,
          mediaType: "text",
          content:
            "Qual o ERRO nesta frase: 'Ash Ketchum venceu a Liga Indigo de Kanto com seu Charizard em sua primeira jornada.'",
          answer:
            "Erro: Ash PERDEU a Liga Kanto (ficou no Top 16 porque Charizard dormiu).",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 2,
          value: 200,
          mediaType: "text",
          content:
            "Qual o ERRO: 'Saitama de One Punch Man treinou fazendo 500 flexões por dia.'",
          answer:
            "Erro: O treino era de 100 flexões, 100 abdominais, 100 agachamentos e 10km de corrida.",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 3,
          value: 300,
          mediaType: "text",
          content:
            "Qual o ERRO: 'Em Naruto, Kakashi possui dois Sharingans durante toda a fase clássica.'",
          answer: "Erro: Ele possuía apenas UM Sharingan no olho esquerdo.",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 4,
          value: 400,
          mediaType: "text",
          content:
            "Qual o ERRO no jogo Zelda: 'Zelda usa uma túnica verde e uma espada mestre.'",
          answer: "Erro: O herói de túnica verde é o LINK, Zelda é a princesa.",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 5,
          value: 500,
          mediaType: "text",
          content: "Qual o ERRO: 'Demon Slayer se passa na Era Meiji.'",
          answer: "Erro: Se passa na Era Taisho.",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 6,
          value: 600,
          mediaType: "text",
          content:
            "Qual o ERRO: 'Hunter x Hunter foi escrito pelo criador de Naruto.'",
          answer:
            "Erro: Foi escrito por Yoshihiro Togashi (criador de Yu Yu Hakusho).",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
      ],
    },
    {
      id: "bangboo",
      name: "Bangboo",
      description: "Conhecimentos gerais sobre gachas e RPGs!",
      questions: [
        {
          level: 1,
          value: 100,
          mediaType: "text",
          content:
            "De qual jogo da HoYoverse são os mascotes redondinhos chamados 'Bangboo'?",
          answer: "Zenless Zone Zero (ZZZ)",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 2,
          value: 200,
          mediaType: "text",
          content: "Qual é o elemento do Arconte Venti em Genshin Impact?",
          answer: "Anemo (Vento)",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 3,
          value: 300,
          mediaType: "text",
          content:
            "Qual o nome da mascote/guia de emergência do Viajante em Genshin Impact?",
          answer: "Paimon",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 4,
          value: 400,
          mediaType: "text",
          content:
            "Em Honkai: Star Rail, qual o veículo usado para viajar entre as galáxias?",
          answer: "Astral Express (O Trem)",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 5,
          value: 500,
          mediaType: "text",
          content:
            "Qual a facção liderada por Nicole Demara em Zenless Zone Zero?",
          answer: "Gentle House (Cunning Hares)",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
        {
          level: 6,
          value: 600,
          mediaType: "text",
          content:
            "Como é chamado o sistema de sorteio de personagens nos jogos gacha?",
          answer: "Banners / Tiros (Wishes / Pulls)",
          blurLevel: 0,
          audioEffect: "none",
          textPosition: "top",
        },
      ],
    },
  ],
};

const RANDOM_EVENTS = [
  {
    type: "gartic",
    title: "🎨 Gartic Express",
    desc: "O Host escolhe uma palavra secreta e manda no privado de um jogador. Ele tem 45s para desenhar no Paint/Papel enquanto os outros adivinham!",
  },
  {
    type: "stop",
    title: "⏱️ Stop Anime Flash",
    desc: "Sorteie uma letra aleatória! Quem gritar primeiro 3 elementos do universo nerd com essa letra ganha +200 pts!",
  },
  {
    type: "double",
    title: "💥 Rodada Dupla",
    desc: "A próxima pergunta selecionada pelo Host valerá o DOBRO da pontuação!",
  },
  {
    type: "steal",
    title: "🥷 Ladrão de Pontos",
    desc: "O jogador com menor pontuação pode roubar 150 pontos do líder do placar!",
  },
];

// Helper para formatar links do YouTube em Embed
const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
};

export default function App() {
  const [role, setRole] = useState("player");
  const [isHostAuthenticated, setIsHostAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const hostPassword = "1234";

  const [quizData, setQuizData] = useState(INITIAL_QUIZ_DATA);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const [currentTab, setCurrentTab] = useState("board");
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [players, setPlayers] = useState([
    { id: "p1", name: "OtakuMaster", score: 0, color: "bg-blue-500" },
    { id: "p2", name: "GamerPro", score: 0, color: "bg-purple-500" },
    { id: "p3", name: "SaitamaFan", score: 0, color: "bg-pink-500" },
  ]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [activePlayerId, setActivePlayerId] = useState("p1");
  const [completedQuestions, setCompletedQuestions] = useState({});

  const [activeEvent, setActiveEvent] = useState(null);

  const [buzzerQueue, setBuzzerQueue] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hostRevealedBlur, setHostRevealedBlur] = useState(false); // Dica do Host: remover borrão ao vivo
  const audioRef = useRef(null);

  // Ajustar efeito de áudio (velocidade)
  useEffect(() => {
    if (audioRef.current && selectedQuestion?.question) {
      const effect = selectedQuestion.question.audioEffect || "none";
      if (effect === "fast") audioRef.current.playbackRate = 1.35;
      else if (effect === "slow") audioRef.current.playbackRate = 0.75;
      else audioRef.current.playbackRate = 1.0;
    }
  }, [selectedQuestion, currentTab]);

  const handleRoleSwitch = (targetRole) => {
    if (targetRole === "host") {
      if (isHostAuthenticated) {
        setRole("host");
      } else {
        setShowAuthModal(true);
      }
    } else {
      setRole("player");
      if (currentTab === "editor" || currentTab === "players") {
        setCurrentTab("board");
      }
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === hostPassword) {
      setIsHostAuthenticated(true);
      setRole("host");
      setShowAuthModal(false);
      setPasswordInput("");
      setAuthError("");
    } else {
      setAuthError("Senha incorreta! Tente novamente.");
    }
  };

  const handleLockHost = () => {
    setIsHostAuthenticated(false);
    setRole("player");
    if (currentTab === "editor" || currentTab === "players") {
      setCurrentTab("board");
    }
  };

  // --- FIREBASE SYNC ---
  useEffect(() => {
    if (!database) return;
    const buzzRef = ref(database, "game/buzzQueue");
    const unsubscribe = onValue(buzzRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data)
          .map(([key, value]) => ({ id: key, ...value }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setBuzzerQueue(list);
      } else {
        setBuzzerQueue([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!database) return;
    const stateRef = ref(database, "game/state");
    const unsubscribe = onValue(stateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.currentTab !== undefined) setCurrentTab(data.currentTab);
        if (data.selectedQuestion !== undefined)
          setSelectedQuestion(data.selectedQuestion);
        if (data.showAnswer !== undefined) setShowAnswer(data.showAnswer);
        if (data.hostRevealedBlur !== undefined)
          setHostRevealedBlur(data.hostRevealedBlur);
        if (data.completedQuestions !== undefined)
          setCompletedQuestions(data.completedQuestions);
        if (data.players !== undefined) setPlayers(data.players);
        if (data.quizData !== undefined) setQuizData(data.quizData);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleBuzzerClick = (pId) => {
    const playerObj = players.find((p) => p.id === pId);
    if (!playerObj) return;
    if (buzzerQueue.some((item) => item.playerId === pId)) return;

    playSound("buzzer");

    if (database) {
      const buzzRef = ref(database, "game/buzzQueue");
      push(buzzRef, {
        playerId: pId,
        name: playerObj.name,
        timestamp: Date.now(),
        formattedTime:
          new Date().toLocaleTimeString("pt-BR", { hour12: false }) +
          "." +
          Math.floor(Math.random() * 900 + 100),
      });
    } else {
      setBuzzerQueue((prev) => [
        ...prev,
        {
          id: "local_" + Date.now(),
          playerId: pId,
          name: playerObj.name,
          timestamp: Date.now(),
          formattedTime: new Date().toLocaleTimeString("pt-BR"),
        },
      ]);
    }
  };

  const handleClearBuzz = () => {
    setBuzzerQueue([]);
    if (database) {
      const buzzRef = ref(database, "game/buzzQueue");
      remove(buzzRef);
    }
  };

  const handleSelectQuestion = (category, question) => {
    if (role === "player") return;
    const newQuestionState = { category, question };
    setSelectedQuestion(newQuestionState);
    setShowAnswer(false);
    setHostRevealedBlur(false);
    handleClearBuzz();
    setCurrentTab("question");

    if (database) {
      set(ref(database, "game/state/selectedQuestion"), newQuestionState);
      set(ref(database, "game/state/showAnswer"), false);
      set(ref(database, "game/state/hostRevealedBlur"), false);
      set(ref(database, "game/state/currentTab"), "question");
    }
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    if (role === "host" && database) {
      set(ref(database, "game/state/currentTab"), tab);
    }
  };

  const handleScoreAward = (isCorrect) => {
    if (!selectedQuestion || buzzerQueue.length === 0) return;

    const currentBuzz = buzzerQueue[0];
    const points = selectedQuestion.question.value;

    let updatedPlayers = [...players];

    if (isCorrect) {
      playSound("correct");
      updatedPlayers = updatedPlayers.map((p) =>
        p.id === currentBuzz.playerId ? { ...p, score: p.score + points } : p
      );
      const key = `${selectedQuestion.category.id}-${selectedQuestion.question.level}`;
      const updatedCompleted = { ...completedQuestions, [key]: true };

      setPlayers(updatedPlayers);
      setCompletedQuestions(updatedCompleted);
      setShowAnswer(true);

      if (database) {
        set(ref(database, "game/state/players"), updatedPlayers);
        set(ref(database, "game/state/completedQuestions"), updatedCompleted);
        set(ref(database, "game/state/showAnswer"), true);
      }
    } else {
      playSound("wrong");
      updatedPlayers = updatedPlayers.map((p) =>
        p.id === currentBuzz.playerId
          ? { ...p, score: Math.max(0, p.score - Math.floor(points / 2)) }
          : p
      );
      setPlayers(updatedPlayers);

      if (database) {
        set(ref(database, "game/state/players"), updatedPlayers);
        if (currentBuzz.id) {
          remove(ref(database, `game/buzzQueue/${currentBuzz.id}`));
        }
      }
    }
  };

  const saveQuizDataLocally = (newQuizData) => {
    setQuizData(newQuizData);
    if (database) {
      set(ref(database, "game/state/quizData"), newQuizData);
    }
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-rose-500",
    ];
    const newP = {
      id: "p_" + Date.now(),
      name: newPlayerName.trim(),
      score: 0,
      color: colors[players.length % colors.length],
    };
    const updated = [...players, newP];
    setPlayers(updated);
    setNewPlayerName("");
    if (database) set(ref(database, "game/state/players"), updated);
  };

  const handleRemovePlayer = (id) => {
    const updated = players.filter((p) => p.id !== id);
    setPlayers(updated);
    if (database) set(ref(database, "game/state/players"), updated);
  };

  const handleUpdateScore = (id, delta) => {
    const updated = players.map((p) =>
      p.id === id ? { ...p, score: Math.max(0, p.score + delta) } : p
    );
    setPlayers(updated);
    if (database) set(ref(database, "game/state/players"), updated);
  };

  // --- TABULEIRO ---
  const renderBoardView = () => (
    <div className="w-full max-w-6xl mx-auto my-4 p-4 sm:p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-2xl transition-all">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 drop-shadow-sm tracking-wide">
          {quizData.title || "Animes"}
        </h1>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
          {role === "host"
            ? "CLIQUE EM QUALQUER NÚMERO PARA ABRIR A PERGUNTA"
            : "PASSE O MOUSE NAS CATEGORIAS PARA LER A DESCRIÇÃO"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-4 space-y-4">
          <div className="text-xs font-black text-red-500 tracking-wider uppercase px-2">
            CATEGORIAS
          </div>
          {quizData.categories.map((cat) => (
            <div
              key={cat.id}
              onMouseEnter={() => setHoveredCategory(cat)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="relative group"
            >
              <div className="w-full py-3.5 px-6 rounded-full bg-white text-blue-600 font-extrabold text-lg sm:text-xl text-center shadow-md border-2 border-blue-100 hover:border-blue-400 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2">
                {cat.name}
              </div>

              {hoveredCategory?.id === cat.id && (
                <div className="absolute left-0 right-0 z-30 mt-2 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md text-white text-xs sm:text-sm shadow-2xl border border-slate-700 animate-fadeIn">
                  <div className="font-bold text-blue-400 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> {cat.name}
                  </div>
                  {cat.description}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="md:col-span-8 space-y-4">
          <div className="text-xs font-black text-red-500 tracking-wider uppercase px-2 flex justify-between">
            <span>VALORES (NÃO DIFICULDADE)</span>
            <span className="hidden sm:inline">
              {role === "host"
                ? "PAINEL ADM ATIVO"
                : "MODO JOGADOR (SOMENTE LEITURA)"}
            </span>
          </div>

          {quizData.categories.map((cat) => (
            <div key={cat.id} className="grid grid-cols-6 gap-2 sm:gap-3 py-1">
              {cat.questions.map((q) => {
                const isCompleted = completedQuestions[`${cat.id}-${q.level}`];
                return (
                  <button
                    key={q.level}
                    disabled={role === "player"}
                    onClick={() => handleSelectQuestion(cat, q)}
                    className={`h-12 sm:h-14 rounded-2xl font-black text-lg sm:text-2xl transition-all shadow-md flex items-center justify-center ${
                      isCompleted
                        ? "bg-slate-300 text-slate-500 line-through opacity-60 hover:opacity-100"
                        : role === "player"
                        ? "bg-gradient-to-b from-blue-400 to-blue-600 text-white cursor-default"
                        : "bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white hover:scale-105 active:scale-95 shadow-blue-300/50 cursor-pointer"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 stroke-[3]" />
                    ) : (
                      q.level
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // --- TELA DA PERGUNTA ---
  const renderQuestionView = () => {
    if (!selectedQuestion) return null;
    const { category, question } = selectedQuestion;

    const blurPx = hostRevealedBlur ? 0 : question.blurLevel || 0;
    const textPos = question.textPosition || "top";

    const TextComponent = () => (
      <p
        className={`text-xl sm:text-2xl font-bold text-slate-800 text-center ${
          textPos === "overlay"
            ? "bg-slate-900/80 text-white p-4 rounded-2xl backdrop-blur-md shadow-lg my-2 max-w-xl mx-auto"
            : "my-3"
        }`}
      >
        {question.content}
      </p>
    );

    return (
      <div className="w-full max-w-5xl mx-auto my-4 p-4 sm:p-8 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-2xl relative transition-all">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => handleTabChange("board")}
            className="px-5 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" /> Tabuleiro
          </button>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-800 text-center tracking-wide">
            {category.name}
          </h2>

          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-500 text-white font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white">
            {question.level}
          </div>
        </div>

        {/* ÁREA DA PERGUNTA E MÍDIAS */}
        <div className="bg-white/90 rounded-2xl p-6 shadow-inner border border-slate-200 min-h-[320px] flex flex-col items-center justify-center my-4 relative overflow-hidden">
          {/* TEXTO NA POSIÇÃO ACIMA */}
          {(textPos === "top" || textPos === "overlay") && <TextComponent />}

          {/* MÍDIA: IMAGEM */}
          {(question.mediaType === "image" || question.type === "image") && (
            <div
              className="w-full max-w-md my-2 rounded-xl overflow-hidden border-2 border-slate-300 shadow-md bg-white p-2 transition-all duration-500"
              style={{ filter: blurPx > 0 ? `blur(${blurPx}px)` : "none" }}
            >
              {question.isCustomSvg ? (
                <NarutoPaintSVG />
              ) : (
                <img
                  src={
                    question.imageUrl ||
                    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500"
                  }
                  alt="Pergunta"
                  className="w-full max-h-[300px] object-contain rounded-lg mx-auto"
                />
              )}
            </div>
          )}

          {/* MÍDIA: VÍDEO */}
          {question.mediaType === "video" && question.videoUrl && (
            <div
              className="w-full max-w-lg my-3 rounded-xl overflow-hidden border-2 border-slate-300 shadow-md bg-black transition-all duration-500"
              style={{ filter: blurPx > 0 ? `blur(${blurPx}px)` : "none" }}
            >
              {question.videoUrl.includes("youtube") ||
              question.videoUrl.includes("youtu.be") ? (
                <iframe
                  src={getYouTubeEmbedUrl(question.videoUrl)}
                  title="Vídeo Quiz"
                  className="w-full h-64 rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={question.videoUrl}
                  controls
                  className="w-full max-h-[320px] rounded-lg"
                />
              )}
            </div>
          )}

          {/* MÍDIA: ÁUDIO */}
          {(question.mediaType === "audio" || question.type === "audio") && (
            <div className="my-4 p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 flex flex-col items-center gap-2 w-full max-w-md shadow-sm">
              <Volume2 className="w-10 h-10 text-blue-600 animate-pulse" />
              <p className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">
                {question.audioEffect === "fast"
                  ? "⚡ Áudio Acelerado (1.35x)"
                  : question.audioEffect === "slow"
                  ? "🐢 Áudio Desacelerado (0.75x)"
                  : "🎵 Áudio da Pergunta"}
              </p>
              <audio
                ref={audioRef}
                src={
                  question.audioUrl ||
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                }
                controls
                className="w-full mt-1"
              />
            </div>
          )}

          {/* TEXTO NA POSIÇÃO ABAIXO */}
          {textPos === "bottom" && <TextComponent />}

          {/* DICA DO HOST PARA REMOVER BORRÃO AO VIVO */}
          {role === "host" && question.blurLevel > 0 && (
            <button
              onClick={() => {
                const nextVal = !hostRevealedBlur;
                setHostRevealedBlur(nextVal);
                if (database)
                  set(ref(database, "game/state/hostRevealedBlur"), nextVal);
              }}
              className="mt-3 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              {hostRevealedBlur ? "Restaurar Borrão" : "Remover Borrão ao Vivo (Dica)"}
            </button>
          )}

          {/* RESPOSTA REVELADA */}
          {showAnswer && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-100 border-2 border-emerald-400 text-emerald-900 text-center w-full max-w-lg animate-fadeIn">
              <span className="text-xs font-black uppercase text-emerald-600 block">
                Resposta Correta:
              </span>
              <p className="text-xl font-black">{question.answer}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              const nextVal = !showAnswer;
              setShowAnswer(nextVal);
              if (database)
                set(ref(database, "game/state/showAnswer"), nextVal);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-lg shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {showAnswer ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            {showAnswer ? "Ocultar Resposta" : "Resposta"}
          </button>

          <div className="text-sm font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-full border border-slate-300">
            Valendo:{" "}
            <span className="text-blue-600 font-extrabold text-base">
              {question.value} Pontos
            </span>
          </div>
        </div>

        {/* PAINEL DO BUZZER */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-900 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              Painel do Buzz Button em Tempo Real
            </h3>
            {role === "host" && (
              <button
                onClick={handleClearBuzz}
                className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Limpar Fila
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center justify-center p-4">
              <button
                onClick={() => handleBuzzerClick(activePlayerId)}
                className="w-40 h-40 rounded-full bg-gradient-to-b from-red-500 via-red-600 to-red-800 hover:from-red-400 hover:to-red-700 active:scale-90 text-white font-black text-2xl shadow-[0_10px_0_rgb(153,27,27)] active:shadow-none active:translate-y-2.5 transition-all border-4 border-red-300 flex flex-col items-center justify-center gap-1 group cursor-pointer"
              >
                <Zap className="w-10 h-10 group-hover:scale-125 transition-all" />
                BZZZZ!
              </button>
              <p className="text-xs text-slate-400 mt-3 font-medium">
                Apertando como:{" "}
                <span className="text-blue-400 font-bold">
                  {players.find((p) => p.id === activePlayerId)?.name ||
                    "Jogador"}
                </span>
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Fila de Resposta ({buzzerQueue.length})
              </h4>

              {buzzerQueue.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-sm italic">
                  Ninguém apertou o botão ainda...
                </div>
              ) : (
                <div className="space-y-2">
                  {buzzerQueue.map((item, index) => (
                    <div
                      key={item.id || index}
                      className={`p-3 rounded-lg flex items-center justify-between border ${
                        index === 0
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-200 font-bold"
                          : "bg-slate-700/50 border-slate-600 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                            index === 0
                              ? "bg-amber-500 text-slate-950"
                              : "bg-slate-600 text-white"
                          }`}
                        >
                          {index + 1}º
                        </span>
                        <span>{item.name}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        {item.formattedTime || "00:00"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {role === "host" && buzzerQueue.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-700 flex gap-2">
                  <button
                    onClick={() => handleScoreAward(true)}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> Acertou (+
                    {selectedQuestion.question.value})
                  </button>
                  <button
                    onClick={() => handleScoreAward(false)}
                    className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow cursor-pointer"
                  >
                    <X className="w-4 h-4" /> Errou (Passa)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- DASHBOARD NO-CODE DO ADM ---
  const renderEditorView = () => (
    <div className="w-full max-w-5xl mx-auto my-4 p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2">
            <Edit3 className="w-7 h-7 text-blue-600" />
            Dashboard de Criação (No-Code)
          </h2>
          <p className="text-sm text-slate-500">
            Adicione Imagens, Áudios, Vídeos, Efeitos de Borrão e Posições de Texto!
          </p>
        </div>

        <button
          onClick={() => {
            const dataStr =
              "data:text/json;charset=utf-8," +
              encodeURIComponent(JSON.stringify(quizData));
            const downloadAnchor = document.createElement("a");
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute(
              "download",
              `quiz_${quizData.title.toLowerCase()}.json`
            );
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow cursor-pointer"
        >
          <Download className="w-4 h-4" /> Baixar Quiz (JSON)
        </button>
      </div>

      <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200">
        <label className="block text-xs font-bold text-blue-900 uppercase mb-1">
          Título do Jogo
        </label>
        <input
          type="text"
          value={quizData.title}
          onChange={(e) =>
            saveQuizDataLocally({ ...quizData, title: e.target.value })
          }
          className="w-full px-4 py-2 rounded-xl border border-blue-300 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <div className="space-y-6">
        {quizData.categories.map((cat, cIdx) => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => {
                    const updated = [...quizData.categories];
                    updated[cIdx].name = e.target.value;
                    saveQuizDataLocally({ ...quizData, categories: updated });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="md:col-span-8">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Descrição (Hover do Player)
                </label>
                <input
                  type="text"
                  value={cat.description}
                  onChange={(e) => {
                    const updated = [...quizData.categories];
                    updated[cIdx].description = e.target.value;
                    saveQuizDataLocally({ ...quizData, categories: updated });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* PERGUNTAS EXPANDIDAS COM CONTROLES DE MÍDIA */}
            <div className="space-y-4 mt-4 pt-3 border-t border-slate-200">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Perguntas, Mídias e Efeitos ({cat.questions.length})
              </h4>

              <div className="space-y-4">
                {cat.questions.map((q, qIdx) => (
                  <div
                    key={q.level}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
                  >
                    {/* LINHA 1: NÍVEL, TIPO DE MÍDIA, ENUNCIADO E RESPOSTA */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 text-xs">
                      <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm shrink-0">
                        {q.level}
                      </span>

                      {/* SELETOR DE MÍDIA */}
                      <select
                        value={q.mediaType || "text"}
                        onChange={(e) => {
                          const updatedCat = [...quizData.categories];
                          updatedCat[cIdx].questions[qIdx].mediaType =
                            e.target.value;
                          saveQuizDataLocally({
                            ...quizData,
                            categories: updatedCat,
                          });
                        }}
                        className="bg-slate-100 font-bold text-slate-700 px-2 py-2 rounded-xl border border-slate-300 focus:outline-none"
                      >
                        <option value="text">📝 Somente Texto</option>
                        <option value="image">🖼️ Imagem</option>
                        <option value="audio">🎧 Áudio</option>
                        <option value="video">🎬 Vídeo</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Pergunta / Enunciado..."
                        value={q.content}
                        onChange={(e) => {
                          const updatedCat = [...quizData.categories];
                          updatedCat[cIdx].questions[qIdx].content =
                            e.target.value;
                          saveQuizDataLocally({
                            ...quizData,
                            categories: updatedCat,
                          });
                        }}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                      />

                      <input
                        type="text"
                        placeholder="Resposta correta..."
                        value={q.answer}
                        onChange={(e) => {
                          const updatedCat = [...quizData.categories];
                          updatedCat[cIdx].questions[qIdx].answer =
                            e.target.value;
                          saveQuizDataLocally({
                            ...quizData,
                            categories: updatedCat,
                          });
                        }}
                        className="w-full md:w-48 px-3 py-2 rounded-xl border border-slate-200 font-bold text-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    {/* LINHA 2: CAMPOS DE MÍDIA (URLS E EFEITOS) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
                      {/* URL DA MÍDIA */}
                      <div className="sm:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Link da Mídia (ou arquivo na pasta public)
                        </label>
                        {q.mediaType === "image" && (
                          <input
                            type="text"
                            placeholder="URL da Imagem..."
                            value={q.imageUrl || ""}
                            onChange={(e) => {
                              const updatedCat = [...quizData.categories];
                              updatedCat[cIdx].questions[qIdx].imageUrl =
                                e.target.value;
                              saveQuizDataLocally({
                                ...quizData,
                                categories: updatedCat,
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-slate-50"
                          />
                        )}
                        {q.mediaType === "audio" && (
                          <input
                            type="text"
                            placeholder="URL do Áudio (MP3)..."
                            value={q.audioUrl || ""}
                            onChange={(e) => {
                              const updatedCat = [...quizData.categories];
                              updatedCat[cIdx].questions[qIdx].audioUrl =
                                e.target.value;
                              saveQuizDataLocally({
                                ...quizData,
                                categories: updatedCat,
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-slate-50"
                          />
                        )}
                        {q.mediaType === "video" && (
                          <input
                            type="text"
                            placeholder="URL do Vídeo (YouTube ou MP4)..."
                            value={q.videoUrl || ""}
                            onChange={(e) => {
                              const updatedCat = [...quizData.categories];
                              updatedCat[cIdx].questions[qIdx].videoUrl =
                                e.target.value;
                              saveQuizDataLocally({
                                ...quizData,
                                categories: updatedCat,
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-slate-50"
                          />
                        )}
                        {(!q.mediaType || q.mediaType === "text") && (
                          <span className="text-slate-400 italic block py-1.5">
                            Sem mídia anexa
                          </span>
                        )}
                      </div>

                      {/* CONTROLE DE BORRÃO / EFEITO DE ÁUDIO */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Efeito Especial de Dificuldade
                        </label>
                        {(q.mediaType === "image" || q.mediaType === "video") && (
                          <select
                            value={q.blurLevel || 0}
                            onChange={(e) => {
                              const updatedCat = [...quizData.categories];
                              updatedCat[cIdx].questions[qIdx].blurLevel =
                                Number(e.target.value);
                              saveQuizDataLocally({
                                ...quizData,
                                categories: updatedCat,
                              });
                            }}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-700 bg-slate-50"
                          >
                            <option value={0}>✨ Imagem Limpa (0px)</option>
                            <option value={6}>🔍 Borrão Leve (6px)</option>
                            <option value={12}>🌫️ Borrão Médio (12px)</option>
                            <option value={20}>🧩 Borrão Forte (20px)</option>
                          </select>
                        )}
                        {q.mediaType === "audio" && (
                          <select
                            value={q.audioEffect || "none"}
                            onChange={(e) => {
                              const updatedCat = [...quizData.categories];
                              updatedCat[cIdx].questions[qIdx].audioEffect =
                                e.target.value;
                              saveQuizDataLocally({
                                ...quizData,
                                categories: updatedCat,
                              });
                            }}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-700 bg-slate-50"
                          >
                            <option value="none">🎵 Áudio Normal</option>
                            <option value="fast">⚡ Acelerado (1.35x)</option>
                            <option value="slow">🐢 Desacelerado (0.75x)</option>
                          </select>
                        )}
                        {(!q.mediaType || q.mediaType === "text") && (
                          <span className="text-slate-400 italic block py-1.5">
                            Nenhum efeito
                          </span>
                        )}
                      </div>

                      {/* POSIÇÃO DO TEXTO */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Posição do Enunciado
                        </label>
                        <select
                          value={q.textPosition || "top"}
                          onChange={(e) => {
                            const updatedCat = [...quizData.categories];
                            updatedCat[cIdx].questions[qIdx].textPosition =
                              e.target.value;
                            saveQuizDataLocally({
                              ...quizData,
                              categories: updatedCat,
                            });
                          }}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-700 bg-slate-50"
                        >
                          <option value="top">⬆️ Texto Acima da Mídia</option>
                          <option value="bottom">⬇️ Texto Abaixo da Mídia</option>
                          <option value="overlay">🏷️ Legenda Flutuante (Overlay)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- GERENCIADOR DE JOGADORES ---
  const renderPlayersView = () => (
    <div className="w-full max-w-4xl mx-auto my-4 p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-2xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            Gerenciador de Jogadores & Placar
          </h2>
          <p className="text-sm text-slate-500">
            Adicione novos participantes, ajuste pontuações ou remova quem saiu.
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nome do novo amigo/jogadora..."
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <button
          onClick={handleAddPlayer}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Adicionar
        </button>
      </div>

      <div className="space-y-3">
        {players.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${p.color}`} />
              <span className="font-extrabold text-slate-800 text-base">
                {p.name}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-xl border border-slate-300">
                <button
                  onClick={() => handleUpdateScore(p.id, -50)}
                  className="px-2 py-0.5 text-xs font-black text-red-500 hover:bg-red-50 rounded cursor-pointer"
                >
                  -50
                </button>
                <span className="font-black text-blue-600 px-2">
                  {p.score} pts
                </span>
                <button
                  onClick={() => handleUpdateScore(p.id, 50)}
                  className="px-2 py-0.5 text-xs font-black text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                >
                  +50
                </button>
              </div>

              <button
                onClick={() => handleRemovePlayer(p.id)}
                className="p-2 text-rose-500 hover:bg-rose-100 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- MINIGAMES ---
  const renderMinigamesView = () => (
    <div className="w-full max-w-4xl mx-auto my-4 p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-2xl text-center">
      <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3 animate-spin" />
      <h2 className="text-3xl font-black text-slate-800 mb-2">
        Eventos Surpresa & Minigames
      </h2>
      <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6">
        Gire a roleta de eventos durante a partida para acionar desafios como
        Gartic, Stop e Bônus!
      </p>

      <button
        onClick={() => {
          const randomEv =
            RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
          setActiveEvent(randomEv);
        }}
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all mb-8 flex items-center justify-center gap-2 mx-auto cursor-pointer"
      >
        <Dices className="w-6 h-6" /> Sortear Evento Surpresa!
      </button>

      {activeEvent && (
        <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 mb-8 max-w-lg mx-auto animate-fadeIn shadow-lg">
          <h3 className="text-2xl font-black mb-2">{activeEvent.title}</h3>
          <p className="text-sm font-medium">{activeEvent.desc}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl">
          <PenTool className="w-8 h-8 mb-2 text-purple-200" />
          <h3 className="font-bold text-lg mb-1">Gartic Express</h3>
          <p className="text-xs text-purple-100">
            O jogador sorteado tem 45 segundos para desenhar no Paint uma
            palavra secreta do Host!
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-xl">
          <Hash className="w-8 h-8 mb-2 text-pink-200" />
          <h3 className="font-bold text-lg mb-1">Stop Anime</h3>
          <p className="text-xs text-pink-100">
            Aparece uma letra na tela. O primeiro a responder 3 elementos ganha
            ponto bônus!
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl">
          <Crown className="w-8 h-8 mb-2 text-amber-200" />
          <h3 className="font-bold text-lg mb-1">Ladrão de Pontos</h3>
          <p className="text-xs text-amber-100">
            O jogador da lanterna pode roubar 150 pontos do líder do placar!
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 via-indigo-200 to-purple-300 font-sans text-slate-800 p-3 sm:p-6 select-none relative overflow-x-hidden">
      {/* MODAL DE AUTENTICAÇÃO DA SENHA DO HOST */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => {
                setShowAuthModal(false);
                setPasswordInput("");
                setAuthError("");
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 border-2 border-amber-300">
                <KeyRound className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">
                Acesso do Host (ADM)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Digite a senha do administrador para comandar a partida.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Digite a senha (padrão: 1234)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-center font-bold text-xl tracking-widest focus:border-amber-500 focus:outline-none bg-slate-50"
                />
                {authError && (
                  <p className="text-xs font-bold text-rose-500 text-center mt-2">
                    {authError}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-600 text-sm transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 font-extrabold text-slate-950 text-sm shadow-md transition-all cursor-pointer"
                >
                  Entrar como Host
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BARRA SUPERIOR DE NAVEGAÇÃO */}
      <header className="w-full max-w-6xl mx-auto mb-4 bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-white shadow-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600 text-white">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-base sm:text-lg leading-tight">
              Anime & Games Quiz
            </h1>
            <span className="text-xs text-slate-400">
              Estúdio de Jogos Online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => handleTabChange("board")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              currentTab === "board"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Tabuleiro
          </button>

          {role === "host" && (
            <>
              <button
                onClick={() => handleTabChange("editor")}
                className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  currentTab === "editor"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Editor ADM
              </button>
              <button
                onClick={() => handleTabChange("players")}
                className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  currentTab === "players"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Jogadores
              </button>
            </>
          )}

          <button
            onClick={() => handleTabChange("minigames")}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
              currentTab === "minigames"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Minigames
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => handleRoleSwitch("host")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                role === "host"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400"
              }`}
            >
              <Crown className="w-3.5 h-3.5" /> Host (ADM)
            </button>
            <button
              onClick={() => handleRoleSwitch("player")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                role === "player"
                  ? "bg-blue-500 text-white shadow"
                  : "text-slate-400"
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Jogador
            </button>
          </div>

          {isHostAuthenticated && (
            <button
              onClick={handleLockHost}
              title="Sair do Modo Host"
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          <select
            value={activePlayerId}
            onChange={(e) => setActivePlayerId(e.target.value)}
            className="bg-slate-800 text-white text-xs font-bold px-2 py-1.5 rounded-xl border border-slate-700 focus:outline-none cursor-pointer"
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* PLACAR DOS JOGADORES */}
      <div className="w-full max-w-6xl mx-auto mb-4 grid grid-cols-3 gap-3">
        {players.map((p) => (
          <div
            key={p.id}
            className={`p-3 rounded-2xl bg-white/80 backdrop-blur-md border shadow-md flex items-center justify-between transition-all ${
              activePlayerId === p.id
                ? "ring-2 ring-blue-500 border-blue-400"
                : "border-white/60"
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className={`w-3 h-3 rounded-full ${p.color}`} />
              <span className="font-extrabold text-slate-800 text-xs sm:text-sm truncate">
                {p.name}
              </span>
            </div>
            <span className="font-black text-blue-600 text-sm sm:text-base">
              {p.score} pts
            </span>
          </div>
        ))}
      </div>

      <main className="w-full">
        {currentTab === "board" && renderBoardView()}
        {currentTab === "question" && renderQuestionView()}
        {currentTab === "editor" && renderEditorView()}
        {currentTab === "players" && renderPlayersView()}
        {currentTab === "minigames" && renderMinigamesView()}
      </main>
    </div>
  );
}