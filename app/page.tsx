"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Smartphone } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { supabase, type Question } from "@/lib/supabase"
import { ChevronRight, Trophy, Star, Award, Target, Sparkles, Users, BarChart3, ArrowRight, CheckCircle } from "lucide-react"

type Screen = "presentation" | "welcome" | "quiz" | "result"

export default function QuizApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("presentation")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [lastname, setLastname] = useState("")
  const [company, setCompany] = useState("")
  const [answers, setAnswers] = useState<
    Array<{
      questionId: number
      selectedOption: number
      score: number
    }>
  >([])
  const [totalScore, setTotalScore] = useState(0)
  const [loading, setLoading] = useState(false)

  const defaultQuestions: Question[] = [
    {
      id: 1,
      question: "¿Cuál es tu nivel de experiencia en programación?",
      options: [
        { text: "Principiante", score: 1 },
        { text: "Intermedio", score: 2 },
        { text: "Avanzado", score: 3 },
        { text: "Experto", score: 4 },
      ],
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      question: "¿Qué lenguaje de programación prefieres?",
      options: [
        { text: "JavaScript", score: 3 },
        { text: "Python", score: 2 },
        { text: "Java", score: 1 },
        { text: "C++", score: 4 },
      ],
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      question: "¿Con qué frecuencia programas?",
      options: [
        { text: "Diariamente", score: 4 },
        { text: "Varias veces por semana", score: 3 },
        { text: "Una vez por semana", score: 2 },
        { text: "Ocasionalmente", score: 1 },
      ],
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      question: "¿Cuál es tu área de interés principal?",
      options: [
        { text: "Desarrollo Web", score: 2 },
        { text: "Inteligencia Artificial", score: 4 },
        { text: "Desarrollo Móvil", score: 3 },
        { text: "Ciencia de Datos", score: 3 },
      ],
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      question: "¿Trabajas en equipo o individualmente?",
      options: [
        { text: "Siempre en equipo", score: 3 },
        { text: "Mayormente en equipo", score: 2 },
        { text: "Mayormente individual", score: 1 },
        { text: "Siempre individual", score: 1 },
      ],
      created_at: new Date().toISOString(),
    },
  ]

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      console.log("Intentando cargar preguntas desde Supabase...")
      const { data, error } = await supabase.from("questions").select("*").order("id")

      if (error) {
        console.error("Error fetching questions:", error)
        console.log("Usando preguntas por defecto...")
        setQuestions(defaultQuestions)
      } else if (data && data.length > 0) {
        console.log("Preguntas cargadas desde Supabase:", data.length)
        setQuestions(data)
      } else {
        console.log("No hay preguntas en la base de datos, usando preguntas por defecto...")
        setQuestions(defaultQuestions)
      }
    } catch (err) {
      console.error("Error de conexión:", err)
      console.log("Usando preguntas por defecto...")
      setQuestions(defaultQuestions)
    }
  }

  const handleStartQuiz = () => {
    if (email.trim() && name.trim() && lastname.trim() && company.trim()) {
      setCurrentScreen("quiz")
    }
  }

  const handleAnswerSelect = (optionIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex]
    const selectedOption = currentQuestion.options[optionIndex]

    const newAnswer = {
      questionId: currentQuestion.id,
      selectedOption: optionIndex,
      score: selectedOption.score,
    }

    const updatedAnswers = [...answers]
    updatedAnswers[currentQuestionIndex] = newAnswer
    setAnswers(updatedAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      submitQuiz()
    }
  }

  const submitQuiz = async () => {
    setLoading(true)
    const finalScore = answers.reduce((sum, answer) => sum + answer.score, 0)
    setTotalScore(finalScore)

    const { error } = await supabase.from("submissions").insert({
      email,
      name,
      lastname,
      company,
      total_score: finalScore,
      answers,
    })

    if (error) {
      console.error("Error submitting quiz:", error)
    }

    setLoading(false)
    setCurrentScreen("result")
  }

  const getResultMessage = (score: number) => {

    if (score <= 7) {
      return {
        title: "Tradicional",
        message: " Tu comunicación interna aún se apoya en canales tradicionales, sin integración ni personalización. ¡Es momento de dar un salto hacia la digitalización! Workvivo puede ayudarte a empezar.",
        icon: <Mail className="w-16 h-16 text-white" />,
        color: "text-white",
      }
    } else if (score > 7 && score <= 12) {
      return {
        title: "En evolución",
        message: "Ya están transitando el camino de la transformación digital. Tienen herramientas útiles, pero aún hay oportunidades para mejorar integración, IA y medición integrales de la matriz de Workvivo.",
        icon: <BarChart3 className="w-10 h-10 text-white" />,
        color: "text-yellow-600",
      }
    } else if (score > 12) {
      return {
        title: "Digital Champion",
        message: "¡Felicitaciones! Están a la vanguardia en CI digital. Integración, personalización y medición inteligente son parte de su día a día. Podrían ser caso de éxito ¿Te gustaría sumarte a un evento con nosotros?",
        icon: <Smartphone className="w-16 h-16 text-green-500" />,
        color: "text-green-600",
      }
    }
  }

  if (currentScreen === "presentation") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background effects */}
        <video src="/videoForm.mp4" autoPlay loop muted className="absolute inset-0 w-full h-full object-cover" />
        
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <div className="text-center space-y-8">
            {/* Logo/Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                </div>
              </div>
            </div>

            {/* Main title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-white to-indigo-400 bg-clip-text text-transparent">
                BW
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                Conoce tu plataforma ideal
              </h2>
              <p className="text-lg text-blue-200 max-w-2xl mx-auto leading-relaxed">
                Descubrí cual es la plataforma que más se adapta mejor a tu empresa
              </p>
            </div>

            {/* Features */}
           

            {/* CTA Button */}
            <div className="mt-12">
              <Button 
                onClick={() => setCurrentScreen("welcome")}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Conoce tu plataforma ideal
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">¡Formulario BW!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="text-center text-gray-600">
              <p className="text-lg">Descubrí cuál es la plataforma que más se adapta a vos</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 border-blue-200 focus:border-blue-500 rounded-lg p-3"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">Nombre</Label>
              <Input
                id="name"
                type="text"
                placeholder="Juan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-2 border-blue-200 focus:border-blue-500 rounded-lg p-3"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-gray-700 font-medium">Apellido</Label>
              <Input
                id="lastname"
                type="text"
                placeholder="Perez"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                className="border-2 border-blue-200 focus:border-blue-500 rounded-lg p-3"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-700 font-medium">Empresa</Label>
              <Input
                id="company"
                type="text"
                placeholder="Workvivo"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="border-2 border-blue-200 focus:border-blue-500 rounded-lg p-3"
              />
            </div>

            <Button 
              onClick={handleStartQuiz} 
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 py-3 rounded-lg font-semibold" 
              disabled={!email.trim() || !name.trim() || !lastname.trim() || !company.trim()}
            >
              Comenzar Quiz
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentScreen === "quiz") {
    const currentQuestion = questions[currentQuestionIndex]
    const currentAnswer = answers[currentQuestionIndex]

    if (!currentQuestion && questions.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Cargando preguntas...</p>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (!currentQuestion) {
      return <div>Cargando preguntas...</div>
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">
                Pregunta {currentQuestionIndex + 1} de {questions.length}
              </CardTitle>
              <div className="text-sm text-gray-500">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">{currentQuestion.question}</h2>

            <RadioGroup
              value={currentAnswer?.selectedOption?.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Button onClick={handleNextQuestion} disabled={currentAnswer === undefined || loading} className="w-full">
              {loading
                ? "Enviando..."
                : currentQuestionIndex === questions.length - 1
                  ? "Finalizar Quiz"
                  : "Siguiente Pregunta"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentScreen === "result") {
    const result = getResultMessage(totalScore)
    const maxScore = questions.length * 3
    const percentage = Math.round((totalScore / maxScore) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-indigo-600/20" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 w-full max-w-2xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardContent className="text-center space-y-8 p-12">
              {/* Success animation and icon */}
              <div className="relative">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-indigo-600 rounded-full blur opacity-60 animate-pulse"></div>
                    <div className="relative bg-gradient-to-tr from-blue-400 to-indigo-600 rounded-full p-6">
                      {result?.icon}
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-8">
                  <CheckCircle className="w-8 h-8 text-green-400 animate-bounce" />
                </div>
              </div>

              {/* Results title and message */}
              <div className="space-y-4">
                <h1 className={`text-4xl font-bold text-white`}>
                  {result?.title}
                </h1>
                <p className="text-xl text-blue-200 leading-relaxed max-w-lg mx-auto">
                  {result?.message}
                </p>
              </div>

              {/* Score display with circular progress */}
              <div className="space-y-6">
                <div className="relative mx-auto w-40 h-40">
                  {/* Circular progress background */}
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 144 144">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(percentage / 100) * 377} 377`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Score text in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {percentage}%
                      </div>
                      <div className="text-sm text-blue-200">
                        {totalScore}/{maxScore} pts
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-white font-semibold mb-4">Resumen de tu evaluación</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{questions.length}</div>
                      <div className="text-blue-200">Preguntas completadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-400">{totalScore}</div>
                      <div className="text-blue-200">Puntuación total</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setCurrentScreen("presentation")
                    setCurrentQuestionIndex(0)
                    setAnswers([])
                    setEmail("")
                    setName("")
                    setLastname("")
                    setCompany("")
                    setTotalScore(0)
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Realizar Nueva Evaluación
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
