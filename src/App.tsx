import React, { useState, useEffect } from "react";
import { 
  Dumbbell, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Lock, 
  Unlock,
  CheckCircle, 
  Plus, 
  Trash2, 
  RefreshCw, 
  MessageSquare, 
  Send, 
  PhoneCall, 
  User as UserIcon, 
  Eye, 
  ChevronRight, 
  Compass, 
  LogOut, 
  Paintbrush, 
  Activity, 
  Sparkles, 
  Clock, 
  BadgeAlert, 
  Heart, 
  UserCheck, 
  MessageCircle,
  QrCode,
  Check,
  Percent,
  Weight,
  Layers,
  ArrowUpRight,
  UserX,
  PlusCircle,
  FileText,
  Sun,
  Moon
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar,
  AreaChart,
  Area
} from "recharts";
import { User, Evaluation, Workout, Message, PaymentInvoice, WorkoutHistory, Diet } from "./types";

// Dynamic Accent Color Definitions
const THEMES = [
  { id: "emerald", name: "Verde Fitness", primary: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-neutral-950", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-600/20 dark:border-emerald-500/20", focus: "focus:ring-emerald-500", bgAccent: "bg-emerald-50 dark:bg-emerald-500/10", tag: "emerald" },
  { id: "violet", name: "Violeta Profissional", primary: "bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400 text-white dark:text-neutral-950", text: "text-violet-600 dark:text-violet-400", border: "border-violet-600/20 dark:border-violet-500/20", focus: "focus:ring-violet-500", bgAccent: "bg-violet-50 dark:bg-violet-500/10", tag: "violet" },
  { id: "cyan", name: "Azul Atlético", primary: "bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-neutral-950", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-600/20 dark:border-cyan-500/20", focus: "focus:ring-cyan-500", bgAccent: "bg-cyan-50 dark:bg-cyan-500/10", tag: "cyan" },
  { id: "rose", name: "Rosa Intenso", primary: "bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400 text-white dark:text-neutral-950", text: "text-rose-600 dark:text-rose-400", border: "border-rose-600/20 dark:border-rose-500/20", focus: "focus:ring-rose-500", bgAccent: "bg-rose-50 dark:bg-rose-500/10", tag: "rose" },
  { id: "amber", name: "Âmbar Estimulante", primary: "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-neutral-950", text: "text-amber-600 dark:text-amber-400", border: "border-amber-600/20 dark:border-amber-500/20", focus: "focus:ring-amber-500", bgAccent: "bg-amber-50 dark:bg-amber-500/10", tag: "amber" },
];

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("avaliafit_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Active Highlight Theme Set
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem("avaliafit_theme") || "emerald";
  });
  const theme = THEMES.find((t) => t.id === activeTheme) || THEMES[0];

  // Light/Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("avaliafit_darkmode");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("avaliafit_darkmode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Global App States - Admin perspective
  const [clients, setClients] = useState<User[]>([]);
  const [activeClientPhone, setActiveClientPhone] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [payments, setPayments] = useState<PaymentInvoice[]>([]);
  const [totalInBox, setTotalInBox] = useState(0);

  // PIX Settings States
  const [pixKey, setPixKey] = useState("41984842941");
  const [pixQrCode, setPixQrCode] = useState("");
  const [formPixKey, setFormPixKey] = useState("");
  const [formPixQrCode, setFormPixQrCode] = useState("");

  // Focus view details (Evaluations, Workouts, Diets, Completed log metrics)
  const [clientEvaluations, setClientEvaluations] = useState<Evaluation[]>([]);
  const [clientWorkouts, setClientWorkouts] = useState<Workout[]>([]);
  const [clientDiets, setClientDiets] = useState<Diet[]>([]);
  const [workoutLogHistory, setWorkoutLogHistory] = useState<WorkoutHistory[]>([]);
  const [currentSelectedEvaluation, setCurrentSelectedEvaluation] = useState<Evaluation | null>(null);
  const [currentSelectedDiet, setCurrentSelectedDiet] = useState<Diet | null>(null);

  // Forms States - Diets
  const [newDietTitle, setNewDietTitle] = useState("");
  const [newDietDate, setNewDietDate] = useState(new Date().toISOString().slice(0, 10));
  const [newDietDescription, setNewDietDescription] = useState("");

  // Forms States - Client management
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientPassword, setNewClientPassword] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [newClientAge, setNewClientAge] = useState("");
  const [newClientWeight, setNewClientWeight] = useState("");
  const [newClientHeight, setNewClientHeight] = useState("");
  const [newClientIssue, setNewClientIssue] = useState("");
  const [newClientGoal, setNewClientGoal] = useState("Ganho de Massa");
  const [newClientIsDemo, setNewClientIsDemo] = useState(false);
  const [newClientPaymentDay, setNewClientPaymentDay] = useState("10");

  // Forms States - Physical Evaluations
  const [evalDate, setEvalDate] = useState(new Date().toISOString().slice(0, 10));
  const [evalWeight, setEvalWeight] = useState("");
  const [evalHeight, setEvalHeight] = useState("");
  const [evalNeck, setEvalNeck] = useState("");
  const [evalChest, setEvalChest] = useState("");
  const [evalWaist, setEvalWaist] = useState("");
  const [evalAbdomen, setEvalAbdomen] = useState("");
  const [evalHips, setEvalHips] = useState("");
  const [evalArmR, setEvalArmR] = useState("");
  const [evalArmL, setEvalArmL] = useState("");
  const [evalThighR, setEvalThighR] = useState("");
  const [evalThighL, setEvalThighL] = useState("");
  const [evalCalfR, setEvalCalfR] = useState("");
  const [evalCalfL, setEvalCalfL] = useState("");
  const [evalPhotoFront, setEvalPhotoFront] = useState<string>("");
  const [evalPhotoSide, setEvalPhotoSide] = useState<string>("");

  // Forms States - Exercises Workouts
  const [wName, setWName] = useState("");
  const [wSets, setWSets] = useState("3");
  const [wReps, setWReps] = useState("12");
  const [wLoad, setWLoad] = useState("");
  const [wVideo, setWVideo] = useState("");
  const [wNotes, setWNotes] = useState("");

  // Forms States - Swap message
  const [swapWorkoutId, setSwapWorkoutId] = useState<number | null>(null);
  const [swapWorkoutName, setSwapWorkoutName] = useState("");
  const [swapReason, setSwapReason] = useState("");
  const [showSwapModal, setShowSwapModal] = useState(false);

  // Refreshes core collections
  const loadSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) {
        if (data.settings.pix_key) {
          setPixKey(data.settings.pix_key);
          setFormPixKey(data.settings.pix_key);
        }
        if (data.settings.pix_qrcode) {
          setPixQrCode(data.settings.pix_qrcode);
          setFormPixQrCode(data.settings.pix_qrcode);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
    }
  };

  const handleSavePixSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pix_key: formPixKey,
          pix_qrcode: formPixQrCode
        })
      });
      if (res.ok) {
        alert("Configurações do PIX salvas com sucesso!");
        loadSettings();
      } else {
        alert("Erro ao salvar configurações do PIX.");
      }
    } catch (err: any) {
      alert("Erro de rede: " + err.message);
    }
  };

  const loadAdminAllData = async () => {
    try {
      loadSettings();
      const resU = await fetch("/api/users");
      const dataU = await resU.json();
      if (dataU.users) setClients(dataU.users);

      const resM = await fetch("/api/messages");
      const dataM = await resM.json();
      if (dataM.messages) setMessages(dataM.messages);

      const resP = await fetch("/api/finance/payments");
      const dataP = await resP.json();
      if (dataP.payments) setPayments(dataP.payments);

      const resS = await fetch("/api/finance/stats");
      const dataS = await resS.json();
      if (dataS.totalInBox !== undefined) setTotalInBox(dataS.totalInBox);
    } catch (err) {
      console.error("Erro ao ler informações administrativas:", err);
    }
  };

  const loadFocusedClientData = async (phone: string) => {
    try {
      const resEv = await fetch(`/api/users/${phone}/evaluations`);
      const dataEv = await resEv.json();
      if (dataEv.evaluations) {
        setClientEvaluations(dataEv.evaluations);
        if (dataEv.evaluations.length > 0) {
          setCurrentSelectedEvaluation(dataEv.evaluations[0]);
        } else {
          setCurrentSelectedEvaluation(null);
        }
      }

      const resWr = await fetch(`/api/users/${phone}/workouts`);
      const dataWr = await resWr.json();
      if (dataWr.workouts) setClientWorkouts(dataWr.workouts);

      const resHi = await fetch(`/api/users/${phone}/workout-history`);
      const dataHi = await resHi.json();
      if (dataHi.history) setWorkoutLogHistory(dataHi.history);

      const resDi = await fetch(`/api/users/${phone}/diets`);
      const dataDi = await resDi.json();
      if (dataDi.diets) {
        setClientDiets(dataDi.diets);
        if (dataDi.diets.length > 0) {
          setCurrentSelectedDiet(dataDi.diets[0]);
        } else {
          setCurrentSelectedDiet(null);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
    }
  };

  const handleAddDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClientPhone) {
      alert("Selecione um aluno antes de registrar a dieta.");
      return;
    }
    if (!newDietTitle || !newDietDescription) {
      alert("Insira título e detalhes da dieta!");
      return;
    }

    try {
      const res = await fetch("/api/diets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_phone: activeClientPhone,
          diet_date: newDietDate,
          title: newDietTitle,
          description: newDietDescription
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erro ao salvar dieta");
        return;
      }

      alert("Plano alimentar / Dieta registrada com sucesso!");
      setNewDietTitle("");
      setNewDietDescription("");
      loadFocusedClientData(activeClientPhone);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteDiet = async (id: number) => {
    if (!confirm("Excluir definitivamente este plano alimentar?")) return;
    try {
      const res = await fetch(`/api/diets/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadFocusedClientData(activeClientPhone);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Ping online signals
  useEffect(() => {
    if (!currentUser) return;

    // Send online beat right away
    fetch("/api/ping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: currentUser.phone })
    }).catch(console.error);

    const pingInterval = setInterval(() => {
      fetch("/api/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: currentUser.phone })
      }).catch(console.error);
    }, 60000); // 1 minute interval

    return () => clearInterval(pingInterval);
  }, [currentUser]);

  // Load settings on startup
  useEffect(() => {
    loadSettings();
  }, []);

  // Handle bootstrap for logged user
  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === "admin") {
      loadAdminAllData();
    } else {
      loadFocusedClientData(currentUser.phone);
    }
  }, [currentUser]);

  // Load target client when selected by Personal Coach
  useEffect(() => {
    if (activeClientPhone) {
      loadFocusedClientData(activeClientPhone);
    }
  }, [activeClientPhone]);

  // Save changes to localStorage on theme adjust
  const handleThemeChange = (newTheme: string) => {
    setActiveTheme(newTheme);
    localStorage.setItem("avaliafit_theme", newTheme);
  };

  // Auth Operations
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: loginPhone, password: loginPassword })
      });
      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || "Erro de login");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("avaliafit_user", JSON.stringify(data.user));
      setCurrentUser(data.user);
      setIsLoading(false);
    } catch (err: any) {
      setLoginError("Servidor indisponível ou erro inesperado.");
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("avaliafit_user");
    setCurrentUser(null);
    setClients([]);
    setClientEvaluations([]);
    setClientWorkouts([]);
    setWorkoutLogHistory([]);
    setCurrentSelectedEvaluation(null);
    setActiveClientPhone("");
  };

  // Base64 file loaders to handle avatar and comparison images offline persistent format
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: "avatar" | "front" | "side" | "pix") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (target === "avatar" && currentUser) {
        // Direct profile update
        fetch(`/api/users/${currentUser.phone}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: base64 })
        })
          .then(r => r.json())
          .then((d) => {
            const updated = { ...currentUser, avatar: base64 };
            localStorage.setItem("avaliafit_user", JSON.stringify(updated));
            setCurrentUser(updated);
          });
      } else if (target === "front") {
        setEvalPhotoFront(base64);
      } else if (target === "side") {
        setEvalPhotoSide(base64);
      } else if (target === "pix") {
        setFormPixQrCode(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // Client CRUD Actions (Admin/Personal only)
  const handleRegisterClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientPhone || !newClientPassword || !newClientName) {
      alert("Por favor preencha celular, senha e nome completo");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: newClientPhone,
          password: newClientPassword,
          name: newClientName,
          age: Number(newClientAge) || 25,
          weight: Number(newClientWeight) || 70,
          height: Number(newClientHeight) || 1.70,
          physical_issue: newClientIssue,
          main_goal: newClientGoal,
          is_demo: newClientIsDemo,
          payment_day: Number(newClientPaymentDay) || 10
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erro ao registrar usuário");
        return;
      }

      alert("Aluno(a) cadastrado(a) com sucesso!");
      // Reset state inputs
      setNewClientPhone("");
      setNewClientPassword("");
      setNewClientName("");
      setNewClientAge("");
      setNewClientWeight("");
      setNewClientHeight("");
      setNewClientIssue("");
      setNewClientIsDemo(false);
      setNewClientPaymentDay("10");
      // refresh collections
      loadAdminAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditUserStatus = async (phone: string, updates: Partial<User>) => {
    try {
      const res = await fetch(`/api/users/${phone}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        loadAdminAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClient = async (phone: string) => {
    if (!confirm("Tem certeza que deseja remover este aluno(a) da base? Esta ação é irreversível.")) return;

    try {
      const res = await fetch(`/api/users/${phone}`, { method: "DELETE" });
      if (res.ok) {
        alert("Aluno excluído com sucesso.");
        if (activeClientPhone === phone) {
          setActiveClientPhone("");
        }
        loadAdminAllData();
      } else {
        const error = await res.json();
        alert(error.error || "Remoção mal-sucedida");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Workout Manager
  const handleAddWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClientPhone) {
      alert("Selecione um aluno na lista circular acima antes de adicionar exercícios.");
      return;
    }
    if (!wName || !wSets || !wReps) {
      alert("Preencha o nome, séries e repetições do exercício.");
      return;
    }

    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_phone: activeClientPhone,
          name: wName,
          sets: Number(wSets),
          reps: wReps,
          weight_load: wLoad,
          video_url: wVideo,
          notes: wNotes
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erro ao adicionar exercício");
        return;
      }

      setWName("");
      setWLoad("");
      setWVideo("");
      setWNotes("");
      loadFocusedClientData(activeClientPhone);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteWorkout = async (id: number) => {
    if (!confirm("Excluir este exercício do treino deste aluno?")) return;
    try {
      const res = await fetch(`/api/workouts/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadFocusedClientData(activeClientPhone);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Workout Logging Accomplishments
  const handleMarkCompleted = async (workoutId: number) => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/workout-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_phone: currentUser.phone,
          workout_id: workoutId
        })
      });

      if (res.ok) {
        loadFocusedClientData(currentUser.phone);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Physical Evaluation Builder (Personal only)
  const handleAddEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClientPhone) {
      alert("Selecione um aluno antes de registrar avaliação.");
      return;
    }
    if (!evalWeight || !evalHeight) {
      alert("Insira peso e altura!");
      return;
    }

    try {
      const res = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_phone: activeClientPhone,
          eval_date: evalDate,
          weight: evalWeight,
          height: evalHeight,
          neck: evalNeck,
          chest: evalChest,
          waist: evalWaist,
          abdomen: evalAbdomen,
          hips: evalHips,
          arm_right: evalArmR,
          arm_left: evalArmL,
          thigh_right: evalThighR,
          thigh_left: evalThighL,
          calf_right: evalCalfR,
          calf_left: evalCalfL,
          photo_front: evalPhotoFront,
          photo_side: evalPhotoSide
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erro ao salvar avaliação física");
        return;
      }

      alert("Avaliação Física realizada e compilada!");
      // Reset Assessment Inputs
      setEvalWeight("");
      setEvalHeight("");
      setEvalNeck("");
      setEvalChest("");
      setEvalWaist("");
      setEvalAbdomen("");
      setEvalHips("");
      setEvalArmR("");
      setEvalArmL("");
      setEvalThighR("");
      setEvalThighL("");
      setEvalCalfR("");
      setEvalCalfL("");
      setEvalPhotoFront("");
      setEvalPhotoSide("");

      // reload focused context
      loadFocusedClientData(activeClientPhone);
      loadAdminAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteEvaluation = async (id: number) => {
    if (!confirm("Excluir definitivamente esta avaliação física?")) return;
    try {
      const res = await fetch(`/api/evaluations/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadFocusedClientData(activeClientPhone);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Swap requests handler
  const handleSwapRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!swapReason) {
      alert("Preencha o motivo para solicitar a troca.");
      return;
    }

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_phone: currentUser.phone,
          workout_id: swapWorkoutId,
          workout_name: swapWorkoutName,
          reason: swapReason
        })
      });

      if (res.ok) {
        alert("Sua solicitação de troca de exercício foi enviada com sucesso para a instrutora!");
        setShowSwapModal(false);
        setSwapReason("");
      } else {
        const d = await res.json();
        alert(d.error || "Erro ao despachar solicitação");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleResolveMessage = async (id: number) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Resolvido" })
      });
      if (res.ok) {
        loadAdminAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Financial Toggles
  const handleTogglePayment = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Pago" ? "Pendente" : "Pago";
    try {
      const res = await fetch(`/api/payments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        loadAdminAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic WhatsApp Report Generator Format Link
  const triggerWhatsAppReport = (phone: string, name: string, evalObj: Evaluation) => {
    const number = phone.replace(/\D/g, "");
    const formattedPhone = number.startsWith("55") ? number : `55${number}`;
    
    const message = `*AvaliaFit - Relatório Mensal de Avaliação Física*\n\n` +
      `Olá, *${name}*! Segue o resultado do seu progresso acumulado na plataforma:\n\n` +
      `📅 *Data da Avaliação:* ${new Date(evalObj.eval_date).toLocaleDateString("pt-BR")}\n` +
      `⚖️ *Peso:* ${evalObj.weight} kg  |  📏 *Altura:* ${evalObj.height} m\n` +
      `📊 *IMC (Índice de Massa Corporal):* ${evalObj.imc} (${evalObj.imc < 18.5 ? "Baixo Peso" : evalObj.imc < 25 ? "Peso ideal" : "Sobrepeso"})\n` +
      `🔥 *Gordura Corporal (Cálculo Automático):* ${evalObj.body_fat}%\n\n` +
      `📏 *Medidas Corporais (Mandatórias):*\n` +
      `- Pescoço: ${evalObj.neck} cm\n` +
      `- Tórax: ${evalObj.chest} cm\n` +
      `- Cintura: ${evalObj.waist} cm\n` +
      `- Abdômen: ${evalObj.abdomen} cm\n` +
      `- Quadril: ${evalObj.hips} cm\n` +
      `- Braço Dir: ${evalObj.arm_right} cm  |  Braço Esq: ${evalObj.arm_left} cm\n` +
      `- Coxa Dir: ${evalObj.thigh_right} cm  |  Coxa Esq: ${evalObj.thigh_left} cm\n` +
      `- Panturrilha Dir: ${evalObj.calf_right} cm | Panturrilha Esq: ${evalObj.calf_left} cm\n\n` +
      `💪 Continue focado(a). A consistência física vence qualquer dificuldade!`;
    
    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encoded}`, "_blank");
  };

  // WhatsApp PIX Signal confirmation by Client completão
  const triggerWhatsAppPixReceipt = (userObj: User) => {
    const targetAdminPhone = "5541984842941";
    const msg = `Olá Personal! Acabo de efetuar o pagamento da minha mensalidade do plano completo no valor de R$150,00 via PIX QR Code. Segue em anexo o comprovante impresso ou screenshot do aplicativo do meu banco para que você possa dar baixa no sistema! Obrigado(a).\n\nAluno(a): *${userObj.name}*\nCelular: *${userObj.phone}*`;
    window.open(`https://api.whatsapp.com/send?phone=${targetAdminPhone}&text=${encodeURIComponent(msg)}`, "_blank");
  };

  // Rotative meal recommendations for completo vs. static single recommendation for demo
  const mealTips = [
    { title: "Panqueca de Aveia Hiperproteica", desc: "Use 2 claras, 1 ovo inteiro, 40g de aveia fina e 1 banana amassada. Misture e doure em frigideira antiaderente. Acompanhe com mel ou geleia sem açúcar.", target: "Ganho de Massa / Emagrecimento" },
    { title: "Bowl de Iogurte com Whey e Frutas Vermelhas", desc: "150g de iogurte natural desnatado, 30g de whey protein e 50g de morangos ou mirtilos triturados. Fonte rápida de micronutrientes e aminoácidos essenciais.", target: "Definição Muscular" },
    { title: "Arroz Integral com Sobrecoxa Grelhada e Brócolis", desc: "100g de arroz integral, 120g de sobrecoxa de frango assada sem pele bem temperada e 80g de brócolis no vapor para reposição de carboidratos e lipídios saudáveis.", target: "Post-Workout" },
    { title: "Omelete de Espinafre com Queijo Branco", desc: "3 ovos mexidos, espinafre fresco à vontade e 40g de queijo minas frescal. Cozinhe em fogo brando. Perfeito para manter a saciedade por mais horas.", target: "Perda de Peso" },
  ];

  // If client is logged and frozen, we handle their restricted screen fallback
  if (currentUser && currentUser.role === "client" && currentUser.is_frozen) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-neutral-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-red-600"></div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 mb-6">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight mb-2">Conta Congelada</h1>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
              Olá, <strong className="text-white">{currentUser.name}</strong>. Constatamos que sua mensalidade está pendente há mais de 4 dias do seu dia de pagamento previsto (Dia {currentUser.payment_day}). Para continuar de forma consistente o acompanhamento de peso, medidas corporais automáticas, fotos de progresso e treinos, realize o pagamento via PIX.
            </p>

            {/* Pix Section details */}
            <div className="bg-neutral-955 bg-neutral-950 p-4 rounded-xl border border-neutral-800 mb-6 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-400 font-mono">CHAVE PIX CNPJ / CELULAR:</span>
                <span className={`text-xs ${theme.text} font-bold`}>{pixKey}</span>
              </div>
              <div className="text-sm font-sans font-medium text-neutral-200 mb-4 text-center">
                Chave Celular Personal: <strong className="text-white">{pixKey}</strong>
              </div>
              
              {/* Manual QR Code graphics */}
              {pixQrCode ? (
                <div className="bg-white p-2 rounded-xl mx-auto w-40 h-40 flex items-center justify-center">
                  <img src={pixQrCode} alt="QR Code PIX" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="bg-white p-3 rounded-xl mx-auto w-40 h-40 flex items-center justify-center">
                  <div className="text-center text-neutral-900 font-mono text-[9px] font-bold">
                    <QrCode className="w-28 h-28 mx-auto mb-1 text-black" />
                    PIX AVALIAFIT
                  </div>
                </div>
              )}
              <p className="text-center text-[11px] text-neutral-500 mt-2">
                Valor mensalidade: <strong className="text-neutral-300">R$ 150,00</strong>
              </p>
            </div>

            <button
              id="send_proof_locked_btn"
              onClick={() => triggerWhatsAppPixReceipt(currentUser)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-neutral-900 font-bold rounded-xl transition duration-200 flex items-center justify-center gap-2 mb-4 cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              Sinalizar por WhatsApp
            </button>

            <button
              id="back_to_login_frozen_btn"
              onClick={handleLogout}
              className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl text-sm transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Voltar ao Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Dynamic Header Navbar with Active Custom Accents */}
      <header className="border-b border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${theme.bgAccent} ${theme.text}`}>
            <Dumbbell className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
              AvaliaFit <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 font-normal">Health & Assessment Portal</span>
            </h1>
            <p className="text-[11px] text-neutral-500 font-mono">CONEXÃO NEON: ONLINE e SEGURO</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          
          {/* Real-time Theme customization dropdown option */}
          <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <Paintbrush className="w-4 h-4 text-neutral-550 text-neutral-500 dark:text-neutral-400" />
            <select 
              id="theme_dropdown_picker"
              value={activeTheme} 
              onChange={(e) => handleThemeChange(e.target.value)}
              className="bg-transparent text-xs text-neutral-800 dark:text-neutral-200 font-medium focus:outline-none cursor-pointer"
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id} className="bg-white dark:bg-neutral-900 text-neutral-850 text-neutral-900 dark:text-neutral-100">{t.name}</option>
              ))}
            </select>
          </div>

          {/* Light/Dark mode toggler switch */}
          <button
            id="light_dark_toggle_btn"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white rounded-lg border border-neutral-200 dark:border-neutral-800 transition cursor-pointer"
            title={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-violet-600" />}
          </button>

          {currentUser && (
            <div className="flex items-center gap-3 pl-2 border-l border-neutral-200 dark:border-neutral-800">
              <div className="relative">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-855 dark:bg-neutral-800 flex items-center justify-center text-sm font-bold text-neutral-700 dark:text-neutral-200 uppercase border border-neutral-200 dark:border-neutral-700">
                    {currentUser.name.slice(0, 2)}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-neutral-950"></span>
              </div>
              <div className="text-left hidden md:block">
                <span className="text-xs text-neutral-550 text-neutral-500 dark:text-neutral-400 block font-normal">Logado como:</span>
                <span className="text-sm font-semibold text-neutral-805 text-neutral-900 dark:text-white block">{currentUser.name}</span>
              </div>
              <button
                id="header_logout_btn"
                onClick={handleLogout}
                className="p-2 py-1.5 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white rounded-lg transition text-xs flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                title="Sair da plataforma"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* ----------------- LOGIN STAGE ----------------- */}
        {!currentUser ? (
          <div className="max-w-md mx-auto my-12 bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-[4px] ${theme.primary}`}></div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black font-sans text-white tracking-tight">Entrar na Plataforma</h2>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Digite o seu número de celular com DDD e sua senha fornecida pela instrutora para acessar sua planilha de treinos e avaliações.
              </p>
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-4 mb-6 flex items-start gap-2">
                <BadgeAlert className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Seu Celular (Somente números com DDD)</label>
                <input
                  id="login_cellphone_input"
                  type="text"
                  placeholder="EX: 41984842941"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-neutral-700 focus:outline-none rounded-xl px-4 py-3 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Sua Senha de Acesso</label>
                <input
                  id="login_password_input"
                  type="password"
                  placeholder="••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-neutral-700 focus:outline-none rounded-xl px-4 py-3 text-white text-sm"
                  required
                />
              </div>

              <button
                id="login_submit_btn"
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-xl ${theme.primary} font-bold transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50`}
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>


          </div>
        ) : currentUser.role === "admin" ? (
          
          // ----------------- INSTRUCTOR (ADMIN) COACH ZONE -----------------
          <div className="space-y-8">
            
            {/* Top Stat Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs text-neutral-400 block pb-1">Total de Alunos</span>
                    <strong className="text-3xl font-black text-white">{clients.filter(c => c.phone !== "41984842941").length}</strong>
                  </div>
                  <UserCheck className={`w-8 h-8 ${theme.text}`} />
                </div>
              </div>
              <div className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs text-neutral-400 block pb-1">Mensalidades Pagas</span>
                    <strong className="text-3xl font-black text-white">{payments.filter(p => p.status === "Pago").length}</strong>
                  </div>
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
              <div className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs text-neutral-400 block pb-1">Caixa Total</span>
                    <strong className="text-3xl font-black text-emerald-400">R$ {totalInBox.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <DollarSign className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <div className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs text-neutral-400 block pb-1">Solicitações de Troca</span>
                    <strong className="text-3xl font-black text-white">{messages.filter(m => m.status === "Pendente").length}</strong>
                  </div>
                  <MessageCircle className="w-8 h-8 text-amber-500" />
                </div>
              </div>
            </div>

            {/* Circular active client list with avatars and green online signal beads (Sua foto etc) */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4 flex items-center gap-2">
                <Compass className="w-4 h-4 text-neutral-400" />
                Alunos na Base (Clique para selecionar, ver e editar o aluno)
              </h3>
              
              <div className="flex flex-wrap items-center gap-6">
                {clients.filter(c => c.phone !== "41984842941").map((c) => {
                  const isActive = activeClientPhone === c.phone;
                  return (
                    <button
                      id={`client_circle_btn_${c.phone}`}
                      key={c.phone}
                      onClick={() => setActiveClientPhone(c.phone)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition duration-200 cursor-pointer text-center group ${
                        isActive ? "bg-neutral-800 border-2 border-neutral-600 scale-105" : "bg-neutral-950/40 hover:bg-neutral-800/40 border border-neutral-900"
                      }`}
                    >
                      <div className="relative mb-2">
                        {c.avatar ? (
                          <img src={c.avatar} alt={c.name} className="w-14 h-14 rounded-full object-cover border border-neutral-700 shadow-lg group-hover:border-neutral-500 transition" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-lg font-extrabold text-neutral-200">
                            {c.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        {/* Green indicator if user is online, active in the last 2 minutes */}
                        {c.is_online ? (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-neutral-950 animate-pulse" title="Aluno(a) Online na Plataforma"></span>
                        ) : (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-neutral-600 border-2 border-neutral-950" title="Offline"></span>
                        )}
                      </div>
                      
                      <div className="text-xs font-semibold text-white max-w-[80px] truncate leading-tight">{c.name.split(" ")[0]}</div>
                      <div className="text-[9px] text-neutral-400 mt-0.5">{c.is_demo ? "Demo" : "Completo"}</div>
                    </button>
                  );
                })}
                {clients.filter(c => c.phone !== "41984842941").length === 0 && (
                  <div className="text-center text-neutral-500 text-xs py-4">Nenhum aluno cadastrado ainda. Use o formulário abaixo para registrar o primeiro!</div>
                )}
              </div>
            </div>

            {/* Split screen: Select student features (workouts/assessments) vs register new students */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Focused user area (Workouts & Assessments) */}
              <div className="lg:col-span-8 space-y-8">
                {activeClientPhone ? (
                  (() => {
                    const focusedClient = clients.find(c => c.phone === activeClientPhone);
                    if (!focusedClient) return null;

                    return (
                      <div className="space-y-8 bg-neutral-950 rounded-n">
                        
                        {/* Header details on focused client */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden">
                          <div className={`absolute top-0 right-0 py-1.5 px-3 rounded-bl-xl text-xs uppercase font-bold text-neutral-900 ${focusedClient.is_demo ? "bg-amber-500" : "bg-cyan-500"}`}>
                            {focusedClient.is_demo ? "Demo - Plano de Demonstração" : "Completo - Plano Pagante"}
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center gap-4 text-left">
                            <div className="w-14 h-14 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xl font-bold text-white uppercase overflow-hidden">
                              {focusedClient.avatar ? (
                                <img src={focusedClient.avatar} alt="Client Photo" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                focusedClient.name.slice(0, 2)
                              )}
                            </div>
                            <div>
                              <h2 className="text-xl font-black text-white flex items-center gap-2">
                                {focusedClient.name}
                                {focusedClient.role === "admin" && (
                                  <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded">
                                    Personal / Admin
                                  </span>
                                )}
                              </h2>
                              <p className="text-xs text-neutral-400 font-mono">Celular / Login:  {focusedClient.phone}  |  Idade: {focusedClient.age} anos  |  Dia de vencimento: Dia {focusedClient.payment_day}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="bg-neutral-950 border border-neutral-800 text-[11px] px-2.5 py-1 rounded-md">Peso: <strong className="text-white">{focusedClient.weight} kg</strong></span>
                                <span className="bg-neutral-950 border border-neutral-800 text-[11px] px-2.5 py-1 rounded-md">Altura: <strong className="text-white">{focusedClient.height} m</strong></span>
                                {focusedClient.physical_issue && (
                                  <span className="bg-red-500/10 text-red-400 border border-red-500/10 text-[11px] px-2.5 py-1 rounded-md">Restrição: {focusedClient.physical_issue}</span>
                                )}
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 text-[11px] px-2.5 py-1 rounded-md">Objetivo: {focusedClient.main_goal}</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="mt-6 pt-4 border-t border-neutral-800/60 flex flex-wrap gap-3">
                            <button
                              id="toggle_client_plan_btn"
                              onClick={() => handleEditUserStatus(focusedClient.phone, { is_demo: !focusedClient.is_demo })}
                              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl font-semibold transition cursor-pointer"
                            >
                              Alternar para {focusedClient.is_demo ? "Plano Completo" : "Plano Demo"}
                            </button>
                            
                            <button
                              id="toggle_client_freeze_manual_btn"
                              onClick={() => handleEditUserStatus(focusedClient.phone, { is_frozen: !focusedClient.is_frozen })}
                              className={`px-4 py-2 text-xs rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                focusedClient.is_frozen ? "bg-red-900/30 text-red-400 border border-red-500/20" : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                              }`}
                            >
                              {focusedClient.is_frozen ? (
                                <>
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>Descongelar Aluno</span>
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Congelar manualmente</span>
                                </>
                              )}
                            </button>

                            <button
                              id="toggle_client_role_btn"
                              onClick={() => {
                                const newRole = focusedClient.role === "admin" ? "client" : "admin";
                                const confirmMsg = newRole === "admin" 
                                  ? `Tem certeza que deseja promover ${focusedClient.name} a Personal (Administrador)? Ele(a) terá acesso completo para gerenciar todos os alunos, treinos e cobranças.`
                                  : `Deseja remover os privilégios de Personal de ${focusedClient.name} e rebaixá-lo a Aluno?`;
                                if (confirm(confirmMsg)) {
                                  handleEditUserStatus(focusedClient.phone, { role: newRole });
                                }
                              }}
                              className={`px-4 py-2 text-xs rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                focusedClient.role === "admin" ? "bg-purple-900/30 text-purple-400 border border-purple-500/20" : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                              }`}
                            >
                              {focusedClient.role === "admin" ? "Remover Personal" : "Tornar Personal (Admin)"}
                            </button>

                            <button
                              id="delete_client_from_focused_btn"
                              onClick={() => handleDeleteClient(focusedClient.phone)}
                              className="px-4 py-2 bg-transparent border border-red-500/20 hover:bg-red-500/10 text-red-400 text-xs rounded-xl font-semibold transition ml-auto cursor-pointer"
                            >
                              Excluir Aluno
                            </button>
                          </div>
                        </div>

                        {/* WORKOUT PLAN / TRACKER EDITOR */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
                          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Dumbbell className="w-5 h-5 text-neutral-400" />
                            Planejamento de Exercícios ({clientWorkouts.length})
                          </h3>

                          {focusedClient.is_demo && clientWorkouts.length >= 5 && (
                            <p className="text-xs text-amber-400 bg-amber-500/10 p-3 rounded-lg mb-4">
                              ⚠️ Plano Demo ativo para este aluno. O limite de 5 exercícios ativos foi atingido. Melhore o plano para Completo para adicionar mais exercícios.
                            </p>
                          )}

                          {/* Exercise List */}
                          <div className="space-y-3 mb-6">
                            {clientWorkouts.map((w) => (
                              <div key={w.id} className="bg-neutral-955 p-4 rounded-2xl border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                  <h4 className="text-sm font-extrabold text-white">{w.name}</h4>
                                  <div className="text-xs text-neutral-400 space-x-3 mt-1">
                                    <span>Séries: <strong className="text-neutral-200">{w.sets}</strong></span>
                                    <span>Repetições: <strong className="text-neutral-200">{w.reps}</strong></span>
                                    {w.weight_load && <span>Carga: <strong className="text-neutral-200">{w.weight_load}</strong></span>}
                                  </div>
                                  {w.notes && <p className="text-xs text-neutral-500 mt-1.5 font-mono">{w.notes}</p>}
                                  {w.video_url && (
                                    <a href={w.video_url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-400 hover:underline mt-1 block">
                                      Visualizar Auxílio de Execução (Vídeo/GIF)
                                    </a>
                                  )}
                                </div>
                                <button
                                  id={`delete_workout_btn_${w.id}`}
                                  onClick={() => handleDeleteWorkout(w.id)}
                                  className="p-2 border border-red-500/20 hover:bg-red-500/10 rounded-xl text-red-400 transition hover:text-red-300 self-start md:self-auto cursor-pointer"
                                  title="Excluir exercício"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            {clientWorkouts.length === 0 && (
                              <p className="text-xs text-neutral-500 text-center py-6 border-2 border-dashed border-neutral-800 rounded-2xl">
                                Nenhuma atividade ou exercício montado na grade deste aluno. Cadastre um novo exercício abaixo.
                              </p>
                            )}
                          </div>

                          {/* New Exercise Form */}
                          {(!focusedClient.is_demo || clientWorkouts.length < 5) && (
                            <form onSubmit={handleAddWorkout} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 space-y-4">
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Novo Exercício</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-[11px] text-neutral-400 mb-1">Nome do Exercício</label>
                                  <input
                                    id="workout_name_input"
                                    type="text"
                                    placeholder="Agachamento Livre"
                                    value={wName}
                                    onChange={(e) => setWName(e.target.value)}
                                    className="w-full bg-neutral-910 bg-neutral-900 border border-neutral-800 focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] text-neutral-400 mb-1">Séries (Ex: 3)</label>
                                  <input
                                    id="workout_sets_input"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={wSets}
                                    onChange={(e) => setWSets(e.target.value)}
                                    className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] text-neutral-400 mb-1">Repetições (Ex: 12 ou Até a Falha)</label>
                                  <input
                                    id="workout_reps_input"
                                    type="text"
                                    placeholder="12"
                                    value={wReps}
                                    onChange={(e) => setWReps(e.target.value)}
                                    className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[11px] text-neutral-400 mb-1">Carga sugerida (Ex: 20kg de cada lado)</label>
                                  <input
                                    id="workout_load_input"
                                    type="text"
                                    placeholder="Ex: 15kg"
                                    value={wLoad}
                                    onChange={(e) => setWLoad(e.target.value)}
                                    className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] text-neutral-400 mb-1">Vídeo URL / Link do GIF instrutivo</label>
                                  <input
                                    id="workout_video_input"
                                    type="url"
                                    placeholder="https://gfycat.com/..."
                                    value={wVideo}
                                    onChange={(e) => setWVideo(e.target.value)}
                                    className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] text-neutral-400 mb-1">Observações / Método de Execução</label>
                                <textarea
                                  id="workout_notes_input"
                                  rows={2}
                                  placeholder="Ex: Pausa ativa de 3 segundos na isometria mais profunda"
                                  value={wNotes}
                                  onChange={(e) => setWNotes(e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded-lg p-3 text-xs text-white resize-none"
                                />
                              </div>

                              <button
                                id="add_workout_submit_btn"
                                type="submit"
                                className={`w-full py-2.5 rounded-xl ${theme.primary} font-bold transition duration-200 text-xs cursor-pointer flex items-center justify-center gap-1.5`}
                              >
                                <Plus className="w-4 h-4 text-neutral-950" />
                                Adicionar Exercício ao Aluno
                              </button>
                            </form>
                          )}
                        </div>

                        {/* PHYSICAL EVALUATION MANAGER & FORM */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
                          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-neutral-400" />
                            Avaliações Físicas & Medidas Mandatórias ({clientEvaluations.length})
                          </h3>

                          {/* Grid of evaluations */}
                          {clientEvaluations.length > 0 && (
                            <div className="space-y-4 mb-6">
                              <div className="flex gap-2 bg-neutral-950 p-2 rounded-xl overflow-x-auto">
                                {clientEvaluations.map((ev) => (
                                  <button
                                    id={`select_eval_tab_btn_${ev.id}`}
                                    key={ev.id}
                                    onClick={() => setCurrentSelectedEvaluation(ev)}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer ${
                                      currentSelectedEvaluation?.id === ev.id ? theme.primary + " text-neutral-905 text-neutral-950" : "bg-neutral-900 text-neutral-400 hover:text-white"
                                    }`}
                                  >
                                    Avaliação de {new Date(ev.eval_date).toLocaleDateString()}
                                  </button>
                                ))}
                              </div>

                              {currentSelectedEvaluation && (
                                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 space-y-6">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-900 pb-4">
                                    <div>
                                      <h4 className="text-sm font-bold text-white">Relatório Auto-compilado de Medidas</h4>
                                      <p className="text-xs text-neutral-400 font-mono">Realizado em {new Date(currentSelectedEvaluation.eval_date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      <button
                                        id="whatsapp_report_btn"
                                        onClick={() => triggerWhatsAppReport(focusedClient.phone, focusedClient.name, currentSelectedEvaluation)}
                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer font-black"
                                      >
                                        <PhoneCall className="w-3.5 h-3.5 text-neutral-955" />
                                        WhatsApp do Aluno
                                      </button>
                                      <button
                                        id="delete_evaluation_btn"
                                        onClick={() => handleDeleteEvaluation(currentSelectedEvaluation.id)}
                                        className="p-1.5 border border-red-500/20 hover:bg-red-500/10 rounded-lg text-red-400 transition cursor-pointer"
                                        title="Excluir Avaliação"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Automatic IMC and Fat metrics calculated inside DB script */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase">IMC Automático</span>
                                      <strong className="text-lg font-black text-white">{currentSelectedEvaluation.imc}</strong>
                                    </div>
                                    <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase">% Gordura Corporal</span>
                                      <strong className={`text-lg font-black ${theme.text}`}>{currentSelectedEvaluation.body_fat}%</strong>
                                    </div>
                                    <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Peso Avaliado</span>
                                      <strong className="text-lg font-black text-white">{currentSelectedEvaluation.weight} kg</strong>
                                    </div>
                                    <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Altura Avaliada</span>
                                      <strong className="text-lg font-black text-white">{currentSelectedEvaluation.height} m</strong>
                                    </div>
                                  </div>

                                  {/* Table of measurements */}
                                  <div className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-900">
                                    <span className="text-xs font-bold text-neutral-300 block pb-3">Perímetros Corporais (cm):</span>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm font-mono text-left">
                                      <div><span className="text-neutral-500 block text-[10px]">PESCOÇO:</span> <strong className="text-white">{currentSelectedEvaluation.neck} cm</strong></div>
                                      <div><span className="text-neutral-500 block text-[10px]">TÓRAX:</span> <strong className="text-white">{currentSelectedEvaluation.chest} cm</strong></div>
                                      <div><span className="text-neutral-500 block text-[10px]">CINTURA:</span> <strong className="text-white">{currentSelectedEvaluation.waist} cm</strong></div>
                                      <div><span className="text-neutral-500 block text-[10px]">ABDÔMEN:</span> <strong className="text-white">{currentSelectedEvaluation.abdomen} cm</strong></div>
                                      <div><span className="text-neutral-500 block text-[10px]">QUADRIL:</span> <strong className="text-white">{currentSelectedEvaluation.hips} cm</strong></div>
                                      <div><span className="text-neutral-500 block text-[10px]">BRAÇO D / E:</span> <strong className="text-white">{currentSelectedEvaluation.arm_right} / {currentSelectedEvaluation.arm_left}</strong></div>
                                      <div><span className="text-neutral-500 block text-[10px]">COXA D / E:</span> <strong className="text-white">{currentSelectedEvaluation.thigh_right} / {currentSelectedEvaluation.thigh_left}</strong></div>
                                      <div><span className="text-neutral-500 block text-[10px]">PANTURRILHA D / E:</span> <strong className="text-white">{currentSelectedEvaluation.calf_right} / {currentSelectedEvaluation.calf_left}</strong></div>
                                    </div>
                                  </div>

                                  {/* Comparison Photos Section */}
                                  {(currentSelectedEvaluation.photo_front || currentSelectedEvaluation.photo_side) && (
                                    <div className="space-y-3">
                                      <span className="text-xs font-bold text-neutral-300 block">Fotos de Comparação Opcionais:</span>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentSelectedEvaluation.photo_front && (
                                          <div className="bg-neutral-900 p-2 rounded-xl text-center">
                                            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block pb-1">Vista Frontal (Frente)</span>
                                            <img src={currentSelectedEvaluation.photo_front} alt="Comparador Frontal" className="w-full h-80 object-cover rounded-lg border border-neutral-800" referrerPolicy="no-referrer" />
                                          </div>
                                        )}
                                        {currentSelectedEvaluation.photo_side && (
                                          <div className="bg-neutral-900 p-2 rounded-xl text-center">
                                            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block pb-1">Vista de Perfil (Lado)</span>
                                            <img src={currentSelectedEvaluation.photo_side} alt="Comparador Lateral" className="w-full h-80 object-cover rounded-lg border border-neutral-800" referrerPolicy="no-referrer" />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Register Assessment Form */}
                          <form onSubmit={handleAddEvaluation} className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Inserir Nova Avaliação Física</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-[11px] text-neutral-400 mb-1 font-medium">Data da Avaliação</label>
                                <input
                                  id="eval_date_input"
                                  type="date"
                                  value={evalDate}
                                  onChange={(e) => setEvalDate(e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] text-neutral-400 mb-1 font-medium">Peso Atual (kg)</label>
                                <input
                                  id="eval_weight_input"
                                  type="number"
                                  step="0.1"
                                  placeholder="72.5"
                                  value={evalWeight}
                                  onChange={(e) => setEvalWeight(e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] text-neutral-400 mb-1 font-medium">Altura Atual (m)</label>
                                <input
                                  id="eval_height_input"
                                  type="number"
                                  step="0.01"
                                  placeholder="1.75"
                                  value={evalHeight}
                                  onChange={(e) => setEvalHeight(e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                                  required
                                />
                              </div>
                            </div>

                            <span className="block text-xs font-extrabold text-neutral-400 border-b border-neutral-900 pb-1.5 pt-2">Perímetros Mandatórios (cm)</span>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                              <div>
                                <label className="block text-[10px] text-neutral-500 mb-0.5 font-bold uppercase">PESCOÇO</label>
                                <input id="eval_neck_input" type="number" step="0.1" placeholder="38" value={evalNeck} onChange={(e) => setEvalNeck(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded px-2 py-1.5 text-xs text-white" required />
                              </div>
                              <div>
                                <label className="block text-[10px] text-neutral-500 mb-0.5 font-bold uppercase">TÓRAX</label>
                                <input id="eval_chest_input" type="number" step="0.1" placeholder="95" value={evalChest} onChange={(e) => setEvalChest(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded px-2 py-1.5 text-xs text-white" required />
                              </div>
                              <div>
                                <label className="block text-[10px] text-neutral-500 mb-0.5 font-bold uppercase">CINTURA</label>
                                <input id="eval_waist_input" type="number" step="0.1" placeholder="82" value={evalWaist} onChange={(e) => setEvalWaist(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded px-2 py-1.5 text-xs text-white" required />
                              </div>
                              <div>
                                <label className="block text-[10px] text-neutral-500 mb-0.5 font-bold uppercase">ABDÔMEN</label>
                                <input id="eval_abdomen_input" type="number" step="0.1" placeholder="85" value={evalAbdomen} onChange={(e) => setEvalAbdomen(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded px-2 py-1.5 text-xs text-white" required />
                              </div>
                              <div>
                                <label className="block text-[10px] text-neutral-500 mb-0.5 font-bold uppercase">QUADRIL</label>
                                <input id="eval_hips_input" type="number" step="0.1" placeholder="102" value={evalHips} onChange={(e) => setEvalHips(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded px-2 py-1.5 text-xs text-white" required />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-[10px] text-neutral-500 mb-0.5 font-bold uppercase">BRAÇO DIREITO</label>
                                <input id="eval_arm_right_input" type="number" step="0.1" placeholder="32" value={evalArmR} onChange={(e) => setEvalArmR(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded px-2 py-1.5 text-xs text-white" required />
                              </div>
                              <div>
                                <label className="block text-[10px] text-neutral-500 mb-0.5 font-bold uppercase">BRAÇO ESQUERDO</label>
                                <input id="eval_arm_left_input" type="number" step="0.1" placeholder="31.8" value={evalArmL} onChange={(e) => setEvalArmL(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded px-2 py-1.5 text-xs text-white" required />
                              </div>
                              <div>
                                <label className="block text-[10px] text-neutral-500 mb-0.5 font-bold uppercase">COXA DIREITA</label>
                                <input id="eval_thigh_right_input" type="number" step="0.1" placeholder="56" value={evalThighR} onChange={(e) => setEvalThighR(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded px-2 py-1.5 text-xs text-white" required />
                              </div>
                              <div>
                                <label className="block text-[10px] text-neutral-500 mb-0.5 font-bold uppercase">COXA ESQUERDA</label>
                                <input id="eval_thigh_left_input" type="number" step="0.1" placeholder="55.8" value={evalThighL} onChange={(e) => setEvalThighL(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded px-2 py-1.5 text-xs text-white" required />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] text-neutral-500 mb-0.5 font-bold uppercase">PANTURRILHA DIREITA</label>
                                <input id="eval_calf_right_input" type="number" step="0.1" placeholder="38.5" value={evalCalfR} onChange={(e) => setEvalCalfR(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded px-2 py-1.5 text-xs text-white" required />
                              </div>
                              <div>
                                <label className="block text-[10px] text-neutral-500 mb-0.5 font-bold uppercase">PANTURRILHA ESQUERDA</label>
                                <input id="eval_calf_left_input" type="number" step="0.1" placeholder="38.2" value={evalCalfL} onChange={(e) => setEvalCalfL(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 focus:outline-none rounded px-2 py-1.5 text-xs text-white" required />
                              </div>
                            </div>

                            {/* Optional Files Drag and Drop or click Upload of images */}
                            <span className="block text-xs font-extrabold text-neutral-400 border-b border-neutral-900 pb-1.5 pt-2">Fotos Comparativas Opcionais</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="border border-dashed border-neutral-800 rounded-lg p-3 text-center bg-neutral-900/20">
                                <span className="text-[10px] text-neutral-400 block mb-1 font-semibold uppercase">FOTO DE FRENTE</span>
                                <input 
                                  id="eval_front_photo_uploader"
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => handleFileChange(e, "front")} 
                                  className="text-white text-[10px] w-full cursor-pointer" 
                                />
                                {evalPhotoFront && (
                                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">✓ Carregada com sucesso</div>
                                )}
                              </div>
                              <div className="border border-dashed border-neutral-800 rounded-lg p-3 text-center bg-neutral-900/20">
                                <span className="text-[10px] text-neutral-400 block mb-1 font-semibold uppercase">FOTO DE LADO</span>
                                <input 
                                  id="eval_side_photo_uploader"
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => handleFileChange(e, "side")} 
                                  className="text-white text-[10px] w-full cursor-pointer" 
                                />
                                {evalPhotoSide && (
                                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">✓ Carregada com sucesso</div>
                                )}
                              </div>
                            </div>

                            <button
                              id="add_evaluation_submit_btn"
                              type="submit"
                              className={`w-full py-2.5 rounded-xl ${theme.primary} font-bold transition duration-200 text-xs cursor-pointer flex items-center justify-center gap-1.5`}
                            >
                              <PlusCircle className="w-4 h-4 text-neutral-950" />
                              Compilar e Salvar Avaliação Física
                            </button>
                          </form>
                        </div>

                        {/* DIET & NUTRITION MANAGER (Instructor only) */}
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6">
                          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                            Acompanhamento de Dieta & Plano Alimentar ({clientDiets.length})
                          </h3>

                          {/* List of diets */}
                          {clientDiets.length > 0 && (
                            <div className="space-y-4 mb-6">
                              <div className="flex gap-2 bg-neutral-100 dark:bg-neutral-950 p-2 rounded-xl overflow-x-auto">
                                {clientDiets.map((dt) => (
                                  <button
                                    id={`select_diet_tab_btn_${dt.id}`}
                                    key={dt.id}
                                    onClick={() => setCurrentSelectedDiet(dt)}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer ${
                                      currentSelectedDiet?.id === dt.id ? theme.primary : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800"
                                    }`}
                                  >
                                    Plano de {new Date(dt.diet_date).toLocaleDateString("pt-BR")}
                                  </button>
                                ))}
                              </div>

                              {currentSelectedDiet && (
                                <div className="bg-neutral-50 dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-150 dark:border-neutral-900 space-y-4">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-900 pb-3">
                                    <div>
                                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{currentSelectedDiet.title}</h4>
                                      <p className="text-xs text-neutral-505 text-neutral-500 dark:text-neutral-400 font-mono">Prescrito em {new Date(currentSelectedDiet.diet_date).toLocaleDateString("pt-BR")}</p>
                                    </div>
                                    <button
                                      id="delete_diet_btn"
                                      onClick={() => handleDeleteDiet(currentSelectedDiet.id)}
                                      className="p-1.5 border border-red-500/20 hover:bg-red-500/10 rounded-lg text-red-500 dark:text-red-400 transition cursor-pointer"
                                      title="Excluir Plano Alimentar"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div className="text-sm text-neutral-705 text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans whitespace-pre-wrap text-left bg-white dark:bg-neutral-900/40 p-4 rounded-xl border border-neutral-200 dark:border-neutral-900">
                                    {currentSelectedDiet.description}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Register Diet Form */}
                          <form onSubmit={handleAddDiet} className="bg-neutral-50 dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-150 dark:border-neutral-900 space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Prescrever Novo Plano Alimentar / Dieta</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] text-neutral-500 dark:text-neutral-400 mb-1 font-medium">Data do Acompanhamento</label>
                                <input
                                  id="diet_date_input"
                                  type="date"
                                  value={newDietDate}
                                  onChange={(e) => setNewDietDate(e.target.value)}
                                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] text-neutral-500 dark:text-neutral-400 mb-1 font-medium font-bold">Título da Dieta</label>
                                <input
                                  id="diet_title_input"
                                  type="text"
                                  placeholder="Ex: Fase Inicial - Definição Muscular"
                                  value={newDietTitle}
                                  onChange={(e) => setNewDietTitle(e.target.value)}
                                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] text-neutral-505 text-neutral-500 dark:text-neutral-400 mb-1 font-medium">Detalhes das Refeições / Alimentos</label>
                              <textarea
                                id="diet_description_input"
                                rows={6}
                                placeholder="Descreva os horários e porções de cada refeição (Café da Manhã, Almoço, Lanches, Jantar)..."
                                value={newDietDescription}
                                onChange={(e) => setNewDietDescription(e.target.value)}
                                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none rounded-lg p-3 text-xs text-neutral-900 dark:text-white resize-none"
                                required
                              />
                            </div>

                            <button
                              id="add_diet_submit_btn"
                              type="submit"
                              className={`w-full py-2.5 rounded-xl ${theme.primary} font-bold transition duration-200 text-xs cursor-pointer flex items-center justify-center gap-1.5`}
                            >
                              <PlusCircle className="w-4 h-4" />
                              Salvar e Disponibilizar Dieta ao Aluno
                            </button>
                          </form>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center text-neutral-400 relative overflow-hidden flex flex-col items-center justify-center">
                    <Dumbbell className="w-16 h-16 text-neutral-600 mb-4 animate-bounce" />
                    <h3 className="text-xl font-bold text-white">Nenhum Aluno Selecionado</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mt-2 leading-relaxed">
                      Clique em um dos componentes circulares dos alunos logo acima para gerenciar os treinos diários personalizados, visualizar históricos com gráficos e registrar novas avaliações corporais mensais automáticas.
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Register Aluno, Financeiro, Messages Swap requests */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* 1. REGISTER NEW CLIENT */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <UserIcon className={`w-5 h-5 ${theme.text}`} />
                    Cadastrar Aluno
                  </h3>
                  
                  <form onSubmit={handleRegisterClient} className="space-y-4">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Nome Completo</label>
                      <input
                        id="register_client_name"
                        type="text"
                        placeholder="Ex: João da Silva"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Celular de Login</label>
                        <input
                          id="register_client_phone"
                          type="text"
                          placeholder="Ex: 41999999999"
                          value={newClientPhone}
                          onChange={(e) => setNewClientPhone(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Senha Padrão</label>
                        <input
                          id="register_client_password"
                          type="password"
                          placeholder="••••••"
                          value={newClientPassword}
                          onChange={(e) => setNewClientPassword(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Idade</label>
                        <input
                          id="register_client_age"
                          type="number"
                          placeholder="25"
                          value={newClientAge}
                          onChange={(e) => setNewClientAge(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Peso (kg)</label>
                        <input
                          id="register_client_weight"
                          type="number"
                          placeholder="70"
                          value={newClientWeight}
                          onChange={(e) => setNewClientWeight(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Altura (m)</label>
                        <input
                          id="register_client_height"
                          type="number"
                          step="0.01"
                          placeholder="1.70"
                          value={newClientHeight}
                          onChange={(e) => setNewClientHeight(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Restrição Física (opcional)</label>
                      <input
                        id="register_client_issue"
                        type="text"
                        placeholder="Ex: Lesão no joelho esquerdo"
                        value={newClientIssue}
                        onChange={(e) => setNewClientIssue(e.target.value)}
                        className="w-full bg-neutral-955 bg-neutral-950 border border-neutral-800 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Objetivo Primário</label>
                      <select
                        id="register_client_goal"
                        value={newClientGoal}
                        onChange={(e) => setNewClientGoal(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white cursor-pointer"
                      >
                        <option value="Perda de Peso">Perda de Peso / Emagrecimento</option>
                        <option value="Ganho de Massa">Ganho de Massa Muscular</option>
                        <option value="Definição Corporal">Definição Corporal / Tonicidade</option>
                        <option value="Saúde & Longevidade">Apenas Saúde e Longevidade</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="flex items-center gap-2 bg-neutral-950 px-3 py-2 border border-neutral-800 rounded-xl">
                        <input
                          id="register_client_demo"
                          type="checkbox"
                          checked={newClientIsDemo}
                          onChange={(e) => setNewClientIsDemo(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-opacity-40"
                        />
                        <label className="text-[11px] text-neutral-300 font-bold uppercase cursor-pointer">ALUNO DEMO</label>
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-500 uppercase font-bold">Dia de Pgto</label>
                        <input
                          id="register_client_payment_day"
                          type="number"
                          min="1"
                          max="31"
                          value={newClientPaymentDay}
                          disabled={newClientIsDemo}
                          onChange={(e) => setNewClientPaymentDay(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none rounded-xl px-3 py-2 text-xs text-white disabled:opacity-40"
                        />
                      </div>
                    </div>

                    <button
                      id="register_client_submit_btn"
                      type="submit"
                      className={`w-full py-3 rounded-xl ${theme.primary} font-bold transition duration-200 text-xs cursor-pointer flex items-center justify-center gap-1.5`}
                    >
                      <Plus className="w-4 h-4 text-neutral-950" />
                      Cadastrar Aluno na Base
                    </button>
                  </form>
                </div>

                {/* 2. SOLICITAÇÕES DE TROCA DE EXERCÍCIO */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-500" />
                    Solicitações de Troca ({messages.filter(m => m.status === "Pendente").length})
                  </h3>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {messages.map((msg) => (
                      <div key={msg.id} className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900 space-y-2">
                        <div className="flex items-center justify-between text-left">
                          <strong className="text-xs text-white">{msg.client_name}</strong>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                            msg.status === "Resolvido" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10" : "bg-amber-500/10 text-amber-500 border border-amber-500/10"
                          }`}>{msg.status}</span>
                        </div>
                        <p className="text-xs text-neutral-300 text-left">Dificuldade em: <strong className="text-neutral-100">{msg.workout_name}</strong></p>
                        <p className="text-[11px] text-neutral-400 italic bg-neutral-900/60 p-2 rounded text-left">" {msg.reason} "</p>
                        
                        {msg.status === "Pendente" && (
                          <button
                            id={`resolve_message_btn_${msg.id}`}
                            onClick={() => handleResolveMessage(msg.id)}
                            className="w-full mt-2 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white text-[10px] font-bold rounded-lg border border-neutral-800 cursor-pointer"
                          >
                            Resolver / Troca Realizada
                          </button>
                        )}
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <p className="text-xs text-neutral-500 text-center py-6">Nenhuma solicitação pendente.</p>
                    )}
                  </div>
                </div>

                {/* 3. CONTROLE FINANCEIRO DE PAGAMENTO COMPLETO */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-500" />
                      Financeiro Mensal
                    </h3>
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">R$ {totalInBox}</span>
                  </div>

                  <p className="text-[11px] text-neutral-400 leading-relaxed mb-4 text-left">
                    Pessoas cadastradas no <strong>Plano Completo</strong>. Controle de atraso de 1 a 4 dias do pagamento da mensalidade (Dia Vencimento + 5 dias de tolerância com congelamento automático de conta).
                  </p>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {payments.map((p) => (
                      <div key={p.id} className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900 flex items-center justify-between gap-2">
                        <div className="text-left">
                          <strong className="text-xs text-white block">{p.client_name}</strong>
                          <span className="text-[10px] text-neutral-400 font-mono">Vencimento: Dia {p.payment_day} | Ref: {p.month}</span>
                          <span className="text-xs block text-emerald-400 font-semibold mt-1">R$ {Number(p.amount).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <input
                            id={`payment_checkbox_toggle_${p.id}`}
                            type="checkbox"
                            checked={p.status === "Pago"}
                            onChange={() => handleTogglePayment(p.id, p.status)}
                            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <span className={`text-[10px] uppercase font-black tracking-wider ${p.status === 'Pago' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {payments.length === 0 && (
                      <p className="text-xs text-neutral-500 text-center py-6">Não há lançamentos de pagamento para clientes completos de planos ativos.</p>
                    )}
                  </div>
                </div>

                {/* 4. CONFIGURAÇÕES DE COBRANÇA PIX */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-450" />
                    Configuração PIX Recebimentos
                  </h3>
                  <p className="text-[11px] text-neutral-450 text-neutral-400 leading-relaxed mb-4 text-left">
                    Defina sua chave de recebimento e a imagem do QR Code para as cobranças exibidas no ambiente do aluno.
                  </p>

                  <form onSubmit={handleSavePixSettings} className="space-y-4 text-left">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Chave PIX (Telefone, CNPJ, etc.)</label>
                      <input
                        id="settings_pix_key_input"
                        type="text"
                        placeholder="Ex: 41984842941"
                        value={formPixKey}
                        onChange={(e) => setFormPixKey(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Imagem do QR Code</label>
                      <div className="flex flex-col gap-2">
                        <input
                          id="settings_pix_qrcode_file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "pix")}
                          className="text-white text-[10px] cursor-pointer"
                        />
                        {formPixQrCode ? (
                          <div className="mt-2 text-center">
                            <span className="text-[9px] text-neutral-500 block mb-1">Pré-visualização do QR Code</span>
                            <img
                              src={formPixQrCode}
                              alt="Pix QR Code Preview"
                              className="w-32 h-32 object-contain mx-auto bg-white p-1 rounded-lg border border-neutral-700"
                            />
                            <button
                              type="button"
                              onClick={() => setFormPixQrCode("")}
                              className="mt-1.5 text-[10px] text-red-400 hover:underline"
                            >
                              Remover Imagem
                            </button>
                          </div>
                        ) : (
                          <div className="p-4 border border-dashed border-neutral-800 rounded-xl text-center text-[10px] text-neutral-500 bg-neutral-950">
                            Nenhum QR Code configurado (usará ícone padrão)
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      id="save_pix_settings_btn"
                      type="submit"
                      className={`w-full py-2.5 rounded-xl ${theme.primary} text-neutral-950 font-bold transition duration-250 text-xs cursor-pointer`}
                    >
                      Salvar Configuração PIX
                    </button>
                  </form>
                </div>

              </div>
              
            </div>

          </div>
        ) : (
          
          // ----------------- CLIENT STUDENT AREA / ENVIRONMENT -----------------
          <div className="space-y-8 text-left">
            
            {/* Client Header Info with Avatar Photo base64 Selectors */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 text-left w-full md:w-auto">
                  <div className="relative group shrink-0 mx-auto sm:mx-0">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-20 h-20 rounded-full object-cover border-2 border-neutral-700 shadow-xl group-hover:opacity-80 transition" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center text-3xl font-black text-white uppercase shadow-xl group-hover:opacity-80 transition">
                        {currentUser.name.slice(0, 2)}
                      </div>
                    )}
                    
                    {/* Select Avatar File Input overlay */}
                    {!currentUser.is_demo && (
                      <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition cursor-pointer text-center text-[10px] font-bold text-white px-1 leading-tight">
                        Alterar Foto
                        <input
                          id="avatar_photo_picker"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "avatar")}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight text-center sm:text-left">Eaí, {currentUser.name}! 👋</h2>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5 text-center sm:text-left">Plano: <strong className={currentUser.is_demo ? "text-amber-500" : "text-cyan-400"}>{currentUser.is_demo ? "DEMONSTRAÇÃO (5 Exercícios Limitados)" : "COMPLETO (Acesso irrestrito)"}</strong></p>
                    <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2.5">
                      <span className="bg-neutral-950 px-3 py-1 text-xs border border-neutral-800 rounded-lg">Meu Peso: <strong className="text-white">{currentUser.weight} kg</strong></span>
                      <span className="bg-neutral-950 px-3 py-1 text-xs border border-neutral-800 rounded-lg">Minha Altura: <strong className="text-white">{currentUser.height} m</strong></span>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 text-xs rounded-lg">Objetivo: <strong className="text-emerald-300 font-bold">{currentUser.main_goal}</strong></span>
                      {currentUser.physical_issue && (
                        <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 text-xs rounded-lg">Restrição Física: {currentUser.physical_issue}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-955 bg-neutral-950/40 p-4 rounded-2xl border border-neutral-900 text-left min-w-[200px]">
                  <div className="text-xs text-neutral-400 uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Situação Pagamento
                  </div>
                  {currentUser.is_demo ? (
                    <div className="text-xs text-amber-500 font-semibold">Plano Gratuito / Degustação</div>
                  ) : (
                    <div>
                      <span className="text-xs block text-neutral-300">Vencimento mensal: <strong className="text-white">Todo dia {currentUser.payment_day}</strong></span>
                      <span className="text-xs text-emerald-400 font-bold block mt-1 flex items-center gap-1">
                        <Unlock className="w-3" />
                        Acesso Ativo com Sucesso
                      </span>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Split Grid stage: Workouts Tracker vs Meals Tips */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Exercises / Physical Workouts Checklist */}
              <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-left">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Dumbbell className={`w-5 h-5 ${theme.text}`} />
                    Meus Exercícios de Hoje ({clientWorkouts.length})
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">Marque para registrar evolução diária</span>
                </div>

                {clientWorkouts.length === 0 && (
                  <div className="text-center py-12 text-neutral-500 text-xs border-2 border-dashed border-neutral-800 rounded-2xl">
                    Sua grade de exercícios está vazia no momento. Em breve a instrutora montará sua planilha personalizada de acordo com seu objetivo!
                  </div>
                )}

                <div className="space-y-4">
                  {clientWorkouts.map((w) => (
                    <div key={w.id} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      {/* Left: Info */}
                      <div>
                        <h4 className="text-sm font-black text-white">{w.name}</h4>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400">
                          <span>Séries: <strong className="text-neutral-200">{w.sets}</strong></span>
                          <span>Repetições: <strong className="text-neutral-200">{w.reps}</strong></span>
                          {w.weight_load && <span>Carga recomendada: <strong className="text-neutral-200">{w.weight_load}</strong></span>}
                        </div>
                        {w.notes && (
                          <p className="text-xs text-neutral-500 font-mono italic mt-2 bg-neutral-900/40 px-2 py-1 rounded">
                            {w.notes}
                          </p>
                        )}
                        {w.video_url && (
                          <a href={w.video_url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-400 hover:underline mt-1.5 inline-block">
                            Ver Tutorial de Execução (Vídeo/GIF)
                          </a>
                        )}
                      </div>

                      {/* Right: Actions (Mark Completed or Request Switch swap) */}
                      <div className="flex items-center gap-3.5 mt-2 md:mt-0">
                        <button
                          id={`request_swap_btn_${w.id}`}
                          onClick={() => {
                            setSwapWorkoutId(w.id);
                            setSwapWorkoutName(w.name);
                            setShowSwapModal(true);
                          }}
                          className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-305 text-neutral-300 rounded-xl text-xs font-semibold border border-neutral-850 cursor-pointer"
                        >
                          Solicitar Troca
                        </button>

                        <button
                          id={`mark_complete_checkbox_btn_${w.id}`}
                          onClick={() => handleMarkCompleted(w.id)}
                          className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer ${
                            theme.primary + " text-neutral-950 font-black"
                          }`}
                        >
                          <CheckCircle className="w-4 h-4 text-neutral-950" />
                          <span>Feito!</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Client Sidebar: Diet Timeline / Lock & PIX Payment */}
              <div className="lg:col-span-4 space-y-8 text-left">
                
                {/* Diet Timeline and Viewer for complete student, OR lock card for demo */}
                {!currentUser.is_demo ? (
                  clientDiets.length > 0 && (
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 text-left">
                      <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-neutral-550 text-neutral-500 dark:text-neutral-400" />
                        Meu Plano Alimentar & Dieta
                      </h3>

                      <div className="space-y-4">
                        <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-955 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 rounded-xl overflow-x-auto">
                          {clientDiets.map((dt) => (
                            <button
                              id={`client_diet_timeline_btn_${dt.id}`}
                              key={dt.id}
                              onClick={() => setCurrentSelectedDiet(dt)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition cursor-pointer ${
                                currentSelectedDiet?.id === dt.id ? theme.primary : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800"
                              }`}
                            >
                              Plano de {new Date(dt.diet_date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                            </button>
                          ))}
                        </div>

                        {currentSelectedDiet && (
                          <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-150 dark:border-neutral-900 space-y-2 text-left">
                            <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">{currentSelectedDiet.title}</h4>
                            <div className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans whitespace-pre-wrap text-left bg-white dark:bg-neutral-900/40 p-3 rounded-lg border border-neutral-200 dark:border-neutral-900 max-h-60 overflow-y-auto">
                              {currentSelectedDiet.description}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 text-left">
                    <h3 className="text-sm font-bold uppercase text-amber-500 flex items-center gap-1.5 mb-2">
                      <Lock className="w-4 h-4 text-amber-500" />
                      Gráficos & Dieta Bloqueados
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      Ops! Você está no plano <strong>DEMO</strong>. O plano de dieta personalizado de 30 em 30 dias e gráficos de evolução estão disponíveis apenas no plano completo de acompanhamento.
                    </p>
                  </div>
                )}

                {/* PIX AREA (COMPLETO ONY) */}
                {!currentUser.is_demo && (
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 text-left">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-emerald-400" />
                      Pagar Mensalidade PIX
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4 leading-relaxed">
                      Efetue seu pix de R$ 150,00 diretamente pela chave da personal:
                    </p>

                    <div className="bg-neutral-50 dark:bg-neutral-950 p-3.5 rounded-xl border border-neutral-150 dark:border-neutral-900 space-y-3.5 mb-4 text-center">
                      {pixQrCode ? (
                        <div className="bg-white p-2 rounded-lg inline-block w-40 h-40">
                          <img src={pixQrCode} alt="QR Code PIX" className="w-full h-full object-contain mx-auto" referrerPolicy="no-referrer" />
                        </div>
                      ) : (
                        <div className="bg-white p-2 rounded-lg inline-block">
                          <QrCode className="w-24 h-24 text-black" />
                        </div>
                      )}
                      <div className="text-xs text-neutral-700 dark:text-neutral-300 font-mono">
                        Chave Pix: <strong className="text-neutral-900 dark:text-white block select-all">{pixKey}</strong>
                      </div>
                    </div>

                    <button
                      id="client_whatsapp_pix_proof_btn"
                      onClick={() => triggerWhatsAppPixReceipt(currentUser)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-white" />
                      Enviar comprovante via WhatsApp
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* EVOLUTION & ASSESSMENT CHART PROGRESS CARDS - Only for completo clients */}
            {!currentUser.is_demo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                
                {/* Progression charts */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-left">
                  <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-neutral-400" />
                    Meu Avanço Físico (Evolução / Involução de Medidas)
                  </h3>

                  {clientEvaluations.length < 2 ? (
                    <div className="p-8 text-neutral-500 text-xs text-center border-2 border-dashed border-neutral-800 rounded-2xl flex flex-col items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-neutral-700 mb-2" />
                      <span>São necessárias pelo menos duas avaliações corporais para traçar o gráfico de acompanhamento de peso, IMC e percentual de gordura.</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Weight Line Chart */}
                      <div className="h-56 bg-neutral-950 p-4 rounded-xl border border-neutral-900">
                        <span className="text-[11px] text-neutral-400 uppercase font-mono mb-2 block">Variação de Peso Corporal (kg)</span>
                        <ResponsiveContainer width="100%" height="85%">
                          <AreaChart data={[...clientEvaluations].reverse()}>
                            <defs>
                              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={activeTheme === "emerald" ? "#10b981" : "#8b5cf6"} stopOpacity={0.2}/>
                                <stop offset="95%" stopColor={activeTheme === "emerald" ? "#10b981" : "#8b5cf6"} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                            <XAxis dataKey="eval_date" stroke="#737373" fontSize={10} tickFormatter={(val) => new Date(val).toLocaleDateString("pt-BR", { month: "short" })} />
                            <YAxis stroke="#737373" fontSize={10} domain={["dataMin - 3", "dataMax + 3"]} />
                            <Tooltip contentStyle={{ backgroundColor: "#171717", border: "1px solid #404040", borderRadius: "10px", fontSize: "11px" }} labelFormatter={(lbl) => new Date(lbl).toLocaleDateString()} />
                            <Area type="monotone" dataKey="weight" name="Peso (kg)" stroke={activeTheme === "emerald" ? "#10b981" : "#8b5cf6"} fillOpacity={1} fill="url(#weightGrad)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Muscle Waist & Fat Body percentage comparison over subsequent assessments */}
                      <div className="h-56 bg-neutral-950 p-4 rounded-xl border border-neutral-900">
                        <span className="text-[11px] text-neutral-400 uppercase font-mono mb-2 block">Percentual de Gordura (%) & Cintura (cm)</span>
                        <ResponsiveContainer width="100%" height="85%">
                          <LineChart data={[...clientEvaluations].reverse()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                            <XAxis dataKey="eval_date" stroke="#737373" fontSize={10} tickFormatter={(val) => new Date(val).toLocaleDateString("pt-BR", { month: "short" })} />
                            <YAxis stroke="#737373" fontSize={10} />
                            <Tooltip contentStyle={{ backgroundColor: "#171717", border: "1px solid #404040", borderRadius: "10px", fontSize: "11px" }} labelFormatter={(lbl) => new Date(lbl).toLocaleDateString()} />
                            <Legend wrapperStyle={{ fontSize: "10px" }} />
                            <Line type="monotone" dataKey="body_fat" name="Gordura Corporal (%)" stroke="#f59e0b" strokeWidth={2.5} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="waist" name="Cintura (cm)" stroke="#06b6d4" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                    </div>
                  )}
                </div>

                {/* My Physical Assessment list & Details with Mandatory dimensions */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-left">
                  <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-neutral-400" />
                    Minhas Avaliações & Comparador de Fotos
                  </h3>

                  {clientEvaluations.length === 0 ? (
                    <div className="p-8 text-neutral-500 text-xs text-center border-2 border-dashed border-neutral-800 rounded-2xl">
                      Nenhuma avaliação física cadastrada no sistema pela instrutora. Aguarde a primeira aferição de perímetros mandatórios!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      
                      <div className="flex gap-2 p-1.5 bg-neutral-950 border border-neutral-910 rounded-xl overflow-x-auto">
                        {clientEvaluations.map((ev) => (
                          <button
                            id={`client_ev_timeline_btn_${ev.id}`}
                            key={ev.id}
                            onClick={() => setCurrentSelectedEvaluation(ev)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition cursor-pointer ${
                              currentSelectedEvaluation?.id === ev.id ? theme.primary + " text-neutral-950 text-neutral-905" : "bg-neutral-900 text-neutral-400"
                            }`}
                          >
                            {new Date(ev.eval_date).toLocaleDateString("pt-BR")}
                          </button>
                        ))}
                      </div>

                      {currentSelectedEvaluation && (
                        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900/40 space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold leading-tight">IMC Automático</span>
                              <strong className="text-base text-white font-black">{currentSelectedEvaluation.imc}</strong>
                            </div>
                            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold leading-tight">Gordura Estimada</span>
                              <strong className="text-base text-yellow-500 font-black">{currentSelectedEvaluation.body_fat}%</strong>
                            </div>
                          </div>

                          <div className="bg-neutral-955 bg-neutral-950 p-4 rounded-xl border border-neutral-900 grid grid-cols-2 sm:grid-cols-3 gap-y-3.5 gap-x-2 text-xs">
                            <div><span className="text-neutral-500 block text-[10px]">PESCOÇO:</span> <strong className="text-white">{currentSelectedEvaluation.neck} cm</strong></div>
                            <div><span className="text-neutral-500 block text-[10px]">TÓRAX:</span> <strong className="text-white">{currentSelectedEvaluation.chest} cm</strong></div>
                            <div><span className="text-neutral-500 block text-[10px]">CINTURA:</span> <strong className="text-white">{currentSelectedEvaluation.waist} cm</strong></div>
                            <div><span className="text-neutral-500 block text-[10px]">ABDÔMEN:</span> <strong className="text-white">{currentSelectedEvaluation.abdomen} cm</strong></div>
                            <div><span className="text-neutral-500 block text-[10px]">QUADRIL:</span> <strong className="text-white">{currentSelectedEvaluation.hips} cm</strong></div>
                            <div><span className="text-neutral-500 block text-[10px]">BRAÇO D / E:</span> <strong className="text-white">{currentSelectedEvaluation.arm_right} / {currentSelectedEvaluation.arm_left}</strong></div>
                            <div><span className="text-neutral-500 block text-[10px]">COXA D / E:</span> <strong className="text-white">{currentSelectedEvaluation.thigh_right} / {currentSelectedEvaluation.thigh_left}</strong></div>
                            <div><span className="text-neutral-500 block text-[10px]">PANTURRILHA D / E:</span> <strong className="text-white">{currentSelectedEvaluation.calf_right} / {currentSelectedEvaluation.calf_left}</strong></div>
                          </div>

                          {(currentSelectedEvaluation.photo_front || currentSelectedEvaluation.photo_side) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {currentSelectedEvaluation.photo_front && (
                                <div className="text-center">
                                  <span className="text-[10px] text-neutral-400 font-bold block mb-1">REGISTRO FRONTAL</span>
                                  <img src={currentSelectedEvaluation.photo_front} alt="Comparador Frontal" className="w-full h-80 object-cover rounded-lg border border-neutral-800" referrerPolicy="no-referrer" />
                                </div>
                              )}
                              {currentSelectedEvaluation.photo_side && (
                                <div className="text-center">
                                  <span className="text-[10px] text-neutral-400 font-bold block mb-1">REGISTRO LATERAL</span>
                                  <img src={currentSelectedEvaluation.photo_side} alt="Comparador Lateral" className="w-full h-80 object-cover rounded-lg border border-neutral-800" referrerPolicy="no-referrer" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Daily Exercise completion graph block - available only for completos */}
            {!currentUser.is_demo && workoutLogHistory.length > 0 && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-left mt-8">
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Engajamento e Conclusões de Treino Diários
                </h3>
                <p className="text-xs text-neutral-400 mb-4 font-normal">Veja quantas repetições ou tarefas você concluiu ao longo do tempo:</p>
                
                <div className="h-52 bg-neutral-950 p-4 rounded-xl border border-neutral-900">
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={workoutLogHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="completed_at" stroke="#737373" fontSize={10} tickFormatter={(val) => new Date(val).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} />
                      <YAxis stroke="#737373" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: "#171717", border: "1px solid #404040", borderRadius: "10px", fontSize: "11px" }} labelFormatter={(lbl) => new Date(lbl).toLocaleDateString()} />
                      <Bar dataKey="count" name="Atividades Concluídas" fill={activeTheme === "emerald" ? "#10b981" : "#8b5cf6"} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* SWAP WORKOUT MODAL POPUP DIALOG */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 relative text-left">
            <h3 className="text-lg font-bold text-white mb-2">Solicitar Troca de Exercício</h3>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Informe a personal por qual motivo você deseja realizar a alteração do exercício <strong className="text-white">{swapWorkoutName}</strong> (Dificuldade física, dor local, falta de aparelho, etc.).
            </p>

            <form onSubmit={handleSwapRequest} className="space-y-4">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Causa / Condição Impeditiva de Treino</label>
                <textarea
                  id="swap_textarea_input"
                  rows={4}
                  placeholder="EX: Sinto dor na parte frontal do ombro esquerdo ao realizar a descida profunda deste exercício."
                  value={swapReason}
                  onChange={(e) => setSwapReason(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-neutral-700 rounded-lg p-3 text-xs text-white resize-none"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  id="cancel_swap_btn"
                  type="button"
                  onClick={() => {
                    setShowSwapModal(false);
                    setSwapReason("");
                  }}
                  className="w-1/2 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-xl text-xs transition duration-150 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="submit_swap_btn"
                  type="submit"
                  className={`w-1/2 py-2.5 rounded-xl ${theme.primary} font-bold transition duration-150 text-xs cursor-pointer flex items-center justify-center gap-1`}
                >
                  <Send className="w-4" />
                  Enviar Solicitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer System brand details */}
      <footer className="border-t border-neutral-900 bg-neutral-950/60 py-6 mt-12 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 AvaliaFit. Todos os direitos reservados. Gestão Inteligente de Avaliações Clínicas e Treino Desportivo.</p>
          <span className="text-[10px] text-neutral-600 font-mono">BRL COIN RECEPTOR • DATABASE: NEON PORTAL PGSQL</span>
        </div>
      </footer>

    </div>
  );
}
